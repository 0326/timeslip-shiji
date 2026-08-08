/* ============================================================
   统一资源 URL 工具
   所有静态资源（立绘/背景/音频/KV）统一从 R2 CDN 加载。
   基地址通过 VITE_ASSETS_BASE_URL 控制，默认指向 R2 自定义域名。
   保留本地回退能力：设置 VITE_ASSETS_BASE_URL=/ 即走本地 public。
   ============================================================ */

const ASSETS_BASE =
	import.meta.env.VITE_ASSETS_BASE_URL || "https://asset.timeslip.work";

/**
 * 将资源路径转换为完整 URL。
 * - 已是完整 URL / data: / blob: 直接返回
 * - 以 /assets 或 /images 开头时拼上基地址
 */
export function assetUrl(path: string): string {
	if (!path) return path;
	if (/^(https?:|data:|blob:|about:)/.test(path)) return path;
	if (path.startsWith("/assets") || path.startsWith("/images")) {
		return ASSETS_BASE + path;
	}
	return path;
}

/** 背景图 URL（含 image/images/video 字段） */
export function bgImageUrl(url: string | undefined): string | undefined {
	if (!url) return url;
	if (/^(https?:|data:)/.test(url)) return url;
	return ASSETS_BASE + url;
}