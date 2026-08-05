import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { GameContent } from "vn-content-schemas";
import type { GameSystems, PersistentAdapter, AudioEnv } from "vn-game-systems";
import { createGameSystems } from "vn-game-systems";

export type VNRoute =
  | { name: "menu" }
  | { name: "series" }
  | { name: "stories"; seriesId: string }
  | { name: "play"; seriesId: string; storylineId: string; startKnot?: string }
  | { name: "characters" }
  | { name: "character"; characterId: string }
  | { name: "achievements" }
  | { name: "deathCodex" }
  | { name: "classics" }
  | { name: "gacha" };

/** localStorage KV adapter — default if none supplied. Works in browser only.
 *  符合 vn-game-systems 的 getItem/setItem/removeItem 简单 KV 接口。 */
export const LS_ADAPTER: PersistentAdapter = (() => {
  const memory = new Map<string, string>();
  return {
    getItem(key: string): string | null {
      try {
        if (typeof localStorage !== "undefined") return localStorage.getItem(key);
      } catch { /* ignore */ }
      return memory.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      try {
        if (typeof localStorage !== "undefined") { localStorage.setItem(key, value); return; }
      } catch { /* ignore */ }
      memory.set(key, value);
    },
    removeItem(key: string): void {
      try {
        if (typeof localStorage !== "undefined") { localStorage.removeItem(key); return; }
      } catch { /* ignore */ }
      memory.delete(key);
    },
  };
})();

interface GameContextValue {
  content: GameContent;
  systems: GameSystems;
  /** 底层 KV adapter (与 vn-game-systems 保持一致的简单接口)。 */
  adapter: PersistentAdapter;
  route: VNRoute;
  navigate: (r: VNRoute) => void;
  /** Asset base URL prepended to relative paths (characters, backgrounds, bgm). */
  assetBase: string;
  /** True when running in 正史 mode (disables hints, enables death strictness etc.). */
  formalMode: boolean;
  setFormalMode: (v: boolean) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export interface GameProviderProps {
  children: React.ReactNode;
  content: GameContent;
  /** Persistent adapter for saves/global progress. Defaults to localStorage-backed KV. */
  adapter?: PersistentAdapter;
  /** Initial route, defaults to menu. */
  initialRoute?: VNRoute;
  /** Asset base URL (with trailing slash). Defaults to "/assets/". */
  assetBase?: string;
  /** Optional override audio/BGM environment passed to GameSystems. */
  audioEnv?: AudioEnv;
}

export function GameProvider({
  children, content, adapter, initialRoute = { name: "menu" },
  assetBase = "/assets/", audioEnv,
}: GameProviderProps): React.ReactElement {
  const persister = adapter ?? LS_ADAPTER;
  const systems = useMemo(
    () => createGameSystems(content, {
      adapter: persister,
      audioEnv: audioEnv,
    }),
    [content, persister, audioEnv]
  );

  // Hydrate global progress on mount
  useEffect(() => { systems.loadGlobalProgress(); }, [systems]);

  const [route, setRoute] = useState<VNRoute>(initialRoute);
  const [formalMode, setFormalMode] = useState(false);

  const navigate = useCallback((r: VNRoute) => {
    setRoute(r);
    if (typeof window !== "undefined") {
      window.scrollTo?.(0, 0);
    }
  }, []);

  const value: GameContextValue = {
    content, systems, adapter: persister, route, navigate, assetBase, formalMode, setFormalMode,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame() must be used inside <GameProvider>.");
  return ctx;
}
