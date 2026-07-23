// ink 剧本注册汇总。每个系列一份 <series>.ts（.ink 导入 + deaths registry）。
// 新增系列：建 <series>.ts → 在此 import 并合并进 inkStories。
import type { InkStoryConfig } from "../../../engine/shijiInkAdapter";
import { wudiInkStories } from "./wudi";
import { chuhanInkStories } from "./chuhan";
import { shangInkStories } from "./shang";
import { chunqiuInkStories } from "./chunqiu";
import { hanwuInkStories } from "./hanwu";
import { zhanguoInkStories } from "./zhanguo";
import { hanchuInkStories } from "./hanchu";
import { qinInkStories } from "./qin";
import { xizhouInkStories } from "./xizhou";
import { zhuziInkStories } from "./zhuzi";

export const inkStories: Record<string, InkStoryConfig> = {
	...wudiInkStories,
	...chuhanInkStories,
	...shangInkStories,
	...chunqiuInkStories,
	...hanwuInkStories,
	...zhanguoInkStories,
	...hanchuInkStories,
	...qinInkStories,
	...xizhouInkStories,
	...zhuziInkStories,
};
