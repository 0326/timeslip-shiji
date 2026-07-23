// 系列 chuhan · 楚汉相争（卷7,8,90,91,92 及相关列传）。
// 七条主角线（项羽/刘邦/韩信/张良/陈胜/彭越/英布）均为多幕成长弧线 ink。
import { withSeries } from "./_series";

export const chuhanStorylines = withSeries("chuhan", [
	{
		id: "chuhan_xiangyu_ink",
		title: "西楚霸王 · 项羽",
		subtitle: "楚汉相争 · 项羽",
		era: "chu_han",
		year: "公元前 232 — 202 年",
		cover: "#c0392b",
		glyph: "羽",
		description:
			"力能扛鼎，才气过人。你将穿越成项羽，从会稽起兵到破釜沉舟、鸿门放虎、垓下悲歌——亲历一个「力与刚愎」的英雄如何一步步走向乌江。八幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "xiangyu",
		relatedCharacters: ["xiangyu", "liubang", "fanzeng", "fankuai", "yuji", "xiangliang", "songyi"],
		perspectives: [
			{ characterId: "xiangyu", storyKey: "xiangyu:chuhan", unlockedBy: "xiangyu", nodeCount: 9 },
		],
	},
	{
		id: "chuhan_liubang_ink",
		title: "汉高祖 · 刘邦",
		subtitle: "楚汉相争 · 刘邦",
		era: "chu_han",
		year: "公元前 256 — 195 年",
		cover: "#d4af5a",
		glyph: "邦",
		description:
			"起于泗水亭长，能屈能伸、知人善任。你将穿越成刘邦，从芒砀斩蛇到约法三章、鸿门低头、暗度陈仓，终登帝位——亲历一个「能屈与猜忌」的开国之君。八幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "liubang",
		relatedCharacters: ["liubang", "xiangyu", "xiaohe", "zhangliang", "fankuai", "hanxin", "jixin", "baishe"],
		perspectives: [
			{ characterId: "liubang", storyKey: "liubang:chuhan", unlockedBy: "liubang", nodeCount: 10 },
		],
	},
	{
		id: "chuhan_hanxin_ink",
		title: "兵仙韩信 · 一生",
		subtitle: "楚汉相争 · 韩信",
		era: "chu_han",
		year: "公元前 231 — 196 年",
		cover: "#1a6b8a",
		glyph: "信",
		description:
			"一柄长剑，半世飘零。你将穿越成韩信，从胯下之辱到登坛拜将、背水一战、蒯通三分，终于钟室之祸——亲历一个「忍与不知止足」的兵仙一生。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "hanxin",
		relatedCharacters: ["hanxin", "xiaohe", "liubang", "xiangyu", "kuaitong", "piaomu"],
		perspectives: [
			{ characterId: "hanxin", storyKey: "hanxin:chuhan", unlockedBy: "hanxin", nodeCount: 8 },
		],
	},
	{
		id: "chuhan_zhangliang_ink",
		title: "谋圣张良",
		subtitle: "楚汉相争 · 张良",
		era: "chu_han",
		year: "公元前 250 — 186 年",
		cover: "#b8973a",
		glyph: "良",
		description:
			"国破家亡，血仇入骨。你将穿越成张良，从博浪沙椎击秦皇的莽勇，到圯上受书的隐忍开悟，运筹帷幄佐汉定天下，终于功成身退——亲历一个「复仇→悟道→帝王师→身退」的谋圣一生。九幕成长弧线，与韩信「不知止足」互文。",
		estimatedMinutes: 20,
		difficulty: 4,
		focusCharacter: "zhangliang",
		relatedCharacters: ["zhangliang", "liubang", "xiangyu", "huangshigong", "hancheng", "fankuai"],
		perspectives: [
			{ characterId: "zhangliang", storyKey: "zhangliang:chuhan", unlockedBy: "zhangliang", nodeCount: 18 },
		],
	},
	{
		id: "chuhan_chensheng_ink",
		title: "首义陈胜",
		subtitle: "楚汉相争 · 陈胜",
		era: "chu_han",
		year: "公元前 209 — 208 年",
		cover: "#c8503c",
		glyph: "涉",
		description:
			"燕雀安知鸿鹄之志。你将穿越成陈胜，从田垄佣耕的不甘，到大泽乡揭竿「王侯将相宁有种乎」，点燃反秦燎原之火，却在骤贵而骄中速亡——亲历一个「鸿鹄之志→首义燎原→骤贵而亡」的首义悲剧。六幕成长弧线，多结局。",
		estimatedMinutes: 14,
		difficulty: 3,
		focusCharacter: "chensheng",
		relatedCharacters: ["chensheng", "wuguang", "zhanger", "chenyu", "zhuangjia"],
		perspectives: [
			{ characterId: "chensheng", storyKey: "chensheng:chuhan", unlockedBy: "chensheng", nodeCount: 7 },
		],
	},
	{
		id: "chuhan_pengyue_ink",
		title: "梁王彭越 · 游击断粮",
		subtitle: "楚汉相争 · 彭越",
		era: "chu_han",
		year: "公元前 ? — 196 年",
		cover: "#6b8f5a",
		glyph: "越",
		description:
			"钜野泽中一渔盗，令行斩后而众服。你将穿越成彭越，往来梁地为汉游兵、数绝楚军粮道，助汉困死项羽而封梁王——却因称病不会、拥兵观望、首鼠自保，终被诬谋反、夷三族、醢其肉遍赐诸侯。亲历一个「游击之才困于首鼠」的开国功臣悲剧。六幕成长弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 4,
		focusCharacter: "pengyue",
		relatedCharacters: ["pengyue", "liubang", "xiangyu", "zhangliang", "lvhou", "luanbu"],
		perspectives: [
			{ characterId: "pengyue", storyKey: "pengyue:chuhan", unlockedBy: "pengyue", nodeCount: 4 },
		],
	},
	{
		id: "chuhan_yingbu_ink",
		title: "淮南王英布 · 当刑而王",
		subtitle: "楚汉相争 · 黥布",
		era: "chu_han",
		year: "公元前 ? — 195 年",
		cover: "#7a2f2f",
		glyph: "黥",
		description:
			"黥面刑徒，笑受「当刑而王」之谶。你将穿越成英布，为项羽先锋悍勇冠军、奉命弑义帝，随何一激而叛楚归汉、封淮南王——却在韩信彭越被诛后兔死狐悲而反，有勇少谋、反计只出下策，兵败番阳被诱杀。亲历一个「悍勇而反复无义」的应谶之王。七幕成长弧线，多结局。",
		estimatedMinutes: 17,
		difficulty: 4,
		focusCharacter: "yingbu",
		relatedCharacters: ["yingbu", "xiangyu", "liubang", "suihe", "xuegong"],
		perspectives: [
			{ characterId: "yingbu", storyKey: "yingbu:chuhan", unlockedBy: "yingbu", nodeCount: 6 },
		],
	},
]);
