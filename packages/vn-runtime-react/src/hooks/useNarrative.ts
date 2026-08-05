import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  InkRunner, createInkRunner,
  type NarrativeRunner, type RunnerOutput, type Choice,
  type CharacterSpriteState, type MinigameInterrupt, type StageEffectPayload,
  type SegmentKind,
} from "ink-vn-core";
import { useGame } from "../context/GameContext";

export interface NarrativeState {
  /** Current segment text (or empty when waiting for choices/minigame/end). */
  text: string;
  /** Speaker id (character id) — only when kind == "dialogue" or "thought". */
  speakerId?: string;
  /** Speaker display name. */
  speakerName?: string;
  speakerAccent?: string;
  kind: SegmentKind;
  /** Tags attached to the segment (not stage effects). */
  tags: string[];
  /** Active choices. Non-empty => player must choose to advance. */
  choices: Choice[];
  /** Sprite states indexed by character id — latest snapshot. */
  sprites: CharacterSpriteState[];
  /** Active bg scene id or image URL. */
  background?: string;
  /** Stage effects pending for this transition. */
  pendingEffect?: StageEffectPayload | null;
  /** Minigame interrupt — player must resolve then resumeMinigame(). */
  minigame?: MinigameInterrupt | null;
  /** End of story reached. */
  ended: boolean;
  /** Act / chapter / interlude metadata carried in tags: #actclear:幕名 etc. */
  interlude?: { act?: string; chapterTitle?: string; subtitle?: string } | null;
  /** Meta (empty) segment — for #actclear and similar without text. */
  isMeta: boolean;
  /** Raw Ink path string for current thread (used for checkpoint/death tracking). */
  currentPath: string;
  /** Ink global variables snapshot. */
  variables: Record<string, unknown>;
}

export interface NarrativeHandle {
  runner: NarrativeRunner;
  state: NarrativeState;
  /** Advance to the next output (text / choices / minigame / end). */
  advance: () => void;
  /** Pick a choice by index. */
  choose: (idx: number) => void;
  /** Resume from a minigame interrupt. */
  resumeMinigame: (result: number | boolean | string, score?: number) => void;
  /** Jump to a knot (and optionally stitch). */
  gotoKnot: (knot: string, stitch?: string) => void;
  /** Reload the story and go to a knot (used by DeathOverlay retry). */
  restartFromCheckpoint: () => void;
  /** True if the currently-displayed segment has already been seen (for skip-read). */
  isRead: () => boolean;
  /** Mark pending stage effect as applied/consumed. */
  consumeEffect: () => void;
  /** Clear interlude meta after displaying. */
  consumeInterlude: () => void;
}

/**
 * Core hook managing the narrative engine lifecycle for a storyline.
 *
 * @param storylineId The storyline id whose ink source we will compile.
 * @param inkSource Raw Ink text for the storyline (from virtual module / fetch).
 * @param startKnot Optional starting knot (from GlobalSave resume or route param).
 */
export function useNarrative(
  storylineId: string,
  inkSource: string,
  startKnot?: string,
): NarrativeHandle {
  const { content, systems, formalMode } = useGame();

  const storyline = useMemo(
    () => content.storylines.find((s) => s.id === storylineId),
    [content.storylines, storylineId],
  );
  const charById = useMemo(
    () => new Map(content.characters.map((c) => [c.id, c])),
    [content.characters],
  );

  // Keep runner in ref so identity is stable across renders
  const runnerRef = useRef<NarrativeRunner | null>(null);
  const checkpointRef = useRef<{ knot: string; stitch?: string } | null>(null);

  if (!runnerRef.current || runnerRef.current.storylineId !== storylineId) {
    runnerRef.current = createInkRunner({
      source: inkSource,
      storylineId,
      seriesId: storyline?.series,
    });
    checkpointRef.current = null;
  }
  const runner = runnerRef.current as InkRunner;

  const [state, setState] = useState<NarrativeState>(() => {
    let out: RunnerOutput;
    if (startKnot) {
      checkpointRef.current = { knot: startKnot };
      out = runner.gotoKnot(startKnot);
    } else {
      out = runner.start();
    }
    return outputToState(out, runner, charById);
  });

  // Update checkpoint on knot change so retry works
  useEffect(() => {
    const idx = state.currentPath.lastIndexOf(".");
    const knot = idx > 0 ? state.currentPath.slice(0, idx) : state.currentPath;
    if (knot && knot !== checkpointRef.current?.knot) {
      checkpointRef.current = { knot };
    }
  }, [state.currentPath]);

  // Track read segments in statistics system (for "skip read")
  const isRead = useCallback(() => {
    return systems.stats.hasSeenPath(state.currentPath);
  }, [systems.stats, state.currentPath]);

  const advance = useCallback(() => {
    // Mark read
    if (state.currentPath) systems.stats.markPathSeen(state.currentPath);
    const out = runner.advance();
    setState(outputToState(out, runner, charById));
  }, [runner, state.currentPath, systems.stats, charById]);

  const choose = useCallback((idx: number) => {
    if (state.currentPath) systems.stats.markPathSeen(state.currentPath);
    const out = runner.choose(idx);
    setState(outputToState(out, runner, charById));
  }, [runner, state.currentPath, systems.stats, charById]);

  const resumeMinigame = useCallback((result: number | boolean | string, score?: number) => {
    const out = runner.resumeMinigame(result, score);
    setState(outputToState(out, runner, charById));
  }, [runner, charById]);

  const gotoKnot = useCallback((knot: string, stitch?: string) => {
    checkpointRef.current = { knot, stitch };
    const out = runner.gotoKnot(knot, stitch);
    setState(outputToState(out, runner, charById));
  }, [runner, charById]);

  const restartFromCheckpoint = useCallback(() => {
    const cp = checkpointRef.current;
    if (cp) {
      const out = runner.gotoKnot(cp.knot, cp.stitch);
      setState(outputToState(out, runner, charById));
    } else {
      const out = runner.start();
      setState(outputToState(out, runner, charById));
    }
  }, [runner, charById]);

  const consumeEffect = useCallback(() => {
    setState((s) => (s.pendingEffect ? { ...s, pendingEffect: null } : s));
  }, []);

  const consumeInterlude = useCallback(() => {
    setState((s) => (s.interlude ? { ...s, interlude: null } : s));
  }, []);

  return {
    runner, state, advance, choose, resumeMinigame, gotoKnot,
    restartFromCheckpoint, isRead, consumeEffect, consumeInterlude,
  };
}

function outputToState(
  out: RunnerOutput, runner: InkRunner,
  charById: Map<string, any>,
): NarrativeState {
  const seg = out.segment;
  const speakerId = seg?.speaker;
  const c = speakerId ? charById.get(speakerId) : undefined;
  const interlude = extractInterlude(out.metaTags ?? []);
  return {
    text: seg?.text ?? "",
    speakerId,
    speakerName: c?.name,
    speakerAccent: c?.accent,
    kind: seg?.kind ?? "narration",
    tags: seg?.tags ?? [],
    choices: out.choices ?? [],
    sprites: out.sprites ?? [],
    background: out.stage?.bg,
    pendingEffect: out.stage?.effect ?? null,
    minigame: out.minigame ?? null,
    ended: out.ended ?? false,
    interlude,
    isMeta: !seg?.text && out.metaTags && out.metaTags.length > 0,
    currentPath: out.currentPath ?? runner.checkpointPath() ?? "",
    variables: (runner as any).getVariables?.() ?? {},
  };
}

function extractInterlude(tags: string[]): NarrativeState["interlude"] {
  let act: string | undefined;
  for (const t of tags) {
    if (t.startsWith("actclear:")) {
      act = t.slice("actclear:".length);
    }
  }
  if (!act) return null;
  return { act, chapterTitle: act };
}
