import { useNavigate } from "react-router-dom";
import { Map, RotateCcw, ArrowLeft, ChevronRight, Compass } from "lucide-react";
import { getStoryline, getNextStoryline } from "../../data/storylines";

interface Props {
	storyId: string;
	storyTitle: string;
	deaths: number;
	choiceRate: number;
	isCanon: boolean;
	isCanonEnding: boolean;
	/** 具名结局（#ending 注册表）：有则展示结局名与判词 */
	ending?: { id: string; title: string; kind: "canon" | "if"; epigraph?: string };
	/** 本线已解锁结局数（含本次） */
	endingsUnlocked?: number;
	/** 本线结局总数（0 = 该线尚未注册结局表） */
	endingsTotal?: number;
	onRestart: () => void;
}

function gradeFor(deaths: number, isCanon: boolean): { grade: string; label: string; sub: string; color: string } {
	if (!isCanon) {
		return { grade: "·", label: "自由探索", sub: "历史的一种可能", color: "var(--color-cyan-light)" };
	}
	if (deaths === 0) return { grade: "S", label: "史识通神", sub: "一步不错，直抵史册", color: "#f5d76e" };
	if (deaths <= 2) return { grade: "A", label: "明察秋毫", sub: "略有蹉跌，终归正史", color: "#e8c170" };
	if (deaths <= 5) return { grade: "B", label: "渐入佳境", sub: "几番折戟，方识史路", color: "#c0a060" };
	return { grade: "C", label: "百折而成", sub: "死亡也是阅读", color: "#a08050" };
}

export function ClearScreen({ storyId, storyTitle, deaths, choiceRate, isCanon, isCanonEnding, ending, endingsUnlocked = 0, endingsTotal = 0, onRestart }: Props) {
	const navigate = useNavigate();
	const gradeInfo = gradeFor(deaths, isCanon);
	const endingType = isCanonEnding ? "史实终局" : "历史的歧路";
	const perfect = deaths === 0 && choiceRate >= 1;
	const showCollection = endingsTotal >= 2;

	// 篇章导航：回到当前篇章 / 进入下一条故事线（通关后已解锁）
	const mode = isCanon ? "canon" : "free";
	const story = getStoryline(storyId);
	const seriesId = story?.series;
	const next = getNextStoryline(storyId);
	const nextChar = next?.perspectives[0]?.characterId;
	const backToChapter = () =>
		navigate(seriesId ? `/story/${seriesId}?mode=${mode}` : "/story");

	return (
		<div className="vn-overlay clear">
			<div className="clear-card">
				<div className="clear-seal">終</div>
				<h2 className="serif">通关 · {storyTitle}</h2>
				{ending?.title ? (
					<>
						<div className="clear-ending-name serif">『{ending.title}』</div>
						<div className="clear-ending-type">— {endingType} —</div>
						{ending.epigraph && <p className="clear-ending-epigraph serif">{ending.epigraph}</p>}
					</>
				) : (
					<div className="clear-ending-type">— {endingType} —</div>
				)}
				<p className="dim" style={{ marginTop: 12, fontSize: 15 }}>
					{isCanon
						? (perfect
							? "全程零死亡，每一步都与史实暗合——你读懂了这段历史。"
							: "你已走完这段历史。死亡也是阅读，每一次重来都更靠近真相。")
						: (isCanonEnding
							? "在自由的歧路中，你仍寻回了史册里的那一条路。"
							: "你走出了一个史书上不曾发生的结局——如果历史拐向这里呢？")}
				</p>
				{showCollection && (
					<div className="clear-ending-collect">
						结局收集 <b>{Math.min(endingsUnlocked, endingsTotal)}</b> / {endingsTotal}
						{endingsUnlocked < endingsTotal && (
							<span className="dim">　还有 {endingsTotal - Math.min(endingsUnlocked, endingsTotal)} 种命运待照见</span>
						)}
						<button
							className="clear-ending-goto"
							onClick={() => navigate("/codex/endings")}
						>
							<Compass size={13} /> 查看结局图鉴
						</button>
					</div>
				)}

				<div className="clear-rank">
					<div className="clear-rank-grade" style={{ color: gradeInfo.color }}>{gradeInfo.grade}</div>
					<div className="clear-rank-meta">
						<div className="clear-rank-label">{gradeInfo.label}</div>
						<div className="clear-rank-sub">{gradeInfo.sub}</div>
					</div>
				</div>

				<div className="clear-stats">
					<div className="clear-stat">
						<div className="v">{Math.round(choiceRate * 100)}%</div>
						<div className="l">历史正确率</div>
					</div>
					<div className="clear-stat">
						<div className="v">{deaths}</div>
						<div className="l">死亡次数</div>
					</div>
					<div className="clear-stat">
						<div className="v" style={{ color: gradeInfo.color }}>{gradeInfo.grade}</div>
						<div className="l">史识评级</div>
					</div>
				</div>

				<div className="actions">
					{next && nextChar ? (
						<button
							className="btn btn-primary btn-cut"
							onClick={() => navigate(`/play/${next.id}/${nextChar}?mode=${mode}`)}
						>
							下一篇 · {next.title} <ChevronRight size={16} />
						</button>
					) : (
						<button className="btn btn-primary btn-cut" onClick={backToChapter}>
							<ArrowLeft size={16} /> 返回本篇章
						</button>
					)}
					{next && nextChar && (
						<button className="btn btn-ghost" onClick={backToChapter}>
							<ArrowLeft size={16} /> 返回本篇章
						</button>
					)}
					<button className="btn btn-ghost" onClick={onRestart}>
						<RotateCcw size={16} /> 再玩一遍
					</button>
					<button className="btn btn-ghost" onClick={() => navigate(`/panorama/${storyId}`)}>
						<Map size={16} /> 史记全景
					</button>
				</div>
			</div>
		</div>
	);
}
