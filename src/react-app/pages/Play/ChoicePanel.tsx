import { ScrollText, Lightbulb } from "lucide-react";
import type { StoryChoice } from "../../engine/types";

interface Props {
	choices: StoryChoice[];
	onChoose: (index: number) => void;
	onOpenHint: () => void;
	onAskAi: () => void;
	hasHint: boolean;
}

export function ChoicePanel({ choices, onChoose, onOpenHint, onAskAi, hasHint }: Props) {
	return (
		<div className="vn-choices">
			<div className="prompt">— 你将如何抉择 —</div>
			{choices.map((c, i) => (
				<button
					key={i}
					className="choice-btn"
					style={{ animationDelay: `${i * 80}ms` }}
					onClick={() => onChoose(c.index)}
				>
					{c.text}
				</button>
			))}
			<div className="choice-hint-bar">
				{hasHint && (
					<button className="btn btn-ghost btn-sm" onClick={onOpenHint}>
						<ScrollText size={14} /> 原文提示
					</button>
				)}
				<button className="btn btn-ghost btn-sm" onClick={onAskAi}>
					<Lightbulb size={14} /> 请史官点拨
				</button>
			</div>
		</div>
	);
}
