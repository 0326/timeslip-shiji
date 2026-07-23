import { create } from "zustand";
import { sfx } from "../lib/sfx";

export interface ToastItem {
	id: number;
	kind: "achievement" | "info" | "reward";
	title: string;
	subtitle?: string;
	icon?: string;
}

interface UiStore {
	toasts: ToastItem[];
	pushToast: (t: Omit<ToastItem, "id">) => void;
	dismissToast: (id: number) => void;
	// 全局登录/注册弹窗（单例，任意组件可触发）
	authModalOpen: boolean;
	authModalMode: "login" | "register";
	openAuthModal: (mode?: "login" | "register") => void;
	closeAuthModal: () => void;
	// 全局音效开关（HUD 控制，持久化到 localStorage）
	sfxEnabled: boolean;
	toggleSfx: () => void;
}

let seq = 1;

export const useUiStore = create<UiStore>((set) => ({
	toasts: [],
	pushToast: (t) =>
		set((s) => ({ toasts: [...s.toasts, { ...t, id: seq++ }] })),
	dismissToast: (id) =>
		set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
	authModalOpen: false,
	authModalMode: "login",
	openAuthModal: (mode = "login") =>
		set({ authModalOpen: true, authModalMode: mode }),
	closeAuthModal: () => set({ authModalOpen: false }),
	sfxEnabled: sfx.isEnabled(),
	toggleSfx: () =>
		set((s) => {
			const next = !s.sfxEnabled;
			sfx.setEnabled(next);
			if (next) sfx.play("click");
			return { sfxEnabled: next };
		}),
}));
