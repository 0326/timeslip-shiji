import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, useSpring } from "framer-motion";
import { BookOpen, X } from "lucide-react";
import "./Archive.css";
import { Drawer } from "../../components/ui";
import {
	fetchFigureBundle,
	fetchFigureDetail,
	fetchFigureList,
	pickAssetFile,
	sizedAssetUrl,
	type FigureAsset,
	type FigureBundle,
	type MainFigureDetail,
} from "../../services/mainProjectApi";
import { getCharacter } from "../../data/characters";
import { STORYLINE_MAP } from "../../data/storylines";
import { useAuthGate } from "../../hooks/useAuthGate";

const LIFE_MAX = 80; // 命途条参考寿命
const NAV_LIST_LIMIT = 500; // 前后切换导航使用的列表大小

const STAR_LABEL: Record<number, string> = {
	5: "千古人物",
	4: "名垂青史",
	3: "载入史册",
	2: "附传偶见",
	1: "史海一粟",
};

const yearShort = (y: number | null) =>
	y == null ? "待考" : y < 0 ? `前${Math.abs(y)}` : `${y}`;
const yearFull = (y: number | null) =>
	y == null ? "年份待考" : y < 0 ? `公元前 ${Math.abs(y)} 年` : `公元 ${y} 年`;

/** 立绘：鼠标 3D 倾斜。有全身图时走 fullscene 模式，否则卡片兜底。 */
function Portrait({
	figure,
	asset,
}: {
	figure: MainFigureDetail;
	asset?: FigureAsset | null;
}) {
	const rx = useSpring(0, { stiffness: 120, damping: 16 });
	const ry = useSpring(0, { stiffness: 120, damping: 16 });

	const fullUrl = asset
		? sizedAssetUrl(pickAssetFile(asset, "portrait-full"), 896)
		: null;
	const bustUrl = asset
		? sizedAssetUrl(pickAssetFile(asset, "portrait-bust"), 768)
		: null;
	const avatarSrc = figure.avatar || figure.avatar_url || null;
	const glyph = figure.name?.charAt(0) || figure.id.charAt(0).toUpperCase();

	// 全身图 / 半身图模式：贴底顶天大立绘
	if (asset && (fullUrl || bustUrl)) {
		return (
			<div className="ad-fullscene" style={{ perspective: 1600 }}>
				<motion.div
					className="ad-fullscene-figure"
					style={{ rotateX: rx, rotateY: ry }}
					onMouseMove={(e) => {
						const r = e.currentTarget.getBoundingClientRect();
						ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
						rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
					}}
					onMouseLeave={() => {
						rx.set(0);
						ry.set(0);
					}}
				>
					<img
						src={fullUrl || bustUrl!}
						alt={figure.name}
						className="ad-fullscene-img"
						onError={(e) =>
							((e.currentTarget as HTMLImageElement).style.display = "none")
						}
					/>
				</motion.div>
			</div>
		);
	}

	// 兜底：卡片式立绘
	return (
		<div style={{ perspective: 1100 }}>
			<motion.div
				className="ad-portrait"
				style={{ rotateX: rx, rotateY: ry }}
				onMouseMove={(e) => {
					const r = e.currentTarget.getBoundingClientRect();
					ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
					rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
				}}
				onMouseLeave={() => {
					rx.set(0);
					ry.set(0);
				}}
			>
				{!avatarSrc && <span className="ad-portrait-glyph">{glyph}</span>}
				{avatarSrc && (
					<img
						src={avatarSrc}
						alt={figure.name}
						onError={(e) => {
							(e.currentTarget as HTMLImageElement).style.display = "none";
							const sib = (e.currentTarget as HTMLImageElement)
								.previousElementSibling;
							if (sib) (sib as HTMLElement).style.display = "block";
						}}
					/>
				)}
				<span className="ad-corner tl" />
				<span className="ad-corner tr" />
				<span className="ad-corner bl" />
				<span className="ad-corner br" />
			</motion.div>
		</div>
	);
}

/** 生平历程抽屉：容器收编为 components/ui 的 <Drawer>（自带 Esc + 音效 + 右滑入） */
function QuestDrawer({
	open,
	onClose,
	figure,
}: {
	open: boolean;
	onClose: () => void;
	figure: MainFigureDetail;
}) {
	return (
		<Drawer open={open} onClose={onClose}>
			<div className="ad-drawer-head">
				<div>
					<div className="ad-drawer-eyebrow">
						生平历程 · {figure.passages.length} 事
					</div>
					<div className="ad-drawer-title">{figure.name}</div>
				</div>
				<button
					className="ad-drawer-close"
					onClick={onClose}
					aria-label="关闭"
				>
					<X size={14} />
				</button>
			</div>
			<div className="ad-drawer-body">
				{figure.passages.length === 0 ? (
					<div
						style={{
							textAlign: "center",
							color: "var(--color-muted)",
							padding: "var(--space-8)",
						}}
					>
						此人物史料待补录
					</div>
				) : (
					<ol className="ad-timeline">
						{figure.passages.map((p, idx) => (
							<li className="ad-quest" key={p.passage_id || idx}>
								<div className="ad-quest-rail">
									<span className="ad-node" />
								</div>
								<div className="ad-quest-card">
									<span className="ad-quest-year">
										{yearFull(p.year)}
										{p.location && (
											<span className="ad-quest-loc">· {p.location}</span>
										)}
									</span>
									<h3 className="ad-quest-title">
										{p.title || p.chapter_name}
									</h3>
									<p className="ad-quest-text">{p.content}</p>
									<span className="ad-quest-link">
										出自《{p.book_name}》· 第{p.volume_no}卷 · {p.chapter_name}
									</span>
								</div>
							</li>
						))}
					</ol>
				)}
			</div>
		</Drawer>
	);
}

export default function ArchiveDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const location = useLocation();
	const requireAuth = useAuthGate();

	const [figure, setFigure] = useState<MainFigureDetail | null>(null);
	const [assetBundle, setAssetBundle] = useState<FigureBundle | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [questOpen, setQuestOpen] = useState(false);
	const [navIds, setNavIds] = useState<string[]>(
		(location.state as { ids?: string[] })?.ids ?? [],
	);

	// 拉取详情 + 视觉资产
	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);
		setQuestOpen(false);
		setAssetBundle(null);
		Promise.all([fetchFigureDetail(id), fetchFigureBundle(id)])
			.then(([fig, bundle]) => {
				if (!fig) {
					setError("人物未找到");
					setFigure(null);
					return;
				}
				setFigure(fig);
				if (bundle) setAssetBundle(bundle);
			})
			.catch(() => setError("加载失败"))
			.finally(() => setLoading(false));
	}, [id]);

	// 若 navIds 为空（如刷新），重新拉取列表兜底
	useEffect(() => {
		if (navIds.length > 0 || !id) return;
		let cancelled = false;
		fetchFigureList({ book: "shiji", page: 1, limit: NAV_LIST_LIMIT, sort: "era" })
			.then((res) => {
				if (cancelled || !res) return;
				setNavIds(res.items.map((it) => it.id));
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	}, [navIds.length, id]);

	// 前后切换
	const navIndex = useMemo(() => {
		if (!id || navIds.length === 0) return -1;
		return navIds.indexOf(id);
	}, [id, navIds]);
	const prevId = navIndex > 0 ? navIds[navIndex - 1] : null;
	const nextId =
		navIndex >= 0 && navIndex < navIds.length - 1 ? navIds[navIndex + 1] : null;

	const goPrev = useCallback(() => {
		if (prevId) navigate(`/archive/${prevId}`, { state: { ids: navIds } });
	}, [prevId, navigate, navIds]);
	const goNext = useCallback(() => {
		if (nextId) navigate(`/archive/${nextId}`, { state: { ids: navIds } });
	}, [nextId, navigate, navIds]);

	// 键盘左右方向键
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (questOpen) return;
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				goPrev();
			} else if (e.key === "ArrowRight") {
				e.preventDefault();
				goNext();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [goPrev, goNext, questOpen]);

	// 本地游戏化元数据（穿越按钮用）
	const gameChar = id ? getCharacter(id) : undefined;

	// 视觉资产：取默认 style 的 asset（必须在早返回之前，保证 hooks 顺序稳定）
	const defaultAsset: FigureAsset | null = useMemo(() => {
		if (!assetBundle) return null;
		const styleId = assetBundle.defaultStyle;
		return styleId ? assetBundle.assets[styleId] ?? null : null;
	}, [assetBundle]);

	if (loading) {
		return <div className="ad-loading">正在加载史册…</div>;
	}
	if (error) {
		return <div className="ad-error">{error}</div>;
	}
	if (!figure) return null;

	const lifePct =
		figure.death_year != null && figure.birth_year != null
			? Math.min(
					100,
					Math.round(
						((figure.death_year - figure.birth_year) / LIFE_MAX) * 100,
					),
				)
			: null;
	const lived =
		lifePct != null
			? (figure.death_year as number) - (figure.birth_year as number)
			: null;
	const titlePlates =
		figure.aliases?.filter((a) => a.length > 1).slice(0, 4) || [];
	const hasQuests = figure.passages.length > 0;
	const hasFullScene = !!(
		defaultAsset &&
		(pickAssetFile(defaultAsset, "portrait-full") ||
			pickAssetFile(defaultAsset, "portrait-bust"))
	);
	const sceneBg = defaultAsset
		? pickAssetFile(defaultAsset, "background")
		: null;

	// 关联故事线（穿越按钮条件）
	const playableStorylines = gameChar?.relatedStorylines
		?.map((sid) => STORYLINE_MAP[sid])
		.filter((st) => st && st.perspectives.some((p) => p.characterId === id)) ?? [];

	return (
		<div className="archive-detail-page" data-identity={figure.identity || undefined}>
		<div
			className={`ad-stage${hasFullScene ? " has-fullscene" : ""}`}
			style={
				sceneBg
					? ({
							["--scene-bg" as any]: `url(${sceneBg})`,
						} as React.CSSProperties)
					: undefined
			}
		>
			<Link to="/archive" className="ad-back">
				<span className="ad-back-arrow" aria-hidden="true">‹</span> 返回图鉴
			</Link>

			<div className="ad-stage-art">
				<Portrait figure={figure} asset={defaultAsset} />
			</div>

			<div className="ad-panel">
				<div className="ad-eyebrow">青史人物 · {figure.identity}</div>
				<h1 className="ad-name">{figure.name}</h1>

				{figure.star >= 1 && (
					<div className="ad-star" data-star={figure.star} title={`${figure.star} 星`}>
						<span className="ad-star-marks" aria-hidden="true">
							{"★".repeat(figure.star)}
							<span className="ad-star-empty">{"★".repeat(5 - figure.star)}</span>
						</span>
						<span className="ad-star-label">{STAR_LABEL[figure.star]}</span>
					</div>
				)}

				{titlePlates.length > 0 && (
					<div className="ad-titles">
						{titlePlates.map((a) => (
							<span key={a} className="ad-title-plate">{a}</span>
						))}
					</div>
				)}

				<div className="ad-badges">
					<span className="ad-badge is-identity">{figure.identity}</span>
					{figure.dynasty && (
						<span className="ad-badge is-dynasty">{figure.dynasty}</span>
					)}
				</div>

				{figure.bio_summary && (
					<p className="ad-bio-summary">{figure.bio_summary}</p>
				)}

				{gameChar?.classicalQuote && (
					<p className="ad-quote">「{gameChar.classicalQuote}」</p>
				)}

				{lifePct != null && (
					<div className="ad-life">
						<div className="ad-life-label">
							<span>
								命途 · {yearShort(figure.birth_year)} —{" "}
								{yearShort(figure.death_year)}
							</span>
							<span>享年 {lived}</span>
						</div>
						<div className="ad-life-track">
							<div className="ad-life-fill" style={{ width: `${lifePct}%` }} />
						</div>
					</div>
				)}

				{figure.keyword_tags?.length > 0 && (
				<div className="ad-tags">
					{figure.keyword_tags.slice(0, 8).map((t) => (
						<span key={t} className="ad-tag">{t}</span>
					))}
				</div>
			)}

			<div className="ad-actions">
					<button
						className="ad-act is-primary"
						onClick={() => setQuestOpen(true)}
						disabled={!hasQuests}
						title={hasQuests ? undefined : "此人物史料待补录"}
					>
						<span className="ad-act-icon">史</span>
						生平历程
						{hasQuests && (
							<span className="ad-act-count">{figure.passages.length}</span>
						)}
					</button>

					{playableStorylines.map((st) => (
							<button
								key={st.id}
								className="ad-act"
								onClick={() => requireAuth(() => navigate(`/play/${st.id}/${id}`))}
							>
								<span className="ad-act-icon">穿</span>
								穿越 · {st.title}
							</button>
						))}

					{gameChar?.relatedStorylines?.map((sid) => {
						const st = STORYLINE_MAP[sid];
						if (!st) return null;
						const playable = st.perspectives.some((p) => p.characterId === id);
						if (playable) return null; // 已在穿越按钮展示
						return (
							<button
								key={sid}
								className="ad-act"
								onClick={() => navigate(`/panorama/${sid}`)}
							>
								<BookOpen size={14} /> 全景 · {st.title}
							</button>
						);
					})}
				</div>
			</div>

			{/* 前后切换 */}
			<button
				className="ad-nav-btn ad-nav-prev"
				onClick={goPrev}
				disabled={!prevId}
				aria-label={prevId ? "上一位" : "已是第一位"}
				title={prevId ? "上一位" : "已是第一位"}
			>
				<span aria-hidden="true">‹</span>
			</button>
			<button
				className="ad-nav-btn ad-nav-next"
				onClick={goNext}
				disabled={!nextId}
				aria-label={nextId ? "下一位" : "已是最后一位"}
				title={nextId ? "下一位" : "已是最后一位"}
			>
				<span aria-hidden="true">›</span>
			</button>
		</div>

		<QuestDrawer open={questOpen} onClose={() => setQuestOpen(false)} figure={figure} />
	</div>
);
}
