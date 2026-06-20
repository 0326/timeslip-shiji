import type { Character } from "../types/character";

// 楚汉争霸·首发卡池的 8 位角色
export const CHARACTERS: Character[] = [
	{
		id: "hanxin",
		name: "韩信",
		title: "淮阴侯 · 汉初三杰 · 兵仙",
		era: "chu_han",
		accent: "#1a6b8a",
		glyph: "信",
		description:
			"出身寒微，曾受胯下之辱、寄食漂母。择主而事，由萧何月下追回，登坛拜将。背水一战、暗度陈仓、十面埋伏，连百万之军战必胜攻必取，被誉为兵仙。功高震主，终死于钟室。",
		classicalQuote: "信能将兵，多多益善耳。",
		historicalSource: "《史记·淮阴侯列传》",
		relatedStorylines: ["hanxin", "hongmen"],
		relations: [
			{ targetId: "liubang", type: "lord", label: "君臣 · 成也萧何", description: "登坛拜将，终被疑忌" },
			{ targetId: "xiaohe", type: "grace", label: "月下追韩信", description: "成也萧何，败也萧何" },
			{ targetId: "xiangyu", type: "enemy", label: "宿命之敌", description: "曾事项羽不得重用，垓下灭之" },
			{ targetId: "zhangliang", type: "ally", label: "同列汉营", description: "汉初三杰" },
		],
	},
	{
		id: "xiangyu",
		name: "项羽",
		title: "西楚霸王 · 力拔山兮",
		era: "chu_han",
		accent: "#c0392b",
		glyph: "羽",
		description:
			"楚国名将之后，力能扛鼎，才气过人。巨鹿破釜沉舟，大破秦军；鸿门宴优柔不杀刘邦。分封诸侯自立西楚霸王，然刚愎自用，终败垓下，自刎乌江。",
		classicalQuote: "力拔山兮气盖世，时不利兮骓不逝。",
		historicalSource: "《史记·项羽本纪》",
		relatedStorylines: ["hongmen"],
		relations: [
			{ targetId: "fanzeng", type: "lord", label: "亚父", description: "尊为亚父却终生疑隙" },
			{ targetId: "yuji", type: "grace", label: "霸王别姬", description: "垓下生死相随" },
			{ targetId: "liubang", type: "enemy", label: "楚汉相争", description: "鸿门宴未杀，终成大患" },
			{ targetId: "hanxin", type: "enemy", label: "弃才", description: "麾下执戟郎，去而事汉" },
		],
	},
	{
		id: "zhangliang",
		name: "张良",
		title: "留侯 · 汉初三杰 · 谋圣",
		era: "chu_han",
		accent: "#b8973a",
		glyph: "良",
		description:
			"韩国贵族之后，博浪沙刺秦未遂。圯上受书于黄石公，运筹帷幄之中，决胜千里之外。鸿门宴中周旋救主，下邑画策，功成身退，从赤松子游。",
		classicalQuote: "运筹帷幄之中，决胜千里之外。",
		historicalSource: "《史记·留侯世家》",
		relatedStorylines: ["hongmen"],
		relations: [
			{ targetId: "liubang", type: "lord", label: "帝师", description: "沛公殆天授" },
			{ targetId: "hanxin", type: "ally", label: "同列汉营", description: "汉初三杰" },
			{ targetId: "fanzeng", type: "enemy", label: "智斗鸿门", description: "鸿门宴上分庭抗礼" },
		],
	},
	{
		id: "liubang",
		name: "刘邦",
		title: "汉高祖 · 沛公",
		era: "chu_han",
		accent: "#d4af5a",
		glyph: "邦",
		description:
			"起于泗水亭长，豁达大度，知人善任。约法三章入关中，鸿门宴中卑辞脱身。终用三杰之力，垓下灭楚，开汉四百年基业。",
		classicalQuote: "夫运筹策帷帐之中，决胜于千里之外，吾不如子房。",
		historicalSource: "《史记·高祖本纪》",
		relatedStorylines: ["hongmen"],
		relations: [
			{ targetId: "xiangyu", type: "enemy", label: "楚汉相争", description: "鸿门虎口脱险" },
			{ targetId: "zhangliang", type: "ally", label: "帝师", description: "言听计从" },
			{ targetId: "xiaohe", type: "ally", label: "丞相", description: "镇国家、抚百姓" },
			{ targetId: "fankuai", type: "ally", label: "连襟猛将", description: "鸿门带剑拥盾救主" },
			{ targetId: "hanxin", type: "lord", label: "君臣相疑", description: "用之而后忌之" },
		],
	},
	{
		id: "xiaohe",
		name: "萧何",
		title: "酂侯 · 汉初三杰 · 国相",
		era: "chu_han",
		accent: "#5a8f6b",
		glyph: "何",
		description:
			"沛县主吏掾，识刘邦于微时。入关收秦图籍，明天下要害。月下追韩信，荐为大将；镇守关中，转漕给军，汉之所以得天下，萧何之功最盛。",
		classicalQuote: "镇国家，抚百姓，给馈饷，不绝粮道，吾不如萧何。",
		historicalSource: "《史记·萧相国世家》",
		relatedStorylines: ["hanxin"],
		relations: [
			{ targetId: "liubang", type: "lord", label: "丞相", description: "功冠群臣" },
			{ targetId: "hanxin", type: "grace", label: "月下追之", description: "成也萧何，败也萧何" },
		],
	},
	{
		id: "fanzeng",
		name: "范增",
		title: "历阳侯 · 亚父",
		era: "chu_han",
		accent: "#7a6e5c",
		glyph: "增",
		description:
			"年七十，好奇计。事项羽尊为亚父。鸿门宴上数目项王、举玉玦三示之，欲杀刘邦不得。后中陈平反间，愤而去，疽发背而死。",
		classicalQuote: "竖子不足与谋！夺项王天下者，必沛公也。",
		historicalSource: "《史记·项羽本纪》",
		relatedStorylines: ["hongmen"],
		relations: [
			{ targetId: "xiangyu", type: "lord", label: "亚父", description: "忠而见疑，愤而求去" },
			{ targetId: "liubang", type: "enemy", label: "欲除之", description: "鸿门举玦，志在必杀" },
			{ targetId: "zhangliang", type: "enemy", label: "鸿门智斗" },
		],
	},
	{
		id: "fankuai",
		name: "樊哙",
		title: "舞阳侯 · 屠狗壮士",
		era: "chu_han",
		accent: "#a85d3a",
		glyph: "哙",
		description:
			"以屠狗为业，从刘邦起沛。鸿门宴危急，带剑拥盾撞入军门，瞋目视项王，头发上指，立饮斗酒、生啖彘肩，护沛公脱险。勇冠三军。",
		classicalQuote: "大行不顾细谨，大礼不辞小让。",
		historicalSource: "《史记·樊郦滕灌列传》",
		relatedStorylines: ["hongmen"],
		relations: [
			{ targetId: "liubang", type: "lord", label: "连襟猛将", description: "鸿门救主" },
			{ targetId: "xiangyu", type: "neutral", label: "壮士相惜", description: "项王壮之，赐卮酒彘肩" },
		],
	},
	{
		id: "yuji",
		name: "虞姬",
		title: "西楚 · 美人",
		era: "chu_han",
		accent: "#b8557a",
		glyph: "虞",
		description:
			"常幸从项羽。垓下被围，四面楚歌，项羽悲歌慷慨，虞姬和之。霸王别姬，遂以身殉，留千古绝唱。",
		classicalQuote: "汉兵已略地，四方楚歌声。大王意气尽，贱妾何聊生。",
		historicalSource: "《史记·项羽本纪》",
		relatedStorylines: ["hongmen"],
		relations: [
			{ targetId: "xiangyu", type: "grace", label: "霸王别姬", description: "生死相随" },
		],
	},
];

export const CHARACTER_MAP: Record<string, Character> = Object.fromEntries(
	CHARACTERS.map((c) => [c.id, c]),
);

export function getCharacter(id: string): Character | undefined {
	return CHARACTER_MAP[id];
}
