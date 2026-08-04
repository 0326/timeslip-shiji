import { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Swords, Play } from "lucide-react";
import "./DuelRoom.css";
import { DUEL_CHARACTER_MAP, shuffle, DUEL_GAME_IDS, DUEL_GAME_MAP } from "../../data/duel";
import { resolveBgm } from "../../data/bgm";

/** 对决房间 BGM — 横戈跃马 */
const ROOM_BGM_TRACK = "battle_4";

export default function DuelRoom() {
  const { playerId = "", opponentId = "" } = useParams();
  const navigate = useNavigate();

  const player = DUEL_CHARACTER_MAP[playerId];
  const opponent = DUEL_CHARACTER_MAP[opponentId];

  /* ── 对决房间 BGM（横戈跃马，离开即停） ── */
  useEffect(() => {
    const track = resolveBgm(ROOM_BGM_TRACK);
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

  // 从 18 款游戏中随机选 3 款不重复
  const games = useMemo(() => {
    return shuffle([...DUEL_GAME_IDS]).slice(0, 3);
  }, []);

  if (!player || !opponent) {
    return (
      <div className="duel-room">
        <div className="duel-room-empty">
          <h2 className="serif">未找到角色</h2>
          <button className="btn btn-primary" onClick={() => navigate("/duel")}>返回角色选择</button>
        </div>
      </div>
    );
  }

  return (
    <div className="duel-room">
      <div className="dr-bg" />

      <header className="dr-nav">
        <button className="dr-back" onClick={() => navigate("/duel")}>
          <ArrowLeft size={16} />
          <span>返回选角</span>
        </button>
      </header>

      <div className="dr-showdown">
        <motion.div className="dr-fighter dr-player" initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <div className="dr-fighter-label">我方</div>
          <div className="dr-fighter-img" style={{ backgroundImage: `url(${player.portraitUrl})` }} />
          <div className="dr-fighter-name serif">{player.name}</div>
          <div className="dr-fighter-era">{player.era}</div>
        </motion.div>

        <div className="dr-vs">
          <Swords size={36} />
          <span className="dr-vs-label serif">宿命对决</span>
        </div>

        <motion.div className="dr-fighter dr-opponent" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}>
          <div className="dr-fighter-label">对手</div>
          <div className="dr-fighter-img" style={{ backgroundImage: `url(${opponent.portraitUrl})` }} />
          <div className="dr-fighter-name serif">{opponent.name}</div>
          <div className="dr-fighter-era">{opponent.era}</div>
        </motion.div>
      </div>

      <motion.div className="dr-bottom" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <div className="dr-games-preview">
          <span className="dr-games-label">三局对战：</span>
          {games.map((g, i) => {
            const def = DUEL_GAME_MAP[g];
            return (
              <span key={g} className="dr-game-tag">
                {i > 0 && <span className="dr-game-sep">→</span>}
                {def?.name || g}
              </span>
            );
          })}
        </div>
        <p className="dr-games-hint">每局随机从 18 款小游戏中抽取，胜负由你掌控</p>
        <button className="dr-start-btn" onClick={() => navigate(`/duel/${playerId}/vs/${opponentId}/play?games=${games.join(",")}`)}>
          <Play size={18} />
          <span>开战</span>
        </button>
      </motion.div>
    </div>
  );
}
