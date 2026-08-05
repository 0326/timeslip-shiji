// tagParser — Parses ink #tags into stage callbacks and meta passthrough.
//
// Tag taxonomy:
//   A. Stage effects (fired as callbacks before the associated text line displays):
//      #bg:ID, #show:ID[:EXPR][:POS], #show2:ID[:EXPR][:POS], #hide:ID, #bgm:ID, #se:ID
//      #shake, #flash, #fade:MS, #camera:MODE
//   B. Per-segment attributes (attached to the segment they appear on):
//      #speaker:NAME — sets segment.speaker
//      #narration — forces kind = 'narration'
//      #thought   — forces kind = 'thought' (inner monologue)
//      #minigame:ID[:PARAMS] — triggers minigame interrupt (NOT meta; handled in RunnerOutput)
//   C. Meta passthrough (everything else, goes into segment.meta for app to interpret):
//      #hint:TEXT, #correct, #death:ID, #achieve:ID, #classic:REF, #analysis:TEXT, etc.

import type { Position, TagMeta, SpriteShow, StageEffectPayload, MinigameInterrupt, SegmentKind } from "./types";

export interface ParsedLine {
	/** Text with tags stripped */
	text: string;
	/** Speaker from #speaker:NAME, or undefined for narration */
	speaker?: string;
	/** Segment kind derived from #narration / #thought / speaker presence */
	kind: SegmentKind;
	/** Minigame interrupt (if encountered on this line) */
	minigame?: MinigameInterrupt;
	/** All non-stage, non-speaker, non-kind tags as key:value (flag tags → key:true) */
	meta: TagMeta;
}

export interface StageEffects {
	bg?: string;
	/** Single show (legacy). Populated when exactly one #show tag is seen. */
	show?: SpriteShow;
	/** Multi-show. Populated for any #show count (also mirrors `show` when singular). */
	shows?: SpriteShow[];
	hide?: string;
	hides?: string[];
	bgm?: string;
	se?: string;
	effect?: StageEffectPayload;
}

/** Tags that are handled as stage callbacks (not passed through to meta) */
const STAGE_TAG_KEYS = new Set([
	"bg",
	"show",
	"show2",
	"show3",
	"hide",
	"hide2",
	"hide3",
	"bgm",
	"se",
	"shake",
	"flash",
	"fade",
	"camera",
]);

/** Tags that control segment kind — not passed to meta */
const KIND_TAG_KEYS = new Set(["narration", "thought"]);

/** Extra tag keys that are not meta (speaker + minigame) */
const NON_META_KEYS = new Set(["speaker", "minigame"]);

const KNOWN_POSITIONS: Position[] = [
	"left",
	"center-left",
	"center",
	"center-right",
	"right",
	"float",
];

function isPosition(s: string): s is Position {
	return (KNOWN_POSITIONS as string[]).includes(s);
}

/**
 * Parse a #show[:show2][:show3] style value into a SpriteShow descriptor.
 * Accepts: id | id:pos | id:expr | id:expr:pos
 */
function parseSpriteShow(value: string): SpriteShow {
	const parts = value.split(":");
	const id = parts[0];
	let expr: string | undefined;
	let pos: Position = "center";
	if (parts.length >= 3) {
		expr = parts[1];
		pos = isPosition(parts[2]) ? parts[2] : "center";
	} else if (parts.length === 2) {
		if (isPosition(parts[1])) {
			pos = parts[1];
		} else {
			expr = parts[1];
		}
	}
	return { id, expr, pos };
}

/**
 * Parse a single text line and its associated ink tags.
 * - Extracts #speaker:NAME into the `speaker` field
 * - Extracts #narration / #thought into `kind`
 * - Extracts #minigame:id:params into minigame field
 * - All other non-stage tags go into `meta`
 * - Stage tags are NOT handled here — use extractStageEffects for those
 */
export function parseInkLine(text: string, tags: string[]): ParsedLine {
	const meta: TagMeta = {};
	let speaker: string | undefined;
	let minigame: MinigameInterrupt | undefined;
	let explicitKind: SegmentKind | undefined;

	for (const tag of tags) {
		const colon = tag.indexOf(":");
		if (colon === -1) {
			// Flag tag
			if (KIND_TAG_KEYS.has(tag)) {
				explicitKind = tag === "narration" ? "narration" : "thought";
			} else if (!STAGE_TAG_KEYS.has(tag)) {
				meta[tag] = true;
			}
			// Stage flag tags (shake, flash) consumed by extractStageEffects — skip here
		} else {
			const key = tag.slice(0, colon);
			const value = tag.slice(colon + 1);
			if (key === "speaker") {
				speaker = value;
			} else if (key === "minigame") {
				const firstColon = value.indexOf(":");
				if (firstColon === -1) {
					minigame = { id: value };
				} else {
					minigame = {
						id: value.slice(0, firstColon),
						params: value.slice(firstColon + 1),
					};
				}
			} else if (!STAGE_TAG_KEYS.has(key) && !NON_META_KEYS.has(key)) {
				meta[key] = value;
			}
			// Stage tags already extracted by extractStageEffects and fired.
			// speaker + minigame handled above → not in meta.
		}
	}

	// Determine kind: explicit narration/thought tag wins, else speaker → dialogue else narration
	let kind: SegmentKind;
	if (explicitKind) {
		kind = explicitKind;
	} else if (speaker) {
		kind = "dialogue";
	} else {
		kind = "narration";
	}

	return { text: text.trim(), speaker, kind, minigame, meta };
}

/**
 * Extract stage effects from a set of ink tags.
 * Returns the effects to fire as callbacks, plus the remaining (non-stage) tags
 * that should be passed to parseInkLine for per-segment attribute extraction.
 */
export function extractStageEffects(tags: string[]): {
	effects: StageEffects;
	remaining: string[];
} {
	const effects: StageEffects = {};
	const effectPayload: StageEffectPayload = {};
	const shows: SpriteShow[] = [];
	const hides: string[] = [];
	const remaining: string[] = [];

	for (const tag of tags) {
		const colon = tag.indexOf(":");
		if (colon === -1) {
			// Flag stage tags: #shake, #flash
			switch (tag) {
				case "shake":
					effectPayload.shake = true;
					break;
				case "flash":
					effectPayload.flash = true;
					break;
				default:
					remaining.push(tag);
			}
			continue;
		}
		const key = tag.slice(0, colon);
		const value = tag.slice(colon + 1);

		switch (key) {
			case "bg":
				effects.bg = value;
				break;
			case "bgm":
				effects.bgm = value;
				break;
			case "se":
				effects.se = value;
				break;
			case "fade": {
				const ms = Number(value);
				if (!Number.isNaN(ms)) effectPayload.fadeMs = ms;
				break;
			}
			case "camera":
				effectPayload.camera = value;
				break;
			case "hide":
			case "hide2":
			case "hide3":
				hides.push(value);
				break;
			case "show":
			case "show2":
			case "show3":
				shows.push(parseSpriteShow(value));
				break;
			default:
				// Not a stage effect → pass through remaining for parseInkLine
				// (speaker, narration, thought, hint, death, correct, achieve, minigame, etc.)
				remaining.push(tag);
		}
	}

	// Flatten shows / hides
	if (shows.length === 1) {
		effects.show = shows[0];
	}
	if (shows.length > 0) {
		effects.shows = shows;
	}
	if (hides.length === 1) {
		effects.hide = hides[0];
	}
	if (hides.length > 0) {
		effects.hides = hides;
	}
	if (
		effectPayload.shake ||
		effectPayload.flash ||
		effectPayload.fadeMs !== undefined ||
		effectPayload.camera
	) {
		effects.effect = effectPayload;
	}

	return { effects, remaining };
}
