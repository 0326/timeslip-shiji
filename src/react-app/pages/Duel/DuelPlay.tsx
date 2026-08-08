import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import "./DuelPlay.css";
import { GameHost } from "../../minigames/GameHost";
import type { MinigameOutcome } from "../../minigames/types";
import { DUEL_CHARACTER_MAP, saveDuelRecord, DUEL_GAME_MAP, DUEL_GAME_IDS } from "../../data/duel";
import type { DuelRecord } from "../../data/duel";
import { resolveBgm } from "../../data/bgm";

/** 对局 BGM — 七剑战歌 */
const PLAY_BGM_TRACK = "battle_6";

export default function DuelPlay() {
  const { playerId = "", opponentId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const player = DUEL_CHARACTER_MAP[playerId];
  const opponent = DUEL_CHARACTER_MAP[opponentId];

  const games = useMemo(() => {
    const raw = searchParams.get('games');
    const parsed = raw
      ? raw.split(',').map((id) => id.trim()).filter((id) => DUEL_GAME_MAP[id])
      : [];
    // 对决模式固定为最多三局；非法/空参数回退到已注册游戏。
    return (parsed.length > 0 ? parsed : DUEL_GAME_IDS).slice(0, 3);
  }, [searchParams]);

  const [round, setRound] = useState(0);
  const [results, setResults] = useState<("win" | "lose" | "draw")[]>([]);
  const [done, setDone] = useState(false);
  const [roundResult, setRoundResult] = useState<{ result: "win" | "lose" | "draw"; gameName: string } | null>(null);
  // 新一局开场提示
  const [showIntro, setShowIntro] = useState(true);
  // ⭐ 对决模式专属：当前局的游戏是否已结束。一旦 true，立刻卸载 GameComp，避免小游戏的 win 覆盖层盖住 dp-between。
  const [gameUnmounted, setGameUnmounted] = useState(false);

  const savedRef = useRef(false);

  /* ── 对局 BGM（七剑战歌，离开即停） ── */
  useEffect(() => {
    const track = resolveBgm(PLAY_BGM_TRACK);
    if (!track.url) return;
    const audio = new Audio(track.url);
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.src = "";
      audio.load();
    };
  }, []);

  const playerWins = results.filter((r) => r === "win").length;
  const opponentWins = results.filter((r) => r === "lose").length;

  const currentGame = games[round];
  const gameDef = DUEL_GAME_MAP[currentGame];

  const handleComplete = useCallback(
    (outcome: MinigameOutcome) => {
      const result: "win" | "lose" | "draw" =
        outcome.result === "win" ? "win" : outcome.result === "lose" ? "lose" : "draw";
      setResults((prev) => {
        const newResults = [...prev, result];
        setRoundResult({ result, gameName: gameDef?.name || currentGame });
        return newResults;
      });
    },
    [currentGame, gameDef],
  );

  const goNext = useCallback(() => {
    setRoundResult(null);
    setShowIntro(true);
    setGameUnmounted(false);
    // 用函数式更新拿到最新 results
    setResults((prevResults) => {
      const nextRound = round + 1;
      const pw = prevResults.filter((r) => r === "win").length;
      const ow = prevResults.filter((r) => r === "lose").length;

      if (pw >= 2 || ow >= 2 || nextRound >= games.length) {
        const finalResult: "win" | "lose" = pw > ow ? "win" : "lose";
        setDone(true);

        if (!savedRef.current) {
          savedRef.current = true;
          const record: DuelRecord = {
            playerId,
            opponentId,
            games: games.slice(0, prevResults.length),
            results: prevResults as ("win" | "lose" | "draw")[],
            finalResult,
            date: Date.now(),
          };
          saveDuelRecord(record);
        }
      } else {
        setRound(nextRound);
      }
      return prevResults;
    });
  }, [round, games, playerId, opponentId]);

  // 按钮文案：根据最新战绩提前预判 5 局 3 胜制
  const nextBtnLabel = useMemo(() => {
    if (!roundResult) return "下一局";
    const addWin = roundResult.result === "win" ? 1 : 0;
    const addLose = roundResult.result === "lose" ? 1 : 0;
    const pwNext = playerWins + addWin;
    const owNext = opponentWins + addLose;
    const nextRound = round + 1;
    if (pwNext >= 2 || owNext >= 2 || nextRound >= games.length) return "查看结果";
    return "下一局 →";
  }, [roundResult, playerWins, opponentWins, round, games]);

  if (!player || !opponent) {
    return (
      <div className="dp-root">
        <div className="dp-empty">
          <h2 className="serif">未找到角色</h2>
          <button className="btn btn-primary" onClick={() => navigate("/duel")}>返回角色选择</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dp-root">
      <div className="dp-bg" />

      {/* HUD */}
      <div className="dp-hud">
        <button className="dp-hud-back" onClick={() => navigate(`/duel/${playerId}/vs/${opponentId}`)}>
          <ArrowLeft size={16} />
        </button>
        <div className="dp-hud-center">
          <span className="dp-hud-player">{player.name}</span>
          <span className="dp-hud-score">
            <span className="dp-wins">{playerWins}</span>
            <span className="dp-sep">:</span>
            <span className="dp-losses">{opponentWins}</span>
          </span>
          <span className="dp-hud-opponent">{opponent.name}</span>
        </div>
        <div className="dp-hud-round">
          第 {Math.min(round + 1, games.length)}/{games.length} 局 · 3 胜制
          {!done && !roundResult && <span className="dp-hud-game"> · {gameDef?.name || currentGame}</span>}
        </div>
      </div>

      <div className="dp-game-area">
        {/* 开场提示 */}
        {!done && !roundResult && showIntro && (
          <div className="dp-intro">
            <h2 className="dp-intro-title serif">{gameDef?.name || currentGame}</h2>
            <p className="dp-intro-desc">{gameDef?.desc || ""}</p>
            <span className="dp-intro-type">{gameDef?.type || ""} · {"★".repeat(gameDef?.difficulty || 1)}</span>
            <button className="dp-btn-next-round" onClick={() => setShowIntro(false)}>
              开始第 {round + 1} 局
            </button>
          </div>
        )}

        {/* ⭐ 游戏中 — 关键：对决模式也用 GameHost 包一层，确保小游戏的统一容器和行为一致；并且 gameUnmounted=true 立即卸载 ⭐ */}
        {!done && !roundResult && !showIntro && !gameUnmounted && (
          <div className="dp-game-wrap">
            <GameHost
              gameId={currentGame}
              storyKey={`duel:${playerId}:${opponentId}`}
              mode="strict"
              onComplete={handleComplete}
            />
          </div>
        )}

        {/* 单局结束 — 给 dp-between 加独立高 z-index 层级，确保绝对在最前显示按钮 */}
        {!done && roundResult && (
          <div className="dp-between" style={{ zIndex: 99999 }}>
            <div className="dp-between-rounds">
              {games.map((_g, i) => (
                <div key={i} className={`dp-round-dot ${results[i] ? (results[i] === "win" ? "win" : results[i] === "lose" ? "lose" : "draw") : i === round ? "current" : ""}`}>
                  {results[i] ? (
                    results[i] === "win" ? <CheckCircle2 size={18} /> : results[i] === "lose" ? <XCircle size={18} /> : <MinusCircle size={18} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="dp-round-verdict">
              <span className="dp-round-verdict-game">{roundResult.gameName}</span>
              <span className={`dp-round-verdict-result ${roundResult.result}`}>
                {roundResult.result === "win" ? "本局胜" : roundResult.result === "lose" ? "本局负" : "和局"}
              </span>
            </div>
            <button
              className="dp-btn-next-round"
              onClick={goNext}
              style={{
                boxShadow: "0 0 0 3px rgba(184,151,58,0.25), 0 4px 24px rgba(184,151,58,0.55)",
                minWidth: "220px",
              }}
            >
              {nextBtnLabel}
            </button>
          </div>
        )}

        {/* 全部结束 */}
        {done && (
          <div className="dp-result">
            <div className={`dp-result-icon ${playerWins > opponentWins ? "win" : "lose"}`}>
              {playerWins > opponentWins ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
            </div>
            <h2 className="serif dp-result-title">{playerWins > opponentWins ? "对决胜利！" : "惜败"}</h2>
            <p className="dp-result-score">{playerWins} : {opponentWins}</p>
            <div className="dp-result-actions">
              <button className="dp-btn-primary" onClick={() => navigate(`/duel/${playerId}/vs/${opponentId}/result`)}>查看结算</button>
              <button className="dp-btn-primary" style={{ background: "linear-gradient(135deg, var(--color-vermilion), #8c2e22)" }} onClick={() => navigate("/duel")}>返回对决大厅</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
