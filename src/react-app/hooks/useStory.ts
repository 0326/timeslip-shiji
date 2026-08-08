import { useCallback, useEffect, useRef, useState } from "react";
import type { Position, StoryState } from "../engine/types";
import { createRunnerAsync } from "../engine/createRunner";
import type { IStoryRunner } from "../engine/IStoryRunner";
import { useUserStore } from "../store/userStore";
import { useUiStore } from "../store/uiStore";

export interface SceneState {
	background: string;
	characters: Record<string, { expression: string; position: Position }>;
	bgm: string;
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
	completeMinigame: (result: "win" | "lose" | "skip", score?: number) => void;
	/** 手动触发小游戏（从学练测收面板），返回小游戏状态 */
	triggerMinigame: (gameId: string, param?: string) => StoryState | null;
	/** 回到上一个抉择点（不推进剧情），返回 false 表示无快照可恢复 */
	revertToChoice: () => boolean;
}

const DEFAULT_SCENE: SceneState = { background: "default", characters: {}, bgm: "" };

/**
 * 驱动叙事引擎，并将死亡 / 通关 / 存档等副作用接入 userStore。
 * @param storyId  故事线 id（store 存档键）
 * @param charId   角色 id（store 存档键）
 * @param storyKey 引擎剧本键
 * @param strict   正史模式（默认 true）：偏离史实的存活分支选中即失败；自由模式传 false
 */
export function useStory(
	storyId: string,
	charId: string,
	storyKey: string,
	strict: boolean = true,
): UseStoryResult {
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
	const pushToast = useUiStore((s) => s.pushToast);

	/** 处理一次死亡事件：计数+图鉴收录（strict 合成死亡不入库） */
	const onDeath = useCallback(
		(death: NonNullable<StoryState["death"]>) => {
			store.getState().recordDeath(storyId, charId);
			if (death.id && death.id !== "strict") {
				const isNew = store.getState().unlockDeathEntry(storyId, charId, death.id);
				if (isNew) {
					pushToast({
						kind: "reward",
						title: "史鉴录已收录",
						subtitle: "「" + (death.reason.length > 14 ? death.reason.slice(0, 14) + "…" : death.reason) + "」",
						icon: "📖",
					});
				}
				// 死亡触发史识碎片解锁（death_<chapter>_<deathId>）
				const chapter = storyId.split(":")[1];
				if (chapter) {
					store.getState().unlockKnowledge(storyId, charId, `death_${chapter}_${death.id}`);
				}
			}
		},
		[storyId, charId, store, pushToast],
	);

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
		async (fresh: boolean) => {
			resetScene();
			let runner: IStoryRunner;
			try {
				runner = await createRunnerAsync(storyKey, {
					onAchievement: (id) => store.getState().unlockAchievement(id),
					onUnlockKnowledge: (id) => store.getState().unlockKnowledge(storyId, charId, id),
					// 切换背景 = 进入新场景：清空上一幕的立绘，由本幕的 show 重新登场
					onBackground: (bg) =>
						applyScene((p) => ({
							...p,
							background: bg,
							characters: Object.fromEntries(
								Object.entries(p.characters).filter(([, c]) => c.position === "float")
							)
						})),
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
					onBGM: (track) =>
						applyScene((p) => ({ ...p, bgm: track })),
				}, { strict });
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
		[storyKey, storyId, charId, store, applyScene, resetScene, strict],
	);

	const persist = useCallback(() => {
		const r = runnerRef.current;
		if (r) store.getState().saveState(storyId, charId, r.getSaveState());
	}, [storyId, charId, store]);

	const handleEnded = useCallback(
		(r: IStoryRunner, endedState?: StoryState) => {
			store
				.getState()
				.completePerspective(storyId, charId, r.getChoiceRate(), r.getCompletedNodes());
			if (endedState?.ending?.id) {
				store.getState().unlockEnding(storyId, charId, endedState.ending.id);
			} else if (endedState?.endingAchievement) {
				store.getState().unlockEnding(storyId, charId, endedState.endingAchievement);
			}
		},
		[storyId, charId, store],
	);

	// 初始化
	useEffect(() => {
		setLoading(true);
		setNotFound(false);
		let cancelled = false;
		buildRunner(false).then((runner) => {
			if (cancelled) return;
			runnerRef.current = runner;
			if (runner) {
				store.getState().startPerspective(storyId, charId);
				const next = runner.advance();
				setState(next);
				checkpointScene(next);
				if (next.ended) handleEnded(runner, next);
				else if (!next.death) persist();
			}
			setLoading(false);
		});
		return () => { cancelled = true; };
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
				onDeath(next.death);
			} else if (next.ended) {
				handleEnded(r, next);
			} else {
				persist();
			}
		},
		[onDeath, persist, handleEnded, checkpointScene],
	);

	const advance = useCallback(() => {
		const r = runnerRef.current;
		if (!r) return;
		const next = r.advance();
		setState(next);
		checkpointScene(next);
		if (next.death) {
			onDeath(next.death);
		} else if (next.ended) {
			handleEnded(r, next);
		} else {
			persist();
		}
	}, [onDeath, persist, handleEnded, checkpointScene]);

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

	const completeMinigame = useCallback(
		(result: "win" | "lose" | "skip", score?: number) => {
			const r = runnerRef.current;
			if (!r) return;
			const next = r.completeMinigame(result, score);
			setState(next);
			checkpointScene(next);
			if (next.death) {
				onDeath(next.death);
			} else if (next.ended) {
				handleEnded(r, next);
			} else {
				persist();
			}
		},
		[onDeath, persist, handleEnded, checkpointScene],
	);
	const triggerMinigame = useCallback((gameId: string, param?: string): StoryState | null => {
		const r = runnerRef.current;
		if (!r || !r.triggerMinigame) return null;
		const next = r.triggerMinigame(gameId, param);
		setState(next);
		checkpointScene(next);
		return next;
	}, [checkpointScene]);

	const revertToChoice = useCallback(() => {
		const r = runnerRef.current;
		if (!r) return false;
		const next = r.revertToChoicePoint();
		if (!next) return false;
		// 画面复位到抉择点快照（死亡分支可能改过背景/立绘）
		sceneRef.current = sceneCheckpointRef.current;
		setScene(sceneCheckpointRef.current);
		setState(next);
		checkpointScene(next);
		return true;
	}, [checkpointScene]);

	return { state, scene, loading, notFound, makeChoice, advance, retry, restart, completeMinigame, triggerMinigame, revertToChoice };
}
