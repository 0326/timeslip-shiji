import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Swords, Search, ChevronRight, ScrollText } from "lucide-react";
import "./DuelLobby.css";
import {
  DUEL_CHARACTERS,
  getRivalsFor,
  getDuelWins,
  getDuelRank,
  DUEL_RANK_LABELS,
  DUEL_RANK_THRESHOLDS,
  DUEL_GAMES,
} from "../../data/duel";
import { resolveBgm } from "../../data/bgm";

/** 对决大厅 BGM — 兵临城下 */
const LOBBY_BGM_TRACK = "battle_2";

export default function DuelLobby() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(true);

  /* ── 大厅 BGM（兵临城下，离开即停） ── */
  useEffect(() => {
    const track = resolveBgm(LOBBY_BGM_TRACK);
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

  const wins = getDuelWins();
  const rank = getDuelRank();
  const rankLabel = DUEL_RANK_LABELS[rank];

  const nextRank = useMemo(() => {
    const idx = DUEL_RANK_THRESHOLDS.findIndex((t) => t.rank === rank);
    if (idx < DUEL_RANK_THRESHOLDS.length - 1) {
      return DUEL_RANK_THRESHOLDS[idx + 1];
    }
    return null;
  }, [rank]);

  const filtered = useMemo(() => {
    if (!search.trim()) return DUEL_CHARACTERS;
    const q = search.toLowerCase();
    return DUEL_CHARACTERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.era.toLowerCase().includes(q),
    );
  }, [search]);

  const rivals = selectedId ? getRivalsFor(selectedId) : [];

  return (
    <div className="duel-lobby">
      <div className="duel-bg">
        <div className="duel-bg-pattern" />
        <div className="duel-bg-vignette" />
      </div>

      <header className="duel-nav">
        <button className="duel-back" onClick={() => navigate("/")}>
          <ArrowLeft size={16} />
          <span>返回大厅</span>
        </button>
        <div className="duel-nav-title">
          <Swords size={18} />
          <span className="serif">对决模式</span>
        </div>
        <button
          className="duel-nav-rules-btn"
          onClick={() => setShowRules((v) => !v)}
        >
          <ScrollText size={14} />
          <span>{showRules ? "收起规则" : "游戏规则"}</span>
        </button>
        <div className="duel-rank-badge" title={`累计胜场：${wins}`}>
          <span className="duel-rank-label">{rankLabel}</span>
          <span className="duel-rank-wins">{wins}胜</span>
        </div>
      </header>

      <div className="duel-content">
        <section className="duel-pick">
          <h2 className="duel-section-title serif">选择你的角色</h2>
          <div className="duel-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="搜索角色名称或时代..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="duel-grid">
            {filtered.map((c, i) => (
              <motion.button
                key={c.id}
                className={`duel-card ${selectedId === c.id ? "selected" : ""}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setSelectedId(selectedId === c.id ? null : c.id)}
              >
                <div className="duel-card-img" style={{ backgroundImage: `url(${c.portraitUrl})` }} />
                <div className="duel-card-info">
                  <span className="duel-card-name serif">{c.name}</span>
                  <span className="duel-card-era">{c.era}</span>
                </div>
                {selectedId === c.id && <div className="duel-card-check" />}
              </motion.button>
            ))}
          </div>
        </section>

        <section className="duel-rivals">
          {selectedId && rivals.length > 0 ? (
            <>
              <h2 className="duel-section-title serif">选择对手</h2>
              <div className="duel-rivals-list">
                {rivals.map((r, i) => (
                  <motion.button
                    key={r.id}
                    className="duel-rival-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    onClick={() => navigate(`/duel/${selectedId}/vs/${r.id}`)}
                  >
                    <div className="duel-rival-img" style={{ backgroundImage: `url(${r.portraitUrl})` }} />
                    <div className="duel-rival-info">
                      <span className="duel-rival-name serif">{r.name}</span>
                      <span className="duel-rival-era">{r.era}</span>
                    </div>
                    <div className="duel-rival-vs">
                      <span className="duel-vs-text">VS</span>
                      <ChevronRight size={16} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          ) : selectedId && rivals.length === 0 ? (
            <div className="duel-empty"><p>该角色暂无可用对手</p></div>
          ) : (
            <div className="duel-tips">
              {/* 对决规则 */}
              <div className="duel-tips-card">
                <h3 className="serif">对决规则</h3>
                <ul>
                  <li>选择一名历史角色作为你的化身</li>
                  <li>挑战其宿命对手，三局两胜制</li>
                  <li>每局从 18 种小游戏中随机抽取 3 款不重复对战</li>
                  <li>战胜宿敌即可解锁史识，积累胜场晋升段位</li>
                </ul>
                <div className="duel-tips-rank">
                  <span>当前段位：</span>
                  <strong>{rankLabel}</strong>
                  {nextRank && (
                    <span className="duel-tips-next">
                      （距{DUEL_RANK_LABELS[nextRank.rank]}还需 {nextRank.wins - wins} 胜）
                    </span>
                  )}
                </div>
              </div>

              {/* 小游戏图鉴 */}
              {showRules && (
                <div className="duel-games-card">
                  <h3 className="serif">小游戏图鉴（{DUEL_GAMES.length} 款）</h3>
                  <div className="duel-games-grid">
                    {DUEL_GAMES.map((g) => (
                      <div key={g.id} className="duel-game-item">
                        <div className="duel-game-item-head">
                          <span className="duel-game-item-name serif">{g.name}</span>
                          <span className="duel-game-item-diff">{"★".repeat(g.difficulty)}</span>
                        </div>
                        <span className="duel-game-item-desc">{g.desc}</span>
                        <span className="duel-game-item-type">{g.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
