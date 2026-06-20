import { Hono } from "hono";
import type { Bindings } from "./env";
import { hint } from "./routes/hint";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/health", (c) => c.json({ ok: true }));
app.route("/api/hint", hint);

// 非 /api 路径由 wrangler assets(single-page-application) 接管，返回 index.html

export default app;
