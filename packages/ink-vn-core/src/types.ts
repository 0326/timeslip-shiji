// Core types for ink-vn-core — domain-agnostic visual novel narrative engine.
// These types contain NO domain-specific semantics (no "hint", "death", "achieve", "correct").
// All unrecognized tags are passed through via `meta: TagMeta`.

/** Key-value metadata from unrecognized ink #tags. `#flag` → { flag: true }; `#key:value` → { key: "value" } */
export type TagMeta = Record<string, string | true>;

/** Horizontal position for character sprites */
export type Position = "left" | "center-left" | "center" | "center-right" | "right" | "float";

/** A character sprite to show on stage (multi-character support) */
export interface SpriteShow {
	id: string;
	expr?: string;
	pos: Position;
}

/** Segment kind: dialogue (spoken line), narration (no speaker), thought (inner monologue) */
export type SegmentKind = "dialogue" | "narration" | "thought";

/** A single dialogue / narration line produced by the engine */
export interface Segment {
	/** Cleaned text content (tags stripped) */
	text: string;
	/** Speaker name from #speaker:NAME; undefined = narration unless kind explicitly set */
	speaker?: string;
	/** Dialogue / narration / thought — derived from tags (#narration, #thought) or presence of speaker */
	kind: SegmentKind;
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
	| "text"     // Segments available; call advance() after player clicks through all text
	| "choice"   // Waiting for player to choose; call choose(index)
	| "death"    // Death ending reached; deathId points to app's death registry
	| "minigame" // Minigame interrupt; minigame field has id + params, call resumeMinigame(result, score?) after
	| "ended";   // Story concluded

/** Minigame interrupt payload — produced when #minigame:id:params is encountered */
export interface MinigameInterrupt {
	/** Minigame id registered in the app's minigame registry */
	id: string;
	/** Raw colon-split params (optional); app parses them per minigame id */
	params?: string;
}

/** Output returned by advance() / choose() / resumeMinigame() */
export interface RunnerOutput {
	state: RunnerState;
	segments: Segment[];
	choices: RunnerChoice[];
	/** Set when state === 'death'; app maps this ID to death metadata */
	deathId?: string;
	/** Set when state === 'minigame'; app launches this minigame then calls resumeMinigame() */
	minigame?: MinigameInterrupt;
}

/** Camera / stage effect payload — single or multi-channel */
export interface StageEffectPayload {
	shake?: boolean;      // #shake — screen shake
	flash?: boolean;      // #flash — white flash
	fadeMs?: number;      // #fade:MS — fade duration for next bg/character transition
	camera?: string;      // #camera:zoom_in / zoom_out / pan_left / pan_right / reset
}

/** Callbacks for stage/director events — core fires these, app handles rendering */
export interface StageCallbacks {
	/** Background change requested */
	onBackground?(bg: string): void;
	/** Show a single character sprite (legacy — kept for backward compat) */
	onShowCharacter?(id: string, expr: string | undefined, pos: Position): void;
	/** Show multiple character sprites simultaneously (preferred for multi-character scenes) */
	onShowCharacters?(sprites: SpriteShow[]): void;
	/** Hide a character sprite */
	onHideCharacter?(id: string): void;
	/** Hide multiple character sprites simultaneously */
	onHideCharacters?(ids: string[]): void;
	/** Play/change BGM */
	onBGM?(track: string): void;
	/** Play a one-shot sound effect */
	onSE?(id: string): void;
	/** Stage / camera effects */
	onStageEffect?(effect: StageEffectPayload): void;
	/** Fired when player makes a choice (before the next advance); app uses this for statistics */
	onChoice?(choice: RunnerChoice, index: number): void;
	/** Minigame encountered (convenience — same info also returned in RunnerOutput.minigame) */
	onMinigame?(minigame: MinigameInterrupt): void;
	/** Ink variable changed (fires after the current segment completes) */
	onVarChange?(name: string, oldValue: unknown, newValue: unknown): void;
}

/** Narrative runner interface — pure narrative primitives, no game rules. */
export interface NarrativeRunner {
	/** Advance dialogue until the next choice / death / minigame / end. */
	advance(): RunnerOutput;
	/** Select a choice by index and advance to next pause point. */
	choose(index: number): RunnerOutput;
	/** Resume after a minigame interrupt — writes mg_result and mg_score ink vars, then advances. */
	resumeMinigame(result: number | boolean | string, score?: number): RunnerOutput;
	/** Jump to an ink knot (optionally with a stitch) — useful for death recovery or chapter warp. */
	gotoKnot(knotName: string, stitchName?: string): RunnerOutput;
	/** Serialize current narrative state (ink only, no visual state). */
	snapshot(): string;
	/** Restore from a snapshot produced by snapshot(). */
	restore(snapshot: string): void;
	/** Get the paragraph-start checkpoint snapshot (restoring here + advance replays current paragraph). */
	getCheckpoint(): string;
	/** Restore to the paragraph-start checkpoint. */
	restoreToCheckpoint(): void;
	/** Reset to the beginning of the story. */
	restart(): void;
	/** Read an ink variable value. */
	getVar(name: string): unknown;
	/** Set an ink variable (number | boolean | string). */
	setVar(name: string, value: number | boolean | string): void;
	/** Subscribe to variable changes; returns unsubscribe function. */
	subscribeVar(name: string, cb: (oldValue: unknown, newValue: unknown) => void): () => void;
	/**
	 * 收集当前暂停点的选项（不推进剧情）。
	 * 用于恢复到抉择点快照后重新获取选项列表。
	 * 返回空数组表示当前无选项（可能已结束或在文本中途）。
	 */
	getCurrentChoices(): RunnerChoice[];
}
