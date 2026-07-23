import { withSeries } from "./_series";

export const hanchuStorylines = withSeries("hanchu", [
	{
		id: "hanchu_lvhou_ink",
		title: "高后吕雉 · 女主称制",
		subtitle: "汉初之治 · 吕后",
		era: "western_han",
		year: "公元前 241 — 180 年",
		cover: "#8a3a5c",
		glyph: "雉",
		description:
			"吕雉，中国历史上第一个临朝称制的女主。你将穿越成吕后，从下嫁亭长的富家女，到人彘之祸的妒后，到临朝称制、诸吕封王的女主，终至死后族灭——亲历一个『刚毅与残忍』交织的外戚悲剧。七幕成长弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 4,
		focusCharacter: "lvhou",
		relatedCharacters: ["lvhou", "liubang", "qiji", "hui_di", "zhoulu", "chenping"],
		perspectives: [
			{ characterId: "lvhou", storyKey: "lvhou:hanchu", unlockedBy: "lvhou", nodeCount: 9 },
		],
	},
	{
		id: "hanchu_hanwen_ink",
		title: "汉文帝 · 仁君模板",
		subtitle: "汉初之治 · 刘恒",
		era: "western_han",
		year: "公元前 203 — 157 年",
		cover: "#3a7a5c",
		glyph: "恒",
		description:
			"汉文帝刘恒，二十四孝中亲尝汤药的仁君。你将穿越成代王刘恒，从代邸即位的惊心动魄，到缇萦救父、除肉刑、露台惜费，开创文景之治——亲历一个『仁厚与克制』的帝王如何以俭治国。八幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 3,
		focusCharacter: "hanwen_di",
		relatedCharacters: ["hanwen_di", "tiying", "zhouping", "chenping", "songchang"],
		perspectives: [
			{ characterId: "hanwen_di", storyKey: "hanwen:hanchu", unlockedBy: "hanwen_di", nodeCount: 6 },
		],
	},
	{
		id: "hanchu_zhoubo_ink",
		title: "绛侯周勃 · 安刘者",
		subtitle: "汉初之治 · 周勃",
		era: "western_han",
		year: "公元前？— 169 年",
		cover: "#8a6f3a",
		glyph: "勃",
		description:
			"周勃，刘邦口中『安刘氏者必勃也』的厚重少文之将。你将穿越成周勃，从诛吕安刘的太尉，到叹狱吏之贵的阶下囚，再到儿子周亚夫细柳营的将门对照——亲历一个『厚重木强』的武人如何功高震主。七幕成长弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 3,
		focusCharacter: "zhoubo",
		relatedCharacters: ["zhoubo", "zhouyafu", "chenping", "hanwen_di", "yuli"],
		perspectives: [
			{ characterId: "zhoubo", storyKey: "zhoubo:hanchu", unlockedBy: "zhoubo", nodeCount: 7 },
		],
	},
	{
		id: "hanchu_chaocuo_ink",
		title: "晁错 · 谋国之忠",
		subtitle: "汉初之治 · 晁错",
		era: "western_han",
		year: "公元前 200 — 154 年",
		cover: "#5a4a8a",
		glyph: "错",
		description:
			"晁错，『削藩策』的力主者，衣朝衣斩东市的悲剧忠臣。你将穿越成晁错，从太子家令的智囊，到削藩之议激变七国，最终被景帝斩于东市——亲历一个『为国远虑，祸反近身』的谋国悲剧。六幕成长弧线，多结局。",
		estimatedMinutes: 14,
		difficulty: 4,
		focusCharacter: "chaocuo",
		relatedCharacters: ["chaocuo", "hanjing_di", "yuanang", "liubi", "zhouyafu"],
		perspectives: [
			{ characterId: "chaocuo", storyKey: "chaocuo:hanchu", unlockedBy: "chaocuo", nodeCount: 5 },
		],
	},
	// TODO: zhouyafu-hanchu.ink not yet written
	// {
	// 	id: "hanchu_zhouyafu_ink",
	// 	title: "条侯周亚夫 · 将才之刚",
	// 	subtitle: "汉初之治 · 周亚夫",
	// 	era: "western_han",
	// 	year: "公元前 199 — 143 年",
	// 	cover: "#3a5a8a",
	// 	glyph: "亚",
	// 	description:
	// 		"周亚夫，细柳营治军、三月平七国的一代名将，却因刚愎不食五日呕血而死。你将穿越成周亚夫，从细柳营的军门阻驾，到坚壁绝粮平吴楚，最终入狱不食而亡——亲历一个『将才与刚愎』的名将悲剧。七幕成长弧线，多结局。",
	// 	estimatedMinutes: 16,
	// 	difficulty: 4,
	// 	focusCharacter: "zhouyafu",
	// 	relatedCharacters: ["zhouyafu", "zhoubo", "hanwen_di", "hanjing_di", "liubi"],
	// 	perspectives: [
	// 		{ characterId: "zhouyafu", storyKey: "zhouyafu:hanchu", unlockedBy: "zhouyafu", nodeCount: 6 },
	// 	],
	// },
]);
