// 系列 zhanguo · 战国。主角线（变法+纵横包）：
//   商鞅（卷68 · 变法者的悲剧）/ 苏秦（卷69 · 合纵六国）/ 张仪（卷70 · 连横破纵）/
//   范雎（卷79 · 远交近攻）/ 廉颇蔺相如（卷81 · 将相和）。
// 预留：四公子/白起/屈原/乐毅/田单线（后续包追加）
import { withSeries } from "./_series";

export const zhanguoStorylines = withSeries("zhanguo", [
	{
		id: "zhanguo_shangyang_ink",
		title: "商鞅 · 作法自毙",
		subtitle: "商君列传 · 卫鞅",
		era: "warring_states",
		year: "战国 · 中期（秦孝公）",
		cover: "#8b4513",
		glyph: "鞅",
		description:
			"西入秦、三次说孝公，从帝道王道到霸道强国之术。你将穿越成商鞅，从徙木立信取信于民、颁行新法编什伍连坐，到刑太子傅黥公子虔、劓公孙贾立威，变法十年道不拾遗家给人足，却积怨满朝。赵良苦谏『危若朝露』劝你归地退隐，你恋栈弗从——孝公一死，公子虔之徒告反，你逃关下客舍，店主依你之法拒绝收留，一句『为法之敝一至此哉』道尽变法者作法自毙的悲剧。六幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 5,
		focusCharacter: "shangyang",
		relatedCharacters: ["shangyang", "yingqvliang", "gongziqian", "zhaoliang"],
		perspectives: [
			{ characterId: "shangyang", storyKey: "shangyang:zhanguo", unlockedBy: "shangyang", nodeCount: 5 },
		],
	},
	{
		id: "zhanguo_suqin_ink",
		title: "苏秦 · 六国相印",
		subtitle: "苏秦列传 · 苏秦",
		era: "warring_states",
		year: "战国 · 中晚期",
		cover: "#5a4a7a",
		glyph: "秦",
		description:
			"出游数岁大困而归，妻不下纴嫂不为炊——你将穿越成苏秦，从闭室悬梁刺股发愤读书，到西说秦惠王弗用、转头合纵六国，说燕文侯、说赵肃侯、说韩宣王、说魏襄王、说齐宣王、说楚威王，一人佩六国相印，秦兵不敢窥函谷关十五年。然而合纵终散，你入齐为燕反间，与齐大夫争宠被刺，死前设计车裂己身以诱刺客——口舌取卿相的极致与代价，尽在此线。六幕成长弧线。",
		estimatedMinutes: 18,
		difficulty: 5,
		focusCharacter: "suqin",
		relatedCharacters: ["suqin"],
		perspectives: [
			{ characterId: "suqin", storyKey: "suqin:zhanguo", unlockedBy: "suqin", nodeCount: 5 },
		],
	},
	{
		id: "zhanguo_zhangyi_ink",
		title: "张仪 · 连横破纵",
		subtitle: "张仪列传 · 张仪",
		era: "warring_states",
		year: "战国 · 中晚期",
		cover: "#4a6b8a",
		glyph: "仪",
		description:
			"被楚相疑盗璧、掠笞数百，回家只问老婆『吾舌尚在否』——你将穿越成张仪，苏秦的同门师弟与镜像：苏秦合纵，你便连横。从入秦为相，到欺楚怀王以六百里商於之地骗楚绝齐、翻脸只给六里，再到反复横跳于魏楚韩齐之间，瓦解苏秦的合纵之约。苏秦车裂于齐，你却在秦武王即位后自请到魏为相、寿终正寝——同样靠一张嘴取卿相，你比苏秦多懂了一个『走』字。六幕成长弧线。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "zhangyi",
		relatedCharacters: ["zhangyi", "huaiwang"],
		perspectives: [
			{ characterId: "zhangyi", storyKey: "zhangyi:zhanguo", unlockedBy: "zhangyi", nodeCount: 4 },
		],
	},
	{
		id: "zhanguo_fanju_ink",
		title: "范雎 · 远交近攻",
		subtitle: "范雎蔡泽列传 · 范雎",
		era: "warring_states",
		year: "战国 · 晚期（秦昭王）",
		cover: "#6b4a7a",
		glyph: "雎",
		description:
			"在魏被诬通齐，魏齐令舍人笞击你折胁摺齿、卷以箦置厕中、宾客醉更溺你——你装死买通守者逃出生天，化名张禄西入秦。你将穿越成范雎，从离宫故意扬言『秦安得王？独有太后、穰侯耳』激昭王，到献『远交近攻』一统国策、逐四贵废太后、拜秦相封应侯；一饭之德必偿、睚眦之怨必报——辱须贾马食、逼魏齐自刎；却因忌白起功大进谗杀之，又举郑安平、王稽非人，报恩反成催命符。蔡泽说以『日中则移、月满则亏』，你幡然醒悟谢病归印、全身而退。七幕成长弧线。",
		estimatedMinutes: 20,
		difficulty: 5,
		focusCharacter: "fanju",
		relatedCharacters: ["fanju", "xujia", "wangji", "caize", "baiqi"],
		perspectives: [
			{ characterId: "fanju", storyKey: "fanju:zhanguo", unlockedBy: "fanju", nodeCount: 7 },
		],
	},
	{
		id: "zhanguo_linxiangru_ink",
		title: "廉颇蔺相如 · 将相和",
		subtitle: "廉颇蔺相如列传 · 双视角",
		era: "warring_states",
		year: "战国 · 晚期（赵惠文王）",
		cover: "#5a8a7a",
		glyph: "蔺",
		description:
			"从宦者令缪贤的舍人，到完璧归赵的上大夫——你将穿越成蔺相如，在章台持璧却立怒发冲冠、以头与璧俱碎于柱相胁；又使从者衣褐怀璧归赵，当庭自承欺君请就汤镬，反得全身归赵。渑池之会，秦王令赵王鼓瑟辱赵，你跪请秦王击缶、张目叱退左右、以颈血溅大王，终不辱国。位在廉颇之右，你引车避匿不与争列，说出『先国家之急而后私仇』——廉颇闻之肉袒负荆，卒相与欢为刎颈之交。以蔺相如为主视角、廉颇贯穿全篇，体验将相和的千古佳话。六幕成长弧线。",
		estimatedMinutes: 20,
		difficulty: 4,
		focusCharacter: "linxiangru",
		relatedCharacters: ["linxiangru", "lianpo", "zhaohuiwen", "mouxian"],
		perspectives: [
			{ characterId: "linxiangru", storyKey: "linxiangru:zhanguo", unlockedBy: "linxiangru", nodeCount: 5 },
		],
	},
	{
		id: "zhanguo_baiqi_ink",
		title: "战神 · 白起",
		subtitle: "白起王翦列传 · 白起",
		era: "warring_states",
		year: "战国 · 晚期（秦昭王）",
		cover: "#8b2a2a",
		glyph: "起",
		description:
			"从伊阙之战斩首二十四万、南拔鄢郢火烧夷陵，到长平一战坑赵卒四十万，『人屠』名号震天下——你将穿越成白起，百战百胜、为秦下七十余城，封武安君。然而长平之后苏代说范雎，功高者被相妒，乘胜灭赵的战机毁于一旦。王陵攻邯郸失利，秦王强起你为将，你知赵人同仇敌忾、诸侯合纵已至，不肯打必败之仗；称病不朝、拒命再三，终被秦王赐剑杜邮。死前一句『我固当死——长平赵卒降者数十万人，我诈而尽坑之，是足以死』，是战神对自己杀业的最后审判。百战百胜的将军，死在『不战』之上。五幕成长弧线。",
		estimatedMinutes: 18,
		difficulty: 5,
		focusCharacter: "baiqi",
		relatedCharacters: ["baiqi", "fanju"],
		perspectives: [
			{ characterId: "baiqi", storyKey: "baiqi:zhanguo", unlockedBy: "baiqi", nodeCount: 6 },
		],
	},
	{
		id: "zhanguo_quyuan_ink",
		title: "孤忠 · 屈原",
		subtitle: "屈原贾生列传 · 屈原",
		era: "warring_states",
		year: "战国 · 晚期（楚怀/顷襄王）",
		cover: "#4a6b8a",
		glyph: "原",
		description:
			"博闻强志、明于治乱，入则图议国事、出则应对诸侯——你是屈原，楚怀王左徒。上官大夫夺宪令而你不与，被谗见疏，忧愁幽思而作《离骚》：『亦余心之所善兮，虽九死其犹未悔。』张仪欺楚以六百里商於，你使齐归来急谏『何不杀张仪』；怀王欲入秦赴昭王之约，你再谏『秦虎狼之国不可信』，怀王稚子子兰劝王行，怀王终入秦不返。令尹子兰闻你怨他，使上官大夫短你于顷襄王，你被迁江南。渔父劝你与世推移，你答『安能以皓皓之白而蒙世俗之尘埃乎』——怀石自投汨罗，清者自清、孤忠不朽。四幕成长弧线。",
		estimatedMinutes: 16,
		difficulty: 4,
		focusCharacter: "quyuan",
		relatedCharacters: ["quyuan", "huaiwang"],
		perspectives: [
			{ characterId: "quyuan", storyKey: "quyuan:zhanguo", unlockedBy: "quyuan", nodeCount: 4 },
		],
	},
	{
		id: "zhanguo_yueyi_ink",
		title: "去国 · 乐毅",
		subtitle: "乐毅列传 · 乐毅",
		era: "warring_states",
		year: "战国 · 晚期（燕昭王/惠王）",
		cover: "#8a6b4a",
		glyph: "毅",
		description:
			"感燕昭王黄金台知遇，你为亚卿，合赵楚韩魏燕五国之兵伐齐，济西一战破齐师——你独率燕军追亡逐北入临淄，尽取齐宝输燕，封昌国君。留徇齐五岁，下齐七十余城为郡县，唯独莒、即墨未服。昭王卒，惠王为太子时与你有隙，田单反间『乐毅欲南面王齐』，惠王使骑劫代你、召你回燕——你知惠王不善代之、畏诛，西降赵，赵封你于观津号望诸君。骑劫庸才，田单火牛阵破之，七十余城尽复归齐。惠王后悔又怪你降赵，写信责你；你报以《报燕惠王书》——『善作者不必善成，善始者不必善终』『君子交绝不出恶声，忠臣去国不洁其名』，不骂旧主、不辩冤屈，千古高风。三幕成长弧线。",
		estimatedMinutes: 14,
		difficulty: 3,
		focusCharacter: "yueyi",
		relatedCharacters: ["yueyi", "yanzhaowang", "yanhuiwang"],
		perspectives: [
			{ characterId: "yueyi", storyKey: "yueyi:zhanguo", unlockedBy: "yueyi", nodeCount: 3 },
		],
	},
	{
		id: "zhanguo_tiandan_ink",
		title: "复国 · 田单",
		subtitle: "田单列传 · 田单",
		era: "warring_states",
		year: "战国 · 晚期（齐湣/襄王）",
		cover: "#a05028",
		glyph: "单",
		description:
			"你是齐王室远房疏族，临淄一个市掾小吏，默默无闻。乐毅伐齐，你逃到安平，让宗人以铁笼傅车轴，城破时齐人争路车轴折而被俘，唯有你一宗人铁笼完固东保即墨——即墨大夫战死，你因铁笼之智被推为将军，以孤城抗燕。燕昭王死，你纵反间使骑劫代乐毅；又令城中祭祖食、飞鸟翔舞，拜小兵为神师以安人心；再宣言『吾惧燕人劓齐卒』『吾惧燕人掘吾冢墓』，诱燕人做尽残暴之事，齐人怒目欲战怒自十倍。最后收城中千余牛，束兵刃于角、灌脂束苇于尾，夜纵火牛冲燕军，五千壮士随其后，声动天地——以一城复齐七十余城，迎襄王入临淄，封安平君。三幕成长弧线。",
		estimatedMinutes: 14,
		difficulty: 4,
		focusCharacter: "tiandan",
		relatedCharacters: ["tiandan", "yueyi", "qijie"],
		perspectives: [
			{ characterId: "tiandan", storyKey: "tiandan:zhanguo", unlockedBy: "tiandan", nodeCount: 5 },
		],
	},
	{
		id: "zhanguo_sigongzi_ink",
		title: "养士 · 战国四公子",
		subtitle: "四公子列传 · 四视角合集",
		era: "warring_states",
		year: "战国 · 晚期",
		cover: "#6b5a4a",
		glyph: "四",
		description:
			"齐有孟尝、赵有平原、魏有信陵、楚有春申——四公子皆喜宾客致食客三千人，名重诸侯；结局却天差地别。你可以选择四视角中的任意一人开局：孟尝君田文入秦被囚，靠鸡鸣狗盗之徒出关逃归，赖冯谖『狡兔三窟』高枕为相数十年，却因诸子争立绝嗣无后；平原君赵胜杀笑躄者美人以谢客，带毛遂赴楚合纵，散家财飨士救邯郸，平庸而善终；信陵君魏无忌仁而下士，虚左亲迎侯嬴、窃符救赵、率五国兵逐秦至函谷关，却遭反间废而病酒卒；春申君黄歇上书说秦退兵、设计送太子归国、相楚二十五年，却听李园移花接木之计、又不听朱英先下手杀李园之谏，当断不断棘门被刺、尽灭其家。四公子四条线，各自二幕关键抉择加尾声总评。",
		estimatedMinutes: 24,
		difficulty: 4,
		focusCharacter: "xinlingjun",
		relatedCharacters: ["mengchangjun", "pingyuanjun", "xinlingjun", "chunshenjun"],
		perspectives: [
			{ characterId: "mengchangjun", storyKey: "sigongzi:zhanguo", unlockedBy: "mengchangjun", nodeCount: 3 },
			{ characterId: "pingyuanjun", storyKey: "sigongzi:zhanguo", unlockedBy: "pingyuanjun", nodeCount: 2 },
			{ characterId: "xinlingjun", storyKey: "sigongzi:zhanguo", unlockedBy: "xinlingjun", nodeCount: 2 },
			{ characterId: "chunshenjun", storyKey: "sigongzi:zhanguo", unlockedBy: "chunshenjun", nodeCount: 2 },
		],
	},
]);
