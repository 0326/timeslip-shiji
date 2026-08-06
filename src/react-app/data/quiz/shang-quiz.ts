// 商（殷本纪） · 章节测验题库
// chapter 字段关联 stories/inkStories/shang.ts 中的 storyKey（形如 "tang:shang"）
// 题目覆盖成汤网开三面、伊尹放太甲、武丁梦傅说、帝辛失德等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const shangQuiz: QuizQuestion[] = [
	{
		id: "shang_quiz_tang_wangkaisanmian",
		chapter: "tang:shang",
		question: "网开三面——成汤『去其三面』的真正用意是什么？",
		options: [
			"猎具不足，只能布一面之网",
			"仁留其度——留一面让不用命者入网，不赶尽杀绝",
			"故意放走野兽以引来更多",
			"祭祀需要放生以谢神明",
		],
		correctIndex: 1,
		explanation:
			"《史记》载汤祝曰『欲左，左；欲右，右；不用命，乃入吾网』，乃去其三面。仁留其度——既给生路，又留那没撤的一面。诸侯闻之曰『汤德至矣，及禽兽』，归的正是这份有节制的仁。",
	},
	{
		id: "shang_quiz_yiyin_fangtaijia",
		chapter: "yiyin:shang",
		question: "伊尹放太甲——『一放一迎』之间最见伊尹之忠的关键是什么？",
		options: [
			"放逐太甲于桐宫三年后亲迎还政、作训称其太宗",
			"自立为王七年后被太甲潜出所杀",
			"太后摄政代行天子之事",
			"借放逐之机另立成汤幼子为君",
		],
		correctIndex: 0,
		explanation:
			"《史记》载『帝太甲居桐宫三年，悔过自责，反善，于是伊尹乃迎帝太甲而授之政』。手握整座江山，却把政真真切切还了——这一迎一还之间，忠字才立得起来，伊尹也才成千古阿衡。",
	},
	{
		id: "shang_quiz_wuding_mengfuyue",
		chapter: "wuding:shang",
		question: "武丁举傅说——『以梦所见视群臣百吏，皆非也』说明武丁的什么态度？",
		options: [
			"迷信鬼神，事事求梦示",
			"宁信梦中之人，不肯将就一个假圣人",
			"对满朝百官早有不满之意",
			"借此机会清洗先朝旧臣",
		],
		correctIndex: 1,
		explanation:
			"《史记》载武丁即位三年不言、以观国风，梦得圣人名说，使百工营求之于野。比对满朝皆非也，不将就一个假圣人，才在傅险的版筑胥靡里找到那个真正的傅说。求贤若渴，容不得半点将就。",
	},
	{
		id: "shang_quiz_zhou_yinjianbuyuan",
		chapter: "zhou:shang",
		question: "帝辛亡国——『我生不有命在天』一句话道出了什么致命之祸？",
		options: [
			"把天命当免罪之符，堵死最后一个肯救他的人",
			"笃信天命，应该更敬天保民",
			"天子本应受命于天，无可指责",
			"祖伊之谏内容过于激烈才被拒",
		],
		correctIndex: 0,
		explanation:
			"《史记》载纣答祖伊曰『我生不有命在天乎』，祖伊反曰『纣不可谏矣』。把『天命』当挡箭牌，一句堵死最后一个肯进谏的人——失德者失天下，从来不是天命要他亡，是他一次次『本可以不那样』垒成的深渊。",
	},
];
