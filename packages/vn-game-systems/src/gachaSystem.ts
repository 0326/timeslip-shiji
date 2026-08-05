import type { Character, GameContent, GachaBanner, GachaPullResult, GachaPulledItem } from "vn-content-schemas";
import type { EventBus } from "./eventBus";
import type { FigureEntry, GachaState, GameSystem, MemoryEntry, SystemContext } from "./types";

const DEFAULT: GachaState = {
  free_daily_pulls: 1,
  free_last_reset_day: "",
  premium_currency: 0,
  figures: {},
  memories: {},
  pity_counter: 0,
  history: [],
};

export interface MemoryDefinition {
  id: string;
  name: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  /** asset URL/path */
  art?: string;
}

/**
 * GachaSystem: figure (角色卡) + memory (追忆卡) pull — banner-based.
 * Historical VN rule: ALL pulls FREE. No real-money path.
 *   - Daily free pulls = 1 (reset by day key)
 *   - Plus premium_currency earned from storyline clears (capped)
 *   - Banners are defined in content.gacha_banners and tracked per-banner
 */
export class GachaSystem implements GameSystem {
  state: GachaState & {
    banners: Record<string, { pity_counter: number; total_pulls: number }>;
    tickets: number;
    currency: number;
  };
  private bus: EventBus;
  private content: GameContent;
  private memoriesDef: MemoryDefinition[] = [];

  constructor(ctx: SystemContext) {
    this.bus = ctx.bus;
    this.content = ctx.content;
    // Initialize banner state from content definitions
    const bannersInit: Record<string, { pity_counter: number; total_pulls: number }> = {};
    for (const b of this.content.gacha_banners ?? []) {
      bannersInit[b.id] = {
        pity_counter: b.pity_counter ?? 0,
        total_pulls: b.total_pulls ?? 0,
      };
    }
    this.state = {
      ...DEFAULT,
      figures: {},
      memories: {},
      history: [],
      banners: bannersInit,
      tickets: 10, // 初始赠送10张抽卡券
      currency: 0,
    };
  }

  registerMemories(defs: MemoryDefinition[]): void {
    this.memoriesDef = defs;
  }

  /** Banner list — merges content definition with runtime state. */
  get banners(): GachaBanner[] {
    const defs = this.content.gacha_banners ?? [];
    return defs
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((d) => ({
        ...d,
        pity_counter: this.state.banners[d.id]?.pity_counter ?? d.pity_counter ?? 0,
        total_pulls: this.state.banners[d.id]?.total_pulls ?? d.total_pulls ?? 0,
      }));
  }

  /** Add premium currency when player clears a storyline (reward). */
  grantPremium(amount: number): void {
    this.state.premium_currency = Math.max(0, this.state.premium_currency + amount);
    this.state.currency = this.state.premium_currency;
  }

  grantTickets(amount: number): void {
    this.state.tickets = Math.max(0, this.state.tickets + amount);
  }

  canPull(bannerId: string, count = 1, type: "ticket" | "free" | "premium" = "ticket"): boolean {
    this.ensureDailyReset();
    const banner = this._getBannerDef(bannerId);
    if (!banner) return false;
    switch (type) {
      case "free":
        return this.state.free_daily_pulls >= count;
      case "ticket":
        return this.state.tickets >= count;
      case "premium":
        return this.state.premium_currency >= count * 100;
    }
  }

  /**
   * Pull count times on the given banner.
   * Primary API used by VNApp / GachaPage. Returns GachaPullResult or null if insufficient.
   */
  pull(bannerId: string, count: 1 | 10 = 1): GachaPullResult | null {
    this.ensureDailyReset();
    const banner = this._getBannerDef(bannerId);
    if (!banner) return null;

    // Priority: free → ticket → premium
    let resourceType: "free" | "ticket" | "premium" = "ticket";
    let cost = 0;
    if (this.canPull(bannerId, count, "free")) resourceType = "free";
    else if (this.canPull(bannerId, count, "ticket")) resourceType = "ticket";
    else if (this.canPull(bannerId, count, "premium")) resourceType = "premium";
    else return null;

    // Pre-snapshot owned figure ids for "new_characters" diff
    const preOwned = new Set(Object.keys(this.state.figures));

    // Commit resources
    if (resourceType === "free") this.state.free_daily_pulls -= count;
    else if (resourceType === "ticket") this.state.tickets -= count;
    else {
      cost = count * 100;
      this.state.premium_currency -= cost;
      this.state.currency = this.state.premium_currency;
    }

    // Initialize banner state slot
    if (!this.state.banners[bannerId]) this.state.banners[bannerId] = { pity_counter: 0, total_pulls: 0 };
    const bs = this.state.banners[bannerId];

    const upSet = new Set(banner.up_characters ?? []);
    const items: GachaPulledItem[] = [];

    for (let i = 0; i < count; i++) {
      const isLast = i === count - 1;
      const applyPity = isLast && bs.pity_counter >= (banner.pity_threshold ?? 90) - 1;
      const roll = this.rollOne(applyPity, upSet);
      items.push(roll);
      // Track pity
      if (roll.rarity >= 4) bs.pity_counter = 0;
      else bs.pity_counter += 1;
      // Commit to owned collection
      if (roll.kind === "figure") {
        const cur = this.state.figures[roll.character_id];
        if (cur) cur.count += 1;
        else this.state.figures[roll.character_id] = { id: roll.character_id, rarity: roll.rarity, count: 1 };
      } else if (roll.memory_id) {
        const cur = this.state.memories[roll.memory_id];
        if (cur) cur.count += 1;
        else this.state.memories[roll.memory_id] = { id: roll.memory_id, rarity: roll.rarity, count: 1 };
      }
    }

    bs.total_pulls += count;

    // Post-diff: newly unlocked character ids
    const newChars: string[] = [];
    for (const it of items) {
      if (it.kind === "figure" && !preOwned.has(it.character_id) && !newChars.includes(it.character_id)) {
        newChars.push(it.character_id);
      }
    }

    this.state.history.unshift({ at: Date.now(), items: items.map((i) => ({ kind: i.kind, itemId: i.kind === "figure" ? i.character_id : i.memory_id ?? "?", rarity: i.rarity })) });
    this.state.history = this.state.history.slice(0, 200);

    const result: GachaPullResult = {
      banner_id: bannerId,
      items,
      new_characters: newChars,
      free_pulls_remaining: this.state.free_daily_pulls,
    };

    this.bus.emit("gacha.pulled", {
      id: `pull_${Date.now()}`,
      banner_id: bannerId,
      items,
      new_characters: newChars,
      freePullsRemaining: this.state.free_daily_pulls,
    });

    return result;
  }

  ownedFigure(id: string): FigureEntry | undefined {
    return this.state.figures[id];
  }

  ownedMemory(id: string): MemoryEntry | undefined {
    return this.state.memories[id];
  }

  listOwnedFigures(): Array<Character & { owned: boolean; count: number; rarity: 1 | 2 | 3 | 4 | 5 }> {
    return this.content.characters.map((c) => {
      const f = this.state.figures[c.id];
      const rarity = rarityFromOrder(c.dynasty_order || c.order, this.content.characters.length);
      return { ...c, owned: Boolean(f), count: f?.count ?? 0, rarity: f?.rarity ?? rarity };
    });
  }

  // -------- internals --------
  private _getBannerDef(id: string): GachaBanner | undefined {
    return this.content.gacha_banners?.find((b) => b.id === id);
  }

  private ensureDailyReset(): void {
    const day = new Date().toISOString().slice(0, 10);
    if (this.state.free_last_reset_day !== day) {
      this.state.free_last_reset_day = day;
      this.state.free_daily_pulls = 1;
    }
  }

  private rollOne(applyPity: boolean, upIds: Set<string>): GachaPulledItem {
    let rarity: 1 | 2 | 3 | 4 | 5;
    if (applyPity) {
      rarity = Math.random() < 0.1 ? 5 : 4;
    } else {
      const r = Math.random();
      if (r < 0.05) rarity = 5;
      else if (r < 0.20) rarity = 4;
      else if (r < 0.60) rarity = 3;
      else if (r < 0.85) rarity = 2;
      else rarity = 1;
    }

    // 70% figure, 30% memory
    const kind: "figure" | "memory" = Math.random() < 0.7 ? "figure" : "memory";
    if (kind === "figure") {
      // UP pool first: 50% of matching rarity goes to UP chars
      const upPooled = Array.from(upIds)
        .map((id) => this.content.characters.find((c) => c.id === id))
        .filter((c): c is Character => Boolean(c));
      let pool: Character[] = [];
      if (upPooled.length && (rarity >= 4 ? Math.random() < 0.5 : rarity <= 3 ? Math.random() < 0.25 : false)) {
        pool = upPooled;
      }
      if (pool.length === 0) {
        pool = this.content.characters.filter((c) =>
          rarityMatches(rarityFromOrder(c.dynasty_order || c.order, this.content.characters.length), rarity)
        );
      }
      const pick = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : this.content.characters[Math.floor(Math.random() * this.content.characters.length)];
      return {
        kind: "figure",
        character_id: pick?.id ?? "unknown",
        rarity,
      };
    }
    const memPool = this.memoriesDef.filter((m) => rarityMatches(m.rarity, rarity));
    const pick = memPool.length
      ? memPool[Math.floor(Math.random() * memPool.length)]
      : this.memoriesDef[Math.floor(Math.random() * this.memoriesDef.length)] ?? { id: `memory_r${rarity}`, rarity };
    return {
      kind: "memory",
      character_id: "",
      memory_id: pick.id,
      rarity: pick.rarity,
    };
  }

  serialize(): typeof this.state {
    return {
      ...this.state,
      figures: { ...this.state.figures },
      memories: { ...this.state.memories },
      history: this.state.history.map((h) => ({ ...h, items: [...h.items] })),
      banners: { ...this.state.banners },
    };
  }

  restore(raw: unknown): void {
    if (!raw || typeof raw !== "object") {
      this.reset();
      return;
    }
    const r = raw as Partial<typeof this.state>;
    this.state = {
      ...DEFAULT,
      ...r,
      figures: { ...(r.figures ?? {}) },
      memories: { ...(r.memories ?? {}) },
      history: Array.isArray(r.history) ? [...r.history] : [],
      banners: { ...(r.banners ?? this.state.banners) },
      tickets: typeof r.tickets === "number" ? r.tickets : 10,
      currency: typeof r.currency === "number" ? r.currency : (r.premium_currency ?? 0),
    };
  }

  reset(): void {
    const bannersInit: Record<string, { pity_counter: number; total_pulls: number }> = {};
    for (const b of this.content.gacha_banners ?? []) {
      bannersInit[b.id] = { pity_counter: b.pity_counter ?? 0, total_pulls: b.total_pulls ?? 0 };
    }
    this.state = {
      ...DEFAULT,
      figures: {},
      memories: {},
      history: [],
      banners: bannersInit,
      tickets: 10,
      currency: 0,
    };
  }
}

function rarityFromOrder(order: number, total: number): 1 | 2 | 3 | 4 | 5 {
  if (total <= 1) return 3;
  const pct = (order - 1) / Math.max(1, total - 1);
  if (pct <= 0.05) return 5;
  if (pct <= 0.20) return 4;
  if (pct <= 0.50) return 3;
  if (pct <= 0.80) return 2;
  return 1;
}
function rarityMatches(a: number, b: number): boolean {
  return Math.abs(a - b) <= 1;
}
