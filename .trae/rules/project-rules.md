# 穿越·史记 — 项目开发规则

> 本文件是 timeslip-shiji 项目的开发铁律，所有 AI agent 与人工开发均须遵守。

---

## 一、总纲

1. **全站中文**：所有产出（代码注释、文档、UI 文案、commit message）用中文
2. **动手前先读 skill**：改相关模块前先加载 `.trae/skills/` 下对应 skill（ink-story-writing / kv-image-gen / vn-story-image）
3. **提交前跑 `npm run check`**：tsc + vite build + wrangler deploy --dry-run
4. **敏感值只进 `.dev.vars`**：JWT_SECRET、ANTHROPIC_API_KEY 等不进 git
5. **零账号本地开发优先**：未配置 JWT_SECRET / USER_DB 时，账号系统优雅降级为纯本地存档，不阻塞游戏体验

---

## 二、架构铁律

### 2.1 单 Worker 同源部署

- `wrangler.json` 中使用 `assets` 字段托管前端静态资源（`directory: "./dist/client"`，`not_found_handling: "single-page-application"`）
- `/api/*` 走 Hono Worker 路由，其余路径由 wrangler assets SPA fallback 接管返回 `index.html`
- CORS 白名单规则：生产通过 `ALLOWED_ORIGIN` 环境变量（逗号分隔）限制；未配置时允许 localhost / 127.0.0.1（本地开发）
- **不要**把前端路由加进 Worker 的 `app.get()`，否则 SPA 刷新会 404

### 2.2 D1 数据库（USER_DB）

- 绑定名：`USER_DB`，库名：`timeslip-shiji-users`，remote: true（连线上 D1，本地也直连线上）
- **铁律：存档表名必须是 `saves`**，不要与 timslip-work 的 `work_saves` 混淆
- 每次请求内直接使用 `c.env.USER_DB!.prepare(...)`，不要缓存到模块作用域
- 迁移文件放在 `src/worker/migrations/`，命名格式 `NNNN_name.sql`（数字前缀 4 位补零）
- 新增迁移后执行 `npx wrangler d1 migrations apply timeslip-shiji-users --remote`

### 2.3 类型同步

- **改存档结构 `UserProgress`**：`src/react-app/types/progress.ts` 与 `src/worker/routes/user.ts` 的 JSON.parse/stringify 两侧必须同步
- **改 API 返回结构**：Worker 路由返回的 JSON 结构与前端 `services/authClient.ts` / `services/aiClient.ts` 的调用方类型必须同步
- 改 `wrangler.json` 的 D1 / KV / vars / secrets 绑定后，**必须** `npm run cf-typegen` 刷新 `worker-configuration.d.ts`

### 2.4 包结构

- `packages/ink-vn-core/`：纯叙事引擎核心，**不得引入任何游戏领域语义**（不出现「achieve」「death」「correct」「hint」等字样）
- 领域标签通过 `TagMeta`（`Record<string, string | true>`）透传，上层应用自行解释
- 前端通过 `vite.config.ts` 的 alias 引用：`"ink-vn-core": path.resolve(__dirname, "packages/ink-vn-core/src/index.ts")`

---

## 三、后端约定（`src/worker/`）

### 3.1 路由

- 路由入口在 `index.ts`，业务路由按模块拆到 `routes/`（auth / user / hint），使用 `app.route("/api/auth", auth)` 挂载
- 所有路径前缀 `/api/`；非 `/api` 路径由 assets 接管
- API 顺序：健康检查 `/api/health` → 公开路由（auth）→ 需认证路由（user）

### 3.2 认证中间件（铁律）

- **Token 读取顺序：Cookie 优先，Authorization 兜底**（见 `middleware/auth.ts` 的 `getToken()`）
- 先 `extractTokenFromCookie(Cookie header)`，拿到就用；没拿到再走 `extractToken(Authorization: Bearer xxx)`
- 需认证路由用 `requireAuth`，注入 `c.var.user: JwtPayload`（含 sub / username / iat / exp）
- 游客可访问路由用 `optionalAuth`，没 token 不报错
- **所有项目（shiji 和 work）都必须遵守 Cookie 优先原则**，不能反过来

### 3.3 错误处理

- 认证缺失：`{ error: "unauthorized", message: "请先登录" }`，HTTP 401
- Token 无效：`{ error: "invalid_token", message: "登录已过期，请重新登录" }`，HTTP 401
- 参数错误：`{ error: "invalid_xxx", message: "..." }`，HTTP 400
- 存档冲突：`{ error: "conflict", message: "云端存档已更新，请先同步", serverSave, serverVersion, ... }`，HTTP 409
- 绑定未配置：`{ error: "auth_not_configured" }`，HTTP 503（业务优雅降级，不阻塞游戏）

### 3.4 密码与 JWT

- 密码哈希：PBKDF2-SHA256，100000 次迭代，salt 16 字节，输出格式 `${saltHex}$${derivedHex}`
- JWT：自实现 HS256（不用第三方库，避免 workerd 兼容问题），默认有效期 30 天
- Cookie 名：`auth_token`，生产环境加 `Secure; Domain=.timeslip.work; SameSite=Lax; HttpOnly`，本地开发省略 Secure
- 登出：`Max-Age=0` 覆盖同名 Cookie

### 3.5 存档上传 API（`PUT /api/user/save`）

- 乐观锁：传 `expectedVersion` 时与服务端 `version` 比对，不一致返回 409 conflict
- 版本号：服务端自增（UPDATE 时 `version = existing.version + 1`；INSERT 时 `version = 1`）
- `client_updated_at`：客户端更新时间戳（ms），用于 last-write-wins 和冲突判断
- `slot`：默认 `"default"`，预留多存档槽位扩展

---

## 四、前端约定（`src/react-app/`）

### 4.1 路由

- 使用 `react-router-dom` v7，`createBrowserRouter`
- **重页面代码分割（懒加载）**：Play / Panorama / ClassicReader / ArchiveDetail 用 `lazy(() => import(...))` + `<Suspense fallback={<LoadingScreen />}>`
- 路由表（`App.tsx`）：
  - `/`：首页（HomePage）
  - `/story`、`/story/:seriesId`：剧情选择
  - `/gacha`：重定向到 `/`（功能下线，入口隐藏）
  - `/archive`、`/archive/:id`：藏馆
  - `/achieve`：成就
  - `/codex/deaths`：死亡图鉴
  - `/classics`、`/classics/:juan`：典籍阅读
  - `/panorama/:storyId`：全景画卷（含 D3 关系图 + 时间线 + 史料库）
  - `/play/:storyId/:charId`：**全屏游戏主界面，无 Layout 导航**（顶级路由，不在 Layout 子路由里）

### 4.2 状态管理（Zustand）

- 4 个 store，职责单一：
  - `authStore`：登录态 / 注册 / 登出 / 云存档同步（pull/push/resolveConflict）
  - `userStore`：游戏进度（`progress: UserProgress`）+ localStorage 持久化
  - `playStore`：当前 VN 运行时状态（只在 /play 页面使用，离开清空）
  - `uiStore`：全局 UI 状态（弹窗、toast、音效开关等）
- **自动同步节流**：`useUserStore.subscribe()` 监听变化，防抖 30 秒后调 `authStore.autoSync()` 推云端
- 初始进度：`store/initial.ts` 的 `createInitialProgress()`，赠送 1 张抽卡券

### 4.3 UserProgress 字段规范（铁律）

新增进度字段时，必须同时更新以下 5 处：
1. `src/react-app/types/progress.ts` — 类型定义
2. `src/react-app/store/initial.ts` — `createInitialProgress()` 初始值
3. `src/react-app/store/authStore.ts` — `mergeSaves()` 合并策略（取 max / 并集 / 更晚版本等）
4. `src/react-app/store/userStore.ts` — localStorage 持久化读写（如有 migrate 逻辑）
5. `src/worker/routes/user.ts` — `JSON.parse(row.data)` 处注释更新即可

### 4.4 存档合并策略

云端与本地冲突时，`mergeSaves()` 规则：
- 标量字段（points / gachaTickets / fragments / lifetimeDeaths 等）：`Math.max(a, b)`
- 集合字段（ownedCharacters / unlocked / readSources）：`[...new Set([...a, ...b])]`
- `gacha.pityCount`：以本地为准（避免保底被云端重置）
- `gacha.pullHistory`：按 timestamp 倒序合并取前 100 条
- `storylines[storyId][charId]`：isStarted / isCompleted 取 OR；completedNodes / deathCount / bestChoiceRate 取 max；saveState 取 completedNodes 更高的版本
- `achievements.unlockedAt`：本地覆盖云端（后解锁的时间戳更大）

### 4.5 数据请求

- `services/authClient.ts`：账号 API（register / login / logout / fetchMe / save CRUD）
- `services/aiClient.ts`：AI 提示 API（`/api/hint`，未配置时前端回退本地启发）
- 请求携带凭证：`fetch(url, { credentials: "include" })`（让浏览器自动带 Cookie）
- 认证失败（401）：调用 `useAuthStore.getState().logout()` 清理本地态，跳回首页

### 4.6 VN 引擎（/play 页面）

- 引擎核心：`packages/ink-vn-core/` 的 `NarrativeRunner` 接口
- 创建 runner：`engine/createRunner.ts`，统一走 `createStoryRunner(inkJson: string)`
- 应用层适配：`engine/shijiInkAdapter.ts` — 负责把 Ink `#tag` / `#key:value` 解释为游戏领域语义（achieve / death / hint / correct 等）
- 回调模式：`StageCallbacks` 处理 `onBackground` / `onShowCharacter` / `onHideCharacter` / `onBGM` / `onChoice`
- 存档恢复：`runner.snapshot()` 序列化 ink 状态，存入 `UserProgress.storylines[storyId][charId].saveState`

### 4.7 设计系统

- 设计 token：`components/ui/ui.css` + `App.css` / `index.css`（色彩 / 间距 / 动效）
- 通用 UI 组件：`components/ui/` 下的 Badge / Button / Drawer / Modal / ProgressBar（用 `lucide-react` 图标）
- **音效事件委托**：`App.tsx` 的 `SfxDelegator` 全局监听 click / pointerover，对所有 `<button>` / `<a>` / `[role="button"]` 自动播放 click / hover 音效，`data-no-sfx` 可豁免
- 错误边界：根组件包 `<ErrorBoundary>`，避免 VN 崩溃白屏

---

## 五、数据与内容规范

### 5.1 内容目录结构

```
src/react-app/data/
├── achievements/       # 成就定义（按朝代分文件：shang / xizhou / chunqiu / zhanguo / qin / chuhan / hanchu / hanwu / zhuzi）
│   └── base.ts         # 通用工具 + 类型（AchievementDef / checkCondition）
├── classics/           # 典籍原文（130+ 卷，每卷单独 .ts 导出 chapter 数组）
│   ├── catalog.ts      # 典籍目录（卷号→标题→朝代映射）
│   └── chapters/NNN.ts # 第 NNN 卷原文数据
├── sceneAssets/        # 场景资源（背景、立绘、BGM 映射表，按朝代拆分）
├── stories/            # Ink 剧本
│   ├── ink/*.ink       # 源文件（.ink，用 inky 编辑器修改）
│   └── inkStories/*.ts # 编译后的 JSON（或 import JSON，按朝代 index.ts 汇总）
├── storylines/         # 剧情线元数据（章节、角色、解锁条件、朝代归属）
├── characters.ts       # 人物主数据（id、姓名、朝代、稀有度、头像、描述）
├── series.ts           # 剧情系列元数据（五帝 / 夏商周 / 春秋 / 战国 / 秦 / 楚汉 / 汉初 / 汉武 / 诸子）
├── gachaPools.ts       # 抽卡池配置
├── panorama.ts         # 全景画卷配置（时间线节点、关系图边、史料条目）
└── relationColors.ts   # 关系图谱配色（按关系类型映射）
```

### 5.2 Ink 剧本标签约定

Ink 注释使用 `#key:value` 或 `#flag` 格式，由 `shijiInkAdapter.ts` 解析：

| 标签 | 语义 | 示例 |
|------|------|------|
| `#speaker:NAME` | 当前段说话人姓名（undefined = 旁白） | `#speaker:项羽` |
| `#bg:KEY` | 切换背景（KEY → sceneAssets 映射到图片 URL） | `#bg:gaixia` |
| `#show:ID,EXPR,POS` | 显示人物立绘（POS = left/center/right） | `#show:xiangyu,angry,right` |
| `#hide:ID` | 隐藏人物立绘 | `#hide:xiangyu` |
| `#bgm:TRACK` | 切换 BGM | `#bgm:battle` |
| `#achieve:ID` | 解锁成就（ID 在 achievements/ 下定义） | `#achieve:baiqi_kengzhao` |
| `#death:ID` | 触发死亡结局（ID → DeathsCodex 图鉴条目） | `#death:hongmen_yijiu` |
| `#correct` | 标记选项为正史正确选择（影响 bestChoiceRate） | 选项行尾 `#correct` |
| `#hint:TEXT` | 给 AI 提示接口的上下文补充（不展示给玩家） | `#hint:此时项羽 40 万 vs 刘邦 10 万` |

### 5.3 稀有度枚举

- `common`（普通·青史留名）/ `fine`（精良·一方豪杰）/ `rare`（稀有·千古风流）/ `legendary`（传说·帝王将相）
- 卡池概率、碎片兑换比例、成就星级均基于此四级

---

## 六、性能与限制

- Workers CPU 时间：< 50ms（边缘），存档 PUT 做短事务
- D1 查询：`users.username` 和 `saves.user_id` 已建索引；新查询字段先建索引再上
- 首屏代码量：首页 / 剧情选择用 Eager，重模块（D3 / VN Engine / 典籍原文）必须 lazy split
- 静态资源：`public/assets/` 和 `public/images/` 下的大图片用 webp，提供 @1x / @2x
- 全景画卷关系图：ego 子图节点上限 300，边上限 500，避免力导向布局卡顿

---

## 七、常用命令

```bash
npm run dev          # Vite 开发服务器 → http://localhost:5173（Worker + SPA 一起热更新）
npm run build        # tsc -b && vite build
npm run check        # tsc && vite build && wrangler deploy --dry-run（提交前必跑）
npm run lint         # ESLint
npm run cf-typegen   # 改动 wrangler.json 绑定后必跑 → 刷新 worker-configuration.d.ts
npm run deploy       # wrangler deploy → Cloudflare Workers
```

---

## 八、Git 提交规范

Conventional Commits（中文）：

```
<type>: <subject>

<body>
```

type 可选值：

| type | 说明 |
|------|------|
| `feat` | 新功能（新剧情 / 新成就 / 新图鉴条目也算） |
| `fix` | 修复 bug（含存档兼容修复） |
| `refactor` | 重构（不新增功能、不修 bug） |
| `style` | 格式调整（不影响代码逻辑） |
| `docs` | 文档变更 |
| `test` | 测试相关 |
| `chore` | 构建 / 工具 / 依赖 / 灌数据脚本 |
| `perf` | 性能优化 |
| `content` | 内容更新（Ink 剧本 / 典籍原文 / 成就文案等纯内容） |

示例：
- `feat: 新增「荆轲刺秦」剧情线与 3 个成就`
- `fix: 修复存档合并时保底计数被云端重置的 bug`
- `content: 更新 汉武卷 031-045 章典籍原文`
- `perf: 全景画卷关系图节点上限提至 300，加空边剪枝`
