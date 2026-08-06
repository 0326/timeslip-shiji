// 西周 · 章节测验题库
// chapter 字段关联 stories/inkStories/xizhou.ts 中的 storyKey（形如 "jiangshang:xizhou"）
// 题目覆盖姜尚渭水、文王羑里、武王孟津、周公摄政、宣王中兴、幽王烽火、太伯让国等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const xizhouQuiz: QuizQuestion[] = [
	{
		id: "xizhou_quiz_jiangshang_weishui",
		chapter: "jiangshang:xizhou",
		question: "姜尚渭水垂钓——『所获非龙非彨，非虎非罴，所获霸王之辅』一卜的含义是什么？",
		options: [
			"西伯出猎将猎得异兽",
			"西伯出猎将遇霸王之辅佐，果遇太公于渭之阳",
			"卜辞预示西伯将称王称霸",
			"占卜结果显示此行必有所获",
		],
		correctIndex: 1,
		explanation:
			"《史记》载周西伯将出猎，卜之，曰『所获非龙非彨，非虎非罴，所获霸王之辅』。于是周西伯猎，果遇太公于渭之阳，与语大说，曰『吾太公望子久矣』，载与俱归，立为师。一个『待时之渔』等了七十年，等的就是这一卜应验的那一刻。",
	},
	{
		id: "xizhou_quiz_wenwang_youli",
		chapter: "wenwang:xizhou",
		question: "周文王羑里之囚——『其囚羑里，盖益易之八卦为六十四卦』说明了什么？",
		options: [
			"文王在狱中沉迷卜筮消磨时光",
			"把最暗的牢坐成了照亮后世三千年的光",
			"借演易向纣王表明自己无心反商",
			"囚中文王已无别事可做唯演八卦",
		],
		correctIndex: 1,
		explanation:
			"《史记》载『西伯盖即位五十年。其囚羑里，盖益易之八卦为六十四卦』。文王被囚七年，不怨不怒，反在囚室里推演《周易》——困厄从不能困住他。三分天下有其二、以服事殷的『至德』，根子就是这段囚室里的沉静与远虑。",
	},
	{
		id: "xizhou_quiz_wuwang_mengjin",
		chapter: "wuwang:xizhou",
		question: "孟津观兵——『女未知天命，未可也』武王还师，等的是什么？",
		options: [
			"等八百诸侯到齐再举兵",
			"等纣剖比干、囚箕子，把最后一点忠臣人心丧尽",
			"等武王自己的丧期结束",
			"等姜尚从齐地调来援军",
		],
		correctIndex: 1,
		explanation:
			"《史记》载『是时，诸侯不期而会盟津者八百诸侯。诸侯皆曰：纣可伐矣。武王曰：女未知天命，未可也。乃还师归』。那两年的等待不是怯——是等比干死、箕子囚、太师抱乐器奔周，等纣把最后一点忠臣人心丧尽。早两年，牧野就不会有『前徒倒戈』，七十万奴隶就不会调转戈矛为你开道。",
	},
	{
		id: "xizhou_quiz_zhougong_shezheng",
		chapter: "zhougong:xizhou",
		question: "周公摄政——『一沐三捉发，一饭三吐哺』体现什么治国之道？",
		options: [
			"礼贤下士，犹恐失天下之贤人",
			"勤政爱民、事必躬亲",
			"借待客之礼树立周公威望",
			"以个人德行感化成王",
		],
		correctIndex: 0,
		explanation:
			"《史记》载周公诫伯禽曰『我一沐三捉发，一饭三吐哺，起以待士，犹恐失天下之贤人』。洗一次头三次握发停餐、吃一顿饭三次吐食迎客——礼贤下士到了这种地步。周之能延八百年，靠的就是这位摄政者七年里把『待士』二字做到了极致。",
	},
	{
		id: "xizhou_quiz_xuanwang_zhongxing",
		chapter: "xuanwang:xizhou",
		question: "宣王中兴——『法文、武、成、康之遗风，诸侯复宗周』的根本是什么？",
		options: [
			"修政修德，不以严刑立威",
			"大举征伐四方蛮夷以立威",
			"恢复籍田千亩之礼以劝农",
			"废除厉王专利之政与民休息",
		],
		correctIndex: 0,
		explanation:
			"《史记》载『宣王即位，二相辅之，修政，法文、武、成、康之遗风，诸侯复宗周』。召公用自己的儿子换了宣王这条命，是要他做个好天子，不是做个复仇者——宣王中兴的根基是修德而非修怨。可惜晚年料民太原、丧南国之师，盛极而骄，中兴只成一世。",
	},
	{
		id: "xizhou_quiz_youwang_fenghuo",
		chapter: "youwang:xizhou",
		question: "周幽王烽火戏诸侯——『诸侯悉至，至而无寇，褒姒乃大笑』的致命祸根是什么？",
		options: [
			"以失信于诸侯换取美人一笑，再举烽火兵莫至",
			"废申后与太子宜臼，激怒申侯",
			"任用虢石父为政，国人皆怨",
			"宠爱褒姒荒废朝政",
		],
		correctIndex: 0,
		explanation:
			"《史记》载幽王欲悦褒姒，举烽火征兵，诸侯悉至而无寇，褒姒乃大笑。幽王数举烽火，后遂不信。及犬戎真至，再举烽火，兵莫至——遂杀幽王骊山下。一座座烽火台是周王室最后的信用，玩一次少一分，玩多了，就什么都没了。",
	},
	{
		id: "xizhou_quiz_taibo_rangguo",
		chapter: "taibo:xizhou",
		question: "太伯让国——『有民立君，将以利之。君子不以其所以养人者害人』体现什么？",
		options: [
			"古公亶父弃地迁岐、不忍百姓为战而死",
			"太伯让位季历、避奔荆蛮以成父志",
			"古公考察三子贤愚而定继承人",
			"周人尚让不尚争的治国理念",
		],
		correctIndex: 0,
		explanation:
			"《史记》载古公亶父欲立季历以及昌，太伯、虞仲奔荆蛮以让。古公之仁在于不忍——土地本是养人的，不能因守土地而让百姓死于戎狄铁骑之下。弃地迁岐看似怯懦，实则是周道之兴的起点；太伯让国，又把这份『让』字刻进了周室的血脉里。",
	},
];
