import type { Achievement } from "../types/achievement";

// 成就定义。唯一触发权威 = 剧本内 triggerAchievement(id)
// 收藏/跨视角类在 store action 中派生触发，仍走同一出口。
export const ACHIEVEMENTS: Record<string, Achievement> = {
	// ── 通关 ──
	bingxian_born: {
		id: "bingxian_born",
		name: "兵仙降世",
		description: "通关韩信线，亲历兵仙的一生",
		classicalQuote: "连百万之军，战必胜，攻必取，吾不如韩信。",
		type: "story",
		points: 200,
		icon: "⚔️",
	},
	hongmen_through: {
		id: "hongmen_through",
		name: "鸿门脱劫",
		description: "以项羽视角走完鸿门宴",
		classicalQuote: "项庄拔剑起舞，项伯亦拔剑起舞，常以身翼蔽沛公。",
		type: "story",
		points: 150,
		icon: "🍷",
	},
	// ── 历史还原 ──
	perfect_hanxin: {
		id: "perfect_hanxin",
		name: "兵仙之眼",
		description: "韩信线全程零死亡，每一步都与史实一致",
		classicalQuote: "右背山陵，前左水泽，信反此而胜。",
		type: "historical",
		points: 300,
		icon: "🏆",
	},
	// ── 彩蛋 ──
	yifu_sigh: {
		id: "yifu_sigh",
		name: "亚父之叹",
		description: "在鸿门宴中，亲历范增三次举玦示意均被无视",
		classicalQuote: "范增数目项王，举所佩玉玦以示之者三，项王默然不应。",
		type: "easter_egg",
		points: 150,
		icon: "🎖️",
		hidden: true,
	},
	xiakua: {
		id: "xiakua",
		name: "胯下之辱",
		description: "选择从屠中少年胯下钻过",
		classicalQuote: "于是信孰视之，俛出袴下，蒲伏。一市人皆笑信，以为怯。",
		type: "easter_egg",
		points: 100,
		icon: "🧎",
		hidden: true,
	},
	// ── 死亡里程碑 ──
	nine_deaths: {
		id: "nine_deaths",
		name: "九死一生",
		description: "累计死亡达到 9 次——死亡也是一种阅读",
		classicalQuote: "知死必勇，非死者难也，处死者难。",
		type: "death",
		points: 80,
		icon: "💀",
	},
	// ── 收藏 ──
	full_chuhan: {
		id: "full_chuhan",
		name: "群英荟萃",
		description: "集齐楚汉争霸卡池全部 8 位角色",
		classicalQuote: "夫运筹策帷帐之中，决胜于千里之外。",
		type: "collection",
		points: 200,
		icon: "💎",
	},
	first_pull: {
		id: "first_pull",
		name: "初遇史册",
		description: "完成第一次抽卡",
		classicalQuote: "究天人之际，通古今之变，成一家之言。",
		type: "collection",
		points: 50,
		icon: "📜",
	},
	// ── 探索 ──
	bibliophile: {
		id: "bibliophile",
		name: "博闻强识",
		description: "阅读 1 篇完整史记原文",
		classicalQuote: "读书破万卷，下笔如有神。",
		type: "historical",
		points: 60,
		icon: "📖",
	},
};

export const ACHIEVEMENT_LIST: Achievement[] = Object.values(ACHIEVEMENTS);

export function getAchievement(id: string): Achievement | undefined {
	return ACHIEVEMENTS[id];
}
