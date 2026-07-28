import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
	ArrowLeft,
	Play,
	Star,
	Clock,
	Compass,
	CheckCircle2,
	Lock,
	X,
} from "lucide-react";
import "./StorySelect.css";
import { getSeriesStorylines } from "../../data/storylines";
import { inkStories } from "../../data/stories/inkStories";
import { SERIES } from "../../data/series";
import { useUserStore } from "../../store/userStore";
import { useUiStore } from "../../store/uiStore";
import { useAuthGate } from "../../hooks/useAuthGate";
import { CHARACTERS } from "../../data/characters";
import { getSprite, getBackground } from "../../data/sceneAssets";
import type { EndingEntry } from "../../engine/shijiInkAdapter";

function getDifficultyStars(d: number) {
	return Array.from({ length: 5 }, (_, i) => i < d);
}

function getCharacterName(id: string) {
	return CHARACTERS.find((c) => c.id === id)?.name || getSprite(id).name;
}

/** 取一条故事线的题图：从 ink 的 #bg 中挑一张有代表性的场景图。
 *  优先"场景型"背景，跳过青月开场的轩辕丘 / 议事厅(*_court)这类通用底；回退到首图或封面渐变。 */
function heroBgFor(storyKey: string): { image?: string; css: string } {
	const src = inkStories[storyKey]?.source ?? "";
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
	/** 当前展开结局清单的章节（storylineId）；null = 不展开 */
	const [endingsPreviewId, setEndingsPreviewId] = useState<string | null>(null);

	const series = SERIES.find((s) => s.id === seriesId);

	// 故事线 + 顺序解锁状态：第 0 篇默认解锁；第 N 篇需第 N-1 篇通关
	const chapters = useMemo(() => {
		const list = getSeriesStorylines(seriesId);
		const result = [];
		let prevCleared: boolean = true;
		for (const sl of list) {
			const perspective = sl.perspectives[0];
			const prog = perspective
				? getPerspective(sl.id, perspective.characterId)
				: null;
			const isCompleted = !!prog?.isCompleted;
			const isStarted = !!prog?.isStarted && !isCompleted;
			const locked = false; // 全章节解锁：关闭章节顺序锁
			// 仅"本身已解锁(prevCleared)且已通关"的篇章才解锁下一篇；
			// 被锁篇章即便存档里残留通关记录，也不向后传递解锁（防止旧存档跳关）
			prevCleared = prevCleared && isCompleted;
			result.push({ sl, perspective, isCompleted, isStarted, locked });
		}
		return result;
	}, [seriesId, getPerspective]);

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
						const hero = perspective ? heroBgFor(perspective.storyKey) : null;

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
											<button
												type="button"
												className="ss-meta-item ss-meta-endings ss-meta-endings-btn"
												title="点击查看本章结局收集"
												onClick={(e) => {
													e.stopPropagation();
													setEndingsPreviewId(sl.id);
												}}
												onMouseDown={(e) => e.stopPropagation()}
											>
												<Compass size={12} /> 结局 {endingsUnlocked}/
												{endingsTotal}
											</button>
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

			{/* 结局收集弹窗：点击章节角标弹出，复用 vn-choices / choice-btn 视觉语言 */}
			{endingsPreviewId && (() => {
				const sl = chapters.find((c) => c.sl.id === endingsPreviewId)?.sl;
				const persp = sl?.perspectives[0];
				if (!sl || !persp) return null;
				const cfg = inkStories[persp.storyKey];
				const endings = cfg?.endings;
				if (!endings) return null;
				const prog = getPerspective(sl.id, persp.characterId);
				const unlockedSet = new Set(prog.unlockedEndings ?? []);
				const orderedIds = Object.keys(endings).sort((a, b) => {
					const ka = endings[a].kind;
					const kb = endings[b].kind;
					if (ka === kb) return 0;
					return ka === "canon" ? -1 : 1;
				});
				return (
					<div
						className="ss-endings-overlay"
						onClick={() => setEndingsPreviewId(null)}
					>
						<div
							className="ss-endings-popup"
							onClick={(e) => e.stopPropagation()}
						>
							<button
								className="ss-endings-close"
								onClick={() => setEndingsPreviewId(null)}
								title="关闭"
							>
								<X size={16} />
							</button>
							<div className="ss-endings-title serif">
								『{sl.title}』· 结局收集
							</div>
							<div className="ss-endings-sub dim">
								以{getCharacterName(persp.characterId)}视角 · {unlockedSet.size}/
								{orderedIds.length} 已照见
							</div>
							<div className="ss-endings-list">
								{orderedIds.map((eid, idx) => {
									const e: EndingEntry = endings[eid];
									const unlocked = unlockedSet.has(eid);
									return unlocked ? (
										<div key={eid} className="ss-ending-item unlocked">
											<div className="ss-ending-item-head">
												<span className={`ss-ending-kind ${e.kind}`}>
													{e.kind === "canon" ? "史实终局" : "历史的歧路"}
												</span>
												<span className="ss-ending-idx">第 {idx + 1} 结局</span>
											</div>
											<div className="ss-ending-name serif">『{e.title}』</div>
											{e.epigraph && (
												<p className="ss-ending-epigraph serif">{e.epigraph}</p>
											)}
										</div>
									) : (
										<div key={eid} className="ss-ending-item locked">
											<Lock size={16} />
											<div className="ss-ending-name-locked serif">
												第 {idx + 1} 结局 · 未照见
											</div>
											<div className="ss-ending-sub-locked dim">
												走过这条歧路才会照见
											</div>
										</div>
									);
								})}
							</div>
							<button
								className="btn btn-ghost ss-endings-goto"
								onClick={() => navigate("/codex/endings")}
							>
								前往结局图鉴 <Compass size={14} />
							</button>
						</div>
					</div>
				);
			})()}
		</div>
	);
}
