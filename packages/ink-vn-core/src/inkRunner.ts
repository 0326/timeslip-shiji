// InkRunner — inkjs adapter implementing NarrativeRunner.
// Compiles .ink source (dev) or loads pre-compiled JSON (prod),
// drives the narrative state machine, fires stage callbacks,
// and produces RunnerOutput segments with meta passthrough.
//
// Extended capabilities (v0.2):
//   - Multi-character stage shows (#show/#show2/#show3 → onShowCharacters)
//   - Stage effects (#shake / #flash / #fade / #camera → onStageEffect)
//   - Sound effects (#se → onSE)
//   - Segment kind (dialogue / narration / thought via #narration, #thought)
//   - Minigame interrupts (#minigame:id:params → state='minigame') + resumeMinigame()
//   - Knot jump API: gotoKnot(knot, stitch?)
//   - Variable subscriptions: subscribeVar() + onVarChange callback
//   - Paragraph checkpoint: getCheckpoint() / restoreToCheckpoint()

import { Story, Compiler, CompilerOptions } from "inkjs/full";
import type {
	NarrativeRunner,
	RunnerOutput,
	RunnerChoice,
	StageCallbacks,
	Segment,
	TagMeta,
	RunnerState,
	SpriteShow,
	MinigameInterrupt,
} from "./types";
import { parseInkLine, extractStageEffects } from "./tagParser";

// ErrorType enum values from inkjs (not exported from main entry):
// 0 = Author, 1 = Warning, 2 = Error
const INK_ERROR_TYPE_ERROR = 2;

export interface InkRunnerOptions {
	/** Ink source code (for dev: ?raw import) or pre-compiled JSON string */
	source: string;
	/** If true, source is pre-compiled JSON; if false, source is .ink text to compile at runtime */
	precompiled?: boolean;
	/** Stage callbacks for visual/audio events */
	callbacks?: StageCallbacks;
	/** Called on compilation error with formatted message including line info */
	onError?: (message: string) => void;
}

type VarSubscriber = (oldValue: unknown, newValue: unknown) => void;

export class InkRunner implements NarrativeRunner {
	private story: InstanceType<typeof Story>;
	private callbacks: StageCallbacks;
	private onError?: (message: string) => void;

	/** Checkpoint snapshot: saved at story start and after each choice (paragraph start).
	 *  Restoring here + calling advance() replays the current paragraph from the beginning. */
	private checkpointSnapshot: string;

	/** Variable subscribers: name → Set of callbacks */
	private varSubscribers = new Map<string, Set<VarSubscriber>>();

	/** Last-seen variable values snapshot (for diff & subscriber firing) */
	private lastVarSnapshot = new Map<string, unknown>();

	constructor(options: InkRunnerOptions) {
		this.callbacks = options.callbacks ?? {};
		this.onError = options.onError;

		if (options.precompiled) {
			this.story = new Story(options.source);
		} else {
			const compileErrors: string[] = [];
			try {
				const errorHandler = (message: string, type: number) => {
					if (type === INK_ERROR_TYPE_ERROR) {
						compileErrors.push(message);
					}
					this.onError?.(`[ink compile] ${message}`);
				};

				const compilerOptions = new CompilerOptions(
					null,           // sourceFilename
					[],             // pluginNames
					false,          // countAllVisits
					errorHandler,   // errorHandler
					null            // fileHandler
				);

				const compiler = new Compiler(options.source, compilerOptions);
				this.story = compiler.Compile();

				if (compileErrors.length > 0) {
					throw new Error(`Ink compilation failed:\n${compileErrors.join("\n")}`);
				}
			} catch (err: unknown) {
				if (err instanceof Error && err.message.startsWith("Ink compilation failed:")) {
					throw err;
				}
				const msg = err instanceof Error ? err.message : String(err);
				this.onError?.(`[ink compile] ${msg}`);
				throw new Error(`Ink compilation failed: ${msg}`);
			}
		}

		// Save initial checkpoint (story beginning)
		this.checkpointSnapshot = this.story.state.ToJson();
		// Snapshot initial variable values
		this.snapshotVars();
	}

	/**
	 * Advance dialogue until the next choice / death / minigame / end.
	 * Fires stage callbacks as it encounters tags.
	 */
	advance(): RunnerOutput {
		return this.runUntilPause();
	}

	/**
	 * Select a choice by index and advance to the next pause point.
	 * Fires onChoice callback AFTER the choice is registered but BEFORE advancing.
	 */
	choose(index: number): RunnerOutput {
		const choices = this.story.currentChoices;
		const chosenChoice = choices[index];
		let runnerChoice: RunnerChoice | undefined;

		if (chosenChoice) {
			const meta = this.tagsToMeta(chosenChoice.tags ?? []);
			runnerChoice = {
				text: chosenChoice.text,
				meta,
				_index: chosenChoice.index,
			};
		}

		this.story.ChooseChoiceIndex(index);

		// Save checkpoint AFTER choosing but BEFORE advancing — start of new paragraph
		this.checkpointSnapshot = this.story.state.ToJson();

		if (runnerChoice && this.callbacks.onChoice) {
			this.callbacks.onChoice(runnerChoice, index);
		}

		return this.runUntilPause();
	}

	/**
	 * Resume after a minigame interrupt.
	 * Writes ink vars `mg_result` (always) and `mg_score` (optional if provided/number).
	 * Then advances the narrative to the next pause point.
	 */
	resumeMinigame(result: number | boolean | string, score?: number): RunnerOutput {
		this.story.variablesState["mg_result"] = result;
		if (score !== undefined) {
			this.story.variablesState["mg_score"] = score;
		}
		this.flushVarSubscribers();
		return this.runUntilPause();
	}

	/**
	 * Jump to an ink knot (optionally with a stitch) and advance to the next pause point.
	 * Useful for death recovery screens or chapter warping.
	 */
	gotoKnot(knotName: string, stitchName?: string): RunnerOutput {
		const target = stitchName ? `${knotName}.${stitchName}` : knotName;
		this.story.ChoosePathString(target);
		// Reset paragraph checkpoint at the new knot
		this.checkpointSnapshot = this.story.state.ToJson();
		return this.runUntilPause();
	}

	/** Serialize ink narrative state (only — visual state is app's responsibility) */
	snapshot(): string {
		return this.story.state.ToJson();
	}

	/** Restore ink narrative state from a snapshot */
	restore(snapshot: string): void {
		this.story.state.LoadJson(snapshot);
		this.snapshotVars();
	}

	/** 收集当前暂停点的选项（不推进剧情） */
	getCurrentChoices(): RunnerChoice[] {
		const choices: RunnerChoice[] = [];
		for (let i = 0; i < this.story.currentChoices.length; i++) {
			const c = this.story.currentChoices[i];
			const choiceTags = c.tags ?? [];
			const meta: TagMeta = this.tagsToMeta(choiceTags);
			choices.push({
				text: c.text,
				meta,
				_index: c.index,
			});
		}
		return choices;
	}

	/** Get the checkpoint snapshot (paragraph start — restoring here replays content) */
	getCheckpoint(): string {
		return this.checkpointSnapshot;
	}

	/** Restore to the checkpoint snapshot (paragraph start) */
	restoreToCheckpoint(): void {
		this.story.state.LoadJson(this.checkpointSnapshot);
		this.snapshotVars();
	}

	/** Reset to the beginning of the story */
	restart(): void {
		this.story.ResetState();
		this.checkpointSnapshot = this.story.state.ToJson();
		this.snapshotVars();
	}

	/** Read an ink variable */
	getVar(name: string): unknown {
		return this.story.variablesState[name];
	}

	/** Set an ink variable (number | boolean | string) */
	setVar(name: string, value: number | boolean | string): void {
		const oldValue = this.story.variablesState[name];
		this.story.variablesState[name] = value;
		this.notifyVar(name, oldValue, value);
	}

	/**
	 * Subscribe to an ink variable change.
	 * Subscribers fire AFTER the current segment / choice / gotoKnot / resumeMinigame completes.
	 * Returns an unsubscribe function.
	 */
	subscribeVar(name: string, cb: VarSubscriber): () => void {
		let subs = this.varSubscribers.get(name);
		if (!subs) {
			subs = new Set();
			this.varSubscribers.set(name, subs);
		}
		subs.add(cb);
		return () => {
			subs!.delete(cb);
			if (subs!.size === 0) {
				this.varSubscribers.delete(name);
			}
		};
	}

	// ── Internal: main advance loop ──

	private runUntilPause(): RunnerOutput {
		const segments: Segment[] = [];
		let deathId: string | undefined;
		let minigame: MinigameInterrupt | undefined;
		const MAX_ITERATIONS = 10000;
		let iterations = 0;

		while (this.story.canContinue && iterations < MAX_ITERATIONS) {
			iterations++;
			const text = this.story.Continue();
			const lineTags = this.story.currentTags ?? [];

			if (text === null) break;

			// Extract and fire stage effects (#bg, #show/#show2/#show3, #hide, #bgm, #se, #shake/#flash/#fade/#camera)
			const { effects, remaining } = extractStageEffects(lineTags);
			this.fireStageEffects(effects);

			// Clean the text (remove trailing newline from inkjs output)
			const cleanText = text.replace(/\n+$/, "").trim();

			// Parse per-line attributes (#speaker, #narration, #thought, #minigame, #hint, #death, etc.)
			const parsed = parseInkLine(cleanText, remaining);

			// Handle death tag
			if (parsed.meta.death) {
				deathId = typeof parsed.meta.death === "string" ? parsed.meta.death : "default";
			}

			// Handle minigame interrupt — capture first one and break after collecting current batch
			if (parsed.minigame && !minigame) {
				minigame = parsed.minigame;
			}

			// Build segment. Keep meta-only lines (text empty but non-trivial meta, e.g. #actclear)
			// so that the app can react to them; UI layer should skip rendering text-less segments.
			const hasMeta = Object.keys(parsed.meta).length > 0;
			if (parsed.text.length > 0 || hasMeta) {
				segments.push({
					text: parsed.text,
					speaker: parsed.speaker,
					kind: parsed.kind,
					meta: parsed.meta,
				});
			}

			// If minigame interrupt encountered, stop advance here and return minigame state.
			// Ink's current position is still correct; resumeMinigame will continue from here.
			if (minigame) {
				break;
			}
		}

		// Diff variables and fire subscribers
		this.flushVarSubscribers();

		// Collect choices
		const choices: RunnerChoice[] = [];
		for (let i = 0; i < this.story.currentChoices.length; i++) {
			const c = this.story.currentChoices[i];
			const choiceTags = c.tags ?? [];
			const meta: TagMeta = this.tagsToMeta(choiceTags);
			choices.push({
				text: c.text,
				meta,
				_index: c.index,
			});
		}

		// Determine state: death > minigame > choice > ended
		let state: RunnerState;
		if (deathId) {
			state = "death";
		} else if (minigame) {
			state = "minigame";
			// Convenience callback
			if (this.callbacks.onMinigame) {
				this.callbacks.onMinigame(minigame);
			}
		} else if (choices.length > 0) {
			state = "choice";
		} else {
			state = "ended";
		}

		const output: RunnerOutput = {
			state,
			segments,
			choices,
		};
		if (deathId) output.deathId = deathId;
		if (minigame) output.minigame = minigame;
		return output;
	}

	// ── Internal helpers ──

	private tagsToMeta(tags: string[]): TagMeta {
		const meta: TagMeta = {};
		for (const tag of tags) {
			const colon = tag.indexOf(":");
			if (colon === -1) {
				meta[tag] = true;
			} else {
				meta[tag.slice(0, colon)] = tag.slice(colon + 1);
			}
		}
		return meta;
	}

	private fireStageEffects(effects: ReturnType<typeof extractStageEffects>["effects"]): void {
		if (effects.bg) {
			this.callbacks.onBackground?.(effects.bg);
		}
		if (effects.shows) {
			// Prefer multi-character callback when available
			if (this.callbacks.onShowCharacters) {
				this.callbacks.onShowCharacters(effects.shows);
			} else if (this.callbacks.onShowCharacter && effects.show) {
				// Fallback: if multi callback not provided, fire single callback for each
				for (const s of effects.shows) {
					this.callbacks.onShowCharacter(s.id, s.expr, s.pos);
				}
			}
		} else if (effects.show && this.callbacks.onShowCharacter) {
			this.callbacks.onShowCharacter(effects.show.id, effects.show.expr, effects.show.pos);
		}
		if (effects.hides) {
			if (this.callbacks.onHideCharacters) {
				this.callbacks.onHideCharacters(effects.hides);
			} else if (this.callbacks.onHideCharacter) {
				for (const id of effects.hides) {
					this.callbacks.onHideCharacter(id);
				}
			}
		} else if (effects.hide && this.callbacks.onHideCharacter) {
			this.callbacks.onHideCharacter(effects.hide);
		}
		if (effects.bgm) {
			this.callbacks.onBGM?.(effects.bgm);
		}
		if (effects.se) {
			this.callbacks.onSE?.(effects.se);
		}
		if (effects.effect) {
			this.callbacks.onStageEffect?.(effects.effect);
		}
	}

	// ── Variable subscription internals ──

	private snapshotVars(): void {
		this.lastVarSnapshot.clear();
		const variablesState = this.story.variablesState as Record<string, unknown>;
		for (const key of Object.keys(variablesState)) {
			this.lastVarSnapshot.set(key, variablesState[key]);
		}
	}

	private flushVarSubscribers(): void {
		const variablesState = this.story.variablesState as Record<string, unknown>;
		const allKeys = new Set<string>([
			...this.lastVarSnapshot.keys(),
			...Object.keys(variablesState),
			...this.varSubscribers.keys(),
		]);
		for (const key of allKeys) {
			const oldValue = this.lastVarSnapshot.get(key);
			const newValue = variablesState[key];
			// Skip non-subscribed vars that didn't change (performance)
			const subs = this.varSubscribers.get(key);
			const changed = oldValue !== newValue;
			if (changed) {
				this.notifyVar(key, oldValue, newValue);
				this.lastVarSnapshot.set(key, newValue);
			}
			// Silence unused-vars for `subs`; notifyVar handles subscribers,
			// but we still need to notify subscribers even if only they watch (even for same-value sets
			// via setVar), which flushVarSubscribers won't handle (no snapshot diff).
			void subs;
		}
	}

	private notifyVar(name: string, oldValue: unknown, newValue: unknown): void {
		if (oldValue === newValue) return;
		// Callback
		this.callbacks.onVarChange?.(name, oldValue, newValue);
		// Subscribers
		const subs = this.varSubscribers.get(name);
		if (subs) {
			for (const cb of subs) {
				try {
					cb(oldValue, newValue);
				} catch {
					// swallow subscriber errors to not break the engine
				}
			}
		}
	}
}

// Re-export SpriteShow (useful for consumers)
export type { SpriteShow };
