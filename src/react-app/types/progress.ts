// 玩家进度类型（唯一持久化事实源的结构）

export interface PerspectiveProgress {
	isStarted: boolean;
	isCompleted: boolean;
	completedNodes: number;
	deathCount: number;
	/** 历史正确选择率，用于成就/结算 */
	bestChoiceRate: number;
	/** 引擎序列化存档（仅此一处保存） */
	saveState?: string;
	/** 解锁的死亡图鉴条目 id 列表 */
	unlockedDeaths?: string[];
	/** 解锁的结局 id 列表（#ending:ID，结局收集） */
	unlockedEndings?: string[];
	/** 该视角是否已达成正史通关 */
	isCanonCleared?: boolean;
}

export interface GachaPull {
	timestamp: number;
	characterId: string;
	isDuplicate: boolean;
	fragmentsGained: number;
}

export interface UserProgress {
	userId: string;
	createdAt: number;
	lastActiveAt: number;

	// 资源
	points: number;
	gachaTickets: number;
	fragments: number;

	// 签到
	lastCheckIn: number; // 上次签到日（YYYYMMDD 数值），0 表示从未
	checkInStreak: number;

	// 抽卡
	gacha: {
		totalPulls: number;
		pityCount: number; // 连续未出新角色计数（出新清零）
		ownedCharacters: string[];
		pullHistory: GachaPull[]; // 最近 100 条
	};

	// 游戏进度：storylineId -> characterId -> 进度
	storylines: Record<string, Record<string, PerspectiveProgress>>;

	// 成就
	achievements: {
		unlocked: string[];
		unlockedAt: Record<string, number>;
	};

	// 已读完整原文的故事线
	readSources: string[];

	// 生涯统计
	lifetimeDeaths: number;
	lifetimeCanonClears: number;
}
