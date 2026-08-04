// 排兵布阵（Formation）—— 指令序列小游戏
// 玩法：屏幕给出打乱顺序的军令（令箭），玩家需按正确顺序依次点击，
//       组成完整阵法。共 3 关，每关指令数递增；不限时但计步数。
// 适配故事线：孙武练兵（孙武训练吴王宫女，以兵法之严令行禁止）。
// ink 用法：
//   #minigame:formation          → 从第 1 关开始
//   #minigame:formation:2        → 从第 2 关开始（1-3）

import { useEffect, useMemo, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, Flag } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./formation.css";

interface FormationLevel {
	id: number;
	name: string;
	/** 按正确顺序排列的指令；下标即其在序列中的正确位置 */
	instructions: string[];
}

// ── 关卡数据（孙武练兵线） ──
const LEVELS: FormationLevel[] = [
	{
		id: 1,
		name: "练兵",
		instructions: ["击鼓聚将", "列队陈兵", "申明军令", "挥旗进退", "鸣金收兵"],
	},
	{
		id: 2,
		name: "布阵",
		instructions: ["斥候探路", "择地扎营", "分兵列阵", "鼓噪诱敌", "两翼包抄", "鸣金凯旋"],
	},
	{
		id: 3,
		name: "决战",
		instructions: ["祭旗誓师", "列阵擂鼓", "前锋接敌", "中军压上", "伏兵四起", "追亡逐北", "凯旋献俘"],
	},
];

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	if (a.length > 1 && a.every((v, i) => v === arr[i])) return shuffle(arr);
	return a;
}

function computeScore(totalClicks: number, par: number): number {
	const extra = Math.max(0, totalClicks - par);
	return Math.max(60, Math.min(100, 100 - extra * 3));
}

export function FormationGame({ param, onComplete, onSkip }: MinigameProps) {
	const startLevel = useMemo(() => {
		if (param) {
			const n = parseInt(param, 10);
			if (!Number.isNaN(n) && n >= 1 && n <= LEVELS.length) return n - 1;
		}
		return 0;
	}, [param]);

	const levelsToPlay = useMemo(() => LEVELS.slice(startLevel), [startLevel]);
	const par = useMemo(
		() => levelsToPlay.reduce((s, l) => s + l.instructions.length, 0),
		[levelsToPlay],
	);

	const [levelOffset, setLevelOffset] = useState(0);
	const currentLevel = levelsToPlay[levelOffset];

	const [shuffled, setShuffled] = useState<number[]>([]);
	const [placed, setPlaced] = useState<number[]>([]);
	const [errorId, setErrorId] = useState<number | null>(null);
	const [totalClicks, setTotalClicks] = useState(0);
	const [levelClearing, setLevelClearing] = useState(false);
	const [won, setWon] = useState(false);

	useEffect(() => {
		if (!currentLevel) return;
		const ids = currentLevel.instructions.map((_, i) => i);
		setShuffled(shuffle(ids));
		setPlaced([]);
		setErrorId(null);
		setLevelClearing(false);
	}, [currentLevel]);

	function onTokenClick(id: number) {
		if (won || levelClearing) return;
		if (placed.includes(id)) return;

		const newClicks = totalClicks + 1;
		setTotalClicks(newClicks);

		if (id === placed.length) {
			const newPlaced = [...placed, id];
			setPlaced(newPlaced);

			if (newPlaced.length === currentLevel.instructions.length) {
				setLevelClearing(true);
				if (levelOffset === levelsToPlay.length - 1) {
					sfx.play("win");
					setWon(true);
					const score = computeScore(newClicks, par);
					const t = setTimeout(() => onComplete({ result: "win", score }), 1600);
					return () => clearTimeout(t);
				} else {
					sfx.play("correct");
					const t = setTimeout(() => {
						setLevelOffset((o) => o + 1);
					}, 1000);
					return () => clearTimeout(t);
				}
			} else {
				sfx.play("click");
			}
		} else {
			sfx.play("wrong");
			setErrorId(id);
			const t = setTimeout(() => setErrorId((cur) => (cur === id ? null : cur)), 700);
			return () => clearTimeout(t);
		}
	}

	function handleResetLevel() {
		if (won || levelClearing) return;
		if (!currentLevel) return;
		sfx.resetCombo();
		const ids = currentLevel.instructions.map((_, i) => i);
		setShuffled(shuffle(ids));
		setPlaced([]);
		setErrorId(null);
	}

	if (!currentLevel) return null;

	const totalInstructions = currentLevel.instructions.length;
	const placedSet = new Set(placed);
	const globalLevelIdx = startLevel + levelOffset;
	const isLastLevel = levelOffset === levelsToPlay.length - 1;

	return (
		<div className="fm-root">
			<div className="fm-hud">
				<div className="fm-title-wrap">
					<div className="fm-title serif">排兵布阵</div>
					<div className="fm-level-tag">
						<Flag size={12} /> 第 {globalLevelIdx + 1} 阵 · {currentLevel.name}
					</div>
				</div>
				<div className="fm-stats">
					<span>步数 {totalClicks}</span>
					<span>·</span>
					<span>已排 {placed.length}/{totalInstructions}</span>
				</div>
			</div>

			<p className="fm-hint">
				孙武练兵，令行禁止。请按正确军令顺序依次点击下方令箭，布成阵法。
			</p>

			<div className="fm-placed-area">
				<div className="fm-area-label">已布之阵</div>
				<div className="fm-placed-row">
					{Array.from({ length: totalInstructions }).map((_, slot) => {
						const id = placed[slot];
						const filled = id !== undefined;
						return (
							<div
								key={slot}
								className={[
									"fm-token",
									"fm-token-placed",
									filled ? "filled" : "empty",
									levelClearing && filled ? "glow" : "",
								].filter(Boolean).join(" ")}
							>
								<div className="fm-token-num">{slot + 1}</div>
								<div className="fm-token-text">
									{filled ? currentLevel.instructions[id] : ""}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="fm-pending-area">
				<div className="fm-area-label">待排令箭</div>
				<div className="fm-pending-row">
					{shuffled.map((id) => {
						if (placedSet.has(id)) {
							return <div key={id} className="fm-token fm-token-ghost" aria-hidden />;
						}
						const isError = errorId === id;
						return (
							<button
								key={id}
								type="button"
								className={[
									"fm-token",
									"fm-token-pending",
									isError ? "error" : "",
								].filter(Boolean).join(" ")}
								onClick={() => onTokenClick(id)}
								disabled={won || levelClearing}
							>
								<div className="fm-token-text">{currentLevel.instructions[id]}</div>
							</button>
						);
					})}
				</div>
			</div>

			<div className="fm-controls">
				<button className="btn btn-ghost" onClick={handleResetLevel} disabled={won || levelClearing}>
					<RotateCcw size={14} /> 重排本阵
				</button>
				<button className="btn btn-ghost" onClick={onSkip}>跳过</button>
			</div>

			{levelClearing && !won && (
				<div className="fm-level-clear">
					<CheckCircle2 size={36} />
					<div className="fm-level-clear-title">{currentLevel.name} · 阵成</div>
					<div className="fm-level-clear-sub">
						{isLastLevel ? "" : "整军再布下一阵…"}
					</div>
				</div>
			)}

			{won && (
				<div className="fm-win">
					<div className="fm-win-rays" aria-hidden />
					<CheckCircle2 size={48} />
					<div className="fm-win-title">布阵成功</div>
					<div className="fm-win-sub">
						三阵皆成 · 共 {totalClicks} 步
						{totalClicks <= par ? " · 用兵如神" : totalClicks <= par + 4 ? " · 调度有方" : " · 终成阵法"}
					</div>
				</div>
			)}
		</div>
	);
}
