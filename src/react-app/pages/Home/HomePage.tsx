import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Swords,
  BookOpen,
  Compass,
  Lock,
  ChevronRight,
} from "lucide-react";
import "./Home.css";
import { AppNav } from "../../components/Layout/AppNav";
import { useBgmPlayer } from "../../hooks/useBgmPlayer";
import { useUiStore } from "../../store/uiStore";

/* ───────────── KV 图片基础路径 ───────────── */
const KV_BASE = import.meta.env.VITE_KV_BASE_URL || "/images/kv";

/* ───────────── 游戏模式 ───────────── */
const GAME_MODES = [
  {
    id: "canon",
    title: "正史模式",
    desc: "循史记，亲历历史",
    icon: BookOpen,
    color: "#d4a847",
    locked: false,
    storyLocked: false,
  },
  {
    id: "free",
    title: "自由模式",
    desc: "随心穿越，自由探索",
    icon: Compass,
    color: "#5a9fb5",
    locked: false,
    storyLocked: false,
  },
  {
    id: "duel",
    title: "对决模式",
    desc: "史家对决，一争高下",
    icon: Swords,
    color: "#d4503c",
    locked: false,
    storyLocked: false,
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgmEnabled = useUiStore((s) => s.bgmEnabled);
  const { playTrack, stop } = useBgmPlayer({ enabled: bgmEnabled });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 首页 BGM：史诗庄重风格，进入页面即播放（若用户开启了音效）
  useEffect(() => {
    if (mounted && bgmEnabled) {
      playTrack("epic_1");
    }
    return () => {
      stop();
    };
  }, [mounted, bgmEnabled, playTrack, stop]);

  const handleVideoError = useCallback(() => {
    setVideoFailed(true);
  }, []);

  const handleModeClick = (mode: (typeof GAME_MODES)[number]) => {
    if (mode.locked) return;
    if (mode.id === "duel") {
      navigate("/duel");
    } else {
      navigate(`/story?mode=${mode.id}`);
    }
  };

  return (
    <div className="kv-lobby">
      {/* ══════════ 第1层：全屏背景（视频优先，图片兜底） ══════════ */}
      <div className="kv-bg-layer">
        <div className="kv-bg-img">
          <img src={`${KV_BASE}/bg-wudi.jpg`} alt="" />
        </div>
        {/* 视频背景：加载成功时覆盖图片，失败时回退到图片 */}
        {!videoFailed && (
          <video
            ref={videoRef}
            className="kv-bg-video"
            src={`${KV_BASE}/home-video.mp4`}
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
          />
        )}
        {/* 暗化遮罩 */}
        <div className="kv-bg-overlay" />
      </div>



      {/* ══════════ 统一导航（大厅模式：无logo、渐变透明） ══════════ */}
      <AppNav variant="lobby" />

      {/* ══════════ 主内容：Logo + 模式按钮 ══════════ */}
      <main className="kv-main">
        {/* Logo - 页面居中 */}
        <div className="kv-logo-wrap">
          <motion.img
            className="kv-logo-center"
            src={`${KV_BASE}/cysj-logo.webp`}
            alt="穿越·史记"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          {/* 流光层：以 Logo 图形为 mask，光带只在字形内部扫过 */}
          <span
            className="kv-logo-sheen"
            aria-hidden
            style={
              {
                WebkitMaskImage: `url(${KV_BASE}/cysj-logo.webp)`,
                maskImage: `url(${KV_BASE}/cysj-logo.webp)`,
              } as React.CSSProperties
            }
          />
        </div>

        {/* 右侧模式按钮 */}
        <div className="kv-modes">
            {GAME_MODES.map((mode, i) => (
              <motion.button
                key={mode.id}
                className={`kv-mode-btn ${mode.locked ? "locked" : ""} ${mode.storyLocked ? "story-locked" : ""}`}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 40 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                onClick={() => handleModeClick(mode)}
                style={
                  {
                    "--mode-color": mode.color,
                  } as React.CSSProperties
                }
              >
                <div className="kv-mode-inner">
                  <mode.icon size={22} className="kv-mode-ico" />
                  <div className="kv-mode-text">
                    <span className="kv-mode-title">{mode.title}</span>
                    <span className="kv-mode-desc">{mode.desc}</span>
                  </div>
                  {mode.locked || mode.storyLocked ? (
                    <Lock size={16} className="kv-mode-lock" />
                  ) : (
                    <ChevronRight size={16} className="kv-mode-arrow" />
                  )}
                </div>
                <div className="kv-mode-bar" />
              </motion.button>
            ))}
        </div>
      </main>

      {/* ══════════ 祥云装饰（底部靠右 + 左上角镜像） ══════════ */}
      <div className="kv-cloud-wrap kv-cloud-wrap-br">
        <motion.img
          className="kv-cloud"
          src={`${KV_BASE}/auspicious_cloud.webp`}
          alt=""
          initial={{ opacity: 0 }}
          animate={{
            opacity: mounted ? 1 : 0,
            y: [0, -10, 0, 6, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: 0.6 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
          }}
        />
      </div>
      <div className="kv-cloud-wrap kv-cloud-wrap-tl">
        <motion.img
          className="kv-cloud"
          src={`${KV_BASE}/auspicious_cloud.webp`}
          alt=""
          initial={{ opacity: 0 }}
          animate={{
            opacity: mounted ? 1 : 0,
            y: [0, 8, 0, -10, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: 0.8 },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
          }}
        />
      </div>
    </div>
  );
}
