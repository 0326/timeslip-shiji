import type { GameContent, Classic } from "vn-content-schemas";
import { generateInkScaffold, type InkScaffoldOptions } from "./generators/inkScaffold";
import { parseHistoricalSource, type ParsedRaw } from "./parsers/historicalSource";
import { validateContentPackageStrict, type ValidationResult } from "./contentValidator";

/** Read interface abstraction — both CLI and runtime adapters implement this. */
export interface FileReader {
  readText(path: string): Promise<string>;
  readBinary(path: string): Promise<Uint8Array>;
  listDir(path: string): Promise<string[]>;
  exists(path: string): Promise<boolean>;
}

export interface FileWriter {
  writeText(path: string, text: string): Promise<void>;
  writeBinary(path: string, data: Uint8Array): Promise<void>;
  ensureDir(path: string): Promise<void>;
}

export interface BuildContentOptions {
  /** Output root directory. */
  outDir: string;
  /** Source .book.md / .txt / .json content. */
  sourceText?: string;
  /** Alternatively, a pre-assembled GameContent JSON object. */
  sourceContent?: Partial<GameContent>;
  /** Generate Ink scaffolds for every storyline automatically. */
  generateInkScaffolds?: boolean;
  /** Override ink scaffold options per storyline id. */
  scaffoldOverrides?: Record<string, Partial<InkScaffoldOptions>>;
}

export interface BuildContentOutput {
  contentPath: string;
  content: GameContent;
  generatedInkFiles: Array<{ path: string; storylineId: string }>;
  validation: ValidationResult | null;
}

/**
 * High-level build: parse source → assemble GameContent → validate → write to
 * outDir. If sourceContent is already a valid GameContent, skip parsing.
 */
export async function buildContentPackage(
  reader: FileReader,
  writer: FileWriter,
  opts: BuildContentOptions
): Promise<BuildContentOutput> {
  let raw: Partial<GameContent>;
  let parsed: ParsedRaw | null = null;

  if (opts.sourceContent) {
    raw = opts.sourceContent;
  } else if (opts.sourceText) {
    parsed = parseHistoricalSource(opts.sourceText);
    // 将 parsed.classics（章节列表）按 series_id 分组成 Classic 对象数组
    const classicsFromParsed: Classic[] = Array.isArray(parsed.classics)
      ? groupChaptersToClassics(parsed.classics as Array<Record<string, unknown>>)
      : [];

    raw = {
      game_name: parsed.meta.game_name ?? "Historical VN",
      series: parsed.series as GameContent["series"],
      characters: parsed.characters as GameContent["characters"],
      storylines: parsed.storylines as GameContent["storylines"],
      backgrounds: parsed.backgrounds as GameContent["backgrounds"],
      achievements: parsed.achievements as GameContent["achievements"],
      minigames: parsed.minigames as GameContent["minigames"],
      bgm: { tracks: parsed.bgm as GameContent["bgm"]["tracks"] },
      classics: classicsFromParsed,
      ...Object.fromEntries(
        Object.entries(parsed.meta).filter(([k]) =>
          ["schema_version", "default_theme", "default_language"].includes(k)
        )
      ),
    };
  } else {
    throw new Error("buildContentPackage requires sourceText or sourceContent");
  }

  const content = validateContentPackageStrict(raw);
  const contentJSON = JSON.stringify(content, null, 2);
  const contentPath = `${opts.outDir}/content.json`;
  await writer.ensureDir(opts.outDir);
  await writer.writeText(contentPath, contentJSON);

  const generatedInkFiles: Array<{ path: string; storylineId: string }> = [];
  if (opts.generateInkScaffolds) {
    const inkDir = `${opts.outDir}/ink`;
    await writer.ensureDir(inkDir);
    for (const sl of content.storylines) {
      const seriesObj = content.series.find((s) => s.id === sl.series) ?? {
        id: sl.series, name: sl.series, era: "", order: 0,
      };
      const baseOpts: InkScaffoldOptions = {
        storyline: sl,
        series: seriesObj,
        characters: content.characters,
        includeMinigameExample: content.minigames.length > 0,
        includeDeathExample: true,
      };
      const merged = { ...baseOpts, ...(opts.scaffoldOverrides?.[sl.id] ?? {}) };
      const source = generateInkScaffold(merged);
      const p = `${inkDir}/${sl.id}.ink`;
      await writer.writeText(p, source);
      generatedInkFiles.push({ path: p, storylineId: sl.id });
    }
  }

  void reader;
  void parsed;
  return {
    contentPath,
    content,
    generatedInkFiles,
    validation: null,
  };
}

/** 辅助：将章节列表按 classic_id/series_id 聚合成 Classic[] 格式。 */
function groupChaptersToClassics(chapters: Array<Record<string, unknown>>): Classic[] {
  const map = new Map<string, Classic>();
  for (const ch of chapters) {
    const cid = (ch.classic_id as string) ?? `classic_${map.size + 1}`;
    if (!map.has(cid)) {
      map.set(cid, {
        id: cid,
        series_id: (ch.series_id as string) ?? "",
        name: (ch.classic_name as string) ?? cid,
        description: (ch.classic_description as string) ?? "",
        author: ch.classic_author as string | undefined,
        dynasty: ch.classic_dynasty as string | undefined,
        chapters: [],
        order: typeof ch.classic_order === "number" ? ch.classic_order : 0,
      });
    }
    const classic = map.get(cid)!;
    classic.chapters.push({
      id: (ch.id as string) ?? `${cid}_${classic.chapters.length + 1}`,
      chapter: (ch.chapter as string) ?? "",
      section: (ch.section as string) ?? "",
      title: (ch.title as string) ?? "",
      classical_text: (ch.classical_text as string) ?? "",
      vernacular_text: ch.vernacular_text as string | undefined,
      source: (ch.source as string) ?? "",
      order: typeof ch.order === "number" ? ch.order : classic.chapters.length,
    });
  }
  for (const c of map.values()) c.chapters.sort((a, b) => a.order - b.order);
  return Array.from(map.values()).sort((a, b) => a.order - b.order);
}

export { validateContentPackageStrict, validateContentPackage } from "./contentValidator";
export { parseHistoricalSource } from "./parsers/historicalSource";
export { generateInkScaffold } from "./generators/inkScaffold";
export type { ValidationResult, ValidationIssue } from "./contentValidator";
