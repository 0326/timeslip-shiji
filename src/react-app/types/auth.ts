// 用户认证相关类型

export interface UserInfo {
	id: string;
	username: string;
	nickname: string;
	createdAt: number;
	lastLoginAt?: number;
	avatarUrl?: string | null;
}

export interface AuthState {
	token: string | null;
	user: UserInfo | null;
	isAuthenticated: boolean;
	isLoading: boolean; // 正在验证本地存储的 token
	cloudSaveVersion: number | null; // 云端存档版本号
}

export interface ApiError {
	error: string;
	message?: string;
}

export interface LoginResponse {
	token: string;
	user: UserInfo;
}

export interface RegisterResponse extends LoginResponse {}

export interface CloudSaveResponse {
	exists: boolean;
	save?: import("./progress").UserProgress;
	updatedAt?: number;
	clientUpdatedAt?: number;
	version?: number;
}

export interface SaveUploadResponse {
	ok: boolean;
	version: number;
	updatedAt: number;
}

export interface ConflictError extends ApiError {
	error: "conflict";
	serverSave: import("./progress").UserProgress | null;
	serverVersion: number;
	serverClientUpdatedAt: number;
}
