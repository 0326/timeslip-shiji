import type { Minigame, GameContent } from "vn-content-schemas";
import type { EventBus } from "./eventBus";
import type { SystemContext } from "./types";

/**
 * MinigameRegistry.
 *
 * Coupling rule: the registry itself is framework-agnostic — it only holds
 * descriptors + validation helpers. The actual component rendering happens in
 * vn-ui-components (component:string → React.Component map).
 */
export class MinigameRegistry {
  private byId = new Map<string, Minigame>();
  private bus: EventBus;

  constructor(ctx: SystemContext) {
    this.bus = ctx.bus;
    for (const m of ctx.content.minigames) this.byId.set(m.id, m);
  }

  register(m: Minigame): void {
    this.byId.set(m.id, m);
  }

  get(id: string): Minigame | undefined {
    return this.byId.get(id);
  }

  list(): Minigame[] {
    return [...this.byId.values()];
  }

  /**
   * Validate raw params string from ink tag (e.g. "difficulty=hard,rounds=5")
   * against the declared param schemas. Returns a plain object (or empty).
   */
  parseParams(id: string, raw: string | undefined): Record<string, unknown> {
    const def = this.get(id);
    if (!def || !raw) return {};
    const out: Record<string, unknown> = {};
    const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      const eq = part.indexOf("=");
      if (eq < 0) continue;
      const key = part.slice(0, eq);
      const value = part.slice(eq + 1);
      const pDef = def.params.find((p) => p.key === key);
      if (!pDef) continue; // ignore unknown keys silently
      switch (pDef.type) {
        case "number": {
          const n = Number(value);
          if (!Number.isNaN(n)) out[key] = n;
          break;
        }
        case "boolean":
          out[key] = /^(1|true|yes|on)$/i.test(value);
          break;
        case "enum":
          if (pDef.enum_values?.includes(value)) out[key] = value;
          break;
        case "string":
        default:
          out[key] = value;
      }
    }
    // fill defaults
    for (const p of def.params) {
      if (!(p.key in out) && p.default !== undefined) out[p.key] = p.default;
    }
    return out;
  }

  markCompleted(id: string, result: unknown, score?: number): void {
    this.bus.emit("minigame.completed", { id, result, score });
  }
}
