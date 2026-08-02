// 统一文字（Unify Text）—— 汉字匹配小游戏
// 秦始皇线：书同文。六国文字异体纷呈，秦定小篆为正体。
// 玩法：12 张木牍（6 对），正面朝下。翻开两张，若为同一字的今字/古异体写法，则匹配成功。
// 全部匹配即胜；限时 60 秒，时尽则败。

import { useEffect, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./unify.css";

// ── 字形配对数据 ──
// 每对含「今字（标准）」与一种古写/异体，玩家须将二者匹配。
interface GlyphPair {
	pairId: number;
	word: string; // 现代字，用于「已统一」清单
	standard: { glyph: string; form: string };
	variant: { glyph: string; form: string };
	note: string;
}

const PAIRS: GlyphPair[] = [
	{
		pairId: 1,
		word: "马",
		standard: { glyph: "马", form: "今字" },
		variant: { glyph: "馬", form: "小篆" },
		note: "秦定小篆，马字写法归于一统",
	},
	{
		pairId: 2,
		word: "日",
		standard: { glyph: "日", form: "今字" },
		variant: { glyph: "☉", form: "甲骨文" },
		note: "甲骨文以圆中一点象日之形",
	},
	{
		pairId: 3,
		word: "月",
		standard: { glyph: "月", form: "今字" },
		variant: { glyph: "☾", form: "金文" },
		note: "金文以弦月之形写月",
	},
	{
		pairId: 4,
		word: "水",
		standard: { glyph: "水", form: "今字" },
		variant: { glyph: "氺", form: "古异体" },
		note: "古异体水字，后统一为水",
	},
	{
		pairId: 5,
		word: "山",
		standard: { glyph: "山", form: "今字" },
		variant: { glyph: "屾", form: "古异体" },
		note: "古异体山字，后归一为山",
	},
	{
		pairId: 6,
		word: "人",
		standard: { glyph: "人", form: "今字" },
		variant: { glyph: "亻", form: "偏旁变体" },
		note: "人作偏旁多省作亻",
	},
];

interface Card {
	uid: number;
	pairId: number;
	glyph: string;
	form: string;
}

const TIME_LIMIT = 60;

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
	let uid = 0;
	for (const p of PAIRS) {
		cards.push({ uid: uid++, pairId: p.pairId, glyph: p.standard.glyph, form: p.standard.form });
		cards.push({ uid: uid++, pairId: p.pairId, glyph: p.variant.glyph, form: p.variant.form });
	}
	return shuffle(cards);
}

type Phase = "playing" | "won" | "lost";

export function UnifyTextGame({ onComplete, onSkip }: MinigameProps) {
	const [deck, setDeck] = useState<Card[]>(() => buildDeck());
	const [flipped, setFlipped] = useState<number[]>([]); // 当前翻开但未判定的 uid
	const [matched, setMatched] = useState<number[]>([]); // 已匹配的 pairId
	const [mismatch, setMismatch] = useState<number[]>([]); // 短暂标记不匹配的 uid
	const [moves, setMoves] = useState(0);
	const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
	const [phase, setPhase] = useState<Phase>("playing");
	const lockRef = useRef(false);

	// ── 倒计时 ──
	useEffect(() => {
		if (phase !== "playing") return;
		if (timeLeft <= 0) {
			sfx.play("lose");
			setPhase("lost");
			return;
		}
		const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
		return () => clearTimeout(id);
	}, [phase, timeLeft]);

	// ── 胜利判定 ──
	useEffect(() => {
		if (phase !== "playing") return;
		if (matched.length === PAIRS.length) {
			sfx.play("win");
			setPhase("won");
		}
	}, [matched, phase]);

	// ── 结局回调 ──
	useEffect(() => {
		if (phase === "won") {
			const score = Math.max(60, Math.min(100, 60 + Math.round((timeLeft / TIME_LIMIT) * 40)));
			const t = setTimeout(() => onComplete({ result: "win", score }), 1300);
			return () => clearTimeout(t);
		}
		if (phase === "lost") {
			const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1500);
			return () => clearTimeout(t);
		}
	}, [phase, timeLeft, onComplete]);

	function onCardClick(card: Card) {
		if (phase !== "playing" || lockRef.current) return;
		if (matched.includes(card.pairId)) return;
		if (flipped.includes(card.uid)) return;

		const next = [...flipped, card.uid];
		setFlipped(next);
		sfx.play("flip");

		if (next.length === 2) {
			setMoves((m) => m + 1);
			lockRef.current = true;
			const [aUid, bUid] = next;
			const a = deck.find((c) => c.uid === aUid)!;
			const b = deck.find((c) => c.uid === bUid)!;
			if (a.pairId === b.pairId) {
				sfx.play("match");
				setTimeout(() => {
					setMatched((prev) => [...prev, a.pairId]);
					setFlipped([]);
					lockRef.current = false;
				}, 480);
			} else {
				sfx.play("wrong");
				setMismatch(next);
				setTimeout(() => {
					setFlipped([]);
					setMismatch([]);
					lockRef.current = false;
				}, 820);
			}
		}
	}

	function handleRestart() {
		setDeck(buildDeck());
		setFlipped([]);
		setMatched([]);
		setMismatch([]);
		setMoves(0);
		setTimeLeft(TIME_LIMIT);
		setPhase("playing");
		lockRef.current = false;
		sfx.resetCombo();
	}

	const matchedPairs = PAIRS.filter((p) => matched.includes(p.pairId));
	const lowTime = timeLeft <= 10;

	return (
		<div className="ut-root">
			<div className="ut-hud">
				<div className="ut-title-wrap">
					<div className="ut-title serif">统一文字</div>
					<div className="ut-subtitle">秦始皇 · 书同文</div>
				</div>
				<div className="ut-stats">
					<span className={`ut-timer ${lowTime ? "ut-timer-low" : ""}`}>
						<Clock size={14} />
						{timeLeft}s
					</span>
					<span className="ut-stat">翻 {moves}</span>
					<span className="ut-stat">
						已统一 {matched.length}/{PAIRS.length}
					</span>
				</div>
			</div>

			<p className="ut-hint">
				六国文字异写纷呈，秦定小篆为正体。翻开两枚木牍，将同一字的今字与古写匹配起来。
			</p>

			<div className="ut-grid">
				{deck.map((card) => {
					const isMatched = matched.includes(card.pairId);
					const isOpen = flipped.includes(card.uid) || isMatched;
					const isMismatch = mismatch.includes(card.uid);
					return (
						<button
							key={card.uid}
							className={[
								"ut-card",
								isOpen ? "ut-flipped" : "",
								isMatched ? "ut-matched" : "",
								isMismatch ? "ut-mismatch" : "",
							]
								.filter(Boolean)
								.join(" ")}
							onClick={() => onCardClick(card)}
							disabled={phase !== "playing"}
							type="button"
						>
							<div className="ut-card-inner">
								<div className="ut-face ut-back">
									<span className="ut-back-mark serif">篆</span>
								</div>
								<div className="ut-face ut-front">
									<span className="ut-glyph serif">{card.glyph}</span>
									<span className="ut-form">{card.form}</span>
								</div>
							</div>
						</button>
					);
				})}
			</div>

			{matchedPairs.length > 0 && (
				<div className="ut-unified">
					<div className="ut-unified-title">已统一文字</div>
					<div className="ut-unified-list">
						{matchedPairs.map((p) => (
							<div key={p.pairId} className="ut-unified-item">
								<span className="ut-unified-word serif">{p.word}</span>
								<span className="ut-unified-note">{p.note}</span>
							</div>
						))}
					</div>
				</div>
			)}

			<div className="ut-controls">
				<button className="btn btn-ghost" onClick={handleRestart} type="button">
					<RotateCcw size={14} /> 重来
				</button>
				<button className="btn btn-ghost" onClick={onSkip} type="button">
					跳过
				</button>
			</div>

			{phase === "won" && (
				<div className="ut-overlay ut-win">
					<CheckCircle2 size={44} />
					<div className="ut-overlay-title serif">书同文</div>
					<div className="ut-overlay-sub">
						六体归一，天下文字同风 · 剩余 {timeLeft}s · {moves} 次
					</div>
				</div>
			)}
			{phase === "lost" && (
				<div className="ut-overlay ut-lose">
					<div className="ut-overlay-title serif">时辰已尽</div>
					<div className="ut-overlay-sub">六国异体未尽归一，再试一次？</div>
					<button className="btn btn-vermilion" onClick={handleRestart} type="button">
						<RotateCcw size={14} /> 再来一局
					</button>
				</div>
			)}
		</div>
	);
}
