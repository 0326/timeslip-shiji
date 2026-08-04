import { useState, useCallback, useEffect, useRef } from "react";
import { getMinigame } from "./registry";
import type { MinigameMode, MinigameOutcome } from "./types";
import { X, ScrollText, Play, ChevronRight } from "lucide-react";
import { useUiStore } from "../store/uiStore";
import "./minigames.css";

interface GameHostProps {
	/** `#minigame:<id>[:param]` 解析后的 id */
	gameId: string;
	/** 标签冒号后的参数（可能 undefined） */
	param?: string;
	storyKey?: string;
	mode: MinigameMode;
	onComplete: (outcome: MinigameOutcome) => void;
}

type Phase = "intro" | "playing" | "done";

export function GameHost({ gameId, param, storyKey, mode, onComplete }: GameHostProps) {
	const entry = getMinigame(gameId);
	const [phase, setPhase] = useState<Phase>("intro");
	const setBgmDucked = useUiStore((s) => s.setBgmDucked);
	const doneRef = useRef(false);
	// 记录进入 playing 阶段的时间，用于防止小游戏挂载后瞬间自动完成
	const playingSinceRef = useRef<number>(0);
	// 自动通过防护：1.5s 内完成视为 bug，重新挂载小游戏组件；最多重试 3 次后强制跳过
	const [retryKey, setRetryKey] = useState(0);
	const autoRetryCountRef = useRef(0);

	// 小游戏进行中压低 BGM（ducking），给音效让出听觉空间；离开时恢复
	useEffect(() => {
		setBgmDucked(phase === "playing");
		if (phase === "playing") {
			playingSinceRef.current = Date.now();
		}
		return () => setBgmDucked(false);
	}, [phase, setBgmDucked]);

	// 安全调用 onComplete：防止重复调用 + 错误兜底
	const safeComplete = useCallback(
		(outcome: MinigameOutcome) => {
			if (doneRef.current) return;
			doneRef.current = true;
			try {
				onComplete(outcome);
			} catch (e) {
				console.error("[GameHost] onComplete error:", e);
			}
		},
		[onComplete],
	);

	// 用 ref 暂存游戏结果，让 effect 处理延时关闭
	const pendingOutcomeRef = useRef<MinigameOutcome | null>(null);

	const handleComplete = useCallback(
		(outcome: MinigameOutcome) => {
			// 系统性防护：进入 playing 阶段后至少经过 1.5 秒才允许完成
			// 防止任何小游戏因初始化竞态导致挂载即自动通过
			const elapsed = Date.now() - playingSinceRef.current;
			if (playingSinceRef.current > 0 && elapsed < 1500) {
				console.warn(
					`[GameHost] "${gameId}" completed in ${elapsed}ms — likely auto-pass bug`,
				);
				// 最多重试 3 次（重新挂载小游戏组件），超过则强制跳过避免死循环
				if (autoRetryCountRef.current < 3) {
					autoRetryCountRef.current++;
					playingSinceRef.current = Date.now();
					setRetryKey((k) => k + 1);
					return;
				}
				console.warn(`[GameHost] "${gameId}" auto-passed 3+ times — forcing skip`);
				pendingOutcomeRef.current = { result: "skip", score: 0 };
				setPhase("done");
				return;
			}
			pendingOutcomeRef.current = outcome;
			setPhase("done");
		},
		[gameId],
	);

	// done 阶段：延时 400ms 后调用 onComplete，让玩家看到结算动画
	useEffect(() => {
		if (phase !== "done") return;
		const t = setTimeout(() => {
			const outcome = pendingOutcomeRef.current ?? { result: "skip", score: 0 };
			safeComplete(outcome);
		}, 400);
		return () => clearTimeout(t);
	}, [phase, safeComplete]);

	// 超时保护：playing 阶段超过 5 分钟仍未完成，强制跳过
	useEffect(() => {
		if (phase !== "playing") return;
		const t = setTimeout(() => {
			console.warn("[GameHost] timeout — forcing skip");
			safeComplete({ result: "skip", score: 0 });
		}, 300_000);
		return () => clearTimeout(t);
	}, [phase, safeComplete]);

	const handleSkip = useCallback(() => {
		// strict 模式下跳过=失败；其他模式跳过=自动胜利
		const auto: MinigameOutcome =
			mode === "strict" ? { result: "lose", score: 0 } : { result: "skip", score: 0 };
		safeComplete(auto);
	}, [mode, safeComplete]);

	// 未注册的游戏：直接跳过（对现有74线零破坏）
	if (!entry) {
		return null;
	}

	const Comp = entry.Component;
	const { meta } = entry;

	return (
		<div className="mg-overlay">
			<div className="mg-panel">
				{phase !== "done" && (
					<button className="mg-close" onClick={handleSkip} title="跳过小游戏">
						<X size={18} />
					</button>
				)}

				{phase === "intro" && (
					<div className="mg-intro">
						<div className="mg-intro-tag">
							<ScrollText size={14} /> 史识小游戏
							<span className="mg-diff">{"★".repeat(meta.difficulty)}</span>
						</div>
						<h2 className="mg-title serif">{meta.title}</h2>
						<p className="mg-note">{meta.historyNote}</p>
						{mode === "strict" && (
							<p className="mg-strict-hint">
								<span>正史模式：此关不可跳过，失败即历史改道</span>
							</p>
						)}
						<div className="mg-actions">
							{mode !== "strict" && (
								<button className="btn btn-ghost" onClick={handleSkip}>
									跳过
								</button>
							)}
							<button className="btn btn-vermilion" onClick={() => setPhase("playing")}>
								<Play size={16} /> 开始
							</button>
						</div>
						<div className="mg-tip">
							<ChevronRight size={12} />
							通关后将获得相应的史识奖励
						</div>
					</div>
				)}

				{phase === "playing" && (
					<div className="mg-stage">
						<Comp
							key={retryKey}
							param={param}
							storyKey={storyKey}
							onComplete={handleComplete}
							onSkip={handleSkip}
						/>
					</div>
				)}

				{phase === "done" && (
					<div className="mg-done">
						<div className="mg-done-spinner" />
						<p className="serif mg-done-text">结算中…</p>
					</div>
				)}
			</div>
		</div>
	);
}
