// 正史模式验收：每个 ink 沿"全 #correct 路径"走一遍，断言——
//   1. 全程不触发 #death（正史路径必须可通关）
//   2. 抵达 END
//   3. 至少触发一枚 #achieve（史实结局的代理指标）
// 无 #correct 的抉择点（纯风味抉择）取第 0 项。
// 用法: node scripts/verify-canon.mjs
import { Compiler } from "inkjs/full";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INK_DIR = join(ROOT, "src/react-app/data/stories/ink");

function tagsOf(list) {
	const out = {};
	for (const t of list || []) {
		const i = t.indexOf(":");
		if (i < 0) out[t] = true;
		else out[t.slice(0, i)] = t.slice(i + 1);
	}
	return out;
}

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

	let died = null;
	let achieves = 0;
	let steps = 0;
	let flavorPicks = 0; // 无 correct 的抉择点数量（允许，但报告出来）
	try {
		outer: while (steps++ < 500) {
			while (story.canContinue) {
				story.Continue();
				const meta = tagsOf(story.currentTags);
				if (meta.death) {
					died = meta.death;
					break outer;
				}
				if (meta.achieve) achieves++;
			}
			const choices = story.currentChoices;
			if (!choices || choices.length === 0) break; // ended
			let pick = choices.findIndex((c) => tagsOf(c.tags).correct === true);
			if (pick < 0) {
				pick = 0;
				flavorPicks++;
			}
			story.ChooseChoiceIndex(pick);
		}
	} catch (e) {
		console.log(`❌ ${f} — 运行时错误: ${e.message.split("\n")[0]}`);
		hadError = true;
		continue;
	}

	const problems = [];
	if (died) problems.push(`正史路径触发死亡 #death:${died}`);
	if (!died && story.canContinue === false && story.currentChoices.length > 0)
		problems.push("正史路径未收口（停在抉择点，疑似步数超限/循环）");
	if (!died && achieves === 0) problems.push("正史路径未触发任何 #achieve（疑非史实结局）");
	if (problems.length) {
		console.log(`⚠️  ${f} — ${problems.join(" | ")}`);
		hadError = true;
	} else {
		console.log(`✅ ${f} — 正史路径通关 (achieve×${achieves}${flavorPicks ? `; 风味抉择×${flavorPicks}` : ""})`);
	}
}
console.log(hadError ? "\n有问题需修复。" : "\n正史路径全部可通关。");
process.exit(hadError ? 1 : 0);
