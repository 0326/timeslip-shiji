/**
 * Theme preset system. UI components read CSS variables (not hardcoded values).
 * Consumers can provide custom presets to ThemeProvider or overwrite individual vars.
 */

export interface VNThemeColorPreset {
  id: string;
  name: string;
  vars: Record<string, string>;
}

export const INK_WASH_THEME: VNThemeColorPreset = {
  id: "inkWash",
  name: "水墨",
  vars: {
    "--vn-bg": "#0c0a08",
    "--vn-bg-2": "#14100b",
    "--vn-surface": "rgba(20, 16, 11, 0.88)",
    "--vn-surface-2": "rgba(15, 20, 16, 0.92)",
    "--vn-border": "rgba(201, 168, 76, 0.35)",
    "--vn-border-strong": "rgba(201, 168, 76, 0.7)",
    "--vn-text": "#e9e3d3",
    "--vn-text-dim": "#a79c85",
    "--vn-accent": "#c9a84c",
    "--vn-accent-2": "#3a8c6e",
    "--vn-danger": "#b84c4c",
    "--vn-success": "#6ebd76",
    "--vn-star": "#e6c74b",
    "--vn-shadow": "0 18px 60px rgba(0,0,0,0.55)",
    "--vn-render-surface": "rgba(10, 10, 10, 0.68)",
    "--vn-panel-radius": "14px",
    "--vn-font-serif": "\"STKaiti\",\"KaiTi\",\"楷体\",\"Noto Serif SC\",serif",
    "--vn-font-sans": "\"PingFang SC\",\"Noto Sans SC\",sans-serif",
    "--vn-font-mono": "\"SF Mono\",\"JetBrains Mono\",monospace",
    "--vn-h1-size": "34px",
    "--vn-h2-size": "22px",
    "--vn-body-size": "16px",
    "--vn-textbox-text-size": "20px",
    "--vn-textbox-line-height": "1.95",
    "--vn-btn-padding": "10px 20px",
    "--vn-menu-max-w": "1200px",
    "--vn-render-aspect": "16/9",
  },
};

export const HAN_TANG_THEME: VNThemeColorPreset = {
  id: "hanTang",
  name: "汉唐红金",
  vars: {
    ...INK_WASH_THEME.vars,
    "--vn-bg": "#120807",
    "--vn-bg-2": "#1a0e0b",
    "--vn-accent": "#d89b52",
    "--vn-accent-2": "#a33a30",
    "--vn-border": "rgba(216, 155, 82, 0.35)",
    "--vn-border-strong": "rgba(216, 155, 82, 0.8)",
  },
};

export const FESTIVAL_THEME: VNThemeColorPreset = {
  id: "festival",
  name: "花灯节庆",
  vars: {
    ...INK_WASH_THEME.vars,
    "--vn-bg": "#100a0a",
    "--vn-bg-2": "#200e10",
    "--vn-accent": "#e4a248",
    "--vn-accent-2": "#d94b4b",
  },
};

export const DEFAULT_THEMES: VNThemeColorPreset[] = [
  INK_WASH_THEME,
  HAN_TANG_THEME,
  FESTIVAL_THEME,
];
