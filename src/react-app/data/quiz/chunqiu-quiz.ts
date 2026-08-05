// 春秋 · 章节测验题库
// chapter 字段关联 stories/inkStories/chunqiu.ts 中的 storyKey（形如 "goujian:chunqiu"）
// 题目覆盖勾践卧薪、重耳退避三舍、伍子胥抉目、齐桓九合、秦穆霸西戎、孙武斩姬、夫差遮面等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const chunqiuQuiz: QuizQuestion[] = [
	{
		id: "chunqiu_quiz_goujian_woxinchangdan",
		chapter: "goujian:chunqiu",
		question: "卧薪尝胆——勾践『置胆于坐，坐卧即仰胆』的真正用意是什么？",
		options: [
			"以苦味调养身体以备复仇",
			"怕安稳日子把那口复仇之气泡软",
			"向臣民展示自己生活的简朴",
			"祭祀会稽之战的阵亡将士",
		],
		correctIndex: 1,
		explanation:
			"《史记》载『吴既赦越，越王句践反国，乃苦身焦思，置胆于坐，坐卧即仰胆，饮食亦尝胆也。曰：女忘会稽之耻邪？』日日自问，问了二十二年——复仇最大的敌人从来不是吴军，是『来日方长』四个字。",
	},
	{
		id: "chunqiu_quiz_chonger_tuibisanshe",
		chapter: "chonger:chunqiu",
		question: "城濮之战——晋文公践行『退避三舍』之诺，体现了什么兵家之道？",
		options: [
			"守诺全信义，又骄敌诱进、以逸待劳",
			"晋军兵力不足，只能避其锋芒",
			"楚军追击过急自乱阵脚",
			"借守诺之名拖延战机等秦援",
		],
		correctIndex: 0,
		explanation:
			"《史记》载文公曰『昔在楚，约退三舍，可倍乎』——主动后退九十里，既全信义又骄楚之师、诱其深入，再以逸待劳一举破之。退避三舍看似自缚，实为制胜之奇手；守诺与制胜合一，才是文公霸业的根。",
	},
	{
		id: "chunqiu_quiz_wuzixu_juemu",
		chapter: "wuzixu:chunqiu",
		question: "伍子胥临终——『抉吾眼县吴东门之上，以观越寇之入灭吴也』表明什么？",
		options: [
			"对自己掘墓鞭尸楚王之悔",
			"预见越必灭吴，死不瞑目",
			"怨恨夫差赐剑自尽",
			"诅咒伯嚭必遭天谴",
		],
		correctIndex: 1,
		explanation:
			"《史记》载伍子胥自杀前嘱『抉吾眼县吴东门之上，以观越寇之入灭吴也』。夫差闻之大怒，取子胥尸盛以鸱夷革浮之江。九年之后，越果灭吴——一双眼悬上东门，是要亲见那场他预言过的灭亡。",
	},
	{
		id: "chunqiu_quiz_qihuan_jiuhe",
		chapter: "qihuan:chunqiu",
		question: "齐桓公九合诸侯——『微管仲，吾其被发左衽矣』出自谁之口？",
		options: [
			"齐桓公本人临终之叹",
			"孔子论齐桓霸业之赞",
			"管仲临终前的自评",
			"鲍叔牙让相时的荐语",
		],
		correctIndex: 1,
		explanation:
			"《论语·宪问》载孔子曰『管仲相桓公，霸诸侯，一匡天下，民到于今受其赐。微管仲，吾其被发左衽矣』。尊王攘夷的霸业护住了华夏衣冠——这是后世儒者对齐桓管仲最重的肯定。",
	},
	{
		id: "chunqiu_quiz_qinmu_baxirong",
		chapter: "qinmu:chunqiu",
		question: "秦穆公霸西戎——他『以五羖羊皮赎百里傒』的妙处在哪里？",
		options: [
			"显示秦国的财力足以酬贤",
			"让楚人当他是逃奴肯撒手，才得大贤",
			"五羊皮是当时秦地的标准聘礼",
			"借此试探楚人对贤才的态度",
		],
		correctIndex: 1,
		explanation:
			"《史记》载『缪公闻百里傒贤，欲重赎之，恐楚人不与』，乃使人请以五羖羊皮赎之。一个『贱』字，让楚人当他是逃奴，才肯撒手。求贤图霸，头一步就败在『太把贤才当回事』上——穆公反其道而行，方得五羖大夫。",
	},
	{
		id: "chunqiu_quiz_fuchai_zhemian",
		chapter: "fuchai:chunqiu",
		question: "夫差自刎——『吾无面以见子胥』一句话道出什么？",
		options: [
			"对赐死伍子胥的悔悟",
			"自觉失德失人，知耻遮面而死",
			"怕子胥阴魂在地下索命",
			"无颜面对先王阖庐的托付",
		],
		correctIndex: 1,
		explanation:
			"《史记》载夫差败于姑苏山，乃自刭，『死前曰：吾无面以见子胥也』。自毁长城的悔，在最后一刻才翻涌上来——他记父仇、破强越，却放不下一个『骄』字；骄到亡国，才知那双被他赐死的眼本是要替他看住吴的。",
	},
	{
		id: "chunqiu_quiz_sunwu_zhanji",
		chapter: "sunwu:chunqiu",
		question: "孙武试兵——『将在军，君命有所不受』一语的核心是什么？",
		options: [
			"将帅可无视天子在外征伐",
			"军法既明，则号令必行，不徇君王私情",
			"吴王阖庐本就准备舍弃宠姬",
			"约束不明乃将之罪，不必问君",
		],
		correctIndex: 1,
		explanation:
			"《史记》载孙武三令五申之后斩吴王二宠姬，曰『将在军，君命有所不受』。号令两次申明、两次大笑——程序已周密，这一刀不落，军法就是空的。他宁斩宠姬也不肯让令行禁止崩掉，这才立得起将威。",
	},
];
