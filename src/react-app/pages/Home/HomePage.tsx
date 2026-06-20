import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Play, CalendarCheck, Map } from "lucide-react";
import "./Home.css";
import { STORYLINES } from "../../data/storylines";
import { ERA_LABELS } from "../../types/character";
import { getCharacter } from "../../data/characters";
import type { Storyline } from "../../types/story";
import { useUserStore } from "../../store/userStore";
import { globalProgress, storylineProgress } from "../../store/selectors";
import { Badge, Button, Drawer, ProgressBar } from "../../components/ui";
import { CharacterAvatar } from "../../components/CharacterAvatar";

export function HomePage() {
	const navigate = useNavigate();
	const progress = useUserStore((s) => s.progress);
	const dailyCheckIn = useUserStore((s) => s.dailyCheckIn);
	const [active, setActive] = useState<Storyline | null>(null);

	const gp = useMemo(() => globalProgress(progress), [progress]);
	const totalCompleted = useMemo(() => {
		let done = 0;
		let total = 0;
		for (const s of STORYLINES) {
			const r = storylineProgress(progress, s.id);
			done += r.done;
			total += r.total;
		}
		return { done, total };
	}, [progress]);

	const todayNum = (() => {
		const d = new Date();
		return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
	})();
	const checkedToday = progress.lastCheckIn === todayNum;

	return (
		<div>
			{/* Hero */}
			<section className="hero">
				<div className="hero-ink" />
				<div className="hero-inner">
					<div className="hero-seal">史</div>
					<h1>穿越·史记</h1>
					<div className="slogan">选一个角色，亲历一段历史</div>
					<p className="lead">
						《史记》躺在书架上「读不进、记不住、串不起」。在这里，文言不是门槛，而是通关的提示——
						抽卡解锁角色，穿越成史记中人，在每一次抉择里，读懂一段活的历史。
					</p>
					<div className="hero-cta">
						<Button size="lg" onClick={() => navigate("/gacha")}>
							<Sparkles size={18} /> 前往史册抽卡
						</Button>
						<Button
							size="lg"
							variant="ghost"
							onClick={() =>
								document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" })
							}
						>
							<Play size={18} /> 选择故事线
						</Button>
					</div>

					{/* 全局进度 */}
					<div className="global-progress">
						<div className="gp-head">
							<span className="label">史记全景 · 解锁进度</span>
							<span className="pct">{gp}%</span>
						</div>
						<ProgressBar value={gp} />
						<div className="gp-foot">
							<span>
								已通关视角 {totalCompleted.done} / {totalCompleted.total}
							</span>
							<button
								className="btn btn-ghost btn-sm"
								disabled={checkedToday}
								onClick={() => dailyCheckIn()}
							>
								<CalendarCheck size={14} />
								{checkedToday ? `已签到 · 连续${progress.checkInStreak}天` : "每日签到 +1"}
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* 故事线 */}
			<section className="stories-section" id="stories">
				<div className="section-head">
					<h2 className="serif">故事线</h2>
					<span className="sub">每条故事线，是一个人物的一生，或一夜的天下</span>
				</div>
				<div className="story-grid">
					{STORYLINES.map((s) => (
						<StoryCard key={s.id} story={s} onOpen={() => setActive(s)} />
					))}
				</div>
			</section>

			<Drawer open={!!active} onClose={() => setActive(null)}>
				{active && <StoryDetail story={active} onClose={() => setActive(null)} />}
			</Drawer>
		</div>
	);
}

function StoryCard({ story, onOpen }: { story: Storyline; onOpen: () => void }) {
	const progress = useUserStore((s) => s.progress);
	const { done, total } = storylineProgress(progress, story.id);
	const pct = total ? (done / total) * 100 : 0;

	return (
		<article
			className="story-card anim-fade-up"
			onClick={onOpen}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && onOpen()}
		>
			<div
				className="story-cover"
				style={{ background: `linear-gradient(135deg, ${story.cover}22, #14110d 70%)` }}
			>
				<span className="cover-glyph">{story.glyph}</span>
				<span className="era-tag">
					<Badge tone="gold">{ERA_LABELS[story.era]}</Badge>
				</span>
				<span className="year-tag">{story.year}</span>
			</div>
			<div className="story-body">
				<h3>{story.title}</h3>
				<div className="subtitle">{story.subtitle}</div>
				<p className="desc">{story.description}</p>
				<div className="story-meta">
					<Badge>约 {story.estimatedMinutes} 分钟</Badge>
					<Badge tone="vermilion">难度 {"★".repeat(story.difficulty)}</Badge>
					<Badge tone="cyan">{story.perspectives.length} 个视角</Badge>
				</div>
				<div className="story-progress-line">
					<ProgressBar value={pct} />
					<span className="frac">
						{done}/{total}
					</span>
				</div>
			</div>
		</article>
	);
}

function StoryDetail({ story, onClose }: { story: Storyline; onClose: () => void }) {
	const navigate = useNavigate();
	const progress = useUserStore((s) => s.progress);
	const hasChar = useUserStore((s) => s.hasCharacter);
	const { done } = storylineProgress(progress, story.id);

	return (
		<div className="story-detail">
			<div
				className="story-detail-cover"
				style={{ background: `linear-gradient(135deg, ${story.cover}33, #14110d 70%)` }}
			>
				<span className="cover-glyph">{story.glyph}</span>
			</div>
			<h2 className="serif" style={{ fontSize: 26 }}>
				{story.title}
			</h2>
			<div style={{ color: "var(--color-gold-light)", fontFamily: "var(--font-serif)", marginTop: 4 }}>
				{story.subtitle} · {story.year}
			</div>
			<p className="dim" style={{ fontSize: 14, marginTop: 14, lineHeight: 1.9 }}>
				{story.description}
			</p>

			<div className="persp-list">
				{story.perspectives.map((p) => {
					const ch = getCharacter(p.characterId);
					if (!ch) return null;
					const owned = hasChar(p.characterId);
					const pr = progress.storylines[story.id]?.[p.characterId];
					const status = !owned
						? "未解锁角色"
						: pr?.isCompleted
							? "已通关"
							: pr?.isStarted
								? "进行中"
								: "未开始";
					return (
						<div className="persp-row" key={p.characterId}>
							<CharacterAvatar glyph={ch.glyph} accent={ch.accent} size={48} locked={!owned} />
							<div className="info">
								<div className="nm">{ch.name}</div>
								<div className="st">
									{status} · {p.nodeCount} 个抉择点
								</div>
							</div>
							{owned ? (
								<Button
									size="sm"
									variant={pr?.isCompleted ? "ghost" : "primary"}
									onClick={() => navigate(`/play/${story.id}/${p.characterId}`)}
								>
									{pr?.isCompleted ? "重玩" : pr?.isStarted ? "继续" : "穿越"}
								</Button>
							) : (
								<Button size="sm" variant="cyan" onClick={() => navigate("/gacha")}>
									去解锁
								</Button>
							)}
						</div>
					);
				})}
			</div>

			<div style={{ display: "flex", gap: 12, marginTop: 24 }}>
				<Button
					variant="ghost"
					block
					disabled={done === 0}
					onClick={() => {
						onClose();
						navigate(`/panorama/${story.id}`);
					}}
				>
					<Map size={16} /> {done === 0 ? "通关后解锁全景" : "史记全景"}
				</Button>
			</div>
		</div>
	);
}
