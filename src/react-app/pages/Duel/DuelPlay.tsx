import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import "./DuelPlay.css";
import { getMinigame } from "../../minigames/registry";
import type { MinigameOutcome } from "../../minigames/types";
import { DUEL_CHARACTER_MAP, saveDuelRecord, DUEL_GAME_MAP } from "../../data/duel";
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
    const raw = searchParams.get("games");
    return raw ? raw.split(",") : ["card", "zongheng", "zhuhou"];
  }, [searchParams]);

  const [round, setRound] = useState(0);
  const [results, setResults] = useState<("win" | "lose" | "draw")[]>([]);
  const [done, setDone] = useState(false);
  const [roundResult, setRoundResult] = useState<{ result: "win" | "lose" | "draw"; gameName: string } | null>(null);
  // 新一局开场提示
  const [showIntro, setShowIntro] = useState(true);

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
  const gameEntry = getMinigame(currentGame);
  const GameComp = gameEntry?.Component;

  const handleComplete = useCallback(
    (outcome: MinigameOutcome) => {
      const result: "win" | "lose" | "draw" =
        outcome.result === "win" ? "win" : outcome.result === "lose" ? "lose" : "draw";
      const newResults = [...results, result];
      setResults(newResults);
      setRoundResult({ result, gameName: gameDef?.name || currentGame });
    },
    [results, currentGame, gameDef],
  );

  const handleSkip = useCallback(() => {
    handleComplete({ result: "lose", score: 0 });
  }, [handleComplete]);

  const goNext = useCallback(() => {
    setRoundResult(null);
    setShowIntro(true);
    const nextRound = round + 1;
    const pw = results.filter((r) => r === "win").length;
    const ow = results.filter((r) => r === "lose").length;

    if (pw >= 2 || ow >= 2 || nextRound >= games.length) {
      const finalResult: "win" | "lose" = pw > ow ? "win" : "lose";
      setDone(true);

      if (!savedRef.current) {
        savedRef.current = true;
        const record: DuelRecord = {
          playerId,
          opponentId,
          games: games.slice(0, results.length),
          results: results as ("win" | "lose" | "draw")[],
          finalResult,
          date: Date.now(),
        };
        saveDuelRecord(record);
      }
    } else {
      setRound(nextRound);
    }
  }, [round, results, games, playerId, opponentId]);

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
          第 {Math.min(round + 1, games.length)}/{games.length} 局
          {!done && !roundResult && <span className="dp-hud-game"> · {gameDef?.name || currentGame}</span>}
        </div>
      </div>

      <div className="dp-game-area">
        {/* 开场提示 */}
        {!done && !roundResult && showIntro && GameComp && (
          <div className="dp-intro">
            <h2 className="dp-intro-title serif">{gameDef?.name || currentGame}</h2>
            <p className="dp-intro-desc">{gameDef?.desc || ""}</p>
            <span className="dp-intro-type">{gameDef?.type || ""} · {"★".repeat(gameDef?.difficulty || 1)}</span>
            <button className="dp-btn-next-round" onClick={() => setShowIntro(false)}>
              开始对战
            </button>
          </div>
        )}

        {/* 游戏中 */}
        {!done && !roundResult && !showIntro && GameComp && (
          <div className="dp-game-wrap">
            <GameComp
              key={`duel-${round}-${currentGame}`}
              storyKey={`duel:${playerId}:${opponentId}`}
              onComplete={handleComplete}
              onSkip={handleSkip}
            />
          </div>
        )}

        {/* 无此游戏 */}
        {!done && !roundResult && !GameComp && (
          <div className="dp-intro">
            <h2 className="dp-intro-title serif">未找到游戏 "{currentGame}"</h2>
            <button className="dp-btn-next-round" onClick={handleSkip}>跳过</button>
          </div>
        )}

        {/* 单局结束 */}
        {!done && roundResult && (
          <div className="dp-between">
            <div className="dp-between-rounds">
              {games.map((g, i) => (
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
                {roundResult.result === "win" ? "胜" : roundResult.result === "lose" ? "负" : "和"}
              </span>
            </div>
            <button className="dp-btn-next-round" onClick={goNext}>
              {round + 1 >= games.length || playerWins + (roundResult.result === "win" ? 1 : 0) >= 2 || opponentWins + (roundResult.result === "lose" ? 1 : 0) >= 2 ? "查看结果" : "下一局"}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
