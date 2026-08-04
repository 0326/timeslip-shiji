// 系列 qunxiang · 游侠刺客列传 立绘/背景。
import type { SpriteInfo, BgStyle } from "./base";

export const qunxiangSprites: Record<string, SpriteInfo> = {
	guojie: { name: "郭解", glyph: "解", accent: "#8a6f4a", full: "/assets/figures/guojie/classical/portrait/full-default.png" },
	zhuke: { name: "朱家", glyph: "朱", accent: "#6b7a5c", full: "/assets/figures/zhuke/classical/portrait/full-default.png" },
	zhuanzhu: { name: "专诸", glyph: "诸", accent: "#a85d3a", full: "/assets/figures/zhuanzhu/classical/portrait/full-default.png" },
	gongziguang: { name: "公子光", glyph: "光", accent: "#c0392b", full: "/assets/figures/gongziguang/classical/portrait/full-default.png" },
	wuliao: { name: "吴王僚", glyph: "僚", accent: "#7a5c8a", full: "/assets/figures/wuliao/classical/portrait/full-default.png" },
	jumeng: {
		name: "剧孟",
		glyph: "剧",
		accent: "#8a7a4a",
		full: "/assets/figures/jumeng/classical/portrait/full-default.png",
	},
	niezheng: {
		name: "聂政",
		glyph: "聂",
		accent: "#a85d3a",
		full: "/assets/figures/niezheng/classical/portrait/full-default.png",
	},
	yurang: {
		name: "豫让",
		glyph: "豫",
		accent: "#6a5a7a",
		full: "/assets/figures/yurang/classical/portrait/full-default.png",
	},
};

export const qunxiangBackgrounds: Record<string, BgStyle> = {
	market_street: {
		label: "市井 · 街巷",
		css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 70%, rgba(184,151,58,0.14), transparent 55%)",
		image: "/assets/backgrounds/wudi/market_street.jpg",
	},
	luoyang_street: {
		label: "洛阳 · 街巷",
		css: "linear-gradient(180deg, #181612 0%, #12100c 60%, #0a0907 100%), radial-gradient(ellipse at 50% 75%, rgba(150,130,80,0.16), transparent 55%)",
		image: "/assets/backgrounds/wudi/luoyang_street.jpg",
	},
	remote_village: {
		label: "边远 · 村落",
		css: "linear-gradient(180deg, #141612 0%, #0f110d 60%, #090a07 100%), radial-gradient(ellipse at 50% 75%, rgba(100,120,80,0.16), transparent 55%)",
		image: "/assets/backgrounds/wudi/remote_village.jpg",
	},
	wu_palace: {
		label: "吴宫 · 殿宴",
		css: "linear-gradient(180deg, #1a1018 0%, #140c12 60%, #0c0809 100%), radial-gradient(ellipse at 50% 30%, rgba(150,60,90,0.18), transparent 55%)",
		image: "/assets/backgrounds/wudi/wu_palace.jpg",
	},
	wu_house: {
		label: "吴宅 · 寒舍",
		css: "linear-gradient(180deg, #15120e 0%, #100e0a 60%, #0a0806 100%), radial-gradient(ellipse at 50% 60%, rgba(120,100,70,0.16), transparent 55%)",
		image: "/assets/backgrounds/wudi/wu_house.jpg",
	},
	// 聂政线
	qi_market: {
		label: "齐市 · 屠狗",
		css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 75%, rgba(184,151,58,0.14), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/yan_market.jpg",
	},
	puyang_house: {
		label: "濮阳 · 客舍",
		css: "linear-gradient(180deg, #16140e 0%, #11100a 60%, #0a0806 100%), radial-gradient(ellipse at 50% 60%, rgba(120,100,70,0.18), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/lv_mansion.jpg",
	},
	han_xiangfu: {
		label: "韩都 · 相府",
		css: "linear-gradient(180deg, #1a1712 0%, #14110d 60%, #0c0a08 100%), radial-gradient(ellipse at 50% 28%, rgba(184,151,58,0.14), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/dai_wangfu.jpg",
	},
	han_street: {
		label: "韩都 · 街市",
		css: "linear-gradient(180deg, #181612 0%, #12100c 60%, #0a0907 100%), radial-gradient(ellipse at 50% 75%, rgba(150,130,80,0.16), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/changan_street.jpg",
	},
	// 豫让线
	jin_mountain: {
		label: "晋地 · 山野",
		css: "linear-gradient(180deg, #0f130f 0%, #0b0f0c 55%, #060908 100%), radial-gradient(ellipse at 50% 20%, rgba(90,120,110,0.22), transparent 55%)",
		image: "/assets/backgrounds/wudi/great_forest.jpg",
	},
	jin_palace: {
		label: "晋阳 · 宫殿",
		css: "linear-gradient(180deg, #1f1a12 0%, #17120c 60%, #0d0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.16), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/zhao_chaotang.jpg",
	},
	jin_street: {
		label: "晋阳 · 街巷",
		css: "linear-gradient(180deg, #181612 0%, #12100c 60%, #0a0907 100%), radial-gradient(ellipse at 50% 75%, rgba(150,130,80,0.16), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/changan_street.jpg",
	},
	jin_bridge: {
		label: "晋水 · 桥畔",
		css: "linear-gradient(180deg, #11161a 0%, #0f1316 55%, #0a0d0e 100%), radial-gradient(ellipse at 50% 80%, rgba(63,167,150,0.18), transparent 60%)",
		image: "/assets/backgrounds/wudi/ref/riverside.jpg",
	},
	jin_house: {
		label: "晋宅 · 寒舍",
		css: "linear-gradient(180deg, #15120e 0%, #100e0a 60%, #0a0806 100%), radial-gradient(ellipse at 50% 60%, rgba(120,100,70,0.16), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/lv_mansion.jpg",
	},
	// 剧孟线
	luoyang_mansion: {
		label: "洛阳 · 旧宅",
		css: "linear-gradient(180deg, #16140e 0%, #11100a 60%, #0a0806 100%), radial-gradient(ellipse at 50% 50%, rgba(120,100,70,0.18), transparent 55%)",
		image: "/assets/backgrounds/wudi/ref/luoyang_guixiang.jpg",
	},
	riverside_alt1: { label: "渭水 · 畔", css: "linear-gradient(180deg, #10201c 0%, #0d1815 55%, #0a100e 100%), radial-gradient(ellipse at 50% 80%, rgba(63,167,150,0.22), transparent 60%)", image: "/assets/backgrounds/wudi/weishui.jpg" },
	riverside_alt2: { label: "河畔 · 遥祭", css: "linear-gradient(180deg, #11161a 0%, #0f1316 55%, #0a0d0e 100%), radial-gradient(ellipse at 50% 80%, rgba(63,167,150,0.18), transparent 60%)", image: "/assets/backgrounds/wudi/nanhe.jpg" },
	qi_market_alt1: { label: "齐市 · 屠狗", css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 75%, rgba(184,151,58,0.14), transparent 55%)", image: "/assets/backgrounds/wudi/ref/xianyang_market.jpg" },
	luoyang_street_alt1: { label: "洛阳 · 侠行", css: "linear-gradient(180deg, #181612 0%, #12100c 60%, #0a0907 100%), radial-gradient(ellipse at 50% 75%, rgba(150,130,80,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/ref/changan_street.jpg" },
};
