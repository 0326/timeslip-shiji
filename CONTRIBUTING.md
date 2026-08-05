# 穿越·史记（timeslip-shiji）共建文档

> 域名：`shiji.timeslip.work` | 定位：PC 子站，Ink 视觉小说 + 《史记》互动阅读体验
> 发给 AI 时，把本文件作为上下文第一条，AI 即可快速上手。

---

## 一、项目速览

### 1.1 项目定位

**穿越·史记** 是「穿越兰台」产品线的 PC 子站，基于 Ink 视觉小说引擎将《史记》等典籍转化为沉浸式互动阅读体验。

**核心规则**：
- 用户数据库使用 Cloudflare D1（`USER_DB` = `timeslip-shiji-users`）
- 认证采用自研 JWT + HttpOnly Cookie，生产环境 Cookie Domain = `.timeslip.work`
- 存档使用独立的 `saves` 表，与其他站点隔离

### 1.2 技术栈

| 层 | 技术 | 版本 / 说明 |
|----|------|-------------|
| 前端 | React + TypeScript + Vite | React 19 / TS 5.9 / Vite 7 |
| 路由 | react-router-dom | v7，懒加载 + 转场动画 |
| 状态 | zustand | 5.x，authStore / playStore / userStore / uiStore |
| 动效 | framer-motion | ^12 |
| 视觉小说引擎 | inkjs | ~2.4，配合自研 `ink-vn-core` 包 |
| 后端 | Hono + Cloudflare Workers | Hono 4.11 / Wrangler 4.88 |
| 数据库 | Cloudflare D1 | `USER_DB` = `timeslip-shiji-users` |
| 认证 | 自研 JWT + HttpOnly Cookie | PBKDF2-SHA256 密码哈希，Cookie 优先于 Header；生产 JWT_SECRET 与主站一致 |
| 工具包 | lucide-react | 图标 |

### 1.3 目录结构

```
timeslip-shiji/
├── packages/
│   └── ink-vn-core/              # 自研 Ink 引擎核心包（TS）
│       ├── src/{index,inkRunner,tagParser,types}.ts
│       └── test/                  # Vitest 单测
├── public/
│   ├── assets/backgrounds/wudi/  # 场景背景图（12 张专属壁纸）
│   └── images/kv/                 # KV 宣传图 / 人物立绘
├── scripts/                       # 数据清洗 / 校验 / 去背景脚本（Python + Node）
├── src/
│   ├── react-app/
│   │   ├── App.tsx / main.tsx     # 入口
│   │   ├── components/
│   │   │   ├── Auth/              # AuthModal / UserMenu（登录弹窗 / 用户菜单）
│   │   │   ├── Layout/            # AppNav / Layout
│   │   │   ├── ui/                # Button / Modal / Drawer / Badge 等基础组件
│   │   │   └── effects/           # AchievementToaster 等动效组件
│   │   ├── pages/                 # 10 个页面
│   │   │   ├── Home/              # 首页 KV
│   │   │   ├── Play/              # 核心游玩页（VNEngine + DialogueBox + ChoicePanel）
│   │   │   ├── Story/             # 故事选择 / 章节
│   │   │   ├── Gacha/             # 抽卡
│   │   │   ├── Archive/           # 存档管理
│   │   │   ├── Achievement/       # 成就墙
│   │   │   ├── Classics/          # 经典原文阅读
│   │   │   ├── Codex/             # 人物死亡图鉴
│   │   │   └── Panorama/          # 全景：事件时间线 / 关系图 / 来源库
│   │   ├── data/
│   │   │   ├── stories/ink/       # 80+ 个 .ink 剧本文件（按朝代组织）
│   │   │   ├── stories/inkStories/# Ink 元数据索引（TS）
│   │   │   ├── storylines/        # 故事线元数据
│   │   │   ├── achievements/      # 成就定义（10 个朝代 + base）
│   │   │   ├── classics/chapters/ # 130 章经典原文（TS 模块）
│   │   │   ├── characters.ts      # 人物元数据
│   │   │   ├── gachaPools.ts      # 抽卡池定义
│   │   │   └── series.ts          # 朝代系列
│   │   ├── engine/                # InkRunner 适配器
│   │   ├── hooks/                 # useAuthGate / useGacha / useStory / useShareCard
│   │   ├── minigames/             # 竹简游戏 / 华容道
│   │   ├── services/              # aiClient / authClient / mainProjectApi
│   │   ├── store/                 # zustand stores
│   │   └── types/                 # 前端类型
│   └── worker/                    # Hono Worker 后端
│       ├── index.ts               # 路由入口 + CORS
│       ├── env.ts                 # Bindings 类型
│       ├── lib/{crypto,rateLimit}.ts
│       ├── middleware/auth.ts     # requireAuth / optionalAuth（Cookie 优先）
│       ├── routes/
│       │   ├── auth.ts            # /api/auth：register/login/logout/check-username
│       │   ├── user.ts            # /api/user：me/save（saves 表 CRUD）
│       │   └── hint.ts            # /api/hint：AI 提示接口
│       └── migrations/0001_init.sql  # D1 建表（users + saves）
├── .dev.vars                      # 本地环境变量（.gitignore，不提交）
├── wrangler.json                  # Workers 配置（D1 USER_DB 绑定）
├── vite.config.ts                 # Vite + cloudflare 插件 + ink-vn-core alias
├── package.json
└── README.md
```

---

## 二、本地启动服务

### 2.1 前置要求

```
Node.js  >= 20
npm     >= 10 （或 pnpm，项目已存在 lock 文件）
```

> **不需要** `npx wrangler login` 浏览器跳转 OAuth。本地直连线上库只需要找 owner 要两个 token，写进 `.dev.vars` 即可。
>
> 拿不到 token 的共建者可以直接用 **2.7 兜底零账号模式**（本地 Mock 全套，不改线上数据，适合改前端 / 剧本 / UI）。

### 2.2 安装依赖

```bash
cd timeslip-shiji
npm install
```

### 2.3 配置环境变量（✅ 默认：直连线上库，找 owner 要 2 个值填进来）

本项目 `wrangler.json` 默认所有绑定都是 `remote: true`——也就是说，启动后**自动连线上 D1 / 线上 KV / 线上 R2**，不需要你改任何配置。只要把 owner 给你两个值写进 `.dev.vars`（已在 `.gitignore`）即可：

```bash
# 直接创建/覆盖 .dev.vars（把 <xxx> 替换成 owner 给你的值）
cat > .dev.vars <<'EOF'
# ① Cloudflare 最小权限 API Token（owner 在 Cloudflare Dashboard 生成，90 天过期）
CLOUDFLARE_API_TOKEN=<owner 给你的 Cloudflare API Token>

# ② 线上正在使用的同一个 JWT 密钥（一字不差，不然登录验签不过）
JWT_SECRET=<线上同一个 JWT_SECRET>

# 允许的跨域来源，本地开发留空即可
ALLOWED_ORIGIN=

# （可选）AI 提示接口密钥，没给的话 /api/hint 返回 503，前端自动回退本地启发
ANTHROPIC_API_KEY=
EOF
```

> 🚨 **绝对不要**把 `.dev.vars` 提交到 git（已在 `.gitignore`）；也不要把 token 贴到 PR / Issue / 群里。

### 2.4 启动开发服务器

```bash
npm run dev
# Vite 启动后访问 http://localhost:5173
```

启动后自动连线上资源：
- 前端热更新：Vite HMR
- Worker：由 `@cloudflare/vite-plugin` 自动注入，API 走 `/api/*`
- D1 数据库：直连线上 `timeslip-shiji-users`（因为 wrangler.json 默认 `remote: true`）

### 2.5 验证启动

```bash
# ① 健康检查
curl http://localhost:5173/api/health
# 预期返回：{"ok":true}

# ② 直连线上 D1 测试：检查用户名（用一个线上存在的用户名）
curl "http://localhost:5173/api/auth/check-username?username=<线上已注册的用户名>"
# → 线上存在时返回 {"valid":false,"reason":"username_taken"}，不存在返回 {"valid":true}
```

能拿到 `valid:false` 就说明你本地已经**成功连到了线上 D1**，不是本地 Mock 空库。

### 2.6 其他常用命令

```bash
npm run build        # tsc -b + vite build → dist/
npm run check        # tsc && vite build && wrangler deploy --dry-run（提交前必跑）
npm run lint         # ESLint
npm run cf-typegen   # 改完 wrangler.json 绑定后运行，生成 worker-configuration.d.ts
npm run preview      # build 后本地预览生产包
npm run deploy       # wrangler deploy → 部署到 Cloudflare（需要 wrangler login，一般由 owner 做）
npx wrangler tail    # 查看线上 Workers 实时日志（需要登录）
```

### 2.7 兜底方案：零账号本地开发模式（拿不到 token 时用）

> **适合场景**：还没拿到 owner 给的 token / 不知道 token 是什么 / 只改前端、剧本、UI，不想碰线上数据。

**原理**：手动把 `wrangler.json` 里的 `"remote": true` 注释掉，本地 `npm run dev` 就会自动用 Miniflare（Workers 本地模拟器）建一个纯内存 SQLite 库，不连线上、不需要任何 token。

**5 分钟跑起来：**

```bash
# Step 1：安装依赖
npm install

# Step 2：创建 .dev.vars（JWT_SECRET 随便填一串长字符串即可，不需要跟线上一致）
cat > .dev.vars <<'EOF'
JWT_SECRET=local-dev-only-not-for-production-any-random-string-is-fine-xxxxxxxx
ALLOWED_ORIGIN=
EOF

# Step 3：改 wrangler.json——把 D1 绑定里的 "remote": true 注释掉（本地不再连线上）
#    打开 wrangler.json，找到 d1_databases[0]，给这一行加 //：
#    // "remote": true

# Step 4：如果改了 vite.config.ts 里 remoteBindings，把它设为 false（默认就是 false）

# Step 5：启动
npm run dev
# → http://localhost:5173 就能玩，所有前端 / 剧本 / 抽卡 / 小游戏 全部可用
#   用户库是空的，需要先注册一个本地测试账号
```

```bash
# Step 6（可选）：灌一条种子用户 + 示例存档，省得手动注册
#         保持 npm run dev 开着，另开终端执行
curl -X POST http://localhost:5173/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","password":"123456","nickname":"测试玩家"}'
# 返回 {"token":"...","user":{"id":"xxx","username":"tester",...}} 表示成功
# 然后在浏览器用 tester / 123456 登录即可
```

**零账号模式功能矩阵：**

| 模块 | 是否可用 | 说明 |
|------|----------|------|
| 首页 / 动效 | ✅ 完全可用 | 纯前端静态资源 |
| 80+ Ink 剧本游玩 | ✅ 完全可用 | 剧本文件随代码打包，不依赖 DB |
| 抽卡 | ✅ 完全可用 | 前端随机 |
| 成就墙 | ✅ 完全可用 | 本地 zustand 状态 |
| 注册 / 登录 | ✅ 可用 | 本地 Miniflare D1，注册即入本地库 |
| 存档读写 | ✅ 可用 | 存本地 D1（`./.wrangler/state/v3/d1/` 下 SQLite） |
| 部署到线上 | ❌ | 需要 wrangler login（找 owner 合 PR 后统一部署） |
| 读取真实线上用户 | ❌ | 本地是独立库，数据不会同步到线上 |

> 🔁 **想切回直连线上模式？**
> 1. 把 `wrangler.json` 里注释掉的 `"remote": true` 还原（或 `git checkout wrangler.json`）
> 2. `.dev.vars` 填回 owner 给的 `CLOUDFLARE_API_TOKEN` + 线上 `JWT_SECRET`
> 3. 重启 `npm run dev`

> 清空本地 D1：`rm -rf .wrangler/state/v3/d1/`，重启 `npm run dev` 即可重置。

### 2.8 常见问题：启动报错排错

| 报错 / 现象 | 原因 | 解决 |
|-------------|------|------|
| `A request to the Cloudflare API (/accounts/...) failed.` / `Unauthorized` | `.dev.vars` 里的 `CLOUDFLARE_API_TOKEN` 填错了 / 过期了 | 找 owner 重发一个新 token，粘贴时注意别带空格 / 换行 |
| `/api/auth/login` 返回 401，但账号密码明明正确 | `.dev.vars` 里的 `JWT_SECRET` 和线上不一致 | 找 owner 要线上的 JWT_SECRET，一字不差粘贴 |
| `SqliteError: no such table: users` | 没启动线上 D1，本地 Miniflare D1 还没跑迁移 | 零账号模式下执行：`npx wrangler d1 migrations apply timeslip-shiji-users --local` |
| `wrangler.json` 改了之后还是没生效 | 没重启 `npm run dev` | 杀死进程，重新 `npm run dev` |
| 改了前端 / 剧本但浏览器没变化 | 浏览器缓存 | 硬刷新（Cmd/Ctrl + Shift + R） |

---

## 三、连接线上库（D1 USER_DB）

shiji 的用户数据存在 Cloudflare D1 数据库 `timeslip-shiji-users`（ID：`5b627cc1-5f18-4eaf-aba8-f7ebe214404f`）。

> 👉 **共建者无需读本节**：没有 Cloudflare 账号也无法登录的直接看 2.7 零账号开发模式，不影响绝大多数开发工作。

### 3.1 方案 A（owner 用）：`wrangler login` 浏览器登录后直连线上 D1

> 注意：本项目 `wrangler.json` **默认已加** `"remote": true`，不需要手动再加。共建者没有 Cloudflare 账号的按 **2.3 节**用 API Token 直连即可，不用 `wrangler login`。

在 `wrangler.json` 中给 `d1_databases` 项加 `"remote": true`（默认已加）：

```jsonc
// wrangler.json
"d1_databases": [
  {
    "binding": "USER_DB",
    "database_name": "timeslip-shiji-users",
    "database_id": "5b627cc1-5f18-4eaf-aba8-f7ebe214404f",
    "migrations_dir": "src/worker/migrations",
    "remote": true   // ← 默认已存在，c.env.USER_DB 直连线上真实 D1
  }
]
```

然后 owner 登录 Cloudflare（只执行一次）：

```bash
npx wrangler login
npm run dev
```

> **风险提示**：`remote: true` 意味着本地 `npm run dev` 读写的是**真实线上用户数据**。测试注册/登录时请使用测试账号，不要清空 / 覆盖真实数据。建议日常开发还是用 2.7 零账号本地模式，合 PR 前用本方案跑一遍冒烟。

### 3.2 方案 B：本地 D1 副本（安全，不影响线上）

```bash
# 1. 从线上导出数据（需 wrangler 权限）
npx wrangler d1 export timeslip-shiji-users \
  --remote --output=./seed/dump.sql

# 2. 去掉 wrangler.json 中的 "remote": true（还原为本地 miniflare）

# 3. 启动开发时 wrangler 会在本地创建 D1，并执行 migrations
npm run dev

# 4. 导入数据
npx wrangler d1 execute timeslip-shiji-users \
  --local --file=./seed/dump.sql
```

### 3.3 数据库迁移

新建迁移文件：

```bash
# 命名规则：NNNN_描述.sql，例如 0002_add_wechat_openid.sql
touch src/worker/migrations/0002_add_wechat_openid.sql
```

迁移内容示例：

```sql
ALTER TABLE users ADD COLUMN wechat_openid TEXT;
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(wechat_openid);
```

执行迁移（线上）：

```bash
# 先本地验证
npx wrangler d1 migrations apply timeslip-shiji-users --local

# 再执行线上
npx wrangler d1 migrations apply timeslip-shiji-users --remote
```

### 3.4 手动执行 SQL

```bash
# 本地
npx wrangler d1 execute timeslip-shiji-users --local --command "SELECT COUNT(*) FROM users;"

# 线上
npx wrangler d1 execute timeslip-shiji-users --remote --command "SELECT id, username, created_at FROM users LIMIT 10;"
```

---

## 四、关键架构约定

### 4.1 认证中间件（必须遵守）

文件：[src/worker/middleware/auth.ts](file:///Users/liquanfeng/Desktop/trae-workspace/timeslip-shiji/src/worker/middleware/auth.ts)

```typescript
// 取 token 顺序：Cookie 优先 → Authorization Header 兜底
function getToken(c: Context): string | null {
  const cookieToken = extractTokenFromCookie(c.req.header("Cookie"));
  if (cookieToken) return cookieToken;           // ← 优先 Cookie
  return extractToken(c.req.header("Authorization"));
}
```

- **新增需要登录的接口**：挂 `requireAuth` 中间件，通过 `c.var.user.sub` 取 userId
- **登录态可选的接口**：挂 `optionalAuth`，未登录时 `c.var.user` 为 undefined
- **绝对不要**自己解析 Cookie 或 Header，统一走 `getToken`

### 4.2 Cookie 规则

文件：[src/worker/lib/crypto.ts](file:///Users/liquanfeng/Desktop/trae-workspace/timeslip-shiji/src/worker/lib/crypto.ts)

`setAuthCookie(token, hostname)` 自动判断：
- 本地（localhost / 127.0.0.1 / workers.dev）：不加 `Secure`，不加 `Domain`
- 生产：加 `Secure`，加 `Domain=.timeslip.work`

Cookie 属性（生产）：
```
auth_token=xxx; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax; Secure; Domain=.timeslip.work
```

前端 API 调用必须带 Cookie：
```typescript
// fetch 必须包含 credentials: 'include'
await fetch('/api/user/me', { credentials: 'include' })
```

### 4.3 前端 API 客户端

文件：`src/react-app/services/authClient.ts` 和 `src/react-app/services/mainProjectApi.ts`

- 所有 API 请求都要 `credentials: 'include'`
- 认证失败（401）统一清理本地 authStore，弹出 AuthModal

### 4.4 存档系统

- **表名**：`saves`
- **主键**：`(user_id, slot)`，默认 slot = `'default'`
- **并发控制**：写存档传 `expectedVersion`，版本不匹配返回 409 conflict，前端提示用户
- **序列化**：`data` 字段存 JSON 字符串，写之前 `JSON.stringify`，读出来 `JSON.parse`

### 4.5 Ink 剧本 / 故事数据

```
src/react-app/data/stories/
├── ink/                      # 所有 .ink 源文件
│   ├── huangdi-*.ink         # 五帝时期
│   ├── shang-*.ink           # 商
│   ├── xizhou-*.ink          # 西周
│   ├── chunqiu-*.ink         # 春秋
│   ├── zhanguo-*.ink         # 战国
│   ├── qin-*.ink             # 秦
│   ├── chuhan-*.ink          # 楚汉
│   ├── hanchu-*.ink          # 汉初
│   └── hanwu-*.ink           # 汉武
└── inkStories/               # 每个朝代一个 TS 索引文件
    └── index.ts              # 汇总导出
```

新增剧本流程：
1. 在 `stories/ink/` 下新建 `.ink` 文件（参考现有文件，使用 Ink 语法）
2. 在对应朝代 `inkStories/*.ts` 中加入元数据（id、标题、人物、朝代、解锁条件）
3. 在 `storylines/` 对应文件中加入故事线信息
4. 若涉及新人物，同步更新 `data/characters.ts`

---

## 五、优化指南

### 5.1 性能优化 Checklist

| 类别 | 优化点 | 操作方式 |
|------|--------|----------|
| 首屏 | 路由懒加载 | `React.lazy(() => import('./pages/Xxx'))` + Suspense |
| 首屏 | 图片转 webp | 背景图、立绘统一用 webp，可额外准备 AVIF |
| 首屏 | 资源 preload | `index.html` 的 `<link rel="preload">` 关键字体、首屏图 |
| 首屏 | splitChunks | Vite build 把 inkjs / framer-motion / d3 拆成独立 chunk |
| 运行时 | 减少重渲染 | zustand 用 selector 取最小 state；避免大组件 memo 滥用 |
| 运行时 | Canvas 动效 | 粒子数 < 300；`prefers-reduced-motion` 降级为静态图 |
| 运行时 | 抽卡动画 | framer-motion 用 `layout` 而非全量重排 |
| 运行时 | 存档防抖 | `save` 操作加 1000ms debounce，避免每选择一次就 POST |
| API    | KV 缓存 | 不常变的「人物列表 / 故事索引 / 成就定义」加 KV 缓存 |
| API    | D1 查询 | 所有查询必须走索引；`SELECT *` 改为只取需要字段 |
| 包体   | 按需导入 | lucide-react 单图标导入而非 `import * as Icons` |
| 包体   | 移除 dead code | 经典原文 130 章若不用，懒加载或动态 import |
| 构建   | source map | 线上 `upload_source_maps: true` 便于排障，不计入包体 |

### 5.2 Ink 剧本性能

- Ink 文件大小控制在 < 200KB，单剧本过长拆分为多文件通过 `INCLUDE` 组合
- Knot 数量过多时，用 `-> DONE` 及时结束分支，避免内存挂住历史
- 标签解析（tagParser）避免正则回溯，已有单测确保无性能回归

### 5.3 Worker CPU 时间控制

Cloudflare Workers 免费版单次请求 CPU < 10ms，付费版 < 50ms：
- 密码哈希（PBKDF2 100k 次）是最重操作，约 20-30ms，避免在循环中调用
- `verifyJwt` / `signJwt` 约 2-5ms，正常
- AI 提示接口（hint.ts）建议加 `waitUntil` 异步记录，避免阻塞响应

### 5.4 代码质量优化

- 运行 `npm run check` 确保 TypeScript + 构建 + dry-run 全通过
- 所有 API 路由返回结构化错误：`{ error: { code, message } }`，不要裸字符串
- zustand store 按领域拆：auth / play / user / ui，不要把所有状态塞一个 store

---

## 六、提 PR & Issue 共建流程

### 6.1 分支模型

```
main ─── 生产分支，保护分支，禁止直接 push
  │
  └── feat/xxx    ─── 新功能
  └── fix/xxx     ─── Bug 修复
  └── refactor/xxx─── 重构
  └── perf/xxx    ─── 性能优化
  └── docs/xxx    ─── 文档
```

从 `main` 切分支，开发完后提 PR 回 `main`。

### 6.2 Commit Message 规范（中文 Conventional Commits）

```
<type>: <subject>

<body 可选，详细说明改动点 / 原因 / 影响>
```

**type 可选值**：

| type | 含义 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 新增楚汉相争剧本 垓下之围` |
| `fix` | Bug 修复 | `fix: 修复存档版本冲突时前端未提示的问题` |
| `refactor` | 代码重构（不改行为） | `refactor: 抽离 playStore 选择逻辑到 selectors.ts` |
| `perf` | 性能优化 | `perf: 首页 KV 图转 webp，首屏 LCP 降低 400ms` |
| `style` | 样式 / UI 调整 | `style: 抽卡页人物卡片阴影调整` |
| `docs` | 文档 | `docs: 更新本地启动文档，补充 D1 remote 模式` |
| `test` | 测试 | `test: 为 tagParser 新增嵌套标签用例` |
| `chore` | 构建 / 依赖 / 工具 | `chore: 升级 framer-motion 到 12.42` |

**反例**（禁止）：
- `update` / `修改` / `bugfix` / 英文小写开头 / 无句号结尾可

### 6.3 PR 流程

1. **开 PR 前自查清单**（PR 模板中勾选）：
   - [ ] 本地运行 `npm run check` 通过
   - [ ] 本地运行 `npm run lint` 通过（若有报错请修复）
   - [ ] 改动 D1 schema 时，已新建 migration 并本地执行通过
   - [ ] 改动 wrangler.json 绑定后，已运行 `npm run cf-typegen`
   - [ ] 新增 API 路由在 README 或本文档中有描述
   - [ ] 若改动认证 / Cookie / 跨域逻辑，已在本地零账号模式跑通注册登录全流程

2. **PR 标题**：同 commit message 格式，`type: 中文描述`

3. **PR 描述模板**：

```markdown
## 变更类型
- [ ] feat 新功能
- [ ] fix Bug 修复
- [ ] refactor 重构
- [ ] perf 性能
- [ ] style 样式
- [ ] docs 文档
- [ ] test 测试
- [ ] chore 其他

## 改动内容
（用 bullet point 列清楚改了什么）
- 新增了 xxx
- 修改了 xxx 的默认值
- 修复了 xxx 场景下 xxx 的问题

## 关联 Issue
Closes #123

## 测试方式
（列出复现 / 验证步骤）
1. 访问 /play?story=xxx
2. 选择 xxx 选项
3. 预期：弹出死亡画面，写入死亡图鉴

## 特殊说明
（需要 reviewers 特别注意的点，比如：改了 JWT 逻辑，生产部署需通知 owner 进行跨站验证）
```

4. **Code Review**：
   - 至少 1 个 approver 才能合并
   - 改动认证 / 数据库 / 部署配置需要 owner 额外审核
   - Review comment 全部 resolved 才能 merge

5. **合并方式**：Squash Merge（把多个 commit 压成一个，保持 main 历史干净）

### 6.4 Issue 模板

**Bug 报告**：

```markdown
## 复现步骤
1. 打开哪个页面 / 执行什么操作
2. 用哪个账号（测试账号即可，别贴真实密码）
3. 浏览器 + 版本

## 预期行为
应该发生什么

## 实际行为
实际发生了什么（截图 / Console 报错 / Network 请求）

## 环境
- 本地 dev 还是线上 shiji.timeslip.work？
- 若能复现，给出最小复现脚本或 curl
```

**功能建议**：

```markdown
## 需求背景
为什么需要这个功能，解决什么痛点

## 期望方案
（可选）你希望怎么做

## 参考 / 截图
（可选）竞品截图、原型图
```

### 6.5 给 AI 的 Prompt 模板（发给 AI 快速开发）

把本文件 + 以下模板一起发给 AI：

```
你是 timeslip-shiji 项目的资深开发者。请先完整阅读本共建文档和项目的 AGENTS.md / README.md，再执行以下任务：

## 任务描述
<具体要做的事情，比如："在楚汉相争章节新增一个韩信自立为齐王的分支，包含 3 个选择和 2 个结局">

## 约束
- 严格遵守本共建文档中的架构约定（Cookie 优先、存档表名等）
- 运行 npm run check 通过再提交
- 若涉及迁移，新建 migration 文件并提供本地执行命令
- 若改动 auth / Cookie / 跨域相关代码，说明是否需要通知 owner 在部署时做跨站联调

## 交付物
1. 修改的文件列表 + 每个文件的改动点
2. 自测步骤（我按步骤能验证）
3. 若有风险 / 注意事项，列出
```

---

## 七、部署

```bash
# 0. 提交前检查
npm run check

# 1. 部署到 Cloudflare Workers（需要 wrangler login）
npm run deploy
# 等价于：wrangler deploy（wrangler.json 已包含 assets 配置）

# 2. 查看部署后的 URL
# wrangler 会输出：https://timeslip-shiji.xxx.workers.dev
# 生产域名 CNAME 到这个地址即可（已在 Cloudflare DNS 配置 shiji.timeslip.work）

# 3. 生产环境变量 / 密钥
# JWT_SECRET 首次部署或轮换时设置
wrangler secret put JWT_SECRET
# 粘贴长随机字符串

# 4. 实时日志
npx wrangler tail
```

### 部署顺序

普通独立改动（加剧本 / 调 UI / 加页面）：直接 `npm run deploy` → 浏览器访问 `shiji.timeslip.work` 冒烟测试 5 分钟。

涉及 D1 迁移（改 users / saves 表结构）：
1. **先执行迁移**（线上 D1）：`npx wrangler d1 migrations apply timeslip-shiji-users --remote`
2. 再 `npm run deploy` 部署代码
3. 用测试账号验证注册 / 登录 / 存档读写
