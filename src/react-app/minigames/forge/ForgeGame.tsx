// 铁匠锻兵（合成 + 时间管理）—— 铸剑/统一兵器故事线
// 玩法：从底部原料栏点击选择矿石，再点击锻造台格子放入。
// 相邻（上下左右 4 格）的原料会自动合成更高级材料；合成出目标兵器即胜。
//
// 合成路线：
//   铜 + 锡 → 青铜
//   铁 + 炭 → 钢
//   青铜 ×3（相聚） → 青铜剑   ← 第 1 关目标
//   钢   ×3（相聚） → 钢剑     ← 第 2 关目标
//   青铜 + 钢       → 玄铁剑   ← 第 3 关目标
//
// 3 关：
//   1. 铸青铜 —— 60 秒，目标青铜剑
//   2. 锻钢剑 —— 90 秒，目标钢剑
//   3. 炼玄铁 —— 120 秒，目标玄铁剑
// 通过 param 选择关卡（"1"/"2"/"3"），默认第 1 关。

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, Eraser, RotateCcw, Sword } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./forge.css";

// ── 类型 ──
type OreType = "Cu" | "Sn" | "Fe" | "C";
type AlloyType = "Bronze" | "Steel";
type SwordType = "BronzeSword" | "SteelSword" | "MysticSword";
type CellItem = OreType | AlloyType | SwordType;
type Grid = (CellItem | null)[][];

const ROWS = 3;
const COLS = 3;

const ORE_TYPES: OreType[] = ["Cu", "Sn", "Fe", "C"];

interface ItemInfo {
	name: string;
	cls: string;
	kind: "ore" | "alloy" | "sword";
}
const ITEM_INFO: Record<CellItem, ItemInfo> = {
	Cu: { name: "铜矿", cls: "fg-cu", kind: "ore" },
	Sn: { name: "锡矿", cls: "fg-sn", kind: "ore" },
	Fe: { name: "铁矿", cls: "fg-fe", kind: "ore" },
	C: { name: "木炭", cls: "fg-c", kind: "ore" },
	Bronze: { name: "青铜", cls: "fg-bronze", kind: "alloy" },
	Steel: { name: "钢", cls: "fg-steel", kind: "alloy" },
	BronzeSword: { name: "青铜剑", cls: "fg-bronze-sword", kind: "sword" },
	SteelSword: { name: "钢剑", cls: "fg-steel-sword", kind: "sword" },
	MysticSword: { name: "玄铁剑", cls: "fg-mystic-sword", kind: "sword" },
};

interface LevelDef {
	id: number;
	name: string;
	desc: string;
	target: SwordType;
	timeLimit: number;
}
const LEVELS: Record<number, LevelDef> = {
	1: {
		id: 1,
		name: "铸青铜",
		desc: "铜锡合炼，铸一柄青铜剑。铜+锡→青铜，三块青铜相聚即成剑。",
		target: "BronzeSword",
		timeLimit: 60,
	},
	2: {
		id: 2,
		name: "锻钢剑",
		desc: "铁炭相济，淬一柄钢剑。铁+炭→钢，三块钢相聚即成剑。",
		target: "SteelSword",
		timeLimit: 90,
	},
	3: {
		id: 3,
		name: "炼玄铁",
		desc: "青铜与钢交融，得一柄玄铁剑。先成青铜与钢，二者相遇即合。",
		target: "MysticSword",
		timeLimit: 120,
	},
};

const RECIPES = ["铜+锡→青铜", "铁+炭→钢", "青铜×3→青铜剑", "钢×3→钢剑", "青铜+钢→玄铁剑"];

// ── 合成检测工具 ──
const DIRS: [number, number][] = [
	[-1, 0],
	[1, 0],
	[0, -1],
	[0, 1],
];

function inBounds(r: number, c: number): boolean {
	return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

function cloneGrid(g: Grid): Grid {
	return g.map((row) => [...row]);
}

function emptyGrid(): Grid {
	return Array.from({ length: ROWS }, () =>
		Array<CellItem | null>(COLS).fill(null),
	);
}

/** 找一个 type 格子，其有 ≥2 个同类型邻居（相聚三格），返回这三格 */
function findTriplet(g: Grid, type: CellItem): [number, number][] | null {
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			if (g[r][c] !== type) continue;
			const nbrs: [number, number][] = [];
			for (const [dr, dc] of DIRS) {
				const nr = r + dr;
				const nc = c + dc;
				if (inBounds(nr, nc) && g[nr][nc] === type) nbrs.push([nr, nc]);
			}
			if (nbrs.length >= 2) return [[r, c], nbrs[0], nbrs[1]];
		}
	}
	return null;
}

/** 找相邻的 (typeA, typeB) 对 */
function findPair(
	g: Grid,
	typeA: CellItem,
	typeB: CellItem,
): [number, number][] | null {
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			if (g[r][c] !== typeA) continue;
			for (const [dr, dc] of DIRS) {
				const nr = r + dr;
				const nc = c + dc;
				if (inBounds(nr, nc) && g[nr][nc] === typeB)
					return [
						[r, c],
						[nr, nc],
					];
			}
		}
	}
	return null;
}

interface Synthesis {
	consume: [number, number][];
	product: CellItem;
	placeAt: [number, number];
}

/** 找下一步合成；优先兵器（三连 / 青铜+钢）> 合金原料对 */
function findSynthesis(g: Grid): Synthesis | null {
	let tri = findTriplet(g, "Bronze");
	if (tri) return { consume: tri, product: "BronzeSword", placeAt: tri[0] };
	tri = findTriplet(g, "Steel");
	if (tri) return { consume: tri, product: "SteelSword", placeAt: tri[0] };
	let pair = findPair(g, "Bronze", "Steel");
	if (pair) return { consume: pair, product: "MysticSword", placeAt: pair[0] };
	pair = findPair(g, "Cu", "Sn");
	if (pair) return { consume: pair, product: "Bronze", placeAt: pair[0] };
	pair = findPair(g, "Fe", "C");
	if (pair) return { consume: pair, product: "Steel", placeAt: pair[0] };
	return null;
}

function hasItem(g: Grid, item: CellItem): boolean {
	return g.some((row) => row.some((cell) => cell === item));
}

const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

export function ForgeGame({ param, onComplete, onSkip }: MinigameProps) {
	// 关卡选择：param 中取 1/2/3，默认第 1 关
	const levelNum = useMemo(() => {
		const m = param?.match(/([123])/);
		return m ? Number(m[1]) : 1;
	}, [param]);
	const level = LEVELS[levelNum] ?? LEVELS[1];

	const [grid, setGrid] = useState<Grid>(() => emptyGrid());
	const [selected, setSelected] = useState<OreType | null>(null);
	const [eraseMode, setEraseMode] = useState(false);
	const [timeLeft, setTimeLeft] = useState(level.timeLimit);
	const [forgeFlash, setForgeFlash] = useState<Set<string>>(new Set());
	const [busy, setBusy] = useState(false);
	const [won, setWon] = useState(false);
	const [lost, setLost] = useState(false);
	const busyRef = useRef(false);
	// 用户是否已实际交互。未交互前不启动倒计时，防止挂载后自动判负
	const userInteractedRef = useRef(false);

	const reset = useCallback(() => {
		sfx.resetCombo();
		setGrid(emptyGrid());
		setSelected(null);
		setEraseMode(false);
		setTimeLeft(level.timeLimit);
		setForgeFlash(new Set());
		setBusy(false);
		setWon(false);
		setLost(false);
		busyRef.current = false;
	}, [level.timeLimit]);

	// 关卡变化时重置
	useEffect(() => {
		reset();
	}, [levelNum, reset]);

	// 倒计时：仅在用户已交互后启动，防止挂载即倒计时导致自动判负
	useEffect(() => {
		if (won || lost) return;
		if (!userInteractedRef.current) return;
		if (timeLeft <= 0) {
			setLost(true);
			return;
		}
		const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
		return () => clearTimeout(t);
	}, [timeLeft, won, lost]);

	// 合成级联：反复检测并应用合成，直到无合成或胜利
	const resolveSynthesis = useCallback(
		async (start: Grid) => {
			let cur = cloneGrid(start);
			for (let iter = 0; iter < 24; iter++) {
				const syn = findSynthesis(cur);
				if (!syn) break;
				// 闪消耗格
				setForgeFlash(new Set(syn.consume.map(([r, c]) => `${r},${c}`)));
				await sleep(260);
				const next = cloneGrid(cur);
				for (const [r, c] of syn.consume) next[r][c] = null;
				const [pr, pc] = syn.placeAt;
				next[pr][pc] = syn.product;
				cur = next;
				setGrid(cur);
				sfx.play("merge");
				// 闪产物格
				setForgeFlash(new Set([`${pr},${pc}`]));
				await sleep(220);
				setForgeFlash(new Set());
				if (hasItem(cur, level.target)) {
					setWon(true);
					return;
				}
			}
		},
		[level.target],
	);

	// 放入原料并触发合成
	const placeAt = useCallback(
		async (r: number, c: number, ore: OreType) => {
			if (busyRef.current) return;
			userInteractedRef.current = true;
			busyRef.current = true;
			setBusy(true);
			const start = cloneGrid(grid);
			start[r][c] = ore;
			setGrid(start);
			sfx.play("place");
			await resolveSynthesis(start);
			busyRef.current = false;
			setBusy(false);
		},
		[grid, resolveSynthesis],
	);

	function onCellClick(r: number, c: number) {
		if (busy || won || lost) return;
		if (eraseMode) {
			if (grid[r][c] !== null) {
				const next = cloneGrid(grid);
				next[r][c] = null;
				setGrid(next);
			}
			return;
		}
		if (!selected) return;
		if (grid[r][c] !== null) return; // 已占用
		void placeAt(r, c, selected);
	}

	function pickOre(ore: OreType) {
		if (busy || won || lost) return;
		setEraseMode(false);
		setSelected((cur) => (cur === ore ? null : ore));
	}

	function toggleErase() {
		if (busy || won || lost) return;
		setSelected(null);
		setEraseMode((e) => !e);
	}

	// 胜利回调
	useEffect(() => {
		if (won) {
			sfx.play("win");
			const ratio = Math.max(0, timeLeft / level.timeLimit);
			const score = Math.round(60 + ratio * 40); // 60-100
			const t = setTimeout(() => onComplete({ result: "win", score }), 900);
			return () => clearTimeout(t);
		}
	}, [won, timeLeft, level.timeLimit, onComplete]);

	// 失败回调（胜利优先，避免与计时器竞态）
	useEffect(() => {
		if (lost && !won) {
			sfx.play("lose");
			const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1500);
			return () => clearTimeout(t);
		}
	}, [lost, won, onComplete]);

	const targetInfo = ITEM_INFO[level.target];

	return (
		<div className="fg-root">
			<div className="fg-fire" aria-hidden="true" />

			<div className="fg-hud">
				<div className="fg-level">第 {level.id} 关 · {level.name}</div>
				<div className="fg-timer">
					余 <span className="fg-time-num">{timeLeft}</span> 秒
				</div>
			</div>

			<div className="fg-stage">
				<div className="fg-target">
					<div className="fg-target-label">目标兵器</div>
					<div className={`fg-target-card ${targetInfo.cls}`}>
						{targetInfo.kind === "sword" ? (
							<Sword className={`fg-sword ${targetInfo.cls} fg-target-sword`} />
						) : (
							<span className={`fg-orb ${targetInfo.cls} fg-target-orb`} />
						)}
						<div className="fg-target-name">{targetInfo.name}</div>
					</div>
					<div className="fg-target-desc">{level.desc}</div>
				</div>

				<div className="fg-grid">
					{grid.map((row, r) =>
						row.map((cell, c) => {
							const key = `${r},${c}`;
							const flashing = forgeFlash.has(key);
							const info = cell ? ITEM_INFO[cell] : null;
							return (
								<button
									key={key}
									className={["fg-cell", flashing ? "flash" : ""]
										.filter(Boolean)
										.join(" ")}
									onClick={() => onCellClick(r, c)}
									disabled={busy || won || lost}
									aria-label={info ? info.name : "空格"}
								>
									{info && info.kind === "sword" && (
										<Sword className={`fg-sword ${info.cls}`} />
									)}
									{info && info.kind !== "sword" && (
										<span className={`fg-orb ${info.cls}`} />
									)}
								</button>
							);
						}),
					)}
				</div>
			</div>

			<div className="fg-recipes">
				{RECIPES.map((r) => (
					<span key={r} className="fg-recipe">
						{r}
					</span>
				))}
			</div>

			<div className="fg-materials">
				{ORE_TYPES.map((ore) => {
					const info = ITEM_INFO[ore];
					return (
						<button
							key={ore}
							className={[
								"fg-mat",
								info.cls,
								selected === ore && !eraseMode ? "selected" : "",
							]
								.filter(Boolean)
								.join(" ")}
							onClick={() => pickOre(ore)}
							disabled={busy || won || lost}
						>
							<span className={`fg-orb-mini ${info.cls}`} />
							<span>{info.name}</span>
						</button>
					);
				})}
				<button
					className={["fg-mat", "fg-erase", eraseMode ? "selected" : ""]
						.filter(Boolean)
						.join(" ")}
					onClick={toggleErase}
					disabled={busy || won || lost}
				>
					<Eraser size={16} />
					<span>擦除</span>
				</button>
			</div>

			<div className="fg-actions">
				<button className="btn btn-ghost" onClick={reset}>
					<RotateCcw size={14} /> 重置
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>
					跳过
				</button>
			</div>

			{won && (
				<div className="fg-result win">
					<CheckCircle2 size={42} />
					<div className="fg-result-title">锻兵成！</div>
					<div className="fg-result-sub">{targetInfo.name} 已成，炉火纯青</div>
				</div>
			)}
			{lost && (
				<div className="fg-result lose">
					<div className="fg-result-title">炉火渐熄</div>
					<div className="fg-result-sub">未及成器，仍推进剧情</div>
				</div>
			)}
		</div>
	);
}
