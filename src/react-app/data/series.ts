// 系列注册表：史记 130 卷划分为 ~10 个大系列（一个时代/主题分组）。
// 每个系列下可有多条主角故事线（storyline 卡片 × perspective 视角）。
// 规划见 docs/story-series-roadmap.md。

export interface SeriesDef {
	/** 系列 id，与 storyline.series 及 storyKey/ink 命名前缀一致 */
	id: string;
	name: string;
	tagline: string;
	accent: string;
	accent2: string;
	bgFrom: string;
	bgTo: string;
	/** 参考时代（展示用，非分组键；分组按 series id） */
	era: string;
	order: number;
	glyph: string;
	/** 无内容时置 true，选择页显示为"敬请期待" */
	comingSoon?: boolean;
}

export const SERIES: SeriesDef[] = [
	{
		id: "wudi",
		name: "五帝华夏",
		tagline: "涿鹿风云 · 禅让开国",
		accent: "#c9a84c",
		accent2: "#3a8c6e",
		bgFrom: "#1a1510",
		bgTo: "#0f1a15",
		era: "wudi",
		order: 1,
		glyph: "帝",
	},
	{
		id: "shang",
		name: "殷商本纪",
		tagline: "玄鸟生商 · 成汤革命",
		accent: "#b0894c",
		accent2: "#6b4a3a",
		bgFrom: "#161009",
		bgTo: "#100b07",
		era: "shang",
		order: 2,
		glyph: "殷",
	},
	{
		id: "xizhou",
		name: "西周王朝",
		tagline: "渭水求贤 · 凤鸣岐山",
		accent: "#7ec8c8",
		accent2: "#c0c0c0",
		bgFrom: "#0f1518",
		bgTo: "#0a1012",
		era: "western_zhou",
		order: 3,
		glyph: "周",
	},
	{
		id: "chunqiu",
		name: "春秋五霸",
		tagline: "尊王攘夷 · 卧薪尝胆",
		accent: "#8fae5a",
		accent2: "#4a7a5c",
		bgFrom: "#121810",
		bgTo: "#0c110b",
		era: "spring_autumn",
		order: 4,
		glyph: "霸",
	},
	{
		id: "zhanguo",
		name: "战国七雄",
		tagline: "合纵连横 · 变法强秦",
		accent: "#9c6ea5",
		accent2: "#5a4a7a",
		bgFrom: "#15101a",
		bgTo: "#0f0b12",
		era: "warring_states",
		order: 5,
		glyph: "战",
	},
	{
		id: "zhuzi",
		name: "诸子百家",
		tagline: "百家争鸣 · 处士横议",
		accent: "#6a8caf",
		accent2: "#4a5a7a",
		bgFrom: "#101418",
		bgTo: "#0b0e12",
		era: "warring_states",
		order: 6,
		glyph: "子",
	},
	{
		id: "qin",
		name: "大秦帝国",
		tagline: "六合一统 · 二世而亡",
		accent: "#d4a847",
		accent2: "#8b4513",
		bgFrom: "#1a1208",
		bgTo: "#120e08",
		era: "qin",
		order: 7,
		glyph: "秦",
	},
	{
		id: "chuhan",
		name: "楚汉争霸",
		tagline: "垓下悲歌 · 霸王绝唱",
		accent: "#d4503c",
		accent2: "#b8973a",
		bgFrom: "#1a0d0a",
		bgTo: "#120808",
		era: "chu_han",
		order: 8,
		glyph: "楚",
	},
	{
		id: "hanchu",
		name: "汉初之治",
		tagline: "诸吕之乱 · 文景之治",
		accent: "#c98a5a",
		accent2: "#7a5a3a",
		bgFrom: "#171009",
		bgTo: "#110b07",
		era: "western_han",
		order: 9,
		glyph: "汉",
	},
	{
		id: "hanwu",
		name: "汉武盛世",
		tagline: "凿空西域 · 封狼居胥",
		accent: "#c94c4c",
		accent2: "#b8973a",
		bgFrom: "#1a0f0c",
		bgTo: "#120a08",
		era: "western_han",
		order: 10,
		glyph: "武",
	},
	{
		id: "qunxiang",
		name: "番外篇·群英传",
		tagline: "游侠刺客 · 市井百态",
		accent: "#8a8a9c",
		accent2: "#5a5a6b",
		bgFrom: "#121216",
		bgTo: "#0c0c10",
		era: "mixed",
		order: 11,
		glyph: "侠",
	},
];

export const SERIES_MAP: Record<string, SeriesDef> = Object.fromEntries(
	SERIES.map((s) => [s.id, s]),
);

export function getSeries(id: string): SeriesDef | undefined {
	return SERIES_MAP[id];
}
