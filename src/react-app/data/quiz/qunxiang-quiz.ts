// 群像（游侠刺客） · 章节测验题库
// chapter 字段关联 stories/inkStories/qunxiang.ts 中的 storyKey（形如 "guojie:qunxiang"）
// 题目覆盖郭解游侠、朱家侠义、专诸鱼肠、豫让吞炭、聂政毁容、荆轲刺秦、剧孟任侠等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const qunxiangQuiz: QuizQuestion[] = [
	{
		id: "qunxiang_quiz_guojie_zhenzhe",
		chapter: "guojie:qunxiang",
		question: "郭解之死——『解虽弗知，此罪甚于解杀之，当大逆无道』说明什么？",
		options: [
			"汉律对侠者的株连之严，声望本身即罪",
			"郭解确有指使门客杀人之实",
			"郭解子杀人后逃匿、坐实其罪",
			"汉武帝欲除游侠、故入人罪",
		],
		correctIndex: 0,
		explanation:
			"《史记》载公孙弘议曰『解布衣为任侠行权，以睚眦杀人，解虽弗知，此罪甚于解杀之，当大逆无道』。门客以郭解之名杀人，郭解虽不知——可声望是双刃剑，你享受它带来的号召力，就要承担它带来的罪责。游侠的存在本身，就是这个体制容不下的罪。",
	},
	{
		id: "qunxiang_quiz_zhuke_yinide",
		chapter: "zhuke:qunxiang",
		question: "朱家藏季布——『以不伐其功、不矜其能，人皆称之』的『不伐不矜』是说什么？",
		options: [
			"做了侠义之事而不张扬夸耀",
			"无功劳可夸故不得已谦逊",
			"刻意低调以免招致祸患",
			"为求名声而故作谦退之态",
		],
		correctIndex: 0,
		explanation:
			"《史记》载朱家藏匿季布、终使其得赦为郎将，却『终不以此自矜』。诸所尝施，唯恐见之；专趋人之急，甚己之私。一开口夸耀，功德就从义变成了名——义是默默的给予，名是喧嚣的索取。侠者不言功，言功则非侠，这是游侠之首最高的一道坎。",
	},
	{
		id: "qunxiang_quiz_zhuanzhu_yuchang",
		chapter: "zhuanzhu:qunxiang",
		question: "专诸刺王僚——『使专诸置匕首于炙鱼腹中而进之』的关键是什么？",
		options: [
			"鱼腹藏剑是整个计划的核心，专诸拔剑刺中王僚立死",
			"王僚戒备森严，唯有鱼可近身",
			"公子光设宴才能引王僚入彀",
			"专诸本为屠户，善治鱼故得近",
		],
		correctIndex: 0,
		explanation:
			"《史记》载公子光使专诸置匕首于炙鱼腹中而进之。既至王前，专诸擘鱼，因以匕首刺王僚，王僚立死。一着不慎满盘皆输——专诸之所以成功，正在他从不犹豫。刺客只有一次拔剑的机会，慢半拍就是生与死的差距。",
	},
	{
		id: "qunxiang_quiz_yurang_tuntan",
		chapter: "yurang:qunxiang",
		question: "豫让吞炭漆身——『士为知己者死，女为悦己者容』一语道出什么？",
		options: [
			"豫让为智伯国士之遇而漆身吞炭、三击襄子之衣",
			"豫让本为范氏中行氏臣、后投智伯方得遇",
			"豫让与智伯有姻亲故愿以死相报",
			"豫让报智伯知遇之恩，非为主殉死",
		],
		correctIndex: 0,
		explanation:
			"《史记》载豫让遁逃山中曰『嗟乎！士为知己者死，女为悦己者容。今智伯知我，我必为报雠而死』。又漆身为厉、吞炭为哑，使形状不可知。三伏赵襄子车而不能杀，最后请击其衣以报智伯而后伏剑自杀——明知杀不了，仍然去杀，这才是刺客中最悲壮的一个。",
	},
	{
		id: "qunxiang_quiz_niezheng_huairong",
		chapter: "niezheng:qunxiang",
		question: "聂政刺侠累——『老母在，政身未敢以许人也』到自毁面容，体现什么转变？",
		options: [
			"母在以孝为先、母死则以义赴死，且自毁面容以免连累姊",
			"母在不能轻生、母死无所牵挂故行刺",
			"严仲子待之厚、故母死后方敢应命",
			"自毁面容是为刺杀时不易被识破",
		],
		correctIndex: 0,
		explanation:
			"《史记》载聂政辞严仲子曰『老母在，政身未敢以许人也』。母死服除，乃独行仗剑至韩刺杀侠累。刺成后『自皮面决眼，自屠出肠』——自毁面容使人不可识，恐连累姊。可姊聂荣偏来认他，曰『士固为知己者死』，死于其旁——义与亲，他都要。",
	},
	{
		id: "qunxiang_quiz_jingke_yishuihan",
		chapter: "jingke:qunxiang",
		question: "荆轲易水别燕——『风萧萧兮易水寒，壮士一去兮不复还』的『不复还』意味着什么？",
		options: [
			"荆轲明知此行有去无回，仍以命许太子丹之托",
			"荆轲预感到此行必败故发悲歌",
			"高渐离击筑相和，知荆轲不能生还",
			"易水寒彻、风雪阻途故难返",
		],
		correctIndex: 0,
		explanation:
			"《史记》载太子及宾客皆白衣冠以送之。至易水之上，高渐离击筑，荆轲和而歌，为变徵之声，士皆垂泪涕泣。又前而为歌曰『风萧萧兮易水寒，壮士一去兮不复还』。明知有去无回仍要出发——立意较然、不欺其志，这是刺客中最被千古传唱的一别。",
	},
	{
		id: "qunxiang_quiz_jumeng_renxia",
		chapter: "jumeng:qunxiang",
		question: "剧孟之重——周亚夫平七国之乱时『吴楚举大事而不求剧孟，吾知其无能为已矣』说明什么？",
		options: [
			"剧孟一人在手胜过千军，七国不用此人必败",
			"剧孟暗助周亚夫、传递七国军情",
			"剧孟为关东大侠、未助七国故七国失人望",
			"剧孟家无余财、故能以义服众",
		],
		correctIndex: 0,
		explanation:
			"《史记》载条侯周亚夫乘传车将至河南，得剧孟，喜曰『吴楚举大事而不求剧孟，吾知其无能为已矣』。天下骚动，宰相得之若得一敌国——剧孟之所以被天下看重，正因为他站在了周亚夫一边。侠者的眼光不在刀上、在人心，谁得剧孟谁得关东江湖之势。",
	},
];
