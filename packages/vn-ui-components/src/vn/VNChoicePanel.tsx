import React from "react";
import type { Choice } from "ink-vn-core";

export interface VNChoicePanelProps {
  choices: Choice[];
  onChoose: (idx: number) => void;
  /** True in 正史模式 => 隐藏"提示"按钮及禁用 hint。 */
  formalMode?: boolean;
  onRequestHint?: () => void;
  hintCost?: number;
}

export function VNChoicePanel({
  choices, onChoose, formalMode, onRequestHint, hintCost,
}: VNChoicePanelProps): React.ReactElement {
  return (
    <div className="vn-choices">
      {choices.map((c, i) => (
        <button
          key={i}
          className="vn-choice"
          onClick={() => onChoose(i)}
          disabled={c.disabled}
          style={c.disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
        >
          <span style={{
            display: "inline-block", width: 28, color: "var(--vn-accent)",
            fontFamily: "var(--vn-font-mono)", fontSize: 14,
          }}>
            [{i + 1}]
          </span>
          {c.text}
          {c.tags && c.tags.length > 0 && (
            <span style={{ marginLeft: 12, fontSize: 13, color: "var(--vn-text-dim)" }}>
              {c.tags.map((t) => `#${t}`).join(" ")}
            </span>
          )}
        </button>
      ))}
      {!formalMode && onRequestHint && (
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <button className="vn-btn vn-btn-sm vn-btn-ghost" onClick={onRequestHint}>
            💡 提示{hintCost ? ` · ${hintCost}` : ""}
          </button>
        </div>
      )}
    </div>
  );
}
