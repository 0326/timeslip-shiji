// ink-vn-core: Domain-agnostic visual novel narrative engine based on inkjs.
// All types and exports for the core package.

export type {
	TagMeta,
	Segment,
	RunnerChoice,
	RunnerState,
	RunnerOutput,
	StageCallbacks,
	NarrativeRunner,
	Position,
} from "./types";

export { InkRunner, type InkRunnerOptions } from "./inkRunner";
export { parseInkLine, extractStageEffects, type ParsedLine, type StageEffects } from "./tagParser";
