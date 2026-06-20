import type { Story } from "../../engine/types";

/**
 * 兵仙韩信 · 七章
 * 史源：《史记·淮阴侯列传》（兼及《项羽本纪》《萧相国世家》）
 * 关键成就：
 *   xiakua         胯下之辱（选择钻胯下）
 *   bingxian_born  通关
 *   perfect_hanxin 全程零死亡且全部正确（在 ending 判定）
 */
export const hanxin: Story = {
	key: "hanxin",
	title: "兵仙韩信",
	start: "c1_intro",
	variables: {},
	nodes: {
		// ───────── 第一章 · 胯下之辱 ─────────
		c1_intro: {
			content: [
				{ bg: "huaiyin_street" },
				{ bgm: "lonely" },
				{
					say: "淮阴。你是韩信，家贫无行，不得推择为吏，又不能治生商贾，常从人寄食，人多厌之。",
					speaker: "旁白",
				},
				{
					say: "你腰间始终佩着一柄长剑——那是你唯一的体面。",
					speaker: "旁白",
				},
				{ show: { id: "tuzhong", expr: "mocking", pos: "right" } },
				{
					say: "市井屠中，一名少年拦住你，当众羞辱：『你虽长大，好带刀剑，其实胆怯耳！』",
					speaker: "少年",
				},
				{
					say: "『信能死，刺我；不能死，出我袴下！』",
					speaker: "少年",
					hint: "于是信孰视之，俛出袴下，蒲伏。一市人皆笑信，以为怯。",
				},
			],
			choices: [
				{
					text: "拔剑而起，一剑刺死辱我之人",
					goto: "c1_death_kill",
				},
				{
					text: "孰视良久，俯身从他胯下钻过",
					goto: "c1_pass",
					correct: true,
					hint: "孰视之——这不是怯懦，是掂量过生死之后的隐忍。",
				},
			],
		},
		c1_pass: {
			content: [
				{
					say: "你定定地看了他许久，俯身，伏地，从那少年的胯下缓缓爬过。满市的人都笑你怯懦。",
					speaker: "旁白",
				},
				{ achieve: "xiakua" },
				{
					say: "可你心里清楚：杀一个无赖，换来的是一条逃亡的命；忍下这口气，留住的是一身将来。",
					speaker: "韩信",
				},
			],
			goto: "c2_intro",
		},
		c1_death_kill: {
			death: {
				reason: "因一时之忿杀人，亡命天涯，兵仙就此夭折",
				classical: "于是信孰视之，俛出袴下，蒲伏。",
				analysis:
					"史上的韩信选择了钻胯下。杀掉那个无赖，他便要亡命逃匿，再无登坛拜将之日。大丈夫能屈能伸——所谓『孰视之』，是看清了忍辱与前程孰轻孰重。",
				goto: "c1_intro",
			},
		},

		// ───────── 第二章 · 寄食漂母 ─────────
		c2_intro: {
			content: [
				{ bg: "riverside" },
				{
					say: "你常在城下钓鱼充饥。河边漂洗丝絮的老妇人中，有一位见你饥饿，把自己的饭分给你吃。",
					speaker: "旁白",
				},
				{ show: { id: "piaomu", expr: "kind", pos: "left" } },
				{
					say: "一连数十日，老妇人每日都分饭给你。",
					speaker: "旁白",
					hint: "信喜，谓漂母曰：『吾必有以重报母。』",
				},
				{
					say: "（受人如此恩惠，我当如何自处？）",
					speaker: "韩信",
				},
			],
			choices: [
				{
					text: "默然受食，铭记此恩，立志他日厚报",
					goto: "c2_pass",
					correct: true,
					hint: "一饭之恩，他日千金以报——这是韩信的赤子之心。",
				},
				{
					text: "嫌粗食难咽，弃之而去",
					goto: "c2_death_proud",
				},
				{
					text: "趁夜潜入亭长家，窃取酒食",
					goto: "c2_death_steal",
				},
			],
		},
		c2_pass: {
			content: [
				{
					say: "你郑重道谢：『吾必有以重报母。』老妇人却生气了——",
					speaker: "旁白",
				},
				{
					say: "大丈夫不能自食，吾哀王孙而进食，岂望报乎！",
					speaker: "漂母",
					hint: "她要的不是回报，是你争一口气，自己撑起自己。",
				},
				{
					say: "这句话，你记了一辈子。日后封楚王，你赐漂母千金。",
					speaker: "旁白",
				},
			],
			goto: "c3_intro",
		},
		c2_death_proud: {
			death: {
				reason: "傲慢失人心，困顿之中再无人相助",
				classical: "信喜，谓漂母曰：吾必有以重报母。",
				analysis:
					"韩信落魄时受漂母一饭，铭记于心，封王后以千金相报。知恩图报，方能聚人。弃恩而去者，终将众叛亲离。",
				goto: "c2_intro",
			},
		},
		c2_death_steal: {
			death: {
				reason: "窃食败露，声名扫地，再难见用于人",
				classical: "常数从其下乡南昌亭长寄食，数月，亭长妻患之。",
				analysis:
					"韩信寄食亭长被厌弃，尚且以正道自持，不曾行窃。将相之才，立身先立德。盗窃一旦败露，纵有奇谋也无人敢用。",
				goto: "c2_intro",
			},
		},

		// ───────── 第三章 · 择主而事 ─────────
		c3_intro: {
			content: [
				{ bg: "camp_chu" },
				{ bgm: "march" },
				{
					say: "天下大乱，你仗剑从军，先投项梁，项梁败死，又归项羽。项羽用你为郎中。",
					speaker: "旁白",
				},
				{
					say: "你屡次向项羽献策，他却不肯采用。你的奇谋，在西楚的大帐里，无人听得懂。",
					speaker: "旁白",
					hint: "数以策干项羽，羽不用。",
				},
				{
					say: "（项王只信自家子弟与勇力之士。我纵有韬略，又有何用？）",
					speaker: "韩信",
				},
			],
			choices: [
				{
					text: "留事项羽，盼终有一日得其见用",
					goto: "c3_death_stay",
				},
				{
					text: "离楚归汉，另择明主",
					goto: "c3_pass",
					correct: true,
					hint: "良禽择木而栖。项羽不能用你，便去能用你的人那里。",
				},
			],
		},
		c3_pass: {
			content: [
				{
					say: "你毅然亡楚归汉，来到汉中。可在刘邦麾下，你起初也不过是个管粮的小官，默默无闻。",
					speaker: "旁白",
				},
				{
					say: "直到一个人，注意到了你。",
					speaker: "旁白",
				},
			],
			goto: "c4_intro",
		},
		c3_death_stay: {
			death: {
				reason: "困守不能用己之主，奇才埋没于行伍",
				classical: "数以策干项羽，羽不用。信乃亡楚归汉。",
				analysis:
					"项羽刚愎，不能用韩信，韩信遂亡归刘邦。若一味死守，纵有兵仙之才，也只能老死帐下。择主而事，是韩信一生的转折。",
				goto: "c3_intro",
			},
		},

		// ───────── 第四章 · 萧何月下追韩信 · 登坛拜将 ─────────
		c4_intro: {
			content: [
				{ bg: "camp_han_night" },
				{
					say: "丞相萧何与你数次长谈，惊为天人。可汉王一时未察，将士纷纷思乡逃亡。",
					speaker: "旁白",
				},
				{ show: { id: "xiaohe", expr: "earnest", pos: "left" } },
				{
					say: "你料定刘邦终究不会重用自己，趁夜，也悄然离营而去。",
					speaker: "旁白",
					hint: "信度何等已数言上，上不我用，即亡。何闻信亡，不及以闻，自追之。",
				},
				{
					say: "（萧丞相虽知我，汉王却未必。与其久候，不如另谋……）",
					speaker: "韩信",
				},
			],
			choices: [
				{
					text: "趁夜亡去，另寻出路",
					goto: "c4_pass",
					correct: true,
					hint: "正因你这一走，萧何才会月下飞马追你回来——这一去，反成转机。",
				},
				{
					text: "留在营中，继续做无名小吏，静待时机",
					goto: "c4_death_wait",
				},
			],
		},
		c4_pass: {
			content: [
				{
					say: "萧何听说你逃了，来不及禀报汉王，连夜策马追赶。有人误报：『丞相也逃了！』刘邦大怒如失左右手。",
					speaker: "旁白",
				},
				{
					say: "两日后，萧何追回了你。刘邦又惊又怒：『诸将亡者以十数，公无所追；追信，诈也！』",
					speaker: "旁白",
				},
				{
					say: "诸将易得耳。至如信者，国士无双。王必欲争天下，非信无所与计事者。",
					speaker: "萧何",
					hint: "国士无双——萧何用全部信誉，为你做了担保。",
				},
				{
					say: "于是刘邦择良日，斋戒，设坛场，具礼，拜你为大将。三军震动。",
					speaker: "旁白",
				},
			],
			goto: "c5_intro",
		},
		c4_death_wait: {
			death: {
				reason: "枯守军营，错失萧何举荐，终身碌碌",
				classical: "何闻信亡，不及以闻，自追之。",
				analysis:
					"恰恰是韩信的离去，逼出了萧何月下相追、以国士无双力荐。历史的吊诡在于：若他安分留下，反而等不到登坛拜将。该走时须走，方能被人看见你的分量。",
				goto: "c4_intro",
			},
		},

		// ───────── 第五章 · 暗度陈仓 ─────────
		c5_intro: {
			content: [
				{ bg: "plank_road" },
				{ bgm: "strategy" },
				{
					say: "拜将之后，你为刘邦定计还定三秦。栈道已被烧绝，章邯重兵扼守要道。如何东出？",
					speaker: "旁白",
				},
				{
					say: "（要让章邯以为我军仍在修栈道，而主力，却从他想不到的地方杀出。）",
					speaker: "韩信",
					hint: "明修栈道，暗度陈仓。声东而击西，示之以缓而出之以速。",
				},
			],
			choices: [
				{
					text: "正面强攻散关，以堂堂之阵破敌",
					goto: "c5_death_assault",
				},
				{
					text: "明修栈道以惑敌，暗中绕道陈仓奇袭",
					goto: "c5_pass",
					correct: true,
					hint: "兵者诡道——让敌人盯着你修栈道，主力却已绕到他背后。",
				},
				{
					text: "按兵不动，等待项羽与齐、赵相争",
					goto: "c5_death_wait",
				},
			],
		},
		c5_pass: {
			content: [
				{
					say: "你派人大张旗鼓修复栈道，章邯果然把重兵都压在栈道一线。主力却悄然绕出故道，奇袭陈仓！",
					speaker: "旁白",
				},
				{
					say: "章邯仓促迎战，大败。你一举平定三秦，为刘邦夺得东出的根基。兵仙之名，初露锋芒。",
					speaker: "旁白",
				},
			],
			goto: "c6_intro",
		},
		c5_death_assault: {
			death: {
				reason: "舍奇用正，强攻坚关，徒耗精锐",
				classical: "明修栈道，暗度陈仓。",
				analysis:
					"章邯久镇关中，正面强攻只会撞上铜墙铁壁。韩信用兵，贵在出其不意——『修栈道』是给敌人看的，『度陈仓』才是真章。",
				goto: "c5_intro",
			},
		},
		c5_death_wait: {
			death: {
				reason: "坐失战机，困死汉中",
				classical: "信乃谋还定三秦。",
				analysis:
					"项羽分封时刻意把刘邦困在汉中。若按兵不动，只会被永远关在巴蜀。韩信的价值，正在于敢于、且善于主动破局。",
				goto: "c5_intro",
			},
		},

		// ───────── 第六章 · 背水一战 ─────────
		c6_intro: {
			content: [
				{ bg: "jingxing" },
				{ bgm: "battle" },
				{
					say: "井陉口。你率数万新募之兵，要破赵军二十万。诸将皆以为必败。",
					speaker: "旁白",
				},
				{
					say: "你却下令：背靠绵蔓水列阵。兵法云『右背山陵，前左水泽』，你偏偏反其道而行。",
					speaker: "旁白",
					hint: "右背山陵，前左水泽，信反此而胜。陷之死地而后生，置之亡地而后存。",
				},
				{
					say: "（我的兵皆乌合之众，驱市人而战。唯有断其归路，置之死地，人人方能拼死。）",
					speaker: "韩信",
				},
			],
			choices: [
				{
					text: "依兵法背山面水，结稳阵以待",
					goto: "c6_death_orthodox",
				},
				{
					text: "背水列阵，断绝退路，置之死地而后生",
					goto: "c6_pass",
					correct: true,
					hint: "置之死地而后生——退无可退，人人死战，新兵也成劲旅。",
				},
			],
		},
		c6_pass: {
			content: [
				{
					say: "汉军背水，退无可退，人人死战。你又预遣两千轻骑，待赵军倾巢而出，奔入赵营尽拔其旗，遍插汉赤帜。",
					speaker: "旁白",
				},
				{
					say: "赵军回望，营中尽是汉旗，以为汉已尽得赵地，遂大乱。汉军前后夹击，大破赵军，斩成安君，擒赵王歇。",
					speaker: "旁白",
				},
				{
					say: "诸将问：『此何术也？』你答：『此在兵法，顾诸君不察耳！』",
					speaker: "韩信",
				},
			],
			goto: "c7_intro",
		},
		c6_death_orthodox: {
			death: {
				reason: "墨守成法，新募之兵一触即溃",
				classical: "右背山陵，前左水泽，信反此而胜。",
				analysis:
					"韩信麾下多是临时征发的市井之人，若按常法布阵留有退路，一遇强敌便会溃散。唯有背水绝路，逼其死战，才能以弱胜强。这是兵仙对人心的洞察。",
				goto: "c6_intro",
			},
		},

		// ───────── 第七章 · 十面埋伏 · 钟室之祸 ─────────
		c7_intro: {
			content: [
				{ bg: "gaixia" },
				{ bgm: "siege" },
				{
					say: "垓下。你统汉军三十万，将项羽十万楚军重重围困。如何毕其功于一役？",
					speaker: "旁白",
				},
				{
					say: "（项王骁勇，正面决战仍恐有失。当以十面埋伏困之，再以楚歌乱其军心。）",
					speaker: "韩信",
					hint: "四面楚歌——攻心为上。瓦解的不是楚军的阵，是楚军的心。",
				},
			],
			choices: [
				{
					text: "布十面埋伏，夜唱楚歌，瓦解楚军斗志",
					goto: "c7_pass",
					correct: true,
					hint: "夜闻四面皆楚歌，项王惊曰：汉皆已得楚乎？是何楚人之多也！",
				},
				{
					text: "倚仗兵多，正面列阵与项羽决战",
					goto: "c7_death_frontal",
				},
			],
		},
		c7_pass: {
			content: [
				{
					say: "夜深，汉营四面响起楚歌。楚军以为故乡尽失，斗志瓦解。项羽悲歌别姬，溃围而走，自刎乌江。",
					speaker: "旁白",
				},
				{
					say: "天下已定。你功盖天下，被徙为楚王，又被疑而贬为淮阴侯。极盛之时，已伏杀机。",
					speaker: "旁白",
				},
			],
			goto: "c7_zhongshi",
		},
		c7_death_frontal: {
			death: {
				reason: "与困兽犹斗的项羽硬碰，徒增伤亡",
				classical: "项王军壁垓下，兵少食尽，汉军及诸侯兵围之数重。",
				analysis:
					"项羽个人勇武天下无双，正面决战即便取胜也是惨胜。韩信以『四面楚歌』攻心，先溃其志再破其军——这才是兵仙收束天下的手笔。",
				goto: "c7_intro",
			},
		},
		c7_zhongshi: {
			content: [
				{ bg: "han_palace" },
				{ bgm: "lonely" },
				{
					say: "谋士蒯通曾劝你：『天下权在足下。为汉则汉胜，为楚则楚胜。何不三分天下，鼎足而立？』",
					speaker: "旁白",
				},
				{ show: { id: "kuaitong", expr: "scheming", pos: "right" } },
				{
					say: "勇略震主者身危，功盖天下者不赏。足下今戴震主之威，挟不赏之功，归楚楚人不信，归汉汉人震恐——足下欲持是安归乎？",
					speaker: "蒯通",
					hint: "韩信犹豫不忍倍汉，又自以为功多，汉终不夺我齐，遂谢蒯通。",
				},
			],
			choices: [
				{
					text: "念汉王解衣推食之恩，谢绝蒯通，忠于汉室",
					goto: "ending",
					correct: true,
					hint: "汉王遇我甚厚……吾岂可乡利倍义乎！——这是韩信的选择，也是他的结局。",
				},
				{
					text: "听蒯通之计，举兵自立，三分天下",
					goto: "c7_death_rebel",
				},
			],
		},
		c7_death_rebel: {
			death: {
				reason: "背汉自立，名不正而众不附，速败而亡",
				classical: "韩信犹豫不忍倍汉，又自以为功多，汉终不夺我齐。",
				analysis:
					"史上的韩信终究『不忍倍汉』。蒯通之计虽奇，然韩信新定之齐根基未稳、众心未附，仓促自立只会败得更快。他选择了忠义，也因此走向钟室之祸——这正是淮阴侯一生的悲剧底色。",
				goto: "c7_zhongshi",
			},
		},

		// ───────── 结局 ─────────
		ending: {
			content: [
				{ bg: "han_palace" },
				{
					say: "你谢绝了蒯通。你信刘邦不会负你。",
					speaker: "旁白",
				},
				{
					say: "汉十一年，你被告谋反。吕后与萧何设计，诱你入长乐宫钟室。当年月下追你的人，亲手为你布下了最后的局。",
					speaker: "旁白",
					hint: "成也萧何，败也萧何。",
				},
				{
					say: "临刑，你长叹：『吾悔不用蒯通之计，乃为儿女子所诈，岂非天哉！』",
					speaker: "韩信",
				},
				{
					say: "一柄长剑，半世飘零。从胯下到坛上，从坛上到钟室。这，就是兵仙的一生。",
					speaker: "旁白",
				},
				{ achieve: "bingxian_born" },
				{
					achieve: "perfect_hanxin",
					when: (v) =>
						(v._deaths as number) === 0 &&
						(v._correct as number) === (v._choices as number) &&
						(v._choices as number) >= 7,
				},
			],
			end: true,
		},
	},
};
