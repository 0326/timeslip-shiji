// 自由模式可玩性验证：每条故事线在自由模式（全分支可选）下，
// 必须有 ≥3 个可达的、互不相同的非死亡具名结局（#ending:<id>），
// 其中恰好 1 个史实结局（id 以 canon 结尾或注册 kind=canon），
// 且所有 #ending id 在 inkStories/<series>.ts 的 endings registry 有注册文案。
//
// 用法:
//   node scripts/verify-free.mjs           # 严格验收（未达标即红）
//   node scripts/verify-free.mjs --audit   # 审计模式：只报告现状，不判失败
import { Compiler } from "inkjs/full";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const AUDIT = process.argv.includes("--audit");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INK_DIR = join(ROOT, "src/react-app/data/stories/ink");
const DATA = join(ROOT, "src/react-app/data");

// ── 读取 endings registry（正则从 inkStories/<series>.ts 提取）──
// 形如: endings: { <id>: { ... }, ... }  → 收集每个 ink 源文件名对应的注册 ending id
const inkStoriesDir = join(DATA, "stories/inkStories");
let inkStoriesSrc = "";
for (const f of readdirSync(inkStoriesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
	inkStoriesSrc += readFileSync(join(inkStoriesDir, f), "utf8") + "\n";
}
// 建立 ink 文件名 → 注册 ending id 集合的映射：
// 每个 story 条目里有 `source: <var>Source` 与 import <var>Source from "../ink/<file>.ink?raw"
const importMap = new Map(); // varName -> ink file name
for (const m of inkStoriesSrc.matchAll(/import\s+(\w+)\s+from\s+"\.\.\/ink\/([\w-]+\.ink)\?raw"/g)) {
	importMap.set(m[1], m[2]);
}
// 解析每个条目块：从 `"key": {` 到平衡大括号太重；用启发式——按 `source: xxxSource` 切块
const REGISTERED = new Map(); // ink file -> Set(endingIds)
{
	const blocks = inkStoriesSrc.split(/\n\t"[^"]+": \{/).slice(1);
	for (const block of blocks) {
		const srcM = block.match(/source:\s*(\w+)/);
		if (!srcM) continue;
		const file = importMap.get(srcM[1]);
		if (!file) continue;
		const ids = new Set(REGISTERED.get(file) ?? []);
		const endM = block.match(/endings:\s*\{([\s\S]*?)\n\t\t\}/);
		if (endM) {
			for (const im of endM[1].matchAll(/^\t{3}(\w+):\s*\{/gm)) ids.add(im[1]);
		}
		REGISTERED.set(file, ids);
	}
}

// ── 遍历一个已编译 story 的全部分支，收集可达结局 ──
function walk(story) {
	const survivals = new Set(); // 非死亡结局：#ending id（无标签时用指纹）
	const deaths = new Set(); // 死亡结局 id
	const unnamed = []; // 无 #ending 标签的存活结局指纹（需补标）
	function play(depth, tail) {
		if (depth > 60) throw new Error("path too deep (>60)");
		// tail: { death: string|null, ending: string|null, lastText: string }
		while (story.canContinue) {
			const text = story.Continue();
			if (text && text.trim()) tail.lastText = text.trim();
			for (const t of story.currentTags || []) {
				const i = t.indexOf(":");
				const k = i < 0 ? t : t.slice(0, i);
				const v = i < 0 ? "" : t.slice(i + 1);
				if (k === "death") tail.death = v || "default";
				else if (k === "ending") tail.ending = v;
			}
		}
		const choices = story.currentChoices;
		if (!choices || choices.length === 0) {
			// 终局
			if (tail.death) deaths.add(tail.death);
			else if (tail.ending) survivals.add(tail.ending);
			else {
				survivals.add("(未命名)" + tail.lastText.slice(0, 24));
				unnamed.push(tail.lastText.slice(0, 40));
			}
			return;
		}
		const save = story.state.ToJson();
		for (const c of choices) {
			story.state.LoadJson(save);
			story.ChooseChoiceIndex(c.index);
			// 每条选择后的 tail 重新起算 death/ending（death/ending 都在终段出现）
			play(depth + 1, { death: null, ending: null, lastText: tail.lastText });
		}
	}
	play(0, { death: null, ending: null, lastText: "" });
	return { survivals, deaths, unnamed };
}

// ── 主流程 ──
const files = readdirSync(INK_DIR).filter((f) => f.endsWith(".ink")).sort();
let bad = 0;
let sumSurv = 0;
const rows = [];
for (const f of files) {
	const src = readFileSync(join(INK_DIR, f), "utf8");
	let story;
	try {
		story = new Compiler(src).Compile();
	} catch (e) {
		console.log(`❌ ${f} — 编译失败: ${e.message.split("\n")[0]}`);
		bad++;
		continue;
	}
	let res;
	try {
		res = walk(story);
	} catch (e) {
		console.log(`❌ ${f} — 遍历错误: ${e.message.split("\n")[0]}`);
		bad++;
		continue;
	}
	const named = [...res.survivals].filter((s) => !s.startsWith("(未命名)"));
	const reg = REGISTERED.get(f) ?? new Set();
	const unregistered = named.filter((id) => !reg.has(id));
	const unreachable = [...reg].filter((id) => !named.includes(id));
	sumSurv += res.survivals.size;
	const problems = [];
	if (res.survivals.size < 3) problems.push(`存活结局仅 ${res.survivals.size} 个（需≥3）`);
	if (!named.includes("canon")) problems.push(`缺史实结局 #ending:canon`);
	if (named.filter((id) => id !== "canon").length < 2)
		problems.push(`开放结局不足 2 个（现 ${named.filter((id) => id !== "canon").length}）`);
	if (res.unnamed.length) problems.push(`${res.unnamed.length} 个存活结局缺 #ending 标签`);
	if (unregistered.length) problems.push(`#ending 未注册: ${unregistered.join(",")}`);
	if (unreachable.length) problems.push(`registry 结局不可达: ${unreachable.join(",")}`);
	const ok = problems.length === 0;
	if (!ok) bad++;
	rows.push({ f, surv: res.survivals.size, deaths: res.deaths.size, ok, problems });
	const mark = ok ? "✅" : AUDIT ? "▫️" : "⚠️ ";
	console.log(
		`${mark} ${f} — 存活结局${res.survivals.size} / 死亡${res.deaths.size}${problems.length ? " | " + problems.join(" | ") : ""}`,
	);
}
console.log(
	`\n共 ${files.length} 卷；达标 ${files.length - bad}；未达标 ${bad}；平均存活结局 ${(sumSurv / files.length).toFixed(1)}`,
);
process.exit(AUDIT ? 0 : bad ? 1 : 0);
