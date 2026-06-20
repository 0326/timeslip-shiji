import type { Story } from "../../engine/types";
import { hanxin } from "./hanxin";
import { hongmenXiangyu } from "./hongmenXiangyu";

export const STORIES: Record<string, Story> = {
	hanxin,
	hongmen_xiangyu: hongmenXiangyu,
};

export function getStory(key: string): Story | undefined {
	return STORIES[key];
}
