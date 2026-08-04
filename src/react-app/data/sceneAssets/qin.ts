import type { SpriteInfo, BgStyle } from "./base";

export const qinSprites: Record<string, SpriteInfo> = {
	qshihuang: { name: "秦始皇", glyph: "政", accent: "#c0392b", full: "/assets/figures/qshihuang/classical/portrait/full-default.png" },
	lisi: { name: "李斯", glyph: "斯", accent: "#8a6f4a", full: "/assets/figures/lisi/classical/portrait/full-default.png" },
	jingke: { name: "荆轲", glyph: "轲", accent: "#5a7a8c", full: "/assets/figures/jingke/classical/portrait/full-default.png" },
	lvbuwei: { name: "吕不韦", glyph: "吕", accent: "#1a6b8a", full: "/assets/figures/lvbuwei/classical/portrait/full-default.png" },
	mengtian: { name: "蒙恬", glyph: "恬", accent: "#6b7a5c", full: "/assets/figures/mengtian/classical/portrait/full-default.png" },
	zhaoji: { name: "赵姬", glyph: "姬", accent: "#b8557a", full: "/assets/figures/zhaoji/classical/portrait/full-default.png" },
	laoai: { name: "嫪毐", glyph: "毐", accent: "#7a2f2f", full: "/assets/figures/laoai/classical/portrait/full-default.png" },
	fusu: { name: "扶苏", glyph: "苏", accent: "#5a8f6b", full: "/assets/figures/fusu/classical/portrait/full-default.png" },
	huhai: { name: "胡亥", glyph: "亥", accent: "#8a5c5c", full: "/assets/figures/huhai/classical/portrait/full-default.png" },
	zhaogao: { name: "赵高", glyph: "高", accent: "#6b4a3a", full: "/assets/figures/zhaogao/classical/portrait/full-default.png" },
	taizidan: { name: "太子丹", glyph: "丹", accent: "#8a3324", full: "/assets/figures/taizidan/classical/portrait/full-default.png" },
	fanwuqi: { name: "樊於期", glyph: "樊", accent: "#8a5a3a", full: "/assets/figures/fanwuqi/classical/portrait/full-default.png" },
	gaojianli: { name: "高渐离", glyph: "渐", accent: "#7a8fc9", full: "/assets/figures/gaojianli/classical/portrait/full-default.png" },
	huayangfuren: { name: "华阳夫人", glyph: "华", accent: "#c96f8a", full: "/assets/figures/huayangfuren/classical/portrait/full-default.png" },
	zichu: { name: "子楚", glyph: "楚", accent: "#5a7a9c", full: "/assets/figures/zichu/classical/portrait/full-default.png" },
	wangjian: { name: "王翦", glyph: "翦", accent: "#5a6a4a", full: "/assets/figures/wangjian/classical/portrait/full-default.png" },
	xufu: { name: "徐福", glyph: "福", accent: "#5a8f8f", full: "/assets/figures/xufu/classical/portrait/full-default.png" },
	mengyi: { name: "蒙毅", glyph: "毅", accent: "#7a8a6c", full: "/assets/figures/mengyi/classical/portrait/full-default.png" },
	qinmu: { name: "秦缪公", glyph: "穆", accent: "#d4a847", full: "/assets/figures/qinmu/classical/portrait/full-default.png" },
	baili: { name: "百里奚", glyph: "奚", accent: "#7a6e5c", full: "/assets/figures/baili/classical/portrait/full-default.png" },
	jianshu: { name: "蹇叔", glyph: "蹇", accent: "#5a7a8c", full: "/assets/figures/jianshu/classical/portrait/full-default.png" },
	youyu: { name: "由余", glyph: "余", accent: "#6b7a5c", full: "/assets/figures/youyu/classical/portrait/full-default.png" },
	jin_hui_gong: { name: "晋襄公", glyph: "晋", accent: "#7a5c8a", full: "/assets/figures/jin_hui_gong/classical/portrait/full-default.png" },
};

export const qinBackgrounds: Record<string, BgStyle> = {
	// 秦始皇线
	handan_proton: { label: "邯郸 · 质子府", css: "linear-gradient(180deg, #1a1510 0%, #14100b 60%, #0c0908 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.12), transparent 55%)", image: "/assets/backgrounds/wudi/ref/handan_proton.jpg" },
	jinian_palace: { label: "蕲年宫 · 冠礼", css: "linear-gradient(180deg, #201009 0%, #180c07 58%, #100604 100%), radial-gradient(ellipse at 50% 28%, rgba(200,50,40,0.26), transparent 55%)", image: "/assets/backgrounds/wudi/jinian_palace.jpg" },
	xianyang_court: { label: "咸阳 · 朝堂", css: "linear-gradient(180deg, #241d10 0%, #1b150c 60%, #0e0a06 100%), radial-gradient(ellipse at 50% 28%, rgba(212,175,90,0.22), transparent 58%)", image: "/assets/backgrounds/wudi/xianyang_court.jpg" },
	xianyang_palace_feast: { label: "咸阳宫 · 酒宴", css: "linear-gradient(180deg, #221a12 0%, #1a130d 60%, #0d0b08 100%), radial-gradient(ellipse at 40% 25%, rgba(212,175,90,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/ref/xianyang_palace_feast.jpg" },
	bohai_coast: { label: "渤海 · 之罘", css: "linear-gradient(180deg, #101820 0%, #0d131a 55%, #0a0e12 100%), radial-gradient(ellipse at 50% 80%, rgba(38,120,150,0.28), transparent 55%)", image: "/assets/backgrounds/wudi/bohai_coast.jpg" },
	afang_palace: { label: "阿房宫 · 兴建", css: "linear-gradient(180deg, #2a1a0a 0%, #201408 58%, #140a05 100%), radial-gradient(ellipse at 50% 70%, rgba(200,120,50,0.24), transparent 55%)", image: "/assets/backgrounds/wudi/afang_palace.jpg" },
	shaqiu_platform: { label: "沙丘 · 平台", css: "linear-gradient(180deg, #141210 0%, #0f0d0b 60%, #080706 100%), radial-gradient(ellipse at 50% 20%, rgba(100,80,60,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/ref/shaqiu_platform.jpg" },
	// 荆轲线
	yan_market: { label: "燕市 · 酒歌", css: "linear-gradient(180deg, #141810 0%, #0f120d 60%, #0a0b09 100%), radial-gradient(ellipse at 50% 75%, rgba(120,140,90,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/ref/yan_market.jpg" },
	yishui_river: { label: "易水 · 送别", css: "linear-gradient(180deg, #101418 0%, #0c0f12 55%, #070a0c 100%), radial-gradient(ellipse at 50% 85%, rgba(90,110,140,0.26), transparent 55%)", image: "/assets/backgrounds/wudi/yishui_river.jpg", video: "/assets/backgrounds/wudi/video/yishui_river.mp4" },
	wuyang_road: { label: "咸阳道 · 西行", css: "linear-gradient(180deg, #1a1712 0%, #14110d 60%, #0c0a08 100%), radial-gradient(ellipse at 30% 75%, rgba(184,151,58,0.14), transparent 60%)", image: "/assets/backgrounds/wudi/ref/wuyang_road.jpg" },
	qin_hall: { label: "咸阳殿 · 献图", css: "linear-gradient(180deg, #241a10 0%, #1b130c 60%, #0e0a06 100%), radial-gradient(ellipse at 50% 30%, rgba(192,57,43,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/qin_hall.jpg" },
	// 吕不韦线
	handan_market: { label: "邯郸 · 市井", css: "linear-gradient(180deg, #1c1a16 0%, #151310 60%, #0d0c0a 100%)", image: "/assets/backgrounds/wudi/handan_market.jpg" },
	lv_mansion: { label: "文信侯府", css: "linear-gradient(180deg, #1a1712 0%, #14110d 60%, #0c0a08 100%), radial-gradient(ellipse at 50% 28%, rgba(26,107,138,0.14), transparent 55%)", image: "/assets/backgrounds/wudi/ref/lv_mansion.jpg" },
	qin_court_zhongfu: { label: "秦廷 · 仲父", css: "linear-gradient(180deg, #201810 0%, #18120c 60%, #0e0a07 100%), radial-gradient(ellipse at 50% 25%, rgba(212,175,90,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/ref/qin_court_zhongfu.jpg" },
	shu_road: { label: "蜀道 · 迁谪", css: "linear-gradient(180deg, #0f1014 0%, #0c0d10 55%, #060709 100%), radial-gradient(ellipse at 50% 60%, rgba(80,90,110,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/ref/shu_road.jpg" },
	// 李斯线
	shangcai_dongmen: { label: "上蔡 · 东门", css: "linear-gradient(180deg, #151a10 0%, #10140d 60%, #0a0c08 100%), radial-gradient(ellipse at 50% 80%, rgba(120,140,70,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/shangcai_dongmen.jpg" },
	qin_library: { label: "秦 · 藏书阁", css: "linear-gradient(180deg, #16120c 0%, #110e09 60%, #0a0806 100%), radial-gradient(ellipse at 50% 25%, rgba(184,151,58,0.12), transparent 55%)", image: "/assets/backgrounds/wudi/ref/qin_library.jpg" },
	chamber_secret: { label: "密室 · 沙丘", css: "linear-gradient(180deg, #0a0c0f 0%, #080a0c 60%, #050607 100%), radial-gradient(ellipse at 40% 30%, rgba(60,50,40,0.30), transparent 55%)", image: "/assets/backgrounds/wudi/ref/chamber_secret.jpg" },
	xianyang_market: { label: "咸阳 · 市曹", css: "linear-gradient(180deg, #18100a 0%, #120c08 58%, #0a0705 100%), radial-gradient(ellipse at 50% 75%, rgba(150,60,40,0.28), transparent 55%)", image: "/assets/backgrounds/wudi/ref/xianyang_market.jpg" },
	// 蒙恬线
	greatwall: { label: "长城 · 北塞", css: "linear-gradient(180deg, #10181c 0%, #0d1316 55%, #070d0f 100%), radial-gradient(ellipse at 50% 75%, rgba(90,130,150,0.24), transparent 60%)", image: "/assets/backgrounds/wudi/greatwall.jpg", video: "/assets/backgrounds/wudi/video/greatwall.mp4" },
	shangjun_camp: { label: "上郡 · 军营", css: "linear-gradient(180deg, #121612 0%, #0e110e 60%, #080a08 100%), radial-gradient(ellipse at 60% 30%, rgba(107,122,92,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/ref/shangjun_camp.jpg" },
	prison_cart: { label: "囚车 · 阳周", css: "linear-gradient(180deg, #0f0d0c 0%, #0b0a09 60%, #060505 100%), radial-gradient(ellipse at 50% 40%, rgba(80,50,40,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/ref/prison_cart.jpg" },
};
