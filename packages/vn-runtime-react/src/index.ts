/**
 * vn-runtime-react public API:
 *  - GameProvider + useGame + VNRoute: app-wide context, systems, content, navigation
 *  - useNarrative: hook wrapping InkRunner for a single storyline
 *  - useSpriteAssetMap + useBackgroundUrl + useFallbackBg: asset resolvers
 *  - VNScreen: fullscreen VN playback (stage + textbox + choices + save/load/settings dialogs)
 *  - VNApp: complete out-of-the-box app router (menu -> series -> stories -> play + codex pages)
 */

export { GameProvider, useGame, LS_ADAPTER } from "./context/GameContext";
export type { VNRoute, GameProviderProps } from "./context/GameContext";
// PersistentAdapter 现在与 vn-game-systems 的简单 KV 接口一致，重新导出便于调用方使用
export type { PersistentAdapter } from "vn-game-systems";

export { useNarrative } from "./hooks/useNarrative";
export type { NarrativeHandle, NarrativeState } from "./hooks/useNarrative";

export {
  useSpriteAssetMap, useBackgroundUrl, useFallbackBg, characterToSpriteAsset,
} from "./hooks/useAssetResolvers";

export { VNScreen } from "./components/VNScreen";
export type { VNScreenProps } from "./components/VNScreen";

export { VNApp } from "./components/VNApp";
export type { VNAppProps } from "./components/VNApp";
