import { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, RotateCcw, ChevronRight } from "lucide-react";
import "./DuelResult.css";
import {
  DUEL_CHARACTER_MAP,
  getDuelWins,
  getDuelRank,
  DUEL_RANK_LABELS,
  DUEL_RANK_THRESHOLDS,
  loadDuelRecords,
  DUEL_GAME_MAP,
} from "../../data/duel";
import { resolveBgm } from "../../data/bgm";

/** 结算 BGM — 胜：凯旋 / 败：悲壮 */
const WIN_BGM_TRACK = "triumph_2";
const LOSE_BGM_TRACK = "tragic_3";

export default function DuelResult() {
  const { playerId = "", opponentId = "" } = useParams();
  const navigate = useNavigate();

  const player = DUEL_CHARACTER_MAP[playerId];
  const opponent = DUEL_CHARACTER_MAP[opponentId];

  // 取最近一条该对局的记录
  const record = useMemo(() => {
    const records = loadDuelRecords();
    return records
      .filter((r) => r.playerId === playerId && r.opponentId === opponentId)
      .sort((a, b) => b.date - a.date)[0];
  }, [playerId, opponentId]);

  const totalWins = getDuelWins();
  const rank = getDuelRank();
  const rankLabel = DUEL_RANK_LABELS[rank];

  const nextRank = useMemo(() => {
    const idx = DUEL_RANK_THRESHOLDS.findIndex((t) => t.rank === rank);
    if (idx < DUEL_RANK_THRESHOLDS.length - 1) {
      return DUEL_RANK_THRESHOLDS[idx + 1];
    }
    return null;
  }, [rank]);

  const gameName = (g: string) => DUEL_GAME_MAP[g]?.name || g;  // Hook 必须在条件返回之前调用；否则记录从无到有切换时会改变 Hook 顺序。
  useEffect(() => {
    if (!record) return;
    const trackId = record.finalResult === "win" ? WIN_BGM_TRACK : LOSE_BGM_TRACK;
    const track = resolveBgm(trackId);
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
  }, [record]);

  if (!player || !opponent || !record) {
    return (
      <div className="dr-result">
        <div className="drr-empty">
          <h2 className="serif">鏆傛棤瀵规垬璁板綍</h2>
          <button className="btn btn-primary" onClick={() => navigate("/duel")}>
            杩斿洖閫夎
          </button>
        </div>
      </div>
    );
  }

  const isWin = record.finalResult === "win";/* ── 结算 BGM（胜凯旋/败悲壮，离开即停） ── */
return (
    <div className="dr-result">
      <div className="drr-bg" />

      <header className="drr-nav">
        <button className="drr-back" onClick={() => navigate("/duel")}>
          <ArrowLeft size={16} />
          <span>返回选角</span>
        </button>
      </header>

      <div className="drr-content">
        {/* 标题 */}
        <motion.div
          className="drr-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className={`drr-title serif ${isWin ? "win" : "lose"}`}>
            {isWin ? "胜" : "负"}
          </h1>
          <p className="drr-subtitle">
            {player.name} vs {opponent.name}
          </p>
        </motion.div>

        {/* 两角色立绘 */}
        <motion.div
          className="drr-fighters"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={`drr-fighter ${isWin ? "" : "loser"}`}>
            <div
              className="drr-fighter-img"
              style={{ backgroundImage: `url(${player.portraitUrl})` }}
            />
            <span className="drr-fighter-name serif">{player.name}</span>
            {isWin && <Crown size={16} className="drr-crown" />}
          </div>
          <div className="drr-vs-big">
            <span className="drr-vs-score">
              {record.results.filter((r) => r === "win").length}
              <span className="drr-vs-colon">:</span>
              {record.results.filter((r) => r === "lose").length}
            </span>
            <span className="drr-vs-label">VS</span>
          </div>
          <div className={`drr-fighter ${isWin ? "loser" : ""}`}>
            <div
              className="drr-fighter-img"
              style={{ backgroundImage: `url(${opponent.portraitUrl})` }}
            />
            <span className="drr-fighter-name serif">{opponent.name}</span>
            {!isWin && <Crown size={16} className="drr-crown" />}
          </div>
        </motion.div>

        {/* 每局详情 */}
        <motion.div
          className="drr-rounds"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h3 className="drr-rounds-title serif">对局详情</h3>
          <div className="drr-rounds-list">
            {record.games.map((g, i) => {
              const r = record.results[i];
              return (
                <div
                  key={i}
                  className={`drr-round-item ${r === "win" ? "win" : r === "lose" ? "lose" : "draw"}`}
                >
                  <span className="drr-round-num">第{i + 1}局</span>
                  <span className="drr-round-game">{gameName(g)}</span>
                  <span className="drr-round-result">
                    {r === "win" ? "胜" : r === "lose" ? "负" : "和"}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 段位 */}
        <motion.div
          className="drr-rank-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="drr-rank-current">
            <span className="drr-rank-label-text">当前段位</span>
            <span className="drr-rank-value serif">{rankLabel}</span>
            <span className="drr-rank-wins">累计 {totalWins} 胜</span>
          </div>
          {nextRank && (
            <div className="drr-rank-next">
              距 {DUEL_RANK_LABELS[nextRank.rank]} 还需 {nextRank.wins - totalWins} 胜
            </div>
          )}
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="drr-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <button
            className="drr-btn-rematch"
            onClick={() =>
              navigate(
                `/duel/${playerId}/vs/${opponentId}/play?games=${record.games.join(",")}`,
              )
            }
          >
            <RotateCcw size={16} />
            再战一局
          </button>
          <button
            className="drr-btn-next"
            onClick={() => navigate(`/duel`)}
          >
            换人挑战
            <ChevronRight size={16} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
