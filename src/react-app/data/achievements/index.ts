// 成就汇总。base = 楚汉/收藏/五帝夏 等已完成系列成就。
// 新增系列：建 achievements/<series>.ts 导出 <series>Achievements，在此 import 合并。
import type { Achievement } from "../../types/achievement";
import { baseAchievements } from "./base";
import { chuhanAchievements } from "./chuhan";
import { shangAchievements } from "./shang";
import { chunqiuAchievements } from "./chunqiu";
import { hanwuAchievements } from "./hanwu";
import { zhanguoAchievements } from "./zhanguo";
import { hanchuAchievements } from "./hanchu";
import { qinAchievements } from "./qin";
import { xizhouAchievements } from "./xizhou";
import { zhuziAchievements } from "./zhuzi";

export const ACHIEVEMENTS: Record<string, Achievement> = {
	...baseAchievements,
	...chuhanAchievements,
	...shangAchievements,
	...chunqiuAchievements,
	...hanwuAchievements,
	...zhanguoAchievements,
	...hanchuAchievements,
	...qinAchievements,
	...xizhouAchievements,
	...zhuziAchievements,
};

export const ACHIEVEMENT_LIST: Achievement[] = Object.values(ACHIEVEMENTS);

export function getAchievement(id: string): Achievement | undefined {
	return ACHIEVEMENTS[id];
}
