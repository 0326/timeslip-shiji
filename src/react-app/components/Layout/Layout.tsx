import { Outlet } from "react-router-dom";
import "./Layout.css";
import { Navbar, TabBar } from "./Navbar";
import { AchievementToaster } from "../effects/AchievementToaster";

export function Layout() {
	return (
		<div className="app-shell">
			<Navbar />
			<main className="page">
				<Outlet />
			</main>
			<footer className="footer">
				穿越·史记 · 沉浸式历史交互叙事 · 内容据《史记》改编演绎
			</footer>
			<TabBar />
			<AchievementToaster />
		</div>
	);
}
