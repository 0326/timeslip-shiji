import { create } from "zustand";
import { sfx } from "../lib/sfx";

const BGM_STORAGE_KEY = "cysj-bgm";
const SFX_CHOSEN_KEY = "cysj-sfx-chosen";

export interface ToastItem {
	id: number;
	kind: "achievement" | "info" | "reward";
	title: string;
	subtitle?: string;
	icon?: string;
}

function readBgmEnabled(): boolean {
	try {
		return localStorage.getItem(BGM_STORAGE_KEY) === "on";
	} catch {
		return false;
	}
}

function writeBgmEnabled(on: boolean) {
	try {
		localStorage.setItem(BGM_STORAGE_KEY, on ? "on" : "off");
	} catch {
		/* ignore */
	}
}

function readSfxChosen(): boolean {
	try {
		return sessionStorage.getItem(SFX_CHOSEN_KEY) === "true";
	} catch {
		return false;
	}
}

function writeSfxChosen(chosen: boolean) {
	try {
		sessionStorage.setItem(SFX_CHOSEN_KEY, chosen ? "true" : "false");
	} catch {
		/* ignore */
	}
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
	setSfxEnabled: (on: boolean) => void;
	// 全局 BGM 开关（HUD 控制，持久化到 localStorage）
	bgmEnabled: boolean;
	toggleBgm: () => void;
	setBgmEnabled: (on: boolean) => void;
	// 音效引导：是否已做过首次选择
	hasChosenSfx: boolean;
	markSfxChosen: () => void;
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
	setSfxEnabled: (on) =>
		set(() => {
			sfx.setEnabled(on);
			return { sfxEnabled: on };
		}),
	bgmEnabled: readBgmEnabled(),
	toggleBgm: () =>
		set((s) => {
			const next = !s.bgmEnabled;
			writeBgmEnabled(next);
			return { bgmEnabled: next };
		}),
	setBgmEnabled: (on) =>
		set(() => {
			writeBgmEnabled(on);
			return { bgmEnabled: on };
		}),
	hasChosenSfx: readSfxChosen(),
	markSfxChosen: () =>
		set(() => {
			writeSfxChosen(true);
			return { hasChosenSfx: true };
		}),
}));
