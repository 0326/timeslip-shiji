import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	Play,
	Lock,
	Star,
	Clock,
	Sparkles,
	BookOpen,
	CheckCircle2,
	X,
} from "lucide-react";
import "./StorySelect.css";
import { STORYLINES } from "../../data/storylines";
import { useUserStore } from "../../store/userStore";
import { CHARACTERS } from "../../data/characters";
import { getSprite } from "../../data/sceneAssets";
import { SERIES, type SeriesDef } from "../../data/series";
import type { Storyline } from "../../types/story";
import { Modal } from "../../components/ui";

/* ───────────── 工具函数 ───────────── */
function getDifficultyStars(d: number) {
	return Array.from({ length: 5 }, (_, i) => i < d);
}

function getCharacterName(id: string) {
	// 卡池角色优先；非卡池主角（如五帝/夏人物）用立绘表兜底名
	return CHARACTERS.find((c) => c.id === id)?.name || getSprite(id).name;
}

/** 计算一条故事线的可玩状态 */
function getStoryStatus(sl: Storyline, hasCharacter: (id: string) => boolean) {
	// ink 引擎章节视为已解锁
	const perspective = sl.perspectives[0];
	if (!perspective) {
		return { kind: "locked" as const, charName: "" };
	}
	const unlocked =
		sl.id.endsWith("_ink") || hasCharacter(perspective.unlockedBy);
	const charName = getCharacterName(perspective.characterId);
	if (!unlocked) {
		return { kind: "locked" as const, charName };
	}
	return { kind: "unlocked" as const, charName, perspective };
}

/** 计算系列进度：已通关视角数 / 总视角数 */
function getSeriesProgress(
	storylines: Storyline[],
	getPerspective: (storyId: string, charId: string) => { isCompleted: boolean },
) {
	let total = 0;
	let completed = 0;
	for (const sl of storylines) {
		for (const p of sl.perspectives) {
			total += 1;
			if (getPerspective(sl.id, p.characterId).isCompleted) completed += 1;
		}
	}
	return { total, completed };
}

/* ───────────── 主组件 ───────────── */
export function StorySelectPage() {
	const navigate = useNavigate();
	const [activeSeries, setActiveSeries] = useState<SeriesDef | null>(null);
	const hasCharacter = useUserStore((s) => s.hasCharacter);
	const getPerspective = useUserStore((s) => s.getPerspective);

	// 按系列分组故事线
	const storiesBySeries = useMemo(
		() =>
			SERIES.map((series) => {
				const storylines = series.comingSoon
					? []
					: STORYLINES.filter((sl) => sl.series === series.id);
				const progress = getSeriesProgress(storylines, getPerspective);
				return { ...series, storylines, progress };
			}),
		[getPerspective],
	);

	const handlePlay = (storyId: string, charId: string) => {
		navigate(`/play/${storyId}/${charId}`);
	};

	return (
		<div className="ss-page">
			{/* 背景层 */}
			<div className="ss-bg">
				<div className="ss-bg-pattern" />
				<div className="ss-bg-vignette" />
			</div>

			{/* 顶部导航 */}
			<header className="ss-nav">
				<button className="ss-back" onClick={() => navigate("/")}>
					<ArrowLeft size={20} />
					<span>返回大厅</span>
				</button>
				<div className="ss-nav-title">
					<BookOpen size={18} />
					<span>正史模式</span>
				</div>
				<div className="ss-nav-right" />
			</header>

			{/* 主内容 */}
			<main className="ss-main">
				<motion.div
				className="ss-header"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
			>
					<h1 className="ss-title">选择篇章</h1>
					<p className="ss-subtitle">循史记之脉络，亲历千年风云</p>
				</motion.div>

				{/* 系列卡片网格 */}
				<div className="ss-series-grid">
					{storiesBySeries.map((series, idx) => {
						const hasStories = series.storylines.length > 0;
						const progressPct =
							series.progress.total > 0
								? Math.round(
										(series.progress.completed / series.progress.total) * 100,
									)
								: 0;

						return (
							<motion.button
								key={series.id}
								className={`ss-series-card ${series.comingSoon ? "coming-soon" : ""}`}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
								onClick={() => {
									if (!series.comingSoon && hasStories) {
										setActiveSeries(series);
									}
								}}
								disabled={series.comingSoon || !hasStories}
								style={
									{
										"--series-accent": series.accent,
										"--series-accent2": series.accent2,
										"--series-bg-from": series.bgFrom,
										"--series-bg-to": series.bgTo,
									} as React.CSSProperties
								}
							>
								<div className="ss-series-card-glow" />
								<div className="ss-series-card-inner">
									<div className="ss-series-card-header">
										<div className="ss-series-card-glyph">{series.glyph}</div>
										{series.comingSoon ? (
											<span className="ss-badge soon">敬请期待</span>
										) : (
											<span className="ss-series-count">
												{series.progress.completed}/{series.progress.total} 篇章
											</span>
										)}
									</div>
									<div className="ss-series-card-body">
										<h2 className="ss-series-card-name">{series.name}</h2>
										<p className="ss-series-card-tagline">{series.tagline}</p>
									</div>
									{!series.comingSoon && hasStories && (
										<div className="ss-series-card-footer">
											<div className="ss-progress">
												<div
													className="ss-progress-fill"
													style={{ width: `${progressPct}%` }}
												/>
											</div>
											<div className="ss-series-card-cta">
												<span>进入篇章</span>
												<Play size={14} />
											</div>
										</div>
									)}
								</div>
							</motion.button>
						);
					})}
				</div>

				{/* 底部提示 */}
				<motion.div
				className="ss-footer-hint"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 1 }}
			>
					<Sparkles size={14} />
					<span>更多本纪篇章正在制作中，敬请期待</span>
				</motion.div>
			</main>

			{/* 篇章选择弹窗 */}
			<Modal
				open={activeSeries !== null}
				onClose={() => setActiveSeries(null)}
				className="ss-modal-wide"
				showClose={false}
			>
				{activeSeries && (
					<div
						className="ss-modal-shell"
						style={
							{
								"--series-accent": activeSeries.accent,
								"--series-accent2": activeSeries.accent2,
								"--series-bg-from": activeSeries.bgFrom,
								"--series-bg-to": activeSeries.bgTo,
							} as React.CSSProperties
						}
					>
						{/* 弹窗头部 */}
						<div className="ss-modal-head">
							<div className="ss-modal-head-glyph">{activeSeries.glyph}</div>
							<div className="ss-modal-head-info">
								<h2 className="ss-modal-title">{activeSeries.name}</h2>
								<p className="ss-modal-tagline">{activeSeries.tagline}</p>
							</div>
							<button
								className="ss-modal-close"
								onClick={() => setActiveSeries(null)}
								aria-label="关闭"
							>
								<X size={18} />
							</button>
						</div>

						{/* 篇章子卡片网格 */}
						<div className="ss-modal-body">
							<div className="ss-story-grid">
								{STORYLINES.filter(
									(sl) => sl.series === activeSeries.id,
								).map((sl, sIdx) => {
									const status = getStoryStatus(sl, hasCharacter);
									const perspective = sl.perspectives[0];
									const prog = perspective
										? getPerspective(sl.id, perspective.characterId)
										: null;
									const isCompleted = prog?.isCompleted;
									const isStarted = prog?.isStarted && !isCompleted;
									const locked = status.kind === "locked";

									return (
										<motion.button
											key={sl.id}
											className={`ss-story-card ${locked ? "locked" : ""} ${isCompleted ? "completed" : ""}`}
											initial={{ opacity: 0, y: 16 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.35, delay: 0.05 + sIdx * 0.05 }}
											onClick={() => {
												if (locked || !perspective) return;
												handlePlay(sl.id, perspective.characterId);
											}}
											disabled={locked}
										>
											<div
												className="ss-story-cover"
												style={{
													background: `linear-gradient(135deg, ${sl.cover}, ${sl.cover}88)`,
												}}
											>
												<span className="ss-story-glyph">{sl.glyph}</span>
												{isCompleted && (
													<span className="ss-story-status complete">
														<CheckCircle2 size={12} /> 已通关
													</span>
												)}
												{isStarted && (
													<span className="ss-story-status progress">进行中</span>
												)}
												{locked && (
													<span className="ss-story-status lock">
														<Lock size={12} /> 需解锁 {status.charName}
													</span>
												)}
											</div>
											<div className="ss-story-info">
												<h3 className="ss-story-title">{sl.title}</h3>
												<p className="ss-story-sub">{sl.subtitle}</p>
												<p className="ss-story-desc">{sl.description}</p>
												<div className="ss-story-meta">
													<span className="ss-meta-item">
														<Clock size={12} /> {sl.estimatedMinutes}分钟
													</span>
													<span className="ss-meta-item">
														<Star size={12} />
														{getDifficultyStars(sl.difficulty).map((filled, i) => (
															<span
																key={i}
																className={`ss-star ${filled ? "filled" : ""}`}
															>
																★
															</span>
														))}
													</span>
													<span className="ss-meta-year">{sl.year}</span>
												</div>
												{!locked && status.kind === "unlocked" && (
												<div className="ss-story-cta">
													<Play size={14} />
													<span>
														{isCompleted
															? "再历一次"
															: isStarted
																? "继续"
																: `以${status.charName}视角`}
													</span>
												</div>
											)}
											</div>
										</motion.button>
									);
								})}
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
}
