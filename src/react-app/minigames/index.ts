// 所有小游戏的统一注册入口。应用入口 (main.tsx) 只需 import 一次即可。
import { registerMinigame } from "./registry";
import { KlotskiGame } from "./klotski/KlotskiGame";
import { BambooGame } from "./bamboo/BambooGame";

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
