// inkStories — Registry of ink-backed stories.
// Each entry is an InkStoryConfig that ShijiInkAdapter consumes.
// Ink source files are imported as raw text via Vite's ?raw suffix.

import type { InkStoryConfig } from "../../engine/shijiInkAdapter";

// Static import of .ink source files (Vite ?raw returns the file content as string)
import hanxinC1Source from "./ink/hanxin-c1.ink?raw";

/**
 * Ink story registry.
 * Key convention: "<storyKey>:<chapter>" for individual chapters,
 * or just "<storyKey>" for full stories.
 */
export const inkStories: Record<string, InkStoryConfig> = {
	"hanxin:c1": {
		key: "hanxin:c1",
		title: "兵仙韩信 · 第一章 · 胯下之辱",
		source: hanxinC1Source,
		precompiled: false,
		deaths: {
			kill: {
				reason: "因一时之忿杀人，亡命天涯，兵仙就此夭折",
				classical: "于是信孰视之，俛出袴下，蒲伏。",
				analysis:
					"史上的韩信选择了钻胯下。杀掉那个无赖，他便要亡命逃匿，再无登坛拜将之日。大丈夫能屈能伸——所谓『孰视之』，是看清了忍辱与前程孰轻孰重。",
			},
		},
	},
};
