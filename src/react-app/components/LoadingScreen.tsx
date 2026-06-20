interface LoadingScreenProps {
	label?: string;
	full?: boolean;
}

export function LoadingScreen({ label = "正在展开竹简……", full = true }: LoadingScreenProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 18,
				minHeight: full ? "70vh" : 200,
				color: "var(--color-rice-dim)",
			}}
		>
			<div
				style={{
					width: 46,
					height: 46,
					borderRadius: "50%",
					border: "3px solid var(--color-ink-mid)",
					borderTopColor: "var(--color-gold)",
					animation: "spinSlow 0.9s linear infinite",
				}}
			/>
			<span className="serif" style={{ letterSpacing: "0.1em" }}>
				{label}
			</span>
		</div>
	);
}
