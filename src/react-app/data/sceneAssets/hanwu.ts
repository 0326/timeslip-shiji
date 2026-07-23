// 系列 hanwu · 汉武盛世 立绘/背景。
import type { SpriteInfo, BgStyle } from "./base";

export const hanwuSprites: Record<string, SpriteInfo> = {
	hanwudi: { name: "汉武帝", glyph: "彻", accent: "#c94c4c" },
	liguang: { name: "李广", glyph: "广", accent: "#8b7355" },
	weiqing: { name: "卫青", glyph: "青", accent: "#5a7a8c" },
	huoqibing: { name: "霍去病", glyph: "霍", accent: "#d4a847" },
	zhangqian: { name: "张骞", glyph: "骞", accent: "#8b5a3c" },
	zhufuyan: { name: "主父偃", glyph: "偃", accent: "#6b5a7a" },
	dongzhongshu: { name: "董仲舒", glyph: "舒", accent: "#4a6b5a" },
	weizifu: { name: "卫子夫", glyph: "卫", accent: "#c96f8a" },
	liju: { name: "戾太子刘据", glyph: "据", accent: "#7a5c5c" },
	jiangchong: { name: "江充", glyph: "充", accent: "#5a5a6b" },
	gongsunhong: { name: "公孙弘", glyph: "弘", accent: "#7a6e5c" },
	hunye: { name: "浑邪王", glyph: "邪", accent: "#8b6b4a" },
	dayuezhi: { name: "大月氏王", glyph: "月", accent: "#6b4a7a" },
	balingwei: { name: "灞陵尉", glyph: "尉", accent: "#5a5a5a" },
};

export const hanwuBackgrounds: Record<string, BgStyle> = {
	weiyang_palace: { label: "未央宫 · 朝堂", css: "linear-gradient(180deg, #1f1510 0%, #18100b 60%, #0e0a07 100%), radial-gradient(ellipse at 50% 28%, rgba(201,76,76,0.16), transparent 55%)" },
	chang_an_street: { label: "长安 · 街市", css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 70%, rgba(184,151,58,0.12), transparent 55%)" },
	taishan_fengchan: { label: "泰山 · 封禅", css: "linear-gradient(180deg, #0f1520 0%, #0c1118 55%, #080b10 100%), radial-gradient(ellipse at 50% 20%, rgba(212,168,71,0.28), transparent 60%)" },
	northern_frontier: { label: "北疆 · 边塞", css: "linear-gradient(180deg, #14181c 0%, #0f1316 55%, #0a0c0e 100%), radial-gradient(ellipse at 50% 75%, rgba(139,115,85,0.22), transparent 55%)" },
	mobei_desert: { label: "漠北 · 荒原", css: "linear-gradient(180deg, #1a1812 0%, #14120d 60%, #0c0b08 100%), radial-gradient(ellipse at 50% 80%, rgba(212,168,71,0.18), transparent 60%)" },
	longcheng_raid: { label: "龙城 · 捷报", css: "linear-gradient(180deg, #201008 0%, #180c06 58%, #100604 100%), radial-gradient(ellipse at 50% 70%, rgba(200,80,40,0.28), transparent 55%)" },
	langjuxu: { label: "狼居胥山 · 封天", css: "linear-gradient(180deg, #101820 0%, #0d1318 55%, #080c10 100%), radial-gradient(ellipse at 50% 25%, rgba(212,168,71,0.24), transparent 55%)" },
	xiyu_desert: { label: "西域 · 大漠", css: "linear-gradient(180deg, #1c1810 0%, #16120c 55%, #0e0b08 100%), radial-gradient(ellipse at 50% 70%, rgba(201,162,39,0.20), transparent 60%)" },
	xiongnu_camp: { label: "匈奴 · 穹庐", css: "linear-gradient(180deg, #1a120c 0%, #140d08 60%, #0a0806 100%), radial-gradient(ellipse at 50% 30%, rgba(139,90,60,0.18), transparent 55%)" },
	baling_night: { label: "灞陵 · 夜归", css: "linear-gradient(180deg, #0a0d12 0%, #080a0e 60%, #050608 100%), radial-gradient(ellipse at 30% 25%, rgba(90,110,140,0.14), transparent 55%)" },
	wugu_prison: { label: "巫蛊 · 诏狱", css: "linear-gradient(180deg, #180808 0%, #120606 60%, #0a0404 100%), radial-gradient(ellipse at 50% 75%, rgba(150,30,30,0.20), transparent 55%)" },
	luntai_palace: { label: "未央宫 · 轮台诏", css: "linear-gradient(180deg, #151018 0%, #100c14 60%, #0a080c 100%), radial-gradient(ellipse at 50% 30%, rgba(90,60,120,0.14), transparent 55%)" },
};
