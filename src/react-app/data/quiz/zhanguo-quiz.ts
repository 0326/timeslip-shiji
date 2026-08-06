// 战国 · 章节测验题库
// chapter 字段关联 stories/inkStories/zhanguo.ts 中的 storyKey（形如 "shangyang:zhanguo"）
// 题目覆盖商鞅徙木、苏秦合纵、张仪欺楚、范雎远交近攻、蔺相如将相和、白起长平、屈原怀沙、乐毅去国、田单火牛、四公子养士等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const zhanguoQuiz: QuizQuestion[] = [
	{
		id: "zhanguo_quiz_shangyang_xinmu",
		chapter: "shangyang:zhanguo",
		question: "商鞅徙木立信——『辄予五十金，以明不欺』的真正用意是什么？",
		options: [
			"赏赐搬木头的力气",
			"买一个『令出必行』的信字，为变法开路",
			"显示秦国国库充盈",
			"借机试探百姓的服从度",
		],
		correctIndex: 1,
		explanation:
			"《史记》载『募民有能徙置北门者予十金。民怪之，莫敢徙。复曰能徙者予五十金。有一人徙之，辄予五十金，以明不欺。卒下令』。五十金买的不是搬木头的力气，是『令出必行』的信字——信不立，法不行，变法首在取信。",
	},
	{
		id: "zhanguo_quiz_suqin_liubuxiangyin",
		chapter: "suqin:zhanguo",
		question: "苏秦合纵——『此一人之身，富贵则亲戚畏惧之，贫贱则轻易之』出自哪个场景？",
		options: [
			"初出游说失败归家，妻不下纴、嫂不为炊",
			"佩六国相印归乡，嫂蛇行匍伏谢罪",
			"在齐被人刺杀前对燕王的陈词",
			"在赵国受封武安君时的家书",
		],
		correctIndex: 1,
		explanation:
			"《史记》载苏秦佩六国相印归乡，嫂蛇行匍伏四拜自跪而谢。苏秦笑问『嫂何前倨而后恭也』，嫂曰『见季子位高金多也』。苏秦乃叹『此一人之身，富贵则亲戚畏惧之，贫贱则轻易之』——人情冷暖里，藏着他悬梁刺股的全部动力。",
	},
	{
		id: "zhanguo_quiz_zhangyi_liuli",
		chapter: "zhangyi:zhanguo",
		question: "张仪欺楚——『六百里商於之地』最后变成什么？",
		options: [
			"如约割让给楚国",
			"改口为『臣有奉邑六里，愿以献大王左右』",
			"以秦女嫁楚王抵作地价",
			"承诺代楚攻齐以补其地",
		],
		correctIndex: 1,
		explanation:
			"《史记》载张仪至秦，详失绥堕车不朝三月，后谓楚使者曰『臣有奉邑六里，愿以献大王左右』。说好的六百里改口为六里——这是张仪最臭名昭著的欺诈，也是连横最关键的一步：故意激怒楚、拆散齐楚联盟，连横之策才立得起来。",
	},
	{
		id: "zhanguo_quiz_fanju_yuanjiaojingong",
		chapter: "fanju:zhanguo",
		question: "范雎为秦定『远交近攻』之策——其根本战略是什么？",
		options: [
			"远结齐燕、近攻韩魏，得寸则王之寸",
			"联合匈奴从北面压迫山东六国",
			"先灭楚取巴蜀以断六国之腰",
			"远攻近交，养韩魏为秦之藩篱",
		],
		correctIndex: 0,
		explanation:
			"《史记》载范雎说昭王曰『王不如远交而近攻，得寸则王之寸，得尺亦王之尺也』。远结齐燕以稳东方，近攻韩魏以蚕食腹心——寸寸尺尺都是秦的实地。从此秦之东扩有了明确战略，穰侯越韩魏而攻齐的旧策就此终结。",
	},
	{
		id: "zhanguo_quiz_linxiangru_jiangxianghe",
		chapter: "linxiangru:zhanguo",
		question: "将相和——蔺相如避让廉颇的根本原因是什么？",
		options: [
			"自度武力不敌廉颇故避之",
			"先国家之急而后私仇",
			"借退让以收买门客之心",
			"奉赵王密令安抚老将",
		],
		correctIndex: 1,
		explanation:
			"《史记》载蔺相如曰『强秦之所以不敢加兵于赵者，徒以吾两人在也。今两虎共斗，其势不俱生。吾所以为此者，先国家之急而后私仇也』。能廷叱秦王却避让廉颇——不是怕，是忍。这一忍，赵国的国运多撑了几年。",
	},
	{
		id: "zhanguo_quiz_baiqi_changping",
		chapter: "baiqi:zhanguo",
		question: "长平之战——白起坑杀四十万赵卒的根本考量是什么？",
		options: [
			"性情残暴嗜杀成性",
			"前秦已拔上党，上党民不乐为秦；赵卒反覆，恐为乱",
			"秦国粮草不济无法供养降卒",
			"以此立威震慑山东六国",
		],
		correctIndex: 1,
		explanation:
			"《史记》载武安君计曰『前秦已拔上党，上党民不乐为秦而归赵。赵卒反覆，非尽杀之，恐为乱。乃挟诈而尽坑杀之』。放归则四十万赵兵卷土重来，带回秦国则无粮可养、必生内乱——『杀降不祥』是天道，可在兵家的利害账上，他选了最绝的那条路。",
	},
	{
		id: "zhanguo_quiz_quyuan_huaisha",
		chapter: "quyuan:zhanguo",
		question: "屈原《怀沙》沉江——『宁赴湘流，葬于江鱼之腹中』体现什么样的精神？",
		options: [
			"逃避政治迫害的消极避世",
			"宁折不弯、不肯与世推移的孤忠",
			"对楚怀王客死秦国的殉死之义",
			"以死谏顷襄王悔悟的最后努力",
		],
		correctIndex: 1,
		explanation:
			"《史记》载屈原至于江滨，被发行吟泽畔。渔父劝其『与世推移』，屈原答『宁赴湘流，葬于江鱼之腹中』。安能以身之察察，受物之汶汶者乎——他若能与世推移，就不会有《离骚》、不会有『虽九死其犹未悔』。宁折不弯，才是屈原之所以为屈原。",
	},
	{
		id: "zhanguo_quiz_yueyi_buchuehusheng",
		chapter: "yueyi:zhanguo",
		question: "乐毅《报燕惠王书》——『君子交绝不出恶声，忠臣去国不洁其名』是说什么？",
		options: [
			"君子绝交前要互相留个体面",
			"忠臣离国时不洗白自己、不诋毁旧君",
			"臣子去国应当默默无闻不留名",
			"君子绝交后不该再有任何往来",
		],
		correctIndex: 1,
		explanation:
			"《史记》载乐毅回书惠王曰『臣闻古之君子，交绝不出恶声；忠臣去国，不洁其名』。惠王信谗、召他回去是要杀他——乐毅看懂了，奔赵而去。可他既不痛骂惠王以泄愤，也不为自己洗白辩白——留一线余地，让儿子仍能为昌国君、让自己仍能往来燕赵为客卿。",
	},
	{
		id: "zhanguo_quiz_tiandan_huoniuzhen",
		chapter: "tiandan:zhanguo",
		question: "田单复齐——火牛阵之所以能成功的核心要素是什么？",
		options: [
			"齐军兵力足以正面击溃燕军",
			"奇袭之夜、火牛冲阵、五千壮士随后，燕军毫无防备",
			"乐毅已被燕惠王撤换，骑劫无将才",
			"即墨城中粮草充足可以久守",
		],
		correctIndex: 1,
		explanation:
			"《史记》载田单『凿城数十穴，夜纵牛，壮士五千人随其后。牛尾热，怒而奔燕军，燕军夜大惊』。火牛阵是奇袭——奇在夜、奇在快、奇在燕军毫无防备。临阵不犹豫，给燕军不留反应时间，千古奇策才一击成功。",
	},
	{
		id: "zhanguo_quiz_sigongzi_yangshi",
		chapter: "sigongzi:zhanguo",
		question: "战国四公子养士——『鸡鸣狗盗之雄』这个评价为何不全对？",
		options: [
			"孟尝君门下根本没有鸡鸣狗盗之徒",
			"关键时刻能救命的恰是最被看不起的『卑贱之人』",
			"王安石本意是赞美孟尝君得士之多",
			"四公子养士皆为贤士，无鸡鸣狗盗",
		],
		correctIndex: 1,
		explanation:
			"王安石《读孟尝君传》讥其『鸡鸣狗盗之雄』，可《史记》明载——狐白裘被秦王宠姬所索，客有能为狗盗者夜入秦宫取之；函谷关未开，客有能为鸡鸣者诈开城门。三千门客里最能救命的，往往不是峨冠博带的高士，而是最被看不起的『卑贱之人』。士不分贵贱，能救命的就是好士。",
	},
];
