import type { GameContent, Storyline } from "vn-content-schemas";

export interface PersistentAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** A single save-slot snapshot. Storyline ink state is stored inline as JSON. */
export interface SaveSlot {
  slot: number;
  storyline_id: string;
  storyline_title?: string;
  /** Ink story state JSON, from NarrativeRunner.checkpoint / exportState */
  ink_state: string;
  /** Image path / bg id for the slot thumbnail (optional) */
  thumbnail?: string;
  /** Current narrative segment excerpt (text preview) */
  excerpt?: string;
  /** System variable snapshot (reputation, flags, etc.) */
  variables: Record<string, unknown>;
  /** Unix ms */
  saved_at: number;
}

export interface DeathEntry {
  death_id: string;
  series_id: string;
  character_id: string;
  title: string;
  summary: string;
  /** 死亡原因详细描述（UI 展示） */
  reason?: string;
  /** 典籍原文引用（UI 展示，古典引号样式） */
  classical?: string;
  /** 史鉴分析（UI 展示，小字灰色） */
  analysis?: string;
  /** 稀有度 1-5 星 */
  rarity?: 1 | 2 | 3 | 4 | 5;
  /** 典籍原文说明（存档兼容） */
  classical_ref?: string;
  /** 史料来源 */
  source?: string;
  /** Ink knot.stitch to 跳回复活检查点（nullable = 回选择页） */
  checkpoint_path?: string | null;
  count: number;
  first_at: number;
  last_at: number;
}

export interface FigureEntry {
  id: string;
  /** 1-5 */
  rarity: 1 | 2 | 3 | 4 | 5;
  count: number;
}

export interface MemoryEntry {
  id: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  count: number;
}

export interface GachaState {
  /** 每日免费抽（按 day key 重置） */
  free_daily_pulls: number;
  free_last_reset_day: string;
  /** 付费抽累计货币 */
  premium_currency: number;
  figures: Record<string, FigureEntry>;
  memories: Record<string, MemoryEntry>;
  /** 保底计数器 — 每 N 抽必出 ≥4 星 */
  pity_counter: number;
  /** 4/5 星历史（用来在前端展示） */
  history: Array<{
    at: number;
    items: Array<{ kind: "figure" | "memory"; itemId: string; rarity: 1 | 2 | 3 | 4 | 5 }>;
  }>;
}

export interface StatisticsState {
  /** 累计阅读分钟（估算） */
  play_minutes: number;
  /** 点击推进对白次数 */
  dialogue_clicks: number;
  /** 做出的选择次数（排除读档重复） */
  choices_made: number;
  /** 死亡总次数 */
  total_deaths: number;
  /** 通关 storyline_id → Unix ms */
  storyline_clears: Record<string, number>;
  /** 全路径解锁（包含 BAD/TRUE END） — storyline_id → end tag */
  ends_seen: Record<string, string[]>;
}

export interface SettingsState {
  master_volume: number;   // 0..1
  bgm_volume: number;      // 0..1
  se_volume: number;       // 0..1
  voice_volume: number;    // 0..1
  auto_advance: boolean;
  auto_speed_ms: number;   // 单段对白自动速度（毫秒）
  auto_play_delay_sec: number; // 自动播放间隔（秒，兼容 SettingsDialog）
  read_speed_ms: number;   // 逐字显示 speed（毫秒/字）
  text_speed_ms: number;   // 逐字显示速度别名（兼容 SettingsDialog）
  textbox_style: "solid" | "paper" | "glass";
  theme: string;           // 对应 vn-ui-components preset id
  language: string;
  // 严格模式 = 正史模式强制（死亡不跳回，必须读档）
  strict_mode: boolean;
  strict_death: boolean;   // 别名，兼容 SettingsDialog
  // 经典原文默认展开/折叠
  classics_expanded: boolean;
  // 跳过已读
  skip_read: boolean;
  // 显示角色立绘
  show_sprites: boolean;
}

/** Interface each system implements for persistence/unload. */
export interface GameSystem {
  /** Serialize state to a plain JSON object. Return null = nothing to persist. */
  serialize(): unknown;
  /** Restore state from a previously serialized object. */
  restore(raw: unknown): void;
  /** Optional: reset to brand-new state (for new-game or tests). */
  reset?(): void;
}

/** Top-level persistent snapshot — used by SaveSystem.writeGlobal/readGlobal. */
export interface GlobalSave {
  schema: "vn-global/1";
  at: number;
  settings: SettingsState;
  achievements: Record<string, { unlocked_at: number }>;
  death_codex: Record<string, DeathEntry>;
  character_codex: Record<string, { unlocked_at: number }>;
  gacha: GachaState;
  stats: StatisticsState;
  slots: SaveSlot[];
}

/** Context injected into each system so they can emit events and access content. */
export interface SystemContext {
  bus: EventBus;
  adapter: PersistentAdapter;
  content: GameContent;
}

/** Defaults — reused by SettingsSystem and runtime init. */
export const DEFAULT_SETTINGS: SettingsState = {
  master_volume: 1,
  bgm_volume: 0.65,
  se_volume: 0.85,
  voice_volume: 1,
  auto_advance: false,
  auto_speed_ms: 2600,
  auto_play_delay_sec: 2.6,
  read_speed_ms: 32,
  text_speed_ms: 32,
  textbox_style: "paper",
  theme: "inkWash",
  language: "zh-CN",
  strict_mode: false,
  strict_death: false,
  classics_expanded: false,
  skip_read: false,
  show_sprites: true,
};

/** Check whether a storyline is unlocked given global progress and definition. */
export function isStorylineUnlocked(
  s: Storyline,
  ctx: { cleared: Set<string>; chars: Set<string>; deaths: Map<string, number> }
): boolean {
  const u = s.unlock;
  if (!u) return true;
  if (u.after_storyline && !ctx.cleared.has(u.after_storyline)) return false;
  if (u.require_character && !ctx.chars.has(u.require_character)) return false;
  if (u.require_death_count) {
    const got = ctx.deaths.get(u.require_death_count.death_id) ?? 0;
    if (got < u.require_death_count.count) return false;
  }
  return true;
}
