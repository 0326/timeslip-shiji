import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SegmentKind } from "ink-vn-core";

export interface VNTextBoxProps {
  speaker?: string;
  accent?: string;
  text: string;
  kind?: SegmentKind;
  styleVariant?: "paper" | "glass" | "solid";
  textSpeedMs?: number;
  skipRead?: boolean;
  isRead?: boolean;
  typingDone: boolean;
  onTypingDone: () => void;
  onClick: () => void;
}

export function VNTextBox({
  speaker, accent, text, kind = "dialogue", styleVariant = "paper",
  textSpeedMs = 40, skipRead, isRead, typingDone, onTypingDone, onClick,
}: VNTextBoxProps): React.ReactElement {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  const timer = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const actualSpeed = useMemo(() => {
    if (skipRead && isRead) return 0;
    return textSpeedMs;
  }, [skipRead, isRead, textSpeedMs]);

  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    finishedRef.current = false;

    if (actualSpeed <= 0 || !text) {
      setDisplayed(text);
      finishedRef.current = true;
      requestAnimationFrame(() => onTypingDone());
      return;
    }

    const step = () => {
      idx.current += 1;
      const piece = text.slice(0, idx.current);
      setDisplayed(piece);
      if (idx.current >= text.length) {
        finishedRef.current = true;
        timer.current = null;
        onTypingDone();
        return;
      }
      timer.current = window.setTimeout(step, actualSpeed);
    };
    timer.current = window.setTimeout(step, actualSpeed);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [text, actualSpeed, onTypingDone]);

  const handleClick = () => {
    if (!finishedRef.current) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      finishedRef.current = true;
      setDisplayed(text);
      onTypingDone();
      return;
    }
    onClick();
  };

  const className = `vn-textbox ${styleVariant}`;

  return (
    <div className={className} onClick={handleClick}>
      {kind !== "narration" && speaker && (
        <div className="speaker" style={accent ? { color: accent, borderColor: accent } : undefined}>
          {speaker}
        </div>
      )}
      <div className={`text-body ${kind}`}>
        {displayed}
        {typingDone && kind !== "thought" && (
          <span className="continue-mark">▾</span>
        )}
      </div>
    </div>
  );
}
