// 系列 hanwu · 汉武盛世（卷12、109、111、112、123）。
// 五条主角线：汉武帝/李广/卫青霍去病(双perspective)/张骞/主父偃，均为多幕成长弧线ink。
import { withSeries } from "./_series";

export const hanwuStorylines = withSeries("hanwu", [
	{
		id: "hanwu_hanwudi_ink",
		title: "汉武大帝 · 功罪",
		subtitle: "孝武本纪/封禅书 · 刘彻",
		era: "western_han",
		year: "公元前 156 — 87 年",
		cover: "#c94c4c",
		glyph: "彻",
		description:
			"十六岁即位，七十岁崩。你将穿越成汉武帝刘彻——从独尊儒术到推恩削藩，从封禅求仙到巫蛊之祸，痛下轮台罪己诏。亲历一个雄主五十四年的功与罪。六幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "hanwudi",
		relatedCharacters: ["hanwudi", "dongzhongshu", "weizifu", "liju", "jiangchong"],
		perspectives: [
			{ characterId: "hanwudi", storyKey: "hanwudi:hanwu", unlockedBy: "hanwudi", nodeCount: 5 },
		],
	},
	{
		id: "hanwu_liguang_ink",
		title: "飞将军 · 李广",
		subtitle: "李将军列传 · 李广",
		era: "western_han",
		year: "？— 公元前 119 年",
		cover: "#8b7355",
		glyph: "广",
		description:
			"林暗草惊风，将军夜引弓。你将穿越成李广——从射石搏虎的飞将军，到大小七十余战而无封，终在漠北迷路后引刀自刭。亲历『李广难封』的悲剧。五幕成长弧线。",
		estimatedMinutes: 15,
		difficulty: 4,
		focusCharacter: "liguang",
		relatedCharacters: ["liguang", "hanwudi", "balingwei", "weiqing"],
		perspectives: [
			{ characterId: "liguang", storyKey: "liguang:hanwu", unlockedBy: "liguang", nodeCount: 4 },
		],
	},
	{
		id: "hanwu_weiqing_huoqibing_ink",
		title: "骑兵双璧 · 卫霍",
		subtitle: "卫将军骠骑列传 · 卫青/霍去病",
		era: "western_han",
		year: "公元前 2 世纪",
		cover: "#d4a847",
		glyph: "霍",
		description:
			"骑奴到大将军，少年封狼居胥。你可从两个视角亲历：卫青——从公主骑奴到龙城首捷、七击匈奴的大将军；霍去病——十八为侍中、八百骑深入、封狼居胥的少年英雄，二十四岁早逝。一张卡双视角。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "weiqing",
		relatedCharacters: ["weiqing", "huoqibing", "hanwudi", "weizifu"],
		perspectives: [
			{ characterId: "weiqing", storyKey: "weiqing:hanwu", unlockedBy: "weiqing", nodeCount: 2 },
			{ characterId: "huoqibing", storyKey: "huoqibing:hanwu", unlockedBy: "huoqibing", nodeCount: 4 },
		],
	},
	{
		id: "hanwu_zhangqian_ink",
		title: "博望侯 · 张骞",
		subtitle: "大宛列传 · 张骞",
		era: "western_han",
		year: "？— 公元前 114 年",
		cover: "#8b5a3c",
		glyph: "骞",
		description:
			"凿空西域，持节不失。你将穿越成张骞——应募出使、匈奴扣留十年、西走大宛大月氏、归途又被扣，十三年后归国。亲历西行国士的万里孤忠。五幕成长弧线。",
		estimatedMinutes: 15,
		difficulty: 3,
		focusCharacter: "zhangqian",
		relatedCharacters: ["zhangqian", "hanwudi", "dayuezhi", "hunye"],
		perspectives: [
			{ characterId: "zhangqian", storyKey: "zhangqian:hanwu", unlockedBy: "zhangqian", nodeCount: 3 },
		],
	},
	{
		id: "hanwu_zhufuyan_ink",
		title: "主父偃 · 推恩",
		subtitle: "平津侯主父列传 · 主父偃",
		era: "western_han",
		year: "？— 公元前 126 年",
		cover: "#6b5a7a",
		glyph: "偃",
		description:
			"游学四十余年不遇，一朝上书岁中四迁。你将穿越成主父偃——献策推恩令、迁豪强于茂陵、揭齐王阴事，『倒行暴施』终致族灭。亲历弄臣起落的五幕悲剧。",
		estimatedMinutes: 14,
		difficulty: 4,
		focusCharacter: "zhufuyan",
		relatedCharacters: ["zhufuyan", "hanwudi", "gongsunhong"],
		perspectives: [
			{ characterId: "zhufuyan", storyKey: "zhufuyan:hanwu", unlockedBy: "zhufuyan", nodeCount: 3 },
		],
	},
]);
