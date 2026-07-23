// tagParser — Parses ink #tags into stage callbacks and meta passthrough.
//
// Tag taxonomy:
//   A. Stage effects (fired as callbacks before the associated text line displays):
//      #bg:ID, #show:ID[:EXPR][:POS], #hide:ID, #bgm:ID
//   B. Per-segment attributes (attached to the segment they appear on):
//      #speaker:NAME — sets segment.speaker
//   C. Meta passthrough (everything else, goes into segment.meta for app to interpret):
//      #hint:TEXT, #correct, #death:ID, #achieve:ID, #narration, #analysis:TEXT, etc.

import type { Position, TagMeta } from "./types";

export interface ParsedLine {
	/** Text with tags stripped */
	text: string;
	/** Speaker from #speaker:NAME, or undefined for narration */
	speaker?: string;
	/** All non-stage, non-speaker tags as key:value (flag tags → key:true) */
	meta: TagMeta;
}

export interface StageEffects {
	bg?: string;
	show?: { id: string; expr?: string; pos: Position };
	hide?: string;
	bgm?: string;
}

/** Tags that are handled as stage callbacks (not passed through to meta) */
const STAGE_TAG_KEYS = new Set(["bg", "show", "hide", "bgm"]);

/**
 * Parse a single text line and its associated ink tags.
 * - Extracts #speaker:NAME into the `speaker` field
 * - All other non-stage tags go into `meta`
 * - Stage tags are NOT handled here — use extractStageEffects for those
 */
export function parseInkLine(text: string, tags: string[]): ParsedLine {
	const meta: TagMeta = {};
	let speaker: string | undefined;

	for (const tag of tags) {
		const colon = tag.indexOf(":");
		if (colon === -1) {
			// Flag tag: #correct → meta.correct = true
			meta[tag] = true;
		} else {
			const key = tag.slice(0, colon);
			const value = tag.slice(colon + 1);
			if (key === "speaker") {
				speaker = value;
			} else if (!STAGE_TAG_KEYS.has(key)) {
				meta[key] = value;
			}
			// Stage tags (bg/show/hide/bgm) are silently consumed here —
			// they were already extracted by extractStageEffects and fired.
		}
	}

	return { text: text.trim(), speaker, meta };
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
	const remaining: string[] = [];

	for (const tag of tags) {
		const colon = tag.indexOf(":");
		if (colon === -1) {
			// Flag tags are never stage effects
			remaining.push(tag);
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
			case "hide":
				effects.hide = value;
				break;
			case "show": {
				// #show:id:expr:pos  or  #show:id:pos  or  #show:id
				const parts = value.split(":");
				const id = parts[0];
				let expr: string | undefined;
				let pos: Position = "center";
				if (parts.length >= 3) {
					expr = parts[1];
					pos = (parts[2] as Position) || "center";
				} else if (parts.length === 2) {
					// Distinguish position from expression
					if (parts[1] === "left" || parts[1] === "center" || parts[1] === "right") {
						pos = parts[1] as Position;
					} else {
						expr = parts[1];
					}
				}
				effects.show = { id, expr, pos };
				break;
			}
			default:
				// Not a stage effect: pass through to remaining for parseInkLine
				// (speaker, hint, death, correct, achieve, etc.)
				remaining.push(tag);
		}
	}

	return { effects, remaining };
}
