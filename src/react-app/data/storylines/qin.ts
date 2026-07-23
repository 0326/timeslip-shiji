import { withSeries } from "./_series";

export const qinStorylines = withSeries("qin", [
	{
		id: "qin_qshihuang_ink",
		title: "千古一帝 · 秦始皇",
		subtitle: "大秦帝国 · 嬴政",
		era: "qin",
		year: "公元前 259 — 210 年",
		cover: "#c0392b",
		glyph: "政",
		description:
			"十三岁即位，二十二岁亲政，除嫪毐、逐吕不韦，十年扫灭六国，称始皇帝。书同文、车同轨、筑长城；又焚书坑儒、求仙问药，终至沙丘暴崩、二世而亡。你将穿越成嬴政，亲历功罪一线之间的帝王一生。七幕成长弧线，多结局。",
		estimatedMinutes: 20,
		difficulty: 4,
		focusCharacter: "qshihuang",
		relatedCharacters: ["qshihuang", "lisi", "lvbuwei", "laoai", "zhaoji", "fusu", "zhaogao", "wangjian", "huhai"],
		perspectives: [
			{ characterId: "qshihuang", storyKey: "qshihuang:qin", unlockedBy: "qshihuang", nodeCount: 6 },
		],
	},
	{
		id: "qin_lisi_ink",
		title: "仓中鼠 · 李斯",
		subtitle: "大秦帝国 · 李斯",
		era: "qin",
		year: "公元前 284 — 208 年",
		cover: "#8a6f4a",
		glyph: "斯",
		description:
			"从上蔡小吏到秦国丞相，观厕鼠仓鼠而悟『在所自处』，谏逐客、同文书，功在社稷；却在沙丘一念之差，与赵高矫诏杀扶苏立胡亥，终被腰斩咸阳市，临刑叹黄犬。你将穿越成李斯，亲历厕鼠与仓鼠的代价。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "lisi",
		relatedCharacters: ["lisi", "qshihuang", "zhaogao", "huhai", "fusu"],
		perspectives: [
			{ characterId: "lisi", storyKey: "lisi:qin", unlockedBy: "lisi", nodeCount: 4 },
		],
	},
	{
		id: "qin_jingke_ink",
		title: "易水寒 · 荆轲",
		subtitle: "大秦帝国 · 荆轲",
		era: "qin",
		year: "公元前 ? — 227 年",
		cover: "#5a7a8c",
		glyph: "轲",
		description:
			"好读书击剑，游于燕市与狗屠高渐离饮歌。燕太子丹拜为上卿，樊於期献首、易水送别，入秦庭图穷匕见，逐秦王于大殿，事败被戮。『风萧萧兮易水寒』，你将穿越成荆轲，亲历一剑的史诗。六幕成长弧线。",
		estimatedMinutes: 16,
		difficulty: 4,
		focusCharacter: "jingke",
		relatedCharacters: ["jingke", "qshihuang", "taizidan", "fanwuqi", "gaojianli"],
		perspectives: [
			{ characterId: "jingke", storyKey: "jingke:qin", unlockedBy: "jingke", nodeCount: 5 },
		],
	},
	{
		id: "qin_lvbuwei_ink",
		title: "奇货可居 · 吕不韦",
		subtitle: "大秦帝国 · 吕不韦",
		era: "qin",
		year: "公元前 292 — 235 年",
		cover: "#1a6b8a",
		glyph: "吕",
		description:
			"阳翟大贾，邯郸见质子子楚而曰『此奇货可居』，倾千金西游立嗣，献赵姬生嬴政，为秦相、号仲父，门客三千编《吕氏春秋》。却因进嫪毐、乱宫闱，终被放逐蜀地，饮鸩而死。你将穿越成吕不韦，亲历商人与帝王师的赌局。六幕成长弧线。",
		estimatedMinutes: 16,
		difficulty: 4,
		focusCharacter: "lvbuwei",
		relatedCharacters: ["lvbuwei", "zichu", "zhaoji", "qshihuang", "laoai", "huayangfuren"],
		perspectives: [
			{ characterId: "lvbuwei", storyKey: "lvbuwei:qin", unlockedBy: "lvbuwei", nodeCount: 4 },
		],
	},
	{
		id: "qin_mengtian_ink",
		title: "长城将魂 · 蒙恬",
		subtitle: "大秦帝国 · 蒙恬",
		era: "qin",
		year: "公元前 ? — 210 年",
		cover: "#6b7a5c",
		glyph: "恬",
		description:
			"三世为将，北逐匈奴七百里，收河南地，筑万里长城，修直道，威震匈奴。始皇崩，赵高矫诏赐死扶苏，蒙恬疑而复请，被囚阳周，终吞药自尽，临终以『绝地脉』自罪。你将穿越成蒙恬，亲历三世将脉的愚忠与悲凉。六幕成长弧线。",
		estimatedMinutes: 15,
		difficulty: 3,
		focusCharacter: "mengtian",
		relatedCharacters: ["mengtian", "qshihuang", "fusu", "zhaogao", "huhai", "mengyi"],
		perspectives: [
			{ characterId: "mengtian", storyKey: "mengtian:qin", unlockedBy: "mengtian", nodeCount: 1 },
		],
	},
]);
