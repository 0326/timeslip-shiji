/**
 * 主项目 timslip-work API 适配层
 *
 * 子项目保留游戏化包装层（glyph/accent/era/classicalQuote/gameRelations），
 * 通过本层运行时合并主项目的权威数据（name/aliases/bio/avatar/relations）。
 *
 * 所有调用带内存缓存 + 超时降级，失败时返回 null，由调用方走本地兜底。
 */

import type { CharacterRelation, RelationType } from "../types/character";

// ── 主项目 API 基址（环境变量配置） ──
const API_BASE =
	import.meta.env.VITE_MAIN_API_BASE || "https://timeslip.work";

// ── 主项目返回类型（仅取子项目需要的字段） ──
export interface MainFigure {
	id: string;
	name: string;
	aliases: string[];
	birth_year: number | null;
	death_year: number | null;
	dynasty: string;
	identity: string;
	bio_summary: string;
	keyword_tags: string[];
	avatar_icon: string;
	avatar_url: string | null;
	avatar: string | null; // /api/asset/figures/... 形式
	gender: "male" | "female" | "unknown";
	star: number;
	src_book: string;
	src_juan: number | null;
	src_chapter: string | null;
}

// ── 列表接口返回类型（对齐主项目 FigureListResponse） ──
export interface FigureListFilters {
	dynasties: { value: string; count: number }[];
	identities: { value: string; count: number }[];
}

export interface FigureListResponse {
	total: number;
	page: number;
	limit: number;
	items: MainFigure[];
	filters: FigureListFilters;
}

export interface FigureListParams {
	book?: string; // 按出处过滤：shiji / hanshu / ...
	page?: number;
	limit?: number;
	dynasty?: string;
	identity?: string;
	q?: string;
	sort?: "era" | "star";
	minStar?: number;
}

// ── 详情接口返回：Figure + passages（生平事件） ──
export interface MainFigurePassage {
	passage_id: string;
	chapter_id: string;
	chapter_name: string;
	book_id: string;
	book_name: string;
	volume_no: number;
	title: string;
	content: string;
	year: number | null;
	location: string | null;
	order_idx: number;
}

export interface MainFigureDetail extends MainFigure {
	passages: MainFigurePassage[];
}

export interface MainFigureRelation {
	target_id: string;
	target_name: string;
	target_identity: string;
	target_dynasty: string;
	relation_type: string;
	relation_label: string;
	description: string | null;
	passage_count: number;
}

export interface MainGraphNode {
	id: string;
	name: string;
	identity: string;
	dynasty: string;
	gender: string;
	star: number;
	degree: number;
}

export interface MainGraphLink {
	source: string;
	target: string;
	type: string;
}

export interface MainGraph {
	nodes: MainGraphNode[];
	links: MainGraphLink[];
	total: number;
}

// ── 内存缓存（session 级，避免重复请求） ──
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

function getCached<T>(key: string): T | null {
	const entry = cache.get(key);
	if (!entry) return null;
	if (Date.now() - entry.ts > CACHE_TTL) {
		cache.delete(key);
		return null;
	}
	return entry.data as T;
}

function setCached(key: string, data: unknown): void {
	cache.set(key, { data, ts: Date.now() });
}

// ── 带超时的 fetch ──
async function fetchWithTimeout(
	url: string,
	ms = 6000,
): Promise<Response | null> {
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), ms);
		const res = await fetch(url, { signal: controller.signal });
		clearTimeout(timer);
		return res;
	} catch {
		return null; // 网络错误 / 超时
	}
}

// ── 主项目 relation_type → 子项目 RelationType 映射 ──
// 主项目 6 种 enum 与子项目完全一致，做一次防御性归一
const VALID_TYPES: RelationType[] = [
	"family",
	"sovereign",
	"teacher",
	"friend",
	"enemy",
	"peer",
];

function normalizeRelationType(raw: string): RelationType {
	return (VALID_TYPES as string[]).includes(raw)
		? (raw as RelationType)
		: "peer";
}

// ── 公开 API ──

/**
 * 获取人物详情（合并 bio/avatar 等权威字段）
 * @returns null 表示主项目不可用或无此人
 */
export async function fetchFigure(id: string): Promise<MainFigure | null> {
	const cacheKey = `figure:${id}`;
	const cached = getCached<MainFigure>(cacheKey);
	if (cached) return cached;

	const res = await fetchWithTimeout(`${API_BASE}/api/figures/${id}`);
	if (!res || !res.ok) return null;

	const data = normalizeFigureAssets((await res.json()) as MainFigure);
	setCached(cacheKey, data);
	return data;
}

/**
 * 获取人物详情（含 passages 生平事件，详情页专用）
 * @returns null 表示主项目不可用或无此人
 */
export async function fetchFigureDetail(
	id: string,
): Promise<MainFigureDetail | null> {
	const cacheKey = `figure-detail:${id}`;
	const cached = getCached<MainFigureDetail>(cacheKey);
	if (cached) return cached;

	const res = await fetchWithTimeout(`${API_BASE}/api/figures/${id}`);
	if (!res || !res.ok) return null;

	const data = normalizeFigureAssets((await res.json()) as MainFigureDetail);
	setCached(cacheKey, data);
	return data;
}

/**
 * 拉取人物列表（带筛选/分页/搜索）。
 *
 * 双保险策略：
 * 1. 优先尝试带 `book` 参数（主项目部署 book 筛选后生效，服务端过滤）
 * 2. 若主项目未部署 book 参数（返回 400 / 空 / 报错），自动降级为不带 book 全量拉取 +
 *    客户端按 `src_book === book` 过滤
 *
 * @returns null 表示主项目不可用
 */
export async function fetchFigureList(
	params: FigureListParams = {},
): Promise<FigureListResponse | null> {
	const {
		book,
		page = 1,
		limit = 24,
		dynasty,
		identity,
		q,
		sort = "era",
		minStar,
	} = params;

	// 构造查询串
	const qs = new URLSearchParams();
	qs.set("page", String(page));
	qs.set("limit", String(limit));
	qs.set("sort", sort);
	if (book) qs.set("book", book);
	if (dynasty) qs.set("dynasty", dynasty);
	if (identity) qs.set("identity", identity);
	if (q) qs.set("q", q);
	if (minStar && minStar > 0) qs.set("minStar", String(minStar));

	const cacheKey = `figure-list:${qs.toString()}`;
	const cached = getCached<FigureListResponse>(cacheKey);
	if (cached) return cached;

	const res = await fetchWithTimeout(`${API_BASE}/api/figures?${qs.toString()}`);
	if (!res || !res.ok) {
		// 若带 book 参数失败，降级为不带 book 重试 + 客户端过滤
		if (book) {
			return fetchFigureListFallback({
				book,
				page,
				limit,
				dynasty,
				identity,
				q,
				sort,
				minStar,
			});
		}
		return null;
	}

	const data = (await res.json()) as FigureListResponse;
	data.items = data.items.map(normalizeFigureAssets);

	// 防御：若主项目未识别 book 参数（返回全量），客户端兜底过滤
	if (book && data.items.length > 0 && data.items[0].src_book !== book) {
		const filtered = data.items.filter((it) => it.src_book === book);
		return {
			...data,
			total: filtered.length,
			items: filtered,
		};
	}

	setCached(cacheKey, data);
	return data;
}

/**
 * 降级方案：不带 book 参数拉取，客户端按 src_book 过滤。
 * 用于主项目尚未部署 book 筛选参数时。
 */
async function fetchFigureListFallback(
	params: Required<Pick<FigureListParams, "book" | "page" | "limit">> &
		Omit<FigureListParams, "book" | "page" | "limit">,
): Promise<FigureListResponse | null> {
	const { book, page, limit, dynasty, identity, q, sort, minStar } = params;

	// 拉大页（避免分页边界问题），客户端过滤后手动切片
	const qs = new URLSearchParams();
	qs.set("page", "1");
	qs.set("limit", "100");
	qs.set("sort", sort || "era");
	if (dynasty) qs.set("dynasty", dynasty);
	if (identity) qs.set("identity", identity);
	if (q) qs.set("q", q);
	if (minStar && minStar > 0) qs.set("minStar", String(minStar));

	// 多页拼接：最多拉 5 页（500 条），覆盖史记人物总数
	const allItems: MainFigure[] = [];
	let filters: FigureListFilters = { dynasties: [], identities: [] };
	const maxPages = 5;
	for (let p = 1; p <= maxPages; p++) {
		qs.set("page", String(p));
		const res = await fetchWithTimeout(
			`${API_BASE}/api/figures?${qs.toString()}`,
		);
		if (!res || !res.ok) break;
		const data = (await res.json()) as FigureListResponse;
		if (p === 1) filters = data.filters;
		if (data.items.length === 0) break;
		allItems.push(...data.items.map(normalizeFigureAssets));
		if (data.items.length < 100) break;
	}

	const filtered = allItems.filter((it) => it.src_book === book);
	const start = (page - 1) * limit;
	const items = filtered.slice(start, start + limit);

	const result: FigureListResponse = {
		total: filtered.length,
		page,
		limit,
		items,
		filters,
	};

	const cacheKey = `figure-list:fallback:${book}:${page}:${limit}:${dynasty || ""}:${identity || ""}:${q || ""}:${sort || ""}:${minStar || 0}`;
	setCached(cacheKey, result);
	return result;
}

/**
 * 获取人物关系列表（主项目权威关系网）
 * @returns null 表示不可用；空数组表示此人无关系
 */
export async function fetchFigureRelations(
	id: string,
): Promise<MainFigureRelation[] | null> {
	const cacheKey = `figure-relations:${id}`;
	const cached = getCached<MainFigureRelation[]>(cacheKey);
	if (cached) return cached;

	const res = await fetchWithTimeout(
		`${API_BASE}/api/figures/${id}/relations`,
	);
	if (!res || !res.ok) return null;

	const data = (await res.json()) as { relations: MainFigureRelation[] };
	setCached(cacheKey, data.relations);
	return data.relations;
}

/**
 * 获取人物 ego 子图（用于关系图谱可视化）
 * @returns null 表示不可用
 */
export async function fetchFigureGraph(
	focusId: string,
	depth = 2,
): Promise<MainGraph | null> {
	const cacheKey = `figure-graph:${focusId}:${depth}`;
	const cached = getCached<MainGraph>(cacheKey);
	if (cached) return cached;

	const res = await fetchWithTimeout(
		`${API_BASE}/api/figures/graph?focus=${focusId}&depth=${depth}`,
	);
	if (!res || !res.ok) return null;

	const data = (await res.json()) as MainGraph;
	setCached(cacheKey, data);
	return data;
}

/**
 * 批量获取人物详情（并发 + 缓存）
 */
export async function fetchFigures(
	ids: string[],
): Promise<Map<string, MainFigure>> {
	const result = new Map<string, MainFigure>();
	await Promise.all(
		ids.map(async (id) => {
			const fig = await fetchFigure(id);
			if (fig) result.set(id, fig);
		}),
	);
	return result;
}

// ── 适配器：主项目关系 → 子项目 CharacterRelation ──
export function adaptRelation(
	r: MainFigureRelation,
): CharacterRelation {
	return {
		targetId: r.target_id,
		type: normalizeRelationType(r.relation_type),
		label: r.relation_label || r.relation_type,
		description: r.description || undefined,
	};
}

// ── 适配器：主项目 Figure → 头像 URL ──
export function resolveAvatarUrl(fig: MainFigure | null): string | null {
	if (!fig) return null;
	// 优先 avatar_url（已含 /api/asset/ 前缀），其次 avatar 字段
	return assetUrl(fig.avatar_url) || assetUrl(fig.avatar) || null;
}

/**
 * 把主项目返回的相对资产路径（/api/asset/...）拼成完整 URL。
 * - 已是绝对 URL（http(s)://）→ 原样返回
 * - 以 / 开头 → 拼 API_BASE
 * - 空/null → 返回 null
 */
export function assetUrl(path: string | null | undefined): string | null {
	if (!path) return null;
	if (/^https?:\/\//i.test(path)) return path;
	if (path.startsWith("/")) return `${API_BASE}${path}`;
	return `${API_BASE}/${path}`;
}

/**
 * 就地修正 Figure 的 avatar/avatar_url 为完整 URL（主项目返回的是相对路径）。
 * 在 fetchFigure / fetchFigureList / fetchFigureDetail 入口统一处理，下游渲染代码不用改。
 */
function normalizeFigureAssets<T extends MainFigure>(fig: T): T {
	if (fig.avatar) fig.avatar = assetUrl(fig.avatar);
	if (fig.avatar_url) fig.avatar_url = assetUrl(fig.avatar_url);
	return fig;
}

// ── 资产 bundle（全身图 / 背景图 / 头像等） ──
export type AssetType =
	| "avatar"
	| "portrait-bust"
	| "portrait-full"
	| "background"
	| "cg"
	| "spine"
	| "chibi"
	| "expression"
	| "extra";

export interface AssetFile {
	id: string;
	asset_id: string;
	asset_type: AssetType;
	variant: string;
	r2_key: string;
	url: string;
	mime_type: string;
	width: number | null;
	height: number | null;
	size_bytes: number | null;
	sort_order: number;
	metadata: Record<string, unknown> | null;
	created_at: number;
}

export interface FigureAsset {
	id: string;
	figure_id: string;
	style_id: string;
	style_name?: string;
	is_default: boolean;
	creator: string | null;
	status: "draft" | "active" | "archived";
	metadata: Record<string, unknown> | null;
	created_at: number;
	updated_at: number;
	files: AssetFile[];
}

export interface FigureBundle {
	defaultStyle: string | null;
	assets: Record<string, FigureAsset>;
}

/**
 * 拉取人物视觉资产 bundle（GET /api/figures/:id/assets）。
 * 全身图 portrait-full / 背景图 background / 头像 avatar 等。
 * @returns null 表示主项目不可用或此人物无 R2 资产
 */
export async function fetchFigureBundle(
	id: string,
): Promise<FigureBundle | null> {
	const cacheKey = `figure-bundle:${id}`;
	const cached = getCached<FigureBundle>(cacheKey);
	if (cached) return cached;

	const res = await fetchWithTimeout(
		`${API_BASE}/api/figures/${encodeURIComponent(id)}/assets`,
	);
	if (!res || !res.ok) return null;

	const data = (await res.json()) as {
		figure_id: string;
		default_style: string | null;
		assets: Record<string, FigureAsset>;
	};
	if (!data.assets || typeof data.assets !== "object") return null;

	// 把每个 file.url（相对路径 /api/asset/...）转成完整 URL
	for (const asset of Object.values(data.assets)) {
		for (const f of asset.files) {
			f.url = assetUrl(f.url) ?? f.url;
		}
	}

	const bundle: FigureBundle = {
		defaultStyle: data.default_style,
		assets: data.assets,
	};
	setCached(cacheKey, bundle);
	return bundle;
}

/**
 * 从 FigureAsset 中取出指定类型的文件 URL。
 * variant 不传则取 default，没有 default 取该类型第一个文件。
 */
export function pickAssetFile(
	asset: FigureAsset | undefined | null,
	type: AssetType,
	variant = "default",
): string | null {
	if (!asset) return null;
	const file =
		asset.files.find((f) => f.asset_type === type && f.variant === variant) ??
		asset.files.find((f) => f.asset_type === type);
	return file?.url ?? null;
}

/**
 * 给 /api/asset/ 图片 URL 追加 ?w=<宽> 触发 worker 端按宽缩放。
 * 仅对包含 /api/asset/ 的 URL 生效，其他原样返回。
 */
export function sizedAssetUrl(
	url: string | null | undefined,
	width: number,
): string | null {
	if (!url) return null;
	if (!url.includes("/api/asset/")) return url;
	return `${url}${url.includes("?") ? "&" : "?"}w=${width}`;
}
