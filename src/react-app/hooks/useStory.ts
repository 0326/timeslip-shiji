import { useCallback, useEffect, useRef, useState } from "react";
import { StoryRunner } from "../engine/storyRunner";
import type { Position, StoryState } from "../engine/types";
import { getStory } from "../data/stories";
import { useUserStore } from "../store/userStore";

export interface SceneState {
	background: string;
	characters: Record<string, { expression: string; position: Position }>;
}

export interface UseStoryResult {
	state: StoryState | null;
	scene: SceneState;
	loading: boolean;
	notFound: boolean;
	makeChoice: (index: number) => void;
	advance: () => void;
	retry: () => void;
	restart: () => void;
}

/**
 * 驱动叙事引擎，并将死亡 / 通关 / 存档等副作用接入 userStore。
 * @param storyId  故事线 id（store 存档键）
 * @param charId   角色 id（store 存档键）
 * @param storyKey 引擎剧本键
 */
export function useStory(storyId: string, charId: string, storyKey: string): UseStoryResult {
	const [state, setState] = useState<StoryState | null>(null);
	const [scene, setScene] = useState<SceneState>({ background: "default", characters: {} });
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const runnerRef = useRef<StoryRunner | null>(null);

	const store = useUserStore;

	const buildRunner = useCallback(
		(fresh: boolean) => {
			const story = getStory(storyKey);
			if (!story) {
				setNotFound(true);
				setLoading(false);
				return null;
			}
			setScene({ background: "default", characters: {} });
			const runner = new StoryRunner(story, {
				onAchievement: (id) => store.getState().unlockAchievement(id),
				// 切换背景 = 进入新场景：清空上一幕的立绘，由本幕的 show 重新登场，
				// 避免前一章角色（如屠中少年）滞留到后续章节。
				onBackground: (bg) => setScene((p) => ({ ...p, background: bg, characters: {} })),
				onShowCharacter: (id, expression, position) =>
					setScene((p) => ({
						...p,
						characters: { ...p.characters, [id]: { expression, position } },
					})),
				onHideCharacter: (id) =>
					setScene((p) => {
						const next = { ...p.characters };
						delete next[id];
						return { ...p, characters: next };
					}),
			});
			if (!fresh) {
				const saved = store.getState().loadState(storyId, charId);
				if (saved) runner.loadSaveState(saved);
			}
			return runner;
		},
		[storyKey, storyId, charId, store],
	);

	const persist = useCallback(() => {
		const r = runnerRef.current;
		if (r) store.getState().saveState(storyId, charId, r.getSaveState());
	}, [storyId, charId, store]);

	const handleEnded = useCallback(
		(r: StoryRunner) => {
			store
				.getState()
				.completePerspective(storyId, charId, r.getChoiceRate(), r.getCompletedNodes());
		},
		[storyId, charId, store],
	);

	// 初始化
	useEffect(() => {
		setLoading(true);
		setNotFound(false);
		const runner = buildRunner(false);
		runnerRef.current = runner;
		if (runner) {
			store.getState().startPerspective(storyId, charId);
			const next = runner.advance();
			setState(next);
			if (next.ended) handleEnded(runner);
			else if (!next.death) persist();
		}
		setLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [storyKey, storyId, charId]);

	const makeChoice = useCallback(
		(index: number) => {
			const r = runnerRef.current;
			if (!r) return;
			const next = r.choose(index);
			setState(next);
			if (next.death) {
				store.getState().recordDeath(storyId, charId);
			} else if (next.ended) {
				handleEnded(r);
			} else {
				persist();
			}
		},
		[storyId, charId, store, persist, handleEnded],
	);

	const advance = useCallback(() => {
		const r = runnerRef.current;
		if (!r) return;
		const next = r.advance();
		setState(next);
		if (next.ended) handleEnded(r);
		else if (!next.death) persist();
	}, [persist, handleEnded]);

	const retry = useCallback(() => {
		const r = runnerRef.current;
		if (!r) return;
		const next = r.retry();
		setState(next);
		if (!next.death && !next.ended) persist();
	}, [persist]);

	const restart = useCallback(() => {
		const runner = buildRunner(true);
		runnerRef.current = runner;
		if (runner) {
			const next = runner.advance();
			setState(next);
			persist();
		}
	}, [buildRunner, persist]);

	return { state, scene, loading, notFound, makeChoice, advance, retry, restart };
}
