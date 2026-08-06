// 楚汉相争 · 章节测验题库
// chapter 字段关联 stories/inkStories/chuhan.ts 中的 storyKey（形如 "xiangyu:chuhan"）
// 题目覆盖项羽乌江、刘邦鸿门、韩信背水、张良圯桥、陈胜大泽乡、彭越游击、英布当刑等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const chuhanQuiz: QuizQuestion[] = [
	{
		id: "chuhan_quiz_xiangyu_gaixia",
		chapter: "xiangyu:chuhan",
		question: "垓下之战——项羽『天亡我，非战之罪』一语的实质是什么？",
		options: [
			"承认自己战略失误，愿赌服输",
			"到死不肯自责，把败因归于天命",
			"暗示部下出卖了他",
			"抱怨韩信用兵诡谲非正战",
		],
		correctIndex: 1,
		explanation:
			"《史记》载项王『此天之亡我，非战之罪也』——到死不肯低头、不肯自责的执拗，正是项羽之为项羽的悲壮所在。司马迁把它记下来，不是赞其勇，是叹其终不肯反躬自省——这才是霸王真正的死穴。",
	},
	{
		id: "chuhan_quiz_liubang_hongmen",
		chapter: "liubang:chuhan",
		question: "鸿门宴——刘邦得以脱身的关键是什么？",
		options: [
			"樊哙闯帐据理力争，震慑项羽",
			"项伯夜访预先通消息，席间又以身掩护",
			"范增举玦示意的次数不够多",
			"项庄舞剑失手，未能刺中",
		],
		correctIndex: 1,
		explanation:
			"鸿门之险，第一道关在项伯夜至沛公军——『因项伯解刘邦之危』。席上项庄舞剑，项伯亦拔剑起舞，常以身翼蔽沛公。若无项伯这一层早先结下的姻亲之交，樊哙再勇也未必挡得过范增三举之玦。",
	},
	{
		id: "chuhan_quiz_hanxin_beishui",
		chapter: "hanxin:chuhan",
		question: "井陉之战——韩信背水列阵为何能败赵军二十万？",
		options: [
			"兵多将广正面碾压赵军",
			"赵军主将陈余轻敌冒进中伏",
			"背水为阵绝退路，又以奇兵拔赵帜立汉赤帜",
			"李左车建议陈余坚壁不战未被采纳",
		],
		correctIndex: 2,
		explanation:
			"《史记》载韩信『乃使万人先行，出，背水陈』，又『选轻骑二千人，人持一赤帜，从间道萆山而望赵军』。把市井之兵置之死地使其自战，再以两千奇兵趁赵空壁追击时拔赵帜立汉赤帜——赵军回头见营尽汉旗，军心遂溃。正奇相生，才是兵仙之笔。",
	},
	{
		id: "chuhan_quiz_zhangliang_yishang",
		chapter: "zhangliang:chuhan",
		question: "圯上老人三试张良——『孺子可教』的真正考验是什么？",
		options: [
			"能否忍受老者的傲慢，三次早到履约",
			"能否一拳打回去维护尊严",
			"能否为老者长跪穿鞋一次",
			"能否看穿老者是黄石公化身",
		],
		correctIndex: 0,
		explanation:
			"《史记》载良『为其老，强忍，下取履』，又『长跪履之』。老人约五日平明、五日鸡鸣、五日夜未半——三试其忍、其诚、其勤。最后良夜未半往，父亦来，喜曰『当如是』，乃授《太公兵法》。谋圣的第一课，不是计，是忍。",
	},
	{
		id: "chuhan_quiz_chensheng_dazexiang",
		chapter: "chensheng:chuhan",
		question: "大泽乡起义——陈胜为何诈称公子扶苏与项燕之名？",
		options: [
			"扶苏是秦人公认的贤嗣，项燕是楚人怀念的旧将",
			"陈胜自己是楚将后裔，借此正名",
			"二人是陈胜的旧主，报仇兼复辟",
			"秦法严苛，唯有冒名才能号召戍卒",
		],
		correctIndex: 0,
		explanation:
			"《史记》载『今诚以吾众诈自称公子扶苏、项燕，为天下唱，宜多应者』。一个雇农凭空振臂无人识——借扶苏之贤收秦地不平之心，借项燕之名聚楚人旧情。师出有名，是首义者最深的算计，绝非莽夫一喊。",
	},
	{
		id: "chuhan_quiz_pengyue_youzhan",
		chapter: "pengyue:chuhan",
		question: "楚汉相争——彭越制楚的看家绝活是什么？",
		options: [
			"正面硬撼项羽主力",
			"据梁地自守不动",
			"往来游击、专绝楚军粮道",
			"策反楚军诸将",
		],
		correctIndex: 2,
		explanation:
			"《史记》载『彭越常往来为汉游兵，击楚，绝其后粮』。彭越从不与项羽争锋——见主力东来便北走谷城，专掐粮袋子，逼项王腹背受敌。游刃之利在避实击虚，这是中国军事史上最早成型的游击战术。",
	},
	{
		id: "chuhan_quiz_yingbu_dangxing",
		chapter: "yingbu:chuhan",
		question: "黥布起家——他为何『欣然笑曰：人相我当刑而王』？",
		options: [
			"以刑徒身份在骊山聚众自保",
			"把受黥刑之辱当作谶命的半应，反以此自奋",
			"借此讥讽相面之人胡言乱语",
			"骊山刑徒互相结党才能活命",
		],
		correctIndex: 1,
		explanation:
			"《史记》载布受黥面后『欣然笑曰：人相我当刑而王，几是乎』。旁人以黥为耻，他却把耻辱当成谶的应验——不认命的悍气，是他从骊山数十万刑徒里杀出、终封淮南王的唯一本钱。",
	},
];
