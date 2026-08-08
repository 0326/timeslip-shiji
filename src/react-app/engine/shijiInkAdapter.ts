// ShijiInkAdapter — Adapts ink-vn-core's InkRunner (domain-agnostic) to the
// app's IStoryRunner interface, adding Shiji-specific semantics:
//   - Choice/death statistics (_choices, _correct, _deaths, _nodes)
//   - Death registry (deathId → reason/classical/analysis)
//   - Achievement firing via onAchievement callback
//   - Retry-after-death (snapshots choice points)
//   - Save/load that combines ink snapshot + app-level stats

import { InkRunner } from "ink-vn-core";
import type {
	InkRunnerOptions,
	RunnerChoice,
	RunnerOutput,
	StageCallbacks as InkStageCallbacks,
} from "ink-vn-core";
import type { IStoryRunner } from "./IStoryRunner";
import type {
	EngineCallbacks,
	StoryChoice,
	StorySegment,
	StoryState,
	Vars,
} from "./types";
import { bgmMatcher } from "../lib/bgmMatcher";

/** Death registry entry: maps a deathId (from #death:ID tag) to full death info */
export interface DeathEntry {
	reason: string;
	classical: string;
	analysis: string;
}

/** Ending registry entry: maps an endingId (from #ending:ID tag) to display info */
export interface EndingEntry {
	/** 结局名（通关屏大标题，如「乌江完人」「江东再起」） */
	title: string;
	/** canon = 史实终局；if = 自由模式开放结局（历史的歧路） */
	kind: "canon" | "if";
	/** 判词/结语：一句余味收束（通关屏引用展示） */
	epigraph?: string;
}

/** Impact registry entry: maps an impactId (from #impact:ID tag) to display info */
export interface ImpactEntry {
	/** 此刻抉择：玩家做出的关键选择描述（卡片上区块一） */
	choice: string;
	/** 史记原文：对应的史书引用（卡片上区块二） */
	source: string;
	/** 历史影响：该选择对后世的意义（卡片上区块三） */
	impact: string;
}

/**
 * Configuration for an ink-backed story.
 */
export interface InkStoryConfig {
	/** Unique story key */
	key: string;
	/** Story title */
	title: string;
	/** Ink source code (.ink text) or pre-compiled JSON.
	 *  动态加载时为空，由 loadInkSource() 在运行时填充。 */
	source?: string;
	/** Ink 文件路径（相对于 ink/ 目录，不含 .ink 后缀）。
	 *  用于按需加载源码，避免 2.3MB ink 文本内联进主包。 */
	inkFile?: string;
	/** If true, source is pre-compiled JSON; default false (compile at runtime) */
	precompiled?: boolean;
	/** Initial ink variables (VAR declarations in ink take precedence; this is for extra vars) */
	initialVars?: Record<string, number | boolean | string>;
	/** Death registry: maps deathId → DeathEntry (reason/classical/analysis) */
	deaths: Record<string, DeathEntry>;
	/** Ending registry: maps endingId → EndingEntry（#ending:ID 的文案单一数据源） */
	endings?: Record<string, EndingEntry>;
	/** Impact registry: maps impactId → ImpactEntry（#impact:ID 的文案单一数据源） */
	impacts?: Record<string, ImpactEntry>;
}

/** Adapter behaviour options (mode-dependent game rules). */
export interface AdapterOptions {
	/**
	 * 正史模式（strict）：任何未标 #correct 的选项，若其分支不会自然走到 #death
	 * （即"选错还能继续"的存活支/反事实结局支），选中即判定"偏离正史"失败。
	 * 已写好 #death 的错误分支照常播放（保留死亡文案的史识价值）。
	 * 自由模式（strict=false）：保持全部分支与多结局。
	 */
	strict?: boolean;
}

/** Fisher-Yates 原地洗牌：打乱选项展示顺序（各项保留其 ink 原始 index）。 */
function shuffleChoices(choices: StoryChoice[]): void {
	for (let i = choices.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[choices[i], choices[j]] = [choices[j], choices[i]];
	}
}

/** 正史模式通用失败文案（选中存活型非史实选项时使用） */
const STRICT_DEATH_REASON = "此路偏离正史——史书里的他，没有走这一步";
const STRICT_DEATH_ANALYSIS =
	"呐——正史模式里，每一步都要踩在史册上。这个选择，历史没有给它下文……回到抉择处，找一找史书里真正发生的那一步吧。我等你呀。";

/**
 * ShijiInkAdapter wraps InkRunner and implements IStoryRunner.
 *
 * Usage convention for ink authors:
 *   - #bg:ID, #show:ID[:EXPR][:POS], #hide:ID, #bgm:ID   → stage effects (fired immediately)
 *   - #speaker:NAME                                       → sets speaker on segment
 *   - #hint:TEXT                                          → hint text (shown in UI)
 *   - #correct                                            → marks a choice as historically correct
 *   - #death:ID                                           → triggers death state (ID looks up in deaths registry)
 *   - #achieve:ID                                         → fires onAchievement callback
 *   - #impact:ID                                          → displays historical impact card (looks up in impacts registry)
 *   - Choice tags go BEFORE the choice text:  * #correct [Choice text] -> target
 */
export class ShijiInkAdapter implements IStoryRunner {
	private runner: InkRunner;
	private config: InkStoryConfig;
	private cb: EngineCallbacks;

	// App-level statistics (not part of ink's narrative state)
	private vars: Vars;

	// Snapshot at the latest choice point. Used for retry-after-death.
	private lastChoiceSnapshot: string | null = null;

	// 正史模式开关（见 AdapterOptions.strict）
	private strict: boolean;
	// 前瞻探测中（抑制舞台回调与统计，避免探测分支的副作用泄漏到 UI）
	private probing = false;
	// 最近一次呈现给玩家的选项（含 meta，用于严格模式判定与失败文案）
	private lastChoices: RunnerChoice[] = [];

	// 幕计数：遇到 #actclear 时递增
	private actIndex = 0;
	// 最近一次触发的幕间过场信息（buildState 消费后即清）
	private pendingActClear: { actName: string; actIndex: number } | null = null;
	// 本次结局是否是史实结局（带 #achieve）
	private endingAchievement?: string;
	// 本次结局的 #ending:ID（结局注册表键）
	private endingId?: string;
	// 自由模式下，死亡分支转为假想结局时携带的死亡信息（用于生成结局标题/题词）
	private deathAsEnding?: { id?: string; reason: string; classical: string; analysis: string } | null;
	// 最近一次触发的小游戏（buildState 消费后即清）
	private pendingMinigame: { id: string; param?: string } | null = null;
	// 手动触发的小游戏标记（从学练测收面板触发，完成后不推进叙事）
	private manualMinigame = false;
	// 最近一次触发的历史影响卡片（buildState 消费后即清）
	private pendingImpact: { choice: string; source: string; impact: string } | null = null;

	constructor(config: InkStoryConfig, cb: EngineCallbacks = {}, opts: AdapterOptions = {}) {
		this.config = config;
		this.cb = cb;
		this.strict = opts.strict ?? false;

		// Initialize stats
		this.vars = {
			_choices: 0,
			_correct: 0,
			_deaths: 0,
			_nodes: 0,
		};

		// Apply extra initial vars
		if (config.initialVars) {
			for (const [k, v] of Object.entries(config.initialVars)) {
				if (typeof v === "number" || typeof v === "boolean") {
					this.vars[k] = v;
				}
			}
		}

		// Build ink stage callbacks that bridge to EngineCallbacks.
		// probing 期间（严格模式前瞻探测）全部静默，防止探测分支污染舞台与统计。
		const inkCallbacks: InkStageCallbacks = {
			onBackground: (bg) => {
			if (this.probing) return;
			this.cb.onBackground?.(bg);
			// 场景切换时立即播放该场景的BGM
			const sceneTrackId = bgmMatcher.setScene(bg);
			if (sceneTrackId) {
				this.cb.onBGM?.(sceneTrackId);
			}
		},
			onShowCharacter: (id, expr, pos) => {
				if (this.probing) return;
				this.cb.onShowCharacter?.(id, expr ?? "default", pos);
			},
			onHideCharacter: (id) => {
				if (this.probing) return;
				this.cb.onHideCharacter?.(id);
			},
			onBGM: (track) => {
			if (this.probing) return;
			this.cb.onBGM?.(track);
		},
			onChoice: (choice, _index) => {
				if (this.probing) return;
				this.vars._choices = (this.vars._choices as number) + 1;
				if (choice.meta.correct) {
					this.vars._correct = (this.vars._correct as number) + 1;
				}
			},
		};

		// Create the underlying ink runner
		const runnerOptions: InkRunnerOptions = {
			source: config.source ?? "",
			precompiled: config.precompiled,
			callbacks: inkCallbacks,
		};

		this.runner = new InkRunner(runnerOptions);

		// Sync initial ink variables to our vars
		this.syncInkVarsToStats();
	}

	/** Advance dialogue until the next choice / death / end. */
	advance(): StoryState {
		const output = this.runner.advance();

		this.resetPerTurnState();
		this.consumeSegmentMeta(output);

		// Count a completed node when we hit choices (like legacy runner)
		if (output.choices.length > 0) {
			this.vars._nodes = (this.vars._nodes as number) + 1;
			// Save choice point snapshot for retry-after-death
			this.lastChoiceSnapshot = this.runner.snapshot();
			this.lastChoices = output.choices;
		}

		// Build death info if this is a death state
		let death: StoryState["death"] = null;
		let ended = output.state === "ended";
		if (output.state === "death" && output.deathId) {
			this.vars._deaths = (this.vars._deaths as number) + 1;
			// 自由模式：死亡分支当作假想结局，不显示死亡页面
			if (!this.strict) {
				ended = true;
				this.endingId = output.deathId;
				this.deathAsEnding = this.buildDeath(output.deathId);
			} else {
				death = this.buildDeath(output.deathId);
			}
		}

		return this.buildState(output, death, ended);
	}

	/** Select a choice by index and advance. */
	choose(index: number): StoryState {
		// ── 正史模式拦截 ──
		// 选中未标 #correct 的选项（且同组存在 #correct 项）时，前瞻探测该分支：
		//   · 分支自然走到 #death → 放行，播放作者写好的死亡文案（史识价值保留）
		//   · 分支存活（到达下一抉择点）或直达非死亡结局（反事实/多结局支）→ 判"偏离正史"失败
		if (this.strict && this.lastChoices.length > 0) {
			const chosen = this.lastChoices[index];
			const hasCorrectSibling = this.lastChoices.some((c) => c.meta.correct === true);
			if (chosen && hasCorrectSibling && chosen.meta.correct !== true) {
				if (this.probeSurvives(index)) {
					return this.strictFail(chosen);
				}
			}
		}

		const output = this.runner.choose(index);

		this.resetPerTurnState();
		this.consumeSegmentMeta(output);

		// Count node completion
		if (output.choices.length > 0) {
			this.vars._nodes = (this.vars._nodes as number) + 1;
			// Save choice point snapshot for retry-after-death
			this.lastChoiceSnapshot = this.runner.snapshot();
			this.lastChoices = output.choices;
		}

		let death: StoryState["death"] = null;
		let ended = output.state === "ended";
		if (output.state === "death" && output.deathId) {
			this.vars._deaths = (this.vars._deaths as number) + 1;
			// 自由模式：死亡分支当作假想结局，不显示死亡页面
			if (!this.strict) {
				ended = true;
				this.endingId = output.deathId;
				this.deathAsEnding = this.buildDeath(output.deathId);
			} else {
				death = this.buildDeath(output.deathId);
			}
		}

		return this.buildState(output, death, ended);
	}

	/**
	 * 小游戏完成回调：写入 mg_result/mg_score 后继续推进叙事。
	 * 探测分支期间不会调用此方法（completeMinigame 仅由 UI 在玩家实际操作后触发）。
	 */
	completeMinigame(result: "win" | "lose" | "skip", score?: number): StoryState {
		// 手动触发的小游戏：完成后不推进叙事，直接回到当前对话
		if (this.manualMinigame) {
			this.manualMinigame = false;
			this.pendingMinigame = null;
			// 重建当前对话状态（无小游戏、无推进）
			return this.buildState({ state: "text", segments: [], choices: [], deathId: undefined }, null, false);
		}
		// ink 标签触发的小游戏：写入 ink 变量，继续推进叙事
		this.runner.setVar("mg_result", result);
		this.runner.setVar("mg_score", Math.max(0, Math.min(100, Math.round(score ?? (result === "win" ? 100 : 0)))));
		this.pendingMinigame = null;
		return this.advance();
	}

	/**
	 * 手动触发小游戏（从学练测收面板等 UI 触发）
	 * 与 ink 标签触发的区别：不写入 ink 变量，直接返回小游戏状态
	 */
	triggerMinigame(gameId: string, param?: string): StoryState {
		this.pendingMinigame = { id: gameId, param };
		this.manualMinigame = true;
		return this.buildState({ state: "text", segments: [], choices: [], deathId: undefined }, null, false);
	}

	/**
	 * 前瞻探测：静默模拟选中第 index 项后分支的走向，之后完全还原。
	 * @returns true = 该分支存活（未触发 #death 即到达下一抉择点/结局）
	 */
	private probeSurvives(index: number): boolean {
		const snap = this.runner.snapshot();
		this.probing = true;
		let survives: boolean;
		try {
			let out = this.runner.choose(index);
			// 推进直到终态（ended/death），遇到中间 choice 时自动选第一项继续探测。
			// 这样可以判断探索型选项的最终走向，而不是停在中间抉择点导致误拦截。
			let guard = 0;
			while (guard++ < 500) {
				if (out.state === "text") {
					out = this.runner.advance();
					continue;
				}
				if (out.state === "choice" && out.choices.length > 0) {
					out = this.runner.choose(0);
					continue;
				}
				break;
			}
			// 只有分支自然走到 #death 才放行（保留作者写好的死亡文案史识价值）；
			// 直达非死亡结局（ended/反事实结局）或停在抉择点 → 判"偏离正史"失败
			survives = out.state !== "death";
		} catch {
			// 探测异常时保守放行（按原分支走）
			survives = false;
		} finally {
			this.probing = false;
			this.runner.restore(snap);
		}
		return survives;
	}

	/** 正史模式失败：合成一次"偏离正史"死亡（不推进叙事，retry 回到本抉择点）。 */
	private strictFail(chosen: RunnerChoice): StoryState {
		this.vars._choices = (this.vars._choices as number) + 1;
		this.vars._deaths = (this.vars._deaths as number) + 1;
		const classical = typeof chosen.meta.hint === "string" ? chosen.meta.hint : "";
		return {
			nodeId: "death:strict",
			segments: [],
			choices: [],
			death: {
				id: "strict",
				reason: STRICT_DEATH_REASON,
				classical,
				analysis: STRICT_DEATH_ANALYSIS,
			},
			ended: false,
			hint: classical || undefined,
			vars: { ...this.vars },
		};
	}

	/** Retry after death: restore to the last choice point. */
	retry(): StoryState {
		if (this.lastChoiceSnapshot) {
			this.runner.restore(this.lastChoiceSnapshot);
		}
		return this.advance();
	}

	/**
	 * 回到上一个抉择点（不推进剧情），用于玩家看完某选项下文后想尝试其他选项。
	 * 恢复 lastChoiceSnapshot 后直接收集选项，不调用 advance（不计数、不覆盖快照）。
	 */
	revertToChoicePoint(): StoryState | null {
		if (!this.lastChoiceSnapshot) return null;
		this.runner.restore(this.lastChoiceSnapshot);
		// 恢复后重新收集选项（不推进），用于构建抉择点状态
		const choices = this.runner.getCurrentChoices();
		if (choices.length === 0) return null;
		// 同步 lastChoices，供下次 choose 使用
		this.lastChoices = choices;
		// 构建一个无文本的抉择点状态
		const output: RunnerOutput = { state: "choice", segments: [], choices, deathId: undefined };
		return this.buildState(output, null, false);
	}

	/** Restart the story from the beginning. */
	restart(): void {
		this.vars = {
			_choices: 0,
			_correct: 0,
			_deaths: 0,
			_nodes: 0,
		};
		if (this.config.initialVars) {
			for (const [k, v] of Object.entries(this.config.initialVars)) {
				if (typeof v === "number" || typeof v === "boolean") {
					this.vars[k] = v;
				}
			}
		}
		this.runner.restart();
		this.lastChoiceSnapshot = null;
		this.lastChoices = [];
		this.actIndex = 0;
		this.pendingActClear = null;
		this.pendingMinigame = null;
		this.pendingImpact = null;
		this.endingAchievement = undefined;
		this.endingId = undefined;
		this.syncInkVarsToStats();
	}

	/** Get all current variables (stats + synced ink numeric/bool vars). */
	getVars(): Vars {
		this.syncInkVarsToStats();
		return { ...this.vars };
	}

	/** Get the correct-choice rate (0–1). */
	getChoiceRate(): number {
		const total = this.vars._choices as number;
		return total > 0 ? (this.vars._correct as number) / total : 0;
	}

	/** Get cumulative death count. */
	getDeathCount(): number {
		return this.vars._deaths as number;
	}

	/** Get number of completed choice nodes. */
	getCompletedNodes(): number {
		return this.vars._nodes as number;
	}

	/** Serialize full state for save (checkpoint snapshot + app stats). */
	getSaveState(): string {
		return JSON.stringify({
			// Save checkpoint (paragraph start) so loadSaveState + advance() replays content
			inkSnapshot: this.runner.getCheckpoint(),
			vars: this.vars,
			lastChoiceSnapshot: this.lastChoiceSnapshot,
		});
	}

	/** Restore from a save state string. */
	loadSaveState(json: string): void {
		try {
			const data = JSON.parse(json) as {
				inkSnapshot: string;
				vars: Vars;
				lastChoiceSnapshot: string | null;
			};
			if (data && data.inkSnapshot) {
				// Restore to checkpoint (paragraph start) — advance() will replay the paragraph
				this.runner.restore(data.inkSnapshot);
				this.vars = data.vars;
				this.lastChoiceSnapshot = data.lastChoiceSnapshot ?? null;
			}
		} catch {
			// Corrupted save: ignore, start from beginning
			this.restart();
		}
	}

	// ── Internal helpers ──

	/** 清空"每轮消费"的瞬态标记（结局/幕卡/小游戏）。每次 advance/choose 开头调用。 */
	private resetPerTurnState(): void {
		this.endingAchievement = undefined;
		this.endingId = undefined;
		this.deathAsEnding = null;
		this.pendingActClear = null;
		this.pendingMinigame = null;
		this.manualMinigame = false;
		this.pendingImpact = null;
	}

	/**
	 * 扫描本轮 output 的 segments 上的 meta 标签，触发回调并缓存瞬态事件：
	 *   - #actclear:幕名      → 幕间过场
	 *   - #achieve:id         → 成就回调；ended 时记为结局成就
	 *   - #ending:id          → 具名结局 id（仅 ended 时生效）
	 *   - #minigame:id[:param] → 触发小游戏挂起（探测模式下自动跳过）
	 */
	private consumeSegmentMeta(output: RunnerOutput): void {
		for (const seg of output.segments) {
			if (seg.meta.actclear && typeof seg.meta.actclear === "string") {
				this.actIndex += 1;
				this.pendingActClear = { actName: seg.meta.actclear, actIndex: this.actIndex };
			}
			if (seg.meta.achieve && typeof seg.meta.achieve === "string") {
				if (!this.probing) this.cb.onAchievement?.(seg.meta.achieve);
				if (output.state === "ended") {
					this.endingAchievement = seg.meta.achieve;
				}
			}
			if (seg.meta.ending && typeof seg.meta.ending === "string" && output.state === "ended") {
				this.endingId = seg.meta.ending;
			}
			if (seg.meta.minigame && typeof seg.meta.minigame === "string") {
				if (this.probing) {
					// 严格模式前瞻探测时：假设小游戏获胜，写回 win 并让探测继续
					this.runner.setVar("mg_result", "win");
					this.runner.setVar("mg_score", 100);
					continue;
				}
				const raw = seg.meta.minigame;
				const colon = raw.indexOf(":");
				if (colon === -1) {
					this.pendingMinigame = { id: raw };
				} else {
					this.pendingMinigame = { id: raw.slice(0, colon), param: raw.slice(colon + 1) };
				}
			}
			if (seg.meta.impact && typeof seg.meta.impact === "string" && !this.probing) {
				const impactId = seg.meta.impact;
				const entry = this.config.impacts?.[impactId];
				if (entry) {
					this.pendingImpact = { choice: entry.choice, source: entry.source, impact: entry.impact };
				}
				// 同步触发史识碎片解锁（即使 impacts 注册表未配置也回调，允许 data/knowledge 单独维护碎片）
				this.cb.onUnlockKnowledge?.(impactId);
			}
			if (seg.meta.quiz && typeof seg.meta.quiz === "string" && !this.probing) {
				// 章末测验占位：直接解锁对应 quiz_ 史识碎片（后续可扩展为弹出测验 UI）
				this.cb.onUnlockKnowledge?.(seg.meta.quiz);
			}
		}
	}

	/**
	 * Sync numeric and boolean ink variables into the vars record.
	 * String variables are not synced (Vars only supports number | boolean).
	 */
	private syncInkVarsToStats(): void {
		// inkjs doesn't expose a way to enumerate all variables, so we rely on:
		// 1. initialVars from config
		// 2. Variables set via setVar (which updates both ink and this.vars)
		// For now, this is a no-op placeholder for future variable reflection.
	}

	/**
	 * Build death info from the registry (single source of truth).
	 * Ink authors write only #death:ID; reason/classical/analysis live in config.deaths.
	 */
	private buildDeath(deathId: string): StoryState["death"] {
		const entry = this.config.deaths[deathId];
		return {
			id: deathId,
			reason: entry?.reason ?? deathId,
			classical: entry?.classical ?? "",
			analysis: entry?.analysis ?? "",
		};
	}

	/** Convert ink RunnerOutput to app StoryState. */
	private buildState(
		output: RunnerOutput,
		death: StoryState["death"],
		ended: boolean,
	): StoryState {
		// Convert segments: keep meta-only segments (e.g. #actclear) for app to consume,
		// but filter them out for UI rendering by leaving text empty.
		const segments: StorySegment[] = output.segments.map((s) => ({
			text: s.text,
			speaker: s.speaker ?? "",
			hint: typeof s.meta.hint === "string" ? s.meta.hint : undefined,
		}));

		// Convert choices (index is assigned by position, matching c._index)
		const choices: StoryChoice[] = output.choices.map((c: RunnerChoice, i: number) => ({
			index: i,
			text: c.text,
			hint: typeof c.meta.hint === "string" ? c.meta.hint : undefined,
		}));
		// 打乱展示顺序：避免"正确答案永远排第一个"被玩家看穿。
		// 每个 StoryChoice 保留其原始 ink 索引(index)，choose(index) 仍映射回正确分支，
		// 故打乱纯属展示层，不影响正史判定/死亡探测。
		shuffleChoices(choices);

		// Find the latest hint from segments for the top-level hint field
		let hint: string | undefined;
		for (let i = segments.length - 1; i >= 0; i--) {
			if (segments[i].hint) {
				hint = segments[i].hint;
				break;
			}
		}

		const actClear = this.pendingActClear ?? undefined;
		this.pendingActClear = null;

		const minigame = this.pendingMinigame ?? undefined;
		const impact = this.pendingImpact ?? undefined;

		let ending: StoryState["ending"];
		if (ended) {
			const id = this.endingId;
			if (id) {
				const entry = this.config.endings?.[id];
				// 自由模式下死亡分支转结局：用 death 信息生成标题与题词
				if (this.deathAsEnding && !entry) {
					const d = this.deathAsEnding;
					ending = {
						id,
						title: d.reason || "历史的歧路",
						kind: "if",
						epigraph: d.classical ? `「${d.classical}」${d.analysis ? "　" + d.analysis : ""}` : d.analysis,
					};
				} else {
					ending = {
						id,
						title: entry?.title ?? "",
						kind: entry?.kind ?? (id === "canon" || this.endingAchievement ? "canon" : "if"),
						epigraph: entry?.epigraph,
					};
				}
			} else if (this.endingAchievement) {
				ending = { id: "canon", title: "", kind: "canon" };
			}
		}

		for (const seg of output.segments) {
			if (seg.text && !this.probing) {
				const match = bgmMatcher.match(seg.text, seg.speaker);
				if (match) {
					const trackId = bgmMatcher.switchTo(match.mood, match.strong);
					if (trackId) {
						this.cb.onBGM?.(trackId);
					}
				}
			}
		}

		return {
			nodeId: this.currentNodeId(output),
			segments,
			choices,
			death,
			ended,
			hint,
			vars: { ...this.vars },
			endingAchievement: ended ? this.endingAchievement : undefined,
			ending,
			actClear,
			minigame,
			impact,
		};
	}

	/**
	 * Derive a human-readable nodeId from the output state.
	 * ink doesn't expose current path easily, so we synthesize one based on state.
	 */
	private currentNodeId(output: RunnerOutput): string {
		if (output.state === "death") return `death:${output.deathId ?? "unknown"}`;
		if (output.state === "ended") return "ending";
		if (output.choices.length > 0) return `choice_${output.choices.length}`;
		return "text";
	}
}
