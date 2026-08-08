import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skull, Lock, BookOpen, Compass, Map } from "lucide-react";
import "./DeathsCodex.css";
import "./EndingsCodex.css";
import "./Codex.css";
import { inkStories } from "../../data/stories/inkStories";
import { STORYLINES } from "../../data/storylines";
import { SERIES } from "../../data/series";
import { CHARACTERS } from "../../data/characters";
import { getSprite } from "../../data/sceneAssets";
import { useUserStore } from "../../store/userStore";
import type { Character } from "../../types/character";
import type { PerspectiveProgress } from "../../types/progress";
import type { DeathEntry } from "../../engine/shijiInkAdapter";

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
	huangdi: "emperor",
	zhuanxu: "emperor",
	yao: "emperor",
	shun: "emperor",
	yu: "emperor",
	qi: "emperor",
	jie: "emperor",
	tang: "emperor",
	wuding: "emperor",
	zhou: "emperor",
	wenwang: "emperor",
	wuwang: "emperor",
	xuanwang: "emperor",
	youwang: "emperor",
	qihuan: "emperor",
	qinmu: "emperor",
	chonger: "emperor",
	goujian: "emperor",
	fuchai: "emperor",
	qshihuang: "emperor",
	chensheng: "emperor",
	liubang: "emperor",
	xiangyu: "emperor",
	hanwen: "emperor",
	hanwudi: "emperor",
	yiyin: "minister",
	zhougong: "minister",
	jiangshang: "minister",
	sunwu: "minister",
	wuzixu: "minister",
	baiqi: "minister",
	mengtian: "minister",
	lisi: "minister",
	lvbuwei: "minister",
	shangyang: "minister",
	linxiangru: "minister",
	tiandan: "minister",
	yueyi: "minister",
	hanxin: "minister",
	pengyue: "minister",
	yingbu: "minister",
	zhoubo: "minister",
	zhouyafu: "minister",
	chaocuo: "minister",
	weiqing: "minister",
	huoqibing: "minister",
	liguang: "minister",
	zhangqian: "minister",
	kongzi: "scholar",
	mengzi: "scholar",
	xunzi: "scholar",
	zhuangzi: "scholar",
	mozhai: "scholar",
	zouyan: "scholar",
	quyuan: "scholar",
	hanfei: "scholar",
	zhangliang: "strategist",
	suqin: "strategist",
	zhangyi: "strategist",
	fanju: "strategist",
	zhufuyan: "strategist",
	jingke: "assassin",
	lvhou: "consort",
	sigongzi: "knight",
};

function identityAccent(charId: string): CSSProperties {
	const key = CHAR_IDENTITY[charId] ?? "minister";
	return { "--accent": `var(--identity-${key})` } as CSSProperties;
}

const NAME_FALLBACK: Record<string, string> = {
	hanwen: "汉文帝",
	sigongzi: "战国四公子",
};

function resolveCharName(charId: string, charMap: Record<string, Character>): string {
	const apiName = charMap[charId]?.name;
	if (apiName && apiName !== charId) return apiName;
	const spriteName = getSprite(charId).name;
	if (spriteName && spriteName !== charId) return spriteName;
	return NAME_FALLBACK[charId] ?? charId;
}

interface UnifiedEndingEntry {
	endingId: string;
	title: string;
	kind: "canon" | "if";
	epigraph?: string;
	index: number;
	unlocked: boolean;
}

interface UnifiedDeathEntry {
	deathId: string;
	reason: string;
	classical: string;
	analysis: string;
	unlocked: boolean;
}

interface UnifiedCharGroup {
	storyKey: string;
	charId: string;
	charName: string;
	storyTitle: string;
	endings: UnifiedEndingEntry[];
	deaths: UnifiedDeathEntry[];
}

interface UnifiedSeriesGroup {
	seriesId: string;
	seriesName: string;
	tagline: string;
	glyph: string;
	order: number;
	chars: UnifiedCharGroup[];
}

function buildUnifiedCodex(
	storylinesInput: Record<string, Record<string, PerspectiveProgress>> | undefined | null,
): UnifiedSeriesGroup[] {
	try {
		const storylines: Record<string, Record<string, PerspectiveProgress>> =
			storylinesInput && typeof storylinesInput === "object" ? storylinesInput : {};

		const charMap: Record<string, Character> = Object.fromEntries(
			CHARACTERS.map((c) => [c.id, c]),
		);

		const bySeries: Record<string, UnifiedSeriesGroup> = {};
		for (const s of SERIES) {
			bySeries[s.id] = {
				seriesId: s.id,
				seriesName: s.name,
				tagline: s.tagline,
				glyph: s.glyph,
				order: s.order,
				chars: [],
			};
		}

		/** ⭐ 关键修复：改用 STORYLINES 遍历，sl.series 才是正确的 seriesId（不再用 storyKey.split 瞎猜）*/
		for (const sl of STORYLINES) {
			if (!sl?.perspectives) continue;
			const series = bySeries[sl.series];
			if (!series) continue;

			for (const persp of sl.perspectives) {
				if (!persp?.storyKey || !persp?.characterId) continue;
				const cfg = inkStories[persp.storyKey];
				if (!cfg) continue;

				/** ⭐ 双 key 兼容查询 unlockedDeaths / unlockedEndings（storylineId / storyKey 两种都查）*/
				const progById = storylines?.[sl.id]?.[persp.characterId];
				const progByKey = storylines?.[persp.storyKey]?.[persp.characterId];
				const unlockedDeaths = new Set<string>();
				const unlockedEndings = new Set<string>();
				for (const prog of [progById, progByKey]) {
					if (prog?.unlockedDeaths && Array.isArray(prog.unlockedDeaths)) {
						for (const d of prog.unlockedDeaths) unlockedDeaths.add(String(d));
					}
					if (prog?.unlockedEndings && Array.isArray(prog.unlockedEndings)) {
						for (const e of prog.unlockedEndings) unlockedEndings.add(String(e));
					}
				}

				const deathsRaw = cfg.deaths ?? {};
				const deaths =
					deathsRaw && typeof deathsRaw === "object" ? deathsRaw : ({} as Record<string, DeathEntry>);
				const deathEntries: UnifiedDeathEntry[] = Object.entries(deaths)
					.filter(([_did, d]) => d && typeof d === "object")
					.map(([did, d]) => ({
						deathId: did,
						reason: d.reason ?? "死因不明",
						classical: d.classical ?? "",
						analysis: d.analysis ?? "",
						unlocked: unlockedDeaths.has(did),
					}));

				const endingsRaw = cfg.endings;
				let endingEntries: UnifiedEndingEntry[] = [];
				if (endingsRaw && typeof endingsRaw === "object") {
					const orderedIds = Object.keys(endingsRaw)
						.filter((eid) => endingsRaw[eid] && typeof endingsRaw[eid] === "object")
						.sort((a, b) => {
							const ka = endingsRaw[a].kind;
							const kb = endingsRaw[b].kind;
							if (ka === kb) return 0;
							return ka === "canon" ? -1 : 1;
						});
					endingEntries = orderedIds.map((eid, idx) => ({
						endingId: eid,
						title: endingsRaw[eid].title ?? eid,
						kind: endingsRaw[eid].kind === "if" ? "if" : "canon",
						epigraph: endingsRaw[eid].epigraph,
						index: idx + 1,
						unlocked: unlockedEndings.has(eid),
					}));
				}

				if (deathEntries.length === 0 && endingEntries.length === 0) continue;

				series.chars.push({
					storyKey: persp.storyKey,
					charId: persp.characterId,
					charName: resolveCharName(persp.characterId, charMap),
					storyTitle: cfg.title ?? persp.storyKey,
					endings: endingEntries,
					deaths: deathEntries,
				});
			}
		}

		return Object.values(bySeries)
			.filter((s) => s.chars.length > 0)
			.sort((a, b) => a.order - b.order);
	} catch (err) {
		console.error("[Codex] buildUnifiedCodex crashed:", err);
		return [];
	}
}

export function CodexPage() {
	const navigate = useNavigate();
	/** ⭐ 接收从 ClearScreen/其他入口传来的 storyKey 锚点，用于自动定位人物卡片 */
	const [searchParams] = useSearchParams();
	const anchorStoryKey = searchParams.get("storyKey") ?? undefined;

	const storylines = useUserStore(
		(s) => (s.progress && s.progress.storylines) || ({} as Record<string, Record<string, PerspectiveProgress>>),
	);
	const groups = useMemo(() => buildUnifiedCodex(storylines), [storylines]);
	const [activeSeries, setActiveSeries] = useState<string | null>(null);

	/** ⭐ URL带storyKey锚点时：自动激活对应系列 + 滚动到该人物卡片并高亮 */
	useEffect(() => {
		if (!anchorStoryKey) return;
		let matchedSeries: string | null = null;
		for (const g of groups) {
			if (g.chars.some((c) => c.storyKey === anchorStoryKey)) {
				matchedSeries = g.seriesId;
				break;
			}
		}
		if (matchedSeries) setActiveSeries(matchedSeries);
		// 等 DOM 渲染完成再滚动+高亮
		const raf = window.requestAnimationFrame(() => {
			const el = document.getElementById(`codex-char-${encodeURIComponent(anchorStoryKey)}`);
			if (!el) return;
			el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
			el.classList.add("codex-char--anchor");
			setTimeout(() => el.classList.remove("codex-char--anchor"), 3500);
		});
		return () => window.cancelAnimationFrame(raf);
	}, [anchorStoryKey, groups]);

	const totalEndingsUnlocked = groups.reduce(
		(n, g) => n + g.chars.reduce((m, c) => m + c.endings.filter((e) => e.unlocked).length, 0),
		0,
	);
	const totalEndingsAll = groups.reduce(
		(n, g) => n + g.chars.reduce((m, c) => m + c.endings.length, 0),
		0,
	);
	const totalDeathsUnlocked = groups.reduce(
		(n, g) => n + g.chars.reduce((m, c) => m + c.deaths.filter((e) => e.unlocked).length, 0),
		0,
	);
	const totalDeathsAll = groups.reduce(
		(n, g) => n + g.chars.reduce((m, c) => m + c.deaths.length, 0),
		0,
	);

	const jumpTo = (seriesId: string) => {
		setActiveSeries(seriesId);
		document
			.getElementById(`codex-series-${seriesId}`)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<div className="codex-page codex-page-unified">
			<div className="codex-tabs">
				<button className="codex-tab active">
					<BookOpen size={14} /> 结局图鉴
				</button>
				<button
					className="codex-tab"
					onClick={() => navigate(`/codex/knowledge/${encodeURIComponent("huangdi:banquan")}`)}
				>
					<Map size={14} /> 史识图谱
				</button>
			</div>

			<div className="codex-stats">
				<span className="panel-stat">
					<b>
						{totalEndingsUnlocked}/{totalEndingsAll}
					</b>
					<span>已照见结局</span>
				</span>
				<span className="panel-stat">
					<b>
						{totalDeathsUnlocked}/{totalDeathsAll}
					</b>
					<span>已收录死法</span>
				</span>
				<span className="panel-stat">
					<b>{groups.length}</b>
					<span>涉及系列</span>
				</span>
			</div>

			<div className="codex-layout">
				{groups.length > 0 && (
					<aside className="codex-sidebar">
						<div className="codex-sidebar-title">系列目录</div>
						<nav className="codex-sidebar-nav">
							{groups.map((s) => (
								<button
									key={s.seriesId}
									className={`codex-sidebar-link ${activeSeries === s.seriesId ? "active" : ""}`}
									onClick={() => jumpTo(s.seriesId)}
								>
									<span className="codex-sidebar-glyph seal">{s.glyph}</span>
									<span className="codex-sidebar-name">{s.seriesName}</span>
									<span className="codex-sidebar-count">
										{s.chars.reduce(
											(n, c) =>
												n +
												c.endings.filter((e) => e.unlocked).length +
												c.deaths.filter((d) => d.unlocked).length,
											0,
										)}/{s.chars.reduce(
											(n, c) => n + c.endings.length + c.deaths.length,
											0,
										)}
									</span>
								</button>
							))}
						</nav>
					</aside>
				)}

				<div className="codex-content">
					{groups.map((s) => (
						<section
							key={s.seriesId}
							id={`codex-series-${s.seriesId}`}
							className="codex-series"
						>
							<header className="codex-series-head">
								<div className="codex-series-glyph">{s.glyph}</div>
								<div className="codex-series-titles">
									<h3 className="serif">{s.seriesName}</h3>
									<p className="tagline">{s.tagline}</p>
								</div>
								<div className="codex-series-count">
									<Compass size={14} />
									{s.chars.reduce(
										(n, c) =>
											n +
											c.endings.filter((e) => e.unlocked).length +
											c.deaths.filter((d) => d.unlocked).length,
										0,
									)}/{s.chars.reduce(
										(n, c) => n + c.endings.length + c.deaths.length,
										0,
									)}
								</div>
							</header>

							<div className="codex-char-list">
								{s.chars.map((c) => {
									const charTotal = c.endings.length + c.deaths.length;
									const charUnlocked =
										c.endings.filter((e) => e.unlocked).length +
										c.deaths.filter((d) => d.unlocked).length;

									return (
										<article
											key={c.storyKey}
											/** ⭐ 锚点id：从ClearScreen跳转后定位+高亮闪烁 */
											id={`codex-char-${encodeURIComponent(c.storyKey)}`}
											className="codex-char"
										>
											<div className="codex-char-head">
												<div className="codex-char-name">
													<BookOpen size={14} /> {c.charName}
												</div>
												<div className="codex-char-meta">{c.storyTitle}</div>
												<div className="codex-char-count">
													<Compass size={12} />
													{charUnlocked}/{charTotal}
												</div>
											</div>

											{c.endings.length > 0 && (
												<div className="codex-section-block">
													<div className="codex-section-label">
														<Compass size={13} /> 结局
													</div>
													<div className="codex-ending-grid">
														{c.endings.map((e, i) =>
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
																		<p className="ending-entry-epigraph serif">
																			{e.epigraph}
																		</p>
																	)}
																</div>
															) : (
																<div
																	key={e.endingId}
																	className="game-card is-locked ending-entry locked"
																	style={{ animationDelay: `calc(var(--stagger) * ${Math.min(i, 8)})` }}
																>
																	<Lock size={18} />
																	<div className="ending-entry-lbl">第 {e.index} 结局 · 未照见</div>
																	<div className="ending-entry-sub">走过这条歧路才会照见</div>
																</div>
															),
														)}
													</div>
												</div>
											)}

											{c.deaths.length > 0 && (
												<div className="codex-section-block">
													<div className="codex-section-label">
														<Skull size={13} /> 死法
													</div>
													<div className="codex-death-grid">
														{c.deaths.map((e, i) =>
															e.unlocked ? (
																<div
																	key={e.deathId}
																	className="game-card death-entry unlocked"
																	style={{
																		...identityAccent(c.charId),
																		animationDelay: `calc(var(--stagger) * ${Math.min(i, 8)})`,
																	}}
																>
																	<div className="death-entry-reason">{e.reason}</div>
																	{e.classical && (
																		<div className="death-entry-classical">
																			「{e.classical}」
																		</div>
																	)}
																	<div className="death-entry-analysis">{e.analysis}</div>
																</div>
															) : (
																<div
																	key={e.deathId}
																	className="game-card is-locked death-entry locked"
																	style={{ animationDelay: `calc(var(--stagger) * ${Math.min(i, 8)})` }}
																>
																	<Lock size={18} />
																	<div className="death-entry-lbl">未解锁</div>
																	<div className="death-entry-sub">走过这条死路才会显现</div>
																</div>
															),
														)}
													</div>
												</div>
											)}
										</article>
									);
								})}
							</div>
						</section>
					))}
				</div>
			</div>

			{groups.length === 0 && (
				<div className="codex-empty">
					<BookOpen size={48} />
					<p>图鉴尚未开启——先去故事里历练一番吧</p>
				</div>
			)}
		</div>
	);
}