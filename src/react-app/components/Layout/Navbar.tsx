import { NavLink } from "react-router-dom";
import { Home, Sparkles, BookMarked, Trophy, Library } from "lucide-react";
import { useUserStore } from "../../store/userStore";

const NAV = [
	{ to: "/", label: "首页", icon: Home, end: true },
	{ to: "/gacha", label: "史册", icon: Sparkles, end: false },
	{ to: "/classics", label: "典籍", icon: Library, end: false },
	{ to: "/archive", label: "图鉴", icon: BookMarked, end: false },
	{ to: "/achieve", label: "成就", icon: Trophy, end: false },
];

export function Navbar() {
	const { gachaTickets, fragments, points } = useUserStore((s) => s.progress);

	return (
		<header className="navbar">
			<div className="navbar-inner">
				<NavLink to="/" className="brand">
					<span className="brand-seal">史</span>
					<span className="brand-name">
						穿越·史记
						<small>SHIJI · TIMESLIP</small>
					</span>
				</NavLink>

				<nav className="nav-links">
					{NAV.map(({ to, label, icon: Icon, end }) => (
						<NavLink key={to} to={to} end={end} className="nav-link">
							<Icon size={16} />
							{label}
						</NavLink>
					))}
				</nav>

				<div className="nav-spacer" />

				<div className="resources">
					<span className="resource ticket" title="抽卡券">
						<span className="ico">🎟️</span>
						{gachaTickets}
					</span>
					<span className="resource fragment" title="记忆碎片">
						<span className="ico">🔹</span>
						{fragments}
					</span>
					<span className="resource point" title="积分">
						<span className="ico">✦</span>
						{points}
					</span>
				</div>
			</div>
		</header>
	);
}

export function TabBar() {
	return (
		<nav className="tabbar">
			{NAV.map(({ to, label, icon: Icon, end }) => (
				<NavLink key={to} to={to} end={end} className="tab">
					<Icon size={20} />
					{label}
				</NavLink>
			))}
		</nav>
	);
}
