// Tiny typed EventBus. Each system emits domain events; UI subscribes to render toasts/overlays.
// Usage: bus.emit("achievement.unlocked", { id: "foo", name: "bar" })
//        bus.on("achievement.unlocked", (p) => renderToast(p))

export type EventHandler<P = unknown> = (payload: P) => void;
export type Unsubscribe = () => void;

export interface EventMap {
  // AchievementSystem
  "achievement.unlocked": { id: string; name: string; rarity?: number };
  // SaveSystem
  "save.saved": { slot: number; at: number };
  "save.loaded": { slot: number; at: number };
  "save.deleted": { slot: number };
  // DeathCodexSystem
  "death.triggered": {
    death_id: string;
    title: string;
    summary: string;
    count: number;
    checkpoint_path: string | null;
  };
  // CharacterCodexSystem
  "character.unlocked": { id: string; name: string };
  // GachaSystem
  "gacha.pulled": {
    id: string;
    banner_id?: string;
    items: Array<{ kind: "figure" | "memory"; itemId: string; rarity: 1 | 2 | 3 | 4 | 5 }>;
    new_characters?: string[];
    freePullsRemaining: number;
  };
  // MinigameSystem
  "minigame.completed": { id: string; result: unknown; score?: number };
  // StatisticsSystem
  "stats.updated": { path: string; value: number };
  "classics.unlocked": { id: string };
  // SettingsSystem
  "settings.changed": { key: string; value: unknown };
  "settings.patched": { patch: Partial<import("./types").SettingsState> };
  "settings.dialog.opened": Record<string, never>;
  "settings.dialog.closed": Record<string, never>;
  // Allow arbitrary payload for extensibility inside downstream projects
  [k: string]: unknown;
}

export class EventBus {
  private handlers = new Map<string, Set<EventHandler<unknown>>>();

  on<K extends keyof EventMap>(type: K, handler: EventHandler<EventMap[K]>): Unsubscribe {
    const key = String(type);
    if (!this.handlers.has(key)) this.handlers.set(key, new Set());
    const set = this.handlers.get(key)!;
    set.add(handler as EventHandler<unknown>);
    return () => set.delete(handler as EventHandler<unknown>);
  }

  emit<K extends keyof EventMap>(type: K, payload: EventMap[K]): void {
    const key = String(type);
    const set = this.handlers.get(key);
    if (!set) return;
    // Iterate over a snapshot to allow unsubscribing during emit
    [...set].forEach((h) => {
      try {
        h(payload);
      } catch (err) {
        // Swallow handler errors — bus must not break the main game loop
        // eslint-disable-next-line no-console
        console.error(`[EventBus] handler for ${key} threw:`, err);
      }
    });
  }

  /** Remove all listeners (primarily for tests / HMR). */
  clear(): void {
    this.handlers.clear();
  }
}
