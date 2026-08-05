import type { Character, GameContent } from "vn-content-schemas";
import type { EventBus } from "./eventBus";
import type { GameSystem, SystemContext } from "./types";

export class CharacterCodexSystem implements GameSystem {
  /** character_id → unlocked_at (ms) */
  state: Record<string, number> = {};
  private bus: EventBus;
  private content: GameContent;

  constructor(ctx: SystemContext) {
    this.bus = ctx.bus;
    this.content = ctx.content;
  }

  isUnlocked(id: string): boolean {
    return Boolean(this.state[id]);
  }

  /** Returns unlocked character id set — VNApp and GachaPage call this. */
  unlockedIds(): string[] {
    return Object.keys(this.state);
  }

  unlock(id: string, at: number = Date.now()): boolean {
    if (this.state[id]) return false;
    const ch = this.content.characters.find((c) => c.id === id);
    if (!ch) return false;
    this.state[id] = at;
    this.bus.emit("character.unlocked", { id, name: ch.name });
    return true;
  }

  /** Unlock all cast of a storyline when it is selected (or cleared). */
  unlockForStoryline(storylineProtagonist: string, cast: string[]): void {
    this.unlock(storylineProtagonist);
    for (const c of cast) this.unlock(c);
  }

  /** For CharacterDetailPage: returns character definition + unlocked flag. */
  listWithStatus(): Array<Character & { unlocked: boolean; unlocked_at?: number }> {
    return this.content.characters
      .slice()
      .sort((a, b) => a.dynasty_order - b.dynasty_order || a.order - b.order)
      .map((c) => ({
        ...c,
        unlocked: Boolean(this.state[c.id]),
        unlocked_at: this.state[c.id],
      }));
  }

  serialize(): Record<string, number> {
    return { ...this.state };
  }

  restore(raw: unknown): void {
    this.state = {};
    if (!raw || typeof raw !== "object") return;
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof v === "number") this.state[k] = v;
    }
  }

  reset(): void {
    this.state = {};
  }
}
