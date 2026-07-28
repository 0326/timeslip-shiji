/* ============================================================
   全局 UI 音效 — WebAudio 实时合成，零资源依赖
   风格：古琴拨弦式短音，配合水墨主题
   开关持久化 localStorage("cysj-sfx")，由 uiStore 暴露给 HUD
   ============================================================ */

export type SfxKind = "hover" | "click" | "open" | "close" | "success" | "error";

const STORAGE_KEY = "cysj-sfx";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = readEnabled();

function readEnabled(): boolean {
	try {
		const val = localStorage.getItem(STORAGE_KEY);
		// 默认关闭，只有显式设为 "on" 才开启
		return val === "on";
	} catch {
		return false;
	}
}

function ensureCtx(): AudioContext | null {
	if (typeof window === "undefined") return null;
	const AC = window.AudioContext ?? window.webkitAudioContext;
	if (!AC) return null;
	if (!ctx) {
		ctx = new AC();
		master = ctx.createGain();
		master.gain.value = 0.5;
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") void ctx.resume();
	return ctx;
}

/** 单个拨弦音：三角波基音 + 快速衰减，模拟古琴泛音 */
function pluck(
	freq: number,
	at: number,
	dur: number,
	peak: number,
	type: OscillatorType = "triangle",
) {
	if (!ctx || !master) return;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = type;
	osc.frequency.setValueAtTime(freq, at);
	gain.gain.setValueAtTime(0, at);
	gain.gain.linearRampToValueAtTime(peak, at + 0.008);
	gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
	osc.connect(gain).connect(master);
	osc.start(at);
	osc.stop(at + dur + 0.02);
}

/* 五声音阶（宫商角徵羽，A 宫）：UI 音统一取自此音阶，成组听感和谐 */
const GONG = 440;
const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3]; // 宫 商 角 徵 羽

const PATTERNS: Record<SfxKind, (t: number) => void> = {
	hover: (t) => pluck(GONG * SCALE[3] * 2, t, 0.07, 0.05, "sine"),
	click: (t) => {
		pluck(GONG * SCALE[0] * 2, t, 0.1, 0.12);
		pluck(GONG * SCALE[3] * 2, t + 0.03, 0.12, 0.08);
	},
	open: (t) => {
		pluck(GONG * SCALE[0], t, 0.16, 0.1);
		pluck(GONG * SCALE[2] * 2, t + 0.05, 0.18, 0.07, "sine");
	},
	close: (t) => {
		pluck(GONG * SCALE[2], t, 0.14, 0.08);
		pluck(GONG * SCALE[0], t + 0.04, 0.16, 0.06, "sine");
	},
	success: (t) => {
		pluck(GONG * SCALE[0] * 2, t, 0.14, 0.1);
		pluck(GONG * SCALE[2] * 2, t + 0.07, 0.14, 0.1);
		pluck(GONG * SCALE[4] * 2, t + 0.14, 0.3, 0.1);
	},
	error: (t) => {
		pluck(GONG * SCALE[1], t, 0.16, 0.1, "square");
		pluck(GONG * SCALE[1] / 2, t + 0.06, 0.2, 0.08, "square");
	},
};

let lastHoverAt = 0;

export const sfx = {
	isEnabled: () => enabled,

	setEnabled(on: boolean) {
		enabled = on;
		try {
			localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
		} catch {
			/* 忽略隐私模式下的写入失败 */
		}
	},

	play(kind: SfxKind) {
		if (!enabled) return;
		const c = ensureCtx();
		if (!c) return;
		// hover 节流，避免快速扫过按钮组时的密集颤音
		if (kind === "hover") {
			const now = performance.now();
			if (now - lastHoverAt < 70) return;
			lastHoverAt = now;
		}
		PATTERNS[kind](c.currentTime);
	},
};

declare global {
	interface Window {
		webkitAudioContext?: typeof AudioContext;
	}
}
