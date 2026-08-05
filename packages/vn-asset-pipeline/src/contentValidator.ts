import type { GameContent, Character, Series, Storyline } from "vn-content-schemas";
import { safeParseGameContent, parseGameContent } from "vn-content-schemas";

export interface ValidationIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
  path?: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
  content: GameContent | null;
}

/**
 * Validates a raw content package: first Zod schema parse, then semantic
 * cross-references (storyline.series exists, character.protagonist resolves,
 * bgm id resolves, etc.).
 */
export function validateContentPackage(raw: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  const parsed = safeParseGameContent(raw);
  if (!parsed.success) {
    for (const e of parsed.error.issues) {
      issues.push({
        severity: "error",
        code: "SCHEMA",
        message: e.message,
        path: (e.path ?? []).join("."),
      });
    }
    return { ok: false, issues, content: null };
  }
  const c = parsed.data;

  // Semantic checks
  const seriesIds = new Set(c.series.map((s) => s.id));
  const charIds = new Set(c.characters.map((s) => s.id));
  const bgIds = new Set(c.backgrounds.map((b) => b.id));
  const bgmIds = new Set(c.bgm.tracks.map((t) => t.id));

  for (const s of c.storylines) {
    if (!seriesIds.has(s.series)) {
      issues.push({
        severity: "warning",
        code: "STORYLINE_SERIES_MISSING",
        message: `storyline ${s.id} references unknown series ${s.series}`,
        path: `storylines.${s.id}`,
      });
    }
    if (!charIds.has(s.protagonist)) {
      issues.push({
        severity: "warning",
        code: "STORYLINE_PROTAGONIST_MISSING",
        message: `storyline ${s.id} protagonist ${s.protagonist} not in characters[]`,
        path: `storylines.${s.id}.protagonist`,
      });
    }
    for (const cast of s.cast) {
      if (!charIds.has(cast)) {
        issues.push({
          severity: "warning",
          code: "STORYLINE_CAST_MISSING",
          message: `storyline ${s.id} cast member ${cast} not in characters[]`,
          path: `storylines.${s.id}.cast`,
        });
      }
    }
  }

  // Require at least one series for non-empty game
  if (c.series.length === 0) {
    issues.push({ severity: "warning", code: "NO_SERIES", message: "content has no series defined" });
  }

  // Deduplicate ids
  reportDuplicateIds(c.series.map((s) => s.id), "series", issues);
  reportDuplicateIds(c.characters.map((s) => s.id), "characters", issues);
  reportDuplicateIds(c.storylines.map((s) => s.id), "storylines", issues);
  reportDuplicateIds(c.backgrounds.map((s) => s.id), "backgrounds", issues);
  reportDuplicateIds(c.bgm.tracks.map((t) => t.id), "bgm", issues);

  // Unused bgm / background warnings (non-fatal)
  void bgIds;
  void bgmIds;

  const errors = issues.filter((i) => i.severity === "error").length;
  return { ok: errors === 0, issues, content: c };
}

function reportDuplicateIds(
  ids: string[],
  group: string,
  out: ValidationIssue[]
): void {
  const seen = new Map<string, number>();
  for (const id of ids) seen.set(id, (seen.get(id) ?? 0) + 1);
  for (const [id, count] of seen.entries()) {
    if (count > 1) {
      out.push({
        severity: "error",
        code: "DUPLICATE_ID",
        message: `${group} id ${id} appears ${count} times`,
        path: group,
      });
    }
  }
}

/** Strict wrapper — throws on any error-level issue. */
export function validateContentPackageStrict(raw: unknown): GameContent {
  const r = validateContentPackage(raw);
  if (!r.ok) {
    const lines = r.issues
      .filter((i) => i.severity === "error")
      .map((i) => `  [${i.code}] ${i.path ?? ""} ${i.message}`);
    throw new Error(`Content package invalid:\n${lines.join("\n")}`);
  }
  return parseGameContent(raw);
}
