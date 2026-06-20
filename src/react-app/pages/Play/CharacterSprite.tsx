import { getSprite } from "../../data/sceneAssets";
import type { Position } from "../../engine/types";

interface Props {
	id: string;
	position: Position;
	speaking: boolean;
}

export function CharacterSprite({ id, position, speaking }: Props) {
	const sp = getSprite(id);
	return (
		<div className={`vn-sprite pos-${position}${speaking ? " speaking" : ""}`}>
			<div
				className="vn-sprite-figure"
				style={{
					background: `linear-gradient(180deg, ${sp.accent}55, ${sp.accent}22 60%, #14110d)`,
				}}
			>
				{sp.glyph}
			</div>
			<div className="vn-sprite-name">{sp.name}</div>
		</div>
	);
}
