import { useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, BookOpen, Map, ChevronDown, ChevronRight } from "lucide-react";
import "./DeathsCodex.css";
import "./EndingsCodex.css";
import { inkStories } from "../../data/stories/inkStories";
import { STORYLINES } from "../../data/storylines";
import { SERIES } from "../../data/series";
import { CHARACTERS } from "../../data/characters";
import { getSprite } from "../../data/sceneAssets";
import { useUserStore } from "../../store/userStore";
import type { Character } from "../../types/character";
import type { UserProgress } from "../../types/progress";

type IdentityKey =
	| "emperor"
	| "minister"
	| "scholar"
	| "strategist"
	| "assassin"
	| "consort"
	| "knight"
	| "foreign";

const CHAR_IDENTITY: Record<string, IdentityKey> = {
	huangdi: "emperor", zhuanxu: "emperor", ku: "emperor", yao: "emperor", shun: "emperor", yu: "emperor",
	tang: "emperor", zhou: "emperor", wuwang: "emperor", chengwang: "emperor",
	qinshihuang: "emperor", xiangyu: "emperor", liubang: "emperor", hanwudi: "emperor",
};

function identityAccent(charId: string): CSSProperties {
	const key = CHAR_IDENTITY[charId] ?? "emperor";
	return { "--accent": `var(--identity-${key})` } as CSSProperties;
}

const NAME_FALLBACK: Record<string, string> = {
	huangdi: "黄帝", yao: "帝尧", shun: "帝舜", yu: "大禹", qi: "夏启",
	tang: "成汤", zhou: "纣王", wuwang: "周武王", jiangshang: "姜太公",
	qinshihuang: "秦始皇", liubang: "刘邦", xiangyu: "项羽",
};

function resolveCharName(charId: string, charMap: Record<string, Character>): string {
	const apiName = charMap[charId]?.name;
	if (apiName && apiName !== charId) return apiName;
	const spriteName = getSprite(charId).name;
	if (spriteName && spriteName !== charId) return spriteName;
	return NAME_FALLBACK[charId] ?? charId;
}

interface ChapterEntry {
	endingId: string;
	title: string;
	kind: "canon" | "if";
	epigraph?: string;
	index: number;
	unlocked: boolean;
}

interface ChapterGroup {
	storylineId: string;
	storyKey: string;
	charId: string;
	charName: string;
	storyTitle: string;
	total: number;
	unlocked: number;
	entries: ChapterEntry[];
}

interface SeriesGroup {
	seriesId: string;
	seriesName: string;
	tagline: string;
	glyph: string;
	order: number;
	chapters: ChapterGroup[];
	total: number;
	unlocked: number;
	collapsed: boolean;
}

/** ⭐ 核心：遍历全部 STORYLINES（去掉 OPENED 白名单），以 storylineId + storyKey 双 key 查进度（兼容 localStorage 旧数据） */
function buildCodex(storylines: UserProgress["storylines"]): SeriesGroup[] {
	const charMap: Record<string, Character> = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]));
	const bySeries: Record<string, SeriesGroup> = {};

	for (const sl of STORYLINES) {
		const series = SERIES.find((s) => s.id === sl.series);
		if (!series) continue;

		for (const persp of sl.perspectives) {
			const cfg = inkStories[persp.storyKey];
			if (!cfg?.endings || Object.keys(cfg.endings).length === 0) continue;

			if (!bySeries[series.id]) {
				bySeries[series.id] = {
					seriesId: series.id,
					seriesName: series.name,
					tagline: series.tagline,
					glyph: series.glyph,
					order: series.order,
					chapters: [],
					total: 0,
					unlocked: 0,
					collapsed: false,
				};
			}

			/** ⭐ 关键：同时用 storylineId（sl.id）和 storyKey 取 unlockedEndings，兼容新旧 localStorage 数据 */
			const unlockedByStorylineId = storylines[sl.id]?.[persp.characterId]?.unlockedEndings ?? [];
			const unlockedByStoryKey = storylines[persp.storyKey]?.[persp.characterId]?.unlockedEndings ?? [];
			const unlockedSet = new Set([...unlockedByStorylineId, ...unlockedByStoryKey]);

			const orderedIds = Object.keys(cfg.endings).sort((a, b) => {
				const ka = cfg.endings![a].kind;
				const kb = cfg.endings![b].kind;
				if (ka === kb) return 0;
				return ka === "canon" ? -1 : 1;
			});

			const entries: ChapterEntry[] = orderedIds.map((eid, idx) => {
				const e = cfg.endings![eid];
				return {
					endingId: eid,
					title: e.title,
					kind: e.kind,
					epigraph: e.epigraph,
					index: idx + 1,
					unlocked: unlockedSet.has(eid),
				};
			});

			const total = entries.length;
			const unlocked = entries.filter((e) => e.unlocked).length;

			bySeries[series.id].chapters.push({
				storylineId: sl.id,
				storyKey: persp.storyKey,
				charId: persp.characterId,
				charName: resolveCharName(persp.characterId, charMap),
				storyTitle: cfg.title,
				total,
				unlocked,
				entries,
			});
			bySeries[series.id].total += total;
			bySeries[series.id].unlocked += unlocked;
		}
	}

	return Object.values(bySeries).sort((a, b) => a.order - b.order);
}

export function EndingsCodexPage() {
	const navigate = useNavigate();
	const storylines = useUserStore((s) => s.progress.storylines);
	const groupsRaw = useMemo(() => buildCodex(storylines), [storylines]);
	const [seriesCollapsed, setSeriesCollapsed] = useState<Record<string, boolean>>({});
	const totalUnlocked = groupsRaw.reduce((n, g) => n + g.unlocked, 0);
	const totalAll = groupsRaw.reduce((n, g) => n + g.total, 0);
	const totalChapters = groupsRaw.reduce((n, g) => n + g.chapters.length, 0);
	const totalChaptersSeen = groupsRaw.reduce(
		(n, g) => n + g.chapters.filter((c) => c.unlocked > 0).length,
		0,
	);
	const totalFullEndings = groupsRaw.reduce(
		(n, g) => n + g.chapters.filter((c) => c.total >= 2 && c.unlocked >= c.total).length,
		0,
	);

	const toggleSeries = (seriesId: string) => {
		setSeriesCollapsed((p) => ({ ...p, [seriesId]: !p[seriesId] }));
	};

	// 全部展开/折叠
	const allCollapsed = groupsRaw.length > 0 && groupsRaw.every((g) => seriesCollapsed[g.seriesId]);
	const toggleAll = () => {
		const target = !allCollapsed;
		const next: Record<string, boolean> = {};
		groupsRaw.forEach((g) => (next[g.seriesId] = target));
		setSeriesCollapsed(next);
	};

	return (
		<div className="codex-page endings-codex">
			<div className="codex-tabs">
				<button className="codex-tab active">
					<BookOpen size={14} /> 结局图鉴
				</button>
				<button className="codex-tab" onClick={() => navigate("/codex/knowledge")}>
					<Map size={14} /> 史识图谱
				</button>
			</div>

			<div className="codex-stats">
				<span className="panel-stat">
					<b>{totalUnlocked}/{totalAll}</b>
					<span>已照见结局</span>
				</span>
				<span className="panel-stat">
					<b>{totalChaptersSeen}/{totalChapters}</b>
					<span>涉及章节</span>
				</span>
				<span className="panel-stat">
					<b>{totalFullEndings}</b>
					<span>穷尽歧路</span>
				</span>
				{groupsRaw.length > 0 && (
					<button className="btn btn-ghost btn-sm" onClick={toggleAll}>
						{allCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
						{allCollapsed ? "全部展开" : "全部折叠"}
					</button>
				)}
			</div>

			<div className="codex-layout">
				{groupsRaw.length > 0 && (
					<aside className="codex-sidebar">
						<div className="codex-sidebar-title">系列目录 · {groupsRaw.length}</div>
						<nav className="codex-sidebar-nav">
							{groupsRaw.map((s) => (
								<button
									key={s.seriesId}
									className="codex-sidebar-link"
									onClick={() => toggleSeries(s.seriesId)}
								>
									{seriesCollapsed[s.seriesId] ? (
										<ChevronRight size={12} />
									) : (
										<ChevronDown size={12} />
									)}
									<span className="codex-sidebar-glyph seal">{s.glyph}</span>
									<span className="codex-sidebar-name">{s.seriesName}</span>
									<span className="codex-sidebar-count">
										{s.unlocked}/{s.total}
									</span>
								</button>
							))}
						</nav>
					</aside>
				)}

				<div className="codex-content">
					{groupsRaw.length === 0 ? (
						<div className="codex-empty">
							<Compass size={48} />
							<p>图鉴尚未开启——先去自由模式走一个结局</p>
						</div>
					) : (
						groupsRaw.map((s) => {
							const collapsed = !!seriesCollapsed[s.seriesId];
							return (
								<section
									key={s.seriesId}
									id={`codex-series-${s.seriesId}`}
									className="codex-series"
								>
									<header
										className="codex-series-head clickable"
										onClick={() => toggleSeries(s.seriesId)}
									>
										{collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
										<div className="codex-series-glyph">{s.glyph}</div>
										<div className="codex-series-titles">
											<h3 className="serif">{s.seriesName}</h3>
											<p className="tagline">{s.tagline} · {s.chapters.length} 个故事线</p>
										</div>
										<div className="codex-series-count">
											<Compass size={14} />
											{s.unlocked}/{s.total}
										</div>
									</header>

									{!collapsed && (
										<div className="codex-char-list">
											{s.chapters.map((c) => (
												<article key={c.storylineId} className="codex-char">
													<div className="codex-char-head">
														<div className="codex-char-name">
															<BookOpen size={14} /> {c.storyTitle}
														</div>
														<div className="codex-char-meta">
															以{c.charName}视角
														</div>
														<div className="codex-char-count codex-char-count-endings">
															<Compass size={12} />
															{c.unlocked}/{c.total}
														</div>
													</div>
													<div className="codex-ending-grid">
														{c.entries.map((e, i) =>
															e.unlocked ? (
																<div
																	key={e.endingId}
																	className="game-card ending-entry unlocked"
																	style={{
																		...identityAccent(c.charId),
																		animationDelay: `calc(var(--stagger) * ${Math.min(i, 8)})`,
																	}}
																>
																	<div className="ending-entry-head">
																		<span className={`ending-entry-kind ${e.kind}`}>
																			{e.kind === "canon" ? "史实终局" : "历史的歧路"}
																		</span>
																		<span className="ending-entry-idx">第 {e.index} 结局</span>
																	</div>
																	<div className="ending-entry-title serif">
																		『{e.title}』
																	</div>
																	{e.epigraph && (
																		<p className="ending-entry-epigraph serif">{e.epigraph}</p>
																	)}
																</div>
															) : (
																<div
																	key={e.endingId}
																	className="game-card is-locked ending-entry locked"
																	style={{
																		animationDelay: `calc(var(--stagger) * ${Math.min(i, 8)})`,
																	}}
																>
																	<Lock size={18} />
																	<div className="ending-entry-lbl">
																		第 {e.index} 结局 · 未照见
																	</div>
																	<div className="ending-entry-sub">
																		走过这条歧路才会照见
																	</div>
																</div>
															),
														)}
													</div>
												</article>
											))}
										</div>
									)}
								</section>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}
