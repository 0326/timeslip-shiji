// 系列 zhanguo · 战国（变法+纵横主角线）立绘/背景。
// base 已有 qingyue 可复用；本文件新增战国线人物与场景。
// 预留：四公子/白起/屈原/乐毅/田单（后续包追加）
import type { SpriteInfo, BgStyle } from "./base";

export const zhanguoSprites: Record<string, SpriteInfo> = {
	// 商鞅线（商君列传·卷68）
	shangyang: { name: "商鞅", glyph: "鞅", accent: "#8b4513", full: "/assets/figures/shangyang/classical/portrait/full-default.png" },
	yingqvliang: { name: "秦孝公（嬴渠梁）", glyph: "孝", accent: "#d4a847", full: "/assets/figures/yingqvliang/classical/portrait/full-default.png" },
	gongziqian: { name: "公子虔", glyph: "虔", accent: "#7a2f2f", full: "/assets/figures/gongziqian/classical/portrait/full-default.png" },
	zhaoliang: { name: "赵良", glyph: "良", accent: "#5a7a5c", full: "/assets/figures/zhaoliang/classical/portrait/full-default.png" },
	// 苏秦线（苏秦列传·卷69）
	suqin: { name: "苏秦", glyph: "秦", accent: "#5a4a7a", full: "/assets/figures/suqin/classical/portrait/full-default.png" },
	suyiqin: { name: "苏代/苏厉（苏氏兄弟）", glyph: "苏", accent: "#6b5a8a", full: "/assets/figures/suyiqin/classical/portrait/full-default.png" },
	susao: { name: "苏秦之嫂", glyph: "嫂", accent: "#8a5a6b", full: "/assets/figures/susao/classical/portrait/full-default.png" },
	// 张仪线（张仪列传·卷70）
	zhangyi: { name: "张仪", glyph: "仪", accent: "#4a6b8a", full: "/assets/figures/zhangyi/classical/portrait/full-default.png" },
	huaiwang: { name: "楚怀王", glyph: "怀", accent: "#7a3a5c", full: "/assets/figures/huaiwang/classical/portrait/full-default.png" },
	// 范雎线（范雎蔡泽列传·卷79）
	fanju: { name: "范雎", glyph: "雎", accent: "#6b4a7a", full: "/assets/figures/fanju/classical/portrait/full-default.png" },
	xujia: { name: "须贾", glyph: "贾", accent: "#8a6f4a", full: "/assets/figures/xujia/classical/portrait/full-default.png" },
	weiqi: { name: "魏齐", glyph: "齐", accent: "#6b5a48", full: "/assets/figures/weiqi/classical/portrait/full-default.png" },
	wangji: { name: "王稽", glyph: "稽", accent: "#5a6b7a", full: "/assets/figures/wangji/classical/portrait/full-default.png" },
	caize: { name: "蔡泽", glyph: "泽", accent: "#4a7a6b", full: "/assets/figures/caize/classical/portrait/full-default.png" },
	baiqi: { name: "白起", glyph: "起", accent: "#8b2323", full: "/assets/figures/baiqi/classical/portrait/full-default.png" },
	qinzhaowang: { name: "秦昭王（嬴稷）", glyph: "稷", accent: "#c9a227", full: "/assets/figures/qinzhaowang/classical/portrait/full-default.png" },
	// 廉颇蔺相如线（廉颇蔺相如列传·卷81）
	linxiangru: { name: "蔺相如", glyph: "相", accent: "#5a8a7a", full: "/assets/figures/linxiangru/classical/portrait/full-default.png" },
	lianpo: { name: "廉颇", glyph: "颇", accent: "#b8873a", full: "/assets/figures/lianpo/classical/portrait/full-default.png" },
	zhaohuiwen: { name: "赵惠文王", glyph: "惠", accent: "#c0392b", full: "/assets/figures/zhaohuiwen/classical/portrait/full-default.png" },
	mouxian: { name: "缪贤", glyph: "贤", accent: "#7a6e5c", full: "/assets/figures/mouxian/classical/portrait/full-default.png" },
	// 白起线（白起王翦列传·卷73）
	// 屈原线（屈原贾生列传·卷84）
	quyuan: { name: "屈原（三闾大夫）", glyph: "原", accent: "#4a6b8a", full: "/assets/figures/quyuan/classical/portrait/full-default.png" },
	shangguan_dafu: { name: "上官大夫", glyph: "尚", accent: "#6b4a4a", full: "/assets/figures/shangguan_dafu/classical/portrait/full-default.png" },
	yufu: { name: "渔父", glyph: "渔", accent: "#5a7a6b", full: "/assets/figures/yufu/classical/portrait/full-default.png" },
	// 乐毅线（乐毅列传·卷80）
	yueyi: { name: "乐毅", glyph: "毅", accent: "#8a6b4a", full: "/assets/figures/yueyi/classical/portrait/full-default.png" },
	yanzhaowang: { name: "燕昭王", glyph: "昭", accent: "#7a4a2a", full: "/assets/figures/yanzhaowang/classical/portrait/full-default.png" },
	yanhuiwang: { name: "燕惠王", glyph: "惠", accent: "#6a3a3a", full: "/assets/figures/yanhuiwang/classical/portrait/full-default.png" },
	qijie: { name: "骑劫", glyph: "劫", accent: "#5a3a3a", full: "/assets/figures/qijie/classical/portrait/full-default.png" },
	// 田单线（田单列传·卷82）
	tiandan: { name: "田单", glyph: "单", accent: "#a05028", full: "/assets/figures/tiandan/classical/portrait/full-default.png" },
	shenshizu: { name: "神师小卒", glyph: "卒", accent: "#7a8a5a", full: "/assets/figures/shenshizu/classical/portrait/full-default.png" },
	// 战国四公子线（孟尝君列传·卷75/平原君列传·卷76/魏公子列传·卷77/春申君列传·卷78）
	mengchangjun: { name: "孟尝君（田文）", glyph: "尝", accent: "#6b5a3a", full: "/assets/figures/mengchangjun/classical/portrait/full-default.png" },
	pingyuanjun: { name: "平原君（赵胜）", glyph: "胜", accent: "#5a5a7a", full: "/assets/figures/pingyuanjun/classical/portrait/full-default.png" },
	xinlingjun: { name: "信陵君（魏无忌）", glyph: "信", accent: "#4a6a7a", full: "/assets/figures/xinlingjun/classical/portrait/full-default.png" },
	chunshenjun: { name: "春申君（黄歇）", glyph: "申", accent: "#5a7a4a", full: "/assets/figures/chunshenjun/classical/portrait/full-default.png" },
	fengxuan: { name: "冯谖", glyph: "谖", accent: "#7a6a4a", full: "/assets/figures/fengxuan/classical/portrait/full-default.png" },
	maosui: { name: "毛遂", glyph: "遂", accent: "#6a5a3a", full: "/assets/figures/maosui/classical/portrait/full-default.png" },
	houying: { name: "侯嬴", glyph: "嬴", accent: "#6b6b5a", full: "/assets/figures/houying/classical/portrait/full-default.png" },
	zhuhai: { name: "朱亥", glyph: "亥", accent: "#5a5a6b", full: "/assets/figures/zhuhai/classical/portrait/full-default.png" },
	liyuan: { name: "李园", glyph: "园", accent: "#6a3a3a", full: "/assets/figures/liyuan/classical/portrait/full-default.png" },
	zhuying: { name: "朱英", glyph: "英", accent: "#4a6a4a", full: "/assets/figures/zhuying/classical/portrait/full-default.png" },
	// 四公子聚合（群像）
	sigongzi: { name: "战国四公子", glyph: "四", accent: "#b8873a", full: "/assets/figures/sigongzi/classical/portrait/full-default.png" },
	// 兵家·孙膑
	sunbin: { name: "孙膑", glyph: "膑", accent: "#5a8ac9", full: "/assets/figures/sunbin/classical/portrait/full-default.png" },
	// 魏国·庞涓
	pangjuan: { name: "庞涓", glyph: "涓", accent: "#7a5c3a", full: "/assets/figures/pangjuan/classical/portrait/full-default.png" },
	// 医家·扁鹊
	bianque: { name: "扁鹊", glyph: "鹊", accent: "#5a8f6b", full: "/assets/figures/bianque/classical/portrait/full-default.png" },
	// 秦国·樗里疾
	chuliji: { name: "樗里疾", glyph: "樗", accent: "#6b7a5c", full: "/assets/figures/chuliji/classical/portrait/full-default.png" },
	// 秦国·甘茂
	ganmao: { name: "甘茂", glyph: "茂", accent: "#5a7a5c", full: "/assets/figures/ganmao/classical/portrait/full-default.png" },
	// 秦国·甘罗
	ganluo: { name: "甘罗", glyph: "罗", accent: "#b8873a", full: "/assets/figures/ganluo/classical/portrait/full-default.png" },
	// 名家·公孙龙
	gongsunlong: { name: "公孙龙", glyph: "龙", accent: "#5a7a9c", full: "/assets/figures/gongsunlong/classical/portrait/full-default.png" },
	// 名家·惠施（与惠子 huizi 互补）
	huishi: { name: "惠施", glyph: "施", accent: "#5a7a9c", full: "/assets/figures/huishi/classical/portrait/full-default.png" },
	// 法家·李悝
	"likui-zg": { name: "李悝", glyph: "悝", accent: "#8a6f4a", full: "/assets/figures/likui-zg/classical/portrait/full-default.png" },
	// 刺客副使·秦舞阳
	qinwuyang: { name: "秦舞阳", glyph: "舞", accent: "#a85d3a", full: "/assets/figures/qinwuyang/classical/portrait/full-default.png" },
	// 法家·申不害
	shenbuhai: { name: "申不害", glyph: "申", accent: "#5a7a8c", full: "/assets/figures/shenbuhai/classical/portrait/full-default.png" },
	// 楚辞·宋玉
	songyu: { name: "宋玉", glyph: "玉", accent: "#8a6fb0", full: "/assets/figures/songyu/classical/portrait/full-default.png" },
	// 策士·唐雎
	tangju: { name: "唐雎", glyph: "雎", accent: "#4a6b8a", full: "/assets/figures/tangju/classical/portrait/full-default.png" },
	// 燕国·田光
	tianguang: { name: "田光", glyph: "光", accent: "#b8973a", full: "/assets/figures/tianguang/classical/portrait/full-default.png" },
	// 赵国·虞卿
	yuqing: { name: "虞卿", glyph: "卿", accent: "#5a8a7a", full: "/assets/figures/yuqing/classical/portrait/full-default.png" },
};

export const zhanguoBackgrounds: Record<string, BgStyle> = {
	// 商鞅线
	qin_xianyang: { label: "咸阳 · 秦都", css: "linear-gradient(180deg, #181008 0%, #120c06 58%, #0a0703 100%), radial-gradient(ellipse at 50% 30%, rgba(212,168,71,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/qin_xianyang.jpg" },
	qin_nanshimen: { label: "国都 · 南门立木", css: "linear-gradient(180deg, #14100a 0%, #0f0c07 58%, #080604 100%), radial-gradient(ellipse at 50% 70%, rgba(160,100,50,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/ref/qin_nanshimen.jpg" },
	qin_fating: { label: "秦廷 · 变法", css: "linear-gradient(180deg, #1a1208 0%, #140e05 58%, #0c0803 100%), radial-gradient(ellipse at 50% 28%, rgba(212,168,71,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/qin_fating.jpg" },
	shang_yi: { label: "商於 · 封邑", css: "linear-gradient(180deg, #10160e 0%, #0c1009 58%, #070a06 100%), radial-gradient(ellipse at 50% 72%, rgba(90,120,70,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/ref/shang_yi.jpg" },
	guanxia_keshe: { label: "关下 · 客舍", css: "linear-gradient(180deg, #0c0e12 0%, #080a0e 60%, #050608 100%), radial-gradient(ellipse at 50% 78%, rgba(80,90,110,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/ref/guanxia_keshe.jpg" },
	// 苏秦线
	luoyang_guixiang: { label: "洛阳 · 故里", css: "linear-gradient(180deg, #141016 0%, #0f0c12 58%, #08060a 100%), radial-gradient(ellipse at 50% 72%, rgba(120,90,130,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/luoyang_guixiang.jpg" },
	hezhong_yitan: { label: "六国 · 合纵议坛", css: "linear-gradient(180deg, #181410 0%, #120f0c 58%, #0a0806 100%), radial-gradient(ellipse at 50% 28%, rgba(180,140,70,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/hezhong_yitan.jpg" },
	liu_xiangyin: { label: "六国 · 相印", css: "linear-gradient(180deg, #1e1a12 0%, #17140d 58%, #0e0b07 100%), radial-gradient(ellipse at 50% 30%, rgba(212,175,90,0.26), transparent 55%)", image: "/assets/backgrounds/wudi/ref/liu_xiangyin.jpg" },
	qi_chelie: { label: "齐市 · 车裂", css: "linear-gradient(180deg, #140a0a 0%, #0f0707 58%, #080404 100%), radial-gradient(ellipse at 50% 72%, rgba(160,40,40,0.28), transparent 55%)", image: "/assets/backgrounds/wudi/qi_chelie.jpg" },
	// 张仪线
	qin_zhangxiang: { label: "秦 · 张仪为相", css: "linear-gradient(180deg, #121418 0%, #0d1014 58%, #080a0c 100%), radial-gradient(ellipse at 50% 28%, rgba(90,120,150,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/qin_zhangxiang.jpg" },
	chu_gongdian: { label: "楚 · 怀王宫殿", css: "linear-gradient(180deg, #180f16 0%, #120a10 58%, #0a0609 100%), radial-gradient(ellipse at 50% 30%, rgba(150,70,110,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/ref/chu_gongdian.jpg" },
	shangyu_liuli: { label: "商於 · 六里封地", css: "linear-gradient(180deg, #0e1410 0%, #0a100c 60%, #060807 100%), radial-gradient(ellipse at 50% 75%, rgba(70,120,90,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/shang_yi.jpg" },
	wei_dushi: { label: "魏 · 大梁都事", css: "linear-gradient(180deg, #141410 0%, #10100c 58%, #0a0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(150,150,90,0.16), transparent 55%)", image: "/assets/backgrounds/wudi/ref/wei_dushi.jpg" },
	// 范雎线
	wei_cezhong: { label: "魏 · 厕中受辱", css: "linear-gradient(180deg, #08080a 0%, #050507 60%, #030304 100%), radial-gradient(ellipse at 50% 78%, rgba(50,40,40,0.28), transparent 55%)", image: "/assets/backgrounds/wudi/ref/wei_cezhong.jpg" },
	qin_qixiang: { label: "秦 · 应侯为相", css: "linear-gradient(180deg, #16101a 0%, #110c14 58%, #0a070c 100%), radial-gradient(ellipse at 50% 28%, rgba(140,90,160,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/ref/qin_qixiang.jpg" },
	xujia_chidi: { label: "秦 · 绨袍马食", css: "linear-gradient(180deg, #14100e 0%, #100c0a 58%, #0a0706 100%), radial-gradient(ellipse at 50% 70%, rgba(120,90,60,0.24), transparent 55%)", image: "/assets/backgrounds/wudi/ref/xujia_chidi.jpg" },
	changping: { label: "长平 · 之战", css: "linear-gradient(180deg, #180808 0%, #120505 58%, #080303 100%), radial-gradient(ellipse at 50% 72%, rgba(180,30,30,0.30), transparent 55%)", image: "/assets/backgrounds/wudi/changping.jpg", video: "/assets/backgrounds/wudi/video/changping.mp4" },
	duyou_cijian: { label: "杜邮 · 赐剑", css: "linear-gradient(180deg, #101418 0%, #0c1013 58%, #070a0c 100%), radial-gradient(ellipse at 50% 30%, rgba(60,80,110,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/duyou_cijian.jpg" },
	// 廉颇蔺相如线
	zhao_handan: { label: "邯郸 · 赵宫", css: "linear-gradient(180deg, #141410 0%, #100f0c 58%, #0a0907 100%), radial-gradient(ellipse at 50% 28%, rgba(180,140,70,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/zhao_handan.jpg" },
	qin_zhangtai: { label: "秦 · 章台", css: "linear-gradient(180deg, #1a1208 0%, #140e05 58%, #0c0803 100%), radial-gradient(ellipse at 50% 30%, rgba(212,168,71,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/ref/qin_zhangtai.jpg" },
	mianchi_hui: { label: "渑池 · 之会", css: "linear-gradient(180deg, #181410 0%, #130f0c 58%, #0c0806 100%), radial-gradient(ellipse at 50% 40%, rgba(170,130,70,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/ref/mianchi_hui.jpg" },
	fujing_junfu: { label: "蔺府 · 负荆", css: "linear-gradient(180deg, #101612 0%, #0c100e 58%, #070a08 100%), radial-gradient(ellipse at 50% 72%, rgba(90,130,100,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/ref/fujing_junfu.jpg" },
	// 白起线
	yique: { label: "伊阙 · 古战场", css: "linear-gradient(180deg, #100808 0%, #0c0606 58%, #060303 100%), radial-gradient(ellipse at 50% 70%, rgba(130,30,30,0.25), transparent 55%)", image: "/assets/backgrounds/wudi/yique.jpg" },
	qin_chaotang: { label: "咸阳 · 秦朝堂", css: "linear-gradient(180deg, #181008 0%, #130c06 58%, #0a0703 100%), radial-gradient(ellipse at 50% 28%, rgba(190,140,60,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/qin_chaotang_v2.jpg" },
	duyou: { label: "杜邮 · 赐剑亭", css: "linear-gradient(180deg, #0e1216 0%, #0a0e11 58%, #06080a 100%), radial-gradient(ellipse at 50% 75%, rgba(80,110,140,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/duyou.jpg" },
	// 屈原线
	miluojiang: { label: "汨罗江 · 泽畔", css: "linear-gradient(180deg, #0c1418 0%, #080f12 58%, #05080a 100%), radial-gradient(ellipse at 50% 72%, rgba(70,110,140,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/miluojiang.jpg" },
	// 乐毅线
	yan_chaotang: { label: "蓟城 · 燕朝堂", css: "linear-gradient(180deg, #16120c 0%, #110e08 58%, #0a0805 100%), radial-gradient(ellipse at 50% 30%, rgba(180,130,70,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/yan_chaotang_v2.jpg" },
	zhao_chaotang: { label: "邯郸 · 赵朝堂", css: "linear-gradient(180deg, #141016 0%, #0f0c12 58%, #080609 100%), radial-gradient(ellipse at 50% 28%, rgba(130,90,150,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/zhao_chaotang.jpg" },
	// 田单线
	linzi: { label: "临淄 · 齐都", css: "linear-gradient(180deg, #14120a 0%, #0f0d07 58%, #080704 100%), radial-gradient(ellipse at 50% 28%, rgba(180,150,70,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/linzi.jpg" },
	jiamo: { label: "即墨 · 孤城", css: "linear-gradient(180deg, #120e08 0%, #0e0b06 58%, #070603 100%), radial-gradient(ellipse at 50% 40%, rgba(160,100,50,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/jiamo.jpg" },
	// 战国四公子线
	zhanguo_sigongzi: { label: "战国 · 四公子聚像", css: "linear-gradient(180deg, #14100c 0%, #0f0b08 58%, #080604 100%), radial-gradient(ellipse at 30% 30%, rgba(180,140,80,0.15), transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(100,140,160,0.15), transparent 50%)", image: "/assets/backgrounds/wudi/ref/zhanguo_sigongzi.jpg" },
	hangu_guan: { label: "函谷关 · 关门", css: "linear-gradient(180deg, #0c0e10 0%, #080a0c 58%, #050608 100%), radial-gradient(ellipse at 50% 62%, rgba(80,100,120,0.22), transparent 55%)", image: "/assets/backgrounds/wudi/hangu_guan.jpg", video: "/assets/backgrounds/wudi/video/hangu_guan.mp4" },
	handan: { label: "邯郸 · 赵都", css: "linear-gradient(180deg, #141016 0%, #0f0c11 58%, #080608 100%), radial-gradient(ellipse at 50% 30%, rgba(150,100,140,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/handan.jpg" },
	daliang: { label: "大梁 · 夷门", css: "linear-gradient(180deg, #101412 0%, #0c100e 58%, #070a09 100%), radial-gradient(ellipse at 50% 70%, rgba(90,130,110,0.18), transparent 55%)", image: "/assets/backgrounds/wudi/ref/daliang.jpg" },
	chu_gongting: { label: "郢都 · 楚宫廷", css: "linear-gradient(180deg, #0e1412 0%, #0a0e0c 58%, #050807 100%), radial-gradient(ellipse at 50% 28%, rgba(80,120,100,0.20), transparent 55%)", image: "/assets/backgrounds/wudi/chu_gongting_v2.jpg" },
	yan_chaotang_alt1: { label: "蓟城 · 拜将", css: "linear-gradient(180deg, #1f1a12 0%, #17120c 60%, #0d0a07 100%), radial-gradient(ellipse at 50% 30%, rgba(184,151,58,0.14), transparent 55%)", image: "/assets/backgrounds/wudi/ref/zhao_chaotang.jpg" },
};
