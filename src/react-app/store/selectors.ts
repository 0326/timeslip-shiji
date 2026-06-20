import type { UserProgress } from "../types/progress";
import { STORYLINES, TOTAL_PERSPECTIVES } from "../data/storylines";

/** 全局进度百分比 = 已通关视角 / 全部视角 */
export function globalProgress(p: UserProgress): number {
	let done = 0;
	for (const s of STORYLINES) {
		const story = p.storylines[s.id];
		if (!story) continue;
		for (const persp of s.perspectives) {
			if (story[persp.characterId]?.isCompleted) done++;
		}
	}
	return TOTAL_PERSPECTIVES > 0 ? Math.round((done / TOTAL_PERSPECTIVES) * 100) : 0;
}

/** 某故事线已通关视角数 / 总视角数 */
export function storylineProgress(p: UserProgress, storyId: string): { done: number; total: number } {
	const story = STORYLINES.find((s) => s.id === storyId);
	if (!story) return { done: 0, total: 0 };
	const rec = p.storylines[storyId];
	let done = 0;
	for (const persp of story.perspectives) {
		if (rec?.[persp.characterId]?.isCompleted) done++;
	}
	return { done, total: story.perspectives.length };
}
