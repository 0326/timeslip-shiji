// 立绘/背景资产汇总。base = 青月 + 楚汉卡池 + 已完成系列（五帝夏）资产。
// 新增系列：建 sceneAssets/<series>.ts 导出 <series>Sprites / <series>Backgrounds，
// 在此 import 合并进 SPRITES / BACKGROUNDS。
import { baseBackgrounds, baseSprites } from "./base";
import type { BgStyle, SpriteInfo } from "./base";
import { chuhanSprites, chuhanBackgrounds } from "./chuhan";
import { shangSprites, shangBackgrounds } from "./shang";
import { chunqiuSprites, chunqiuBackgrounds } from "./chunqiu";
import { hanwuSprites, hanwuBackgrounds } from "./hanwu";
import { zhanguoSprites, zhanguoBackgrounds } from "./zhanguo";
import { hanchuSprites, hanchuBackgrounds } from "./hanchu";
import { qinSprites, qinBackgrounds } from "./qin";
import { xizhouSprites, xizhouBackgrounds } from "./xizhou";
import { zhuziSprites, zhuziBackgrounds } from "./zhuzi";
import { qunxiangSprites, qunxiangBackgrounds } from "./qunxiang";
import { getArchiveCGUrl } from "./archivePortraits";
export { SPRITE_IDENTITY_MAP } from "./archiveIdentities";

export type { BgStyle, SpriteInfo } from "./base";

export const BACKGROUNDS: Record<string, BgStyle> = {
	...baseBackgrounds,
	...chuhanBackgrounds,
	...shangBackgrounds,
	...chunqiuBackgrounds,
	...hanwuBackgrounds,
	...zhanguoBackgrounds,
	...hanchuBackgrounds,
	...qinBackgrounds,
	...xizhouBackgrounds,
	...zhuziBackgrounds,
	...qunxiangBackgrounds,
};

export const SPRITES: Record<string, SpriteInfo> = {
	...baseSprites,
	...chuhanSprites,
	...shangSprites,
	...chunqiuSprites,
	...hanwuSprites,
	...zhanguoSprites,
	...hanchuSprites,
	...qinSprites,
	...xizhouSprites,
	...zhuziSprites,
	...qunxiangSprites,
};

/**
 * Sprite ID → 朝代标签映射（用于图鉴筛选用）。
 * baseSprites 含五帝/夏/楚汉散落角色，需逐个标注；
 * 其余文件按朝代整体标注，后面的 spread 会覆盖前面的（同一 ID 只出现一次）。
 */
const _BASE_DYNASTY_OVERRIDES: Record<string, string> = {
	// 五帝篇
	qingyue: "五帝", huangdi: "五帝", yandi: "五帝", chiyou: "五帝",
	yao: "五帝", shun: "五帝", diku: "五帝", zhuanxu: "五帝",
	gaoyao: "五帝", leizu: "五帝", gonggong: "五帝", gun: "五帝",
	ehuang: "五帝", nvying: "五帝", houji: "五帝", fenghou: "五帝",
	cangjie: "五帝", danzhu: "五帝", kui: "五帝", huandou: "五帝",
	gusou: "五帝", xiang: "五帝", changxian: "五帝", dahong: "五帝",
	xihe: "五帝", siyue: "五帝", xie: "五帝",
	// 夏朝
	yu: "夏", qi: "夏", jie: "夏", tushan: "夏", yi: "夏",
	shangjun: "夏", youhu: "夏",
	// 商朝（base 中散落的）
	guanlongpang: "商", xizhong: "商", shuqi: "商",
	// 楚汉散落（base 中）
	long: "楚汉", chui: "楚汉", kuaitong: "楚汉", piaomu: "楚汉",
	limu: "楚汉", fangqi: "楚汉", boyi: "楚汉",
};

function buildSpriteDynastyMap(): Record<string, string> {
	const map: Record<string, string> = {};
	// baseSprites 先用 overrides 标注
	for (const [id, dynasty] of Object.entries(_BASE_DYNASTY_OVERRIDES)) {
		if (baseSprites[id]) map[id] = dynasty;
	}
	// 其余文件按朝代整体标注
	for (const id of Object.keys(chuhanSprites)) map[id] = "楚汉";
	for (const id of Object.keys(shangSprites)) map[id] = "商";
	for (const id of Object.keys(chunqiuSprites)) map[id] = "春秋";
	for (const id of Object.keys(hanwuSprites)) map[id] = "汉武";
	for (const id of Object.keys(zhanguoSprites)) map[id] = "战国";
	for (const id of Object.keys(hanchuSprites)) map[id] = "汉初";
	for (const id of Object.keys(qinSprites)) map[id] = "秦";
	for (const id of Object.keys(xizhouSprites)) map[id] = "西周";
	for (const id of Object.keys(zhuziSprites)) map[id] = "诸子";
	for (const id of Object.keys(qunxiangSprites)) map[id] = "群像";
	return map;
}

/** Sprite ID → 朝代标签（图鉴筛选用） */
export const SPRITE_DYNASTY_MAP = buildSpriteDynastyMap();

export function getBackground(key: string): BgStyle {
	return BACKGROUNDS[key] ?? BACKGROUNDS.default;
}

export function getSprite(id: string): SpriteInfo {
	return SPRITES[id] ?? { name: id, glyph: id.slice(0, 1), accent: "#7a6e5c" };
}

/**
 * 获取图鉴专用立绘 URL（精致厚涂CG风格）。
 * 仅返回 CG 注册表中的立绘；无 CG 立绘时返回 null（由调用方 fallback 到 glyph/卡片模式）。
 * 不再 fallback 到剧情立绘（剧情立绘为透明PNG，在图鉴中显示为"只有线条"的效果）。
 */
export function getArchivePortrait(id: string): string | null {
	return getArchiveCGUrl(id);
}

/**
 * 获取图鉴立绘认识信息（名称、徽记、主题色）。
 * 用于远程 API 无此人物时的本地兜底。
 */
export function getArchiveMeta(id: string): { name: string; glyph: string; accent: string } | null {
	const sp = SPRITES[id];
	if (!sp) return null;
	return { name: sp.name, glyph: sp.glyph, accent: sp.accent };
}

/** 所有本地 sprite 的 id 列表（去重后 267 个，用于图鉴展示） */
export const ARCHIVE_SPRITE_IDS = Object.keys(SPRITES);
