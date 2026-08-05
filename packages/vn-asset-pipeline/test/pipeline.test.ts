import { describe, it, expect } from "vitest";
import { validateContentPackage, parseHistoricalSource, generateInkScaffold, buildAssetManifest, findMissingAssets } from "../src";
import type { GameContent } from "vn-content-schemas";

const SAMPLE_CONTENT: GameContent = {
  schema_version: "1.0.0",
  game_name: "Test",
  default_theme: "inkWash",
  default_language: "zh-CN",
  series: [{ id: "wudi", name: "五帝", era: "wudi", order: 1 }],
  characters: [{ id: "shun", name: "舜", era: "wudi", order: 1, dynasty_order: 1 }],
  storylines: [{
    id: "shun-fanlin", series: "wudi", title: "焚廪穿井",
    protagonist: "shun", ink_path: "shun-fanlin.ink",
  }],
  backgrounds: [{ id: "lin_shed", series: "wudi", path: "bgs/lin_shed.webp" }],
  classics: { name: "典籍", chapters: [] },
  achievements: [],
  minigames: [],
  bgm: { tracks: [{ id: "epic_wudi", path: "bgm/wudi.mp3" }] },
};

describe("vn-asset-pipeline", () => {
  it("validateContentPackage ok on valid", () => {
    const r = validateContentPackage(SAMPLE_CONTENT);
    expect(r.ok).toBe(true);
    expect(r.issues.filter(i => i.severity === "error")).toHaveLength(0);
  });

  it("warns on unknown series reference", () => {
    const bad: GameContent = {
      ...SAMPLE_CONTENT,
      storylines: [{
        id: "bad", series: "nonexistent", title: "x",
        protagonist: "shun", ink_path: "x.ink",
      }],
    };
    const r = validateContentPackage(bad);
    expect(r.issues.some(i => i.code === "STORYLINE_SERIES_MISSING")).toBe(true);
  });

  it("parseHistoricalSource reads sections", () => {
    const text = `# 史记·五帝本纪

## Series
- id: wudi
  name: 五帝华夏
  tagline: 涿鹿风云
  era: wudi
  order: 1

## Characters
- id: shun
  name: 舜
  era: wudi
  dynasty_order: 1
  order: 1
`;
    const p = parseHistoricalSource(text);
    expect(p.meta.game_name).toBe("史记·五帝本纪");
    expect(p.series[0].id).toBe("wudi");
    expect(p.characters[0].id).toBe("shun");
    expect(p.characters[0].dynasty_order).toBe(1);
  });

  it("generateInkScaffold uses tag convention", () => {
    const out = generateInkScaffold({
      storyline: SAMPLE_CONTENT.storylines[0],
      series: SAMPLE_CONTENT.series[0],
      characters: SAMPLE_CONTENT.characters,
      scenes: ["start", "end"],
    });
    expect(out).toContain("=== shun-fanlin ===");
    expect(out).toContain("#bg:wudi_palace");
    expect(out).toContain("#show:shun:neutral:left");
    expect(out).toContain("-> DONE");
  });

  it("assetManifest + findMissingAssets", () => {
    const m = buildAssetManifest(SAMPLE_CONTENT);
    expect(m.entries.some(e => e.kind === "bg" && e.id === "lin_shed")).toBe(true);
    const missing = findMissingAssets(m, (p) => !p.startsWith("bgs/"));
    expect(missing.some(e => e.kind === "bg")).toBe(true);
  });
});
