// 所有小游戏的统一注册入口。应用入口 (main.tsx) 只需 import 一次即可。
import { registerMinigame } from "./registry";
import { KlotskiGame } from "./klotski/KlotskiGame";
import { BambooGame } from "./bamboo/BambooGame";
import { Match3Game } from "./match3/Match3Game";
import { UnifyTextGame } from "./unify/UnifyTextGame";
import { QuyuanGame } from "./quyuan/QuyuanGame";
import { ChannelGame } from "./channel/ChannelGame";
import { AstroGame } from "./astro/AstroGame";
import { FormationGame } from "./formation/FormationGame";
import { LinxiangruGame } from "./linxiangru/LinxiangruGame";
import { LogisticsGame } from "./logistics/LogisticsGame";
import { DingGame } from "./ding/DingGame";
import { PointGame } from "./point/PointGame";
import { ArrowGame } from "./arrow/ArrowGame";
import { CardGame } from "./card/CardGame";
import { ForgeGame } from "./forge/ForgeGame";
import { BeaconGame } from "./beacon/BeaconGame";
import { ZonghengGame } from "./zongheng/ZonghengGame";
import { ZhuhouGame } from "./zhuhou/ZhuhouGame";

// ── 华容道（鸿门脱险/垓下突围） ──
// 关卡难度：easy=近侍开路 / mid=鸿门脱险 / hard=垓下突围
registerMinigame({
	id: "klotski_hongmen",
	Component: KlotskiGame,
	meta: {
		title: "鸿门脱险",
		historyNote: "公元前206年，鸿门宴上刀光剑影，沛公需在项庄舞剑的间隙溜出军帐——如同这盘滑块，寻一条生路。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});
registerMinigame({
	id: "klotski_gaixia",
	Component: KlotskiGame,
	meta: {
		title: "垓下突围",
		historyNote: "公元前202年，项羽被困垓下，四面楚歌。能不能率二十八骑从重围中冲出一条血路？滑块之局，正是霸王末路之困。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

// 关卡快捷入口（作者写 ink 时可以直接 #minigame:klotski:easy 用）
registerMinigame({
	id: "klotski",
	Component: KlotskiGame,
	meta: {
		title: "滑块脱困",
		historyNote: "将主块滑出底部出口——历史的关键往往在几步挪移之间。",
		difficulty: 2,
		modes: ["free"],
	},
});

// ── 竹简缀合（原文排序） ──
registerMinigame({
	id: "bamboo",
	Component: BambooGame,
	meta: {
		title: "竹简缀合",
		historyNote: "竹简散乱，简牍失次——请依《史记》原文顺序将它们缀合起来。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// 注：ink 里可以这样写：
//   #minigame:bamboo                 → 默认按 storyKey 选章节
//   #minigame:bamboo:47:0:5          → juan=47(孔子世家), segIndex=0, 5简

// ── 楚汉线既有的标志性幕挂点（原为预留标签，现落地为具体游戏）──
// 鸿门脱险（刘邦/张良/项羽线通用短标签）
registerMinigame({
	id: "hongmen",
	Component: KlotskiGame,
	meta: {
		title: "鸿门脱险",
		historyNote: "鸿门宴上项庄舞剑，意在沛公——趁隙滑出重围，间至军中。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});
// 井陉背水（韩信线）：陷之死地而后生，突出重围
registerMinigame({
	id: "jingxing",
	Component: KlotskiGame,
	meta: {
		title: "井陉 · 背水阵",
		historyNote: "韩信背水列阵，置之死地而后生——从赵军合围中挪出一条活路。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});
// 圯上受书（张良线）：拾履进履，缀《太公兵法》残简
registerMinigame({
	id: "yishang",
	Component: BambooGame,
	meta: {
		title: "圯上 · 受书",
		historyNote: "圯上老人三试张良，授《太公兵法》——请依原文缀合这卷改命的残简。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 涿鹿珠阵（Match-3 三消，黄帝线） ──
// 关卡：zhuolu_1 破雾 / zhuolu_2 指南 / zhuolu_3 擒蚩
// 蚩尤布「九黎玉珠阵」作雾困军，玩家连缀同色玉珠破阵，破阵成功=指南车辨向。
registerMinigame({
	id: "match3",
	Component: Match3Game,
	meta: {
		title: "涿鹿珠阵",
		historyNote: "蚩尤作大雾，黄帝造指南车破之。九黎玉珠布阵，连缀同色可破。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 统一文字（汉字匹配，秦始皇线） ──
registerMinigame({
	id: "unify",
	Component: UnifyTextGame,
	meta: {
		title: "统一文字",
		historyNote: "秦并天下，李斯奏请同文字——六国异体字尽归小篆，书同文乃大一统之基。",
		difficulty: 1,
		modes: ["canon", "free", "strict"],
	},
});

// ── 屈原问天（选词填空，屈原线） ──
registerMinigame({
	id: "quyuan",
	Component: QuyuanGame,
	meta: {
		title: "屈原问天",
		historyNote: "屈原放逐，忧心愁悴，作《天问》以抒愤——遂古之初，谁传道之？",
		difficulty: 1,
		modes: ["canon", "free", "strict"],
	},
});

// ── 治水疏渠（管道拼接，大禹治水线） ──
registerMinigame({
	id: "channel",
	Component: ChannelGame,
	meta: {
		title: "治水疏渠",
		historyNote: "禹之治水，改堵为疏——凿山通川，导水入海。旋转渠管，引洪归流。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 星象授时（记忆匹配，黄帝/帝尧线） ──
registerMinigame({
	id: "astro",
	Component: AstroGame,
	meta: {
		title: "星象授时",
		historyNote: "帝尧命羲和敬授民时——日中星鸟，以殷仲春。观星宿，配节气，四时乃定。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 排兵布阵（指令序列，孙武练兵线） ──
registerMinigame({
	id: "formation",
	Component: FormationGame,
	meta: {
		title: "排兵布阵",
		historyNote: "孙武练兵，斩吴王宠姬以明军令——兵者，严令而后行。排布指令，布阵成军。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 完璧归赵（潜行时机，蔺相如线） ──
// 关卡：param=1 初出秦廷（3兵·视线2·无柱） / param=2 暗度回廊（4兵·视线3·少量柱） / param=3 间道归赵（5兵·视线3·多柱）
registerMinigame({
	id: "linxiangru",
	Component: LinxiangruGame,
	meta: {
		title: "完璧归赵",
		historyNote: "蔺相如持和氏璧入秦，察秦王无意偿城，乃使人持璧间行归赵——潜行避秦兵耳目，间至东门而出。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

registerMinigame({
	id: "wanbigui_zhao",
	Component: LinxiangruGame,
	meta: {
		title: "完璧归赵 · 潜行",
		historyNote: "秦廷之上刀光剑影，蔺相如怀璧潜出——避开秦兵巡逻视线，方能间道归赵。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

// ── 粮草调度（资源策略分配，战争线通用） ──
// 关卡：param=1 官渡引子 / param=2 赤壁联军 / param=3 垓下决胜
registerMinigame({
	id: "logistics",
	Component: LogisticsGame,
	meta: {
		title: "粮草调度",
		historyNote: "三军未动，粮草先行。分配有限之粮、械、兵于三条战线，满足供给目标，方可稳操胜券。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

// 各战线下的快捷挂点
registerMinigame({
	id: "guandu_liangcao",
	Component: LogisticsGame,
	meta: {
		title: "官渡 · 粮草调度",
		historyNote: "建安五年，官渡对峙。袁绍军盛而粮多，曹公兵少——善用粮草，可转弱为强。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

registerMinigame({
	id: "chibi_liangcao",
	Component: LogisticsGame,
	meta: {
		title: "赤壁 · 联军调度",
		historyNote: "建安十三年，赤壁连营。孙刘联军五万敌曹公二十万——调度得当，可破连环。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

registerMinigame({
	id: "gaixia_liangcao",
	Component: LogisticsGame,
	meta: {
		title: "垓下 · 决胜调度",
		historyNote: "汉五年，垓下之围。项王兵少食尽，汉军五路合围——毫厘调度，定楚亡汉兴。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

// ── 铸鼎定鼎（拼图组装，大禹/商汤） ──
registerMinigame({
	id: "ding",
	Component: DingGame,
	meta: {
		title: "铸鼎定鼎",
		historyNote: "禹收九牧之金，铸九鼎定九州——拼合散碎的鼎片，重铸镇国之宝。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 点兵升将（2048物理合成，战争线通用） ──
registerMinigame({
	id: "point",
	Component: PointGame,
	meta: {
		title: "点兵升将",
		historyNote: "同阶兵卒可合为更高级将——兵→什长→百夫→千户→校尉→偏将→上将，合出上将而胜。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 箭雨齐射（祖玛消除，战争线通用） ──
registerMinigame({
	id: "arrow",
	Component: ArrowGame,
	meta: {
		title: "箭雨齐射",
		historyNote: "弓箭手列阵齐发，同色敌兵相撞自溃——连珠箭落，万军辟易。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 竹简牌局（牌九博弈，谋士线通用） ──
registerMinigame({
	id: "card",
	Component: CardGame,
	meta: {
		title: "竹简牌局",
		historyNote: "谋士以竹简为牌，论道博弈——天地人马一二三四五六七八九，牌大者胜。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 铁匠锻兵（合成+时间，铸剑线） ──
registerMinigame({
	id: "forge",
	Component: ForgeGame,
	meta: {
		title: "铁匠锻兵",
		historyNote: "铜锡合炼为青铜，铁炭合淬为精钢——炉前锻兵，时辰一到须成器。",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 烽火传信（节奏连击，周幽王/军事线） ──
registerMinigame({
	id: "beacon",
	Component: BeaconGame,
	meta: {
		title: "烽火传信",
		historyNote: "幽王烽火戏诸侯——骊山台上狼烟起，诸侯见火当率师勤王。精准击键，点燃每一座烽火台！",
		difficulty: 2,
		modes: ["canon", "free", "strict"],
	},
});

// ── 完璧归赵（潜行时机，蔺相如线，三星） ──
registerMinigame({
	id: "linxiangru",
	Component: LinxiangruGame,
	meta: {
		title: "完璧归赵",
		historyNote: "蔺相如持和氏璧间行归赵——避开秦兵巡逻视线，自秦廷安然返抵赵国。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});
registerMinigame({
	id: "wanbigui_zhao",
	Component: LinxiangruGame,
	meta: {
		title: "完璧归赵",
		historyNote: "相如度秦王虽斋，决负约不偿城，乃使其从者衣褐，怀其璧，从径道亡，归璧于赵。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

// ── 粮草调度（资源策略，战争线通用，三星） ──
registerMinigame({
	id: "logistics",
	Component: LogisticsGame,
	meta: {
		title: "粮草调度",
		historyNote: "三军未动，粮草先行——分配粮、械、兵至左中右三军，供给足则三军胜。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});
registerMinigame({
	id: "guandu_liangcao",
	Component: LogisticsGame,
	meta: {
		title: "官渡·粮草",
		historyNote: "曹操袭乌巢，袁绍断粮——此调度成败，即官渡胜负之分。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});
registerMinigame({
	id: "chibi_liangcao",
	Component: LogisticsGame,
	meta: {
		title: "赤壁·粮草",
		historyNote: "孙刘联军抗曹，粮草乃持久之本——足食足兵，方可待火攻之机。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});
registerMinigame({
	id: "gaixia_liangcao",
	Component: LogisticsGame,
	meta: {
		title: "垓下·粮草",
		historyNote: "韩信三十万之众围项羽垓下——数十万兵食，非精于调度者不能济。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

// ── 连横破纵（卡牌策略，张仪/苏秦线，三星） ──
registerMinigame({
	id: "zongheng",
	Component: ZonghengGame,
	meta: {
		title: "连横破纵",
		historyNote: "苏秦合纵六国抗秦，张仪连横破之——齐楚燕赵，纵横之局，以牌会之。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});

// ── 诸侯争霸（棋盘策略，楚汉/战国线，三星） ──
registerMinigame({
	id: "zhuhou",
	Component: ZhuhouGame,
	meta: {
		title: "诸侯争霸",
		historyNote: "诸侯纷争，逐鹿中原——落子夹击以翻对方之城邑，天下终定于一。",
		difficulty: 3,
		modes: ["canon", "free", "strict"],
	},
});
