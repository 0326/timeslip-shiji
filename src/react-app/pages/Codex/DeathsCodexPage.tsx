import { useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Skull, Lock, BookOpen, Compass, Map } from "lucide-react";
import "./DeathsCodex.css";
import "./EndingsCodex.css";
import { inkStories } from "../../data/stories/inkStories";
import { SERIES } from "../../data/series";
import { CHARACTERS } from "../../data/characters";
import { getSprite } from "../../data/sceneAssets";
import { useUserStore } from "../../store/userStore";
import type { PerspectiveProgress } from "../../types/progress";
import type { Character } from "../../types/character";
import type { DeathEntry } from "../../engine/shijiInkAdapter";

/** 人物 → 身份类别（帝王/将相/文人/谋士/刺客/后妃/游侠/异族），映射设计系统身份色 var(--identity-*) */
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
	// 帝王
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
	// 将相
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
	// 文人
	kongzi: "scholar",
	mengzi: "scholar",
	xunzi: "scholar",
	zhuangzi: "scholar",
	mozhai: "scholar",
	zouyan: "scholar",
	quyuan: "scholar",
	hanfei: "scholar",
	// 谋士
	zhangliang: "strategist",
	suqin: "strategist",
	zhangyi: "strategist",
	fanju: "strategist",
	zhufuyan: "strategist",
	// 刺客
	jingke: "assassin",
	// 后妃
	lvhou: "consort",
	// 游侠
	sigongzi: "knight",
};

function identityAccent(charId: string): CSSProperties {
	const key = CHAR_IDENTITY[charId] ?? "minister";
	return { "--accent": `var(--identity-${key})` } as CSSProperties;
}

/** 立绘表未覆盖（或 id 命名不一致）的中文名兜底 */
const NAME_FALLBACK: Record<string, string> = {
	hanwen: "汉文帝",
	sigongzi: "战国四公子",
};

/** 解析中文名：优先主项目名，其次立绘表中文名、兜底表，最后才回退 id */
function resolveCharName(charId: string, charMap: Record<string, Character>): string {
	const apiName = charMap[charId]?.name;
	if (apiName && apiName !== charId) return apiName;
	const spriteName = getSprite(charId).name;
	if (spriteName && spriteName !== charId) return spriteName;
	return NAME_FALLBACK[charId] ?? charId;
}

interface GroupedEntry {
	storyKey: string;
	charId: string;
	seriesId: string;
	charName: string;
	storyTitle: string;
	deathId: string;
	reason: string;
	classical: string;
	analysis: string;
	unlocked: boolean;
}

interface CharGroup {
	storyKey: string;
	charId: string;
	charName: string;
	storyTitle: string;
	total: number;
	unlocked: number;
	entries: GroupedEntry[];
}

interface SeriesGroup {
	seriesId: string;
	seriesName: string;
	tagline: string;
	glyph: string;
	order: number;
	chars: CharGroup[];
	total: number;
	unlocked: number;
}

function buildCodex(unlockedMap: Record<string, Record<string, PerspectiveProgress>>): SeriesGroup[] {
	const bySeries: Record<string, SeriesGroup> = {};
	for (const s of SERIES) {
		bySeries[s.id] = {
			seriesId: s.id,
			seriesName: s.name,
			tagline: s.tagline,
			glyph: s.glyph,
			order: s.order,
			chars: [],
			total: 0,
			unlocked: 0,
		};
	}
	const charMap: Record<string, Character> = Object.fromEntries(
		CHARACTERS.map((c) => [c.id, c]),
	);
	for (const [storyKey, cfg] of Object.entries(inkStories)) {
		const [charId, seriesId] = storyKey.split(":");
		const s = bySeries[seriesId];
		if (!s) continue;
		const unlockedDeaths = unlockedMap[seriesId]?.[charId]?.unlockedDeaths ?? [];
		const unlockedSet = new Set(unlockedDeaths);
		const deaths: Record<string, DeathEntry> = cfg.deaths ?? {};
		const ids = Object.keys(deaths);
		const entries: GroupedEntry[] = ids.map((did) => {
			const d = deaths[did];
			return {
				storyKey,
				charId,
				seriesId,
				charName: resolveCharName(charId, charMap),
				storyTitle: cfg.title,
				deathId: did,
				reason: d.reason,
				classical: d.classical,
				analysis: d.analysis,
				unlocked: unlockedSet.has(did),
			};
		});
		const total = entries.length;
		const unlocked = entries.filter((e) => e.unlocked).length;
		if (total === 0) continue;
		s.chars.push({
			storyKey,
			charId,
			charName: resolveCharName(charId, charMap),
			storyTitle: cfg.title,
			total,
			unlocked,
			entries,
		});
		s.total += total;
		s.unlocked += unlocked;
	}
	return Object.values(bySeries)
		.filter((s) => s.total > 0)
		.sort((a, b) => a.order - b.order);
}

export function DeathsCodexPage() {
	const navigate = useNavigate();
	const storylines = useUserStore((s) => s.progress.storylines);
	const groups = useMemo(() => buildCodex(storylines), [storylines]);
	const totalUnlocked = groups.reduce((n, g) => n + g.unlocked, 0);
	const totalAll = groups.reduce((n, g) => n + g.total, 0);
	const [activeSeries, setActiveSeries] = useState<string | null>(null);

	const jumpTo = (seriesId: string) => {
		setActiveSeries(seriesId);
		document
			.getElementById(`codex-series-${seriesId}`)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<div className="codex-page deaths-codex">
			{/* 顶部 tab 切换：死亡图鉴 / 结局图鉴 */}
			<div className="codex-tabs">
				<button className="codex-tab active">
					<Skull size={14} /> 死法图鉴
				</button>
				<button
				className="codex-tab"
				onClick={() => navigate("/codex/endings")}
			>
				<Compass size={14} /> 结局图鉴
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
						{totalUnlocked}/{totalAll}
					</b>
					<span>已收录死法</span>
				</span>
				<span className="panel-stat">
					<b>
						{groups.filter((g) => g.unlocked > 0).length}/{groups.length}
					</b>
					<span>涉及系列</span>
				</span>
				<span className="panel-stat">
					<b>{groups.reduce((n, g) => n + g.chars.filter((c) => c.unlocked > 0).length, 0)}</b>
					<span>涉及人物</span>
				</span>
			</div>

			<div className="codex-layout">
				{/* 左侧系列目录：快速切换导航 */}
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
										{s.unlocked}/{s.total}
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
							<Skull size={14} />
							{s.unlocked}/{s.total}
						</div>
					</header>

					<div className="codex-char-list">
						{s.chars.map((c) => (
							<article key={c.storyKey} className="codex-char">
								<div className="codex-char-head">
									<div className="codex-char-name">
										<BookOpen size={14} /> {c.charName}
									</div>
									<div className="codex-char-meta">{c.storyTitle}</div>
									<div className="codex-char-count">
										<Skull size={12} />
										{c.unlocked}/{c.total}
									</div>
								</div>
								<div className="codex-death-grid">
									{c.entries.map((e, i) =>
										e.unlocked ? (
											<div
												key={e.deathId}
												className="game-card death-entry unlocked"
												style={{
													...identityAccent(e.charId),
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
							</article>
						))}
					</div>
				</section>
			))}
				</div>
			</div>

			{groups.length === 0 && (
				<div className="codex-empty">
					<Skull size={48} />
					<p>图鉴尚未开启——先去故事里死一次吧</p>
				</div>
			)}
		</div>
	);
}
