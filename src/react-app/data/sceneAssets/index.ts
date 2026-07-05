// 立绘/背景资产汇总。base = 青月 + 楚汉卡池 + 已完成系列（五帝夏）资产。
// 新增系列：建 sceneAssets/<series>.ts 导出 <series>Sprites / <series>Backgrounds，
// 在此 import 合并进 SPRITES / BACKGROUNDS。
import { baseBackgrounds, baseSprites } from "./base";
import type { BgStyle, SpriteInfo } from "./base";
import { chuhanSprites, chuhanBackgrounds } from "./chuhan";

export type { BgStyle, SpriteInfo } from "./base";

export const BACKGROUNDS: Record<string, BgStyle> = {
	...baseBackgrounds,
	...chuhanBackgrounds,
};

export const SPRITES: Record<string, SpriteInfo> = {
	...baseSprites,
	...chuhanSprites,
};

export function getBackground(key: string): BgStyle {
	return BACKGROUNDS[key] ?? BACKGROUNDS.default;
}

export function getSprite(id: string): SpriteInfo {
	return SPRITES[id] ?? { name: id, glyph: id.slice(0, 1), accent: "#7a6e5c" };
}
