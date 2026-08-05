import React from "react";
import type { GameContent, Series } from "vn-content-schemas";
import { SectionTitle } from "./Primitives";

export interface MainMenuProps {
  content: GameContent;
  onStart: () => void;
  onContinue?: () => void;
  onSettings: () => void;
  onCodex: () => void;
  onGacha?: () => void;
  onAchievements: () => void;
  onClassics: () => void;
}

export function MainMenu({
  content, onStart, onContinue, onSettings, onCodex, onGacha, onAchievements, onClassics,
}: MainMenuProps): React.ReactElement {
  return (
    <div className="vn-screen">
      <div className="vn-screen-inner" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            fontFamily: "var(--vn-font-serif)",
            fontWeight: 900,
            fontSize: "clamp(48px, 9vw, 120px)",
            letterSpacing: "0.08em",
            color: "var(--vn-accent)",
            textShadow: "0 0 60px rgba(201,168,76,0.2)",
            lineHeight: 1,
          }}>
            {content.game_name}
          </div>
          <div style={{ color: "var(--vn-text-dim)", marginTop: 14, letterSpacing: "0.4em", fontFamily: "var(--vn-font-mono)", fontSize: 13 }}>
            HISTORICAL  ·  VISUAL  NOVEL
          </div>
        </div>

        <SectionTitle eyebrow="Select Mode" title="" />

        <div className="vn-btn-group" style={{ justifyContent: "center" }}>
          <button className="vn-btn vn-btn-primary vn-btn-lg" onClick={onStart}>开始新章</button>
          <button className="vn-btn vn-btn-lg" onClick={onContinue} disabled={!onContinue}>继续游戏</button>
          <button className="vn-btn vn-btn-lg" onClick={onCodex}>人物图鉴</button>
          <button className="vn-btn vn-btn-lg" onClick={onClassics}>典籍原文</button>
          <button className="vn-btn vn-btn-lg" onClick={onAchievements}>成就殿</button>
          {onGacha && <button className="vn-btn vn-btn-lg" onClick={onGacha}>抽卡追忆</button>}
          <button className="vn-btn vn-btn-lg" onClick={onSettings}>设置</button>
        </div>

        <hr className="vn-divider" style={{ marginTop: 20 }} />

        <div className="vn-grid" style={{ marginTop: 8 }}>
          {content.series
            .slice()
            .sort((a: Series, b: Series) => a.order - b.order)
            .map((s: Series) => (
              <div
                key={s.id}
                className={`vn-series-card ${s.coming_soon ? "coming-soon" : ""}`}
                style={{
                  background: `linear-gradient(180deg, ${s.bg_from}, ${s.bg_to})`,
                  borderColor: `${s.accent}55`,
                }}
              >
                <div>
                  <div className="series-id">Series #{String(s.order).padStart(2, "0")} · {s.era}</div>
                  <h3 style={{ color: s.accent }}>{s.name}</h3>
                  <div className="tagline">{s.tagline}</div>
                </div>
                <div className="glyph" style={{ color: s.accent }}>{s.glyph ?? s.name.charAt(0)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
