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

// 分支探测得分：正史验证只关心能否走到"史实终点"。
//   DEAD  = 触发 #death；
//   LOOP  = 超过深度上限（疑似探索循环）；
//   CLEAR = 走到 END 但未触发 #achieve（平淡结局）；
//   WIN   = 走到 END 且触发至少一枚 #achieve（理想史实结局）。
const SCORE = { DEAD: 0, LOOP: 1, CLEAR: 2, WIN: 3 };

/**
 * 深度优先评估当前分支能取得的"最好终点"。
 * 分支内遇到子抉择点时，优先沿 #correct 走（贴合史实），再按各子分支得分择优。
 * 返回 SCORE 之一。此函数会推进 story 状态，但每次探测前都会存快照、结束后恢复，
 * 因此对调用方无副作用。
 */
function evalBranch(story, depth = 0) {
	if (depth > 300) return SCORE.LOOP;
	let achieve = false;
	while (story.canContinue) {
		story.Continue();
		const meta = tagsOf(story.currentTags);
		if (meta.achieve) achieve = true;
		if (meta.death) return SCORE.DEAD;
	}
	const ch = story.currentChoices;
	if (!ch || ch.length === 0) return achieve ? SCORE.WIN : SCORE.CLEAR;
	// 快照须在"耗尽当前内容、处于抉择点"之后采集，否则与 currentChoices 对不上，会越界。
	const snap = story.state.ToJson();
	// 优先走 #correct；同 correct 时按原序。
	const ordered = ch
		.map((c, i) => ({ i, correct: tagsOf(c.tags).correct === true }))
		.sort((a, b) => (b.correct - a.correct) || (a.i - b.i));
	let best = SCORE.LOOP;
	for (const { i } of ordered) {
		story.state.LoadJson(snap);
		story.ChooseChoiceIndex(i);
		const r = evalBranch(story, depth + 1);
		if (r > best) best = r;
		if (best === SCORE.WIN) break; // 已找到史实通关路径
	}
	return best;
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
			// 正史路径判定：优先选 #correct 且能走到"史实终点（触发成就、不死亡）"的选项。
			// 某些抉择点有多个 #correct（历史上有多个合理面向），但只有走史实那条能通到
			// 带成就的结局。故对 #correct 选项逐一做 DFS 探测，按得分择优。
			const snap = story.state.ToJson();
			const correctIdx = choices
				.map((c, i) => (tagsOf(c.tags).correct === true ? i : -1))
				.filter((i) => i >= 0);
			let pick = 0;
			let best = SCORE.DEAD;
			if (correctIdx.length === 0) {
				// 无 correct 的风味抉择：取子分支得分最高者（避免误入必死项）
				for (let i = 0; i < choices.length; i++) {
					story.state.LoadJson(snap);
					story.ChooseChoiceIndex(i);
					const r = evalBranch(story, 0);
					if (r > best) {
						best = r;
						pick = i;
					}
					if (best === SCORE.WIN) break;
				}
				flavorPicks++;
			} else {
				// 在 #correct 选项中选能走到史实终点的分支
				for (const ci of correctIdx) {
					story.state.LoadJson(snap);
					story.ChooseChoiceIndex(ci);
					const r = evalBranch(story, 0);
					if (r > best) {
						best = r;
						pick = ci;
					}
					if (best === SCORE.WIN) break; // 已找到史实通关路径
				}
			}
			// 探测过程会推进 story，选择前必须恢复到抉择点快照
			story.state.LoadJson(snap);
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
