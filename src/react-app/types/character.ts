// 角色与人物关系类型

export type Era =
	| "spring_autumn" // 春秋
	| "warring_states" // 战国
	| "qin" // 秦朝
	| "chu_han" // 楚汉
	| "western_han"; // 西汉

export const ERA_LABELS: Record<Era, string> = {
	spring_autumn: "春秋",
	warring_states: "战国",
	qin: "秦",
	chu_han: "楚汉",
	western_han: "西汉",
};

// 与主项目 timslip-work 对齐的 6 种关系类型
export type RelationType =
	| "family" // 亲缘（血亲/配偶/姻亲）
	| "sovereign" // 君臣
	| "teacher" // 师承
	| "friend" // 挚友/盟友
	| "enemy" // 敌对
	| "peer"; // 同侪/中立

export interface CharacterRelation {
	targetId: string;
	type: RelationType;
	label: string; // '主君' | '宿命之敌' | '月下追韩信'
	description?: string;
}

export interface Character {
	id: string;
	name: string;
	title: string; // '淮阴侯 · 汉初三杰 · 兵仙'
	era: Era;
	/** 角色主题色（用于立绘占位、卡牌描边） */
	accent: string;
	/** 单字徽记，用于立绘占位与头像 */
	glyph: string;
	description: string; // 现代文简介
	classicalQuote: string; // 标志性原文引言
	historicalSource: string; // '《史记·淮阴侯列传》'
	relatedStorylines: string[]; // 关联故事线 ID
	relations: CharacterRelation[];
	/** 主项目头像 URL（运行时从主项目合并，null 表示未取或无头像） */
	avatarUrl?: string | null;
	/** 主项目 bio_summary（运行时合并，若与 description 不同可作补充） */
	bioSummary?: string | null;
}
