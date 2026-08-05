import React, { useMemo, useState } from "react";
import { BackBar, EmptyState, Stars } from "../components/Primitives";
import type { Series, Character } from "vn-content-schemas";
import type { DeathEntry } from "vn-game-systems";

export interface DeathCodexPageProps {
  series: Series[];
  characters: Character[];
  deaths: DeathEntry[];
  /** 兼容 string[] 和 Set<string> 两种输入 */
  unlockedIds: string[] | Set<string>;
  onBack: () => void;
}

export function DeathCodexPage({
  series, characters, deaths, unlockedIds, onBack,
}: DeathCodexPageProps): React.ReactElement {
  const [seriesId, setSeriesId] = useState<string | "all">("all");

  const grouped = useMemo(() => {
    const filtered = seriesId === "all" ? deaths : deaths.filter((d) => d.series_id === seriesId);
    const byChar = new Map<string, DeathEntry[]>();
    for (const d of filtered) {
      const list = byChar.get(d.character_id) ?? [];
      list.push(d);
      byChar.set(d.character_id, list);
    }
    return byChar;
  }, [deaths, seriesId]);

  const charById = useMemo(() => new Map(characters.map((c) => [c.id, c])), [characters]);
  const seriesById = useMemo(() => new Map(series.map((s) => [s.id, s])), [series]);

  const unlockedSet = useMemo(
    () => (unlockedIds instanceof Set ? unlockedIds : new Set(unlockedIds)),
    [unlockedIds]
  );

  const totalCount = deaths.length;
  const unlockedCount = unlockedSet.size;

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner">
        <BackBar
          title={`死亡图鉴 · ${unlockedCount}/${totalCount}`}
          onBack={onBack}
          right={
            <div className="vn-btn-group">
              <button
                className={`vn-btn vn-btn-sm ${seriesId === "all" ? "vn-btn-primary" : ""}`}
                onClick={() => setSeriesId("all")}
              >
                全部
              </button>
              {series.map((s) => (
                <button
                  key={s.id}
                  className={`vn-btn vn-btn-sm ${seriesId === s.id ? "vn-btn-primary" : ""}`}
                  onClick={() => setSeriesId(s.id)}
                >
                  {s.name_short || s.name}
                </button>
              ))}
            </div>
          }
        />
        {totalCount === 0 ? (
          <EmptyState title="暂无死亡记录" body="当你在剧情中做出致命抉择时，记录会浮现。" />
        ) : (
          <div className="vn-vert-scroll" style={{ maxHeight: "calc(100vh - 160px)", display: "flex", flexDirection: "column", gap: 16 }}>
            {series.map((s) => {
              if (seriesId !== "all" && seriesId !== s.id) return null;
              const seriesChars = characters.filter((c) =>
                (s.era_tag && c.era === s.era_tag) ||
                c.related_storylines.some((sid) => s.storylines?.includes(sid))
              );
              const hasSeriesContent = seriesChars.some((c) => grouped.has(c.id)) || deaths.some((d) => d.series_id === s.id);
              if (!hasSeriesContent) return null;
              return (
                <div key={s.id} className="vn-panel">
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                    <h3 style={{ margin: 0, color: "var(--vn-accent)" }}>{s.name}</h3>
                    <span style={{ fontSize: 12, color: "var(--vn-text-dim)", letterSpacing: "0.2em" }}>
                      {s.era_tag || s.era}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {seriesChars.length === 0 && (
                      <div style={{ color: "var(--vn-text-dim)" }}>暂无相关人物死亡记录。</div>
                    )}
                    {seriesChars.map((c) => {
                      const charDeaths = grouped.get(c.id) ?? [];
                      return (
                        <div key={c.id} style={{ borderLeft: "2px solid var(--vn-border)", paddingLeft: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                            <div
                              style={{
                                width: 36, height: 36, borderRadius: "50%",
                                border: "1px solid var(--vn-border)",
                                background: "var(--vn-surface-2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: c.accent ?? "var(--vn-accent)",
                                fontFamily: "var(--vn-font-serif)", fontWeight: 700,
                              }}
                            >
                              {c.glyph ?? c.name.charAt(0)}
                            </div>
                            <div>
                              <h4 style={{ margin: 0, color: "var(--vn-accent)" }}>{c.name}</h4>
                              <div style={{ fontSize: 12, color: "var(--vn-text-dim)" }}>{c.title}</div>
                            </div>
                          </div>
                          {charDeaths.length === 0 ? (
                            <div style={{ fontSize: 13, color: "var(--vn-text-dim)", paddingLeft: 46 }}>
                              暂无死亡记录
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 46 }}>
                              {charDeaths.map((d) => {
                                const unlocked = unlockedSet.has(d.death_id);
                                return (
                                  <div
                                    key={d.death_id}
                                    className="vn-panel"
                                    style={{
                                      opacity: unlocked ? 1 : 0.5,
                                      padding: "12px 16px",
                                      background: unlocked ? "var(--vn-surface-2)" : "var(--vn-surface)",
                                    }}
                                  >
                                    {unlocked ? (
                                      <>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                          <span style={{ color: "var(--vn-danger)", fontWeight: 700 }}>
                                            {d.title}
                                          </span>
                                          <Stars count={d.rarity ?? 1} />
                                          {d.count > 1 && (
                                            <span style={{ fontSize: 12, color: "var(--vn-text-dim)" }}>
                                              ×{d.count}
                                            </span>
                                          )}
                                        </div>
                                        {d.reason && (
                                          <p style={{ margin: "6px 0 0", color: "var(--vn-text)", fontSize: 14, lineHeight: 1.8 }}>
                                            {d.reason}
                                          </p>
                                        )}
                                        {d.classical && (
                                          <p style={{ margin: "6px 0 0", color: "var(--vn-text-dim)", fontStyle: "italic", fontSize: 13 }}>
                                            「{d.classical}」
                                          </p>
                                        )}
                                        {d.analysis && (
                                          <p style={{ margin: "4px 0 0", color: "var(--vn-text-dim)", fontSize: 12 }}>
                                            史鉴：{d.analysis}
                                          </p>
                                        )}
                                        {d.first_at && (
                                          <div style={{ fontSize: 11, color: "var(--vn-text-dim)", marginTop: 4 }}>
                                            首次于 {new Date(d.first_at).toLocaleString()}
                                            {d.last_at && d.last_at !== d.first_at && (
                                              <> · 最近 {new Date(d.last_at).toLocaleString()}</>
                                            )}
                                          </div>
                                        )}
                                      </>
                                    ) : (
                                      <div style={{ color: "var(--vn-text-dim)", fontSize: 13 }}>
                                        🔒 走过这条死路才会显现
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
