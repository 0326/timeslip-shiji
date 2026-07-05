import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingScreen } from "./components/LoadingScreen";
import { HomePage } from "./pages/Home/HomePage";
import { StorySelectPage } from "./pages/Story/StorySelectPage";
import { GachaPage } from "./pages/Gacha/GachaPage";
import { ArchivePage } from "./pages/Archive/ArchivePage";
import { AchievementPage } from "./pages/Achievement/AchievementPage";
import { ClassicsPage } from "./pages/Classics/ClassicsPage";

// 重页面代码分割（D3 / VN 引擎 / 长篇原文）
const PlayPage = lazy(() => import("./pages/Play/PlayPage"));
const PanoramaPage = lazy(() => import("./pages/Panorama/PanoramaPage"));
const ClassicReaderPage = lazy(() => import("./pages/Classics/ClassicReaderPage"));
const ArchiveDetailPage = lazy(() => import("./pages/Archive/ArchiveDetailPage"));

function lazyEl(node: React.ReactNode) {
	return <Suspense fallback={<LoadingScreen />}>{node}</Suspense>;
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "story", element: <StorySelectPage /> },
			{ path: "gacha", element: <GachaPage /> },
			{ path: "archive", element: <ArchivePage /> },
			{ path: "archive/:id", element: lazyEl(<ArchiveDetailPage />) },
			{ path: "achieve", element: <AchievementPage /> },
			{ path: "classics", element: <ClassicsPage /> },
			{ path: "classics/:juan", element: lazyEl(<ClassicReaderPage />) },
			{ path: "panorama/:storyId", element: lazyEl(<PanoramaPage />) },
		],
	},
	// 游戏主界面：全屏，无导航
	{ path: "/play/:storyId/:charId", element: lazyEl(<PlayPage />) },
]);

export default function App() {
	return (
		<ErrorBoundary>
			<RouterProvider router={router} />
		</ErrorBoundary>
	);
}
