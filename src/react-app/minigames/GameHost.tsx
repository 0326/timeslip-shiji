import { useState, useCallback } from "react";
import { getMinigame } from "./registry";
import type { MinigameMode, MinigameOutcome } from "./types";
import { X, ScrollText, Play, ChevronRight } from "lucide-react";
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

	const handleComplete = useCallback(
		(outcome: MinigameOutcome) => {
			setPhase("done");
			// 微小延时让玩家看到结局动画
			setTimeout(() => onComplete(outcome), 500);
		},
		[onComplete],
	);

	const handleSkip = useCallback(() => {
		// strict 模式下跳过=失败；其他模式跳过=自动胜利
		const auto: MinigameOutcome =
			mode === "strict" ? { result: "lose", score: 0 } : { result: "skip", score: 0 };
		onComplete(auto);
	}, [mode, onComplete]);

	// 未注册的游戏：直接跳过（对现有74线零破坏）
	if (!entry) {
		setTimeout(() => onComplete({ result: "skip", score: 0 }), 0);
		return null;
	}

	const Comp = entry.Component;
	const { meta } = entry;

	return (
		<div className="mg-overlay">
			<div className="mg-panel">
				<button className="mg-close" onClick={handleSkip} title="跳过小游戏">
					<X size={18} />
				</button>

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
							param={param}
							storyKey={storyKey}
							onComplete={handleComplete}
							onSkip={handleSkip}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
