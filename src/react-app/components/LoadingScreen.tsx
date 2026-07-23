import "./common.css";

interface LoadingScreenProps {
	label?: string;
	full?: boolean;
}

export function LoadingScreen({
	label = "正在展开竹简……",
	full = true,
}: LoadingScreenProps) {
	return (
		<div className="loading-screen" style={{ minHeight: full ? "70vh" : 200 }}>
			<div className="loading-scroll">
				<div className="loading-scroll-paper" />
			</div>
			<span className="loading-label">{label}</span>
		</div>
	);
}
