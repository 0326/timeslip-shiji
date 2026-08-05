import { RotateCcw, ScrollText, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
	reason: string;
	classical: string;
	analysis: string;
	onRetry: () => void;
	onReadSource: () => void;
	collected?: boolean;
}

export function DeathScreen({ reason, classical, analysis, onRetry, onReadSource, collected }: Props) {
	const navigate = useNavigate();
	return (
		<div className="vn-overlay death">
			<div className="death-card">
				{collected && (
					<div className="death-collected-badge" title="已收录到史鉴录">
						<BookOpen size={12} /> 已入史鉴
					</div>
				)}
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
					<button className="btn btn-ghost" onClick={() => navigate("/codex")}>
						<BookOpen size={16} /> 查看史鉴
					</button>
				</div>
			</div>
		</div>
	);
}
