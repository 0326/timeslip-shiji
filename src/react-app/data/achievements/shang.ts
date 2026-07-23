// 系列 shang · 商（殷本纪）成就。每条主角线一枚通关成就。
import type { Achievement } from "../../types/achievement";

export const shangAchievements: Record<string, Achievement> = {
	tang_geming: {
		id: "tang_geming",
		name: "网开三面",
		description: "走完成汤的一生——去网三面、吊民伐罪，以德服天下而建商",
		classicalQuote: "汤德至矣，及禽兽。",
		type: "story",
		points: 200,
		icon: "🕊️",
	},
	yiyin_taijia: {
		id: "yiyin_taijia",
		name: "伊尹放太甲",
		description: "走完伊尹的一生——负鼎干汤、放太甲于桐宫，大权在握而终归于忠",
		classicalQuote: "帝太甲居桐宫三年，悔过自责，反善，于是伊尹乃迎帝太甲而授之政。",
		type: "story",
		points: 220,
		icon: "⚖️",
	},
	wuding_zhongxing: {
		id: "wuding_zhongxing",
		name: "版筑举贤",
		description: "走完武丁的一生——三年不言、梦求圣人，举傅说于版筑刑徒而成中兴",
		classicalQuote: "得而与之语，果圣人，举以为相，殷国大治。",
		type: "story",
		points: 200,
		icon: "🔨",
	},
	yin_jian: {
		id: "yin_jian",
		name: "殷鉴不远",
		description: "走完帝辛（纣）的一生——资辨绝人却拒谏饰非，六百年商朝亡于牧野一战",
		classicalQuote: "我生不有命在天乎！",
		type: "story",
		points: 200,
		icon: "🔥",
	},
};
