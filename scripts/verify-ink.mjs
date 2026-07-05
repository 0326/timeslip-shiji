// 无头验证 ink 章节：编译 + 遍历所有分支 + 交叉核对资源 id 注册。
// 用法: node scripts/verify-ink.mjs
import { Compiler } from "inkjs/full";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INK_DIR = join(ROOT, "src/react-app/data/stories/ink");
const DATA = join(ROOT, "src/react-app/data");

// ── 读取已注册 id（正则从 TS 源提取） ──
function slice(text, startMarker) {
	const i = text.indexOf(startMarker);
	if (i < 0) return "";
	const j = text.indexOf("\n};", i);
	return text.slice(i, j < 0 ? undefined : j);
}
// 注册文件已按系列拆分为目录，拼接目录内全部 <series>.ts（跳过 index.ts）
function concatDir(sub) {
	let s = "";
	for (const f of readdirSync(join(DATA, sub)).filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
		s += readFileSync(join(DATA, sub, f), "utf8") + "\n";
	}
	return s;
}
// sceneAssets/*.ts：立绘与背景条目均形如 `\t<id>: {`，合并为一个已注册视觉 id 集
const sceneSrc = concatDir("sceneAssets");
const VISUAL = new Set([...sceneSrc.matchAll(/^\t(\w+): \{/gm)].map((m) => m[1]));
const SPRITES = VISUAL;
const BACKGROUNDS = VISUAL;
// achievements/*.ts
const achSrc = concatDir("achievements");
const ACHIEVEMENTS = new Set([...achSrc.matchAll(/id:\s*"(\w+)"/g)].map((m) => m[1]));
// inkStories 已按系列拆分为 stories/inkStories/<series>.ts，拼接全部读取
const inkStoriesDir = join(DATA, "stories/inkStories");
let inkStoriesSrc = "";
for (const f of readdirSync(inkStoriesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
	inkStoriesSrc += readFileSync(join(inkStoriesDir, f), "utf8") + "\n";
}
// 全局死亡 id 集合（deaths 对象内的键）
const DEATH_IDS = new Set([...inkStoriesSrc.matchAll(/^\t\t\t(\w+):\s*\{$/gm)].map((m) => m[1]));

// ── 遍历一个已编译的 story，收集所有分支的标签 ──
function walk(story) {
	const used = { bg: new Set(), show: new Set(), death: new Set(), achieve: new Set() };
	let deadEnds = 0;
	let maxDepth = 0;
	const seen = new Set();
	function collectTags(tags) {
		for (const t of tags || []) {
			const [k, v] = t.split(":");
			if (k === "bg" && v) used.bg.add(v);
			else if (k === "show" && v) used.show.add(v);
			else if (k === "death" && v) used.death.add(v);
			else if (k === "achieve" && v) used.achieve.add(v);
		}
	}
	function play(depth) {
		maxDepth = Math.max(maxDepth, depth);
		if (depth > 200) throw new Error("path too deep (>200) — possible loop");
		while (story.canContinue) {
			story.Continue();
			collectTags(story.currentTags);
		}
		const choices = story.currentChoices;
		if (!choices || choices.length === 0) return; // ended
		for (const c of choices) collectTags(c.tags);
		const save = story.state.ToJson();
		for (const c of choices) {
			const key = depth + ":" + c.index + ":" + save.length;
			story.state.LoadJson(save);
			story.ChooseChoiceIndex(c.index);
			play(depth + 1);
		}
	}
	play(0);
	return { used, deadEnds, maxDepth };
}

// ── 主流程 ──
const files = readdirSync(INK_DIR).filter((f) => f.endsWith(".ink")).sort();
let hadError = false;
for (const f of files) {
	const src = readFileSync(join(INK_DIR, f), "utf8");
	let story;
	try {
		story = new Compiler(src).Compile();
	} catch (e) {
		console.log(`❌ ${f} — 编译失败: ${e.message.split("\n")[0]}`);
		hadError = true;
		continue;
	}
	let res;
	try {
		res = walk(story);
	} catch (e) {
		console.log(`❌ ${f} — 遍历运行时错误: ${e.message.split("\n")[0]}`);
		hadError = true;
		continue;
	}
	// 交叉核对
	const missBg = [...res.used.bg].filter((x) => !BACKGROUNDS.has(x));
	const missShow = [...res.used.show].filter((x) => !SPRITES.has(x));
	const missDeath = [...res.used.death].filter((x) => !DEATH_IDS.has(x));
	const missAch = [...res.used.achieve].filter((x) => !ACHIEVEMENTS.has(x));
	const problems = [];
	if (missBg.length) problems.push(`未注册背景 #bg: ${missBg.join(",")}`);
	if (missShow.length) problems.push(`未注册立绘 #show: ${missShow.join(",")}`);
	if (missDeath.length) problems.push(`未注册死亡 #death: ${missDeath.join(",")}`);
	if (missAch.length) problems.push(`未注册成就 #achieve: ${missAch.join(",")}`);
	if (problems.length) {
		console.log(`⚠️  ${f} — ${problems.join(" | ")}`);
		hadError = true;
	} else {
		console.log(
			`✅ ${f} — 编译+全分支OK (深度${res.maxDepth}; bg${res.used.bg.size}/show${res.used.show.size}/death${res.used.death.size}/achieve${res.used.achieve.size})`,
		);
	}
}
console.log(hadError ? "\n有问题需修复。" : "\n全部通过。");
process.exit(hadError ? 1 : 0);
