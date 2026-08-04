import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, XCircle, RotateCcw, SkipForward } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./linxiangru.css";

const COLS = 7;
const ROWS = 5;
const MAX_STEPS = 50;

type Direction = "up" | "down" | "left" | "right";

interface Pos {
	x: number;
	y: number;
}

interface Soldier {
	pos: Pos;
	path: Pos[];
	pathIdx: number;
	pathDir: 1 | -1;
	dir: Direction;
	vision: number;
}

interface LevelDef {
	id: number;
	name: string;
	soldiers: Soldier[];
	pillars: Pos[];
}

const LEVELS: LevelDef[] = [
	{
		id: 1,
		name: "初出秦廷",
		pillars: [],
		soldiers: [
			{
				pos: { x: 2, y: 1 },
				path: [
					{ x: 2, y: 1 },
					{ x: 2, y: 3 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "down",
				vision: 2,
			},
			{
				pos: { x: 4, y: 2 },
				path: [
					{ x: 4, y: 2 },
					{ x: 5, y: 2 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "right",
				vision: 2,
			},
			{
				pos: { x: 3, y: 4 },
				path: [
					{ x: 1, y: 4 },
					{ x: 3, y: 4 },
				],
				pathIdx: 1,
				pathDir: -1,
				dir: "left",
				vision: 2,
			},
		],
	},
	{
		id: 2,
		name: "暗度回廊",
		pillars: [
			{ x: 3, y: 1 },
			{ x: 3, y: 3 },
			{ x: 5, y: 0 },
		],
		soldiers: [
			{
				pos: { x: 1, y: 0 },
				path: [
					{ x: 1, y: 0 },
					{ x: 1, y: 2 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "down",
				vision: 3,
			},
			{
				pos: { x: 2, y: 2 },
				path: [
					{ x: 2, y: 2 },
					{ x: 2, y: 4 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "down",
				vision: 3,
			},
			{
				pos: { x: 4, y: 1 },
				path: [
					{ x: 4, y: 1 },
					{ x: 6, y: 1 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "right",
				vision: 3,
			},
			{
				pos: { x: 5, y: 4 },
				path: [
					{ x: 4, y: 4 },
					{ x: 6, y: 4 },
				],
				pathIdx: 1,
				pathDir: -1,
				dir: "left",
				vision: 3,
			},
		],
	},
	{
		id: 3,
		name: "间道归赵",
		pillars: [
			{ x: 2, y: 0 },
			{ x: 2, y: 2 },
			{ x: 4, y: 1 },
			{ x: 4, y: 3 },
			{ x: 5, y: 2 },
			{ x: 3, y: 4 },
		],
		soldiers: [
			{
				pos: { x: 1, y: 1 },
				path: [
					{ x: 1, y: 1 },
					{ x: 1, y: 3 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "down",
				vision: 3,
			},
			{
				pos: { x: 3, y: 0 },
				path: [
					{ x: 3, y: 0 },
					{ x: 3, y: 2 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "down",
				vision: 3,
			},
			{
				pos: { x: 5, y: 1 },
				path: [
					{ x: 5, y: 1 },
					{ x: 5, y: 3 },
				],
				pathIdx: 0,
				pathDir: 1,
				dir: "down",
				vision: 3,
			},
			{
				pos: { x: 6, y: 3 },
				path: [
					{ x: 6, y: 2 },
					{ x: 6, y: 4 },
				],
				pathIdx: 1,
				pathDir: -1,
				dir: "up",
				vision: 3,
			},
			{
				pos: { x: 2, y: 4 },
				path: [
					{ x: 0, y: 4 },
					{ x: 2, y: 4 },
				],
				pathIdx: 1,
				pathDir: -1,
				dir: "left",
				vision: 3,
			},
		],
	},
];

const EXIT: Pos = { x: COLS - 1, y: 0 };
const PLAYER_START: Pos = { x: 0, y: ROWS - 1 };

function cloneSoldiers(level: LevelDef): Soldier[] {
	return level.soldiers.map((s) => ({
		...s,
		pos: { ...s.pos },
		path: s.path.map((p) => ({ ...p })),
	}));
}

function isPillar(pillars: Pos[], x: number, y: number): boolean {
	return pillars.some((p) => p.x === x && p.y === y);
}

function isSoldier(soldiers: Soldier[], x: number, y: number): boolean {
	return soldiers.some((s) => s.pos.x === x && s.pos.y === y);
}

function getDirVector(dir: Direction): { dx: number; dy: number } {
	switch (dir) {
		case "up":
			return { dx: 0, dy: -1 };
		case "down":
			return { dx: 0, dy: 1 };
		case "left":
			return { dx: -1, dy: 0 };
		case "right":
			return { dx: 1, dy: 0 };
	}
}

function computeVisionCells(
	soldiers: Soldier[],
	pillars: Pos[],
): Set<string> {
	const vision = new Set<string>();
	for (const s of soldiers) {
		const { dx, dy } = getDirVector(s.dir);
		let cx = s.pos.x;
		let cy = s.pos.y;
		for (let i = 0; i < s.vision; i++) {
			cx += dx;
			cy += dy;
			if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) break;
			if (isPillar(pillars, cx, cy)) break;
			vision.add(`${cx},${cy}`);
		}
	}
	return vision;
}

function isInVision(
	soldier: Soldier,
	player: Pos,
	pillars: Pos[],
): boolean {
	const { dx, dy } = getDirVector(soldier.dir);
	let cx = soldier.pos.x;
	let cy = soldier.pos.y;
	for (let i = 0; i < soldier.vision; i++) {
		cx += dx;
		cy += dy;
		if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) break;
		if (isPillar(pillars, cx, cy)) break;
		if (cx === player.x && cy === player.y) return true;
	}
	return false;
}

function isAnySoldierSeePlayer(
	soldiers: Soldier[],
	player: Pos,
	pillars: Pos[],
): boolean {
	return soldiers.some((s) => isInVision(s, player, pillars));
}

function stepSoldier(s: Soldier): Soldier {
	const next = { ...s, pos: { ...s.pos }, path: s.path.map((p) => ({ ...p })) };
	let nextIdx = next.pathIdx + next.pathDir;
	if (nextIdx >= next.path.length) {
		next.pathDir = -1;
		nextIdx = next.pathIdx + next.pathDir;
	} else if (nextIdx < 0) {
		next.pathDir = 1;
		nextIdx = next.pathIdx + next.pathDir;
	}
	const target = next.path[nextIdx];
	const dx = target.x - next.pos.x;
	const dy = target.y - next.pos.y;
	if (dx > 0) next.dir = "right";
	else if (dx < 0) next.dir = "left";
	else if (dy > 0) next.dir = "down";
	else if (dy < 0) next.dir = "up";
	next.pos.x += dx === 0 ? 0 : dx > 0 ? 1 : -1;
	next.pos.y += dy === 0 ? 0 : dy > 0 ? 1 : -1;
	if (next.pos.x === target.x && next.pos.y === target.y) {
		next.pathIdx = nextIdx;
	}
	return next;
}

function calcScore(steps: number): number {
	if (steps <= 20) return 100;
	if (steps <= 35) return 80;
	return 60;
}

function dirToArrow(dir: Direction): string {
	switch (dir) {
		case "up":
			return "▲";
		case "down":
			return "▼";
		case "left":
			return "◀";
		case "right":
			return "▶";
	}
}

export function LinxiangruGame({ param, onComplete, onSkip }: MinigameProps) {
	const levelIdx = useMemo(() => {
		const p = parseInt(param ?? "1", 10);
		if (p >= 1 && p <= LEVELS.length) return p - 1;
		return 0;
	}, [param]);

	const level = LEVELS[levelIdx];
	const [player, setPlayer] = useState<Pos>({ ...PLAYER_START });
	const [soldiers, setSoldiers] = useState<Soldier[]>(() => cloneSoldiers(level));
	const [steps, setSteps] = useState(0);
	const [finished, setFinished] = useState(false);
	const [result, setResult] = useState<"win" | "lose" | null>(null);
	const [caughtBy, setCaughtBy] = useState<number | null>(null);

	const visionCells = useMemo(
		() => computeVisionCells(soldiers, level.pillars),
		[soldiers, level.pillars],
	);

	const finishWin = useCallback(
		(finalSteps: number) => {
			if (finished) return;
			setFinished(true);
			setResult("win");
			sfx.play("win");
			const score = calcScore(finalSteps);
			const t = setTimeout(() => onComplete({ result: "win", score }), 1500);
			return () => clearTimeout(t);
		},
		[finished, onComplete],
	);

	const finishLose = useCallback(() => {
		if (finished) return;
		setFinished(true);
		setResult("lose");
		sfx.play("lose");
		const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1500);
		return () => clearTimeout(t);
	}, [finished, onComplete]);

	useEffect(() => {
		if (steps > 0 && steps >= MAX_STEPS && !finished) {
			finishLose();
		}
	}, [steps, finished, finishLose]);

	const tryMove = useCallback(
		(dx: number, dy: number) => {
			if (finished) return;
			const nx = player.x + dx;
			const ny = player.y + dy;
			if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;
			if (isPillar(level.pillars, nx, ny)) return;
			if (isSoldier(soldiers, nx, ny)) return;

			const newPlayer = { x: nx, y: ny };
			const newSoldiers = soldiers.map(stepSoldier);
			const newSteps = steps + 1;

			setPlayer(newPlayer);
			setSoldiers(newSoldiers);
			setSteps(newSteps);

			if (nx === EXIT.x && ny === EXIT.y) {
				finishWin(newSteps);
				return;
			}

			for (let i = 0; i < newSoldiers.length; i++) {
				if (newSoldiers[i].pos.x === newPlayer.x && newSoldiers[i].pos.y === newPlayer.y) {
					setCaughtBy(i);
					sfx.play("wrong");
					finishLose();
					return;
				}
			}

			if (isAnySoldierSeePlayer(newSoldiers, newPlayer, level.pillars)) {
				for (let i = 0; i < newSoldiers.length; i++) {
					if (isInVision(newSoldiers[i], newPlayer, level.pillars)) {
						setCaughtBy(i);
						break;
					}
				}
				sfx.play("wrong");
				finishLose();
				return;
			}

			if (newSteps >= MAX_STEPS) {
				finishLose();
				return;
			}

			sfx.play("slide");
		},
		[player, soldiers, steps, finished, level.pillars, finishWin, finishLose],
	);

	const reset = useCallback(() => {
		sfx.resetCombo();
		setPlayer({ ...PLAYER_START });
		setSoldiers(cloneSoldiers(level));
		setSteps(0);
		setFinished(false);
		setResult(null);
		setCaughtBy(null);
	}, [level]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (finished) return;
			switch (e.key) {
				case "ArrowUp":
				case "w":
				case "W":
					e.preventDefault();
					tryMove(0, -1);
					break;
				case "ArrowDown":
				case "s":
				case "S":
					e.preventDefault();
					tryMove(0, 1);
					break;
				case "ArrowLeft":
				case "a":
				case "A":
					e.preventDefault();
					tryMove(-1, 0);
					break;
				case "ArrowRight":
				case "d":
				case "D":
					e.preventDefault();
					tryMove(1, 0);
					break;
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [tryMove, finished]);

	const cells: ReactElement[] = [];
	for (let y = 0; y < ROWS; y++) {
		for (let x = 0; x < COLS; x++) {
			const key = `${x},${y}`;
			const isExit = x === EXIT.x && y === EXIT.y;
			const isStart = x === PLAYER_START.x && y === PLAYER_START.y;
			const isP = isPillar(level.pillars, x, y);
			const inVision = visionCells.has(key);
			const sIdx = soldiers.findIndex((s) => s.pos.x === x && s.pos.y === y);
			const isPlayer = player.x === x && player.y === y;
			const soldier = sIdx >= 0 ? soldiers[sIdx] : null;
			const isCaught = caughtBy === sIdx;

			let cellClass = "lx-cell";
			if ((x + y) % 2 === 0) cellClass += " lx-cell-alt";
			if (inVision && !isPlayer && !soldier && !isP) cellClass += " lx-vision";
			if (isExit) cellClass += " lx-exit";
			if (isStart && !isPlayer) cellClass += " lx-start";

			cells.push(
				<div
					key={key}
					className={cellClass}
					onClick={() => {
						const adx = Math.abs(x - player.x);
						const ady = Math.abs(y - player.y);
						if (adx + ady === 1) tryMove(x - player.x, y - player.y);
					}}
				>
					{isP && <div className="lx-pillar" />}
					{isExit && <div className="lx-exit-mark serif">赵</div>}
					{soldier && (
						<div className={`lx-soldier ${isCaught ? "lx-caught" : ""} lx-dir-${soldier.dir}`}>
							<span className="lx-soldier-arrow">{dirToArrow(soldier.dir)}</span>
							<span className="lx-soldier-label serif">兵</span>
						</div>
					)}
					{isPlayer && (
						<div className="lx-player">
							<span className="lx-player-label serif">蔺</span>
						</div>
					)}
				</div>,
			);
		}
	}

	return (
		<div className="lx-root">
			<div className="lx-hud">
				<div className="lx-title serif">完璧归赵</div>
				<div className="lx-stats">
					<span>{level.name}</span>
					<span>·</span>
					<span>步数 {steps}/{MAX_STEPS}</span>
				</div>
			</div>

			<p className="lx-hint">
				持璧潜行，避秦兵耳目，间至右上角「赵」字出口。点击相邻格子或方向键/WASD 移步。每走一步，秦兵亦推进一格。
			</p>

			<div className="lx-stage">
				<div
					className="lx-board"
					style={{
						gridTemplateColumns: `repeat(${COLS}, 1fr)`,
						gridTemplateRows: `repeat(${ROWS}, 1fr)`,
					}}
				>
					{cells}
				</div>
			</div>

			<div className="lx-legend">
				<div className="lx-legend-item">
					<span className="lx-legend-swatch lx-legend-player" />
					<span>蔺相如（起点 · 左下）</span>
				</div>
				<div className="lx-legend-item">
					<span className="lx-legend-swatch lx-legend-soldier" />
					<span>秦兵（▲▼◀▶ 朝向）</span>
				</div>
				<div className="lx-legend-item">
					<span className="lx-legend-swatch lx-legend-vision" />
					<span>视线范围</span>
				</div>
				<div className="lx-legend-item">
					<span className="lx-legend-swatch lx-legend-pillar" />
					<span>铜柱（遮挡）</span>
				</div>
				<div className="lx-legend-item">
					<span className="lx-legend-swatch lx-legend-exit" />
					<span>出口 · 赵（右上）</span>
				</div>
			</div>

			<div className="lx-controls">
				<div className="lx-dpad">
					<button className="lx-dpad-btn lx-dpad-up" disabled={finished} onClick={() => tryMove(0, -1)}>
						▲
					</button>
					<div className="lx-dpad-row">
						<button className="lx-dpad-btn" disabled={finished} onClick={() => tryMove(-1, 0)}>
							◀
						</button>
						<button className="lx-dpad-btn" disabled={finished} onClick={() => tryMove(1, 0)}>
							▶
						</button>
					</div>
					<button className="lx-dpad-btn lx-dpad-down" disabled={finished} onClick={() => tryMove(0, 1)}>
						▼
					</button>
				</div>
				<div className="lx-actions">
					<button className="btn btn-ghost" onClick={reset} disabled={finished}>
						<RotateCcw size={14} /> 重置
					</button>
					<button className="btn btn-ghost" onClick={onSkip}>
						<SkipForward size={14} /> 跳过
					</button>
				</div>
			</div>

			{finished && result && (
				<div className={`lx-finish ${result}`}>
					{result === "win" ? <CheckCircle2 size={46} /> : <XCircle size={46} />}
					<div className="lx-finish-title serif">
						{result === "win"
							? steps <= 20
								? "完璧归赵 · 神速"
								: steps <= 35
									? "完璧归赵 · 从容"
									: "完璧归赵 · 险胜"
							: steps >= MAX_STEPS
								? "迟滞被擒"
								: "形迹败露"}
					</div>
					<div className="lx-finish-sub">
						{result === "win"
							? `共 ${steps} 步 · 评分 ${calcScore(steps)}`
							: steps >= MAX_STEPS
								? `已用 ${steps} 步 · 超过 ${MAX_STEPS} 步之限`
								: `第 ${steps} 步被秦兵察觉`}
					</div>
				</div>
			)}
		</div>
	);
}
