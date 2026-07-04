# VN 叙事引擎升级技术方案

> **目标**：将自研 `StoryRunner` 渐进迁移至 **inkjs** 作为叙事内核，保留全部现有 React UI 和业务逻辑，解锁工业级分支叙事能力。
>
> **原则**：零破坏性、可回滚、双引擎并存、逐剧本迁移。

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
| **标签元数据系统** | ❌ 缺失 | hint/correct等是硬编码字段 |
| **随机/洗牌** | ❌ 缺失 | 无随机机制 |
| **多路径汇聚** | ⚠️ 弱 | 需要显式goto到同一节点，无天然汇聚点 |
| BGM实际播放 | ❌ 缺失 | 只有回调，无音频实现 |

---

## 二、ink/inkjs 选型理由

| 维度 | inkjs | 说明 |
|------|-------|------|
| 成熟度 | ⭐⭐⭐⭐⭐ | 2016年至今，v2.4.0，用于《80 Days》等商业游戏 |
| 许可证 | MIT | 商业友好，无传染风险 |
| 依赖 | **零运行时依赖** | 打包体积 ~几十KB gzipped |
| TypeScript | 原生支持 | 完整.d.ts |
| 叙事能力 | 工业级 | 分支/变量/条件/调用栈/随机/函数/外部绑定/标签 |
| 存档 | 一行JSON | `state.ToJson()` / `state.LoadJson()` |
| React集成 | 极简 | useRef持有Story实例，useState驱动UI |
| 渲染侵入 | 零 | 纯状态机，不关心渲染层 |

---

## 三、ink 标签体系设计

利用 ink 的 `#tag` 机制，将现有领域语义映射为标签。每行文本/选项可携带多个标签。

### 3.1 标签规范

| 标签 | 适用位置 | 格式 | 含义 | 现有对应 |
|------|---------|------|------|---------|
| `#speaker:NAME` | 对白行 | `#speaker:韩信` | 说话人 | ContentItem.speaker |
| `#hint:TEXT` | 对白/选项行 | `#hint:孰视之...` | 古文原文提示 | ContentItem.hint / Choice.hint |
| `#bg:ID` | 任意行（通常knot开头） | `#bg:huaiyin_street` | 切换背景 | {bg: "..."} |
| `#show:ID:EXPR:POS` | 任意行 | `#show:tuzhong:mocking:right` | 显示立绘 | {show: {...}} |
| `#hide:ID` | 任意行 | `#hide:tuzhong` | 隐藏立绘 | {hide: "..."} |
| `#bgm:ID` | 任意行 | `#bgm:lonely` | 播放BGM | {bgm: "..."} |
| `#achieve:ID` | 任意行 | `#achieve:xiakua` | 触发成就 | {achieve: "..."} |
| `#correct` | 选项行 | `#correct` | 正确选项标记 | Choice.correct |
| `#death:REASON` | knot首行（死亡节点） | `#death:因一时之忿杀人...` | 死亡结局 | DeathInfo.reason |
| `#classical:TEXT` | 死亡knot | `#classical:于是信孰视之...` | 死亡古文引用 | DeathInfo.classical |
| `#analysis:TEXT` | 死亡knot | `#analysis:史上的韩信...` | 死亡分析 | DeathInfo.analysis |
| `#narration` | 对白行 | `#narration` | 旁白（speaker为空或旁白时也自动识别） | — |

### 3.2 标签解析优先级

1. 每行文本先去除标签部分作为对白文本
2. 解析出的标签按类型分类
3. 没有 `#speaker:` 标签的文本行默认视为旁白
4. 选项上的 `#hint` 和 `#correct` 绑定到该选项
5. 死亡knot（只有标签无对白，divert到END或特定节点）特殊处理

---

## 四、架构设计

### 4.1 目标架构

```
┌─────────────────────────────────────────────────────────┐
│          PlayPage / VNEngine / 所有UI组件                │
│          ← 完全不动，消费 StoryState 接口                 │
└──────────────────────┬──────────────────────────────────┘
                       │ StoryState (接口不变!)
┌──────────────────────▼──────────────────────────────────┐
│                  useStory() hook                         │
│  ┌────────────────┐  ┌────────────────────────────┐     │
│  │ StoryRunner    │  │ InkRunner (新增)            │     │
│  │ (现有,保留)    │  │  ← 统一接口 IStoryRunner    │     │
│  │                │  │  ├─ advance()              │     │
│  │                │  │  ├─ choose(i)              │     │
│  │                │  │  ├─ retry()                │     │
│  │                │  │  ├─ getSaveState()         │     │
│  │                │  │  ├─ loadSaveState()        │     │
│  │                │  │  └─ getVars()              │     │
│  └────────────────┘  └─────────────┬──────────────┘     │
│         │                          │                    │
│         └─────────┬────────────────┘                    │
│                   │ 工厂函数 createRunner(storyKey)      │
└───────────────────┼─────────────────────────────────────┘
                    │
          ┌─────────▼──────────┐
          │   剧本加载层        │
          │ ├─ .ts 旧格式(Story)│
          │ └─ .ink 新格式      │
          └────────────────────┘
```

### 4.2 核心接口：IStoryRunner

定义统一接口，新旧runner都实现它。

```typescript
// engine/IStoryRunner.ts (新增)
export interface IStoryRunner {
  advance(): StoryState;
  choose(index: number): StoryState;
  retry(): StoryState;
  restart(): void;
  getVars(): Vars;
  getChoiceRate(): number;
  getDeathCount(): number;
  getCompletedNodes(): number;
  getSaveState(): string;
  loadSaveState(json: string): void;
}
```

### 4.3 InkRunner 设计

InkRunner 是适配层，将 inkjs 的 `Story` 包装成 `IStoryRunner` 接口，输出与现有完全一致的 `StoryState`。

#### 4.3.1 核心职责

1. **加载ink剧本**：通过Vite的`?raw`导入`.ink`文件，使用inkjs的Compiler编译为Story实例（开发模式）；生产模式可预编译为JSON加载
2. **逐行推进（advance）**：调用 `story.Continue()` 循环直到遇到选项/结束，收集过程中的文本和标签
3. **解析标签**：将每行的 `#tags` 解析为结构化的 `ContentItem` 效果（bg/show/hide/bgm/achieve等），通过 `EngineCallbacks` 触发
4. **场景状态维护**：InkRunner内部维护当前场景（bg、characters），因为inkjs本身不管理视觉状态
5. **死亡节点识别**：遇到带有`#death`标签的knot，构造DeathInfo
6. **正确选项统计**：选择时检查选项是否有`#correct`标签，更新_correct计数
7. **存档序列化**：组合 inkjs 的 `state.ToJson()` + 场景状态快照

#### 4.3.2 标签解析器

```typescript
// engine/inkTagParser.ts (新增)
export interface ParsedLine {
  text: string;           // 去除标签后的纯文本
  speaker?: string;
  hint?: string;
  narration: boolean;
  tags: RawTag[];
}

export interface ParsedTags {
  bg?: string;
  show?: { id: string; expr?: string; pos?: Position };
  hide?: string;
  bgm?: string;
  achieve?: string;
  correct?: boolean;
  death?: { reason: string; classical?: string; analysis?: string; goto?: string };
}

export function parseInkLine(lineText: string, lineTags: string[]): ParsedLine;
export function extractEffects(tags: string[]): { effects: ParsedTags; remaining: string[] };
```

#### 4.3.3 InkRunner 状态管理

InkRunner 需要额外维护inkjs不管的视觉/元状态：

```typescript
interface InkRunnerInternal {
  story: Story;                    // inkjs实例
  scene: SceneState;               // 当前背景+立绘（与useStory中的scene对齐）
  cb: EngineCallbacks;             // 与现有一致
  vars: {                          // 统计变量（与现有一致）
    _choices: number;
    _correct: number;
    _deaths: number;
    _nodes: number;
  };
  pendingDeathReturn?: string;     // 死亡后retry返回点
  lastChoices: InkChoiceInfo[];    // 当前选项列表（含标签元数据）
  currentKnotTags: ParsedTags;     // 当前knot级别的标签（如death）
}
```

### 4.4 文件变更清单

| 操作 | 文件 | 说明 |
|------|------|------|
| **新增** | `src/react-app/engine/IStoryRunner.ts` | 统一接口定义 |
| **新增** | `src/react-app/engine/InkRunner.ts` | inkjs适配层（核心，~300行） |
| **新增** | `src/react-app/engine/inkTagParser.ts` | ink标签解析器（~150行） |
| **新增** | `src/react-app/engine/createRunner.ts` | 工厂函数，根据key返回对应runner |
| **新增** | `src/react-app/data/stories/ink/` | .ink剧本文件目录 |
| **新增** | `src/react-app/data/stories/ink/hanxin.ink` | 韩信剧本ink版 |
| **修改** | `src/react-app/engine/storyRunner.ts` | 让StoryRunner实现IStoryRunner接口（加implements，不改逻辑） |
| **修改** | `src/react-app/hooks/useStory.ts` | 改用createRunner工厂，其余逻辑几乎不动 |
| **修改** | `src/react-app/data/stories/index.ts` | 增加ink剧本的加载和注册 |
| **修改** | `src/react-app/vite-env.d.ts` | 添加`*.ink?raw`的类型声明 |
| **不动** | `VNEngine.tsx` | 零改动 |
| **不动** | `DialogueBox.tsx` | 零改动 |
| **不动** | `ChoicePanel.tsx` | 零改动 |
| **不动** | `DeathScreen.tsx` | 零改动 |
| **不动** | `ClearScreen.tsx` | 零改动 |
| **不动** | `CharacterSprite.tsx` | 零改动 |
| **不动** | `ClassicalHint.tsx` | 零改动 |
| **不动** | `AiHintModal.tsx` | 零改动 |
| **不动** | 所有CSS | 零改动 |
| **不动** | 所有store（Zustand） | 零改动 |
| **不动** | 所有页面/路由 | 零改动 |

---

## 五、剧本格式转换示例

以韩信第一章为例，展示从TS对象到ink的转换。

### 5.1 现有TS格式（hanxin.ts 片段）

```typescript
c1_intro: {
  content: [
    { bg: "huaiyin_street" },
    { bgm: "lonely" },
    {
      say: "淮阴。你是韩信，家贫无行...",
      speaker: "旁白",
    },
    {
      say: "你腰间始终佩着一柄长剑——那是你唯一的体面。",
      speaker: "旁白",
    },
    { show: { id: "tuzhong", expr: "mocking", pos: "right" } },
    {
      say: "市井屠中，一名少年拦住你...",
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
      hint: "孰视之——这不是怯懦...",
    },
  ],
},
```

### 5.2 ink格式（hanxin.ink 对应片段）

```ink
// ============================================
// 兵仙韩信 · 七章
// 史源：《史记·淮阴侯列传》
// ============================================

VAR _choices = 0
VAR _correct = 0
VAR _deaths = 0
VAR _nodes = 0

=== c1_intro ===
#bg:huaiyin_street
#bgm:lonely
淮阴。你是韩信，家贫无行，不得推择为吏，又不能治生商贾，常从人寄食，人多厌之。
你腰间始终佩着一柄长剑——那是你唯一的体面。
#show:tuzhong:mocking:right
市井屠中，一名少年拦住你，当众羞辱：『你虽长大，好带刀剑，其实胆怯耳！』 #speaker:少年
『信能死，刺我；不能死，出我袴下！』 #speaker:少年 #hint:于是信孰视之，俛出袴下，蒲伏。一市人皆笑信，以为怯。

* [拔剑而起，一剑刺死辱我之人] -> c1_death_kill
* [孰视良久，俯身从他胯下钻过] -> c1_pass #correct #hint:孰视之——这不是怯懦，是掂量过生死之后的隐忍。

=== c1_pass ===
你定定地看了他许久，俯身，伏地，从那少年的胯下缓缓爬过。满市的人都笑你怯懦。
#achieve:xiakua
可你心里清楚：杀一个无赖，换来的是一条逃亡的命；忍下这口气，留住的是一身将来。 #speaker:韩信
-> c2_intro

=== c1_death_kill ===
#death:因一时之忿杀人，亡命天涯，兵仙就此夭折
#classical:于是信孰视之，俛出袴下，蒲伏。
#analysis:史上的韩信选择了钻胯下。杀掉那个无赖，他便要亡命逃匿，再无登坛拜将之日。大丈夫能屈能伸——所谓『孰视之』，是看清了忍辱与前程孰轻孰重。
#goto:c1_intro
-> END
```

### 5.3 鸿门宴计数器（ink新能力）

现有TS格式中 `fanzeng_ignored` 只能计数，无法根据值分支。ink版本：

```ink
VAR fanzeng_ignored = 0

=== banquet ===
#bg:tent_feast
#show:fanzeng:anxious:left
#show:liubang:humble:right
次日，刘邦亲来谢罪：『臣与将军戮力而攻秦...』 #speaker:旁白
（他言辞如此谦卑……杀他，岂非令天下笑我项羽不能容人？） #speaker:项羽
席间，范增频频以眼色示意，三次举起腰间玉玦。 #speaker:旁白 #hint:玉玦，谐音『决』——范增在催你下决心。

* [默然不应，举杯与沛公共饮] -> jue2 #correct { fanzeng_ignored += 1 } #hint:项王默然不应——史上的项羽，此刻并未动手。
* [会意，按剑起身，当场击杀刘邦] -> death_kill

=== jue2 ===
{ fanzeng_ignored >= 3:
    三次举玦你皆不应。范增怒而离席，以剑劈碎玉斗：『竖子不足与谋！』 #speaker:旁白
    #achieve:yafu_sigh
- else:
    范增见你不动，神色愈急，再次举玦相示。 #speaker:旁白 #hint:举所佩玉玦以示之者三。
}
* [仍旧默然，谈笑风生] -> jue3 #correct { fanzeng_ignored += 1 }
* [唤左右武士，借故发难] -> death_kill

=== jue3 ===
第三次，范增几乎要从席上站起，玉玦在烛火下泛着冷光。
* [第三次，依旧默然不应] -> after_jue3 #correct { fanzeng_ignored += 1 }
* [终于会意，掷杯为号] -> death_kill
```

注意ink天然支持的条件文本 `{cond: A | B}` 和变量运算 `{fanzeng_ignored += 1}`——这是现有TS格式需要大量样板代码才能实现的。

---

## 六、分阶段实施计划

### Phase 0：基础设施（预计 0.5 天）

**目标**：安装依赖、建立接口、不改动任何现有功能。

- [ ] 安装inkjs：`npm install inkjs`
- [ ] 创建 `engine/IStoryRunner.ts` 接口
- [ ] 修改 `StoryRunner` 实现 `IStoryRunner` 接口（加implements，逻辑不变）
- [ ] 创建 `engine/createRunner.ts` 工厂，暂时全部返回StoryRunner
- [ ] 修改 `useStory.ts` 使用工厂函数（验证行为不变）
- [ ] 添加 `vite-env.d.ts` 中 `*.ink?raw` 类型声明
- [ ] **验收**：`npm run build` 通过，现有功能完全正常

### Phase 1：InkRunner 核心实现（预计 1-1.5 天）

**目标**：实现InkRunner和标签解析器，能跑通一个简单ink剧本。

- [ ] 实现 `engine/inkTagParser.ts`（标签解析、纯文本提取）
- [ ] 实现 `engine/InkRunner.ts`：
  - [ ] 加载和编译ink故事（使用inkjs/full的Compiler，支持?raw导入）
  - [ ] advance()：ContinueMaximally → 收集文本+标签 → 解析效果 → 构造StoryState
  - [ ] choose()：ChooseChoiceIndex → continue → 更新统计
  - [ ] 场景状态维护（bg/show/hide通过回调触发）
  - [ ] 死亡节点识别（#death标签knot）
  - [ ] retry()：死亡后回到指定节点
  - [ ] 存档/读档：组合inkjs state.ToJson() + 场景快照
- [ ] 创建测试用ink文件（最小验证剧本）
- [ ] 在createRunner中增加ink runner分支
- [ ] **验收**：写一个简单的ink测试剧本（1个背景+2句对白+1个选择+1个死亡），能通过VNEngine正常渲染

### Phase 2：试点迁移——韩信剧本（预计 1 天）

**目标**：将hanxin.ts完整迁移为ink格式，双runner并存验证。

- [ ] 编写 `data/stories/ink/hanxin.ink`（将现有7章内容逐章转换）
- [ ] 在 `data/stories/index.ts` 中注册ink版韩信（key如 `hanxin_ink`）
- [ ] 在storylines中创建一个"测试"perspective指向ink版
- [ ] 手动测试完整流程：7章通关、各死亡分支、成就触发、原文提示、AI提示
- [ ] 修复InkRunner中发现的bug
- [ ] **验收**：ink版韩信与TS版韩信体验完全一致，所有UI组件正常工作

### Phase 3：InkRunner 能力增强（预计 0.5-1 天）

**目标**：解锁ink带来的新能力。

- [ ] 添加对话历史功能（利用inkjs的state访问已访问路径）
- [ ] 验证条件内容（{cond: A | B}）在剧本中可用
- [ ] 验证字符串变量和文本插值（{variable}）
- [ ] 验证call/return（可复用的子场景如"觐见"通用片段）
- [ ] 完善存档：确保场景状态（立绘、背景）正确保存恢复
- [ ] 生产构建优化：预编译ink为JSON，避免将Compiler打入生产包
- [ ] **验收**：新能力正常工作，不影响现有TS剧本

### Phase 4：全面切换（预计 0.5 天）

**目标**：将默认runner切换为ink，迁移剩余剧本。

- [ ] 将hongmenXiangyu.ts迁移为ink
- [ ] 更新storylines配置，所有perspective指向ink版key
- [ ] 删除旧的TS剧本文件（或保留为参考）
- [ ] 将createRunner的默认fallback改为InkRunner
- [ ] 完整回归测试：所有故事线、所有死亡分支、成就、存档、AI提示
- [ ] **验收**：所有故事线通过ink引擎运行，TS剧本文件可移除

### Phase 5（可选）：高级特性

- [ ] 回退（Rollback）功能：玩家可以撤销上一步选择
- [ ] 对话日志面板：查看已读对话
- [ ] BGM/SFX音频播放实现（Howler.js）
- [ ] 随机事件支持
- [ ] 剧本编辑工具/热重载

---

## 七、关键技术细节

### 7.1 ink文件加载方式

**开发模式**：直接用`?raw`导入ink源码，运行时编译。

```typescript
// data/stories/ink/hanxin.ink?raw → Vite返回ink源码字符串
import hanxinSource from "./ink/hanxin.ink?raw";
import { Compiler } from "inkjs/full";

const story = new Compiler(hanxinSource).Compile();
```

**生产模式**：预编译为JSON，减小bundle体积。

```typescript
// scripts/precompile-ink.mjs (构建脚本)
import { Compiler } from "inkjs/full";
import fs from "fs";

const inkFiles = glob("src/react-app/data/stories/ink/*.ink");
for (const file of inkFiles) {
  const source = fs.readFileSync(file, "utf-8");
  const story = new Compiler(source).Compile();
  const json = story.ToJson();
  fs.writeFileSync(file.replace(".ink", ".ink.json"), json);
}
```

生产环境加载：
```typescript
import hanxinJson from "./ink/hanxin.ink.json";
const story = new Story(hanxinJson);  // 不需要Compiler，包更小
```

### 7.2 死亡节点处理

死亡节点在ink中是一个特殊knot，携带`#death`、`#classical`、`#analysis`标签，divert到END或goto标签指向的重试点。

InkRunner的advance逻辑：
1. ContinueMaximally() 收集文本
2. 在Continue过程中，如果遇到标签包含`#death`，标记为死亡状态
3. 如果当前knot有`#goto:XXX`标签，记住返回点用于retry()
4. 如果canContinue=false且无choices且有death标记，返回death状态
5. retry()时，ChoosePathString到#goto指定的knot，重新advance

### 7.3 场景状态与存档

inkjs的`state.ToJson()`只保存叙事状态（变量、调用栈、visit计数等），不保存视觉状态。InkRunner需要在存档时额外保存：

```typescript
interface InkSaveData {
  inkState: string;      // inkjs序列化的状态
  scene: SceneState;     // 当前背景+立绘状态
  deathReturn?: string;  // 待返回的死亡重试点
  stats: {
    _choices: number;
    _correct: number;
    _deaths: number;
    _nodes: number;
  };
}
```

### 7.4 正确选项统计

ink中选项可以携带`#correct`标签。InkRunner.choose()时：
1. 检查被选中的选项的tags是否包含`#correct`
2. 更新ink变量`_correct`（通过`story.variablesState['_correct'] = newValue`）
3. 同步InkRunner内部统计

注：也可以在ink中用EXTERNAL函数绑定JS回调来做成就触发，但标签方式更直观且不污染ink脚本。

### 7.5 关于EXTERNAL函数（进阶）

ink支持`EXTERNAL`关键字绑定JS函数，可用于未来扩展：

```ink
EXTERNAL play_bgm(track)
EXTERNAL show_sprite(id, expr, pos)
EXTERNAL unlock_achievement(id)
```

```typescript
story.BindExternalFunction("play_bgm", (track: string) => {
  // 实际音频播放逻辑
});
```

**Phase 1-4不使用EXTERNAL**，保持标签驱动方式（更接近现有架构）；Phase 5可考虑迁移到EXTERNAL以获得更强的表达能力。

---

## 八、风险与应对

| 风险 | 影响 | 应对策略 |
|------|------|---------|
| ink语法学习成本 | 剧本编写者需要学习ink DSL | ink语法极简（~1小时掌握），提供转换模板和cheatsheet；前2个剧本由技术侧完成转换 |
| 标签解析遗漏边界情况 | 某些标签组合解析异常 | Phase 2用完整剧本做充分测试；标签解析器写单元测试 |
| 生产包体积（含Compiler） | inkjs/full含编译器，约增加~100KB | Phase 3实现预编译，生产环境用不含Compiler的核心版`inkjs`（非inkjs/full） |
| 存档格式不兼容 | 旧TS剧本存档无法在ink版加载 | Phase 4切换时清空存档或做版本迁移；存档key包含engine版本标识 |
| inkjs单维护者风险 | 类似Pixi'VN，单人维护 | inkjs已稳定（从2016年至今，核心API未大变），且ink语言规范是开放的；风险远低于采用全新引擎 |
| 双引擎并存期维护成本 | 需要同时维护两个runner | Phase 0-4控制在3-4天内完成，并存期不超过1周 |

---

## 九、时间估算

| 阶段 | 工作量 | 累计 |
|------|--------|------|
| Phase 0：基础设施 | 0.5天 | 0.5天 |
| Phase 1：InkRunner核心 | 1-1.5天 | 2天 |
| Phase 2：试点迁移（韩信） | 1天 | 3天 |
| Phase 3：能力增强 | 0.5-1天 | 3.5-4天 |
| Phase 4：全面切换 | 0.5天 | 4-4.5天 |
| **总计** | **4-4.5天** | |

Phase 5 高级特性为可选项，按需排期。

---

## 十、验收标准

### Phase 0 验收
- [ ] `npm run build` 无错误
- [ ] 现有TS剧本（韩信、鸿门宴）游戏体验完全不变
- [ ] IStoryRunner接口已建立，StoryRunner实现它

### Phase 1 验收
- [ ] InkRunner可加载并运行简单ink剧本
- [ ] 对白、选项、背景切换、立绘显示正常
- [ ] 死亡和重试正常
- [ ] 存档/读档正常

### Phase 2 验收
- [ ] ink版韩信完整7章可通关
- [ ] 所有死亡分支可触发并正确重试
- [ ] 成就正确触发（胯下之辱、兵仙诞生等）
- [ ] 原文提示在对白和选项上正常显示
- [ ] AI史官功能正常工作
- [ ] 通关统计（死亡率、正确率）正确
- [ ] 移动端响应式布局无异常

### Phase 3 验收
- [ ] 条件文本（{cond: A | B}）正常工作
- [ ] 字符串变量和插值正常
- [ ] 生产构建不含Compiler，包体积增量 < 50KB gzipped

### Phase 4 验收
- [ ] 所有故事线通过ink引擎运行
- [ ] 旧TS剧本可安全移除
- [ ] 完整回归测试通过
- [ ] `npm run check`（tsc + build + deploy --dry-run）通过
