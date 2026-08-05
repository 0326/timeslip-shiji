import React, { useMemo } from "react";
import type { Character, GameContent } from "vn-content-schemas";
import type { GameSystems } from "vn-game-systems";
import { BackBar } from "../components/Primitives";

export interface CharacterDetailPageProps {
  character: Character;
  unlocked: boolean;
  content: GameContent;
  systems: GameSystems;
  onClose: () => void;
  /** Back button label override */
  backToLabel?: string;
}

export function CharacterDetailPage({
  character, unlocked, content, systems, onClose, backToLabel = "返回",
}: CharacterDetailPageProps): React.ReactElement {
  const relatedStories = useMemo(
    () => content.storylines.filter(s =>
      s.protagonist === character.id || s.cast.includes(character.id)
    ),
    [content, character]
  );
  const owned = systems.gacha.ownedFigure(character.id);
  const relatedChars = useMemo(
    () => character.relations
      .map(r => content.characters.find(c => c.id === r.target_id))
      .filter((c): c is Character => Boolean(c)),
    [content, character]
  );

  const mainArt =
    character.assets.portrait_default ||
    character.assets.bust_default;

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner" style={{ height: "100%" }}>
        <BackBar
          title="人物详情"
          onBack={onClose}
          right={
            owned && (
              <span className="vn-tag" style={{ borderColor: character.accent, color: character.accent }}>
                图鉴已持有 ×{owned.count}
              </span>
            )
          }
        />
        <div className="vn-detail-layout">
          <aside className="vn-detail-aside">
            {mainArt ? (
              <img
                src={mainArt}
                alt={character.name}
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid var(--vn-border-strong)",
                  filter: unlocked ? "none" : "grayscale(1) brightness(0.4)",
                }}
              />
            ) : (
              <div
                className="big-glyph"
                style={{ color: character.accent }}
              >
                {character.glyph ?? character.name.charAt(0)}
              </div>
            )}
            <div style={{ textAlign: "center" }}>
              {character.title && (
                <div style={{ color: character.accent, letterSpacing: "0.2em", fontSize: 13 }}>
                  『{character.title}』
                </div>
              )}
              <div style={{ fontSize: 34, fontWeight: 900, margin: "6px 0 2px", color: character.accent }}>
                {unlocked ? character.name : "？？？"}
              </div>
              {character.style_name && unlocked && (
                <div style={{ color: "var(--vn-text-dim)" }}>字 {character.style_name}</div>
              )}
              <div style={{ display: "flex", gap: 6, justifyContent: "center", margin: "10px 0 4px" }}>
                <span className="vn-tag">{character.era}</span>
                {character.historical_source && unlocked && (
                  <span className="vn-tag">{character.historical_source}</span>
                )}
              </div>
            </div>
            {unlocked && character.classical_quote && (
              <>
                <div className="section-title">典籍名句</div>
                <div className="quote">“{character.classical_quote}”</div>
              </>
            )}
          </aside>
          <section className="vn-detail-main vn-vert-scroll">
            {unlocked ? (
              <>
                <h1 style={{ color: character.accent }}>{character.name} 传记</h1>
                <div className="tag-row">
                  <span className="vn-tag">朝序 #{character.dynasty_order}</span>
                  <span className="vn-tag">展示序 {character.order}</span>
                  {character.style_name && <span className="vn-tag">字 {character.style_name}</span>}
                </div>
                <div className="vn-panel" style={{ marginBottom: 20 }}>
                  <p style={{ lineHeight: 2, margin: 0 }}>
                    {character.bio_summary || character.description || "暂无长传记内容。"}
                  </p>
                </div>
                <h3 style={{ color: "var(--vn-accent)", margin: "0 0 8px" }}>
                  相关故事线（{relatedStories.length}）
                </h3>
                <div className="storyline-list">
                  {relatedStories.length === 0 ? (
                    <div style={{ color: "var(--vn-text-dim)" }}>暂无相关故事线</div>
                  ) : (
                    relatedStories.map(s => {
                      const cleared = systems.stats.isCleared(s.id);
                      return (
                        <div key={s.id} className="item">
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ color: "var(--vn-accent)", fontWeight: 600 }}>{s.title}</div>
                            <span className="vn-tag" style={{
                              borderColor: cleared ? "var(--vn-success)" : "var(--vn-border)",
                              color: cleared ? "var(--vn-success)" : "var(--vn-text-dim)",
                            }}>
                              {cleared ? "已通关" : s.mode === "official" ? "正史" : "自由"}
                            </span>
                          </div>
                          {s.subtitle && <div style={{ color: "var(--vn-text-dim)", fontSize: 13, marginTop: 2 }}>{s.subtitle}</div>}
                        </div>
                      );
                    })
                  )}
                </div>

                <h3 style={{ color: "var(--vn-accent)", margin: "22px 0 8px" }}>
                  人物关系（{character.relations.length}）
                </h3>
                {character.relations.length === 0 ? (
                  <div style={{ color: "var(--vn-text-dim)" }}>暂无关系定义</div>
                ) : (
                  <div>
                    {character.relations.map((r, i) => {
                      const target = relatedChars.find(c => c.id === r.target_id);
                      return (
                        <span key={i} className="relation-chip" style={{
                          borderColor: r.color || target?.accent || "var(--vn-border)",
                          color: r.color || target?.accent || "var(--vn-text)",
                        }}>
                          {r.label}：{target?.name || r.target_id}
                        </span>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="vn-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 90, opacity: 0.4 }}>？</div>
                <h3 style={{ color: "var(--vn-text-dim)", margin: "12px 0 4px" }}>此人物仍未解锁</h3>
                <p style={{ color: "var(--vn-text-dim)" }}>
                  在故事中登场后即可查阅人物详情。
                </p>
                <button className="vn-btn vn-btn-ghost" onClick={onClose}>
                  ← {backToLabel}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
