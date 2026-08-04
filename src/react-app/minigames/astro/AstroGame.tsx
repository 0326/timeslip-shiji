// 星象授时（Astro Memory Match）—— 记忆匹配小游戏
// 适配故事线：黄帝治天下 / 帝尧敬授民时
// 玩法：4×4 星图卡片（8对，正面朝下）。翻开两张，配对"星宿-节气"则保持翻开，
//       不配对则 1.5s 后翻回。全部配对完成即胜利，限时 90 秒，统计步数。
// 背景：古人观星象以定四时。玩家需记住星图位置，配对对应的节气与星宿。

import { useCallback, useEffect, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./astro.css";

// ── 星宿-节气 配对数据（8 对） ──
interface Pair {
	star: string; // 星宿名
	term: string; // 节气名
}
const PAIRS: Pair[] = [
	{ star: "心宿·大火", term: "夏至" },
	{ star: "参宿", term: "冬至" },
	{ star: "女宿", term: "秋分" },
	{ star: "房宿", term: "春分" },
	{ star: "昴宿", term: "立秋" },
	{ star: "虚宿", term: "秋收" },
	{ star: "翼宿", term: "夏至" },
	{ star: "斗宿", term: "立冬" },
];

interface Card {
	id: number; // 唯一卡牌 id（0-15）
	pairId: number; // 所属配对 id（0-7）
	type: "star" | "term"; // 星宿 / 节气
	label: string; // 正面显示文字
}

const TIME_LIMIT = 90; // 限时秒数
const FLIP_BACK_MS = 1500; // 不配对时翻回延迟

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function buildDeck(): Card[] {
	const cards: Card[] = [];
	PAIRS.forEach((p, pairId) => {
		cards.push({ id: pairId * 2, pairId, type: "star", label: p.star });
		cards.push({ id: pairId * 2 + 1, pairId, type: "term", label: p.term });
	});
	return shuffle(cards);
}

export function AstroGame({ onComplete, onSkip }: MinigameProps) {
	const [deck, setDeck] = useState<Card[]>(() => buildDeck());
	const [flipped, setFlipped] = useState<number[]>([]); // 当前翻开（待判定）的卡牌下标
	const [matchedPairIds, setMatchedPairIds] = useState<Set<number>>(new Set());
	const [moves, setMoves] = useState(0);
	const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
	const [won, setWon] = useState(false);
	const [lost, setLost] = useState(false);
	const [busy, setBusy] = useState(false);
	const lockRef = useRef(false);
	// 用户是否已实际交互。未交互前不启动倒计时，防止挂载后自动判负
	const userInteractedRef = useRef(false);

	// ── 倒计时：仅在用户已交互后启动 ──
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

	// ── 胜利检测 ──
	useEffect(() => {
		if (matchedPairIds.size === PAIRS.length && !won) {
			setWon(true);
		}
	}, [matchedPairIds, won]);

	// ── 胜利回调 ──
	useEffect(() => {
		if (won) {
			// 评分：基础 60 + 时间加成(0-20) + 步数加成(0-20)，区间 60-100
			sfx.play("win");
			const timeBonus = Math.round((timeLeft / TIME_LIMIT) * 20);
			const optimal = PAIRS.length;
			const moveBonus = Math.round((optimal / Math.max(moves, optimal)) * 20);
			const score = Math.min(100, 60 + timeBonus + moveBonus);
			const t = setTimeout(() => onComplete({ result: "win", score }), 900);
			return () => clearTimeout(t);
		}
	}, [won, timeLeft, moves, onComplete]);

	// ── 失败回调（仍推进剧情） ──
	useEffect(() => {
		if (lost) {
			sfx.play("lose");
			const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1500);
			return () => clearTimeout(t);
		}
	}, [lost, onComplete]);

	const onCardClick = useCallback(
		(idx: number) => {
			if (lockRef.current || won || lost) return;
			userInteractedRef.current = true;
			const card = deck[idx];
			if (matchedPairIds.has(card.pairId)) return; // 已配对
			if (flipped.includes(idx)) return; // 已翻开

			const newFlipped = [...flipped, idx];
			setFlipped(newFlipped);
			sfx.play("flip");

			if (newFlipped.length === 2) {
				setMoves((m) => m + 1);
				const [a, b] = newFlipped;
				const cardA = deck[a];
				const cardB = deck[b];
				lockRef.current = true;
				setBusy(true);
				if (cardA.pairId === cardB.pairId) {
					sfx.play("match");
					// 配对成功：短暂展示后保持翻开
					setTimeout(() => {
						setMatchedPairIds((prev) => new Set(prev).add(cardA.pairId));
						setFlipped([]);
						lockRef.current = false;
						setBusy(false);
					}, 480);
				} else {
					// 不配对：1.5s 后翻回
					sfx.play("wrong");
					setTimeout(() => {
						setFlipped([]);
						lockRef.current = false;
						setBusy(false);
					}, FLIP_BACK_MS);
				}
			}
		},
		[deck, flipped, matchedPairIds, won, lost],
	);

	function reset() {
		sfx.resetCombo();
		setDeck(buildDeck());
		setFlipped([]);
		setMatchedPairIds(new Set());
		setMoves(0);
		setTimeLeft(TIME_LIMIT);
		setWon(false);
		setLost(false);
		setBusy(false);
		lockRef.current = false;
	}

	const matchedCount = matchedPairIds.size;
	const timeLow = timeLeft <= 15 && !won && !lost;

	return (
		<div className="as-root">
			<div className="as-sky" aria-hidden="true" />

			<div className="as-hud">
				<div className="as-title serif">星象授时</div>
				<div className="as-stats">
					<span className={timeLow ? "as-warn" : ""}>⏳ {timeLeft}s</span>
					<span>·</span>
					<span>步数 {moves}</span>
					<span>·</span>
					<span>配对 {matchedCount}/{PAIRS.length}</span>
				</div>
			</div>

			<p className="as-hint">
				古人观星象以定四时。记住星图位置，配对对应的星宿与节气。
			</p>

			<div className="as-board">
				{deck.map((card, idx) => {
					const isFlipped = flipped.includes(idx) || matchedPairIds.has(card.pairId);
					const isMatched = matchedPairIds.has(card.pairId);
					return (
						<button
							key={card.id}
							className={[
								"as-card",
								isFlipped ? "flipped" : "",
								isMatched ? "matched" : "",
								card.type === "star" ? "as-card-star" : "as-card-term",
							].filter(Boolean).join(" ")}
							onClick={() => onCardClick(idx)}
							disabled={busy || won || lost || isMatched || (isFlipped && !isMatched)}
							aria-label={isFlipped ? card.label : "星图"}
						>
							<div className="as-card-inner">
								<div className="as-card-back">
									<span className="as-constellation" aria-hidden="true" />
								</div>
								<div className="as-card-front">
									<span className="as-card-tag">
										{card.type === "star" ? "星宿" : "节气"}
									</span>
									<span className="as-card-label serif">{card.label}</span>
								</div>
							</div>
						</button>
					);
				})}
			</div>

			<div className="as-controls">
				<button className="btn btn-ghost" onClick={reset}>
					<RotateCcw size={14} /> 重置
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>
					跳过
				</button>
			</div>

			{won && (
				<div className="as-result win">
					<CheckCircle2 size={42} />
					<div className="as-result-title">授时成功！</div>
					<div className="as-result-sub">
						星宿节气，四时已定 · {moves} 步 · 余 {timeLeft}s
					</div>
				</div>
			)}
			{lost && (
				<div className="as-result lose">
					<div className="as-result-title">星象未明</div>
					<div className="as-result-sub">时限已尽，仍推进剧情</div>
				</div>
			)}
		</div>
	);
}
