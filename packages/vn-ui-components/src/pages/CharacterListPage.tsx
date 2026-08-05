import React, { useMemo, useState } from "react";
import type { GameContent } from "vn-content-schemas";
import type { GameSystems } from "vn-game-systems";
import { Avatar, BackBar, SectionTitle, Stars } from "../components/Primitives";
import { CharacterDetailPage, type CharacterDetailPageProps } from "./CharacterDetailPage";

export interface CharacterListPageProps {
  content: GameContent;
  systems: GameSystems;
  onBack: () => void;
  onClose?: CharacterDetailPageProps["onClose"];
}

export function CharacterListPage({ content, systems, onBack, onClose }: CharacterListPageProps): React.ReactElement {
  const [eraFilter, setEraFilter] = useState<string | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const list = systems.characterCodex.listWithStatus();
  const eras = useMemo(() => {
    const set = new Set<string>();
    for (const c of content.characters) set.add(c.era);
    return ["all" as const, ...Array.from(set)];
  }, [content]);
  const visible = list.filter(c => eraFilter === "all" || c.era === eraFilter);
  const total = list.length;
  const unlocked = list.filter(c => c.unlocked).length;
  const selected = selectedId ? content.characters.find(c => c.id === selectedId) : undefined;

  if (selected) {
    return (
      <CharacterDetailPage
        character={selected}
        unlocked={Boolean(systems.characterCodex.isUnlocked(selected.id))}
        systems={systems}
        content={content}
        onClose={() => setSelectedId(null)}
        backToLabel="返回图鉴"
      />
    );
  }

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner">
        <BackBar title={`人物图鉴 · ${unlocked}/${total}`} onBack={onBack} />
        <SectionTitle eyebrow="Character Codex" title="人物图鉴" subtitle="按朝代顺序排列" />
        <div className="vn-btn-group" style={{ flexWrap: "wrap" }}>
          {eras.map(e => (
            <button
              key={e}
              className={`vn-btn vn-btn-sm ${e === eraFilter ? "vn-btn-primary" : ""}`}
              onClick={() => setEraFilter(e)}
            >
              {e === "all" ? "全部时代" : e}
            </button>
          ))}
        </div>
        <div className="vn-vert-scroll" style={{ maxHeight: "calc(100vh - 280px)", paddingRight: 6 }}>
          <div className="vn-grid">
            {visible.map(c => (
              <div
                key={c.id}
                className={`vn-char-card ${c.unlocked ? "" : "locked"}`}
                onClick={() => c.unlocked && setSelectedId(c.id)}
                style={{
                  borderColor: c.accent ? `${c.accent}55` : "var(--vn-border)",
                }}
              >
                <div className="glyph" style={{ color: c.accent ?? "var(--vn-accent)" }}>
                  {c.glyph ?? c.name.charAt(0)}
                </div>
                <div className="title" style={{ color: c.accent }}>{c.title || "　"}</div>
                <h5 style={{ color: c.accent ?? "var(--vn-accent)" }}>
                  {c.unlocked ? c.name : "？？？"}
                </h5>
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  <span className="era">{c.era}</span>
                  {c.unlocked && (
                    <Stars count={rarityOf(c, content.characters.length)} />
                  )}
                </div>
                <div style={{ fontSize: 13, color: "var(--vn-text-dim)", lineHeight: 1.6 }}>
                  {c.unlocked ? c.classical_quote || c.description : "—— 此人物尚未在你的旅途中出现 ——"}
                </div>
                <div style={{ marginTop: 10, display: "flex", gap: 4 }}>
                  <Avatar name={c.name} glyph={c.glyph} accent={c.accent} size={32} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function rarityOf(c: { dynasty_order: number; order: number }, total: number): 1 | 2 | 3 | 4 | 5 {
  const order = c.dynasty_order || c.order || Math.floor(total / 2);
  if (total <= 1) return 3;
  const pct = (order - 1) / Math.max(1, total - 1);
  if (pct <= 0.05) return 5;
  if (pct <= 0.2) return 4;
  if (pct <= 0.5) return 3;
  if (pct <= 0.8) return 2;
  return 1;
}

// Satisfy unused param lint for optional prop callback (used by caller — CharacterDetailPage's back)
void onClose;
