import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Gauge,
	Play as PlayIcon,
	Pause,
	ScrollText,
	Volume2,
	VolumeX,
	Music,
	Music2,
	BookOpen,
	Undo2,
} from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useStory } from "../../hooks/useStory";
import type { StoryState } from "../../engine/types";
import { useBgmPlayer } from "../../hooks/useBgmPlayer";
import { inkStories } from "../../data/stories/inkStories";
import { usePlayStore, type TextSpeed } from "../../store/playStore";
import { useUserStore } from "../../store/userStore";
import { getBackground, getSprite } from "../../data/sceneAssets";
import { getHint } from "../../services/aiClient";
import { LoadingScreen } from "../../components/LoadingScreen";
import { DialogueBox } from "./DialogueBox";
import { ChoicePanel } from "./ChoicePanel";
import { CharacterSprite } from "./CharacterSprite";
import { DeathScreen } from "./DeathScreen";
import { ClearScreen } from "./ClearScreen";
import { ClassicalHint } from "./ClassicalHint";
import { AiHintModal } from "./AiHintModal";
import { ActClearCard } from "./ActClearCard";
import { ImpactCard } from "./ImpactCard";
import { SceneBackground } from "./SceneBackground";
import { DynamicScene } from "./dynamic/DynamicScene";
import { SceneTransition } from "./dynamic/SceneTransition";
import { GameHost } from "../../minigames/GameHost";
import { LearnPanel } from "./LearnPanel";
import { WUDI_KNOWLEDGE } from "../../data/knowledge/wudi-knowledge";
import "../../minigames/minigames.css";

const SPEED_CYCLE: TextSpeed[] = ["slow", "normal", "fast"];
const SPEED_LABEL: Record<TextSpeed, string> = { slow: "慢", normal: "中", fast: "快" };

interface SfxGuideRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

interface Props {
	storyId: string;
	charId: string;
	storyKey: string;
	storyTitle: string;
	charName: string;
	mode?: string;
}

export function VNEngine({ storyId, charId, storyKey, storyTitle, charName, mode = "canon" }: Props) {
	const navigate = useNavigate();
	const sfxEnabled = useUiStore((s) => s.sfxEnabled);
	const toggleSfx = useUiStore((s) => s.toggleSfx);
	const setSfxEnabled = useUiStore((s) => s.setSfxEnabled);
	const bgmEnabled = useUiStore((s) => s.bgmEnabled);
	const setBgmEnabled = useUiStore((s) => s.setBgmEnabled);
	const bgmDucked = useUiStore((s) => s.bgmDucked);
	const isCanon = mode !== "free";
	const { state, scene, loading, notFound, makeChoice, advance, retry, restart, completeMinigame, revertToChoice } = useStory(
		storyId,
		charId,
		storyKey,
		isCanon,
	);
	const { playTrack, stop: stopBgm, pause: pauseBgm, resume: resumeBgm } = useBgmPlayer({ enabled: bgmEnabled, ducked: bgmDucked });
	const sfxBtnRef = useRef<HTMLButtonElement>(null);
	const sfxClickCountRef = useRef(0);
	const sfxClickTimerRef = useRef<number | null>(null);
	const [sfxGuideRect, setSfxGuideRect] = useState<SfxGuideRect | null>(null);
	const [showSfxGuide, setShowSfxGuide] = useState(false);
	// 只在起源开头显示音效选择弹窗
	const isQiyuan = storyId === "huangdi:qiyuan";
	// 已选择过音效的标记（存储在 localStorage）
	const [hasChosenSfx, setHasChosenSfx] = useState(() => {
		try {
			return localStorage.getItem("cysj-sfx-chosen") === "true";
		} catch {
			return false;
		}
	});
	const sfxChosen = !isQiyuan || hasChosenSfx;

	// BGM 播放：选择后才播放
	useEffect(() => {
		if (!sfxChosen) return;
		if (scene.bgm && bgmEnabled) playTrack(scene.bgm);
	}, [scene.bgm, playTrack, sfxChosen, bgmEnabled]);

	useEffect(() => {
		return () => stopBgm();
	}, [stopBgm]);

	// 新手指引自动关闭
	useEffect(() => {
		if (!showSfxGuide) return;
		const id = window.setTimeout(() => setShowSfxGuide(false), 6500);
		return () => window.clearTimeout(id);
	}, [showSfxGuide]);

	// 新手指引：计算音效开关按钮位置（带 DOM fallback 与重试）
	useLayoutEffect(() => {
		if (!showSfxGuide) return;
		let raf = 0;
		function measure() {
			const btn =
				sfxBtnRef.current ??
				(document.querySelector('[aria-label="音效开关"]') as HTMLButtonElement | null);
			if (!btn) {
				raf = requestAnimationFrame(measure);
				return;
			}
			const rect = btn.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) {
				raf = requestAnimationFrame(measure);
				return;
			}
			setSfxGuideRect({
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			});
		}
		measure();
		window.addEventListener("resize", measure);
		const id = window.setInterval(measure, 300);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", measure);
			window.clearInterval(id);
		};
	}, [showSfxGuide]);

	// 按钮 ref callback：只要按钮存在就立即记录位置，避免首次测量失败
	const sfxBtnRefCallback = useCallback((node: HTMLButtonElement | null) => {
		sfxBtnRef.current = node;
		if (!node) return;
		const rect = node.getBoundingClientRect();
		setSfxGuideRect((prev) =>
			prev ?? {
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
			},
		);
	}, []);
	const { textSpeed, setTextSpeed, autoPlay, toggleAutoPlay, isClassicalHintOpen, setClassicalHint } =
		usePlayStore();
	const markSourceRead = useUserStore((s) => s.markSourceRead);
	const getPerspective = useUserStore((s) => s.getPerspective);
	const unlockAchievement = useUserStore((s) => s.unlockAchievement);
	const unlockDeathEntry = useUserStore((s) => s.unlockDeathEntry);
	const unlockEnding = useUserStore((s) => s.unlockEnding);
	const completePerspective = useUserStore((s) => s.completePerspective);

	const [dialogueDone, setDialogueDone] = useState(false);
	const [activeSpeaker, setActiveSpeaker] = useState("");
	const [aiOpen, setAiOpen] = useState(false);
	const [aiLoading, setAiLoading] = useState(false);
	const [aiHint, setAiHint] = useState("");
	const [actClearVisible, setActClearVisible] = useState<{ actName: string; actIndex: number } | null>(null);
	const [clearShown, setClearShown] = useState(false);
	const [turnSeq, setTurnSeq] = useState(0);
	const [impactVisible, setImpactVisible] = useState<{ choice: string; source: string; impact: string } | null>(null);
	const impactVisibleRef = useRef(impactVisible);
	impactVisibleRef.current = impactVisible;
	const impactDismissedRef = useRef<unknown>(null);
	const [showLearnPanel, setShowLearnPanel] = useState(false);

	// 水墨转场：背景切换时触发，带冷却避免连续触发
	const [transitionKey, setTransitionKey] = useState<string>(scene.background);
	const lastTransitionRef = useRef(0);
	const TRANSITION_COOLDOWN = 1400; // ms
	useEffect(() => {
	  const now = performance.now();
	  if (scene.background !== transitionKey && now - lastTransitionRef.current > TRANSITION_COOLDOWN) {
	    lastTransitionRef.current = now;
	    setTransitionKey(scene.background);
	  }
	  // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scene.background]);

	// 新状态到达即重置 dialogueDone + 检测幕间
	const prevStateRef = useRef<StoryState | null>(null);
	const dialogueDoneRef = useRef(false);
	useEffect(() => {
		if (!state) return;
		if (state === prevStateRef.current) return;
		prevStateRef.current = state;
		console.warn("[VNEngine] state changed: nodeId=", state.nodeId, "actClear=", !!state.actClear, "minigame=", state.minigame?.id ?? null, "ended=", state.ended, "death=", !!state.death);
		impactDismissedRef.current = null;
		setTurnSeq(s => s + 1);
		const done = state.segments.length === 0;
		dialogueDoneRef.current = done;
		setDialogueDone(done);
		if (state.actClear) {
			setActClearVisible(state.actClear);
			dialogueDoneRef.current = false;
			setDialogueDone(false);
		}
	}, [state]);

	// 影响卡片：对话完成后显示（dialogueDoneRef 同步追踪，避免 setState 闭包旧值）
	useEffect(() => {
		if (state?.impact && !impactVisibleRef.current && dialogueDoneRef.current && impactDismissedRef.current !== state.impact) {
			impactVisibleRef.current = state.impact;
			setImpactVisible(state.impact);
		}
	}, [state, impactVisible, dialogueDone]);

	// A2+A3: 结局触发：结局收集 + 照见者成就 + 补登 canon
	useEffect(() => {
		if (!state?.ended || clearShown) return;
		if (!dialogueDoneRef.current || impactVisibleRef.current) return;
		const persp = getPerspective(storyId, charId);
		const ending = state.ending;
		const isCanonEnding = ending ? ending.kind === "canon" : isCanon || !!state.endingAchievement;
		if (!isCanon && !isCanonEnding) {
			unlockAchievement("zhaojian_zhe");
		}
		// 结局收集：具名结局入图鉴；集齐该线全部结局 → 穷尽歧路成就
		if (ending) {
			unlockEnding(storyId, charId, ending.id);
			const total = Object.keys(inkStories[storyKey]?.endings ?? {}).length;
			const unlocked = new Set([...(persp.unlockedEndings ?? []), ending.id]).size;
			if (total >= 3 && unlocked >= total) {
				unlockAchievement("ending_collector");
			}
		}
		// useStory.handleEnded 已经传过一次 completePerspective（未标 isCanon），
		// 如果本结局是史实且此前未登记 isCanonCleared，补登一次
		if (isCanonEnding && !persp.isCanonCleared) {
			completePerspective(storyId, charId, persp.bestChoiceRate, 0, { isCanon: true });
		}
		setClearShown(true);
	}, [state?.ended, state?.ending, state?.endingAchievement, clearShown, dialogueDone, impactVisible, storyId, charId, storyKey, isCanon, getPerspective, unlockAchievement, unlockEnding, completePerspective]);

	// 重启时重置 clearShown
	useEffect(() => {
		if (!state?.ended && clearShown) setClearShown(false);
	}, [state?.ended, clearShown]);

	// 死亡解锁图鉴
	useEffect(() => {
		if (!state?.death) return;
		const deathId = `${state.nodeId}::${state.death.reason}`;
		unlockDeathEntry(storyId, charId, deathId);
	}, [state?.death, state?.nodeId, storyId, charId, unlockDeathEntry]);

	if (loading) return <LoadingScreen label="正在展开竹简……" />;
	if (notFound || !state) {
		return (
			<div className="empty-state" style={{ paddingTop: 140 }}>
				<div className="glyph">卷</div>
				<h2 className="serif">未寻得此卷</h2>
				<button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => navigate("/story")}>
					返回故事选择
				</button>
			</div>
		);
	}

	const bg = getBackground(scene.background);
	const guideRect =
		sfxGuideRect ?? {
			top: 70,
			left: typeof window !== "undefined" ? window.innerWidth - 70 : 0,
			width: 38,
			height: 38,
		};
	const visibleSegments = state.segments.filter((s) => s.text.length > 0);
	const atChoicePoint = dialogueDone && !state.death && !state.ended && state.choices.length > 0;
	const showHintButton = !state.death && (!state.ended || visibleSegments.length > 0) && (!isCanon || !atChoicePoint);
	const hintText = state.death?.classical ?? state.hint ?? "";
	const showChoices = atChoicePoint;
	const showClear = state.ended && clearShown && dialogueDone && !impactVisibleRef.current;
	// "返回重选"：对话已完成、不在抉择点、无死亡/结局/小游戏/影响卡片/幕间卡片时显示
	const canRevertChoice = dialogueDone
		&& !atChoicePoint
		&& !state.death
		&& !state.ended
		&& !state.minigame
		&& !impactVisible
		&& !actClearVisible
		&& visibleSegments.length > 0;
	const persp = getPerspective(storyId, charId);

	const systemCharacters = Object.entries(scene.characters).filter(
		([, c]) => c.position === "float",
	);
	const stageCharacters = Object.entries(scene.characters).filter(
		([, c]) => c.position !== "float",
	);
	const showSystemChar = systemCharacters.length > 0 && visibleSegments.length > 0 && !state.death;
	const systemSpeaking = systemCharacters.some(([id]) => getSprite(id).name === activeSpeaker);

	async function askAi() {
		setAiOpen(true);
		setAiLoading(true);
		const lastLine = state!.segments[state!.segments.length - 1]?.text ?? storyTitle;
		const res = await getHint({
			character: charName,
			situation: lastLine,
			choices: state!.choices.map((c) => c.text),
			classicalHint: state!.hint ?? "",
		});
		setAiHint(res.hint);
		setAiLoading(false);
	}

	function cycleSpeed() {
		const i = SPEED_CYCLE.indexOf(textSpeed);
		setTextSpeed(SPEED_CYCLE[(i + 1) % SPEED_CYCLE.length]);
	}

	function handleWrapClick() {
		if (!sfxChosen) return;
		if (aiOpen || isClassicalHintOpen || actClearVisible || showSfxGuide || state!.minigame || impactVisibleRef.current) return;
		if (state!.ended || state!.death) return;
		if (state!.choices.length > 0 && dialogueDone) return;
		if (!dialogueDone) return;
		advance();
		setDialogueDone(false);
	}

	function handleActClearClose() {
		setActClearVisible(null);
		// 如果有未完成的小游戏，关闭幕间后进入游戏，不推进故事
		if (state!.minigame) return;
		advance();
		setDialogueDone(false);
	}

	function handleImpactClose() {
		impactDismissedRef.current = impactVisibleRef.current;
		impactVisibleRef.current = null;
		setImpactVisible(null);
	}

	function handleSfxChoice(enable: boolean) {
		setSfxEnabled(enable);
		setHasChosenSfx(true);
		try {
			localStorage.setItem("cysj-sfx-chosen", "true");
		} catch {
			/* ignore */
		}
		if (enable) {
			setBgmEnabled(true);
			setShowSfxGuide(true);
		} else {
			setBgmEnabled(false);
		}
	}

	function closeSfxGuide() {
		setShowSfxGuide(false);
	}

	function handleSfxBtnClick(e: React.MouseEvent) {
		e.stopPropagation();
		toggleSfx();
		if (!isQiyuan) return;
		sfxClickCountRef.current += 1;
		if (sfxClickTimerRef.current) window.clearTimeout(sfxClickTimerRef.current);
		sfxClickTimerRef.current = window.setTimeout(() => {
			sfxClickCountRef.current = 0;
		}, 1200);
		if (sfxClickCountRef.current >= 5) {
			sfxClickCountRef.current = 0;
			if (sfxClickTimerRef.current) window.clearTimeout(sfxClickTimerRef.current);
			try {
				localStorage.removeItem("cysj-sfx-chosen");
			} catch {
				/* ignore */
			}
			setHasChosenSfx(false);
			stopBgm();
		}
	}

	return (
		<div className="vn-screen" onClick={handleWrapClick}>
			{/* 背景层：视频优先用 SceneBackground，其余用 DynamicScene（镜头微动+色调+粒子） */}
			{bg.video ? (
				<SceneBackground bg={bg} bgKey={scene.background} />
			) : (
				<DynamicScene
					backgroundKey={scene.background}
					backgroundImage={bg.image}
					backgroundCss={bg.css}
					death={!!state.death}
					cleared={showClear}
					shakeKey={scene.background}
					disableParticles={!!bg.image}
				/>
			)}
			<SceneTransition transitionKey={transitionKey} duration={900} />
			{bg.label && <div className="vn-bg-label">{bg.label}</div>}

			<div className="vn-sprites">
				{stageCharacters.map(([id, c]) => (
					<CharacterSprite
						key={id}
						id={id}
						position={c.position}
						speaking={getSprite(id).name === activeSpeaker}
						expression={c.expression}
					/>
				))}
			</div>

			<div className="vn-topbar">
				<button className="vn-icon-btn" data-tip="返回故事选择" onClick={(e) => { e.stopPropagation(); navigate("/story"); }} aria-label="返回故事选择">
					<ArrowLeft size={18} />
				</button>
				<div className="title">
					{storyTitle}
					<small>{charName} 视角 · {isCanon ? "正史" : "自由"}</small>
				</div>
				<div style={{ flex: 1 }} />
				{showHintButton && hintText && (
					<button
						className={`vn-icon-btn${isClassicalHintOpen ? " active" : ""}`}
						data-tip="原文提示"
						onClick={(e) => { e.stopPropagation(); setClassicalHint(!isClassicalHintOpen); }}
						aria-label="原文提示"
					>
						<ScrollText size={18} />
					</button>
				)}
				<button
					className={`vn-icon-btn${autoPlay ? " active" : ""}`}
					data-tip={autoPlay ? "停止自动播放" : "自动播放"}
					onClick={(e) => { e.stopPropagation(); toggleAutoPlay(); }}
					aria-label="自动播放"
				>
					{autoPlay ? <Pause size={18} /> : <PlayIcon size={18} />}
				</button>
				<button className="vn-icon-btn" data-tip="文字速度" onClick={(e) => { e.stopPropagation(); cycleSpeed(); }} aria-label="文字速度">
					<Gauge size={18} />
					<span style={{ fontSize: 11, marginLeft: 2 }}>{SPEED_LABEL[textSpeed]}</span>
				</button>
				<button
					ref={sfxBtnRefCallback}
					className={`vn-icon-btn${sfxEnabled ? "" : " muted"}`}
					data-tip={sfxEnabled ? "关闭音效" : "开启音效"}
					data-no-sfx
					onClick={handleSfxBtnClick}
					aria-label="音效开关"
				>
					{sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
				</button>
				<button
					className={`vn-icon-btn${bgmEnabled ? "" : " muted"}`}
					data-tip={bgmEnabled ? "关闭音乐" : "开启音乐"}
					data-no-sfx
					onClick={(e) => {
						e.stopPropagation();
						const next = !bgmEnabled;
						setBgmEnabled(next);
						if (next) resumeBgm(); else pauseBgm();
					}}
					aria-label="音乐开关"
				>
					{bgmEnabled ? <Music2 size={18} /> : <Music size={18} />}
				</button>
				<button
					className={`vn-icon-btn${showLearnPanel ? " active" : ""}`}
					data-tip="学练测收"
					data-no-sfx
					onClick={(e) => { e.stopPropagation(); setShowLearnPanel((v) => !v); }}
					aria-label="学练测收"
				>
					<BookOpen size={18} />
				</button>
			</div>

			{visibleSegments.length > 0 && !state.death && (
			<div className="vn-dialogue-wrap">
				<DialogueBox
					key={turnSeq + "-" + visibleSegments.length}
					segments={visibleSegments}
					onComplete={() => { dialogueDoneRef.current = true; setDialogueDone(true); }}
					onActiveSpeaker={setActiveSpeaker}
					onOpenHint={() => setClassicalHint(true)}
					hideHint={isCanon && state.choices.length > 0}
				/>
				{canRevertChoice && (
					<button
						className="vn-revert-btn"
						data-tip="回到上一个选项，尝试不同选择"
						onClick={(e) => {
							e.stopPropagation();
							if (revertToChoice()) setDialogueDone(false);
						}}
						onMouseDown={(e) => e.stopPropagation()}
					>
						<Undo2 size={14} /> 返回重选
					</button>
				)}
			</div>
		)}

			{/* 青月问语：是否开启音效 */}
			{!sfxChosen && (
				<div
					className="sfx-intro-overlay"
					onClick={(e) => e.stopPropagation()}
					onMouseDown={(e) => e.stopPropagation()}
				>
					<div className="vn-choices sfx-intro-choices">
						<div className="prompt">— 青月问语 —</div>
						<button
							className="choice-btn"
							style={{ animationDelay: "0ms" }}
							onClick={(e) => { e.stopPropagation(); handleSfxChoice(false); }}
							onMouseDown={(e) => e.stopPropagation()}
						>
							默认关闭音效
						</button>
						<button
							className="choice-btn primary"
							style={{ animationDelay: "var(--stagger)" }}
							onClick={(e) => { e.stopPropagation(); handleSfxChoice(true); }}
							onMouseDown={(e) => e.stopPropagation()}
						>
							开启音效（沉浸感更强哦）
						</button>
					</div>
				</div>
			)}

			{showSystemChar && (
				<div className={`vn-system-char${systemSpeaking ? " speaking" : ""}`}>
					{systemCharacters.map(([id, c]) => (
						<CharacterSprite
							key={id}
							id={id}
							position="float"
							speaking={getSprite(id).name === activeSpeaker}
							expression={c.expression}
						/>
					))}
				</div>
			)}

			{showChoices && (
				<ChoicePanel
					choices={state.choices}
					onChoose={(i) => { makeChoice(i); setDialogueDone(false); }}
					onOpenHint={() => setClassicalHint(true)}
					onAskAi={askAi}
					hasHint={!!hintText}
					showHintButton={!isCanon}
				/>
			)}

			{state.death && !state.ended && (
				<DeathScreen
					reason={state.death.reason}
					classical={state.death.classical}
					analysis={state.death.analysis}
					collected={!!state.death.id && state.death.id !== "strict"}
					onRetry={() => { retry(); setDialogueDone(false); }}
					onReadSource={() => {
						markSourceRead(storyId);
						setClassicalHint(true);
					}}
				/>
			)}

			{showClear && (
				<ClearScreen
					storyId={storyId}
					storyTitle={storyTitle}
					deaths={persp.deathCount}
					choiceRate={persp.bestChoiceRate}
					isCanon={isCanon}
					isCanonEnding={state.ending ? state.ending.kind === "canon" : isCanon || !!state.endingAchievement}
					ending={state.ending}
					endingsUnlocked={(persp.unlockedEndings ?? []).length}
					endingsTotal={Object.keys(inkStories[storyKey]?.endings ?? {}).length}
					onRestart={() => {
						restart();
						setDialogueDone(false);
						setClearShown(false);
					}}
				/>
			)}

			{actClearVisible && (
				<ActClearCard
					actName={actClearVisible.actName}
					actIndex={actClearVisible.actIndex}
					deaths={persp.deathCount}
					correctRate={persp.bestChoiceRate}
					onClose={handleActClearClose}
				/>
			)}

			{impactVisible && (
				<ImpactCard
					choice={impactVisible.choice}
					source={impactVisible.source}
					impact={impactVisible.impact}
					onClose={handleImpactClose}
				/>
			)}

			{state.minigame && (
				<GameHost
					key={`${state.nodeId}:${state.minigame.id}:${state.minigame.param ?? ""}`}
					gameId={state.minigame.id}
					param={state.minigame.param}
					storyKey={storyKey}
					mode={isCanon ? "strict" : "free"}
					onComplete={(outcome) => {
						completeMinigame(outcome.result, outcome.score);
						setDialogueDone(false);
					}}
				/>
			)}

			<ClassicalHint
				open={isClassicalHintOpen}
				onClose={() => setClassicalHint(false)}
				text={hintText || "（此处暂无原文提示）"}
			/>
			<AiHintModal open={aiOpen} onClose={() => setAiOpen(false)} loading={aiLoading} hint={aiHint} />

			{/* 青月式新手指引：高亮音效开关 */}
			{showSfxGuide && (
				<div className="sfx-guide-overlay" onClick={closeSfxGuide}>
					<div
						className="sfx-guide-spotlight"
						style={{
							top: guideRect.top + guideRect.height / 2,
							left: guideRect.left + guideRect.width / 2,
						}}
					>
						<div className="sfx-guide-pulse" />
						<div className="sfx-guide-ring" />
					</div>
					{(() => {
						const cx = guideRect.left + guideRect.width / 2;
						const cy = guideRect.top + guideRect.height / 2;
						const bubbleW = Math.min(280, window.innerWidth * 0.72);
						const bubbleLeft = Math.max(24, cx - bubbleW + 32);
						const bubbleTop = cy + 96;
						const endX = bubbleLeft + bubbleW - 48;
						const endY = bubbleTop + 6;
						return (
							<>
								<svg className="sfx-guide-svg">
									<line x1={cx} y1={cy + 28} x2={endX} y2={endY} />
									<circle cx={endX} cy={endY} r={3} />
								</svg>
								<div
									className="sfx-guide-bubble"
									style={{ top: bubbleTop, left: bubbleLeft, width: bubbleW }}
								>
									<div className="sfx-guide-bubble-title">青月的小提示</div>
									<div className="sfx-guide-bubble-text">
										游戏中可自行打开或关闭音效，点击右上角这个开关即可。
									</div>
									<div className="sfx-guide-bubble-foot">点击任意处继续</div>
								</div>
							</>
						);
					})()}
				</div>
			)}

			{showLearnPanel && !state.death && !state.ended && !state.minigame && (
				<LearnPanel
					storyKey={storyKey}
					hints={visibleSegments
						.filter((s) => s.hint)
						.map((s) => ({ text: s.hint!, source: s.speaker || "原文" }))}
					knowledge={WUDI_KNOWLEDGE
						.filter((k) => k.storyKey === storyKey)
						.map((k) => ({
							id: k.id,
							title: k.title,
							content: k.content,
							unlocked: persp.unlockedKnowledge?.includes(k.id) ?? false,
						}))}
					unlockedCount={persp.unlockedKnowledge?.length ?? 0}
					totalCount={WUDI_KNOWLEDGE.filter((k) => k.storyKey === storyKey).length}
					onPlayBamboo={() => {
						// 触发竹简缀合练习（复用 minigame 机制）
						// 暂时用 GameHost 内部触发
					}}
					onPlayMinigame={(gameId: string) => {
						// 手动触发小游戏（从学练测收面板）
						// 通过 StoryAdapter 的手动小游戏触发方法
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						(adapter as any).triggerMinigame?.(gameId);
					}}
					onOpenKnowledgeGraph={() => {
						navigate(`/codex/knowledge/${encodeURIComponent(storyKey)}`);
					}}
				/>
			)}
		</div>
	);
}
