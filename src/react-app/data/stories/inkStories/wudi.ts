// inkStories — Registry of ink-backed stories.
// Each entry is an InkStoryConfig that ShijiInkAdapter consumes.
// Ink source files are imported as raw text via Vite's ?raw suffix.

import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";

// Static import of .ink source files (Vite ?raw returns the file content as string)
import shunLijieSource from "../ink/shun-lijie.ink?raw";
import huangdiQiyuanSource from "../ink/huangdi-qiyuan.ink?raw";
import huangdiBanquanSource from "../ink/huangdi-banquan.ink?raw";
import huangdiZhuoluSource from "../ink/huangdi-zhuolu.ink?raw";
import huangdiZhitianxiaSource from "../ink/huangdi-zhitianxia.ink?raw";
import zhuanxuDikuSource from "../ink/zhuanxu-diku.ink?raw";
import yaoShoushiSource from "../ink/yao-shoushi.ink?raw";
import yaoQiuxianSource from "../ink/yao-qiuxian.ink?raw";
import yaoJuxianSource from "../ink/yao-juxian.ink?raw";
import yaoShanrangSource from "../ink/yao-shanrang.ink?raw";
import shunLiuxiongSource from "../ink/shun-liuxiong.ink?raw";
import shunXingfaSource from "../ink/shun-xingfa.ink?raw";
import shunJiuguanSource from "../ink/shun-jiuguan.ink?raw";
import shunChanyuSource from "../ink/shun-chanyu.ink?raw";
import yuZhishuiSource from "../ink/yu-zhishui.ink?raw";
import yuShouchanSource from "../ink/yu-shouchan.ink?raw";
import qiGanzhizhanSource from "../ink/qi-ganzhizhan.ink?raw";
import jieWangguoSource from "../ink/jie-wangguo.ink?raw";

/**
 * Ink story registry.
 * Key convention: "<storyKey>:<chapter>" for individual chapters,
 * or just "<storyKey>" for full stories.
 */
// 系列 wudi · 上古：五帝与夏。死亡文案单一数据源。
export const wudiInkStories: Record<string, InkStoryConfig> = {
	"shun:lijie": {
		key: "shun:lijie",
		title: "虞舜 · 焚廪穿井",
		source: shunLijieSource,
		precompiled: false,
		deaths: {
			burn: {
				reason: "空手登上仓顶，被烈火吞没",
				classical: "瞽叟从下纵火焚廪。舜乃以两笠自扞而下，去，得不死。",
				analysis:
					"史上的舜早察杀机，执两笠如翼跃下逃生。明知父欲杀己仍赴命，是孝；预作两笠而活，是智。缺一，圣人便葬身火海。",
			},
			bury: {
				reason: "直下深井，被活埋于井底",
				classical: "舜穿井为匿空旁出……瞽叟与象共下土实井，舜从匿空出，去。",
				analysis:
					"舜下井前先凿暗道旁出，把活路留在死地之前。顺父命而不送命——真正的孝，从不是任人宰割。",
			},
			vengeance: {
				reason: "以怨报怨，失了为子之道",
				classical: "舜复事瞽叟爱弟弥谨。于是尧乃试舜五典百官，皆治。",
				analysis:
					"史上的舜历劫不改其孝，『爱弟弥谨』，才终得尧托付天下。若此刻清算解气，舜便只是个受害者，而非以德化人的圣人——天下也不会交到他手里。",
			},
		},
		endings: {
			canon: {
				title: "孝感天下",
				kind: "canon",
				epigraph: "天下明德，皆自虞帝始。",
			},
			if_gaoyao: {
				title: "诉之帝庭",
				kind: "if",
				epigraph: "他得了公道，安稳终老——史书上那个圣人，换成了别人的名字。",
			},
			if_yuanzou: {
				title: "远走妫南",
				kind: "if",
				epigraph: "他活得干净安稳——只是天下，与他再无关系。",
			},
		},
	},
	"huangdi:qiyuan": {
		key: "huangdi:qiyuan",
		title: "起源 · 穿越轩辕",
		source: huangdiQiyuanSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: {
				title: "穿越之始",
				kind: "canon",
				epigraph: "你落进史册的第一页，成了那个叫轩辕的婴孩——故事，从这里开始。",
			},
		},
	},
	"huangdi:banquan": {
		key: "huangdi:banquan",
		title: "黄帝 · 阪泉之战",
		source: huangdiBanquanSource,
		precompiled: false,
		deaths: {
			conquer: {
				reason: "恃力强征、暴虐百姓，众叛身危",
				classical: "轩辕之时，神农氏世衰。诸侯相侵伐，暴虐百姓，而神农氏弗能征。于是轩辕乃修德振兵，抚万民，诸侯咸来宾从。",
				analysis:
					"史上的轩辕先修德、艺五种、抚万民，而后才用兵，故『诸侯咸来宾从』。若只凭勇力强征掳掠，你便成了又一个『暴虐百姓』的乱世诸侯——与你要取代的神农之衰再无两样，人心一散，身死名裂。德是根本，兵才是辅佐呀。",
			},
			rash: {
				reason: "轻兵冒进，大败于炎帝",
				classical: "以与炎帝战于阪泉之野。三战，然后得其志。",
				analysis:
					"阪泉从来不是一战之功，而是『三战』之持重。炎帝营垒森严、粮草充足，岂能一鼓而下？史上的黄帝反复较量、稳扎稳打，磨到第三仗才服他。你贪那一战之速，轻兵深入，反被同族所乘——阪泉便成了你的葬身之野。",
			},
		},
		endings: {
			canon: {
				title: "修德振兵",
				kind: "canon",
				epigraph: "先修德、后振兵，三战不贪功——天下是一寸一寸挣来的。",
			},
			if_erfen: {
				title: "让炎二分",
				kind: "if",
				epigraph: "你活得干净，天下却少了一个源头——没有共主，也就没有『黄帝』。",
			},
			if_zhuyan: {
				title: "以杀合天下",
				kind: "if",
				epigraph: "以杀合来的天下，握得越紧，凉得越快。",
			},
		},
	},
	"huangdi:zhuolu": {
		key: "huangdi:zhuolu",
		title: "黄帝 · 涿鹿擒蚩尤",
		source: huangdiZhuoluSource,
		precompiled: false,
		deaths: {
			lone: {
				reason: "不征诸侯，孤军东进，被蚩尤合围于涿鹿之野，力尽而亡",
				classical: "而蚩尤最为暴，莫能伐。于是黄帝乃征师诸侯，与蚩尤战于涿鹿之野。",
				analysis:
					"史书先写『莫能伐』，再写『征师诸侯』——太史公早点破了：蚩尤是天下最凶的兽，一部之力围不住他。黄帝之胜从不在自己多能打，而在肯按住性子、把诸侯的力气合到一处。孤军逞锐，正撞在『莫能伐』三个字上。",
			},
			fog: {
				reason: "大雾中不合诸侯、各自催军，诸侯之师散乱脱节被各个击破",
				classical: "于是黄帝乃征师诸侯，与蚩尤战于涿鹿之野，遂禽杀蚩尤。",
				analysis:
					"指南车、大雾都是后世传奇，『传说如此』；可雾里失向、军心自散的险是真的。黄帝这一战的根本，是『征师诸侯』——合而不散。雾中妄动、各追各的，等于亲手把合来的诸侯之师拆散，孤军之败便在迷途里重演了一次。",
			},
			spare: {
				reason: "擒得蚩尤却心软赦之，乱首复叛、人心离散，终未能立共主之统",
				classical: "蚩尤作乱，不用帝命。遂禽杀蚩尤。而诸侯咸尊轩辕为天子，代神农氏，是为黄帝。",
				analysis:
					"史书的结局硬邦邦四个字：『遂禽杀蚩尤』。蚩尤本是『作乱、不用帝命』之人，赦他，便是帝命不立；征师而来的诸侯要的正是一个立得住的共主。恻隐一动，共主之名就担不起来了——这不是黄帝狠，是天下需要一个说话算数的人。",
			},
		},
		endings: {
			canon: {
				title: "征师禽尤",
				kind: "canon",
				epigraph: "不是一个人多能打，是把天下的力气合到了一处。",
			},
			if_zhaofu: {
				title: "招抚不成",
				kind: "if",
				epigraph: "仁厚用错了地方，比暴虐更误天下——天下记住的，是一个坐失天时的轩辕。",
			},
			if_tuli: {
				title: "屠尽九黎",
				kind: "if",
				epigraph: "你能『定乱』，也会『杀绝』——九黎绝了后，你的德也绝了根。",
			},
		},
	},
	"huangdi:zhitianxia": {
		key: "huangdi:zhitianxia",
		title: "黄帝 · 垂衣治天下",
		source: huangdiZhitianxiaSource,
		precompiled: false,
		deaths: {
			indulge: {
				reason: "骄纵失德，安居深宫坐受朝贡，德不及远，众叛离心",
				classical: "东至于海，登丸山，及岱宗。西至于空桐，登鸡头。南至于江，登熊、湘。北逐荤粥，合符釜山，而邑于涿鹿之阿。",
				analysis:
					"史上的黄帝从不深居——他东登泰山、西上空桐、南临江湘、北逐荤粥，足迹遍四方，才让万国心服而来合符。刀兵能定天下，却守不住人心；德要走出去让人看见，坐等人拜的天子，德就凉了呀。",
			},
			defy: {
				reason: "恃威逆天时，罢农兴役、大营土木，百谷不登致乱",
				classical: "顺天地之纪，幽明之占，死生之说，存亡之难。时播百谷草木。有土德之瑞，故号黄帝。",
				analysis:
					"史上的黄帝『顺天地之纪』『时播百谷』，敬天时如敬神明。他能诛蚩尤、逐荤粥，靠的是兵；能垂衣治天下，靠的是顺天。逆天时而兴大役，再强的刀兵也换不来一岁的收成——以土德受命者，最不能与天为敌。",
			},
		},
		endings: {
			canon: {
				title: "垂衣巡方",
				kind: "canon",
				epigraph: "坐等人拜的天子，德就凉了——德要走出去，让人看见。",
			},
			if_dingdu: {
				title: "安居守成",
				kind: "if",
				epigraph: "你少走的那些路，就是史书上少掉的那些疆土。",
			},
			if_lichu: {
				title: "预行家天下",
				kind: "if",
				epigraph: "你护住了一姓，误了一段本该更长的圣王之世——传贤的血脉，从你这里断了苗头。",
			},
		},
	},
	"zhuanxu:diku": {
		key: "zhuanxu:diku",
		title: "颛顼帝喾 · 承天执中",
		source: zhuanxuDikuSource,
		precompiled: false,
		deaths: {
			zaojin: {
				reason: "新君躁进失静，仓促发兵四方，号令自乱、政先崩坏",
				classical: "静渊以有谋，疏通而知事。北至于幽陵，南至于交阯，西至于流沙，东至于蟠木，动静之物，大小之神，日月所照，莫不砥属。",
				analysis:
					"史上的高阳『静渊有谋』，谋定而后动，不靠一兵一卒便让四方莫不砥属。你血一上头就出兵，恰恰丢了那个『静』字——天下未定，先乱在自己手里。他能镇住的，从来不是刀，是沉得住气的心呀。",
			},
			shimin: {
				reason: "帝喾恃天下之财广取厚用、奉己一身，失了执中而失民",
				classical: "取地之财而节用之，抚教万民而利诲之。帝喾溉执中而遍天下，日月所照，风雨所至，莫不从服。",
				analysis:
					"史上的高辛聪明冠世，却把聪明收进『节用』『执中』里——取地之财而节之，抚教万民而利之。你竭泽厚敛，图一身之尊，地力民力终有尽时。一个『中』字压不住贪欲，日月风雨所至便无人从服了。",
			},
		},
		endings: {
			canon: {
				title: "承天执中",
				kind: "canon",
				epigraph: "谋定而后动，静渊有谋——天下正一步步走向那场最有名的禅让。",
			},
			if_juetong: {
				title: "绝地天通",
				kind: "if",
				epigraph: "你治得了秩序，治不了人心里那点想向天说话的念想——绝了地天之通，也绝了君民之间那点温度。",
			},
			if_baozhi: {
				title: "以私定制",
				kind: "if",
				epigraph: "执中之德传了两代，断在了你这一念的私心上。",
			},
		},
	},
	"yao:shoushi": {
		key: "yao:shoushi",
		title: "尧 · 敬授民时",
		source: yaoShoushiSource,
		precompiled: false,
		deaths: {
			arrogance: {
				reason: "富贵而骄纵自纵，失德致九族怨、百姓离、万国不朝",
				classical: "其仁如天，其知如神。就之如日，望之如云。富而不骄，贵而不舒。",
				analysis:
					"史书里的尧啊，越是坐拥天下，越是不敢骄、不敢松。『富而不骄，贵而不舒』——这八个字才是他能『仁如天』的根。你一松劲儿，那个太阳般的尧，就暗下去啦。",
			},
			luanli: {
				reason: "弃观象授时，凭圣心臆定死历，寒暑错位、播种失期，连岁大饥",
				classical: "乃命羲、和，敬顺昊天，数法日月星辰，敬授民时。",
				analysis:
					"呐，『时』不是圣人拍脑袋给的呀。尧是抬头去问天——顺昊天、法日月星辰，才敢把农时授给万民。你一凭臆断，天下人就跟着你的错历，一起饿肚子咯。",
			},
			fangwei: {
				reason: "把定春分的羲仲错遣去极北幽都，方位一错、四时全乱",
				classical: "分命羲仲，居郁夷，曰旸谷。敬道日出，日中，星鸟，以殷中春。",
				analysis:
					"东方旸谷迎日出，那才是定春分的地方呀。幽都是日短星昴、定仲冬的极北。方位差一步，春夏秋冬就全拧了——授时最怕的，就是这半分的错。",
			},
			wurun: {
				reason: "舍去岁差零头、以三百六十日为整年，历与天行脱节、节气错位复饥",
				classical: "岁三百六十六日，以闰月正四时。",
				analysis:
					"唔——你舍掉的那点零头，可要命呢。年年积欠，几年下来冬至就滑进了春天。尧用闰月把它一年年补齐，四时才不会错开。差之毫厘，谬以千里呀。",
			},
		},
		endings: {
			canon: {
				title: "敬授民时",
				kind: "canon",
				epigraph: "抬头去问天，才敢把农时授给万民——差之毫厘，谬以千里。",
			},
			if_wuhou: {
				title: "恤农无历",
				kind: "if",
				epigraph: "你的仁够暖一时；缺的那点『法天』，才是能传世的东西。",
			},
			if_mili: {
				title: "以时立威",
				kind: "if",
				epigraph: "授时是为了让人不必求你，你却让人从此离不开你——这份威，正是仁的反面。",
			},
		},
	},
	"yao:qiuxian": {
		key: "yao:qiuxian",
		title: "尧 · 咨岳求贤",
		source: yaoQiuxianSource,
		precompiled: false,
		deaths: {
			danzhu: {
				reason: "徇私传位顽凶之子丹朱，天下不服",
				classical: "尧知子丹朱之不肖，不足授天下。终不以天下之病而利一人。",
				analysis:
					"你到底没舍得那点骨肉。可尧比谁都清楚——天下不是一家的私产。他一声『吁！顽凶』叹得出，才配把江山交给对的人。私爱一动，圣君就成了寻常的父亲，天下也就散了呀。",
			},
			gonggong: {
				reason: "被共工巧言打动委以政事，似恭漫天、政僻败坏",
				classical: "共工善言，其用僻，似恭漫天，不可。讙兜进言共工，尧曰不可而试之工师，共工果淫辟。",
				analysis:
					"话说得越漂亮，你越该多留个心眼。史上的尧一眼看穿他『似恭漫天』——恭敬是装的，傲慢是真的。你被那张嘴骗过去，朝纲就一寸寸烂给你看喽。",
			},
			gun: {
				reason: "一味倚重鲧堙水九年，堤溃洪流滔天为患",
				classical: "尧于是听岳用鲧。九岁，功用不成。汤汤洪水滔天，浩浩怀山襄陵，下民其忧。",
				analysis:
					"用鲧没有错，错在一路信到黑。堙水是拿土去堵天，堵得越高、溃得越凶。真尧试了九年、认了败，转身另寻贤者；你却赌着一口气不肯回头，水就把整个天下都吞了呀。",
			},
		},
		endings: {
			canon: {
				title: "咨岳求贤",
				kind: "canon",
				epigraph: "真正的圣君不是从不选错，而是选错了还肯睁开眼，接着往下找。",
			},
			if_fangdanzhu: {
				title: "存丹朱一念",
				kind: "if",
				epigraph: "你成全了一个父亲，也守住了天下——只是那份锋利，多了一道犹疑的软痕。",
			},
			if_gaifa: {
				title: "识法失人",
				kind: "if",
				epigraph: "治水从不只是法子的事，是那个肯把命填进去的人——你省了一场大败，也误了一场大治。",
			},
		},
	},
	"yao:juxian": {
		key: "yao:juxian",
		title: "尧 · 举舜试女",
		source: yaoJuxianSource,
		precompiled: false,
		deaths: {
			qishi: {
				reason: "因舜家父顽母嚚弟傲的恶名而弃贤，终以天下权授不肖的丹朱",
				classical: "悉举贵戚及疏远隐匿者。众皆言于尧曰：有矜在民间，曰虞舜。尧曰：吾其试哉。",
				analysis:
					"史上的尧，偏偏不看出身。四岳只报了一句『能和以孝，烝烝治』，他就说『吾其试哉』。若因一门恶名弃了舜，天下便落进丹朱手里——尧一生『择贤而授』的心气，就断在这儿了呀。",
			},
			qingxin: {
				reason: "只凭听说的贤名便骤然重用，未经层层察验即托天下，所托非人则误国",
				classical: "尧乃以二女妻舜以观其内，使九男与处以观其外。尧使舜入山林川泽，暴风雷雨，舜行不迷。尧以为圣。",
				analysis:
					"你急了。可你看史上的尧多沉得住气——妻二女、处九男、和五典、入百官、宾四门，连暴风雷雨都要试他走不走得直。托天下这么大的事，他一分都不肯凭『听说』。轻信，和弃贤一样，都到不了那个『尧以为圣』呀。",
			},
		},
		endings: {
			canon: {
				title: "择贤而授",
				kind: "canon",
				epigraph: "禅让从不是一时兴起的慷慨，是一个老人用尽一生的审慎，替天下挑一个配得上的人。",
			},
			if_shoutang: {
				title: "以政绩举贤",
				kind: "if",
				epigraph: "以政绩举贤，后世学得会；以齐家察德，成了尧一个人的绝唱。",
			},
			if_fuzuo: {
				title: "命舜辅丹朱",
				kind: "if",
				epigraph: "你把最好的人，绑在了最扶不动的位子上——天下为公的尧，在你这里悄悄退了半步。",
			},
		},
	},
	"yao:shanrang": {
		key: "yao:shanrang",
		title: "尧舜禅让",
		source: yaoShanrangSource,
		precompiled: false,
		deaths: {
			rush: {
				reason: "未加考较，凭传闻径授天下，名不副实、群臣不服",
				classical: "尧知子丹朱之不肖，不足授天下，于是乃权授舜。",
				analysis:
					"欸……你太急啦。史上的尧从不凭一句名声就交出天下——他让舜摄行天子之政、独入大麓，试了又试，才敢把这天下托出去。托付江山，从来不是一道诏令的事呀。",
			},
			private: {
				reason: "徇私传子丹朱，天下病而丹朱一人利，四海失望、太平崩坏",
				classical: "授丹朱则天下病而丹朱得其利。尧曰：终不以天下之病而利一人。",
				analysis:
					"……我懂的，他是你亲生的骨血，哪个父亲舍得？可史上的尧偏偏舍得。他说『终不以天下之病而利一人』——宁负一子，不负天下。这一舍，他才成了那个开天下为公的圣王呀。",
			},
			waver: {
				reason: "父子两难、迟疑不决，天子位久悬，人心散、政令乱",
				classical: "令舜摄行天子之政，荐之于天。尧辟位凡二十八年而崩。",
				analysis:
					"唔……犹疑，是最伤天命人心的。位子一日不定，人心就一日惶惶。史上的尧早早令舜摄政、举之于天，二十八年才安然而崩——托付天下要的不只是德，还有那一下决断呐。",
			},
		},
		endings: {
			canon: {
				title: "传贤不传子",
				kind: "canon",
				epigraph: "终不以天下之病而利一人——从你开始，天下第一次成了天下人的天下。",
			},
			if_bingfeng: {
				title: "厚封丹朱",
				kind: "if",
				epigraph: "你两全了父子，却没能两全天下——禅让这杆秤，被你悄悄压偏了一分。",
			},
			if_siqing: {
				title: "私盼骨血",
				kind: "if",
				epigraph: "你动过那个念，也没让它做数——正因它没被应许，你才成全了『终不以天下之病而利一人』。",
			},
		},
	},
	"shun:liuxiong": {
		key: "shun:liuxiong",
		title: "舜 · 流放四凶",
		source: shunLiuxiongSource,
		precompiled: false,
		deaths: {
			solo: {
				reason: "不举贤才、事事亲裁，独木难支终致天下不治",
				classical: "举八恺，使主后土，以揆百事，莫不时序。举八元，使布五教于四方，内平外成。",
				analysis:
					"史上的舜第一件事就是擢用八元八恺、以贤才为股肱。天下之大岂能一人独治？不肯托事于人，纵有摄政之名，也只会累死在案牍间——治世靠的是让对的人各归其位，不是把权柄攥死在自己手里呀。",
			},
			appease: {
				reason: "姑息四凶、养奸致朝纲大乱、天下不服",
				classical: "请流共工于幽陵，殛鲧于羽山，以变东夷：四辠而天下咸服。",
				analysis:
					"恶不除，善难立。史上的舜以雷霆手段窜逐四凶，才换来『天下咸服』。你若心软留着他们，四凶只会得寸进尺、倾轧贤良——姑息从来不是仁慈，是把祸根喂大了呀。",
			},
			slaughter: {
				reason: "尽诛四凶、滥杀牵连、失德失民",
				classical: "乃流四凶族，迁于四裔，以御螭魅，于是四门辟，言毋凶人也。",
				analysis:
					"史上的舜是『流』四凶、迁于四裔御螭魅，不是一杀了之。罚要当其罪，多一分就成了滥杀。你以除恶始、却以失德终，民心一散，『咸服』二字就再与你无缘了——摄政的分寸，差一步都不行呐。",
			},
		},
		endings: {
			canon: {
				title: "四罪咸服",
				kind: "canon",
				epigraph: "善恶各得其分——天下服的不是刀，是那杆不偏的秤。",
			},
			if_zhengmiao: {
				title: "干戈南征",
				kind: "if",
				epigraph: "兵服得了身，服不了心——用刀立起来的『服』，就得一直握着刀。",
			},
			if_yougun: {
				title: "羽山留命",
				kind: "if",
				epigraph: "少杀一人容易——难的是天下从此称量你每一次落罚，都拿这一次做秤。",
			},
		},
	},
	"shun:xingfa": {
		key: "shun:xingfa",
		title: "舜 · 皋陶作刑",
		source: shunXingfaSource,
		precompiled: false,
		deaths: {
			tyranny: {
				reason: "一味严刑峻法、以杀立威，民怨沸腾而失德",
				classical: "象以典刑，流宥五刑。眚灾过赦；怙终贼刑。钦哉，钦哉，惟刑之静哉！",
				analysis:
					"史上的舜『象以典刑』——画象示刑以耻之，以刑弼教而非以杀立威；又『流宥五刑』，以流放宽宥肉刑。他把刑当作最不得已的手段。若一味以杀立威、血流成河，畏则畏矣，德却荡然，人心必离——那便不是那个以德化天下的舜了。",
			},
			anarchy: {
				reason: "无法无度、姑息宽纵，奸宄横行而天下不治",
				classical: "眚灾过赦；怙终贼刑。皋陶为大理，平，民各伏得其实。",
				analysis:
					"史上舜之慎刑，是『眚灾过赦』（过失之灾则赦）与『怙终贼刑』（怙恶不悛则严惩）并立——宽在无心之失，严在明知故犯。慎刑非无刑。若不辨眚灾与怙终、一味宽纵，则惯盗益猖、良善受害，姑息养奸，天下大乱而不可治。宽仁一旦失了分寸，便是纵恶。",
			},
		},
		endings: {
			canon: {
				title: "钦哉慎刑",
				kind: "canon",
				epigraph: "他把哀矜刻进了华夏的律法——真正的法度，是让人不必怕。",
			},
			if_shuxing: {
				title: "金赎天下",
				kind: "if",
				epigraph: "府库肥了，公道瘦了——从此王法有价，称罪的秤称的是铜。",
			},
			if_qinduan: {
				title: "天子亲狱",
				kind: "if",
				epigraph: "他断得了天下每一案，却没留下一杆他死后仍立着的秤。",
			},
			if_gaozhen: {
				title: "刑成失钦",
				kind: "if",
				epigraph: "法都立齐了，只少了四个字——少了『钦哉』的法，只剩森森的牙。",
			},
		},
	},
	"shun:jiuguan": {
		key: "shun:jiuguan",
		title: "舜 · 命九官组阁",
		source: shunJiuguanSource,
		precompiled: false,
		deaths: {
			biseng: {
				reason: "闭四门、独断立威，未先明通四方耳目即失庙堂之心",
				classical: "辟四门，明通四方耳目，命十二牧论帝德，则蛮夷率服。",
				analysis:
					"舜继位第一事不是发号施令，而是辟四门、广开言路。跳过这一步，佞人进而贤者退，天下先离了心——庙堂的根，是先听得见四方的声音呀。",
			},
			renfei: {
				reason: "仍用治水失败的鲧，所任非人，庶事隳坏",
				classical: "皆曰伯禹为司空，可美帝功。",
				analysis:
					"众人举禹为司空，舜不以父罪弃子、量才而授。若念旧资历复用治水九年不成的鲧，洪水滔天，第一人便用错——用人看的是能不能成事，不是坐得久不久。",
			},
			weiqin: {
				reason: "用人唯亲，垂、益、伯夷之才退而不用",
				classical: "以垂为共工，以益为朕虞，以伯夷为秩宗。",
				analysis:
					"舜之为舜正在『量才授职、各得其人』。论亲疏不论才具，百工不致功、山泽不辟、上下不让，等于亲手拆了朝堂。贤者一旦寒心，庶绩就荒了。",
			},
			wukao: {
				reason: "有官无考、赏罚不明，贤者退而功不成",
				classical: "三岁一考功，三考绌陟，远近众功咸兴。",
				analysis:
					"授官只是开始，考课才是它活下去的筋骨。无考则勤惰同酬、贤者心灰、庸者尸位，纵有满朝英才，庶绩也终究荒废。",
			},
		},
		endings: {
			canon: {
				title: "庶绩咸熙",
				kind: "canon",
				epigraph: "量才授职，三考黜陟——天下明德，皆自虞帝始。",
			},
			if_biyu: {
				title: "避嫌失禹",
				kind: "if",
				epigraph: "他避开了一句闲话，天下多泡了十年的水。",
			},
			if_kuke: {
				title: "一岁一考",
				kind: "if",
				epigraph: "秤太急，称不出十三年的功——最先被称走的，是那个治水的人。",
			},
		},
	},
	"shun:chanyu": {
		key: "shun:chanyu",
		title: "舜禅于禹 · 二妃泣竹",
		source: shunChanyuSource,
		precompiled: false,
		deaths: {
			passson: {
				reason: "传位不肖之子商均，天下不服、太平散尽",
				classical: "舜子商均亦不肖，舜乃豫荐禹于天。",
				analysis:
					"尧不传丹朱、舜不传商均——传子之私与天下之公只能择一。史上的舜效尧禅贤，方成太平。你若把天下当作自家私产传给不肖之子，禅让之统就断在你手里了呀。",
			},
			cling: {
				reason: "恋栈不禅、不尽巡狩，名分两出、晚节难全",
				classical: "舜年老，荐禹于天，十七年而崩。",
				analysis:
					"舜以『把天下看得比自己重』立圣名。功成而不身退、恋栈那把椅子，天命人心便一点点离去——晚节，最难；肯放手的那一刻，才真正成全了他一生。",
			},
		},
		endings: {
			canon: {
				title: "苍梧斑竹",
				kind: "canon",
				epigraph: "他把最后一口气还给了天下——湘水边两竿斑竹，是天地替他留的眼泪。",
			},
			if_guitian: {
				title: "归耕历山",
				kind: "if",
				epigraph: "他终于团圆善终——南方的风里，从此少了一位走来的圣人。",
			},
			if_xiesui: {
				title: "偕行苍梧",
				kind: "if",
				epigraph: "没有永诀，也没有传说——只有两个人，把余生守成了九疑山下的青山。",
			},
		},
	},
	"yu:zhishui": {
		key: "yu:zhishui",
		title: "大禹治水",
		source: yuZhishuiSource,
		precompiled: false,
		deaths: {
			tang: {
				reason: "重蹈父鲧以土堙堵之覆辙，堤溃洪水复滔天而受诛",
				classical: "九年而水不息，功用不成。鲧乃殛死于羽山。",
				analysis:
					"史上的禹『随山浚川』，改堵为疏、顺水之性导之入海；一味加高堤堰去堵水，正是父鲧九年而败之由。你重走那条老路，堤越高、溃越猛——洪水吞没的，是你父亲已经用命买过的教训。",
			},
			banben: {
				reason: "恋家惜身、半途而废，功亏一篑而水患不平",
				classical: "禹伤先人父鲧功之不成受诛，乃劳身焦思，居外十三年，过家门不敢入。",
				analysis:
					"史上的禹三过家门而不敢入，辛壬癸甲、生启而不子——一个『不敢』撑住了十三年之功。你松一次、回一次头，堤上的活计就荒一分，前功尽弃。治水从不是力气的事，是十三年不肯松手的那口气。",
			},
		},
		endings: {
			canon: {
				title: "三过不入",
				kind: "canon",
				epigraph: "改堵为疏是智，三过不入是仁——少一样，滔天的水都到不了尽头。",
			},
			if_rangxian: {
				title: "坚辞让贤",
				kind: "if",
				epigraph: "那个『随山浚川』的法子只在你心里，你不去，它就永远只是个念头——洪水没等来它的禹。",
			},
			if_yangshen: {
				title: "养身缓治",
				kind: "if",
				epigraph: "你留了些给自己，天下就多等了几年——这份自苦，别人学不来，才叫大禹。",
			},
		},
	},
	"yu:shouchan": {
		key: "yu:shouchan",
		title: "禹会涂山 · 受禅即位",
		source: yuShouchanSource,
		precompiled: false,
		deaths: {
			disdain: {
				reason: "轻推皋陶之谋，不肯知人安民，庶政隳坏",
				classical: "在知人，在安民。知人则智，能官人；能安民则惠，黎民怀之。",
				analysis:
					"皋陶之谋核心在『知人』『安民』两端，史上的禹拜受此昌言而躬行之。若视之为高谈而推还，便失了为政之本——治水靠力，治人靠心，缺此则夏后之业坏在根上。",
			},
			xingming: {
				reason: "舍德专刑，贤才不立、人心离散",
				classical: "宽而栗，柔而立，愿而恭，乱而敬，扰而毅，直而温，简而廉，刚而塞，彊而义。",
				analysis:
					"皋陶本执刑之官，却先讲九德。刑能止恶不能生善，能服身不能服心。史上的禹答『女言致可绩行』，正因懂得德刑相济。舍德专刑，则贤才不立、百官避祸，天下口服而心离。",
			},
			lianwei: {
				reason: "恋位不避商均，以私废公，失天下人心之归",
				classical: "禹辞辟舜之子商均于阳城。天下诸侯皆去商均而朝禹。",
				analysis:
					"禅让之礼，贵在『推让而后受』——舜避丹朱，禹避商均。天下归禹不归商均，是人心自择、天命所归。若不让而取，便与篡无异；纵得其位，也坐不进人心里。",
			},
		},
		endings: {
			canon: {
				title: "南面朝天下",
				kind: "canon",
				epigraph: "上古的天下是让出来的——从拜受昌言的臣子，到南面而朝的天子，靠的是知人、安民、那一次次的『让』。",
			},
			if_zhengong: {
				title: "重功轻德",
				kind: "if",
				epigraph: "你治得了水土田亩，就是没顺着那八个字去治人心——后世的夏重功轻德，你开的这个头。",
			},
			if_zhenrang: {
				title: "一让到底",
				kind: "if",
				epigraph: "你守住了自己的高洁，天下却没能等来那个本该做天子的禹——夏，也许就不会有了。",
			},
		},
	},
	"qi:ganzhizhan": {
		key: "qi:ganzhizhan",
		title: "启 · 家天下与甘之战",
		source: qiGanzhizhanSource,
		precompiled: false,
		deaths: {
			jiao: {
				reason: "恃『禹之子』骄纵抢位，德未孚而无以服众",
				classical: "禹子启贤，天下属意焉。诸侯皆去益而朝启，曰『吾君帝禹之子也』。",
				analysis:
					"史上的启，是诸侯先『去益而朝启』，他才即位——位是天下人抬上去的，不是自己抢来的。世袭之初名分最脆，若恃血脉而骄纵、德不配位，第一个『家天下』之君便无一人真心来朝。",
			},
			kui: {
				reason: "临战不申军法、赏罚不明，三军无纪而溃于有扈",
				classical: "用命，赏于祖；不用命，僇于社，予则帑僇女。遂灭有扈氏。",
				analysis:
					"史上的启战前作《甘誓》，先明天命、再申职守、终定赏罚——赏于祖、罚于社，托祖社之名而令行。只赏不罚或不立誓，三军便无以死战；名不正、法不立，家天下就夭折于甘之野了。",
			},
		},
		endings: {
			canon: {
				title: "家天下立",
				kind: "canon",
				epigraph: "他要的从来不只是一个位子，是让『家天下』这三个字立得住、传得下去。",
			},
			if_fuxian: {
				title: "扶益续禅",
				kind: "if",
				epigraph: "你让得干净，天下却没跟着你让——人心已经偏了，规矩拦不住它。",
			},
			if_huairou: {
				title: "讲和有扈",
				kind: "if",
				epigraph: "你换来了太平，却没换来那个『咸朝』的定局——家天下的第一步软软地落了地。",
			},
		},
	},
	"jie:wangguo": {
		key: "jie:wangguo",
		title: "夏桀亡国",
		source: jieWangguoSource,
		precompiled: false,
		deaths: {
			shatang: {
				reason: "夜遣人弑汤于夏台，招致天下共讨，未至鸣条即身死国灭",
				classical: "乃召汤而囚之夏台，已而释之。",
				analysis:
					"史上的桀囚汤而复释，尚予商汤修德归诸侯之机；若此刻痛下杀手、弑一仁德诸侯，天下归商之心更炽——反而败得比史书更早、更耻。桀之亡在失德，非在『没杀成汤』，可他至死没懂。",
			},
			juezhan: {
				reason: "斩尽忠谏、纵酒高台，城破时众叛亲离，死于自造之台下",
				classical: "桀不务德而武伤百姓，百姓弗堪。",
				analysis:
					"史上的桀虽失德，尚走到鸣条、放于南巢，留下一声悔叹；若既不务德又斩尽忠言、负隅到底，则连溃逃与悔悟的余地都没有。伤民者终为民所弃——这是夏亡最冷的注脚。",
			},
		},
		endings: {
			canon: {
				title: "鸣条亡国",
				kind: "canon",
				epigraph: "他到死悔的都是『没杀成汤』——亡国从来不是天命，是一次次本可以不那样的选择垒成的。",
			},
			if_rangxian: {
				title: "让贤存祀",
				kind: "if",
				epigraph: "你替刚愎的桀走完了他不肯走的最后一步：知过，能改——只是那把钥匙，握得太晚了。",
			},
			if_zhongxing: {
				title: "痛改中兴",
				kind: "if",
				epigraph: "你把一个必亡的残局，重新走成了一个悬而未决的开局——禹的江山没有断在你手里，这一次。",
			},
		},
	},
};
