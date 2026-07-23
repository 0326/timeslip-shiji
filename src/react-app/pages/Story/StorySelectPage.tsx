import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Play, Sparkles, BookOpen, Lock } from "lucide-react";
import "./StorySelect.css";
import { STORYLINES } from "../../data/storylines";
import { useUserStore } from "../../store/userStore";
import { useUiStore } from "../../store/uiStore";
import { SERIES } from "../../data/series";
import type { Storyline } from "../../types/story";

/* ───────────── 工具函数 ───────────── */
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
	const [searchParams] = useSearchParams();
	// 游戏模式（canon=正史 默认 / free=自由），随入口透传给 PlayPage
	const mode = searchParams.get("mode") === "free" ? "free" : "canon";
	const getPerspective = useUserStore((s) => s.getPerspective);
	const pushToast = useUiStore((s) => s.pushToast);

	// 按系列分组故事线（按 order 顺序解锁：需前一个有内容的系列全通关才开启下一个）
	const storiesBySeries = useMemo(() => {
		const sorted = [...SERIES].sort((a, b) => a.order - b.order);
		const result = [];
		// 首个有内容的系列默认解锁；此后每个系列需上一个"有内容"系列全通关
		let prevPlayableCleared = true;
		for (const series of sorted) {
			const storylines = series.comingSoon
				? []
				: STORYLINES.filter((sl) => sl.series === series.id);
			const progress = getSeriesProgress(storylines, getPerspective);
			const hasStories = storylines.length > 0;
			// 无内容（含 comingSoon）：显示"敬请期待"，真正禁用
			const contentLocked = series.comingSoon || !hasStories;
			// 顺序未解锁：有内容但前一个有内容系列尚未全通关 → 可点击给提示
			const seqLocked = !contentLocked && !prevPlayableCleared;
			const fullyCleared =
				hasStories && progress.total > 0 && progress.completed === progress.total;
			// 仅"有内容"的系列参与解锁链条（comingSoon 空档不打断顺序）
			if (hasStories) prevPlayableCleared = fullyCleared;
			result.push({ ...series, storylines, progress, contentLocked, seqLocked });
		}
		return result;
	}, [getPerspective]);

	// 进入某系列的独立篇章页
	const openSeries = (seriesId: string) => {
		navigate(`/story/${seriesId}?mode=${mode}`);
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
					<ArrowLeft size={16} />
					<span>返回大厅</span>
				</button>
				<div className="ss-nav-title">
					<BookOpen size={18} />
					<span>{mode === "free" ? "自由模式" : "正史模式"}</span>
				</div>
				<div className="ss-nav-right" />
			</header>

			{/* 主内容 */}
			<main className="ss-main">
				<div className="ss-header">
					<h1 className="ss-title">选择篇章</h1>
					<p className="ss-subtitle">循史记之脉络，亲历千年风云</p>
				</div>

				{/* 系列卡片网格 */}
				<div className="ss-series-grid">
					{storiesBySeries.map((series, idx) => {
						// 展示为锁定：无内容 或 顺序未解锁
						const locked = series.contentLocked || series.seqLocked;
						const progressPct =
							series.progress.total > 0
								? Math.round(
										(series.progress.completed / series.progress.total) * 100,
									)
								: 0;

						return (
							<button
								key={series.id}
								className={`game-card ss-series-card ${locked ? "is-locked" : ""} ${series.seqLocked ? "seq-locked" : ""}`}
								onClick={() => {
									if (series.contentLocked) return;
									if (series.seqLocked) {
										pushToast({
											kind: "info",
											title: "尚未解锁",
											subtitle: "通关前一篇章后开启本篇",
											icon: "🔒",
										});
										return;
									}
									openSeries(series.id);
								}}
								// 顺序未解锁需可点击给提示，仅"敬请期待"真正禁用
								disabled={series.contentLocked}
								style={
									{
										"--accent": series.accent,
										"--series-accent": series.accent,
										"--series-accent2": series.accent2,
										"--series-bg-from": series.bgFrom,
										"--series-bg-to": series.bgTo,
										"--i": idx,
									} as React.CSSProperties
								}
							>
								<div className="ss-series-card-glow" />
								<div className="ss-series-card-inner">
									<div className="ss-series-card-header">
										<div className="ss-series-card-glyph">{series.glyph}</div>
										{series.comingSoon ? (
											<span className="badge">敬请期待</span>
										) : series.seqLocked ? (
											<span className="badge ss-lock-badge">
												<Lock size={11} /> 未解锁
											</span>
										) : (
											<span className="ss-series-count">
												{series.progress.completed}/{series.progress.total} 篇章
											</span>
										)}
									</div>
									<div className="ss-series-card-body">
										<h2 className="ss-series-card-name">{series.name}</h2>
										<p className="ss-series-card-tagline">
											{series.seqLocked ? "通关前一篇章后解锁" : series.tagline}
										</p>
									</div>
									{!locked && (
										<div className="ss-series-card-footer">
											<div className="ss-progress">
												<div
													className="ss-progress-fill"
													style={{ width: `${progressPct}%` }}
												/>
											</div>
											<span className="btn btn-primary btn-cut btn-sm ss-series-card-cta">
												<Play size={14} />
												<span>进入篇章</span>
											</span>
										</div>
									)}
								</div>
							</button>
						);
					})}
				</div>

				{/* 底部提示 */}
				<div className="ss-footer-hint">
					<Sparkles size={14} />
					<span>更多本纪篇章正在制作中，敬请期待</span>
				</div>
			</main>
		</div>
	);
}
