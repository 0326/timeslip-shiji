/* ============================================================
   全局 UI 音效 — WebAudio 实时合成，零资源依赖
   风格：古琴拨弦式短音，配合水墨主题
   开关持久化 localStorage("cysj-sfx")，由 uiStore 暴露给 HUD
   ============================================================ */

export type SfxKind =
	// 基础 UI 音（古琴拨弦，沉稳）
	| "hover"
	| "click"
	| "open"
	| "close"
	| "success"
	| "error"
	// 游戏向音效（木琴/铃铛感，活泼俏皮）
	| "pop" // 消除/点击气泡：短促上扬
	| "match" // 配对成功：双音上扬
	| "merge" // 合成升级：三音琶音上行
	| "combo" // 连击：递增半音
	| "correct" // 答对：欢快琶音
	| "wrong" // 答错：低沉短音
	| "flip" // 翻牌：清脆短音
	| "place" // 落子/放置：木质短音
	| "slide" // 滑动：滑音
	| "tick" // 节奏点：节拍器
	| "win" // 胜利：凯旋短旋律
	| "lose" // 失败：下行叹息
	| "shuffle" // 洗牌：连续短音
	| "reveal"; // 揭示：泛音上扬

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

/* ── 游戏向合成工具：木琴/铃铛/跳音，音色更明亮活泼 ── */

/** 木琴感：正弦基音 + 快速衰减，中高频，清脆木质 */
function marimba(freq: number, at: number, dur: number, peak: number) {
	if (!ctx || !master) return;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.setValueAtTime(freq, at);
	// 木琴特色：极快起音 + 稍快的指数衰减
	gain.gain.setValueAtTime(0, at);
	gain.gain.linearRampToValueAtTime(peak, at + 0.004);
	gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
	// 叠加一个 4 倍频泛音，增加木质的"敲击感"
	const osc2 = ctx.createOscillator();
	const gain2 = ctx.createGain();
	osc2.type = "sine";
	osc2.frequency.setValueAtTime(freq * 4, at);
	gain2.gain.setValueAtTime(0, at);
	gain2.gain.linearRampToValueAtTime(peak * 0.25, at + 0.003);
	gain2.gain.exponentialRampToValueAtTime(0.0001, at + dur * 0.6);
	osc.connect(gain).connect(master);
	osc2.connect(gain2).connect(master);
	osc.start(at);
	osc2.start(at);
	osc.stop(at + dur + 0.02);
	osc2.stop(at + dur + 0.02);
}

/** 铃铛感：多个非整数泛音叠加，明亮带金属感 */
function bell(freq: number, at: number, dur: number, peak: number) {
	if (!ctx || !master) return;
	// 铃铛的泛音结构：基频 + 2x + 2.4x + 3x（非整数倍 → 金属感）
	const partials = [
		{ mul: 1, gain: 1 },
		{ mul: 2, gain: 0.5 },
		{ mul: 2.4, gain: 0.35 },
		{ mul: 3, gain: 0.2 },
	];
	partials.forEach((p) => {
		const osc = ctx!.createOscillator();
		const gain = ctx!.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(freq * p.mul, at);
		gain.gain.setValueAtTime(0, at);
		gain.gain.linearRampToValueAtTime(peak * p.gain, at + 0.005);
		gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
		osc.connect(gain).connect(master!);
		osc.start(at);
		osc.stop(at + dur + 0.02);
	});
}

/** 滑音：频率线性上升，柔和正弦 */
function glide(f0: number, f1: number, at: number, dur: number, peak: number) {
	if (!ctx || !master) return;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sine";
	osc.frequency.setValueAtTime(f0, at);
	osc.frequency.linearRampToValueAtTime(f1, at + dur);
	gain.gain.setValueAtTime(0, at);
	gain.gain.linearRampToValueAtTime(peak, at + 0.01);
	gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
	osc.connect(gain).connect(master);
	osc.start(at);
	osc.stop(at + dur + 0.02);
}

/** 木质敲击噪声：短促白噪带通，落子/节拍器用 */
function woodTap(at: number, peak: number, freq: number = 800) {
	if (!ctx || !master) return;
	const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < data.length; i++) {
		// 指数衰减噪声
		data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.15));
	}
	const src = ctx.createBufferSource();
	src.buffer = buffer;
	const bp = ctx.createBiquadFilter();
	bp.type = "bandpass";
	bp.frequency.value = freq;
	bp.Q.value = 2;
	const gain = ctx.createGain();
	gain.gain.setValueAtTime(peak, at);
	gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
	src.connect(bp).connect(gain).connect(master);
	src.start(at);
	src.stop(at + 0.06);
}

/* 五声音阶（宫商角徵羽，A 宫）：UI 音统一取自此音阶，成组听感和谐 */
const GONG = 440;
const SCALE = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3]; // 宫 商 角 徵 羽

/* combo 连击状态：每次 play("combo") 递增半音，1.2s 无连击则归零 */
let comboLevel = 0;
let comboResetTimer: ReturnType<typeof setTimeout> | null = null;

const PATTERNS: Record<SfxKind, (t: number) => void> = {
	// ── 基础 UI 音（古琴拨弦）──
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

	// ── 游戏向音效（木琴/铃铛感，活泼俏皮）──
	// 消除/点击气泡：木琴单音，徵音高八度，清脆短促
	pop: (t) => marimba(GONG * SCALE[3] * 2, t, 0.12, 0.14),
	// 配对成功：双音上扬（角→徵高八度），铃铛
	match: (t) => {
		bell(GONG * SCALE[2] * 2, t, 0.18, 0.12);
		bell(GONG * SCALE[3] * 4, t + 0.06, 0.22, 0.1);
	},
	// 合成升级：三音琶音上行（宫→角→徵→宫高八度），木琴
	merge: (t) => {
		marimba(GONG * SCALE[0] * 2, t, 0.14, 0.12);
		marimba(GONG * SCALE[2] * 2, t + 0.05, 0.14, 0.12);
		marimba(GONG * SCALE[3] * 2, t + 0.1, 0.14, 0.12);
		marimba(GONG * SCALE[0] * 4, t + 0.15, 0.26, 0.14);
	},
	// 连击：递增半音铃铛，最多 12 阶后循环
	combo: (t) => {
		const level = comboLevel % 12;
		comboLevel += 1;
		if (comboResetTimer) clearTimeout(comboResetTimer);
		comboResetTimer = setTimeout(() => {
			comboLevel = 0;
		}, 1200);
		bell(GONG * 2 * Math.pow(2, level / 12), t, 0.16, 0.11);
	},
	// 答对：四音欢快琶音（宫商角徵），木琴+铃铛
	correct: (t) => {
		marimba(GONG * SCALE[0] * 2, t, 0.12, 0.11);
		marimba(GONG * SCALE[1] * 2, t + 0.05, 0.12, 0.11);
		marimba(GONG * SCALE[2] * 2, t + 0.1, 0.12, 0.11);
		bell(GONG * SCALE[3] * 2, t + 0.15, 0.28, 0.12);
	},
	// 答错：低沉双音下行（羽低→宫低），方波短促带叹息感
	wrong: (t) => {
		pluck(GONG * SCALE[4] / 2, t, 0.18, 0.1, "square");
		pluck(GONG * SCALE[0] / 2, t + 0.08, 0.24, 0.09, "square");
	},
	// 翻牌：清脆高频铃铛单音，极短
	flip: (t) => bell(GONG * SCALE[3] * 4, t, 0.08, 0.1),
	// 落子/放置：木质敲击
	place: (t) => woodTap(t, 0.18, 600),
	// 滑动：频率滑升（宫→角高八度），柔和正弦
	slide: (t) => glide(GONG * SCALE[0] * 2, GONG * SCALE[2] * 4, t, 0.18, 0.09),
	// 节奏点：木质节拍器，高频清脆
	tick: (t) => woodTap(t, 0.16, 1200),
	// 胜利：凯旋短旋律（宫→角→徵→宫高八度长音），木琴琶音
	win: (t) => {
		marimba(GONG * SCALE[0] * 2, t, 0.14, 0.12);
		marimba(GONG * SCALE[2] * 2, t + 0.1, 0.14, 0.12);
		marimba(GONG * SCALE[3] * 2, t + 0.2, 0.14, 0.12);
		bell(GONG * SCALE[0] * 4, t + 0.3, 0.5, 0.14);
	},
	// 失败：下行叹息（徵→角→宫低），柔衰减
	lose: (t) => {
		pluck(GONG * SCALE[3], t, 0.2, 0.09, "sine");
		pluck(GONG * SCALE[2], t + 0.12, 0.2, 0.08, "sine");
		pluck(GONG * SCALE[0] / 2, t + 0.24, 0.4, 0.09, "sine");
	},
	// 洗牌：四个随机木琴短音快速连续
	shuffle: (t) => {
		for (let i = 0; i < 4; i++) {
			const idx = Math.floor(Math.random() * SCALE.length);
			marimba(GONG * SCALE[idx] * 2, t + i * 0.045, 0.08, 0.09);
		}
	},
	// 揭示：泛音上扬，滑音+铃铛叠加
	reveal: (t) => {
		glide(GONG * SCALE[0], GONG * SCALE[3] * 2, t, 0.3, 0.08);
		bell(GONG * SCALE[3] * 2, t + 0.18, 0.3, 0.1);
	},
};

let lastHoverAt = 0;
let lastPopAt = 0;
let lastTickAt = 0;

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
		// pop/tick 轻量节流，避免消除/节奏点过密时糊成一团
		if (kind === "pop" || kind === "tick") {
			const now = performance.now();
			const last = kind === "pop" ? lastPopAt : lastTickAt;
			if (now - last < 35) return;
			if (kind === "pop") lastPopAt = now;
			else lastTickAt = now;
		}
		PATTERNS[kind](c.currentTime);
	},

	/** 重置连击计数（小游戏重新开始/换关时调用） */
	resetCombo() {
		comboLevel = 0;
		if (comboResetTimer) {
			clearTimeout(comboResetTimer);
			comboResetTimer = null;
		}
	},
};

declare global {
	interface Window {
		webkitAudioContext?: typeof AudioContext;
	}
}
