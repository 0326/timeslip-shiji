// 成就汇总。base = 楚汉/收藏/五帝夏 等已完成系列成就。
// 新增系列：建 achievements/<series>.ts 导出 <series>Achievements，在此 import 合并。
import type { Achievement } from "../../types/achievement";
import { baseAchievements } from "./base";
import { chuhanAchievements } from "./chuhan";

export const ACHIEVEMENTS: Record<string, Achievement> = {
	...baseAchievements,
	...chuhanAchievements,
};

export const ACHIEVEMENT_LIST: Achievement[] = Object.values(ACHIEVEMENTS);

export function getAchievement(id: string): Achievement | undefined {
	return ACHIEVEMENTS[id];
}
