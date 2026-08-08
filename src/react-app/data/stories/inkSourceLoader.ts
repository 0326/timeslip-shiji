/**
 * Ink 源码动态加载器
 *
 * 将 .ink 源码从主包中拆出，按需加载。
 * 使用 Vite 的 import.meta.glob (eager: false) 为每个 .ink 文件生成独立 chunk，
 * 仅在玩家进入对应故事时才请求。
 */

// 预扫描所有 ink 文件，生成懒加载映射（不内联内容）
// eager: false 确保 Vite 将每个 .ink?raw 拆分为独立 chunk
const inkModules = import.meta.glob("./ink/**/*.ink", {
	query: "?raw",
	import: "default",
});

/** 缓存已加载的源码，避免重复请求 */
const cache = new Map<string, string>();

/**
 * 按故事键加载对应的 ink 源码。
 * @param inkFile 相对于 ink/ 目录的路径（不含 .ink 后缀），如 "hanxin-chuhan" 或 "extras/extra-xiangyu-gaixia"
 */
export async function loadInkSource(inkFile: string): Promise<string> {
	const cached = cache.get(inkFile);
	if (cached !== undefined) return cached;

	const key = `./ink/${inkFile}.ink`;
	const loader = inkModules[key];
	if (!loader) {
		throw new Error(`Ink source not found: ${key}`);
	}

	const source = (await loader()) as string;
	cache.set(inkFile, source);
	return source;
}
