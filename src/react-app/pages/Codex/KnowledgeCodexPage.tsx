import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Map,  ChevronDown, ChevronRight } from "lucide-react";
import "./DeathsCodex.css";
import "./EndingsCodex.css";
import "./KnowledgeCodex.css";
import { getStoryFlow, type FlowNode } from "../../data/storyFlow";
import { inkStories } from "../../data/stories/inkStories";
import { SERIES } from "../../data/series";
import { STORYLINES } from "../../data/storylines";
import { CHARACTERS } from "../../data/characters";
import { getSprite } from "../../data/sceneAssets";
import { useUserStore } from "../../store/userStore";
import type { Character } from "../../types/character";
import { StoryFlow } from "../Panorama/StoryFlow";

function resolveCharName(charId: string, charMap: Record<string, Character>): string {
	const apiName = charMap[charId]?.name;
	if (apiName && apiName !== charId) return apiName;
	// 并非所有剧情角色都有立绘注册项；图谱仍应可用，并回退显示 ID。
	const spriteName = getSprite(charId)?.name;
	if (spriteName && spriteName !== charId) return spriteName;
	return charId;
}

interface StoryItem {
	storyKey: string;
	storyTitle: string;
	storylineId: string;
	charId: string;
	charName: string;
	totalNodes: number;
}

interface SeriesGroup {
	seriesId: string;
	seriesName: string;
	seriesGlyph: string;
	tagline: string;
	order: number;
	stories: StoryItem[];
}

function buildSeriesGroups(charMap: Record<string, Character>): SeriesGroup[] {
	const bySeries: Record<string, SeriesGroup> = {};

	for (const sl of STORYLINES) {
		const series = SERIES.find((s) => s.id === sl.series);
		if (!series) continue;

		for (const persp of sl.perspectives) {
			if (!persp?.storyKey || !persp?.characterId) continue;
			if (persp.storyKey.startsWith("extra:")) continue;
			const flow = getStoryFlow(persp.storyKey);
			if (!flow || flow.length === 0) continue;

			if (!bySeries[series.id]) {
				bySeries[series.id] = {
					seriesId: series.id,
					seriesName: series.name,
					seriesGlyph: series.glyph,
					tagline: series.tagline,
					order: series.order,
					stories: [],
				};
			}

			const cfg = inkStories[persp.storyKey];
			bySeries[series.id].stories.push({
				storyKey: persp.storyKey,
				storyTitle: cfg?.title ?? persp.storyKey,
				storylineId: sl.id,
				charId: persp.characterId,
				charName: resolveCharName(persp.characterId, charMap),
				totalNodes: flow.length,
			});
		}
	}

	return Object.values(bySeries).sort((a, b) => a.order - b.order);
}

function mergedUnlockedKnowledge(
	storylines: Record<string, any>,
	storylineId: string,
	storyKey: string,
	charId: string,
): Set<string> {
	const byId = storylines?.[storylineId]?.[charId]?.unlockedKnowledge ?? [];
	const byKey = storylines?.[storyKey]?.[charId]?.unlockedKnowledge ?? [];
	return new Set([...byId, ...byKey]);
}

export function KnowledgeCodexPage() {
	const navigate = useNavigate();
	const { storyKey: rawStoryKey } = useParams<{ storyKey: string }>();
	const initialStoryKey = rawStoryKey ? decodeURIComponent(rawStoryKey) : undefined;
	const storylines = useUserStore((s) => s.progress?.storylines ?? {});

	const charMap = useMemo(() => Object.fromEntries(CHARACTERS.map((c) => [c.id, c])), []);
	const seriesGroups = useMemo(() => buildSeriesGroups(charMap), [charMap]);

	const allStoryKeys = useMemo(
		() => seriesGroups.flatMap((g) => g.stories.map((s) => s.storyKey)),
		[seriesGroups],
	);
	const [activeStoryKey, setActiveStoryKey] = useState<string | null>(
		initialStoryKey ?? (allStoryKeys.length > 0 ? allStoryKeys[0] : null),
	);

	useEffect(() => {
		if (initialStoryKey && initialStoryKey !== activeStoryKey) {
			setActiveStoryKey(initialStoryKey);
		}
	}, [initialStoryKey, activeStoryKey]);

	const [seriesCollapsed, setSeriesCollapsed] = useState<Record<string, boolean>>({});
	const toggleSeries = (seriesId: string) => {
		setSeriesCollapsed((p) => ({ ...p, [seriesId]: !p[seriesId] }));
	};

	const activeStory = useMemo(() => {
		for (const g of seriesGroups) {
			const found = g.stories.find((s) => s.storyKey === activeStoryKey);
			if (found) return found;
		}
		return null;
	}, [activeStoryKey, seriesGroups]);

	const flow = useMemo(
		() => (activeStoryKey ? getStoryFlow(activeStoryKey) : undefined),
		[activeStoryKey],
	);

	const stats = useMemo(() => {
		if (!activeStory || !flow) return { unlocked: 0, total: 0, seen: 0 };
		const unlocked = mergedUnlockedKnowledge(
			storylines,
			activeStory.storylineId,
			activeStory.storyKey,
			activeStory.charId,
		);
		const total = flow.length;
		const seenById = storylines?.[activeStory.storylineId]?.[activeStory.charId]?.knowledgeGraphSeen ?? [];
		const seenByKey = storylines?.[activeStory.storyKey]?.[activeStory.charId]?.knowledgeGraphSeen ?? [];
		const seen = new Set([...seenById, ...seenByKey]).size;
		return { unlocked: unlocked.size, total, seen };
	}, [activeStory, flow, storylines]);

	const overviewStats = useMemo(() => {
		let totalAll = 0;
		let totalUnlocked = 0;
		for (const g of seriesGroups) {
			for (const s of g.stories) {
				const f = getStoryFlow(s.storyKey) ?? [];
				totalAll += f.length;
				const unlocked = mergedUnlockedKnowledge(storylines, s.storylineId, s.storyKey, s.charId);
				totalUnlocked += unlocked.size;
			}
		}
		return { totalAll, totalUnlocked, chapters: allStoryKeys.length };
	}, [seriesGroups, storylines, allStoryKeys]);

	const allCollapsed =
		seriesGroups.length > 0 && seriesGroups.every((g) => seriesCollapsed[g.seriesId]);
	const toggleAll = () => {
		const target = !allCollapsed;
		const next: Record<string, boolean> = {};
		seriesGroups.forEach((g) => (next[g.seriesId] = target));
		setSeriesCollapsed(next);
	};

	return (
		<div className="panorama-page codex-page knowledge-codex">
			<div className="codex-tabs">
				<button className="codex-tab" onClick={() => navigate("/codex")}>
					<BookOpen size={14} /> 结局图鉴
				</button>

				<button className="codex-tab active">
					<Map size={14} /> 史识图谱
				</button>
			</div>

			<div className="codex-stats">
				<span className="panel-stat">
					<b>
						{stats.unlocked}/{stats.total}
					</b>
					<span>本章已照见节点</span>
				</span>
				<span className="panel-stat">
					<b>
						{overviewStats.totalUnlocked}/{overviewStats.totalAll}
					</b>
					<span>全书已收录碎片</span>
				</span>
				<span className="panel-stat">
					<b>{overviewStats.chapters}</b>
					<span>已录入章节</span>
				</span>
				{seriesGroups.length > 0 && (
					<button className="btn btn-ghost btn-sm" onClick={toggleAll}>
						{allCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
						{allCollapsed ? "全部展开" : "全部折叠"}
					</button>
				)}
			</div>

			<div className="codex-layout">
				{seriesGroups.length > 0 && (
					<aside className="codex-sidebar">
						<div className="codex-sidebar-title">系列目录 · {seriesGroups.length}</div>
						<nav className="codex-sidebar-nav">
							{seriesGroups.map((g) => {
								const collapsed = !!seriesCollapsed[g.seriesId];
								return (
									<div key={g.seriesId} className="codex-sidebar-group">
										<button
											className="codex-sidebar-link"
											onClick={() => toggleSeries(g.seriesId)}
										>
											{collapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
											<span className="codex-sidebar-glyph seal">{g.seriesGlyph}</span>
											<span className="codex-sidebar-name">{g.seriesName}</span>
											<span className="codex-sidebar-count">{g.stories.length}</span>
										</button>
										{!collapsed && (
											<div className="codex-sidebar-sublinks">
												{g.stories.map((s) => (
													<button
														key={s.storyKey}
														className={`codex-sidebar-sublink ${
															activeStoryKey === s.storyKey ? "active" : ""
														}`}
														onClick={() => {
															setActiveStoryKey(s.storyKey);
															navigate(
																`/codex/knowledge/${encodeURIComponent(s.storyKey)}`,
															);
														}}
													>
														<ChevronRight size={10} />
														<span className="codex-sidebar-subtitle">
															{s.storyTitle}
														</span>
														<span className="codex-sidebar-subcount">
															{s.totalNodes}
														</span>
													</button>
												))}
											</div>
										)}
									</div>
								);
							})}
						</nav>
					</aside>
				)}

				<div className="codex-content">
					{!activeStory || !flow ? (
						<div className="knowledge-empty">
							<BookOpen size={48} />
							<p>此故事尚无史识图谱数据</p>
							<span>请从左侧选择一条故事线</span>
						</div>
					) : (
						<>
							<header className="knowledge-head">
								<div className="knowledge-head-glyph">
									{activeStory.charName[0] ?? "识"}
								</div>
								<div>
									<h2 className="serif">{activeStory.storyTitle} · 史识图谱</h2>
									<p className="tagline">
										以 {activeStory.charName} 视角 ·
										走过的每一个选择、每一次结局都会点亮图中节点；未走过的歧路以暗色显示，留待你亲自照见
									</p>
								</div>
							</header>

							<div className="knowledge-graph-wrap" style={{ height: "calc(100vh - 320px)", minHeight: 560 }}>
								<StoryFlow nodes={flow} title={`${activeStory.storyTitle} · 思维导图`} />
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
