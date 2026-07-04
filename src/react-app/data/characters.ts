import type { Character } from "../types/character";
import { CHARACTER_GAME_META, CHARACTER_IDS } from "./characterGameMeta";
import {
	adaptRelation,
	fetchFigure,
	fetchFigureRelations,
	resolveAvatarUrl,
} from "../services/mainProjectApi";

/**
 * 同步构建基础 Character（仅游戏化字段，不含主项目数据）。
 * 供抽卡、图鉴、Home 等不需要 bio/avatar 的场景使用，保持原有同步调用兼容。
 */
function buildBaseCharacter(metaId: string): Character {
	const m = CHARACTER_GAME_META[metaId];
	return {
		id: m.id,
		name: m.id, // 占位，运行时由主项目覆写；无主项目时用 id
		title: m.title,
		era: m.era,
		accent: m.accent,
		glyph: m.glyph,
		description: "", // 运行时由主项目 bio_summary 填充
		classicalQuote: m.classicalQuote,
		historicalSource: m.historicalSource,
		relatedStorylines: [...m.relatedStorylines],
		relations: m.gameRelations.map((r) => ({ ...r })),
		avatarUrl: null,
		bioSummary: null,
	};
}

// ── 本地兜底名表（主项目不可用时的 fallback） ──
const LOCAL_NAMES: Record<string, string> = {
	hanxin: "韩信",
	xiangyu: "项羽",
	zhangliang: "张良",
	liubang: "刘邦",
	xiaohe: "萧何",
	fanzeng: "范增",
	fankuai: "樊哙",
	yuji: "虞姬",
};

// ── 本地兜底简介（主项目不可用时的 fallback） ──
const LOCAL_DESC: Record<string, string> = {
	hanxin:
		"出身寒微，曾受胯下之辱、寄食漂母。择主而事，由萧何月下追回，登坛拜将。背水一战、暗度陈仓、十面埋伏，连百万之军战必胜攻必取，被誉为兵仙。功高震主，终死于钟室。",
	xiangyu:
		"楚国名将之后，力能扛鼎，才气过人。巨鹿破釜沉舟，大破秦军；鸿门宴优柔不杀刘邦。分封诸侯自立西楚霸王，然刚愎自用，终败垓下，自刎乌江。",
	zhangliang:
		"韩国贵族之后，博浪沙刺秦未遂。圯上受书于黄石公，运筹帷幄之中，决胜千里之外。鸿门宴中周旋救主，下邑画策，功成身退，从赤松子游。",
	liubang:
		"起于泗水亭长，豁达大度，知人善任。约法三章入关中，鸿门宴中卑辞脱身。终用三杰之力，垓下灭楚，开汉四百年基业。",
	xiaohe:
		"沛县主吏掾，识刘邦于微时。入关收秦图籍，明天下要害。月下追韩信，荐为大将；镇守关中，转漕给军，汉之所以得天下，萧何之功最盛。",
	fanzeng:
		"年七十，好奇计。事项羽尊为亚父。鸿门宴上数目项王、举玉玦三示之，欲杀刘邦不得。后中陈平反间，愤而去，疽发背而死。",
	fankuai:
		"以屠狗为业，从刘邦起沛。鸿门宴危急，带剑拥盾撞入军门，瞋目视项王，头发上指，立饮斗酒、生啖彘肩，护沛公脱险。勇冠三军。",
	yuji:
		"常幸从项羽。垓下被围，四面楚歌，项羽悲歌慷慨，虞姬和之。霸王别姬，遂以身殉，留千古绝唱。",
};

/**
 * 同步角色表：用本地兜底数据填充 name/description。
 * 兼容现有 getCharacter/CHARACTERS/CHARACTER_MAP 同步调用。
 * 主项目数据需通过 getCharacterMerged 异步获取。
 */
export const CHARACTERS: Character[] = CHARACTER_IDS.map((id) => {
	const c = buildBaseCharacter(id);
	c.name = LOCAL_NAMES[id] || id;
	c.description = LOCAL_DESC[id] || "";
	return c;
});

export const CHARACTER_MAP: Record<string, Character> = Object.fromEntries(
	CHARACTERS.map((c) => [c.id, c]),
);

export function getCharacter(id: string): Character | undefined {
	return CHARACTER_MAP[id];
}

/**
 * 异步获取合并后的角色（游戏化字段 + 主项目权威数据）。
 * 主项目不可用时降级为本地兜底。
 *
 * @param id 角色 ID（与主项目 figures.id 对齐）
 * @param mergeRelations 是否用主项目关系网覆写 gameRelations（默认 true）
 */
export async function getCharacterMerged(
	id: string,
	mergeRelations = true,
): Promise<Character | undefined> {
	const base = getCharacter(id);
	if (!base) return undefined;

	// 并发拉主项目数据
	const [figure, remoteRelations] = await Promise.all([
		fetchFigure(id),
		mergeRelations ? fetchFigureRelations(id) : null,
	]);

	// 合并主项目字段
	if (figure) {
		base.name = figure.name;
		base.bioSummary = figure.bio_summary || null;
		// description 优先用主项目 bio_summary，否则保留本地
		if (figure.bio_summary) {
			base.description = figure.bio_summary;
		}
		base.avatarUrl = resolveAvatarUrl(figure);
	}

	// 合并关系：主项目有数据则覆写，否则保留 gameRelations
	if (remoteRelations && remoteRelations.length > 0) {
		base.relations = remoteRelations.map(adaptRelation);
	}

	return base;
}

/**
 * 批量异步合并（用于图鉴等需要全量角色 + 主项目数据的场景）
 */
export async function getAllCharactersMerged(
	mergeRelations = false,
): Promise<Character[]> {
	const list = await Promise.all(
		CHARACTER_IDS.map((id) => getCharacterMerged(id, mergeRelations)),
	);
	return list.filter((c): c is Character => c != null);
}
