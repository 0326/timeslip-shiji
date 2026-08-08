import type { UserProgress } from "../types/progress";
import { CHARACTER_IDS } from "../data/characterGameMeta";

function genId(): string {
	return "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function createInitialProgress(): UserProgress {
	const now = Date.now();
	return {
		userId: genId(),
		createdAt: now,
		lastActiveAt: now,

		// 预览模式：资源拉满
		points: 9999,
		gachaTickets: 999,
		fragments: 999,

		lastCheckIn: 0,
		checkInStreak: 0,

		gacha: {
			totalPulls: 0,
			pityCount: 0,
			ownedCharacters: [...CHARACTER_IDS], // 预览模式：全角色解锁
			pullHistory: [],
		},

		storylines: {},
		achievements: { unlocked: [], unlockedAt: {} },
		readSources: [],
		lifetimeDeaths: 0,
		lifetimeCanonClears: 0,
	};
}
