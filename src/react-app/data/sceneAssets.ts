// 场景视觉资产：无需图片，用渐变与徽记占位呈现水墨意境。
// 背景：CSS 渐变；立绘：单字徽记 + 主题色。

export interface BgStyle {
	label: string;
	css: string;
}

export const BACKGROUNDS: Record<string, BgStyle> = {
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
};

export function getBackground(key: string): BgStyle {
	return BACKGROUNDS[key] ?? BACKGROUNDS.default;
}

// 立绘占位：包含主卡池角色与剧情 NPC
export interface SpriteInfo {
	name: string;
	glyph: string;
	accent: string;
}

export const SPRITES: Record<string, SpriteInfo> = {
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

export function getSprite(id: string): SpriteInfo {
	return SPRITES[id] ?? { name: id, glyph: id.slice(0, 1), accent: "#7a6e5c" };
}
