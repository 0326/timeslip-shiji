import React from "react";
import { Dialog } from "../components/Dialog";
import { useTheme } from "../theme/ThemeProvider";
import type { SettingsState } from "vn-game-systems";

export interface SettingsDialogProps {
  open: boolean;
  settings: SettingsState;
  onChange: (patch: Partial<SettingsState>) => void;
  onClose: () => void;
  onReset?: () => void;
}

const TEXTBOX_STYLES = ["paper", "glass", "solid"] as const;

export function SettingsDialog({
  open, settings, onChange, onClose, onReset,
}: SettingsDialogProps): React.ReactElement {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      title="设置"
      onClose={onClose}
      footer={onReset ? (
        <button className="vn-btn vn-btn-sm vn-btn-ghost" onClick={onReset}>
          恢复默认
        </button>
      ) : undefined}
    >
      <div className="vn-settings-grid">
        <div className="vn-form-row">
          <label>主题风格</label>
          <div className="vn-btn-group" style={{ flexWrap: "wrap" }}>
            {theme.presets.map((p) => (
              <button
                key={p.id}
                className={`vn-btn vn-btn-sm ${theme.preset.id === p.id ? "vn-btn-primary" : ""}`}
                onClick={() => theme.setPresetId(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="vn-form-row">
          <label>文本框样式</label>
          <div className="vn-btn-group">
            {TEXTBOX_STYLES.map((s) => (
              <button
                key={s}
                className={`vn-btn vn-btn-sm ${settings.textbox_style === s ? "vn-btn-primary" : ""}`}
                onClick={() => onChange({ textbox_style: s })}
              >
                {s === "paper" ? "古卷" : s === "glass" ? "琉璃" : "凝练"}
              </button>
            ))}
          </div>
        </div>

        <div className="vn-form-row">
          <label>文字速度（毫秒/字）：{settings.text_speed_ms}</label>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={settings.text_speed_ms}
            onChange={(e) => onChange({ text_speed_ms: Number(e.target.value) })}
          />
        </div>

        <div className="vn-form-row">
          <label>自动播放速度（秒/句）：{settings.auto_play_delay_sec.toFixed(1)}</label>
          <input
            type="range"
            min={0.5}
            max={6}
            step={0.1}
            value={settings.auto_play_delay_sec}
            onChange={(e) => onChange({ auto_play_delay_sec: Number(e.target.value) })}
          />
        </div>

        <div className="vn-form-row">
          <label>主音量：{Math.round(settings.master_volume * 100)}%</label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={settings.master_volume}
            onChange={(e) => onChange({ master_volume: Number(e.target.value) })}
          />
        </div>
        <div className="vn-form-row">
          <label>BGM 音量：{Math.round(settings.bgm_volume * 100)}%</label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={settings.bgm_volume}
            onChange={(e) => onChange({ bgm_volume: Number(e.target.value) })}
          />
        </div>
        <div className="vn-form-row">
          <label>音效音量：{Math.round(settings.se_volume * 100)}%</label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={settings.se_volume}
            onChange={(e) => onChange({ se_volume: Number(e.target.value) })}
          />
        </div>
        <div className="vn-form-row">
          <label>语音音量：{Math.round(settings.voice_volume * 100)}%</label>
          <input
            type="range" min={0} max={1} step={0.01}
            value={settings.voice_volume}
            onChange={(e) => onChange({ voice_volume: Number(e.target.value) })}
          />
        </div>

        <div className="vn-form-row">
          <label>语言</label>
          <select
            value={settings.language}
            onChange={(e) => onChange({ language: e.target.value })}
          >
            <option value="zh-CN">简体中文</option>
            <option value="zh-TW">繁體中文</option>
            <option value="en-US">English</option>
          </select>
        </div>

        <div className="vn-form-row" style={{ justifyContent: "center", flexDirection: "row", gap: 14, flexWrap: "wrap" }}>
          <ToggleChip
            label="跳过已读"
            value={settings.skip_read}
            onChange={(v) => onChange({ skip_read: v })}
          />
          <ToggleChip
            label="死亡不入库（严格）"
            value={settings.strict_death}
            onChange={(v) => onChange({ strict_death: v })}
          />
          <ToggleChip
            label="显示角色立绘"
            value={settings.show_sprites}
            onChange={(v) => onChange({ show_sprites: v })}
          />
        </div>
      </div>
    </Dialog>
  );
}

function ToggleChip({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className={`vn-btn vn-btn-sm ${value ? "vn-btn-primary" : ""}`}
      onClick={() => onChange(!value)}
    >
      {value ? "✓ " : ""}{label}
    </button>
  );
}
