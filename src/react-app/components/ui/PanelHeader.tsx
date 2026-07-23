import type { ReactNode } from "react";

interface PanelStat {
	value: ReactNode;
	label: string;
}

interface PanelHeaderProps {
	/** 印章字（单字） */
	seal: string;
	title: string;
	sub?: string;
	/** 右侧统计胶囊 */
	stats?: PanelStat[];
	/** 右侧自定义内容（在 stats 之后） */
	children?: ReactNode;
	className?: string;
}

export function PanelHeader({
	seal,
	title,
	sub,
	stats,
	children,
	className = "",
}: PanelHeaderProps) {
	return (
		<header className={`panel-head ${className}`}>
			<span className="panel-head-seal seal">{seal}</span>
			<div className="panel-head-text">
				<h1>{title}</h1>
				{sub && <p className="panel-head-sub">{sub}</p>}
			</div>
			{(stats?.length || children) && (
				<div className="panel-head-stats">
					{stats?.map((s) => (
						<span key={s.label} className="panel-stat">
							<b>{s.value}</b>
							<span>{s.label}</span>
						</span>
					))}
					{children}
				</div>
			)}
		</header>
	);
}
