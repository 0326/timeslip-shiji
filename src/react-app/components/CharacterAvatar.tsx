import "./common.css";

interface AvatarProps {
	glyph: string;
	accent: string;
	size?: number;
	locked?: boolean;
	ring?: boolean;
}

/** 角色头像占位：单字徽记 + 主题色描边，水墨印章质感 */
export function CharacterAvatar({
	glyph,
	accent,
	size = 64,
	locked = false,
	ring = true,
}: AvatarProps) {
	return (
		<div
			className={`char-avatar${locked ? " locked" : ""}`}
			style={{
				width: size,
				height: size,
				fontSize: size * 0.46,
				borderColor: ring ? accent : "transparent",
				background: `radial-gradient(circle at 50% 35%, ${accent}33, #14110d 70%)`,
				color: locked ? "var(--color-rice-faint)" : accent,
			}}
		>
			<span>{locked ? "?" : glyph}</span>
		</div>
	);
}
