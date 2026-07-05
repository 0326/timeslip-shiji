import { useCallback, useEffect, useRef, useState } from "react";
import type { Position, StoryState } from "../engine/types";
import { createRunner } from "../engine/createRunner";
import type { IStoryRunner } from "../engine/IStoryRunner";
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

const DEFAULT_SCENE: SceneState = { background: "default", characters: {} };

/**
 * 驱动叙事引擎，并将死亡 / 通关 / 存档等副作用接入 userStore。
 * @param storyId  故事线 id（store 存档键）
 * @param charId   角色 id（store 存档键）
 * @param storyKey 引擎剧本键
 */
export function useStory(storyId: string, charId: string, storyKey: string): UseStoryResult {
	const [state, setState] = useState<StoryState | null>(null);
	const [scene, setScene] = useState<SceneState>(DEFAULT_SCENE);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const runnerRef = useRef<IStoryRunner | null>(null);

	// scene 的同步镜像：舞台回调在 advance/choose 执行期间同步写入，
	// 供"抉择点存档 + 死亡后复位"使用（React state 更新是异步的，不能即时读回）。
	const sceneRef = useRef<SceneState>(DEFAULT_SCENE);
	// 最近一次抉择点的画面快照，retry 时还原（死亡分支可能改过 bg/立绘）。
	const sceneCheckpointRef = useRef<SceneState>(DEFAULT_SCENE);

	const store = useUserStore;

	/** 同步更新 sceneRef + 触发渲染。 */
	const applyScene = useCallback((updater: (prev: SceneState) => SceneState) => {
		const next = updater(sceneRef.current);
		sceneRef.current = next;
		setScene(next);
	}, []);

	const resetScene = useCallback(() => {
		sceneRef.current = DEFAULT_SCENE;
		setScene(DEFAULT_SCENE);
	}, []);

	/** 到达抉择点时，记录当前画面，供死亡后 retry 复位。 */
	const checkpointScene = useCallback((next: StoryState) => {
		if (next.choices && next.choices.length > 0 && !next.death && !next.ended) {
			sceneCheckpointRef.current = sceneRef.current;
		}
	}, []);

	const buildRunner = useCallback(
		(fresh: boolean) => {
			resetScene();
			let runner: IStoryRunner;
			try {
				runner = createRunner(storyKey, {
					onAchievement: (id) => store.getState().unlockAchievement(id),
					// 切换背景 = 进入新场景：清空上一幕的立绘，由本幕的 show 重新登场
					onBackground: (bg) =>
						applyScene((p) => ({ ...p, background: bg, characters: {} })),
					onShowCharacter: (id, expression, position) =>
						applyScene((p) => ({
							...p,
							characters: {
								...p.characters,
								[id]: { expression: expression ?? "default", position: position ?? "center" },
							},
						})),
					onHideCharacter: (id) =>
						applyScene((p) => {
							const next = { ...p.characters };
							delete next[id];
							return { ...p, characters: next };
						}),
				});
			} catch {
				setNotFound(true);
				setLoading(false);
				return null;
			}
			if (!fresh) {
				const saved = store.getState().loadState(storyId, charId);
				if (saved) runner.loadSaveState(saved);
			}
			return runner;
		},
		[storyKey, storyId, charId, store, applyScene, resetScene],
	);

	const persist = useCallback(() => {
		const r = runnerRef.current;
		if (r) store.getState().saveState(storyId, charId, r.getSaveState());
	}, [storyId, charId, store]);

	const handleEnded = useCallback(
		(r: IStoryRunner) => {
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
			checkpointScene(next);
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
			checkpointScene(next);
			if (next.death) {
				store.getState().recordDeath(storyId, charId);
			} else if (next.ended) {
				handleEnded(r);
			} else {
				persist();
			}
		},
		[storyId, charId, store, persist, handleEnded, checkpointScene],
	);

	const advance = useCallback(() => {
		const r = runnerRef.current;
		if (!r) return;
		const next = r.advance();
		setState(next);
		checkpointScene(next);
		if (next.ended) handleEnded(r);
		else if (!next.death) persist();
	}, [persist, handleEnded, checkpointScene]);

	const retry = useCallback(() => {
		const r = runnerRef.current;
		if (!r) return;
		// 先把画面复位到抉择点（死亡分支可能改过背景/立绘），再回到抉择点。
		// runner.retry() 从抉择点快照恢复后 advance，此时无内容推进、不触发舞台回调，
		// 故画面会稳定停在此处还原的快照上。
		sceneRef.current = sceneCheckpointRef.current;
		setScene(sceneCheckpointRef.current);
		const next = r.retry();
		setState(next);
		checkpointScene(next);
		if (!next.death && !next.ended) persist();
	}, [persist, checkpointScene]);

	const restart = useCallback(() => {
		const r = runnerRef.current;
		if (!r) return;
		resetScene();
		r.restart();
		const next = r.advance();
		setState(next);
		checkpointScene(next);
		persist();
	}, [persist, resetScene, checkpointScene]);

	return { state, scene, loading, notFound, makeChoice, advance, retry, restart };
}
