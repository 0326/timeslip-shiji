// createRunner — Factory that produces an IStoryRunner for a given storyKey.
// Routes to either the legacy StoryRunner (TS-defined stories) or
// ShijiInkAdapter (ink-based stories), based on the key registry.

import type { EngineCallbacks } from "./types";
import type { IStoryRunner } from "./IStoryRunner";
import { StoryRunner } from "./storyRunner";
import { ShijiInkAdapter } from "./shijiInkAdapter";
import { getStory } from "../data/stories";
import { inkStories } from "../data/stories/inkStories";

export type StoryKey = string;

export interface CreateRunnerOptions {
	fresh?: boolean; // true = start from beginning (ignore save)
}

export function createRunner(
	storyKey: StoryKey,
	callbacks: EngineCallbacks = {},
): IStoryRunner {
	// 1. Check ink registry first (new ink-based stories)
	const inkConfig = inkStories[storyKey];
	if (inkConfig) {
		return new ShijiInkAdapter(inkConfig, callbacks);
	}

	// 2. Fall back to legacy TS-defined stories
	const story = getStory(storyKey);
	if (!story) {
		throw new Error(`Story not found: ${storyKey}`);
	}
	return new StoryRunner(story, callbacks);
}
