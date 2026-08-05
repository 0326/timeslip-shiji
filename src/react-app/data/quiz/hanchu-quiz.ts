// 汉初 · 章节测验题库
// chapter 字段关联 stories/inkStories/hanchu.ts 中的 storyKey（形如 "lvhou:hanchu"）
// 题目覆盖吕后称制、文帝仁君、周勃安刘、晁错削藩、周亚夫细柳等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const hanchuQuiz: QuizQuestion[] = [
	{
		id: "hanchu_quiz_lvhou_baimazhiyue",
		chapter: "lvhou:hanchu",
		question: "吕后欲王诸吕——王陵当廷搬出的『白马之盟』内容是什么？",
		options: [
			"非刘氏而王，天下共击之",
			"非有功不得侯，非侯不得相",
			"刘吕联姻，共保汉室",
			"皇后临朝，必托宗室辅政",
		],
		correctIndex: 0,
		explanation:
			"《史记》载王陵对曰『高帝刑白马而盟曰：非刘氏而王者，天下共击之。今王吕氏，非约也』。吕后不悦，乃明升暗降王陵为帝太傅、夺其相权。一盟虽破，那份功臣对刘氏的认同未破——这成了日后周勃入北军一呼左袒的伏笔。",
	},
	{
		id: "hanchu_quiz_hanwen_lutai",
		chapter: "hanwen:hanchu",
		question: "汉文帝罢修露台——『百金，中民十家之产』一句话体现了什么？",
		options: [
			"文帝朝国库空虚无力营建",
			"以敦朴为天下先的仁君之俭",
			"借此罢修以试探群臣态度",
			"露台规制逾制，礼官谏止",
		],
		correctIndex: 1,
		explanation:
			"《史记》载文帝『尝欲作露台，召匠计之，直百金。上曰：百金，中民十家之产，吾奉先帝宫室，常恐羞之，何以台为』。百金看似不多，却是十户中产之家的全部家产——仁君之俭，从罢修一座露台开始，文景之治的底色就此铺开。",
	},
	{
		id: "hanchu_quiz_zhoubo_anliu",
		chapter: "zhoubo:hanchu",
		question: "周勃安刘——『安刘氏者必勃也』这句话最初是谁说的？",
		options: [
			"高祖刘邦临终预言",
			"吕后临终前的醒悟",
			"陈平密谋时的判断",
			"宋昌劝代王入京时引用",
		],
		correctIndex: 0,
		explanation:
			"《史记·高祖本纪》载高祖病危，吕后问萧何相后人，又问曹参、王陵、陈平之后——『周勃重厚少文，然安刘氏者必勃也，可令为太尉』。临终一句识人，成为日后诛诸吕、迎代王的最大伏笔。周勃一生笨拙，却在最关键时刻扛住了江山。",
	},
	{
		id: "hanchu_quiz_chaocuo_xiaofan",
		chapter: "chaocuo:hanchu",
		question: "晁错削藩——『削之亦反，不削亦反。削之，其反亟，祸小』的判断基于什么？",
		options: [
			"吴王濞已铸钱煮盐养兵四十年，迟早必反",
			"景帝新立威信不足，须先发制人",
			"诸侯之地半于天下，再不削就要被动",
			"匈奴与诸侯勾结，外患内忧并发",
		],
		correctIndex: 0,
		explanation:
			"《史记》载晁错言于景帝曰『今削之亦反，不削亦反。削之，其反亟，祸小；不削，其反迟，祸大』。吴王濞因太子棋争被杀、称病不朝数十年，铸钱煮盐、国用富饶，反心早具。判断是对的，可削之太急、连削楚赵胶西再削吴，激得七国并起，他自己反被袁盎一句话送上东市。",
	},
	{
		id: "hanchu_quiz_zhouyafu_xiliu",
		chapter: "zhouyafu:hanchu",
		question: "细柳营——周亚夫以『军中闻将军令，不闻天子之诏』阻天子先驱，文帝为何反而称赞？",
		options: [
			"文帝本就礼贤下士、爱惜将才",
			"看出了霸上棘门如儿戏，真将军唯细柳",
			"想借此敲打其他骄横的将军",
			"细柳营是文帝直辖的禁军",
		],
		correctIndex: 1,
		explanation:
			"《史记》载文帝劳军至霸上、棘门，皆直驰入；至细柳，不得入。先驱曰『天子且至』，军门都尉曰『将军令曰：军中闻将军令，不闻天子之诏』。文帝叹曰『嗟乎，此真将军矣！曩者霸上、棘门军，若儿戏耳』。临终又嘱景帝『即有缓急，周亚夫真可任将兵』——这一阻，换来了一代真将军的识拔。",
	},
];
