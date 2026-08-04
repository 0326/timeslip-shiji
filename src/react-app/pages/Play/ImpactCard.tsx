import { useEffect, useState } from "react";

interface Props {
	choice: string;
	source: string;
	impact: string;
	onClose: () => void;
}

export function ImpactCard({ choice, source, impact, onClose }: Props) {
	const [visible, setVisible] = useState(false);
	const [closing, setClosing] = useState(false);

	useEffect(() => {
		const t = window.setTimeout(() => setVisible(true), 50);
		return () => window.clearTimeout(t);
	}, []);

	function handleClose() {
		if (closing) return;
		setClosing(true);
		setVisible(false);
		window.setTimeout(onClose, 200);
	}

	return (
		<div className="vn-overlay impact-overlay" onClick={handleClose}>
			<div
				className={`impact-card${visible ? " show" : ""}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="impact-seal">史</div>
				<div className="impact-title">史笔落下</div>
				<div className="impact-divider" />

				<div className="impact-section">
					<div className="impact-section-label">— 此刻抉择 —</div>
					<div className="impact-section-body choice">{choice}</div>
				</div>

				<div className="impact-section">
					<div className="impact-section-label">— 史记原文 —</div>
					<div className="impact-section-body source">{source}</div>
				</div>

				<div className="impact-section">
					<div className="impact-section-label">— 历史影响 —</div>
					<div className="impact-section-body impact">{impact}</div>
				</div>

				<div className="impact-hint">点击任意处继续</div>
			</div>
		</div>
	);
}
