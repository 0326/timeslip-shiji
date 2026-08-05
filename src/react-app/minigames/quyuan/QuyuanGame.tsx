// 屈原问天（Quyuan Wentian）—— 选词填空小游戏
// 屈原作《天问》，篇中名句千古传诵。玩家从备选词中选出正确的字填入空缺处。
// 玩法：5 道题，每题显示《天问》名句（一字被挖空），点击 4 个备选词之一作答；
//   答对继续，答错可重试当前题；5 题中答对 ≥3 题即胜。

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, XCircle, SkipForward } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./quyuan.css";

// ── 题库 ──
interface Question {
	/** 整句诗（包含答案字），渲染时按 answer 第一次出现位置挖空 */
	verse: string;
	/** 正确答案 */
	answer: string;
	/** 4 个备选词 */
	options: string[];
	/** 简注（答对后揭示） */
	note: string;
}

const QUESTIONS: Question[] = [
	{
		verse: "遂古之初，谁传道之？上下未形，何由考之？",
		answer: "考",
		options: ["考", "问", "知", "想"],
		note: "考——考究、推求。远古之初，谁能传述？天地未分，从何考求？",
	},
	{
		verse: "冥昭瞢暗，谁能极之？冯翼惟像，何以识之？",
		answer: "识",
		options: ["识", "辨", "看", "分"],
		note: "识——辨识。冥昧昭明相杂，谁能穷极其理？氤氲惟有气象，何以辨识之？",
	},
	{
		verse: "明明暗暗，惟时何为？阴阳三合，何本何化？",
		answer: "本",
		options: ["本", "始", "根", "源"],
		note: "本——本源。明暗交替，究竟是为何？阴阳三合，何者为其本、何者为其化？",
	},
	{
		verse: "圜则九重，孰营度之？惟兹何功，孰初作之？",
		answer: "功",
		options: ["功", "事", "工", "力"],
		note: "功——功业、工程。天圆九重，谁来营度？此为何等功业，谁最初作之？",
	},
	{
		verse: "天式纵横，阳离爰死？大鸟何鸣，一夫丧之？",
		answer: "鸣",
		options: ["鸣", "叫", "啼", "飞"],
		note: "鸣——鸣叫。天道纵横，阳气离散则死？大鸟何故而鸣，竟使一夫丧之？",
	},
];

const PASS_THRESHOLD = 3; // 答对 3 题以上即胜利

// 将诗句按答案字第一次出现处拆为「前 / 空 / 后」三段，便于渲染下划线空缺。
function splitAtAnswer(verse: string, answer: string): { prefix: string; suffix: string } | null {
	const idx = verse.indexOf(answer);
	if (idx < 0) return null;
	return {
		prefix: verse.slice(0, idx),
		suffix: verse.slice(idx + answer.length),
	};
}

type OptionState = "idle" | "correct" | "wrong";

export function QuyuanGame({ onComplete, onSkip }: MinigameProps) {
	const total = QUESTIONS.length;
	const [qIndex, setQIndex] = useState(0);
	const [score, setScore] = useState(0);
	/** 已被点错过的选项集合，渲染为红色禁用 */
	const [wrongSet, setWrongSet] = useState<Set<string>>(() => new Set());
	/** 当前题答对后切换为 "correct"，用于金色高亮 */
	const [optionState, setOptionState] = useState<OptionState>("idle");
	/** 答对后短暂揭示注解，再切下一题 */
	const [revealing, setRevealing] = useState(false);
	const [finished, setFinished] = useState(false);
	const [result, setResult] = useState<"win" | "lose" | null>(null);

	const question = QUESTIONS[qIndex];
	const parts = useMemo(() => splitAtAnswer(question.verse, question.answer), [question]);

	const advance = useCallback(
		(nextScore: number, nextIndex: number) => {
			if (nextIndex >= total) {
				// 终局判定
				const win = nextScore >= PASS_THRESHOLD;
				setResult(win ? "win" : "lose");
				setFinished(true);
				if (win) sfx.play("win");
				else sfx.play("lose");
				const t = setTimeout(
					() => onComplete({ result: win ? "win" : "lose", score: win ? Math.round((nextScore / total) * 100) : 0 }),
					1400,
				);
				return () => clearTimeout(t);
			}
			setQIndex(nextIndex);
			setWrongSet(new Set());
			setOptionState("idle");
			setRevealing(false);
		},
		[onComplete, total],
	);

	const handlePick = (opt: string) => {
		if (revealing || optionState === "correct") return;
		if (wrongSet.has(opt)) return; // 已点错过的，禁用
		sfx.play("flip");
		if (opt === question.answer) {
			sfx.play("correct");
			setOptionState("correct");
			setRevealing(true);
			const nextScore = score + 1;
			setScore(nextScore);
			// 1.6s 后切下一题（让玩家读完注解）
			const t = setTimeout(() => advance(nextScore, qIndex + 1), 1600);
			return () => clearTimeout(t);
		}
		// 答错：加入 wrongSet，触发红色震动
		sfx.play("wrong");
		setWrongSet((prev) => {
			const next = new Set(prev);
			next.add(opt);
			return next;
		});
		setOptionState("wrong");
		// 震动一瞬后回到 idle，允许继续尝试
		const t = setTimeout(() => setOptionState("idle"), 600);
		return () => clearTimeout(t);
	};

	const handleSkip = () => {
		onSkip();
	};

	// 切题时滚动到顶部（小屏体验）
	useEffect(() => {
		const el = document.querySelector(".qy-stage");
		if (el) el.scrollTop = 0;
	}, [qIndex]);

	return (
		<div className="qy-root">
			<div className="qy-hud">
				<div className="qy-title serif">屈原问天</div>
				<div className="qy-stats">
					<span>第 {qIndex + 1} / {total} 问</span>
					<span>·</span>
					<span>已答对 {score}</span>
					<span>·</span>
					<span>胜需 {PASS_THRESHOLD} 问</span>
				</div>
			</div>

			<p className="qy-hint">
				屈原披发而行，仰天而问。竹简之上，《天问》名句缺一字——请从四枚竹牌中择其正者补之。
			</p>

			<div className="qy-stage">
				<div className="qy-scroll">
					<div className="qy-scroll-endcap qy-scroll-endcap-top" />
					<div className="qy-verse-wrap">
						<div className="qy-verse-index">《天问》· 第 {qIndex + 1} 句</div>
						<p className="qy-verse serif">
							{parts ? (
								<>
									<span className="qy-verse-text">{parts.prefix}</span>
									<span
										className={[
											"qy-blank",
											optionState === "correct" ? "filled-correct" : "",
										].filter(Boolean).join(" ")}
									>
										{optionState === "correct" ? question.answer : "　"}
									</span>
									<span className="qy-verse-text">{parts.suffix}</span>
								</>
							) : (
								<span className="qy-verse-text">{question.verse}</span>
							)}
						</p>

						{revealing && (
							<div className="qy-note">
								<span className="qy-note-tag">注</span>
								{question.note}
							</div>
						)}
					</div>
					<div className="qy-scroll-endcap qy-scroll-endcap-bottom" />
				</div>

				<div className="qy-options">
					{question.options.map((opt) => {
						const isWrong = wrongSet.has(opt);
						const isCorrect = optionState === "correct" && opt === question.answer;
						const cls = [
							"qy-tag",
							isCorrect ? "qy-tag-correct" : "",
							isWrong ? "qy-tag-wrong" : "",
							revealing && !isCorrect ? "qy-tag-dim" : "",
						].filter(Boolean).join(" ");
						return (
							<button
								key={opt}
								className={cls}
								onClick={() => handlePick(opt)}
								disabled={revealing || isWrong}
							>
								<span className="qy-tag-knot" />
								<span className="qy-tag-text serif">{opt}</span>
							</button>
						);
					})}
				</div>
			</div>

			<div className="qy-controls">
				<button className="btn btn-ghost" onClick={handleSkip}>
					<SkipForward size={14} /> 跳过
				</button>
			</div>

			{finished && (
				<div className={["qy-finish", result === "win" ? "win" : "lose"].filter(Boolean).join(" ")}>
					{result === "win" ? <CheckCircle2 size={46} /> : <XCircle size={46} />}
					<div className="qy-finish-title serif">
						{result === "win" ? "问天有成" : "天问难解"}
					</div>
					<div className="qy-finish-sub">
						共 {total} 问 · 答对 {score} 问
						{result === "win" ? " · 屈子颔首" : " · 还需再思"}
					</div>
				</div>
			)}
		</div>
	);
}
