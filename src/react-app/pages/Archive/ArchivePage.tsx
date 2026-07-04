import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import "./Archive.css";
import { CHARACTERS } from "../../data/characters";
import {
	fetchFigureList,
	type FigureListResponse,
	type MainFigure,
} from "../../services/mainProjectApi";
import { useUserStore } from "../../store/userStore";
import { Button } from "../../components/ui";

const SHIJI = "shiji";
const PAGE_SIZE = 24;
const FILTER_TOP_N = 12; // 侧边栏只展示 top N 个朝代/身份

/**
 * 图鉴页：展示主项目全量史记人物，激活的高亮、未激活置灰。
 * 列表设计对齐主项目 FigureListPage（侧边栏筛选 + 搜索 + 卡片网格 + 分页加载）。
 */
export function ArchivePage() {
	const navigate = useNavigate();
	const owned = useUserStore((s) => s.progress.gacha.ownedCharacters);
	const ownedSet = useMemo(() => new Set(owned), [owned]);

	// 列表数据
	const [data, setData] = useState<FigureListResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 筛选 / 搜索 / 排序
	const [dynasty, setDynasty] = useState<string>("");
	const [identity, setIdentity] = useState<string>("");
	const [q, setQ] = useState("");
	const [sort, setSort] = useState<"era" | "star">("era");

	// 已加载页 & 全部 ID（用于详情页前后切换）
	const [page, setPage] = useState(1);
	const allItemsRef = useRef<MainFigure[]>([]);

	// 拉取首页（筛选/搜索/排序变化时触发）
	useEffect(() => {
		setLoading(true);
		setError(null);
		setPage(1);
		allItemsRef.current = [];
		fetchFigureList({
			book: SHIJI,
			page: 1,
			limit: PAGE_SIZE,
			dynasty: dynasty || undefined,
			identity: identity || undefined,
			q: q || undefined,
			sort,
		})
			.then((res) => {
				if (!res) {
					setError("主项目不可用，稍后重试");
					setData(null);
					return;
				}
				setData(res);
				allItemsRef.current = [...res.items];
			})
			.catch(() => setError("加载失败"))
			.finally(() => setLoading(false));
	}, [dynasty, identity, q, sort]);

	// 加载更多
	const loadMore = useCallback(() => {
		if (!data || loadingMore) return;
		if (allItemsRef.current.length >= data.total) return;
		setLoadingMore(true);
		const nextPage = page + 1;
		fetchFigureList({
			book: SHIJI,
			page: nextPage,
			limit: PAGE_SIZE,
			dynasty: dynasty || undefined,
			identity: identity || undefined,
			q: q || undefined,
			sort,
		})
			.then((res) => {
				if (!res) return;
				allItemsRef.current = [...allItemsRef.current, ...res.items];
				setData({ ...res, items: allItemsRef.current });
				setPage(nextPage);
			})
			.finally(() => setLoadingMore(false));
	}, [data, loadingMore, page, dynasty, identity, q, sort]);

	// 搜索 debounce
	const [qInput, setQInput] = useState(q);
	useEffect(() => {
		const t = setTimeout(() => setQ(qInput.trim()), 350);
		return () => clearTimeout(t);
	}, [qInput]);

	// 侧边栏筛选候选（来自接口 filters）
	const dynastyOptions = useMemo(() => {
		const list = data?.filters?.dynasties ?? [];
		return list.slice(0, FILTER_TOP_N);
	}, [data]);
	const identityOptions = useMemo(() => {
		const list = data?.filters?.identities ?? [];
		return list.slice(0, FILTER_TOP_N);
	}, [data]);

	const totalShiji = data?.total ?? 0;
	const ownedCount = useMemo(() => {
		// 已激活数：用 ownedSet 与当前列表交集（更准确：与全量史记人物交集）
		if (!data) return ownedSet.size;
		return data.items.filter((it) => ownedSet.has(it.id)).length;
	}, [data, ownedSet]);

	const items = data?.items ?? [];

	return (
		<div className="archive-page">
			<div className="archive-head">
				<div className="section-head">
					<h2 className="serif">角色图鉴</h2>
					<div className="sub">史记群英 · 激活者显其名，未遇者留其影</div>
				</div>
				<div className="archive-head-actions">
					<Button size="sm" onClick={() => navigate("/gacha")}>
						<Sparkles size={14} /> 抽卡
					</Button>
				</div>
			</div>

			<div className="archive-stats">
				<div className="stat-chip">
					<div className="v">
						{ownedCount}/{totalShiji || CHARACTERS.length}
					</div>
					<div className="l">已收录 / 史记总数</div>
				</div>
				<div className="stat-chip">
					<div className="v">
						{totalShiji
							? Math.round((ownedCount / totalShiji) * 100)
							: 0}
						%
					</div>
					<div className="l">图鉴完成度</div>
				</div>
				<div className="stat-chip">
					<div className="v">{ownedSet.size}</div>
					<div className="l">本地已激活</div>
				</div>
			</div>

			<div className="archive-body">
				{/* 侧边栏筛选 */}
				<aside className="archive-sidebar">
					<div className="archive-filter-group">
						<div className="archive-filter-title">朝代</div>
						<div className="archive-filter-tags">
							<button
								className={`archive-filter-tag ${dynasty === "" ? "active" : ""}`}
								onClick={() => setDynasty("")}
							>
								全部
							</button>
							{dynastyOptions.map((d) => (
								<button
									key={d.value}
									className={`archive-filter-tag ${dynasty === d.value ? "active" : ""}`}
									onClick={() => setDynasty(d.value)}
									title={d.value}
								>
									<span>{d.value}</span>
									<span className="cnt">{d.count}</span>
								</button>
							))}
						</div>
						{dynasty && (
							<button
								className="archive-filter-clear"
								onClick={() => setDynasty("")}
							>
								清除筛选
							</button>
						)}
					</div>

					<div className="archive-filter-group">
						<div className="archive-filter-title">身份</div>
						<div className="archive-filter-tags">
							<button
								className={`archive-filter-tag ${identity === "" ? "active" : ""}`}
								onClick={() => setIdentity("")}
							>
								全部
							</button>
							{identityOptions.map((it) => (
								<button
									key={it.value}
									className={`archive-filter-tag ${identity === it.value ? "active" : ""}`}
									onClick={() => setIdentity(it.value)}
								>
									<span>{it.value}</span>
									<span className="cnt">{it.count}</span>
								</button>
							))}
						</div>
						{identity && (
							<button
								className="archive-filter-clear"
								onClick={() => setIdentity("")}
							>
								清除筛选
							</button>
						)}
					</div>
				</aside>

				{/* 主区：搜索 + 网格 */}
				<main className="archive-main">
					<div className="archive-search-row">
						<div className="archive-search">
							<Search className="archive-search-icon" size={15} />
							<input
								type="text"
								placeholder="搜索姓名 / 字号 / 简介"
								value={qInput}
								onChange={(e) => setQInput(e.target.value)}
							/>
						</div>
						<div className="archive-sort-toggle">
							<button
								className={`archive-sort-btn ${sort === "era" ? "active" : ""}`}
								onClick={() => setSort("era")}
							>
								时序
							</button>
							<button
								className={`archive-sort-btn ${sort === "star" ? "active" : ""}`}
								onClick={() => setSort("star")}
							>
								星级
							</button>
						</div>
					</div>

					{loading ? (
						<div className="archive-loading">正在翻阅史册…</div>
					) : error ? (
						<div className="archive-empty">
							{error}
							<div className="archive-empty-sub">主项目暂不可用，仅展示本地角色</div>
						</div>
					) : items.length === 0 ? (
						<div className="archive-empty">
							无符合条件的人物
							<div className="archive-empty-sub">尝试更换筛选或搜索词</div>
						</div>
					) : (
						<div className="archive-grid">
							{items.map((fig) => {
								const has = ownedSet.has(fig.id);
								return (
									<ArchiveCard
									key={fig.id}
									figure={fig}
									owned={has}
									onClick={() =>
										navigate(`/archive/${fig.id}`, {
											state: { ids: items.map((i) => i.id) },
										})
									}
								/>
								);
							})}
						</div>
					)}

					{/* 加载更多 */}
					{!loading && data && allItemsRef.current.length < data.total && (
						<div
							className="archive-load-sentinel"
							ref={(el) => {
								if (!el) return;
								const io = new IntersectionObserver(
									(entries) => {
										if (entries[0]?.isIntersecting) loadMore();
									},
									{ rootMargin: "200px" },
								);
								io.observe(el);
							}}
						>
							{loadingMore && <span className="archive-load-spinner" />}
							{!loadingMore && (
								<span style={{ fontSize: 12, color: "var(--color-muted)" }}>
									下拉加载更多
								</span>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

/** 图鉴卡片：对齐主项目 .fg-card 视觉，未激活置灰 */
function ArchiveCard({
	figure,
	owned,
	onClick,
}: {
	figure: MainFigure;
	owned: boolean;
	onClick: () => void;
}) {
	// 主项目 avatar 字段优先（已是 /api/asset 形式），其次 avatar_url
	const avatarSrc = figure.avatar || figure.avatar_url || null;
	const glyph = figure.name?.charAt(0) || figure.id.charAt(0).toUpperCase();

	return (
		<article
			className={`archive-card ${owned ? "is-owned" : "is-locked"}`}
			data-identity={figure.identity || undefined}
			onClick={onClick}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && onClick()}
		>
			<div className="archive-card-art">
				{!avatarSrc && <span className="archive-card-glyph">{glyph}</span>}
				{avatarSrc && (
					<img
						src={avatarSrc}
						alt={figure.name}
						loading="lazy"
						onError={(e) => {
							// 头像加载失败，露出 glyph
							(e.currentTarget as HTMLImageElement).style.display = "none";
							const sib = (e.currentTarget as HTMLImageElement).previousElementSibling;
							if (sib) (sib as HTMLElement).style.display = "flex";
						}}
					/>
				)}
				{figure.star >= 1 && (
					<span
						className="archive-card-star"
						data-star={figure.star}
						title={`${figure.star} 星`}
					>
						{"★".repeat(figure.star)}
					</span>
				)}
				{figure.dynasty && (
					<span className="archive-card-badge">{figure.dynasty}</span>
				)}
				{figure.gender === "female" && (
					<span className="archive-card-gender" title="女">♀</span>
				)}
				{figure.gender === "male" && (
					<span className="archive-card-gender male" title="男">♂</span>
				)}
			</div>
			<div className="archive-card-body">
				<div className="archive-card-name-row">
					<span className="archive-card-name">{figure.name}</span>
					{figure.identity && (
						<span className="archive-card-ident">{figure.identity}</span>
					)}
				</div>
				{figure.bio_summary && (
					<p className="archive-card-bio">{figure.bio_summary}</p>
				)}
			</div>
		</article>
	);
}
