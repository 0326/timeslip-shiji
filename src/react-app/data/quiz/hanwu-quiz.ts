// 汉武盛世 · 章节测验题库
// chapter 字段关联 stories/inkStories/hanwu.ts 中的 storyKey（形如 "hanwudi:hanwu"）
// 题目覆盖武帝轮台罪己、李广难封、卫青善终、霍去病封狼居胥、张骞凿空、主父偃推恩等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const hanwuQuiz: QuizQuestion[] = [
	{
		id: "hanwu_quiz_hanwudi_luntai",
		chapter: "hanwudi:hanwu",
		question: "《轮台诏》——中国历史上第一道皇帝公开罪己诏的根本意义是什么？",
		options: [
			"承认连年征战封禅求仙使天下愁苦，与民休息",
			"为戾太子一案平反、收拢人心",
			"罢黜百家独尊儒术的政策转向",
			"为昭宣中兴铺路而提前禅位",
		],
		correctIndex: 0,
		explanation:
			"《汉书·西域传》载武帝下诏曰『朕即位以来，所为狂悖，使天下愁苦，不可追悔。自今事有伤害百姓、靡费天下者，悉罢之』。连年征战、封禅求仙、巫蛊之祸——天下已到崩溃边缘。昭宣中兴全靠武帝晚年这一『悔』，雄主最难得的不是开疆，是敢在天下人面前说『朕错了』。",
	},
	{
		id: "hanwu_quiz_liguang_nanfeng",
		chapter: "liguang:hanwu",
		question: "李广难封——『终不能复对刀笔之吏』一句话道出李广怎样的死因？",
		options: [
			"军功不足，本就无封侯之资",
			"宁死不肯在刀笔吏面前受审的尊严",
			"失道之罪依汉法当斩，无可挽回",
			"卫青公报私仇逼其自刎",
		],
		correctIndex: 1,
		explanation:
			"《史记》载李广对部下曰『广年六十余矣，终不能复对刀笔之吏』，遂引刀自刭。失道当斩，赎为庶人本可活——可飞将军的尊严比命重。这份『不能复对刀笔之吏』，正是李广让千古之人扼腕叹息的地方。",
	},
	{
		id: "hanwu_quiz_weiqing_shanzhong",
		chapter: "weiqing:hanwu",
		question: "卫青位极人臣而善终——他能做到大司马大将军而不惹猜忌的根本是什么？",
		options: [
			"皇后卫子夫的裙带关系护持",
			"以外戚起家却一世谨守一个『退』字",
			"故意示弱以避免功高震主",
			"早早交出兵权退居茂陵",
		],
		correctIndex: 1,
		explanation:
			"《史记》载卫青固辞三子封侯，曰『臣青子在繦緥中，未有勤劳』；苏建失军当斩，又曰『以臣之尊宠而不敢自擅专诛于境外，而具归天子』。功归于上、赏分于下、威权不擅——一辈子的『退』，换来外戚里绝无仅有的善终。",
	},
	{
		id: "hanwu_quiz_huoqibing_fenglangjuxu",
		chapter: "huoqibing:hanwu",
		question: "霍去病『匈奴未灭，无以家为』一句话体现了什么？",
		options: [
			"婉拒天子所赐府第，志在漠北不在家园",
			"借辞第以邀宠于武帝之前",
			"对封侯之赏心怀不满的牢骚",
			"对匈奴的血海深仇未报",
		],
		correctIndex: 0,
		explanation:
			"《史记》载天子为治第，令骠骑视之，对曰『匈奴未灭，无以家为也』。一个二十二岁封狼居胥的少年将军，心里装的不是家，是整个漠北——『匈奴未灭，无以家为』八个字，是霍去病的魂。",
	},
	{
		id: "hanwu_quiz_zhangqian_zaozhuan",
		chapter: "zhangqian:hanwu",
		question: "张骞凿空西域——『持汉节不失』五个字最重在哪里？",
		options: [
			"节杖是天子所赐不可遗失之物",
			"被扣匈奴十余年娶妻生子仍不忘使命",
			"凭借节杖的身份通使西域诸国",
			"用节杖换回西域诸国的礼物",
		],
		correctIndex: 1,
		explanation:
			"《史记》载『留骞十余岁，与妻，有子，然骞持汉节不失』。十年足以磨平一切——他有了妻子、孩子、牧场、牛羊，可那根节杖上的毛掉光了，他还握着光杆儿。一忘初心，西行的国士就变成了一个普通牧民。",
	},
	{
		id: "hanwu_quiz_zhufuyan_tuienling",
		chapter: "zhufuyan:hanwu",
		question: "推恩令——『愿陛下令诸侯得推恩分子弟，以地侯之』被誉为千古阳谋，妙在何处？",
		options: [
			"不费一兵一卒，令诸侯自剖其国分封子弟",
			"借诸侯内斗以坐收渔利",
			"以严刑峻法强迫诸侯削地",
			"用金钱赎买诸侯的封邑",
		],
		correctIndex: 0,
		explanation:
			"《史记》载主父偃说上曰『愿陛下令诸侯得推恩分子弟，以地侯之，彼必喜得所愿。上以德施，实分其国』。不削而削——诸侯子弟人人得封侯，大国自然裂为数十小侯国，再无力对抗中央。汉初以来诸侯坐大的心病，就此一策而解。",
	},
];
