// InkRunner — inkjs adapter implementing NarrativeRunner.
// Compiles .ink source (dev) or loads pre-compiled JSON (prod),
// drives the narrative state machine, fires stage callbacks,
// and produces RunnerOutput segments with meta passthrough.

import { Story, Compiler, CompilerOptions } from "inkjs/full";
import type {
	NarrativeRunner,
	RunnerOutput,
	RunnerChoice,
	StageCallbacks,
	Segment,
	TagMeta,
	RunnerState,
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

export class InkRunner implements NarrativeRunner {
	private story: InstanceType<typeof Story>;
	private callbacks: StageCallbacks;
	private onError?: (message: string) => void;

	/** Checkpoint snapshot: saved at story start and after each choice (paragraph start).
	 *  Restoring here + calling advance() replays the current paragraph from the beginning. */
	private checkpointSnapshot: string;

	constructor(options: InkRunnerOptions) {
		this.callbacks = options.callbacks ?? {};
		this.onError = options.onError;

		if (options.precompiled) {
			this.story = new Story(options.source);
		} else {
			const compileErrors: string[] = [];
			try {
				// Create error handler that collects errors and reports via callback
				const errorHandler = (message: string, type: number) => {
					// Only collect actual errors (type=2), not warnings (1) or author messages (0)
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

				// If there were any errors, throw
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
	}

	/**
	 * Advance dialogue until the next choice / death / end.
	 * Fires stage callbacks as it encounters tags.
	 *
	 * inkjs behavior: each Continue() returns one line of text (with trailing \n),
	 * and currentTags corresponds to that specific line. We loop Continue() until
	 * canContinue is false, meaning we've hit a choice, an -> END, or -> DONE.
	 */
	advance(): RunnerOutput {
		const segments: Segment[] = [];
		let deathId: string | undefined;
		const MAX_ITERATIONS = 10000;
		let iterations = 0;

		while (this.story.canContinue && iterations < MAX_ITERATIONS) {
			iterations++;
			const text = this.story.Continue();
			const lineTags = this.story.currentTags ?? [];

			if (text === null) break;

			// Extract and fire stage effects (#bg, #show, #hide, #bgm)
			const { effects, remaining } = extractStageEffects(lineTags);
			this.fireStageEffects(effects);

			// Clean the text (remove trailing newline from inkjs output)
			const cleanText = text.replace(/\n+$/, "").trim();

			// Parse per-line attributes (#speaker, #hint, #death, #correct, etc.)
			const parsed = parseInkLine(cleanText, remaining);

			// Check for death tag
			if (parsed.meta.death) {
				deathId = typeof parsed.meta.death === "string" ? parsed.meta.death : "default";
			}

			// Build segment. Keep meta-only lines (text empty but non-trivial meta, e.g. #actclear)
			// so that the app can react to them; UI layer should skip rendering text-less segments.
			const hasMeta = Object.keys(parsed.meta).length > 0;
			if (parsed.text.length > 0 || hasMeta) {
				segments.push({
					text: parsed.text,
					speaker: parsed.speaker,
					meta: parsed.meta,
				});
			}

			// 遇到 #minigame 标签时立即中断：让引擎暂停在小游戏处，
			// 等玩家完成后再由 completeMinigame() 设置 mg_result 并继续推进。
			// 这样 mg_result 条件分支才能正确评估。
			if (parsed.meta.minigame) {
				break;
			}
		}

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

		// Determine state
		let state: RunnerState;
		if (deathId) {
			state = "death";
		} else if (choices.length > 0) {
			state = "choice";
		} else if (this.story.canContinue) {
			// 因 #minigame 中断时 ink 还有后续内容，不是真正结束
			state = "text";
		} else {
			state = "ended";
		}

		return {
			state,
			segments,
			choices,
			deathId,
		};
	}

	/**
	 * Select a choice by index and advance to the next pause point.
	 * Fires onChoice callback AFTER the choice is registered but BEFORE advancing.
	 */
	choose(index: number): RunnerOutput {
		// Capture choice metadata BEFORE ChooseChoiceIndex (which consumes the choices)
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

		// Save checkpoint AFTER choosing but BEFORE advancing — this is the start
		// of the new paragraph. Restoring here + advance() replays from here.
		this.checkpointSnapshot = this.story.state.ToJson();

		if (runnerChoice && this.callbacks.onChoice) {
			this.callbacks.onChoice(runnerChoice, index);
		}

		return this.advance();
	}

	/** Serialize ink narrative state (only — visual state is app's responsibility) */
	snapshot(): string {
		return this.story.state.ToJson();
	}

	/** Restore ink narrative state from a snapshot */
	restore(snapshot: string): void {
		this.story.state.LoadJson(snapshot);
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
	}

	/** Reset to the beginning of the story */
	restart(): void {
		this.story.ResetState();
		// Reset checkpoint to story beginning
		this.checkpointSnapshot = this.story.state.ToJson();
	}

	/** Read an ink variable */
	getVar(name: string): unknown {
		return this.story.variablesState[name];
	}

	/** Set an ink variable (number | boolean | string) */
	setVar(name: string, value: number | boolean | string): void {
		this.story.variablesState[name] = value;
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
		if (effects.show) {
			this.callbacks.onShowCharacter?.(
				effects.show.id,
				effects.show.expr,
				effects.show.pos,
			);
		}
		if (effects.hide) {
			this.callbacks.onHideCharacter?.(effects.hide);
		}
		if (effects.bgm) {
			this.callbacks.onBGM?.(effects.bgm);
		}
	}
}
