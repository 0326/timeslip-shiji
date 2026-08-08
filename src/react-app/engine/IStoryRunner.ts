// IStoryRunner — app-side unified interface for story runners.
// This is the contract that both the legacy StoryRunner and the new Ink-backed
// adapter must satisfy. UI components (VNEngine, etc.) consume
// StoryState produced by runners implementing this interface.

import type { StoryState, Vars } from "./types";

export interface IStoryRunner {
	/** Advance dialogue to the next choice / death / end point. */
	advance(): StoryState;
	/** Select a choice by index and advance. */
	choose(index: number): StoryState;
	/** Retry after death (restore to the last choice point). */
	retry(): StoryState;
	/**
	 * 回到上一个抉择点（不推进剧情），用于玩家看完某选项下文后想尝试其他选项。
	 * 与 retry() 的区别：retry 会调用 advance() 推进；revert 直接停在抉择点。
	 * 返回的 StoryState 仅含 choices，无 segments。
	 * 若没有可恢复的抉择点快照，返回 null。
	 */
	revertToChoicePoint(): StoryState | null;
	/** Restart the story from the beginning. */
	restart(): void;
	/** Get all current variables. */
	getVars(): Vars;
	/** Get the correct-choice rate (0–1). */
	getChoiceRate(): number;
	/** Get cumulative death count. */
	getDeathCount(): number;
	/** Get number of completed choice nodes. */
	getCompletedNodes(): number;
	/** Serialize full state for save. */
	getSaveState(): string;
	/** Restore from a save state string. */
	loadSaveState(json: string): void;
	/**
	 * 小游戏完成回调：把 mg_result/mg_score 写回 ink 变量并继续推进叙事。
	 * 玩家在 GameHost 内完成（或跳过）小游戏后由 UI 调用。
	 */
	completeMinigame(result: "win" | "lose" | "skip", score?: number): StoryState;
	/**
	 * 手动触发小游戏（从学练测收面板等 UI 触发）
	 * 与 ink 标签触发的区别：不写入 ink 变量，直接返回小游戏状态
	 */
	triggerMinigame?(gameId: string, param?: string): StoryState;
}

