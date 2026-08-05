import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNarrative } from "../hooks/useNarrative";
import { useSpriteAssetMap, useBackgroundUrl, useFallbackBg } from "../hooks/useAssetResolvers";
import { useGame } from "../context/GameContext";
import type { VNRoute } from "../context/GameContext";
import {
  VNStage, VNTextBox, VNChoicePanel,
  DeathOverlay, InterludeOverlay,
  SaveLoadDialog, SettingsDialog,
  useToastStack, ToastStack,
} from "vn-ui-components";

export interface VNScreenProps {
  storylineId: string;
  seriesId: string;
  /** Raw Ink source (from virtual module or fetch). */
  inkSource: string;
  startKnot?: string;
  onExit: () => void;
  /** Optional: called when story reaches an end. */
  onEnded?: (finalPath: string) => void;
  /** Optional: custom minigame renderer. Returned value is passed to resumeMinigame(). */
  renderMinigame?: (
    interrupt: { id: string; params?: string },
    done: (result: number | boolean | string, score?: number) => void,
  ) => React.ReactNode;
}

export function VNScreen({
  storylineId, seriesId, inkSource, startKnot, onExit, onEnded, renderMinigame,
}: VNScreenProps): React.ReactElement {
  const { systems, formalMode, adapter } = useGame();
  const {
    state, advance, choose, resumeMinigame, restartFromCheckpoint, isRead,
    consumeEffect, consumeInterlude, gotoKnot,
  } = useNarrative(storylineId, inkSource, startKnot);

  const spriteAssets = useSpriteAssetMap();
  const bgImg = useBackgroundUrl(state.background);
  const fallbackBg = useFallbackBg(seriesId);

  const [typingDone, setTypingDone] = useState(false);
  const [saveOpen, setSaveOpen] = useState<null | "save" | "load">(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const { toasts, pushToast } = useToastStack();

  const settings = systems.settings.values;

  // Reset typing state whenever segment text changes
  useEffect(() => { setTypingDone(false); }, [state.text, state.currentPath]);

  // Auto-play next segment when typing done + no choices/minigame + autoPlay on
  useEffect(() => {
    if (!autoPlay || !typingDone) return;
    if (state.choices.length > 0 || state.minigame || state.ended) return;
    const delayMs = Math.max(400, settings.auto_play_delay_sec * 1000);
    const t = window.setTimeout(() => advance(), delayMs);
    return () => window.clearTimeout(t);
  }, [autoPlay, typingDone, state.choices.length, state.minigame, state.ended, settings.auto_play_delay_sec, advance]);

  // Skip read: jump immediately to next if segment is read & skip_read on
  useEffect(() => {
    if (!settings.skip_read || readOnly) return;
    if (isRead() && !typingDone) {
      // skip typing animation for read segments - let VNTextBox handle it via textSpeed=0
    }
  }, [settings.skip_read, isRead, typingDone, readOnly]);

  // If ended, call hook
  useEffect(() => {
    if (state.ended) onEnded?.(state.currentPath);
  }, [state.ended, state.currentPath, onEnded]);

  // Key binds (ESC = menu, 1-9 = choice keys, S=save, L=load)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (settingsOpen || saveOpen) return;
      if (e.key === "Escape") { setSettingsOpen(true); return; }
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); setSaveOpen("save"); return; }
      if (e.ctrlKey && (e.key === "l" || e.key === "L")) { e.preventDefault(); setSaveOpen("load"); return; }
      if (e.key >= "1" && e.key <= "9" && state.choices.length > 0) {
        const idx = Number(e.key) - 1;
        if (idx < state.choices.length) { e.preventDefault(); choose(idx); }
      }
      if (e.key === " " || e.key === "Enter") {
        if (state.choices.length === 0 && !state.minigame && !state.ended) {
          e.preventDefault();
          if (!typingDone) setTypingDone(true);
          else advance();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [settingsOpen, saveOpen, state.choices.length, state.minigame, state.ended, typingDone, choose, advance]);

  // Death detection: use minigame.id == "death" OR variables.death_id
  const deathInfo = useMemo(() => {
    const v = state.variables as Record<string, unknown>;
    if (v.death_id || state.minigame?.id === "death") {
      return {
        death_id: String(v.death_id ?? ""),
        title: String(v.death_title ?? state.text.slice(0, 24) || "薨"),
        summary: String(v.death_summary ?? ""),
        count: Number(v.death_count ?? 1),
        checkpoint_path: String(v.checkpoint_path ?? ""),
      };
    }
    return null;
  }, [state.variables, state.minigame, state.text]);

  const applyDeath = useCallback(() => {
    if (!deathInfo || !deathInfo.death_id) return;
    const done = systems.deathCodex.recordDeath({
      death_id: deathInfo.death_id,
      series_id: seriesId,
      character_id: (state.speakerId ?? "") as string,
      title: deathInfo.title,
      summary: deathInfo.summary,
      reason: deathInfo.summary,
    });
    if (done) {
      pushToast({ title: "死亡图鉴新增记录", body: deathInfo.title, icon: "薨" });
    }
  }, [deathInfo, systems.deathCodex, seriesId, state.speakerId, pushToast]);

  useEffect(() => { if (deathInfo) applyDeath(); }, [deathInfo, applyDeath]);

  // Slots (save/load dialog)
  const slotCount = 20;
  const slots = useMemo(() => {
    const arr: Array<any> = [];
    for (let i = 0; i < slotCount; i++) arr.push(systems.save.getSlotMeta(i));
    return arr;
  }, [systems.save, saveOpen]);

  const onSelectSlot = (idx: number) => {
    if (saveOpen === "save") {
      const ok = systems.save.writeSlot(idx, {
        checkpoint_path: state.currentPath,
        variables: state.variables,
      });
      if (ok) pushToast({ title: `已存档到 SLOT ${idx + 1}`, icon: "💾" });
      setSaveOpen(null);
    } else if (saveOpen === "load") {
      const data = systems.save.readSlot(idx);
      if (!data) { pushToast({ title: "存档位为空", body: `SLOT ${idx + 1}`, icon: "⚠" }); return; }
      try {
        const d = data as any;
        if (d.checkpoint_path) {
          const [knot, stitch] = d.checkpoint_path.split(".");
          gotoKnot(knot, stitch);
        }
        pushToast({ title: `读取 SLOT ${idx + 1}`, icon: "📂" });
      } catch (err) {
        pushToast({ title: "读取存档失败", body: String(err), icon: "⚠" });
      }
      setSaveOpen(null);
    }
  };
  const onDeleteSlot = (idx: number) => {
    systems.save.deleteSlot(idx);
    pushToast({ title: `删除 SLOT ${idx + 1}`, icon: "🗑" });
  };

  const handleTextClick = () => {
    if (state.choices.length > 0 || state.minigame || state.ended) return;
    if (!typingDone) { setTypingDone(true); return; }
    advance();
  };

  const handleTypingDone = useCallback(() => { setTypingDone(true); }, []);

  const retryAfterDeath = useCallback(() => {
    restartFromCheckpoint();
  }, [restartFromCheckpoint]);

  const onReturnMenu = useCallback(() => {
    systems.saveGlobalProgress();
    onExit();
  }, [systems, onExit]);

  return (
    <div className="vn-app" style={{ position: "fixed", inset: 0 }}>
      <VNStage
        background={bgImg}
        fallbackBg={fallbackBg}
        sprites={state.sprites}
        assets={spriteAssets}
        effect={state.pendingEffect}
        showSprites={settings.show_sprites}
        onEffectEnd={consumeEffect}
      />

      {/* Top HUD */}
      <div className="vn-hud-top">
        <div className="vn-btn-group">
          <button className="vn-btn vn-btn-sm vn-btn-ghost" onClick={onReturnMenu}>← 返回</button>
          <button className="vn-btn vn-btn-sm vn-btn-ghost" onClick={() => setSaveOpen("save")}>💾 存档</button>
          <button className="vn-btn vn-btn-sm vn-btn-ghost" onClick={() => setSaveOpen("load")}>📂 读档</button>
        </div>
        <div className="vn-btn-group">
          <button
            className={`vn-btn vn-btn-sm ${autoPlay ? "vn-btn-primary" : "vn-btn-ghost"}`}
            onClick={() => setAutoPlay((v) => !v)}
          >
            ▶ 自动
          </button>
          <button
            className={`vn-btn vn-btn-sm ${settings.skip_read ? "vn-btn-primary" : "vn-btn-ghost"}`}
            onClick={() => systems.settings.patch({ skip_read: !settings.skip_read })}
          >
            ⏩ 已读跳过
          </button>
          <button
            className={`vn-btn vn-btn-sm ${formalMode ? "vn-btn-primary" : "vn-btn-ghost"}`}
            onClick={() => {
              // toggle formal mode via parent context? Expose via useGame
            }}
            disabled
            title="正史模式"
          >
            正史
          </button>
          <button className="vn-btn vn-btn-sm vn-btn-ghost" onClick={() => setSettingsOpen(true)}>⚙ 设置</button>
        </div>
      </div>

      {/* Interlude (actclear) overlay */}
      {state.interlude && !deathInfo && (
        <InterludeOverlay
          chapter={state.interlude.act}
          title={state.interlude.chapterTitle}
          subtitle={state.interlude.subtitle}
          onSkip={consumeInterlude}
        />
      )}

      {/* Minigame overlay */}
      {state.minigame && !deathInfo && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {renderMinigame
            ? renderMinigame(
                { id: state.minigame.id, params: state.minigame.params },
                (r, s) => resumeMinigame(r, s),
              )
            : (
              <div className="vn-panel" style={{ width: 480 }}>
                <h3 style={{ marginTop: 0, color: "var(--vn-accent)" }}>
                  小游戏：{state.minigame.id}
                </h3>
                <p style={{ color: "var(--vn-text-dim)" }}>
                  未注册的小游戏渲染器。参数：{state.minigame.params ?? "—"}
                </p>
                <div className="vn-btn-group">
                  <button className="vn-btn vn-btn-primary" onClick={() => resumeMinigame(true, 100)}>
                    ✓ 胜利（模拟）
                  </button>
                  <button className="vn-btn" onClick={() => resumeMinigame(false, 0)}>
                    ✕ 失败（模拟）
                  </button>
                  <button className="vn-btn vn-btn-ghost" onClick={() => resumeMinigame("skip", 0)}>
                    ⏭ 跳过
                  </button>
                </div>
              </div>
            )}
        </div>
      )}

      {/* Choice Panel */}
      {state.choices.length > 0 && !state.minigame && !deathInfo && (
        <VNChoicePanel
          choices={state.choices}
          onChoose={choose}
          formalMode={formalMode}
        />
      )}

      {/* Textbox (hide when choosing or minigame or death) */}
      {!deathInfo && state.choices.length === 0 && !state.minigame && !state.ended && (
        <VNTextBox
          speaker={state.kind !== "narration" ? state.speakerName : undefined}
          accent={state.speakerAccent}
          text={state.text}
          kind={state.kind}
          styleVariant={settings.textbox_style as any}
          textSpeedMs={settings.skip_read && isRead() ? 0 : settings.text_speed_ms}
          skipRead={settings.skip_read}
          isRead={isRead()}
          typingDone={typingDone || (settings.skip_read && isRead())}
          onTypingDone={handleTypingDone}
          onClick={handleTextClick}
        />
      )}

      {/* Ended */}
      {state.ended && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 19,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div className="vn-panel" style={{ textAlign: "center", padding: 40, maxWidth: 480 }}>
            <div style={{
              fontFamily: "var(--vn-font-serif)", fontWeight: 900, fontSize: 48,
              color: "var(--vn-accent)", letterSpacing: "0.2em", marginBottom: 12,
            }}>
              终章
            </div>
            <p style={{ color: "var(--vn-text-dim)", lineHeight: 1.8 }}>
              你已抵达此篇的终点。<br/>回到篇章选择，开启新的历史之旅吧。
            </p>
            <div className="vn-btn-group" style={{ justifyContent: "center", marginTop: 18 }}>
              <button className="vn-btn vn-btn-primary vn-btn-lg" onClick={onReturnMenu}>
                ← 返回篇章
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Death overlay */}
      {deathInfo && (
        <DeathOverlay
          title={deathInfo.title}
          death_id={deathInfo.death_id}
          summary={deathInfo.summary}
          count={deathInfo.count}
          onRetry={retryAfterDeath}
          onReturnMenu={onReturnMenu}
          onLoad={() => setSaveOpen("load")}
        />
      )}

      <SaveLoadDialog
        open={saveOpen !== null}
        mode={saveOpen ?? "save"}
        slots={slots as any}
        onClose={() => setSaveOpen(null)}
        onSelectSlot={onSelectSlot}
        onDeleteSlot={onDeleteSlot}
        quickInfo={{ chapter: "", path: state.currentPath }}
      />

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onChange={(p) => systems.settings.patch(p)}
        onClose={() => { setSettingsOpen(false); systems.saveGlobalProgress(); }}
        onReset={() => systems.settings.reset()}
      />

      <ToastStack items={toasts} />
    </div>
  );
}
