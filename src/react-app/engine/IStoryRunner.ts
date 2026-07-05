// IStoryRunner — app-side unified interface for story runners.
// This is the contract that both the legacy StoryRunner and the new Ink-backed
// adapter must satisfy. UI components (VNEngine, DialogueBox, etc.) consume
// StoryState produced by runners implementing this interface.

import type { StoryState, Vars } from "./types";

export interface IStoryRunner {
	/** Advance dialogue to the next choice / death / end point. */
	advance(): StoryState;
	/** Select a choice by index and advance. */
	choose(index: number): StoryState;
	/** Retry after death (restore to the last choice point). */
	retry(): StoryState;
	/** Restart the story from the beginning. */
	restart(): void;
	/** Get all current variables. */
	getVars(): Vars;
	/** Get the correct-choice rate (0–1). */
	getChoiceRate(): number;
	/** Get cumulative death count. */
	getDeathCount(): number;
	/** Get number of completed choice nodes. */
	getCompletedNodes(): number;
	/** Serialize full state for save. */
	getSaveState(): string;
	/** Restore from a save state string. */
	loadSaveState(json: string): void;
}
