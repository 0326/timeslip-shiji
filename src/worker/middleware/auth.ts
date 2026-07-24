import type { Context, Next } from "hono";
import type { Bindings } from "../env";
import { extractToken, extractTokenFromCookie, verifyJwt, type JwtPayload } from "../lib/crypto";

export interface AuthEnv {
	Variables: {
		user: JwtPayload;
	};
	Bindings: Bindings;
}

function getToken(c: Context): string | null {
	const cookieToken = extractTokenFromCookie(c.req.header("Cookie"));
	if (cookieToken) return cookieToken;
	return extractToken(c.req.header("Authorization"));
}

/** 需要认证的路由中间件：验证 JWT，将 payload 注入 c.var.user */
export async function requireAuth(c: Context<AuthEnv>, next: Next) {
	if (!c.env.JWT_SECRET || !c.env.USER_DB) {
		return c.json({ error: "auth_not_configured" }, 503);
	}
	const token = getToken(c);
	if (!token) {
		return c.json({ error: "unauthorized", message: "请先登录" }, 401);
	}
	const payload = await verifyJwt(token, c.env.JWT_SECRET);
	if (!payload) {
		return c.json({ error: "invalid_token", message: "登录已过期，请重新登录" }, 401);
	}
	c.set("user", payload);
	await next();
}

/** 可选认证：有 token 则解析，没有则继续（用于某些既支持游客也支持登录用户的接口） */
export async function optionalAuth(c: Context<AuthEnv>, next: Next) {
	if (!c.env.JWT_SECRET) {
		await next();
		return;
	}
	const token = getToken(c);
	if (token) {
		const payload = await verifyJwt(token, c.env.JWT_SECRET);
		if (payload) c.set("user", payload);
	}
	await next();
}
