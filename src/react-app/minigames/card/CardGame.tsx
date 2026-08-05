// 竹简牌局（Bamboo Slip Cards）—— 牌九博弈小游戏
// 玩法：玩家与AI对手各持5张竹简牌，5回合内比牌面大小决胜负。
// 牌面大小：天 > 地 > 人 > 马 > 一 > 二 > 三 > 四 > 五 > 六 > 七 > 八
// 适配：谋士线通用

import { useEffect, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, ChevronRight, ScrollText, X } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./card.css";

interface CardType {
	key: string;
	name: string; // 单字显示：天/地/人/马/一…八
	points: number; // 点数（仅展示）
	rank: number; // 0=最大, 11=最小
}

// 12种牌，每种4张共48张；rank 决定胜负（越小越大）
const CARD_TYPES: CardType[] = [
	{ key: "tian", name: "天", points: 12, rank: 0 },
	{ key: "di", name: "地", points: 2, rank: 1 },
	{ key: "ren", name: "人", points: 8, rank: 2 },
	{ key: "ma", name: "马", points: 7, rank: 3 },
	{ key: "1", name: "一", points: 1, rank: 4 },
	{ key: "2", name: "二", points: 2, rank: 5 },
	{ key: "3", name: "三", points: 3, rank: 6 },
	{ key: "4", name: "四", points: 4, rank: 7 },
	{ key: "5", name: "五", points: 5, rank: 8 },
	{ key: "6", name: "六", points: 6, rank: 9 },
	{ key: "7", name: "七", points: 7, rank: 10 },
	{ key: "8", name: "八", points: 8, rank: 11 },
];

interface Card {
	id: number;
	type: CardType;
}

const TOTAL_ROUNDS = 5;
const HAND_SIZE = 5;

function buildDeck(): Card[] {
	const deck: Card[] = [];
	let id = 0;
	for (const t of CARD_TYPES) {
		for (let i = 0; i < 4; i++) {
			deck.push({ id: id++, type: t });
		}
	}
	return deck;
}

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function deal(): { player: Card[]; ai: Card[] } {
	const deck = shuffle(buildDeck());
	return {
		player: deck.slice(0, HAND_SIZE),
		ai: deck.slice(HAND_SIZE, HAND_SIZE * 2),
	};
}

// AI策略：随机出牌，但避免出最大的牌（剩余手牌中 rank 最小=最大的那张）
function pickAiCard(hand: Card[]): Card {
	if (hand.length <= 1) return hand[0];
	let maxIdx = 0;
	for (let i = 1; i < hand.length; i++) {
		if (hand[i].type.rank < hand[maxIdx].type.rank) maxIdx = i;
	}
	const candidates = hand.filter((_, i) => i !== maxIdx);
	return candidates[Math.floor(Math.random() * candidates.length)];
}

interface RoundResult {
	playerCard: Card;
	aiCard: Card;
	winner: "player" | "ai" | "tie";
}

export function CardGame({ onComplete, onSkip }: MinigameProps) {
	const [playerHand, setPlayerHand] = useState<Card[]>([]);
	const [aiHand, setAiHand] = useState<Card[]>([]);
	const [round, setRound] = useState(0); // 已完成回合数
	const [playerScore, setPlayerScore] = useState(0);
	const [aiScore, setAiScore] = useState(0);
	const [result, setResult] = useState<RoundResult | null>(null);
	const [finished, setFinished] = useState(false);
	const [showLegend, setShowLegend] = useState(false);

	// 初始发牌
	useEffect(() => {
		const { player, ai } = deal();
		setPlayerHand(player);
		setAiHand(ai);
	}, []);

	function playCard(card: Card) {
		if (result || finished || playerHand.length === 0) return;
		sfx.play("flip"); // 翻牌
		const aiCard = pickAiCard(aiHand);
		let winner: "player" | "ai" | "tie" = "tie";
		if (card.type.rank < aiCard.type.rank) winner = "player";
		else if (card.type.rank > aiCard.type.rank) winner = "ai";

		setResult({ playerCard: card, aiCard, winner });
		sfx.play("reveal"); // 比大小揭晓
		setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));
		setAiHand((prev) => prev.filter((c) => c.id !== aiCard.id));
		if (winner === "player") setPlayerScore((s) => s + 1);
		else if (winner === "ai") setAiScore((s) => s + 1);
	}

	function nextRound() {
		if (!result) return;
		setResult(null);
		const newRound = round + 1;
		setRound(newRound);
		if (newRound >= TOTAL_ROUNDS) {
			setFinished(true);
		}
	}

	// 游戏结束回调
	useEffect(() => {
		if (!finished) return;
		let outcome;
		if (playerScore > aiScore) {
			sfx.play("win");
			outcome = { result: "win" as const, score: playerScore >= 4 ? 100 : playerScore === 3 ? 80 : 60 };
		} else if (playerScore < aiScore) {
			sfx.play("lose");
			outcome = { result: "lose" as const, score: 0 };
		} else {
			// 平局：谋士未败，算作险胜
			sfx.play("win");
			outcome = { result: "win" as const, score: 60 };
		}
		const t = setTimeout(() => onComplete(outcome), 1400);
		return () => clearTimeout(t);
	}, [finished, playerScore, aiScore, onComplete]);

	function restart() {
		sfx.resetCombo();
		const { player, ai } = deal();
		setPlayerHand(player);
		setAiHand(ai);
		setRound(0);
		setPlayerScore(0);
		setAiScore(0);
		setResult(null);
		setFinished(false);
	}

	const isTie = playerScore === aiScore;
	const isPlayerWin = playerScore >= aiScore; // 含平局（未败）

	return (
		<div className="cd-root">
			<div className="cd-hud">
				<div className="cd-title serif">竹简牌局</div>
				<div className="cd-score">
					<span className="cd-score-me">我 {playerScore}</span>
					<span className="cd-score-sep">:</span>
					<span className="cd-score-ai">敌 {aiScore}</span>
					<span className="cd-round">
						第 {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS} 回
					</span>
				</div>
			</div>

			<div className="cd-legend-toggle">
				<button className="btn btn-ghost cd-legend-btn" onClick={() => setShowLegend((v) => !v)}>
					<ScrollText size={14} /> 牌序
				</button>
				{showLegend && (
					<div className="cd-legend">
						<span className="cd-legend-label">大→小：</span>
						{CARD_TYPES.map((t, i) => (
							<span key={t.key} className="cd-legend-item">
								{t.name}
								{i < CARD_TYPES.length - 1 ? <span className="cd-legend-arrow">›</span> : null}
							</span>
						))}
					</div>
				)}
			</div>

			<div className="cd-board">
				{/* AI 手牌区（牌背朝上） */}
				<div className="cd-ai-row">
					<div className="cd-hand">
						{aiHand.map((c) => (
							<div key={c.id} className="cd-card cd-card-back">
								<div className="cd-card-back-text">竹</div>
							</div>
						))}
					</div>
				</div>

				{/* 出牌区 */}
				<div className="cd-arena">
					<div
						className={[
							"cd-played",
							"cd-ai-played",
							result?.winner === "ai" ? "winner" : "",
							result?.winner === "player" ? "loser" : "",
						]
							.filter(Boolean)
							.join(" ")}
					>
						{result ? (
							<div className="cd-card cd-card-sm">
								<div className="cd-card-name">{result.aiCard.type.name}</div>
								<div className="cd-card-points">{result.aiCard.type.points}点</div>
							</div>
						) : (
							<div className="cd-played-empty">对手待出</div>
						)}
					</div>

					<div className="cd-vs">
						{result ? (
							<div
								className={[
									"cd-result",
									result.winner === "player"
										? "cd-result-win"
										: result.winner === "ai"
											? "cd-result-lose"
											: "cd-result-tie",
								].join(" ")}
							>
								{result.winner === "player" ? "胜" : result.winner === "ai" ? "负" : "和"}
							</div>
						) : (
							<div className="cd-vs-text">VS</div>
						)}
					</div>

					<div
						className={[
							"cd-played",
							"cd-player-played",
							result?.winner === "player" ? "winner" : "",
							result?.winner === "ai" ? "loser" : "",
						]
							.filter(Boolean)
							.join(" ")}
					>
						{result ? (
							<div className="cd-card cd-card-sm">
								<div className="cd-card-name">{result.playerCard.type.name}</div>
								<div className="cd-card-points">{result.playerCard.type.points}点</div>
							</div>
						) : (
							<div className="cd-played-empty">点击出牌</div>
						)}
					</div>
				</div>

				{/* 玩家手牌区 */}
				<div className="cd-player-row">
					<div className="cd-hand">
						{playerHand.map((c) => (
							<button
								key={c.id}
								className="cd-card cd-card-face"
								disabled={!!result || finished}
								onClick={() => playCard(c)}
							>
								<div className="cd-card-name">{c.type.name}</div>
								<div className="cd-card-points">{c.type.points}点</div>
							</button>
						))}
					</div>
				</div>
			</div>

			<div className="cd-controls">
				<button className="btn btn-ghost" onClick={onSkip}>
					跳过
				</button>
				<button className="btn btn-ghost" onClick={restart}>
					<RotateCcw size={14} /> 重开
				</button>
				{result && !finished && (
					<button className="btn btn-ghost cd-btn-go" onClick={nextRound}>
						{round + 1 >= TOTAL_ROUNDS ? "决战" : "下一回合"}
						<ChevronRight size={14} />
					</button>
				)}
			</div>

			{finished && (
				<div className={`cd-overlay ${isPlayerWin ? "cd-overlay-win" : "cd-overlay-lose"}`}>
					{isPlayerWin ? <CheckCircle2 size={42} /> : <X size={42} />}
					<div className="cd-overlay-title">
						{isTie ? "势均力敌" : isPlayerWin ? "谋略胜出" : "惜败一筹"}
					</div>
					<div className="cd-overlay-sub">
						终局 {playerScore} : {aiScore} ·{" "}
						{isTie
							? "未分胜负"
							: playerScore > aiScore
								? "竹简在手，论道有方"
								: "再思一局，必有所得"}
					</div>
				</div>
			)}
		</div>
	);
}
