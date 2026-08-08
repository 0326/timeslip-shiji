// 临时校验：ink 标签引用 vs 真实数据定义（经 esbuild 打包真实模块）
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { BACKGROUNDS, SPRITES } from "./src/react-app/data/sceneAssets/index";
import { inkStories } from "./src/react-app/data/stories/inkStories";
import { ALL_KNOWLEDGE } from "./src/react-app/data/knowledge/index";

const ROOT = process.cwd();
const INK = join(ROOT, "src/react-app/data/stories/ink");

// BGM 合法值 = 20 个情绪 + bgm.ts aliases 映射的别名（与运行时一致）
const VALID_BGM = new Set([
	"solemn","danger","tension","sorrow","triumph","court","battle","mystery",
	"peaceful","romantic","epic","nostalgic","march","dark","cheerful","melancholy",
	"tragic","mournful","sad","death",
	// 别名（bgm.ts aliases）
	"urgent","grand","elegant","tense","contemplate","ancient","martial","palace",
	"adventure","chaos","victory","heroic","mystical","dreamy","gentle","sinister",
	"idyllic","emotional","reminisce","joyful","suspense",
]);

// #impact / #quiz 在运行时（shijiInkAdapter.consumeSegmentMeta）查的是
// InkStoryConfig.impacts 注册表 + data/knowledge 史识碎片，而非 quiz 定义表。
const IMPACT_IDS = new Set<string>();
for (const cfg of Object.values(inkStories)) {
	if (!cfg) continue;
	for (const k of Object.keys(cfg.impacts ?? {})) IMPACT_IDS.add(k);
}
const KNOWLEDGE_IDS = new Set(ALL_KNOWLEDGE.map((k) => k.id));

const files = readdirSync(INK).filter((f) => f.endsWith(".ink"));
const miss = { bg: [], show: [], bgm: [], impact: [], quiz: [] };

for (const f of files) {
	const src = readFileSync(join(INK, f), "utf8");
	for (const m of src.matchAll(/#bg:([\w-]+)/g)) {
		if (!BACKGROUNDS[m[1]]) miss.bg.push(`${f}: ${m[1]}`);
	}
	for (const m of src.matchAll(/#show:([\w]+)(?::([\w]+))?/g)) {
		if (!SPRITES[m[1]]) miss.show.push(`${f}: ${m[1]}`);
	}
	for (const m of src.matchAll(/#bgm:([\w]+)/g)) {
		if (!VALID_BGM.has(m[1])) miss.bgm.push(`${f}: ${m[1]}`);
	}
	for (const m of src.matchAll(/#impact:([\w-]+)/g)) {
		// 运行时：查 impacts 注册表取文案 + 解锁 knowledge 碎片。
		// 二者任一存在即视为有效（允许 knowledge 独立维护）。
		if (!IMPACT_IDS.has(m[1]) && !KNOWLEDGE_IDS.has(m[1])) miss.impact.push(`${f}: ${m[1]}`);
	}
	for (const m of src.matchAll(/#quiz:([\w-]+)/g)) {
		// 运行时：直接解锁对应史识碎片
		if (!KNOWLEDGE_IDS.has(m[1])) miss.quiz.push(`${f}: ${m[1]}`);
	}
}

let bad = 0;
const report = (label, items) => {
	if (!items.length) return;
	bad++;
	console.log(`\n[${label}] (${items.length})`);
	for (const it of items.slice(0, 40)) console.log("  " + it);
};
report("背景 #bg 未定义", miss.bg);
report("立绘 #show 未定义", miss.show);
report("BGM #bgm 非法", miss.bgm);
report("影响卡 #impact 未定义", miss.impact);
report("测验 #quiz 未定义", miss.quiz);
console.log(bad ? `\n发现 ${bad} 类标签引用问题。` : "\n标签引用全部有效。");