import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
	ArrowLeft,
	Play,
	Star,
	Clock,
	Compass,
	CheckCircle2,
	Lock,
} from "lucide-react";
import "./StorySelect.css";
import { getSeriesStorylines } from "../../data/storylines";
import { inkStories } from "../../data/stories/inkStories";
import { loadInkSource } from "../../data/stories/inkSourceLoader";
import { SERIES } from "../../data/series";
import { useUserStore } from "../../store/userStore";
import { useUiStore } from "../../store/uiStore";
import { useAuthGate } from "../../hooks/useAuthGate";
import { CHARACTERS } from "../../data/characters";
import { getSprite, getBackground } from "../../data/sceneAssets";

function getDifficultyStars(d: number) {
	return Array.from({ length: 5 }, (_, i) => i < d);
}

function getCharacterName(id: string) {
	return CHARACTERS.find((c) => c.id === id)?.name || getSprite(id).name;
}

/** 取一条故事线的题图：从 ink 的 #bg 中挑一张有代表性的场景图。
 *  优先"场景型"背景，跳过青月开场的轩辕丘 / 议事厅(*_court)这类通用底；回退到首图或封面渐变。 */
function heroBgFromSource(src: string): { image?: string; css: string } {
	const distinct = [
		...new Set([...src.matchAll(/#bg:([a-z0-9_]+)/gi)].map((m) => m[1])),
	];
	const withImg = distinct
		.map((k) => ({ k, bg: getBackground(k) }))
		.filter((x) => !!x.bg.image);
	const scene =
		withImg.find((x) => !/qiu$|_court$|xuanyuan/.test(x.k)) ?? withImg[0];
	if (scene) return { image: scene.bg.image, css: scene.bg.css };
	const first = getBackground(distinct[0] ?? "default");
	return { image: first.image, css: first.css };
}

/**
 * 独立篇章页：一个系列下的多条故事线按顺序排列、依次通关解锁。
 * 取代原先"点击系列 → 弹窗"的交互。
 */
export function SeriesChapterPage() {
	const navigate = useNavigate();
	const { seriesId = "" } = useParams();
	const [searchParams] = useSearchParams();
	const mode = searchParams.get("mode") === "free" ? "free" : "canon";
	const getPerspective = useUserStore((s) => s.getPerspective);
	const pushToast = useUiStore((s) => s.pushToast);
	const requireAuth = useAuthGate();

	const series = SERIES.find((s) => s.id === seriesId);

	// 所有篇章默认解锁
	const chapters = useMemo(() => {
		const list = getSeriesStorylines(seriesId);
		const result = [];
		for (const sl of list) {
			const perspective = sl.perspectives[0];
			const prog = perspective
				? getPerspective(sl.id, perspective.characterId)
				: null;
			const isCompleted = !!prog?.isCompleted;
			const isStarted = !!prog?.isStarted && !isCompleted;
			result.push({ sl, perspective, isCompleted, isStarted, locked: false });
		}
		return result;
	}, [seriesId, getPerspective]);

	// 异步预加载各故事线的 ink 源码，用于题图 #bg 提取
	const [heroSources, setHeroSources] = useState<Record<string, string>>({});
	useEffect(() => {
		let cancelled = false;
		const storyKeys = chapters
			.map((c) => c.perspective?.storyKey)
			.filter((k): k is string => !!k);
		Promise.all(
			storyKeys.map(async (key) => {
				const cfg = inkStories[key];
				if (cfg?.source) return [key, cfg.source] as const;
				if (cfg?.inkFile) {
					try {
						const src = await loadInkSource(cfg.inkFile);
						return [key, src] as const;
					} catch { return null; }
				}
				return null;
			}),
		).then((entries) => {
			if (cancelled) return;
			const map: Record<string, string> = {};
			for (const e of entries) if (e) map[e[0]] = e[1];
			setHeroSources(map);
		});
		return () => { cancelled = true; };
	}, [chapters]);

	if (!series) {
		return (
			<div className="ss-page">
				<div className="empty-state" style={{ paddingTop: 160 }}>
					<div className="glyph">？</div>
					<h2 className="serif">此篇章尚未开放</h2>
					<button
						className="btn btn-primary btn-cut"
						style={{ marginTop: 18 }}
						onClick={() => navigate("/story")}
					>
						返回篇章选择
					</button>
				</div>
			</div>
		);
	}

	const handlePlay = (storyId: string, charId: string) => {
		requireAuth(() => navigate(`/play/${storyId}/${charId}?mode=${mode}`));
	};

	return (
		<div
			className="ss-page"
			style={
				{
					"--series-accent": series.accent,
					"--series-accent2": series.accent2,
					"--series-bg-from": series.bgFrom,
					"--series-bg-to": series.bgTo,
				} as React.CSSProperties
			}
		>
			{/* 背景层 */}
			<div className="ss-bg">
				<div className="ss-bg-pattern" />
				<div className="ss-bg-vignette" />
			</div>

			{/* 顶部导航 */}
			<header className="ss-nav">
				<button
					className="ss-back"
					onClick={() => navigate(`/story?mode=${mode}`)}
				>
					<ArrowLeft size={16} />
					<span>选择篇章</span>
				</button>
				<div className="ss-nav-title">
					<span className="ss-chapter-seal">{series.glyph}</span>
					<span>{mode === "free" ? "自由模式" : "正史模式"}</span>
				</div>
				<div className="ss-nav-right" />
			</header>

			{/* 主内容 */}
			<main className="ss-main">
				<div className="ss-header">
					<h1 className="ss-title">{series.name}</h1>
					<p className="ss-subtitle">{series.tagline} · 依次通关，逐篇解锁</p>
				</div>

				{/* 关卡式列表：一排一行，左题图 + 右信息 */}
				<div className="ss-chapter-list">
					{chapters.map(({ sl, perspective, isCompleted, isStarted, locked }, i) => {
						const endingsTotal = perspective
							? Object.keys(
									inkStories[perspective.storyKey]?.endings ?? {},
								).length
							: 0;
						const prog = perspective
							? getPerspective(sl.id, perspective.characterId)
							: null;
						const endingsUnlocked = Math.min(
							(prog?.unlockedEndings ?? []).length,
							endingsTotal,
						);
						const charName = perspective
							? getCharacterName(perspective.characterId)
							: "";
						const hero = perspective
							? heroBgFromSource(heroSources[perspective.storyKey] ?? "")
							: null;

						return (
							<button
								key={sl.id}
								className={`game-card ss-chapter-row ${isCompleted ? "completed" : ""} ${locked ? "is-locked ss-story-locked" : ""}`}
								style={{ "--i": i, "--accent": sl.cover } as React.CSSProperties}
								onClick={() => {
									if (locked) {
										pushToast({
											kind: "info",
											title: "尚未解锁",
											subtitle: "通关上一篇后开启本篇",
											icon: "🔒",
										});
										return;
									}
									if (!perspective) return;
									handlePlay(sl.id, perspective.characterId);
								}}
							>
								{/* 左：题图 */}
								<div
									className="ss-chapter-hero"
									style={{
										backgroundImage: hero?.image
											? `url(${hero.image})`
											: hero?.css,
									}}
								>
									<span className="ss-chapter-no">
										{String(i + 1).padStart(2, "0")}
									</span>
									<span className="ss-chapter-glyph">{sl.glyph}</span>
									{isCompleted && (
										<span className="ss-chapter-flag complete">
											<CheckCircle2 size={13} /> 已通关
										</span>
									)}
									{isStarted && (
										<span className="ss-chapter-flag progress">进行中</span>
									)}
									{locked && (
										<span className="ss-chapter-lockmask">
											<Lock size={26} />
										</span>
									)}
								</div>

								{/* 右：信息 */}
								<div className="ss-chapter-body">
									<div className="ss-chapter-head">
										<span className="ss-chapter-order">第 {i + 1} 幕</span>
										<h3 className="ss-chapter-title">{sl.title}</h3>
										<span className="ss-chapter-sub">{sl.subtitle}</span>
									</div>
									<p className="ss-chapter-desc">
										{locked ? "通关上一篇后，此篇自动解锁。" : sl.description}
									</p>
									<div className="ss-chapter-foot">
										<div className="ss-chapter-meta">
											<span className="ss-meta-item">
												<Clock size={12} /> {sl.estimatedMinutes}分钟
											</span>
											<span className="ss-meta-item">
												<Star size={12} />
												{getDifficultyStars(sl.difficulty).map((filled, si) => (
													<span
														key={si}
														className={`ss-star ${filled ? "filled" : ""}`}
													>
														★
													</span>
												))}
											</span>
											<span className="ss-meta-year">{sl.year}</span>
											{mode === "free" && endingsTotal >= 2 && (
												<span
													className="ss-meta-item ss-meta-endings"
													title="结局收集"
												>
													<Compass size={12} /> 结局 {endingsUnlocked}/
													{endingsTotal}
												</span>
											)}
										</div>
										<span
											className={`btn btn-cut btn-sm ss-chapter-cta ${
												locked
													? "btn-ghost"
													: isCompleted
														? "btn-ghost ss-cta-done"
														: "btn-primary"
											}`}
										>
											{locked ? (
												<>
													<Lock size={14} /> <span>未解锁</span>
												</>
											) : (
												<>
													<Play size={14} />
													<span>
														{isCompleted
															? "再历一次"
															: isStarted
																? "继续"
																: sl.id.includes("qiyuan")
																	? "让青月引路"
																	: `以${charName}视角`}
													</span>
												</>
											)}
										</span>
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</main>
		</div>
	);
}
