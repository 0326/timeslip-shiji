import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	Home,
	BookMarked,
	Trophy,
	Library,
	ScrollText,
	Volume2,
	VolumeX,
	Menu,
	X,
} from "lucide-react";
import { useUserStore } from "../../store/userStore";
import { useUiStore } from "../../store/uiStore";
import { UserMenu } from "../Auth/UserMenu";
import "./AppNav.css";

/* ── 导航项（游戏菜单页签） ── */
const NAV_ITEMS = [
	{ to: "/", label: "大厅", icon: Home, end: true },
	{ to: "/classics", label: "典籍", icon: Library, end: false },
	{ to: "/archive", label: "图鉴", icon: BookMarked, end: false },
	// 召唤（/gacha）暂时隐藏，功能保留待启用
	{ to: "/codex/deaths", label: "史鉴", icon: ScrollText, end: false },
	{ to: "/achieve", label: "成就", icon: Trophy, end: false },
];

/* ── 当前面板标题（HUD 左侧印章 + 题名） ── */
const PANEL_TITLES: Array<[RegExp, { seal: string; title: string }]> = [
	[/^\/story/, { seal: "篇", title: "选择篇章" }],
	[/^\/gacha/, { seal: "召", title: "观相召唤" }],
	[/^\/archive/, { seal: "鉴", title: "角色图鉴" }],
	[/^\/achieve/, { seal: "成", title: "成就墙" }],
	[/^\/codex/, { seal: "史", title: "史鉴录" }],
	[/^\/classics/, { seal: "典", title: "典籍阁" }],
	[/^\/panorama/, { seal: "览", title: "全景视图" }],
];

interface AppNavProps {
	/** 大厅模式：首页全屏KV使用（绝对定位、渐变透明背景）
	 *  页面模式：内页游戏 HUD（返回大厅 + 面板题名 + 页签 + 资源） */
	variant?: "lobby" | "page";
}

export function AppNav({ variant = "page" }: AppNavProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { gachaTickets, fragments, points } = useUserStore((s) => s.progress);
	const openAuth = useUiStore((s) => s.openAuthModal);
	const sfxEnabled = useUiStore((s) => s.sfxEnabled);
	const toggleSfx = useUiStore((s) => s.toggleSfx);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const isLobby = variant === "lobby";
	const panel = PANEL_TITLES.find(([re]) => re.test(location.pathname))?.[1];

	return (
		<>
			{/* ── 顶部 HUD ── */}
			<header className={`appnav ${isLobby ? "appnav-lobby" : "appnav-page"}`}>
				<div className="appnav-inner">
					{/* 左侧：返回大厅 + 当前面板题名 */}
					<div className="appnav-left">
						<button
							className="appnav-menu-btn"
							onClick={() => setMobileMenuOpen(true)}
						>
							<Menu size={20} />
						</button>

						{!isLobby && (
							<>
								<button
									className="appnav-back"
									onClick={() => navigate("/")}
									title="返回大厅（Esc）"
								>
									<ArrowLeft size={15} />
									大厅
								</button>
								{panel && (
									<span className="appnav-panel">
										<span className="appnav-panel-seal seal">
											{panel.seal}
										</span>
										<span className="appnav-panel-title">{panel.title}</span>
									</span>
								)}
							</>
						)}
					</div>

					{/* 中间：菜单页签 */}
					<nav className="appnav-links">
						{NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
							const active = end
								? location.pathname === to
								: location.pathname.startsWith(to);
							return (
								<button
									key={to}
									className={`appnav-link ${active ? "active" : ""}`}
									onClick={() => navigate(to)}
								>
									<Icon size={14} />
									{label}
								</button>
							);
						})}
					</nav>

					{/* 右侧：资源 + 音效开关 + 用户 */}
					<div className="appnav-right">
						<div className="appnav-resources">
							<span className="appnav-res ticket" title="抽卡券">
								<span className="appnav-res-ico">🎟️</span>
								{gachaTickets}
							</span>
							<span className="appnav-res fragment" title="记忆碎片">
								<span className="appnav-res-ico">🔹</span>
								{fragments}
							</span>
							{!isLobby && (
								<span className="appnav-res point" title="积分">
									<span className="appnav-res-ico">✦</span>
									{points}
								</span>
							)}
						</div>

						<button
							className="appnav-icon-btn"
							data-no-sfx
							onClick={toggleSfx}
							title={sfxEnabled ? "关闭音效" : "开启音效"}
						>
							{sfxEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
						</button>

						<UserMenu onOpenLogin={(mode) => openAuth(mode ?? "login")} />
					</div>
				</div>
			</header>

			{/* ── 底栏（仅 page 模式 + 移动端） ── */}
			{!isLobby && (
				<nav className="appnav-tabbar">
					{NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
						const active = end
							? location.pathname === to
							: location.pathname.startsWith(to);
						return (
							<button
								key={to}
								className={`appnav-tab ${active ? "active" : ""}`}
								onClick={() => navigate(to)}
							>
								<Icon size={20} />
								{label}
							</button>
						);
					})}
				</nav>
			)}

			{/* ── 移动端侧边菜单 ── */}
			{mobileMenuOpen && (
				<div
					className="appnav-mobile-overlay"
					onClick={() => setMobileMenuOpen(false)}
				>
					<div
						className="appnav-mobile-drawer"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="appnav-mobile-head">
							<NavLink
								to="/"
								className="appnav-brand"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="appnav-brand-seal">史</span>
								<span className="appnav-brand-name">穿越·史记</span>
							</NavLink>
							<button onClick={() => setMobileMenuOpen(false)}>
								<X size={20} />
							</button>
						</div>
						<nav className="appnav-mobile-links">
							{NAV_ITEMS.map(({ to, label, icon: Icon }) => {
								const active =
									Icon === Home
										? location.pathname === "/"
										: location.pathname.startsWith(to);
								return (
									<button
										key={to}
										className={`appnav-mobile-link ${active ? "active" : ""}`}
										onClick={() => {
											setMobileMenuOpen(false);
											navigate(to);
										}}
									>
										<Icon size={18} />
										{label}
									</button>
								);
							})}
						</nav>
					</div>
				</div>
			)}
		</>
	);
}
