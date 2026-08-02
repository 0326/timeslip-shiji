import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";
import lvhouHanchuSource from "../ink/lvhou-hanchu.ink?raw";
import hanwenHanchuSource from "../ink/hanwen-hanchu.ink?raw";
import zhouboHanchuSource from "../ink/zhoubo-hanchu.ink?raw";
import chaocuoHanchuSource from "../ink/chaocuo-hanchu.ink?raw";
import zhouyafuHanchuSource from "../ink/zhouyafu-hanchu.ink?raw";
// 番外 · 上帝视角
import extraLvhouGongrenSource from "../ink/extras/extra-lvhou-gongren.ink?raw";
import extraHanwenDaichenSource from "../ink/extras/extra-hanwen-daichen.ink?raw";
import extraZhouboBeijunSource from "../ink/extras/extra-zhoubo-beijun.ink?raw";
import extraZhouyafuXiliuSource from "../ink/extras/extra-zhouyafu-xiliu.ink?raw";
import extraChaocuoDonggongSource from "../ink/extras/extra-chaocuo-donggong.ink?raw";

export const hanchuInkStories: Record<string, InkStoryConfig> = {
	"lvhou:hanchu": {
		key: "lvhou:hanchu",
		title: "高后吕雉 · 女主称制",
		source: lvhouHanchuSource,
		precompiled: false,
		deaths: {
			sha_wangling: {
				reason: "斩面折廷争的王陵立威，功臣离心提前发难",
				classical: "太后独怒王陵，乃详迁陵为帝太傅，夺之相权。陵怒，谢病免。",
				analysis:
					"王陵当廷搬出高帝白马之盟『非刘氏而王,天下共击之』顶撞你——史上的吕后森冷如铁,却不杀他,只明升暗降为帝太傅、夺其相权。她比谁都清楚:谏臣的血是最贵的血,溅上身就洗不掉。你若斩了他,满朝的嘴闭了,心也全推到了吕家对面,功臣提前拥兵入宫。",
			},
			renshan: {
				reason: "彭城兵败为项羽所擒，未忍其辱自戕",
				classical: "吕后……遂为得太公者质于楚。",
				analysis:
					"史上的吕雉在楚营做了两年多的人质，忍辱负重才熬到归汉。那份坚忍，是她日后称制的底子。你若连眼前的屈辱都受不住，便见不到长乐宫的女主天下。",
			},
			bukongzhi: {
				reason: "高祖崩秘不发丧，欲尽诛诸将事泄被反杀",
				classical: "四月甲辰，高祖崩长乐宫。四日不发丧。吕后与审食其谋曰……",
				analysis:
					"史上吕后与审食其谋划四日不发丧，郦商一番话点醒，吕后才打消尽诛功臣的念头。你若真动手，陈平周勃灌婴这班老臣岂是束手就戮之人，先一步下手，你母子二人便做了刀下鬼。",
			},
			renzhi_kuanghuan: {
				reason: "人彘之祸后纵情享乐，失尽人心，诸臣暗联刘姓王反",
				classical: "太后遂断戚夫人手足……居数日，乃召孝惠帝观人彘。",
				analysis:
					"人彘已经做了，孝惠已经病了——这一步你退不回。可你若从此只顾泄愤、不事朝政，刘姓诸王与功臣列侯暗中联手，不必等死后，身前便要倾覆。史上的吕后虽然狠辣，临朝称制却政绩斐然，正因她知『泄愤之后还得治国』。",
			},
			chenwang_guozao: {
				reason: "诸吕封王操之过急，激变功臣列侯提前发难",
				classical: "太后称制……议欲立诸吕为王。问右丞相王陵……王陵曰：不可。",
				analysis:
					"王陵当面力争不可王诸吕，你逼得太急、一步到位封遍吕氏，陈平周勃便再无转圜余地。史上的吕后是先追尊亡兄、再封活着的吕家子侄，一步步把朝臣磨顺的。操切则速亡。",
			},
			bufang_bingquan: {
				reason: "临终未将军权交付吕产吕禄，或被二人轻易交出",
				classical: "吕禄信郦寄，时与出游猎……太尉勃入军门，行令军中曰：为吕氏右袒，为刘氏左袒。军中皆左袒为刘氏。",
				analysis:
					"吕后临终千叮万嘱『必据兵卫宫，慎毋送丧』——北军南军是吕家最后一道命门。你若疏忽兵权、听郦寄忽悠交了将印，周勃一入北军，诸吕须臾之间便全族覆灭。",
			},
		},
		endings: {
			canon: {
				title: "女主称制",
				kind: "canon",
				epigraph: "政不出房户，天下晏然——她把『刚毅』二字，活成了一场身后族灭的悲剧。",
			},
			if_buren: {
				title: "刀下留人",
				kind: "if",
				epigraph: "她改了狠，改不了吕家与功臣那道死结——可至少，她的儿子还是她的儿子。",
			},
			if_bufengwang: {
				title: "不王诸吕",
				kind: "if",
				epigraph: "她守住了娘家的人，交出了娘家的权——没有诛吕之变，也就没有了汉文帝。",
			},
		},
	},
	"hanwen:hanchu": {
		key: "hanwen:hanchu",
		title: "汉文帝 · 仁君模板",
		source: hanwenHanchuSource,
		precompiled: false,
		deaths: {
			bugandai: {
				reason: "不敢入京受玺，疑惧逗留代地，错失帝位",
				classical: "代王问左右郎中令张武等。张武等议曰：汉大臣皆故高帝时大将……愿大王称疾毋往，以观其变。",
				analysis:
					"张武等多数人都劝你称疾毋往。史上的宋昌力排众议，你又先占卜、再遣薄昭入京探实，才敢动身。你若被那些『以观其变』的迟疑话吓住、待在代地不动，皇位转眼便给了别人——仁君的机会，从来只给有备而敢赴的人。",
			},
			xierang_buguo: {
				reason: "三让五让辞让过度，群臣转而迎立他人",
				classical: "代王西乡让者三，南乡让者再……遂即天子位。",
				analysis:
					"三让是礼，四让五让就成了真辞。史上的刘恒三让之后便即天子位，分寸拿捏得极准。你若让过了头、一味谦恭，陈平周勃便真的以为你不愿做，另立淮南王或齐王一系，你这辈子就只做个代王。",
			},
			kuanren_fanpan: {
				reason: "一味宽厚，济北王淮南王叛乱反失天下",
				classical: "济北王兴居闻帝之代，欲往击胡，乃反，发兵欲袭荥阳。",
				analysis:
					"文帝之仁不是无原则的姑息。史上济北王反，即遣柴武击之；淮南王长废迁蜀郡，恩威并施。你若只懂宽仁、不敢加兵，刘姓诸王一个个反起来，文景之治还没开始，天下便先乱了。",
			},
			xiuming_tingjian: {
				reason: "为百金露台开建，开奢费之端，四海困穷",
				classical: "百金，中民十家之产，吾奉先帝宫室，常恐羞之，何以台为！",
				analysis:
					"露台百金，看似不多，却是文景之治『以示敦朴，为天下先』的起点。你若惜不得这百金、开奢费之风，后世皇帝一个比一个奢靡，文景的俭朴基业就此崩塌。史上的文帝『治霸陵皆以瓦器，不得以金银铜锡为饰』——仁君之俭，正从一个罢修露台开始。",
			},
		},
		endings: {
			canon: {
				title: "千古仁君",
				kind: "canon",
				epigraph: "为政以德，譬如北辰——他把『仁』字，刻进了每一件小事里。",
			},
			if_shoucheng: {
				title: "守成之君",
				kind: "if",
				epigraph: "文景之治还是文景之治——只是缇萦们的眼泪，未必再能换来一道诏书。",
			},
			if_xiuyang: {
				title: "休养生息",
				kind: "if",
				epigraph: "海内殷富，兴于礼义——他没有开疆的功业，却让百姓吃饱了饭。",
			},
		},
	},
	"zhoubo:hanchu": {
		key: "zhoubo:hanchu",
		title: "绛侯周勃 · 安刘者",
		source: zhouboHanchuSource,
		precompiled: false,
		deaths: {
			buganmou: {
				reason: "诸吕擅权不敢举事，被吕产吕禄先下手族诛",
				classical: "吕禄、吕产欲发乱关中……绛侯陈平乃谋。",
				analysis:
					"诸吕擅权时，你是太尉却无兵权，进不得军营门。史上的周勃与陈平密谋，先挟郦商之子郦寄去骗吕禄交印。你若畏缩观望、不敢合谋，等吕产吕禄先发，刘氏与功臣一并被诛，哪来后来的安刘之功。",
			},
			suowei_budui: {
				reason: "北军一呼左袒之后纵兵大掠，失军心失人心",
				classical: "太尉遂将北军……然尚有南军。平阳侯闻之，以吕产谋告丞相平，丞相平乃召朱虚侯佐太尉。",
				analysis:
					"入北军、令左右袒，军中皆左袒为刘氏，这是你一生最关键的一刻。你若控制不住兵锋、纵兵诛吕时大肆株连，非但失了军心，连代王入京都不敢进长安。史上的周勃诛杀诸吕后即刻迎立代王，分寸极稳——安刘的『安』字，全在收得住。",
			},
			yinbing_aoshang: {
				reason: "诛吕后居功自傲、对文帝无礼，被罢相就国后忧惧而死",
				classical: "绛侯为丞相，朝罢趋出，意得甚。上礼之恭，常自送之。",
				analysis:
					"功高震主本就是险地。袁盎一句问『丞相何如人也』点醒了文帝，你若还不知收敛、骄矜自得，罢相就国之后只会更惧——地方官登门你便以为是来抓你，天天披甲持兵见客，反被人告以谋反，狱中饿死，不待儿子周亚夫长大了。",
			},
		},
		endings: {
			canon: {
				title: "功成身退",
				kind: "canon",
				epigraph: "安刘氏者必勃也——他用一生兑现了这四个字，也咽下了狱吏之贵。",
			},
			if_houdao: {
				title: "重厚少文",
				kind: "if",
				epigraph: "虽伊尹、周公，何以加哉——才能凡庸的老实人，关键时刻扛住了江山。",
			},
			if_bense: {
				title: "武夫本色",
				kind: "if",
				epigraph: "吾尝将百万军，然安知狱吏之贵乎——一句话，道尽功臣暮年的悲凉。",
			},
		},
	},
	"chaocuo:hanchu": {
		key: "chaocuo:hanchu",
		title: "晁错 · 谋国之忠",
		source: chaocuoHanchuSource,
		precompiled: false,
		deaths: {
			bujian_xiaofan: {
				reason: "文帝朝不敢言削藩，诸侯坐大终至不可制",
				classical: "数上书孝文时，言削诸侯事，及法令可更定者。书数十上，孝文不听，然奇其材。",
				analysis:
					"文帝不听你的削藩策，但奇你的材——迁为中大夫。你若连说都不敢说、一味明哲保身，等景帝即位，吴国铜盐之利已养兵四十年、诸侯之地半于天下，再想削，削不动了。史上的晁错『锐于为国远虑』，从太子家令时起便敢言，正因如此景帝才会倚他为御史大夫。",
			},
			xiaofan_guozao: {
				reason: "削藩令下太急、七国并起时朝臣尽反，景帝腰斩你于朝",
				classical: "错所更令三十章，诸侯皆喧哗疾晁错。",
				analysis:
					"削之亦反不削亦反，判断对；但『削之反亟祸小』不代表你可以毫无准备、连削楚赵胶西再削吴，一月之间诸侯震恐。史上的你就是这样——十数日间连削四国，激得七国并起。你若再稳一稳、先削吴一国或等一个更成熟的时机，未必会被袁盎一句话送上东市。",
			},
			jujian_bubi: {
				reason: "七国反后力主景帝亲征、自己居守，被袁盎窦婴联手反噬",
				classical: "错议欲令上自将兵，而身居守……",
				analysis:
					"七国兵起，你出的主意是让景帝亲征、你自己留守长安。史上的这一步成了袁盎窦婴攻击你的口实——『离间君臣、意欲分据』。你若还想活，要么随驾亲征、要么即刻请罪辞位，把主军权交给周亚夫窦婴——让君上履险、自己留后，在帝王眼里，就是不臣。",
			},
			buzhi_tui: {
				reason: "吴楚已诛不知功成身退，继续变法更令得罪贵戚",
				classical: "衣朝衣斩东市。",
				analysis:
					"（史实线东市之斩已在死亡结局中。）你削藩策成、吴楚破——这本是可以全身而退的时候。可史上的晁错太刚太锐，削完诸侯还要更改法令三十章，把贵戚功臣得罪一个遍。功成不退、锐于任事而不知收敛，忠臣谋国反近身祸——七国平了，你的死期也到了。",
			},
		},
		endings: {
			canon: {
				title: "为国远虑",
				kind: "canon",
				epigraph: "晁错为国远虑，祸反近身——他谋的是万世之利，赔的是自己的一条命。",
			},
			if_huanxue: {
				title: "缓削诸侯",
				kind: "if",
				epigraph: "他听进了父亲那杯毒药——保住了命，也丢了那点锐于为国的锋芒。",
			},
			if_suijia: {
				title: "随驾亲征",
				kind: "if",
				epigraph: "他把自己缚上军前，斩他就成了自剪羽翼——赢了这一局，赢不了君心。",
			},
		},
	},
	"zhouyafu:hanchu": {
		key: "zhouyafu:hanchu",
		title: "条侯周亚夫 · 将才之刚",
		source: zhouyafuHanchuSource,
		precompiled: false,
		deaths: {
			bubi_junmen: {
				reason: "细柳营军门不阻天子前驱，被文帝视为治军不严、不任以事",
				classical: "天子先驱至，不得入。先驱曰：天子且至！军门都尉曰：将军令曰『军中闻将军令，不闻天子之诏』。",
				analysis:
					"你若按常礼开营门迎天子、任由车驾驱驰入营，文帝嘴上会夸你知礼，心里却知道你不是将才——霸上、棘门军就是如此，后来匈奴大入，他们根本挡不住。史上的周亚夫正是用『军中闻将军令不闻天子诏』这一阻，换来了文帝临终那句『即有缓急，周亚夫真可任将兵』。不开门，才是真将军。",
			},
			jiuliang_butingzhao: {
				reason: "梁王告急、景帝下诏催救，你奉诏救梁中伏大败，七国之乱绵延数年",
				classical: "梁日使使请太尉，太尉守便宜，不肯往。梁上书言景帝，景帝使使诏救梁。太尉不奉诏，坚壁不出。",
				analysis:
					"你坚持『以梁委吴、坚壁绝粮道』的庙算——可皇上亲自下诏、梁王日日告急，你若违诏去救，正中吴王围城打援之计，主力被歼、吴楚精锐长驱西进，七国之乱便不是三月可平的了。史上的周亚夫『不奉诏』二字极险——他赌的是打赢了一切都好说。这一赌，他赢了。",
			},
			yingdui_buzhi: {
				reason: "廷尉责问谋反不堪吏辱，认罪反坐实罪名，全族株连",
				classical: "廷尉责曰：君侯欲反邪？亚夫曰：臣所买器，乃葬器也，何谓反邪？吏曰：君侯纵不反地上，即欲反地下耳。",
				analysis:
					"这是周亚夫之死最悲怆的一笔——买了五百副甲盾作葬器，被诬告谋反。你若应对失据、或在狱中不堪吏辱而认罪，那便是真的反贼了，条侯国除、子孙连坐。史上的周亚夫『不食五日，呕血而死』——他到死都没认这个罪。将才之刚，正在不低头。可刚则易折，一代名将就这么把自己饿死在狱中。",
			},
		},
		endings: {
			canon: {
				title: "刚则易折",
				kind: "canon",
				epigraph: "足己而不学，守节不逊，终以穷困——他到死不肯认罪，用绝食守住了最后的尊严。",
			},
			if_shanzhong: {
				title: "多智少刚",
				kind: "if",
				epigraph: "他少顶了几句嘴，得以善终——可那个『介胄之士不拜』的周亚夫，好像少了点什么。",
			},
			if_meishang: {
				title: "咽下谏言",
				kind: "if",
				epigraph: "他学会了看天子的脸色——保住了满门，弄丢了那个让文帝叹一声『真将军』的自己。",
			},
			if_maiyu: {
				title: "安知狱吏",
				kind: "if",
				epigraph: "他终于活成了父亲那句『安知狱吏之贵』——用一世的刚，换了一个白头的平安。",
			},
		},
	},
	// ═══ 番外 · 上帝视角 ═══
	"extra:lvhou-gongren": {
		key: "extra:lvhou-gongren",
		title: "上帝视角 · 永巷的宫人",
		source: extraLvhouGongrenSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "永巷舂米歌的泪", kind: "canon", epigraph: "女主称制的狠辣底下，是永巷里那些连名字都留不下的宫人——人彘的血，溅了她们一辈子的衣裳。" },
		},
	},
	"extra:hanwen-daichen": {
		key: "extra:hanwen-daichen",
		title: "上帝视角 · 代国的旧臣",
		source: extraHanwenDaichenSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "从代地到长安的那一路", kind: "canon", epigraph: "从边地王爷到大汉天子，那一路的谨慎与不安，是代地老臣们陪着一步步踩实的。" },
		},
	},
	"extra:zhoubo-beijun": {
		key: "extra:zhoubo-beijun",
		title: "上帝视角 · 北军的校尉",
		source: extraZhouboBeijunSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "左袒的那一声万岁", kind: "canon", epigraph: "诸吕掌了军权八年，却没掌住人心——北军校尉的一声左袒，替刘氏把江山接了回来。" },
		},
	},
	"extra:zhouyafu-xiliu": {
		key: "extra:zhouyafu-xiliu",
		title: "上帝视角 · 细柳营的军门都尉",
		source: extraZhouyafuXiliuSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "军门都尉挡的那一下圣驾", kind: "canon", epigraph: "军中闻将军令，不闻天子之诏——不是周亚夫的狂，是军门都尉那一下，把军威两个字立住了。" },
		},
	},
	"extra:chaocuo-donggong": {
		key: "extra:chaocuo-donggong",
		title: "上帝视角 · 东宫的舍人",
		source: extraChaocuoDonggongSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "朝衣东市的那一刀", kind: "canon", epigraph: "七国反，清君侧——削藩的策，是晁错的命填出来的；东市的那道血痕，学生们记了一辈子。" },
		},
	},
};
