import { useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, GitFork, Clock, BookText, Lock, Route, Sparkles } from "lucide-react";
import "./Panorama.css";
import { getStoryline } from "../../data/storylines";
import { getCharacter } from "../../data/characters";
import { getPanorama } from "../../data/panorama";
import { getStoryFlow } from "../../data/storyFlow";
import { getButterflyEffects } from "../../data/butterfly";
import { inkStories } from "../../data/stories/inkStories";
import { useUserStore } from "../../store/userStore";
import { useAuthGate } from "../../hooks/useAuthGate";
import { storylineProgress } from "../../store/selectors";
import { Badge, Button } from "../../components/ui";
import { ERA_LABELS, type Character, type CharacterRelation, type Era, type RelationType } from "../../types/character";
import { EventTimeline } from "./EventTimeline";
import { RelationGraph } from "./RelationGraph";
import { SourceLibrary } from "./SourceLibrary";
import { StoryFlow } from "./StoryFlow";
import { ButterflyTimeline } from "./ButterflyTimeline";

type Tab = "timeline" | "relation" | "source" | "flow" | "butterfly";

const LOCAL_CHARACTER_NAMES: Record<string, string> = {
	huangdi: "黄帝", yao: "帝尧", shun: "帝舜", yu: "大禹",
	tang: "成汤", yiyin: "伊尹", wuding: "武丁", zhou: "商纣王",
	wenwang: "周文王", wuwang: "周武王", zhougong: "周公旦", jiangshang: "姜太公", youwang: "周幽王",
	qihuan: "齐桓公", guanzhong: "管仲", chonger: "晋文公", jiezitui: "介子推", chuzy: "楚庄王",
	goujian: "越王勾践", fuchai: "吴王夫差", wuzixu: "伍子胥", sunwu: "孙武子",
	shangyang: "商鞅", qinshihuang: "秦始皇", baiqi: "白起", suqin: "苏秦", zhangyi: "张仪",
	linxiangru: "蔺相如", lianpo: "廉颇", wangjian: "王翦", lvbuwei: "吕不韦", mengtian: "蒙恬", lisi: "李斯",
	jingke: "荆轲", niezheng: "聂政", zhuanzhu: "专诸", yurang: "豫让", gaojianli: "高渐离", guojie: "郭解",
	hanwen: "汉文帝", zhoubo: "周勃", zhouyafu: "周亚夫", lvhou: "吕后",
	hanxin: "韩信", xiangyu: "项羽", zhangliang: "张良", liubang: "刘邦",
	xiaohe: "萧何", fanzeng: "范增", fankuai: "樊哙", yuji: "虞姬",
};

function resolveName(id: string): string {
	return LOCAL_CHARACTER_NAMES[id] || id;
}

function buildFallbackCharacter(focusId: string, storyId: string): Character {
	const story = getStoryline(storyId);
	const perspectiveIds = story?.perspectives?.map((p) => p.characterId) || [];
	const perspectiveStoryKeys = story?.perspectives?.map((p) => p.storyKey) || [];
	const relatedIds = new Set<string>();
	if (focusId) relatedIds.add(focusId);
	perspectiveIds.forEach((id) => relatedIds.add(id));
	(story?.relatedCharacters || []).forEach((id) => relatedIds.add(id));

	const sideNames: Record<string, string> = {};
	for (const sk of perspectiveStoryKeys) {
		const cfg = inkStories[sk];
		if (cfg) {
			const p = (cfg as unknown as { protagonist?: { id?: string; name?: string } })?.protagonist;
			if (p?.id && p?.name) sideNames[p.id] = p.name;
			const sides = (cfg as unknown as { sideCharacters?: Array<{ id?: string; name?: string }> })?.sideCharacters || [];
			sides.forEach((sc) => {
				if (sc?.id && sc?.name) sideNames[sc.id] = sc.name;
			});
		}
	}

	const nameOf = (id: string): string => sideNames[id] || resolveName(id);

	const candidates = Array.from(relatedIds).filter((id) => id && id !== focusId);
	const maxRels: Array<{ targetId: string; type: RelationType; label: string }> = [];
	const used = new Set<string>();

	let counter = 0;
	const typesPool: Array<{ type: RelationType; prefix: string }> = [
		{ type: "peer", prefix: "同朝之人" },
		{ type: "friend", prefix: "故事同僚" },
		{ type: "sovereign", prefix: "君臣之交" },
		{ type: "enemy", prefix: "剧情对立" },
		{ type: "family", prefix: "同篇人物" },
	];
	for (const tid of candidates) {
		if (maxRels.length >= 8) break;
		if (used.has(tid)) continue;
		used.add(tid);
		const pool = typesPool[counter % typesPool.length];
		maxRels.push({
			targetId: tid,
			type: pool.type,
			label: `${pool.prefix}·${nameOf(tid)}`,
		});
		counter++;
	}

	if (maxRels.length < 3) {
		const filler = perspectiveIds.filter((id) => id !== focusId).slice(0, 3 - maxRels.length);
		for (const tid of filler) {
			if (used.has(tid)) continue;
			used.add(tid);
			maxRels.push({
				targetId: tid,
				type: "peer",
				label: `故事线同篇·${nameOf(tid)}`,
			});
		}
	}

	const accentColors = ["#8b6914", "#5a7a8f", "#7a5a8f", "#8f5a5a", "#5a8f7a", "#6b8f5a"];
	const era: Era = (story?.era as Era) || "mixed";

	return {
		id: focusId || "unknown",
		name: nameOf(focusId),
		title: `${nameOf(focusId)} · ${story?.title || ""}`,
		era,
		accent: accentColors[(focusId || "").length % accentColors.length],
		glyph: (nameOf(focusId) || "?").slice(0, 1),
		description: `以${nameOf(focusId)}为中心的本篇人物关系（兜底合成）`,
		classicalQuote: "—",
		historicalSource: "《史记全景·本篇》",
		relatedStorylines: storyId ? [storyId] : [],
		relations: maxRels as CharacterRelation[],
		avatarUrl: null,
		bioSummary: null,
	};
}

export default function PanoramaPage() {
	const { storyId = "" } = useParams();
	const navigate = useNavigate();
	const progress = useUserStore((s) => s.progress);
	const requireAuth = useAuthGate();
	const [tab, setTab] = useState<Tab>("timeline");

	const story = getStoryline(storyId);
	const panorama = getPanorama(storyId);
	let focus = story ? getCharacter(story.focusCharacter) : undefined;
	const { done } = storylineProgress(progress, storyId);
	const flow = story?.perspectives[0] ? getStoryFlow(story.perspectives[0].storyKey) : undefined;
	const butterfly = getButterflyEffects(storyId);

	const focusEmpty = !focus || !focus.relations || focus.relations.length === 0;
	const fallbackFocus = story && (focusEmpty)
		? buildFallbackCharacter(story?.focusCharacter ?? "", storyId)
		: undefined;
	const effectiveFocus = (focusEmpty ? fallbackFocus : focus) as Character | undefined;

	// 无效故事线
	if (!story || !panorama || !effectiveFocus) {
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
				{butterfly && butterfly.length > 0 && (
					<button className={`pill${tab === "butterfly" ? " active" : ""}`} onClick={() => setTab("butterfly")}>
						<Sparkles size={14} /> 蝴蝶效应
					</button>
				)}
			</nav>

			<div className="pano-body">
				{tab === "timeline" && <EventTimeline events={panorama.events} />}
				{tab === "relation" && (
					<div className="pano-relation-wrap">
						<div className="pano-relation-intro">
							以 <span className="gold serif">{effectiveFocus.name}</span> 为中心，看这段历史中人与人的恩怨亲疏。
							{fallbackFocus && (
								<span style={{ fontSize: 12, opacity: 0.6, marginLeft: 8 }}>（关系网由本篇剧情自动合成）</span>
							)}
						</div>
						<RelationGraph focus={effectiveFocus} />
					</div>
				)}
				{tab === "source" && <SourceLibrary storyId={story.id} source={panorama.source} />}
				{tab === "flow" && flow && (
					<div className="pano-flow-wrap">
						<div className="pano-flow-intro">
							以 <span className="gold serif">{effectiveFocus.name}</span> 为主角，看这段历史中每一个选择如何铺就不同的命运。
						</div>
						<StoryFlow nodes={flow} title={story.subtitle} />
					</div>
				)}
				{tab === "butterfly" && butterfly && (
					<div className="pano-butterfly-wrap">
						<ButterflyTimeline effects={butterfly} />
					</div>
				)}
			</div>
		</div>
	);
}
