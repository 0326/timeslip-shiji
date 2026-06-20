import { ScrollText } from "lucide-react";
import { Drawer } from "../../components/ui";

interface Props {
	open: boolean;
	onClose: () => void;
	text: string;
}

export function ClassicalHint({ open, onClose, text }: Props) {
	return (
		<Drawer open={open} onClose={onClose}>
			<div className="hint-drawer-pad">
				<h3 className="serif" style={{ fontSize: 20, display: "flex", alignItems: "center", gap: 8 }}>
					<ScrollText size={18} className="cyan" /> 原文提示
				</h3>
				<p className="dim" style={{ fontSize: 13, marginTop: 8 }}>
					文言不是门槛，是通关的线索。正确的选择，往往就藏在这几句里。
				</p>
				<div className="classical-text">「{text}」</div>
				<p className="dim" style={{ fontSize: 13, lineHeight: 1.9 }}>
					读不懂没关系——留意人物的动作、神色和语气词，它们常常指向那个唯一符合历史的选择。
				</p>
			</div>
		</Drawer>
	);
}
