import type { Storyline } from "../types/story";

export const STORYLINES: Storyline[] = [
	{
		id: "hanxin_c1_ink",
		title: "[Ink引擎] 胯下之辱",
		subtitle: "第一章 · Ink引擎测试版",
		era: "chu_han",
		year: "公元前 230 — 196 年",
		cover: "#2d7a4f",
		glyph: "ink",
		description:
			"Ink引擎技术验证章节——胯下之辱。使用ink叙事语言编写，用于测试新引擎的对白、选项、死亡、成就、舞台效果等功能。",
		estimatedMinutes: 3,
		difficulty: 1,
		focusCharacter: "hanxin",
		relatedCharacters: ["hanxin"],
		perspectives: [
			{
				characterId: "hanxin",
				storyKey: "hanxin:c1",
				unlockedBy: "hanxin",
				nodeCount: 1,
			},
		],
	},
	{
		id: "hanxin",
		title: "兵仙韩信",
		subtitle: "从胯下之辱到钟室之祸",
		era: "chu_han",
		year: "公元前 230 — 196 年",
		cover: "#1a6b8a",
		glyph: "信",
		description:
			"一柄长剑，半世飘零。胯下之辱忍得，漂母之食念得，登坛拜将后连百万之军——你将穿越成韩信，亲历他从市井到封侯、由极盛而族灭的一生。每一步抉择，都藏在史记的字里行间。",
		estimatedMinutes: 25,
		difficulty: 4,
		focusCharacter: "hanxin",
		relatedCharacters: ["hanxin", "liubang", "xiaohe", "xiangyu", "zhangliang"],
		perspectives: [
			{
				characterId: "hanxin",
				storyKey: "hanxin",
				unlockedBy: "hanxin",
				nodeCount: 7,
			},
		],
	},
	{
		id: "hongmen",
		title: "鸿门宴",
		subtitle: "一夜决定天下走向",
		era: "chu_han",
		year: "公元前 206 年",
		cover: "#c0392b",
		glyph: "宴",
		description:
			"四十万对十万，一场酒宴定生死。范增举玦，项庄舞剑，樊哙带剑拥盾——你将穿越成西楚霸王项羽，在杀与不杀之间，做出那个改变天下的决定。",
		estimatedMinutes: 15,
		difficulty: 3,
		focusCharacter: "xiangyu",
		relatedCharacters: ["xiangyu", "fanzeng", "liubang", "zhangliang", "fankuai", "yuji"],
		perspectives: [
			{
				characterId: "xiangyu",
				storyKey: "hongmen_xiangyu",
				unlockedBy: "xiangyu",
				nodeCount: 5,
			},
		],
	},
];

export const STORYLINE_MAP: Record<string, Storyline> = Object.fromEntries(
	STORYLINES.map((s) => [s.id, s]),
);

export function getStoryline(id: string): Storyline | undefined {
	return STORYLINE_MAP[id];
}

/** 全部视角总数（用于全局进度） */
export const TOTAL_PERSPECTIVES = STORYLINES.reduce(
	(n, s) => n + s.perspectives.length,
	0,
);
