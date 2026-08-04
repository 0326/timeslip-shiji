import { useEffect, useRef, useState } from "react";
import type { BgStyle } from "../../data/sceneAssets";

interface Props {
	bg: BgStyle;
	bgKey: string;
}

const FRAME_DURATION = 8000; // 每张分镜展示 8 秒
const FADE_DURATION = 1200; // 交叉淡入时长 1.2 秒

/** 检测是否为参考图集图片（来自0349素材库），需要水墨风格滤镜统一 */
function isRefImage(src?: string): boolean {
	return !!src && src.includes("/ref/");
}

export function SceneBackground({ bg, bgKey }: Props) {
	const hasVideo = !!bg.video;
	const hasImages = !!bg.images && bg.images.length > 1;
	const hasSingleImage = !!bg.image || (!!bg.images && bg.images.length === 1);
	const singleImg = bg.image ?? (bg.images ? bg.images[0] : undefined);
	const isRef = isRefImage(singleImg);

	// 分镜轮播状态
	const [frameIndex, setFrameIndex] = useState(0);
	const [prevIndex, setPrevIndex] = useState(0);
	const [fading, setFading] = useState(false);
	const timerRef = useRef<number | null>(null);
	const fadeTimerRef = useRef<number | null>(null);

	// bgKey 变化时重置轮播
	useEffect(() => {
		setFrameIndex(0);
		setPrevIndex(0);
		setFading(false);
		if (timerRef.current) {
			window.clearInterval(timerRef.current);
			timerRef.current = null;
		}
		if (fadeTimerRef.current) {
			window.clearTimeout(fadeTimerRef.current);
			fadeTimerRef.current = null;
		}
	}, [bgKey]);

	// 分镜自动轮播
	useEffect(() => {
		if (!hasImages || !bg.images) return;

		timerRef.current = window.setInterval(() => {
			setPrevIndex(frameIndex);
			setFading(true);
			const next = (frameIndex + 1) % bg.images!.length;

			// 淡入完成后更新当前帧
			fadeTimerRef.current = window.setTimeout(() => {
				setFrameIndex(next);
				setFading(false);
			}, FADE_DURATION);
		}, FRAME_DURATION);

		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
			if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
		};
	}, [hasImages, bg.images, frameIndex]);

	return (
		<>
			{/* 视频背景 — 最高优先级 */}
			{hasVideo ? (
				<div key={bgKey} className="vn-bg vn-bg-video">
					<video src={bg.video} autoPlay loop muted playsInline preload="auto" />
				</div>
			) : hasImages && bg.images ? (
				/* 分镜轮播背景 */
				<div key={bgKey} className="vn-bg vn-bg-image">
					{/* 上一帧（淡出中） */}
					<img
						src={bg.images[prevIndex]}
						alt={`${bg.label} ${prevIndex + 1}`}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							opacity: fading ? 0 : 1,
							transition: `opacity ${FADE_DURATION}ms ease-in-out`,
						}}
					/>
					{/* 当前帧（淡入中） */}
					<img
						src={bg.images[frameIndex]}
						alt={`${bg.label} ${frameIndex + 1}`}
						style={{
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
							objectFit: "cover",
							opacity: fading ? 1 : 1,
							transition: `opacity ${FADE_DURATION}ms ease-in-out`,
						}}
					/>
				</div>
			) : hasSingleImage && singleImg ? (
				/* 单张图片背景 */
				<div key={bgKey} className={`vn-bg vn-bg-image${isRef ? " vn-bg-ref" : ""}`}>
					<img src={singleImg} alt={bg.label || ""} />
					{isRef && <div className="vn-bg-ink-overlay" />}
				</div>
			) : (
				/* 纯渐变背景 */
				<div key={bgKey} className="vn-bg" style={{ background: bg.css }} />
			)}

			{/* 场景色调叠加（仅图片模式，不含视频）— ref图加强叠加以统一风格 */}
			{(hasSingleImage || hasImages) && !hasVideo && (
				<div
					key={bgKey + "-tint"}
					className="vn-bg-tint"
					style={{ background: bg.css, opacity: isRef ? 0.28 : 0.15 }}
				/>
			)}

			{bg.label && <div className="vn-bg-label">{bg.label}</div>}
		</>
	);
}
