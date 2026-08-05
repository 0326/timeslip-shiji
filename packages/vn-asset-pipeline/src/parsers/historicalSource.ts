import type { Character, Series, Storyline, SceneBackground, Achievement, Minigame, BgmTrack, ClassicChapter } from "vn-content-schemas";

/**
 * Very small front-matter / section parser for raw historical book files.
 *
 * Supported input shape is a single text file with delimited sections:
 *   ## Series
 *   - id: wudi
 *     name: 五帝华夏
 *     ...
 *
 *   ## Characters
 *   - id: shun
 *     name: 舜
 *     ...
 *
 *   ## Storylines
 *   - id: shun-fanlin
 *     title: 焚廪穿井
 *     ...
 *
 * This is deliberately minimal; downstream projects can extend parsers.
 */

const SECTION_RE = /^##\s+(\w+)\s*$/;
const BULLET_RE = /^-\s+(\S+):\s*(.*)$/;
const INDENT_RE = /^\s{2,}(\S+):\s*(.*)$/;

export interface ParsedRaw {
  series: Partial<Series>[];
  characters: Partial<Character>[];
  storylines: Partial<Storyline>[];
  backgrounds: Partial<SceneBackground>[];
  achievements: Partial<Achievement>[];
  minigames: Partial<Minigame>[];
  bgm: Partial<BgmTrack>[];
  classics: Partial<ClassicChapter>[];
  meta: Record<string, string>;
}

export function parseHistoricalSource(text: string): ParsedRaw {
  const out: ParsedRaw = {
    series: [],
    characters: [],
    storylines: [],
    backgrounds: [],
    achievements: [],
    minigames: [],
    bgm: [],
    classics: [],
    meta: {},
  };
  const lines = text.split(/\r?\n/);
  let currentSection: keyof ParsedRaw | "meta" = "meta";
  let current: Record<string, unknown> | null = null;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim()) continue;
    if (line.startsWith("# ")) {
      // # Title of the book
      out.meta.game_name = line.slice(2).trim();
      continue;
    }
    const secMatch = line.match(SECTION_RE);
    if (secMatch) {
      const name = secMatch[1].toLowerCase();
      currentSection = resolveSection(name);
      current = null;
      continue;
    }
    const bulletMatch = line.match(BULLET_RE);
    if (bulletMatch) {
      const key = bulletMatch[1];
      const value = bulletMatch[2];
      current = { [key]: coerce(value) } as Record<string, unknown>;
      pushParsed(out, currentSection, current);
      continue;
    }
    const indentMatch = line.match(INDENT_RE);
    if (indentMatch && current) {
      const key = indentMatch[1];
      const value = indentMatch[2];
      current[key] = coerce(value);
      continue;
    }
  }
  return out;
}

function resolveSection(name: string): keyof ParsedRaw | "meta" {
  switch (name) {
    case "series":
      return "series";
    case "characters":
    case "people":
      return "characters";
    case "storylines":
    case "stories":
      return "storylines";
    case "backgrounds":
    case "scenes":
      return "backgrounds";
    case "achievements":
      return "achievements";
    case "minigames":
      return "minigames";
    case "bgm":
    case "music":
      return "bgm";
    case "classics":
    case "chapters":
      return "classics";
    case "meta":
    default:
      return "meta";
  }
}

function pushParsed(out: ParsedRaw, section: keyof ParsedRaw | "meta", current: Record<string, unknown>): void {
  if (section === "meta") {
    Object.assign(out.meta, current);
    return;
  }
  const arr = out[section] as unknown[];
  arr.push(current);
}

function coerce(v: string): unknown {
  const t = v.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+$/.test(t)) return Number(t);
  if (/^-?\d*\.\d+$/.test(t)) return Number(t);
  if (/^\[.*\]$/.test(t)) {
    try { return JSON.parse(t); } catch { /* fallthrough */ }
  }
  return t;
}
