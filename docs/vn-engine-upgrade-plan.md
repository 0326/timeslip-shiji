# VN 叙事引擎升级技术方案（修订版 v2）

> **目标**：将自研 `StoryRunner` 渐进迁移至 **inkjs** 作为叙事内核，保留全部现有 React UI 和业务逻辑，解锁工业级分支叙事能力。
>
> **原则**：零破坏性、可回滚、双引擎并存、逐剧本迁移。
>
> **新增原则（v2）**：**引擎核心从第一天起就是独立包**——领域无关、可单独测试、可独立开源。《史记》专属语义（古文提示、死亡分析、成就）全部下沉到 app 适配层，核心只认通用 VN 语义。

---

## 修订记录

| 版本 | 变更 |
|------|------|
| v1 | 初版 |
| v2 | ① 修正 5.3 节 ink 语法错误（`{var+=1}` → `~ var += 1`）；② 死亡节点改为 ID 间接引用 + 必含文本行（修复纯标签 knot 的 tags 丢失风险）；③ retry 由 `ChoosePathString` 改为**快照栈**方案（消除 visit count 污染，顺带获得 rollback）；④ 统计变量移出 ink，单一数据源；⑤ 新增独立包架构（`packages/ink-vn-core`）与 meta 透传标签设计；⑥ 新增 TS→ink codegen 脚本；⑦ 修正 backlog 实现思路；⑧ 新增 golden-run 测试与内容 lint |

---

## 一、现状盘点

### 1.1 当前架构

```
┌─────────────────────────────────────────────────────────┐
│                    PlayPage (路由)                       │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  VNEngine.tsx            ← 组合所有UI子组件              │
│  ├─ DialogueBox          ← 打字机对话框                  │
│  ├─ ChoicePanel          ← 选择面板（含AI史官）           │
│  ├─ CharacterSprite      ← 立绘                          │
│  ├─ DeathScreen          ← 死亡画面                      │
│  ├─ ClearScreen          ← 通关画面                      │
│  ├─ ClassicalHint        ← 原文抽屉                      │
│  └─ AiHintModal          ← AI提示弹窗                    │
└──────────────────────┬──────────────────────────────────┘
                       │ useStory() hook
┌──────────────────────▼──────────────────────────────────┐
│  StoryRunner (engine/storyRunner.ts, 230行)              │
│  ├─ advance()           ← 逐节点推进，收集segments        │
│  ├─ choose(i)           ← 选择选项                       │
│  ├─ retry()             ← 死亡后重试                     │
│  ├─ getSaveState()      ← JSON序列化存档                  │
│  └─ loadSaveState()     ← 读档                           │
│  数据结构: Story → StoryNode → ContentItem[]             │
│  能力: 对话/分支/变量(number/boolean)/死亡/成就/简单存档   │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  剧本数据 (data/stories/*.ts)                            │
│  ├─ hanxin.ts          ← 兵仙韩信，7章，~514行            │
│  └─ hongmenXiangyu.ts  ← 鸿门宴·项羽视角                  │
│  格式: TypeScript对象 (Story类型)                        │
└─────────────────────────────────────────────────────────┘
```

### 1.2 现有能力与缺口

| 能力 | 状态 | 说明 |
|------|------|------|
| 线性对话+分支 | ✅ 有 | goto + choices |
| 变量（number/bool） | ✅ 有 | set/inc |
| 场景回调（bg/show/hide/bgm/achieve） | ✅ 有 | EngineCallbacks |
| 死亡/重试 | ✅ 有 | DeathInfo + retry() |
| 正确选项标记 | ✅ 有 | choice.correct |
| 原文提示hint | ✅ 有 | segment.hint / choice.hint |
| 存档/读档 | ⚠️ 基础 | 仅存vars+nodeId，不存场景状态 |
| **条件内容** | ❌ 缺失 | 对白/场景无法根据变量动态变化 |
| **call/return调用栈** | ❌ 缺失 | 只有goto，无复用片段 |
| **字符串变量/插值** | ❌ 缺失 | 仅number/bool |
| **对话回退/历史** | ❌ 缺失 | 现代VN标配 |
| **回滚（撤销选择）** | ❌ 缺失 | 现代VN标配 |
| **标签元数据系统** | ❌ 缺失 | hint/correct等是硬编码字段 |
| **随机/洗牌** | ❌ 缺失 | 无随机机制 |
| **多路径汇聚** | ⚠️ 弱 | 需要显式goto到同一节点，无天然汇聚点 |
| BGM实际播放 | ❌ 缺失 | 只有回调，无音频实现 |
| **引擎可独立复用** | ❌ 缺失 | 类型与《史记》领域语义耦合（hint/correct/death.classical） |

---

## 二、ink/inkjs 选型理由

| 维度 | inkjs | 说明 |
|------|-------|------|
| 成熟度 | ⭐⭐⭐⭐⭐ | 2016年至今，v2.4.0，用于《80 Days》等商业游戏 |
| 许可证 | MIT | 商业友好，与本引擎核心开源计划（MIT）兼容 |
| 依赖 | **零运行时依赖** | 打包体积 ~几十KB gzipped |
| TypeScript | 原生支持 | 完整.d.ts |
| 叙事能力 | 工业级 | 分支/变量/条件/调用栈/随机/函数/外部绑定/标签 |
| 存档 | 一行JSON | `state.ToJson()` / `state.LoadJson()` |
| React集成 | 极简 | useRef持有Story实例，useState驱动UI |
| 渲染侵入 | 零 | 纯状态机，不关心渲染层 |

---

## 三、架构设计：独立核心包 + 领域适配层

### 3.1 分包边界（v2 核心变更）

引擎核心作为 **npm workspace 包** 独立存在，从写第一行代码起就遵守开源边界：

```
package.json                  → 增加 "workspaces": ["packages/*"]
packages/
  ink-vn-core/                # 未来独立开源的引擎核心（MIT）
    src/
      types.ts                # NarrativeRunner / Segment / TagMeta 等通用类型
      inkRunner.ts            # inkjs 适配核心（~250行）
      tagParser.ts            # 舞台标签解析 + meta 透传（~120行）
      index.ts
    test/
      golden/                 # golden-run 剧本快照测试
      tagParser.test.ts
    package.json              # peerDependencies: inkjs；license: MIT
src/react-app/
  engine/
    storyRunner.ts            # 旧 runner，原地不动（Phase 4 后移除）
    IStoryRunner.ts           # app 侧统一接口（StoryState 语义，UI 消费）
    shijiAdapter.ts           # 领域适配层：NarrativeRunner → IStoryRunner（~120行）
    createRunner.ts           # 工厂：storyKey → StoryRunner | ShijiInkAdapter
  data/stories/
    ink/*.ink                 # ink 剧本
    deathRegistry.ts          # 死亡元数据表（ID → reason/classical/analysis）
```

**铁律（ESLint `no-restricted-imports` 强制）**：`packages/ink-vn-core` **不得 import `src/` 下任何模块**。依赖方向永远是 app → 核心。核心不知道什么是"古文提示"、"史官"、"成就"。

### 3.2 核心包类型设计：通用语义 + meta 透传

核心解析器只认**舞台指令标签**（bg/show/hide/bgm/speaker）；一切未识别标签作为键值对透传到 `meta`，由 app 层解释。这使核心**既更通用又更简单**——无需设计标签插件注册机制。

```typescript
// packages/ink-vn-core/src/types.ts
export type TagMeta = Record<string, string | true>;
// #correct        → { correct: true }
// #hint:孰视之…    → { hint: "孰视之…" }
// #death:hanxin_c1 → { death: "hanxin_c1" }

export interface Segment {
  text: string;
  speaker?: string;      // 来自 #speaker:NAME；无则为旁白
  meta: TagMeta;         // 未识别标签透传
}

export interface RunnerChoice {
  text: string;
  meta: TagMeta;         // #correct / #hint 等由 app 解释
}

export interface RunnerOutput {
  segments: Segment[];
  choices: RunnerChoice[];
  ended: boolean;
}

/** 舞台指令回调——核心解析 bg/show/hide/bgm 后触发，app 负责渲染 */
export interface StageCallbacks {
  onBackground?(bg: string): void;
  onShowCharacter?(id: string, expr?: string, pos?: string): void;
  onHideCharacter?(id: string): void;
  onBGM?(track: string): void;
  /** 每次玩家做出选择时触发（app 用于统计 correct 率等） */
  onChoice?(choice: RunnerChoice, index: number): void;
}

/** 核心运行时接口：纯叙事原语，无游戏规则 */
export interface NarrativeRunner {
  advance(): RunnerOutput;
  choose(index: number): RunnerOutput;
  snapshot(): string;            // ink state + 场景状态 的完整快照
  restore(snapshot: string): void;
  restart(): void;
  getVar(name: string): unknown;
  setVar(name: string, value: number | boolean | string): void;
}
```

**注意接口里没有的东西**：`retry()`、`getChoiceRate()`、`getDeathCount()`、`getCompletedNodes()`——这些是**游戏规则/元统计**，不是叙事原语。核心只提供 `snapshot/restore` 原语和 `onChoice` 事件，"死亡重试"、"正确率"由 app 适配层组装（见 3.4）。

### 3.3 目标架构

```
┌─────────────────────────────────────────────────────────┐
│          PlayPage / VNEngine / 所有UI组件                │
│          ← 完全不动，消费 StoryState 接口                 │
└──────────────────────┬──────────────────────────────────┘
                       │ StoryState (接口不变!)
┌──────────────────────▼──────────────────────────────────┐
│                  useStory() hook                         │
│        工厂 createRunner(storyKey) → IStoryRunner        │
│  ┌────────────────┐  ┌────────────────────────────┐     │
│  │ StoryRunner    │  │ ShijiInkAdapter (app层)     │     │
│  │ (现有,保留)     │  │  ├─ meta.hint → hint字段    │     │
│  │                │  │  ├─ meta.correct → 统计     │     │
│  │                │  │  ├─ meta.death → 死亡注册表 │     │
│  │                │  │  ├─ meta.achieve → 成就回调 │     │
│  │                │  │  ├─ 快照栈 → retry/rollback │     │
│  │                │  │  └─ backlog 日志            │     │
│  └────────────────┘  └─────────────┬──────────────┘     │
└───────────────────────────────────┼─────────────────────┘
                                    │ NarrativeRunner 接口
                       ┌────────────▼─────────────┐
                       │  packages/ink-vn-core    │
                       │  InkRunner + tagParser   │
                       │  （领域无关，可开源）      │
                       └────────────┬─────────────┘
                                    │
                          ┌─────────▼──────────┐
                          │   剧本加载层        │
                          │ ├─ .ts 旧格式(Story)│
                          │ └─ .ink / .ink.json │
                          └────────────────────┘
```

### 3.4 ShijiInkAdapter（领域适配层）职责

实现现有 `IStoryRunner` 接口（`StoryState` 输出与旧 runner 完全一致，UI 零改动）：

1. **meta 还原**：`meta.hint` → `segment.hint`；`meta.correct` → `choice.correct`；`meta.narration` → 旁白标记
2. **死亡语义**：`meta.death` 是一个 **ID**，查 `deathRegistry.ts` 得到 `{reason, classical, analysis}`，构造 `DeathInfo`
3. **快照栈**：每次 `choose()` 前 `push(core.snapshot())`；`retry()` = `core.restore(stack.pop())`；未来 rollback = 同一个栈的 UI 化
4. **统计（单一数据源，不进 ink）**：`_choices/_correct/_deaths/_nodes` 全部在 adapter 内维护，由 `onChoice` 回调驱动——ink 剧本中**不声明**这些 VAR
5. **成就**：`meta.achieve` → 触发现有 `onAchievement` 回调
6. **backlog 日志**：每次 `advance()` 把产出 segments 追加到内部 log 数组（inkjs **不保存**已输出文本历史，必须自己记）
7. **存档**：`{ coreSnapshot, snapshotStack, stats, backlog }` 序列化为 JSON（场景状态包含在 coreSnapshot 内，见 7.3）

### 3.5 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| **新增** | `packages/ink-vn-core/src/types.ts` | 核心通用类型（NarrativeRunner/Segment/TagMeta） |
| **新增** | `packages/ink-vn-core/src/inkRunner.ts` | inkjs 适配核心（~250行） |
| **新增** | `packages/ink-vn-core/src/tagParser.ts` | 舞台标签解析 + meta 透传（~120行） |
| **新增** | `packages/ink-vn-core/test/` | 标签解析单测 + golden-run 剧本测试 |
| **新增** | `src/react-app/engine/IStoryRunner.ts` | app 侧统一接口定义 |
| **新增** | `src/react-app/engine/shijiAdapter.ts` | 领域适配层（~120行） |
| **新增** | `src/react-app/engine/createRunner.ts` | 工厂函数 |
| **新增** | `src/react-app/data/stories/ink/` | .ink 剧本目录 |
| **新增** | `src/react-app/data/stories/deathRegistry.ts` | 死亡元数据表 |
| **新增** | `scripts/story-to-ink.mjs` | TS 剧本 → ink 的 codegen（一次性迁移工具） |
| **新增** | `scripts/precompile-ink.mjs` | 构建期 ink → JSON 预编译 |
| **新增** | `scripts/lint-ink.mjs` | 内容校验（sprite/achieve/death ID、knot 可达性） |
| **修改** | `package.json` | workspaces 配置；build 接入预编译 |
| **修改** | `src/react-app/engine/storyRunner.ts` | 实现 IStoryRunner 接口（加 implements，不改逻辑） |
| **修改** | `src/react-app/hooks/useStory.ts` | 改用 createRunner 工厂 |
| **修改** | `src/react-app/data/stories/index.ts` | 注册 ink 剧本 |
| **修改** | `src/react-app/vite-env.d.ts` | `*.ink?raw` 类型声明 |
| **修改** | `eslint` 配置 | no-restricted-imports 强制包边界 |
| **不动** | `VNEngine.tsx` 等全部 UI 组件、CSS、store、页面路由 | 零改动 |

---

## 四、ink 标签体系设计

### 4.1 标签分两类（v2 核心变更）

**A 类：舞台指令标签**（核心包解析，触发 StageCallbacks）：

| 标签 | 格式 | 含义 |
|------|------|------|
| `#bg:ID` | `#bg:huaiyin_street` | 切换背景 |
| `#show:ID:EXPR:POS` | `#show:tuzhong:mocking:right` | 显示立绘 |
| `#hide:ID` | `#hide:tuzhong` | 隐藏立绘 |
| `#bgm:ID` | `#bgm:lonely` | 播放BGM |
| `#speaker:NAME` | `#speaker:韩信` | 说话人（无此标签视为旁白） |

**B 类：领域标签**（核心透传到 `meta`，ShijiAdapter 解释；核心包对它们一无所知）：

| 标签 | 适用位置 | 格式 | app 层含义 |
|------|---------|------|-----------|
| `#hint:TEXT` | 对白/选项行 | `#hint:孰视之…` | 古文原文提示（短句内联；长文用 `#hint:ID` 走注册表） |
| `#correct` | 选项行 | `#correct` | 正确选项标记（驱动统计） |
| `#death:ID` | 死亡knot的文本行 | `#death:hanxin_c1_kill` | 死亡结局，**ID 查 deathRegistry** 得 reason/classical/analysis |
| `#achieve:ID` | 任意行 | `#achieve:xiakua` | 触发成就 |

**v1 → v2 的删减**：
- ❌ `#classical:` / `#analysis:` 内联长文标签——段落级中文塞 tag 是反模式，全部收进 `deathRegistry.ts`（有类型检查，且古文引注可与典籍阁数据复用）
- ❌ `#goto:`（死亡重试返回点）——retry 改为快照栈方案（见 7.2），无需在剧本里声明返回点
- ❌ `#narration`——无 `#speaker:` 即旁白，不需要显式标签

### 4.2 标签解析规则（核心包 tagParser）

1. 每行文本的 tags 逐个解析：命中 A 类 → 触发对应 StageCallback；其余 → 按 `key:value`（无值则 `true`）写入该行 `meta`
2. ink 语义：**行上方的独立标签附着到下一条文本行**——因此 `#bg:` `#show:` 写在对白行上方即可，效果在该行显示前生效
3. **约束：任何 knot 不得只有标签而无文本行**（悬空 tag 会被 inkjs 丢弃）——死亡 knot 必须有至少一行可见文本，`#death:ID` 附着其上。此约束由 `lint-ink.mjs` 强制检查
4. 选项行的 tag **必须写在 divert 之前**；推荐格式为 tag 跟在选项文本后、divert 另起一行缩进（见 5.2 示例）。Phase 1 最小剧本需覆盖此边界用例

---

## 五、剧本格式转换示例

### 5.1 现有TS格式（hanxin.ts 片段）

```typescript
c1_intro: {
  content: [
    { bg: "huaiyin_street" },
    { bgm: "lonely" },
    { say: "淮阴。你是韩信，家贫无行...", speaker: "旁白" },
    { say: "你腰间始终佩着一柄长剑——那是你唯一的体面。", speaker: "旁白" },
    { show: { id: "tuzhong", expr: "mocking", pos: "right" } },
    { say: "市井屠中，一名少年拦住你...", speaker: "少年" },
    {
      say: "『信能死，刺我；不能死，出我袴下！』",
      speaker: "少年",
      hint: "于是信孰视之，俛出袴下，蒲伏。一市人皆笑信，以为怯。",
    },
  ],
  choices: [
    { text: "拔剑而起，一剑刺死辱我之人", goto: "c1_death_kill" },
    {
      text: "孰视良久，俯身从他胯下钻过",
      goto: "c1_pass",
      correct: true,
      hint: "孰视之——这不是怯懦...",
    },
  ],
},
```

### 5.2 ink格式（hanxin.ink 对应片段，v2 修正版）

```ink
// ============================================
// 兵仙韩信 · 七章
// 史源：《史记·淮阴侯列传》
// ============================================
// 注意：_choices 等统计变量不在 ink 中声明（由 adapter 维护）

=== c1_intro ===
#bg:huaiyin_street
#bgm:lonely
淮阴。你是韩信，家贫无行，不得推择为吏，又不能治生商贾，常从人寄食，人多厌之。
你腰间始终佩着一柄长剑——那是你唯一的体面。
#show:tuzhong:mocking:right
市井屠中，一名少年拦住你，当众羞辱：『你虽长大，好带刀剑，其实胆怯耳！』 #speaker:少年
『信能死，刺我；不能死，出我袴下！』 #speaker:少年 #hint:于是信孰视之，俛出袴下，蒲伏。一市人皆笑信，以为怯。

* [拔剑而起，一剑刺死辱我之人]
    -> c1_death_kill
* [孰视良久，俯身从他胯下钻过] #correct #hint:孰视之——这不是怯懦，是掂量过生死之后的隐忍。
    -> c1_pass

=== c1_pass ===
你定定地看了他许久，俯身，伏地，从那少年的胯下缓缓爬过。满市的人都笑你怯懦。
#achieve:xiakua
可你心里清楚：杀一个无赖，换来的是一条逃亡的命；忍下这口气，留住的是一身将来。 #speaker:韩信
-> c2_intro

=== c1_death_kill ===
你拔剑刺出。血溅三尺，满市哗然——快意只有一瞬，逃亡是余生。 #death:hanxin_c1_kill
-> END
```

对应的死亡注册表：

```typescript
// data/stories/deathRegistry.ts
export const deathRegistry: Record<string, DeathMeta> = {
  hanxin_c1_kill: {
    reason: "因一时之忿杀人，亡命天涯，兵仙就此夭折",
    classical: "于是信孰视之，俛出袴下，蒲伏。",
    analysis:
      "史上的韩信选择了钻胯下。杀掉那个无赖，他便要亡命逃匿，再无登坛拜将之日。" +
      "大丈夫能屈能伸——所谓『孰视之』，是看清了忍辱与前程孰轻孰重。",
  },
};
```

**v1 版本此处的两个错误已修正**：
1. 死亡 knot 原来只有标签无文本 → tags 会被 inkjs 丢弃；现在死亡描写本身就是一行有效对白，`#death:ID` 附着其上
2. 长文 `#classical:` `#analysis:` → 收进注册表

### 5.3 鸿门宴计数器（ink新能力，v2 修正语法）

> **v1 此处语法错误**：`{ fanzeng_ignored += 1 }` 不是合法 ink——`{...}` 是求值/条件文本，**变量修改必须用 `~`**，且写在选项内容块中。

```ink
VAR fanzeng_ignored = 0

=== banquet ===
#bg:tent_feast
#show:fanzeng:anxious:left
#show:liubang:humble:right
次日，刘邦亲来谢罪：『臣与将军戮力而攻秦...』
（他言辞如此谦卑……杀他，岂非令天下笑我项羽不能容人？） #speaker:项羽
席间，范增频频以眼色示意，三次举起腰间玉玦。 #hint:玉玦，谐音『决』——范增在催你下决心。

* [默然不应，举杯与沛公共饮] #correct #hint:项王默然不应——史上的项羽，此刻并未动手。
    ~ fanzeng_ignored += 1
    -> jue2
* [会意，按剑起身，当场击杀刘邦]
    -> death_kill

=== jue2 ===
{ fanzeng_ignored >= 3:
    三次举玦你皆不应。范增怒而离席，以剑劈碎玉斗：『竖子不足与谋！』
    #achieve:yafu_sigh
- else:
    范增见你不动，神色愈急，再次举玦相示。 #hint:举所佩玉玦以示之者三。
}
* [仍旧默然，谈笑风生] #correct
    ~ fanzeng_ignored += 1
    -> jue3
* [唤左右武士，借故发难]
    -> death_kill
```

条件文本 `{cond: A - else: B}` 与 `~` 变量运算是 ink 原生能力——现有 TS 格式需要拆节点+样板代码才能模拟。

### 5.4 迁移工具：codegen 而非手抄

现有剧本是**结构化 TS 对象**，转 ink 是纯机械变换。编写一次性脚本 `scripts/story-to-ink.mjs`（~100行）：

- 遍历 `Story.nodes`，每个 node → `=== knot ===`
- `ContentItem` 逐项映射：`bg/bgm/show/hide` → A 类标签行；`say` → 文本行 + `#speaker`/`#hint`；`achieve` → 标签；`set` → `~ 赋值`
- `choices` → `*` 选项（correct/hint → 标签，goto → 缩进 divert）
- `death` → 生成死亡文本行占位 + `#death:ID`，同时输出 deathRegistry 条目

**收益**：hanxin（514行）+ hongmen（224行）零手抄，避免古文转录错漏；输出后仅需人工润色死亡行文案。

---

## 六、分阶段实施计划

### Phase 0：workspace 与接口基建（预计 1 天）

**目标**：建包、建接口、不改动任何现有功能。

- [ ] `package.json` 配置 npm workspaces；创建 `packages/ink-vn-core` 骨架（types.ts 全量定义）
- [ ] 安装 inkjs（core 包 peerDep + app devDep）
- [ ] ESLint 增加包边界规则（core 禁止 import `src/`）
- [ ] 创建 `engine/IStoryRunner.ts`；`StoryRunner` 加 implements（逻辑不变）
- [ ] 创建 `engine/createRunner.ts` 工厂，暂时全部返回 StoryRunner
- [ ] 修改 `useStory.ts` 使用工厂函数（验证行为不变）
- [ ] `vite-env.d.ts` 添加 `*.ink?raw` 声明
- [ ] **验收**：`npm run build` 通过，现有功能完全正常

### Phase 1：核心 InkRunner + 测试基建（预计 1.5 天）

**目标**：核心包能跑通 ink 剧本；测试基建同步落地。

- [ ] 实现 `tagParser.ts`（A 类标签解析 + meta 透传）+ 单元测试
- [ ] 实现 `inkRunner.ts`：
  - [ ] 加载编译（dev 用 inkjs/full Compiler + `?raw`；**编译错误带行号透出**，写剧本不能盲调）
  - [ ] `advance()`：Continue 循环收集文本+标签 → 触发 StageCallbacks → 构造 RunnerOutput
  - [ ] `choose()`：ChooseChoiceIndex + onChoice 回调
  - [ ] `snapshot()/restore()`：ink `state.ToJson()` + 场景状态（bg/立绘）合并序列化
- [ ] **golden-run 测试基建**（vitest）：headless 跑剧本 + 脚本化选择序列，快照断言 RunnerOutput 序列
- [ ] 最小验证剧本，**必须覆盖边界用例**：选项行 tag 位于 divert 前、条件文本内的标签、连续标签行归属、快照/恢复后 sequence 文本不重复
- [ ] 实现 `shijiAdapter.ts`（meta 还原 + 快照栈 retry + 统计 + backlog log + deathRegistry 查询 + 存档）
- [ ] createRunner 增加 ink 分支
- [ ] **验收**：最小 ink 剧本（1背景+2对白+1选择+1死亡）通过 VNEngine 正常渲染；golden 测试绿

### Phase 2：试点迁移——韩信剧本（预计 1 天）

- [ ] 编写并运行 `scripts/story-to-ink.mjs`，生成 `hanxin.ink` + deathRegistry 条目，人工润色死亡行
- [ ] 编写 `scripts/lint-ink.mjs`：校验 `#show` 角色 ID 在 sprite 注册表、`#achieve` ID 存在、`#death` ID 在注册表、所有 knot 可达、死亡 knot 含文本行
- [ ] 注册 ink 版韩信（key `hanxin_ink`），测试 perspective 指向它
- [ ] 手动全流程测试：7章通关、各死亡分支+retry、成就、原文提示、AI提示；为韩信主线补一条 golden 测试
- [ ] **验收**：ink 版与 TS 版体验完全一致；lint 脚本零报错

### Phase 3：能力增强（预计 0.5-1 天）

- [ ] backlog UI 数据源接 adapter 的 segment log（**注意：inkjs 不存文本历史，log 由 adapter 自己记**）
- [ ] 验证条件文本、字符串变量插值、call/return（tunnel）在剧本中可用
- [ ] 生产构建优化：`precompile-ink.mjs` **接入 `npm run build` 流水线**（`precompile → tsc → vite build`），生产 bundle 用核心版 `inkjs`（非 inkjs/full），加载 `.ink.json`
- [ ] **验收**：新能力可用；生产包不含 Compiler，体积增量 < 50KB gzipped

### Phase 4：全面切换（预计 0.5 天）

- [ ] `story-to-ink.mjs` 迁移 hongmenXiangyu → 润色 → lint
- [ ] storylines 全部指向 ink 版；createRunner 默认 InkAdapter
- [ ] 存档兼容：存档 key 加 engine 版本标识，旧档提示重新开始（单剧本流程短，代价可接受）
- [ ] 删除旧 TS 剧本（git 留档）
- [ ] 完整回归 + golden 全绿 + `npm run check`
- [ ] **验收**：所有故事线经 ink 引擎运行

### Phase 5（可选）：高级特性

- [ ] **Rollback UI**：快照栈已在 adapter 中存在，只差"回退一步"按钮
- [ ] Backlog 面板 UI
- [ ] BGM/SFX 音频播放（Howler.js）
- [ ] 剧本热重载 vite 插件
- [ ] **资源清单预生成**（为立绘/背景图片化铺路）：构建期扫描 `.ink.json` 中的 `#bg`/`#show` 标签，生成每 knot 资源清单，运行时按清单预加载——上图片资产时的关键基建
- [ ] **核心包开源准备**：README + 独立示例剧本 + npm 发布（golden 测试即开源测试套件）

---

## 七、关键技术细节

### 7.1 ink文件加载方式

**开发模式**：`?raw` 导入源码，运行时编译；Compiler 报错包装后带文件名+行号抛出，Vite overlay 可见。

```typescript
import hanxinSource from "./ink/hanxin.ink?raw";
import { Compiler } from "inkjs/full";
const story = new Compiler(hanxinSource).Compile();
```

**生产模式**：构建期预编译为 JSON（接入 build 脚本），运行时用不含 Compiler 的核心 `inkjs` 加载：

```json
"scripts": {
  "build": "node scripts/precompile-ink.mjs && tsc -b && vite build"
}
```

### 7.2 死亡与重试：快照栈方案（v2 核心变更）

> **v1 方案（`#goto` + `ChoosePathString`）已废弃，原因**：ink state 含 visit counts 与 sequence 游标——死亡路径上走过的 knot 计数已 +1、`{first|second}` 序列已消耗、`~` 改过的变量不会回滚。跳回去后条件文本会意外命中、循环文本显示错乱。旧 StoryRunner 没这个问题是因为它没有这些状态。

**快照栈方案**：

```typescript
// shijiAdapter 内部
choose(index: number): StoryState {
  this.snapshotStack.push(this.core.snapshot());  // 选择前压栈
  const out = this.core.choose(index);
  // …若推进后命中 meta.death → 构造 DeathInfo 返回
}

retry(): StoryState {
  this.core.restore(this.snapshotStack.pop()!);   // 弹栈恢复，状态零污染
  this.stats._deaths++;
  return this.core.advance()…;
}
```

- 恢复的是**选择前**的完整状态（含场景），visit counts / sequences / 变量全部干净
- 剧本无需声明 `#goto:` 返回点
- 同一个栈天然支持 Phase 5 的 rollback（retry 只是 rollback 的特例）
- 栈随存档持久化；可设上限（如 50 层）滚动丢弃最旧快照

### 7.3 场景状态与存档

inkjs 的 `state.ToJson()` 只含叙事状态。核心包的 `snapshot()` 统一合并：

```typescript
// packages/ink-vn-core —— snapshot() 的内容
interface CoreSnapshot {
  ink: string;          // story.state.ToJson()
  scene: SceneState;    // 当前 bg + 立绘（核心维护，因其解析舞台标签）
}

// app 层存档（shijiAdapter.getSaveState()）
interface ShijiSaveData {
  version: 2;                 // engine 版本标识
  coreSnapshot: string;
  snapshotStack: string[];    // retry/rollback 栈
  stats: { _choices: number; _correct: number; _deaths: number; _nodes: number };
  backlog: Segment[];         // 对话历史
}
```

### 7.4 统计与正确选项（v2 简化）

统计变量**不进 ink**（v1 的 ink `VAR _choices` 声明 + adapter 双份记账已废弃，双写必然漂移；且 `_` 前缀标识符在 ink 各版本行为不一）。单一数据源：adapter 监听 `onChoice(choice)`，检查 `choice.meta.correct` 更新 `_correct/_choices`。剧本若确需按统计分支（目前无此需求），届时经 `setVar` 单向同步。

### 7.5 关于EXTERNAL函数（进阶，不变）

ink 支持 `EXTERNAL` 绑定 JS 函数。Phase 1-4 不使用，保持标签驱动（与现有架构一致、剧本更干净）；Phase 5 若需要运行时求值的效果（如根据变量选表情）再引入。

---

## 八、测试与内容校验（v2 新增）

| 层 | 工具 | 内容 |
|----|------|------|
| 单元 | vitest（core 包内） | tagParser 全标签类型 + 边界（选项 tag 位置、悬空 tag、中文含冒号文本） |
| golden-run | vitest（core 包内） | headless 跑剧本 + 脚本化选择序列 → 快照断言输出序列；每条主线一条通关路径 + 每个死亡分支一条 |
| 内容 lint | `scripts/lint-ink.mjs` | sprite/achieve/death ID 存在性、knot 可达性、死亡 knot 含文本行；**接入 CI/check 脚本** |
| 回归 | 手动 + golden | Phase 2/4 验收 |

golden-run 测试同时是**开源后的核心测试资产**；lint 脚本是后续基于史记 130 卷批量产剧本时的**内容质检闸门**。

---

## 九、风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|---------|
| ink语法学习成本 | 剧本编写者需学习 ink DSL | 语法极简（~1小时）；前2个剧本由 codegen 自动转换；提供 cheatsheet |
| 标签解析边界情况 | 标签组合解析异常 | Phase 1 最小剧本显式覆盖已知陷阱（选项 tag 位置、悬空 tag、条件块内标签）；tagParser 单测 |
| ink tag 行为版本差异 | 悬空 tag / 选项 tag 各版本表现不一 | lint 强制"knot 必有文本行"；golden 测试锁定行为，inkjs 升级时测试兜底 |
| 生产包体积（Compiler） | inkjs/full 约 +100KB | Phase 3 预编译，生产用核心版 inkjs |
| 存档格式不兼容 | 旧存档无法加载 | 存档带 version 字段；切换时旧档提示重开（流程短，可接受） |
| inkjs 维护风险 | 更新缓慢 | ink 语言规范开放、API 自2016年稳定；核心包隔离了 inkjs——最坏情况可在包内换实现，app 无感 |
| 双引擎并存维护成本 | 两个 runner 并行 | 并存期控制在 Phase 0-4 的 ~5 天内 |
| 包抽象过度 | 核心包为通用性引入复杂度 | meta 透传是"更通用同时更简单"的设计，无插件机制、无配置项；核心仍只有 ~400 行 |

---

## 十、时间估算

| 阶段 | 工作量 | 累计 |
|------|--------|------|
| Phase 0：workspace + 接口基建 | 1天 | 1天 |
| Phase 1：核心 InkRunner + 测试基建 | 1.5天 | 2.5天 |
| Phase 2：codegen + 韩信迁移 + lint | 1天 | 3.5天 |
| Phase 3：能力增强 | 0.5-1天 | 4-4.5天 |
| Phase 4：全面切换 | 0.5天 | 4.5-5天 |
| **总计** | **4.5-5天** | |

较 v1 增加 ~0.5 天（workspace 基建 + 测试基建），换取：引擎核心可独立开源、retry 零状态污染、rollback 免费获得、批量内容生产有质检闸门。

---

## 十一、验收标准

### Phase 0 验收
- [ ] `npm run build` 无错误；workspace 解析正常
- [ ] 现有 TS 剧本游戏体验完全不变
- [ ] IStoryRunner 已建立；ESLint 包边界规则生效（core import src/ 会报错）

### Phase 1 验收
- [ ] 最小 ink 剧本经 VNEngine 正常渲染（对白/选项/背景/立绘/死亡/retry/存档）
- [ ] retry 后 sequence 文本不重复、visit 条件不误触发（快照方案的关键验证点）
- [ ] tagParser 单测 + golden-run 测试通过
- [ ] 核心包零 `src/` 依赖

### Phase 2 验收
- [ ] codegen 产出的 ink 版韩信完整7章可通关；所有死亡分支可触发并正确重试
- [ ] 成就、原文提示、AI史官、通关统计（死亡率/正确率）正确
- [ ] `lint-ink.mjs` 零报错；移动端布局无异常

### Phase 3 验收
- [ ] backlog 数据正确累积并随存档恢复
- [ ] 条件文本、字符串插值、tunnel 正常
- [ ] 生产构建不含 Compiler，包体积增量 < 50KB gzipped

### Phase 4 验收
- [ ] 所有故事线经 ink 引擎运行；旧 TS 剧本可安全移除
- [ ] golden 测试全绿；`npm run check` 通过
