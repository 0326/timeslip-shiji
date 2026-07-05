// 系列 chuhan · 楚汉相争 立绘/背景（base 已有 xiangyu/liubang/hanxin/xiaohe/zhangliang/fanzeng/fankuai/yuji/kuaitong/piaomu/tuzhong 及楚汉背景）。
import type { SpriteInfo, BgStyle } from "./base";

export const chuhanSprites: Record<string, SpriteInfo> = {
	// 项羽/刘邦线
	xiangliang: { name: "项梁", glyph: "梁", accent: "#8a6f4a" },
	songyi: { name: "宋义", glyph: "义", accent: "#5a7a8c" },
	jixin: { name: "纪信", glyph: "纪", accent: "#8a6f4a" },
	baishe: { name: "秦王子婴", glyph: "婴", accent: "#9aa0a6" },
	// 张良线
	huangshigong: { name: "黄石公", glyph: "石", accent: "#7a6e5c" },
	hancheng: { name: "韩成", glyph: "成", accent: "#b8973a" },
	// 陈胜线
	chensheng: { name: "陈胜", glyph: "涉", accent: "#b8973a" },
	wuguang: { name: "吴广", glyph: "广", accent: "#8a6f4a" },
	zhanger: { name: "张耳", glyph: "耳", accent: "#5a7a8c" },
	chenyu: { name: "陈馀", glyph: "馀", accent: "#6b7a5c" },
	zhuangjia: { name: "庄贾", glyph: "贾", accent: "#7a5c5c" },
	tonggeng: { name: "佣耕伙伴", glyph: "庸", accent: "#6b5a48" },
	guren: { name: "故人", glyph: "故", accent: "#8a7a5c" },
};

export const chuhanBackgrounds: Record<string, BgStyle> = {
	// 陈胜线
	longmu_field: { label: "田垄 · 佣耕", css: "linear-gradient(180deg, #1a1c12 0%, #14150d 60%, #0c0d08 100%), radial-gradient(ellipse at 50% 80%, rgba(120,130,70,0.18), transparent 60%)" },
	daze_rain: { label: "大泽乡 · 遇雨", css: "linear-gradient(180deg, #0f1518 0%, #0c1114 60%, #080b0d 100%), radial-gradient(ellipse at 50% 20%, rgba(90,110,130,0.20), transparent 55%)" },
	daze_uprising: { label: "大泽乡 · 揭竿", css: "linear-gradient(180deg, #201009 0%, #180c07 58%, #100604 100%), radial-gradient(ellipse at 50% 70%, rgba(200,80,40,0.30), transparent 55%)" },
	chen_city: { label: "陈城 · 入据", css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.16), transparent 55%)" },
	chen_palace: { label: "陈城 · 张楚宫", css: "linear-gradient(180deg, #201510 0%, #18100b 60%, #0e0907 100%), radial-gradient(ellipse at 50% 28%, rgba(200,120,50,0.20), transparent 55%)" },
	chen_siege: { label: "陈城 · 章邯围", css: "linear-gradient(180deg, #180d0a 0%, #120908 60%, #0a0605 100%), radial-gradient(ellipse at 50% 75%, rgba(150,50,40,0.26), transparent 55%)" },
};
