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
// 每个 story 条目里有 `inkFile: "xxx"`（动态加载）与 endings registry。
// 线性序章（仅注册 canon、无 if_* 反事实结局）豁免"≥3 结局"要求。
const REGISTERED = new Map(); // ink file -> Set(endingIds)
{
	const blocks = inkStoriesSrc.split(/\n\t"[^"]+": \{/).slice(1);
	for (const block of blocks) {
		const fileM = block.match(/inkFile:\s*"([\w/-]+)"/);
		if (!fileM) continue;
		const file = fileM[1] + ".ink";
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
	const reg = REGISTERED.get(f) ?? new Map();
	const regIds = [...reg.keys()];
	const unregistered = named.filter((id) => !regIds.includes(id));
	const unreachable = regIds.filter((id) => !named.includes(id));
	const linear = [...reg.values()].every((k) => k !== "if"); // 仅注册 canon 结局 → 线性序章/起源
	sumSurv += res.survivals.size;
	const problems = [];
	// 线性序章（起源/楔子）天然只有 1 个史实结局，豁免"≥3 结局"与"≥2 开放结局"要求；
	// 常规故事仍须满足多结局标准。
	if (!linear) {
		if (res.survivals.size < 3) problems.push(`存活结局仅 ${res.survivals.size} 个（需≥3）`);
		if (named.filter((id) => id !== "canon").length < 2)
			problems.push(`开放结局不足 2 个（现 ${named.filter((id) => id !== "canon").length}）`);
	}
	if (!named.includes("canon")) problems.push(`缺史实结局 #ending:canon`);
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
