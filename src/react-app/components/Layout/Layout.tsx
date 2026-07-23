import { useEffect } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./Layout.css";
import { AppNav } from "./AppNav";
import { AchievementToaster } from "../effects/AchievementToaster";
import { AuthModal } from "../Auth/AuthModal";
import { useUiStore } from "../../store/uiStore";
import { sfx } from "../../lib/sfx";

const KV_BASE = import.meta.env.VITE_KV_BASE_URL || "/images/kv";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const isGamePage =
    location.pathname === "/" || location.pathname.startsWith("/story");
  const authModalOpen = useUiStore((s) => s.authModalOpen);
  const authModalMode = useUiStore((s) => s.authModalMode);
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);

  // Esc = 返回上一级（浮层打开时交给浮层自身处理）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (
        document.querySelector(
          ".modal-overlay, .drawer-overlay, .appnav-mobile-overlay, .ad-drawer-backdrop",
        )
      )
        return;
      if (location.pathname === "/") return;
      sfx.play("close");
      if (typeof window.history.state?.idx === "number" && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate("/");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [location.pathname, navigate]);

  return (
    <div className={`app-shell ${isGamePage ? "is-home" : ""}`}>
      {/* ── GameStage：跨页面持续存在的水墨舞台背景（仅内页） ── */}
      {!isGamePage && (
        <div className="stage" aria-hidden>
          <div
            className="stage-img"
            style={{ backgroundImage: `url(${KV_BASE}/bg-wudi.jpg)` }}
          />
          <div className="stage-veil" />
        </div>
      )}
      {!isGamePage && <AppNav variant="page" />}

      {/* ── 面板过渡：切页 = 打开新菜单面板，背景不动 ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          className={`page ${isGamePage ? "page-full" : ""}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      <AchievementToaster />
      {/* 全局登录/注册弹窗（单例，由 uiStore 控制，任意页面可触发） */}
      <AuthModal
        open={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </div>
  );
}
