import type { SpriteInfo, BgStyle } from "./base";

export const xizhouSprites: Record<string, SpriteInfo> = {
	jiangshang: { name: "姜尚（太公望）", glyph: "尚", accent: "#b8973a" },
	hongyao: { name: "闳夭", glyph: "闳", accent: "#6b7a5c" },
	wenwang: { name: "周文王（姬昌）", glyph: "昌", accent: "#3f7a5c" },
	wuwang: { name: "周武王（姬发）", glyph: "发", accent: "#c0392b" },
	zhougong: { name: "周公旦", glyph: "旦", accent: "#4a7a9c" },
	xuanwang: { name: "周宣王（姬静）", glyph: "静", accent: "#8a6db0" },
	youwang: { name: "周幽王（姬宫涅）", glyph: "涅", accent: "#7a2f2f" },
	mshi: { name: "马氏（姜尚妻）", glyph: "马", accent: "#a85d3a" },
	chonghou: { name: "崇侯虎", glyph: "虎", accent: "#7a2f2f" },
	zhou: { name: "商纣王", glyph: "纣", accent: "#8a3324" },
	taigong: { name: "太公望（姜尚）", glyph: "尚", accent: "#b8973a" },
	shaogong: { name: "召公奭", glyph: "奭", accent: "#5a8f6b" },
	guanshu: { name: "管叔鲜", glyph: "鲜", accent: "#8a3324" },
	caishu: { name: "蔡叔度", glyph: "度", accent: "#7a5c5c" },
	chengwang: { name: "周成王", glyph: "诵", accent: "#3a6ea5" },
	boqin: { name: "伯禽", glyph: "禽", accent: "#5a7a8c" },
	baosi: { name: "褒姒", glyph: "姒", accent: "#b8557a" },
	guoshifu: { name: "虢石父", glyph: "虢", accent: "#6b5a48" },
	boyang: { name: "伯阳父", glyph: "阳", accent: "#8a6f4a" },
	zhongshanfu: { name: "仲山甫", glyph: "仲", accent: "#5a7a5c" },
	shaogong_hu: { name: "召公虎", glyph: "虎", accent: "#5a8f6b" },
	qiaofu: { name: "渭水樵夫", glyph: "樵", accent: "#6b5a48" },
	kezhan: { name: "客栈主人", glyph: "旅", accent: "#8a7a5c" },
};

export const xizhouBackgrounds: Record<string, BgStyle> = {
	weishui: { label: "渭水 · 磻溪", css: "linear-gradient(180deg, #101820 0%, #0d131a 55%, #0a0e12 100%), radial-gradient(ellipse at 50% 80%, rgba(63,122,156,0.22), transparent 60%)" },
	youli: { label: "羑里 · 囚室", css: "linear-gradient(180deg, #0a0d10 0%, #070a0c 60%, #050708 100%), radial-gradient(ellipse at 50% 20%, rgba(120,100,80,0.14), transparent 45%)" },
	mengjin: { label: "盟津 · 渡河口", css: "linear-gradient(180deg, #0f1418 0%, #0c1014 60%, #080b0d 100%), radial-gradient(ellipse at 50% 75%, rgba(120,80,40,0.20), transparent 55%)" },
	muye: { label: "牧野 · 战场", css: "linear-gradient(180deg, #1a0d0a 0%, #120808 55%, #0a0605 100%), radial-gradient(ellipse at 50% 70%, rgba(192,57,43,0.28), transparent 55%)" },
	luoyi: { label: "洛邑 · 成周", css: "linear-gradient(180deg, #1a1c22 0%, #14161b 55%, #0c0d10 100%), radial-gradient(ellipse at 50% 30%, rgba(74,122,156,0.18), transparent 55%)" },
	qi_palace: { label: "营丘 · 齐都", css: "linear-gradient(180deg, #161a10 0%, #10140c 58%, #0a0d08 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.16), transparent 55%)" },
	li_shan: { label: "骊山 · 烽火", css: "linear-gradient(180deg, #200f0a 0%, #180b07 55%, #100604 100%), radial-gradient(ellipse at 50% 30%, rgba(215,90,30,0.35), transparent 55%)" },
	haojing: { label: "镐京 · 陷落", css: "linear-gradient(180deg, #1a0d08 0%, #120806 58%, #080403 100%), radial-gradient(ellipse at 50% 75%, rgba(180,50,30,0.30), transparent 55%)" },
	feng_yi: { label: "丰邑 · 周都", css: "linear-gradient(180deg, #141810 0%, #0f140c 55%, #0a0e08 100%), radial-gradient(ellipse at 50% 30%, rgba(63,122,92,0.18), transparent 55%)" },
};
