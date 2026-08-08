// 五帝/夏系列史识碎片注册表
// 单一数据源：与 InkStoryConfig.impacts 共用 id，避免双份维护。
// 碎片 id 前缀规范：
//   impact_xxx       — 由 #impact:ID 选项触发（选对解锁）
//   death_xxx        — 由死亡结局触发（旁支史识）
//   quiz_xxx         — 由章末测验触发（隐藏碎片）
//   graph_xxx        — 由章系通关自动解锁的图谱节点

export interface KnowledgeFragment {
	id: string;
	/** 碎片标题（卡片展示） */
	title: string;
	/** 碎片内容（历史意义解读） */
	content: string;
	/** 所属章节（storyKey: charId:seriesId） */
	storyKey: string;
	/** 碎片类别 */
	kind: "impact" | "death" | "quiz" | "graph";
	/** 图谱坐标（x, y）—— 用于史识图谱节点排布 */
	graphPos?: { x: number; y: number };
	/** 前置碎片 id 列表（图谱连线用） */
	requires?: string[];
}

/** 五帝/夏全部史识碎片。新增碎片直接追加即可。 */
export const WUDI_KNOWLEDGE: KnowledgeFragment[] = [
	// ═══ 黄帝 · 阪泉之战 ═══
	{
		id: "impact_banquan_yanhuang",
		title: "炎黄子孙",
		content:
			"你让炎帝归入旗下，两族血脉合流。从此，后世每一个人都自称炎黄子孙——这个选择，定义了一个民族的名字。",
		storyKey: "huangdi:banquan",
		kind: "impact",
		graphPos: { x: 240, y: 120 },
	},
	{
		id: "death_banquan_supply",
		title: "断粮之鉴",
		content:
			"断人粮道虽可速胜，却断了百姓的活路。你赢了仗，却输了人心——天下不是靠断人活路得来的。",
		storyKey: "huangdi:banquan",
		kind: "death",
		graphPos: { x: 120, y: 200 },
	},
	{
		id: "quiz_banquan_minde",
		title: "修德振兵",
		content:
			"阪泉三战之前，轩辕先治五气、蓺五种、抚万民、度四方。德在兵先，方能令诸侯咸来宾从。",
		storyKey: "huangdi:banquan",
		kind: "quiz",
		graphPos: { x: 240, y: 240 },
		requires: ["impact_banquan_yanhuang"],
	},

	// ═══ 黄帝 · 涿鹿擒蚩尤 ═══
	{
		id: "impact_zhuolu_zhengshi",
		title: "天下共主",
		content:
			"你不是靠一人之力，是把天下的力气合到了一处。从此，「天子」二字有了模样——合诸侯之力以定乱，是华夏共主的第一义。",
		storyKey: "huangdi:zhuolu",
		kind: "impact",
		graphPos: { x: 420, y: 120 },
		requires: ["impact_banquan_yanhuang"],
	},
	{
		id: "death_zhuolu_fog",
		title: "雾中失散",
		content:
			"指南车是后世传奇，可雾里失向、军心自散的险是真的。诸侯之师合而不散，才是涿鹿真正的胜负手。",
		storyKey: "huangdi:zhuolu",
		kind: "death",
		graphPos: { x: 360, y: 240 },
	},
	{
		id: "quiz_zhuolu_zhinanche",
		title: "指南破雾",
		content:
			"风后造指南车辨向，诸侯结阵不散——传说归传说，但『合师』二字才是破雾的底气。",
		storyKey: "huangdi:zhuolu",
		kind: "quiz",
		graphPos: { x: 480, y: 240 },
		requires: ["impact_zhuolu_zhengshi"],
	},

	// ═══ 黄帝 · 垂衣治天下 ═══
	{
		id: "impact_zhitianxia_xunfang",
		title: "巡方之德",
		content:
			"坐等人拜的天子，德就凉了。你用足迹丈量天下，把德走出深宫、送进万国——华夏的共主，从此不是坐在城里的王，而是走在路上的圣。",
		storyKey: "huangdi:zhitianxia",
		kind: "impact",
		graphPos: { x: 600, y: 120 },
		requires: ["impact_zhuolu_zhengshi"],
	},
	{
		id: "quiz_zhitianxia_tianshi",
		title: "顺天播谷",
		content:
			"顺天地之纪，时播百谷草木——治国治到百姓碗里多一口粮，才算落了地。",
		storyKey: "huangdi:zhitianxia",
		kind: "quiz",
		graphPos: { x: 720, y: 120 },
		requires: ["impact_zhitianxia_xunfang"],
	},

	// ═══ 黄帝 · 起源穿越轩辕 ═══
	{
		id: "impact_qiyuan_xuanyuan",
		title: "轩辕之源",
		content:
			"你落进史册的第一页，成了那个叫轩辕的婴孩。生而神灵，弱而能言，幼而徇齐，长而敦敏——华夏的起点，从你睁开眼睛这一刻起，有了名姓。",
		storyKey: "huangdi:qiyuan",
		kind: "impact",
		graphPos: { x: 120, y: 200 },
	},

	// ═══ 黄帝章系图谱总纲 ═══
	{
		id: "graph_huangdi_xianding",
		title: "轩辕先德",
		content:
			"黄帝的一生，从『修德振兵』四个字开始。先让百姓活，再让天下服——这是华夏圣王的起点。",
		storyKey: "huangdi:qiyuan",
		kind: "graph",
		graphPos: { x: 60, y: 120 },
	},
	{
		id: "graph_huangdi_huaxia",
		title: "华夏共祖",
		content:
			"阪泉合炎黄，涿鹿擒蚩尤，垂衣治天下——三幕之后，『黄帝』二字成了华夏的共同源头。",
		storyKey: "huangdi:zhitianxia",
		kind: "graph",
		graphPos: { x: 840, y: 120 },
		requires: ["quiz_zhitianxia_tianshi"],
	},

	// ═══ 颛顼帝喾 · 承天执中 ═══
	{
		id: "impact_diku_jingyuanzhizhong",
		title: "静渊执中",
		content:
			"高阳以『静渊』定四方，高辛以『执中』服天下。华夏君德的调子，从祖孙两代手里定了下来——不躁、不偏，此后三千年，圣王都绕着这两个字转。",
		storyKey: "zhuanxu:diku",
		kind: "impact",
		graphPos: { x: 960, y: 120 },
		requires: ["graph_huangdi_huaxia"],
	},
	{
		id: "death_diku_zaojin",
		title: "躁进失静",
		content:
			"史上的高阳『静渊有谋』，谋定而后动。你血一上头就出兵，恰恰丢了那个『静』字——天下未定，先乱在自己手里。",
		storyKey: "zhuanxu:diku",
		kind: "death",
		graphPos: { x: 900, y: 240 },
	},
	{
		id: "quiz_diku_jingyuan",
		title: "承天执中",
		content:
			"静渊以有谋，疏通而知事——不靠一兵一卒，天下自己归了心。帝喾溉执中而遍天下，日月所照，莫不从服。",
		storyKey: "zhuanxu:diku",
		kind: "quiz",
		graphPos: { x: 1020, y: 240 },
		requires: ["impact_diku_jingyuanzhizhong"],
	},

	// ═══ 尧 · 敬授民时 ═══
	{
		id: "impact_shoushi_lifa",
		title: "敬授民时",
		content:
			"你替天下人把日子的秩序定了下来。什么时候种，什么时候收，什么时候归家取暖——此后三千年，中国人抬头看天、低头种地，都离不开这套历法。",
		storyKey: "yao:shoushi",
		kind: "impact",
		graphPos: { x: 1140, y: 120 },
		requires: ["quiz_diku_jingyuan"],
	},
	{
		id: "death_shoushi_luanli",
		title: "臆断失历",
		content:
			"『时』不是圣人拍脑袋给的。尧是抬头去问天——顺昊天、法日月星辰，才敢把农时授给万民。凭臆断，天下人就跟着你的错历一起饿肚子。",
		storyKey: "yao:shoushi",
		kind: "death",
		graphPos: { x: 1080, y: 240 },
	},
	{
		id: "quiz_shoushi_runyue",
		title: "闰月正四时",
		content:
			"岁三百六十六日，以闰月正四时。差之毫厘，谬以千里——闰月把那点积欠一年年补齐，四时才不会错开。",
		storyKey: "yao:shoushi",
		kind: "quiz",
		graphPos: { x: 1200, y: 240 },
		requires: ["impact_shoushi_lifa"],
	},

	// ═══ 尧 · 咨岳求贤 ═══
	{
		id: "impact_qiuxian_sijuxian",
		title: "悉举求贤",
		content:
			"你越过亲疏贵贱，把门向整个天下敞开。舜的名字，就是从这一声『悉举』里被听到的——华夏的选贤，从此不再看出身，只看德行。",
		storyKey: "yao:qiuxian",
		kind: "impact",
		graphPos: { x: 1320, y: 120 },
		requires: ["impact_shoushi_lifa"],
	},
	{
		id: "death_qiuxian_danzhu",
		title: "徇私传子",
		content:
			"尧知子丹朱之不肖，不足授天下。终不以天下之病而利一人——徇私传位，天下便散了。",
		storyKey: "yao:qiuxian",
		kind: "death",
		graphPos: { x: 1260, y: 240 },
	},
	{
		id: "quiz_qiuxian_qiuxian",
		title: "咨岳求贤",
		content:
			"真正的圣君不是从不选错，而是选错了还肯睁开眼，接着往下找。尧试了共工、试了鲧，最后才找到了舜。",
		storyKey: "yao:qiuxian",
		kind: "quiz",
		graphPos: { x: 1380, y: 240 },
		requires: ["impact_qiuxian_sijuxian"],
	},

	// ═══ 尧 · 举舜试女 ═══
	{
		id: "impact_juxian_sanshikun",
		title: "三重考验",
		content:
			"你把最金贵的女儿放进去试他的德，把整套官制放进去试他的能——试到最后一分，才敢把天下交出去。禅让从不是一时兴起的慷慨，是一个老人用尽一生的审慎。",
		storyKey: "yao:juxian",
		kind: "impact",
		graphPos: { x: 1500, y: 120 },
		requires: ["impact_qiuxian_sijuxian"],
	},
	{
		id: "death_juxian_qishi",
		title: "弃贤轻信",
		content:
			"因一门恶名弃了舜，天下便落进丹朱手里。尧一生『择贤而授』的心气，就断在这儿了。轻信和弃贤一样，都到不了那个『尧以为圣』。",
		storyKey: "yao:juxian",
		kind: "death",
		graphPos: { x: 1440, y: 240 },
	},
	{
		id: "quiz_juxian_sanshikun",
		title: "择贤而授",
		content:
			"妻二女以观其内，处九男以观其外，入山林川泽暴风雷雨而不迷——托天下这么大的事，尧一分都不肯凭『听说』。",
		storyKey: "yao:juxian",
		kind: "quiz",
		graphPos: { x: 1560, y: 240 },
		requires: ["impact_juxian_sanshikun"],
	},

	// ═══ 尧舜禅让 ═══
	{
		id: "impact_shanrang_tianxiaweigong",
		title: "天下为公",
		content:
			"你把父爱让给了更大的一份。华夏的禅让，从你开始——「终不以天下之病而利一人」，这句话被后世记了三千年。",
		storyKey: "yao:shanrang",
		kind: "impact",
		graphPos: { x: 1680, y: 120 },
		requires: ["impact_juxian_sanshikun"],
	},
	{
		id: "death_shanrang_rush",
		title: "操切禅让",
		content:
			"史上的尧从不凭一句名声就交出天下——他让舜摄政、入大麓，试了又试。托付江山，从来不是一道诏令的事。",
		storyKey: "yao:shanrang",
		kind: "death",
		graphPos: { x: 1620, y: 240 },
	},
	{
		id: "quiz_shanrang_tianxiaweigong",
		title: "传贤不传子",
		content:
			"终不以天下之病而利一人——从尧开始，天下第一次成了天下人的天下。禅让这杆秤，被后世称量了三千年。",
		storyKey: "yao:shanrang",
		kind: "quiz",
		graphPos: { x: 1740, y: 240 },
		requires: ["impact_shanrang_tianxiaweigong"],
	},

	// ═══ 尧舜章系图谱总纲 ═══
	{
		id: "graph_yao_chuanrang",
		title: "禅让之光",
		content:
			"从敬授民时到咨岳求贤，从举舜试女到尧舜禅让——尧把天下从一家一姓的手里，交给了德行。这是华夏最亮的一次让。",
		storyKey: "yao:shanrang",
		kind: "graph",
		graphPos: { x: 1800, y: 120 },
		requires: ["quiz_shanrang_tianxiaweigong"],
	},

	// ═══ 舜 · 焚廪穿井 ═══
	{
		id: "impact_lijie_xiaozhi",
		title: "孝智两全",
		content:
			"烧过你的人，你以德报之；抢过你东西的人，你以礼待之。这不是软弱，是把『孝』字刻进了华夏的骨髓——从此，以德化人不再是一句空话。",
		storyKey: "shun:lijie",
		kind: "impact",
		graphPos: { x: 1920, y: 120 },
		requires: ["graph_yao_chuanrang"],
	},
	{
		id: "death_lijie_burn",
		title: "空手焚廪",
		content:
			"空手登上仓顶，被烈火吞没。舜的智，在于先备好斗笠与挖井的暗道——孝不是送命，是活下来还能以德报怨。",
		storyKey: "shun:lijie",
		kind: "death",
		graphPos: { x: 1860, y: 240 },
	},
	{
		id: "quiz_lijie_xiaozhi",
		title: "孝与智",
		content:
			"舜复事瞽叟爱弟弥谨。于是尧乃试舜五典百官，皆治——孝与智，缺一，都到不了这里。",
		storyKey: "shun:lijie",
		kind: "quiz",
		graphPos: { x: 1980, y: 240 },
		requires: ["impact_lijie_xiaozhi"],
	},

	// ═══ 舜 · 流放四凶 ═══
	{
		id: "impact_liuxiong_sixiongzu",
		title: "四罪咸服",
		content:
			"你举八元八恺于朝堂，流四凶四辠于四裔。善恶各得其分——天下服的不是刀，是那杆不偏的秤。",
		storyKey: "shun:liuxiong",
		kind: "impact",
		graphPos: { x: 2100, y: 120 },
		requires: ["impact_lijie_xiaozhi"],
	},
	{
		id: "death_liuxiong_appease",
		title: "姑息养奸",
		content:
			"恶不除，善难立。史上的舜以雷霆手段窜逐四凶，才换来『天下咸服』。姑息从来不是仁慈，是把祸根喂大了。",
		storyKey: "shun:liuxiong",
		kind: "death",
		graphPos: { x: 2040, y: 240 },
	},
	{
		id: "quiz_liuxiong_sixiongzu",
		title: "流四凶族",
		content:
			"流共工于幽陵，殛鲧于羽山——是流而非杀，是各得其所而非一概而论。罚当其罪，天下咸服。",
		storyKey: "shun:liuxiong",
		kind: "quiz",
		graphPos: { x: 2160, y: 240 },
		requires: ["impact_liuxiong_sixiongzu"],
	},

	// ═══ 舜 · 皋陶作刑 ═══
	{
		id: "impact_xingfa_qinzai",
		title: "钦哉慎刑",
		content:
			"你把『哀矜』二字刻进了华夏的律法里。以刑弼教，而非以杀立威——真正的法度，从来不是让人怕，是让人不必怕。",
		storyKey: "shun:xingfa",
		kind: "impact",
		graphPos: { x: 2280, y: 120 },
		requires: ["impact_liuxiong_sixiongzu"],
	},
	{
		id: "death_xingfa_tyranny",
		title: "严刑失德",
		content:
			"象以典刑，流宥五刑——舜把刑当作最不得已的手段。一味以杀立威，畏则畏矣，德却荡然，人心必离。",
		storyKey: "shun:xingfa",
		kind: "death",
		graphPos: { x: 2220, y: 240 },
	},
	{
		id: "quiz_xingfa_qinzai",
		title: "惟刑之静",
		content:
			"眚灾过赦，怙终贼刑——宽在无心之失，严在明知故犯。钦哉，钦哉，惟刑之静哉！",
		storyKey: "shun:xingfa",
		kind: "quiz",
		graphPos: { x: 2340, y: 240 },
		requires: ["impact_xingfa_qinzai"],
	},

	// ═══ 舜 · 命九官组阁 ═══
	{
		id: "impact_jiuguan_liangcaishouzhi",
		title: "庶绩咸熙",
		content:
			"你让二十二个人各归其位、各尽其能。天下明德，皆自虞帝始——一个能把对的人放到对的位置上的人，才配叫做天子。",
		storyKey: "shun:jiuguan",
		kind: "impact",
		graphPos: { x: 2460, y: 120 },
		requires: ["impact_xingfa_qinzai"],
	},
	{
		id: "death_jiuguan_biseng",
		title: "闭门独断",
		content:
			"舜继位第一事不是发号施令，而是辟四门、广开言路。跳过这一步，佞人进而贤者退，天下先离了心。",
		storyKey: "shun:jiuguan",
		kind: "death",
		graphPos: { x: 2400, y: 240 },
	},
	{
		id: "quiz_jiuguan_liangcaishouzhi",
		title: "三考黜陟",
		content:
			"三岁一考功，三考绌陟，远近众功咸兴——授官只是开始，考课才是它活下去的筋骨。",
		storyKey: "shun:jiuguan",
		kind: "quiz",
		graphPos: { x: 2520, y: 240 },
		requires: ["impact_jiuguan_liangcaishouzhi"],
	},

	// ═══ 舜禅于禹 · 二妃泣竹 ═══
	{
		id: "impact_chanyu_shanrangzhi",
		title: "禅让之继",
		content:
			"尧传舜，舜传禹——三代人接力，把『天下为公』四个字写进了华夏文明的开篇。此后四千年，每一次帝位之争，都会有人想起这个最初的答案。",
		storyKey: "shun:chanyu",
		kind: "impact",
		graphPos: { x: 2640, y: 120 },
		requires: ["impact_jiuguan_liangcaishouzhi"],
	},
	{
		id: "death_chanyu_passson",
		title: "传子失统",
		content:
			"尧不传丹朱、舜不传商均——传子之私与天下之公只能择一。效尧禅贤，方成太平；传给不肖之子，禅让之统就断了。",
		storyKey: "shun:chanyu",
		kind: "death",
		graphPos: { x: 2580, y: 240 },
	},
	{
		id: "quiz_chanyu_shanrangzhi",
		title: "苍梧斑竹",
		content:
			"舜效尧禅贤，荐禹于天。他把最后一口气还给了天下——湘水边两竿斑竹，是天地替他留的眼泪。",
		storyKey: "shun:chanyu",
		kind: "quiz",
		graphPos: { x: 2700, y: 240 },
		requires: ["impact_chanyu_shanrangzhi"],
	},

	// ═══ 舜章系图谱总纲 ═══
	{
		id: "graph_shun_dezhua",
		title: "明德自虞帝始",
		content:
			"焚廪穿井、流放四凶、皋陶作刑、命九官、禅让于禹——舜以德行天下，天下明德皆自虞帝始。",
		storyKey: "shun:chanyu",
		kind: "graph",
		graphPos: { x: 2760, y: 120 },
		requires: ["quiz_chanyu_shanrangzhi"],
	},

	// ═══ 大禹治水 ═══
	{
		id: "impact_zhishui_sanguo",
		title: "三过不入",
		content:
			"你把一个「家」，换成了天下万家的安宁。三过家门而不入——这份自苦，后人学不来，才叫大禹。",
		storyKey: "yu:zhishui",
		kind: "impact",
		graphPos: { x: 2880, y: 120 },
		requires: ["graph_shun_dezhua"],
	},
	{
		id: "death_zhishui_tang",
		title: "重蹈堙堵",
		content:
			"父鲧以土堙堵水，九年而败。禹改堵为疏、顺水之性导之入海——重走那条老路，堤越高、溃越猛。",
		storyKey: "yu:zhishui",
		kind: "death",
		graphPos: { x: 2820, y: 240 },
	},
	{
		id: "quiz_zhishui_sanguo",
		title: "随山浚川",
		content:
			"禹伤先人父鲧功之不成受诛，乃劳身焦思，居外十三年，过家门不敢入——改堵为疏是智，三过不入是仁。",
		storyKey: "yu:zhishui",
		kind: "quiz",
		graphPos: { x: 2940, y: 240 },
		requires: ["impact_zhishui_sanguo"],
	},

	// ═══ 禹会涂山 · 受禅即位 ═══
	{
		id: "impact_shouchan_namian",
		title: "南面朝天下",
		content:
			"你退居阳城，天下诸侯却不约而同越过商均、奔你而来。推让而后受——夏后氏的天下，从你开始。",
		storyKey: "yu:shouchan",
		kind: "impact",
		graphPos: { x: 3060, y: 120 },
		requires: ["impact_zhishui_sanguo"],
	},
	{
		id: "death_shouchan_disdain",
		title: "轻推昌言",
		content:
			"皋陶之谋核心在『知人』『安民』两端。治水靠力，治人靠心——轻推此言，夏后之业坏在根上。",
		storyKey: "yu:shouchan",
		kind: "death",
		graphPos: { x: 3000, y: 240 },
	},
	{
		id: "quiz_shouchan_namian",
		title: "推让而后受",
		content:
			"禹辞辟舜之子商均于阳城。天下诸侯皆去商均而朝禹——上古的天下，是让出来的。",
		storyKey: "yu:shouchan",
		kind: "quiz",
		graphPos: { x: 3120, y: 240 },
		requires: ["impact_shouchan_namian"],
	},

	// ═══ 禹夏章系图谱总纲 ═══
	{
		id: "graph_yu_zhishui",
		title: "大禹立夏",
		content:
			"十三年治水，三过不入；推让而后受，南面朝天下——禹把洪水换成了万家安宁，也把禅让推到了最后的辉煌。",
		storyKey: "yu:shouchan",
		kind: "graph",
		graphPos: { x: 3180, y: 120 },
		requires: ["quiz_shouchan_namian"],
	},

	// ═══ 启 · 家天下与甘之战 ═══
	{
		id: "impact_ganzhan_jiatianxia",
		title: "家天下立",
		content:
			"禅让的灯火，在你手里熄灭了。从此四千年，帝位随着一姓血脉代代相传——你是『家天下』的第一块基石，也是『公天下』的最后一道背影。",
		storyKey: "qi:ganzhizhan",
		kind: "impact",
		graphPos: { x: 3300, y: 120 },
		requires: ["graph_yu_zhishui"],
	},
	{
		id: "death_ganzhan_jiao",
		title: "骄纵失德",
		content:
			"史上的启，是诸侯先『去益而朝启』，他才即位——位是天下人抬上去的。恃血脉而骄纵、德不配位，第一个『家天下』之君便无一人真心来朝。",
		storyKey: "qi:ganzhizhan",
		kind: "death",
		graphPos: { x: 3240, y: 240 },
	},
	{
		id: "quiz_ganzhan_jiatianxia",
		title: "甘誓立威",
		content:
			"用命，赏于祖；不用命，僇于社——启战前作《甘誓》，先明天命、再申职守、终定赏罚。名正法立，家天下才立得住。",
		storyKey: "qi:ganzhizhan",
		kind: "quiz",
		graphPos: { x: 3360, y: 240 },
		requires: ["impact_ganzhan_jiatianxia"],
	},

	// ═══ 启夏章系图谱总纲 ═══
	{
		id: "graph_qi_jiatianxia",
		title: "家天下始",
		content:
			"禹治水立夏，启灭有扈氏立家天下——从此『公天下』退场，『家天下』登场，四千年帝制由此开端。",
		storyKey: "qi:ganzhizhan",
		kind: "graph",
		graphPos: { x: 3420, y: 120 },
		requires: ["quiz_ganzhan_jiatianxia"],
	},

	// ═══ 夏桀亡国 ═══
	{
		id: "impact_wangguo_shangde",
		title: "失德亡国",
		content:
			"你用一世，推倒了四百年夏后氏的墙。天下从此明白了一个道理：天命不是天生的，是每一天都要去挣的。失去人心的王，再高的台子也会塌。",
		storyKey: "jie:wangguo",
		kind: "impact",
		graphPos: { x: 3540, y: 120 },
		requires: ["graph_qi_jiatianxia"],
	},
	{
		id: "death_wangguo_shatang",
		title: "弑汤速亡",
		content:
			"桀囚汤而复释，尚予商汤修德归诸侯之机；若痛下杀手、弑一仁德诸侯，天下归商之心更炽——反而败得更早、更耻。",
		storyKey: "jie:wangguo",
		kind: "death",
		graphPos: { x: 3480, y: 240 },
	},
	{
		id: "quiz_wangguo_shangde",
		title: "鸣条亡国",
		content:
			"桀不务德而武伤百姓，百姓弗堪——他到死悔的都是『没杀成汤』。亡国从来不是天命，是一次次本可以不那样的选择垒成的。",
		storyKey: "jie:wangguo",
		kind: "quiz",
		graphPos: { x: 3600, y: 240 },
		requires: ["impact_wangguo_shangde"],
	},

	// ═══ 夏亡章系图谱总纲 ═══
	{
		id: "graph_jie_wangguo",
		title: "夏亡殷兴",
		content:
			"从禹治水到桀亡国，夏后氏四百年——成也德水，败也失德。天命不是天生的，是每一天都要去挣的。",
		storyKey: "jie:wangguo",
		kind: "graph",
		graphPos: { x: 3660, y: 120 },
		requires: ["quiz_wangguo_shangde"],
	},
];

/** 按 storyKey 分组索引，便于引擎快速查找 */
export const WUDI_KNOWLEDGE_BY_STORY: Record<string, KnowledgeFragment[]> = WUDI_KNOWLEDGE.reduce(
	(acc, k) => {
		(acc[k.storyKey] ||= []).push(k);
		return acc;
	},
	{} as Record<string, KnowledgeFragment[]>,
);

/** 所有碎片 id 集合（用于快速判重） */
export const WUDI_KNOWLEDGE_IDS = new Set(WUDI_KNOWLEDGE.map((k) => k.id));
