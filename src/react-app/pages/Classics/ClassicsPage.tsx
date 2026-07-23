import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Check, BookOpen } from "lucide-react";
import { PanelHeader } from "../../components/ui";
import { useUserStore } from "../../store/userStore";
import {
	SHIJI_CATALOG,
	SHIJI_BOOKS,
	isChapterAvailable,
	classicReadKey,
	type ShijiBook,
	type CatalogEntry,
} from "../../data/classics";
import "./Classics.css";

type Filter = ShijiBook | "全部";

/** 典籍阁：史记 130 卷完整目录。左侧分类 / 搜索 / 已解锁筛选，右侧章节列表。 */
export function ClassicsPage() {
	const readSources = useUserStore((s) => s.progress.readSources);
	const [filter, setFilter] = useState<Filter>("全部");
	const [query, setQuery] = useState("");

	const isRead = (e: CatalogEntry) => readSources.includes(classicReadKey(e.juan));

	const availableTotal = useMemo(() => SHIJI_CATALOG.filter((e) => isChapterAvailable(e.juan)).length, []);

	const readTotal = useMemo(
		() => SHIJI_CATALOG.filter((e) => readSources.includes(classicReadKey(e.juan))).length,
		[readSources],
	);

	const counts = useMemo(() => {
		const c: Record<string, number> = { 全部: SHIJI_CATALOG.length };
		for (const b of SHIJI_BOOKS) c[b] = SHIJI_CATALOG.filter((e) => e.book === b).length;
		return c;
	}, []);

	const filtered = useMemo(() => {
		const q = query.trim();
		return SHIJI_CATALOG.filter((e) => {
			if (filter !== "全部" && e.book !== filter) return false;
			if (q && !e.title.includes(q)) return false;
			return true;
		});
	}, [filter, query]);

	// 右侧按「书」分组（在「全部」视图下显示分组标题）
	const groups = useMemo(() => {
		const order = filter === "全部" ? SHIJI_BOOKS : [filter as ShijiBook];
		return order
			.map((book) => ({ book, items: filtered.filter((e) => e.book === book) }))
			.filter((g) => g.items.length > 0);
	}, [filtered, filter]);

	return (
		<div className="classics-page container">
			<PanelHeader
				seal="典"
				title="史记 · 太史公书"
				sub="原文 · 注释 · 译文 · 一百三十卷"
				stats={[
					{ value: SHIJI_CATALOG.length, label: "全卷" },
					{ value: availableTotal, label: "已开放" },
					{ value: readTotal, label: "已研读" },
				]}
			/>

			<div className="classics-layout">
				{/* 左：分类 / 搜索 / 筛选 */}
				<aside className="classics-sidebar">
					<div className="classics-search">
						<Search size={15} />
						<input
							type="text"
							placeholder="搜索篇名…"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>

					<nav className="classics-cats">
						{(["全部", ...SHIJI_BOOKS] as Filter[]).map((b) => (
							<button
								key={b}
								className={`classics-cat${filter === b ? " is-active" : ""}`}
								onClick={() => setFilter(b)}
							>
								<span>{b}</span>
								<em>{counts[b]}</em>
							</button>
						))}
					</nav>
				</aside>

				{/* 右：章节列表 */}
				<div className="classics-list">
					{groups.length === 0 && <p className="classics-empty dim">没有符合条件的篇章。</p>}
					{groups.map(({ book, items }) => (
						<section key={book} className="classics-list-group">
							{filter === "全部" && <h2 className="classics-list-bookhead serif">{book}</h2>}
							<ul>
								{items.map((e) => {
									const avail = isChapterAvailable(e.juan);
									const read = isRead(e);
									const inner = (
										<>
											<span className="classics-juan serif">卷{e.juan}</span>
											<span className="classics-row-title serif">{e.title}</span>
											{avail ? (
												read ? (
													<span className="badge badge-gold">
														<Check size={12} /> 已研读
													</span>
												) : (
													<span className="badge badge-cyan">
														<BookOpen size={12} /> 可阅读
													</span>
												)
											) : (
												<span className="badge">敬请期待</span>
											)}
										</>
									);
									return (
										<li key={e.juan}>
											{avail ? (
												<Link to={`/classics/${e.juan}`} className="game-card classics-row">
													{inner}
												</Link>
											) : (
												<div className="game-card is-locked classics-row">{inner}</div>
											)}
										</li>
									);
								})}
							</ul>
						</section>
					))}
				</div>
			</div>
		</div>
	);
}
