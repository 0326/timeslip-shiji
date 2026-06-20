interface ProgressBarProps {
	value: number; // 0—100
	tone?: "gold" | "cyan";
}

export function ProgressBar({ value, tone = "gold" }: ProgressBarProps) {
	const pct = Math.max(0, Math.min(100, value));
	return (
		<div className={tone === "cyan" ? "progress progress-cyan" : "progress"}>
			<div className="progress-fill" style={{ width: `${pct}%` }} />
		</div>
	);
}
