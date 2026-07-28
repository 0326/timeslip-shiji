import type { BgStyle } from "../../data/sceneAssets";

interface Props {
	bg: BgStyle;
	bgKey: string;
}

export function SceneBackground({ bg, bgKey }: Props) {
	const hasVideo = !!bg.video;
	const hasImage = !!bg.image;

	return (
		<>
			{/* 视频背景 — 有AI视频时播放视频 */}
			{hasVideo ? (
				<div key={bgKey} className="vn-bg vn-bg-video">
					<video src={bg.video} autoPlay loop muted playsInline preload="auto" />
				</div>
			) : hasImage ? (
				/* 纯静态图片背景 — 无动效 */
				<div key={bgKey} className="vn-bg vn-bg-image">
					<img src={bg.image} alt={bg.label || ""} />
				</div>
			) : (
				/* 纯渐变背景 */
				<div
					key={bgKey}
					className="vn-bg"
					style={{ background: bg.css }}
				/>
			)}

			{/* 场景色调叠加（仅图片） */}
			{hasImage && !hasVideo && (
				<div
					key={bgKey + "-tint"}
					className="vn-bg-tint"
					style={{ background: bg.css, opacity: 0.15 }}
				/>
			)}

			{bg.label && <div className="vn-bg-label">{bg.label}</div>}
		</>
	);
}
