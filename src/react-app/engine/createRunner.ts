// createRunner — Factory that produces an IStoryRunner for a given storyKey.
// All stories are ink-based; routes to ShijiInkAdapter via the ink registry.

import type { EngineCallbacks } from "./types";
import type { IStoryRunner } from "./IStoryRunner";
import { ShijiInkAdapter } from "./shijiInkAdapter";
import { inkStories } from "../data/stories/inkStories";
import { loadInkSource } from "../data/stories/inkSourceLoader";

export type StoryKey = string;

export interface CreateRunnerOptions {
	fresh?: boolean; // true = start from beginning (ignore save)
	/** 正史模式：非 #correct 的存活分支选中即失败（默认 true；自由模式传 false） */
	strict?: boolean;
}

/**
 * 同步创建 runner（要求 inkConfig.source 已就绪）。
 * 若 source 为空且 inkFile 存在，请改用 createRunnerAsync。
 */
export function createRunner(
	storyKey: StoryKey,
	callbacks: EngineCallbacks = {},
	opts: CreateRunnerOptions = {},
): IStoryRunner {
	const inkConfig = inkStories[storyKey];
	if (!inkConfig) {
		throw new Error(`Story not found: ${storyKey}`);
	}
	if (!inkConfig.source && inkConfig.inkFile) {
		throw new Error(
			`Story source not loaded yet: ${storyKey}. Use createRunnerAsync() instead.`,
		);
	}
	return new ShijiInkAdapter(inkConfig, callbacks, { strict: opts.strict ?? true });
}

/**
 * 异步创建 runner：按需加载 ink 源码后再构造适配器。
 * ink 源码从主包拆出后（P0-1），必须用此函数。
 */
export async function createRunnerAsync(
	storyKey: StoryKey,
	callbacks: EngineCallbacks = {},
	opts: CreateRunnerOptions = {},
): Promise<IStoryRunner> {
	const inkConfig = inkStories[storyKey];
	if (!inkConfig) {
		throw new Error(`Story not found: ${storyKey}`);
	}

	// 若 source 尚未加载，按需拉取
	if (!inkConfig.source && inkConfig.inkFile) {
		inkConfig.source = await loadInkSource(inkConfig.inkFile);
	}

	return new ShijiInkAdapter(inkConfig, callbacks, { strict: opts.strict ?? true });
}
