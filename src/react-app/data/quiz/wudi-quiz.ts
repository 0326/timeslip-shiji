// 五帝本纪 · 通关后「古今对话」问答题库（第四批）
// chapter 字段关联 stories/inkStories/wudi.ts 中的 storyKey（形如 "huangdi:banquan"）
// 题目覆盖阪泉、涿鹿、治天下、尧定历/禅让、舜作刑/流四凶、大禹治水等核心史识点

export interface QuizQuestion {
	id: string;
	chapter: string; // 关联的 storyKey
	question: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const wudiQuiz: QuizQuestion[] = [
	{
		id: "wudi_quiz_banquan_sanzhan",
		chapter: "huangdi:banquan",
		question: "阪泉之战——黄帝为何三战才压服炎帝？",
		options: [
			"炎帝营垒森严、粮草充足，非一战可下",
			"黄帝兵力不足，临时征召",
			"黄帝故意拖延以耗其粮",
			"天降大雾遮蔽战场",
		],
		correctIndex: 0,
		explanation:
			"《史记》载『以与炎帝战于阪泉之野。三战，然后得其志』。炎帝神农氏本是大族，营垒坚、粮草足，黄帝须修德振兵、稳扎稳打，反复较量至第三仗方服之。三战之持重，正是华夏共主之基。",
	},
	{
		id: "wudi_quiz_zhuolu_zhengshi",
		chapter: "huangdi:zhuolu",
		question: "涿鹿之战——黄帝战胜蚩尤的关键是什么？",
		options: [
			"造指南车破大雾",
			"应龙蓄水降蚩尤",
			"征师诸侯、合天下之力",
			"蚩尤军中突发瘟疫",
		],
		correctIndex: 2,
		explanation:
			"太史公先书『莫能伐』，再书『征师诸侯』——点破了胜机不在一人多能打，而在肯合诸侯之力于一处。指南车、应龙皆后世传奇，史册的真脉是『合而不散』。",
	},
	{
		id: "wudi_quiz_zhitianxia_xunfang",
		chapter: "huangdi:zhitianxia",
		question: "黄帝治天下——『迁徙往来无常处』说明黄帝如何治理？",
		options: [
			"建固定都城，坐等诸侯来朝",
			"亲巡四方，以德服万国",
			"委派大臣代为巡视",
			"用刑罚强迫诸侯臣服",
		],
		correctIndex: 1,
		explanation:
			"黄帝东登岱宗、西至空桐、南临江湘、北逐荤粥，『迁徙往来无常处』——以师兵为营卫，亲巡四方。坐等的天子德就凉了；走出去让人看见，才让万国心服来合符。",
	},
	{
		id: "wudi_quiz_yao_runyue",
		chapter: "yao:shoushi",
		question: "尧定历——『岁三百六十六日，以闰月正四时』中闰月的作用是？",
		options: [
			"补齐每年零头，使历与天行相合",
			"纪念先祖功德",
			"调整农具规格",
			"划分九州疆界",
		],
		correctIndex: 0,
		explanation:
			"一岁实长三百六十六日有零，舍去零头，几年下来冬至便滑进春天。闰月正是把那点积欠一年年补齐，使四时不错、节气不乱——『差之毫厘，谬以千里』。",
	},
	{
		id: "wudi_quiz_yao_bingli",
		chapter: "yao:shanrang",
		question: "尧禅让——『终不以天下之病而利一人』的意思是？",
		options: [
			"不让天下人受苦来使一人获利",
			"天下人生病时要给药医治",
			"一人患病便不能治理天下",
			"天下的财富不可分给一人",
		],
		correctIndex: 0,
		explanation:
			"『病』此处指受苦、受害；『利一人』指成全丹朱一人之私。尧知子丹朱不肖，宁舍骨肉之私，不令天下受害——这一舍，才有了华夏第一次『天下为公』的禅让。",
	},
	{
		id: "wudi_quiz_shun_liuyou",
		chapter: "shun:xingfa",
		question: "舜作刑——『流宥五刑』的意思是？",
		options: [
			"以流放代替肉刑，宽宥其罪",
			"五种刑罚一并施用",
			"先流放再追加刑罚",
			"只罚贵族不罚庶民",
		],
		correctIndex: 0,
		explanation:
			"『流宥五刑』即以流放远地宽宥当受肉刑之人。舜以象刑示耻、流宥慎杀，把刑当作最不得已的手段——『钦哉，钦哉，惟刑之静哉』，是华夏最早的慎刑之念。",
	},
	{
		id: "wudi_quiz_yu_dudushu",
		chapter: "yu:zhishui",
		question: "大禹治水——禹改堵为疏的核心理念是？",
		options: [
			"顺水之性，导之入海",
			"加高堤坝挡住洪水",
			"用法术镇压水怪",
			"迁百姓远避水患",
		],
		correctIndex: 0,
		explanation:
			"父鲧以土堙堵水，九年而败；禹『随山浚川』，顺水就下之性疏导入海。堵是逆水之性，疏是顺水之性——治水如此，治世亦然。",
	},
	{
		id: "wudi_quiz_huangdi_tude",
		chapter: "huangdi:zhitianxia",
		question: "黄帝称号——黄帝为何以『黄』为号？",
		options: [
			"有土德之瑞，土色黄",
			"他常穿黄色衣袍",
			"生于黄河之滨",
			"钟爱黄金之色",
		],
		correctIndex: 0,
		explanation:
			"《史记》载『有土德之瑞，故号黄帝』。土居五行之中、色黄，象征承载万物、中正淳厚。黄帝之名所记，是德而非色——以土德王天下的那份厚重。",
	},
	{
		id: "wudi_quiz_yanhuang_zisun",
		chapter: "huangdi:banquan",
		question: "阪泉之战——『炎黄子孙』的由来是？",
		options: [
			"黄帝让炎帝归入旗下，两族血脉合流",
			"黄帝诛杀炎帝并吞并其部",
			"两人共同击溃蚩尤",
			"炎帝主动让位给黄帝",
		],
		correctIndex: 0,
		explanation:
			"阪泉三战后，黄帝『得其志』而非灭其族——炎帝归入旗下，两族血脉合流，共奠华夏共主之基。后人称『炎黄子孙』，正源于此合而非此伐。",
	},
	{
		id: "wudi_quiz_shun_sizui",
		chapter: "shun:liuxiong",
		question: "舜流四凶——『四罪而天下咸服』的关键是？",
		options: [
			"罚当其罪，不过不及",
			"全部处死以儆效尤",
			"全部赦免以示仁德",
			"流放到同一个地方",
		],
		correctIndex: 0,
		explanation:
			"舜『流共工于幽陵，殛鲧于羽山』，分迁四裔、以御螭魅——是流而非杀，是各得其所而非一概而论。罚当其罪，多一分则滥杀失德、少一分则姑息养奸，天下服的从不是刀，是那杆不偏的秤。",
	},
	{
		id: "wudi_quiz_qiyuan_xuanyuan",
		chapter: "huangdi:qiyuan",
		question: "黄帝起源——『生而神灵，弱而能言』说明黄帝有何特质？",
		options: [
			"天生聪慧，幼年便显非凡",
			"出生即会法术",
			"体魄异常强健",
			"身世神秘不可考",
		],
		correctIndex: 0,
		explanation:
			"《史记》开篇即书『生而神灵，弱而能言，幼而徇齐，长而敦敏，成而聪明』——五个阶段写尽黄帝一生：天资、早慧、敏学、笃行、明断。圣王不是天生的神，是一步一步修出来的。",
	},
	{
		id: "wudi_quiz_diku_jingyuan",
		chapter: "zhuanxu:diku",
		question: "颛顼帝喾——『静渊以有谋』中的『静』字为何重要？",
		options: [
			"沉静才能谋定而后动",
			"安静意味着无为而治",
			"静坐可以修身养性",
			"静默不语显天子威仪",
		],
		correctIndex: 0,
		explanation:
			"高阳『静渊以有谋』——静在谋先，不靠一兵一卒便让四方莫不砥属。丢了『静』字便躁进失序，天下先乱在自己手里。帝喾承之以『执中』，祖孙两代定了华夏君德的调子。",
	},
	{
		id: "wudi_quiz_qiuxian_qiuxian",
		chapter: "yao:qiuxian",
		question: "尧求贤——尧为何要『悉举贵戚及疏远隐匿者』？",
		options: [
			"不拘出身，广纳天下之才",
			"只为考察贵族子弟",
			"借此削弱诸侯势力",
			"为了监视隐士的动向",
		],
		correctIndex: 0,
		explanation:
			"尧在位七十载，求贤若渴。『悉举』二字打破了亲疏贵贱的界限——舜的名字正是从这一声广搜中被听到的。华夏的选贤，从此不再看出身，只看德行。",
	},
	{
		id: "wudi_quiz_juxian_sanshikun",
		chapter: "yao:juxian",
		question: "举舜试女——尧为何要妻舜以二女、处之以九男？",
		options: [
			"从内到外全面考察舜的德行",
			"以此笼络舜的家族",
			"让女儿监视舜的行动",
			"彰显天子嫁女的排场",
		],
		correctIndex: 0,
		explanation:
			"尧妻二女以观其内，处九男以观其外——把最金贵的女儿放进去试德，把整套官制放进去试能。禅让从不是一时兴起的慷慨，是一个老人用尽一生的审慎。",
	},
	{
		id: "wudi_quiz_lijie_xiaozhi",
		chapter: "shun:lijie",
		question: "焚廪穿井——舜为何能在父弟谋害下脱身？",
		options: [
			"事先备好斗笠与暗道，智中求生",
			"天生神力击退谋害者",
			"母亲暗中相救",
			"天降神人相助",
		],
		correctIndex: 0,
		explanation:
			"舜之智在于防患于先——焚廪以两笠自捍而下，穿井先穿旁洞而出。孝不是送命，是活下来还能以德报怨。孝与智，缺一，都到不了『尧以为圣』。",
	},
	{
		id: "wudi_quiz_jiuguan_liangcai",
		chapter: "shun:jiuguan",
		question: "命九官——舜为何要『三岁一考功』？",
		options: [
			"授官只是开始，考课才是筋骨",
			"三年是古代行政的最短期限",
			"借此拖延封赏以省钱粮",
			"诸侯三年才来朝一次",
		],
		correctIndex: 0,
		explanation:
			"三岁一考功，三考绌陟，远近众功咸兴——舜让二十二个人各归其位，但不是放任不管。有官无考则贤者退、功不成，考课才让制度活下来。",
	},
	{
		id: "wudi_quiz_chanyu_shanrang",
		chapter: "shun:chanyu",
		question: "舜禅于禹——舜效尧禅贤的核心是什么？",
		options: [
			"荐禹于天，不传不肖之子商均",
			"禹武力夺位，舜被迫让贤",
			"大臣联名上书要求传禹",
			"占卜结果显示禹当受命",
		],
		correctIndex: 0,
		explanation:
			"尧不传丹朱、舜不传商均——三代人接力，把『天下为公』四个字写进了华夏文明的开篇。舜效尧禅贤，荐禹于天，是主动的让，不是被动的退。",
	},
	{
		id: "wudi_quiz_shouchan_namian",
		chapter: "yu:shouchan",
		question: "禹受禅即位——『天下诸侯皆去商均而朝禹』说明了什么？",
		options: [
			"天下归心在于德，不在于名分",
			"禹用武力胁迫诸侯来朝",
			"商均主动让位给禹",
			"诸侯只是为了避水患而迁徙",
		],
		correctIndex: 0,
		explanation:
			"禹辞辟舜之子商均于阳城——推让而后受。诸侯不约而同越过商均、奔禹而来，说明天下看的是治水十三年的德，不是一个名分。上古的天下，是让出来的。",
	},
	{
		id: "wudi_quiz_ganzhan_jiatianxia",
		chapter: "qi:ganzhizhan",
		question: "甘之战——启作《甘誓》中『用命赏于祖，不用命僇于社』的作用是？",
		options: [
			"先明赏罚、立军法，才有战斗力",
			"承诺战后大肆封赏",
			"威胁不服从者灭族",
			"祈求祖宗保佑战胜",
		],
		correctIndex: 0,
		explanation:
			"启战前作《甘誓》——先明天命、再申职守、终定赏罚。用命赏于祖，不用命僇于社——名正法立，家天下才立得住。第一战不是为了杀人，是为了立规矩。",
	},
	{
		id: "wudi_quiz_wangguo_shangde",
		chapter: "jie:wangguo",
		question: "夏桀亡国——『桀不务德而武伤百姓』的根本教训是？",
		options: [
			"失德失人心，天命不是天生的",
			"兵力不足导致亡国",
			"都城选址不当",
			"天灾频繁国力衰退",
		],
		correctIndex: 0,
		explanation:
			"桀到死悔的都是『没杀成汤』——可亡国从来不是天命，是一次次本可以不那样的选择垒成的。不务德而武伤百姓，百姓弗堪——失去人心的王，再高的台子也会塌。",
	},
];
