import type { Era, RelationType } from "../types/character";

/**
 * 子项目独有的游戏化字段（主项目 timslip-work 没有）。
 * id 与主项目 figures.id 对齐（如 "xiangyu"），运行时通过 mainProjectApi 合并 bio/avatar。
 */
export interface CharacterGameMeta {
	id: string;
	glyph: string; // 单字徽记
	accent: string; // 主题色
	era: Era;
	title: string; // 游戏化头衔：'淮阴侯 · 汉初三杰 · 兵仙'
	classicalQuote: string; // 标志性原文引言
	historicalSource: string; // '《史记·淮阴侯列传》'
	relatedStorylines: string[]; // 关联故事线 ID
	/**
	 * 游戏化关系（抽卡/解锁/成就系统用）。
	 * 若主项目有同 targetId 的关系，运行时以主项目为准；
	 * 主项目缺此 targetId 时，用本字段兜底（如虞姬等主项目暂未收录的人物）。
	 */
	gameRelations: {
		targetId: string;
		type: RelationType;
		label: string;
		description?: string;
	}[];
}

export const CHARACTER_GAME_META: Record<string, CharacterGameMeta> = {
	hanxin: {
		id: "hanxin",
		glyph: "信",
		accent: "#1a6b8a",
		era: "chu_han",
		title: "淮阴侯 · 汉初三杰 · 兵仙",
		classicalQuote: "信能将兵，多多益善耳。",
		historicalSource: "《史记·淮阴侯列传》",
		relatedStorylines: ["chuhan_hanxin_ink"],
		gameRelations: [
			{ targetId: "liubang", type: "sovereign", label: "君臣 · 成也萧何", description: "登坛拜将，终被疑忌" },
			{ targetId: "xiaohe", type: "friend", label: "月下追韩信", description: "成也萧何，败也萧何" },
			{ targetId: "xiangyu", type: "enemy", label: "宿命之敌", description: "曾事项羽不得重用，垓下灭之" },
			{ targetId: "zhangliang", type: "friend", label: "同列汉营", description: "汉初三杰" },
		],
	},
	xiangyu: {
		id: "xiangyu",
		glyph: "羽",
		accent: "#c0392b",
		era: "chu_han",
		title: "西楚霸王 · 力拔山兮",
		classicalQuote: "力拔山兮气盖世，时不利兮骓不逝。",
		historicalSource: "《史记·项羽本纪》",
		relatedStorylines: ["chuhan_xiangyu_ink"],
		gameRelations: [
			{ targetId: "fanzeng", type: "sovereign", label: "亚父", description: "尊为亚父却终生疑隙" },
			{ targetId: "yuji", type: "family", label: "霸王别姬", description: "垓下生死相随" },
			{ targetId: "liubang", type: "enemy", label: "楚汉相争", description: "鸿门宴未杀，终成大患" },
			{ targetId: "hanxin", type: "enemy", label: "弃才", description: "麾下执戟郎，去而事汉" },
		],
	},
	zhangliang: {
		id: "zhangliang",
		glyph: "良",
		accent: "#b8973a",
		era: "chu_han",
		title: "留侯 · 汉初三杰 · 谋圣",
		classicalQuote: "运筹帷幄之中，决胜千里之外。",
		historicalSource: "《史记·留侯世家》",
		relatedStorylines: ["chuhan_zhangliang_ink"],
		gameRelations: [
			{ targetId: "liubang", type: "sovereign", label: "帝师", description: "沛公殆天授" },
			{ targetId: "hanxin", type: "friend", label: "同列汉营", description: "汉初三杰" },
			{ targetId: "fanzeng", type: "enemy", label: "智斗鸿门", description: "鸿门宴上分庭抗礼" },
		],
	},
	liubang: {
		id: "liubang",
		glyph: "邦",
		accent: "#d4af5a",
		era: "chu_han",
		title: "汉高祖 · 沛公",
		classicalQuote: "夫运筹策帷帐之中，决胜于千里之外，吾不如子房。",
		historicalSource: "《史记·高祖本纪》",
		relatedStorylines: ["chuhan_liubang_ink"],
		gameRelations: [
			{ targetId: "xiangyu", type: "enemy", label: "楚汉相争", description: "鸿门虎口脱险" },
			{ targetId: "zhangliang", type: "sovereign", label: "帝师", description: "言听计从" },
			{ targetId: "xiaohe", type: "sovereign", label: "丞相", description: "镇国家、抚百姓" },
			{ targetId: "fankuai", type: "family", label: "连襟猛将", description: "鸿门带剑拥盾救主" },
			{ targetId: "hanxin", type: "sovereign", label: "君臣相疑", description: "用之而后忌之" },
		],
	},
	xiaohe: {
		id: "xiaohe",
		glyph: "何",
		accent: "#5a8f6b",
		era: "chu_han",
		title: "酂侯 · 汉初三杰 · 国相",
		classicalQuote: "镇国家，抚百姓，给馈饷，不绝粮道，吾不如萧何。",
		historicalSource: "《史记·萧相国世家》",
		relatedStorylines: ["chuhan_hanxin_ink"],
		gameRelations: [
			{ targetId: "liubang", type: "sovereign", label: "丞相", description: "功冠群臣" },
			{ targetId: "hanxin", type: "friend", label: "月下追之", description: "成也萧何，败也萧何" },
		],
	},
	fanzeng: {
		id: "fanzeng",
		glyph: "增",
		accent: "#7a6e5c",
		era: "chu_han",
		title: "历阳侯 · 亚父",
		classicalQuote: "竖子不足与谋！夺项王天下者，必沛公也。",
		historicalSource: "《史记·项羽本纪》",
		relatedStorylines: ["chuhan_xiangyu_ink"],
		gameRelations: [
			{ targetId: "xiangyu", type: "sovereign", label: "亚父", description: "忠而见疑，愤而求去" },
			{ targetId: "liubang", type: "enemy", label: "欲除之", description: "鸿门举玦，志在必杀" },
			{ targetId: "zhangliang", type: "enemy", label: "鸿门智斗" },
		],
	},
	fankuai: {
		id: "fankuai",
		glyph: "哙",
		accent: "#a85d3a",
		era: "chu_han",
		title: "舞阳侯 · 屠狗壮士",
		classicalQuote: "大行不顾细谨，大礼不辞小让。",
		historicalSource: "《史记·樊郦滕灌列传》",
		relatedStorylines: ["chuhan_liubang_ink"],
		gameRelations: [
			{ targetId: "liubang", type: "family", label: "连襟猛将", description: "鸿门救主" },
			{ targetId: "xiangyu", type: "peer", label: "壮士相惜", description: "项王壮之，赐卮酒彘肩" },
		],
	},
	yuji: {
		id: "yuji",
		glyph: "虞",
		accent: "#b8557a",
		era: "chu_han",
		title: "西楚 · 美人",
		classicalQuote: "汉兵已略地，四方楚歌声。大王意气尽，贱妾何聊生。",
		historicalSource: "《史记·项羽本纪》",
		relatedStorylines: ["chuhan_xiangyu_ink"],
		gameRelations: [
			{ targetId: "xiangyu", type: "family", label: "霸王别姬", description: "生死相随" },
		],
	},
};

/** 发角色的 id 列表（用于抽卡池、图鉴等遍历） */
export const CHARACTER_IDS = Object.keys(CHARACTER_GAME_META);
