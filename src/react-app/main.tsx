import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./minigames"; // 注册全部小游戏
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
