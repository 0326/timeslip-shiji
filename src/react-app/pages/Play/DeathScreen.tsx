import { RotateCcw, ScrollText } from "lucide-react";

interface Props {
	reason: string;
	classical: string;
	analysis: string;
	onRetry: () => void;
	onReadSource: () => void;
}

export function DeathScreen({ reason, classical, analysis, onRetry, onReadSource }: Props) {
	return (
		<div className="vn-overlay death">
			<div className="death-card">
				<div className="death-seal">殁</div>
				<h2 className="serif">历史改道</h2>
				<p className="death-reason">{reason}</p>

				<div className="death-block">
					<div className="lbl">原文中早有线索</div>
					<div className="classical">「{classical}」</div>
					<div className="analysis">{analysis}</div>
				</div>

				<div className="actions">
					<button className="btn btn-vermilion" onClick={onRetry}>
						<RotateCcw size={16} /> 重新抉择
					</button>
					<button className="btn btn-ghost" onClick={onReadSource}>
						<ScrollText size={16} /> 细读原文
					</button>
				</div>
			</div>
		</div>
	);
}
