import React, { useEffect, useMemo, useState } from "react";
import { useGame } from "../context/GameContext";
import {
  MainMenu, SeriesSelector, StorySelector,
  CharacterListPage,
  AchievementsPage, DeathCodexPage, ClassicsPage, GachaPage,
  ToastStack, ThemeProvider, SettingsDialog,
} from "vn-ui-components";
import type { SettingsState } from "vn-game-systems";
import { VNScreen } from "./VNScreen";

export interface VNAppProps {
  /**
   * Provide raw Ink source per storyline id.
   * Usually comes from vn-build-tools virtual modules:
   *   import ink_shun from "virtual:vn-ink-source/shun";
   *   getInkSource = (id) => id === "shun" ? ink_shun : "";
   */
  getInkSource: (storylineId: string) => string;
  /** Override theme preset id (e.g. from settings). */
  themePresetId?: string;
}

export function VNApp({ getInkSource, themePresetId }: VNAppProps): React.ReactElement {
  const { content, systems, route, navigate, formalMode, setFormalMode } = useGame();

  // Settings dialog open state — synced with systems.settings.open() / close()
  const [settingsOpen, setSettingsOpen] = useState(false);
  // When systems emit dialog events, mirror to React state
  useEffect(() => {
    const u1 = systems.bus.on("settings.dialog.opened", () => setSettingsOpen(true));
    const u2 = systems.bus.on("settings.dialog.closed", () => setSettingsOpen(false));
    // Initial state sync (in case systems.settings.open() was called before mount)
    setSettingsOpen(systems.settings.isDialogOpen());
    return () => { u1(); u2(); };
  }, [systems]);

  const startStory = (seriesId: string, storylineId: string, startKnot?: string) => {
    systems.saveGlobalProgress();
    systems.markLastPlayed({
      series_id: seriesId,
      storyline_id: storylineId,
      checkpoint_knot: startKnot,
      updated_at: Date.now(),
    });
    navigate({ name: "play", seriesId, storylineId, startKnot });
  };

  const backMenu = () => { systems.saveGlobalProgress(); navigate({ name: "menu" }); };
  const backSeries = () => navigate({ name: "series" });
  const goCharacters = () => navigate({ name: "characters" });
  const goAchievements = () => navigate({ name: "achievements" });
  const goDeathCodex = () => navigate({ name: "deathCodex" });
  const goClassics = () => navigate({ name: "classics" });
  const goGacha = () => navigate({ name: "gacha" });
  const toStories = (seriesId: string) => navigate({ name: "stories", seriesId });

  const progress = systems.globalProgress();
  const owned = new Set(systems.characterCodex.unlockedIds());
  const classicsUnlocked = new Set(systems.stats.classicsUnlocked());

  const pull = (bannerId: string, times: 1 | 10) => {
    const r = systems.gacha.pull(bannerId, times);
    systems.saveGlobalProgress();
    return r;
  };

  const handleSettingsChange = (patch: Partial<SettingsState>) => {
    systems.settings.patch(patch);
  };
  const handleSettingsClose = () => {
    systems.settings.close();
    systems.saveGlobalProgress();
  };
  const handleSettingsReset = () => {
    systems.settings.reset();
  };

  // Inject series accent color for themed sub-screens
  const seriesOverrideVars = useMemo(() => {
    let sid: string | null = null;
    if (route.name === "stories") sid = route.seriesId;
    else if (route.name === "play") sid = route.seriesId;
    if (!sid) return undefined;
    const accent = content.series.find((s) => s.id === sid)?.accent_color;
    if (!accent) return undefined;
    return { "--vn-accent": accent } as Record<string, string>;
  }, [route, content.series]);

  const presetId = themePresetId ?? systems.settings.values.theme ?? undefined;
  const settingsState = systems.settings.values;

  return (
    <ThemeProvider presetId={presetId} overrideVars={seriesOverrideVars}>
      {/* Menu */}
      {route.name === "menu" && (
        <MainMenu
          content={content}
          onStart={() => navigate({ name: "series" })}
          onContinue={() => {
            const last = progress.last_played;
            if (last) navigate({
              name: "play", seriesId: last.series_id,
              storylineId: last.storyline_id, startKnot: last.checkpoint_knot,
            });
            else navigate({ name: "series" });
          }}
          onSettings={() => systems.settings.open()}
          onCodex={goCharacters}
          onGacha={goGacha}
          onAchievements={goAchievements}
          onClassics={goClassics}
        />
      )}

      {route.name === "series" && (
        <SeriesSelector
          content={content}
          onBack={backMenu}
          onSelect={toStories}
          onCodex={goDeathCodex}
        />
      )}

      {route.name === "stories" && (
        <StorySelector
          content={content}
          systems={systems}
          seriesId={route.seriesId}
          onBack={backSeries}
          onSelect={(sid) => startStory(route.seriesId, sid)}
          onQuickStart={(_sid, mode) => { setFormalMode(mode === "official"); }}
        />
      )}

      {route.name === "play" && (
        <VNScreen
          storylineId={route.storylineId}
          seriesId={route.seriesId}
          inkSource={getInkSource(route.storylineId)}
          startKnot={route.startKnot}
          formalMode={formalMode}
          onExit={() => {
            systems.saveGlobalProgress();
            navigate({ name: "stories", seriesId: route.seriesId });
          }}
          onEnded={(finalPath) => {
            systems.stats.markStorylineCompleted(route.storylineId, finalPath);
            systems.saveGlobalProgress();
          }}
        />
      )}

      {route.name === "characters" && (
        <CharacterListPage
          content={content}
          systems={systems}
          onBack={backMenu}
        />
      )}

      {route.name === "achievements" && (
        <AchievementsPage
          achievements={content.achievements}
          progress={systems.achievements.progress()}
          onBack={backMenu}
        />
      )}

      {route.name === "deathCodex" && (
        <DeathCodexPage
          series={content.series}
          characters={content.characters}
          deaths={systems.deathCodex.allEntries()}
          unlockedIds={new Set(systems.deathCodex.unlockedIds())}
          onBack={backMenu}
        />
      )}

      {route.name === "classics" && (
        <ClassicsPage
          series={content.series}
          classics={content.classics}
          unlocked={classicsUnlocked}
          onBack={backMenu}
        />
      )}

      {route.name === "gacha" && (
        <GachaPage
          banners={systems.gacha.banners}
          characters={content.characters}
          owned={owned}
          tickets={systems.gacha.state.tickets}
          currency={systems.gacha.state.currency}
          onBack={backMenu}
          onPull={pull}
        />
      )}

      <SettingsDialog
        open={settingsOpen}
        settings={settingsState}
        onChange={handleSettingsChange}
        onClose={handleSettingsClose}
        onReset={handleSettingsReset}
      />

      <ToastStack systems={systems} />
    </ThemeProvider>
  );
}
