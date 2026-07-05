import type {
	Choice,
	EngineCallbacks,
	Story,
	StoryNode,
	StoryState,
	VarMutation,
	Vars,
} from "./types";
import type { IStoryRunner } from "./IStoryRunner";

/**
 * StoryRunner — 自研叙事引擎（Legacy）。
 * 实现 IStoryRunner 接口，与未来的 InkAdapter 可互换。
 *
 * 内置变量（下划线前缀，供成就/结算使用）：
 *   _choices  累计抉择数
 *   _correct  其中符合历史的次数
 *   _deaths   累计死亡数
 *   _nodes    已通过的抉择点数（进度）
 */
export class StoryRunner implements IStoryRunner {
	private story: Story;
	private vars: Vars;
	private currentNode: string;
	private cb: EngineCallbacks;
	private lastChoices: Choice[] = [];

	constructor(story: Story, cb: EngineCallbacks = {}) {
		this.story = story;
		this.cb = cb;
		this.vars = {
			...structuredCloneSafe(story.variables),
			_choices: 0,
			_correct: 0,
			_deaths: 0,
			_nodes: 0,
		};
		this.currentNode = story.start;
	}

	/** 推进：从当前节点出发，沿 goto 链收集对白，直到抉择/死亡/通关 */
	advance(): StoryState {
		const segments: StoryState["segments"] = [];
		let guard = 0;

		while (guard++ < 1000) {
			const node = this.story.nodes[this.currentNode];
			if (!node) {
				return this.finalState(segments, [], null, true);
			}

			// 执行节点内容
			this.runContent(node, segments);

			// 死亡节点
			if (node.death) {
				this.vars._deaths = (this.vars._deaths as number) + 1;
				const death = node.death;
				// 预置回跳点（重新选择）
				this.pendingDeathReturn = death.goto;
				return this.finalState(segments, [], {
					reason: death.reason,
					classical: death.classical,
					analysis: death.analysis,
				});
			}

			// 抉择节点
			if (node.choices && node.choices.length > 0) {
				this.lastChoices = node.choices;
				return this.finalState(
					segments,
					node.choices.map((c, i) => ({ index: i, text: c.text, hint: c.hint })),
					null,
				);
			}

			// 通关
			if (node.end) {
				return this.finalState(segments, [], null, true);
			}

			// 链式跳转
			if (node.goto) {
				this.currentNode = node.goto;
				continue;
			}

			// 无终止也无跳转 → 视为结束
			return this.finalState(segments, [], null, true);
		}

		return this.finalState(segments, [], null, true);
	}

	/** 做出选择 */
	choose(index: number): StoryState {
		const choice = this.lastChoices[index];
		if (!choice) return this.advance();

		this.vars._choices = (this.vars._choices as number) + 1;
		if (choice.correct) this.vars._correct = (this.vars._correct as number) + 1;
		if (choice.set) this.applyMutation(choice.set);

		this.lastChoices = [];
		this.currentNode = choice.goto;
		return this.advance();
	}

	/** 死亡后「重新选择」：回到抉择点 */
	retry(): StoryState {
		if (this.pendingDeathReturn) {
			this.currentNode = this.pendingDeathReturn;
			this.pendingDeathReturn = undefined;
		}
		return this.advance();
	}

	/** 从头开始 */
	restart(): void {
		this.vars = {
			...structuredCloneSafe(this.story.variables),
			_choices: 0,
			_correct: 0,
			_deaths: 0,
			_nodes: 0,
		};
		this.currentNode = this.story.start;
		this.lastChoices = [];
		this.pendingDeathReturn = undefined;
	}

	getVars(): Vars {
		return { ...this.vars };
	}

	/** 历史正确率（0—1） */
	getChoiceRate(): number {
		const total = this.vars._choices as number;
		return total > 0 ? (this.vars._correct as number) / total : 0;
	}

	getDeathCount(): number {
		return this.vars._deaths as number;
	}

	getCompletedNodes(): number {
		return this.vars._nodes as number;
	}

	// ── 存档 ──
	getSaveState(): string {
		return JSON.stringify({ vars: this.vars, node: this.currentNode });
	}

	loadSaveState(json: string): void {
		try {
			const data = JSON.parse(json) as { vars: Vars; node: string };
			if (data && data.vars && data.node) {
				this.vars = data.vars;
				this.currentNode = data.node;
			}
		} catch {
			// 损坏的存档：忽略，从头开始
		}
	}

	// ── 内部 ──
	private pendingDeathReturn?: string;

	private runContent(node: StoryNode, segments: StoryState["segments"]): void {
		if (!node.content) return;
		// 通过抉择/继续后计入一个节点（粗略进度）
		if (node.choices && node.choices.length > 0) {
			this.vars._nodes = (this.vars._nodes as number) + 1;
		}
		for (const item of node.content) {
			if ("say" in item) {
				segments.push({
					text: item.say,
					speaker: item.speaker ?? "",
					hint: item.hint,
				});
			} else if ("bg" in item) {
				this.cb.onBackground?.(item.bg);
			} else if ("show" in item) {
				this.cb.onShowCharacter?.(
					item.show.id,
					item.show.expr ?? "default",
					item.show.pos ?? "center",
				);
			} else if ("hide" in item) {
				this.cb.onHideCharacter?.(item.hide);
			} else if ("bgm" in item) {
				this.cb.onBGM?.(item.bgm);
			} else if ("set" in item) {
				this.applyMutation(item.set);
			} else if ("achieve" in item) {
				if (!item.when || item.when(this.vars)) {
					this.cb.onAchievement?.(item.achieve);
				}
			}
		}
	}

	private applyMutation(m: VarMutation): void {
		for (const [k, v] of Object.entries(m)) {
			if (typeof v === "object" && v !== null && "inc" in v) {
				const cur = typeof this.vars[k] === "number" ? (this.vars[k] as number) : 0;
				this.vars[k] = cur + v.inc;
			} else {
				this.vars[k] = v;
			}
		}
	}

	private finalState(
		segments: StoryState["segments"],
		choices: StoryState["choices"],
		death: StoryState["death"],
		ended = false,
	): StoryState {
		// 当前可展开的原文提示 = 最近一句带 hint 的对白
		let hint: string | undefined;
		for (let i = segments.length - 1; i >= 0; i--) {
			if (segments[i].hint) {
				hint = segments[i].hint;
				break;
			}
		}
		return {
			nodeId: this.currentNode,
			segments,
			choices,
			death,
			ended,
			hint,
			vars: { ...this.vars },
		};
	}
}

function structuredCloneSafe<T>(v: T): T {
	return JSON.parse(JSON.stringify(v)) as T;
}
