import { useState, useCallback, useEffect, useRef } from "react";
import { getMinigame } from "./registry";
import type { MinigameMode, MinigameOutcome } from "./types";
import { X, ScrollText, Play, ChevronRight, CheckCircle2, XCircle, SkipForward } from "lucide-react";
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
	const [outcomeState, setOutcomeState] = useState<MinigameOutcome | null>(null);
	const pendingOutcomeRef = useRef<MinigameOutcome | null>(null);
	const [retryKey, setRetryKey] = useState(0);
	const playingSinceRef = useRef<number>(0);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;

	// 小游戏进行中压低 BGM（ducking），给音效让出听觉空间；离开时恢复
	useEffect(() => {
		setBgmDucked(phase === "playing");
		if (phase === "playing") playingSinceRef.current = Date.now();
		return () => setBgmDucked(false);
	}, [phase, setBgmDucked]);

	// ── 安全调用 onComplete：doneRef 防重复 + try/catch 兜底 ──
	const safeComplete = useCallback((outcome: MinigameOutcome) => {
		if (doneRef.current) {
			console.warn("[GameHost] safeComplete skipped — already done");
			return;
		}
		doneRef.current = true;
		console.warn("[GameHost] safeComplete outcome=", outcome.result, "score=", outcome.score);
		try { onCompleteRef.current(outcome); } catch (e) { console.error("[GameHost] onComplete error:", e); }
	}, []);

	// ── 右上角 X：任何阶段都能直接关弹窗（跳过/失败） ──
	const handleClose = useCallback(() => {
		const outcome: MinigameOutcome =
			mode === "strict" ? { result: "lose", score: 0 } : { result: "skip", score: 0 };
		safeComplete(outcome);
	}, [mode, safeComplete]);

	// ── 子游戏通知完成：win/skip 立刻关，不弹第二层结算 ──
	const handleComplete = useCallback((outcome: MinigameOutcome) => {
		console.warn(`[GameHost] handleComplete: result=${outcome.result} score=${outcome.score ?? 0}`);
		pendingOutcomeRef.current = outcome;
		// lose 模式进入 done 给玩家看失败界面；win/skip 直接关
		if (outcome.result === "lose") {
			setOutcomeState(outcome);
			setPhase("done");
			return;
		}
		// 完成结果直接交给宿主，避免快速完成的小游戏被误判并强制重开。
	safeComplete(outcome);
	}, [gameId, phase, retryKey, safeComplete]);

	// ── 跳过（二次确认给主区按钮用） ──
	const [skipConfirm, setSkipConfirm] = useState(false);
	const handleSkip = useCallback(() => {
		if (mode === "strict") {
			// strict 模式跳过直接计失败并关闭
			safeComplete({ result: "lose", score: 0 });
			return;
		}
		if (!skipConfirm) {
			setSkipConfirm(true);
			setTimeout(() => setSkipConfirm(false), 3000);
			return;
		}
		setSkipConfirm(false);
		safeComplete({ result: "skip", score: 0 });
	}, [mode, skipConfirm, safeComplete]);

	// ── 5 分钟超时保护 ──
	useEffect(() => {
		if (phase !== "playing") return;
		const t = setTimeout(() => {
			console.warn("[GameHost] 5min timeout — forcing lose");
			safeComplete({ result: "lose", score: 0 });
		}, 300_000);
		return () => clearTimeout(t);
	}, [phase, safeComplete]);

	// ── done 文案 ──
	const doneInfo = (() => {
		const outcome = outcomeState;
		if (!outcome) return { icon: <SkipForward size={28} />, label: "已跳过", cls: "skip", desc: "" };
		if (outcome.result === "win") return { icon: <CheckCircle2 size={28} />, label: "通关成功！", cls: "win", desc: "史识已收录" };
		if (outcome.result === "lose") return { icon: <XCircle size={28} />, label: "惜败", cls: "lose", desc: "右上角 × 可返回对话" };
		return { icon: <SkipForward size={28} />, label: "已跳过", cls: "skip", desc: "" };
	})();

	if (!entry) {
		// 未注册的游戏：直接跳过（对现有74线零破坏）
		return null;
	}

	const Comp = entry.Component;
	const { meta } = entry;

	return (
		<div className="mg-overlay">
			<div className="mg-panel">
				{/* ⭐ 右上角 X 关闭按钮：所有阶段（intro/playing/done）都可见 ⭐ */}
				<button className="mg-close" onClick={handleClose} title="关闭小游戏">
					<X size={18} />
				</button>

				<span className="mg-corner-tr" aria-hidden="true" />
				<span className="mg-corner-bl" aria-hidden="true" />

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
								<button className="btn btn-ghost" onClick={handleSkip}>跳过</button>
							)}
							<button className="btn btn-vermilion" onClick={() => {
								playingSinceRef.current = Date.now();
								doneRef.current = false;
								setPhase("playing");
							}}>
								<Play size={16} /> 开始
							</button>
						</div>
						<div className="mg-tip">
							<ChevronRight size={12} />
							通关后将获得相应的史识奖励 · 随时可点右上角 × 关闭
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
						{skipConfirm && (
							<div className="mg-skip-confirm">
								<span>确定要跳过此小游戏吗？</span>
								<button className="btn btn-vermilion mg-skip-yes" onClick={handleSkip}>确定跳过</button>
								<button className="btn btn-ghost" onClick={() => setSkipConfirm(false)}>继续游戏</button>
							</div>
						)}
					</div>
				)}

				{phase === "done" && (
					<div className="mg-done">
						<div className={"mg-done-icon " + doneInfo.cls}>
							{doneInfo.icon}
						</div>
						<h2 className="serif mg-done-title">{doneInfo.label}</h2>
						<p className="mg-done-desc">{doneInfo.desc}</p>
						{/* 失败场景给一个显式返回按钮（同时右上角 × 依然可用） */}
						{outcomeState?.result === "lose" && (
							<button
								style={{
									marginTop: "var(--space-6)",
									background: "linear-gradient(180deg, #e74c3c 0%, #c0392b 100%)",
									color: "#fff",
									fontWeight: "bold",
									fontFamily: '"Noto Serif SC", "SimSun", serif',
									padding: "12px 48px",
									fontSize: "18px",
									letterSpacing: "0.15em",
									border: "2px solid #f39c12",
									borderRadius: "6px",
									cursor: "pointer",
									boxShadow: "0 4px 16px rgba(192,57,43,0.5)",
								}}
								onClick={() => safeComplete(outcomeState ?? { result: "lose", score: 0 })}
							>
								返回对话 →
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
