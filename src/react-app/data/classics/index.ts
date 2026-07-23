// 典籍阁数据入口：目录同步可用，单卷内容按需动态加载（Vite glob）。
// 内容单元只需在 chapters/ 下新增 <三位卷号>.ts（export default ClassicChapter），
// 无需改动本文件——可读卷集由文件是否存在自动推导。
import type { ClassicChapter } from "./types";

export * from "./types";
export { SHIJI_CATALOG, SHIJI_BOOKS } from "./catalog";

// 懒加载：仅在调用对应 loader 时才拉取该卷模块，不进入首屏包。
const loaders = import.meta.glob("./chapters/*.ts") as Record<
	string,
	() => Promise<{ default: ClassicChapter }>
>;

function juanToPath(juan: number): string {
	return `./chapters/${String(juan).padStart(3, "0")}.ts`;
}

/** 已开放（存在内容文件）的卷号集合——由 glob 的 key 同步推导，无需加载内容。 */
export const availableJuan: Set<number> = new Set(
	Object.keys(loaders)
		.map((p) => {
			const m = p.match(/(\d+)\.ts$/);
			return m ? parseInt(m[1], 10) : NaN;
		})
		.filter((n) => !Number.isNaN(n)),
);

export function isChapterAvailable(juan: number): boolean {
	return availableJuan.has(juan);
}

/** 动态加载某卷完整内容。未收录则返回 undefined。 */
export async function getChapterByJuan(juan: number): Promise<ClassicChapter | undefined> {
	const loader = loaders[juanToPath(juan)];
	if (!loader) return undefined;
	const mod = await loader();
	return mod.default;
}

export function chapterHasContent(chapter: ClassicChapter | undefined): boolean {
	return !!chapter && chapter.sections.some((s) => s.segments.length > 0);
}

/** 阅读进度键：按卷号，与全景页 storyId 键隔离。复用 userStore.markSourceRead/hasReadSource。 */
export function classicReadKey(juan: number): string {
	return `classic:${juan}`;
}
