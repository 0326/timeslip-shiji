# 历史 VN 游戏框架改造计划

> **目标**：将 `packages/` 内的包从单一的 `ink-vn-core` 扩展为一套完整的 **历史 VN 游戏框架**。框架输入结构化的史书素材（人物、事件、典籍、系列），即可输出一个可玩的 VN 游戏（含叙事引擎、游戏系统、素材管线、UI 组件、构建工具链）。

---

## 一、现状分析（Repo Research Conclusion）

### 1.1 现有 packages 结构

当前 `packages/` 仅有一个包：

| 包名 | 职责 | 局限 |
|---|---|---|
| `ink-vn-core` | 领域无关的 ink 叙事引擎（Runner / TagParser / Types） | 仅叙事层，无游戏规则、无素材管线、无 UI 组件、无内容 Schema |

### 1.2 现有 src/react-app 的可抽取部分

主项目 `src/react-app/` 中已有大量可框架化的实现，但与"史记·穿越"业务耦合：

- **数据层**：`data/characters.ts`、`data/series.ts`、`data/classics/`、`data/sceneAssets/`、`data/stories/ink/`
- **系统层**：抽卡（gachaPools）、成就（achievements/）、关系图（relationColors）、BGM、图鉴
- **UI 层**：`components/`（Modal、Drawer、Badge、Button、PanelHeader、ProgressBar）、`pages/Play/VNEngine.tsx`
- **服务层**：`services/mainProjectApi.ts`（主项目 API 适配、assetUrl 工具）

### 1.3 NovelToGame 参考设计

参考 `worldwonderer/novel-to-game` 的分阶段工作流：

```
史书素材 → 素材解析（Source）→ 世界/角色设计（Concept/World）→ 美术方向（Art）→ 内容构建（Build）⇄ QA → 可玩游戏
```

本框架对应提供：**素材解析管线 → 内容 Schema 校验 → Ink 生成器 → 游戏运行时（Core+Systems+UI）→ 构建与 QA 工具链**。

---

## 二、Packages 架构设计（7 个包）

```
packages/
├── ink-vn-core/           # 1. 叙事引擎核心（现有，扩展）
├── vn-game-systems/       # 2. 游戏规则系统（状态/存档/成就/死亡/图鉴/小游戏）
├── vn-content-schemas/    # 3. 内容数据模型与 ZOD 校验（人物/系列/典籍/场景/故事）
├── vn-asset-pipeline/     # 4. 素材管线（史书解析→Schema→Ink脚本自动生成）
├── vn-ui-components/      # 5. 可复用 UI 组件库（VN 引擎界面 + 通用游戏 UI）
├── vn-runtime-react/      # 6. React 运行时装配（VNEngine、PlayPage、Store、路由）
└── vn-build-tools/        # 7. 构建与 QA 工具（ink 编译、校验、压缩、静态检查）
```

---

## 三、各包详细设计

### 3.1 `ink-vn-core` — 叙事引擎核心（扩展）

**职责**：保持领域无关，扩展现有能力边界。

**改动文件**：
- `packages/ink-vn-core/src/types.ts`
- `packages/ink-vn-core/src/inkRunner.ts`
- `packages/ink-vn-core/src/tagParser.ts`
- `packages/ink-vn-core/src/index.ts`

**扩展点**：

| 扩展项 | 说明 |
|---|---|
| 多角色同屏 | `StageEffects.show` 支持数组（一次 show 多个角色），新增 `onShowCharacters(Array)` 回调 |
| 场景特效标签 | 新增 `#shake`（震屏）、`#flash`（闪白）、`#fade:ms`（淡入淡出时长）、`#camera:zoom/pan` 舞台回调 |
| 音效/SE | 新增 `#se:ID` 音效标签，`StageCallbacks.onSE(id)` 回调 |
| 小屏/旁白模式 | `#narration` 标签语义化，`Segment.kind = 'dialogue' | 'narration' | 'thought'` 区分文本类型 |
| Minigame 结果接入 | 标准化 `#minigame:id:params` 解析，新增 `RunnerOutput.minigame?: { id, params }` 中断态 |
| 段落 Checkpoint | 暴露 `getCheckpoint()` / `restoreToCheckpoint()`，支持抉择前回退（正史模式无提示） |
| 变量订阅 | `onVarChange(name, (old, new) => void)` 回调，供 UI 层响应数值变化 |
| Knot 跳转 API | `gotoKnot(knotName, stitch?)` 外部跳转（给游戏系统调用，如死亡后回到指定节点） |
| 测试补充 | `test/` 扩展：minigame 中断、多角色 show、knot 跳转、变量订阅 |

---

### 3.2 `vn-game-systems` — 游戏规则系统（新建）

**职责**：将主项目 `src/react-app/data/` 中的游戏规则抽象为框架层可复用系统。纯逻辑，与 UI 解耦（不依赖 React）。

**新建文件**：
```
packages/vn-game-systems/
├── src/
│   ├── index.ts                    # 统一导出
│   ├── types.ts                    # 系统类型定义
│   ├── saveSystem.ts               # 存档 / 读档 / 自动存档 / 插槽管理
│   ├── achievementSystem.ts        # 成就注册 + 触发判定 + 持久化
│   ├── deathCodexSystem.ts         # 死亡图鉴（strict 模式不入库，未解锁显示 🔒）
│   ├── gachaSystem.ts              # 抽卡池 + 抽卡逻辑 + 保底
│   ├── minigameSystem.ts           # 小游戏注册 + 跳过 + 结果回写 mg_result/mg_score
│   ├── storyUnlockSystem.ts        # 故事模式解锁（通关正史解锁自由模式）
│   ├── characterCodexSystem.ts     # 人物图鉴（灰度解锁 + 点击可看详情）
│   ├── relationSystem.ts           # 人物关系图（读取 relationColors 数据）
│   └── progressTracker.ts          # 阅读进度 / 选项统计 / 历史回溯
├── test/
│   ├── saveSystem.test.ts
│   ├── achievementSystem.test.ts
│   └── deathCodexSystem.test.ts
├── package.json                    # peerDependencies: ink-vn-core
├── tsconfig.json
└── vitest.config.ts
```

**核心设计要点**：
- 所有系统通过 **事件总线（EventBus）** 解耦，不直接依赖 ink Runner
- `SaveSystem` 同时序列化 `inkRunner.snapshot()` + 系统状态（成就/图鉴/抽卡）
- `DeathCodexSystem` 严格遵守 project_memory 规则：strict 死亡不入库
- `MinigameSystem` 注册中心与 `verify-ink.mjs` 对齐（校验 ink 引用的 minigame id 是否已注册）
- 存储层可插拔：默认 `localStorageAdapter`，可换 `IndexedDBAdapter` / `CloudBaseAdapter`

---

### 3.3 `vn-content-schemas` — 内容数据模型（新建）

**职责**：定义"输入史书素材"的标准 Schema，所有内容包必须通过 ZOD 校验才能进入运行时。这是"输入史书→生成游戏"的契约层。

**新建文件**：
```
packages/vn-content-schemas/
├── src/
│   ├── index.ts
│   ├── character.ts        # 人物 Schema（含 variants 表情、立绘路径、bio、典籍引用）
│   ├── series.ts           # 系列 Schema（五帝/殷商/西周/... 含视觉主题 accent/bgFrom/bgTo）
│   ├── storyline.ts        # 故事线 Schema（ink 文件路径、主角、视角、解锁条件）
│   ├── scene.ts            # 场景 Schema（背景图 id → 路径映射）
│   ├── classic.ts          # 典籍 Schema（章节 id、标题、原文、白话翻译、引用位置）
│   ├── achievement.ts      # 成就 Schema（id/名称/描述/触发条件/图标）
│   ├── minigame.ts         # 小游戏注册 Schema（id/名称/参数/返回值类型）
│   ├── bgm.ts              # BGM Schema（id/名称/路径/循环点）
│   └── gameContent.ts      # 组合类型 GameContent = 全量内容包
├── test/
│   └── schemas.test.ts     # 用主项目现有数据做 fixture 测试
├── package.json            # dependencies: zod
└── tsconfig.json
```

**输入素材包标准结构**（框架消费的 `content/` 目录）：
```
content/
├── content.json            # 入口清单（Zod<GameContent> 校验通过才能加载）
├── characters/
│   ├── shun.json
│   ├── yao.json
│   └── ...
├── series/
│   ├── wudi.json
│   └── ...
├── storylines/
│   ├── huangdi-banquan.json
│   └── ...
├── scenes/
│   └── backgrounds.json
├── classics/
│   └── chapters/001.json ...
├── achievements/
│   └── base.json
├── bgm/
│   └── catalog.json
├── ink/                    # .ink 源文件（dev 编译 / prod 用预编译 JSON）
│   ├── huangdi-banquan.ink
│   └── ...
└── assets/                 # 二进制资源（可选，不在 content.json 中）
    ├── figures/<id>/portrait/full-*.png
    └── backgrounds/<series>/*.jpg
```

---

### 3.4 `vn-asset-pipeline` — 素材管线（新建）

**职责**：实现"史书输入 → 结构化内容包 → Ink 脚本骨架"的自动化管线。对应 NovelToGame 的 Source/Concept 阶段。

**新建文件**：
```
packages/vn-asset-pipeline/
├── src/
│   ├── index.ts
│   ├── cli.ts                    # CLI 入口：vn-pipeline parse/generate/validate
│   ├── parsers/
│   │   ├── ctextParser.ts        # 解析 ctext.org/史记 JSON → Character[] / Classic[]
│   │   ├── markdownParser.ts     # 解析人物 MD 档案
│   │   └── jsonContentParser.ts  # 解析 content.json → GameContent（带校验）
│   ├── generators/
│   │   ├── inkSkeleton.ts        # 根据 Storyline 生成 .ink 骨架（knots/stitch/choice 占位）
│   │   ├── characterStub.ts      # 生成 Character JSON stub（待人工填充 / AI 辅助）
│   │   ├── sceneStub.ts          # 生成场景背景清单 stub
│   │   └── achievementStub.ts    # 生成成就 stub
│   ├── validators/
│   │   ├── contentValidator.ts   # ZOD 校验 + 跨引用一致性检查
│   │   ├── inkValidator.ts       # 对齐 verify-ink.mjs：检查 minigame id / knot 存在性
│   │   └── assetValidator.ts     # 检查图片/音频资源存在性 + 大小合规
│   └── optimizers/
│       ├── imageOptimizer.ts     # pngquant / jpegoptim 批量压缩（对齐 scripts/*.py）
│       └── inkOptimizer.ts       # ink → 预编译 JSON + gzip
├── test/
│   ├── parsers/
│   ├── generators/
│   └── validators/
├── package.json                  # bin: { "vn-pipeline": "./dist/cli.js" }
└── tsconfig.json
```

**CLI 命令**：
```bash
# 1. 从史书 raw data 生成结构化素材 stub
vn-pipeline parse --source ./raw/shiji.json --out ./content/

# 2. 根据 Storyline 生成 Ink 脚本骨架（含 #speaker / #bg / #show 标签模板）
vn-pipeline generate:ink --storyline huangdi-banquan --out ./content/ink/

# 3. 校验内容包完整性（schema + 跨引用 + 资源存在）
vn-pipeline validate ./content/

# 4. 优化素材（图片压缩 + ink 预编译）
vn-pipeline optimize ./content/ --out ./dist-content/
```

**历史 VN 专用生成规则**：
- Ink 骨架自动插入 `#speaker` / `#bg` / `#show` / `#actclear` / `#death` / `#achieve` 标签占位
- 自动生成正史模式的 `#correct` 标记分支（带典籍引用）和死亡分支（`#death:id`）
- 每个抉择节点生成对应的典籍原文段（`#classic:chapter:verse` 标签关联）

---

### 3.5 `vn-ui-components` — 可复用 UI 组件库（新建）

**职责**：从主项目 `src/react-app/components/` 中抽取出 **框架通用组件**，不绑定史记视觉主题（主题通过 CSS Variables + className 变体注入）。

**新建文件**：
```
packages/vn-ui-components/
├── src/
│   ├── index.ts
│   ├── theme/
│   │   ├── ThemeProvider.tsx     # CSS Variables 注入（accent/bg/font/圆角/间距）
│   │   ├── presets/
│   │   │   ├── inkWash.ts        # 水墨风预设（当前项目风格）
│   │   │   └── default.ts       # 默认风格
│   │   └── types.ts
│   ├── vn/                       # VN 引擎专用组件
│   │   ├── DialogueBox.tsx       # 对话框（speaker + text + typewriter）
│   │   ├── ChoicePanel.tsx       # 选项面板（可隐藏提示按钮）
│   │   ├── CharacterSprite.tsx   # 角色立绘（支持多表情 variants，无图回退渐变）
│   │   ├── BackgroundLayer.tsx   # 背景层（支持切换过渡 + 无图回退渐变）
│   │   ├── StageEffects.tsx      # 震屏/闪白/淡入淡出
│   │   ├── ActClearCard.tsx      # 幕间过场卡（#actclear:幕名 触发）
│   │   ├── DeathScreen.tsx       # 死亡结局页
│   │   └── MinigameOverlay.tsx   # 小游戏悬浮层（带跳过按钮）
│   ├── game/                     # 通用游戏 UI
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Drawer.tsx
│   │   ├── Badge.tsx
│   │   ├── PanelHeader.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Card.tsx              # 通用卡片
│   │   ├── CharacterCard.tsx     # 人物卡（未解锁灰度 + 可点击）
│   │   ├── SeriesCard.tsx        # 系列卡（带主题色）
│   │   ├── StorylineCard.tsx     # 故事线卡（正史/自由模式标识）
│   │   ├── LockedBadge.tsx       # 未解锁标记（金边框 0.7 透明度）
│   │   └── KVNavMenu.tsx         # 顶部导航（对齐 Layout.css Navbar 规范）
│   ├── pages/                    # 页面级组件（组合以上原子组件）
│   │   ├── StorySelectPage.tsx   # 故事选择（系列卡网格 + 弹窗章节）
│   │   ├── CharacterListPage.tsx # 人物图鉴（朝代排序 + 筛选 + 搜索）
│   │   ├── CharacterDetailPage.tsx # 人物详情（单屏 flex：左立绘 + 右滚动面板）
│   │   ├── DeathCodexPage.tsx    # 死亡图鉴
│   │   ├── AchievementPage.tsx   # 成就页
│   │   └── ClassicArchivePage.tsx# 典籍阅读页
│   └── hooks/
│       ├── useTypewriter.ts
│       └── useKeyNavigation.ts
├── package.json                  # peerDependencies: react, react-dom, ink-vn-core, vn-game-systems
├── tsconfig.json
└── README.md
```

**视觉规范对齐**（严格遵守 project_memory）：
- 人物卡未解锁：**中度灰度**（不超灰）+ 可点击看详情
- 人物列表：**朝代顺序**排序
- 搜索框：**筛选左 + 按钮右**布局
- 故事选择：**卡布局 + 弹窗选章节**两级
- 模式按钮：**斜角 + 顶光条 + 渐变 + hover**游戏风
- 未解锁按钮：**金边框/金文字/锁图标 + 0.7 透明度**（不是禁用）
- 顶部导航：统一高度 `62px` + serif 字体 + 一致 padding/radius/hover
- 返回按钮：回到 **正史模式页**（不是首页）

---

### 3.6 `vn-runtime-react` — React 运行时装配（新建）

**职责**：把 `ink-vn-core` + `vn-game-systems` + `vn-ui-components` + `vn-content-schemas` 组装成一个完整可运行的 React 应用层。**不包含具体业务数据**，只提供装配框架。

**新建文件**：
```
packages/vn-runtime-react/
├── src/
│   ├── index.ts
│   ├── VNProvider.tsx            # 顶层 Provider（注入 Content + Systems + Theme）
│   ├── VNEngine.tsx              # 装配版引擎：Runner + Systems + UI
│   ├── PlayPage.tsx              # 游玩页（VNEngine + 顶栏 + 返回按钮）
│   ├── routes/
│   │   ├── createRouter.tsx      # 基于 react-router 的路由工厂（可被主项目 mount）
│   │   └── routes.ts             # 标准路由表
│   ├── store/
│   │   ├── createVNStore.ts      # Zustand store 工厂（含 runtime state + 系统状态）
│   │   └── selectors.ts
│   ├── adapters/
│   │   ├── inkToSystemsBridge.ts # InkRunner 事件 → 各游戏系统的桥接
│   │   ├── mainProjectApi.ts     # 主项目 API 适配层（assetUrl / normalizeFigureAssets）
│   │   └── cloudStorageAdapter.ts# CloudBase 存储适配（可选）
│   └── bootstrap/
│       ├── loadContent.ts        # 加载 content.json → 校验 → 注入 Provider
│       └── initSystems.ts        # 初始化各系统 + 读取存档
├── package.json
└── tsconfig.json
```

**使用方（业务项目）最小启动代码**：
```tsx
import { VNProvider, createRouter } from "vn-runtime-react";
import { inkWash } from "vn-ui-components/theme/presets/inkWash";
import gameContent from "../content/content.json"; // 通过 vn-pipeline validate 的内容包

const router = createRouter({
  content: gameContent,
  theme: inkWash,
  basePath: "/",
  onReturnToStory: () => navigate("/story"), // 对齐"返回正史模式页"规则
});

function App() {
  return <VNProvider content={gameContent} theme={inkWash}>{router}</VNProvider>;
}
```

---

### 3.7 `vn-build-tools` — 构建与 QA 工具（新建）

**职责**：对齐现有 `scripts/` 目录下的工具（`verify-ink.mjs`、`verify-canon.mjs`、`static-preview.mjs`），将其框架化为可复用的构建工具链。

**新建文件**：
```
packages/vn-build-tools/
├── src/
│   ├── index.ts
│   ├── cli.ts                    # CLI 入口：vn-build compile/check/audit/preview
│   ├── commands/
│   │   ├── compileInk.ts         # .ink → 预编译 JSON（对齐 inkjs Compiler）
│   │   ├── checkContent.ts       # 调用 vn-content-schemas 校验 + 跨引用检查
│   │   ├── checkInk.ts           # 对齐 verify-ink.mjs：minigame 注册 / knot 存在
│   │   ├── checkCanon.ts         # 对齐 verify-canon.mjs：典籍引用与原文对齐
│   │   ├── auditNodeCount.ts     # 对齐 audit-nodecount.mjs：ink 节点数统计
│   │   └── staticPreview.ts      # 对齐 static-preview.mjs：静态预览生成
│   └── vite/
│       ├── vitePluginVN.ts       # Vite 插件：?raw ink 导入 + 编译时校验 + HMR
│       └── contentPlugin.ts      # 自动加载 content.json + 校验失败中止 build
├── package.json                  # bin: { "vn-build": "./dist/cli.js" }
└── tsconfig.json
```

---

## 四、实施步骤（Phase 1 → Phase 7）

### Phase 1：扩展 `ink-vn-core`（基础层优先）
1. 扩展 `types.ts`：新增 `SegmentKind`、`MinigameInterrupt`、变量类型
2. 扩展 `tagParser.ts`：新增 `#shake`/`#flash`/`#se`/`#narration`/`#minigame` 解析
3. 扩展 `InkRunner.ts`：多角色回调、minigame 中断态、变量订阅、gotoKnot、段 checkpoints
4. 补全测试：`test/` 覆盖率 ≥ 85%
5. 验证：`pnpm --filter ink-vn-core test` 通过

### Phase 2：新建 `vn-content-schemas`（契约先行）
1. 用 Zod 定义 8 个核心 Schema（Character / Series / Storyline / Scene / Classic / Achievement / Minigame / BGM）
2. 定义组合类型 `GameContent`
3. 用主项目现有 `characters.ts` / `series.ts` / `classics/` 数据做 fixture，通过 schema 测试
4. 输出 `GameContent` TS 类型，供其他包 import

### Phase 3：新建 `vn-game-systems`（游戏逻辑层）
1. 定义 `types.ts`：系统通用接口 + EventBus
2. 逐个实现 8 个子系统（Save/Achievement/DeathCodex/Gacha/Minigame/StoryUnlock/CharacterCodex/Relation）
3. 严格遵守 project_memory 中的 hard constraints：
   - `DeathCodexSystem`: strict 死亡不入库
   - `MinigameSystem`: 必须支持跳过
   - `StoryUnlockSystem`: 通关正史才解锁自由
4. 写单元测试

### Phase 4：新建 `vn-ui-components`（可复用 UI）
1. 从主项目 `src/react-app/components/` 抽取通用组件（Button/Modal/Drawer/Badge/ProgressBar/PanelHeader）
2. 实现 `ThemeProvider` + `inkWash` 预设（CSS Variables 体系）
3. 实现 VN 层组件（DialogueBox/ChoicePanel/CharacterSprite/BackgroundLayer/StageEffects/ActClearCard）
4. 实现游戏页组件（CharacterCard/SeriesCard/StorylineCard/LockedBadge/KVNavMenu）
5. 实现页面级组件（StorySelect/CharacterList+Detail/DeathCodex/Achievement/Classic）
6. 每条 UI 规则对应 project_memory，写 Storybook 或视觉测试

### Phase 5：新建 `vn-runtime-react`（装配层）
1. 实现 `VNProvider` + `createVNStore`（Zustand）
2. 实现 `inkToSystemsBridge`：Runner 回调 → 各系统事件
3. 实现 `VNEngine.tsx`（替换主项目 `pages/Play/VNEngine.tsx` 的框架版本）
4. 实现 `createRouter` + 路由表
5. 写集成测试：加载 fixture content → 启动 → 走通一个故事线

### Phase 6：新建 `vn-asset-pipeline` + `vn-build-tools`（工具链）
1. 实现 CLI 框架
2. 先移植 `vn-build-tools` 现有 scripts（verify-ink/verify-canon/audit-nodecount/static-preview）
3. 再实现 `vn-asset-pipeline` 的 parse/generate/validate/optimize
4. 集成测试：raw 数据 → parse → generate ink → validate → compile → optimize 全链路

### Phase 7：联调 + 迁移主项目（闭环）
1. 主项目 `src/react-app/` 中替换为 packages 导入（从 `../packages/*` import）
2. 主项目数据迁移到 `content/` 目录，通过 `vn-pipeline validate`
3. 主项目 `App.tsx` 改为 `VNProvider` 装配模式
4. `npm run dev` / `npm run build` 全链路回归
5. 验证所有 project_memory 中的 UI/UX 规则

---

## 五、依赖与兼容性考虑

| 依赖 | 版本 | 用途 | 风险 |
|---|---|---|---|
| `inkjs` | `~2.4.0` | 叙事引擎（已在 peerDeps） | 保持锁定，不升 3.x（API 不兼容） |
| `zod` | `^3.23` | Schema 校验 | 新增，仅 content-schemas 依赖 |
| `zustand` | `^5.0` | 状态管理（已在主项目） | runtime-react 作为 peerDep |
| `react-router-dom` | `^7.18` | 路由（已在主项目） | runtime-react 作为 peerDep |
| `framer-motion` | `^12.42` | 动画（已在主项目） | ui-components 作为 peerDep |
| `lucide-react` | `^1.21` | 图标（已在主项目） | ui-components 作为 peerDep |
| `vitest` | `^3.0` | 测试 | 所有包 devDep |
| `commander` | `^12` | CLI 参数解析 | pipeline + build-tools |
| `pngquant`/`jpegoptim` | 通过 node wrapper 或外部 bin | 图片优化 | pipeline optimizer，缺失时降级警告 |

### 包依赖图（严格 DAG，无循环）
```
vn-content-schemas ──┐
ink-vn-core         ─┤
                     ├──> vn-game-systems ──┐
                     │                      ├──> vn-ui-components ──> vn-runtime-react
                     └──────────────────────┤
                                            ├──> vn-build-tools
vn-content-schemas ────────────────────────> vn-asset-pipeline
```

---

## 六、风险处理

| 风险 | 影响 | 应对 |
|---|---|---|
| 主项目迁移期回归 Bug | 高 | Phase 7 逐模块替换，每步跑测试；保留旧代码分支可回滚 |
| 包数量多，发布复杂度上升 | 中 | 统一 tsconfig base + monorepo workspace scripts；prepublishOnly 跑全量 test+lint |
| 7 个 packages 同时开发依赖链长 | 中 | 严格按 Phase 顺序；Phase 1-3 独立，完成后才进 Phase 4；每阶段完成写 fixture |
| 历史素材 pipeline 生成质量不够 | 中 | skeleton 生成 + 人工/AI 精修两步走；绝不自动覆盖人工写的 ink |
| UI 组件抽取与原视觉不一致 | 中 | 每个组件写 snapshot test；主题变量全覆盖；对照主项目 Figma/设计稿走查 |
| CloudBase / 主项目 API 解耦不干净 | 低 | runtime-react 的 `adapters/` 层做接口抽象，可替换；不把主项目 API 硬编码进底层包 |

---

## 七、交付验证清单（完成标准）

- [ ] `packages/` 下存在 7 个包，每个有独立 `package.json` + `tsconfig.json` + test
- [ ] `pnpm -r test` 全部通过
- [ ] `pnpm -r build`（或 ts project reference）全部通过类型检查
- [ ] `vn-pipeline validate ./content/` 对主项目数据通过
- [ ] `vn-build compile+check` 对主项目所有 ink 通过
- [ ] 主项目 `npm run dev` 正常启动，所有页面可访问
- [ ] 正史模式：无提示按钮、死亡不入库、通关后解锁自由模式（全部符合 project_memory）
- [ ] 人物图鉴：朝代排序、未解锁中度灰度、可点击详情、单屏布局
- [ ] 故事选择：卡布局 + 弹窗选章节
- [ ] 返回按钮：所有子页返回到正史模式页（不是首页）
- [ ] 小游戏：所有已注册的可跳过，结果正确回写 `mg_result`
