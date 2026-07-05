// 系列 chuhan · 楚汉相争（卷7,8,92 及相关列传）。
// 三条旗舰主角线（项羽/刘邦/韩信）为多幕成长弧线 ink；旧引擎 hanxin/hongmen 为早期内容。
import { withSeries } from "./_series";

export const chuhanStorylines = withSeries("chuhan", [
	{
		id: "chuhan_xiangyu_ink",
		title: "西楚霸王 · 项羽",
		subtitle: "楚汉相争 · 项羽",
		era: "chu_han",
		year: "公元前 232 — 202 年",
		cover: "#c0392b",
		glyph: "羽",
		description:
			"力能扛鼎，才气过人。你将穿越成项羽，从会稽起兵到破釜沉舟、鸿门放虎、垓下悲歌——亲历一个「力与刚愎」的英雄如何一步步走向乌江。八幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "xiangyu",
		relatedCharacters: ["xiangyu", "liubang", "fanzeng", "fankuai", "yuji", "xiangliang", "songyi"],
		perspectives: [
			{ characterId: "xiangyu", storyKey: "xiangyu:chuhan", unlockedBy: "xiangyu", nodeCount: 8 },
		],
	},
	{
		id: "chuhan_liubang_ink",
		title: "汉高祖 · 刘邦",
		subtitle: "楚汉相争 · 刘邦",
		era: "chu_han",
		year: "公元前 256 — 195 年",
		cover: "#d4af5a",
		glyph: "邦",
		description:
			"起于泗水亭长，能屈能伸、知人善任。你将穿越成刘邦，从芒砀斩蛇到约法三章、鸿门低头、暗度陈仓，终登帝位——亲历一个「能屈与猜忌」的开国之君。八幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "liubang",
		relatedCharacters: ["liubang", "xiangyu", "xiaohe", "zhangliang", "fankuai", "hanxin", "jixin", "baishe"],
		perspectives: [
			{ characterId: "liubang", storyKey: "liubang:chuhan", unlockedBy: "liubang", nodeCount: 8 },
		],
	},
	{
		id: "chuhan_hanxin_ink",
		title: "兵仙韩信 · 一生",
		subtitle: "楚汉相争 · 韩信",
		era: "chu_han",
		year: "公元前 231 — 196 年",
		cover: "#1a6b8a",
		glyph: "信",
		description:
			"一柄长剑，半世飘零。你将穿越成韩信，从胯下之辱到登坛拜将、背水一战、蒯通三分，终于钟室之祸——亲历一个「忍与不知止足」的兵仙一生。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "hanxin",
		relatedCharacters: ["hanxin", "xiaohe", "liubang", "xiangyu", "kuaitong", "piaomu"],
		perspectives: [
			{ characterId: "hanxin", storyKey: "hanxin:chuhan", unlockedBy: "hanxin", nodeCount: 7 },
		],
	},
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
			{ characterId: "hanxin", storyKey: "hanxin:c1", unlockedBy: "hanxin", nodeCount: 1 },
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
			{ characterId: "hanxin", storyKey: "hanxin", unlockedBy: "hanxin", nodeCount: 7 },
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
			{ characterId: "xiangyu", storyKey: "hongmen_xiangyu", unlockedBy: "xiangyu", nodeCount: 5 },
		],
	},
]);
