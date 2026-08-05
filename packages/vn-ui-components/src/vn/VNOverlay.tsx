import React from "react";

export interface DeathOverlayProps {
  title: string;
  death_id?: string;
  summary?: string;
  count?: number;
  onRetry: () => void;
  onReturnMenu: () => void;
  onLoad?: () => void;
}

export function DeathOverlay({
  title, death_id, summary, count = 1, onRetry, onReturnMenu, onLoad,
}: DeathOverlayProps): React.ReactElement {
  return (
    <div className="vn-death-overlay">
      <div className="vn-death-card">
        <div className="big">薨</div>
        <h2 style={{ color: "var(--vn-danger)", margin: "4px 0 8px" }}>{title}</h2>
        {death_id && (
          <div className="count" style={{ marginBottom: 6 }}>ID：{death_id}</div>
        )}
        {summary && (
          <p style={{ color: "var(--vn-text-dim)", fontSize: 14, lineHeight: 1.8, minHeight: 30 }}>
            {summary}
          </p>
        )}
        <div className="count" style={{ marginTop: 8 }}>
          已走过 {count} 次
        </div>
        <div className="vn-btn-group" style={{ justifyContent: "center", marginTop: 20 }}>
          <button className="vn-btn vn-btn-primary vn-btn-lg" onClick={onRetry}>
            ↻ 从检查点重来
          </button>
          {onLoad && (
            <button className="vn-btn vn-btn-lg" onClick={onLoad}>
              📂 读取存档
            </button>
          )}
          <button className="vn-btn vn-btn-lg vn-btn-ghost" onClick={onReturnMenu}>
            ← 返回篇章选择
          </button>
        </div>
      </div>
    </div>
  );
}

export interface InterludeOverlayProps {
  title?: string;
  subtitle?: string;
  /** e.g. act name / 幕名. */
  chapter?: string;
  background?: string;
  durationMs?: number;
  onSkip: () => void;
}

export function InterludeOverlay({
  title, subtitle, chapter, background, durationMs = 2400, onSkip,
}: InterludeOverlayProps): React.ReactElement {
  const [show, setShow] = React.useState(true);
  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setShow(false);
      onSkip();
    }, durationMs);
    return () => window.clearTimeout(t);
  }, [durationMs, onSkip]);
  if (!show) return <></>;
  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 20,
        background: background ?? "rgba(0,0,0,0.82)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(3px)",
        cursor: "pointer",
      }}
      onClick={() => { setShow(false); onSkip(); }}
    >
      <div style={{ textAlign: "center", color: "var(--vn-text)", padding: 32 }}>
        {chapter && (
          <div style={{
            fontFamily: "var(--vn-font-mono)", letterSpacing: "0.4em",
            color: "var(--vn-accent)", fontSize: 14, marginBottom: 18,
          }}>
            {chapter}
          </div>
        )}
        {title && (
          <div style={{
            fontFamily: "var(--vn-font-serif)", fontWeight: 900,
            fontSize: "clamp(40px, 7vw, 84px)",
            color: "var(--vn-accent)", letterSpacing: "0.1em",
          }}>
            {title}
          </div>
        )}
        {subtitle && (
          <div style={{
            marginTop: 14, color: "var(--vn-text-dim)",
            fontSize: 16, lineHeight: 1.8,
          }}>
            {subtitle}
          </div>
        )}
        <div style={{
          marginTop: 32, fontSize: 12, color: "var(--vn-text-dim)",
          letterSpacing: "0.3em", fontFamily: "var(--vn-font-mono)",
          animation: "vn-blink 1.2s infinite",
        }}>
          点击任意处跳过
        </div>
      </div>
    </div>
  );
}
