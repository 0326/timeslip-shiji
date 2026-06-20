// 抽卡系统类型

export interface GachaRules {
	pityAt: number; // 15：连续未出新角色达到该值后，下一抽强制出新
	fragmentsOnDuplicate: number; // 重复奖励碎片数
}

export interface GachaPoolCharacter {
	characterId: string;
	weight: number; // 权重（无星级，默认均等）
	isLimited?: boolean;
}

export interface GachaPool {
	id: string;
	name: string;
	era: string;
	characters: GachaPoolCharacter[];
	rules: GachaRules;
}

export interface PullResult {
	characterId: string;
	isDuplicate: boolean;
	fragmentsGained: number;
	isNew: boolean;
}
