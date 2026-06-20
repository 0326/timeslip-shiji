// 故事线元数据类型
import type { Era } from "./character";

export interface Perspective {
	characterId: string; // 'hanxin'
	storyKey: string; // 引擎中的剧本键，如 'hanxin' | 'hongmen_xiangyu'
	unlockedBy: string; // 解锁所需角色卡 ID
	nodeCount: number; // 抉择点总数（用于进度）
}

export interface Storyline {
	id: string; // 'hanxin'
	title: string; // '兵仙韩信'
	subtitle: string; // '从胯下之辱到钟室之祸'
	era: Era;
	year: string; // '公元前230—196年'
	cover: string; // 封面主题色
	glyph: string; // 封面徽记
	description: string;
	estimatedMinutes: number;
	difficulty: 1 | 2 | 3 | 4 | 5;
	perspectives: Perspective[];
	relatedCharacters: string[];
	/** 全景视角的主角色（关系图中心） */
	focusCharacter: string;
}
