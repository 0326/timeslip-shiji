// 系列 shang · 商（殷本纪，卷三）立绘/背景。
// base 已有 tang(汤)/jie(桀)/xie(契)/qingyue 可复用；本文件新增商代人物与场景。
import type { SpriteInfo, BgStyle } from "./base";

export const shangSprites: Record<string, SpriteInfo> = {
	// 成汤线
	gebo: { name: "葛伯", glyph: "葛", accent: "#6b5a48", full: "/assets/figures/gebo/classical/portrait/full-default.png" },
	// 伊尹 · 太甲线
	yiyin: { name: "伊尹", glyph: "尹", accent: "#5a8f6b", full: "/assets/figures/yiyin/classical/portrait/full-default.png" },
	taijia: { name: "太甲", glyph: "甲", accent: "#b8873a", full: "/assets/figures/taijia/classical/portrait/full-default.png" },
	// 武丁线
	wuding: { name: "武丁", glyph: "丁", accent: "#3a6ea5", full: "/assets/figures/wuding/classical/portrait/full-default.png" },
	fushuo: { name: "傅说", glyph: "说", accent: "#7a6e5c", full: "/assets/figures/fushuo/classical/portrait/full-default.png" },
	zuji: { name: "祖己", glyph: "己", accent: "#5a7a8c", full: "/assets/figures/zuji/classical/portrait/full-default.png" },
	zhongzai: { name: "冢宰", glyph: "宰", accent: "#8a7a5c", full: "/assets/figures/zhongzai/classical/portrait/full-default.png" },
	// 纣线
	zhou: { name: "帝辛（纣）", glyph: "纣", accent: "#7a2f2f", full: "/assets/figures/zhouwang/classical/portrait/full-default.png" },
	daji: { name: "妲己", glyph: "妲", accent: "#b8557a", full: "/assets/figures/daji/classical/portrait/full-default.png" },
	bigan: { name: "比干", glyph: "干", accent: "#4a6b8a", full: "/assets/figures/bigan/classical/portrait/full-default.png" },
	jizi: { name: "箕子", glyph: "箕", accent: "#6b7a5c", full: "/assets/figures/jizi/classical/portrait/full-default.png" },
	weizi: { name: "微子", glyph: "微", accent: "#8a7a5c", full: "/assets/figures/weizi/classical/portrait/full-default.png" },
	jiuhou: { name: "九侯", glyph: "九", accent: "#7a5c5c", full: "/assets/figures/jiuhou/classical/portrait/full-default.png" },
	ehou: { name: "鄂侯", glyph: "鄂", accent: "#6b5a48", full: "/assets/figures/ehou/classical/portrait/full-default.png" },
	xibo: { name: "西伯昌", glyph: "昌", accent: "#b8973a", full: "/assets/figures/xibo/classical/portrait/full-default.png" },
	zuyi: { name: "祖伊", glyph: "祖", accent: "#4a6b8a", full: "/assets/figures/zuyi/classical/portrait/full-default.png" },
	chonghou: { name: "崇侯虎", glyph: "崇", accent: "#7a2f2f", full: "/assets/figures/chonghou/classical/portrait/full-default.png" },
	feizhong: { name: "费中", glyph: "费", accent: "#8a6f4a", full: "/assets/figures/feizhong/classical/portrait/full-default.png" },
};

export const shangBackgrounds: Record<string, BgStyle> = {
	// 成汤线
	bo_capital: { label: "亳都 · 立国", css: "linear-gradient(180deg, #1e1810 0%, #17120b 60%, #0d0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(176,137,76,0.20), transparent 58%)", image: "/assets/backgrounds/wudi/bo_capital.jpg" },
	youshen_ye: { label: "有莘 · 负鼎", css: "linear-gradient(180deg, #171d13 0%, #12160e 58%, #0b0f08 100%), radial-gradient(ellipse at 50% 78%, rgba(90,143,107,0.20), transparent 58%)", image: "/assets/backgrounds/wudi/youshen_ye.jpg" },
	zhangwang_ye: { label: "郊野 · 网开三面", css: "linear-gradient(180deg, #16201a 0%, #111813 55%, #0a100c 100%), radial-gradient(ellipse at 50% 75%, rgba(120,150,100,0.22), transparent 60%)", image: "/assets/backgrounds/wudi/zhangwang_ye.jpg" },
	tangshi_ye: { label: "誓师 · 吊民伐罪", css: "linear-gradient(180deg, #201009 0%, #180c07 58%, #100604 100%), radial-gradient(ellipse at 50% 72%, rgba(200,80,40,0.28), transparent 55%)", image: "/assets/backgrounds/wudi/tangshi_ye.jpg" },
	tang_court: { label: "商汤 · 践天子位", css: "linear-gradient(180deg, #241d10 0%, #1b150c 60%, #0e0a06 100%), radial-gradient(ellipse at 50% 28%, rgba(212,175,90,0.22), transparent 58%)", image: "/assets/backgrounds/wudi/tang_court.jpg" },
	// 伊尹 · 太甲线
	tong_gong: { label: "桐宫 · 放逐", css: "linear-gradient(180deg, #141518 0%, #0f1012 60%, #090a0b 100%), radial-gradient(ellipse at 50% 30%, rgba(90,110,120,0.14), transparent 55%)", image: "/assets/backgrounds/wudi/tong_gong.jpg" },
	shezheng_court: { label: "亳 · 摄政朝诸侯", css: "linear-gradient(180deg, #1a160f 0%, #14110b 60%, #0c0907 100%), radial-gradient(ellipse at 50% 30%, rgba(90,143,107,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/shezheng_court.jpg" },
	taijia_gui: { label: "桐宫 · 迎归授政", css: "linear-gradient(180deg, #201a10 0%, #18130b 58%, #0e0a06 100%), radial-gradient(ellipse at 50% 24%, rgba(184,135,58,0.24), transparent 55%)", image: "/assets/backgrounds/wudi/taijia_gui.jpg" },
	// 武丁线
	yin_decline: { label: "殷道 · 中衰", css: "linear-gradient(180deg, #141516 0%, #0f1011 60%, #090a0b 100%), radial-gradient(ellipse at 50% 30%, rgba(80,90,100,0.14), transparent 55%)", image: "/assets/backgrounds/wudi/yin_decline.jpg" },
	lu_qin: { label: "路寝 · 三年不言", css: "linear-gradient(180deg, #16130f 0%, #110f0b 60%, #0a0806 100%), radial-gradient(ellipse at 50% 32%, rgba(120,110,90,0.12), transparent 55%)", image: "/assets/backgrounds/wudi/lu_qin.jpg" },
	wuding_meng: { label: "武丁 · 梦得圣人", css: "linear-gradient(180deg, #0c0e18 0%, #090b12 55%, #06070c 100%), radial-gradient(ellipse at 50% 22%, rgba(127,180,224,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/wuding_meng.jpg" },
	fuxian_ban: { label: "傅险 · 版筑", css: "linear-gradient(180deg, #1c1610 0%, #16110b 58%, #0d0a07 100%), radial-gradient(ellipse at 50% 78%, rgba(122,110,92,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/fuxian_ban.jpg" },
	chengtang_miao: { label: "成汤庙 · 飞雉登鼎", css: "linear-gradient(180deg, #1a140f 0%, #140f0b 60%, #0c0907 100%), radial-gradient(ellipse at 50% 30%, rgba(58,110,165,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/chengtang_miao.jpg" },
	wuding_xing: { label: "殷 · 武丁中兴", css: "linear-gradient(180deg, #201a12 0%, #18130c 60%, #0e0a07 100%), radial-gradient(ellipse at 50% 28%, rgba(58,110,165,0.20), transparent 58%)", image: "/assets/backgrounds/wudi/wuding_xing.jpg" },
	// 纣线
	zhaoge_court: { label: "朝歌 · 帝辛庭", css: "linear-gradient(180deg, #201009 0%, #180c07 58%, #100604 100%), radial-gradient(ellipse at 50% 30%, rgba(150,40,40,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/zhaoge_court.jpg" },
	jiuchi_roulin: { label: "沙丘 · 酒池肉林", css: "linear-gradient(180deg, #241408 0%, #1a0e06 55%, #100704 100%), radial-gradient(ellipse at 50% 65%, rgba(200,120,50,0.26), transparent 55%)", image: "/assets/backgrounds/wudi/jiuchi_roulin.jpg" },
	paolao: { label: "炮烙 · 铜柱烈火", css: "linear-gradient(180deg, #2a1206 0%, #200d05 55%, #120704 100%), radial-gradient(ellipse at 50% 70%, rgba(215,90,30,0.4), transparent 55%)", image: "/assets/backgrounds/wudi/paolao.jpg", video: "/assets/backgrounds/wudi/video/paolao.mp4" },
	youli: { label: "羑里 · 囚三公", css: "linear-gradient(180deg, #121316 0%, #0d0e11 60%, #08090b 100%), radial-gradient(ellipse at 50% 28%, rgba(90,100,120,0.12), transparent 50%)", image: "/assets/backgrounds/wudi/youli.jpg" },
	muye: { label: "牧野 · 前徒倒戈", css: "linear-gradient(180deg, #191012 0%, #130c0d 58%, #0a0708 100%), radial-gradient(ellipse at 50% 75%, rgba(160,50,45,0.26), transparent 55%)", image: "/assets/backgrounds/wudi/muye.jpg" },
	yinjiang_war: { label: "殷疆 · 百克转战", css: "linear-gradient(180deg, #1c1208 0%, #150d06 58%, #0d0704 100%), radial-gradient(ellipse at 50% 78%, rgba(178,86,38,0.28), transparent 55%)", image: "/assets/backgrounds/wudi/yinjiang_war.jpg" },
	lutai_fire: { label: "鹿台 · 赴火", css: "linear-gradient(180deg, #2a1206 0%, #1e0c05 55%, #120604 100%), radial-gradient(ellipse at 50% 60%, rgba(230,110,40,0.42), transparent 55%)", image: "/assets/backgrounds/wudi/lutai_fire.jpg", video: "/assets/backgrounds/wudi/video/lutai_fire.mp4" },
};
