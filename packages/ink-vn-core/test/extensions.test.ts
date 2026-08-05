import { describe, it, expect, beforeEach } from "vitest";
import { InkRunner } from "../src/inkRunner";
import { extractStageEffects, parseInkLine } from "../src/tagParser";
import type { StageCallbacks, StageEffectPayload, MinigameInterrupt } from "../src/types";

// ── Extension tests: multi-character, stage effects, SE, narration/thought,
//    minigame interrupts, gotoKnot, variable subscriptions. ──

const EXTENDED_INK = `-> start

VAR trust = 0
VAR morale = 50

=== start ===
#bg:court
#show:yao:solemn:center-left
#show2:shun:respect:center-right
#se:drum_roll
#shake
#fade:800
朝会之上。
『舜，你敢接下治水重任吗？』 #speaker:帝尧
#thought
我若失败，便是千古罪人。 #speaker:舜
* [臣愿往，定要根治水患] -> accept
* [臣才疏学浅，请另择贤能] -> refuse

=== accept ===
#minigame:water_control:difficulty=hard
治水开始了。
#achieve:yugong
-> ending

=== refuse ===
#death:reject
尧帝拂袖而去，舜被放逐。 -> END

=== ending ===
#bgm:triumph
大功告成！ -> END
`;

describe("tagParser — extended stage effects", () => {
	it("extracts multiple #show/#show2/#show3 into effects.shows", () => {
		const { effects, remaining } = extractStageEffects([
			"show:yao:solemn:center-left",
			"show2:shun:respect:center-right",
			"speaker:帝尧",
		]);
		expect(effects.shows).toEqual([
			{ id: "yao", expr: "solemn", pos: "center-left" },
			{ id: "shun", expr: "respect", pos: "center-right" },
		]);
		expect(effects.show).toEqual({ id: "yao", expr: "solemn", pos: "center-left" });
		expect(remaining).toEqual(["speaker:帝尧"]);
	});

	it("extracts #se (sound effect) tag", () => {
		const { effects } = extractStageEffects(["se:drum_roll"]);
		expect(effects.se).toBe("drum_roll");
	});

	it("extracts #shake and #flash flag tags into effect payload", () => {
		const { effects } = extractStageEffects(["shake", "flash"]);
		expect(effects.effect).toEqual({ shake: true, flash: true });
	});

	it("extracts #fade:MS and #camera:mode", () => {
		const { effects } = extractStageEffects(["fade:800", "camera:zoom_in"]);
		expect(effects.effect).toEqual({ fadeMs: 800, camera: "zoom_in" });
	});

	it("extracts multiple hides via hide/hide2", () => {
		const { effects } = extractStageEffects(["hide:yao", "hide2:shun"]);
		expect(effects.hides).toEqual(["yao", "shun"]);
	});

	it("parseInkLine sets kind based on speaker / #narration / #thought", () => {
		// speaker → dialogue
		expect(parseInkLine("你好", ["speaker:舜"]).kind).toBe("dialogue");
		// no speaker → narration
		expect(parseInkLine("秋风萧瑟", []).kind).toBe("narration");
		// explicit #narration tag
		expect(parseInkLine("风起云涌", ["narration"]).kind).toBe("narration");
		// explicit #thought tag → thought
		const thought = parseInkLine("我在想什么", ["thought", "speaker:舜"]);
		expect(thought.kind).toBe("thought");
		expect(thought.speaker).toBe("舜");
	});

	it("parseInkLine extracts #minigame:id:params", () => {
		const parsed = parseInkLine("开始小游戏", ["minigame:water_control:diff=hard"]);
		expect(parsed.minigame).toEqual({ id: "water_control", params: "diff=hard" });
		// minigame is NOT passed to meta
		expect(parsed.meta.minigame).toBeUndefined();
	});

	it("parseInkLine extracts #minigame:id without params", () => {
		const parsed = parseInkLine("go", ["minigame:mini"]);
		expect(parsed.minigame).toEqual({ id: "mini" });
	});
});

describe("InkRunner — stage callbacks: multi-character + SE + effects", () => {
	let fired: string[] = [];
	let effectCaptured: StageEffectPayload | undefined;
	let multiShowCaptured: Array<{ id: string; expr?: string; pos: string }> = [];
	let multiHideCaptured: string[] = [];
	let seCaptured: string | undefined;
	let callbacks: StageCallbacks;

	beforeEach(() => {
		fired = [];
		effectCaptured = undefined;
		multiShowCaptured = [];
		multiHideCaptured = [];
		seCaptured = undefined;
		callbacks = {
			onBackground: (bg) => fired.push(`bg:${bg}`),
			onShowCharacter: (id, expr, pos) => fired.push(`single_show:${id}:${expr ?? "d"}:${pos}`),
			onShowCharacters: (arr) => {
				multiShowCaptured = arr.map((s) => ({ id: s.id, expr: s.expr, pos: s.pos }));
				fired.push(`multi_show:${arr.length}`);
			},
			onHideCharacters: (ids) => {
				multiHideCaptured = ids;
				fired.push(`multi_hide:${ids.length}`);
			},
			onHideCharacter: (id) => fired.push(`hide:${id}`),
			onBGM: (t) => fired.push(`bgm:${t}`),
			onSE: (id) => {
				seCaptured = id;
				fired.push(`se:${id}`);
			},
			onStageEffect: (e) => {
				effectCaptured = e;
				fired.push(`effect:${Object.keys(e).join(",")}`);
			},
		};
	});

	it("fires multi-character onShowCharacters callback when available", () => {
		const runner = new InkRunner({ source: EXTENDED_INK, callbacks });
		runner.advance();
		expect(fired).toContain("bg:court");
		expect(fired).toContain("multi_show:2");
		expect(multiShowCaptured).toEqual([
			{ id: "yao", expr: "solemn", pos: "center-left" },
			{ id: "shun", expr: "respect", pos: "center-right" },
		]);
		// SE + stage effects fired
		expect(seCaptured).toBe("drum_roll");
		expect(effectCaptured).toBeDefined();
		expect(effectCaptured!.shake).toBe(true);
		expect(effectCaptured!.fadeMs).toBe(800);
	});
});

describe("InkRunner — segment.kind & minigame interrupt", () => {
	it("marks segments with kind dialogue/narration/thought", () => {
		const runner = new InkRunner({ source: EXTENDED_INK });
		const out = runner.advance();
		const kinds = out.segments.map((s) => s.kind);
		expect(kinds).toContain("narration"); // 朝会之上
		expect(kinds).toContain("dialogue"); // 帝尧
		expect(kinds).toContain("thought"); // 舜 inner
	});

	it("stops at state='minigame' and returns minigame payload", () => {
		const runner = new InkRunner({ source: EXTENDED_INK });
		// First advance → choice
		const out1 = runner.advance();
		expect(out1.state).toBe("choice");
		// Choose accept → triggers minigame tag
		const out2 = runner.choose(0); // [臣愿往...]
		expect(out2.state).toBe("minigame");
		const mg = out2.minigame as MinigameInterrupt;
		expect(mg).toBeDefined();
		expect(mg.id).toBe("water_control");
		expect(mg.params).toBe("difficulty=hard");
	});

	it("resumeMinigame writes mg_result/mg_score and advances", () => {
		const runner = new InkRunner({ source: EXTENDED_INK });
		runner.advance();
		runner.choose(0); // state minigame
		const out = runner.resumeMinigame("success", 95);
		expect(runner.getVar("mg_result")).toBe("success");
		expect(runner.getVar("mg_score")).toBe(95);
		expect(out.state).toBe("ended"); // ending knot ends story
	});
});

describe("InkRunner — gotoKnot + variable subscriptions", () => {
	it("gotoKnot jumps to a knot and advances from there", () => {
		const runner = new InkRunner({ source: EXTENDED_INK });
		// Skip straight to ending
		const out = runner.gotoKnot("ending");
		expect(out.state).toBe("ended");
		const texts = out.segments.map((s) => s.text);
		expect(texts.join("")).toContain("大功告成");
		// bgm callback fired
	});

	it("subscribeVar fires when variable changes via setVar", () => {
		const runner = new InkRunner({ source: EXTENDED_INK });
		let events: Array<[unknown, unknown]> = [];
		const unsub = runner.subscribeVar("trust", (o, n) => events.push([o, n]));
		runner.setVar("trust", 10);
		runner.setVar("trust", 10); // same value → no fire
		expect(events).toEqual([[0, 10]]);
		unsub();
		runner.setVar("trust", 20);
		expect(events.length).toBe(1); // unsubscribed → no new event
	});

	it("onVarChange callback fires on ink variable changes during story", () => {
		const ink = `-> start
VAR x = 1
=== start ===
x is low.
~ x = 5
x is now high. -> END`;
		let captured: Array<[string, unknown, unknown]> = [];
		const runner = new InkRunner({
			source: ink,
			callbacks: {
				onVarChange: (name, o, n) => captured.push([name, o, n]),
			},
		});
		runner.advance();
		// The assignment ~ x = 5 should fire
		const xChange = captured.find(([n]) => n === "x");
		expect(xChange).toEqual(["x", 1, 5]);
	});
});

describe("InkRunner — checkpoint get/restore roundtrip", () => {
	it("restoreToCheckpoint returns to paragraph start and re-advances same content", () => {
		const runner = new InkRunner({ source: EXTENDED_INK });
		const first = runner.advance();
		expect(first.state).toBe("choice");
		const cp = runner.getCheckpoint();
		// Now make a choice to change state
		runner.choose(0);
		// Restore checkpoint
		runner.restoreToCheckpoint();
		// Re-advance should produce same segments + choice state
		const again = runner.advance();
		expect(again.state).toBe("choice");
		expect(again.segments.length).toBeGreaterThan(0);
		// checkpoint value should equal saved one
		expect(runner.getCheckpoint()).toEqual(cp);
	});
});
