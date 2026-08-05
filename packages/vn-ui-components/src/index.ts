/**
 * vn-ui-components public API.
 * All reusable UI primitives, pages, theme system, and VN playback layers
 * exported here for downstream consumers (vn-runtime-react or bespoke apps).
 */

// Theme
export { ThemeProvider, useTheme } from "./theme/ThemeProvider";
export type { ThemeProviderProps } from "./theme/ThemeProvider";
export { INK_WASH_THEME, HANTANG_RED_GOLD_THEME, FESTIVAL_THEME, DEFAULT_THEMES } from "./theme/presets";
export type { VNThemeColorPreset, VNThemeVars } from "./theme/presets";

// Primitives
export {
  SectionTitle, Stars, Avatar, Toast, BackBar, EmptyState,
} from "./components/Primitives";
export { Dialog } from "./components/Dialog";
export { ToastStack, useToastStack, type ToastItem } from "./components/ToastStack";

// Pages (menu / codex screens)
export { MainMenu } from "./pages/MainMenu";
export type { MainMenuProps } from "./pages/MainMenu";
export { SeriesSelector } from "./pages/SeriesSelector";
export type { SeriesSelectorProps } from "./pages/SeriesSelector";
export { StorySelector } from "./pages/StorySelector";
export type { StorySelectorProps } from "./pages/StorySelector";
export { CharacterListPage } from "./pages/CharacterListPage";
export type { CharacterListPageProps } from "./pages/CharacterListPage";
export { CharacterDetailPage } from "./pages/CharacterDetailPage";
export type { CharacterDetailPageProps } from "./pages/CharacterDetailPage";
export { SaveLoadDialog } from "./pages/SaveLoadDialog";
export type { SaveLoadDialogProps, SaveLoadMode } from "./pages/SaveLoadDialog";
export { SettingsDialog } from "./pages/SettingsDialog";
export type { SettingsDialogProps } from "./pages/SettingsDialog";
export { AchievementsPage } from "./pages/AchievementsPage";
export type { AchievementsPageProps } from "./pages/AchievementsPage";
export { DeathCodexPage } from "./pages/DeathCodexPage";
export type { DeathCodexPageProps } from "./pages/DeathCodexPage";
export { ClassicsPage } from "./pages/ClassicsPage";
export type { ClassicsPageProps } from "./pages/ClassicsPage";
export { GachaPage } from "./pages/GachaPage";
export type { GachaPageProps } from "./pages/GachaPage";

// VN playback layer (scene + textbox + choices + overlays)
export { VNTextBox } from "./vn/VNTextBox";
export type { VNTextBoxProps } from "./vn/VNTextBox";
export { VNChoicePanel } from "./vn/VNChoicePanel";
export type { VNChoicePanelProps } from "./vn/VNChoicePanel";
export { VNStage } from "./vn/VNStage";
export type { VNStageProps, SpriteAsset } from "./vn/VNStage";
export { DeathOverlay, InterludeOverlay } from "./vn/VNOverlay";
export type { DeathOverlayProps, InterludeOverlayProps } from "./vn/VNOverlay";

// Shared types
export type { StorylineWithLock } from "./types";
