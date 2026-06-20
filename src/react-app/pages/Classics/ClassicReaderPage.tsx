import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
	ArrowLeft,
	ArrowRight,
	Languages,
	AArrowUp,
	AArrowDown,
	BookOpenCheck,
	Check,
	X,
	BookOpen,
} from "lucide-react";
import { Button, Drawer } from "../../components/ui";
import { CharacterAvatar } from "../../components/CharacterAvatar";
import { LoadingScreen } from "../../components/LoadingScreen";
import { useUserStore } from "../../store/userStore";
import { usePlayStore } from "../../store/playStore";
import { CHARACTERS } from "../../data/characters";
import {
	getChapterByJuan,
	chapterHasContent,
	classicReadKey,
	type ClassicChapter,
	type ClassicNote,
} from "../../data/classics";
import "./Classics.css";

const OVERVIEW = -1;

interface Mark {
	term: string;
	num: number;
}

/** 在原文中高亮注释词并加上标编号。 */
function MarkedText({ text, marks }: { text: string; marks: Mark[] }) {
	const points: { start: number; end: number; num: number }[] = [];
	for (const m of marks) {
		const i = text.indexOf(m.term);
		if (i >= 0) points.push({ start: i, end: i + m.term.length, num: m.num });
	}
	points.sort((a, b) => a.start - b.start);
	const clean: typeof points = [];
	let last = -1;
	for (const p of points) {
		if (p.start >= last) {
			clean.push(p);
			last = p.end;
		}
	}
	const out: ReactNode[] = [];
	let cursor = 0;
	let k = 0;
	for (const p of clean) {
		if (p.start > cursor) out.push(text.slice(cursor, p.start));
		out.push(
			<mark className="reader-mark" key={k++}>
				{text.slice(p.start, p.end)}
				<sup>{p.num}</sup>
			</mark>,
		);
		cursor = p.end;
	}
	if (cursor < text.length) out.push(text.slice(cursor));
	return <>{out}</>;
}

/** 阅读器：先看概览（简介 + 立绘），再切到具体章节看原文 / 注释；译文走右侧抽屉。 */
export default function ClassicReaderPage() {
	const { juan = "" } = useParams();
	const juanNum = Number(juan);

	const fontScale = usePlayStore((s) => s.classicsFontScale);
	const bumpFont = usePlayStore((s) => s.bumpClassicsFont);

	const readKey = classicReadKey(juanNum);
	const hasRead = useUserStore((s) => s.hasReadSource(readKey));
	const markSourceRead = useUserStore((s) => s.markSourceRead);
	const [justRead, setJustRead] = useState(false);
	const read = hasRead || justRead;

	const [activeIdx, setActiveIdx] = useState(OVERVIEW); // 默认进入概览
	const [transOpen, setTransOpen] = useState(false);

	// 按卷号动态加载内容：undefined = 加载中，null = 未收录
	const [chapter, setChapter] = useState<ClassicChapter | null | undefined>(undefined);
	useEffect(() => {
		let alive = true;
		setChapter(undefined);
		setActiveIdx(OVERVIEW);
		setTransOpen(false);
		getChapterByJuan(juanNum).then((c) => {
			if (alive) setChapter(c ?? null);
		});
		return () => {
			alive = false;
		};
	}, [juanNum]);

	if (chapter === undefined) {
		return <LoadingScreen />;
	}

	if (!chapter || !chapterHasContent(chapter)) {
		return (
			<div className="classics-page container">
				<Link to="/classics" className="classics-back">
					<ArrowLeft size={16} /> 返回典籍阁
				</Link>
				<p className="dim" style={{ marginTop: "var(--space-8)" }}>
					此篇尚未收录，敬请期待。
				</p>
			</div>
		);
	}

	const sectionCount = chapter.sections.length;
	const onOverview = activeIdx === OVERVIEW;
	const section = onOverview ? null : chapter.sections[activeIdx];

	const goto = (idx: number) => {
		setActiveIdx(idx);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const onFinish = () => {
		if (markSourceRead(readKey)) setJustRead(true);
	};

	const relatedChars = (chapter.relatedCharacters ?? [])
		.map((id) => CHARACTERS.find((c) => c.id === id))
		.filter((c): c is (typeof CHARACTERS)[number] => !!c);

	// 当前章节注释连续编号
	let counter = 0;
	const segViews = (section?.segments ?? []).map((seg) => {
		const segNotes = (seg.notes ?? []).map((note: ClassicNote) => ({ note, num: ++counter }));
		return { seg, segNotes };
	});
	const allNotes = segViews.flatMap((s) => s.segNotes);

	return (
		<div className="reader-page">
			{/* 顶部工具条 */}
			<div className="reader-toolbar">
				<div className="container reader-toolbar-inner">
					<Link to="/classics" className="btn btn-ghost btn-sm">
						<ArrowLeft size={14} /> 典籍阁
					</Link>
					<span className="reader-toolbar-title serif">{chapter.title}</span>
					<div className="reader-tools">
						{!onOverview && (
							<button className="btn btn-ghost btn-sm" onClick={() => setTransOpen(true)}>
								<Languages size={14} /> 译文
							</button>
						)}
						<span className="reader-font">
							<button className="btn btn-ghost btn-sm" onClick={() => bumpFont(-1)} title="缩小字号">
								<AArrowDown size={16} />
							</button>
							<button className="btn btn-ghost btn-sm" onClick={() => bumpFont(1)} title="放大字号">
								<AArrowUp size={16} />
							</button>
						</span>
					</div>
				</div>
			</div>

			<div className="container">
				<div className="reader-layout">
					{/* 左：章节导航（概览 + 各章节） */}
					<aside className="reader-sections">
						<h3 className="reader-sections-title">目录</h3>
						<ul>
							<li>
								<button
									className={`reader-section-link${onOverview ? " is-active" : ""}`}
									onClick={() => goto(OVERVIEW)}
								>
									概览
								</button>
							</li>
							{chapter.sections.map((s, i) => (
								<li key={s.id}>
									<button
										className={`reader-section-link${i === activeIdx ? " is-active" : ""}`}
										onClick={() => goto(i)}
									>
										{s.title}
									</button>
								</li>
							))}
						</ul>
					</aside>

					{/* 右：概览 或 章节正文 */}
					{onOverview ? (
						<section className="reader-overview">
							<div className="reader-overview-portrait">
								<CharacterAvatar glyph={chapter.glyph} accent={chapter.accent} size={150} />
							</div>
							<h1 className="serif">{chapter.title}</h1>
							<p className="reader-source dim">{chapter.source}</p>
							<p className="reader-subtitle">{chapter.subtitle}</p>
							<p className="reader-intro classical">{chapter.intro}</p>

							{relatedChars.length > 0 && (
								<div className="reader-cast">
									<h4 className="reader-cast-title">主要人物</h4>
									<div className="reader-cast-row">
										{relatedChars.map((c) => (
											<div className="reader-cast-item" key={c.id}>
												<CharacterAvatar glyph={c.glyph} accent={c.accent} size={48} />
												<span>{c.name}</span>
											</div>
										))}
									</div>
								</div>
							)}

							<div className="reader-overview-actions">
								<Button onClick={() => goto(0)}>
									<BookOpen size={16} /> 开始阅读
								</Button>
								{chapter.relatedStoryId && (
									<Link to={`/panorama/${chapter.relatedStoryId}`} className="reader-related">
										全景视角 →
									</Link>
								)}
							</div>
						</section>
					) : (
						<article className="reader-main" style={{ fontSize: `${fontScale}em` }}>
							<div className="reader-section-head">
								<h2 className="serif">{section!.title}</h2>
								<button className="btn btn-ghost btn-sm" onClick={() => setTransOpen(true)}>
									<Languages size={14} /> 看译文
								</button>
							</div>

							<div className="reader-original classical">
								{segViews.map(({ seg, segNotes }, i) => (
									<p key={i}>
										<MarkedText
											text={seg.original}
											marks={segNotes.map((n) => ({ term: n.note.term, num: n.num }))}
										/>
									</p>
								))}
							</div>

							{allNotes.length > 0 && (
								<div className="reader-notes">
									<h4 className="reader-notes-title serif">注释</h4>
									<ol>
										{allNotes.map(({ note, num }) => (
											<li key={num} className="reader-note">
												<span className="reader-note-num">{num}</span>
												<div>
													<span className="reader-note-term serif">{note.term}</span>
													<span className="reader-note-text">{note.text}</span>
												</div>
											</li>
										))}
									</ol>
								</div>
							)}

							{/* 上一章 / 下一章 */}
							<nav className="reader-pager">
								<button className="reader-pager-btn" onClick={() => goto(activeIdx - 1)}>
									<ArrowLeft size={15} />
									<span>{activeIdx === 0 ? "概览" : chapter.sections[activeIdx - 1].title}</span>
								</button>
								<button
									className="reader-pager-btn align-end"
									onClick={() => goto(activeIdx + 1)}
									disabled={activeIdx >= sectionCount - 1}
								>
									<span>
										{activeIdx >= sectionCount - 1 ? "已是末章" : chapter.sections[activeIdx + 1].title}
									</span>
									<ArrowRight size={15} />
								</button>
							</nav>
						</article>
					)}
				</div>

				<div className="rule" />
				<footer className="reader-foot">
					{read ? (
						<span className="reader-done serif">
							<Check size={16} className="gold" /> 已研读 · 此篇已收入典籍库
						</span>
					) : (
						<Button onClick={onFinish}>
							<BookOpenCheck size={16} /> 我已读完 · 领取 +1 抽卡券
						</Button>
					)}
				</footer>
			</div>

			{/* 译文抽屉 */}
			<Drawer open={transOpen} onClose={() => setTransOpen(false)}>
				<div className="trans-drawer">
					<div className="trans-drawer-head">
						<div>
							<h3 className="serif">译文</h3>
							<p className="dim">{section?.title}</p>
						</div>
						<button className="btn btn-ghost btn-sm" onClick={() => setTransOpen(false)}>
							<X size={16} />
						</button>
					</div>
					<div className="trans-drawer-body">
						{(section?.segments ?? []).map((seg, i) => (
							<p key={i} className="trans-para">
								{seg.vernacular}
							</p>
						))}
					</div>
				</div>
			</Drawer>
		</div>
	);
}
