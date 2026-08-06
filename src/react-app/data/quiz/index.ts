// 测验题统一入口：聚合所有时代的 quiz 数据

import { wudiQuiz, type QuizQuestion } from "./wudi-quiz";
import { chuhanQuiz } from "./chuhan-quiz";
import { shangQuiz } from "./shang-quiz";
import { chunqiuQuiz } from "./chunqiu-quiz";
import { hanwuQuiz } from "./hanwu-quiz";
import { zhanguoQuiz } from "./zhanguo-quiz";
import { hanchuQuiz } from "./hanchu-quiz";
import { qinQuiz } from "./qin-quiz";
import { xizhouQuiz } from "./xizhou-quiz";
import { zhuziQuiz } from "./zhuzi-quiz";
import { qunxiangQuiz } from "./qunxiang-quiz";

export type { QuizQuestion };

/** 所有测验题（单一数据源，供"测"tab / 章末测验共用） */
export const ALL_QUIZ: QuizQuestion[] = [
	...wudiQuiz,
	...chuhanQuiz,
	...shangQuiz,
	...chunqiuQuiz,
	...hanwuQuiz,
	...zhanguoQuiz,
	...hanchuQuiz,
	...qinQuiz,
	...xizhouQuiz,
	...zhuziQuiz,
	...qunxiangQuiz,
];

/** 按 chapter (storyKey) 索引 */
export const QUIZ_BY_CHAPTER: Record<string, QuizQuestion[]> = (() => {
	const map: Record<string, QuizQuestion[]> = {};
	for (const q of ALL_QUIZ) {
		const arr = map[q.chapter] ?? [];
		arr.push(q);
		map[q.chapter] = arr;
	}
	return map;
})();

/** 判断某 storyKey 是否有专属测验题 */
export function hasChapterQuiz(storyKey: string): boolean {
	return !!QUIZ_BY_CHAPTER[storyKey]?.length;
}
