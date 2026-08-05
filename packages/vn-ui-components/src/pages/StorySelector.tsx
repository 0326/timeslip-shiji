import React, { useMemo } from "react";
import type { GameContent, Storyline, Character } from "vn-content-schemas";
import type { GameSystems } from "vn-game-systems";
import { isStorylineUnlocked } from "vn-game-systems";
import { Avatar, BackBar, Stars, SectionTitle } from "../components/Primitives";

export type StorylineWithLock = Storyline & { unlocked: boolean };

export interface StorySelectorProps {
  content: GameContent;
  systems: GameSystems;
  seriesId: string;
  onBack: () => void;
  onSelect: (storylineId: string) => void;
  onContinue?: (storylineId: string, slot: number) => void;
  onQuickStart?: (storylineId: string, mode: "official" | "free") => void;
}

export function StorySelector({
  content, systems, seriesId, onBack, onSelect, onContinue, onQuickStart,
}: StorySelectorProps): React.ReactElement {
  const series = useMemo(
    () => content.series.find(s => s.id === seriesId),
    [content, seriesId]
  );
  const storylines = useMemo(() => {
    const cleared = new Set(
      Object.keys(systems.stats.state.storyline_clears)
    );
    const chars = new Set(Object.keys(systems.characterCodex.state));
    const deaths = new Map<string, number>();
    for (const [k, v] of Object.entries(systems.deathCodex.entries)) deaths.set(k, v.count);
    return content.storylines
      .filter(s => s.series === seriesId)
      .map(s => ({
        ...s,
        unlocked: isStorylineUnlocked(s, { cleared, chars, deaths }),
      })) as StorylineWithLock[];
  }, [content, seriesId, systems]);
  // Satisfy unused prop check (optional callback wired by caller)
  void onQuickStart;

  const protags = new Map(
    content.characters.map((c: Character) => [c.id, c] as const)
  );

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner">
        <BackBar title={series ? `${series.name} · 篇章选择` : "篇章选择"} onBack={onBack} />
        {series && (
          <SectionTitle
            eyebrow={`Series · ${series.id.toUpperCase()}`}
            title={series.name}
            subtitle={series.tagline || undefined}
          />
        )}
        <hr className="vn-divider" />
        <div className="vn-vert-scroll" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {storylines.length === 0 ? (
            <div className="vn-panel" style={{ textAlign: "center" }}>
              <h3 style={{ color: "var(--vn-text-dim)" }}>此系列尚无故事线</h3>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {storylines.map((s) => {
                const protag = protags.get(s.protagonist);
                const cleared = systems.stats.isCleared(s.id);
                return (
                  <div
                    key={s.id}
                    className={`vn-story-card ${s.unlocked ? "" : "locked"}`}
                    onClick={() => s.unlocked && onSelect(s.id)}
                  >
                    <Avatar
                      name={protag?.name ?? s.protagonist}
                      glyph={protag?.glyph}
                      accent={protag?.accent}
                      size={64}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <h4>{s.title}</h4>
                        <Stars count={s.difficulty} />
                        {cleared && (
                          <span className="vn-tag" style={{ borderColor: "var(--vn-success)", color: "var(--vn-success)" }}>
                            已通关
                          </span>
                        )}
                        {!s.unlocked && (
                          <span className="vn-tag" style={{ color: "var(--vn-text-dim)" }}>未解锁</span>
                        )}
                      </div>
                      {s.subtitle && <div className="meta">{s.subtitle}</div>}
                      <div className="meta" style={{ marginTop: 4 }}>
                        {s.estimated_minutes ? `约 ${s.estimated_minutes} 分钟 · ` : ""}
                        模式：{s.mode === "official" ? "正史" : "自由"}
                        {s.cast.length > 0 && ` · 登场角色 ${s.cast.length + 1}`}
                      </div>
                      {s.synopsis && (
                        <div style={{ marginTop: 6, color: "var(--vn-text)", fontSize: 14 }}>{s.synopsis}</div>
                      )}
                    </div>
                    <div className="avatar-row">
                      <Avatar name={protag?.name ?? s.protagonist} glyph={protag?.glyph} accent={protag?.accent} />
                      {s.cast.slice(0, 3).map(id => {
                        const c = protags.get(id);
                        return <Avatar key={id} name={c?.name ?? id} glyph={c?.glyph} accent={c?.accent} />;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Use onContinue so downstream can wire save-continue dialog
void onContinue;
