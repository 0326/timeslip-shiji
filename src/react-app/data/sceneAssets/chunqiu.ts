// 系列 chunqiu · 春秋（越王勾践世家，卷四十一）立绘/背景。
// base 已有 qingyue 可复用；本文件新增勾践线人物与场景。
import type { SpriteInfo, BgStyle } from "./base";

export const chunqiuSprites: Record<string, SpriteInfo> = {
	// 勾践线
	goujian: { name: "越王勾践", glyph: "践", accent: "#6b8f5a" },
	fanli: { name: "范蠡", glyph: "蠡", accent: "#5a8f6b" },
	wenzhong: { name: "文种", glyph: "种", accent: "#8a7a3a" },
	fengtong: { name: "逢同", glyph: "逢", accent: "#6b7a5c" },
	// 晋文公重耳线
	chonger: { name: "晋文公重耳", glyph: "重", accent: "#b8973a" },
	lij: { name: "骊姬", glyph: "骊", accent: "#b8557a" },
	xianggong: { name: "晋献公", glyph: "献", accent: "#7a6e5c" },
	huyan: { name: "狐偃（舅犯）", glyph: "偃", accent: "#5a8f6b" },
	zhaocui: { name: "赵衰", glyph: "衰", accent: "#6b7a5c" },
	jietui: { name: "介子推", glyph: "介", accent: "#8a7a5c" },
	qinmu: { name: "秦穆公", glyph: "穆", accent: "#d4a847" },
	chuchengwang: { name: "楚成王", glyph: "楚", accent: "#7a2f2f" },
	// 伍子胥线
	wuzixu: { name: "伍子胥", glyph: "胥", accent: "#4a6b8a" },
	chupingwang: { name: "楚平王", glyph: "平", accent: "#7a2f2f" },
	feiwuji: { name: "费无忌", glyph: "忌", accent: "#6b5a48" },
	wushe: { name: "伍奢", glyph: "奢", accent: "#8a7a5c" },
	zhuanzhu: { name: "专诸", glyph: "诸", accent: "#a85d3a" },
	gongziguang: { name: "公子光（阖庐）", glyph: "光", accent: "#c0392b" },
	bopi: { name: "伯嚭", glyph: "嚭", accent: "#8a6f4a" },
	fuchai: { name: "吴王夫差", glyph: "差", accent: "#7a5c8a" },
	// 齐桓公·管仲线
	qihuan: { name: "齐桓公", glyph: "桓", accent: "#d4a847" },
	guanzhong: { name: "管仲", glyph: "管", accent: "#5a8f6b" },
	baoshu: { name: "鲍叔牙", glyph: "鲍", accent: "#6b7a5c" },
	gongzijiu: { name: "公子纠", glyph: "纠", accent: "#8a6f4a" },
	shudiao: { name: "竖刁", glyph: "刁", accent: "#7a5c5c" },
	yiya: { name: "易牙", glyph: "牙", accent: "#8a5c48" },
	kaifang: { name: "开方", glyph: "开", accent: "#6b5a48" },
	// 秦穆公线（qinmu 已在重耳线注册，复用）
	baili: { name: "百里奚", glyph: "奚", accent: "#7a6e5c" },
	jianshu: { name: "蹇叔", glyph: "蹇", accent: "#5a7a8c" },
	mengming: { name: "孟明视", glyph: "孟", accent: "#a85d3a" },
	youyu: { name: "由余", glyph: "余", accent: "#6b7a5c" },
	// 孙武线（阖庐=gongziguang 复用）
	sunwu: { name: "孙武", glyph: "孙", accent: "#4a6b8a" },
};

export const chunqiuBackgrounds: Record<string, BgStyle> = {
	// 勾践线 · 七幕
	zuili_ye: { label: "檇李 · 战野", css: "linear-gradient(180deg, #1c0f0a 0%, #150b07 58%, #0c0604 100%), radial-gradient(ellipse at 50% 75%, rgba(168,50,40,0.26), transparent 55%)" },
	fujiao_shan: { label: "夫椒 · 山", css: "linear-gradient(180deg, #0f1418 0%, #0b1014 58%, #070a0d 100%), radial-gradient(ellipse at 50% 30%, rgba(60,90,110,0.20), transparent 55%)" },
	kuaijishan: { label: "会稽 · 孤山", css: "linear-gradient(180deg, #12161a 0%, #0d1013 58%, #080a0c 100%), radial-gradient(ellipse at 50% 78%, rgba(90,100,110,0.16), transparent 55%)" },
	yue_guo: { label: "越国 · 卧薪尝胆", css: "linear-gradient(180deg, #10160e 0%, #0c1009 58%, #080a06 100%), radial-gradient(ellipse at 50% 30%, rgba(90,143,107,0.16), transparent 58%)" },
	huangchi: { label: "黄池 · 会盟", css: "linear-gradient(180deg, #1e1808 0%, #171205 58%, #0e0a03 100%), radial-gradient(ellipse at 50% 28%, rgba(212,168,71,0.22), transparent 55%)" },
	gusu_shan: { label: "姑苏 · 山围", css: "linear-gradient(180deg, #1a1018 0%, #140c12 58%, #0c0809 100%), radial-gradient(ellipse at 50% 70%, rgba(120,60,90,0.20), transparent 55%)" },
	huai_ba: { label: "淮泗 · 霸业", css: "linear-gradient(180deg, #181a10 0%, #12140b 58%, #0c0d07 100%), radial-gradient(ellipse at 50% 28%, rgba(143,174,90,0.20), transparent 58%)" },
	// 晋文公重耳线
	jin_luan: { label: "晋 · 骊姬之乱", css: "linear-gradient(180deg, #1c0f0c 0%, #150b08 58%, #0c0605 100%), radial-gradient(ellipse at 50% 30%, rgba(168,50,60,0.22), transparent 55%)" },
	liuwang: { label: "列国 · 流亡", css: "linear-gradient(180deg, #16130d 0%, #110f0a 60%, #0a0806 100%), radial-gradient(ellipse at 50% 78%, rgba(120,110,90,0.20), transparent 55%)" },
	qi_anle: { label: "齐 · 安乐乡", css: "linear-gradient(180deg, #1c1810 0%, #16120b 58%, #0d0a06 100%), radial-gradient(ellipse at 50% 30%, rgba(201,162,71,0.18), transparent 58%)" },
	chu_yan: { label: "楚 · 成王之宴", css: "linear-gradient(180deg, #1e1408 0%, #170f05 58%, #0e0903 100%), radial-gradient(ellipse at 50% 28%, rgba(200,120,50,0.20), transparent 55%)" },
	qin_na: { label: "秦 · 纳重耳", css: "linear-gradient(180deg, #1a1408 0%, #140f05 58%, #0c0803 100%), radial-gradient(ellipse at 50% 28%, rgba(212,168,71,0.22), transparent 55%)" },
	chengpu: { label: "城濮 · 之战", css: "linear-gradient(180deg, #1c1110 0%, #150c0b 58%, #0c0707 100%), radial-gradient(ellipse at 50% 72%, rgba(168,60,45,0.26), transparent 55%)" },
	jiantu: { label: "践土 · 之盟", css: "linear-gradient(180deg, #1e1a10 0%, #17130b 58%, #0e0a06 100%), radial-gradient(ellipse at 50% 28%, rgba(212,175,90,0.22), transparent 58%)" },
	mianshan: { label: "绵山 · 焚林", css: "linear-gradient(180deg, #14160e 0%, #0f1109 58%, #090b06 100%), radial-gradient(ellipse at 50% 68%, rgba(160,80,40,0.24), transparent 55%)" },
	// 伍子胥线
	chu_ping_ting: { label: "楚 · 平王庭", css: "linear-gradient(180deg, #1c0f0c 0%, #150b08 58%, #0c0605 100%), radial-gradient(ellipse at 50% 30%, rgba(150,45,50,0.20), transparent 55%)" },
	zhaoguan_ye: { label: "昭关 · 夜奔", css: "linear-gradient(180deg, #0b0e14 0%, #080a10 58%, #05070b 100%), radial-gradient(ellipse at 50% 20%, rgba(80,100,130,0.14), transparent 50%)" },
	wushi_xiao: { label: "吴市 · 吹箫", css: "linear-gradient(180deg, #14130f 0%, #0f0e0b 60%, #090806 100%), radial-gradient(ellipse at 50% 75%, rgba(110,110,120,0.14), transparent 55%)" },
	yuchang: { label: "鱼肠 · 刺僚", css: "linear-gradient(180deg, #180d10 0%, #12090c 58%, #0a0507 100%), radial-gradient(ellipse at 50% 40%, rgba(150,50,60,0.24), transparent 50%)" },
	po_ying: { label: "破郢 · 入楚", css: "linear-gradient(180deg, #1e1108 0%, #170c05 58%, #0e0603 100%), radial-gradient(ellipse at 50% 70%, rgba(200,90,40,0.28), transparent 55%)" },
	bianshi: { label: "鞭尸 · 掘墓", css: "linear-gradient(180deg, #141210 0%, #0f0d0b 60%, #080706 100%), radial-gradient(ellipse at 50% 72%, rgba(120,60,50,0.20), transparent 55%)" },
	shulou_jian: { label: "属镂 · 赐死", css: "linear-gradient(180deg, #101418 0%, #0c1013 58%, #070a0c 100%), radial-gradient(ellipse at 50% 30%, rgba(70,90,110,0.16), transparent 50%)" },
	// 齐桓公·管仲线
	linzi_zheng: { label: "临淄 · 君位之争", css: "linear-gradient(180deg, #1c1109 0%, #150c06 58%, #0c0604 100%), radial-gradient(ellipse at 50% 30%, rgba(180,90,50,0.20), transparent 55%)" },
	guanbao_jian: { label: "管鲍 · 荐相", css: "linear-gradient(180deg, #16190f 0%, #11140b 58%, #0a0d07 100%), radial-gradient(ellipse at 50% 32%, rgba(90,143,107,0.18), transparent 55%)" },
	zunwang_meng: { label: "会盟 · 尊王攘夷", css: "linear-gradient(180deg, #1c1810 0%, #16120b 58%, #0d0a06 100%), radial-gradient(ellipse at 50% 28%, rgba(212,168,71,0.20), transparent 58%)" },
	kuiqiu_hui: { label: "葵丘 · 之会", css: "linear-gradient(180deg, #201a10 0%, #18130b 58%, #0e0a06 100%), radial-gradient(ellipse at 50% 26%, rgba(212,175,90,0.24), transparent 55%)" },
	lunxiang_bing: { label: "病榻 · 论相", css: "linear-gradient(180deg, #14151a 0%, #0f1013 60%, #090a0c 100%), radial-gradient(ellipse at 50% 30%, rgba(90,100,120,0.14), transparent 55%)" },
	qi_gong_ning: { label: "齐宫 · 近佞", css: "linear-gradient(180deg, #1a130f 0%, #140e0b 60%, #0c0807 100%), radial-gradient(ellipse at 50% 30%, rgba(150,90,60,0.16), transparent 55%)" },
	qi_e_si: { label: "齐宫 · 饿死虫流", css: "linear-gradient(180deg, #121110 0%, #0d0c0b 60%, #080706 100%), radial-gradient(ellipse at 50% 72%, rgba(90,80,60,0.16), transparent 55%)" },
	// 秦穆公线
	yong_ting: { label: "雍城 · 秦庭", css: "linear-gradient(180deg, #1c140b 0%, #150f07 58%, #0c0804 100%), radial-gradient(ellipse at 50% 30%, rgba(200,150,70,0.16), transparent 55%)" },
	wugu_xian: { label: "五羖 · 求贤", css: "linear-gradient(180deg, #171812 0%, #12130d 58%, #0a0b07 100%), radial-gradient(ellipse at 50% 32%, rgba(150,140,90,0.16), transparent 55%)" },
	fanzhou_yi: { label: "泛舟 · 输粟", css: "linear-gradient(180deg, #0f1518 0%, #0b1013 58%, #070b0d 100%), radial-gradient(ellipse at 50% 80%, rgba(60,110,140,0.20), transparent 55%)" },
	yaoshan_fu: { label: "崤山 · 覆师", css: "linear-gradient(180deg, #191010 0%, #130b0b 58%, #0a0607 100%), radial-gradient(ellipse at 50% 72%, rgba(160,55,45,0.24), transparent 55%)" },
	suofu_zui: { label: "素服 · 罪己", css: "linear-gradient(180deg, #16171a 0%, #111214 60%, #0b0c0e 100%), radial-gradient(ellipse at 50% 30%, rgba(180,180,190,0.12), transparent 50%)" },
	xirong_ba: { label: "西戎 · 拓霸", css: "linear-gradient(180deg, #1c1610 0%, #16110b 58%, #0d0a06 100%), radial-gradient(ellipse at 50% 72%, rgba(200,130,60,0.20), transparent 55%)" },
	huangniao_xun: { label: "黄鸟 · 殉良", css: "linear-gradient(180deg, #14140f 0%, #0f0f0b 60%, #080806 100%), radial-gradient(ellipse at 50% 68%, rgba(150,130,70,0.16), transparent 55%)" },
	// 夫差线（fujiao_shan/kuaijishan/huangchi/gusu_shan/shulou_jian 复用勾践·伍子胥线）
	wu_gong_ting: { label: "姑苏 · 吴庭", css: "linear-gradient(180deg, #1a1018 0%, #140c12 58%, #0c0809 100%), radial-gradient(ellipse at 50% 30%, rgba(150,60,90,0.18), transparent 55%)" },
	ailing_zhan: { label: "艾陵 · 伐齐", css: "linear-gradient(180deg, #1c1110 0%, #150c0b 58%, #0c0707 100%), radial-gradient(ellipse at 50% 72%, rgba(168,60,45,0.24), transparent 55%)" },
	// 孙武线（po_ying 破郢复用伍子胥线）
	wugong_jiao: { label: "吴宫 · 教战斩姬", css: "linear-gradient(180deg, #18131a 0%, #120e14 58%, #0a080c 100%), radial-gradient(ellipse at 50% 40%, rgba(120,60,80,0.20), transparent 50%)" },
};
