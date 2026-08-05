import { describe, it, expect, beforeEach } from "vitest";
import { GameSystems } from "../src";
import type { GameContent } from "vn-content-schemas";

const EMPTY: GameContent = {
  schema_version: "1.0.0",
  game_name: "Test",
  default_theme: "inkWash",
  default_language: "zh-CN",
  series: [{ id: "wudi", name: "五帝", era: "wudi", order: 1 }],
  characters: [
    { id: "shun", name: "舜", era: "wudi", order: 1, dynasty_order: 1 },
    { id: "yu", name: "禹", era: "xia", order: 1, dynasty_order: 2 },
  ],
  storylines: [],
  backgrounds: [],
  classics: { name: "典籍", chapters: [] },
  achievements: [
    { id: "first_clear", name: "首通", rarity: 1, group: "general",
      trigger: { kind: "storyline_clear", storyline_id: "s1" } },
  ],
  minigames: [],
  bgm: { tracks: [] },
};

function memAdapter() {
  const m = new Map<string, string>();
  return {
    getItem: (k: string) => m.get(k) ?? null,
    setItem: (k: string, v: string) => m.set(k, v),
    removeItem: (k: string) => m.delete(k),
  };
}

describe("GameSystems facade", () => {
  it("constructs and exposes all systems", () => {
    const gs = new GameSystems(EMPTY, { adapter: memAdapter() });
    expect(gs.settings).toBeDefined();
    expect(gs.stats).toBeDefined();
    expect(gs.achievements).toBeDefined();
    expect(gs.deathCodex).toBeDefined();
    expect(gs.characterCodex).toBeDefined();
    expect(gs.gacha).toBeDefined();
    expect(gs.save).toBeDefined();
    expect(gs.minigames).toBeDefined();
    expect(gs.audio).toBeDefined();
  });

  it("settings.set clamps volume to 0..1", () => {
    const gs = new GameSystems(EMPTY, { adapter: memAdapter() });
    gs.settings.set("bgm_volume", 2);
    expect(gs.settings.get("bgm_volume")).toBe(1);
    gs.settings.set("se_volume", -1);
    expect(gs.settings.get("se_volume")).toBe(0);
  });

  it("death codex trigger + registry fallback + global save roundtrip", () => {
    const adapter = memAdapter();
    let gs = new GameSystems(EMPTY, { adapter });
    gs.deathCodex.register({
      death_id: "jing_xing_burned",
      title: "焚廪之死",
      summary: "舜被瞽叟反锁，廪起火，舜持笠自下而得不死。",
      checkpoint_path: "shun_fanlin.start",
    });
    const r = gs.deathCodex.trigger("jing_xing_burned");
    expect(r.entry.count).toBe(1);
    expect(r.checkpoint_path).toBe("shun_fanlin.start");
    // Trigger unknown id: fallback generic registered
    const r2 = gs.deathCodex.trigger("unknown_death");
    expect(r2.entry.title).toBe("unknown_death");

    // Save global → new systems instance → restore
    gs.saveGlobalProgress();
    let gs2 = new GameSystems(EMPTY, { adapter });
    const restored = gs2.loadGlobalProgress();
    expect(restored).toBe(true);
    expect(gs2.deathCodex.count("jing_xing_burned")).toBe(1);
    expect(gs2.deathCodex.count("unknown_death")).toBe(1);
  });

  it("achievement sweep from bus events", () => {
    const gs = new GameSystems(EMPTY, { adapter: memAdapter() });
    const unlocked: Array<{ id: string; name: string }> = [];
    gs.bus.on("achievement.unlocked", (p) => unlocked.push(p));
    // stats path clears.s1 should fire the sweep
    gs.stats.markStorylineCleared("s1");
    expect(unlocked.length).toBe(1);
    expect(unlocked[0].id).toBe("first_clear");
  });

  it("gacha free daily pull rolls items", () => {
    const gs = new GameSystems(EMPTY, { adapter: memAdapter() });
    const pulls: unknown[] = [];
    gs.bus.on("gacha.pulled", (p) => pulls.push(p));
    expect(gs.gacha.canPull(1)).toBe(true);
    const items = gs.gacha.pull(10);
    expect(items).toBeNull(); // only 1 free daily
    const one = gs.gacha.pull(1);
    expect(one?.length).toBe(1);
    expect(pulls.length).toBe(1);
    expect(gs.gacha.canPull(1)).toBe(false);
  });

  it("character codex unlock via storyline", () => {
    const gs = new GameSystems(EMPTY, { adapter: memAdapter() });
    gs.characterCodex.unlockForStoryline("shun", ["yu"]);
    expect(gs.characterCodex.isUnlocked("shun")).toBe(true);
    expect(gs.characterCodex.isUnlocked("yu")).toBe(true);
    expect(gs.characterCodex.isUnlocked("nonexistent")).toBe(false);
  });

  it("minigameRegistry parses params string", () => {
    const content: GameContent = {
      ...EMPTY,
      minigames: [{
        id: "water_control",
        name: "治水",
        component: "WaterControl",
        result_type: "number",
        skippable: true,
        params: [
          { key: "difficulty", type: "enum", enum_values: ["easy", "hard"], required: false },
          { key: "rounds", type: "number", default: 5 },
          { key: "strict", type: "boolean" },
        ],
      }],
    };
    const gs = new GameSystems(content, { adapter: memAdapter() });
    const p = gs.minigames.parseParams(
      "water_control",
      "difficulty=hard,rounds=10,strict=on,unknown=skip"
    );
    expect(p.difficulty).toBe("hard");
    expect(p.rounds).toBe(10);
    expect(p.strict).toBe(true);
    expect(p.unknown).toBeUndefined();
  });
});
