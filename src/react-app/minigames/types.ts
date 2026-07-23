import type { ComponentType } from "react";

/**
 * minigame 协议：
 *   ink 行首 `#minigame:<id>[:param]` 触发
 *   GameHost 挂载对应的 GameComponent
 *   完成后调用 onComplete({ result, score })
 *   Host 把 mg_result/mg_score 写回 ink VAR 并推进叙事
 */

export type MinigameResult = "win" | "lose" | "skip";

export interface MinigameOutcome {
	result: MinigameResult;
	/** 0-100 可选分数；若游戏无评分概念，win=100 / lose=0 / skip=0 */
	score?: number;
}

export interface MinigameProps {
	/** ink 标签里 `#minigame:id:xxx` 冒号后的参数串，例如关卡号 `klotski_hongmen:2` */
	param?: string;
	/** 当前故事的 storyKey (charId:seriesId)，便于做角色/系列皮肤 */
	storyKey?: string;
	/** 游戏结束回调，必须调用一次 */
	onComplete: (outcome: MinigameOutcome) => void;
	/** 用户主动跳过 */
	onSkip: () => void;
}

export type MinigameMode = "free" | "canon" | "strict";

export interface MinigameMeta {
	/** 中文标题，例 "鸿门脱险" */
	title: string;
	/** 史识一句，展示在开场卡上 */
	historyNote: string;
	/** 难度 1-3 */
	difficulty: 1 | 2 | 3;
	/** 允许在哪些游戏模式下触发 */
	modes: MinigameMode[];
}

export interface MinigameEntry {
	id: string;
	Component: ComponentType<MinigameProps>;
	meta: MinigameMeta;
}
