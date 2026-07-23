import { describe, it, expect, beforeEach } from "vitest";
import { InkRunner } from "../src/inkRunner";
import type { StageCallbacks } from "../src/types";

// Minimal ink script for testing: dialogue + choice + death + ending + stage tags.
// Note: ink requires an explicit entry divert (-> knot) at the top.
// Choice tags go BEFORE the choice text or INSIDE the brackets (not after divert).
const MINIMAL_INK = `-> start

=== start ===
#bg:huaiyin_street
#bgm:lonely
淮阴。你是韩信，家贫无行。
你腰间佩着一柄长剑。
#show:tuzhong:mocking:right
市井少年拦住你。
『信能死，刺我；不能死，出我袴下！』 #speaker:少年 #hint:于是信孰视之，俛出袴下，蒲伏。

* [拔剑而起，一剑刺死辱我之人] -> death_kill
* #correct #hint:孰视之——这不是怯懦，是隐忍。 [孰视良久，俯身从他胯下钻过] -> pass

=== death_kill ===
#death:kill
你一剑刺出，少年当场毙命。
你因杀人亡命天涯，兵仙就此夭折。 -> END

=== pass ===
#hide:tuzhong
#achieve:xiakua
你定定地看了他许久，俯身，从他胯下缓缓爬过。
满市的人都笑你怯懦。可你心里清楚，忍下这口气，留住的是一身将来。 #speaker:韩信
-> ending

=== ending ===
#bg:palace
多年之后，你登坛拜将，成为大汉兵仙。
-> END
`;

describe("InkRunner — minimal story golden run", () => {
	let firedEvents: string[] = [];
	let callbacks: StageCallbacks;

	beforeEach(() => {
		firedEvents = [];
		callbacks = {
			onBackground: (bg) => firedEvents.push(`bg:${bg}`),
			onShowCharacter: (id, expr, pos) =>
				firedEvents.push(`show:${id}:${expr ?? "default"}:${pos}`),
			onHideCharacter: (id) => firedEvents.push(`hide:${id}`),
			onBGM: (track) => firedEvents.push(`bgm:${track}`),
			onChoice: (c) => firedEvents.push(`choice:${c.text}`),
		};
	});

	it("compiles and initializes without errors", () => {
		const runner = new InkRunner({ source: MINIMAL_INK, callbacks });
		expect(runner).toBeDefined();
	});

	it("first advance produces opening dialogue with stage effects", () => {
		const runner = new InkRunner({ source: MINIMAL_INK, callbacks });
		const out = runner.advance();

		// State should be 'choice' (waiting for player to choose)
		expect(out.state).toBe("choice");
		expect(out.choices.length).toBe(2);

		// Segments should include narration and dialogue
		const texts = out.segments.map((s) => s.text);
		expect(texts).toContain("淮阴。你是韩信，家贫无行。");
		expect(texts).toContain("你腰间佩着一柄长剑。");
		expect(texts).toContain("市井少年拦住你。");
		expect(texts).toContain("『信能死，刺我；不能死，出我袴下！』");

		// Speaker on dialogue line
		const 少年Line = out.segments.find((s) => s.text.includes("信能死"));
		expect(少年Line?.speaker).toBe("少年");

		// Hint tag on the少年 line
		expect(少年Line?.meta.hint).toBe("于是信孰视之，俛出袴下，蒲伏。");

		// Stage callbacks fired
		expect(firedEvents).toContain("bg:huaiyin_street");
		expect(firedEvents).toContain("bgm:lonely");
		expect(firedEvents).toContain("show:tuzhong:mocking:right");
	});

	it("choosing death option leads to death state", () => {
		const runner = new InkRunner({ source: MINIMAL_INK, callbacks });
		runner.advance();
		firedEvents = [];

		// Choose first option (拔剑而起 → death)
		const out = runner.choose(0);

		expect(out.state).toBe("death");
		expect(out.deathId).toBe("kill");
		expect(out.choices.length).toBe(0);

		// Death dialogue present
		const allText = out.segments.map((s) => s.text).join(" ");
		expect(allText).toContain("你一剑刺出");
		expect(allText).toContain("亡命天涯");
	});

	it("choosing correct option leads to pass → ending", () => {
		const runner = new InkRunner({ source: MINIMAL_INK, callbacks });
		runner.advance();
		firedEvents = [];

		// Choose second option (钻胯下 → pass, correct)
		const out = runner.choose(1);

		// After choosing the correct path, we should reach 'ended' (pass → ending → END)
		expect(out.state).toBe("ended");
		expect(out.deathId).toBeUndefined();

		// onChoice callback should have fired
		const choiceEvent = firedEvents.find((e) => e.startsWith("choice:"));
		expect(choiceEvent).toBeDefined();

		// Hide tuzhong callback should fire
		expect(firedEvents).toContain("hide:tuzhong");

		// Background change to palace
		expect(firedEvents).toContain("bg:palace");

		// Ending dialogue present
		const allText = out.segments.map((s) => s.text).join(" ");
		expect(allText).toContain("登坛拜将");

		// Check meta: achieve tag should be on a segment
		const achieveSeg = out.segments.find((s) => s.meta.achieve);
		expect(achieveSeg?.meta.achieve).toBe("xiakua");
	});

	it("choice meta contains correct flag on second choice", () => {
		const runner = new InkRunner({ source: MINIMAL_INK, callbacks });
		const out = runner.advance();

		expect(out.choices[0].meta.correct).toBeUndefined();
		expect(out.choices[1].meta.correct).toBe(true);
		expect(out.choices[1].meta.hint).toBe("孰视之——这不是怯懦，是隐忍。");
	});

	it("snapshot and restore work correctly", () => {
		const runner = new InkRunner({ source: MINIMAL_INK, callbacks });
		runner.advance();

		// Take snapshot at choice point
		const snap = runner.snapshot();
		expect(typeof snap).toBe("string");
		expect(snap.length).toBeGreaterThan(0);

		// Choose death
		const deathOut = runner.choose(0);
		expect(deathOut.state).toBe("death");

		// Restore to choice point
		runner.restore(snap);
		const restored = runner.advance();
		expect(restored.state).toBe("choice");
		expect(restored.choices.length).toBe(2);

		// Now choose the correct path
		firedEvents = [];
		const passOut = runner.choose(1);
		expect(passOut.state).toBe("ended");
	});

	it("restart resets to beginning", () => {
		const runner = new InkRunner({ source: MINIMAL_INK, callbacks });
		runner.advance();
		runner.choose(1); // play through to ending

		runner.restart();
		firedEvents = [];
		const out = runner.advance();
		expect(out.state).toBe("choice");
		expect(out.segments.length).toBeGreaterThan(0);
		// Stage callbacks fire again
		expect(firedEvents).toContain("bg:huaiyin_street");
	});

	it("getVar and setVar work", () => {
		const ink = `-> start
VAR count = 0
=== start ===
~ count = 5
The count is {count}.
-> END
`;
		const runner = new InkRunner({ source: ink });
		runner.advance();
		expect(runner.getVar("count")).toBe(5);

		runner.setVar("count", 10);
		expect(runner.getVar("count")).toBe(10);
	});

	it("handles multi-line text correctly (tags on last line only)", () => {
		// Ink where multiple lines are produced in one Continue batch.
		// Speaker tag is on the last line; previous lines are narration.
		const ink = `-> start
=== start ===
第一句旁白。
第二句旁白。
第三句对白。 #speaker:韩信
-> END
`;
		const runner = new InkRunner({ source: ink });
		const out = runner.advance();

		expect(out.state).toBe("ended");
		expect(out.segments.length).toBe(3);

		// First two lines are narration (no speaker)
		expect(out.segments[0].text).toBe("第一句旁白。");
		expect(out.segments[0].speaker).toBeUndefined();
		expect(out.segments[1].text).toBe("第二句旁白。");
		expect(out.segments[1].speaker).toBeUndefined();

		// Last line has speaker
		expect(out.segments[2].text).toBe("第三句对白。");
		expect(out.segments[2].speaker).toBe("韩信");
	});

	it("handles conditional text with variables", () => {
		const ink = `-> start
VAR trust = 0
=== start ===
~ trust = 3
{trust >= 3:他信任你。|他不信任你。}
* [继续] -> END
-> END
`;
		const runner = new InkRunner({ source: ink });
		const out = runner.advance();
		const text = out.segments.map((s) => s.text).join(" ");
		expect(text).toContain("他信任你。");
		expect(text).not.toContain("他不信任你。");
	});

	it("throws on invalid ink syntax", () => {
		// Ink with syntax error: divert to non-existent knot
		expect(() => {
			new InkRunner({ source: "-> start\n=== start ===\nHello.\n-> nonexistent_knot" });
		}).toThrow();
	});
});
