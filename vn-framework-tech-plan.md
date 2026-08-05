# @chronicle-vn-game — 通用历史VN游戏框架

## 1. 背景与动机

shiji 项目经过多轮迭代，沉淀了一套完整的叙事型 VN（Visual Novel）游戏基础设施。当前这些能力散落在项目各处：

- `packages/ink-vn-core/` — 已独立为 npm 包，仅含叙事引擎
- `src/react-app/engine/` — 游戏逻辑适配层（死亡/结局/正史模式）
- `src/react-app/minigames/` — 小游戏插件系统
- `src/react-app/data/achievements/` — 成就注册表系统
- `src/react-app/pages/Play/` — VN 播放器 UI 组件
- `src/react-app/hooks/useStory.ts` — 叙事流程编排

**直接抽取为多个独立工具的问题**：这些模块之间有天然耦合关系——小游戏协议依赖叙事引擎的标签机制（`#minigame:id`），成就触发依赖 `advance()` 回调的 meta 消费，UI 组件依赖 `IStoryRunner` 接口。拆成三个独立包，用户需要手动编写大量胶水代码。

**更优方案**：统一为一个 `@chronicle-vn-game` 包，通过子路径按需导出，tree-shaking 友好。同时保留 `ink-vn-core` 作为轻量级独立包存在，满足"只要叙事引擎，不要 UI"的场景。

---

## 2. 整体架构

```
@chronicle-vn-game
├── /narrative       ← 核心叙事引擎（InkRunner + tagParser），即 ink-vn-core
├── /adapter         ← 游戏逻辑适配层（死亡/结局注册表、正史模式、存档序列化）
├── /plugin          ← 小游戏插件系统（GameHost + registry）
├── /achievement     ← 成就框架（类型定义 + 注册表聚合模式）
├── /ui              ← 通用 VN 组件（DialogueBox, ChoicePanel, DeathScreen 等）
├── /hooks           ← useStory（编排叙事全流程的 React Hook）
└── /types           ← 共享类型（Segment, StoryState, Position 等）
```

### 分层依赖

```
用户项目（领域数据：角色、剧本、场景资源）
  └── @chronicle-vn-game
       ├── /hooks ────── 依赖 /adapter, /ui, /narrative
       ├── /adapter ──── 依赖 /narrative, /types
       ├── /ui ───────── 依赖 /types
       ├── /plugin ───── 依赖 /types
       ├── /achievement ─ 纯数据层，无依赖
       ├── /narrative ─── 依赖 inkjs（peerDep）
       └── /types ─────── 无依赖
```

### 与 shiji 本项目的关系

```
shiji（timeslip-shiji）  ← 用户项目，提供领域数据
  ├── characters / storylines / .ink 剧本
  ├── sceneAssets / 场景资源
  ├── userStore（游戏进度、抽卡等）
  └── 使用 @chronicle-vn-game 的 /adapter, /ui, /hooks, /plugin
```

---

## 3. 模块设计

### 3.1 /narrative — 核心叙事引擎

**即已有的 `ink-vn-core` 包**，直接作为子路径 re-export：

```typescript
// @chronicle-vn-game/narrative
export { InkRunner, type InkRunnerOptions } from "ink-vn-core";
export { parseInkLine, extractStageEffects } from "ink-vn-core";
export type {
  NarrativeRunner,
  RunnerOutput,
  RunnerChoice,
  Segment,
  RunnerState,
  StageCallbacks,
  TagMeta,
  Position,
} from "ink-vn-core";
```

**包内同时保留独立入口**：`ink-vn-core` 继续以独立 npm 包存在，用户可以 `npm install ink-vn-core` 只拿叙事引擎。

### 3.2 /adapter — 游戏逻辑适配层

基于 `ShijiInkAdapter` 泛化，核心职责是**将纯叙事引擎的输出转化为应用层可消费的游戏状态**。

```typescript
// @chronicle-vn-game/adapter

// 死亡注册表条目
export interface DeathEntry {
  reason: string; // 死亡原因（用户可见）
  classical: string; // 原文线索
  analysis: string; // 史识分析
}

// 结局注册表条目
export interface EndingEntry {
  title: string; // 结局名
  kind: "canon" | "if"; // 史实/反事实
  epigraph?: string; // 判词
}

// 叙事配置
export interface StoryConfig {
  key: string;
  source: string; // .ink 源码或预编译 JSON
  precompiled?: boolean;
  initialVars?: Record<string, number | boolean | string>;
  deaths: Record<string, DeathEntry>;
  endings?: Record<string, EndingEntry>;
}

// 适配器选项
export interface AdapterOptions {
  strict?: boolean; // 正史模式
}

// 引擎回调
export interface EngineCallbacks {
  onAchievement?: (id: string) => void;
  onBackground?: (bg: string) => void;
  onShowCharacter?: (id: string, expr: string, pos: Position) => void;
  onHideCharacter?: (id: string) => void;
  onBGM?: (track: string) => void;
}

// 游戏全量状态
export interface StoryState {
  nodeId: string;
  segments: StorySegment[];
  choices: StoryChoice[];
  death: {
    id?: string;
    reason: string;
    classical: string;
    analysis: string;
  } | null;
  ended: boolean;
  hint?: string;
  vars: Record<string, VarValue>;
  endingAchievement?: string;
  ending?: {
    id: string;
    title: string;
    kind: "canon" | "if";
    epigraph?: string;
  };
  actClear?: { actName: string; actIndex: number };
  minigame?: { id: string; param?: string };
}

// 游戏运行器接口
export interface IStoryRunner {
  advance(): StoryState;
  choose(index: number): StoryState;
  retry(): StoryState;
  restart(): void;
  getVars(): Record<string, VarValue>;
  getChoiceRate(): number;
  getDeathCount(): number;
  getCompletedNodes(): number;
  getSaveState(): string;
  loadSaveState(json: string): void;
  completeMinigame(result: "win" | "lose" | "skip", score?: number): StoryState;
}
```

**核心实现**：`VNAdapter` 类（原 `ShijiInkAdapter` 的泛化版本），包裹 `InkRunner`，增加：

- 死亡/结局注册表查找
- 正史模式（strict mode）的前瞻探测
- 选择/死亡/节点统计
- 存档序列化（ink 快照 + 统计数据）
- 小游戏完成回调（写回 ink 变量后继续推进）

#### 3.2.1 正史模式（strict）前瞻探测 — 契约最重的部分

这是整个框架最易出错、最需要定型的逻辑。泛化时**必须保留以下行为**，否则历史教育向的判定会失真：

1. **前瞻探测**：选中未标 `#correct` 的选项（且同组存在 `#correct` 项）时，静默模拟该分支走向。若分支自然走到 `#death` → 放行，播放作者写好的死亡文案；若分支存活（到下一抉择点或直达反事实结局）→ 判"偏离正史"失败。**探测有 300 步上限保护**，异常时保守放行。
2. **探测期间全静默**：`probing` 开关需抑制舞台回调（背景/立绘/BGM）与统计，避免探测分支的副作用泄漏到 UI。小游戏在探测期间假设胜利（`setVar mg_result=win`）后继续推进。
3. **合成死亡**：strict 失败时合成一次 `death.id === "strict"` 的死亡，且**不入死亡图鉴**（图鉴只收录作者写好的 `#death`）。
4. **选项洗牌**：`shuffleChoices` 用 Fisher-Yates 打乱展示顺序，但每个 `StoryChoice` 保留 ink 原始 index，`choose(index)` 仍映射回正确分支。**打乱纯属展示层，不影响正史判定/死亡探测**。不要在泛化时"顺手"去掉或改掉这个机制。

建议把该逻辑整理为独立模块 `strict-probe.ts`（而非平铺在 `VNAdapter` 里），并配独立文档说明判定规则与边界情况。

#### 3.2.2 存档格式与版本迁移

`getSaveState()` 返回 JSON：`{ inkSnapshot, vars, lastChoiceSnapshot }`。`loadSaveState()` 对损坏数据回退 `restart()`。泛化时需注意：

- `inkSnapshot` 存的是**段起点（checkpoint）**，加载后 `advance()` 会重放该段内容——这是存档恢复的正确姿势，不要改成存当前游标。
- **存档结构升级后需迁移兼容**：建议在快照里加 `version` 字段，`loadSaveState` 按版本做轻量迁移，避免旧存档因结构变化直接丢弃。

#### 3.2.3 小游戏分数与 meta-only 段过滤

- **`completeMinigame` 的 score clamp**：`Math.max(0, Math.min(100, Math.round(score ?? (result === "win" ? 100 : 0))))`，且 `skip` 时 score=0。这个边界处理泛化时不能丢。
- **`visibleSegments` 过滤**：`state.segments` 中包含 meta-only 段（如 `#actclear` 的 `text: ""`），UI 渲染前需 `filter(s => s.text.length > 0)`。shiji 在 `VNEngine` 里做这个过滤，泛化后建议下沉到 `useStory` 的返回值中（直接返回过滤后的 `visibleSegments`），避免每个 UI 组件重复过滤。

### 3.3 /plugin — 小游戏插件系统

**即已有的 minigames 系统**，泛化为通用插件框架：

```typescript
// @chronicle-vn-game/plugin

export type PluginResult = "win" | "lose" | "skip";

export interface PluginOutcome {
  result: PluginResult;
  score?: number;
}

export interface PluginProps {
  param?: string;
  storyKey?: string;
  onComplete: (outcome: PluginOutcome) => void;
  onSkip: () => void;
}

export type PluginMode = "free" | "canon" | "strict";

export interface PluginMeta {
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  modes: PluginMode[];
}

export interface PluginEntry {
  id: string;
  Component: ComponentType<PluginProps>;
  meta: PluginMeta;
}

// 注册表 API
export function registerPlugin(entry: PluginEntry): void;
export function getPlugin(id: string): PluginEntry | undefined;
export function listPlugins(): PluginEntry[];
export function hasPlugin(id: string): boolean;

// 通用宿主组件
export function PluginHost(props: {
  pluginId: string;
  param?: string;
  storyKey?: string;
  mode: PluginMode;
  onComplete: (outcome: PluginOutcome) => void;
}): JSX.Element | null;
```

设计要点：

- 使用 `PluginHost` 替代 `GameHost`，语义更通用
- 保留三段式生命周期：intro → playing → done
- strict 模式不可跳过，其他模式可跳过（跳过=自动胜利）

### 3.4 /achievement — 成就框架

**纯数据层**，不依赖 React 或任何运行时：

```typescript
// @chronicle-vn-game/achievement

export type AchievementType =
  | "story" // 通关
  | "historical" // 历史还原
  | "death" // 死亡里程碑
  | "skill" // 技能评级
  | "collection" // 收藏
  | "exploration" // 探索
  | "easter_egg" // 彩蛋
  | "cross_character"; // 跨视角

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  quote: string;
  type: AchievementType;
  points: number;
  icon: string;
  hidden?: boolean;
}

// 聚合注册表
export class AchievementRegistry {
  private achievements: Map<string, AchievementDef> = new Map();

  register(def: AchievementDef): void;
  registerAll(defs: AchievementDef[]): void;
  get(id: string): AchievementDef | undefined;
  list(): AchievementDef[];
  listByType(type: AchievementType): AchievementDef[];
}

// 分系列注册函数
export function createSeriesRegistry<T extends string>(
  seriesId: T,
  getDefs: (series: T) => AchievementDef[],
): () => AchievementDef[];
```

设计要点：

- 鼓励用户按系列/模块分文件组织成就定义
- 框架只提供注册和查询能力，不涉及触发逻辑
- 触发由叙事引擎的 `#achieve:ID` 标签通过 `onAchievement` 回调驱动

### 3.5 /ui — 通用 VN 组件

从 shiji 项目中提取的 React 组件，**不包含任何 shiji 领域数据**：

| 组件                    | 来源                     | 职责                                                       |
| ----------------------- | ------------------------ | ---------------------------------------------------------- |
| `DialogueBox`           | Play/DialogueBox.tsx     | 打字机效果对话展示，支持文字速度、自动播放、原文提示按钮   |
| `ChoicePanel`           | Play/ChoicePanel.tsx     | 选项展示，支持打乱顺序、提示按钮、AI 点拨入口              |
| `CharacterSprite`       | Play/CharacterSprite.tsx | 立绘渲染，支持位置/表情/说话状态动画                       |
| `DeathScreen`           | Play/DeathScreen.tsx     | 死亡界面，展示原因/原文/分析，重试/查看原文操作            |
| `ClearScreen`           | Play/ClearScreen.tsx     | 通关界面，评级/统计数据/结局展示/下一篇导航                |
| `ActClearCard`          | Play/ActClearCard.tsx    | 幕间过场卡片，展示本幕统计数据                             |
| `ClassicalHint`         | Play/ClassicalHint.tsx   | 原文提示浮层（展示史书原文线索）                           |
| `AiHintModal`           | Play/AiHintModal.tsx     | AI 点拨弹窗（喂入当前剧情/选项/原文，返回建议）            |
| `SceneAssetsProvider`   | 新增                     | 场景资源解析 Context（背景/立绘 id → 实际图片 URL）        |
| `StorySettingsProvider` | 新增                     | 播放器级 UI 状态 Context（文字速度/自动播放/原文提示开关） |
| `AudioProvider`         | 新增                     | BGM/音效播放 Context（audio 元素生命周期、开关）           |
| `VNEngine` 模板         | Play/VNEngine.tsx        | 完整 VN 播放页面模板，展示所有组件的组合方式               |

**VNEngine 不直接导出**，而是作为**参考实现**放在 `docs/` 中，用户可复制到自己的项目后按需修改。框架提供的是 `useStory` Hook 和各个独立组件，用户自行组装。

#### 3.5.0 组件的实际 props 契约与领域拆分

从 shiji 提取时，以下组件的 props 与方案直觉**不一致**，必须明确：

**`ClearScreen`（通关界面）**：

- shiji 实际签名：`(storyId, storyTitle, deaths, choiceRate, isCanon, isCanonEnding, ending, endingsUnlocked, endingsTotal, onRestart)`。
- **问题**：内部用 `useNavigate` + `getStoryline`/`getNextStoryline`（硬依赖 react-router 和 storylines 领域数据）做"返回篇章/下一条故事线"导航。
- **泛化方案**：拆成两层——框架提供**纯展示层**（评级 S/A/B/C、结局名/判词、统计数据），导航逻辑（返回/下一条）由用户通过 `onBack`/`onNext` 回调注入。`deaths` 和 `choiceRate` 注意：shiji 传的是 `persp.deathCount` 和 `persp.bestChoiceRate`（**历史最佳成绩**，来自 userStore 持久化），不是当前 runner 的 `stats`。框架的 `ClearScreen` 应接受 `stats` 作为"本次运行"数据，同时允许用户覆盖为"历史最佳"。

**`ActClearCard`（幕间过场）**：

- shiji 实际签名：`(actName, actIndex, deaths, correctRate, onClose)`。
- **问题**：`deaths`/`correctRate` 同样来自 `persp`（历史最佳），不是当前 `stats`。
- **泛化方案**：与 `ClearScreen` 一致，接受 `stats` 但允许用户传入历史最佳数据覆盖。

**`DialogueBox`（对话展示）**：

- shiji 实际签名：`(segments, onComplete, onActiveSpeaker, onOpenHint, hideHint)`。
- **关键契约**：`onActiveSpeaker(speaker)` 在**每段打字开始时**同步当前说话人，驱动 `CharacterSprite` 的"说话中"高亮动画。这是 DialogueBox 与 CharacterSprite 的协作契约，泛化时不能丢。

**`ChoicePanel`（选项面板）**：

- shiji 实际签名：`(choices, onChoose, onOpenHint, onAskAi, hasHint, showHintButton)`。
- **关键契约**：`onChoose(index)` 传入的是 `choice.index`（原始 ink index，不是数组下标），这是选项洗牌后能正确映射回分支的关键。
- **AI 点拨入口**：`onAskAi` 按钮的触发逻辑（组装 `character/situation/choices/classicalHint`）在 VNEngine 里，泛化后应由 `HintProvider` 统一处理，但按钮的**展示/隐藏逻辑**（`showHintButton` 在正史模式抉择点为 `false`）需保留，避免剧透。

**`hintText` 的优先级与正史模式隐藏**：
shiji 的 `VNEngine` 中 `hintText = state.death?.classical ?? state.hint`，且 `showHintButton = !isCanon || !atChoicePoint`——**正史模式下抉择点隐藏原文提示按钮**，避免直接给出正确答案。这是精心设计的教育逻辑，泛化时需在组件文档中明确。

**关键设计：场景资源解析必须走 Context，不能直接 import。**

shiji 的 `CharacterSprite` 内部直接 `getSprite(id)`、`VNEngine` 直接 `getBackground(scene.background)`（硬引用 `sceneAssets`）。抽出后这些组件只能拿到字符串 id，**没有解析为图片 URL 的通道**。因此 `/ui` 必须提供 `SceneAssetsProvider`：

```typescript
// @chronicle-vn-game/ui
export interface SceneAssets {
  getBackground(id: string): { css?: string; image?: string; label?: string };
  getSprite(id: string): {
    name: string;
    full?: string;
    variants?: Record<string, string>;
    glyph?: string;
    accent?: string;
  };
}

export function SceneAssetsProvider({
  assets,
  children,
}: {
  assets: SceneAssets;
  children: ReactNode;
}) {
  /* ... */
}
export function useSceneAssets(): SceneAssets; // 供 CharacterSprite/Background 消费
```

同时把 `useStory` 的 `scene` 返回从"原始字符串 id"升级为"已解析资源"不可行（`useStory` 在 `/hooks`，不该依赖 `/ui` 的 Context）。**正确做法**：`useStory` 只维护 `scene: { background, characters }` 的原始 id 状态，由 `/ui` 的组件在执行阶段通过 `useSceneAssets()` 解析。这样 `/hooks` 保持纯逻辑、`/ui` 负责渲染，职责分离。

#### 3.5.1 AI 点拨的服务抽象

`AiHintModal` 依赖 shiji 的 `getHint`（aiClient 后端调用，喂入 `character/situation/choices/classicalHint`）。这是历史教育向的核心卖点，但后端服务属于领域/基础设施，不能写死在 `/ui`。抽象为一个可注入的提示提供器：

```typescript
// @chronicle-vn-game/ui
export interface HintProvider {
  requestHint(input: {
    character: string;
    situation: string;
    choices: string[];
    classicalHint: string;
  }): Promise<{ hint: string }>;
}
export function HintProviderContext({
  provider,
  children,
}: {
  provider: HintProvider;
  children: ReactNode;
}) {
  /* ... */
}
export function useHintProvider(): HintProvider;
```

`AiHintModal` 通过 `useHintProvider()` 调用，具体后端实现（接 LLM / 本地规则）由用户注入。**框架不内置任何 AI 后端**，只定契约。

### 3.6 /hooks — useStory

**核心编排 Hook**，是整个框架的"胶水层"：

```typescript
// @chronicle-vn-game/hooks

export interface SceneState {
  background: string;
  characters: Record<string, { expression: string; position: Position }>;
}

export function useStory(
  config: StoryConfig,
  callbacks: EngineCallbacks,
  options?: {
    fresh?: boolean; // 是否从开头开始
    strict?: boolean; // 正史模式
    onSave?: (state: string) => void;
    onLoad?: () => string | undefined | Promise<string | undefined>; // 支持异步（云存档场景）
    onDeath?: (death: StoryState["death"]) => void; // 每次死亡触发（供图鉴/入库/计数）
    onEnded?: (stats: StoryStats) => void; // 通关触发（供评级/结局收集）
  },
): {
  state: StoryState | null;
  scene: SceneState;
  loading: boolean;
  notFound: boolean;
  stats: StoryStats; // 当前统计：choiceRate / deathCount / completedNodes
  makeChoice: (index: number) => void;
  advance: () => void;
  retry: () => void;
  restart: () => void;
  completeMinigame: (result: PluginResult, score?: number) => void;
};

// 通用于死亡入库 / 结局收集 / 评级展示的统计快照
export interface StoryStats {
  choiceRate: number;
  deathCount: number;
  completedNodes: number;
}
```

**与 shiji 版的差异**：

| 项       | shiji 的 useStory                                   | 框架的 useStory                                                                                                    |
| -------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 存档     | 硬编码依赖 userStore                                | 通过 `onSave/onLoad` 回调注入                                                                                      |
| 成就     | 硬编码调用 userStore.unlockAchievement              | 通过 `onAchievement` 回调                                                                                          |
| 死亡入库 | 硬编码调用 userStore.recordDeath / unlockDeathEntry | 通过 `onDeath` 回调（注意：shiji 的 `unlockDeathEntry` 是 `storyId::reason` 拼接的图鉴键，属领域逻辑，由用户实现） |
| 通关评级 | 硬编码调用 userStore.completePerspective            | 通过 `onEnded` 回调 + `stats` 返回值                                                                               |
| 引擎创建 | 调用 createRunner（固定为 ShijiInkAdapter）         | 接收 `config: StoryConfig` 直接创建                                                                                |
| 正史模式 | 从路由参数推断                                      | 通过 `options.strict` 传入                                                                                         |

**统计必须暴露在返回值里**：shiji 的 `handleEnded` 需要 `getChoiceRate()` 和 `getCompletedNodes()` 读评级，`ClearScreen` 和 `ActClearCard` 也要实时展示 `deathCount` 与 `choiceRate`。若 `useStory` 不返回 `stats`，这些 UI 无法工作。`onDeath`/`onEnded` 回调与 `stats` 返回值各司其职：回调负责"副作用入库"，返回值负责"渲染展示"。

**死亡图鉴键的建议格式**：shiji 用 `${state.nodeId}::${state.death.reason}` 拼接图鉴键（含 `death:strict` 前缀区分合成死亡）。框架的 `onDeath` 回调应把 `nodeId` 和 `death` 一起传入，建议文档中给出推荐格式：`${nodeId}::${death.id ?? death.reason}`，并提醒 `death.id === "strict"` 时不入库。

**AI 点拨在正史模式抉择点的限制**：shiji 的 `ChoicePanel` 中 `showHintButton={!isCanon}` 控制了原文提示按钮，但 AI 点拨按钮没有对应限制——在正史模式抉择点直接问 AI 等于剧透正确答案。泛化时应统一处理：**正史模式抉择点同时隐藏原文提示和 AI 点拨入口**。

### 3.6.1 播放器级状态与音频（P0 补充）

shiji 的 `DialogueBox`/`ChoicePanel`/`VNEngine` 都依赖 `usePlayStore`（`textSpeed`、`autoPlay`、`isClassicalHintOpen`），音频依赖 `useUiStore`（`sfxEnabled`）。这些是**播放器级 UI 状态，不是领域数据**，必须随框架抽象，否则组件拆出来仍依赖 shiji 的 store。

```typescript
// @chronicle-vn-game/ui
export interface StorySettings {
  textSpeed: "slow" | "normal" | "fast";
  autoPlay: boolean;
  isClassicalHintOpen: boolean;
  setTextSpeed(s: StorySettings["textSpeed"]): void;
  toggleAutoPlay(): void;
  toggleClassicalHint(): void;
}
export function StorySettingsProvider({ children }: { children: ReactNode }) {
  /* 内部用轻量 store 持久化 */
}
export function useStorySettings(): StorySettings;

// 音频：接管 onBGM 回调，管理 audio 元素生命周期与开关
export interface AudioController {
  playBgm(track: string): void;
  stopBgm(): void;
  setSfxEnabled(on: boolean): void;
}
export function AudioProvider({ children }: { children: ReactNode }) {
  /* 内部创建/销毁 <audio>，useStory 的 onBGM 桥接到此 */
}
export function useAudio(): AudioController;
```

### 3.7 /types — 共享类型

```typescript
// @chronicle-vn-game/types

export type { Position, TagMeta } from "./narrative";
export type {
  VarValue,
  StorySegment,
  StoryChoice,
  StoryState,
} from "./adapter";
export type {
  PluginResult,
  PluginOutcome,
  PluginProps,
  PluginMode,
} from "./plugin";
export type { AchievementDef, AchievementType } from "./achievement";
```

---

## 4. 从 shiji 提取的步骤

### 阶段一：基础设施搭建

1. 创建 monorepo 结构（pnpm workspace）
2. 从 `packages/ink-vn-core/` 复制到 `packages/narrative/`，更新包名
3. 从 `src/react-app/engine/` 提取适配器到 `packages/adapter/`
4. 从 `src/react-app/minigames/` 提取插件系统到 `packages/plugin/`
5. 从 `src/react-app/data/achievements/` 提取成就框架到 `packages/achievement/`
6. 从 `src/react-app/pages/Play/` 提取 UI 组件到 `packages/ui/`
7. 从 `src/react-app/hooks/useStory.ts` 提取到 `packages/hooks/`

### 阶段二：泛化改造

对每个模块执行以下操作：

1. **移除所有对 shiji 领域数据的硬编码引用**
   - 场景资源（`getBackground`, `getSprite`）→ 改为通过 `SceneAssetsProvider` 注入
   - 用户存储（`userStore`）→ 改为通过 `onSave/onLoad/onDeath/onEnded` 回调注入
   - 播放器状态（`usePlayStore`）→ 改为 `StorySettingsProvider` 提供
   - 音频（`useUiStore` 的 `sfxEnabled`）→ 改为 `AudioProvider` 提供
   - AI 点拨（`aiClient.getHint`）→ 改为 `HintProvider` 注入
   - 故事线系统（`STORYLINES`, `inkStories`）→ 改为通过 `StoryConfig` 参数传入
   - `ClearScreen` 的导航逻辑（`useNavigate`, `getStoryline`, `getNextStoryline`）→ 改为 `onBack`/`onNext` 回调注入

2. **重命名以消除 shiji 语义**
   - `ShijiInkAdapter` → `VNAdapter`
   - `GameHost` → `PluginHost`
   - `DeathEntry` → `DeathEntry`（保留，语义通用）
   - `MinigameMode` → `PluginMode`

3. **样式抽离**
   - 从 `Play.css` 中提取通用 VN 样式到 `packages/ui/styles/`
   - 移除 shiji 特有的 CSS 变量引用（如 `--color-vermilion`）
   - 替换为框架级 CSS 变量，允许用户覆盖

4. **构建工具链（P0 补充）**
   - 从 shiji 的 `scripts/verify-ink.mjs` 提取 `.ink` 资源校验脚本（校验 `#bg:#show:#death:#achieve` 等标签引用的资源 id 是否存在于注册表）
   - 提供 `.ink → 预编译 JSON` 的编译脚本（`inkjs` 编译），供 `config.precompiled` 使用
   - 校验失败时给出**可读的错误定位**（文件 + 行号 + 缺失资源名），而非静默降级

### 阶段三：文档与示例

1. 完整 README，包含安装和快速开始
2. 一个完整的示例项目（如"三国演义 VN 小游戏"）
3. API 参考文档
4. 迁移指南（从 shiji 项目用法到框架 API）

### 阶段四：发布

1. 发布到 npm
2. 配置 CI（GitHub Actions + changesets）
3. 编写 CONTRIBUTING.md

---

## 5. 包结构

```
@chronicle-vn-game/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── narrative/        ← re-export from ink-vn-core
│   │   ├── index.ts
│   │   └── ...
│   ├── adapter/
│   │   ├── index.ts
│   │   ├── VNAdapter.ts
│   │   ├── types.ts
│   │   └── test/
│   ├── plugin/
│   │   ├── index.ts
│   │   ├── PluginHost.tsx
│   │   ├── registry.ts
│   │   ├── types.ts
│   │   ├── styles.css
│   │   └── test/
│   ├── achievement/
│   │   ├── index.ts
│   │   ├── AchievementRegistry.ts
│   │   ├── types.ts
│   │   └── test/
│   ├── ui/
│   │   ├── index.ts
│   │   ├── DialogueBox.tsx
│   │   ├── ChoicePanel.tsx
│   │   ├── CharacterSprite.tsx
│   │   ├── DeathScreen.tsx
│   │   ├── ClearScreen.tsx
│   │   ├── ActClearCard.tsx
│   │   ├── ClassicalHint.tsx
│   │   ├── AiHintModal.tsx
│   │   ├── SceneAssetsProvider.tsx
│   │   ├── StorySettingsProvider.tsx
│   │   ├── AudioProvider.tsx
│   │   ├── HintProvider.tsx
│   │   ├── styles.css
│   │   └── test/
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useStory.ts
│   │   └── test/
│   └── types/
│       └── index.ts
├── docs/
│   ├── quick-start.md
│   ├── api-reference.md
│   ├── vn-engine-template.md    ← 参考实现：完整 VN 播放页面
│   └── migration-from-shiji.md
└── examples/
    └── basic-vn/                ← 一个完整可运行的示例项目
```

---

## 6. 使用示例

### 最小示例：只使用叙事引擎

```typescript
import { InkRunner } from "@chronicle-vn-game/narrative";

const runner = new InkRunner({ source: myInkStory });
const output = runner.advance();
// output.segments → 对话文本
// output.choices → 选项列表
```

### 完整示例：游戏 + UI

```typescript
import { VNAdapter, type StoryConfig } from '@chronicle-vn-game/adapter'
import { useStory } from '@chronicle-vn-game/hooks'
import { DialogueBox, ChoicePanel, DeathScreen } from '@chronicle-vn-game/ui'
import { registerPlugin, PluginHost } from '@chronicle-vn-game/plugin'
import { AchievementRegistry } from '@chronicle-vn-game/achievement'

// 1. 配置你的故事
const config: StoryConfig = {
  key: 'guanyu',
  source: guanyuInkSource,
  deaths: {
    maicheng: { reason: '败走麦城，被吴军所擒', classical: '…', analysis: '…' },
  },
  endings: {
    canon: { title: '威震华夏', kind: 'canon', epigraph: '…' },
  },
}

// 2. 注册小游戏插件
registerPlugin({
  id: 'puzzle_zhuge',
  Component: PuzzleGame,
  meta: { title: '诸葛连弩', description: '…', difficulty: 2, modes: ['free', 'canon', 'strict'] },
})

// 3. 注册成就
const registry = new AchievementRegistry()
registry.registerAll([/* 你的成就定义 */])

// 4. 在组件中使用
function MyGame() {
  const { state, scene, stats, makeChoice, advance, retry, restart, completeMinigame } = useStory(
    config,
    {
      onAchievement: (id) => { /* 解锁成就 */ },
      onBackground: (bg) => { /* 切换背景 */ },
      onShowCharacter: (id, expr, pos) => { /* 显示立绘 */ },
      onDeath: (death) => { /* 死亡入库/图鉴 */ },
      onEnded: (s) => { /* 评级/结局收集 */ },
    },
    { strict: true, onSave: saveToDB, onLoad: loadFromDB },
  )

  if (!state) return <Loading />

  return (
    <SceneAssetsProvider assets={myAssets}>
      <AudioProvider>
        <StorySettingsProvider>
          <div className="vn-screen">
            <Background name={scene.background} />
            <CharacterSprites characters={scene.characters} />

            {state.segments.length > 0 && !state.death && !state.ended && (
              <DialogueBox segments={state.segments} onComplete={advance} />
            )}
            {state.choices.length > 0 && !state.death && (
              <ChoicePanel choices={state.choices} onChoose={makeChoice} />
            )}
            {state.death && <DeathScreen death={state.death} onRetry={retry} />}
            {state.ended && (
              <ClearScreen
                storyTitle="你的故事标题"
                stats={stats}
                isCanon={strict}
                ending={state.ending}
                onRestart={restart}
              />
            )}
            {state.actClear && (
              <ActClearCard
                actName={state.actClear.actName}
                actIndex={state.actClear.actIndex}
                deaths={stats.deathCount}
                correctRate={stats.choiceRate}
                onClose={advance}
              />
            )}
            {state.minigame && (
              <PluginHost
                pluginId={state.minigame.id}
                param={state.minigame.param}
                mode={strict ? "strict" : "free"}   // 与 useStory 的 strict 联动
                onComplete={(outcome) => completeMinigame(outcome.result, outcome.score)}
              />
            )}
          </div>
        </StorySettingsProvider>
      </AudioProvider>
    </SceneAssetsProvider>
  )
}
```

> 注意：示例中 `Background`/`CharacterSprites`/`Loading` 为框架 `/ui` 通过 `useSceneAssets()` 提供底层渲染的组件；`useStory` 只维护原始 id 状态，资源解析统一由 `SceneAssetsProvider` 完成。`strict` 变量来自 `useStory` 的 `options.strict`，`PluginHost` 的 `mode` 必须与之联动（shiji 中为 `isCanon ? "strict" : "free"`）。

---

## 7. ink-vn-core 的双重存在

`ink-vn-core` 继续作为独立包存在，原因：

| 场景                                                 | 推荐包                                      |
| ---------------------------------------------------- | ------------------------------------------- |
| 只想要叙事引擎，在 Node.js 或其他非 React 项目中使用 | `ink-vn-core`                               |
| 想要完整的 VN 框架（引擎 + UI + 插件 + 成就）        | `@chronicle-vn-game`                        |
| 已有 React 项目，只要叙事引擎和适配器，自己写 UI     | `@chronicle-vn-game/narrative` + `/adapter` |

`@chronicle-vn-game` 的 `package.json` 将 `ink-vn-core` 列为依赖，用户无需额外安装。

---

## 8. 与 shiji 本项目的协同

shiji 项目本身将**直接使用** `@chronicle-vn-game` 作为依赖：

```json
// timeslip-shiji/package.json
{
  "dependencies": {
    "@chronicle-vn-game": "0.1.0"
  }
}
```

这样 shiji 的代码量会显著减少，同时框架的每次改进都会自然回馈到 shiji 本身。

**shiji 保留的领域数据**（不进框架）：

- `data/characters.ts` — 角色数据
- `data/storylines/` — 故事线定义
- `data/stories/ink/` — .ink 叙事剧本
- `data/sceneAssets/` — 场景资源注册表
- `data/achievements/` — 具体成就定义（使用框架的 `AchievementRegistry`）
- `data/classics/` — 史记原文数据
- `store/userStore.ts` — 用户进度、游戏状态
- `minigames/klotski/`、`minigames/bamboo/` — 具体游戏实现（使用框架的 `registerPlugin`）

---

## 9. 发布计划

| 版本   | 内容                                                                    | 时间      |
| ------ | ----------------------------------------------------------------------- | --------- |
| v0.1.0 | 基础包结构 + /narrative（ink-vn-core re-export）                        | 第 1 周   |
| v0.2.0 | + /adapter（VNAdapter 泛化 + strict-probe 模块 + 存档版本迁移）         | 第 2 周   |
| v0.3.0 | + /plugin + /achievement                                                | 第 3 周   |
| v0.4.0 | + /ui 组件 + /hooks + Providers（SceneAssets/StorySettings/Audio/Hint） | 第 4 周   |
| v1.0.0 | 完整文档 + 示例项目 + shiji 自身迁移验证                                | 第 5-6 周 |

### 9.1 依赖与版本管理（P2 补充）

- **React peerDependency**：`/ui`、`/hooks` 依赖 React，`package.json` 须声明 `peerDependencies: { react: ">=18" }`，避免重复打包多个 React 实例。
- **版本一致性**：`ink-vn-core` 独立包 + framework 内 re-export 双重存在，升级可能不同步。建议 framework 的 `/narrative` 直接 `dependencies` 锁定 `ink-vn-core` 的 `^x.y.z`，并在发布时用 changesets 联动 bump，避免 re-export 的 API 与独立包漂移。
- **shiji 自身迁移验证**：v1.0.0 的验收标准是 shiji 项目能完整替换为 `@chronicle-vn-game` 依赖且行为不变，作为框架泛化正确性的最终回归测试。
