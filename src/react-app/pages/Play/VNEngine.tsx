import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gauge, Play as PlayIcon, Pause, ScrollText } from "lucide-react";
import { useStory } from "../../hooks/useStory";
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

const SPEED_CYCLE: TextSpeed[] = ["slow", "normal", "fast"];
const SPEED_LABEL: Record<TextSpeed, string> = { slow: "慢", normal: "中", fast: "快" };

interface Props {
	storyId: string;
	charId: string;
	storyKey: string;
	storyTitle: string;
	charName: string;
}

export function VNEngine({ storyId, charId, storyKey, storyTitle, charName }: Props) {
	const navigate = useNavigate();
	const { state, scene, loading, notFound, makeChoice, retry, restart } = useStory(
		storyId,
		charId,
		storyKey,
	);
	const { textSpeed, setTextSpeed, autoPlay, toggleAutoPlay, isClassicalHintOpen, setClassicalHint } =
		usePlayStore();
	const markSourceRead = useUserStore((s) => s.markSourceRead);
	const getPerspective = useUserStore((s) => s.getPerspective);

	const [dialogueDone, setDialogueDone] = useState(false);
	const [activeSpeaker, setActiveSpeaker] = useState("");
	const [aiOpen, setAiOpen] = useState(false);
	const [aiLoading, setAiLoading] = useState(false);
	const [aiHint, setAiHint] = useState("");

	// 新状态到达即重置 dialogueDone：用「渲染期对比上一次 state 引用」模式，
	// 等价于 effect 内同步，但不触发级联渲染（React 官方推荐做法）。
	const [prevState, setPrevState] = useState(state);
	if (state !== prevState) {
		setPrevState(state);
		setDialogueDone(state ? state.segments.length === 0 : false);
	}

	if (loading) return <LoadingScreen label="正在展开竹简……" />;
	if (notFound || !state) {
		return (
			<div className="empty-state" style={{ paddingTop: 140 }}>
				<div className="glyph">卷</div>
				<h2 className="serif">未寻得此卷</h2>
				<button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => navigate("/")}>
					返回首页
				</button>
			</div>
		);
	}

	const bg = getBackground(scene.background);
	const hintText = state.death?.classical ?? state.hint ?? "";
	const showChoices = dialogueDone && !state.death && !state.ended && state.choices.length > 0;
	const showClear = dialogueDone && state.ended;
	const persp = getPerspective(storyId, charId);

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

	return (
		<div className="vn-screen">
			{/* 背景 */}
			<div key={scene.background} className="vn-bg" style={{ background: bg.css }} />
			{bg.label && <div className="vn-bg-label">{bg.label}</div>}

			{/* 立绘 */}
			<div className="vn-sprites">
				{Object.entries(scene.characters).map(([id, c]) => (
					<CharacterSprite
						key={id}
						id={id}
						position={c.position}
						speaking={getSprite(id).name === activeSpeaker}
					/>
				))}
			</div>

			{/* 顶部条 */}
			<div className="vn-topbar">
				<button className="vn-icon-btn" onClick={() => navigate("/")} aria-label="返回">
					<ArrowLeft size={18} />
				</button>
				<div className="title">
					{storyTitle}
					<small>{charName} 视角</small>
				</div>
				<div style={{ flex: 1 }} />
				{hintText && (
					<button
						className={`vn-icon-btn${isClassicalHintOpen ? " active" : ""}`}
						onClick={() => setClassicalHint(!isClassicalHintOpen)}
						aria-label="原文提示"
						title="原文提示"
					>
						<ScrollText size={18} />
					</button>
				)}
				<button
					className={`vn-icon-btn${autoPlay ? " active" : ""}`}
					onClick={toggleAutoPlay}
					aria-label="自动播放"
					title="自动播放"
				>
					{autoPlay ? <Pause size={18} /> : <PlayIcon size={18} />}
				</button>
				<button className="vn-icon-btn" onClick={cycleSpeed} title="文字速度" aria-label="文字速度">
					<Gauge size={18} />
					<span style={{ fontSize: 11, marginLeft: 2 }}>{SPEED_LABEL[textSpeed]}</span>
				</button>
			</div>

			{/* 对话框 */}
			{state.segments.length > 0 && !state.death && (
				<DialogueBox
					key={state.nodeId + "-" + state.segments.length}
					segments={state.segments}
					onComplete={() => setDialogueDone(true)}
					onActiveSpeaker={setActiveSpeaker}
					onOpenHint={() => setClassicalHint(true)}
				/>
			)}

			{/* 选择面板 */}
			{showChoices && (
				<ChoicePanel
					choices={state.choices}
					onChoose={makeChoice}
					onOpenHint={() => setClassicalHint(true)}
					onAskAi={askAi}
					hasHint={!!hintText}
				/>
			)}

			{/* 死亡 */}
			{state.death && (
				<DeathScreen
					reason={state.death.reason}
					classical={state.death.classical}
					analysis={state.death.analysis}
					onRetry={retry}
					onReadSource={() => {
						markSourceRead(storyId);
						setClassicalHint(true);
					}}
				/>
			)}

			{/* 通关 */}
			{showClear && (
				<ClearScreen
					storyId={storyId}
					storyTitle={storyTitle}
					deaths={persp.deathCount}
					choiceRate={persp.bestChoiceRate}
					onRestart={() => {
						restart();
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
