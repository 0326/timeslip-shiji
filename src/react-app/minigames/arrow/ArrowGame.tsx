import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { Target, RotateCcw, CheckCircle2, SkipForward, AlertTriangle } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./arrow.css";

type BallColor = "red" | "blue" | "green" | "yellow";

interface Ball {
	id: number;
	color: BallColor;
	removing?: boolean;
}

interface LevelConfig {
	totalBalls: number;
	speedMs: number;
	colors: BallColor[];
	name: string;
}

const LEVELS: Record<string, LevelConfig> = {
	"1": { totalBalls: 15, speedMs: 500, colors: ["red", "blue", "green"], name: "第壹关 · 前哨试探" },
	"2": { totalBalls: 20, speedMs: 400, colors: ["red", "blue", "green", "yellow"], name: "第贰关 · 敌阵推进" },
	"3": { totalBalls: 25, speedMs: 300, colors: ["red", "blue", "green", "yellow"], name: "第叁关 · 万箭齐发" },
};

const COLOR_LABELS: Record<BallColor, string> = {
	red: "秦",
	blue: "楚",
	green: "赵",
	yellow: "燕",
};

const BALL_SIZE = 44;
const START_X = 30;
const DANGER_X = 640;
const FIELD_WIDTH = 700;

let idCounter = 1;
const nextId = () => idCounter++;

function makeInitialQueue(level: LevelConfig): Ball[] {
	const balls: Ball[] = [];
	for (let i = 0; i < level.totalBalls; i++) {
		const color = level.colors[Math.floor(Math.random() * level.colors.length)];
		balls.push({ id: nextId(), color });
	}
	return balls;
}

function pickArrowColor(level: LevelConfig, queue: Ball[]): BallColor {
	if (queue.length === 0) return level.colors[0];
	if (Math.random() < 0.4) {
		const idx = Math.floor(Math.random() * queue.length);
		return queue[idx].color;
	}
	return level.colors[Math.floor(Math.random() * level.colors.length)];
}

function findAndMarkRemoving(balls: Ball[], insertIndex: number): { balls: Ball[]; removedCount: number } {
	const n = balls.length;
	if (n < 3) return { balls, removedCount: 0 };

	const color = balls[insertIndex]?.color;
	if (!color) return { balls, removedCount: 0 };

	let left = insertIndex;
	while (left > 0 && balls[left - 1].color === color) left--;

	let right = insertIndex;
	while (right < n - 1 && balls[right + 1].color === color) right++;

	const runLength = right - left + 1;
	if (runLength < 3) return { balls, removedCount: 0 };

	const marked = balls.map((b, i) =>
		i >= left && i <= right ? { ...b, removing: true as const } : b
	);

	return { balls: marked, removedCount: runLength };
}

export function ArrowGame({ param, onComplete, onSkip }: MinigameProps) {
	const levelKey = (param && LEVELS[param]) ? param : "1";
	const level = LEVELS[levelKey];

	const [queue, setQueue] = useState<Ball[]>([]);
	const [offsetPx, setOffsetPx] = useState(0);
	const [currentArrow, setCurrentArrow] = useState<BallColor>("red");
	const [nextArrow, setNextArrow] = useState<BallColor>("red");
	const [removedTotal, setRemovedTotal] = useState(0);
	const [phase, setPhase] = useState<"playing" | "win" | "lose">("playing");
	const [animating, setAnimating] = useState(false);

	const queueRef = useRef(queue);
	const offsetRef = useRef(offsetPx);
	const phaseRef = useRef(phase);
	queueRef.current = queue;
	offsetRef.current = offsetPx;
	phaseRef.current = phase;
	// 用户是否已实际交互。未交互前不推进队列，防止挂载后自动判负
	const userInteractedRef = useRef(false);

	useEffect(() => {
		const initQueue = makeInitialQueue(level);
		setQueue(initQueue);
		// 初始 offset 设为负值，让队列末尾距警戒线留 2 球缓冲，避免挂载即判负
		const safeOffset = DANGER_X - START_X - level.totalBalls * BALL_SIZE - 2 * BALL_SIZE;
		setOffsetPx(safeOffset);
		setCurrentArrow(pickArrowColor(level, initQueue));
		setNextArrow(pickArrowColor(level, initQueue));
		setRemovedTotal(0);
		setPhase("playing");
		setAnimating(false);
	}, [level]);

	useEffect(() => {
		if (phase !== "playing") return;
		const timer = setInterval(() => {
			if (animating) return;
			// 未交互前不推进队列，避免挂载即判负
			if (!userInteractedRef.current) return;
			setOffsetPx((prev) => {
				const q = queueRef.current;
				const newOffset = prev + 4;
				if (q.length > 0) {
					const lastX = START_X + (q.length - 1) * BALL_SIZE + newOffset;
					if (lastX + BALL_SIZE >= DANGER_X) {
						setPhase("lose");
						return prev;
					}
				}
				return newOffset;
			});
		}, level.speedMs);
		return () => clearInterval(timer);
	}, [level, phase, animating]);

	const processChain = useCallback(async (startBalls: Ball[], startIndex: number) => {
		setAnimating(true);
		let balls = startBalls;
		let cursor = startIndex;
		let chainRemoved = 0;
		let chainStep = 0;

		while (true) {
			const result = findAndMarkRemoving(balls, cursor);
			if (result.removedCount === 0) break;

			// 音效：首次消除 match，后续连击 combo
			if (chainStep === 0) sfx.play("match");
			else sfx.play("combo");
			chainStep++;

			balls = result.balls;
			chainRemoved += result.removedCount;
			setQueue([...balls]);
			await new Promise((r) => setTimeout(r, 350));

			let removeStart = -1;
			for (let i = 0; i < balls.length; i++) {
				if (balls[i].removing) { removeStart = i; break; }
			}
			if (removeStart === -1) break;

			let removeEnd = removeStart;
			while (removeEnd < balls.length && balls[removeEnd].removing) removeEnd++;
			removeEnd--;

			const newBalls = balls.filter((b) => !b.removing);
			balls = newBalls;
			cursor = Math.max(0, Math.min(removeStart, balls.length - 1));
			setQueue([...balls]);
		}

		setRemovedTotal((t) => t + chainRemoved);
		setAnimating(false);

		if (balls.length === 0) {
			setPhase("win");
		}
	}, []);

	const handleShoot = useCallback((index: number) => {
		if (phaseRef.current !== "playing" || animating) return;
		userInteractedRef.current = true;

		sfx.play("pop"); // 发射箭矢

		const newBall: Ball = { id: nextId(), color: currentArrow };
		const insertIndex = index + 1;
		const newQueue = [
			...queueRef.current.slice(0, insertIndex),
			newBall,
			...queueRef.current.slice(insertIndex),
		];

		setCurrentArrow(nextArrow);
		setNextArrow(pickArrowColor(level, newQueue));
		setQueue(newQueue);
		processChain(newQueue, insertIndex);
	}, [currentArrow, nextArrow, level, animating, processChain]);

	const handleRestart = () => {
		sfx.resetCombo();
		const initQueue = makeInitialQueue(level);
		setQueue(initQueue);
		const safeOffset = DANGER_X - START_X - level.totalBalls * BALL_SIZE - 2 * BALL_SIZE;
		setOffsetPx(safeOffset);
		setCurrentArrow(pickArrowColor(level, initQueue));
		setNextArrow(pickArrowColor(level, initQueue));
		setRemovedTotal(0);
		setPhase("playing");
		setAnimating(false);
		userInteractedRef.current = false;
	};

	useEffect(() => {
		if (phase === "win") {
			sfx.play("win");
			const baseScore = 60;
			const bonus = Math.min(40, Math.floor(removedTotal * 2));
			const score = baseScore + bonus;
			const t = setTimeout(() => onComplete({ result: "win", score }), 1400);
			return () => clearTimeout(t);
		}
		if (phase === "lose") {
			sfx.play("lose");
			const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1400);
			return () => clearTimeout(t);
		}
	}, [phase, removedTotal, onComplete]);

	const lastX = queue.length > 0
		? START_X + (queue.length - 1) * BALL_SIZE + offsetPx + BALL_SIZE
		: 0;
	const dangerPercent = Math.min(100, Math.max(0, (lastX / DANGER_X) * 100));
	const progressPercent = queue.length === 0
		? 100
		: Math.max(0, 100 - (queue.length / level.totalBalls) * 100);

	return (
		<div className="ar-root">
			<div className="ar-hud">
				<div className="ar-title">{level.name}</div>
				<div className="ar-stats">
					<span>剩余 {queue.length}</span>
					<span>·</span>
					<span>消除 {removedTotal}</span>
				</div>
			</div>

			<div className="ar-progress-wrap">
				<div className="ar-progress-label">
					<span>清场进度 {Math.round(progressPercent)}%</span>
					<span className="ar-danger-label">
						<AlertTriangle size={12} /> 敌兵 {Math.round(dangerPercent)}%
					</span>
				</div>
				<div className="ar-progress-bar">
					<div
						className="ar-progress-fill"
						style={{ width: `${progressPercent}%` }}
					/>
					<div
						className="ar-danger-fill"
						style={{ left: `${Math.min(progressPercent, dangerPercent)}%`, width: `${Math.max(0, dangerPercent - progressPercent)}%` }}
					/>
				</div>
			</div>

			<div className="ar-field-wrap">
				<div
					className="ar-field"
					style={{ width: FIELD_WIDTH }}
				>
					<div
						className="ar-danger-line"
						style={{ left: DANGER_X }}
					>
						<div className="ar-danger-marker">
							<AlertTriangle size={14} />
						</div>
					</div>

					<div className="ar-queue" style={{ width: FIELD_WIDTH }}>
						{queue.map((ball, i) => {
							const left = START_X + i * BALL_SIZE + offsetPx;
							return (
								<button
									key={ball.id}
									className={[
										"ar-ball",
										`ar-ball-${ball.color}`,
										ball.removing ? "removing" : "",
									].filter(Boolean).join(" ")}
									style={{ left, width: BALL_SIZE, height: BALL_SIZE }}
									onClick={() => handleShoot(i)}
									disabled={phase !== "playing" || animating}
								>
									<span className="ar-ball-label">{COLOR_LABELS[ball.color]}</span>
								</button>
							);
						})}
					</div>

					<div className="ar-archer">
						<div className="ar-archer-body" />
						<div className="ar-archer-head" />
						<div className="ar-archer-bow" />
					</div>
				</div>
			</div>

			<div className="ar-arrow-panel">
				<div className="ar-arrow-slot next">
					<div className="ar-arrow-label">下支</div>
					<div className={`ar-arrow-ball ar-ball-${nextArrow}`}>
						<span className="ar-ball-label">{COLOR_LABELS[nextArrow]}</span>
					</div>
				</div>
				<div className="ar-arrow-slot current">
					<div className="ar-arrow-label">当前</div>
					<div className={`ar-arrow-ball ar-ball-${currentArrow} ready`}>
						<span className="ar-ball-label">{COLOR_LABELS[currentArrow]}</span>
						<Target size={14} className="ar-arrow-target" />
					</div>
					<div className="ar-hint-text">点击敌兵之间射出箭矢</div>
				</div>
			</div>

			<div className="ar-controls">
				<button className="btn btn-ghost" onClick={handleRestart}>
					<RotateCcw size={14} /> 重新开始
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>
					<SkipForward size={14} /> 跳过
				</button>
			</div>

			{phase === "win" && (
				<div className="ar-overlay win">
					<div className="ar-overlay-card">
						<CheckCircle2 size={52} />
						<div className="ar-overlay-title">箭无虚发</div>
						<div className="ar-overlay-sub">
							共消除 {removedTotal} 员敌兵
						</div>
					</div>
				</div>
			)}
			{phase === "lose" && (
				<div className="ar-overlay lose">
					<div className="ar-overlay-card">
						<AlertTriangle size={52} />
						<div className="ar-overlay-title">防线失守</div>
						<div className="ar-overlay-sub">
							敌兵突破警戒线，再整军再战
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
