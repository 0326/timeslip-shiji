import type { GachaPool } from "../types/gacha";

// 楚汉争霸·首发卡池：8 角色，权重均等（无星级，避免 SSR 焦虑）
export const CURRENT_POOL: GachaPool = {
	id: "chu_han_1",
	name: "楚汉争霸 · 首发",
	era: "chu_han",
	rules: {
		pityAt: 15, // 连续 15 抽未出新，第 16 抽强制出新
		fragmentsOnDuplicate: 1, // 重复转 1 记忆碎片
	},
	characters: [
		{ characterId: "hanxin", weight: 10 },
		{ characterId: "xiangyu", weight: 10 },
		{ characterId: "zhangliang", weight: 10 },
		{ characterId: "liubang", weight: 10 },
		{ characterId: "xiaohe", weight: 10 },
		{ characterId: "fanzeng", weight: 10 },
		{ characterId: "fankuai", weight: 10 },
		{ characterId: "yuji", weight: 10 },
	],
};

// 碎片兑换价目
export const FRAGMENT_COSTS = {
	character: 10, // 10 碎片兑换任意指定角色
};

// 抽卡券获取途径（用于展示）
export const TICKET_SOURCES = [
	{ id: "checkin", label: "每日签到", reward: "+1 抽卡券", limit: "每日 1 次" },
	{ id: "streak7", label: "连续签到 7 天", reward: "+5 抽卡券", limit: "每周 1 次" },
	{ id: "clear", label: "通关故事线", reward: "+2 抽卡券", limit: "每视角 1 次" },
	{ id: "read", label: "阅读完整原文", reward: "+1 抽卡券", limit: "每篇 1 次" },
	{ id: "share", label: "分享成就卡片", reward: "+1 抽卡券", limit: "每日上限 3 次" },
];
