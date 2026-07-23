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
	// 彭越线
	pengyue: { name: "彭越", glyph: "越", accent: "#6b8f5a" },
	luanbu: { name: "栾布", glyph: "栾", accent: "#6b7a5c" },
	lvhou: { name: "吕后", glyph: "吕", accent: "#b8557a" },
	// 英布（黥布）线
	yingbu: { name: "英布（黥布）", glyph: "黥", accent: "#7a2f2f" },
	suihe: { name: "随何", glyph: "何", accent: "#5a8f6b" },
	xuegong: { name: "薛公", glyph: "薛", accent: "#8a7a5c" },
};

export const chuhanBackgrounds: Record<string, BgStyle> = {
	// 陈胜线
	longmu_field: { label: "田垄 · 佣耕", css: "linear-gradient(180deg, #1a1c12 0%, #14150d 60%, #0c0d08 100%), radial-gradient(ellipse at 50% 80%, rgba(120,130,70,0.18), transparent 60%)" },
	daze_rain: { label: "大泽乡 · 遇雨", css: "linear-gradient(180deg, #0f1518 0%, #0c1114 60%, #080b0d 100%), radial-gradient(ellipse at 50% 20%, rgba(90,110,130,0.20), transparent 55%)" },
	daze_uprising: { label: "大泽乡 · 揭竿", css: "linear-gradient(180deg, #201009 0%, #180c07 58%, #100604 100%), radial-gradient(ellipse at 50% 70%, rgba(200,80,40,0.30), transparent 55%)" },
	chen_city: { label: "陈城 · 入据", css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.16), transparent 55%)" },
	chen_palace: { label: "陈城 · 张楚宫", css: "linear-gradient(180deg, #201510 0%, #18100b 60%, #0e0907 100%), radial-gradient(ellipse at 50% 28%, rgba(200,120,50,0.20), transparent 55%)" },
	chen_siege: { label: "陈城 · 章邯围", css: "linear-gradient(180deg, #180d0a 0%, #120908 60%, #0a0605 100%), radial-gradient(ellipse at 50% 75%, rgba(150,50,40,0.26), transparent 55%)" },
	// 韩信线
	qi_land: { label: "齐地 · 定齐", css: "linear-gradient(180deg, #12181a 0%, #0e1315 60%, #080c0d 100%), radial-gradient(ellipse at 50% 40%, rgba(80,120,140,0.20), transparent 55%)" },
	// 彭越线
	juye_ze: { label: "钜野泽 · 渔盗", css: "linear-gradient(180deg, #0f1518 0%, #0b1013 60%, #070b0d 100%), radial-gradient(ellipse at 50% 78%, rgba(70,110,130,0.20), transparent 55%)" },
	liang_youji: { label: "梁地 · 游击断粮", css: "linear-gradient(180deg, #171812 0%, #12130c 60%, #0a0b07 100%), radial-gradient(ellipse at 50% 72%, rgba(140,140,80,0.18), transparent 55%)" },
	suiyang_feng: { label: "睢阳 · 封梁王", css: "linear-gradient(180deg, #1c1710 0%, #16120b 60%, #0d0907 100%), radial-gradient(ellipse at 50% 28%, rgba(184,151,58,0.20), transparent 58%)" },
	luoyang_zu: { label: "洛阳 · 族诛醢之", css: "linear-gradient(180deg, #180d0c 0%, #120908 60%, #0a0605 100%), radial-gradient(ellipse at 50% 70%, rgba(150,45,45,0.24), transparent 55%)" },
	// 英布（黥布）线
	qingmian_xing: { label: "黥面 · 刑徒", css: "linear-gradient(180deg, #141210 0%, #0f0d0b 60%, #080706 100%), radial-gradient(ellipse at 50% 30%, rgba(120,60,60,0.18), transparent 55%)" },
	lishan_tu: { label: "骊山 · 亡入江中", css: "linear-gradient(180deg, #16130f 0%, #110f0a 60%, #0a0806 100%), radial-gradient(ellipse at 50% 74%, rgba(120,90,60,0.18), transparent 55%)" },
	chen_shiyidi: { label: "郴 · 弑义帝", css: "linear-gradient(180deg, #180d10 0%, #12090c 58%, #0a0507 100%), radial-gradient(ellipse at 50% 40%, rgba(150,50,60,0.22), transparent 50%)" },
	huainan_feng: { label: "淮南 · 封王", css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 28%, rgba(184,151,58,0.18), transparent 55%)" },
	poyang_zhu: { label: "番阳 · 兵败诱杀", css: "linear-gradient(180deg, #180f10 0%, #120a0b 60%, #0a0607 100%), radial-gradient(ellipse at 50% 72%, rgba(150,55,50,0.24), transparent 55%)" },
};
