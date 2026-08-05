// 史识碎片统一入口：聚合所有时代的 knowledge 数据
// 五帝/夏（wudi-knowledge.ts 手动定义，含图谱坐标与连线）
// 其他系列：从 inkStories 的 deaths/endings 自动生成基础节点

import { WUDI_KNOWLEDGE } from "./wudi-knowledge";
import type { KnowledgeFragment } from "./wudi-knowledge";
import { inkStories } from "../stories/inkStories";

export type { KnowledgeFragment };

function buildAutoKnowledge(): KnowledgeFragment[] {
	const manualStoryKeys = new Set(WUDI_KNOWLEDGE.map((k) => k.storyKey));
	const fragments: KnowledgeFragment[] = [];

	for (const [storyKey, cfg] of Object.entries(inkStories)) {
		if (!cfg) continue;
		if (manualStoryKeys.has(storyKey)) continue;

		const parts = storyKey.split(":");
		const charId = parts[0] ?? storyKey;
		const chapter = parts[1] ?? storyKey;
		const title = cfg.title ?? storyKey;

		const endings = cfg.endings ?? {};
		const endingIds = Object.keys(endings);
		endingIds.forEach((eid, idx) => {
			const e = endings[eid];
			if (!e) return;
			const x = 160 + idx * 180;
			fragments.push({
				id: `ending_${charId}_${chapter}_${eid}`,
				title: e.title ?? eid,
				content: e.epigraph ?? `${title} 之结局`,
				storyKey,
				kind: "graph",
				graphPos: { x, y: 120 },
			});
		});

		const deaths = cfg.deaths ?? {};
		const deathIds = Object.keys(deaths);
		deathIds.forEach((did, idx) => {
			const d = deaths[did];
			if (!d) return;
			const x = 160 + idx * 180;
			fragments.push({
				id: `death_${charId}_${chapter}_${did}`,
				title: d.reason.length > 12 ? d.reason.slice(0, 12) + "…" : d.reason,
				content: d.analysis || d.classical || d.reason,
				storyKey,
				kind: "death",
				graphPos: { x, y: 300 },
			});
		});
	}

	return fragments;
}

export const ALL_KNOWLEDGE: KnowledgeFragment[] = [
	...WUDI_KNOWLEDGE,
	...buildAutoKnowledge(),
];

export const KNOWLEDGE_BY_STORY: Record<string, KnowledgeFragment[]> = (() => {
	const map: Record<string, KnowledgeFragment[]> = {};
	for (const k of ALL_KNOWLEDGE) {
		const arr = map[k.storyKey] ?? [];
		arr.push(k);
		map[k.storyKey] = arr;
	}
	return map;
})();

export const ALL_STORY_KEYS = Object.keys(KNOWLEDGE_BY_STORY);
