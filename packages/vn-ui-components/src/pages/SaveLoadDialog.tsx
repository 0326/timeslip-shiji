import React from "react";
import { Dialog } from "../components/Dialog";
import type { SaveSlotMeta } from "vn-game-systems";

export type SaveLoadMode = "save" | "load";

export interface SaveLoadDialogProps {
  open: boolean;
  mode: SaveLoadMode;
  slots: Array<SaveSlotMeta | null>;
  onClose: () => void;
  onSelectSlot: (slot: number) => void;
  onDeleteSlot?: (slot: number) => void;
  quickInfo?: { chapter?: string; path?: string };
}

export function SaveLoadDialog({
  open, mode, slots, onClose, onSelectSlot, onDeleteSlot, quickInfo,
}: SaveLoadDialogProps): React.ReactElement {
  return (
    <Dialog
      open={open}
      title={mode === "save" ? "存档" : "读档"}
      onClose={onClose}
    >
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {quickInfo?.chapter && (
          <span className="vn-tag">章节：{quickInfo.chapter}</span>
        )}
        {quickInfo?.path && (
          <span className="vn-tag">剧情点：{quickInfo.path}</span>
        )}
      </div>
      <div className="vn-slot-grid">
        {slots.map((s, idx) => {
          const num = idx + 1;
          return (
            <div
              key={num}
              className="vn-slot"
              onClick={() => onSelectSlot(idx)}
            >
              <div className="actions">
                {s && onDeleteSlot && (
                  <button
                    className="vn-btn vn-btn-sm vn-btn-danger"
                    onClick={(e) => { e.stopPropagation(); onDeleteSlot(idx); }}
                  >
                    删除
                  </button>
                )}
              </div>
              <div className="slot-num">SLOT {String(num).padStart(2, "0")}</div>
              {s ? (
                <>
                  <div className="title">{s.chapter_title ?? "—"}</div>
                  <div className="meta" style={{ fontSize: 12, color: "var(--vn-text-dim)" }}>
                    {s.series_id} · {s.storyline_id}
                  </div>
                  {s.play_seconds !== undefined && (
                    <div className="meta" style={{ fontSize: 12, color: "var(--vn-text-dim)" }}>
                      时长：{formatDuration(s.play_seconds)}
                    </div>
                  )}
                  <div className="date">{formatDate(s.saved_at)}</div>
                </>
              ) : (
                <div className="empty">空存档位</div>
              )}
            </div>
          );
        })}
      </div>
    </Dialog>
  );
}

function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h}h${m}m`;
  return `${m}m${sec % 60}s`;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
