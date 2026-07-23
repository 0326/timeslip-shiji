// 典籍阁数据类型。每卷一个模块（chapters/<三位卷号>.ts），按需动态加载。

export type ShijiBook = "本纪" | "表" | "书" | "世家" | "列传";

/** 一条字词注释：term 为原文中的标记词（会在原文中高亮并编号），text 为解说。 */
export interface ClassicNote {
	term: string;
	text: string;
}

/** 一段原文 + 译文 + 若干注释。 */
export interface ClassicSegment {
	original: string;
	vernacular: string;
	notes?: ClassicNote[];
}

/** 篇内小章节（如「胯下之辱」「背水一战」）。 */
export interface ClassicSection {
	id: string;
	title: string;
	segments: ClassicSegment[];
}

export interface ClassicChapter {
	juan: number; // 卷号，1–130，与文件名（三位补零）和目录一致
	title: string;
	book: ShijiBook;
	source: string; // "《史记 · 卷九十二》"
	subtitle: string;
	intro: string;
	sections: ClassicSection[]; // 为空 = 占位
	glyph: string; // 单字徽记
	accent: string; // 主题色
	id?: string; // 旧版可选别名，路由与读取均以 juan 为准
	relatedStoryId?: string;
	relatedCharacters?: string[];
}

export interface CatalogEntry {
	juan: number;
	title: string;
	book: ShijiBook;
}
