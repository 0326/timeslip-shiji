import type { UserProgress } from "../types/progress";
import { STORYLINES, TOTAL_PERSPECTIVES } from "../data/storylines";

/** 从 storyId 反查所有对应 storyKey（一个 storyId 含多个 perspective），以及从 storyKey 反查 storyId + charId */
function buildIdMappings() {
	const idToKeys: Record<string, Array<{ storyKey: string; charId: string }>> = {};
	const keyToId: Record<string, { storyId: string; charId: string }> = {};
	for (const s of STORYLINES) {
		for (const persp of s.perspectives) {
			if (!idToKeys[s.id]) idToKeys[s.id] = [];
			idToKeys[s.id].push({ storyKey: persp.storyKey, charId: persp.characterId });
			keyToId[persp.storyKey] = { storyId: s.id, charId: persp.characterId };
		}
	}
	return { idToKeys, keyToId };
}
const ID_MAPS = buildIdMappings();

/** ⭐ 读取某条进度：同时支持 storylineId 和 storyKey 作为主 key（兼容 localStorage 新旧数据）*/
function readProgressRecord(
	p: UserProgress,
	storyId: string,
): Record<string, unknown> | undefined {
	const direct = p.storylines[storyId];
	if (direct) return direct;
	// 如果传入的 storyId 本身是 storyKey 格式（含冒号），直接返回
	if (storyId.includes(":")) return undefined;
	// 传入的是 storylineId，挨个 perspective 的 storyKey 试
	const keys = ID_MAPS.idToKeys[storyId];
	if (!keys) return undefined;
	for (const { storyKey } of keys) {
		const rec = p.storylines[storyKey];
		if (rec) return rec;
	}
	return undefined;
}

/** 读取指定 character 的单视角进度：双 key 兼容 */
function readPerspProgress(
	p: UserProgress,
	storyId: string,
	charId: string,
): { isCompleted?: boolean } | undefined {
	const byStorylineId = p.storylines[storyId]?.[charId];
	if (byStorylineId) return byStorylineId;
	const keys = ID_MAPS.idToKeys[storyId] ?? [];
	for (const { storyKey } of keys) {
		const rec = p.storylines[storyKey]?.[charId];
		if (rec) return rec;
	}
	return undefined;
}

/** 全局进度百分比 = 已通关视角 / 全部视角（双 key 兼容）*/
export function globalProgress(p: UserProgress): number {
	let done = 0;
	for (const s of STORYLINES) {
		for (const persp of s.perspectives) {
			const rec = readPerspProgress(p, s.id, persp.characterId);
			if (rec?.isCompleted) done++;
		}
	}
	return TOTAL_PERSPECTIVES > 0 ? Math.round((done / TOTAL_PERSPECTIVES) * 100) : 0;
}

/** ⭐ 某故事线已通关视角数 / 总视角数（双 key 兼容：storylineId + storyKey 都查）*/
export function storylineProgress(p: UserProgress, storyId: string): { done: number; total: number } {
	// 支持传入 storyKey 格式，先转成 storyId
	let resolvedStoryId = storyId;
	if (storyId.includes(":")) {
		const mapped = ID_MAPS.keyToId[storyId];
		if (mapped) resolvedStoryId = mapped.storyId;
	}
	const story = STORYLINES.find((s) => s.id === resolvedStoryId);
	if (!story) return { done: 0, total: 0 };
	let done = 0;
	for (const persp of story.perspectives) {
		const rec = readPerspProgress(p, story.id, persp.characterId);
		if (rec?.isCompleted) done++;
	}
	return { done, total: story.perspectives.length };
}

export { readPerspProgress, readProgressRecord, ID_MAPS };
