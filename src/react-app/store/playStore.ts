import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TextSpeed = "slow" | "normal" | "fast";

// 典籍阁阅读字号档位（作用于阅读正文），1 为基准。
export const CLASSICS_FONT_STEPS = [0.85, 1, 1.15, 1.3, 1.5] as const;

interface PlayStore {
	textSpeed: TextSpeed;
	autoPlay: boolean;
	isClassicalHintOpen: boolean;
	setTextSpeed: (s: TextSpeed) => void;
	toggleAutoPlay: () => void;
	toggleClassicalHint: () => void;
	setClassicalHint: (open: boolean) => void;

	// 典籍阁阅读偏好
	classicsFontScale: number;
	showVernacular: boolean;
	showCommentary: boolean;
	bumpClassicsFont: (dir: 1 | -1) => void;
	toggleVernacular: () => void;
	toggleCommentary: () => void;
}

// 仅游戏设置持久化；会话态（当前剧本等）不持久化，靠引擎存档恢复。
export const usePlayStore = create<PlayStore>()(
	persist(
		(set) => ({
			textSpeed: "normal",
			autoPlay: false,
			isClassicalHintOpen: false,
			setTextSpeed: (textSpeed) => set({ textSpeed }),
			toggleAutoPlay: () => set((s) => ({ autoPlay: !s.autoPlay })),
			toggleClassicalHint: () => set((s) => ({ isClassicalHintOpen: !s.isClassicalHintOpen })),
			setClassicalHint: (open) => set({ isClassicalHintOpen: open }),

			classicsFontScale: 1,
			showVernacular: true,
			showCommentary: true,
			bumpClassicsFont: (dir) =>
				set((s) => {
					const steps = CLASSICS_FONT_STEPS;
					const i = steps.indexOf(s.classicsFontScale as (typeof steps)[number]);
					const cur = i === -1 ? steps.indexOf(1) : i;
					const next = Math.min(steps.length - 1, Math.max(0, cur + dir));
					return { classicsFontScale: steps[next] };
				}),
			toggleVernacular: () => set((s) => ({ showVernacular: !s.showVernacular })),
			toggleCommentary: () => set((s) => ({ showCommentary: !s.showCommentary })),
		}),
		{ name: "shiji-play-settings", version: 1 },
	),
);
