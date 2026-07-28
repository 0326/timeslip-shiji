import { Suspense, lazy, useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { sfx } from "./lib/sfx";
import { Layout } from "./components/Layout/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingScreen } from "./components/LoadingScreen";
import { HomePage } from "./pages/Home/HomePage";
import { StorySelectPage } from "./pages/Story/StorySelectPage";
import { SeriesChapterPage } from "./pages/Story/SeriesChapterPage";
import { ArchivePage } from "./pages/Archive/ArchivePage";
import { AchievementPage } from "./pages/Achievement/AchievementPage";
import { ClassicsPage } from "./pages/Classics/ClassicsPage";
import { DeathsCodexPage } from "./pages/Codex/DeathsCodexPage";
import { EndingsCodexPage } from "./pages/Codex/EndingsCodexPage";
import { useAuthStore } from "./store/authStore";

// 重页面代码分割（D3 / VN 引擎 / 长篇原文）
const PlayPage = lazy(() => import("./pages/Play/PlayPage"));
const PanoramaPage = lazy(() => import("./pages/Panorama/PanoramaPage"));
const ClassicReaderPage = lazy(
  () => import("./pages/Classics/ClassicReaderPage"),
);
const ArchiveDetailPage = lazy(
  () => import("./pages/Archive/ArchiveDetailPage"),
);

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
      { path: "story/:seriesId", element: <SeriesChapterPage /> },
      // 召唤（/gacha）暂时隐藏，页面与菜单入口下线，直达重定向回大厅
      { path: "gacha", element: <Navigate to="/" replace /> },
      { path: "archive", element: <ArchivePage /> },
      { path: "archive/:id", element: lazyEl(<ArchiveDetailPage />) },
      { path: "achieve", element: <AchievementPage /> },
      { path: "codex/deaths", element: <DeathsCodexPage /> },
      { path: "codex/endings", element: <EndingsCodexPage /> },
      { path: "classics", element: <ClassicsPage /> },
      { path: "classics/:juan", element: lazyEl(<ClassicReaderPage />) },
      { path: "panorama/:storyId", element: lazyEl(<PanoramaPage />) },
    ],
  },
  // 游戏主界面：全屏，无导航
  { path: "/play/:storyId/:charId", element: lazyEl(<PlayPage />) },
]);

function AuthInitializer() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
  return null;
}

/** 全局 UI 音效：事件委托覆盖所有按钮/链接（含 /play），data-no-sfx 可豁免 */
function SfxDelegator() {
  useEffect(() => {
    const interactive = (t: EventTarget | null) =>
      (t as HTMLElement | null)?.closest?.(
        "button, a, [role='button']",
      ) as HTMLElement | null;
    const onClick = (e: MouseEvent) => {
      const el = interactive(e.target);
      if (el && !el.hasAttribute("data-no-sfx")) sfx.play("click");
    };
    const onOver = (e: PointerEvent) => {
      const el = interactive(e.target);
      if (!el || el.hasAttribute("data-no-sfx")) return;
      if (el.contains(e.relatedTarget as Node)) return; // 元素内部移动不重复触发
      sfx.play("hover");
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onOver, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onOver, true);
    };
  }, []);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthInitializer />
      <SfxDelegator />
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
