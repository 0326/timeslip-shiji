import "./common.css";

interface AvatarProps {
	glyph: string;
	accent: string;
	size?: number;
	locked?: boolean;
	ring?: boolean;
	/** 主项目头像 URL，有则显示真实头像，无则 fallback glyph 占位 */
	avatarUrl?: string | null;
}

/** 角色头像：优先显示主项目真实头像，无则用单字徽记 + 主题色描边占位 */
export function CharacterAvatar({
	glyph,
	accent,
	size = 64,
	locked = false,
	ring = true,
	avatarUrl,
}: AvatarProps) {
	const showImage = avatarUrl && !locked;

	return (
		<div
			className={`char-avatar${locked ? " locked" : ""}`}
			style={{
				width: size,
				height: size,
				fontSize: size * 0.46,
				borderColor: ring ? accent : "transparent",
				background: showImage
					? "transparent"
					: `radial-gradient(circle at 50% 35%, ${accent}33, #14110d 70%)`,
				color: locked ? "var(--color-rice-faint)" : accent,
				overflow: "hidden",
			}}
		>
			{showImage ? (
				<img
					src={avatarUrl}
					alt={glyph}
					loading="lazy"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						display: "block",
					}}
					onError={(e) => {
						// 图片加载失败，降级为 glyph 占位
						const target = e.currentTarget;
						target.style.display = "none";
						const parent = target.parentElement;
						if (parent) {
							parent.style.background = `radial-gradient(circle at 50% 35%, ${accent}33, #14110d 70%)`;
							parent.style.color = accent;
						}
					}}
				/>
			) : (
				<span>{locked ? "?" : glyph}</span>
			)}
		</div>
	);
}
