import { useEffect, useState } from "react";
import type { MinigameProps } from "../types";
import { RotateCcw, X, CheckCircle2 } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./zongheng.css";

type CardColor = "qi" | "chu" | "yan" | "zhao" | "wild";

interface Card {
  id: number;
  color: CardColor;
}

type Turn = "player" | "ai";
type GameStatus = "playing" | "win" | "lose";

const COLOR_NAMES: Record<CardColor, string> = {
  qi: "齐",
  chu: "楚",
  yan: "燕",
  zhao: "赵",
  wild: "纵横",
};

const COUNTRY_COLORS: CardColor[] = ["qi", "chu", "yan", "zhao"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;
  for (const color of COUNTRY_COLORS) {
    for (let i = 0; i < 7; i++) {
      deck.push({ id: id++, color });
    }
  }
  for (let i = 0; i < 2; i++) {
    deck.push({ id: id++, color: "wild" });
  }
  return deck;
}

function canPlayCard(card: Card, leaderColor: CardColor): boolean {
  return card.color === leaderColor || card.color === "wild";
}

function pickAiCard(hand: Card[], leaderColor: CardColor): { card: Card; newColor?: CardColor } | null {
  const sameColor = hand.filter((c) => c.color === leaderColor);
  if (sameColor.length > 0) {
    return { card: sameColor[Math.floor(Math.random() * sameColor.length)] };
  }
  const wilds = hand.filter((c) => c.color === "wild");
  if (wilds.length > 0) {
    const colorCounts: Record<string, number> = {};
    for (const c of hand) {
      if (c.color !== "wild") {
        colorCounts[c.color] = (colorCounts[c.color] ?? 0) + 1;
      }
    }
    let bestColor: CardColor = COUNTRY_COLORS[0];
    let bestCount = -1;
    for (const color of COUNTRY_COLORS) {
      const cnt = colorCounts[color] ?? 0;
      if (cnt > bestCount) {
        bestCount = cnt;
        bestColor = color;
      }
    }
    return { card: wilds[0], newColor: bestColor };
  }
  return null;
}

export function ZonghengGame({ onComplete, onSkip }: MinigameProps) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [aiHand, setAiHand] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [leaderCard, setLeaderCard] = useState<Card | null>(null);
  const [leaderColor, setLeaderColor] = useState<CardColor>("qi");
  const [turn, setTurn] = useState<Turn>("player");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [showWildPicker, setShowWildPicker] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<Card | null>(null);
  const [message, setMessage] = useState<string>("");
  const [drewThisTurn, setDrewThisTurn] = useState(false);
  // 初始化完成标记：防止挂载时空数组误判胜负
  const [initialized, setInitialized] = useState(false);

  function initGame() {
    sfx.resetCombo();
    let shuffled = shuffle(buildDeck());
    const player = shuffled.slice(0, 7);
    const ai = shuffled.slice(7, 14);
    let remaining = shuffled.slice(14);
    let firstCard: Card | null = null;
    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].color !== "wild") {
        firstCard = remaining[i];
        remaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
        break;
      }
    }
    if (!firstCard) {
      firstCard = { id: 9999, color: "qi" };
    }
    setDeck(remaining);
    setPlayerHand(player);
    setAiHand(ai);
    setDiscardPile([]);
    setLeaderCard(firstCard);
    setLeaderColor(firstCard.color);
    setTurn("player");
    setStatus("playing");
    setShowWildPicker(false);
    setPendingWildCard(null);
    setMessage("");
    setDrewThisTurn(false);
    setInitialized(true);
  }

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    // 初始化未完成时跳过判胜负，避免空数组误判
    if (!initialized) return;
    if (status !== "playing") return;
    if (playerHand.length === 0) {
      setStatus("win");
      sfx.play("win");
      const score = 75 + Math.floor(Math.random() * 20);
      const t = setTimeout(() => onComplete({ result: "win", score }), 1600);
      return () => clearTimeout(t);
    }
    if (aiHand.length === 0) {
      setStatus("lose");
      sfx.play("lose");
      const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1600);
      return () => clearTimeout(t);
    }
    if (deck.length === 0 && playerHand.length > 0 && aiHand.length > 0) {
      if (playerHand.length <= aiHand.length) {
        setStatus("win");
        sfx.play("win");
        const score = 75 + Math.floor(Math.random() * 20);
        const t = setTimeout(() => onComplete({ result: "win", score }), 1600);
        return () => clearTimeout(t);
      } else {
        setStatus("lose");
        sfx.play("lose");
        const t = setTimeout(() => onComplete({ result: "lose", score: 0 }), 1600);
        return () => clearTimeout(t);
      }
    }
  }, [initialized, playerHand.length, aiHand.length, deck.length, status, onComplete]);

  useEffect(() => {
    if (status !== "playing" || turn !== "ai") return;
    setMessage("苏秦思考中…");
    const t = setTimeout(() => {
      const choice = pickAiCard(aiHand, leaderColor);
      if (choice) {
        const newAiHand = aiHand.filter((c) => c.id !== choice.card.id);
        setAiHand(newAiHand);
        setDiscardPile((prev) => [...prev, choice.card]);
        setLeaderCard(choice.card);
        if (choice.newColor) {
          setLeaderColor(choice.newColor);
          setMessage(`苏秦出「纵横」，改盟主为「${COLOR_NAMES[choice.newColor]}」`);
        } else {
          setMessage(`苏秦瓦解${COLOR_NAMES[choice.card.color]}`);
        }
        sfx.play("place");
        setTimeout(() => {
          setTurn("player");
          setDrewThisTurn(false);
          setMessage("");
        }, 700);
      } else {
        if (deck.length > 0) {
          const drawn = deck[0];
          const newDeck = deck.slice(1);
          setDeck(newDeck);
          setAiHand((prev) => [...prev, drawn]);
          setMessage("苏秦摸了一张牌");
          sfx.play("match");
          setTimeout(() => {
            setTurn("player");
            setDrewThisTurn(false);
            setMessage("");
          }, 700);
        } else {
          setTurn("player");
          setDrewThisTurn(false);
          setMessage("");
        }
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [turn, status, aiHand, leaderColor, deck]);

  function hasPlayableCard(): boolean {
    return playerHand.some((c) => canPlayCard(c, leaderColor));
  }

  function playCard(card: Card) {
    if (status !== "playing" || turn !== "player") return;
    if (!canPlayCard(card, leaderColor)) return;
    if (card.color === "wild") {
      setPendingWildCard(card);
      setShowWildPicker(true);
      return;
    }
    commitPlayCard(card, card.color);
  }

  function commitPlayCard(card: Card, color: CardColor) {
    const newPlayerHand = playerHand.filter((c) => c.id !== card.id);
    setPlayerHand(newPlayerHand);
    setDiscardPile((prev) => [...prev, card]);
    setLeaderCard(card);
    setLeaderColor(color);
    setPendingWildCard(null);
    setShowWildPicker(false);
    if (card.color === "wild") {
      setMessage(`张仪出「纵横」，改盟主为「${COLOR_NAMES[color]}」`);
    } else {
      setMessage(`张仪瓦解${COLOR_NAMES[card.color]}`);
    }
    sfx.play("place");
    setTimeout(() => {
      setTurn("ai");
      setDrewThisTurn(false);
      setMessage("");
    }, 500);
  }

  function chooseWildColor(color: CardColor) {
    if (!pendingWildCard) return;
    commitPlayCard(pendingWildCard, color);
  }

  function drawCard() {
    if (status !== "playing" || turn !== "player") return;
    if (drewThisTurn) return;
    if (hasPlayableCard()) return;
    if (deck.length === 0) {
      setTurn("ai");
      setDrewThisTurn(false);
      return;
    }
    const drawn = deck[0];
    const newDeck = deck.slice(1);
    setDeck(newDeck);
    setPlayerHand((prev) => [...prev, drawn]);
    setDrewThisTurn(true);
    setMessage("张仪摸了一张牌");
    setTimeout(() => {
      setTurn("ai");
      setDrewThisTurn(false);
      setMessage("");
    }, 500);
  }

  const playable = hasPlayableCard();
  const canDraw = !playable && !drewThisTurn && deck.length > 0;
  const lastPlayed = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  return (
    <div className="zh-root">
      <div className="zh-hud">
        <div className="zh-title serif">连横破纵</div>
        <div className="zh-status">
          <span className="zh-turn zh-turn-player">张仪 {playerHand.length}</span>
          <span className="zh-turn-sep">·</span>
          <span className="zh-turn zh-turn-ai">苏秦 {aiHand.length}</span>
          <span className="zh-deck-count">牌堆 {deck.length}</span>
        </div>
      </div>

      <div className="zh-ai-row">
        <div className="zh-hand">
          {aiHand.map((c) => (
            <div key={c.id} className="zh-card zh-card-back">
              <div className="zh-card-back-text">纵</div>
            </div>
          ))}
        </div>
      </div>

      <div className="zh-board">
        <div className="zh-leader-zone">
          <div className="zh-zone-label">盟主牌</div>
          {leaderCard && (
            <div className={`zh-card zh-card-face zh-leader-card zh-color-${leaderColor}`}>
              <div className="zh-card-name">{COLOR_NAMES[leaderCard.color === "wild" ? "wild" : leaderColor]}</div>
              {leaderCard.color !== leaderColor && leaderCard.color === "wild" && (
                <div className="zh-card-sub">{COLOR_NAMES[leaderColor]}</div>
              )}
            </div>
          )}
          <div className="zh-zone-hint">当前可出：{COLOR_NAMES[leaderColor]}色 或 纵横</div>
        </div>

        <div className="zh-center-col">
          {message && <div className="zh-message">{message}</div>}
          <div className="zh-turn-indicator">
            {turn === "player" ? "— 张仪回合 —" : "— 苏秦回合 —"}
          </div>
        </div>

        <div className="zh-right-col">
          <div className="zh-deck-zone">
            <div className="zh-zone-label">牌堆</div>
            <div className="zh-card zh-card-back zh-deck-card">
              <div className="zh-card-back-text">牌</div>
              <div className="zh-deck-num">{deck.length}</div>
            </div>
          </div>
          <div className="zh-discard-zone">
            <div className="zh-zone-label">弃牌</div>
            {lastPlayed ? (
              <div className={`zh-card zh-card-face zh-discard-card zh-color-${lastPlayed.color}`}>
                <div className="zh-card-name">{COLOR_NAMES[lastPlayed.color]}</div>
              </div>
            ) : (
              <div className="zh-discard-empty">空</div>
            )}
          </div>
        </div>
      </div>

      <div className="zh-player-row">
        <div className="zh-hand">
          {playerHand.map((c) => {
            const ok = canPlayCard(c, leaderColor);
            return (
              <button
                key={c.id}
                className={`zh-card zh-card-face zh-color-${c.color} ${ok ? "zh-playable" : ""} ${!ok ? "zh-disabled" : ""}`}
                disabled={!ok || turn !== "player" || status !== "playing"}
                onClick={() => playCard(c)}
              >
                <div className="zh-card-name">{COLOR_NAMES[c.color]}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="zh-controls">
        <button className="btn btn-ghost" onClick={onSkip}>
          跳过
        </button>
        <button className="btn btn-ghost" onClick={initGame}>
          <RotateCcw size={14} /> 重开
        </button>
        <button
          className={`btn ${canDraw ? "btn-primary" : "btn-ghost"} ${!canDraw ? "zh-btn-disabled" : ""}`}
          onClick={drawCard}
          disabled={!canDraw || turn !== "player" || status !== "playing"}
        >
          摸牌
        </button>
      </div>

      {showWildPicker && (
        <div className="zh-wild-overlay">
          <div className="zh-wild-panel">
            <div className="zh-wild-title">选新盟主色</div>
            <div className="zh-wild-buttons">
              {COUNTRY_COLORS.map((color) => (
                <button
                  key={color}
                  className={`zh-wild-btn zh-color-${color}`}
                  onClick={() => chooseWildColor(color)}
                >
                  {COLOR_NAMES[color]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {status !== "playing" && (
        <div className={`zh-overlay ${status === "win" ? "zh-overlay-win" : "zh-overlay-lose"}`}>
          {status === "win" ? <CheckCircle2 size={44} /> : <X size={44} />}
          <div className="zh-overlay-title serif">
            {status === "win" ? "合纵已破，连横功成！" : "合纵稳固，张仪无功！"}
          </div>
          <div className="zh-overlay-sub">
            {status === "win"
              ? `终局 张仪剩 ${playerHand.length} 张 · 苏秦剩 ${aiHand.length} 张`
              : `终局 张仪剩 ${playerHand.length} 张 · 苏秦剩 ${aiHand.length} 张`}
          </div>
        </div>
      )}
    </div>
  );
}
