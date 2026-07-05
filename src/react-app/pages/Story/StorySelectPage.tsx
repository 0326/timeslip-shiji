import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowLeft,
	Play,
	Lock,
	ChevronDown,
	ChevronRight,
	Star,
	Clock,
	Sparkles,
	BookOpen,
	CheckCircle2,
} from "lucide-react";
import "./StorySelect.css";
import { STORYLINES } from "../../data/storylines";
import { useUserStore } from "../../store/userStore";
import { CHARACTERS } from "../../data/characters";

/* ───────────── 四个本纪系列定义 ───────────── */
interface SeriesDef {
	id: string;
	name: string;
	tagline: string;
	accent: string;
	accent2: string;
	bgFrom: string;
	bgTo: string;
	era: string; // 对应 Era 类型或自定义
	order: number;
	glyph: string;
	comingSoon?: boolean;
}

const SERIES: SeriesDef[] = [
	{
		id: "wudi",
		name: "五帝本纪",
		tagline: "涿鹿风云 · 华夏肇始",
		accent: "#c9a84c",
		accent2: "#3a8c6e",
		bgFrom: "#1a1510",
		bgTo: "#0f1a15",
		era: "legendary",
		order: 1,
		glyph: "帝",
		comingSoon: true,
	},
	{
		id: "yinzhou",
		name: "殷周本纪",
		tagline: "渭水求贤 · 凤鸣岐山",
		accent: "#7ec8c8",
		accent2: "#c0c0c0",
		bgFrom: "#0f1518",
		bgTo: "#0a1012",
		era: "shang_zhou",
		order: 2,
		glyph: "周",
		comingSoon: true,
	},
	{
		id: "shihuang",
		name: "始皇本纪",
		tagline: "六合一统 · 千古一帝",
		accent: "#d4a847",
		accent2: "#8b4513",
		bgFrom: "#1a1208",
		bgTo: "#120e08",
		era: "qin",
		order: 3,
		glyph: "秦",
		comingSoon: true,
	},
	{
		id: "chuhan",
		name: "楚汉争霸",
		tagline: "垓下悲歌 · 霸王绝唱",
		accent: "#d4503c",
		accent2: "#b8973a",
		bgFrom: "#1a0d0a",
		bgTo: "#120808",
		era: "chu_han",
		order: 4,
		glyph: "楚",
	},
];

/* ───────────── 工具函数 ───────────── */
function getDifficultyStars(d: number) {
	return Array.from({ length: 5 }, (_, i) => i < d);
}

function getCharacterName(id: string) {
	return CHARACTERS.find((c) => c.id === id)?.name || id;
}

/* ───────────── 主组件 ───────────── */
export function StorySelectPage() {
	const navigate = useNavigate();
	const [expanded, setExpanded] = useState<string | null>("chuhan");
	const [mounted, setMounted] = useState(false);
	const hasCharacter = useUserStore((s) => s.hasCharacter);
	const getPerspective = useUserStore((s) => s.getPerspective);

	useEffect(() => {
		setMounted(true);
	}, []);

	// 按系列分组故事线
	const storiesBySeries = SERIES.map((series) => {
		const storylines = series.comingSoon
			? []
			: STORYLINES.filter((sl) => {
					// era 映射
					if (series.era === "chu_han") return sl.era === "chu_han";
					if (series.era === "qin") return sl.era === "qin";
					return false;
				});
		return { ...series, storylines };
	});

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
					animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<h1 className="ss-title">选择篇章</h1>
					<p className="ss-subtitle">循史记之脉络，亲历千年风云</p>
				</motion.div>

				<div className="ss-series-list">
					{storiesBySeries.map((series, idx) => {
						const isOpen = expanded === series.id;
						const hasStories = series.storylines.length > 0;

						return (
							<motion.div
								key={series.id}
								className={`ss-series ${isOpen ? "open" : ""} ${series.comingSoon ? "coming-soon" : ""}`}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
								transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
								style={
									{
										"--series-accent": series.accent,
										"--series-accent2": series.accent2,
										"--series-bg-from": series.bgFrom,
										"--series-bg-to": series.bgTo,
									} as React.CSSProperties
								}
							>
								{/* 系列头 */}
								<button
									className="ss-series-head"
									onClick={() => {
										if (!series.comingSoon) {
											setExpanded(isOpen ? null : series.id);
										}
									}}
									disabled={series.comingSoon}
								>
									<div className="ss-series-glyph">{series.glyph}</div>
									<div className="ss-series-info">
										<div className="ss-series-name-row">
											<h2 className="ss-series-name">{series.name}</h2>
											{series.comingSoon && (
												<span className="ss-badge soon">敬请期待</span>
											)}
										</div>
										<p className="ss-series-tagline">{series.tagline}</p>
									</div>
									<div className="ss-series-stats">
										{hasStories && (
											<span className="ss-count">
												{series.storylines.length} 篇章
											</span>
										)}
									</div>
									{!series.comingSoon && (
										<div className={`ss-chevron ${isOpen ? "up" : ""}`}>
											{isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
										</div>
									)}
								</button>

								{/* 篇章列表 */}
								<AnimatePresence>
									{isOpen && hasStories && (
										<motion.div
											className="ss-chapters"
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
										>
											<div className="ss-chapters-inner">
												{series.storylines.map((sl, sIdx) => (
													<motion.div
														key={sl.id}
														className="ss-chapter-card"
														initial={{ opacity: 0, x: -20 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ duration: 0.4, delay: 0.1 + sIdx * 0.1 }}
													>
														<div className="ss-chapter-glow" />
														<div className="ss-chapter-inner">
															{/* 左侧徽记 */}
															<div
																className="ss-chapter-glyph"
																style={{ background: `linear-gradient(135deg, ${sl.cover}, ${sl.cover}99)` }}
															>
																{sl.glyph}
															</div>

															{/* 中间信息 */}
															<div className="ss-chapter-info">
																<div className="ss-chapter-title-row">
																	<h3 className="ss-chapter-title">{sl.title}</h3>
																	{sl.perspectives.map((p) => {
																		const prog = getPerspective(sl.id, p.characterId);
																		return prog.isCompleted ? (
																			<span key={p.characterId} className="ss-badge complete">
																				<CheckCircle2 size={12} /> 已通关
																			</span>
																		) : prog.isStarted ? (
																			<span key={p.characterId} className="ss-badge progress">
																				进行中
																			</span>
																		) : null;
																	})}
																</div>
																<p className="ss-chapter-sub">{sl.subtitle}</p>
																<p className="ss-chapter-desc">{sl.description}</p>
																<div className="ss-chapter-meta">
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
															</div>

															{/* 右侧：视角选择 + 开始按钮 */}
															<div className="ss-chapter-actions">
																{sl.perspectives.map((p) => {
																	const unlocked = hasCharacter(p.unlockedBy);
																	const charName = getCharacterName(p.characterId);
																	const prog = getPerspective(sl.id, p.characterId);

																	return (
																		<button
																			key={p.characterId}
																			className={`ss-play-btn ${!unlocked ? "locked" : ""} ${prog.isCompleted ? "completed" : ""}`}
																			onClick={() => unlocked && handlePlay(sl.id, p.characterId)}
																			disabled={!unlocked}
																		>
																			{unlocked ? (
																				<>
																					<Play size={16} />
																					<span>
																						{prog.isCompleted ? "再历一次" : prog.isStarted ? "继续" : `以${charName}视角`}
																					</span>
																				</>
																			) : (
																				<>
																					<Lock size={14} />
																					<span>需解锁 {charName}</span>
																				</>
																			)}
																		</button>
																	);
																})}
															</div>
														</div>
													</motion.div>
												))}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						);
					})}
				</div>

				{/* 底部提示 */}
				<motion.div
					className="ss-footer-hint"
					initial={{ opacity: 0 }}
					animate={{ opacity: mounted ? 1 : 0 }}
					transition={{ duration: 0.6, delay: 1 }}
				>
					<Sparkles size={14} />
					<span>更多本纪篇章正在制作中，敬请期待</span>
				</motion.div>
			</main>
		</div>
	);
}
