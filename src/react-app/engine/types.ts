// 叙事剧本格式与引擎状态类型
// 与文档 InkRunner 接口对齐：segments / choices / death / variables / 成就外部触发。
// 自研引擎，便于将来无缝替换为 inkjs（引擎边界一致）。

export type VarValue = number | boolean;
/** 变量变更：直接赋值，或 { inc } 自增 */
export type VarMutation = Record<string, VarValue | { inc: number }>;

export type Position = "left" | "center" | "right";

/** 节点内按序执行的内容项 */
export type ContentItem =
	| { say: string; speaker?: string; hint?: string } // 一句对白（携带说话人与原文提示）
	| { bg: string } // 切换背景
	| { show: { id: string; expr?: string; pos?: Position } } // 显示立绘
	| { hide: string } // 隐藏立绘
	| { bgm: string } // 播放 BGM
	| { set: VarMutation } // 变更变量
	| { achieve: string; when?: (v: Vars) => boolean }; // 触发成就（可带条件）

export interface Choice {
	text: string;
	goto: string;
	set?: VarMutation;
	correct?: boolean; // 是否为符合历史的选择
	hint?: string; // 该抉择的原文提示
}

export interface DeathInfo {
	reason: string;
	classical: string;
	analysis: string;
	goto: string; // 「重新选择」返回的节点
}

export interface StoryNode {
	content?: ContentItem[];
	// 终止方式（互斥，按此优先级判定）
	choices?: Choice[];
	death?: DeathInfo;
	goto?: string; // 自动跳转（链式推进）
	end?: boolean; // 通关
}

export interface Story {
	key: string;
	title: string;
	start: string;
	variables: Vars;
	nodes: Record<string, StoryNode>;
}

export type Vars = Record<string, VarValue>;

// ── 引擎运行时状态 ──

export interface StorySegment {
	text: string;
	speaker: string;
	hint?: string;
}

export interface StoryChoice {
	index: number;
	text: string;
	hint?: string;
}

export interface StoryState {
	nodeId: string;
	segments: StorySegment[];
	choices: StoryChoice[];
	death: { reason: string; classical: string; analysis: string } | null;
	ended: boolean;
	hint?: string; // 当前可展开的原文提示（取自最近一句对白）
	vars: Vars;
}

export interface SceneCharacter {
	expression: string;
	position: Position;
}

export interface EngineCallbacks {
	onAchievement?: (id: string) => void;
	onBackground?: (bg: string) => void;
	onShowCharacter?: (id: string, expr: string, pos: Position) => void;
	onHideCharacter?: (id: string) => void;
	onBGM?: (track: string) => void;
}
