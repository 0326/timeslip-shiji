import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Gauge,
	Play as PlayIcon,
	Pause,
	ScrollText,
	Volume2,
	VolumeX,
} from "lucide-react";
import { useUiStore } from "../../store/uiStore";
import { useStory } from "../../hooks/useStory";
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
import { GameHost } from "../../minigames/GameHost";
import "../../minigames/minigames.css";

const SPEED_CYCLE: TextSpeed[] = ["slow", "normal", "fast"];
const SPEED_LABEL: Record<TextSpeed, string> = { slow: "慢", normal: "中", fast: "快" };

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
	const isCanon = mode !== "free";
	const { state, scene, loading, notFound, makeChoice, advance, retry, restart, completeMinigame } = useStory(
		storyId,
		charId,
		storyKey,
		isCanon,
	);
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

	// 新状态到达即重置 dialogueDone + 检测幕间
	const [prevNodeId, setPrevNodeId] = useState<string | null>(null);
	useEffect(() => {
		if (!state) return;
		if (state.nodeId === prevNodeId) return;
		setPrevNodeId(state.nodeId);
		setDialogueDone(state.segments.length === 0);
		if (state.actClear) {
			setActClearVisible(state.actClear);
			setDialogueDone(false);
		}
	}, [state, prevNodeId]);

	// A2+A3: 结局触发：结局收集 + 照见者成就 + 补登 canon
	useEffect(() => {
		if (!state?.ended || clearShown) return;
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
	}, [state?.ended, state?.ending, state?.endingAchievement, clearShown, storyId, charId, storyKey, isCanon, getPerspective, unlockAchievement, unlockEnding, completePerspective]);

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
	const atChoicePoint = dialogueDone && !state.death && !state.ended && state.choices.length > 0;
	const showHintButton = !state.death && !state.ended && (!isCanon || !atChoicePoint);
	const hintText = state.death?.classical ?? state.hint ?? "";
	const showChoices = atChoicePoint;
	const showClear = state.ended && clearShown;
	const persp = getPerspective(storyId, charId);
	const visibleSegments = state.segments.filter((s) => s.text.length > 0);

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
		if (aiOpen || isClassicalHintOpen || actClearVisible || state!.minigame) return;
		if (state!.ended || state!.death) return;
		if (state!.choices.length > 0 && dialogueDone) return;
		if (!dialogueDone) return;
		advance();
		setDialogueDone(false);
	}

	function handleActClearClose() {
		setActClearVisible(null);
		advance();
		setDialogueDone(false);
	}

	return (
		<div className="vn-screen" onClick={handleWrapClick}>
			{bg.image ? (
				<div key={scene.background} className="vn-bg vn-bg-image">
					<img src={bg.image} alt={bg.label || ""} />
				</div>
			) : (
				<div key={scene.background} className="vn-bg" style={{ background: bg.css }} />
			)}
			{bg.label && <div className="vn-bg-label">{bg.label}</div>}

			<div className="vn-sprites">
				{Object.entries(scene.characters).map(([id, c]) => (
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
				<button className="vn-icon-btn" onClick={(e) => { e.stopPropagation(); navigate("/story"); }} aria-label="返回">
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
						onClick={(e) => { e.stopPropagation(); setClassicalHint(!isClassicalHintOpen); }}
						aria-label="原文提示"
						title="原文提示"
					>
						<ScrollText size={18} />
					</button>
				)}
				<button
					className={`vn-icon-btn${autoPlay ? " active" : ""}`}
					onClick={(e) => { e.stopPropagation(); toggleAutoPlay(); }}
					aria-label="自动播放"
					title="自动播放"
				>
					{autoPlay ? <Pause size={18} /> : <PlayIcon size={18} />}
				</button>
				<button className="vn-icon-btn" onClick={(e) => { e.stopPropagation(); cycleSpeed(); }} title="文字速度" aria-label="文字速度">
					<Gauge size={18} />
					<span style={{ fontSize: 11, marginLeft: 2 }}>{SPEED_LABEL[textSpeed]}</span>
				</button>
				<button
					className="vn-icon-btn"
					data-no-sfx
					onClick={(e) => { e.stopPropagation(); toggleSfx(); }}
					title={sfxEnabled ? "关闭音效" : "开启音效"}
					aria-label="音效开关"
				>
					{sfxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
				</button>
			</div>

			{visibleSegments.length > 0 && !state.death && !state.ended && (
				<DialogueBox
					key={state.nodeId + "-" + visibleSegments.length}
					segments={visibleSegments}
					onComplete={() => setDialogueDone(true)}
					onActiveSpeaker={setActiveSpeaker}
					onOpenHint={() => setClassicalHint(true)}
					hideHint={isCanon && state.choices.length > 0}
				/>
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

			{state.minigame && (
				<GameHost
					key={`${state.minigame.id}:${state.minigame.param ?? ""}`}
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
		</div>
	);
}
