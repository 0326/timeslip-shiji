import type {
	CloudSaveResponse,
	ConflictError,
	LoginResponse,
	RegisterResponse,
	SaveUploadResponse,
	UserInfo,
} from "../types/auth";
import type { UserProgress } from "../types/progress";

const LEGACY_TOKEN_KEY = "shiji-auth-token";

function clearLegacyToken(): void {
	try {
		localStorage.removeItem(LEGACY_TOKEN_KEY);
	} catch {
		// ignore
	}
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
		...(options.headers as Record<string, string> | undefined),
	};

	const res = await fetch(path, { ...options, headers, credentials: "include" });
	const data = await res.json().catch(() => ({}));

	if (!res.ok) {
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
	clearLegacyToken();
	return res;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
	const res = await apiFetch<LoginResponse>("/api/auth/login", {
		method: "POST",
		body: JSON.stringify({ username, password }),
	});
	clearLegacyToken();
	return res;
}

export async function logout(): Promise<void> {
	try {
		await apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
	} catch {
		// ignore logout errors
	}
	clearLegacyToken();
}

export async function checkUsername(username: string): Promise<{ valid: boolean; available: boolean; message?: string }> {
	const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username)}`, { credentials: "include" });
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

export async function isAuthAvailable(): Promise<boolean> {
	try {
		const res = await fetch("/api/auth/check-username?username=__probe__", { credentials: "include" });
		return res.status !== 503;
	} catch {
		return false;
	}
}
