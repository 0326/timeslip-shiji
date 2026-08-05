import React, { useMemo, useState } from "react";
import { BackBar, EmptyState } from "../components/Primitives";
import type { Classic, Series } from "vn-content-schemas";

export interface ClassicsPageProps {
  series: Series[];
  classics: Classic[];
  unlocked: Set<string>;
  onBack: () => void;
  onSelect?: (classicId: string, chapterId: string) => void;
}

export function ClassicsPage({
  series, classics, unlocked, onBack, onSelect,
}: ClassicsPageProps): React.ReactElement {
  const [filter, setFilter] = useState<string>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const bySeries = useMemo(() => {
    const m = new Map<string, Classic[]>();
    for (const c of classics) {
      const list = m.get(c.series_id) ?? [];
      list.push(c);
      m.set(c.series_id, list);
    }
    return m;
  }, [classics]);

  const total = classics.reduce((s, c) => s + c.chapters.length, 0);
  const unlockedCount = Array.from(unlocked).filter((id) => id.includes(":")).length;

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner">
        <BackBar
          title={`典籍阁 · ${unlockedCount}/${total}`}
          onBack={onBack}
          right={
            <div className="vn-btn-group">
              <button
                className={`vn-btn vn-btn-sm ${filter === "all" ? "vn-btn-primary" : ""}`}
                onClick={() => setFilter("all")}
              >
                全部
              </button>
              {series.map((s) => (
                <button
                  key={s.id}
                  className={`vn-btn vn-btn-sm ${filter === s.id ? "vn-btn-primary" : ""}`}
                  onClick={() => setFilter(s.id)}
                >
                  {s.name_short || s.name}
                </button>
              ))}
            </div>
          }
        />
        {classics.length === 0 ? (
          <EmptyState title="典籍空空" body="完成特定剧情后，相关史书典籍会入阁。" />
        ) : (
          <div className="vn-vert-scroll" style={{ maxHeight: "calc(100vh - 160px)" }}>
            {series.map((s) => {
                if (filter !== "all" && filter !== s.id) return null;
                const sc = bySeries.get(s.id) ?? [];
                if (sc.length === 0) return null;
                return (
                  <div key={s.id} style={{ marginBottom: 24 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                      <h3 style={{ margin: 0, color: "var(--vn-accent)" }}>{s.name}</h3>
                      <span style={{ color: "var(--vn-text-dim)", fontSize: 12, letterSpacing: "0.2em" }}>
                        {s.era_tag || s.era}
                      </span>
                    </div>
                  {sc.map((c) => {
                    const isOpen = expanded[c.id] ?? false;
                    return (
                      <div key={c.id} className="vn-panel" style={{ marginBottom: 12, padding: "16px 20px" }}>
                        <div
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
                          onClick={() => toggle(c.id)}
                        >
                          <div>
                            <h4 style={{ margin: 0, color: "var(--vn-accent)" }}>{c.name}</h4>
                            <div style={{ fontSize: 12, color: "var(--vn-text-dim)" }}>
                              {c.author ?? "佚名"} · {c.dynasty ?? "—"}
                            </div>
                          </div>
                          <div style={{ color: "var(--vn-text-dim)", fontSize: 13 }}>
                            {c.chapters.filter((ch) => unlocked.has(`${c.id}:${ch.id}`)).length}/{c.chapters.length} 章
                          </div>
                        </div>
                        {isOpen && (
                          <div style={{ marginTop: 14 }}>
                            {c.description && (
                              <p style={{ color: "var(--vn-text-dim)", margin: "0 0 12px", fontSize: 14 }}>
                                {c.description}
                              </p>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              {c.chapters.map((ch) => {
                                const chKey = `${c.id}:${ch.id}`;
                                const isUnlocked = unlocked.has(chKey);
                                return (
                                  <div
                                    key={ch.id}
                                    className={`vn-classics-chapter ${isUnlocked ? "" : ""}`}
                                    style={{ opacity: isUnlocked ? 1 : 0.5, cursor: onSelect && isUnlocked ? "pointer" : "default" }}
                                    onClick={() => { if (onSelect && isUnlocked) onSelect(c.id, ch.id); }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <h4>{isUnlocked ? ch.title : "？？？未解锁"}</h4>
                                      {ch.source && <span className="src">—— {ch.source}</span>}
                                    </div>
                                    {isUnlocked ? (
                                      <>
                                        {ch.classical_text && (
                                          <div className="classical">{ch.classical_text}</div>
                                        )}
                                        {ch.vernacular_text && (
                                          <div className="vernacular">{ch.vernacular_text}</div>
                                        )}
                                      </>
                                    ) : (
                                      <div style={{ color: "var(--vn-text-dim)", fontSize: 13 }}>
                                        🔒 继续深入剧情以解锁这一章。
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
