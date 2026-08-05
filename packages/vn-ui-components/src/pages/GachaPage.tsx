import React, { useMemo, useState } from "react";
import { BackBar, EmptyState } from "../components/Primitives";
import type { Character, GachaBanner, GachaPullResult } from "vn-content-schemas";

export interface GachaPageProps {
  banners: GachaBanner[];
  characters: Character[];
  owned: Set<string>;
  tickets: number;
  currency: number;
  onBack: () => void;
  onPull: (bannerId: string, times: 1 | 10) => GachaPullResult | null;
}

export function GachaPage({
  banners, characters, owned, tickets, currency, onPull, onBack,
}: GachaPageProps): React.ReactElement {
  const [activeBanner, setActiveBanner] = useState<string>(banners[0]?.id ?? "");
  const [lastResult, setLastResult] = useState<GachaPullResult | null>(null);

  const charById = useMemo(() => new Map(characters.map((c) => [c.id, c])), [characters]);
  const banner = banners.find((b) => b.id === activeBanner) ?? banners[0];

  const handlePull = (times: 1 | 10) => {
    if (!banner) return;
    const r = onPull(banner.id, times);
    if (r) setLastResult(r);
  };

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner">
        <BackBar
          title="召唤"
          onBack={onBack}
          right={
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <span className="vn-tag">🎟 抽卡券 ×{tickets}</span>
              <span className="vn-tag">💰 古钱 ×{currency}</span>
            </div>
          }
        />
        {banners.length === 0 ? (
          <EmptyState title="暂无召唤池" body="等待开启新篇章。" />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: "calc(100vh - 140px)", overflow: "hidden" }}>
            <div className="vn-btn-group" style={{ flexWrap: "wrap" }}>
              {banners.map((b) => (
                <button
                  key={b.id}
                  className={`vn-btn vn-btn-sm ${activeBanner === b.id ? "vn-btn-primary" : ""}`}
                  onClick={() => { setActiveBanner(b.id); setLastResult(null); }}
                >
                  {b.name}
                </button>
              ))}
            </div>
            {banner && (
              <div className="vn-gacha-area">
                <div className="vn-gacha-banner">
                  <div>
                    <div style={{ fontSize: 12, color: "var(--vn-text-dim)", letterSpacing: "0.3em", fontFamily: "var(--vn-font-mono)" }}>
                      {banner.id.toUpperCase()}
                    </div>
                    <h2 style={{ marginTop: 6 }}>{banner.name}</h2>
                    {banner.description && (
                      <p style={{ color: "var(--vn-text-dim)", marginTop: 8, lineHeight: 1.8 }}>
                        {banner.description}
                      </p>
                    )}
                  </div>
                  <div className="vn-gacha-counts">
                    <div>UP 角色：{(banner.up_characters ?? []).map((id) => charById.get(id)?.name ?? id).join("、") || "—"}</div>
                    <div>累计：{banner.pity_counter ?? 0} / {banner.pity_threshold ?? 90} 保底</div>
                    <div>历史召唤：{banner.total_pulls ?? 0}</div>
                  </div>
                  <div className="vn-btn-group">
                    <button className="vn-btn vn-btn-lg vn-btn-primary" onClick={() => handlePull(1)}>
                      单抽（1券）
                    </button>
                    <button className="vn-btn vn-btn-lg vn-btn-primary" onClick={() => handlePull(10)}>
                      十连（10券）
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, overflow: "hidden" }}>
                  {lastResult ? (
                    <div className="vn-panel" style={{ flex: 1, overflowY: "auto" }}>
                      <h4 style={{ marginTop: 0, color: "var(--vn-accent)" }}>
                        本次结果 · {lastResult.items.length} 位
                        {lastResult.new_characters?.length ? (
                          <span style={{ marginLeft: 12, color: "var(--vn-star)", fontSize: 14 }}>
                            新获得 ×{lastResult.new_characters.length}
                          </span>
                        ) : null}
                      </h4>
                      <div className="vn-result-grid">
                        {lastResult.items.map((it, i) => {
                          const c = it.kind === "figure" ? charById.get(it.character_id) : undefined;
                          const isNew = it.kind === "figure" && lastResult.new_characters?.includes(it.character_id);
                          const name = it.kind === "figure"
                            ? (c?.name ?? it.character_id ?? "?")
                            : (it.memory_id ?? "追忆");
                          return (
                            <div
                              key={i}
                              className={`vn-result-card rarity-${it.rarity}`}
                              title={name}
                            >
                              <div className="stars">{"★".repeat(it.rarity)}</div>
                              <div
                                className="glyph"
                                style={{ color: c?.accent ?? undefined }}
                              >
                                {it.kind === "figure"
                                  ? (c?.glyph ?? c?.name.charAt(0) ?? "?")
                                  : "忆"}
                              </div>
                              <div className="name">{name}</div>
                              {isNew && (
                                <div style={{
                                  position: "absolute", bottom: 6, right: 6,
                                  background: "var(--vn-star)", color: "#000",
                                  fontSize: 10, padding: "1px 6px", borderRadius: 4,
                                  fontWeight: 700,
                                }}>
                                  NEW
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="vn-panel" style={{ flex: 1, overflowY: "auto" }}>
                      <h4 style={{ marginTop: 0, color: "var(--vn-accent)" }}>图鉴进度</h4>
                      <div className="vn-result-grid">
                        {characters.map((c) => {
                          const have = owned.has(c.id);
                          return (
                            <div
                              key={c.id}
                              className={`vn-result-card rarity-${c.rarity ?? 1}`}
                              style={{ opacity: have ? 1 : 0.35 }}
                            >
                              <div className="stars">{"★".repeat(c.rarity ?? 1)}</div>
                              <div className="glyph" style={{ color: have ? (c.accent ?? undefined) : "var(--vn-text-dim)" }}>
                                {have ? (c.glyph ?? c.name.charAt(0)) : "?"}
                              </div>
                              <div className="name">{have ? c.name : "???"}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
