// 系列 hanwu · 汉武盛世 成就。
import type { Achievement } from "../../types/achievement";

export const hanwuAchievements: Record<string, Achievement> = {
	hanwudi_luntai: {
		id: "hanwudi_luntai",
		name: "轮台一诏",
		description: "走完汉武帝的一生——从独尊儒术到轮台罪己，雄主的功过与迟暮的悔悟",
		classicalQuote: "朕即位以来，所为狂悖，使天下愁苦，不可追悔。",
		type: "story",
		points: 250,
		icon: "🏛️",
	},
	liguang_nanfeng: {
		id: "liguang_nanfeng",
		name: "李广难封",
		description: "走完飞将军李广的一生——射石搏虎、大小七十余战，终以数奇自刎",
		classicalQuote: "广结发与匈奴大小七十余战……终不能复对刀笔之吏。",
		type: "story",
		points: 200,
		icon: "🏹",
	},
	weiqing_huo: {
		id: "weiqing_huo",
		name: "封狼居胥",
		description: "走完卫霍双璧的戎马——龙城飞将、漠南无王庭，少年英雄封狼居胥",
		classicalQuote: "匈奴未灭，无以家为也。",
		type: "historical",
		points: 250,
		icon: "🐎",
	},
	zhangqian_zaokong: {
		id: "zhangqian_zaokong",
		name: "凿空西域",
		description: "走完博望侯张骞的西行——十三年持节不失，凿空万里西域道",
		classicalQuote: "骞持汉节不失……于是西北国始通于汉矣。",
		type: "story",
		points: 250,
		icon: "🐫",
	},
	zhufuyan_tuien: {
		id: "zhufuyan_tuien",
		name: "推恩削藩",
		description: "走完主父偃的起落——一年四迁、推恩令出，倒行暴施终致族灭",
		classicalQuote: "吾日暮途远，故倒行暴施之。",
		type: "story",
		points: 200,
		icon: "📜",
	},
};
