import type { UserProgress } from "../types/progress";

function genId(): string {
	return "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function createInitialProgress(): UserProgress {
	const now = Date.now();
	return {
		userId: genId(),
		createdAt: now,
		lastActiveAt: now,

		// 初始资源：赠送 1 张抽卡券，保证新玩家能立刻体验
		points: 0,
		gachaTickets: 1,
		fragments: 0,

		lastCheckIn: 0,
		checkInStreak: 0,

		gacha: {
			totalPulls: 0,
			pityCount: 0,
			ownedCharacters: [],
			pullHistory: [],
		},

		storylines: {},
		achievements: { unlocked: [], unlockedAt: {} },
		readSources: [],
		lifetimeDeaths: 0,
		lifetimeCanonClears: 0,
	};
}
