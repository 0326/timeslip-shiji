// 秦 · 章节测验题库
// chapter 字段关联 stories/inkStories/qin.ts 中的 storyKey（形如 "qshihuang:qin"）
// 题目覆盖始皇废分封、李斯谏逐客、荆轲刺秦、吕不韦奇货、蒙恬守义、秦穆霸西戎等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const qinQuiz: QuizQuestion[] = [
	{
		id: "qin_quiz_qshihuang_feifenxing",
		chapter: "qshihuang:qin",
		question: "秦始皇废分封行郡县——『天下共苦战斗不休，以有侯王』道出什么史识？",
		options: [
			"周鉴不远，诸侯立国数代必相攻如仇雠",
			"秦宗室无人可封，不如收权于中央",
			"郡县之制便于征收赋税徭役",
			"分封不利于文字货币的统一",
		],
		correctIndex: 0,
		explanation:
			"《史记》载始皇曰『天下共苦战斗不休，以有侯王。赖宗庙，天下初定，又复立国，是树兵也』。周鉴不远——诸侯一旦立国，数代之后便相攻如仇雠，五百年战乱就是这么来的。废分封行郡县，是始皇最有远见的一笔，大一统才真正立得住。",
	},
	{
		id: "qin_quiz_lisi_jianzhuke",
		chapter: "lisi:qin",
		question: "李斯《谏逐客书》——『泰山不让土壤，故能成其大』的核心论点是什么？",
		options: [
			"秦国山川形胜足以并吞天下",
			"逐客是自断人才之源，秦之强正在广纳客卿",
			"泰山为五岳之首，象征秦王受命",
			"客卿之患不在心腹，在于边鄙",
		],
		correctIndex: 1,
		explanation:
			"《史记》载李斯上书曰『泰山不让土壤，故能成其大；河海不择细流，故能就其深；王者不却众庶，故能明其德』。穆公得由余、百里傒，孝公用商鞅，惠王用张仪，昭王得范雎——四代客卿成就了强秦。逐客等于自断人才之源，秦王读罢立罢其令、复李斯官。",
	},
	{
		id: "qin_quiz_jingke_tuqiongbijian",
		chapter: "jingke:qin",
		question: "荆轲刺秦——『事所以不成者，以欲生劫之』说明荆轲的真正目的是什么？",
		options: [
			"生劫秦王逼其归诸侯侵地，效曹沫劫齐桓公",
			"秦王拔剑太快，没来得及刺中",
			"秦舞阳临阵失色拖累了行动",
			"匕首过短，无法近身致命",
		],
		correctIndex: 0,
		explanation:
			"《史记》载荆轲倚柱而笑、箕踞以骂曰『事所以不成者，以欲生劫之，必得约契以报太子也』。他想做曹沫，生劫秦王逼其归诸侯侵地，不是单纯为了杀人——理想更高，但也给了秦王拔剑的间隙。立意较然，不欺其志，太史公许之。",
	},
	{
		id: "qin_quiz_lvbuwei_qihuokeju",
		chapter: "lvbuwei:qin",
		question: "吕不韦『奇货可居』——他押在子楚身上的真正赌注是什么？",
		options: [
			"以全部身家博一个落魄质子的归国继位",
			"借子楚之名贩卖军马给秦国",
			"替子楚偿还赌债换其感恩",
			"用千金贿赂华阳夫人收子楚为子",
		],
		correctIndex: 0,
		explanation:
			"《史记》载吕不韦贾邯郸，见子楚而怜之，曰『此奇货可居』。乃以五百金与子楚为进用，复以五百金买奇物玩好自奉西游秦，求见华阳夫人姊，说夫人立子楚为适嗣。商人的胆识不在会算账，在算完账之后敢不敢下注——他敢押全部身家于一人，才有了千古第一政治投资。",
	},
	{
		id: "qin_quiz_mengtian_shouyi",
		chapter: "mengtian:qin",
		question: "蒙恬临终——『自知必死而守义者，不敢辱先人之教』体现什么？",
		options: [
			"手握三十万大军却宁死不反的忠义",
			"对秦始皇知遇之恩的图报",
			"对扶苏被赐死的痛惜之情",
			"对赵高矫诏的隐忍待时",
		],
		correctIndex: 0,
		explanation:
			"《史记》载蒙恬曰『今臣将兵三十余万，身虽囚系，其势足以倍畔，然自知必死而守义者，不敢辱先人之教，以不忘先主也』。他有能力反、却选择不反——守义二字，让长城上立起一块忠魂碑。秦虽二世而亡，蒙恬这份不反的忠，却比秦的江山更长久。",
	},
	{
		id: "qin_quiz_qinmu_baxirong",
		chapter: "qinmu:qin",
		question: "秦穆公殽之败——『孤以不用百里傒、蹇叔言以辱三子，三子何罪乎』体现了什么？",
		options: [
			"诿过于将、推卸败战责任",
			"敢把过错一肩挑起，反更得士心",
			"借认错之名暗示孟明视须自尽",
			"知过却不知改，仅作姿态",
		],
		correctIndex: 1,
		explanation:
			"《史记》载穆公素服郊次、向师而哭曰『孤以不用百里傒、蹇叔言以辱三子，三子何罪乎』。明明是自己不听蹇叔而致败，他却把过错一肩挑起——孟明视因此更加死力，三年后济河焚舟、雪殽山之耻。敢认错的君，才有人肯替他卖命。",
	},
];
