// 系列 qin · 大秦帝国。死亡文案单一数据源。
import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";
import qshihuangQinSource from "../ink/qshihuang-qin.ink?raw";
import lisiQinSource from "../ink/lisi-qin.ink?raw";
import jingkeQinSource from "../ink/jingke-qin.ink?raw";
import lvbuweiQinSource from "../ink/lvbuwei-qin.ink?raw";
import mengtianQinSource from "../ink/mengtian-qin.ink?raw";
import miaogongQinSource from "../ink/miaogong-qin.ink?raw";
import extraQinmuBailixiSource from "../ink/extras/extra-qinmu-bailixi.ink?raw";
import extraQinmuShimaSource from "../ink/extras/extra-qinmu-shima.ink?raw";
import extraQinmuYouyuSource from "../ink/extras/extra-qinmu-youyu.ink?raw";

export const qinInkStories: Record<string, InkStoryConfig> = {
	"qshihuang:qin": {
		key: "qshihuang:qin",
		title: "千古一帝 · 秦始皇",
		source: qshihuangQinSource,
		precompiled: false,
		deaths: {
			zhulv: {
				reason: "尽逐客卿、诛相失士，扫六合无人可用",
				classical: "臣闻吏议逐客，窃以为过矣……向使四君却客而不内，疏士而不用，是使国无富利之实而秦无强大之名也。",
				analysis:
					"史上的秦王一度下逐客令,读了李斯《谏逐客书》便立罢其令、复其官——『泰山不让土壤,故能成其大』。你若真逐尽客卿、诛相绝士,秦廷便空了:蒙恬、王翦、尉缭、李斯这些扫六合的人,一个都留不住。",
			},
			cuohuan: {
				reason: "冠礼之日犹豫不决，被嫪毐先发制人",
				classical: "王知之，令相国昌平君、昌文君发卒攻毐。",
				analysis:
					"史上的嬴政在亲政第一战就展示了铁血决断——蕲年宫之变，先发制人平叛。政治斗争中犹豫就是死亡，等敌人动手你再想应对，王冠还没戴上就已经掉了。",
			},
			liubuwei_keep: {
				reason: "感念旧恩留吕不韦为相，终被其势力架空",
				classical: "十年，相国吕不韦坐嫪毐免。",
				analysis:
					"仲父之恩与帝王之权不可共存。史上的嬴政在嫪毐案后立刻罢免吕不韦、步步紧逼直至饮鸩——对权臣的仁慈就是对自己的残忍，卧榻之侧岂容一个能左右王位的商人酣睡。",
			},
			fenfeng: {
				reason: "从王绾之议复行分封，春秋战国战乱重演",
				classical: "天下共苦战斗不休，以有侯王。赖宗庙，天下初定，又复立国，是树兵也。",
				analysis:
					"废分封行郡县是始皇最有远见的一笔。周鉴不远——诸侯一旦立国，数代之后便相攻如仇雠。你若退回去走周的老路，那五百年战乱便白打了，大一统要再等数百年。",
			},
			nofenshu: {
				reason: "容百家横议，六国遗老借古非今，统一根基动摇",
				classical: "今诸生不师今而学古，以非当世，惑乱黔首。",
				analysis:
					"焚书是暴政，但有其政治逻辑——新生的统一帝国需要思想一统，六国遗民需要被纳入新的秩序。在那只看得到当下的时代，你若完全容让，六国离心力量便无法被压制，秦可能早早崩塌。这是暴举，也是无奈之举。",
			},
			overburn: {
				reason: "连医药农书一并焚毁，愚民之策自毁根基",
				classical: "所不去者，医药卜筮种树之书。",
				analysis:
					"史上始皇尚留医药卜筮种树等实用之书不烧——他要统一的是政治思想，不是毁掉文明。你若连实用之书也烧，便是纯粹的愚民暴政，天下苦秦之烈更猛，帝国必速亡。",
			},
		},
		endings: {
			canon: {
				title: "千古一帝",
				kind: "canon",
				epigraph: "历史上没有完人，但做到这一步的——千古之下，也只你一人。",
			},
			if_wanshi: {
				title: "功过一线",
				kind: "if",
				epigraph: "功过是非，从来就在一线之间。",
			},
			if_yizhao: {
				title: "遗诏传贤",
				kind: "if",
				epigraph: "帝国的命被你临终一口气续上——能续多久，是另一卷没人写过的书。",
			},
		},
	},
	"lisi:qin": {
		key: "lisi:qin",
		title: "仓中鼠 · 李斯",
		source: lisiQinSource,
		precompiled: false,
		deaths: {
			huixiang: {
				reason: "逐客令下认命回乡，仓鼠之梦碎于半途",
				classical: "李斯乃上《谏逐客书》……秦王乃除逐客之令，复李斯官，卒用其计谋。",
				analysis:
					"厕鼠仓鼠之辩是李斯一生的起点——他信『在所自处』，所以不会在逆境认命。史上的李斯在被逐的路上愤然写下千古名篇《谏逐客书》，一篇文章扭转了自己的命运，也改变了秦国的命运。认命了，就不是那个李斯了。",
			},
			ju_zhaogao: {
				reason: "厉声拒绝沙丘之谋，被赵高先杀后改诏",
				classical: "斯乃仰天而叹，垂泪太息曰：嗟乎！独遭乱世，既以不能死，安托命哉！",
				analysis:
					"赵高蓄谋已久，他来问你不是要你同意，是要你服从或死。史上的李斯在这一刻长叹妥协——他是被权位绑住的仓鼠，不敢放弃到手的仓中粟。你若硬拒，赵高只会先除掉你再矫诏，扶苏同样救不了，只是你死得更早。这是李斯最大的悲剧：他知道这是错，但他没有死的勇气。",
			},
		},
		endings: {
			canon: {
				title: "黄犬之叹",
				kind: "canon",
				epigraph: "厕鼠仓鼠的区别，从不在仓里厕里——在于你何时知道该停下来。",
			},
			if_shuijia: {
				title: "税驾归蔡",
				kind: "if",
				epigraph: "你在上蔡终老。咽气那年，反秦的兵马正从东门外开过，向咸阳去。",
			},
			if_fengzhao: {
				title: "封还督责",
				kind: "if",
				epigraph: "史书记住了你的《谏逐客书》，也记住了那封没有督责、没有腰斩的密书。",
			},
		},
	},
	"jingke:qin": {
		key: "jingke:qin",
		title: "易水寒 · 荆轲",
		source: jingkeQinSource,
		precompiled: false,
		deaths: {
			chuaiji: {
				reason: "仓促入秦无信物无利刃，宫门被擒",
				classical: "夫樊将军，秦王购之金千斤，邑万家……诚得樊将军首与燕督亢之地图，奉献秦王，秦王必说见臣，臣乃得有以报。",
				analysis:
					"荆轲不是莽夫——他要樊於期首作信物、徐夫人匕首作利刃、秦舞阳作副手、还要等一个远方的朋友同行。刺秦是精密计划，不是匹夫之勇。你若什么都不备就冲进去，连秦王的面都见不到。",
			},
			tuici: {
				reason: "推辞使命，荆卿之名不传于后世",
				classical: "荆轲曰：此国之大事也，臣驽下，恐不足任使。",
				analysis:
					"荆轲一开始确实推辞过——他知道自己在做一件有去无回的事。但田光以死激他，太子丹顿首固请，他最终答应了。那个在燕市上旁若无人哭歌的人，一辈子都在等一个值得自己拼命的时刻。你若一直推，那个在易水边唱歌的人就从未存在过。",
			},
			dengdai: {
				reason: "久等友人不至，秦军破燕蓟城",
				classical: "荆轲有所待，欲与俱；其人居远未来，而为治行。顷之，未发，太子迟之，疑其改悔。",
				analysis:
					"荆轲等的人是谁，史上无载。但他知道太子丹的催促是不信任——他怒而辞行，宁可不等到助手也不愿被人认为怯懦。这是他的『义』。你若继续等，时机就永远错过了，刺秦计划胎死腹中。",
			},
			huangluan: {
				reason: "秦舞阳色变时你亦慌乱，事泄被擒",
				classical: "荆轲顾笑舞阳，谢曰：北蕃蛮夷之鄙人，未尝见天子，故振慑。愿大王少假借之，使得毕使于前。",
				analysis:
					"十三岁杀人的秦舞阳在秦廷吓尿了——这是整个计划最险的一刻。史上的荆轲回头一笑，一句『北蕃蛮夷之鄙人未尝见天子』轻轻化解。这一笑，是勇气也是急智，你若慌了，整个计划就在这一步败露。",
			},
			jiechi: {
				reason: "试图劫持秦王被侍卫所杀，事败",
				classical: "轲自知事不就，倚柱而笑，箕踞以骂曰：事所以不成者，以欲生劫之，必得约契以报太子也。",
				analysis:
					"这其实是历史上荆轲真正的死因——他想做曹沫，生劫秦王逼其归诸侯侵地，不是纯粹为了杀人。这个理想更高，但也给了秦王拔剑的间隙。他死前自己承认了这一点。你若选择劫持，你走上的就是他走过的那条路——刺秦失败，但名垂千古。",
			},
		},
		endings: {
			canon: {
				title: "图穷匕见",
				kind: "canon",
				epigraph: "你的剑没有刺中秦王——可你刺中了历史。",
			},
			if_daike: {
				title: "待客而发",
				kind: "if",
				epigraph: "你赢了那半息——输给了整个时代。",
			},
			if_zhici: {
				title: "劫盟效沫",
				kind: "if",
				epigraph: "立意较然，不欺其志——这一刀快意，可你的志，欺了没有？",
			},
		},
	},
	"lvbuwei:qin": {
		key: "lvbuwei:qin",
		title: "奇货可居 · 吕不韦",
		source: lvbuweiQinSource,
		precompiled: false,
		deaths: {
			lianvin: {
				reason: "以联姻替代游说华阳夫人，路线全错",
				classical: "吕不韦乃以五百金与子楚……复以五百金买奇物玩好，自奉而西游秦，求见华阳夫人姊。",
				analysis:
					"吕不韦的眼光极准——华阳夫人无子是整个棋局的关键，直接打穿这个点才是正解。你若嫁女儿搞迂回联姻，根本碰不到核心问题，千金散尽，子楚还是那个被遗忘的质子。",
			},
			fangqi: {
				reason: "觉得风险太大放弃奇货，史上无吕不韦",
				classical: "此奇货可居。",
				analysis:
					"吕不韦之所以是吕不韦，就是因为他敢把全部身家押在人人看不起的落魄质子身上。商人的胆识不在于会算账，而在于算完账之后敢不敢下注。你若不敢押，千古第一政治投资就与你无关，你只是一个普通富商。",
			},
			jujue: {
				reason: "怒拒献姬与子楚绝交，前功尽弃",
				classical: "吕不韦怒，念业已破家为子楚，欲以钓奇，乃遂献其姬。",
				analysis:
					"吕不韦真的怒了——赵姬是他的女人。但他的怒气只持续了一瞬，立刻便转过了念头：已经把全部身家投进去了，女人算什么？正是献了赵姬，才有了嬴政，才有了他作为『仲父』的根基。你若怒而绝交，前功尽弃。",
			},
			tongjian: {
				reason: "继续与太后私通，被亲政嬴政赐死",
				classical: "吕不韦恐觉祸及己，乃私求大阴人嫪毐以为舍人。",
				analysis:
					"吕不韦是清醒的——他知道和太后的私情是定时炸弹，所以主动进献嫪毐代替自己脱身。这是他精于算计的一面。你若贪恋太后而不脱身，等嬴政亲政第一个清算的就是你。",
			},
			fanpan: {
				reason: "迁蜀路上举兵叛乱，宗族尽灭",
				classical: "吕不韦自度稍侵，恐诛，乃饮酖而死。",
				analysis:
					"吕不韦算到了结局——造反必死，饮鸩尚能保全家。他是商人，到最后一刻也在算成本收益。你若鱼死网破，不仅自己车裂，宗族也保不住，连《吕氏春秋》都可能被焚。饮鸩是他最后的理智。",
			},
			shangshu: {
				reason: "上书自陈功绩求宽恕，反触王怒",
				classical: "君何功于秦？秦封君河南，食十万户。君何亲于秦？号称仲父。",
				analysis:
					"秦王的信不是在问你功不功——这是一道让你自己了断的命令。你越列功绩，秦王越觉得你居功自傲不知好歹。吕不韦看懂了，所以喝了鸩酒。你若看不懂，连体面的死法都得不到。",
			},
		},
		endings: {
			canon: {
				title: "奇货可居",
				kind: "canon",
				epigraph: "商人买货是为了卖货——帝王之业买到手，就再也卖不出去了。",
			},
			if_guishang: {
				title: "归相全身",
				kind: "if",
				epigraph: "奇货可居——可居而能舍者，古今唯你一人。",
			},
			if_buxian: {
				title: "不埋一雷",
				kind: "if",
				epigraph: "你被『请』下去，不是被『烧』下去——这一回，鸩酒没有斟上。",
			},
		},
	},
	"mengtian:qin": {
		key: "mengtian:qin",
		title: "长城将魂 · 蒙恬",
		source: mengtianQinSource,
		precompiled: false,
		deaths: {
			qibing: {
				reason: "阳周囚中起兵清君侧，北边失守匈奴南侵",
				classical: "今臣将兵三十余万，身虽囚系，其势足以倍畔，然自知必死而守义者，不敢辱先人之教，以不忘先主也。",
				analysis:
					"蒙恬自己说了：他有三十万大军，虽被囚也足以背叛——但他不反，因为『守义』。你若反，北边三十万修长城守边境的秦军内乱，匈奴必趁虚南下，十五年内迁的百姓又遭铁骑，而你蒙恬成了叛臣——长城上忠魂碑立不起来。",
			},
			chenyuan: {
				reason: "请使者带话陈冤，赵高压下不报，蒙氏灭族",
				classical: "凡臣之言，非以求免于咎也，将以谏而死，愿陛下为万民思从道也。",
				analysis:
					"蒙恬临终那段话不是求情——是死谏。他知道使者『不敢以将军言闻于上』，但他还是要说。说完他就吞药了。你若真以为辩解能活命，那就错看了赵高和二世：他们要的不是你的理由，是你的死。",
			},
		},
		endings: {
			canon: {
				title: "长城将魂",
				kind: "canon",
				epigraph: "长城还在，直道还在——那是你留给后世的纪念碑。",
			},
			if_fusu: {
				title: "按剑扶苏",
				kind: "if",
				epigraph: "你慢的从来不是胆量，是那半步先手——抢椅子的人只要先坐下。",
			},
			if_mianchen: {
				title: "面陈而死",
				kind: "if",
				epigraph: "熬过了赵高，却熬着看那个天下一寸寸塌下去——原来痛快地死，也是一种慈悲。",
			},
		},
	},
	"qinmu:qin": {
		key: "qinmu:qin",
		title: "秦缪公任好 · 霸西戎",
		source: miaogongQinSource,
		precompiled: false,
		deaths: {
			ying_bailixi: {
				reason: "弃百里傒而不用，秦终为西陲小国",
				classical: "秦闻百里傒贤，欲用之，楚不可。穆公乃以五羖羊皮赎之。",
				analysis:
					"百里傒是秦穆公用贤的起点——五张黑公羊皮赎来的不只是一个亡国奴，而是『五羖大夫』这个礼贤下士的标志。你若弃之不用，秦国便永远只是西陲的附庸，不会有后来的蹇叔、由余，更不会有霸西戎。",
			},
			wupian_attack: {
				reason: "晋饥伐晋以不义失德，反被晋所乘几亡",
				classical: "百里傒曰：天灾流行，国家代有。救灾恤邻，道也。",
				analysis:
					"救灾恤邻不是迂腐——秦予晋粟，看似吃亏，实则收了晋国的人心。后来秦饥，三百食马者以死报德，正是当初仁德的回报。你弃德用诈，虽快一时，终受其祸。",
			},
			bian_yi: {
				reason: "殽之战不听蹇叔哭师，秦三将被俘全军覆没",
				classical: "蹇叔曰：径数国千里而袭人，希有得利者。必死于殽，余收尔骨焉。",
				analysis:
					"蹇叔的哭师不是怯懦——千里袭人，师行必过殽，殽有二陵，晋人必伏。这是军势的判断，不是占卜。缪公不听，结果『无一人得脱』。你若不听谏，殽之败就在眼前。",
			},
		},
		endings: {
			canon: {
				title: "霸西戎",
				kind: "canon",
				epigraph: "百里傒、蹇叔、由余——秦之所以霸，非唯力也，亦以德。",
			},
			if_bailixi_ignored: {
				title: "弃贤西陲",
				kind: "if",
				epigraph: "五张羊皮换了一个秦伯的见识——你不肯换，那就一辈子守着西陲那片天。",
			},
			if_no_grain: {
				title: "乘危失德",
				kind: "if",
				epigraph: "秦晋之德，始于一粒粟；秦晋之怨，也始于一粒粟。",
			},
			if_no_xiao: {
				title: "不霸西戎",
				kind: "if",
				epigraph: "殽之败可免，霸西戎亦不可得——历史的幸运，从来不是免费的。",
			},
		},
	},
	// ═══ 番外 · NPC视角 ═══
	"extra:qinmu-bailixi": {
		key: "extra:qinmu-bailixi",
		title: "番外 · 五羖之前",
		source: extraQinmuBailixiSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "五羊皮换一个天下", kind: "canon", epigraph: "亡国奴、贩牛叟、五张羊皮——换来了秦国霸业的起点。" },
		},
	},
	"extra:qinmu-shima": {
		key: "extra:qinmu-shima",
		title: "番外 · 三百食马者",
		source: extraQinmuShimaSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "一碗酒换三百命", kind: "canon", epigraph: "仁德不是交易——可它就是会回来。" },
		},
	},
	"extra:qinmu-youyu": {
		key: "extra:qinmu-youyu",
		title: "番外 · 由余使秦",
		source: extraQinmuYouyuSource,
		precompiled: false,
		deaths: {},
		endings: {
			canon: { title: "戎狄来投", kind: "canon", epigraph: "一个给舞台，一个给本事——君臣相遇，不过如此。" },
		},
	},
};
