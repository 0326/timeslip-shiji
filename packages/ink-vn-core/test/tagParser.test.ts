import { describe, it, expect } from "vitest";
import { parseInkLine, extractStageEffects } from "../src/tagParser";

describe("extractStageEffects", () => {
	it("extracts #bg tag", () => {
		const { effects, remaining } = extractStageEffects(["bg:huaiyin_street"]);
		expect(effects.bg).toBe("huaiyin_street");
		expect(remaining).toEqual([]);
	});

	it("extracts #bgm tag", () => {
		const { effects, remaining } = extractStageEffects(["bgm:lonely"]);
		expect(effects.bgm).toBe("lonely");
		expect(remaining).toEqual([]);
	});

	it("extracts #hide tag", () => {
		const { effects, remaining } = extractStageEffects(["hide:tuzhong"]);
		expect(effects.hide).toBe("tuzhong");
		expect(remaining).toEqual([]);
	});

	it("extracts #show:id only", () => {
		const { effects, remaining } = extractStageEffects(["show:hanxin"]);
		expect(effects.show).toEqual({ id: "hanxin", expr: undefined, pos: "center" });
		expect(remaining).toEqual([]);
	});

	it("extracts #show:id:pos", () => {
		const { effects, remaining } = extractStageEffects(["show:hanxin:right"]);
		expect(effects.show).toEqual({ id: "hanxin", expr: undefined, pos: "right" });
		expect(remaining).toEqual([]);
	});

	it("extracts #show:id:expr:pos", () => {
		const { effects, remaining } = extractStageEffects(["show:tuzhong:mocking:right"]);
		expect(effects.show).toEqual({ id: "tuzhong", expr: "mocking", pos: "right" });
		expect(remaining).toEqual([]);
	});

	it("extracts #show:id:expr (no pos defaults to center)", () => {
		const { effects, remaining } = extractStageEffects(["show:hanxin:smiling"]);
		expect(effects.show).toEqual({ id: "hanxin", expr: "smiling", pos: "center" });
		expect(remaining).toEqual([]);
	});

	it("passes non-stage tags to remaining", () => {
		const { effects, remaining } = extractStageEffects([
			"speaker:韩信",
			"hint:孰视之",
			"correct",
			"death:kill",
		]);
		expect(effects.bg).toBeUndefined();
		expect(effects.show).toBeUndefined();
		expect(remaining).toEqual(["speaker:韩信", "hint:孰视之", "correct", "death:kill"]);
	});

	it("handles mixed stage and non-stage tags", () => {
		const { effects, remaining } = extractStageEffects([
			"bg:tent",
			"show:hanxin:left",
			"speaker:韩信",
			"hint:原文",
		]);
		expect(effects.bg).toBe("tent");
		expect(effects.show).toEqual({ id: "hanxin", expr: undefined, pos: "left" });
		expect(remaining).toEqual(["speaker:韩信", "hint:原文"]);
	});

	it("handles empty tags array", () => {
		const { effects, remaining } = extractStageEffects([]);
		expect(effects.bg).toBeUndefined();
		expect(effects.show).toBeUndefined();
		expect(remaining).toEqual([]);
	});

	it("handles flag tags (no colon)", () => {
		const { effects, remaining } = extractStageEffects(["correct", "narration"]);
		expect(effects.bg).toBeUndefined();
		expect(remaining).toEqual(["correct", "narration"]);
	});
});

describe("parseInkLine", () => {
	it("parses plain narration (no tags)", () => {
		const result = parseInkLine("淮阴。你是韩信。", []);
		expect(result.text).toBe("淮阴。你是韩信。");
		expect(result.speaker).toBeUndefined();
		expect(result.meta).toEqual({});
	});

	it("extracts speaker from tags", () => {
		const result = parseInkLine("你好。", ["speaker:韩信"]);
		expect(result.text).toBe("你好。");
		expect(result.speaker).toBe("韩信");
		expect(result.meta).toEqual({});
	});

	it("extracts hint into meta", () => {
		const result = parseInkLine("钻过胯下。", ["speaker:韩信", "hint:孰视之，俛出袴下"]);
		expect(result.speaker).toBe("韩信");
		expect(result.meta.hint).toBe("孰视之，俛出袴下");
	});

	it("extracts flag tags as true", () => {
		const result = parseInkLine("正确选项。", ["correct", "speaker:旁白"]);
		expect(result.speaker).toBe("旁白");
		expect(result.meta.correct).toBe(true);
	});

	it("extracts death tag with value", () => {
		const result = parseInkLine("你死了。", ["death:kill"]);
		expect(result.meta.death).toBe("kill");
	});

	it("extracts achieve tag", () => {
		const result = parseInkLine("成就解锁。", ["achieve:xiakua"]);
		expect(result.meta.achieve).toBe("xiakua");
	});

	it("trims whitespace from text", () => {
		const result = parseInkLine("  对白文本。  ", []);
		expect(result.text).toBe("对白文本。");
	});

	it("handles Chinese colon in text (not confused with tag colon)", () => {
		// Tags come from inkjs as already-parsed tag arrays,
		// so colons in the text body are not a tag issue.
		const result = parseInkLine("项羽：『此沛公左司马曹无伤言之。』", ["speaker:项羽"]);
		expect(result.text).toBe("项羽：『此沛公左司马曹无伤言之。』");
		expect(result.speaker).toBe("项羽");
	});

	it("ignores stage tags that slipped through", () => {
		// Stage tags should have been extracted by extractStageEffects already,
		// but if they reach parseInkLine they should be silently ignored
		const result = parseInkLine("场景文本。", ["bg:huaiyin", "speaker:旁白"]);
		expect(result.speaker).toBe("旁白");
		expect(result.meta.bg).toBeUndefined();
	});
});
