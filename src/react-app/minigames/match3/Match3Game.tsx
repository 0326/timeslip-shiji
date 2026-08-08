// 涿鹿珠阵（Match-3）—— 三消通关小游戏
// 6×7 棋盘，6 种中式色彩玉珠：青玉/朱砂/玄墨/黄土/白骨/紫雾
// 蚩尤布「九黎玉珠阵」作雾困军，玩家连缀同色玉珠破阵，破阵成功=指南车辨向。
// 玩法：点击一颗珠子，再点击相邻珠子交换；连成 3+ 同色消除。
//
// 3 关对应涿鹿之战三阶段：
//   1. 破雾 —— 限 15 步，消除 8 颗「紫雾珠」
//   2. 指南 —— 限 20 步，达成 1 次 4 连
//   3. 擒蚩 —— 限 25 步，消除 10 颗「玄墨珠」并达成 1 次 5 连

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./match3.css";

// ── 珠子类型 ──
// 0 青玉 / 1 朱砂 / 2 玄墨 / 3 黄土 / 4 白骨 / 5 紫雾
const GEM_COUNT = 6;
const GEM_NAMES = ["青玉", "朱砂", "玄墨", "黄土", "白骨", "紫雾"];
const GEM_CLASSES = ["m3-jade", "m3-cinnabar", "m3-ink", "m3-earth", "m3-bone", "m3-fog"];

const COLS = 6;
const ROWS = 7;

type Cell = number | null;
type Board = Cell[][];

interface LevelDef {
	id: string;
	name: string;
	desc: string;
	maxMoves: number;
	/** 目标：消除指定类型珠子的数量 */
	clearTarget?: { type: number; count: number };
	/** 目标：达成 N 连及以上次数 */
	comboTarget?: { len: number; count: number };
}

const LEVELS: Record<string, LevelDef> = {
	zhuolu_1: {
		id: "zhuolu_1",
		name: "破雾",
		desc: "蚩尤作大雾，紫雾珠遍布阵中。消除 8 颗紫雾珠，雾阵可破。",
		maxMoves: 15,
		clearTarget: { type: 5, count: 8 },
	},
	zhuolu_2: {
		id: "zhuolu_2",
		name: "指南",
		desc: "风后造指南车。达成 1 次 4 连，可激活指南车破雾定向。",
		maxMoves: 20,
		comboTarget: { len: 4, count: 1 },
	},
	zhuolu_3: {
		id: "zhuolu_3",
		name: "擒蚩",
		desc: "雾散之际，擒杀蚩尤。消除 10 颗玄墨珠并达成 1 次 5 连。",
		maxMoves: 25,
		clearTarget: { type: 2, count: 10 },
		comboTarget: { len: 5, count: 1 },
	},
};

// ── 工具函数 ──

/** 生成不与左侧/上方形成 3 连的随机珠子 */
function randomGem(board: Board, col: number, row: number): number {
	let g: number;
	let tries = 0;
	do {
		g = Math.floor(Math.random() * GEM_COUNT);
		tries++;
		// 避免左侧两颗同色
		if (col >= 2 && board[row][col - 1] === g && board[row][col - 2] === g) continue;
		// 避免上方两颗同色
		if (row >= 2 && board[row - 1][col] === g && board[row - 2][col] === g) continue;
		return g;
	} while (tries < 20);
	return g;
}

/** 生成初始棋盘，保证无初始 3 连 */
function genBoard(): Board {
	const board: Board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
	for (let r = 0; r < ROWS; r++) {
		for (let c = 0; c < COLS; c++) {
			board[r][c] = randomGem(board, c, r);
		}
	}
	return board;
}

/** 检测并返回所有应消除的格子坐标集合 */
function findMatches(board: Board): Set<string> {
	const matched = new Set<string>();
	// 横向
	for (let r = 0; r < ROWS; r++) {
		let runStart = 0;
		for (let c = 1; c <= COLS; c++) {
			const prev = board[r][c - 1];
			const cur = c < COLS ? board[r][c] : null;
			if (cur === null || prev === null || cur !== prev) {
				const runLen = c - runStart;
				if (runLen >= 3 && prev !== null) {
					for (let k = runStart; k < c; k++) matched.add(`${r},${k}`);
				}
				runStart = c;
			}
		}
	}
	// 纵向
	for (let c = 0; c < COLS; c++) {
		let runStart = 0;
		for (let r = 1; r <= ROWS; r++) {
			const prev = board[r - 1][c];
			const cur = r < ROWS ? board[r][c] : null;
			if (cur === null || prev === null || cur !== prev) {
				const runLen = r - runStart;
				if (runLen >= 3 && prev !== null) {
					for (let k = runStart; k < r; k++) matched.add(`${k},${c}`);
				}
				runStart = r;
			}
		}
	}
	return matched;
}

/** 找出最长的匹配长度（用于 combo 目标判定） */
function maxRunLength(board: Board): number {
	let max = 0;
	// 横向
	for (let r = 0; r < ROWS; r++) {
		let run = 1;
		for (let c = 1; c < COLS; c++) {
			if (board[r][c] !== null && board[r][c] === board[r][c - 1]) {
				run++;
			} else {
				if (run > max) max = run;
				run = 1;
			}
		}
		if (run > max) max = run;
	}
	// 纵向
	for (let c = 0; c < COLS; c++) {
		let run = 1;
		for (let r = 1; r < ROWS; r++) {
			if (board[r][c] !== null && board[r][c] === board[r - 1][c]) {
				run++;
			} else {
				if (run > max) max = run;
				run = 1;
			}
		}
		if (run > max) max = run;
	}
	return max;
}

/** 消除并下落补充，返回新棋盘与本次消除的各类型计数 */
function collapse(board: Board, matched: Set<string>): { board: Board; cleared: number[] } {
	const cleared: number[] = new Array(GEM_COUNT).fill(0);
	const next: Board = board.map((row) => [...row]);
	// 标记消除
	for (const key of matched) {
		const [r, c] = key.split(",").map(Number);
		const v = next[r][c];
		if (v !== null) cleared[v]++;
		next[r][c] = null;
	}
	// 下落
	for (let c = 0; c < COLS; c++) {
		let writeRow = ROWS - 1;
		for (let r = ROWS - 1; r >= 0; r--) {
			if (next[r][c] !== null) {
				if (r !== writeRow) {
					next[writeRow][c] = next[r][c];
					next[r][c] = null;
				}
				writeRow--;
			}
		}
		// 顶部补充
		for (let r = writeRow; r >= 0; r--) {
			next[r][c] = Math.floor(Math.random() * GEM_COUNT);
		}
	}
	return { board: next, cleared };
}

export function Match3Game({ param, storyKey, onComplete, onSkip }: MinigameProps) {
	// 关卡选择：param 优先（zhuolu_1/2/3）；默认第一关
	const initialLevel = useMemo(() => {
		if (param && LEVELS[param]) return param;
		// storyKey 以 huangdi 开头 → 涿鹿三连关从第一关起
		if (storyKey?.startsWith("huangdi")) return "zhuolu_1";
		return "zhuolu_1";
	}, [param, storyKey]);

	const level = LEVELS[initialLevel] ?? LEVELS.zhuolu_1;
	const [board, setBoard] = useState<Board>(() => genBoard());
	const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
	const [moves, setMoves] = useState(0);
	const [clearedByType, setClearedByType] = useState<number[]>(() => new Array(GEM_COUNT).fill(0));
	const [maxComboHit, setMaxComboHit] = useState(0);
	const [busy, setBusy] = useState(false);
	const [won, setWon] = useState(false);
	const [lost, setLost] = useState(false);
	const swapLockRef = useRef(false);

	// 检查胜利条件
	const checkWin = useCallback(
		(_b: Board, cleared: number[], combo: number) => {
			let ok = true;
			if (level.clearTarget) {
				if (cleared[level.clearTarget.type] < level.clearTarget.count) ok = false;
			}
			if (level.comboTarget) {
				if (combo < level.comboTarget.len) ok = false;
			}
			return ok;
		},
		[level],
	);

	// 连锁消除：消除匹配 → 下落补充 → 再检测，直到无匹配
	const resolveBoard = useCallback(
		async (startBoard: Board, accumulatedCleared: number[]) => {
			let cur = startBoard;
			let cleared = [...accumulatedCleared];
			let combo = 0;
			// 循环消除
			for (let iter = 0; iter < 10; iter++) {
				const matched = findMatches(cur);
				if (matched.size === 0) break;
				combo = Math.max(combo, maxRunLength(cur));
				const res = collapse(cur, matched);
				if (iter === 0) sfx.play("pop");
				else sfx.play("combo");
				cur = res.board;
				cleared = cleared.map((v, i) => v + res.cleared[i]);
				// 更新状态以驱动渲染
				setBoard(cur.map((row) => [...row]));
				setClearedByType([...cleared]);
				if (combo > 0) setMaxComboHit((prev) => Math.max(prev, combo));
				// 短暂延时让玩家看到消除动画
				await new Promise((r) => setTimeout(r, 220));
			}
			return { board: cur, cleared, combo };
		},
		[],
	);

	// 尝试交换两格
	const trySwap = useCallback(
		async (r1: number, c1: number, r2: number, c2: number) => {
			if (swapLockRef.current || won || lost) return;
			// 必须相邻
			if (Math.abs(r1 - r2) + Math.abs(c1 - c2) !== 1) return;
			swapLockRef.current = true;
			setBusy(true);

			const swapped: Board = board.map((row) => [...row]);
			const tmp = swapped[r1][c1];
			swapped[r1][c1] = swapped[r2][c2];
			swapped[r2][c2] = tmp;
			setBoard(swapped);

			// 检测是否产生匹配；无匹配则回退
			const matched = findMatches(swapped);
			if (matched.size === 0) {
				// 回退
				await new Promise((r) => setTimeout(r, 150));
				setBoard(board.map((row) => [...row]));
				sfx.play("wrong");
				swapLockRef.current = false;
				setBusy(false);
				return;
			}

			// 消耗一步
			const nextMoves = moves + 1;
			setMoves(nextMoves);

			// 连锁消除
			const { board: finalBoard, cleared, combo } = await resolveBoard(swapped, [
				...clearedByType,
			]);
			// resolveBoard 内部为动画已更新 clearedByType，此处以返回值覆盖确保精确
			setClearedByType(cleared);
			if (combo > 0) setMaxComboHit((prev) => Math.max(prev, combo));

			// 胜利判定
			if (checkWin(finalBoard, cleared, combo)) {
				setWon(true);
				sfx.play("win");
				swapLockRef.current = false;
				setBusy(false);
				return;
			}
			// 失败判定（步数耗尽且未达成目标）
			if (nextMoves >= level.maxMoves) {
				setLost(true);
				sfx.play("lose");
				swapLockRef.current = false;
				setBusy(false);
				return;
			}
			swapLockRef.current = false;
			setBusy(false);
		},
		[board, moves, won, lost, clearedByType, level, resolveBoard, checkWin],
	);

	// 胜利后自动回调
	useEffect(() => {
		if (won) {
			const remain = level.maxMoves - moves;
			const ratio = remain / level.maxMoves;
			const score = Math.round(60 + ratio * 40); // 60-100
			const t = setTimeout(() => onComplete({ result: "win", score }), 900);
			return () => clearTimeout(t);
		}
	}, [won, moves, level, onComplete]);

	// 失败后自动回调（仍推进剧情，result=lose）
	useEffect(() => {
		if (lost) {
			const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1500);
			return () => clearTimeout(t);
		}
	}, [lost, onComplete]);

	function reset() {
		setBoard(genBoard());
		setSelected(null);
		setMoves(0);
		setClearedByType(new Array(GEM_COUNT).fill(0));
		setMaxComboHit(0);
		setBusy(false);
		setWon(false);
		setLost(false);
		swapLockRef.current = false;
		sfx.resetCombo();
	}

	function onCellClick(r: number, c: number) {
		if (busy || won || lost) return;
		if (!selected) {
			setSelected({ r, c });
			return;
		}
		if (selected.r === r && selected.c === c) {
			setSelected(null);
			return;
		}
		// 相邻则交换，否则改选
		const dist = Math.abs(selected.r - r) + Math.abs(selected.c - c);
		if (dist === 1) {
			void trySwap(selected.r, selected.c, r, c);
			setSelected(null);
		} else {
			setSelected({ r, c });
		}
	}

	// 进度文案
	const progressText = useMemo(() => {
		const parts: string[] = [];
		if (level.clearTarget) {
			const have = clearedByType[level.clearTarget.type] ?? 0;
			parts.push(`${GEM_NAMES[level.clearTarget.type]} ${have}/${level.clearTarget.count}`);
		}
		if (level.comboTarget) {
			parts.push(`${level.comboTarget.len}连 ${Math.min(maxComboHit, level.comboTarget.len) >= level.comboTarget.len ? 1 : 0}/${level.comboTarget.count}`);
		}
		return parts.join(" · ");
	}, [level, clearedByType, maxComboHit]);

	return (
		<div className="m3-root">
			<div className="m3-hud">
				<div className="m3-level">{level.name}</div>
				<div className="m3-stats">
					<span>步数 {moves}/{level.maxMoves}</span>
					<span>·</span>
					<span>{progressText}</span>
				</div>
			</div>

			<div className="m3-wrap">
				<div className="m3-board">
					{board.map((row, r) =>
						row.map((gem, c) => {
							const isSel = selected?.r === r && selected?.c === c;
							return (
								<button
									key={`${r}-${c}`}
									className={[
										"m3-cell",
										gem !== null ? GEM_CLASSES[gem] : "",
										isSel ? "selected" : "",
									].filter(Boolean).join(" ")}
									onClick={() => onCellClick(r, c)}
									disabled={busy || won || lost}
									aria-label={gem !== null ? GEM_NAMES[gem] : "空"}
								>
									{gem !== null && <span className="m3-gem" />}
								</button>
							);
						}),
					)}
				</div>
			</div>

			<div className="m3-legend">
				{GEM_NAMES.map((n, i) => (
					<span key={n} className="m3-legend-item">
						<span className={`m3-gem-mini ${GEM_CLASSES[i]}`} />
						{n}
					</span>
				))}
			</div>

			<div className="m3-actions">
				<button className="btn btn-ghost" onClick={reset}>
					<RotateCcw size={14} /> 重置
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>
					跳过
				</button>
			</div>

			{won && (
				<div className="m3-result win">
					<CheckCircle2 size={42} />
					<div className="m3-result-title">破阵成功！</div>
					<div className="m3-result-sub">指南车辨向，雾散擒蚩</div>
				</div>
			)}
			{lost && (
				<div className="m3-result lose">
					<div className="m3-result-title">雾阵未破</div>
					<div className="m3-result-sub">步数耗尽，仍推进剧情</div>
				</div>
			)}
		</div>
	);
}
