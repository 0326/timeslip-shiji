import { Lightbulb } from "lucide-react";
import { Modal } from "../../components/ui";

interface Props {
	open: boolean;
	onClose: () => void;
	loading: boolean;
	hint: string;
}

export function AiHintModal({ open, onClose, loading, hint }: Props) {
	return (
		<Modal open={open} onClose={onClose}>
			<div className="ai-hint-body">
				<h3 className="serif" style={{ fontSize: 20, display: "flex", alignItems: "center", gap: 8 }}>
					<Lightbulb size={18} className="cyan" /> 史官点拨
				</h3>
				<p className="dim" style={{ fontSize: 13, marginTop: 8 }}>
					我不会直接告诉你答案，只会引你去想。
				</p>
				<div className="ai-hint-bubble">
					{loading ? "史官正在翻阅竹简……" : hint}
				</div>
			</div>
		</Modal>
	);
}
