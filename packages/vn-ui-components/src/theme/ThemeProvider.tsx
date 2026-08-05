import React, { createContext, useContext, useEffect, useMemo } from "react";
import { DEFAULT_THEMES, INK_WASH_THEME, type VNThemeColorPreset } from "./presets";

interface ThemeContextValue {
  preset: VNThemeColorPreset;
  presets: VNThemeColorPreset[];
  setPresetId: (id: string) => void;
  /** Deep-merged overrides (e.g. series accent + preset). */
  overrideVars: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Initial preset id. Falls back to inkWash. */
  presetId?: string;
  /** Additional CSS variables injected on top of the preset (series accent etc.). */
  overrideVars?: Record<string, string>;
  /** Theme root element. Defaults to document.documentElement in browser. */
  target?: HTMLElement | null;
}

export function ThemeProvider({
  children,
  presetId,
  overrideVars = {},
  target,
}: ThemeProviderProps): React.ReactElement {
  const [currentId, setCurrentId] = React.useState<string>(presetId ?? INK_WASH_THEME.id);
  const presets = DEFAULT_THEMES;
  const preset = useMemo(
    () => presets.find(p => p.id === currentId) ?? INK_WASH_THEME,
    [presets, currentId]
  );

  useEffect(() => {
    const el = target ?? (typeof document !== "undefined" ? document.documentElement : null);
    if (!el) return;
    const all = { ...preset.vars, ...overrideVars };
    for (const [k, v] of Object.entries(all)) {
      el.style.setProperty(k, v);
    }
    return () => {
      // Cleanup only vars added by preset (leave any pre-existing intact)
      for (const k of Object.keys(all)) {
        if (Object.prototype.hasOwnProperty.call(preset.vars, k)) el.style.removeProperty(k);
      }
    };
  }, [preset, overrideVars, target]);

  const value: ThemeContextValue = {
    preset,
    presets,
    setPresetId: setCurrentId,
    overrideVars,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme() must be used inside <ThemeProvider>.");
  return ctx;
}
