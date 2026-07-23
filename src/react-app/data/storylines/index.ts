// 故事线汇总。每个系列一份 <series>.ts，本文件合并 + 提供查询 API。
// 新增系列：建 <series>.ts（用 withSeries 盖章）→ 在此 import 并加入 STORYLINES。
import type { Storyline } from "../../types/story";
import { wudiStorylines } from "./wudi";
import { chuhanStorylines } from "./chuhan";
import { shangStorylines } from "./shang";
import { chunqiuStorylines } from "./chunqiu";
import { hanwuStorylines } from "./hanwu";
import { zhanguoStorylines } from "./zhanguo";
import { hanchuStorylines } from "./hanchu";
import { qinStorylines } from "./qin";
import { xizhouStorylines } from "./xizhou";
import { zhuziStorylines } from "./zhuzi";

export const STORYLINES: Storyline[] = [
	...wudiStorylines,
	...chuhanStorylines,
	...shangStorylines,
	...chunqiuStorylines,
	...hanwuStorylines,
	...zhanguoStorylines,
	...hanchuStorylines,
	...qinStorylines,
	...xizhouStorylines,
	...zhuziStorylines,
];

export const STORYLINE_MAP: Record<string, Storyline> = Object.fromEntries(
	STORYLINES.map((s) => [s.id, s]),
);

export function getStoryline(id: string): Storyline | undefined {
	return STORYLINE_MAP[id];
}

/** 某系列下的全部故事线，按定义顺序（= 篇章内顺序解锁的次序） */
export function getSeriesStorylines(seriesId: string): Storyline[] {
	return STORYLINES.filter((s) => s.series === seriesId);
}

/** 同系列内的下一条故事线（无则返回 undefined，即本系列最后一篇） */
export function getNextStoryline(storyId: string): Storyline | undefined {
	const cur = STORYLINE_MAP[storyId];
	if (!cur) return undefined;
	const list = getSeriesStorylines(cur.series);
	const idx = list.findIndex((s) => s.id === storyId);
	return idx >= 0 ? list[idx + 1] : undefined;
}

/** 全部视角总数（用于全局进度） */
export const TOTAL_PERSPECTIVES = STORYLINES.reduce(
	(n, s) => n + s.perspectives.length,
	0,
);
