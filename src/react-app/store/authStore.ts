import { create } from "zustand";
import type { AuthState, ConflictError } from "../types/auth";
import type { UserProgress } from "../types/progress";
import * as authApi from "../services/authClient";
import { useUserStore } from "./userStore";

interface AuthStore extends AuthState {
	// 初始化：尝试用本地 token 恢复登录状态
	init: () => Promise<void>;
	// 注册
	register: (username: string, password: string, nickname?: string) => Promise<{ ok: boolean; message?: string }>;
	// 登录
	login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
	// 登出
	logout: () => void;
	// 拉取云端存档并合并到本地
	pullCloudSave: () => Promise<{ ok: boolean; message?: string; merged?: boolean }>;
	// 推送本地存档到云端
	pushCloudSave: () => Promise<{ ok: boolean; message?: string }>;
	// 解决冲突：使用云端 / 使用本地 / 合并
	resolveConflict: (strategy: "cloud" | "local" | "merge") => Promise<{ ok: boolean; message?: string }>;
	// 自动同步（登录后或定时调用）
	autoSync: () => Promise<void>;
	// 更新昵称
	updateNickname: (nickname: string) => Promise<{ ok: boolean; message?: string }>;
	// 设置 cloudSaveVersion（内部用）
	_setCloudVersion: (v: number | null) => void;
}

// 存档合并策略：以本地为基础，对每个 perspective 取 bestChoiceRate 更高的版本
function mergeSaves(local: UserProgress, cloud: UserProgress): UserProgress {
	const merged: UserProgress = {
		...local,
		userId: local.userId || cloud.userId,
		createdAt: Math.min(local.createdAt, cloud.createdAt),
		lastActiveAt: Math.max(local.lastActiveAt, cloud.lastActiveAt),
		points: Math.max(local.points, cloud.points),
		gachaTickets: Math.max(local.gachaTickets, cloud.gachaTickets),
		fragments: Math.max(local.fragments, cloud.fragments),
		lastCheckIn: Math.max(local.lastCheckIn, cloud.lastCheckIn),
		checkInStreak: Math.max(local.checkInStreak, cloud.checkInStreak),
		gacha: {
			totalPulls: Math.max(local.gacha.totalPulls, cloud.gacha.totalPulls),
			pityCount: local.gacha.pityCount, // 保底以本地为准（避免重置）
			ownedCharacters: [...new Set([...local.gacha.ownedCharacters, ...cloud.gacha.ownedCharacters])],
			pullHistory: [...local.gacha.pullHistory, ...cloud.gacha.pullHistory]
				.sort((a, b) => b.timestamp - a.timestamp)
				.slice(0, 100),
		},
		storylines: mergeStorylines(local.storylines, cloud.storylines),
		achievements: {
			unlocked: [...new Set([...local.achievements.unlocked, ...cloud.achievements.unlocked])],
			unlockedAt: { ...cloud.achievements.unlockedAt, ...local.achievements.unlockedAt },
		},
		readSources: [...new Set([...local.readSources, ...cloud.readSources])],
		lifetimeDeaths: Math.max(local.lifetimeDeaths, cloud.lifetimeDeaths),
	};
	return merged;
}

function mergeStorylines(
	local: UserProgress["storylines"],
	cloud: UserProgress["storylines"],
): UserProgress["storylines"] {
	const keys = new Set([...Object.keys(local), ...Object.keys(cloud)]);
	const out: UserProgress["storylines"] = { ...local };
	for (const storyId of keys) {
		const localChars = local[storyId] ?? {};
		const cloudChars = cloud[storyId] ?? {};
		const charKeys = new Set([...Object.keys(localChars), ...Object.keys(cloudChars)]);
		const mergedChars: Record<string, import("../types/progress").PerspectiveProgress> = { ...localChars };
		for (const charId of charKeys) {
			const lp = localChars[charId];
			const cp = cloudChars[charId];
			if (!lp) {
				mergedChars[charId] = cp;
			} else if (cp) {
				// 两个都有：取完成状态 OR，取更高的 completedNodes 和 bestChoiceRate
				mergedChars[charId] = {
					isStarted: lp.isStarted || cp.isStarted,
					isCompleted: lp.isCompleted || cp.isCompleted,
					completedNodes: Math.max(lp.completedNodes, cp.completedNodes),
					deathCount: Math.max(lp.deathCount, cp.deathCount),
					bestChoiceRate: Math.max(lp.bestChoiceRate, cp.bestChoiceRate),
					// saveState 取更新时间更晚的（本地是 lastActiveAt 相关，这里简单取 completedNodes 高的那个的存档）
					saveState: lp.completedNodes >= cp.completedNodes ? lp.saveState : cp.saveState,
				};
			}
		}
		out[storyId] = mergedChars;
	}
	return out;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
	token: null,
	user: null,
	isAuthenticated: false,
	isLoading: true,
	cloudSaveVersion: null,

	init: async () => {
		const token = authApi.getStoredToken();
		if (!token) {
			set({ isLoading: false });
			return;
		}
		try {
			const user = await authApi.fetchMe();
			set({ token, user, isAuthenticated: true, isLoading: false });
			// 登录后尝试自动拉取云端存档
			await get().pullCloudSave();
		} catch {
			// token 无效，清除
			authApi.logout();
			set({ token: null, user: null, isAuthenticated: false, isLoading: false });
		}
	},

	register: async (username, password, nickname) => {
		try {
			const res = await authApi.register(username, password, nickname);
			set({ token: res.token, user: res.user, isAuthenticated: true });
			// 注册后将本地存档上传到云端
			await get().pushCloudSave();
			return { ok: true };
		} catch (err) {
			const e = err as { message?: string; error?: string };
			return { ok: false, message: e.message ?? "注册失败，请重试" };
		}
	},

	login: async (username, password) => {
		try {
			const res = await authApi.login(username, password);
			set({ token: res.token, user: res.user, isAuthenticated: true });
			// 登录后自动拉取云端存档
			await get().pullCloudSave();
			return { ok: true };
		} catch (err) {
			const e = err as { message?: string; error?: string };
			return { ok: false, message: e.message ?? "登录失败，请检查用户名和密码" };
		}
	},

	logout: () => {
		authApi.logout();
		set({ token: null, user: null, isAuthenticated: false, cloudSaveVersion: null });
	},

	pullCloudSave: async () => {
		if (!get().isAuthenticated) return { ok: false, message: "未登录" };
		try {
			const cloud = await authApi.fetchCloudSave();
			if (!cloud.exists || !cloud.save) {
				// 云端没有存档，把本地的推上去
				await get().pushCloudSave();
				return { ok: true, merged: false };
			}
			set({ cloudSaveVersion: cloud.version ?? null });
			const local = useUserStore.getState().progress;
			// 对比 clientUpdatedAt（用 lastActiveAt 作为客户端更新时间）
			const localUpdated = local.lastActiveAt;
			const cloudUpdated = cloud.clientUpdatedAt ?? 0;

			if (cloudUpdated > localUpdated + 1000) {
				// 云端更新：使用云端存档覆盖本地
				useUserStore.setState({ progress: cloud.save });
				return { ok: true, merged: true };
			} else if (localUpdated > cloudUpdated + 1000) {
				// 本地更新：推送本地存档到云端
				await get().pushCloudSave();
				return { ok: true, merged: true };
			}
			// 时间相近：不冲突，无需操作
			return { ok: true, merged: false };
		} catch (err) {
			const e = err as { message?: string };
			return { ok: false, message: e.message ?? "同步失败" };
		}
	},

	pushCloudSave: async () => {
		if (!get().isAuthenticated) return { ok: false, message: "未登录" };
		try {
			const progress = useUserStore.getState().progress;
			// 更新 lastActiveAt
			const toUpload: UserProgress = { ...progress, lastActiveAt: Date.now() };
			const res = await authApi.uploadCloudSave(
				toUpload,
				toUpload.lastActiveAt,
				get().cloudSaveVersion ?? undefined,
			);
			set({ cloudSaveVersion: res.version });
			// 持久化更新后的 lastActiveAt
			useUserStore.setState({ progress: toUpload });
			return { ok: true };
		} catch (err) {
			const e = err as ConflictError | { message?: string };
			if ((e as ConflictError).error === "conflict") {
				return { ok: false, message: "云端存档与本地冲突，请选择如何处理" };
			}
			return { ok: false, message: (e as { message?: string }).message ?? "上传失败" };
		}
	},

	resolveConflict: async (strategy) => {
		if (!get().isAuthenticated) return { ok: false, message: "未登录" };
		try {
			const cloud = await authApi.fetchCloudSave();
			const local = useUserStore.getState().progress;

			if (strategy === "cloud" && cloud.save) {
				useUserStore.setState({ progress: cloud.save });
				set({ cloudSaveVersion: cloud.version ?? null });
				return { ok: true };
			} else if (strategy === "local") {
				// 强制覆盖云端：先不设 expectedVersion
				const res = await authApi.uploadCloudSave({ ...local, lastActiveAt: Date.now() }, Date.now());
				set({ cloudSaveVersion: res.version });
				return { ok: true };
			} else if (strategy === "merge" && cloud.save) {
				const merged = mergeSaves(local, cloud.save);
				merged.lastActiveAt = Date.now();
				useUserStore.setState({ progress: merged });
				const res = await authApi.uploadCloudSave(merged, merged.lastActiveAt);
				set({ cloudSaveVersion: res.version });
				return { ok: true };
			}
			return { ok: false, message: "无效策略" };
		} catch (err) {
			return { ok: false, message: (err as { message?: string }).message ?? "处理冲突失败" };
		}
	},

	autoSync: async () => {
		if (!get().isAuthenticated) return;
		await get().pushCloudSave();
	},

	updateNickname: async (nickname) => {
		try {
			await authApi.updateNickname(nickname);
			set((s) => (s.user ? { user: { ...s.user, nickname } } : {}));
			return { ok: true };
		} catch (err) {
			return { ok: false, message: (err as { message?: string }).message ?? "修改失败" };
		}
	},

	_setCloudVersion: (v) => set({ cloudSaveVersion: v }),
}));

// 监听 userStore 变化，自动同步到云端（节流：最多每 30 秒自动同步一次）
let syncTimer: ReturnType<typeof setTimeout> | null = null;
useUserStore.subscribe(() => {
	const auth = useAuthStore.getState();
	if (!auth.isAuthenticated) return;
	// 仅在有实际变化时触发
	if (syncTimer) clearTimeout(syncTimer);
	syncTimer = setTimeout(() => {
		auth.autoSync();
	}, 30000);
});
