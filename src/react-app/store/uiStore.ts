import { create } from "zustand";

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
}

let seq = 1;

export const useUiStore = create<UiStore>((set) => ({
	toasts: [],
	pushToast: (t) =>
		set((s) => ({ toasts: [...s.toasts, { ...t, id: seq++ }] })),
	dismissToast: (id) =>
		set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));
