// 系列 chuhan · 楚汉相争。死亡文案单一数据源。
import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";
import hanxinC1Source from "../ink/hanxin-c1.ink?raw";
import hanxinChuhanSource from "../ink/hanxin-chuhan.ink?raw";
import xiangyuChuhanSource from "../ink/xiangyu-chuhan.ink?raw";
import liubangChuhanSource from "../ink/liubang-chuhan.ink?raw";

export const chuhanInkStories: Record<string, InkStoryConfig> = {
	"hanxin:c1": {
		key: "hanxin:c1",
		title: "兵仙韩信 · 第一章 · 胯下之辱",
		source: hanxinC1Source,
		precompiled: false,
		deaths: {
			kill: {
				reason: "因一时之忿杀人，亡命天涯，兵仙就此夭折",
				classical: "于是信孰视之，俛出袴下，蒲伏。",
				analysis:
					"史上的韩信选择了钻胯下。杀掉那个无赖，他便要亡命逃匿，再无登坛拜将之日。大丈夫能屈能伸——所谓『孰视之』，是看清了忍辱与前程孰轻孰重。",
			},
		},
	},
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
	},
};
