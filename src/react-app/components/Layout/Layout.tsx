import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
import { Navbar, TabBar } from "./Navbar";
import { AchievementToaster } from "../effects/AchievementToaster";

export function Layout() {
	const location = useLocation();
	const isGamePage = location.pathname === "/" || location.pathname === "/story";

	return (
		<div className={`app-shell ${isGamePage ? "is-home" : ""}`}>
			{!isGamePage && <Navbar />}
			<main className={`page ${isGamePage ? "page-full" : ""}`}>
				<Outlet />
			</main>
			{!isGamePage && (
				<footer className="footer">
					穿越·史记 · 沉浸式历史交互叙事 · 内容据《史记》改编演绎
				</footer>
			)}
			{!isGamePage && <TabBar />}
			<AchievementToaster />
		</div>
	);
}
