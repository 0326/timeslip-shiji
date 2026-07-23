// createRunner — Factory that produces an IStoryRunner for a given storyKey.
// All stories are ink-based; routes to ShijiInkAdapter via the ink registry.

import type { EngineCallbacks } from "./types";
import type { IStoryRunner } from "./IStoryRunner";
import { ShijiInkAdapter } from "./shijiInkAdapter";
import { inkStories } from "../data/stories/inkStories";

export type StoryKey = string;

export interface CreateRunnerOptions {
	fresh?: boolean; // true = start from beginning (ignore save)
	/** 正史模式：非 #correct 的存活分支选中即失败（默认 true；自由模式传 false） */
	strict?: boolean;
}

export function createRunner(
	storyKey: StoryKey,
	callbacks: EngineCallbacks = {},
	opts: CreateRunnerOptions = {},
): IStoryRunner {
	const inkConfig = inkStories[storyKey];
	if (!inkConfig) {
		throw new Error(`Story not found: ${storyKey}`);
	}
	return new ShijiInkAdapter(inkConfig, callbacks, { strict: opts.strict ?? true });
}
