import React from "react";

/**
 * Simple reusable UI primitives shared across pages.
 * Kept tiny on purpose; replace in your app if you need more features.
 */

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: { eyebrow?: string; title: string; subtitle?: string }): React.ReactElement {
  return (
    <div>
      {eyebrow && (
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.3em",
            fontFamily: "var(--vn-font-mono)",
            color: "var(--vn-text-dim)",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="vn-title" style={{ fontSize: 30 }}>{title}</h2>
      {subtitle && <p className="vn-subtitle">{subtitle}</p>}
    </div>
  );
}

export function Stars({ count }: { count: number }): React.ReactElement {
  const n = Math.max(1, Math.min(5, count));
  return <span className="diff-stars">{"★".repeat(n)}</span>;
}

export function Avatar({
  name, glyph, accent, size = 36,
}: { name: string; glyph?: string; accent?: string; size?: number }): React.ReactElement {
  return (
    <div
      className="avatar-sm"
      style={{
        width: size, height: size, color: accent ?? "var(--vn-accent)",
        fontSize: Math.floor(size / 2.1),
      }}
      title={name}
    >
      {glyph ?? name.charAt(0)}
    </div>
  );
}

export function Toast({
  title,
  body,
  icon,
}: { title: string; body?: string; icon?: string }): React.ReactElement {
  return (
    <div className="vn-toast">
      {icon && <div style={{ fontSize: 22 }}>{icon}</div>}
      <div>
        <div className="t-title">{title}</div>
        {body && <div className="t-body">{body}</div>}
      </div>
    </div>
  );
}

export function BackBar({
  title, onBack, right,
}: { title?: string; onBack: () => void; right?: React.ReactNode }): React.ReactElement {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="vn-btn vn-btn-ghost vn-btn-sm" onClick={onBack}>← 返回</button>
        {title && <h3 style={{ margin: 0, color: "var(--vn-accent)" }}>{title}</h3>}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{right}</div>
    </div>
  );
}

export function EmptyState({
  title, body, action,
}: { title: string; body?: string; action?: React.ReactNode }): React.ReactElement {
  return (
    <div className="vn-panel" style={{ textAlign: "center", padding: "40px 28px" }}>
      <h3 style={{ color: "var(--vn-accent)", marginTop: 0 }}>{title}</h3>
      {body && <p style={{ color: "var(--vn-text-dim)" }}>{body}</p>}
      {action}
    </div>
  );
}
