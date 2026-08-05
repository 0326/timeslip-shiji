import type { GameContent } from "vn-content-schemas";
import { EventBus } from "./eventBus";
import { StatisticsSystem } from "./statisticsSystem";
import { SettingsSystem } from "./settingsSystem";
import { AchievementSystem } from "./achievementSystem";
import { DeathCodexSystem } from "./deathCodexSystem";
import { CharacterCodexSystem } from "./characterCodexSystem";
import { GachaSystem } from "./gachaSystem";
import { SaveSystem, SLOT_COUNT } from "./saveSystem";
import { MinigameRegistry } from "./minigameRegistry";
import { AudioManager, type AudioEnv } from "./audioManager";
import type { PersistentAdapter, SystemContext } from "./types";

/** Storage adapter that uses window.localStorage in browser, in-memory otherwise. */
function defaultAdapter(): PersistentAdapter {
  const map = new Map<string, string>();
  // Use typeof check for SSR safety
  if (typeof globalThis !== "undefined" && (globalThis as { localStorage?: unknown }).localStorage) {
    const ls = (globalThis as { localStorage: Storage }).localStorage;
    return {
      getItem: (k) => ls.getItem(k),
      setItem: (k, v) => ls.setItem(k, v),
      removeItem: (k) => ls.removeItem(k),
    };
  }
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
  };
}

/** Last-played info returned by globalProgress() — VNApp Continue button uses this. */
export interface LastPlayedInfo {
  series_id: string;
  storyline_id: string;
  checkpoint_knot?: string;
  updated_at: number;
}

export interface GlobalProgressInfo {
  last_played: LastPlayedInfo | null;
  total_play_minutes: number;
  storyline_clears_count: number;
  achievement_unlocked_count: number;
  character_unlocked_count: number;
  death_unique_count: number;
}

/**
 * Create a GameSystems instance — factory function so callers don't need to know adapter details.
 * GameContext calls this. Returns the same shape as `new GameSystems(...)`.
 */
export function createGameSystems(
  content: GameContent,
  env?: { adapter?: PersistentAdapter; audioEnv?: AudioEnv }
): GameSystems {
  return new GameSystems(content, env);
}

/** Facade holding references to every game system. One instance per game boot. */
export class GameSystems {
  readonly bus: EventBus;
  readonly adapter: PersistentAdapter;
  readonly content: GameContent;

  readonly settings: SettingsSystem;
  readonly stats: StatisticsSystem;
  readonly achievements: AchievementSystem;
  readonly deathCodex: DeathCodexSystem;
  readonly characterCodex: CharacterCodexSystem;
  readonly gacha: GachaSystem;
  readonly save: SaveSystem;
  readonly minigames: MinigameRegistry;
  readonly audio: AudioManager;

  /** Last played tracker — persisted via SaveSystem.writeGlobal under key "last_played". */
  private _lastPlayed: LastPlayedInfo | null = null;

  constructor(content: GameContent, env?: { adapter?: PersistentAdapter; audioEnv?: AudioEnv }) {
    this.bus = new EventBus();
    this.adapter = env?.adapter ?? defaultAdapter();
    this.content = content;

    const ctx: SystemContext = { bus: this.bus, adapter: this.adapter, content: this.content };

    this.settings = new SettingsSystem(ctx);
    this.stats = new StatisticsSystem(ctx);
    this.achievements = new AchievementSystem(ctx);
    this.deathCodex = new DeathCodexSystem(ctx);
    this.characterCodex = new CharacterCodexSystem(ctx);
    this.gacha = new GachaSystem(ctx);
    this.save = new SaveSystem(ctx);
    this.minigames = new MinigameRegistry(ctx);
    this.audio = new AudioManager(
      ctx,
      env?.audioEnv ?? {},
      () => ({
        bgm: this.settings.effectiveBgmVolume(),
        se: this.settings.effectiveSeVolume(),
      })
    );

    // Wire systems into SaveSystem contributors
    this.save.registerContributor("settings", this.settings);
    this.save.registerContributor("achievements", this.achievements);
    this.save.registerContributor("death_codex", this.deathCodex);
    this.save.registerContributor("character_codex", this.characterCodex);
    this.save.registerContributor("gacha", this.gacha);
    this.save.registerContributor("stats", this.stats);

    // Achievement wire-ups (callers invoke notifyXxx — but some triggers
    // can be auto-fired from bus events):
    this.bus.on("death.triggered", (p) => this.achievements.notifyDeath(p.death_id, p.count));
    this.bus.on("stats.updated", (p) => {
      if (p.path.startsWith("clears.")) {
        const id = p.path.slice("clears.".length);
        this.achievements.notifyStorylineClear(id);
      }
    });

    // Track last_played from bus: whenever a storyline is cleared or saved, update _lastPlayed
    this.bus.on("save.saved", (p) => {
      const slot = this.save.readSlot(p.slot);
      if (slot?.storyline_id) {
        const series = content.storylines.find((s) => s.id === slot.storyline_id)?.series;
        if (series) {
          this._lastPlayed = {
            series_id: series,
            storyline_id: slot.storyline_id,
            updated_at: p.at,
          };
        }
      }
    });
  }

  /** Aggregate global progress info — MainMenu Continue / counters use this. */
  globalProgress(): GlobalProgressInfo {
    const clears = Object.keys(this.stats.state.storyline_clears).length;
    const achs = Object.keys(this.achievements.state).length;
    const chars = this.characterCodex.unlockedIds().length;
    const deaths = this.deathCodex.totalUnique();
    return {
      last_played: this._lastPlayed,
      total_play_minutes: this.stats.state.play_minutes,
      storyline_clears_count: clears,
      achievement_unlocked_count: achs,
      character_unlocked_count: chars,
      death_unique_count: deaths,
    };
  }

  /** Let runtime call this whenever user picks a new storyline to track "continue". */
  markLastPlayed(info: LastPlayedInfo): void {
    this._lastPlayed = info;
  }

  /** Restore all systems from global save. Returns true if restore happened. */
  loadGlobalProgress(): boolean {
    return this.save.restoreGlobal();
  }

  /** Persist all systems' progress into global storage (call when player leaves or on interval). */
  saveGlobalProgress(): ReturnType<SaveSystem["writeGlobal"]> {
    return this.save.writeGlobal();
  }

  /** Constant: 20 user slots + slot 0 autosave. */
  static SLOT_COUNT = SLOT_COUNT;
}
