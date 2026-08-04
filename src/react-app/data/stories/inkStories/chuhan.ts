// 系列 chuhan · 楚汉相争。死亡文案单一数据源。
import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";
import hanxinChuhanSource from "../ink/hanxin-chuhan.ink?raw";
import xiangyuChuhanSource from "../ink/xiangyu-chuhan.ink?raw";
import liubangChuhanSource from "../ink/liubang-chuhan.ink?raw";
import zhangliangChuhanSource from "../ink/zhangliang-chuhan.ink?raw";
import chenshengChuhanSource from "../ink/chensheng-chuhan.ink?raw";
import pengyueChuhanSource from "../ink/pengyue-chuhan.ink?raw";
import yingbuChuhanSource from "../ink/yingbu-chuhan.ink?raw";
// 番外 · 上帝视角
import extraXiangyuGaixiaSource from "../ink/extras/extra-xiangyu-gaixia.ink?raw";
import extraLiubangPeixiangSource from "../ink/extras/extra-liubang-peixiang.ink?raw";
import extraHanxinPiaomuSource from "../ink/extras/extra-hanxin-piaomu.ink?raw";
import extraZhangliangHuangshigongSource from "../ink/extras/extra-zhangliang-huangshigong.ink?raw";
import extraChenshengDazexiangSource from "../ink/extras/extra-chensheng-dazexiang.ink?raw";
import extraPengyueJuyeSource from "../ink/extras/extra-pengyue-juye.ink?raw";
import extraYingbuLishanSource from "../ink/extras/extra-yingbu-lishan.ink?raw";

export const chuhanInkStories: Record<string, InkStoryConfig> = {
	"hanxin:chuhan": {
		key: "hanxin:chuhan",
		title: "兵仙韩信 · 一生",
		source: hanxinChuhanSource,
		precompiled: false,
		deaths: {
			kuaxia: {
				reason: "一怒拔剑杀屠中少年，亡命而兵仙夭折",
				classical: "于是信孰视之，俛出袴下，蒲伏。",
				analysis:
					"史上的韩信『孰视之』——看清了忍辱与前程孰轻孰重。杀他痛快一瞬，却要偿命亡命，登坛拜将之日便永远不会来了。那一俯不是怯，是把一条命，好好留给了将来呀。",
			},
			maimo: {
				reason: "留事项羽，才华埋没至死",
				classical: "数以策干项羽，羽不用。汉王之入蜀，信亡楚归汉。",
				analysis:
					"项羽宁把印信棱角磨平也舍不得给权。史上的韩信不肯陪他熬——此处不用你，你便去赌一个肯用你的人。忍是忍在刀口下，不是忍在被埋没里。",
			},
			zhan: {
				reason: "临刑不呼，人头空落",
				classical: "信乃仰视，适见滕公，曰：上不欲就天下乎？何为斩壮士！",
				analysis:
					"十三人已斩，轮到你——那一声喊，是你唯一的活路。史上的韩信忍得了胯下，却在生死关头绝不认命。该低头时低头，该出声时出声，这才是他的『忍』。",
			},
			kuakou: {
				reason: "登坛只知自夸，答不出方略",
				classical: "大王自料勇悍仁强孰与项王？汉王默然良久，曰：不如也。",
				analysis:
					"史上的韩信先逼刘邦认清『不如项王』，再剖项羽之短——看清自己的短，才谈得上扬长避短。空口夸海口的莽夫，刘邦帐下多的是，他要的是能定天下的人。",
			},
			zhengmian: {
				reason: "依常法背山列阵，乌合之众溃散",
				classical: "信乃使万人先行，出，背水陈。兵法不曰『陷之死地而后生，置之亡地而后存』？",
				analysis:
					"他的兵是『驱市人而战之』，给了活路就都跑了。背水断退，人人自为战——违的是兵法之常，用的是兵法之变。给乌合之众留退路，等于给赵军送胜。",
			},
			zishi: {
				reason: "把锋芒藏尽，便不再是那个韩信",
				classical: "臣多多而益善耳。陛下不能将兵，而善将将。",
				analysis:
					"这是反事实的『死』——史上的韩信恃才不藏、藏不住傲，也正败于此。可若他连锋芒都学会藏尽，就没了那份让人又怕又惜的光。抹平了那份傲，他便不是兵仙了。",
			},
		},
		endings: {
			canon: {
				title: "钟室之终",
				kind: "canon",
				epigraph: "他能算尽天下，独独算不透一个『止』字——忍了一生，没忍过最后这一关。",
			},
			if_zhaojian: {
				title: "鼎足之照",
				kind: "if",
				epigraph: "忠也是绝路，叛也是绝路——史书没让他走的那条岔路，他临终才照见。",
			},
			if_santian: {
				title: "三分天下",
				kind: "if",
				epigraph: "他当真按下了齐王印——兵仙对上汉王，历史的棋盘重摆，只是这盘『人心』的棋，未必赢得下。",
			},
		},
	},
	"xiangyu:chuhan": {
		key: "xiangyu:chuhan",
		title: "西楚霸王 · 项羽",
		source: xiangyuChuhanSource,
		precompiled: false,
		deaths: {
			overtame: {
				reason: "苦学安分、磨去豪气，不复项羽",
				classical: "剑一人敌，不足学，学万人敌。籍大喜，略知其意，又不肯竟学。",
				analysis:
					"循规蹈矩的项籍扛不起那面楚旗。那份不肯竟学的浮躁与睥睨天下的豪气，恰恰就是他之为他——磨平了，霸王便没了魂。",
			},
			dingtao: {
				reason: "随叔父骄兵冒进，定陶覆军、项梁战死",
				classical: "秦果悉起兵益章邯，击楚军，大破之定陶，项梁死。",
				analysis:
					"宋义那句『战胜而将骄卒惰者败』，在定陶一语成谶。初尝大胜便轻敌，你连唯一的依靠项梁也一起赔了进去——这一课，得用血来记。",
			},
			hesitate: {
				reason: "守法度不敢斩宋义，错过破釜死战之门",
				classical: "夫被坚执锐，义不如公；坐而运策，公不如义。",
				analysis:
					"宋义按兵不动四十六日、饮酒高会，你若拘于上下之分不敢夺其军，巨鹿便再无破釜沉舟。智者昧于时势，反不如勇者当机立断——这一刀，是霸业的门。",
			},
			hongmenkill: {
				reason: "席上杀刘邦，失却『不忍』之义",
				classical: "君王为人不忍。项王默然不应。",
				analysis:
					"范增举玦三示，你终究没动手——史书记的正是这份『不忍』。补上这一刀，你或许赢了天下，却不再是那个让千古为之扼腕的悲剧英雄。妇人之仁，正是项羽之为项羽。",
			},
			notxiangyu: {
				reason: "垓下认错求生，磨去至死不认错的执拗",
				classical: "然今卒困于此，此天之亡我，非战之罪也。",
				analysis:
					"『天亡我，非战之罪』——到死不肯低头、不肯自责的执拗，正是他的悲壮所在。你若在垓下认了错、服了软，苟活下来的便不再是那个西楚霸王了。",
			},
			crossjiang: {
				reason: "渡乌江苟活，失『无颜见江东父老』之尊严",
				classical: "籍与江东子弟八千人渡江而西，今无一人还，纵彼不言，籍独不愧于心乎？",
				analysis:
					"亭长劝你渡江东山再起，你却觉得无颜见父老。后人怜项羽，怜的正是拒渡这一刻的知耻与担当——渡了江，命是活了，那个宁死不辱的项羽却死了。",
			},
		},
		endings: {
			canon: {
				title: "乌江自刎",
				kind: "canon",
				epigraph: "力盖世，而终以刚愎自误——他不是输给了刘邦，是输给了自己。",
			},
			if_kouliu: {
				title: "鸿门扣虎",
				kind: "if",
				epigraph: "帐中锁着一头你既不敢杀、也不敢放的猛虎——这局棋，连你自己也不知怎么收场。",
			},
			if_dujiang: {
				title: "卷土未知",
				kind: "if",
				epigraph: "身后是愿意再信你一次的父老，面前是整个已归汉的天下——这一次，你想清楚为什么而战了吗？",
			},
		},
	},
	"liubang:chuhan": {
		key: "liubang:chuhan",
		title: "汉高祖 · 刘邦",
		source: liubangChuhanSource,
		precompiled: false,
		deaths: {
			yajie: {
				reason: "押解不成、失徒当死",
				classical: "高祖以亭长为县送徒郦山，徒多道亡。自度比至皆亡之，夜乃解纵所送徒。",
				analysis:
					"眼看刑徒逃散、到骊山也是死罪，史上的刘邦索性放尽众人、自认亡命，反收十余壮士为班底。保那顶亭长帽子是死路，敢担这一场才是活棋——领袖的第一课，是敢舍。",
			},
			shajiang: {
				reason: "斩降王子婴以立威、失关中人心",
				classical: "人已服降，又杀之，不祥。乃以秦王属吏。",
				analysis:
					"你不杀子婴、后来项羽杀之——同一个降王，一存一杀，正是收揽与丧失人心的分水岭。杀降图一时之快，约法三章换来的民心，便再也约不下来了。",
			},
			qingong: {
				reason: "贪居秦宫声色、众叛亲离",
				classical: "欲止宫休舍，樊哙、张良谏，乃封秦重宝财物府库，还军霸上。",
				analysis:
					"史上的刘邦，在最想放纵的那一刻忍住了：封府库、还霸上、秋毫无取。爱酒好色的无赖若真住进秦宫享乐，便与暴秦无异——能屈者，方能伸。",
			},
			yingkang: {
				reason: "鸿门硬扛项羽、四十万对十万",
				classical: "沛公旦日从百余骑来见项王，至鸿门，谢曰：臣与将军戮力而攻秦。",
				analysis:
					"先入关是理，可四十万大军当前，理压不过刀。史上的刘邦卑辞谢罪、低这一个头，才换回整盘棋。据约力争、逞一时之气，是把命和天下一起赌没。",
			},
			cixing: {
				reason: "鸿门顾体面辞行、错失脱身时机",
				classical: "大行不顾细谨，大礼不辞小让。沛公已去，间至军中。",
				analysis:
					"多一句辞行，范增就多一分动手的由头。史上的刘邦连招呼都不打便抄小路溜走——无赖的脸皮，正是活命的智慧。要那点体面，就把命留在了帐里。",
			},
			shixin: {
				reason: "疑韩信出身低微、失兵仙困死汉中",
				classical: "至如信者，国士无双。王必欲拜之，择良日，斋戒，设坛场，具礼，乃可耳。",
				analysis:
					"一个受过胯下之辱的落魄汉子，史上的刘邦却肯斋戒筑坛、拜为大将。用人不看出身，才有暗度陈仓、还定三秦。嫌他低微推走了他，就把逐鹿天下的本钱亲手扔了。",
			},
			shouwei: {
				reason: "荥阳不受纪信替死、城破被俘",
				classical: "将军纪信乃乘王驾，诈为汉王，诳楚，汉王得与数十骑出西门遁。",
				analysis:
					"帝王的冷酷，是弃一人以全大局。纪信扮你诳楚、代你赴死，你才得以西遁，才有后来的垓下。你若不忍受这条命、执意共守孤城，这一次项羽不会再放你——天下也就此别过。",
			},
		},
		endings: {
			canon: {
				title: "大风还乡",
				kind: "canon",
				epigraph: "能屈能伸让他活到最后，知人善任让他赢了项羽——可坐上那把椅子，就再没人能真正靠近他了。",
			},
			if_guhan: {
				title: "孤家寡人",
				kind: "if",
				epigraph: "猛士是他自己亲手杀光的——赢了整个天下，却把并肩打天下的人都变成了尸骨。",
			},
			if_gongtianxia: {
				title: "共守天下",
				kind: "if",
				epigraph: "他守住了『共天下』的信义，却也许把七国之祸的种子，一并埋进了土里。",
			},
			if_baideng: {
				title: "白登不屈",
				kind: "if",
				epigraph: "赢了面子，输了里子——一个懂得低头的刘邦，本不该在这里逞英雄。",
			},
		},
	},
	"zhangliang:chuhan": {
		key: "zhangliang:chuhan",
		title: "谋圣张良",
		source: zhangliangChuhanSource,
		precompiled: false,
		deaths: {
			sizang: {
				reason: "厚葬弟弟耽于私情，复仇之志泯灭",
				classical: "弟死不葬，悉以家财求客刺秦王，为韩报仇。",
				analysis:
					"史上张良弟死不葬、散尽家财求刺客——一心只在国仇。你若把家财耗在丧仪上，便泯然众人，那个『天下振动』的张良，就葬在了弟弟坟前。",
			},
			zhengchong: {
				reason: "带力士正面冲杀仪仗，当场被诛",
				classical: "良与客狙击秦皇帝博浪沙中，误中副车。",
				analysis:
					"狙击是伏而待之的暗算，不是正面死拼。硬冲如林甲士，还没近到车驾，就湮灭在尘土里了。",
			},
			zaidu: {
				reason: "博浪失手后不知收敛，再图行刺被擒",
				classical: "良乃更名姓，亡匿下邳。",
				analysis:
					"史上张良一椎不成便隐姓埋名保命。搜捕正急，你一动就被循迹擒获——莽夫的复仇，死于不知收敛。",
			},
			ouzhi: {
				reason: "圯上老人使唤，怒而挥拳",
				classical: "良鄂然，欲殴之。为其老，强忍。",
				analysis:
					"那个想揍人的血气刺客，史上强忍了下来。一拳出去，天大的机缘连同《太公兵法》一起打没了。",
			},
			banfei: {
				reason: "捡鞋后不肯长跪穿鞋，半途翻脸",
				classical: "良业为取履，因长跪履之。",
				analysis:
					"老人要试的是能不能忍到底。半途而废的隐忍等于没忍，与『孺子可教』就差这最后一跪。",
			},
			shiqi: {
				reason: "第三次赴约仍按天亮而至，迟到",
				classical: "五日，良夜未半往。有顷，父亦来，喜曰：当如是。",
				analysis:
					"求道之心输给了怕吃苦的惰性——差之毫厘的这一个『忍』字，让你没接住那卷改命的书。",
			},
			jingju: {
				reason: "舍能用之主而投名分大的景驹",
				classical: "沛公殆天授。故遂从之，不去见景驹。",
				analysis:
					"你要找的不是听你的人，是懂你的人。景驹徒有王号，你满腹兵法对他如对牛弹琴——遇主天授，天授的是那个『省』你言的沛公。",
			},
			qiangguan: {
				reason: "峣关以两万兵正面强攻",
				classical: "秦将贾竖，易动以利。愿沛公且留壁，使人先行，为五万人具食，益张旗帜诸山上，为疑兵。",
				analysis:
					"史上张良张疑兵、诱贪将，不战而使敌先乱。硬攻折损大半，把『先入关中』的天大先机也一起丢了。",
			},
			zhaxiang: {
				reason: "轻信降秦将合兵，反遭哗变",
				classical: "此独其将欲叛耳，恐士卒不从。不如因其解击之。",
				analysis:
					"叛的只是将领，士卒未必肯从。识不破这层合作背后的脆弱，联合便成了取祸之道。",
			},
			juqin: {
				reason: "附和刘邦留居秦宫，军心涣散",
				classical: "忠言逆耳利于行，毒药苦口利于病。愿沛公听樊哙言。",
				analysis:
					"帝王师的第一课，是劝主克欲。你不谏反和，陪他把江山根基坐塌了半边。",
			},
			taoming: {
				reason: "随项伯逃命弃主，失义无前程",
				classical: "臣为韩王送沛公，今事有急，亡去不义。",
				analysis:
					"谋士的第一义是『不义不为』。你逃掉了义，也逃掉了整个前程——留下报信的那份担当，才换来鸿门的转圜。",
			},
			yingpeng: {
				reason: "劝刘邦与项羽正面硬战",
				classical: "沛公自度能却项羽乎？沛公默然良久，曰：固不能也。",
				analysis:
					"谋士的本事，是在打不过时找到不必打的活路。硬碰，是把主君往死路上推。",
			},
			yicheng: {
				reason: "下邑只争一城一地，拖入正面消耗",
				classical: "捐之此三人，则楚可破也。",
				analysis:
					"论野战无人是项羽对手。运筹者一旦失了全局之眼，就把最见战略的下邑一谋，答成了匹夫之勇。",
			},
			liuguo: {
				reason: "附和复立六国，游士散去",
				classical: "天下游士离其亲戚，去坟墓，从陛下者，徒欲日夜望咫尺之地。今复六国，游士各归事其主，陛下与谁取天下乎？",
				analysis:
					"争天下的本质是以利聚人。复封六国，等于自散其党——一步之差，散尽了刘邦的天下。",
			},
			juefeng: {
				reason: "怒而拒封韩信、发兵问罪",
				classical: "汉方不利，宁能禁信之王乎？不如因而立，善遇之，使自为守。",
				analysis:
					"此刻断不可失韩信之心。一封王印换一个天下，你却因意气把这笔账算反了。",
			},
			zhenya: {
				reason: "以杀止争功之乱，逼反诸将",
				classical: "今急先封雍齿以示群臣，群臣见雍齿封，则人人自坚矣。",
				analysis:
					"治乱不在刀兵，而在揣透众人之惧。你若也抡起屠刀，早晚被自己开动的猜忌机器绞成齑粉。",
			},
			kougan: {
				reason: "正面苦谏废立，僵成死结",
				classical: "此难以口舌争也。顾上有不能致者，天下有四人。",
				analysis:
					"硬碰只会两败，唯有布局让皇帝自己看清。这一次，你忘了自己最擅长的『借势』。",
			},
		},
		endings: {
			canon: {
				title: "赤松身退",
				kind: "canon",
				epigraph: "运筹天下不算最难，最难的，是算准了『何时该退』。",
			},
			if_lianzhan: {
				title: "恋栈之覆",
				kind: "if",
				epigraph: "算得尽天下，独独算不透一个『退』字——他本该赢在知止，却与兵仙同蹈钟室之覆。",
			},
			if_fuhan: {
				title: "颍川复韩",
				kind: "if",
				epigraph: "他圆了五世相韩的执念，却也亲手把它，圆成了汉的一个郡县——高帝容他复韩，正因这个韩再也威胁不到谁。",
			},
		},
	},
	"chensheng:chuhan": {
		key: "chensheng:chuhan",
		title: "首义陈胜",
		source: chenshengChuhanSource,
		precompiled: false,
		deaths: {
			renming: {
				reason: "认命佣耕，埋葬鸿鹄之志",
				classical: "陈涉太息曰：嗟乎，燕雀安知鸿鹄之志哉！",
				analysis:
					"史上的陈胜偏不认命——那声『鸿鹄之志』，正是日后大泽乡揭竿的种子。咽下这口不甘、随众苟活，天下便少了那第一声呐喊，也少了一个敢说『死国可乎』的人。",
			},
			zuosi: {
				reason: "束手待毙、盼秦法开恩",
				classical: "失期，法皆斩。今亡亦死，举大计亦死，等死，死国可乎！",
				analysis:
					"秦法从不开恩。史上的陈胜算准了『横竖是死』，才逼出『死国可乎』的觉醒。坐等法外施恩，等来的只有边塞风雪里九百颗人头——绝境里，不搏命，就只剩死路。",
			},
			wuming: {
				reason: "不肯借名、师出无名",
				classical: "今诚以吾众诈自称公子扶苏、项燕，为天下唱，宜多应者。",
				analysis:
					"一个雇农凭空振臂，谁认得？史上的陈胜借扶苏之贤收秦地不平、借项燕之名聚楚人旧情——起兵先讲师出有名，可见绝非莽夫。无名而举，燎原之火起不来。",
			},
		},
		endings: {
			canon: {
				title: "骤贵速亡",
				kind: "canon",
				epigraph: "鸿鹄之志把他从田埂上举起，骤贵之骄又把他狠狠摔下——连车夫都容不下他了。",
			},
			if_shishi: {
				title: "首义隐王",
				kind: "if",
				epigraph: "他没等到富贵长久，却把『宁有种乎』四个字，永远留给了后来人。",
			},
			if_buwangben: {
				title: "不忘本",
				kind: "if",
				epigraph: "他事事做对、始终不忘本，却仍难逃身死——第一个举炬的人，未必等得到天亮。",
			},
		},
	},
	"pengyue:chuhan": {
		key: "pengyue:chuhan",
		title: "梁王彭越 · 游击断粮",
		source: pengyueChuhanSource,
		precompiled: false,
		deaths: {
			bulwei: {
				reason: "钜野立长时姑息不斩后期者，众不畏令、盗伙散不成军",
				classical: "与期旦日日出会，后期者斩。",
				analysis:
					"史上彭越正是引一人斩之、设坛祭之，徒属才大惊莫敢仰视——慈不掌兵，一颗人头立起军纪，泽中群盗方成劲旅。你若心软放过，军令一开口子便再收不回，起家的第一步就断了。这不是他的路：他的冷，是渔盗起家的第一块骨头。",
			},
			zuoguan: {
				reason: "田荣赐将军印时坐观楚汉成败、首鼠不出，据梁自立之机一去不返",
				classical: "彭越众万余人毋所属。",
				analysis:
					"彭越『两龙方鬬，且待之』是精明，可乱世的机会等一时是眼力、等过头就是把本钱等没了。史上他审势受印、大破萧公角，才据得梁地当封王的资本。首鼠观望是他的天性，可这一次天性用错了地方，就把裂土的门路观望没了。",
			},
			yingzhan: {
				reason: "项王主力回师时逞勇正面决战，越军非楚精锐之敌而大败",
				classical: "彭越常往来为汉游兵，击楚，绝其后粮。",
				analysis:
					"彭越制楚的看家绝活全在『往来』二字——来无影去无踪、专掐粮袋子，逼项王腹背受敌。史上他见主力东来便北走谷城，从不与项羽争锋。游刃之利在避实，你偏要争这一锋，刀便折了：这是拿他的长处去撞他躲了一辈子的短处。",
			},
			kangming: {
				reason: "固陵已索得封地却仍拥兵抗命、失垓下之盟，自绝于汉",
				classical: "彭越乃悉引兵会垓下。",
				analysis:
					"史上彭越是称病要地、割地王之乃悉引兵会垓下——观望要价是真，抗命失盟却没有。他的『首鼠』尚在讨价的分寸之内，你若既拿好处又背盟，就把自己从可用的诸侯变成背信的祸患。天下未定就先站到汉王对面，拥兵抗命的人活不到清算那天。",
			},
		},
		endings: {
			canon: {
				title: "醢身夷族",
				kind: "canon",
				epigraph: "能挠得动项羽，却挠不平自己那点观望之心——智略绝人，独患无身。",
			},
			if_qincheng: {
				title: "亲附照见",
				kind: "if",
				epigraph: "他少观望了一分，也就不再是那个困死在『首鼠』里的梁王——可醢身夷族的彭越，仍是史书写定的。",
			},
			if_juliang: {
				title: "据梁鼎足",
				kind: "if",
				epigraph: "他有绝人的智略，却没有据土为王的格局——那柄悬在别人背后的游刃，离了别人便没了着力处。",
			},
		},
	},
	"yingbu:chuhan": {
		key: "yingbu:chuhan",
		title: "淮南王英布 · 当刑而王",
		source: yingbuChuhanSource,
		precompiled: false,
		deaths: {
			chenlun: {
				reason: "黥面自弃、消沉认命，谶命终成空话",
				classical: "布欣然笑曰：人相我当刑而王，几是乎？",
				analysis:
					"史上的黥布，是笑着受了那一刀的——旁人俳笑他，他却把耻辱当成谶的半应。若他也认了命、缩了头，便湮没在骊山数十万刑徒里，连个名字都不会留下。不认命的悍气，本就是他起家唯一的本钱。",
			},
			qiezhan: {
				reason: "惜身怯战、避锋不前，不为项羽所重",
				classical: "项籍使布先渡河击秦，布数有利。",
				analysis:
					"巨鹿城下，是他先渡河替项羽趟开了那条血路，项羽才敢引全军跟进。项羽认的从来只是能不能替他啃硬骨头——黥布若惜起这条从骊山捡回的命，便再没有『功冠诸侯』的先锋了。他的勇，是他仅有的谋。",
			},
			kangming: {
				reason: "【照见】抗命不弑、存义帝——违项羽必遭其忌，那便不是惟力是视的黥布了",
				classical: "其八月，布使将击义帝，追杀之郴县。",
				analysis:
					"史上的他到底遣将追到郴县，杀了那位天下共尊的君。项羽要的是一把不问是非、只听号令的刀；黥布若讲起『义』来，便不是那个惟力是视、为虎作伥的黥布了。全义固然干净，可干净从来不是他的底色——负义的种子，是他自己欣然种下的。",
			},
			chiyi: {
				reason: "念项羽旧恩迟疑不决，暗约被楚使觉察",
				classical: "布曰：如使者教，因起兵而击之耳。于是杀使者，因起兵而攻楚。",
				analysis:
					"随何抢坐上座、当众捅破暗约，逼他到了墙角——史上的黥布一咬牙就杀了楚使。他若念起项羽当年委以先锋、封他为王的旧恩而心软一瞬，反复无常之人最怕的正是这一刻的犹豫。叛服图存是他的活法，回头看一眼，就活不成了。",
			},
			shangji: {
				reason: "【照见】反时出上计东西并进传檄山东——或能割据，可那便不是拣下策自保的黥布了",
				classical: "令尹对曰：出下计。布故丽山之徒也，自致万乘之主，此皆为身，不顾后为百姓万世虑者也。",
				analysis:
					"薛公一口咬定他必出下计，只因他刑徒出身、事事为身，没有为天下长远谋划的格局。他纵有以少败众之勇，也是能取而守不住——割据的疆土只会招来天下之兵。走那条最像英雄的上计，便不是史书里那个拣下策自保的黥布了；搏一场大的，也就把自己搏丢了。",
			},
		},
		endings: {
			canon: {
				title: "当刑而王",
				kind: "canon",
				epigraph: "刑受过了，王也王了淮南——一路的勇，没配上一分谋，更没守住一寸义。",
			},
			if_ruchao: {
				title: "入朝自明",
				kind: "if",
				epigraph: "他强压下那份见醢而恐的惧，把命交到诛功臣者手里——多守了一分，也就不是史书里那个反复无常的黥布了。",
			},
			if_zhongji: {
				title: "据关僵持",
				kind: "if",
				epigraph: "他塞住了成皋、据住了敖仓，把『胜败未知』拖成了僵局——没输，却也始终没能赢。",
			},
		},
	},
	// ═══ 番外 · 上帝视角 ═══
	"extra:xiangyu-gaixia": {
		key: "extra:xiangyu-gaixia",
		title: "上帝视角 · 垓下的楚卒",
		source: extraXiangyuGaixiaSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "楚卒的那杆断戈", kind: "canon", epigraph: "本纪写英雄的败，侧面写小兵的活。正侧合看，历史才是热的。" },
		},
	},
	"extra:liubang-peixiang": {
		key: "extra:liubang-peixiang",
		title: "上帝视角 · 沛县的老兄弟",
		source: extraLiubangPeixiangSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "大风歌的酒和泪", kind: "canon", epigraph: "威加海内的背后，是安得猛士的空——大风起，云飞扬，吹不散沛县那一夜的酒和泪。" },
		},
	},
	"extra:hanxin-piaomu": {
		key: "extra:hanxin-piaomu",
		title: "上帝视角 · 淮阴的漂母",
		source: extraHanxinPiaomuSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "漂母的千金不换", kind: "canon", epigraph: "大人物的传记里写着王侯将相的功；市井的那些小人物，藏着历史的温度。" },
		},
	},
	"extra:zhangliang-huangshigong": {
		key: "extra:zhangliang-huangshigong",
		title: "上帝视角 · 圯上的老人",
		source: extraZhangliangHuangshigongSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "三十年等一把帝王师", kind: "canon", epigraph: "没有扔鞋的人等了三十年，捡鞋的人——就永远捡不到那卷书。" },
		},
	},
	"extra:chensheng-dazexiang": {
		key: "extra:chensheng-dazexiang",
		title: "上帝视角 · 大泽乡的戍卒",
		source: extraChenshengDazexiangSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "九百戍卒的那一声喊", kind: "canon", epigraph: "燎原之火，从九百个冻得发抖的戍卒脚下烧起来——那句口号，先在他们心里喊了一千遍。" },
		},
	},
	"extra:pengyue-juye": {
		key: "extra:pengyue-juye",
		title: "上帝视角 · 钜野泽的渔盗",
		source: extraPengyueJuyeSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "一颗人头立起的军纪", kind: "canon", epigraph: "慈不掌兵四个字，落到底，是泽中老渔盗眼睁睁看着同乡兄弟被推出去斩的那一刀。" },
		},
	},
	"extra:yingbu-lishan": {
		key: "extra:yingbu-lishan",
		title: "上帝视角 · 骊山的刑徒",
		source: extraYingbuLishanSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "黥面笑着说出的那句谶", kind: "canon", epigraph: "骊山几十万刑徒，只有一个笑着受了那一刀、又笑着冲出来——当刑而王四个字，是闯出来的。" },
		},
	},
};
