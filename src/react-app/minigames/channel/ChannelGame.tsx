// 治水疏渠（Channel）—— 管道拼接通关小游戏
// 大禹治水，改堵为疏。玩家旋转管道方块，将水从源头引导到大海。
// 玩法：点击方块旋转 90°；BFS 判断从水源 (0,0) 到大海 (n-1,n-1) 是否连通。
// 3 关对应大禹治水三阶段：
//   1. 导流初成（3×3，简单路径）
//   2. 九曲通海（4×4，多弯道）
//   3. 九州疏渠（5×5，有山石障碍）
// param 可传 "1"/"2"/"3" 或 "channel_1"/"channel_2"/"channel_3"，默认第 1 关。

import { useEffect, useMemo, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./channel.css";

// ── 方向定义 ──
// 0=N(上)  1=E(右)  2=S(下)  3=W(左)
const DIRS: Array<[number, number]> = [
	[-1, 0], // N
	[0, 1], // E
	[1, 0], // S
	[0, -1], // W
];

type CellType = "source" | "sea" | "I" | "L" | "X" | "empty" | "rock";

interface Cell {
	type: CellType;
	/** 旋转角度 0/90/180/270，仅对 I/L/X 生效 */
	rotation: number;
}

interface LevelDef {
	id: string;
	name: string;
	desc: string;
	size: number;
	cells: Cell[][];
	maxTime: number;
}

// ── 管道开口方向（rotation=0 时） ──
// I 型直管：上-下贯通
// L 型弯管：上-右弯曲
// X 型十字：四向贯通
// source/sea 视为全向开口，empty/rock 无开口
function baseOpenings(type: CellType): number[] {
	switch (type) {
		case "source":
		case "sea":
		case "X":
			return [0, 1, 2, 3];
		case "I":
			return [0, 2];
		case "L":
			return [0, 1];
		case "empty":
		case "rock":
		default:
			return [];
	}
}

// 计算管道在当前旋转角度下的开口方向集合
function getOpenings(cell: Cell): Set<number> {
	if (cell.type === "empty" || cell.type === "rock") return new Set();
	const base = baseOpenings(cell.type);
	const rot = Math.round(cell.rotation / 90) % 4;
	return new Set(base.map((d) => (d + rot) % 4));
}

// BFS：从水源 (0,0) 出发，返回所有被水充盈的格子坐标集合
// 规则：当前格在方向 d 上有开口，且邻居在反方向 (d+2)%4 上有开口，水才能流入邻居
function bfsWater(cells: Cell[][], size: number): Set<string> {
	const visited = new Set<string>();
	const queue: Array<[number, number]> = [[0, 0]];
	visited.add("0,0");
	while (queue.length > 0) {
		const [r, c] = queue.shift()!;
		const openings = getOpenings(cells[r][c]);
		for (const d of openings) {
			const [dr, dc] = DIRS[d];
			const nr = r + dr;
			const nc = c + dc;
			if (nr < 0 || nr >= size || nc < 0 || nc >= size) continue;
			const key = `${nr},${nc}`;
			if (visited.has(key)) continue;
			const opposite = (d + 2) % 4;
			const neighborOpenings = getOpenings(cells[nr][nc]);
			if (neighborOpenings.has(opposite)) {
				visited.add(key);
				queue.push([nr, nc]);
			}
		}
	}
	return visited;
}

// ── 关卡数据 ──
// 每关的管道初始旋转均为"距正确朝向 1 次旋转"，保证有解且需要思考。
const LEVELS: Record<string, LevelDef> = {
	// 第 1 关：3×3，路径 (0,0)→(0,1)→(0,2)→(1,2)→(2,2)
	// 解法：每节管道各旋转 1 次（共 3 次）
	channel_1: {
		id: "channel_1",
		name: "导流初成",
		desc: "初识疏导——旋转几节管道，将水从源头引到大海。",
		size: 3,
		maxTime: 90,
		cells: [
			[
				{ type: "source", rotation: 0 },
				{ type: "I", rotation: 0 },
				{ type: "L", rotation: 90 },
			],
			[
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "I", rotation: 270 },
			],
			[
				{ type: "empty", rotation: 0 },
				{ type: "rock", rotation: 0 },
				{ type: "sea", rotation: 0 },
			],
		],
	},
	// 第 2 关：4×4，路径 (0,0)→(0,1)→(1,1)→(1,2)→(1,3)→(2,3)→(3,3)
	// 解法：每节管道各旋转 1 次（共 5 次）
	channel_2: {
		id: "channel_2",
		name: "九曲通海",
		desc: "河道迂回——多拐几道弯，方能引水入海。",
		size: 4,
		maxTime: 90,
		cells: [
			[
				{ type: "source", rotation: 0 },
				{ type: "L", rotation: 90 },
				{ type: "empty", rotation: 0 },
				{ type: "rock", rotation: 0 },
			],
			[
				{ type: "rock", rotation: 0 },
				{ type: "L", rotation: 270 },
				{ type: "I", rotation: 0 },
				{ type: "L", rotation: 90 },
			],
			[
				{ type: "empty", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "rock", rotation: 0 },
				{ type: "I", rotation: 270 },
			],
			[
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "sea", rotation: 0 },
			],
		],
	},
	// 第 3 关：5×5，路径 (0,0)→(1,0)→(1,1)→(1,2)→(2,2)→(3,2)→(3,3)→(3,4)→(4,4)
	// 解法：每节管道各旋转 1 次（共 7 次），有山石障碍
	channel_3: {
		id: "channel_3",
		name: "九州疏渠",
		desc: "山石阻塞——绕过障碍，疏通千里长渠入海。",
		size: 5,
		maxTime: 90,
		cells: [
			[
				{ type: "source", rotation: 0 },
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
			],
			[
				{ type: "L", rotation: 270 },
				{ type: "I", rotation: 0 },
				{ type: "L", rotation: 90 },
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
			],
			[
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "I", rotation: 270 },
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
			],
			[
				{ type: "empty", rotation: 0 },
				{ type: "rock", rotation: 0 },
				{ type: "L", rotation: 270 },
				{ type: "I", rotation: 0 },
				{ type: "L", rotation: 90 },
			],
			[
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "rock", rotation: 0 },
				{ type: "empty", rotation: 0 },
				{ type: "sea", rotation: 0 },
			],
		],
	},
};

type Phase = "playing" | "won" | "lost";

// ── 管道 SVG 形状 ──
// 以 rotation=0 为基准绘制，外层 .ch-pipe-rotate 通过 transform 旋转
function PipeShape({ type }: { type: CellType }) {
	const sw = 18;
	if (type === "I") {
		return (
			<svg viewBox="0 0 64 64" className="ch-pipe-svg" aria-hidden>
				<line x1="32" y1="0" x2="32" y2="64" strokeWidth={sw} />
			</svg>
		);
	}
	if (type === "L") {
		return (
			<svg viewBox="0 0 64 64" className="ch-pipe-svg" aria-hidden>
				<path d="M 32 0 L 32 32 L 64 32" strokeWidth={sw} strokeLinejoin="round" fill="none" />
			</svg>
		);
	}
	if (type === "X") {
		return (
			<svg viewBox="0 0 64 64" className="ch-pipe-svg" aria-hidden>
				<line x1="32" y1="0" x2="32" y2="64" strokeWidth={sw} />
				<line x1="0" y1="32" x2="64" y2="32" strokeWidth={sw} />
			</svg>
		);
	}
	return null;
}

export function ChannelGame({ param, storyKey, onComplete, onSkip }: MinigameProps) {
	// 关卡选择：param 优先（"1"/"2"/"3" 或 "channel_1"/"channel_2"/"channel_3"）
	const levelKey = useMemo(() => {
		if (param) {
			if (LEVELS[param]) return param;
			const key = `channel_${param}`;
			if (LEVELS[key]) return key;
		}
		if (storyKey?.startsWith("dayu")) return "channel_1";
		return "channel_1";
	}, [param, storyKey]);

	const level = LEVELS[levelKey] ?? LEVELS.channel_1;
	const [cells, setCells] = useState<Cell[][]>(() =>
		level.cells.map((row) => row.map((c) => ({ ...c }))),
	);
	const [moves, setMoves] = useState(0);
	const [timeLeft, setTimeLeft] = useState(level.maxTime);
	const [phase, setPhase] = useState<Phase>("playing");

	// BFS 计算水流充盈的格子
	const waterCells = useMemo(() => bfsWater(cells, level.size), [cells, level.size]);
	const seaKey = `${level.size - 1},${level.size - 1}`;
	const reached = waterCells.has(seaKey);

	// 胜利判定：水流到达大海
	useEffect(() => {
		if (phase !== "playing") return;
		if (reached) {
			sfx.play("match");
			setPhase("won");
		}
	}, [reached, phase]);

	// 倒计时
	useEffect(() => {
		if (phase !== "playing") return;
		if (reached) return;
		if (timeLeft <= 0) {
			setPhase("lost");
			return;
		}
		const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
		return () => clearTimeout(id);
	}, [phase, timeLeft, reached]);

	// 结局回调
	useEffect(() => {
		if (phase === "won") {
			sfx.play("win");
			const score = Math.max(60, Math.min(100, 60 + Math.round((timeLeft / level.maxTime) * 40)));
			const t = setTimeout(() => onComplete({ result: "win", score }), 1300);
			return () => clearTimeout(t);
		}
		if (phase === "lost") {
			sfx.play("lose");
			const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1500);
			return () => clearTimeout(t);
		}
	}, [phase, timeLeft, level.maxTime, onComplete]);

	function rotateCell(r: number, c: number) {
		if (phase !== "playing") return;
		const cell = cells[r][c];
		if (cell.type !== "I" && cell.type !== "L" && cell.type !== "X") return;
		sfx.play("flip");
		setCells((prev) => {
			const cur = prev[r][c];
			const next = prev.map((row) => row.map((cc) => ({ ...cc })));
			next[r][c] = { ...cur, rotation: (cur.rotation + 90) % 360 };
			return next;
		});
		setMoves((m) => m + 1);
	}

	function reset() {
		sfx.resetCombo();
		setCells(level.cells.map((row) => row.map((c) => ({ ...c }))));
		setMoves(0);
		setTimeLeft(level.maxTime);
		setPhase("playing");
	}

	const lowTime = timeLeft <= 15;

	return (
		<div className="ch-root">
			<div className="ch-hud">
				<div className="ch-title-wrap">
					<div className="ch-title serif">{level.name}</div>
					<div className="ch-subtitle">大禹治水 · 改堵为疏</div>
				</div>
				<div className="ch-stats">
					<span className={`ch-timer ${lowTime ? "ch-timer-low" : ""}`}>
						<Clock size={14} />
						{timeLeft}s
					</span>
					<span className="ch-stat">旋 {moves}</span>
				</div>
			</div>

			<p className="ch-hint">{level.desc}</p>

			<div className="ch-board-wrap">
				<div
					className="ch-board"
					style={{
						gridTemplateColumns: `repeat(${level.size}, var(--ch-cell, 64px))`,
						gridTemplateRows: `repeat(${level.size}, var(--ch-cell, 64px))`,
					}}
				>
					{cells.map((row, r) =>
						row.map((cell, c) => {
							const key = `${r},${c}`;
							const hasWater = waterCells.has(key);
							const isSource = cell.type === "source";
							const isSea = cell.type === "sea";
							const isPipe = cell.type === "I" || cell.type === "L" || cell.type === "X";
							const clickable = isPipe && phase === "playing";
							return (
								<button
									key={key}
									type="button"
									className={[
										"ch-cell",
										`ch-type-${cell.type}`,
										hasWater ? "ch-filled" : "",
										isSea && hasWater ? "ch-sea-active" : "",
										clickable ? "ch-clickable" : "",
									]
										.filter(Boolean)
										.join(" ")}
									onClick={() => rotateCell(r, c)}
									disabled={!clickable}
									aria-label={`格子 ${r + 1}-${c + 1}`}
								>
									{isPipe && (
										<div
											className="ch-pipe-rotate"
											style={{ transform: `rotate(${cell.rotation}deg)` }}
										>
											<PipeShape type={cell.type} />
										</div>
									)}
									{isSource && <span className="ch-source-mark serif">源</span>}
									{isSea && <span className="ch-sea-mark serif">海</span>}
									{cell.type === "rock" && <span className="ch-rock-mark" />}
								</button>
							);
						}),
					)}
				</div>
			</div>

			<div className="ch-legend">
				<span className="ch-legend-item">
					<span className="ch-legend-swatch ch-legend-source" /> 水源
				</span>
				<span className="ch-legend-item">
					<span className="ch-legend-swatch ch-legend-sea" /> 大海
				</span>
				<span className="ch-legend-item">
					<span className="ch-legend-swatch ch-legend-pipe" /> 管道
				</span>
				<span className="ch-legend-item">
					<span className="ch-legend-swatch ch-legend-water" /> 水流
				</span>
			</div>

			<div className="ch-actions">
				<button className="btn btn-ghost" onClick={reset}>
					<RotateCcw size={14} /> 重置
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>
					跳过
				</button>
			</div>

			{phase === "won" && (
				<div className="ch-result ch-win">
					<CheckCircle2 size={42} />
					<div className="ch-result-title">水到渠成</div>
					<div className="ch-result-sub">大禹疏导之功，洪水东入于海</div>
				</div>
			)}
			{phase === "lost" && (
				<div className="ch-result ch-lose">
					<div className="ch-result-title">水势未平</div>
					<div className="ch-result-sub">时辰已尽，仍推进剧情</div>
				</div>
			)}
		</div>
	);
}
