// 系列 zhanguo · 战国（变法+纵横主角线）立绘/背景。
// base 已有 qingyue 可复用；本文件新增战国线人物与场景。
// 预留：四公子/白起/屈原/乐毅/田单（后续包追加）
import type { SpriteInfo, BgStyle } from "./base";

export const zhanguoSprites: Record<string, SpriteInfo> = {
	// 商鞅线（商君列传·卷68）
	shangyang: { name: "商鞅（卫鞅）", glyph: "鞅", accent: "#8b4513" },
	yingqvliang: { name: "秦孝公（嬴渠梁）", glyph: "孝", accent: "#d4a847" },
	gongziqian: { name: "公子虔", glyph: "虔", accent: "#7a2f2f" },
	zhaoliang: { name: "赵良", glyph: "良", accent: "#5a7a5c" },
	// 苏秦线（苏秦列传·卷69）
	suqin: { name: "苏秦", glyph: "秦", accent: "#5a4a7a" },
	suyiqin: { name: "苏代/苏厉（苏氏兄弟）", glyph: "苏", accent: "#6b5a8a" },
	susao: { name: "苏秦之嫂", glyph: "嫂", accent: "#8a5a6b" },
	// 张仪线（张仪列传·卷70）
	zhangyi: { name: "张仪", glyph: "仪", accent: "#4a6b8a" },
	huaiwang: { name: "楚怀王", glyph: "怀", accent: "#7a3a5c" },
	// 范雎线（范雎蔡泽列传·卷79）
	fanju: { name: "范雎（张禄）", glyph: "雎", accent: "#6b4a7a" },
	xujia: { name: "须贾", glyph: "贾", accent: "#8a6f4a" },
	weiqi: { name: "魏齐", glyph: "齐", accent: "#6b5a48" },
	wangji: { name: "王稽", glyph: "稽", accent: "#5a6b7a" },
	caize: { name: "蔡泽", glyph: "泽", accent: "#4a7a6b" },
	baiqi: { name: "白起", glyph: "起", accent: "#8b2323" },
	qinzhaowang: { name: "秦昭王（嬴稷）", glyph: "稷", accent: "#c9a227" },
	// 廉颇蔺相如线（廉颇蔺相如列传·卷81）
	linxiangru: { name: "蔺相如", glyph: "相", accent: "#5a8a7a" },
	lianpo: { name: "廉颇", glyph: "颇", accent: "#b8873a" },
	zhaohuiwen: { name: "赵惠文王", glyph: "惠", accent: "#c0392b" },
	mouxian: { name: "缪贤", glyph: "贤", accent: "#7a6e5c" },
	// 白起线（白起王翦列传·卷73）
	// 屈原线（屈原贾生列传·卷84）
	quyuan: { name: "屈原（三闾大夫）", glyph: "原", accent: "#4a6b8a" },
	shangguan_dafu: { name: "上官大夫（靳尚）", glyph: "尚", accent: "#6b4a4a" },
	yufu: { name: "渔父", glyph: "渔", accent: "#5a7a6b" },
	// 乐毅线（乐毅列传·卷80）
	yueyi: { name: "乐毅（昌国君）", glyph: "毅", accent: "#8a6b4a" },
	yanzhaowang: { name: "燕昭王", glyph: "昭", accent: "#7a4a2a" },
	yanhuiwang: { name: "燕惠王", glyph: "惠", accent: "#6a3a3a" },
	qijie: { name: "骑劫", glyph: "劫", accent: "#5a3a3a" },
	// 田单线（田单列传·卷82）
	tiandan: { name: "田单（安平君）", glyph: "单", accent: "#a05028" },
	shenshizu: { name: "神师小卒", glyph: "卒", accent: "#7a8a5a" },
	// 战国四公子线（孟尝君列传·卷75/平原君列传·卷76/魏公子列传·卷77/春申君列传·卷78）
	mengchangjun: { name: "孟尝君（田文）", glyph: "尝", accent: "#6b5a3a" },
	pingyuanjun: { name: "平原君（赵胜）", glyph: "胜", accent: "#5a5a7a" },
	xinlingjun: { name: "信陵君（魏无忌）", glyph: "信", accent: "#4a6a7a" },
	chunshenjun: { name: "春申君（黄歇）", glyph: "申", accent: "#5a7a4a" },
	fengxuan: { name: "冯谖", glyph: "谖", accent: "#7a6a4a" },
	maosui: { name: "毛遂", glyph: "遂", accent: "#6a5a3a" },
	houying: { name: "侯嬴", glyph: "嬴", accent: "#6b6b5a" },
	zhuhai: { name: "朱亥", glyph: "亥", accent: "#5a5a6b" },
	liyuan: { name: "李园", glyph: "园", accent: "#6a3a3a" },
	zhuying: { name: "朱英", glyph: "英", accent: "#4a6a4a" },
};

export const zhanguoBackgrounds: Record<string, BgStyle> = {
	// 商鞅线
	qin_xianyang: { label: "咸阳 · 秦都", css: "linear-gradient(180deg, #181008 0%, #120c06 58%, #0a0703 100%), radial-gradient(ellipse at 50% 30%, rgba(212,168,71,0.18), transparent 55%)" },
	qin_nanshimen: { label: "国都 · 南门立木", css: "linear-gradient(180deg, #14100a 0%, #0f0c07 58%, #080604 100%), radial-gradient(ellipse at 50% 70%, rgba(160,100,50,0.22), transparent 55%)" },
	qin_fating: { label: "秦廷 · 变法", css: "linear-gradient(180deg, #1a1208 0%, #140e05 58%, #0c0803 100%), radial-gradient(ellipse at 50% 28%, rgba(212,168,71,0.20), transparent 55%)" },
	shang_yi: { label: "商於 · 封邑", css: "linear-gradient(180deg, #10160e 0%, #0c1009 58%, #070a06 100%), radial-gradient(ellipse at 50% 72%, rgba(90,120,70,0.20), transparent 55%)" },
	guanxia_keshe: { label: "关下 · 客舍", css: "linear-gradient(180deg, #0c0e12 0%, #080a0e 60%, #050608 100%), radial-gradient(ellipse at 50% 78%, rgba(80,90,110,0.16), transparent 55%)" },
	// 苏秦线
	luoyang_guixiang: { label: "洛阳 · 故里", css: "linear-gradient(180deg, #141016 0%, #0f0c12 58%, #08060a 100%), radial-gradient(ellipse at 50% 72%, rgba(120,90,130,0.18), transparent 55%)" },
	hezhong_yitan: { label: "六国 · 合纵议坛", css: "linear-gradient(180deg, #181410 0%, #120f0c 58%, #0a0806 100%), radial-gradient(ellipse at 50% 28%, rgba(180,140,70,0.22), transparent 55%)" },
	liu_xiangyin: { label: "六国 · 相印", css: "linear-gradient(180deg, #1e1a12 0%, #17140d 58%, #0e0b07 100%), radial-gradient(ellipse at 50% 30%, rgba(212,175,90,0.26), transparent 55%)" },
	qi_chelie: { label: "齐市 · 车裂", css: "linear-gradient(180deg, #140a0a 0%, #0f0707 58%, #080404 100%), radial-gradient(ellipse at 50% 72%, rgba(160,40,40,0.28), transparent 55%)" },
	// 张仪线
	qin_zhangxiang: { label: "秦 · 张仪为相", css: "linear-gradient(180deg, #121418 0%, #0d1014 58%, #080a0c 100%), radial-gradient(ellipse at 50% 28%, rgba(90,120,150,0.18), transparent 55%)" },
	chu_gongdian: { label: "楚 · 怀王宫殿", css: "linear-gradient(180deg, #180f16 0%, #120a10 58%, #0a0609 100%), radial-gradient(ellipse at 50% 30%, rgba(150,70,110,0.20), transparent 55%)" },
	shangyu_liuli: { label: "商於 · 六里封地", css: "linear-gradient(180deg, #0e1410 0%, #0a100c 60%, #060807 100%), radial-gradient(ellipse at 50% 75%, rgba(70,120,90,0.18), transparent 55%)" },
	wei_dushi: { label: "魏 · 大梁都事", css: "linear-gradient(180deg, #141410 0%, #10100c 58%, #0a0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(150,150,90,0.16), transparent 55%)" },
	// 范雎线
	wei_cezhong: { label: "魏 · 厕中受辱", css: "linear-gradient(180deg, #08080a 0%, #050507 60%, #030304 100%), radial-gradient(ellipse at 50% 78%, rgba(50,40,40,0.28), transparent 55%)" },
	qin_qixiang: { label: "秦 · 应侯为相", css: "linear-gradient(180deg, #16101a 0%, #110c14 58%, #0a070c 100%), radial-gradient(ellipse at 50% 28%, rgba(140,90,160,0.20), transparent 55%)" },
	xujia_chidi: { label: "秦 · 绨袍马食", css: "linear-gradient(180deg, #14100e 0%, #100c0a 58%, #0a0706 100%), radial-gradient(ellipse at 50% 70%, rgba(120,90,60,0.24), transparent 55%)" },
	changping: { label: "长平 · 之战", css: "linear-gradient(180deg, #180808 0%, #120505 58%, #080303 100%), radial-gradient(ellipse at 50% 72%, rgba(180,30,30,0.30), transparent 55%)" },
	duyou_cijian: { label: "杜邮 · 赐剑", css: "linear-gradient(180deg, #101418 0%, #0c1013 58%, #070a0c 100%), radial-gradient(ellipse at 50% 30%, rgba(60,80,110,0.18), transparent 55%)" },
	// 廉颇蔺相如线
	zhao_handan: { label: "邯郸 · 赵宫", css: "linear-gradient(180deg, #141410 0%, #100f0c 58%, #0a0907 100%), radial-gradient(ellipse at 50% 28%, rgba(180,140,70,0.18), transparent 55%)" },
	qin_zhangtai: { label: "秦 · 章台", css: "linear-gradient(180deg, #1a1208 0%, #140e05 58%, #0c0803 100%), radial-gradient(ellipse at 50% 30%, rgba(212,168,71,0.22), transparent 55%)" },
	mianchi_hui: { label: "渑池 · 之会", css: "linear-gradient(180deg, #181410 0%, #130f0c 58%, #0c0806 100%), radial-gradient(ellipse at 50% 40%, rgba(170,130,70,0.20), transparent 55%)" },
	fujing_junfu: { label: "蔺府 · 负荆", css: "linear-gradient(180deg, #101612 0%, #0c100e 58%, #070a08 100%), radial-gradient(ellipse at 50% 72%, rgba(90,130,100,0.20), transparent 55%)" },
	// 白起线
	yique: { label: "伊阙 · 古战场", css: "linear-gradient(180deg, #100808 0%, #0c0606 58%, #060303 100%), radial-gradient(ellipse at 50% 70%, rgba(130,30,30,0.25), transparent 55%)" },
	qin_chaotang: { label: "咸阳 · 秦朝堂", css: "linear-gradient(180deg, #181008 0%, #130c06 58%, #0a0703 100%), radial-gradient(ellipse at 50% 28%, rgba(190,140,60,0.20), transparent 55%)" },
	duyou: { label: "杜邮 · 赐剑亭", css: "linear-gradient(180deg, #0e1216 0%, #0a0e11 58%, #06080a 100%), radial-gradient(ellipse at 50% 75%, rgba(80,110,140,0.18), transparent 55%)" },
	// 屈原线
	miluojiang: { label: "汨罗江 · 泽畔", css: "linear-gradient(180deg, #0c1418 0%, #080f12 58%, #05080a 100%), radial-gradient(ellipse at 50% 72%, rgba(70,110,140,0.22), transparent 55%)" },
	// 乐毅线
	yan_chaotang: { label: "蓟城 · 燕朝堂", css: "linear-gradient(180deg, #16120c 0%, #110e08 58%, #0a0805 100%), radial-gradient(ellipse at 50% 30%, rgba(180,130,70,0.18), transparent 55%)" },
	zhao_chaotang: { label: "邯郸 · 赵朝堂", css: "linear-gradient(180deg, #141016 0%, #0f0c12 58%, #080609 100%), radial-gradient(ellipse at 50% 28%, rgba(130,90,150,0.18), transparent 55%)" },
	// 田单线
	linzi: { label: "临淄 · 齐都", css: "linear-gradient(180deg, #14120a 0%, #0f0d07 58%, #080704 100%), radial-gradient(ellipse at 50% 28%, rgba(180,150,70,0.20), transparent 55%)" },
	jiamo: { label: "即墨 · 孤城", css: "linear-gradient(180deg, #120e08 0%, #0e0b06 58%, #070603 100%), radial-gradient(ellipse at 50% 40%, rgba(160,100,50,0.22), transparent 55%)" },
	// 战国四公子线
	zhanguo_sigongzi: { label: "战国 · 四公子聚像", css: "linear-gradient(180deg, #14100c 0%, #0f0b08 58%, #080604 100%), radial-gradient(ellipse at 30% 30%, rgba(180,140,80,0.15), transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(100,140,160,0.15), transparent 50%)" },
	hangu_guan: { label: "函谷关 · 关门", css: "linear-gradient(180deg, #0c0e10 0%, #080a0c 58%, #050608 100%), radial-gradient(ellipse at 50% 62%, rgba(80,100,120,0.22), transparent 55%)" },
	handan: { label: "邯郸 · 赵都", css: "linear-gradient(180deg, #141016 0%, #0f0c11 58%, #080608 100%), radial-gradient(ellipse at 50% 30%, rgba(150,100,140,0.18), transparent 55%)" },
	daliang: { label: "大梁 · 夷门", css: "linear-gradient(180deg, #101412 0%, #0c100e 58%, #070a09 100%), radial-gradient(ellipse at 50% 70%, rgba(90,130,110,0.18), transparent 55%)" },
	chu_gongting: { label: "郢都 · 楚宫廷", css: "linear-gradient(180deg, #0e1412 0%, #0a0e0c 58%, #050807 100%), radial-gradient(ellipse at 50% 28%, rgba(80,120,100,0.20), transparent 55%)" },
};
