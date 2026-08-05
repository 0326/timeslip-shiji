import { describe, it, expect } from "vitest";
import {
  CharacterSchema,
  SeriesSchema,
  GameContentSchema,
  StorylineSchema,
} from "../src";

describe("schemas smoke test", () => {
  it("accepts minimal character", () => {
    const c = CharacterSchema.parse({
      id: "shun",
      name: "舜",
      era: "wudi",
      order: 1,
      dynasty_order: 1,
    });
    expect(c.id).toBe("shun");
    expect(c.assets.variants).toEqual([]);
  });

  it("rejects character without required id", () => {
    const r = CharacterSchema.safeParse({
      name: "舜",
      era: "wudi",
      order: 1,
      dynasty_order: 1,
    });
    expect(r.success).toBe(false);
  });

  it("accepts series with defaults", () => {
    const s = SeriesSchema.parse({
      id: "wudi",
      name: "五帝华夏",
      tagline: "涿鹿风云",
      era: "wudi",
      order: 1,
    });
    expect(s.accent).toBe("#c9a84c");
    expect(s.coming_soon).toBe(false);
  });

  it("accepts empty GameContent and fills schema_version default", () => {
    const g = GameContentSchema.parse({ game_name: "Test VN" });
    expect(g.schema_version).toBe("1.0.0");
    expect(g.series).toEqual([]);
    expect(g.characters).toEqual([]);
    expect(g.classics.chapters).toEqual([]);
  });

  it("storyline mode defaults to official (正史)", () => {
    const s = StorylineSchema.parse({
      id: "huangdi-banquan",
      series: "wudi",
      title: "阪泉之战",
      protagonist: "huangdi",
      ink_path: "huangdi-banquan.ink",
    });
    expect(s.mode).toBe("official");
    expect(s.difficulty).toBe(3);
  });
});
