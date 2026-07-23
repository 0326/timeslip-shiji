// 华容道（Klotski）—— 滑块通关小游戏
// 棋盘 4 列 × 5 行，出口在底部中间（第3、4列底部）。
// 目标：把"沛公"（2×2 大方块）滑到底部出口。
// 采用点击交互：点选棋子 → 点相邻空位方向移动（或再次点同方向）。
// 支持拖拽滑动（指针按下拖动到相邻空位）。

import { useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import "./klotski.css";
type PieceKind = "boss" | "v" | "h" | "1x1";

interface PieceDef {
	id: string;
	kind: PieceKind;
	label: string;
	/** 占几格宽/高 */
	w: number;
	h: number;
	/** 初始左上角 (col, row) 0-indexed */
	x: number;
	y: number;
	className?: string;
}

interface LevelDef {
	id: string;
	name: string;
	pieces: PieceDef[];
	/** 达到这一步数及以下视为高分 */
	parMoves: number;
}

// ── 关卡数据（按难度：易/中/难） ──
// 4 列 × 5 行，出口在底部中央（列1-2，行4底部）。
// 经典"横刀立马"为中关，"指挥若定"为易关，"兵分三路"为难关。
const LEVELS: Record<string, LevelDef> = {
	easy: {
		id: "easy",
		name: "近侍开路",
		parMoves: 24,
		pieces: [
			{ id: "boss", kind: "boss", label: "沛公", w: 2, h: 2, x: 1, y: 0, className: "pk-boss" },
			{ id: "zhang", kind: "v", label: "张飞", w: 1, h: 2, x: 0, y: 0, className: "pk-general" },
			{ id: "zhao", kind: "v", label: "赵云", w: 1, h: 2, x: 3, y: 0, className: "pk-general" },
			{ id: "guan", kind: "v", label: "关羽", w: 2, h: 1, x: 1, y: 2, className: "pk-guan" },
			{ id: "huang", kind: "v", label: "黄忠", w: 1, h: 2, x: 0, y: 2, className: "pk-general" },
			{ id: "ma", kind: "v", label: "马超", w: 1, h: 2, x: 3, y: 2, className: "pk-general" },
			{ id: "s1", kind: "1x1", label: "兵", w: 1, h: 1, x: 0, y: 4, className: "pk-soldier" },
			{ id: "s2", kind: "1x1", label: "兵", w: 1, h: 1, x: 3, y: 4, className: "pk-soldier" },
		],
	},
	mid: {
		id: "mid",
		name: "鸿门脱险",
		parMoves: 40,
		pieces: [
			{ id: "boss", kind: "boss", label: "沛公", w: 2, h: 2, x: 1, y: 0, className: "pk-boss" },
			{ id: "zhang", kind: "v", label: "项庄", w: 1, h: 2, x: 0, y: 0, className: "pk-enemy" },
			{ id: "fan", kind: "v", label: "樊哙", w: 1, h: 2, x: 3, y: 0, className: "pk-general" },
			{ id: "xiangbo", kind: "h", label: "项伯", w: 2, h: 1, x: 1, y: 2, className: "pk-ally" },
			{ id: "guanying", kind: "v", label: "灌婴", w: 1, h: 2, x: 0, y: 2, className: "pk-general" },
			{ id: "xiahou", kind: "v", label: "夏侯婴", w: 1, h: 2, x: 3, y: 2, className: "pk-general" },
			{ id: "s1", kind: "1x1", label: "兵", w: 1, h: 1, x: 1, y: 3, className: "pk-soldier" },
			{ id: "s2", kind: "1x1", label: "兵", w: 1, h: 1, x: 2, y: 3, className: "pk-soldier" },
			{ id: "s3", kind: "1x1", label: "兵", w: 1, h: 1, x: 0, y: 4, className: "pk-soldier" },
			{ id: "s4", kind: "1x1", label: "兵", w: 1, h: 1, x: 3, y: 4, className: "pk-soldier" },
		],
	},
	hard: {
		id: "hard",
		name: "垓下突围",
		parMoves: 60,
		pieces: [
			// 霸王居中最难版：以经典"横刀立马"为基底，将boss下移
			{ id: "boss", kind: "boss", label: "霸王", w: 2, h: 2, x: 1, y: 0, className: "pk-boss-bawang" },
			{ id: "zhang", kind: "v", label: "韩信", w: 1, h: 2, x: 0, y: 0, className: "pk-enemy" },
			{ id: "cao", kind: "v", label: "曹操", w: 1, h: 2, x: 3, y: 0, className: "pk-enemy" },
			{ id: "guan", kind: "h", label: "关羽", w: 2, h: 1, x: 1, y: 2, className: "pk-enemy" },
			{ id: "zhao", kind: "v", label: "彭越", w: 1, h: 2, x: 0, y: 2, className: "pk-enemy" },
			{ id: "ma", kind: "v", label: "英布", w: 1, h: 2, x: 3, y: 2, className: "pk-enemy" },
			{ id: "s1", kind: "1x1", label: "兵", w: 1, h: 1, x: 1, y: 3, className: "pk-soldier" },
			{ id: "s2", kind: "1x1", label: "兵", w: 1, h: 1, x: 2, y: 3, className: "pk-soldier" },
			{ id: "s3", kind: "1x1", label: "兵", w: 1, h: 1, x: 0, y: 4, className: "pk-soldier" },
			{ id: "s4", kind: "1x1", label: "兵", w: 1, h: 1, x: 3, y: 4, className: "pk-soldier" },
		],
	},
};

type PieceState = PieceDef & { x: number; y: number };

const COLS = 4;
const ROWS = 5;
const CELL = 76; // px per cell
const GAP = 4;

function clone(level: LevelDef): PieceState[] {
	return level.pieces.map((p) => ({ ...p }));
}

function buildBoard(pieces: PieceState[]): (string | null)[][] {
	const b: (string | null)[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
	for (const p of pieces) {
		for (let dy = 0; dy < p.h; dy++) {
			for (let dx = 0; dx < p.w; dx++) {
				const nx = p.x + dx;
				const ny = p.y + dy;
				if (nx >= 0 && nx < COLS && ny >= 0 && ny < ROWS) b[ny][nx] = p.id;
			}
		}
	}
	return b;
}

function canMove(pieces: PieceState[], id: string, dx: number, dy: number): boolean {
	const p = pieces.find((x) => x.id === id);
	if (!p) return false;
	const board = buildBoard(pieces);
	for (let y = 0; y < p.h; y++) {
		for (let x = 0; x < p.w; x++) {
			const nx = p.x + x + dx;
			const ny = p.y + y + dy;
			// Boss 到达 (1,3) 时可"走出"底部出口——视为合法
			if (p.kind === "boss" && ny === ROWS && nx >= 1 && nx <= 2) continue;
			if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;
			if (board[ny][nx] && board[ny][nx] !== id) return false;
		}
	}
	return true;
}

function isWon(pieces: PieceState[]): boolean {
	const boss = pieces.find((p) => p.kind === "boss");
	if (!boss) return false;
	// Boss 滑到 y=3, x=1 时底部正对出口即算胜利
	return boss.x === 1 && boss.y === 3;
}

export function KlotskiGame({ param, storyKey, onComplete, onSkip }: MinigameProps) {
	// 关卡选择：param 可选 "easy"/"mid"/"hard"；根据 storyKey 提供默认
	const initialLevel = useMemo(() => {
		if (param && LEVELS[param]) return param;
		if (storyKey?.startsWith("xiangyu:")) return "hard";
		if (storyKey?.startsWith("liubang:")) return "mid";
		return "mid";
	}, [param, storyKey]);

	const level = LEVELS[initialLevel] ?? LEVELS.mid;
	const [pieces, setPieces] = useState<PieceState[]>(() => clone(level));
	const [selected, setSelected] = useState<string | null>(null);
	const [moves, setMoves] = useState(0);
	const [won, setWon] = useState(false);
	const dragRef = useRef<{ id: string; startX: number; startY: number } | null>(null);

	useEffect(() => {
		if (won) {
			const par = level.parMoves;
			// 步数评分：步数 <= par → 100; <= 1.5par → 80; 否则 60
			let score = 60;
			if (moves <= par) score = 100;
			else if (moves <= Math.ceil(par * 1.5)) score = 80;
			const t = setTimeout(() => onComplete({ result: "win", score }), 900);
			return () => clearTimeout(t);
		}
	}, [won, moves, level, onComplete]);

	function reset() {
		setPieces(clone(level));
		setSelected(null);
		setMoves(0);
		setWon(false);
	}

	function tryMove(id: string, dx: number, dy: number): boolean {
		if (!canMove(pieces, id, dx, dy)) return false;
		setPieces((prev) => {
			const next = prev.map((p) => (p.id === id ? { ...p, x: p.x + dx, y: p.y + dy } : p));
			if (isWon(next)) setWon(true);
			return next;
		});
		setMoves((m) => m + 1);
		return true;
	}

	// 点击棋子：若已选中同一棋子则取消；否则选中；
	// 点击方向按钮移动。点击非选中棋子区域无反应。
	function onPieceClick(id: string) {
		if (won) return;
		setSelected((prev) => (prev === id ? null : id));
	}

	function moveSelected(dx: number, dy: number) {
		if (!selected) return;
		tryMove(selected, dx, dy);
	}

	// 拖拽支持：pointerdown 在棋子上 → 记录起点；pointermove 超过阈值算方向；pointerup 执行一次移动。
	function onPointerDown(e: React.PointerEvent, id: string) {
		if (won) return;
		setSelected(id);
		dragRef.current = { id, startX: e.clientX, startY: e.clientY };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}
	function onPointerUp(e: React.PointerEvent) {
		const drag = dragRef.current;
		dragRef.current = null;
		if (!drag) return;
		const dx = e.clientX - drag.startX;
		const dy = e.clientY - drag.startY;
		const threshold = CELL * 0.35;
		if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
			// 当作点击
			return;
		}
		let mvx = 0;
		let mvy = 0;
		if (Math.abs(dx) > Math.abs(dy)) {
			mvx = dx > 0 ? 1 : -1;
		} else {
			mvy = dy > 0 ? 1 : -1;
		}
		tryMove(drag.id, mvx, mvy);
	}

	const boardW = COLS * CELL + (COLS - 1) * GAP;
	const boardH = ROWS * CELL + (ROWS - 1) * GAP;
	const exitOpen = pieces.some((p) => p.kind === "boss" && p.y >= 3);

	return (
		<div className="klotski-root">
			<div className="klotski-hud">
				<div className="klotski-level">{level.name}</div>
				<div className="klotski-stats">
					<span>步数 {moves}</span>
					<span>·</span>
					<span>目标 ≤ {level.parMoves} 步</span>
				</div>
			</div>

			<div className="klotski-wrap">
				<div
					className="klotski-board"
					style={{ width: boardW, height: boardH }}
				>
					{/* 出口指示 */}
					<div
						className={`klotski-exit ${exitOpen ? "open" : ""}`}
						style={{
							left: CELL + GAP,
							width: 2 * CELL + GAP,
							top: boardH - 4,
						}}
					>
						<small>东 门</small>
					</div>

					{pieces.map((p) => {
						const wpx = p.w * CELL + (p.w - 1) * GAP;
						const hpx = p.h * CELL + (p.h - 1) * GAP;
						const xpx = p.x * (CELL + GAP);
						const ypx = p.y * (CELL + GAP);
						const isBoss = p.kind === "boss";
						const exited = isBoss && p.y === 3;
						return (
							<div
								key={p.id}
								className={[
									"klotski-piece",
									p.className ?? "",
									selected === p.id ? "selected" : "",
									isBoss ? "boss" : "",
									exited ? "exited" : "",
								].filter(Boolean).join(" ")}
								style={{
									width: wpx,
									height: hpx,
									transform: `translate(${xpx}px, ${ypx}px)`,
								}}
								onClick={() => onPieceClick(p.id)}
								onPointerDown={(e) => onPointerDown(e, p.id)}
								onPointerUp={onPointerUp}
							>
								<span className="klotski-piece-label">{p.label}</span>
							</div>
						);
					})}
				</div>
			</div>

			<div className="klotski-controls">
				<div className="klotski-dpad">
					<button className="dpad-btn up" disabled={!selected} onClick={() => moveSelected(0, -1)}>
						<ChevronUp size={20} />
					</button>
					<div className="dpad-row">
						<button className="dpad-btn" disabled={!selected} onClick={() => moveSelected(-1, 0)}>
							<ChevronLeft size={20} />
						</button>
						<button className="dpad-btn" disabled={!selected} onClick={() => moveSelected(1, 0)}>
							<ChevronRight size={20} />
						</button>
					</div>
					<button className="dpad-btn down" disabled={!selected} onClick={() => moveSelected(0, 1)}>
						<ChevronDown size={20} />
					</button>
				</div>
				<div className="klotski-actions">
					<button className="btn btn-ghost" onClick={reset}>
						<RotateCcw size={14} /> 重置
					</button>
					<button className="btn btn-ghost" onClick={onSkip}>
						跳过
					</button>
				</div>
			</div>

			{won && (
				<div className="klotski-win">
					<CheckCircle2 size={42} />
					<div className="klotski-win-title">脱出成功！</div>
					<div className="klotski-win-sub">共 {moves} 步 · 评价 {moves <= level.parMoves ? "如行云流水" : "略费周章"}</div>
				</div>
			)}
		</div>
	);
}
