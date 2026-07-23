import type { Storyline } from "../../types/story";

/** 给一批故事线统一盖上所属系列 id，免得每条手写 series 字段。 */
export function withSeries(
	series: string,
	entries: Omit<Storyline, "series">[],
): Storyline[] {
	return entries.map((e) => ({ ...e, series }));
}
