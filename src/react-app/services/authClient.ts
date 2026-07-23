import type {
	CloudSaveResponse,
	ConflictError,
	LoginResponse,
	RegisterResponse,
	SaveUploadResponse,
	UserInfo,
} from "../types/auth";
import type { UserProgress } from "../types/progress";

const TOKEN_KEY = "shiji-auth-token";

export function getStoredToken(): string | null {
	try {
		return localStorage.getItem(TOKEN_KEY);
	} catch {
		return null;
	}
}

export function setStoredToken(token: string | null): void {
	try {
		if (token) localStorage.setItem(TOKEN_KEY, token);
		else localStorage.removeItem(TOKEN_KEY);
	} catch {
		// localStorage 不可用时静默失败
	}
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const token = getStoredToken();
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string> | undefined),
	};
	if (token) headers["Authorization"] = `Bearer ${token}`;

	const res = await fetch(path, { ...options, headers });
	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
		// 401 时清除 token
		if (res.status === 401) setStoredToken(null);
		throw data;
	}
	return data as T;
}

// ── 认证相关 ──

export async function register(username: string, password: string, nickname?: string): Promise<LoginResponse> {
	const res = await apiFetch<RegisterResponse>("/api/auth/register", {
		method: "POST",
		body: JSON.stringify({ username, password, nickname }),
	});
	setStoredToken(res.token);
	return res;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
	const res = await apiFetch<LoginResponse>("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({ username, password }),
	});
	setStoredToken(res.token);
	return res;
}

export function logout(): void {
	setStoredToken(null);
}

export async function checkUsername(username: string): Promise<{ valid: boolean; available: boolean; message?: string }> {
	const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`);
	return res.json();
}

export async function fetchMe(): Promise<UserInfo> {
	return apiFetch<UserInfo>("/api/user/me");
}

// ── 云端存档 ──

export async function fetchCloudSave(slot = "default"): Promise<CloudSaveResponse> {
	return apiFetch<CloudSaveResponse>(`/api/user/save?slot=${encodeURIComponent(slot)}`);
}

export async function uploadCloudSave(
	save: UserProgress,
	clientUpdatedAt: number,
	expectedVersion?: number,
	slot = "default",
): Promise<SaveUploadResponse> {
	try {
		return await apiFetch<SaveUploadResponse>("/api/user/save", {
			method: "PUT",
			body: JSON.stringify({ save, clientUpdatedAt, slot, expectedVersion }),
		});
	} catch (err) {
		// 冲突错误原样抛出
		if ((err as ConflictError)?.error === "conflict") throw err;
		throw err;
	}
}

export async function deleteCloudSave(slot = "default"): Promise<{ ok: boolean }> {
	return apiFetch<{ ok: boolean }>(`/api/user/save?slot=${encodeURIComponent(slot)}`, { method: "DELETE" });
}

// ── 用户信息 ──

export async function updateNickname(nickname: string): Promise<{ ok: boolean; nickname: string }> {
	return apiFetch<{ ok: boolean; nickname: string }>("/api/user/me", {
		method: "PATCH",
		body: JSON.stringify({ nickname }),
	});
}

// 判断账号系统是否可用（基于 /api/health 不直接判断，调用 auth 接口返回 503 则不可用）
export async function isAuthAvailable(): Promise<boolean> {
	try {
		const res = await fetch("/api/auth/check-username?username=__probe__");
		// 400 表示接口存在但参数不对，说明系统可用
		// 503 表示未配置
		return res.status !== 503;
	} catch {
		return false;
	}
}
