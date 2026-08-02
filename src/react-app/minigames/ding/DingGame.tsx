// 铸鼎定鼎（Ding Forge）—— 拼图组装小游戏
// 玩法：将散落的鼎片拼回完整大鼎。点击两块拼图交换位置，全部复位即胜。
// 关卡：1=青铜小鼎(3×3) / 2=九鼎之一(4×4) / 3=天下九鼎(5×5)，限时 60/90/120 秒。
// 适配：大禹铸九鼎定九州 / 商汤欲迁鼎。
// ink 用法：#minigame:ding      → 第1关
//           #minigame:ding:2    → 第2关

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./ding.css";

type PartType = "ear" | "mouth" | "body" | "foot";

interface Piece {
	/** 正确位置下标 0..N-1 */
	id: number;
	/** 所属部位 */
	part: PartType;
}

interface LevelConfig {
	size: number;
	name: string;
	historyNote: string;
	time: number;
}

const LEVELS: Record<number, LevelConfig> = {
	1: { size: 3, name: "青铜小鼎", historyNote: "九州之贡金，铸鼎象物。", time: 60 },
	2: { size: 4, name: "九鼎之一", historyNote: "九鼎九州，皆为神器。", time: 90 },
	3: { size: 5, name: "天下九鼎", historyNote: "桀有昏德，鼎迁于商。", time: 120 },
};

/** 按 3×3 鼎的结构推导任意尺寸下每格所属部位：
 *  顶行两角=鼎耳，顶行中间=鼎口，底行=鼎足，其余=鼎身。
 *  3×3 恰好为：鼎耳2 + 鼎口1 + 鼎身3 + 鼎足3 = 9。 */
function getPart(index: number, size: number): PartType {
	const total = size * size;
	if (index < size) {
		if (index === 0 || index === size - 1) return "ear";
		return "mouth";
	}
	if (index >= total - size) return "foot";
	return "body";
}

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function DingGame({ param, onComplete, onSkip }: MinigameProps) {
	const level = useMemo(() => {
		let lv = 1;
		if (param) {
			const n = parseInt(param, 10);
			if (!Number.isNaN(n) && LEVELS[n]) lv = n;
		}
		return LEVELS[lv];
	}, [param]);

	const size = level.size;
	const total = size * size;

	// pieces[i] = 当前格 i 上的拼图块；其 id 表示正确位置
	const [pieces, setPieces] = useState<Piece[]>([]);
	const [selected, setSelected] = useState<number | null>(null);
	const [moves, setMoves] = useState(0);
	const [won, setWon] = useState(false);
	const [lost, setLost] = useState(false);
	const [timeLeft, setTimeLeft] = useState(level.time);
	const finishedRef = useRef(false);
	// 用户是否已实际交互。未交互前不启动倒计时，防止挂载后自动判负
	const userInteractedRef = useRef(false);

	const initBoard = useCallback(() => {
		sfx.resetCombo();
		const correct: Piece[] = Array.from({ length: total }, (_, i) => ({
			id: i,
			part: getPart(i, size),
		}));
		let shuffled = shuffle(correct);
		// 防止初始就是正确顺序
		while (shuffled.every((p, i) => p.id === i)) {
			shuffled = shuffle(correct);
		}
		setPieces(shuffled);
		setSelected(null);
		setMoves(0);
		setWon(false);
		setLost(false);
		setTimeLeft(level.time);
		finishedRef.current = false;
	}, [total, size, level.time]);

	useEffect(() => {
		initBoard();
	}, [initBoard]);

	// 倒计时
	useEffect(() => {
		if (won || lost) return;
		const id = window.setInterval(() => {
			setTimeLeft((t) => Math.max(0, t - 1));
		}, 1000);
		return () => window.clearInterval(id);
	}, [won, lost]);

	// 时间到 → 失败
	useEffect(() => {
		if (timeLeft > 0 || won || lost || finishedRef.current) return;
		setLost(true);
		finishedRef.current = true;
		sfx.play("lose");
		const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1200);
		return () => clearTimeout(t);
	}, [timeLeft, won, lost, onComplete]);

	// 胜利检测：所有块回到正确位置
	useEffect(() => {
		if (pieces.length === 0 || won || lost) return;
		const ok = pieces.every((p, i) => p.id === i);
		if (!ok || finishedRef.current) return;
		setWon(true);
		finishedRef.current = true;
		sfx.play("win");
		// 分数：剩余时间越多越高，下限 40
		const score = Math.max(40, Math.min(100, Math.round((timeLeft / level.time) * 100)));
		const t = setTimeout(() => onComplete({ result: "win", score }), 1400);
		return () => clearTimeout(t);
	}, [pieces, won, lost, timeLeft, level.time, onComplete]);

	function handleClick(index: number) {
		if (won || lost) return;
		userInteractedRef.current = true;
		if (selected === null) {
			setSelected(index);
			return;
		}
		if (selected === index) {
			setSelected(null);
			return;
		}
		// 交换两块
		const fromSel = pieces[selected];
		const fromIdx = pieces[index];
		setPieces((prev) => {
			const next = [...prev];
			[next[selected], next[index]] = [next[index], next[selected]];
			return next;
		});
		setMoves((m) => m + 1);
		setSelected(null);
		sfx.play("place");
		if (fromIdx.id === selected || fromSel.id === index) {
			sfx.play("match");
		}
	}

	const correctCount = pieces.filter((p, i) => p.id === i).length;
	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
	const lowTime = timeLeft <= 10 && !won && !lost;

	return (
		<div className="dg-root">
			<div className="dg-hud">
				<div className="dg-title-wrap">
					<div className="dg-title serif">{level.name}</div>
					<div className="dg-sub">铸鼎定鼎 · {level.historyNote}</div>
				</div>
				<div className="dg-stats">
					<div className={`dg-timer ${lowTime ? "low" : ""}`}>
						<Clock size={14} />
						<span>{timeStr}</span>
					</div>
					<div className="dg-stat">交换 {moves}</div>
					<div className="dg-stat">复位 {correctCount}/{total}</div>
				</div>
			</div>

			<p className="dg-hint">
				点击两块鼎片可交换位置——将散落的青铜碎片拼回完整大鼎，方可定鼎九州。
			</p>

			<div className={`dg-board-wrap ${won ? "complete" : ""}`}>
				<div
					className="dg-board"
					style={{
						gridTemplateColumns: `repeat(${size}, 1fr)`,
						gridTemplateRows: `repeat(${size}, 1fr)`,
					}}
				>
					{pieces.map((p, i) => {
						const correct = p.id === i;
						return (
							<button
								key={i}
								className={[
									"dg-piece",
									`dg-${p.part}`,
									selected === i ? "selected" : "",
									correct ? "correct" : "",
								]
									.filter(Boolean)
									.join(" ")}
								onClick={() => handleClick(i)}
								disabled={won || lost}
							>
								<span className="dg-piece-num">{p.id + 1}</span>
								<span className="dg-piece-pattern" />
							</button>
						);
					})}
				</div>
				{won && <div className="dg-glow" />}
			</div>

			<div className="dg-legend">
				<span className="dg-leg dg-leg-ear">鼎耳</span>
				<span className="dg-leg dg-leg-mouth">鼎口</span>
				<span className="dg-leg dg-leg-body">鼎身</span>
				<span className="dg-leg dg-leg-foot">鼎足</span>
			</div>

			<div className="dg-actions">
				<button className="btn btn-ghost" onClick={initBoard} disabled={won || lost}>
					<RotateCcw size={14} /> 重新打散
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>
					跳过
				</button>
			</div>

			{won && (
				<div className="dg-result win">
					<CheckCircle2 size={42} />
					<div className="dg-result-title">鼎成！定九州</div>
					<div className="dg-result-sub">共 {moves} 步 · 剩余 {timeStr}</div>
				</div>
			)}
			{lost && (
				<div className="dg-result lose">
					<div className="dg-result-title">鼎未成</div>
					<div className="dg-result-sub">沙漏已尽，仍推进剧情</div>
				</div>
			)}
		</div>
	);
}
