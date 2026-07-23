import type { SpriteInfo, BgStyle } from "./base";

export const qinSprites: Record<string, SpriteInfo> = {
	qshihuang: { name: "秦始皇", glyph: "政", accent: "#c0392b" },
	lisi: { name: "李斯", glyph: "斯", accent: "#8a6f4a" },
	jingke: { name: "荆轲", glyph: "轲", accent: "#5a7a8c" },
	lvbuwei: { name: "吕不韦", glyph: "吕", accent: "#1a6b8a" },
	mengtian: { name: "蒙恬", glyph: "恬", accent: "#6b7a5c" },
	zhaoji: { name: "赵姬", glyph: "姬", accent: "#b8557a" },
	laoai: { name: "嫪毐", glyph: "毐", accent: "#7a2f2f" },
	fusu: { name: "扶苏", glyph: "苏", accent: "#5a8f6b" },
	huhai: { name: "胡亥", glyph: "亥", accent: "#8a5c5c" },
	zhaogao: { name: "赵高", glyph: "高", accent: "#6b4a3a" },
	taizidan: { name: "太子丹", glyph: "丹", accent: "#8a3324" },
	fanwuqi: { name: "樊於期", glyph: "樊", accent: "#8a5a3a" },
	gaojianli: { name: "高渐离", glyph: "渐", accent: "#7a8fc9" },
	huayangfuren: { name: "华阳夫人", glyph: "华", accent: "#c96f8a" },
	zichu: { name: "子楚", glyph: "楚", accent: "#5a7a9c" },
	wangjian: { name: "王翦", glyph: "翦", accent: "#5a6a4a" },
	xufu: { name: "徐福", glyph: "福", accent: "#5a8f8f" },
	mengyi: { name: "蒙毅", glyph: "毅", accent: "#7a8a6c" },
};

export const qinBackgrounds: Record<string, BgStyle> = {
	// 秦始皇线
	handan_proton: { label: "邯郸 · 质子府", css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.12), transparent 55%)" },
	jinian_palace: { label: "蕲年宫 · 冠礼", css: "linear-gradient(180deg, #201009 0%, #180c07 58%, #100604 100%), radial-gradient(ellipse at 50% 28%, rgba(200,50,40,0.26), transparent 55%)" },
	xianyang_court: { label: "咸阳 · 朝堂", css: "linear-gradient(180deg, #241d10 0%, #1b150c 60%, #0e0a06 100%), radial-gradient(ellipse at 50% 28%, rgba(212,175,90,0.22), transparent 58%)" },
	xianyang_palace_feast: { label: "咸阳宫 · 酒宴", css: "linear-gradient(180deg, #221a12 0%, #1a130d 60%, #0d0b08 100%), radial-gradient(ellipse at 40% 25%, rgba(212,175,90,0.20), transparent 55%)" },
	bohai_coast: { label: "渤海 · 之罘", css: "linear-gradient(180deg, #101820 0%, #0d131a 55%, #0a0e12 100%), radial-gradient(ellipse at 50% 80%, rgba(38,120,150,0.28), transparent 55%)" },
	afang_palace: { label: "阿房宫 · 兴建", css: "linear-gradient(180deg, #2a1a0a 0%, #201408 58%, #140a05 100%), radial-gradient(ellipse at 50% 70%, rgba(200,120,50,0.24), transparent 55%)" },
	shaqiu_platform: { label: "沙丘 · 平台", css: "linear-gradient(180deg, #141210 0%, #0f0d0b 60%, #080706 100%), radial-gradient(ellipse at 50% 20%, rgba(100,80,60,0.20), transparent 55%)" },
	// 荆轲线
	yan_market: { label: "燕市 · 酒歌", css: "linear-gradient(180deg, #141810 0%, #0f120d 60%, #0a0b09 100%), radial-gradient(ellipse at 50% 75%, rgba(120,140,90,0.16), transparent 55%)" },
	yishui_river: { label: "易水 · 送别", css: "linear-gradient(180deg, #101418 0%, #0c0f12 55%, #070a0c 100%), radial-gradient(ellipse at 50% 85%, rgba(90,110,140,0.26), transparent 55%)" },
	wuyang_road: { label: "咸阳道 · 西行", css: "linear-gradient(180deg, #1a1712 0%, #14110d 60%, #0c0a08 100%), radial-gradient(ellipse at 30% 75%, rgba(184,151,58,0.14), transparent 60%)" },
	qin_hall: { label: "咸阳殿 · 献图", css: "linear-gradient(180deg, #241a10 0%, #1b130c 60%, #0e0a06 100%), radial-gradient(ellipse at 50% 30%, rgba(192,57,43,0.18), transparent 55%)" },
	// 吕不韦线
	handan_market: { label: "邯郸 · 市井", css: "linear-gradient(180deg, #1c1a16 0%, #151310 60%, #0d0c0a 100%)" },
	lv_mansion: { label: "文信侯府", css: "linear-gradient(180deg, #1a1712 0%, #14110d 60%, #0c0a08 100%), radial-gradient(ellipse at 50% 28%, rgba(26,107,138,0.14), transparent 55%)" },
	qin_court_zhongfu: { label: "秦廷 · 仲父", css: "linear-gradient(180deg, #201810 0%, #18120c 60%, #0e0a07 100%), radial-gradient(ellipse at 50% 25%, rgba(212,175,90,0.16), transparent 55%)" },
	shu_road: { label: "蜀道 · 迁谪", css: "linear-gradient(180deg, #0f1014 0%, #0c0d10 55%, #060709 100%), radial-gradient(ellipse at 50% 60%, rgba(80,90,110,0.22), transparent 55%)" },
	// 李斯线
	shangcai_dongmen: { label: "上蔡 · 东门", css: "linear-gradient(180deg, #151a10 0%, #10140d 60%, #0a0c08 100%), radial-gradient(ellipse at 50% 80%, rgba(120,140,70,0.18), transparent 55%)" },
	qin_library: { label: "秦 · 藏书阁", css: "linear-gradient(180deg, #16120c 0%, #110e09 60%, #0a0806 100%), radial-gradient(ellipse at 50% 25%, rgba(184,151,58,0.12), transparent 55%)" },
	chamber_secret: { label: "密室 · 沙丘", css: "linear-gradient(180deg, #0a0c0f 0%, #080a0c 60%, #050607 100%), radial-gradient(ellipse at 40% 30%, rgba(60,50,40,0.30), transparent 55%)" },
	xianyang_market: { label: "咸阳 · 市曹", css: "linear-gradient(180deg, #18100a 0%, #120c08 58%, #0a0705 100%), radial-gradient(ellipse at 50% 75%, rgba(150,60,40,0.28), transparent 55%)" },
	// 蒙恬线
	greatwall: { label: "长城 · 北塞", css: "linear-gradient(180deg, #10181c 0%, #0d1316 55%, #070d0f 100%), radial-gradient(ellipse at 50% 75%, rgba(90,130,150,0.24), transparent 60%)" },
	shangjun_camp: { label: "上郡 · 军营", css: "linear-gradient(180deg, #121612 0%, #0e110e 60%, #080a08 100%), radial-gradient(ellipse at 60% 30%, rgba(107,122,92,0.16), transparent 55%)" },
	prison_cart: { label: "囚车 · 阳周", css: "linear-gradient(180deg, #0f0d0c 0%, #0b0a09 60%, #060505 100%), radial-gradient(ellipse at 50% 40%, rgba(80,50,40,0.22), transparent 55%)" },
};
