import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, GitFork, Clock, BookText, Lock } from "lucide-react";
import "./Panorama.css";
import { getStoryline } from "../../data/storylines";
import { getCharacter } from "../../data/characters";
import { getPanorama } from "../../data/panorama";
import { useUserStore } from "../../store/userStore";
import { storylineProgress } from "../../store/selectors";
import { Badge, Button } from "../../components/ui";
import { ERA_LABELS } from "../../types/character";
import { EventTimeline } from "./EventTimeline";
import { RelationGraph } from "./RelationGraph";
import { SourceLibrary } from "./SourceLibrary";

type Tab = "timeline" | "relation" | "source";

export default function PanoramaPage() {
	const { storyId = "" } = useParams();
	const navigate = useNavigate();
	const progress = useUserStore((s) => s.progress);
	const ownedIds = useMemo(
		() => new Set(progress.gacha.ownedCharacters),
		[progress.gacha.ownedCharacters],
	);
	const [tab, setTab] = useState<Tab>("timeline");

	const story = getStoryline(storyId);
	const panorama = getPanorama(storyId);
	const focus = story ? getCharacter(story.focusCharacter) : undefined;
	const { done } = storylineProgress(progress, storyId);

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

	// 未通关任意视角 → 锁定
	if (done === 0) {
		const firstPersp = story.perspectives[0];
		const owned = firstPersp ? ownedIds.has(firstPersp.characterId) : false;
		return (
			<div className="panorama-page">
				<button className="pano-back" onClick={() => navigate(-1)}>
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
						{owned ? (
							<Button onClick={() => navigate(`/play/${story.id}/${firstPersp.characterId}`)}>
								立即穿越 · 解锁全景
							</Button>
						) : (
							<Button variant="cyan" onClick={() => navigate("/gacha")}>
								前往抽卡 · 解锁角色
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
			<button className="pano-back" onClick={() => navigate(-1)}>
				<ArrowLeft size={16} /> 返回
			</button>

			<header className="pano-header">
				<div className="pano-glyph" style={{ background: `${story.cover}22`, borderColor: story.cover }}>
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
				<button className={`pano-tab${tab === "timeline" ? " active" : ""}`} onClick={() => setTab("timeline")}>
					<Clock size={16} /> 事件时间轴
				</button>
				<button className={`pano-tab${tab === "relation" ? " active" : ""}`} onClick={() => setTab("relation")}>
					<GitFork size={16} /> 人物关系图谱
				</button>
				<button className={`pano-tab${tab === "source" ? " active" : ""}`} onClick={() => setTab("source")}>
					<BookText size={16} /> 原文典籍库
				</button>
			</nav>

			<div className="pano-body">
				{tab === "timeline" && <EventTimeline events={panorama.events} />}
				{tab === "relation" && (
					<div className="pano-relation-wrap">
						<div className="pano-relation-intro">
							以 <span className="gold serif">{focus.name}</span> 为中心，看这段历史中人与人的恩怨亲疏。
						</div>
						<RelationGraph focus={focus} ownedIds={ownedIds} />
					</div>
				)}
				{tab === "source" && <SourceLibrary storyId={story.id} source={panorama.source} />}
			</div>
		</div>
	);
}
