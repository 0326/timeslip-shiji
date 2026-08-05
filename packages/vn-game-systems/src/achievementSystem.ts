import type { GameContent, Achievement, AchievementTrigger, AchievementProgress } from "vn-content-schemas";
import type { EventBus } from "./eventBus";
import type { GameSystem, SystemContext } from "./types";

export interface AchProgress {
  unlocked_at: number;
}

export class AchievementSystem implements GameSystem {
  state: Record<string, AchProgress> = {};
  private bus: EventBus;
  private content: GameContent;

  constructor(ctx: SystemContext) {
    this.bus = ctx.bus;
    this.content = ctx.content;
  }

  isUnlocked(id: string): boolean {
    return Boolean(this.state[id]);
  }

  listAll(): Array<Achievement & { unlocked: boolean; unlocked_at?: number }> {
    return this.content.achievements.map((a) => {
      const p = this.state[a.id];
      return { ...a, unlocked: Boolean(p), unlocked_at: p?.unlocked_at };
    });
  }

  private tryUnlock(ach: Achievement, at = Date.now()): boolean {
    if (this.state[ach.id]) return false;
    this.state[ach.id] = { unlocked_at: at };
    this.bus.emit("achievement.unlocked", {
      id: ach.id,
      name: ach.name,
      rarity: ach.rarity,
    });
    return true;
  }

  unlockManual(id: string): boolean {
    const ach = this.content.achievements.find((a) => a.id === id);
    if (!ach) return false;
    return this.tryUnlock(ach);
  }

  /** Returns aggregate progress shape (unlocked_ids + unlocked_at map) — AchievementsPage uses this. */
  progress(): AchievementProgress {
    const ids = Object.keys(this.state);
    const atMap: Record<string, number> = {};
    for (const id of ids) atMap[id] = this.state[id].unlocked_at;
    return { unlocked_ids: ids, unlocked_at: atMap };
  }

  /** Call on storyline clear. */
  notifyStorylineClear(storylineId: string): void {
    this.sweepForTrigger({ kind: "storyline_clear", storyline_id: storylineId });
  }

  /** Call on death codex increment. */
  notifyDeath(deathId: string, count: number): void {
    this.sweepFor((t) =>
      t.kind === "death" && t.death_id === deathId && count >= (t.times ?? 1)
    );
  }

  /** Call when a choice with a particular tag is picked. */
  notifyChoiceTag(tag: string, count: number): void {
    this.sweepFor((t) =>
      t.kind === "choice_tag" && t.tag === tag && count >= (t.count ?? 1)
    );
  }

  /** Call when a numeric variable changes (caller provides name+value). */
  notifyVariable(name: string, value: number): void {
    this.sweepFor((t) => t.kind === "variable_gte" && t.name === name && value >= t.value);
  }

  private sweepFor(pred: (t: AchievementTrigger) => boolean): void {
    for (const ach of this.content.achievements) {
      if (this.state[ach.id]) continue;
      if (pred(ach.trigger)) this.tryUnlock(ach);
    }
  }

  private sweepForTrigger(t: AchievementTrigger): void {
    for (const ach of this.content.achievements) {
      if (this.state[ach.id]) continue;
      if (triggersEqual(ach.trigger, t)) this.tryUnlock(ach);
    }
  }

  serialize(): Record<string, AchProgress> {
    return { ...this.state };
  }

  restore(raw: unknown): void {
    this.state = {};
    if (!raw || typeof raw !== "object") return;
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (v && typeof v === "object") {
        const at = (v as { unlocked_at?: number }).unlocked_at;
        if (typeof at === "number") this.state[k] = { unlocked_at: at };
      }
    }
  }

  reset(): void {
    this.state = {};
  }
}

function triggersEqual(a: AchievementTrigger, b: AchievementTrigger): boolean {
  if (a.kind !== b.kind) return false;
  switch (a.kind) {
    case "storyline_clear":
      return a.kind === b.kind && a.storyline_id === b.storyline_id;
    case "death":
      return a.kind === b.kind && a.death_id === b.death_id;
    case "choice_tag":
      return a.kind === b.kind && a.tag === b.tag;
    case "variable_gte":
      return a.kind === b.kind && a.name === b.name;
    case "manual":
      return a.kind === b.kind && a.id === b.id;
  }
}
