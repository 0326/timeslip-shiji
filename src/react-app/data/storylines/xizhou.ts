import { withSeries } from "./_series";

export const xizhouStorylines = withSeries("xizhou", [
	{
		id: "xizhou_jiangshang_ink",
		title: "太公望姜尚 · 待时之渔",
		subtitle: "西周王朝 · 姜尚",
		era: "western_zhou",
		year: "公元前 11 世纪",
		cover: "#b8973a",
		glyph: "尚",
		description:
			"半生穷困，渭水直钩——你将穿越成姜尚，从朝歌屠叟到太公望，从牧野白发冲阵到封齐连夜赶国，亲历一个『待时之渔者』七十年不遇、遇则王天下的传奇。六幕成长弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 3,
		focusCharacter: "jiangshang",
		relatedCharacters: ["jiangshang", "wenwang", "mshi"],
		perspectives: [
			{ characterId: "jiangshang", storyKey: "jiangshang:xizhou", unlockedBy: "jiangshang", nodeCount: 7 },
		],
	},
	{
		id: "xizhou_wenwang_ink",
		title: "周文王姬昌 · 羑里之忍",
		subtitle: "西周王朝 · 周文王",
		era: "western_zhou",
		year: "公元前 1152 — 1056 年",
		cover: "#3f7a5c",
		glyph: "昌",
		description:
			"笃仁敬老，三分天下有其二以服事殷——你将穿越成周文王，从被囚羑里演易、献地除炮烙，到渭水遇太公、虞芮质成受天命，亲历一个『仁德与隐忍』如何为周奠定八百年根基。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "wenwang",
		relatedCharacters: ["wenwang", "chonghou", "zhou", "jiangshang"],
		perspectives: [
			{ characterId: "wenwang", storyKey: "wenwang:xizhou", unlockedBy: "wenwang", nodeCount: 5 },
		],
	},
	{
		id: "xizhou_wuwang_ink",
		title: "周武王姬发 · 孟津之决",
		subtitle: "西周王朝 · 周武王",
		era: "western_zhou",
		year: "公元前 1087 — 1043 年",
		cover: "#c0392b",
		glyph: "发",
		description:
			"载木主出征，孟津观兵知天命未到而退，牧野一战定天下——你将穿越成周武王，从继志观兵到牧野誓师，从分封天下到归马放牛，亲历一个『知进知退』的开国天子。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "wuwang",
		relatedCharacters: ["wuwang", "jiangshang", "zhougong", "zhou"],
		perspectives: [
			{ characterId: "wuwang", storyKey: "wuwang:xizhou", unlockedBy: "wuwang", nodeCount: 6 },
		],
	},
	{
		id: "xizhou_zhougong_ink",
		title: "周公旦 · 摄政之诚",
		subtitle: "西周王朝 · 周公",
		era: "western_zhou",
		year: "公元前 11 世纪",
		cover: "#4a7a9c",
		glyph: "旦",
		description:
			"摄政当国，东征平三监，制礼作乐，还政成王——你将穿越成周公旦，从武王托孤到流言四起，从诛兄放弟到金縢见信，亲历一个『坐了七年天子位又完完整整还回去』的圣人一生。八幕成长弧线，多结局。",
		estimatedMinutes: 20,
		difficulty: 4,
		focusCharacter: "zhougong",
		relatedCharacters: ["zhougong", "wuwang", "chengwang", "shaogong", "guanshu", "caishu", "boqin"],
		perspectives: [
			{ characterId: "zhougong", storyKey: "zhougong:xizhou", unlockedBy: "zhougong", nodeCount: 5 },
		],
	},
	{
		id: "xizhou_xuanwang_ink",
		title: "周宣王姬静 · 中兴之殇",
		subtitle: "西周王朝 · 周宣王",
		era: "western_zhou",
		year: "公元前 828 — 783 年",
		cover: "#8a6db0",
		glyph: "静",
		description:
			"召公以子代死、共和行政后中兴周室——你将穿越成周宣王，从北伐南征复宗周，到不籍千亩、废长立幼、料民太原，亲历一个『中兴之主如何在晚年骄盈中埋下亡国之种』。七幕成长弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 3,
		focusCharacter: "xuanwang",
		relatedCharacters: ["xuanwang", "boyang", "zhongshanfu", "shaogong_hu"],
		perspectives: [
			{ characterId: "xuanwang", storyKey: "xuanwang:xizhou", unlockedBy: "xuanwang", nodeCount: 4 },
		],
	},
	{
		id: "xizhou_youwang_ink",
		title: "周幽王宫涅 · 烽火之笑",
		subtitle: "西周王朝 · 周幽王",
		era: "western_zhou",
		year: "公元前 795 — 771 年",
		cover: "#7a2f2f",
		glyph: "涅",
		description:
			"烽火戏诸侯，一笑失天下——你将穿越成周幽王，从三川地震天示警，到宠褒姒、废嫡立庶、举烽火戏诸侯，亲历西周末代天子如何在一次次任性中把八百年基业挥霍殆尽。六幕成长弧线，多结局。",
		estimatedMinutes: 14,
		difficulty: 3,
		focusCharacter: "youwang",
		relatedCharacters: ["youwang", "baosi", "guoshifu", "boyang"],
		perspectives: [
			{ characterId: "youwang", storyKey: "youwang:xizhou", unlockedBy: "youwang", nodeCount: 4 },
		],
	},
]);
