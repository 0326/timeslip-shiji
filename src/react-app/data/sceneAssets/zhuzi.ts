import type { BgStyle, SpriteInfo } from "./base";

export const zhuziSprites: Record<string, SpriteInfo> = {
	mengzi: { name: "孟子", glyph: "孟", accent: "#5a8ac9" },
	qixuanwang: { name: "齐宣王", glyph: "宣", accent: "#8a6a4a" },
	huizi: { name: "惠子", glyph: "惠", accent: "#5a7a9c" },
	chushi: { name: "楚使", glyph: "使", accent: "#6a4a6a" },
	xunzi: { name: "荀子", glyph: "荀", accent: "#7a6a5a" },
	zhuangzi: { name: "庄子", glyph: "庄", accent: "#5a9c8a" },
	hanfei: { name: "韩非", glyph: "韩", accent: "#8a3a3a" },
	zouyan: { name: "邹衍", glyph: "邹", accent: "#b8873a" },
	mozhai: { name: "墨翟", glyph: "墨", accent: "#3a3a3a" },
	lihui: { name: "梁惠王", glyph: "惠", accent: "#8a6a4a" },
	chuxuanwang: { name: "楚宣王", glyph: "宣", accent: "#6a4a6a" },
	lisi: { name: "李斯", glyph: "李", accent: "#6a5a7a" },
	qinwang: { name: "秦王", glyph: "秦", accent: "#8a3324" },
	gongshuban: { name: "公输般", glyph: "般", accent: "#6a6a6a" },
	songwang: { name: "楚王", glyph: "楚", accent: "#6a3a3a" },
	jinanguo: { name: "稷下学者", glyph: "稷", accent: "#5a7a9c" },
	// 孔子线（自 chunqiu 迁入）
	kongzi: { name: "孔子", glyph: "孔", accent: "#c9a227" },
	laozi: { name: "老子", glyph: "老", accent: "#9aa0a6" },
	zilu: { name: "子路", glyph: "路", accent: "#a85d3a" },
	yanhui: { name: "颜回", glyph: "回", accent: "#5a8f6b" },
	jihuanzi: { name: "季桓子", glyph: "季", accent: "#7a6e5c" },
};

export const zhuziBackgrounds: Record<string, BgStyle> = {
	qi_court: {
		label: "临淄 · 齐廷",
		css: "linear-gradient(180deg, #1a1810 0%, #14120b 60%, #0c0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(184,150,70,0.18), transparent 55%)",
	},
	daliang_court: {
		label: "大梁 · 魏廷",
		css: "linear-gradient(180deg, #1a1820 0%, #141018 60%, #0c0a10 100%), radial-gradient(ellipse at 50% 30%, rgba(138,106,74,0.20), transparent 55%)",
	},
	qi_jixia: {
		label: "临淄 · 稷下",
		css: "linear-gradient(180deg, #151a20 0%, #10151a 60%, #0a0d12 100%), radial-gradient(ellipse at 50% 70%, rgba(90,122,156,0.22), transparent 55%)",
	},
	haoshui_bridge: {
		label: "濠水 · 桥上",
		css: "linear-gradient(180deg, #101c1a 0%, #0c1513 60%, #080f0d 100%), radial-gradient(ellipse at 50% 80%, rgba(90,156,138,0.28), transparent 55%)",
	},
	chuye_garden: {
		label: "楚野 · 濮水",
		css: "linear-gradient(180deg, #121816 0%, #0e1210 60%, #080c0a 100%), radial-gradient(ellipse at 30% 60%, rgba(74,122,100,0.20), transparent 55%)",
	},
	qindu_xianyang: {
		label: "咸阳 · 秦宫",
		css: "linear-gradient(180deg, #1f1210 0%, #180d0c 60%, #100808 100%), radial-gradient(ellipse at 50% 25%, rgba(184,135,58,0.18), transparent 55%)",
	},
	qin_prison: {
		label: "云阳 · 狱",
		css: "linear-gradient(180deg, #0f0c0d 0%, #0a0809 60%, #060506 100%), radial-gradient(ellipse at 50% 30%, rgba(90,60,60,0.20), transparent 55%)",
	},
	yan_jieshi: {
		label: "燕 · 碣石宫",
		css: "linear-gradient(180deg, #141620 0%, #0f101a 60%, #0a0b10 100%), radial-gradient(ellipse at 50% 20%, rgba(184,135,58,0.22), transparent 55%)",
	},
	song_city: {
		label: "郢都 · 楚廷",
		css: "linear-gradient(180deg, #1a1410 0%, #140f0c 60%, #0c0807 100%), radial-gradient(ellipse at 50% 25%, rgba(106,58,58,0.18), transparent 55%)",
	},
	song_wall: {
		label: "楚宋 · 城防",
		css: "linear-gradient(180deg, #181a18 0%, #121412 60%, #0c0d0c 100%), radial-gradient(ellipse at 50% 70%, rgba(90,122,90,0.20), transparent 55%)",
	},
	lanling: {
		label: "兰陵 · 学舍",
		css: "linear-gradient(180deg, #161814 0%, #11130f 60%, #0b0c08 100%), radial-gradient(ellipse at 40% 60%, rgba(122,106,90,0.18), transparent 55%)",
	},
	zhu_book: {
		label: "著书 · 孤愤",
		css: "linear-gradient(180deg, #120f14 0%, #0e0b10 60%, #08070a 100%), radial-gradient(ellipse at 50% 50%, rgba(120,80,80,0.18), transparent 55%)",
	},
	wuyi_mud: {
		label: "涂中 · 曳尾",
		css: "linear-gradient(180deg, #101614 0%, #0c100f 60%, #060807 100%), radial-gradient(ellipse at 50% 85%, rgba(90,120,100,0.26), transparent 55%)",
	},
	xingye_night: {
		label: "星空 · 夜谈",
		css: "linear-gradient(180deg, #0a0d18 0%, #080a12 60%, #05060a 100%), radial-gradient(ellipse at 50% 20%, rgba(184,135,58,0.15), transparent 45%), radial-gradient(ellipse at 30% 40%, rgba(90,120,180,0.12), transparent 35%)",
	},
	// 孔子线（自 chunqiu 迁入）
	qufu_hao: { label: "曲阜 · 好礼", css: "linear-gradient(180deg, #16180f 0%, #11130b 58%, #0a0c07 100%), radial-gradient(ellipse at 50% 30%, rgba(150,160,90,0.16), transparent 55%)" },
	shizhou_li: { label: "适周 · 问礼", css: "linear-gradient(180deg, #14161c 0%, #0f1015 60%, #090a0e 100%), radial-gradient(ellipse at 50% 30%, rgba(120,130,160,0.14), transparent 55%)" },
	jiagu_hui: { label: "夹谷 · 之会", css: "linear-gradient(180deg, #1a1810 0%, #14120b 58%, #0c0a06 100%), radial-gradient(ellipse at 50% 28%, rgba(201,162,39,0.18), transparent 58%)" },
	zhouyou_lu: { label: "去鲁 · 周游", css: "linear-gradient(180deg, #16130f 0%, #110f0a 60%, #0a0806 100%), radial-gradient(ellipse at 50% 78%, rgba(120,110,90,0.18), transparent 55%)" },
	chencai_jue: { label: "陈蔡 · 绝粮", css: "linear-gradient(180deg, #131510 0%, #0e100b 60%, #080a06 100%), radial-gradient(ellipse at 50% 72%, rgba(100,110,80,0.16), transparent 55%)" },
	wenjin_yin: { label: "问津 · 隐者", css: "linear-gradient(180deg, #101614 0%, #0c110f 58%, #080c0a 100%), radial-gradient(ellipse at 50% 75%, rgba(90,130,110,0.16), transparent 55%)" },
	huolin_bi: { label: "获麟 · 绝笔", css: "linear-gradient(180deg, #14151a 0%, #0f1014 60%, #090a0d 100%), radial-gradient(ellipse at 50% 30%, rgba(150,150,170,0.14), transparent 50%)" },
};
