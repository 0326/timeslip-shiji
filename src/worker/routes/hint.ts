import { Hono } from "hono";
import type { Bindings } from "../env";
import { rateLimit } from "../lib/rateLimit";

// 游戏内「史官点拨」：引导式提示，绝不直接给答案。
// 三重护栏：来源校验 + IP 限流 + 参数白名单（model/max_tokens/system 服务端固定）。
const SYSTEM_PROMPT = `你是《史记》的历史顾问，正辅助一位玩家进行沉浸式历史抉择游戏。玩家此刻扮演「{character}」。
规则：
1. 绝不直接说出哪个选项正确，也不要复述选项编号。
2. 用一两个启发性的问题，引导玩家去想人物的处境与性情。
3. 可引用一句相关的史记原文，但不要解释其含义。
4. 回答控制在 80 字以内。
5. 用古雅而现代人能懂的语气，像一位温和的史官。
绝对禁止：直说「选 A/B」、剧透后续历史结果。`;

interface HintBody {
	character?: string;
	situation?: string;
	choices?: unknown;
	classicalHint?: string;
}

export const hint = new Hono<{ Bindings: Bindings }>();

hint.post("/", async (c) => {
	// 1) 来源校验（配置了 ALLOWED_ORIGIN 才校验）
	const allow = (c.env.ALLOWED_ORIGIN ?? "").split(",").map((s) => s.trim()).filter(Boolean);
	if (allow.length > 0) {
		const origin = c.req.header("Origin") ?? "";
		if (!allow.includes(origin)) return c.json({ error: "forbidden" }, 403);
	}

	// 2) 限流（按 IP，每分钟 20 次）
	const ip = c.req.header("CF-Connecting-IP") ?? "anon";
	const ok = await rateLimit(c.env.RL_KV, ip, 20, 60);
	if (!ok) return c.json({ error: "rate_limited" }, 429);

	// 3) 参数白名单
	const body = (await c.req.json().catch(() => ({}))) as HintBody;
	const situation = typeof body.situation === "string" ? body.situation : "";
	const choices = Array.isArray(body.choices) ? body.choices.map(String) : [];
	const character = typeof body.character === "string" ? body.character : "历史人物";
	const classicalHint = typeof body.classicalHint === "string" ? body.classicalHint : "";
	if (!situation || choices.length === 0) {
		return c.json({ error: "bad_request" }, 400);
	}

	// 未配置密钥 → 让前端走本地降级
	if (!c.env.ANTHROPIC_API_KEY) {
		return c.json({ error: "ai_unavailable" }, 503);
	}

	try {
		const res = await fetch("https://api.anthropic.com/v1/messages", {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-api-key": c.env.ANTHROPIC_API_KEY,
				"anthropic-version": "2023-06-01",
			},
			body: JSON.stringify({
				model: "claude-sonnet-4-6", // 服务端固定，前端无法更改
				max_tokens: 200,
				system: SYSTEM_PROMPT.replace("{character}", character),
				messages: [
					{
						role: "user",
						content: `当前情境：${situation}\n可选项：${choices.join(" | ")}\n原文线索：${classicalHint}\n\n请给出一个引导性提示。`,
					},
				],
			}),
		});
		if (!res.ok) return c.json({ error: "upstream", status: res.status }, 502);
		const data = (await res.json()) as { content?: { text?: string }[] };
		const text = data.content?.[0]?.text ?? "";
		if (!text) return c.json({ error: "empty" }, 502);
		return c.json({ hint: text });
	} catch {
		return c.json({ error: "upstream" }, 502);
	}
});
