// Core types for ink-vn-core — domain-agnostic visual novel narrative engine.
// These types contain NO domain-specific semantics (no "hint", "death", "achieve", "correct").
// All unrecognized tags are passed through via `meta: TagMeta`.

/** Key-value metadata from unrecognized ink #tags. `#flag` → { flag: true }; `#key:value` → { key: "value" } */
export type TagMeta = Record<string, string | true>;

/** Horizontal position for character sprites */
export type Position = "left" | "center" | "right" | "float";

/** A single dialogue / narration line produced by the engine */
export interface Segment {
	/** Cleaned text content (tags stripped) */
	text: string;
	/** Speaker name from #speaker:NAME; undefined = narration */
	speaker?: string;
	/** Unrecognized tags as key-value metadata (hint, death, achieve, correct, etc. — app-defined) */
	meta: TagMeta;
}

/** A choice option presented to the player */
export interface RunnerChoice {
	/** Display text */
	text: string;
	/** Tags attached to this choice (correct, hint, etc. — app-defined) */
	meta: TagMeta;
	/** Internal index used by choose() */
	readonly _index: number;
}

/** Runner state machine states */
export type RunnerState =
	| "text"    // Segments available; call advance() after player clicks through all text
	| "choice"  // Waiting for player to choose; call choose(index)
	| "death"   // Death ending reached; deathId points to app's death registry
	| "ended";  // Story concluded

/** Output returned by advance() / choose() */
export interface RunnerOutput {
	state: RunnerState;
	segments: Segment[];
	choices: RunnerChoice[];
	/** Set when state === 'death'; app maps this ID to death metadata */
	deathId?: string;
}

/** Callbacks for stage/director events — core fires these, app handles rendering */
export interface StageCallbacks {
	/** Background change requested */
	onBackground?(bg: string): void;
	/** Show a character sprite */
	onShowCharacter?(id: string, expr: string | undefined, pos: Position): void;
	/** Hide a character sprite */
	onHideCharacter?(id: string): void;
	/** Play/change BGM */
	onBGM?(track: string): void;
	/** Fired when player makes a choice (before the next advance); app uses this for statistics */
	onChoice?(choice: RunnerChoice, index: number): void;
}

/** Narrative runner interface — pure narrative primitives, no game rules. */
export interface NarrativeRunner {
	/** Advance dialogue until the next choice / death / end. */
	advance(): RunnerOutput;
	/** Select a choice by index and advance to next pause point. */
	choose(index: number): RunnerOutput;
	/** Serialize current narrative state (ink only, no visual state). */
	snapshot(): string;
	/** Restore from a snapshot produced by snapshot(). */
	restore(snapshot: string): void;
	/** Reset to the beginning of the story. */
	restart(): void;
	/** Read an ink variable value. */
	getVar(name: string): unknown;
	/** Set an ink variable (number | boolean | string). */
	setVar(name: string, value: number | boolean | string): void;
	/**
	 * 收集当前暂停点的选项（不推进剧情）。
	 * 用于恢复到抉择点快照后重新获取选项列表。
	 * 返回空数组表示当前无选项（可能已结束或在文本中途）。
	 */
	getCurrentChoices(): RunnerChoice[];
}
