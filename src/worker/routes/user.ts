import { Hono } from "hono";
import { requireAuth, type AuthEnv } from "../middleware/auth";
import type { UserProgress } from "../../react-app/types/progress";

export const user = new Hono<AuthEnv>();

// 所有 /api/user/* 路由都需要认证
user.use("*", requireAuth);

// ── 获取当前用户信息 ──
user.get("/me", async (c) => {
	const payload = c.var.user;
	const row = await c.env.USER_DB!.prepare("SELECT id, username, nickname, created_at, last_login_at, avatar_url FROM users WHERE id = ?")
		.bind(payload.sub)
		.first<{ id: string; username: string; nickname: string; created_at: number; last_login_at: number; avatar_url: string | null }>();
	if (!row) return c.json({ error: "user_not_found" }, 404);
	return c.json({
		id: row.id,
		username: row.username,
		nickname: row.nickname,
		createdAt: row.created_at,
		lastLoginAt: row.last_login_at,
		avatarUrl: row.avatar_url,
	});
});

// ── 获取云端存档 ──
user.get("/save", async (c) => {
	const slot = c.req.query("slot") ?? "default";
	const userId = c.var.user.sub;
	const row = await c.env.USER_DB!.prepare("SELECT data, updated_at, client_updated_at, version FROM saves WHERE user_id = ? AND slot = ?")
		.bind(userId, slot)
		.first<{ data: string; updated_at: number; client_updated_at: number; version: number }>();
	if (!row) {
		return c.json({ exists: false });
	}
	let saveData: UserProgress;
	try {
		saveData = JSON.parse(row.data);
	} catch {
		return c.json({ error: "corrupted_save" }, 500);
	}
	return c.json({
		exists: true,
		save: saveData,
		updatedAt: row.updated_at,
		clientUpdatedAt: row.client_updated_at,
		version: row.version,
	});
});

// ── 上传云端存档 ──
// 策略：简单的 last-write-wins，基于 clientUpdatedAt。若云端版本较新则返回冲突。
interface SaveBody {
	save: UserProgress;
	clientUpdatedAt: number;
	slot?: string;
	expectedVersion?: number; // 乐观锁：客户端上次看到的版本号
}

user.put("/save", async (c) => {
	const body = (await c.req.json().catch(() => ({}))) as SaveBody;
	if (!body.save || typeof body.clientUpdatedAt !== "number") {
		return c.json({ error: "bad_request", message: "缺少存档数据" }, 400);
	}
	const slot = body.slot ?? "default";
	const userId = c.var.user.sub;
	const now = Date.now();
	const dataStr = JSON.stringify(body.save);

	// 检查现有存档
	const existing = await c.env.USER_DB!.prepare("SELECT version FROM saves WHERE user_id = ? AND slot = ?")
		.bind(userId, slot)
		.first<{ version: number }>();

	if (existing) {
		// 乐观锁检查：如果客户端传了 expectedVersion 但与服务端不一致，返回冲突
		if (body.expectedVersion !== undefined && existing.version !== body.expectedVersion) {
			const currentRow = await c.env.USER_DB!.prepare("SELECT data, updated_at, client_updated_at, version FROM saves WHERE user_id = ? AND slot = ?")
				.bind(userId, slot)
				.first<{ data: string; updated_at: number; client_updated_at: number; version: number }>();
			return c.json({
				error: "conflict",
				message: "云端存档已更新，请先同步",
				serverSave: currentRow ? JSON.parse(currentRow.data) : null,
				serverVersion: currentRow?.version,
				serverClientUpdatedAt: currentRow?.client_updated_at,
			}, 409);
		}
		const newVersion = existing.version + 1;
		await c.env.USER_DB!.prepare(
			"UPDATE saves SET data = ?, updated_at = ?, client_updated_at = ?, version = ? WHERE user_id = ? AND slot = ?",
		)
			.bind(dataStr, now, body.clientUpdatedAt, newVersion, userId, slot)
			.run();
		return c.json({ ok: true, version: newVersion, updatedAt: now });
	} else {
		// 新建存档
		await c.env.USER_DB!.prepare(
			"INSERT INTO saves (user_id, slot, data, updated_at, client_updated_at, version) VALUES (?, ?, ?, ?, ?, 1)",
		)
			.bind(userId, slot, dataStr, now, body.clientUpdatedAt)
			.run();
		// 更新 userId 到存档里（注册/登录后 userId 应该是服务端分配的）
		return c.json({ ok: true, version: 1, updatedAt: now });
	}
});

// ── 删除云端存档 ──
user.delete("/save", async (c) => {
	const slot = c.req.query("slot") ?? "default";
	const userId = c.var.user.sub;
	await c.env.USER_DB!.prepare("DELETE FROM saves WHERE user_id = ? AND slot = ?").bind(userId, slot).run();
	return c.json({ ok: true });
});

// ── 修改用户信息（昵称）──
user.patch("/me", async (c) => {
	const body = (await c.req.json().catch(() => ({}))) as { nickname?: string };
	const nickname = body.nickname?.trim();
	if (!nickname || nickname.length < 1 || nickname.length > 20) {
		return c.json({ error: "invalid_nickname", message: "昵称长度需在 1-20 位之间" }, 400);
	}
	await c.env.USER_DB!.prepare("UPDATE users SET nickname = ? WHERE id = ?").bind(nickname, c.var.user.sub).run();
	return c.json({ ok: true, nickname });
});
