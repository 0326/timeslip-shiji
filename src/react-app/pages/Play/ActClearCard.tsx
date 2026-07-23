import { useEffect } from "react";

interface Props {
	actName: string;
	actIndex: number;
	deaths: number;
	correctRate: number;
	onClose: () => void;
}

export function ActClearCard({ actName, actIndex, deaths, correctRate, onClose }: Props) {
	useEffect(() => {
		const timer = window.setTimeout(onClose, 1800);
		return () => window.clearTimeout(timer);
	}, [onClose]);

	const cnNum = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
	const actLabel = cnNum[actIndex - 1] ?? String(actIndex);

	return (
		<div className="vn-overlay actclear-overlay" onClick={onClose}>
			<div className="actclear-card" onClick={(e) => e.stopPropagation()}>
				<div className="actclear-border" />
				<div className="actclear-seal">幕</div>
				<div className="actclear-title">{actName || `第${actLabel}幕`}</div>
				<div className="actclear-subtitle">第{actLabel}幕 · 完</div>
				<div className="actclear-stats">
					<div className="actclear-stat">
						<div className="v">{Math.round(correctRate * 100)}%</div>
						<div className="l">史实契合</div>
					</div>
					<div className="actclear-stat">
						<div className="v">{deaths}</div>
						<div className="l">折戟次数</div>
					</div>
				</div>
				<div className="actclear-hint">点击任意处继续</div>
			</div>
		</div>
	);
}
