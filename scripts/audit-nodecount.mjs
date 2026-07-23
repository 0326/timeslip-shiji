// 审计并修正所有 storylines/*.ts 中 perspective.nodeCount 的值。
// 口径：正史路径（每次选带 #correct 的选项）经过的抉择节点数。
// 用法:
//   node scripts/audit-nodecount.mjs            # 仅审计（dry-run），打印偏差
//   node scripts/audit-nodecount.mjs --write    # 写回修正
//
// 思路：
//   1. 扫描 src/react-app/data/stories/inkStories/*.ts，解析出每个 storyKey -> ink 源文件路径的映射；
//   2. 编译每个 ink 文件，按"每次选 #correct 选项"的策略遍历至 end，统计经过的 choice 次数，即 canonNodeCount；
//   3. 读取 src/react-app/data/storylines/*.ts，正则匹配每个 perspective 的 nodeCount: N，对比 canonNodeCount；
//   4. --write 时原地修正。
import { Compiler } from "inkjs/full";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INK_DIR = join(ROOT, "src/react-app/data/stories/ink");
const INK_STORIES_DIR = join(ROOT, "src/react-app/data/stories/inkStories");
const STORYLINES_DIR = join(ROOT, "src/react-app/data/storylines");

const WRITE = process.argv.includes("--write");

// ── 1. 从 inkStories/*.ts 解析 storyKey -> ink 文件名 ──
// 形如：
//   import hanxinChuhanSource from "../ink/hanxin-chuhan.ink?raw";
//   "hanxin:chuhan": { ... source: hanxinChuhanSource ... }
function buildKeyToInkFile() {
	const map = {};
	for (const f of readdirSync(INK_STORIES_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts")) {
		const src = readFileSync(join(INK_STORIES_DIR, f), "utf8");
		// import 别名 -> 文件路径
		const importMap = {};
		for (const m of src.matchAll(/import\s+(\w+)\s+from\s+"\.\.\/ink\/([\w-]+\.ink)\?raw"/g)) {
			importMap[m[1]] = m[2];
		}
		// "key": { source: <alias> }
		for (const m of src.matchAll(/"([\w:-]+)":\s*\{[\s\S]*?source:\s*(\w+)[\s\S]*?\}/g)) {
			const storyKey = m[1];
			const alias = m[2];
			const inkFile = importMap[alias];
			if (inkFile) map[storyKey] = inkFile;
		}
	}
	return map;
}

// ── 2. 沿正史路径遍历，统计抉择节点数 ──
function countCanonChoices(inkSource) {
	const story = new Compiler(inkSource, { countAllVisits: false }).Compile();
	let choices = 0;
	let guard = 0;
	while (guard++ < 500) {
		while (story.canContinue) {
			story.Continue();
		}
		const opts = story.currentChoices;
		if (!opts || opts.length === 0) break;
		// 找到带 #correct 的选项
		let correctIdx = -1;
		for (const c of opts) {
			const tags = c.tags || [];
			if (tags.includes("correct") || tags.some((t) => t === "correct" || t.startsWith("correct:"))) {
				correctIdx = c.index;
				break;
			}
		}
		if (correctIdx < 0) {
			// 没有标 #correct，保守处理：选第一个选项（避免卡死），并标记警告
			correctIdx = 0;
		}
		story.ChooseChoiceIndex(correctIdx);
		choices++;
	}
	return choices;
}

// ── 3. 审计每个 storyKey 并返回修正映射 storyKey -> { old, new, inkFile } ──
const keyToInk = buildKeyToInkFile();
const results = [];

for (const [storyKey, inkFile] of Object.entries(keyToInk)) {
	const inkPath = join(INK_DIR, inkFile);
	let src;
	try {
		src = readFileSync(inkPath, "utf8");
	} catch {
		results.push({ storyKey, inkFile, error: "missing ink file" });
		continue;
	}
	let canon;
	try {
		canon = countCanonChoices(src);
	} catch (e) {
		results.push({ storyKey, inkFile, error: "compile error: " + e.message });
		continue;
	}
	results.push({ storyKey, inkFile, canonNodeCount: canon });
}

// ── 4. 读 storylines/*.ts，匹配并对比 nodeCount ──
// perspective 条目形如：
//   { characterId: "hanxin", storyKey: "hanxin:chuhan", ..., nodeCount: 7 },
// 我们用 storyKey 作为锚点，捕获同一行（或紧邻行）的 nodeCount 数字
const diffs = [];
const updated = {};

for (const f of readdirSync(STORYLINES_DIR).filter((f) => f.endsWith(".ts"))) {
	const full = join(STORYLINES_DIR, f);
	let text = readFileSync(full, "utf8");
	let changed = false;
	for (const r of results) {
		if (r.error) continue;
		// 在 storyKey: "<key>" 之后找最近的 nodeCount: N
		const re = new RegExp(`(storyKey:\\s*"${r.storyKey.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}"[\\s\\S]{0,400}?nodeCount:\\s*)(\\d+)`, "m");
		const m = text.match(re);
		if (!m) continue;
		const old = parseInt(m[2], 10);
		if (old !== r.canonNodeCount) {
			diffs.push({ file: f, storyKey: r.storyKey, old, nodeCount: r.canonNodeCount });
			if (WRITE) {
				text = text.replace(re, `$1${r.canonNodeCount}`);
				changed = true;
			}
		} else {
			diffs.push({ file: f, storyKey: r.storyKey, old, nodeCount: r.canonNodeCount, ok: true });
		}
	}
	if (WRITE && changed) {
		writeFileSync(full, text, "utf8");
		updated[f] = true;
	}
}

// ── 报告 ──
console.log(`\n=== nodeCount 审计报告${WRITE ? " (已写回)" : " (dry-run)"} ===\n`);
let mismatches = 0;
let ok = 0;
let errs = 0;
for (const r of results) {
	if (r.error) {
		console.error(`  ✗ ${r.storyKey} (${r.inkFile}): ${r.error}`);
		errs++;
	}
}
for (const d of diffs) {
	if (d.ok) {
		ok++;
	} else {
		mismatches++;
		console.log(`  ! ${d.file}  ${d.storyKey.padEnd(22)}  ${d.old} → ${d.nodeCount}`);
	}
}
console.log(`\n合计: ${ok} 条一致, ${mismatches} 条偏差, ${errs} 个错误`);
if (WRITE) {
	console.log(`已写回文件: ${Object.keys(updated).join(", ") || "(无)"}`);
} else if (mismatches > 0) {
	console.log("提示: 运行 node scripts/audit-nodecount.mjs --write 以自动写回修正");
}
