import type { EventBus } from "./eventBus";
import type { GameSystem, StatisticsState, SystemContext } from "./types";

const DEFAULT_STATS: StatisticsState = {
  play_minutes: 0,
  dialogue_clicks: 0,
  choices_made: 0,
  total_deaths: 0,
  storyline_clears: {},
  ends_seen: {},
};

export class StatisticsSystem implements GameSystem {
  state: StatisticsState = { ...DEFAULT_STATS, storyline_clears: {}, ends_seen: {} };
  /** Classics chapter ids unlocked via read events. */
  private _classicsUnlocked: Set<string> = new Set();
  private bus: EventBus;

  constructor(ctx: SystemContext) {
    this.bus = ctx.bus;
  }

  addPlayMinutes(min: number): void {
    if (min <= 0) return;
    this.state.play_minutes = Math.round((this.state.play_minutes + min) * 100) / 100;
    this.emit("play_minutes", this.state.play_minutes);
  }

  tickDialogueClick(): void {
    this.state.dialogue_clicks += 1;
    this.emit("dialogue_clicks", this.state.dialogue_clicks);
  }

  tickChoiceMade(): void {
    this.state.choices_made += 1;
    this.emit("choices_made", this.state.choices_made);
  }

  tickDeath(): void {
    this.state.total_deaths += 1;
    this.emit("total_deaths", this.state.total_deaths);
  }

  markStorylineCleared(storylineId: string, at = Date.now()): void {
    if (this.state.storyline_clears[storylineId]) return;
    this.state.storyline_clears[storylineId] = at;
    this.emit(`clears.${storylineId}`, at);
  }

  /** Alias — VNApp calls markStorylineCompleted. */
  markStorylineCompleted(storylineId: string, finalPath?: string, at = Date.now()): void {
    if (finalPath) this.markEndSeen(storylineId, finalPath);
    this.markStorylineCleared(storylineId, at);
  }

  isCleared(storylineId: string): boolean {
    return Boolean(this.state.storyline_clears[storylineId]);
  }

  markEndSeen(storylineId: string, endTag: string): void {
    const arr = this.state.ends_seen[storylineId] ?? (this.state.ends_seen[storylineId] = []);
    if (arr.includes(endTag)) return;
    arr.push(endTag);
  }

  /** Classics chapter unlock tracking — returns the ids set. */
  classicsUnlocked(): string[] {
    return Array.from(this._classicsUnlocked);
  }
  markClassicRead(chapterId: string): boolean {
    if (this._classicsUnlocked.has(chapterId)) return false;
    this._classicsUnlocked.add(chapterId);
    this.bus.emit("classics.unlocked", { id: chapterId });
    return true;
  }

  private emit(path: string, value: number): void {
    this.bus.emit("stats.updated", { path, value });
  }

  serialize(): StatisticsState & { classics_unlocked: string[] } {
    return {
      ...this.state,
      storyline_clears: { ...this.state.storyline_clears },
      ends_seen: Object.fromEntries(
        Object.entries(this.state.ends_seen).map(([k, v]) => [k, [...v]])
      ),
      classics_unlocked: Array.from(this._classicsUnlocked),
    };
  }

  restore(raw: unknown): void {
    if (!raw || typeof raw !== "object") {
      this.reset();
      return;
    }
    const r = raw as Partial<StatisticsState> & { classics_unlocked?: string[] };
    this.state = {
      ...DEFAULT_STATS,
      ...r,
      storyline_clears: { ...(r.storyline_clears ?? {}) },
      ends_seen: Object.fromEntries(
        Object.entries(r.ends_seen ?? {}).map(([k, v]) => [k, Array.isArray(v) ? [...v] : []])
      ),
    };
    this._classicsUnlocked = new Set(r.classics_unlocked ?? []);
  }

  reset(): void {
    this.state = { ...DEFAULT_STATS, storyline_clears: {}, ends_seen: {} };
    this._classicsUnlocked = new Set();
  }
}
