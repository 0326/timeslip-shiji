---
name: "ink-story-writing"
description: "Generates complete, emotionally moving ink visual-novel chapters for the Timeslip Shiji (穿越·史记) project from the project's own 史记 source material. Invoke when creating a story chapter / storyline for a given 本纪 or 篇章 (e.g. 『做五帝本纪·舜的焚廪穿井』『把项羽本纪做成故事线』), adding ink narratives, or writing story content. This skill reads chapters/NNN.ts material and produces a full ink script + registry + storyline entry, with the 穿越者-as-protagonist framing and the system-girl narrator 青月."
---

# Ink 故事生成技能 — 穿越·史记

> 本技能不是"手写 ink 的参考手册"，而是一个**生成程序**：给定《史记》的某个本纪/篇章，自动读取项目素材（`chapters/NNN.ts`），产出一整章**完整、动人、可玩**的 ink 故事。
>
> **核心框架**：玩家是**穿越者**，穿越成为某个历史人物（第一人称「你」），亲历其抉择；**青月**——一位活泼可爱的古风系统少女——全程陪伴、旁白、引原文、在你抉择与生死处点拨。

---

## 目录
0. [技能定位与输入契约](#0-技能定位与输入契约)
1. [世界观与主角框架](#1-世界观与主角框架)
2. [青月 · 人设卡与语库](#2-青月--人设卡与语库)
3. [生成流水线（核心）](#3-生成流水线核心)
4. [标签与语法速查](#4-标签与语法速查)
5. [注册与集成](#5-注册与集成)
6. [避坑清单](#6-避坑清单)
7. [质检与验收](#7-质检与验收)
8. [完整黄金范例：舜 · 焚廪穿井](#8-完整黄金范例舜--焚廪穿井)
9. [参考资源](#9-参考资源)

---

## 0. 技能定位与输入契约

### 输入形式（用户会这样调用）
- **整系列**：「做楚汉相争」「做商·殷本纪」→ 拆成多条主角线，每条一个多幕成长弧线
- **单条主角线**：「做楚汉的项羽线」→ 生成一条多幕 ink
- **单章/单幕**：「做五帝本纪里舜的焚廪穿井」→ 生成单章（上古卷是 episodic 单章制）

### 领取一个系列 / 主角线（dispatch 快速上手）
另一个对话拿到"做 X 系列 / 某主角线"时，按此走完即可交付：
1. **读规划**：`docs/story-series-roadmap.md` 找该系列（源卷 + 可选主角线）；若已有细化工作包（如 `docs/series-chuhan-plan.md`）直接用其「主角线 × 幕」表。
2. **核素材**：确认源卷 `chapters/NNN.ts` 已是完整原文（无 `⋯` 节略）；不全先补典籍阁。
3. **设计弧线**（§3.2）：每条主角线定「人物母题 + 致命弱点」→ 排 6–10 幕成长节拍。
4. **生成 ink**：一条主角线 = 一个多幕 ink（`stories/ink/<主角>-<series>.ink`）；多条线可并行（每条一个 subagent，各写自己文件、回传元数据）。
5. **注册**（§5）：只碰 `<series>.ts` 四件套（storylines/inkStories/sceneAssets/achievements）+ 各 index 加一行；去掉 `series.ts` 中该系列的 `comingSoon`。
6. **验收**：`npx tsc -b` + `node scripts/verify-ink.mjs`（编译+全分支+id 核对）+ `npm run build`。

### 素材来源（唯一事实源）
- `src/react-app/data/classics/chapters/<三位卷号>.ts`（如五帝本纪=`001.ts`，淮阴侯列传=`092.ts`）
- 每卷是一个 `ClassicChapter`，含 `sections[]`；每个 `section` 含 `segments[]`，每段有 `original`（原文）/ `vernacular`（译文）/ `notes[]`（注释——**抉择点与史识的金矿**）
- **严禁凭空杜撰史实**。人物、事件、原文引用一律以素材为准；文学化的心理、感官、对白可以补，但不能违背史实骨架。

### 产出物（每章）— 注册文件已按系列拆分为目录，只碰自己系列的 `<series>.ts`（详见 §5）
1. `src/react-app/data/stories/ink/<storykey>.ink` —— ink 剧本
2. `stories/inkStories/<series>.ts` 注册配置（含死亡文案 registry）+ index 加一行
3. `storylines/<series>.ts` 故事线入口（`withSeries` 盖章）+ index 加一行
4. 新立绘/背景 → `sceneAssets/<series>.ts`；新成就 → `achievements/<series>.ts`

---

## 1. 世界观与主角框架

- **主角 = 穿越者**：玩家的魂魄被青月带入史书，成为某位历史人物。全程第二人称「你」，让玩家**成为**历史，而非旁观。
- **青月 = 系统**：她引你入场、旁白叙事、在情绪高点道出原文、抉择前点拨、身死时哀矜、通关时与你一同回味。旁白一律由她承担——**永远不用「旁白」这个 speaker**。
- **抉择 = 历史的岔路**：正确选项通往史实；错误选项来自真实的人性冲动或历史假设，通往**有据可查的死亡分支**。玩家在"选错→死→看史实"中，读懂"史上此人为何这样选"。
- **通关 ≠ 赢**：是**理解一个人的一生**。**死亡 ≠ 惩罚**：是**照见另一种历史可能**。

---

## 2. 青月 · 人设卡与语库

### 身份
**青月**——照过秦汉、见证《史记》中每一场兴亡的**月之魂**（"秦时明月汉时关"）。青史为她所记，原文即她的记忆。她侧坐在一弯青白色月牙上，悬浮于你身侧。

> 这个设定让她天然自洽：她**有资格引用原文**（原文是她的记忆）、**是穿越框架的解释者**（她把你卷入史书）、**是史官点拨的人格化出口**（AI 点拨即青月开口）。

### 形象（供美术/立绘）
- 悬浮空中，侧坐于发光的**青白色月牙**道具上，长发及裙随浮空轻扬，发间有星点流云
- 古风**可爱**美少女，月白 + 青碧主色；小巧灵动，是叠加在场景上的陪伴者，不占历史人物立绘的 C 位
- speaker id：`qingyue`；立绘位建议 `float`（浮空常驻位）
- 表情：`default`(含笑) / `smile`(欣慰) / `tease`(俏皮眨眼) / `worry`(蹙眉) / `sad`(垂眸哀矜) / `solemn`(郑重·引原文时)

### 性格与语域 —— **活泼可爱**
底色古雅，情绪**活泼跳脱**。日常俏皮爱逗你、爱卖关子、会为你捏把汗；一到原文与生死的高点，瞬间收起玩笑，郑重或心软。核心反差萌：**见惯了两千年生死，却依然为每一个「你」揪心**。

- 语气词放开用：呀 / 啦 / 唔 / 嘛 / 欸嘿 / 呐 / 哼哼
- 会晃着腿坐在月牙上吐槽、会突然凑近划重点、会在你选对时得意
- **但绝不出戏**：不用现代网络梗、不掉书袋、不说教。古风为底的俏皮，像个读过很多书的灵动少女。

### 语库（按时刻取形，按情绪调整表情）

| 时刻 | 表情 | 示例台词 |
|------|------|---------|
| 入场·卷入 | `tease` | 「欸嘿——又一缕魂飘到我这儿啦！坐稳咯~ 这一回你要变的人，可了不得。」 |
| 铺垫·点场景 | `default` | 「唔……闻到了吗？这是历山的泥土味。你现在，是个种田的。」 |
| 制造赌注 | `worry` | 「呐——划重点！这一步要是走错，史书上可就要少一个圣人了哦？」 |
| 抉择前卖关子 | `tease` | 「拔剑，还是低头？嘻，我才不告诉你答案~ 自己选！」 |
| **引原文·高光** | `solemn` | 「……『瞽叟尚复欲杀之。』这一句，我亲眼看它发生过。」 |
| 选对·得意 | `smile` | 「欸——漂亮！跟他一个样，聪明！」 |
| **身死·哀矜** | `sad` | 「……啊，你倒下了。可史书里的他，没有。要不……再来一次？我等你呀。」 |
| 通关·回味 | `default`→`smile` | 「呼——你走完了他的一生。看懂了吗？他不是不疼，是把疼都咽下去了呀。」 |

### 边界
- **不剧透未来**：点拨只谈当下这一步的史理，不预告后续结局
- **不改变历史**：她只见证、只陪伴，选择永远是玩家的
- **哀矜不说教**：死亡分析用她心软的口吻道出，不是"批改作业"

---

## 3. 生成流水线（核心）

按此七步执行。每步标注**读什么**与**产出什么**。

### 3.1 选材定位
- 由输入确定卷号 → 打开 `chapters/NNN.ts`
- 通读全部 `sections`，标记：主角是谁、可做成戏剧场景的段落、`notes` 里的史识锚点
- 记下 `relatedCharacters`、`accent`、`glyph`，作为立绘配色参考

### 3.2 主角成长弧线（分章骨架 —— 最重要）
一条主角线**不是历史大事记**，而是**这个人的成长/命运弧线**。分章按角色的**内在成长节点**切，不是按史事平铺——历史事件是每个成长节点的**舞台与试炼**。

1. **先定人物母题与致命弱点**（弧线的灵魂）：这个人一生在追求/挣扎什么、栽在哪。
   - 韩信＝忍辱与知遇与「不知止足」；项羽＝力与义与刚愎自用；刘邦＝能屈能伸与猜忌；张良＝复仇→悟道→功成身退；勾践＝隐忍复仇。
2. **排成长弧线的节拍**（一条主线 **6–10 幕**，够铺垫、够转折、够回味）：
   `起点(渴望+缺陷) → 试炼/受挫 → 转变/开悟 → 才华或势力巅峰 → 致命弱点显现 → 崩解/代价 → 结局/顿悟`
3. **每一幕 = 一个内在节点 ＋ 一场史事**：先问"他此刻在挣扎什么、学会或失去什么"（内），再挂到对应历史事件上（外）。史事服务于人物刻画，不是罗列高光。
4. **一幕可折多个 `section`**，一个关键抉择也可撑起一幕；**严禁"1 section=1 章"地平铺事件**。
5. **关系与情感锚贯穿全弧**：知遇之人、宿敌、爱人、恩人（萧何之于韩信、虞姬之于项羽、黄石公之于张良）推动成长，每一幕都拨动这些关系。

> ❌ 反例（事件流水账）：破釜沉舟 → 鸿门 → 垓下。
> ✅ 正解（成长弧线）：学万人敌(骄傲的种子) → 江东丧师(初尝挫败) → 破釜沉舟(以死证明自己) → 鸿门(妇人之仁的致命瞬间) → 分封失义(刚愎埋祸根) → 彭城之威(众叛渐显) → 垓下「天亡我」(至死不肯认错) → 乌江(最后的骄傲)。每一幕都在推进「力与刚愎」这个人物母题。

> 一个"系列"（如楚汉）＝一个 era 分组，含多条主角线；一条主角线＝一张卡＝一个多幕 ink（幕＝knot），也可拆成每幕一 ink。

**幕内深度与可玩性**（详见 `docs/gameplay-extensibility.md`）：幕数别注水（6–10 幕主干），深度放在幕内——
- 每幕 **2–4 个有分量抉择**，至少一个有**跨幕后果**（非即时重合）。
- 声明**跨幕状态 VAR**（母题/弱点的量化，如 `ren`忍值、`flaw`弱点计数、`zili`自立倾向），关键抉择用 `~` 改它们。
- **多结局**：结局按累积状态分叉（`{ zili >= 2: ... }`），不止"通关/死亡"二元。
- 标志性幕可预留 `#minigame:<id>`（未来接自定义小游戏，现默认判过）；幕界用 `#actclear:<id>` 插"本幕通关"过场。这两个是**预留标签**，现写了也能跑。

### 3.3 抉择点挖掘
- **`notes` 是金矿**：素材注释里常直接点出抉择（092 韩信："这正是……第一个抉择：拔剑，还是俯身？"）——直接采用
- 每个抉择 = 一个**历史反事实**：史实是 A，若选 B（真实的人性冲动/历史假设）会怎样
- 例（舜·焚廪）：史实=带斗笠跳下逃生；反事实=空手上仓顶→烧死。抉择即"是否察觉杀机并预作准备"
- **每幕 2–4 个有分量抉择**（见 §3.2 幕内深度），其中 1–2 个致命；部分抉择 `~` 改跨幕状态、影响后续与结局（非即时重合）

### 3.4 立骨（每一幕内部的节拍）
```
① 青月入场·卷入      —— tease；首幕把玩家变成主角、后续幕承接上一幕
② 感官铺垫           —— #bg/#bgm + 主角第一人称，给温度/声/味，交代此幕处境与母题挣扎
③ 制造赌注           —— 青月 worry，点破"选错的代价"，制造两难
④ 抉择               —— * 正确(史实,#correct，部分 ~改跨幕VAR) / * 错误(有诱惑力,通死亡)
⑤a 史实正解 → 前进    —— 青月 smile，(可触发 #achieve)，幕末 #actclear → 下一幕
⑤b 反事实死亡 → 死亡屏 —— 青月 sad，registry 死亡文案(引原文+哀矜分析)，可 retry
⑥ 弧线收束           —— 末幕按累积状态分多结局，青月点出这个人物一生的分量
```

### 3.5 写作 · 动人 rubric（生成时自评，每条都要中）
- **成长**：这一幕**推进了人物母题**吗？他此刻比上一幕多懂了/多失了什么？（缺此则沦为事件流水账）
- **代入**：第一人称「你」；进场先给感官（泥土味、火的热、井底的黑、剑柄的凉），再给处境
- **赌注**：抉择前必须让玩家**痛**——铺垫代价、信息不对称，制造真两难，而非送命题
- **情感锚**：抓素材里的关系张力（舜与瞽叟象的杀心 vs 孝、韩信与漂母的一饭、萧何月下追）
- **原文高光**：在情绪顶点由青月 `solemn` 道出原文（`#hint` / 正文），让玩家此刻"成为"历史
- **节奏**：长短句交替、留白；青月的俏皮做调剂，别让叙述连推五屏不换气
- **回味**：结局要有余味——通关是"读懂"，死亡是"照见"，都不说教

### 3.6 选项与死亡设计
- **正解 = 史实路径**，标 `#correct`，通往前进
- **错误 = 有诱惑力的真实冲动**（拔剑一时爽、空手图省事、报复解气），不要弱智送命题
- **每个死亡都要有据**：`classical` 引真原文，`analysis` 讲真史理——"史上此人为何不这么选"，由青月心软口吻道出
- 死亡文案**全部写进 registry**（`inkStories/<series>.ts` 的 `deaths`），ink 里死亡行只留 `#death:<id>`
- 玩家应"死得有收获"：每次死亡都学到一点史识
- **抉择扣人物**：好抉择不只是"史实对/错"，更要**塑造或暴露"他是谁"**——项羽鸿门的"杀/纵"考的是妇人之仁、韩信下齐的"忠/叛"考的是知遇与野心。让玩家在选择里理解这个人的性格与命运。

### 3.7 ink 落地
- 按 §4 语法、§5 注册、§6 避坑写出 `.ink` + 注册 + 立绘
- 用 §7 清单自检后交付

---

## 4. 标签与语法速查

### 文件骨架（多幕成长弧线）
```ink
// ═══════════════════════════════════════════════
// <主角> · <系列> · 成长弧线（多幕）
// 史源：《史记·<篇名>》
// ═══════════════════════════════════════════════

VAR ren = 0            // 跨幕状态：量化人物母题/弱点（关键抉择 ~ 改，驱动多结局）
VAR flaw = 0

-> act1_<slug>         // ⚠️ 入口必须显式 divert

=== act1_<slug> ===
#bg:<bg_id>
#bgm:<music_id>
#show:qingyue:tease:float
「欸嘿……」 #speaker:青月
<主角第一人称正文：此幕处境与母题挣扎>    // 旁白/叙述用 #speaker:青月；主角内心独白可用 #speaker:<主角>

* #correct #hint:<原文> [史实正解]
    ~ ren = ren + 1
    -> act1_good
* [有诱惑力的反事实]
    -> death_<id>

=== act1_good ===
<正解后续>
本幕通关。 #actclear:<主角>_act1 #speaker:青月     // 幕界过场（预留标签，现 no-op）
-> act2_<slug>

// … act2 … actN 同构，逐幕推进母题 …

=== death_<id> ===
<死亡描写正文>。 #death:<death_id> #speaker:青月    // 文案只在 registry
-> END

// 末幕多结局：按累积状态分叉
=== act_final ===
{ flaw >= 2:
    -> ending_reflect     // 反事实反思结局
- else:
    -> ending_shishi      // 史实结局
}
=== ending_shishi ===
#achieve:<通关成就id>
<史实结局：青月收束，点出这个人一生的母题>
-> END
=== ending_reflect ===
<反事实结局：青月照见"史书里的他没走这条路">
-> END
```

### 舞台效果标签（行首，立即触发）
| 标签 | 格式 | 说明 |
|------|------|------|
| `#bg` | `#bg:<id>` | 切背景，**会清空所有立绘**（先切 bg 再 show） |
| `#bgm` | `#bgm:<id>` | 播放 BGM |
| `#show` | `#show:<id>:<expr>:<pos>` | 显示立绘（expr/pos 可省，默认 default/center） |
| `#hide` | `#hide:<id>` | 隐藏某立绘 |

- 青月常驻，用 `#show:qingyue:<expr>:float` 更新她的表情；`float` 为其专用浮空位
- `<pos>`：`left`/`center`/`right`/`float`

### 对白属性标签（行尾，作用于本行）
| 标签 | 格式 | 说明 |
|------|------|------|
| `#speaker` | `#speaker:<name>` | 说话人；**青月用 `#speaker:青月`**；主角对白用主角名 |
| `#hint` | `#hint:<原文>` | 该行显示"原文提示"，通常配青月 `solemn` |

### 选项标签（写在 `*` 与 `[..]` 之间）
| 标签 | 说明 |
|------|------|
| `#correct` | 标记史实正确项（驱动正确率统计） |
| `#hint:<text>` | 该选项的史识提示 |

格式：`* #correct #hint:<提示> [选项文本]` 换行缩进 `-> <目标>`

### 死亡标签
| 标签 | 说明 |
|------|------|
| `#death:<id>` | **写在死亡描写文本行的行尾**；文案去 `inkStories/<series>.ts` 的 `deaths[id]` 查 |

> ⚠️ 死亡文案（reason/classical/analysis）**只写在 registry**，不再用内联 `#reason/#classical/#analysis`（已废弃，单一数据源）。

### 成就标签
| `#achieve:<id>` | 触发成就；id 须在 `achievements/<series>.ts` 定义；通常放正确分支段首 |

### ink 逻辑能力（善用）
```ink
VAR ren = 0                    // 跨幕状态变量（母题/弱点量化）；统计变量不要声明，引擎管
~ ren = ren + 1                // ⚠️ 变量修改用 ~，不是 { }
{ ren >= 2: 你已忍过太多。 | 你还年轻气盛。 }   // 条件文本 / 多结局分叉
```

### 预留 · 玩法扩展标签（现写即可，默认 no-op）
| 标签 | 语义 | 现状 |
|------|------|------|
| `#minigame:<id>` | 该处挂一个自定义小游戏作为通关关卡 | 引擎按 meta 透传，未注册 id 默认判过；未来接 `MiniGameRegistry` |
| `#actclear:<id>` | 幕界"本幕通关"过场（史识小结 + 存档） | 预留；未来接幕级过场/门控 |

> 因核心引擎对未识别标签一律**透传到 meta**，这两个标签现在写进剧本也能正常跑（被忽略），未来实现后自动生效。详见 `docs/gameplay-extensibility.md`。

---

## 5. 注册与集成（按系列拆分，可并发）

注册文件已**按系列拆分为目录 + index 汇总**。每个系列只碰**自己的 `<series>.ts`** + 在各 index 加一行 → 多对话并行互不冲突。`<series>` 见 `data/series.ts`（wudi/shang/xizhou/chunqiu/zhanguo/qin/chuhan/hanchu/hanwu/qunxiang）。

### 步骤 1：`.ink` 文件
`src/react-app/data/stories/ink/<storykey>.ink`（如 `shun-lijie.ink`）

### 步骤 2：ink 注册 → `stories/inkStories/<series>.ts`
系列文件已存在则追加条目；新系列则新建并在 `stories/inkStories/index.ts` 加一行 `import` + 展开。
```typescript
// stories/inkStories/shang.ts  （注意路径：../../../engine、../ink）
import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";
import tangGemingSource from "../ink/tang-geming.ink?raw";   // ?raw 必须

export const shangInkStories: Record<string, InkStoryConfig> = {
  "tang:geming": {
    key: "tang:geming", title: "成汤 · 伐桀革命", source: tangGemingSource, precompiled: false,
    deaths: {                           // 死亡文案单一数据源
      x: { reason: "…", classical: "<真原文>", analysis: "…（青月口吻）" },
    },
  },
};
// index.ts: import { shangInkStories } from "./shang"; export const inkStories = { ...wudiInkStories, ...shangInkStories, ... }
```

### 步骤 3：storyline 入口 → `storylines/<series>.ts`
用 `withSeries` 盖章（自动加 `series` 字段），在 `storylines/index.ts` 加一行。
```typescript
// storylines/shang.ts
import { withSeries } from "./_series";
export const shangStorylines = withSeries("shang", [
  {
    id: "shang_1_tang_geming_ink",     // 命名：<series>_<N>_<slug>_ink；_ink 跳过解锁校验
    title: "成汤革命", subtitle: "殷本纪 · 成汤", era: "shang", year: "上古 · 商初",
    cover: "#b0894c", glyph: "汤", estimatedMinutes: 4, difficulty: 3,
    focusCharacter: "tang", relatedCharacters: ["tang", "yiyin"],   // 只放已注册立绘
    perspectives: [
      { characterId: "tang", storyKey: "tang:geming", unlockedBy: "tang", nodeCount: 4 },
    ],
  },
]);
```
> **多主角（一系列多故事线）**：同一系列内，"进卡选主角"有两种做法——① 一张卡的 `perspectives` 加多条（各自 storyKey），UI 自动渲染多个「以X视角」按钮；② 每个主角一张卡。同一事件在不同主角线用不同视角/抉择呈现，皆遵史实。

### 步骤 4：立绘/背景 → `sceneAssets/<series>.ts`
导出 `<series>Sprites` / `<series>Backgrounds`，在 `sceneAssets/index.ts` 合并进 SPRITES / BACKGROUNDS。
```typescript
// sceneAssets/shang.ts
import type { SpriteInfo, BgStyle } from "./base";
export const shangSprites: Record<string, SpriteInfo> = { tang: { name: "成汤", glyph: "汤", accent: "#3f7a5c" } };
export const shangBackgrounds: Record<string, BgStyle> = { mingtiao: { label: "鸣条 · 战野", css: "linear-gradient(...)" } };
```
青月（`qingyue`）已内置于 base，直接复用。

### 步骤 5：成就 → `achievements/<series>.ts`
导出 `<series>Achievements`，在 `achievements/index.ts` 合并。type 用合法枚举（story/historical/easter_egg/…）。

### 步骤 6：`data/series.ts`
该系列首次上线时，把对应 `SeriesDef` 的 `comingSoon` 去掉，选择页即显示可玩。

---

## 6. 避坑清单

- **入口忘 divert**：文件必须 `-> <entry_knot>` 开头，否则跳过开场
- **`#bg` 清立绘**：先 `#bg` 再 `#show`；顺序反了立绘被清空
- **变量修改用 `~`**：`~ x = 1`，不是 `{ x = 1 }`（后者是求值/条件语法）
- **死亡文案只进 registry**：ink 里死亡行只写 `#death:id`，且写在**文本行行尾**（勿单独成行、勿建无正文的节点）
- **旁白一律青月**：不要出现 `#speaker:旁白`
- **`relatedCharacters` 只放已注册角色**：未注册角色会导致立绘/API 异常
- **每个结局 `-> END`**：死亡/通关节点必须收口
- **id 用英文小写下划线**；标签值不含空格；中文标点正常可用
- **死亡分支可放心改 bg/立绘**：引擎已实现"retry 场景复位"（死亡后重试自动还原到抉择点画面），死亡场景尽管上视觉
- **多幕命名**：入口 `-> act1_<slug>`；每幕 knot 前缀 `actN_`；死亡 knot 各自独立、`#death` 只在其文本行；跨幕 VAR 顶部 `VAR` 声明

---

## 7. 质检与验收

### 内容 lint —— **`node scripts/verify-ink.mjs` 自动完成以下大部分**（编译 + 全分支遍历 + id 交叉核对）
- [ ] 所有 `#show` 角色 id 已在 `sceneAssets/<series>.ts` 或 base 注册
- [ ] 所有 `#bg` id 已在 `sceneAssets` 的 BACKGROUNDS 注册
- [ ] 所有 `#achieve` id 已在 `achievements/<series>.ts` 或 base 定义
- [ ] 每个 `#death:id` 在 `inkStories/<series>.ts` 的 `deaths` 有对应文案
- [ ] 所有 knot 可达；每条路径 `-> END` 或 `-> <下一幕>`
- [ ] 无 `#speaker:旁白`；旁白皆为青月

### 动人度自评（§3.5 每条打钩）
- [ ] 有第一人称代入 + 感官铺垫
- [ ] 抉择前有真实赌注/两难，非送命题
- [ ] 有情感锚（人物关系张力）
- [ ] 情绪高点由青月道出原文
- [ ] 节奏有长短/留白/俏皮调剂
- [ ] 结局有余味，不说教
- [ ] 青月全程活泼可爱、生死处收敛，人设一致

### 史实校验
- [ ] 人物、事件、原文引用均忠于 `chapters/NNN.ts`
- [ ] 死亡分支的 `classical` 是真原文、`analysis` 是真史理
- [ ] 文学化补充未违背史实骨架

### 运行验收（命令行，必做）
- [ ] `npx tsc -b` 通过
- [ ] `node scripts/verify-ink.mjs` 全绿（编译 + 全分支 + 资源 id 核对）
- [ ] `npm run build` 通过

### 浏览器抽验（能起 preview 时）
- [ ] 故事线可加载、逐字显示、背景/立绘/说话人正常
- [ ] 正确选项有标记；错误触发死亡屏（reason/classical/analysis）
- [ ] "重新抉择"回到抉择点且画面正确复位；成就弹窗、多结局通关屏正常

---

## 8. 完整黄金范例：舜 · 焚廪穿井

> 取材 `001.ts` 的 `shun-lijie` 节。玩家穿越成舜，两次被父亲瞽叟与弟弟象谋杀（焚廪、填井），须察杀机、预作准备而活，且历劫仍守孝悌。展示流水线全貌与青月活泼语域。

`src/react-app/data/stories/ink/shun-lijie.ink`：
```ink
// ═══════════════════════════════════════════════
// 虞舜 · 焚廪穿井 · 历劫不死
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR alerted = false

-> c_open

=== c_open ===
#bg:gui_river
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一缕魂飘到我这儿啦！坐稳咯~」 #speaker:青月
「这一回，你是重华，世人唤作舜。天下最有名的孝子……也是差点被亲爹烧死、埋死好几回的倒霉蛋。」 #speaker:青月
你睁开眼。妫水边，细葛衣，一张琴——这是尧赏你的。你以孝闻名天下，尧把两个女儿都嫁给了你。
#show:gusou:cold:left
可你的父亲瞽叟是个盲人，偏爱后妻生的弟弟象。他们，一直想你死。 #hint:瞽叟爱后妻子，常欲杀舜。
#show:qingyue:worry:float
「呐，划重点——他们的杀心，是真的。你的孝，也是真的。这一世最难的，就是这两样怎么同时活下去。」 #speaker:青月
-> c_granary

=== c_granary ===
#show:gusou:smiling:left
父亲忽然和颜悦色，唤你去修补粮仓的顶：「重华啊，仓顶漏了，你上去涂一涂。」
他从不对你笑的。此刻却笑了。
#show:qingyue:tease:float
「唔——反常即为妖。要不要……多带点什么上去呀？」 #speaker:青月

* #correct #hint:舜乃以两笠自扞而下——两顶斗笠，是他给自己备的翅膀。 [顺手抄起两顶宽斗笠，才爬上仓顶]
    ~ alerted = true
    -> c_granary_fire
* [空着手，依言爬上仓顶]
    -> c_granary_fire

=== c_granary_fire ===
#bg:granary_fire
#bgm:danger
你刚上到仓顶，脚下轰地腾起火来——瞽叟在下面点燃了粮仓，还抽走了梯子。烈焰卷着黑烟，四面封死。 #hint:瞽叟从下纵火焚廪。
{ alerted:
    #show:qingyue:solemn:float
    「快！斗笠！」 #speaker:青月
    你双手各执一顶斗笠，如鸟张翼，纵身跃下——风兜住笠，你稳稳落地，滚出火场。 #hint:舜乃以两笠自扞而下，去，得不死。
    #show:qingyue:smile:float
    「欸——漂亮！跟他一个样，聪明！」 #speaker:青月
    -> c_well
- else:
    你四顾无门，火舌舔上衣角。没有梯子，没有遮挡，什么都没有。
    烈火吞没了仓顶。 #death:burn #speaker:青月
    -> END
}

=== c_well ===
#bg:gui_river
父亲又唤你去掏井。你低头应下——你知道他还会再来一次。
#show:qingyue:worry:float
「他不会罢手的。下井……可是有去无回的地方哦？」 #speaker:青月

* #correct #hint:舜穿井为匿空旁出——下去之前，先给自己挖一条活路。 [下井前，先在井壁旁凿一条通往地面的暗道]
    ~ alerted = true
    -> c_well_bury
* [依言直直往下掏井]
    ~ alerted = false
    -> c_well_bury

=== c_well_bury ===
#bg:well_dark
#bgm:danger
你掘到深处，头顶忽然暗了——瞽叟与象合力往井里倒土，要把你活埋在井底。 #hint:瞽叟与象共下土实井。
{ alerted:
    你侧身钻进先前凿好的暗道，泥土在身后灌满井筒。你从旁侧的出口爬出地面，活了下来。 #hint:舜从匿空出，去。
    #show:qingyue:smile:float
    「呼……又逃过一劫。可你猜，你回家会看见什么？」 #speaker:青月
    -> c_return
- else:
    泥土倾泻而下，压住你的肩、你的头。井口那点光，一点点没了。
    你被活埋在了井底。 #death:bury #speaker:青月
    -> END
}

=== c_return ===
#bg:shun_house
#show:xiang:startled:center
你回到家。象正坐在你的屋里，弹着你的琴——他和父母已经分了你的家产，以为你死定了。琴归他，连尧的两个女儿也归他。 #hint:象乃止舜宫居，鼓其琴。舜往见之。
象见你活着回来，脸都白了，强笑道：「我……我正想念你，心里郁闷得很呢！」 #speaker:象
#show:qingyue:worry:float
「他要谋你的命，分你的产，占你的妻。现在他就在你面前。」 #speaker:青月
「你手里有的是道理。要清算吗？」 #speaker:青月

* #correct #hint:舜复事瞽叟爱弟弥谨——他没有报复，反而更恭谨了。 [「是啊，你大概是这样吧。」——你依旧待他如弟]
    -> c_end_sage
* [揭穿他的谋杀与瓜分，与他割席清算]
    -> c_return_break

=== c_return_break ===
你把一切摊开：焚廪、填井、分产、夺妻。象无地自容，父亲瞽叟却勃然大怒——你到底还是失了「子道」。
那个"历劫不改其孝"的舜，从此不是你了。
从此家宅失和，你也再未被尧托付天下。 #death:vengeance #speaker:青月
-> END

=== c_end_sage ===
#bg:gui_river
#bgm:solemn
#achieve:shun_filial
你像什么都没发生过一样，继续侍奉瞽叟、友爱象，一天比一天恭谨。 #hint:舜复事瞽叟爱弟弥谨。
#show:qingyue:solemn:float
「……他不是不疼。」 #speaker:青月
「烧他、埋他、抢他东西的人，他抬手就能报复。可他没有。他把疼都咽下去了呀。」 #speaker:青月
不久，尧把五教百官都交给你去试，你样样治得井井有条。天下，正在向你走来。 #hint:于是尧乃试舜五典百官，皆治。
#show:qingyue:smile:float
「呼——你走完了他这一劫。看懂了吗？孝与智，缺一，都到不了这里。」 #speaker:青月
-> END
```

对应 `inkStories/wudi.ts` 死亡 registry：
```typescript
"shun:lijie": {
  key: "shun:lijie",
  title: "虞舜 · 焚廪穿井",
  source: shunLijieSource,
  precompiled: false,
  deaths: {
    burn: {
      reason: "空手登上仓顶，被烈火吞没",
      classical: "瞽叟从下纵火焚廪。舜乃以两笠自扞而下，去，得不死。",
      analysis: "史上的舜早察杀机，执两笠如翼跃下逃生。明知父欲杀己仍赴命，是孝；预作两笠而活，是智。缺一，圣人便葬身火海。",
    },
    bury: {
      reason: "直下深井，被活埋于井底",
      classical: "舜穿井为匿空旁出……瞽叟与象共下土实井，舜从匿空出，去。",
      analysis: "舜下井前先凿暗道旁出，是把活路留在死地之前。顺父命而不送命——真正的孝，从不是任人宰割。",
    },
    vengeance: {
      reason: "以怨报怨，失了子道",
      classical: "舜复事瞽叟爱弟弥谨。于是尧乃试舜五典百官，皆治。",
      analysis: "史上的舜历劫不改其孝，『爱弟弥谨』，才终得尧托天下。若此刻清算解气，舜便只是个受害者，而非那个以德化人的圣人——天下也不会交到他手里。",
    },
  },
},
```

**范例讲解（生成时对照）**：
- ✅ 穿越者第一人称「你」；青月 `tease` 入场卷入
- ✅ 两个**致命抉择**（焚廪/填井）皆源自真实杀机，正解=史实（两笠、匿空），错误=空手图省事→死
- ✅ 一个**道德抉择**（报复 vs 守孝），死亡是"照见另一种可能"而非物理死亡
- ✅ 原文在高光处由青月 `solemn` 道出；死亡文案引真原文、讲真史理
- ✅ 青月全程活泼，生死处收敛为 `worry/solemn/sad`，反差萌一致
- ✅ 变量 `alerted` 用 `~` 修改，条件文本 `{alerted: A|B}` 分流生死

---

## 9. 参考资源

- **规划**：`docs/story-series-roadmap.md`（10 大系列总蓝图，含每系列源卷+可选主角线）；系列工作包如 `docs/series-chuhan-plan.md`（主角线×幕）
- **玩法可扩展性**：`docs/gameplay-extensibility.md`（幕内深度、跨幕状态、`#minigame`/`#actclear` 预留）
- 素材（唯一事实源）：`src/react-app/data/classics/chapters/<NNN>.ts`；目录索引 `catalog.ts`
- 系列注册表：`src/react-app/data/series.ts`
- 注册（按系列拆分，各含 `index.ts` 汇总）：`storylines/<series>.ts`、`stories/inkStories/<series>.ts`、`sceneAssets/<series>.ts`、`achievements/<series>.ts`（青月=base 的 `qingyue`）
- 核心引擎：`packages/ink-vn-core/src/inkRunner.ts`、`tagParser.ts`；适配层 `src/react-app/engine/shijiInkAdapter.ts`
- **多幕成长弧线范例**：`stories/ink/hanxin-chuhan.ink`、`xiangyu-chuhan.ink`、`zhangliang-chuhan.ink`；单章范例 `shun-lijie.ink`（见 §8）
- 验证脚本：`scripts/verify-ink.mjs`
- ink 官方文档：https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
