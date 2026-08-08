// 铸鼎定鼎（Ding Forge）—— 场景截图切片拼图小游戏
// 玩法：点击两块拼图交换位置，所有切片按序复位即胜。
// 关卡：1=武丁朝诸侯·兴(3×3) / 2=武丁梦得傅说·梦(4×4) / 3=涿鹿之战·定乾坤(5×5)
// ink 用法：#minigame:ding      → 第1关
//           #minigame:ding:2    → 第2关
//           #minigame:ding:3    → 第3关

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, Clock, Eye, X } from "lucide-react";
import { sfx } from "../../lib/sfx";
import { assetUrl } from "../../lib/assetUrl";
import "./ding.css";

interface Piece {
	/** 正确位置下标 0..N-1 */
	id: number;
}

interface LevelConfig {
	size: number;
	sceneImg: string;
	name: string;
	historyNote: string;
	time: number;
}

const LEVELS: Record<number, LevelConfig> = {
	1: {
		size: 3,
		sceneImg: "wuding_xing.jpg",
		name: "武丁朝诸侯·兴",
		historyNote: "武丁修政行德，天下咸欢，殷道复兴。",
		time: 60,
	},
	2: {
		size: 4,
		sceneImg: "wuding_meng.jpg",
		name: "武丁梦得傅说·梦",
		historyNote: "武丁夜梦得圣人，名曰说。以梦所见视群臣百吏，皆非也。",
		time: 90,
	},
	3: {
		size: 5,
		sceneImg: "zhuolu_field.jpg",
		name: "涿鹿之战·定乾坤",
		historyNote: "蚩尤作乱，不用帝命。于是黄帝乃征师诸侯，与蚩尤战于涿鹿之野。",
		time: 120,
	},
};

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
	const sceneUrl = assetUrl(`/assets/backgrounds/wudi/${level.sceneImg}`);

	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	const playingSinceRef = useRef<number | null>(null);
	const userInteractedRef = useRef(false);

	const [pieces, setPieces] = useState<Piece[]>([]);
	const [selected, setSelected] = useState<number | null>(null);
	const [moves, setMoves] = useState(0);
	const [won, setWon] = useState(false);
	const [lost, setLost] = useState(false);
	const [timeLeft, setTimeLeft] = useState(level.time);
	const [showPreview, setShowPreview] = useState(false);
	const finishedRef = useRef(false);

	const initBoard = useCallback(() => {
		sfx.resetCombo();
		const correct: Piece[] = Array.from({ length: total }, (_, i) => ({
			id: i,
		}));
		let shuffled = shuffle(correct);
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
		userInteractedRef.current = false;
		playingSinceRef.current = null;
	}, [total, level.time]);

	useEffect(() => {
		initBoard();
	}, [initBoard]);

	useEffect(() => {
		if (won || lost) return;
		const id = window.setInterval(() => {
			if (userInteractedRef.current) {
				setTimeLeft((t) => Math.max(0, t - 1));
			}
		}, 1000);
		return () => window.clearInterval(id);
	}, [won, lost, pieces]);

	useEffect(() => {
		if (timeLeft > 0 || won || lost || finishedRef.current) return;
		if (!userInteractedRef.current) return;
		setLost(true);
		finishedRef.current = true;
		sfx.play("lose");
		const t = setTimeout(() => onCompleteRef.current({ result: "lose", score: 0 }), 1200);
		return () => clearTimeout(t);
	}, [timeLeft, won, lost]);

	useEffect(() => {
		if (pieces.length === 0 || won || lost) return;
		const ok = pieces.every((p, i) => p.id === i);
		if (!ok || finishedRef.current) return;
		setWon(true);
		sfx.play("win");
		if (!userInteractedRef.current) {
			return;
		}
		finishedRef.current = true;
		const t = setTimeout(() => {
			onCompleteRef.current({ result: "win", score: 100 });
		}, 1400);
		return () => clearTimeout(t);
	}, [pieces, won, lost]);

	function handleClick(index: number) {
		if (won || lost) return;
		if (!userInteractedRef.current) {
			userInteractedRef.current = true;
			playingSinceRef.current = Date.now();
		}
		if (selected === null) {
			setSelected(index);
			return;
		}
		if (selected === index) {
			setSelected(null);
			return;
		}
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

	function handleWinContinue() {
		if (!userInteractedRef.current) {
			userInteractedRef.current = true;
			playingSinceRef.current = Date.now();
		}
		if (finishedRef.current) return;
		finishedRef.current = true;
		onCompleteRef.current({ result: "win", score: 100 });
	}

	const correctCount = pieces.filter((p, i) => p.id === i).length;
	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;
	const lowTime = timeLeft <= 10 && !won && !lost;

	const bgSize = `${size * 100}% ${size * 100}%`;

	function getBgPos(id: number) {
		const row = Math.floor(id / size);
		const col = id % size;
		const posX = size === 1 ? 0 : (col * 100) / (size - 1);
		const posY = size === 1 ? 0 : (row * 100) / (size - 1);
		return `${posX}% ${posY}%`;
	}

	return (
		<div className="dg-root">
			<div className="dg-hud">
				<div className="dg-title-wrap">
					<div className="dg-title serif">{level.name}</div>
					<div className="dg-sub">场景拼图 · {level.historyNote}</div>
				</div>
				<div className="dg-stats">
					<div className={`dg-timer ${lowTime ? "low" : ""}`}>
						<Clock size={14} />
						<span>{timeStr}</span>
					</div>
					<div className="dg-stat">交换 {moves}</div>
					<div className="dg-stat">复位 {correctCount}/{total}</div>
					<button
						className="btn btn-ghost"
						onClick={() => setShowPreview(true)}
						style={{ padding: "4px 8px", gap: "4px" }}
						title="预览原图"
					>
						<Eye size={14} /> 预览
					</button>
				</div>
			</div>

			<p className="dg-hint">
				点击两块切片可交换位置——将散落的场景碎片拼回完整画面，还原历史瞬间。
				需要参考时，点击右上角「👁 预览」查看原图。
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
									selected === i ? "selected" : "",
									correct ? "correct" : "",
								]
									.filter(Boolean)
									.join(" ")}
								onClick={() => handleClick(i)}
								disabled={won || lost}
								style={{
									backgroundImage: `url(${sceneUrl})`,
									backgroundSize: bgSize,
									backgroundPosition: getBgPos(p.id),
									backgroundRepeat: "no-repeat",
								}}
							>
								<span className="dg-piece-num">{p.id + 1}</span>
								<span className="dg-piece-pattern" />
							</button>
						);
					})}
				</div>
				{won && <div className="dg-glow" />}

				{won && (
					<div className="dg-result win">
						<CheckCircle2 size={42} />
						<div className="dg-result-title">拼图完成！</div>
						<div className="dg-result-sub">共 {moves} 步 · 剩余 {timeStr}</div>
						<button
							onClick={handleWinContinue}
							style={{
								position: "relative",
								marginTop: "16px",
								padding: "10px 28px",
								background: "#c0392b",
								color: "#fff",
								border: "1px solid #e05a4a",
								borderRadius: "6px",
								fontFamily: "var(--font-serif)",
								fontSize: "14px",
								letterSpacing: "0.2em",
								cursor: "pointer",
								boxShadow: "0 2px 10px rgba(192, 57, 43, 0.5)",
							}}
						>
							继 续
						</button>
					</div>
				)}
				{lost && (
					<div className="dg-result lose">
						<div className="dg-result-title">时已尽</div>
						<div className="dg-result-sub">仍推进剧情</div>
					</div>
				)}
			</div>

			<div className="dg-actions">
				<button className="btn btn-ghost" onClick={initBoard} disabled={won || lost}>
					<RotateCcw size={14} /> 重新打散
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>
					跳过
				</button>
			</div>

			{showPreview && (
				<div
					onClick={() => setShowPreview(false)}
					style={{
						position: "fixed",
						inset: 0,
						zIndex: 9999,
						background: "rgba(0, 0, 0, 0.92)",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: "20px",
						padding: "24px",
					}}
				>
					<div
						style={{
							maxWidth: "90vw",
							maxHeight: "75vh",
							width: "auto",
							height: "auto",
							border: "2px solid var(--color-gold, #b8973a)",
							borderRadius: "8px",
							boxShadow: "0 0 40px rgba(184, 151, 58, 0.4)",
							overflow: "hidden",
						}}
					>
						<img
							src={sceneUrl}
							alt={level.name}
							style={{
								display: "block",
								maxWidth: "90vw",
								maxHeight: "75vh",
								objectFit: "contain",
							}}
						/>
					</div>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
						<div style={{ color: "#b8973a", fontSize: "16px", letterSpacing: "0.2em" }}>
							{level.name}
						</div>
						<div style={{ color: "rgba(242, 236, 216, 0.55)", fontSize: "12px" }}>
							{level.historyNote}
						</div>
					</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setShowPreview(false);
						}}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "6px",
							padding: "8px 20px",
							background: "rgba(0, 0, 0, 0.6)",
							color: "#f2ecd8",
							border: "1px solid var(--color-gold, #b8973a)",
							borderRadius: "6px",
							fontSize: "13px",
							letterSpacing: "0.15em",
							cursor: "pointer",
						}}
					>
						<X size={14} /> 关闭
					</button>
				</div>
			)}
		</div>
	);
}
