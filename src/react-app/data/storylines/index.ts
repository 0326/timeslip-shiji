// 故事线汇总。每个系列一份 <series>.ts，本文件合并 + 提供查询 API。
// 新增系列：建 <series>.ts（用 withSeries 盖章）→ 在此 import 并加入 STORYLINES。
import type { Storyline } from "../../types/story";
import { wudiStorylines } from "./wudi";
import { chuhanStorylines } from "./chuhan";

export const STORYLINES: Storyline[] = [
	...wudiStorylines,
	...chuhanStorylines,
];

export const STORYLINE_MAP: Record<string, Storyline> = Object.fromEntries(
	STORYLINES.map((s) => [s.id, s]),
);

export function getStoryline(id: string): Storyline | undefined {
	return STORYLINE_MAP[id];
}

/** 全部视角总数（用于全局进度） */
export const TOTAL_PERSPECTIVES = STORYLINES.reduce(
	(n, s) => n + s.perspectives.length,
	0,
);
