// 系列 chuhan · 楚汉相争 成就。（韩信线通关复用 base 的 bingxian_born）
import type { Achievement } from "../../types/achievement";

export const chuhanAchievements: Record<string, Achievement> = {
	xiangyu_wujiang: {
		id: "xiangyu_wujiang",
		name: "乌江 · 无颜",
		description: "走到乌江自刎的史实终局——宁死不辱的西楚霸王",
		classicalQuote: "籍与江东子弟八千人渡江而西，今无一人还，纵江东父兄怜而王我，我何面目见之！",
		type: "story",
		points: 200,
		icon: "🌊",
	},
	liubang_yuefa: {
		id: "liubang_yuefa",
		name: "约法三章",
		description: "忍下秦宫一夜富贵，以九字废尽秦苛法，赢下民心之仗",
		classicalQuote: "与父老约，法三章耳：杀人者死，伤人及盗抵罪。",
		type: "historical",
		points: 200,
		icon: "📜",
	},
	liubang_sanjie: {
		id: "liubang_sanjie",
		name: "汉初三杰",
		description: "运筹张良、镇国萧何、连兵韩信——以能用人而取天下",
		classicalQuote: "此三者，皆人杰也，吾能用之，此吾所以取天下也。",
		type: "historical",
		points: 200,
		icon: "🎖️",
	},
	liubang_dafeng: {
		id: "liubang_dafeng",
		name: "大风起兮",
		description: "从泗水亭长到汜水称帝，唱罢《大风歌》——威加海内者的孤独",
		classicalQuote: "大风起兮云飞扬，威加海内兮归故乡，安得猛士兮守四方！",
		type: "story",
		points: 250,
		icon: "🌪️",
	},
};
