// 系列 qunxiang · 群英传·游侠刺客·市井百态。死亡文案单一数据源。
import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";

export const qunxiangInkStories: Record<string, InkStoryConfig> = {
	"guojie:qunxiang": {
		key: "guojie:qunxiang",
		title: "郭解 · 游侠",
		inkFile: "guojie-qunxiang",
		deaths: {
			xiongxia: {
				reason: "少年凶侠不改，继续以暴制暴，最终被擒获处死",
				classical: "解为人短小精悍，不饮酒。少时阴贼，慨不快意，身所杀甚众。",
				analysis:
					"少年郭解以暴制暴，快意恩仇，手上血债累累。可他之所以成为游侠之首，正在于他后来折节为俭、以德报怨的转型。你若不曾改过，就永远是那个只会杀人的少年，而不是让关东豪杰延颈愿交的郭解。",
			},
			guifan: {
				reason: "改过之后复归暴力，声望崩塌，落魄街头",
				classical: "及解年长，更折节为俭，以德报怨，厚施而薄望。",
				analysis:
					"郭解的伟大在于从暴力中走了出来——折节为俭是他最艰难的一步。你改了又回去了，就等于把那层转身的勇气白白扔掉了。市井之侠靠的是信任，一旦重新拿起刀，你不再是侠，只是又一个街头打手。",
			},
			zishou: {
				reason: "自首坦白仍被族灭——追随者以你之名杀人，你便是首恶",
				classical: "解虽弗知，此罪甚于解杀之，当大逆无道。",
				analysis:
					"你以为自首能活，可律法看的不是你的心意，是结果。你的追随者以你的名义杀人，在汉律看来就是『此罪甚于解杀之』。声望是双刃剑——你享受它带来的号召力，就要承担它带来的罪责。自首救不了你，因为罪不在你做了什么，而在你是什么。",
			},
		},
		endings: {
			canon: {
				title: "游侠之死",
				kind: "canon",
				epigraph: "以侠得众，以名致死——他的存在本身，就是这个体制容不下的罪。",
			},
			if_yinxing: {
				title: "隐姓埋名",
				kind: "if",
				epigraph: "他藏起了自己，也藏起了那个让关东人延颈愿交的郭解。",
			},
			if_jiejiao: {
				title: "结交权贵",
				kind: "if",
				epigraph: "聪明人不会死，可聪明人也不会被写进《游侠列传》里。",
			},
		},
	},
	"zhuke:qunxiang": {
		key: "zhuke:qunxiang",
		title: "朱家 · 侠义之首",
		inkFile: "zhuke-qunxiang",
		deaths: {
			xianlu: {
				reason: "暴露藏匿季布之事，交出亡将，侠名尽毁",
				classical: "高祖购求布千金，敢有舍匿，罪及三族。",
				analysis:
					"藏人之所不能藏，方为侠。你交出了季布，就交出了侠的资格——千金赏赐换不来半点侠名。从此再无人敢来投奔你，因为你最该守住的那条底线，你亲手打破了。",
			},
			jiaoao: {
				reason: "夸耀功德，侠者不伐其功，一开口便失了侠的资格",
				classical: "以不伐其功、不矜其能，人皆称之。",
				analysis:
					"朱家的侠义之所以是侠义的最高境界，正在于『不伐其功、不矜其能』八个字。你一开口夸耀，那些功德就从义变成了名——义是默默的给予，名是喧嚣的索取。侠者不言功，言功则非侠。",
			},
			shoucai: {
				reason: "留有余财便生计较，不再纯粹，侠义变味",
				classical: "专趋人之急，甚己之私。",
				analysis:
					"朱家散尽家财济困，不留余财——这看似是鲁莽，实则是侠义的纯粹。一分余财便生三分计较：这个值不值得帮？那个帮了有没有回报？有了计较，侠就不是侠了，只是精明的善人。",
			},
		},
		endings: {
			canon: {
				title: "无名侠骨",
				kind: "canon",
				epigraph: "世上最深的水，是没有名字的河——他把一切都给了别人，连名字都没给自己留。",
			},
			if_xianming: {
				title: "显名于世",
				kind: "if",
				epigraph: "名声传遍了天下，可那份默默无闻的义，已经不是原来的味道了。",
			},
			if_rumen: {
				title: "入仕为官",
				kind: "if",
				epigraph: "他成了好官，可再也不是那个敢替人赌上全家性命的朱家了。",
			},
		},
	},
	"zhuanzhu:qunxiang": {
		key: "zhuanzhu:qunxiang",
		title: "专诸 · 鱼肠剑",
		inkFile: "zhuanzhu-qunxiang",
		deaths: {
			tuixie: {
				reason: "推辞刺杀之命，活了命却死了名，再无人提起",
				classical: "公子光顿首曰：光之身，子之身也。",
				analysis:
					"专诸之所以是专诸，正在于那个『士为知己者死』的决绝。你推辞了，命保住了，可你的名字也消失了——世间多了一个安分的屠户，少了一个鱼肠千古的壮士。活着不等于存在，你选了生，也选了被遗忘。",
			},
			luxian: {
				reason: "鱼肠剑行迹败露，未及近身便被斩杀",
				classical: "使专诸置匕首于炙鱼腹中而进之。",
				analysis:
					"鱼腹藏剑是整个计划的核心——一着不慎满盘皆输。你的犹豫和紧张被人看出端倪，消息走漏，王僚加强搜检。刺客没有第二次机会，泄了密就是死路一条。专诸之所以成功，正是因为他从不犹豫。",
			},
			youyi: {
				reason: "关键时刻犹豫半瞬，被亲卫先手击杀，刺杀失败",
				classical: "专诸擘鱼，因以匕首刺王僚，王僚立死。",
				analysis:
					"你走到王僚面前只差一步——手已在鱼腹之上，剑柄冰凉。可你犹豫了。就这半瞬，亲卫察觉异样，先手出刀。刺客只有一次拔剑的机会，你慢了半拍，就是生与死的差距。犹豫不是谨慎，是致命。",
			},
		},
		endings: {
			canon: {
				title: "鱼肠千古",
				kind: "canon",
				epigraph: "最短的剑，最近的路，最决绝的人——他把命交给了义字，义字把千古之名还给了他。",
			},
			if_cunhuo: {
				title: "若他不死",
				kind: "if",
				epigraph: "他活下来了，可那个一往无前的专诸，死在了那座宫殿里。",
			},
			if_buwei: {
				title: "不为刺客",
				kind: "if",
				epigraph: "刺客的刀只有一次出鞘的机会——他收了回去，就再也没有拔出来的理由了。",
			},
		},
	},
	"yurang:qunxiang": {
		key: "yurang:qunxiang",
		title: "豫让 · 吞炭漆身",
		inkFile: "yurang-qunxiang",
		deaths: {
			tuixie: {
				reason: "隐姓埋名放弃复仇，辜负知遇之恩，湮没无闻",
				classical: "豫让遁逃山中，曰：嗟乎！士为知己者死，女为悦己者容。",
				analysis:
					"智伯以国士待你，你却选择了逃避。你活了很长，可每到深夜都会想起智伯那句『先生之才，当为国士』。你选了生，也选了背叛自己的心。",
			},
			youyu: {
				reason: "漆身吞炭前犹豫退缩，复仇半途而废",
				classical: "豫让又漆身为厉，吞炭为哑，使形状不可知。",
				analysis:
					"你放下了漆，放下了炭，放下了复仇——可你永远放不下那份耻辱。豫让之所以是豫让，正因为他选了最难的那条路。你退缩了，就不再是他了。",
			},
			puming: {
				reason: "强扑赵襄子，力竭被杀，连衣角都未碰到",
				classical: "豫让拔剑三跃而呼，击之。",
				analysis:
					"你浑身溃烂、体力衰竭，却选择了最莽撞的方式。刺客需要的不只是勇气，还有耐心。你连最后那句话都没来得及说出。",
			},
			fangqi: {
				reason: "最后一刻放下匕首，放弃了复仇也放弃了自己",
				classical: "遂伏剑自杀。",
				analysis:
					"你做了这么多——漆身、吞炭、毁容、潜伏——却在最后一刻放下了刀。你放下的不是刀，是你最后一点坚持。",
			},
		},
		endings: {
			canon: {
				title: "三跃击衣",
				kind: "canon",
				epigraph: "漆身吞炭，三跃击衣——他明知杀不了，仍然去杀。这才是刺客中最悲壮的一个。",
			},
			if_zailuan: {
				title: "复仇成功",
				kind: "if",
				epigraph: "他报了仇，却成了杀人犯而不是义士——击衣三跃比真正的刺杀更伟大。",
			},
			if_weizhi: {
				title: "委质赵氏",
				kind: "if",
				epigraph: "他活成了大夫，可每到深夜都梦到智伯的头骨——他成了自己最鄙视的人。",
			},
		},
	},
	"niezheng:qunxiang": {
		key: "niezheng:qunxiang",
		title: "聂政 · 刺侠累",
		inkFile: "niezheng-qunxiang",
		deaths: {
			decline: {
				reason: "拒严仲子之托，母死后方知错过义之所托",
				classical: "老母在，政身未敢以许人也。",
				analysis:
					"你以母在为由拒绝了严仲子。母亲终会老去，可义之所托不等人。你选了孝，却丢了义——而聂政之所以是聂政，正在于他母死之后，义无反顾地去了。",
			},
			youyi: {
				reason: "刺杀时犹豫半瞬，被侠累亲卫反杀",
				classical: "聂政直入，上阶刺侠累，杀之。",
				analysis:
					"你走到侠累面前只差一步，却犹豫了。就这一瞬，亲卫围上。刺客只有一次出手的机会，你慢了半拍，就是生与死的差距。",
			},
		},
		endings: {
			canon: {
				title: "自毁面容",
				kind: "canon",
				epigraph: "他挖眼剖腹，只为不连累姐姐——可姐姐偏来认他，与他同死。",
			},
			if_cunhuo: {
				title: "隐姓埋名",
				kind: "if",
				epigraph: "他活下来了，可那个一往无前的聂政，死在了韩相府中。",
			},
			if_buxing: {
				title: "不毁面容",
				kind: "if",
				epigraph: "他没毁容，姐姐立刻被认出——义与亲，终究两难全。",
			},
		},
	},
	"jingke:qunxiang": {
		key: "jingke:qunxiang",
		title: "荆轲 · 刺秦王",
		inkFile: "jingke-qunxiang",
		deaths: {
			zaojin: {
				reason: "操之过急，未经周密谋划便仓促上路",
				classical: "太子曰：今行而毋信，则秦未可亲也。",
				analysis:
					"你急功近利，没有准备好信物就出发。秦王不会接见一个空手而来的燕国使者——刺客需要的不只是勇气，还有耐心和筹谋。",
			},
			wuyang: {
				reason: "秦舞阳殿前失色暴露，刺杀计划功亏一篑",
				classical: "秦舞阳色变振恐，群臣怪之。",
				analysis:
					"秦舞阳在殿前吓得发抖，秦王起了疑心。你本该一个人去——刺客的搭档若不可靠，比孤身一人更危险。",
			},
		},
		endings: {
			canon: {
				title: "图穷匕见",
				kind: "canon",
				epigraph: "风萧萧兮易水寒，壮士一去兮不复还——最著名的刺客，最悲壮的失败。",
			},
			if_chenggong: {
				title: "若他成功",
				kind: "if",
				epigraph: "秦王死了——可六国真的能因此存续吗？历史的走向，不是一个刺客能改变的。",
			},
			if_buqu: {
				title: "不渡易水",
				kind: "if",
				epigraph: "他留在了燕国，可秦军的铁骑不会因为一个刺客的缺席而停下。",
			},
		},
	},
	"jumeng:qunxiang": {
		key: "jumeng:qunxiang",
		title: "剧孟 · 以任侠显",
		inkFile: "jumeng-qunxiang",
		deaths: {
			panluan: {
				reason: "暗助吴王，七国兵败后受株连",
				classical: "吴楚举大事而不求剧孟，吾知其无能为已矣。",
				analysis:
					"你站错了队。剧孟之所以被天下看重，正因为他站在了周亚夫一边——若他助了吴楚，不过是又一个叛臣。侠者的眼光，不在刀上，在人心。",
			},
			tancai: {
				reason: "贪恋家财，侠义变质，声望尽毁",
				classical: "剧孟行大类朱家而好博，多少年之戏。",
				analysis:
					"你留了余财，便生了计较。有了计较，侠就不是侠了。剧孟散尽家财不是鲁莽，而是侠义的纯粹——你留了退路，也就断了侠路。",
			},
		},
		endings: {
			canon: {
				title: "家无余财",
				kind: "canon",
				epigraph: "母丧千乘来送，死后家无余财——他不靠钱立名，靠的是信义二字。",
			},
			if_rumen: {
				title: "入仕为官",
				kind: "if",
				epigraph: "他做了官，可那个散尽家财的剧孟，已经死在了洛阳的市井里。",
			},
			if_yinxing: {
				title: "隐姓埋名",
				kind: "if",
				epigraph: "他消失了——可七国乱后，再没有人能像他一样一呼千应。",
			},
		},
	},
};
