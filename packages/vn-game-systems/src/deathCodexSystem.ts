import type { EventBus } from "./eventBus";
import type { DeathEntry, GameSystem, SystemContext } from "./types";

export interface DeathDefinition {
  death_id: string;
  series_id: string;
  character_id: string;
  title: string;
  summary: string;
  reason?: string;
  classical?: string;
  analysis?: string;
  rarity?: 1 | 2 | 3 | 4 | 5;
  classical_ref?: string;
  source?: string;
  checkpoint_path?: string | null;
}

/**
 * Death codex + resurrection.
 *
 * Ink trigger: call runner.variablesState["__death"] = "id" or a dedicated tag.
 * Runtime: when narrative advances, if state.includes death_id → call DeathCodexSystem.trigger().
 */
export class DeathCodexSystem implements GameSystem {
  entries: Record<string, DeathEntry> = {};
  private bus: EventBus;
  /** In-memory definition map — populated at runtime from content file (or register()). */
  private definitions = new Map<string, DeathDefinition>();

  constructor(ctx: SystemContext) {
    this.bus = ctx.bus;
  }

  register(def: DeathDefinition): void {
    this.definitions.set(def.death_id, def);
  }

  registerMany(defs: DeathDefinition[]): void {
    for (const d of defs) this.register(d);
  }

  getDefinition(id: string): DeathDefinition | undefined {
    return this.definitions.get(id);
  }

  /** Returns the aggregated codex (for UI). */
  all(): DeathEntry[] {
    return Object.values(this.entries).sort((a, b) => b.last_at - a.last_at);
  }

  /** Alias — VNApp calls allEntries(). */
  allEntries(): DeathEntry[] {
    return this.all();
  }

  /** Returns unlocked death ids — DeathCodexPage and VNApp call this. */
  unlockedIds(): string[] {
    return Object.keys(this.entries);
  }

  count(id: string): number {
    return this.entries[id]?.count ?? 0;
  }

  totalUnique(): number {
    return Object.keys(this.entries).length;
  }

  totalDeaths(): number {
    return Object.values(this.entries).reduce((sum, e) => sum + e.count, 0);
  }

  /**
   * Trigger a death. Resolves checkpoint path to return:
   * - knot.stitch string → runtime NarrativeRunner.gotoKnot() there
   * - null → back to StorySelector (game loop broken)
   */
  trigger(
    id: string,
    at: number = Date.now()
  ): { entry: DeathEntry; checkpoint_path: string | null } {
    const def = this.definitions.get(id);
    if (!def) {
      // Fallback: register a generic one so UI never crashes
      this.register({
        death_id: id,
        series_id: "unknown",
        character_id: "unknown",
        title: id,
        summary: "（无名结局）",
        checkpoint_path: null,
      });
      return this.trigger(id, at);
    }
    const existing = this.entries[id];
    if (existing) {
      existing.count += 1;
      existing.last_at = at;
    } else {
      this.entries[id] = {
        death_id: id,
        series_id: def.series_id,
        character_id: def.character_id,
        title: def.title,
        summary: def.summary,
        reason: def.reason,
        classical: def.classical,
        analysis: def.analysis,
        rarity: def.rarity,
        classical_ref: def.classical_ref,
        source: def.source,
        checkpoint_path: def.checkpoint_path ?? null,
        count: 1,
        first_at: at,
        last_at: at,
      };
    }
    const entry = this.entries[id];
    this.bus.emit("death.triggered", {
      death_id: id,
      title: def.title,
      summary: def.summary,
      count: entry.count,
      checkpoint_path: def.checkpoint_path ?? null,
    });
    return { entry, checkpoint_path: def.checkpoint_path ?? null };
  }

  serialize(): Record<string, DeathEntry> {
    return Object.fromEntries(
      Object.entries(this.entries).map(([k, v]) => [k, { ...v }])
    );
  }

  restore(raw: unknown): void {
    this.entries = {};
    if (!raw || typeof raw !== "object") return;
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (!v || typeof v !== "object") continue;
      const src = v as DeathEntry & Record<string, unknown>;
      if (typeof src.count !== "number") continue;
      this.entries[k] = {
        death_id: k,
        series_id: String(src.series_id ?? "unknown"),
        character_id: String(src.character_id ?? "unknown"),
        title: String(src.title ?? k),
        summary: String(src.summary ?? ""),
        reason: typeof src.reason === "string" ? src.reason : undefined,
        classical: typeof src.classical === "string" ? src.classical : undefined,
        analysis: typeof src.analysis === "string" ? src.analysis : undefined,
        rarity: (typeof src.rarity === "number" && src.rarity >= 1 && src.rarity <= 5) ? src.rarity as 1 | 2 | 3 | 4 | 5 : undefined,
        classical_ref: typeof src.classical_ref === "string" ? src.classical_ref : undefined,
        source: typeof src.source === "string" ? src.source : undefined,
        checkpoint_path:
          src.checkpoint_path === null ? null : typeof src.checkpoint_path === "string" ? src.checkpoint_path : null,
        count: src.count,
        first_at: typeof src.first_at === "number" ? src.first_at : Date.now(),
        last_at: typeof src.last_at === "number" ? src.last_at : Date.now(),
      };
    }
  }

  reset(): void {
    this.entries = {};
  }
}
