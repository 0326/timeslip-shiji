// 成就系统类型

export type AchievementType =
	| "easter_egg" // 彩蛋
	| "historical" // 历史还原
	| "cross_character" // 跨视角
	| "collection" // 收藏
	| "story" // 通关
	| "death"; // 死亡里程碑

export interface Achievement {
	id: string;
	name: string;
	description: string; // 对用户可见的解锁条件
	classicalQuote: string; // 配套史记原文
	type: AchievementType;
	points: number;
	icon: string; // emoji
	/** 是否为隐藏成就（解锁前不显示描述） */
	hidden?: boolean;
}
