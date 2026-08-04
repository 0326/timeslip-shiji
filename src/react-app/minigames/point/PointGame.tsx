// 点兵升将（Point）—— 物理合成小游戏（2048 风格，历史主题）
// 玩法：4×4 网格，方向键或滑动屏幕移动方块；两个相同等级的兵碰撞即合成升级。
//       合成路线：兵→什长→百夫→千户→校尉→偏将→上将，合成出「上将」即胜。
// 适配故事线：战争线通用（点兵升将，合兵为将）。
// ink 用法：
//   #minigame:point            → 开局
//   #minigame:point:3          → （预留参数，暂不改变规则）

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import type { TouchEvent as ReactTouchEvent } from "react";
import type { MinigameProps } from "../types";
import {
	RotateCcw,
	SkipForward,
	Crown,
	Skull,
	ChevronUp,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./point.css";

// ── 等级配置 ──
// 下标 0 = Lv1 兵，… 下标 6 = Lv7 上将（金色，胜利目标）
const RANKS = ["兵", "什长", "百夫", "千户", "校尉", "偏将", "上将"] as const;
const WIN_LEVEL = 7; // 合成出上将即胜利

const SIZE = 4;

type Dir = "up" | "down" | "left" | "right";
type GameStatus = "playing" | "won" | "lost";

interface Cell {
	val: number; // 0 = 空，1..7 = 等级
	r: number;
	c: number;
}

interface GameState {
	board: number[][];
	/** 本回合合成出的格子 "r-c" */
	merged: Set<string>;
	/** 本回合新生成的格子 "r-c" */
	spawned: Set<string>;
	moves: number;
	/** 战功（合成累加） */
	score: number;
	maxLevel: number;
	status: GameStatus;
}

// ── 纯函数：棋盘工具 ──
function emptyBoard(): number[][] {
	return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
}

function maxLevelOf(board: number[][]): number {
	let m = 0;
	for (let r = 0; r < SIZE; r++) {
		for (let c = 0; c < SIZE; c++) {
			if (board[r][c] > m) m = board[r][c];
		}
	}
	return m;
}

function boardsEqual(a: number[][], b: number[][]): boolean {
	for (let r = 0; r < SIZE; r++) {
		for (let c = 0; c < SIZE; c++) {
			if (a[r][c] !== b[r][c]) return false;
		}
	}
	return true;
}

/** 随机生成一个新方块：90% Lv1 兵，10% Lv2 什长 */
function spawnTile(board: number[][]): { board: number[][]; spawned: Set<string> } {
	const empties: { r: number; c: number }[] = [];
	for (let r = 0; r < SIZE; r++) {
		for (let c = 0; c < SIZE; c++) {
			if (board[r][c] === 0) empties.push({ r, c });
		}
	}
	if (empties.length === 0) return { board, spawned: new Set() };
	const pick = empties[Math.floor(Math.random() * empties.length)];
	const val = Math.random() < 0.9 ? 1 : 2;
	const next = board.map((row) => row.slice());
	next[pick.r][pick.c] = val;
	return { board: next, spawned: new Set([`${pick.r}-${pick.c}`]) };
}

/** 按方向构造“线”：每条线从“目标边”起顺序排列 */
function buildLines(board: number[][], dir: Dir): Cell[][] {
	const lines: Cell[][] = [];
	if (dir === "left") {
		for (let r = 0; r < SIZE; r++) {
			const line: Cell[] = [];
			for (let c = 0; c < SIZE; c++) line.push({ val: board[r][c], r, c });
			lines.push(line);
		}
	} else if (dir === "right") {
		for (let r = 0; r < SIZE; r++) {
			const line: Cell[] = [];
			for (let c = SIZE - 1; c >= 0; c--) line.push({ val: board[r][c], r, c });
			lines.push(line);
		}
	} else if (dir === "up") {
		for (let c = 0; c < SIZE; c++) {
			const line: Cell[] = [];
			for (let r = 0; r < SIZE; r++) line.push({ val: board[r][c], r, c });
			lines.push(line);
		}
	} else {
		// down
		for (let c = 0; c < SIZE; c++) {
			const line: Cell[] = [];
			for (let r = SIZE - 1; r >= 0; r--) line.push({ val: board[r][c], r, c });
			lines.push(line);
		}
	}
	return lines;
}

/** 将一条线向 index 0 方向滑动并合并；返回新线与“合成槽位”下标 */
function slideLine(line: Cell[]): { line: Cell[]; mergeSlots: number[] } {
	const n = line.length;
	const filtered = line.filter((cell) => cell.val !== 0);
	const result: Cell[] = [];
	const mergeSlots: number[] = [];
	let i = 0;
	while (i < filtered.length) {
		const a = filtered[i];
		const b = filtered[i + 1];
		if (b !== undefined && a.val === b.val && a.val < WIN_LEVEL) {
			const slotIdx = result.length;
			result.push({ val: a.val + 1, r: line[slotIdx].r, c: line[slotIdx].c });
			mergeSlots.push(slotIdx);
			i += 2;
		} else {
			const slotIdx = result.length;
			result.push({ val: a.val, r: line[slotIdx].r, c: line[slotIdx].c });
			i += 1;
		}
	}
	while (result.length < n) {
		const slotIdx = result.length;
		result.push({ val: 0, r: line[slotIdx].r, c: line[slotIdx].c });
	}
	return { line: result, mergeSlots };
}

/** 执行一次移动；返回新棋盘、是否移动、合成格集合、战功增量 */
function applyMove(
	board: number[][],
	dir: Dir,
): { newBoard: number[][]; moved: boolean; merged: Set<string>; gained: number } {
	const lines = buildLines(board, dir);
	const newBoard = emptyBoard();
	const merged = new Set<string>();
	let gained = 0;
	for (const line of lines) {
		const { line: slid, mergeSlots } = slideLine(line);
		slid.forEach((cell, k) => {
			newBoard[cell.r][cell.c] = cell.val;
			if (mergeSlots.includes(k) && cell.val > 0) {
				merged.add(`${cell.r}-${cell.c}`);
				gained += cell.val;
			}
		});
	}
	const moved = !boardsEqual(board, newBoard);
	return { newBoard, moved, merged, gained };
}

/** 是否无可移动：无空格且无相邻同等级 */
function isGameOver(board: number[][]): boolean {
	for (let r = 0; r < SIZE; r++) {
		for (let c = 0; c < SIZE; c++) {
			if (board[r][c] === 0) return false;
			if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return false;
			if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return false;
		}
	}
	return true;
}

function createInitialState(): GameState {
	let b = emptyBoard();
	b = spawnTile(b).board;
	b = spawnTile(b).board;
	return {
		board: b,
		merged: new Set(),
		spawned: new Set(),
		moves: 0,
		score: 0,
		maxLevel: maxLevelOf(b),
		status: "playing",
	};
}

export function PointGame({ onComplete, onSkip }: MinigameProps) {
	const [state, setState] = useState<GameState>(createInitialState);

	// 用 ref 读取“终局时”的最新最高阶，避免在 effect 依赖里加入每步变化的 maxLevel
	const maxLevelRef = useRef(state.maxLevel);
	maxLevelRef.current = state.maxLevel;

	const handleMove = useCallback((dir: Dir) => {
		setState((prev) => {
			if (prev.status !== "playing") return prev;
			const { newBoard, moved, merged, gained } = applyMove(prev.board, dir);
			if (!moved) return prev;
			const { board: spawnedBoard, spawned } = spawnTile(newBoard);
			const maxLevel = maxLevelOf(spawnedBoard);
			let status: GameStatus = prev.status;
			if (maxLevel >= WIN_LEVEL) status = "won";
			else if (isGameOver(spawnedBoard)) status = "lost";
			return {
				board: spawnedBoard,
				merged,
				spawned,
				moves: prev.moves + 1,
				score: prev.score + gained,
				maxLevel,
				status,
			};
		});
	}, []);

	// 键盘控制：方向键 / WASD
	useEffect(() => {
		const keyMap: Record<string, Dir> = {
			ArrowUp: "up",
			ArrowDown: "down",
			ArrowLeft: "left",
			ArrowRight: "right",
			w: "up",
			s: "down",
			a: "left",
			d: "right",
			W: "up",
			S: "down",
			A: "left",
			D: "right",
		};
		function onKey(e: KeyboardEvent) {
			const dir = keyMap[e.key];
			if (!dir) return;
			e.preventDefault();
			handleMove(dir);
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [handleMove]);

	// 终局回调
	useEffect(() => {
		if (state.status !== "won" && state.status !== "lost") return;
		const isWin = state.status === "won";
		const score = isWin ? 100 : Math.round((maxLevelRef.current / WIN_LEVEL) * 100);
		const t = setTimeout(() => onComplete({ result: isWin ? "win" : "lose", score }), 1500);
		return () => clearTimeout(t);
	}, [state.status, onComplete]);

	// 音效：移动 / 合成 / 胜负
	const prevMovesRef = useRef(state.moves);
	const prevStatusRef = useRef(state.status);
	useEffect(() => {
		if (state.moves !== prevMovesRef.current) {
			sfx.play("slide");
			if (state.merged.size > 0) sfx.play("merge");
			prevMovesRef.current = state.moves;
		}
		if (state.status !== prevStatusRef.current) {
			if (state.status === "won") sfx.play("win");
			else if (state.status === "lost") sfx.play("lose");
			prevStatusRef.current = state.status;
		}
	}, [state.moves, state.merged, state.status]);

	// 触屏滑动控制
	const touchStart = useRef<{ x: number; y: number } | null>(null);
	const onTouchStart = useCallback((e: ReactTouchEvent) => {
		const t = e.touches[0];
		touchStart.current = { x: t.clientX, y: t.clientY };
	}, []);
	const onTouchEnd = useCallback(
		(e: ReactTouchEvent) => {
			const start = touchStart.current;
			if (!start) return;
			const t = e.changedTouches[0];
			const dx = t.clientX - start.x;
			const dy = t.clientY - start.y;
			const absX = Math.abs(dx);
			const absY = Math.abs(dy);
			touchStart.current = null;
			if (Math.max(absX, absY) < 24) return;
			if (absX > absY) handleMove(dx > 0 ? "right" : "left");
			else handleMove(dy > 0 ? "down" : "up");
		},
		[handleMove],
	);

	const handleReset = useCallback(() => {
		sfx.resetCombo();
		setState(createInitialState());
	}, []);

	const maxRankName = state.maxLevel >= 1 ? RANKS[state.maxLevel - 1] : "—";

	return (
		<div className="pt-root">
			<div className="pt-hud">
				<div className="pt-title-wrap">
					<div className="pt-title serif">点兵升将</div>
					<div className="pt-subtag">目标：合成「上将」</div>
				</div>
				<div className="pt-stats">
					<span>
						战功 <b>{state.score}</b>
					</span>
					<span>·</span>
					<span>
						步数 <b>{state.moves}</b>
					</span>
					<span>·</span>
					<span>
						最高 <b>{maxRankName}</b>
					</span>
				</div>
			</div>

			<p className="pt-hint">
				点兵升将，合兵为将。方向键或滑动屏幕移动方块，相同等级碰撞即合成更高阶武将。
			</p>

			<div className="pt-legend" aria-label="升级路线">
				{RANKS.map((name, i) => (
					<Fragment key={i}>
						<span className={`pt-leg pt-leg-lv${i + 1}`}>{name}</span>
						{i < RANKS.length - 1 && <span className="pt-leg-arrow">›</span>}
					</Fragment>
				))}
			</div>

			<div
				className="pt-board"
				onTouchStart={onTouchStart}
				onTouchEnd={onTouchEnd}
				role="grid"
				aria-label="点兵升将棋盘"
			>
				{state.board.map((row, r) =>
					row.map((val, c) => {
						const key = `${r}-${c}`;
						const isMerged = state.merged.has(key);
						const isSpawned = state.spawned.has(key);
						return (
							<div className="pt-cell" key={key} role="gridcell">
								{val > 0 && (
									<div
										className={[
											"pt-tile",
											`pt-lv${val}`,
											isMerged ? "pt-merge" : "",
											isSpawned ? "pt-new" : "",
										]
											.filter(Boolean)
											.join(" ")}
									>
										<span className="pt-rank">{RANKS[val - 1]}</span>
									</div>
								)}
							</div>
						);
					}),
				)}
			</div>

			<div className="pt-controls">
				<div className="pt-dpad" aria-label="方向控制">
					<button
						type="button"
						className="pt-dpad-btn pt-up"
						aria-label="向上"
						onClick={() => handleMove("up")}
					>
						<ChevronUp size={18} />
					</button>
					<button
						type="button"
						className="pt-dpad-btn pt-left"
						aria-label="向左"
						onClick={() => handleMove("left")}
					>
						<ChevronLeft size={18} />
					</button>
					<button
						type="button"
						className="pt-dpad-btn pt-right"
						aria-label="向右"
						onClick={() => handleMove("right")}
					>
						<ChevronRight size={18} />
					</button>
					<button
						type="button"
						className="pt-dpad-btn pt-down"
						aria-label="向下"
						onClick={() => handleMove("down")}
					>
						<ChevronDown size={18} />
					</button>
				</div>

				<div className="pt-actions">
					<button type="button" className="btn btn-ghost" onClick={handleReset}>
						<RotateCcw size={14} /> 重开
					</button>
					<button type="button" className="btn btn-ghost" onClick={onSkip}>
						<SkipForward size={14} /> 跳过
					</button>
				</div>
			</div>

			{state.status === "won" && (
				<div className="pt-win">
					<div className="pt-win-rays" aria-hidden />
					<Crown size={48} />
					<div className="pt-win-title">拜将登坛</div>
					<div className="pt-win-sub">
						上将既出，三军可夺帅。共 {state.moves} 步 · 战功 {state.score}
					</div>
				</div>
			)}

			{state.status === "lost" && (
				<div className="pt-lose">
					<Skull size={44} />
					<div className="pt-lose-title">兵败山倒</div>
					<div className="pt-lose-sub">
						进退无路，再无合兵之机。最高：{maxRankName}
					</div>
				</div>
			)}
		</div>
	);
}
