// ShijiInkAdapter — Adapts ink-vn-core's InkRunner (domain-agnostic) to the
// app's IStoryRunner interface, adding Shiji-specific semantics:
//   - Choice/death statistics (_choices, _correct, _deaths, _nodes)
//   - Death registry (deathId → reason/classical/analysis)
//   - Achievement firing via onAchievement callback
//   - Retry-after-death (snapshots choice points)
//   - Save/load that combines ink snapshot + app-level stats

import { InkRunner } from "ink-vn-core";
import type {
	InkRunnerOptions,
	RunnerChoice,
	RunnerOutput,
	StageCallbacks as InkStageCallbacks,
	TagMeta,
} from "ink-vn-core";
import type { IStoryRunner } from "./IStoryRunner";
import type {
	EngineCallbacks,
	StoryChoice,
	StorySegment,
	StoryState,
	Vars,
} from "./types";

/** Death registry entry: maps a deathId (from #death:ID tag) to full death info */
export interface DeathEntry {
	reason: string;
	classical: string;
	analysis: string;
}

/**
 * Configuration for an ink-backed story.
 */
export interface InkStoryConfig {
	/** Unique story key */
	key: string;
	/** Story title */
	title: string;
	/** Ink source code (.ink text) or pre-compiled JSON */
	source: string;
	/** If true, source is pre-compiled JSON; default false (compile at runtime) */
	precompiled?: boolean;
	/** Initial ink variables (VAR declarations in ink take precedence; this is for extra vars) */
	initialVars?: Record<string, number | boolean | string>;
	/** Death registry: maps deathId → DeathEntry (reason/classical/analysis) */
	deaths: Record<string, DeathEntry>;
}

/**
 * ShijiInkAdapter wraps InkRunner and implements IStoryRunner.
 *
 * Usage convention for ink authors:
 *   - #bg:ID, #show:ID[:EXPR][:POS], #hide:ID, #bgm:ID   → stage effects (fired immediately)
 *   - #speaker:NAME                                       → sets speaker on segment
 *   - #hint:TEXT                                          → hint text (shown in UI)
 *   - #correct                                            → marks a choice as historically correct
 *   - #death:ID                                           → triggers death state (ID looks up in deaths registry)
 *   - #achieve:ID                                         → fires onAchievement callback
 *   - #analysis:TEXT, #reason:TEXT, #classical:TEXT       → optional inline death meta (overrides registry)
 *   - Choice tags go BEFORE the choice text:  * #correct [Choice text] -> target
 */
export class ShijiInkAdapter implements IStoryRunner {
	private runner: InkRunner;
	private config: InkStoryConfig;
	private cb: EngineCallbacks;

	// App-level statistics (not part of ink's narrative state)
	private vars: Vars;

	// Snapshot at the latest choice point. Used for retry-after-death.
	private lastChoiceSnapshot: string | null = null;

	constructor(config: InkStoryConfig, cb: EngineCallbacks = {}) {
		this.config = config;
		this.cb = cb;

		// Initialize stats
		this.vars = {
			_choices: 0,
			_correct: 0,
			_deaths: 0,
			_nodes: 0,
		};

		// Apply extra initial vars
		if (config.initialVars) {
			for (const [k, v] of Object.entries(config.initialVars)) {
				if (typeof v === "number" || typeof v === "boolean") {
					this.vars[k] = v;
				}
			}
		}

		// Build ink stage callbacks that bridge to EngineCallbacks
		const inkCallbacks: InkStageCallbacks = {
			onBackground: (bg) => this.cb.onBackground?.(bg),
			onShowCharacter: (id, expr, pos) =>
				this.cb.onShowCharacter?.(id, expr ?? "default", pos),
			onHideCharacter: (id) => this.cb.onHideCharacter?.(id),
			onBGM: (track) => this.cb.onBGM?.(track),
			onChoice: (choice, _index) => {
				// Choice selected → increment stats
				this.vars._choices = (this.vars._choices as number) + 1;
				if (choice.meta.correct) {
					this.vars._correct = (this.vars._correct as number) + 1;
				}
			},
		};

		// Create the underlying ink runner
		const runnerOptions: InkRunnerOptions = {
			source: config.source,
			precompiled: config.precompiled,
			callbacks: inkCallbacks,
		};

		this.runner = new InkRunner(runnerOptions);

		// Sync initial ink variables to our vars
		this.syncInkVarsToStats();
	}

	/** Advance dialogue until the next choice / death / end. */
	advance(): StoryState {
		const output = this.runner.advance();

		// Fire achievements from segment meta
		for (const seg of output.segments) {
			if (seg.meta.achieve && typeof seg.meta.achieve === "string") {
				this.cb.onAchievement?.(seg.meta.achieve);
			}
		}

		// Count a completed node when we hit choices (like legacy runner)
		if (output.choices.length > 0) {
			this.vars._nodes = (this.vars._nodes as number) + 1;
			// Save choice point snapshot for retry-after-death
			this.lastChoiceSnapshot = this.runner.snapshot();
		}

		// Build death info if this is a death state
		let death: StoryState["death"] = null;
		if (output.state === "death" && output.deathId) {
			this.vars._deaths = (this.vars._deaths as number) + 1;

			// Find death info: check inline meta first, then registry
			const deathEntry = this.config.deaths[output.deathId];
			const reason = this.findMetaText(output.segments, "reason") ?? deathEntry?.reason ?? output.deathId;
			const classical = this.findMetaText(output.segments, "classical") ?? deathEntry?.classical ?? "";
			const analysis = this.findMetaText(output.segments, "analysis") ?? deathEntry?.analysis ?? "";

			death = { reason, classical, analysis };
		}

		return this.buildState(output, death, output.state === "ended");
	}

	/** Select a choice by index and advance. */
	choose(index: number): StoryState {
		const output = this.runner.choose(index);

		// Fire achievements
		for (const seg of output.segments) {
			if (seg.meta.achieve && typeof seg.meta.achieve === "string") {
				this.cb.onAchievement?.(seg.meta.achieve);
			}
		}

		// Count node completion
		if (output.choices.length > 0) {
			this.vars._nodes = (this.vars._nodes as number) + 1;
			// Save choice point snapshot for retry-after-death
			this.lastChoiceSnapshot = this.runner.snapshot();
		}

		let death: StoryState["death"] = null;
		if (output.state === "death" && output.deathId) {
			this.vars._deaths = (this.vars._deaths as number) + 1;

			const deathEntry = this.config.deaths[output.deathId];
			const reason = this.findMetaText(output.segments, "reason") ?? deathEntry?.reason ?? output.deathId;
			const classical = this.findMetaText(output.segments, "classical") ?? deathEntry?.classical ?? "";
			const analysis = this.findMetaText(output.segments, "analysis") ?? deathEntry?.analysis ?? "";

			death = { reason, classical, analysis };
		}

		return this.buildState(output, death, output.state === "ended");
	}

	/** Retry after death: restore to the last choice point. */
	retry(): StoryState {
		if (this.lastChoiceSnapshot) {
			this.runner.restore(this.lastChoiceSnapshot);
		}
		return this.advance();
	}

	/** Restart the story from the beginning. */
	restart(): void {
		this.vars = {
			_choices: 0,
			_correct: 0,
			_deaths: 0,
			_nodes: 0,
		};
		if (this.config.initialVars) {
			for (const [k, v] of Object.entries(this.config.initialVars)) {
				if (typeof v === "number" || typeof v === "boolean") {
					this.vars[k] = v;
				}
			}
		}
		this.runner.restart();
		this.lastChoiceSnapshot = null;
		this.syncInkVarsToStats();
	}

	/** Get all current variables (stats + synced ink numeric/bool vars). */
	getVars(): Vars {
		this.syncInkVarsToStats();
		return { ...this.vars };
	}

	/** Get the correct-choice rate (0–1). */
	getChoiceRate(): number {
		const total = this.vars._choices as number;
		return total > 0 ? (this.vars._correct as number) / total : 0;
	}

	/** Get cumulative death count. */
	getDeathCount(): number {
		return this.vars._deaths as number;
	}

	/** Get number of completed choice nodes. */
	getCompletedNodes(): number {
		return this.vars._nodes as number;
	}

	/** Serialize full state for save (checkpoint snapshot + app stats). */
	getSaveState(): string {
		return JSON.stringify({
			// Save checkpoint (paragraph start) so loadSaveState + advance() replays content
			inkSnapshot: this.runner.getCheckpoint(),
			vars: this.vars,
			lastChoiceSnapshot: this.lastChoiceSnapshot,
		});
	}

	/** Restore from a save state string. */
	loadSaveState(json: string): void {
		try {
			const data = JSON.parse(json) as {
				inkSnapshot: string;
				vars: Vars;
				lastChoiceSnapshot: string | null;
			};
			if (data && data.inkSnapshot) {
				// Restore to checkpoint (paragraph start) — advance() will replay the paragraph
				this.runner.restore(data.inkSnapshot);
				this.vars = data.vars;
				this.lastChoiceSnapshot = data.lastChoiceSnapshot ?? null;
			}
		} catch {
			// Corrupted save: ignore, start from beginning
			this.restart();
		}
	}

	// ── Internal helpers ──

	/**
	 * Sync numeric and boolean ink variables into the vars record.
	 * String variables are not synced (Vars only supports number | boolean).
	 */
	private syncInkVarsToStats(): void {
		// inkjs doesn't expose a way to enumerate all variables, so we rely on:
		// 1. initialVars from config
		// 2. Variables set via setVar (which updates both ink and this.vars)
		// For now, this is a no-op placeholder for future variable reflection.
	}

	/**
	 * Search segments (in reverse order) for a meta key and return its string value.
	 * Used to find inline #reason:, #classical:, #analysis: on death lines.
	 */
	private findMetaText(segments: StorySegment[] | RunnerOutput["segments"], key: string): string | undefined {
		for (let i = segments.length - 1; i >= 0; i--) {
			const meta = (segments[i] as { meta?: TagMeta }).meta;
			if (meta && typeof meta[key] === "string") {
				return meta[key] as string;
			}
		}
		return undefined;
	}

	/** Convert ink RunnerOutput to app StoryState. */
	private buildState(
		output: RunnerOutput,
		death: StoryState["death"],
		ended: boolean,
	): StoryState {
		// Convert segments
		const segments: StorySegment[] = output.segments.map((s) => ({
			text: s.text,
			speaker: s.speaker ?? "",
			hint: typeof s.meta.hint === "string" ? s.meta.hint : undefined,
		}));

		// Convert choices (index is assigned by position, matching c._index)
		const choices: StoryChoice[] = output.choices.map((c: RunnerChoice, i: number) => ({
			index: i,
			text: c.text,
			hint: typeof c.meta.hint === "string" ? c.meta.hint : undefined,
		}));

		// Find the latest hint from segments for the top-level hint field
		let hint: string | undefined;
		for (let i = segments.length - 1; i >= 0; i--) {
			if (segments[i].hint) {
				hint = segments[i].hint;
				break;
			}
		}

		return {
			nodeId: this.currentNodeId(output),
			segments,
			choices,
			death,
			ended,
			hint,
			vars: { ...this.vars },
		};
	}

	/**
	 * Derive a human-readable nodeId from the output state.
	 * ink doesn't expose current path easily, so we synthesize one based on state.
	 */
	private currentNodeId(output: RunnerOutput): string {
		if (output.state === "death") return `death:${output.deathId ?? "unknown"}`;
		if (output.state === "ended") return "ending";
		if (output.choices.length > 0) return `choice_${output.choices.length}`;
		return "text";
	}
}
