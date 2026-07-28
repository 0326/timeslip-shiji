import { useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, GitFork, Clock, BookText, Lock, Route } from "lucide-react";
import "./Panorama.css";
import { getStoryline } from "../../data/storylines";
import { getCharacter } from "../../data/characters";
import { getPanorama } from "../../data/panorama";
import { getStoryFlow } from "../../data/storyFlow";
import { useUserStore } from "../../store/userStore";
import { useAuthGate } from "../../hooks/useAuthGate";
import { storylineProgress } from "../../store/selectors";
import { Badge, Button } from "../../components/ui";
import { ERA_LABELS } from "../../types/character";
import { EventTimeline } from "./EventTimeline";
import { RelationGraph } from "./RelationGraph";
import { SourceLibrary } from "./SourceLibrary";
import { StoryFlow } from "./StoryFlow";

type Tab = "timeline" | "relation" | "source" | "flow";

export default function PanoramaPage() {
	const { storyId = "" } = useParams();
	const navigate = useNavigate();
	const progress = useUserStore((s) => s.progress);
	const requireAuth = useAuthGate();
	const [tab, setTab] = useState<Tab>("timeline");

	const story = getStoryline(storyId);
	const panorama = getPanorama(storyId);
	const focus = story ? getCharacter(story.focusCharacter) : undefined;
	const { done } = storylineProgress(progress, storyId);
	const flow = story?.perspectives[0] ? getStoryFlow(story.perspectives[0].storyKey) : undefined;

	// 无效故事线
	if (!story || !panorama || !focus) {
		return (
			<div className="panorama-page">
				<div className="empty-state" style={{ paddingTop: 120 }}>
					<div className="glyph">？</div>
					<h2 className="serif">此段全景尚未绘制</h2>
					<Button style={{ marginTop: 18 }} onClick={() => navigate("/")}>
						返回首页
					</Button>
				</div>
			</div>
		);
	}

	// 未通关任意视角 → 锁定（通关后解锁全景，作为游玩奖励）
	if (done === 0) {
		const firstPersp = story.perspectives[0];
		return (
			<div className="panorama-page">
				<button className="btn btn-ghost btn-sm btn-cut pano-back" onClick={() => navigate(-1)}>
					<ArrowLeft size={16} /> 返回
				</button>
				<div className="pano-locked">
					<div className="pano-lock-glyph" style={{ borderColor: story.cover }}>
						<Lock size={34} />
					</div>
					<h2 className="serif">史记全景 · 尚未解锁</h2>
					<p className="dim">
						通关《{story.title}》中任意一个视角后，时间轴、人物关系图谱与原文典籍将在此为你展开。
					</p>
					<div className="pano-lock-cta">
						{firstPersp && (
							<Button onClick={() => requireAuth(() => navigate(`/play/${story.id}/${firstPersp.characterId}`))}>
								立即穿越 · 解锁全景
							</Button>
						)}
						<Button variant="ghost" onClick={() => navigate("/")}>
							返回首页
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="panorama-page">
			<button className="btn btn-ghost btn-sm btn-cut pano-back" onClick={() => navigate(-1)}>
				<ArrowLeft size={16} /> 返回
			</button>

			<header className="pano-header">
				<div className="pano-glyph" style={{ "--accent": story.cover } as CSSProperties}>
					{story.glyph}
				</div>
				<div className="pano-head-meta">
					<div className="pano-eyebrow">史记全景</div>
					<h1 className="serif">{story.title}</h1>
					<div className="pano-sub">
						{story.subtitle} · {story.year}
					</div>
					<div className="pano-badges">
						<Badge tone="gold">{ERA_LABELS[story.era]}</Badge>
						<Badge tone="cyan">已通关 {done} 个视角</Badge>
						<Badge>{panorama.events.length} 个历史节点</Badge>
					</div>
				</div>
			</header>

			<nav className="pano-tabs">
				<button className={`pill${tab === "timeline" ? " active" : ""}`} onClick={() => setTab("timeline")}>
					<Clock size={14} /> 事件时间轴
				</button>
				<button className={`pill${tab === "relation" ? " active" : ""}`} onClick={() => setTab("relation")}>
					<GitFork size={14} /> 人物关系图谱
				</button>
				<button className={`pill${tab === "source" ? " active" : ""}`} onClick={() => setTab("source")}>
					<BookText size={14} /> 原文典籍库
				</button>
				{flow && (
					<button className={`pill${tab === "flow" ? " active" : ""}`} onClick={() => setTab("flow")}>
						<Route size={14} /> 故事路线图
					</button>
				)}
			</nav>

			<div className="pano-body">
				{tab === "timeline" && <EventTimeline events={panorama.events} />}
				{tab === "relation" && (
					<div className="pano-relation-wrap">
						<div className="pano-relation-intro">
							以 <span className="gold serif">{focus.name}</span> 为中心，看这段历史中人与人的恩怨亲疏。
						</div>
						<RelationGraph focus={focus} />
					</div>
				)}
				{tab === "source" && <SourceLibrary storyId={story.id} source={panorama.source} />}
				{tab === "flow" && flow && (
					<div className="pano-flow-wrap">
						<div className="pano-flow-intro">
							以 <span className="gold serif">{focus.name}</span> 为主角，看这段历史中每一个选择如何铺就不同的命运。
						</div>
						<StoryFlow nodes={flow} title={story.subtitle} />
					</div>
				)}
			</div>
		</div>
	);
}
