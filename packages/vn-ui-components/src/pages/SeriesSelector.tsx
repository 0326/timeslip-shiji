import React, { useMemo, useState } from "react";
import type { GameContent, Series } from "vn-content-schemas";
import { BackBar, SectionTitle } from "../components/Primitives";
import type { StorylineWithLock } from "../types";

export interface SeriesSelectorProps {
  content: GameContent;
  onBack: () => void;
  onSelect: (seriesId: string) => void;
  onCodex?: () => void;
}

export function SeriesSelector({ content, onBack, onSelect }: SeriesSelectorProps): React.ReactElement {
  const series = useMemo(
    () => [...content.series].sort((a: Series, b: Series) => a.order - b.order),
    [content]
  );

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner">
        <BackBar title="章回选择 · 系列" onBack={onBack} />
        <SectionTitle eyebrow="Series" title="选择时代章节" subtitle="从五帝开始，走向大一统" />
        <div className="vn-grid">
          {series.map((s: Series) => (
            <div
              key={s.id}
              className={`vn-series-card ${s.coming_soon ? "coming-soon" : ""}`}
              style={{
                background: `linear-gradient(180deg, ${s.bg_from}, ${s.bg_to})`,
                borderColor: `${s.accent}55`,
                minHeight: 380,
              }}
              onClick={() => !s.coming_soon && onSelect(s.id)}
            >
              <div>
                <div className="series-id">CHAPTER · {String(s.order).padStart(2, "0")}</div>
                <h3 style={{ color: s.accent, fontSize: 28 }}>{s.name}</h3>
                <div className="tagline">{s.tagline || "　"}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--vn-text-dim)", letterSpacing: "0.2em" }}>ERA</div>
                  <div style={{ color: s.accent, fontFamily: "var(--vn-font-mono)" }}>{s.era}</div>
                </div>
                <div className="glyph" style={{ color: s.accent }}>{s.glyph ?? s.name.charAt(0)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Re-export used in StorySelector
export type { StorylineWithLock };
