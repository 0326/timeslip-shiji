// 调用自家 Worker /api/hint，绝不直连 Anthropic。失败时优雅降级。

export interface HintParams {
	character: string;
	situation: string;
	choices: string[];
	classicalHint: string;
}

export async function getHint(p: HintParams): Promise<{ hint: string; fallback: boolean }> {
	try {
		const r = await fetch("/api/hint", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(p),
		});
		if (!r.ok) throw new Error(`status_${r.status}`);
		const data = (await r.json()) as { hint?: string };
		if (!data.hint) throw new Error("empty");
		return { hint: data.hint, fallback: false };
	} catch {
		// 降级：用本地原文线索给出启发，而非直接报错
		const local = p.classicalHint
			? `史官无暇分身，且看原文——「${p.classicalHint}」。细品其中神色与措辞，答案往往藏在字缝里。`
			: "史官无暇分身。不妨重读方才的叙述，留意人物的神色与言外之意，再做定夺。";
		return { hint: local, fallback: true };
	}
}
