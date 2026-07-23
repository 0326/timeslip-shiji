import { Hono } from "hono";
import type { Bindings } from "./env";
import { hint } from "./routes/hint";
import { auth } from "./routes/auth";
import { user } from "./routes/user";

const app = new Hono<{ Bindings: Bindings }>();

// CORS 配置（本地开发时允许 localhost，生产环境限制为 ALLOWED_ORIGIN）
app.use("*", async (c, next) => {
	const origin = c.req.header("Origin") ?? "";
	const allowedOrigin = c.env.ALLOWED_ORIGIN;
	// 本地开发常见端口
	const isDev = !allowedOrigin && (origin.includes("localhost") || origin.includes("127.0.0.1"));
	if (allowedOrigin) {
		const allowed = allowedOrigin.split(",");
		if (allowed.includes(origin)) {
			c.res.headers.set("Access-Control-Allow-Origin", origin);
		}
	} else if (isDev) {
		c.res.headers.set("Access-Control-Allow-Origin", origin);
	}
	c.res.headers.set("Access-Control-Allow-Credentials", "true");
	c.res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
	c.res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (c.req.method === "OPTIONS") return c.body(null, 204);
	await next();
});

app.get("/api/health", (c) => c.json({ ok: true }));

// ── 业务路由 ──
app.route("/api/auth", auth);   // 注册、登录（无需认证）
app.route("/api/user", user);   // 用户信息、存档（需认证）
app.route("/api/hint", hint);   // AI 提示（已有）

// 非 /api 路径由 wrangler assets(single-page-application) 接管，返回 index.html

export default app;
