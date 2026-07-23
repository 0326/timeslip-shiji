import { getSprite } from "../../data/sceneAssets";
import type { Position } from "../../engine/types";

interface Props {
	id: string;
	position: Position;
	speaking: boolean;
	expression?: string;
}

export function CharacterSprite({ id, position, speaking, expression }: Props) {
	const sp = getSprite(id);

	// 根据表情选择立绘：优先 expression 对应的文件，回退 default
	const variants = sp.variants ?? {};
	const imgSrc = expression && variants[expression] ? variants[expression] : sp.full;
	const hasImage = !!imgSrc;

	return (
		<div className={`vn-sprite pos-${position}${speaking ? " speaking" : ""}`}>
			{hasImage ? (
				<img
					className="vn-sprite-image"
					src={imgSrc}
					alt={sp.name}
					loading="eager"
					draggable={false}
				/>
			) : (
				<div
					className="vn-sprite-figure"
					style={{
						background: `linear-gradient(180deg, ${sp.accent}55, ${sp.accent}22 60%, #14110d)`,
					}}
				>
					{sp.glyph}
				</div>
			)}
			<div className="vn-sprite-name">{sp.name}</div>
		</div>
	);
}
