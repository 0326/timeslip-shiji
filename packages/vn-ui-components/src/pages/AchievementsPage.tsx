import React, { useMemo } from "react";
import { BackBar, EmptyState } from "../components/Primitives";
import type { Achievement, AchievementProgress } from "vn-content-schemas";

export interface AchievementsPageProps {
  achievements: Achievement[];
  progress: AchievementProgress;
  onBack: () => void;
}

export function AchievementsPage({
  achievements, progress, onBack,
}: AchievementsPageProps): React.ReactElement {
  const stats = useMemo(() => {
    const unlocked = achievements.filter((a) => progress.unlocked_ids.includes(a.id)).length;
    const total = achievements.length;
    const pct = total ? Math.round((unlocked / total) * 100) : 0;
    return { unlocked, total, pct };
  }, [achievements, progress]);

  const sorted = [...achievements].sort((a, b) => {
    const ua = progress.unlocked_ids.includes(a.id);
    const ub = progress.unlocked_ids.includes(b.id);
    if (ua !== ub) return ua ? -1 : 1;
    return (b.rarity ?? 0) - (a.rarity ?? 0);
  });

  return (
    <div className="vn-screen">
      <div className="vn-screen-inner">
        <BackBar title={`成就图鉴 · ${stats.unlocked}/${stats.total} (${stats.pct}%)`} onBack={onBack} />
        {sorted.length === 0 ? (
          <EmptyState title="暂无成就" body="完成特定剧情条件即可解锁成就。" />
        ) : (
          <div className="vn-vert-scroll" style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "calc(100vh - 160px)" }}>
            {sorted.map((a) => {
              const unlocked = progress.unlocked_ids.includes(a.id);
              const unlockedAt = progress.unlocked_at[a.id];
              return (
                <div key={a.id} className={`vn-ach-row ${unlocked ? "" : "locked"}`}>
                  <div className="icon">{a.icon ?? "勋"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h4 style={{ margin: 0, color: unlocked ? "var(--vn-accent)" : "var(--vn-text-dim)" }}>
                        {unlocked ? a.name : "??? 未解锁"}
                      </h4>
                      <div className="stars">
                        {"★".repeat(Math.max(1, Math.min(5, a.rarity ?? 1)))}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--vn-text-dim)", marginTop: 2 }}>
                      {unlocked ? a.description : a.hint ?? "探索剧情以发现此成就。"}
                    </div>
                    {unlocked && unlockedAt && (
                      <div style={{ fontSize: 12, color: "var(--vn-text-dim)", marginTop: 4 }}>
                        解锁于 {new Date(unlockedAt).toLocaleString()}
                      </div>
                    )}
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
