import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GachaPull, PerspectiveProgress, UserProgress } from "../types/progress";
import { createInitialProgress } from "./initial";
import { ACHIEVEMENTS } from "../data/achievements";
import { CHARACTERS } from "../data/characters";
import { useUiStore } from "./uiStore";

const TOTAL_CHARACTERS = CHARACTERS.length;

function todayNum(): number {
	const d = new Date();
	return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function yesterdayNum(): number {
	const d = new Date();
	d.setDate(d.getDate() - 1);
	return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

const DEFAULT_PERSPECTIVE: PerspectiveProgress = {
	isStarted: false,
	isCompleted: false,
	completedNodes: 0,
	deathCount: 0,
	bestChoiceRate: 0,
};

export interface CheckInResult {
	alreadyDone: boolean;
	tickets: number;
	streak: number;
	bonus: number;
}

interface UserStore {
	progress: UserProgress;

	// 资源
	addPoints: (n: number) => void;
	spendPoints: (n: number) => boolean;
	addGachaTicket: (n: number) => void;
	spendGachaTicket: (n: number) => boolean;
	addFragment: (n: number) => void;
	spendFragment: (n: number) => boolean;

	// 签到
	dailyCheckIn: () => CheckInResult;

	// 抽卡 / 角色
	unlockCharacter: (id: string) => void;
	hasCharacter: (id: string) => boolean;
	setPity: (n: number) => void;
	pushPull: (p: GachaPull) => void;

	// 进度 / 存档（唯一事实源）
	getPerspective: (storyId: string, charId: string) => PerspectiveProgress;
	patchPerspective: (storyId: string, charId: string, patch: Partial<PerspectiveProgress>) => void;
	saveState: (storyId: string, charId: string, json: string) => void;
	loadState: (storyId: string, charId: string) => string | undefined;
	startPerspective: (storyId: string, charId: string) => void;
	completePerspective: (storyId: string, charId: string, choiceRate: number, completedNodes: number, opts?: { isCanon?: boolean }) => void;
	recordDeath: (storyId: string, charId: string) => void;
	unlockDeathEntry: (storyId: string, charId: string, deathId: string) => boolean;
	/** 解锁一个具名结局（结局收集）；返回是否是首次解锁 */
	unlockEnding: (storyId: string, charId: string, endingId: string) => boolean;

	// 原文阅读
	markSourceRead: (storyId: string) => boolean;
	hasReadSource: (storyId: string) => boolean;

	// 成就
	unlockAchievement: (id: string) => boolean;
	hasAchievement: (id: string) => boolean;

	// 调试 / 重置
	resetAll: () => void;
}

function toast(kind: "achievement" | "info" | "reward", title: string, subtitle?: string, icon?: string) {
	useUiStore.getState().pushToast({ kind, title, subtitle, icon });
}

export const useUserStore = create<UserStore>()(
	persist(
		(set, get) => ({
			progress: createInitialProgress(),

			// ── 资源 ──
			addPoints: (n) =>
				set((s) => ({ progress: { ...s.progress, points: s.progress.points + n } })),
			spendPoints: (n) => {
				if (get().progress.points < n) return false;
				set((s) => ({ progress: { ...s.progress, points: s.progress.points - n } }));
				return true;
			},
			addGachaTicket: (n) =>
				set((s) => ({ progress: { ...s.progress, gachaTickets: s.progress.gachaTickets + n } })),
			spendGachaTicket: (n) => {
				if (get().progress.gachaTickets < n) return false;
				set((s) => ({ progress: { ...s.progress, gachaTickets: s.progress.gachaTickets - n } }));
				return true;
			},
			addFragment: (n) =>
				set((s) => ({ progress: { ...s.progress, fragments: s.progress.fragments + n } })),
			spendFragment: (n) => {
				if (get().progress.fragments < n) return false;
				set((s) => ({ progress: { ...s.progress, fragments: s.progress.fragments - n } }));
				return true;
			},

			// ── 签到 ──
			dailyCheckIn: () => {
				const p = get().progress;
				const today = todayNum();
				if (p.lastCheckIn === today) {
					return { alreadyDone: true, tickets: 0, streak: p.checkInStreak, bonus: 0 };
				}
				const streak = p.lastCheckIn === yesterdayNum() ? p.checkInStreak + 1 : 1;
				const bonus = streak % 7 === 0 ? 5 : 0;
				const tickets = 1 + bonus;
				set((s) => ({
					progress: {
						...s.progress,
						lastCheckIn: today,
						checkInStreak: streak,
						gachaTickets: s.progress.gachaTickets + tickets,
					},
				}));
				toast("reward", `签到成功 +${tickets} 抽卡券`, bonus ? `连续 ${streak} 天 · 额外 +${bonus}` : `已连续签到 ${streak} 天`, "🎟️");
				return { alreadyDone: false, tickets, streak, bonus };
			},

			// ── 角色 ──
			unlockCharacter: (id) => {
				const owned = get().progress.gacha.ownedCharacters;
				if (owned.includes(id)) return;
				set((s) => ({
					progress: {
						...s.progress,
						gacha: { ...s.progress.gacha, ownedCharacters: [...s.progress.gacha.ownedCharacters, id] },
					},
				}));
				// 派生：集齐全卡池
				if (get().progress.gacha.ownedCharacters.length >= TOTAL_CHARACTERS) {
					get().unlockAchievement("full_chuhan");
				}
			},
			hasCharacter: (id) => get().progress.gacha.ownedCharacters.includes(id),
			setPity: (n) =>
				set((s) => ({ progress: { ...s.progress, gacha: { ...s.progress.gacha, pityCount: n } } })),
			pushPull: (p) => {
				const firstEver = get().progress.gacha.totalPulls === 0;
				set((s) => ({
					progress: {
						...s.progress,
						gacha: {
							...s.progress.gacha,
							totalPulls: s.progress.gacha.totalPulls + 1,
							pullHistory: [p, ...s.progress.gacha.pullHistory].slice(0, 100),
						},
					},
				}));
				if (firstEver) get().unlockAchievement("first_pull");
			},

			// ── 进度 / 存档 ──
			getPerspective: (storyId, charId) =>
				get().progress.storylines[storyId]?.[charId] ?? { ...DEFAULT_PERSPECTIVE },
			patchPerspective: (storyId, charId, patch) =>
				set((s) => upsert(s.progress, storyId, charId, patch)),
			saveState: (storyId, charId, json) =>
				set((s) => upsert(s.progress, storyId, charId, { saveState: json })),
			loadState: (storyId, charId) =>
				get().progress.storylines[storyId]?.[charId]?.saveState,
			startPerspective: (storyId, charId) =>
				set((s) => upsert(s.progress, storyId, charId, { isStarted: true })),
			completePerspective: (storyId, charId, choiceRate, completedNodes, opts) => {
				const prev = get().getPerspective(storyId, charId);
				const firstClear = !prev.isCompleted;
				const firstCanonClear = opts?.isCanon && !prev.isCanonCleared;
				set((s) =>
					upsert(s.progress, storyId, charId, {
						isCompleted: true,
						completedNodes,
						bestChoiceRate: Math.max(prev.bestChoiceRate, choiceRate),
						saveState: undefined,
						isCanonCleared: prev.isCanonCleared || !!opts?.isCanon,
					}),
				);
				if (firstClear) {
					get().addGachaTicket(2);
					toast("reward", "通关奖励 +2 抽卡券", "故事线已通关", "🎟️");
				}
				if (firstCanonClear) {
					set((s) => ({
						progress: { ...s.progress, lifetimeCanonClears: s.progress.lifetimeCanonClears + 1 },
					}));
					// zero_death_run: 正史模式零死亡
					const currentPersp = get().getPerspective(storyId, charId);
					if (currentPersp.deathCount === 0) {
						get().unlockAchievement("zero_death_run");
					}
					// canon_master: 累计 10 条正史线
					if (get().progress.lifetimeCanonClears >= 10) {
						get().unlockAchievement("canon_master");
					}
				}
			},
			recordDeath: (storyId, charId) => {
				const prev = get().getPerspective(storyId, charId);
				set((s) => {
					const next = upsert(s.progress, storyId, charId, { deathCount: prev.deathCount + 1 });
					next.progress.lifetimeDeaths = s.progress.lifetimeDeaths + 1;
					return next;
				});
				if (get().progress.lifetimeDeaths >= 9) get().unlockAchievement("nine_deaths");
			},
			unlockDeathEntry: (storyId, charId, deathId) => {
				const prev = get().getPerspective(storyId, charId);
				const list = prev.unlockedDeaths ?? [];
				if (list.includes(deathId)) return false;
				set((s) =>
					upsert(s.progress, storyId, charId, { unlockedDeaths: [...list, deathId] }),
				);
				return true;
			},
			unlockEnding: (storyId, charId, endingId) => {
				const prev = get().getPerspective(storyId, charId);
				const list = prev.unlockedEndings ?? [];
				if (list.includes(endingId)) return false;
				set((s) =>
					upsert(s.progress, storyId, charId, { unlockedEndings: [...list, endingId] }),
				);
				return true;
			},

			// ── 原文 ──
			markSourceRead: (storyId) => {
				if (get().progress.readSources.includes(storyId)) return false;
				set((s) => ({ progress: { ...s.progress, readSources: [...s.progress.readSources, storyId] } }));
				get().addGachaTicket(1);
				get().unlockAchievement("bibliophile");
				toast("reward", "研读原文 +1 抽卡券", "已收入典籍库", "🎟️");
				return true;
			},
			hasReadSource: (storyId) => get().progress.readSources.includes(storyId),

			// ── 成就 ──
			unlockAchievement: (id) => {
				if (get().progress.achievements.unlocked.includes(id)) return false;
				const a = ACHIEVEMENTS[id];
				if (!a) return false;
				set((s) => ({
					progress: {
						...s.progress,
						points: s.progress.points + a.points,
						achievements: {
							unlocked: [...s.progress.achievements.unlocked, id],
							unlockedAt: { ...s.progress.achievements.unlockedAt, [id]: Date.now() },
						},
					},
				}));
				toast("achievement", a.name, a.description, a.icon);
				return true;
			},
			hasAchievement: (id) => get().progress.achievements.unlocked.includes(id),

			resetAll: () => set({ progress: createInitialProgress() }),
		}),
		{
			name: "shiji-user-progress",
			version: 1,
		},
	),
);

function upsert(
	p: UserProgress,
	storyId: string,
	charId: string,
	patch: Partial<PerspectiveProgress>,
): { progress: UserProgress } {
	const prevStory = p.storylines[storyId] ?? {};
	const prev = prevStory[charId] ?? { ...DEFAULT_PERSPECTIVE };
	return {
		progress: {
			...p,
			storylines: {
				...p.storylines,
				[storyId]: { ...prevStory, [charId]: { ...prev, ...patch } },
			},
		},
	};
}
