import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	Sparkles,
	Play,
	Swords,
	BookOpen,
	Compass,
	Lock,
	Menu,
	X,
	ChevronRight,
} from "lucide-react";
import "./Home.css";
import { useUserStore } from "../../store/userStore";

/* ───────────── KV 图片基础路径 ───────────── */
const KV_BASE = import.meta.env.VITE_KV_BASE_URL || "/images/kv";

/* ───────────── 四个本纪系列 ───────────── */
const SERIES = [
	{
		id: "wudi",
		name: "五帝本纪",
		tagline: "涿鹿风云 · 龙战玄黄",
		accent: "#c9a84c",
		accent2: "#3a8c6e",
		// 角色偏左，为右侧按钮留出空间
		charStyle: { bottom: "50px", left: "22%", transform: "translateX(-50%)", width: "45%" } as React.CSSProperties,
		charOffsetX: 80,
		charScale: 1,
	},
	{
		id: "yinzhou",
		name: "殷周本纪",
		tagline: "渭水求贤 · 凤鸣岐山",
		accent: "#7ec8c8",
		accent2: "#c0c0c0",
		charStyle: { bottom: "50px", left: "22%", transform: "translateX(-50%)", width: "45%" } as React.CSSProperties,
		charOffsetX: 80,
		charScale: 1,
	},
	{
		id: "shihuang",
		name: "始皇本纪",
		tagline: "六合一统 · 千古一帝",
		accent: "#d4a847",
		accent2: "#1a1a2e",
		charStyle: { bottom: "50px", left: "22%", transform: "translateX(-50%)", width: "45%" } as React.CSSProperties,
		charOffsetX: 80,
		charScale: 1,
	},
	{
		id: "chuhan",
		name: "楚汉争霸",
		tagline: "垓下悲歌 · 霸王绝唱",
		accent: "#d4503c",
		accent2: "#b8973a",
		charStyle: { bottom: "50px", left: "22%", transform: "translateX(-50%)", width: "45%" } as React.CSSProperties,
		charOffsetX: 80,
		charScale: 1,
	},
];

/* ───────────── 游戏模式 ───────────── */
const GAME_MODES = [
	{
		id: "canon",
		title: "正史模式",
		desc: "循史记，亲历历史",
		icon: BookOpen,
		color: "#d4a847",
	},
	{
		id: "free",
		title: "自由模式",
		desc: "改写历史，多结局",
		icon: Compass,
		color: "#5a9fb5",
	},
	{
		id: "duel",
		title: "对决模式",
		desc: "即将上线",
		icon: Swords,
		color: "#d4503c",
		locked: true,
	},
];

export function HomePage() {
	const navigate = useNavigate();
	const progress = useUserStore((s) => s.progress);
	const [current, setCurrent] = useState(0);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		const timer = setInterval(() => {
			setCurrent((i) => (i + 1) % SERIES.length);
		}, 6000);
		return () => clearInterval(timer);
	}, []);

	const series = SERIES[current];

	const handleModeClick = (modeId: string) => {
		if (modeId === "duel") return;
		navigate("/story");
	};

	return (
		<div className="kv-lobby">
			{/* ══════════ 第1层：全屏背景图 ══════════ */}
			<div className="kv-bg-layer">
				{SERIES.map((s, i) => (
					<motion.div
						key={s.id}
						className="kv-bg-img"
						initial={{ opacity: 0 }}
						animate={{ opacity: i === current ? 1 : 0 }}
						transition={{ duration: 1.2, ease: "easeInOut" }}
					>
						<img src={`${KV_BASE}/bg-${s.id}.jpg`} alt="" />
					</motion.div>
				))}
				{/* 暗化遮罩 */}
				<div className="kv-bg-overlay" />
			</div>

			{/* ══════════ 第2层：四角装饰（CSS三角形结构） ══════════ */}
			<div className="kv-corner-layer">
				<AnimatePresence mode="wait">
					<motion.div
						key={`corner-${series.id}`}
						className="kv-corners"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6 }}
						style={{ "--c-accent": series.accent, "--c-accent2": series.accent2 } as React.CSSProperties}
					>
						{/* 左上角 */}
						<motion.div
							className="kv-c kv-c-tl"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<svg width="180" height="180" viewBox="0 0 180 180" fill="none">
								{/* 对角主线 */}
								<line x1="0" y1="0" x2="180" y2="180" stroke="var(--c-accent)" strokeWidth="1.5" opacity="0.3" />
								{/* 外框双线 */}
								<path d="M0 60 Q0 0 60 0" stroke="var(--c-accent)" strokeWidth="2" fill="none" opacity="0.6" />
								<path d="M0 80 Q0 10 80 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<path d="M0 40 Q0 0 40 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								{/* 祥云纹样 */}
								<circle cx="20" cy="25" r="8" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								<circle cx="35" cy="15" r="5" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<path d="M15 40 Q25 30 40 35 Q50 38 55 30" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								{/* 角点装饰 */}
								<circle cx="8" cy="8" r="3" fill="var(--c-accent)" opacity="0.7" />
								<line x1="0" y1="20" x2="25" y2="0" stroke="var(--c-accent)" strokeWidth="0.8" opacity="0.3" />
							</svg>
						</motion.div>
						{/* 右上角 */}
						<motion.div
							className="kv-c kv-c-tr"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.25 }}
						>
							<svg width="180" height="180" viewBox="0 0 180 180" fill="none" style={{ transform: "scaleX(-1)" }}>
								<line x1="0" y1="0" x2="180" y2="180" stroke="var(--c-accent)" strokeWidth="1.5" opacity="0.3" />
								<path d="M0 60 Q0 0 60 0" stroke="var(--c-accent)" strokeWidth="2" fill="none" opacity="0.6" />
								<path d="M0 80 Q0 10 80 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<path d="M0 40 Q0 0 40 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								<circle cx="20" cy="25" r="8" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								<circle cx="35" cy="15" r="5" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<path d="M15 40 Q25 30 40 35 Q50 38 55 30" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<circle cx="8" cy="8" r="3" fill="var(--c-accent)" opacity="0.7" />
								<line x1="0" y1="20" x2="25" y2="0" stroke="var(--c-accent)" strokeWidth="0.8" opacity="0.3" />
							</svg>
						</motion.div>
						{/* 左下角 */}
						<motion.div
							className="kv-c kv-c-bl"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.35 }}
						>
							<svg width="180" height="180" viewBox="0 0 180 180" fill="none" style={{ transform: "scaleY(-1)" }}>
								<line x1="0" y1="0" x2="180" y2="180" stroke="var(--c-accent)" strokeWidth="1.5" opacity="0.3" />
								<path d="M0 60 Q0 0 60 0" stroke="var(--c-accent)" strokeWidth="2" fill="none" opacity="0.6" />
								<path d="M0 80 Q0 10 80 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<path d="M0 40 Q0 0 40 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								<circle cx="20" cy="25" r="8" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								<path d="M10 50 Q20 45 30 50 Q40 52 50 45" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<circle cx="8" cy="8" r="3" fill="var(--c-accent)" opacity="0.7" />
							</svg>
						</motion.div>
						{/* 右下角 */}
						<motion.div
							className="kv-c kv-c-br"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<svg width="180" height="180" viewBox="0 0 180 180" fill="none" style={{ transform: "scale(-1)" }}>
								<line x1="0" y1="0" x2="180" y2="180" stroke="var(--c-accent)" strokeWidth="1.5" opacity="0.3" />
								<path d="M0 60 Q0 0 60 0" stroke="var(--c-accent)" strokeWidth="2" fill="none" opacity="0.6" />
								<path d="M0 80 Q0 10 80 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3" />
								<path d="M0 40 Q0 0 40 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								<circle cx="20" cy="25" r="8" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4" />
								<circle cx="8" cy="8" r="3" fill="var(--c-accent)" opacity="0.7" />
							</svg>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* ══════════ 顶部导航 ══════════ */}
			<header className="kv-nav">
				<div className="kv-nav-left">
					<button className="kv-menu-btn" onClick={() => setShowMobileMenu(true)}>
						<Menu size={22} />
					</button>
					<div className="kv-brand">
						<span className="kv-brand-seal">史</span>
						<div className="kv-brand-text">
							<span className="kv-brand-title">穿越·史记</span>
							<span className="kv-brand-sub">SHIJI · TIMESLIP</span>
						</div>
					</div>
				</div>

				<nav className="kv-nav-links">
					<button className="kv-nav-link active">
						<Play size={14} /> 大厅
					</button>
					<button className="kv-nav-link" onClick={() => navigate("/gacha")}>
						<Sparkles size={14} /> 史册
					</button>
					<button className="kv-nav-link" onClick={() => navigate("/classics")}>
						<BookOpen size={14} /> 典籍
					</button>
					<button className="kv-nav-link" onClick={() => navigate("/archive")}>
						图鉴
					</button>
					<button className="kv-nav-link" onClick={() => navigate("/achieve")}>
						成就
					</button>
				</nav>

				<div className="kv-nav-right">
					<div className="kv-resources">
						<span className="kv-res">
							<span className="kv-res-ico">🎟️</span>
							<span>{progress.gachaTickets}</span>
						</span>
						<span className="kv-res">
							<span className="kv-res-ico">🔹</span>
							<span>{progress.fragments}</span>
						</span>
					</div>
				</div>
			</header>

			{/* ══════════ 第3层：角色立绘 ══════════ */}
			<div className="kv-char-layer">
				<AnimatePresence mode="wait">
					<motion.div
						key={series.id}
						className="kv-char-wrapper"
						style={series.charStyle as React.CSSProperties}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5, ease: "easeInOut" }}
					>
						<motion.img
							src={`${KV_BASE}/char-${series.id}.png`}
							alt={series.name}
							className="kv-char-img"
							initial={{ x: series.charOffsetX, scale: series.charScale! * 0.95 }}
							animate={{ x: 0, scale: series.charScale }}
							exit={{ x: -series.charOffsetX, scale: series.charScale! * 0.95 }}
							transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
						/>
					</motion.div>
				</AnimatePresence>
				{/* 角色光晕 */}
				<AnimatePresence mode="wait">
					<motion.div
						key={`glow-${series.id}`}
						className="kv-char-glow"
						style={{ background: `radial-gradient(ellipse at 70% 80%, ${series.accent}40, transparent 60%)` }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 1.5 }}
					/>
				</AnimatePresence>
			</div>

			{/* ══════════ 主内容 ══════════ */}
			<main className="kv-main">
				{/* 左下角：系列名称 */}
				<motion.div
					className="kv-series-info"
					key={`info-${series.id}`}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
					transition={{ duration: 0.8, delay: 0.5 }}
				>
					<h2 className="kv-series-name" style={{ textShadow: `0 0 30px ${series.accent}80` }}>
						{series.name}
					</h2>
					<p className="kv-series-tagline">{series.tagline}</p>
				</motion.div>

				{/* 右侧：模式按钮 */}
				<div className="kv-modes">
					{GAME_MODES.map((mode, i) => (
						<motion.button
							key={mode.id}
							className={`kv-mode-btn ${mode.locked ? "locked" : ""}`}
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 40 }}
							transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
							onClick={() => handleModeClick(mode.id)}
							style={{
								"--mode-color": mode.color,
							} as React.CSSProperties}
						>
							<div className="kv-mode-inner">
								<mode.icon size={20} className="kv-mode-ico" />
								<div className="kv-mode-text">
									<span className="kv-mode-title">{mode.title}</span>
									<span className="kv-mode-desc">{mode.desc}</span>
								</div>
								{mode.locked ? (
									<Lock size={14} className="kv-mode-lock" />
								) : (
									<ChevronRight size={14} className="kv-mode-arrow" />
								)}
							</div>
							<div className="kv-mode-bar" />
						</motion.button>
					))}
				</div>

				{/* 底部：轮播指示器 */}
				<div className="kv-indicators">
					{SERIES.map((s, i) => (
						<button
							key={s.id}
							className={`kv-dot ${i === current ? "active" : ""}`}
							onClick={() => setCurrent(i)}
							style={i === current ? { background: s.accent, boxShadow: `0 0 12px ${s.accent}` } : {}}
						>
							<span className="kv-dot-label">{s.name}</span>
						</button>
					))}
				</div>
			</main>

			{/* ══════════ 移动端菜单 ══════════ */}
			<AnimatePresence>
				{showMobileMenu && (
					<>
						<motion.div
							className="kv-overlay"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowMobileMenu(false)}
						/>
						<motion.div
							className="kv-mobile-menu"
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
						>
							<div className="kv-mm-head">
								<span className="kv-brand-seal">史</span>
								<span>穿越·史记</span>
								<button onClick={() => setShowMobileMenu(false)}>
									<X size={20} />
								</button>
							</div>
							<nav className="kv-mm-links">
								{[
									{ to: "/", label: "大厅", icon: Play },
									{ to: "/gacha", label: "史册", icon: Sparkles },
									{ to: "/classics", label: "典籍", icon: BookOpen },
									{ to: "/archive", label: "图鉴", icon: BookOpen },
									{ to: "/achieve", label: "成就", icon: Swords },
								].map((item) => (
									<button
										key={item.to}
										onClick={() => {
											setShowMobileMenu(false);
											navigate(item.to);
										}}
									>
										<item.icon size={18} />
										<span>{item.label}</span>
									</button>
								))}
							</nav>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
