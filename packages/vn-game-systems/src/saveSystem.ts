import type { EventBus } from "./eventBus";
import type { GameSystem, GlobalSave, PersistentAdapter, SaveSlot, SystemContext } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const GLOBAL_KEY = "vn.global.save.v1";
const SLOT_KEY = (n: number) => `vn.slot.${n}.save.v1`;
export const SLOT_COUNT = 20;

/**
 * SaveSystem: 20 manual slots + 1 autosave slot (index 0).
 * Persists to PersistentAdapter (window.localStorage in browser, memory in tests).
 *
 * Cross-cutting concern: writeGlobal / readGlobal serializes all other systems'
 * state via a callback map so we don't depend on them directly.
 */
export class SaveSystem implements GameSystem {
  private adapter: PersistentAdapter;
  private bus: EventBus;
  /** Called by writeGlobal() to gather serializable state of each named system. */
  private contributors = new Map<string, () => unknown>();
  /** Called by readGlobal() to restore state into each named system. */
  private restorers = new Map<string, (raw: unknown) => void>();

  constructor(ctx: SystemContext) {
    this.adapter = ctx.adapter;
    this.bus = ctx.bus;
  }

  registerContributor(name: keyof Omit<GlobalSave, "schema" | "at" | "slots">, sys: GameSystem): void {
    this.contributors.set(name, () => sys.serialize());
    this.restorers.set(name, (raw) => sys.restore(raw));
  }

  // -------- slots --------
  writeSlot(slot: number, data: Omit<SaveSlot, "slot" | "saved_at">): SaveSlot {
    const slotData: SaveSlot = { ...data, slot, saved_at: Date.now() };
    this.adapter.setItem(SLOT_KEY(slot), JSON.stringify(slotData));
    this.bus.emit("save.saved", { slot, at: slotData.saved_at });
    return slotData;
  }

  readSlot(slot: number): SaveSlot | null {
    const raw = this.adapter.getItem(SLOT_KEY(slot));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SaveSlot;
    } catch {
      return null;
    }
  }

  deleteSlot(slot: number): void {
    this.adapter.removeItem(SLOT_KEY(slot));
    this.bus.emit("save.deleted", { slot });
  }

  listSlots(): (SaveSlot | null)[] {
    const arr: (SaveSlot | null)[] = [];
    for (let i = 0; i < SLOT_COUNT; i++) arr.push(this.readSlot(i));
    return arr;
  }

  /** Convenience: slot 0 = autosave. */
  writeAutoSave(data: Omit<SaveSlot, "slot" | "saved_at">): SaveSlot {
    return this.writeSlot(0, data);
  }

  // -------- global progress --------
  writeGlobal(): GlobalSave {
    const snapshot: GlobalSave = {
      schema: "vn-global/1",
      at: Date.now(),
      settings: pick(this.contributors.get("settings"), DEFAULT_SETTINGS) as GlobalSave["settings"],
      achievements: pickObj(this.contributors.get("achievements")) as GlobalSave["achievements"],
      death_codex: pickObj(this.contributors.get("death_codex")) as GlobalSave["death_codex"],
      character_codex: pickObj(this.contributors.get("character_codex")) as GlobalSave["character_codex"],
      gacha: pickObj(this.contributors.get("gacha")) as GlobalSave["gacha"],
      stats: pickObj(this.contributors.get("stats")) as GlobalSave["stats"],
      slots: this.listSlots().filter((s): s is SaveSlot => s !== null),
    };
    this.adapter.setItem(GLOBAL_KEY, JSON.stringify(snapshot));
    return snapshot;
  }

  readGlobal(): GlobalSave | null {
    const raw = this.adapter.getItem(GLOBAL_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GlobalSave;
    } catch {
      return null;
    }
  }

  /** Apply global progress back into all registered systems. */
  restoreGlobal(): boolean {
    const g = this.readGlobal();
    if (!g) return false;
    (this.restorers.get("settings") ?? noop)(g.settings);
    (this.restorers.get("achievements") ?? noop)(g.achievements);
    (this.restorers.get("death_codex") ?? noop)(g.death_codex);
    (this.restorers.get("character_codex") ?? noop)(g.character_codex);
    (this.restorers.get("gacha") ?? noop)(g.gacha);
    (this.restorers.get("stats") ?? noop)(g.stats);
    return true;
  }

  /** Delete all global + slot data (wipe everything except registered system in-memory state). */
  wipeAll(): void {
    for (let i = 0; i < SLOT_COUNT; i++) this.deleteSlot(i);
    this.adapter.removeItem(GLOBAL_KEY);
  }

  // -------- GameSystem interface (SaveSystem doesn't persist itself to contributors — it IS the persist layer) --------
  serialize(): null { return null; }
  restore(_: unknown): void { /* no-op */ }

  reset(): void {
    this.wipeAll();
  }
}

function pick(fn: undefined | (() => unknown), fallback: unknown): unknown {
  if (!fn) return fallback;
  try {
    return fn() ?? fallback;
  } catch {
    return fallback;
  }
}
function pickObj(fn: undefined | (() => unknown)): Record<string, unknown> {
  const v = fn ? fn() : undefined;
  return v && typeof v === "object" ? (v as Record<string, unknown>) : {};
}
function noop(_: unknown): void { /* no-op */ }
