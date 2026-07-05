// 场景视觉资产：无需图片，用渐变与徽记占位呈现水墨意境。
// 背景：CSS 渐变；立绘：单字徽记 + 主题色。

export interface BgStyle {
	label: string;
	css: string;
}

export const baseBackgrounds: Record<string, BgStyle> = {
	default: {
		label: "",
		css: "radial-gradient(ellipse at 50% 30%, #1c1a16, #0d0b08)",
	},
	tent_night: {
		label: "鸿门 · 夜",
		css: "linear-gradient(180deg, #14110d 0%, #1c1814 55%, #0d0b08 100%), radial-gradient(ellipse at 70% 20%, rgba(192,57,43,0.18), transparent 60%)",
	},
	tent_feast: {
		label: "鸿门 · 帐宴",
		css: "linear-gradient(180deg, #221a12 0%, #1a130d 60%, #0d0b08 100%), radial-gradient(ellipse at 40% 25%, rgba(212,175,90,0.16), transparent 55%)",
	},
	huaiyin_street: {
		label: "淮阴 · 市井",
		css: "linear-gradient(180deg, #1e1c17 0%, #15130f 60%, #0d0b08 100%)",
	},
	riverside: {
		label: "城下 · 河畔",
		css: "linear-gradient(180deg, #11161a 0%, #0f1316 55%, #0b0d0e 100%), radial-gradient(ellipse at 50% 80%, rgba(26,107,138,0.22), transparent 60%)",
	},
	camp_chu: {
		label: "西楚 · 军营",
		css: "linear-gradient(180deg, #1f1310 0%, #170e0c 60%, #0d0807 100%), radial-gradient(ellipse at 60% 30%, rgba(192,57,43,0.14), transparent 55%)",
	},
	camp_han_night: {
		label: "汉中 · 夜营",
		css: "linear-gradient(180deg, #121418 0%, #0f1013 60%, #0a0b0d 100%), radial-gradient(ellipse at 30% 25%, rgba(212,175,90,0.12), transparent 55%)",
	},
	plank_road: {
		label: "栈道 · 陈仓",
		css: "linear-gradient(180deg, #1a1712 0%, #14110d 60%, #0c0a08 100%), radial-gradient(ellipse at 80% 70%, rgba(122,110,92,0.2), transparent 55%)",
	},
	jingxing: {
		label: "井陉 · 背水",
		css: "linear-gradient(180deg, #0f1418 0%, #0d1115 55%, #090c0e 100%), radial-gradient(ellipse at 50% 90%, rgba(26,107,138,0.28), transparent 55%)",
	},
	gaixia: {
		label: "垓下 · 围城",
		css: "linear-gradient(180deg, #181014 0%, #120c10 60%, #0b080a 100%), radial-gradient(ellipse at 50% 20%, rgba(192,57,43,0.16), transparent 55%)",
	},
	han_palace: {
		label: "长乐 · 钟室",
		css: "linear-gradient(180deg, #1b1510 0%, #15100c 60%, #0c0907 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.12), transparent 55%)",
	},
	palace: {
		label: "登坛 · 拜将",
		css: "linear-gradient(180deg, #241d10 0%, #1b150c 60%, #0e0a06 100%), radial-gradient(ellipse at 50% 28%, rgba(212,175,90,0.22), transparent 58%)",
	},
	// 五帝本纪 · 虞舜
	gui_river: {
		label: "妫水 · 舜居",
		css: "linear-gradient(180deg, #10201c 0%, #0d1815 55%, #0a100e 100%), radial-gradient(ellipse at 50% 80%, rgba(63,167,150,0.22), transparent 60%)",
	},
	granary_fire: {
		label: "焚廪 · 烈火",
		css: "linear-gradient(180deg, #2a1206 0%, #200d05 55%, #120704 100%), radial-gradient(ellipse at 50% 70%, rgba(215,90,30,0.4), transparent 55%)",
	},
	well_dark: {
		label: "穿井 · 井底",
		css: "linear-gradient(180deg, #0a0d10 0%, #070a0c 60%, #050708 100%), radial-gradient(ellipse at 50% 10%, rgba(120,140,150,0.16), transparent 45%)",
	},
	shun_house: {
		label: "舜宫 · 归来",
		css: "linear-gradient(180deg, #1a1712 0%, #14110d 60%, #0c0a08 100%), radial-gradient(ellipse at 50% 35%, rgba(63,167,150,0.12), transparent 55%)",
	},
	// 五帝 · 黄帝
	xuanyuan_qiu: { label: "轩辕 · 丘", css: "linear-gradient(180deg, #1c1610 0%, #16110c 55%, #0d0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(201,162,39,0.16), transparent 58%)" },
	zhuhou_luan: { label: "诸侯 · 相侵", css: "linear-gradient(180deg, #241009 0%, #1a0c07 58%, #100604 100%), radial-gradient(ellipse at 50% 75%, rgba(192,57,43,0.28), transparent 55%)" },
	banquan_ye: { label: "阪泉 · 之野", css: "linear-gradient(180deg, #141a14 0%, #10150f 55%, #0a0e09 100%), radial-gradient(ellipse at 50% 82%, rgba(120,140,90,0.22), transparent 60%)" },
	huangdi_court: { label: "轩辕 · 帐议", css: "linear-gradient(180deg, #1f1a12 0%, #17120c 60%, #0d0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(192,57,43,0.14), transparent 55%)" },
	zhuolu_field: { label: "涿鹿 · 战野", css: "linear-gradient(180deg, #211610 0%, #1a100b 55%, #0e0806 100%), radial-gradient(ellipse at 50% 75%, rgba(168,60,40,0.28), transparent 55%)" },
	zhuolu_fog: { label: "涿鹿 · 大雾", css: "linear-gradient(180deg, #2b2e30 0%, #212426 55%, #141617 100%), radial-gradient(ellipse at 50% 40%, rgba(210,214,216,0.24), transparent 50%)" },
	xuanyuan_court: { label: "轩辕之庭", css: "linear-gradient(180deg, #201a12 0%, #18130d 60%, #0d0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(201,162,39,0.16), transparent 55%)" },
	taishan_peak: { label: "泰山之巅", css: "linear-gradient(180deg, #101820 0%, #0d131a 55%, #0a0e12 100%), radial-gradient(ellipse at 50% 20%, rgba(150,180,210,0.22), transparent 60%)" },
	// 五帝 · 颛顼帝喾
	gaoyang_court: { label: "高阳 · 受命", css: "linear-gradient(180deg, #14201c 0%, #0f1815 55%, #0a100e 100%), radial-gradient(ellipse at 50% 25%, rgba(74,122,156,0.20), transparent 55%)" },
	gaoyang_field: { label: "高阳 · 田野星象", css: "linear-gradient(180deg, #101c1a 0%, #0d1613 60%, #090f0d 100%), radial-gradient(ellipse at 50% 80%, rgba(63,167,150,0.20), transparent 60%)" },
	xingye_night: { label: "承天 · 星夜", css: "linear-gradient(180deg, #0c0e18 0%, #090b12 55%, #06070c 100%), radial-gradient(ellipse at 50% 20%, rgba(127,214,224,0.16), transparent 55%)" },
	gaoxin_court: { label: "高辛 · 执中", css: "linear-gradient(180deg, #1a1420 0%, #140f18 60%, #0c0810 100%), radial-gradient(ellipse at 50% 30%, rgba(138,109,176,0.16), transparent 55%)" },
	// 五帝 · 帝尧
	yao_court: { label: "平阳 · 尧庭", css: "linear-gradient(180deg, #1c1810 0%, #16120c 60%, #0c0907 100%), radial-gradient(ellipse at 50% 30%, rgba(201,162,39,0.20), transparent 58%)" },
	yanggu_sun: { label: "旸谷 · 宾日", css: "linear-gradient(180deg, #2a1f0a 0%, #201705 55%, #120c04 100%), radial-gradient(ellipse at 50% 22%, rgba(230,168,58,0.42), transparent 55%)" },
	winter_dark: { label: "幽都 · 长夜", css: "linear-gradient(180deg, #0a0d14 0%, #070a10 60%, #05070a 100%), radial-gradient(ellipse at 50% 12%, rgba(120,140,180,0.16), transparent 45%)" },
	flood_sky: { label: "鸿水 · 滔天", css: "linear-gradient(180deg, #0d181c 0%, #0a1215 55%, #070d0f 100%), radial-gradient(ellipse at 50% 85%, rgba(38,120,150,0.34), transparent 55%)" },
	great_forest: { label: "大麓 · 雷雨", css: "linear-gradient(180deg, #0c130f 0%, #0a0f0c 55%, #060908 100%), radial-gradient(ellipse at 50% 20%, rgba(90,120,110,0.22), transparent 55%)" },
	nanhe: { label: "南河 · 让辟", css: "linear-gradient(180deg, #11161a 0%, #0f1316 55%, #0a0d0e 100%), radial-gradient(ellipse at 50% 80%, rgba(63,167,150,0.18), transparent 60%)" },
	// 五帝 · 虞舜（续）
	simen_court: { label: "四门 · 辟贤", css: "linear-gradient(180deg, #141a1c 0%, #0f1518 55%, #0a0e10 100%), radial-gradient(ellipse at 50% 28%, rgba(74,122,156,0.20), transparent 58%)" },
	siyi_liufang: { label: "四裔 · 流放", css: "linear-gradient(180deg, #1a1410 0%, #14100c 55%, #0c0806 100%), radial-gradient(ellipse at 50% 80%, rgba(120,110,90,0.24), transparent 55%)" },
	mingtang_xing: { label: "明堂 · 议刑", css: "linear-gradient(180deg, #1a1c22 0%, #14161b 55%, #0c0d10 100%), radial-gradient(ellipse at 50% 28%, rgba(90,110,150,0.16), transparent 55%)" },
	wenzu_temple: { label: "文祖 · 组阁", css: "linear-gradient(180deg, #1a1c18 0%, #14150f 55%, #0c0d08 100%), radial-gradient(ellipse at 50% 28%, rgba(201,162,39,0.18), transparent 58%)" },
	zuge_court: { label: "虞庭 · 授职", css: "linear-gradient(180deg, #142018 0%, #0f1813 55%, #0a100c 100%), radial-gradient(ellipse at 50% 30%, rgba(63,167,150,0.20), transparent 58%)" },
	yuewu_court: { label: "典乐 · 百兽率舞", css: "linear-gradient(180deg, #1a1420 0%, #140f18 60%, #0c0810 100%), radial-gradient(ellipse at 50% 70%, rgba(138,109,176,0.22), transparent 55%)" },
	disorder_court: { label: "庶事 · 隳坏", css: "linear-gradient(180deg, #201009 0%, #180c07 58%, #100604 100%), radial-gradient(ellipse at 50% 75%, rgba(120,60,40,0.26), transparent 55%)" },
	yushun_court: { label: "有虞 · 帝庭", css: "linear-gradient(180deg, #16201a 0%, #111813 58%, #0a100c 100%), radial-gradient(ellipse at 50% 28%, rgba(63,167,150,0.18), transparent 58%)" },
	cangwu_ye: { label: "苍梧 · 之野", css: "linear-gradient(180deg, #14161f 0%, #0f1017 58%, #0a0b10 100%), radial-gradient(ellipse at 50% 75%, rgba(90,100,140,0.20), transparent 55%)" },
	jiuyi_shan: { label: "九疑 · 山陵", css: "linear-gradient(180deg, #131a1e 0%, #0f1418 58%, #0a0e10 100%), radial-gradient(ellipse at 50% 30%, rgba(74,110,120,0.18), transparent 58%)" },
	xiang_bamboo: { label: "湘水 · 斑竹", css: "linear-gradient(180deg, #101d18 0%, #0c1512 58%, #080f0c 100%), radial-gradient(ellipse at 50% 60%, rgba(63,167,150,0.22), transparent 55%)" },
	// 夏
	xia_court: { label: "夏后 · 受禅", css: "linear-gradient(180deg, #1e1a12 0%, #17130d 60%, #0d0a07 100%), radial-gradient(ellipse at 50% 28%, rgba(58,110,165,0.18), transparent 58%)" },
	xia_court_cold: { label: "夏庭 · 政隳", css: "linear-gradient(180deg, #141516 0%, #0f1011 60%, #090a0b 100%), radial-gradient(ellipse at 50% 30%, rgba(80,90,100,0.14), transparent 55%)" },
	yangcheng: { label: "阳城 · 让辟", css: "linear-gradient(180deg, #15201a 0%, #101813 55%, #0a100d 100%), radial-gradient(ellipse at 50% 78%, rgba(63,167,150,0.18), transparent 60%)" },
	xia_terrace: { label: "夏台 · 玉阶", css: "linear-gradient(180deg, #201a10 0%, #18130b 58%, #0e0a06 100%), radial-gradient(ellipse at 50% 30%, rgba(138,51,36,0.20), transparent 55%)" },
	tang_realm: { label: "商汤 · 修德之国", css: "linear-gradient(180deg, #131e18 0%, #0f1713 58%, #0a100c 100%), radial-gradient(ellipse at 50% 32%, rgba(63,122,92,0.20), transparent 58%)" },
	mingtiao_war: { label: "鸣条 · 溃战", css: "linear-gradient(180deg, #200f0a 0%, #180b07 58%, #100604 100%), radial-gradient(ellipse at 50% 75%, rgba(168,50,40,0.28), transparent 55%)" },
	nanchao_exile: { label: "南巢 · 放死", css: "linear-gradient(180deg, #16150f 0%, #11100b 60%, #0a0906 100%), radial-gradient(ellipse at 50% 70%, rgba(110,105,80,0.18), transparent 55%)" },
};

// 立绘占位：包含主卡池角色与剧情 NPC
export interface SpriteInfo {
	name: string;
	glyph: string;
	accent: string;
}

export const baseSprites: Record<string, SpriteInfo> = {
	// 系统少女：悬浮月牙上的古风可爱旁白者，全程陪伴穿越者
	qingyue: { name: "青月", glyph: "月", accent: "#7fd6e0" },
	// 五帝本纪
	shun: { name: "舜", glyph: "舜", accent: "#3fa796" },
	yao: { name: "尧", glyph: "尧", accent: "#c9a227" },
	gusou: { name: "瞽叟", glyph: "瞽", accent: "#6b5a48" },
	xiang: { name: "象", glyph: "象", accent: "#a85d3a" },
	huangdi: { name: "黄帝", glyph: "黄", accent: "#c0392b" },
	yandi: { name: "炎帝", glyph: "炎", accent: "#d35400" },
	chiyou: { name: "蚩尤", glyph: "蚩", accent: "#7a2f2f" },
	zhuanxu: { name: "颛顼", glyph: "顼", accent: "#4a7a9c" },
	diku: { name: "帝喾", glyph: "喾", accent: "#8a6db0" },
	xihe: { name: "羲和", glyph: "羲", accent: "#d98c3a" },
	danzhu: { name: "丹朱", glyph: "丹", accent: "#b8557a" },
	gonggong: { name: "共工", glyph: "工", accent: "#4a7a8c" },
	gun: { name: "鲧", glyph: "鲧", accent: "#55707a" },
	siyue: { name: "四岳", glyph: "岳", accent: "#7a8a5c" },
	ehuang: { name: "娥皇", glyph: "娥", accent: "#c96f8a" },
	nvying: { name: "女英", glyph: "英", accent: "#7a8fc9" },
	gaoyao: { name: "皋陶", glyph: "皋", accent: "#3a4a6b" },
	yu: { name: "禹", glyph: "禹", accent: "#3a6ea5" },
	houji: { name: "后稷", glyph: "稷", accent: "#b8973a" },
	xie: { name: "契", glyph: "契", accent: "#8a6f4a" },
	kui: { name: "夔", glyph: "夔", accent: "#7a5c8a" },
	shangjun: { name: "商均", glyph: "均", accent: "#8a7a5c" },
	tushan: { name: "涂山", glyph: "涂", accent: "#b8557a" },
	qi: { name: "启", glyph: "启", accent: "#b8873a" },
	yi: { name: "伯益", glyph: "益", accent: "#5a8f6b" },
	youhu: { name: "有扈氏", glyph: "扈", accent: "#7a2f2f" },
	jie: { name: "桀", glyph: "桀", accent: "#8a3324" },
	tang: { name: "汤", glyph: "汤", accent: "#3f7a5c" },
	// 楚汉
	hanxin: { name: "韩信", glyph: "信", accent: "#1a6b8a" },
	xiangyu: { name: "项羽", glyph: "羽", accent: "#c0392b" },
	zhangliang: { name: "张良", glyph: "良", accent: "#b8973a" },
	liubang: { name: "刘邦", glyph: "邦", accent: "#d4af5a" },
	xiaohe: { name: "萧何", glyph: "何", accent: "#5a8f6b" },
	fanzeng: { name: "范增", glyph: "增", accent: "#7a6e5c" },
	fankuai: { name: "樊哙", glyph: "哙", accent: "#a85d3a" },
	yuji: { name: "虞姬", glyph: "虞", accent: "#b8557a" },
	// NPC
	tuzhong: { name: "屠中少年", glyph: "屠", accent: "#6b5a48" },
	piaomu: { name: "漂母", glyph: "漂", accent: "#5a8f6b" },
	kuaitong: { name: "蒯通", glyph: "蒯", accent: "#8a6f4a" },
};

