import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";
import jiangshangXizhouSource from "../ink/jiangshang-xizhou.ink?raw";
import wenwangXizhouSource from "../ink/wenwang-xizhou.ink?raw";
import wuwangXizhouSource from "../ink/wuwang-xizhou.ink?raw";
import zhougongXizhouSource from "../ink/zhougong-xizhou.ink?raw";
import xuanwangXizhouSource from "../ink/xuanwang-xizhou.ink?raw";
import youwangXizhouSource from "../ink/youwang-xizhou.ink?raw";

export const xizhouInkStories: Record<string, InkStoryConfig> = {
	"jiangshang:xizhou": {
		key: "jiangshang:xizhou",
		title: "太公望姜尚 · 待时之渔",
		source: jiangshangXizhouSource,
		precompiled: false,
		deaths: {
			guiyu: {
				reason: "枯坐渭滨、错失出仕之机，终不遇文王而老死溪畔",
				classical: "西伯将出猎，卜之，曰所获非龙非彨，非虎非罴，所获霸王之辅。于是周西伯猎，果遇太公于渭之阳。",
				analysis:
					"史上的姜尚年老穷困,以渔钓奸周西伯——他钓的从来不是鱼,是那辆终会来的车。可『遇』也需自己走出那一步:若只枯坐守溪、不肯以言干世,西伯的卜辞再灵,也照不见一个已经放弃的人。",
			},
			qizi: {
				reason: "一怒休妻，穷困终老朝歌市井",
				classical: "吕尚盖尝穷困，年老矣，以渔钓奸周西伯。",
				analysis:
					"七十余岁尚不能忍妇人之言，何能忍渭水之钓、牧野之待？史上太公半生穷困而不堕其志，终遇文王于渭水——那一忍，等了七十年。",
			},
			xiaoyao: {
				reason: "直钩垂钓只作消遣，无求王侯之意",
				classical: "姜太公钓于渭滨，文王遇之，与语大悦，曰：吾太公望子久矣。",
				analysis:
					"直钩钓鱼，钓的从来不是鱼，是『王与侯』。若只是消遣，那卷《六韬》便永远随钓竿沉入渭水，兵仙姜尚也就只是个怪老头，史书中不会有《齐太公世家》。",
			},
			gongshun: {
				reason: "遇文王而伏地叩首称村夫，错失知遇",
				classical: "宁向直中取，不向曲中求。不为锦鳞设，只钓王与侯。",
				analysis:
					"太公钓王侯，钓的是平等相逢——西伯下车与语、载与俱归，敬的是那份直中取的傲气。你伏地称罪，他便以为你是个畏事的老农，大礼擦肩而逝。",
			},
			zaojin: {
				reason: "盟津力主即刻进兵，八百诸侯人心不齐而败",
				classical: "诸侯皆曰：纣可伐矣。武王曰：女未知天命，未可也。乃还师归。",
				analysis:
					"八百诸侯不期而至，看似气势浩大，实则指挥不一、人心未齐——比干尚在朝死谏，纣尚未烂透。史上太公陪武王班师等了两年，等的就是纣剖比干、囚箕子、太师抱乐器奔周，待天命真正归周，才一击而中。",
			},
			hesitate: {
				reason: "牧野稳坐中军不敢冲阵，四万五千人被七十万吞没",
				classical: "师尚父号曰：总尔众庶，与尔舟楫，后至者斩。武王使师尚父与百夫致师。",
				analysis:
					"牧野之战，太公以耄耋之年亲率百夫致师、第一个冲阵——白发白旄映于晨光，四万五千人见老尚父亲冒矢石，士气大振，商军前徒倒戈。你不敢冲，倒戈的勇气也就在奴隶的矛尖上僵住了。",
			},
			anyixiu: {
				reason: "就国途中安宿一晚，莱人攻陷营丘",
				classical: "太公闻之，夜衣而行，犁明至国。莱侯来伐，与之争营丘。",
				analysis:
					"客栈主人一句『时难得而易失』，点醒了太公——他连夜穿衣赶路，黎明赶到营丘正赶上莱人来攻。时机这东西，等一辈子也未必来一次，来了却在床上歇一晚，就什么都没了。",
			},
		},
		endings: {
			canon: {
				title: "太公封齐",
				kind: "canon",
				epigraph: "等得到，是本事；敢冲，也是本事——渭水的直钩，终究钓起了一个天下。",
			},
			if_youshui: {
				title: "东海为客",
				kind: "if",
				epigraph: "百里之国盛得下他的晚年，盛不下他胸中那个天下。",
			},
			if_bianli: {
				title: "变俗革礼",
				kind: "if",
				epigraph: "礼是好礼——只是穿在东海的风浪上，嫌重了。",
			},
		},
	},
	"wenwang:xizhou": {
		key: "wenwang:xizhou",
		title: "周文王姬昌 · 羑里之忍",
		source: wenwangXizhouSource,
		precompiled: false,
		deaths: {
			mingyuan: {
				reason: "羑里困厄中自弃，无《周易》无渭水无周",
				classical: "西伯盖即位五十年。其囚羑里，盖益易之八卦为六十四卦。",
				analysis:
					"史上的文王被囚羑里七年,不怨不怒,反在囚室里推演《周易》——把最暗的牢,坐成了照亮后世三千年的光。困厄从不能困住他。你若在石室里自弃,便没有周易、没有渭水求贤、没有那个『三分天下有其二』的周了。",
			},
			buqu: {
				reason: "拒不应召朝歌，纣王发兵伐周",
				classical: "崇侯虎谮西伯于殷纣曰：西伯积善累德，诸侯皆向之，将不利于帝。帝纣乃囚西伯于羑里。",
				analysis:
					"应召是险，不应召是反。史上文王虽知虎穴，仍遵王命而往——他算准了纣爱财、畏名，不会贸然杀一个『积善累德』的诸侯。不去，就是坐实反心，连周旋的余地都没有了。",
			},
			baochou: {
				reason: "出狱即伐崇侯虎报谗言之仇，纣王翻脸杀之",
				classical: "西伯乃献洛西之地，以请纣去炮格之刑。纣许之。",
				analysis:
					"弓矢斧钺是试探，不是赏赐。史上文王出狱第一件事不是报仇，是献洛西之地请除炮烙——天下闻之，皆曰西伯仁德，诸侯之心归矣。你刚脱牢笼就动兵，等于告诉纣：『你猜对了，我果然要反。』",
			},
			cuoguo: {
				reason: "渭水遇姜尚嫌其年老未用，错过霸王之辅",
				classical: "西伯猎，果遇太公于渭之阳，与语大说，曰：吾太公望子久矣。载与俱归，立为师。",
				analysis:
					"八十岁怎么了？文王自己出狱时也已年近八十，他看中的是姜尚胸中那卷《六韬》，不是他的膝盖。一个『吾太公望子久矣』，等了多少年的知音——你一句『改日请教』，就把七十年的等待打发了。",
			},
		},
		endings: {
			canon: {
				title: "至德受命",
				kind: "canon",
				epigraph: "三分天下有其二，以服事殷——不王，而王天下。",
			},
			if_buxian: {
				title: "洛西不献",
				kind: "if",
				epigraph: "守住了一块地，省下了一次疼——『受命』二字，却再无人提起。",
			},
			if_chengwang: {
				title: "受命称王",
				kind: "if",
				epigraph: "王冠比天命早落了一步——从此周以力承天，不复以德。",
			},
		},
	},
	"wuwang:xizhou": {
		key: "wuwang:xizhou",
		title: "周武王姬发 · 孟津之决",
		source: wuwangXizhouSource,
		precompiled: false,
		deaths: {
			zhuyin: {
				reason: "以暴易暴、纵杀无度，与纣无别使倒戈之众寒心",
				classical: "纣师虽众，皆无战之心……纣兵皆崩畔纣。武王驰之，纣兵皆倒兵以战以开武王。",
				analysis:
					"牧野之众为你倒戈,是信你与纣不同——你伐的是『独夫』,不是殷民。史上的武王入殷便释箕子之囚、封比干之墓、发钜桥之粟,散鹿台之财以示不贪。你若以暴易暴、纵杀掳掠,那些为你开路的奴隶临死会问:这和纣王,有什么分别?",
			},
			shouxiao: {
				reason: "守父丧三年不举兵，诸侯心冷、商纣备战",
				classical: "为文王木主，载以车，中军。武王自称太子发，言奉文王以伐，不敢自专。",
				analysis:
					"武王载文王木主出征，自称『太子发』——这本身就是孝道的最高表达：继承父志、完成父业，方为大孝。守灵守到天下变色、良机尽失，文王在九泉之下也不会瞑目。",
			},
			zaofa: {
				reason: "盟津观兵时强令渡河决战，商纣七十万军顽抗",
				classical: "是时，诸侯不期而会盟津者八百诸侯。诸侯皆曰：纣可伐矣。武王曰：女未知天命，未可也。乃还师归。",
				analysis:
					"那两年的等待不是怯——是等比干死、箕子囚、太师奔，等纣王把最后一点忠臣人心丧尽。早两年，牧野就不会有『前徒倒戈』，七十万奴隶就不会调转戈矛为你开道。",
			},
			qirui: {
				reason: "牧野誓师示弱，四万五千人士气崩溃",
				classical: "称尔戈，比尔干，立尔矛，予其誓！今予发惟恭行天之罚！",
				analysis:
					"《牧誓》是临战最后的鼓气——历数纣罪、宣告天命，四万人要靠这一口气面对七十万之众。你自己都说『尽力而为吧』，叫他们怎么相信这是替天行道？",
			},
			qiongbing: {
				reason: "灭商后不偃武，刀兵不入库，三监之乱提前爆发",
				classical: "纵马于华山之阳，放牛于桃林之虚；偃干戈，振兵释旅：示天下不复用也。",
				analysis:
					"归马放牛不是软弱，是给天下看：仗打完了，该过日子了。刀枪不入库，殷遗民就人人自危，管蔡就有机可乘——后来三监之乱虽被周公平定，但那是因为武王先偃武修文、稳住了人心。",
			},
		},
		endings: {
			canon: {
				title: "三敢定天下",
				kind: "canon",
				epigraph: "孟津敢退，牧野敢冲，定天下敢放——这三敢，成就了周武王。",
			},
			if_xianfa: {
				title: "孟津径伐",
				kind: "if",
				epigraph: "下一次盟津点兵，还会有八百诸侯来吗？没有人知道。",
			},
			if_xuyin: {
				title: "尽戮殷遗",
				kind: "if",
				epigraph: "你灭得了殷的社稷，灭不掉殷人的记忆。",
			},
		},
	},
	"zhougong:xizhou": {
		key: "zhougong:xizhou",
		title: "周公旦 · 摄政之诚",
		source: zhougongXizhouSource,
		precompiled: false,
		deaths: {
			bingjian: {
				reason: "流言之下举兵自证，金縢焚毁忠心永埋",
				classical: "周公乃自以为质，设三坛……册祝……乃纳册于金縢之匮中。",
				analysis:
					"管蔡流言『周公将不利于孺子』时,史上的周公选择的是避居、是等成王自己打开那只金縢之匮、读到那篇愿以身代武王的祝文。他信『时间与真心』。你若举兵自证,金縢在战火里烧成灰,那片赤诚便再没人看得到——清者自清,一动刀兵就浊了。",
			},
			tuirang: {
				reason: "三公分权、不肯摄政，主少国疑天下大乱",
				classical: "周公乃践阼代成王摄行政当国。",
				analysis:
					"天下初定、主上年幼，必须有一个人站出来扛鼎——那个人就是周公。他不是不知道流言会起、兄弟会反，他只是更知道『恐天下畔周，无以告我先王』。你推让，周就散了。",
			},
			tuixian: {
				reason: "遭流言避位出奔，三监之乱无人镇压",
				classical: "周公乃奉成王命，兴师东伐，作《大诰》。遂诛管叔，杀武庚，放蔡叔。",
				analysis:
					"流言四起时最需要的是扛住——太公望和召公奭也一度怀疑你，但你写《君奭》剖明心迹、奉成王命东征，用三年平叛证明了自己的忠心。你一退，叛军就无人能挡了。",
			},
			zhengbian: {
				reason: "金縢事发前与成王当庭争辩，君臣反目",
				classical: "成王执书以泣，曰：昔周公勤劳王家，惟予幼人弗及知。今天动威以彰周公之德，惟朕小子其迎。",
				analysis:
					"周公的忠心从不靠嘴辩。他当初把祝文藏进金縢匮，就是不求人知——等成王自己打开看到，才是最有力的证明。你越辩，越像恋栈。",
			},
			xunzi: {
				reason: "诫子只言『谨守臣节』，未传吐哺待贤之风",
				classical: "一沐三捉发，一饭三吐哺，起以待士，犹恐失天下之贤人。子之鲁，慎无以国骄人！",
				analysis:
					"周公训子最核心的一句是『无以国骄人』——不要因为当了国君就对人傲慢。你洗一次头三次握发停餐、吃一顿饭三次吐食迎客，就是要儿子把礼贤下士传下去。只教谨小慎微，鲁国后来就真的只是谨小慎微了。",
			},
		},
		endings: {
			canon: {
				title: "吐哺归心",
				kind: "canon",
				epigraph: "坐了七年天子位，站起来还回去——古今唯此一人，是为元圣。",
			},
			if_daizhou: {
				title: "代周称制",
				kind: "if",
				epigraph: "他成了千古第一能臣——除了那两个字：周公。",
			},
			if_huitou: {
				title: "临位而返",
				kind: "if",
				epigraph: "他走到那位子面前，看清了它的分量，才转身——绕一圈，落回同一处臣位。",
			},
		},
	},
	"xuanwang:xizhou": {
		key: "xuanwang:xizhou",
		title: "周宣王姬静 · 中兴之殇",
		source: xuanwangXizhouSource,
		precompiled: false,
		deaths: {
			fuchou: {
				reason: "即位即清算国人暴动参与者，再起暴动",
				classical: "宣王即位，二相辅之，修政，法文、武、成、康之遗风，诸侯复宗周。",
				analysis:
					"你爹厉王就是因为暴虐被国人赶走的，你上来就学他报复？召公用自己儿子的命换了你这条命，是要你做个好天子，不是做个复仇者。宣王中兴的根基是『法文、武、成、康之遗风』——修德，不是修怨。",
			},
		},
		endings: {
			canon: {
				title: "中兴一世",
				kind: "canon",
				epigraph: "他收拾了父亲的烂摊子，也亲手耗尽了自己的中兴——盛极而骄，是最难的功课。",
			},
			if_tingjian: {
				title: "戒惧守成",
				kind: "if",
				epigraph: "籍田未废、鲁君未乱、料民勒马——他把中兴的余晖，多留了几十年。",
			},
			if_dumu: {
				title: "黩武虚国",
				kind: "if",
				epigraph: "他赢了每一场仗，却输了那个仗打完之后该回去过日子的天下。",
			},
			if_shoucheng: {
				title: "临崖收手",
				kind: "if",
				epigraph: "宣王一生功过全在一个『度』字——他险些失了，又在最后关头找了回来。",
			},
		},
	},
	"youwang:xizhou": {
		key: "youwang:xizhou",
		title: "周幽王宫涅 · 烽火之笑",
		source: youwangXizhouSource,
		precompiled: false,
		deaths: {
			chuzhan: {
				reason: "犬戎犯境亲率军出战，战死阵前镐京陷落",
				classical: "幽王举烽火征兵，兵莫至。遂杀幽王骊山下，虏褒姒，尽取周赂而去。",
				analysis:
					"该举烽火的时候你亲自上阵，该点烽火你又不点——你根本没搞清楚自己是天子，不是先锋。你的位置是在烽火台上发号施令、召诸侯勤王，不是提着剑去跟犬戎骑兵拼命。",
			},
		},
		endings: {
			canon: {
				title: "烽火亡国",
				kind: "canon",
				epigraph: "那一座座烽火台，是周王室最后的信用——玩一次少一分，玩多了，就什么都没了。",
			},
			if_zishou: {
				title: "悬崖勒马",
				kind: "if",
				epigraph: "褒姒不是妖妃，烽火也不是致命的玩笑——致命的，是一个天子觉得自己可以为所欲为。",
			},
			if_bufei: {
				title: "守礼存周",
				kind: "if",
				epigraph: "他救不了那个正在朽坏的周，只是没有亲手点燃引线——『无事可记』，已是末世之君最大的仁慈。",
			},
			if_wanfei: {
				title: "犹疑晚废",
				kind: "if",
				epigraph: "他既想守礼、又舍不得放手——拖到最后才废，和一开始就废，犬戎的马蹄一样快。",
			},
		},
	},
};
