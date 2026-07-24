# 穿越·史记（shiji.timeslip.work）

> 「穿越兰台」产品线 PC 子站 — 基于 Ink 引擎的史记互动阅读体验。

## 项目简介

**穿越·史记** 是「穿越兰台」历史文化产品线的 PC 子站，通过 Ink 视觉小说引擎将《史记》等典籍转化为沉浸式互动阅读体验。

### 产品线矩阵

| 项目 | 域名 / 标识 | 技术栈 | 定位 |
|------|------------|--------|------|
| **穿越兰台 主站** | `timeslip.work` | （待确认） | PC 主站，品牌入口与核心内容 |
| **穿越·史记** | `shiji.timeslip.work` | React 19 + Vite + Hono + Cloudflare Workers | PC 子站，Ink 视觉小说 + 史记互动阅读 |
| **穿越圈** | 微信小程序 `wx515b70782ea1aaf3` | 原生小程序 + 云开发 | 移动端社区 / 轻互动 / 用户体系 |

## 技术栈

- **前端**：React 19 + TypeScript + Vite
- **后端**：Hono（运行在 Cloudflare Workers 上）
- **边缘计算**：Cloudflare Workers
- **视觉小说引擎**：Ink（inkle）
- **AI 能力**：Cloudflare Workers AI（图像生成等）
- **KV 存储**：Cloudflare KV（图片缓存）

## 目录结构

```
timeslip-shiji/
├── src/                       # 前端源码（React）
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
├── server/                    # 后端（Hono + Workers）
│   └── index.ts
├── public/                    # 静态资源
├── .trae/                     # AI agent 配置
│   └── skills/
│       ├── ink-story-writing/    # Ink 剧本写作
│       ├── kv-image-gen/         # KV 图片生成与缓存
│       └── vn-story-image/       # 视觉小说配图生成
├── wrangler.jsonc            # Cloudflare Workers 配置
├── vite.config.ts            # Vite 配置
├── package.json
└── README.md                 # 本文件
```

## 开发

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

应用运行在 [http://localhost:5173](http://localhost:5173)。

## 构建与部署

生产构建：

```bash
npm run build
```

部署到 Cloudflare Workers：

```bash
npm run build && npm run deploy
```

实时日志：

```bash
npx wrangler tail
```

## 相关资源

- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/guide/)
- [Hono 文档](https://hono.dev/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Ink 官方文档](https://www.inklestudios.com/ink/)
