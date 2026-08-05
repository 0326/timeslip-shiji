import React from "react";

/**
 * Generic modal dialog with backdrop, header, and footer.
 * Used for save/load, settings, etc.
 */
export function Dialog({
  open, title, onClose, children, footer, width,
}: {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}): React.ReactElement | null {
  if (!open) return null;
  return (
    <div className="vn-dialog-bg" onClick={onClose}>
      <div
        className="vn-dialog"
        style={width ? { width } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          {title && <h2>{title}</h2>}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {footer}
            {onClose && (
              <button className="vn-btn vn-btn-ghost vn-btn-sm" onClick={onClose}>
                关闭
              </button>
            )}
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
