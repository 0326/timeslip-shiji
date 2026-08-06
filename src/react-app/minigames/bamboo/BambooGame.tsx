// 竹简缀合（Bamboo Splice）—— 原文排序小游戏
// 玩法：打乱的 4-6 条竹简（原文短句），点击上下交换或拖到正确位置，将它们还原成史记原文的顺序。
// 素材：直接从 chapters/NNN.ts 的 original 切句。默认按 storyKey 选章；param 可指定 juan:segIndex:sliceCount。

import { useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, Shuffle, RotateCcw, GripVertical } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./bamboo.css";

interface BambooStrip {
	id: number;
	text: string;
}

// 默认章节映射：storyKey → [juan卷号, segIndex段落索引, sliceCount竹简数]
const DEFAULT_MAP: Record<string, [number, number, number]> = {
	"huangdi:qiyuan": [1, 0, 5],    // 五帝本纪·黄帝开头 5简
	"huangdi:banquan": [1, 1, 5],   // 五帝本纪·阪泉三战 5简
	"huangdi:zhuolu": [1, 2, 5],    // 五帝本纪·涿鹿擒蚩尤 5简
	"huangdi:zhitianxia": [1, 4, 5],// 五帝本纪·崩葬桥山 5简
	"kongzi:zhuzi": [47, 0, 5],   // 孔子世家·首段 5简
	"wenwang:xizhou": [4, 0, 5],  // 周本纪·开篇 5简
	"liubang:chuhan": [8, 0, 5],  // 高祖本纪·首段 5简
	"xiangyu:chuhan": [7, 0, 5],  // 项羽本纪·首段 5简
};

// 切句规则：以'。'、'！'、'？'、'；'作为短句分界；再合并过短的相邻句
function cutSentences(original: string, count: number): string[] {
	const pieces: string[] = [];
	let buf = "";
	for (const ch of original) {
		buf += ch;
		if ("。！？；".includes(ch)) {
			const t = buf.trim();
			if (t.length >= 6) pieces.push(t);
			buf = "";
		}
	}
	if (buf.trim().length >= 6) pieces.push(buf.trim());
	if (pieces.length < count) {
		// 退而以逗号切分
		const commaSplit = original
			.split(/[，,。！？；]/)
			.map((s) => s.trim())
			.filter((s) => s.length >= 6);
		if (commaSplit.length >= count) return commaSplit.slice(0, count);
	}
	return pieces.slice(0, count);
}

// 同步加载所有 chapters（eager）—— 数量不多，体积可控；若担心首屏可改为懒加载。
const chapterModules = import.meta.glob("../../data/classics/chapters/*.ts", { eager: true }) as Record<
	string,
	{ default: { sections: { segments: { original: string }[] }[] } }
>;

function loadJuan(juan: number): { default: { sections: { segments: { original: string }[] }[] } } | undefined {
	const path = `../../data/classics/chapters/${String(juan).padStart(3, "0")}.ts`;
	return chapterModules[path];
}

function pickSentences(juan: number, segIndex: number, count: number): string[] {
	const mod = loadJuan(juan);
	if (!mod) return [];
	const sections = mod.default.sections;
	let seg: { original: string } | undefined;
	let idx = 0;
	for (const s of sections) {
		for (const g of s.segments) {
			if (idx === segIndex) { seg = g; break; }
			idx++;
		}
		if (seg) break;
	}
	if (!seg) {
		// 取第一段兜底
		seg = sections[0]?.segments[0];
	}
	if (!seg) return [];
	return cutSentences(seg.original, count);
}

function shuffle<T>(arr: T[]): T[] {
  if (arr.length <= 1) return [...arr];
  // 无限重试直到不是正确顺序；length>=2 必存在非原序排列
  let guard = 0;
  let a: T[] = [];
  do {
    a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.every((v, i) => v === arr[i]) && guard++ < 100);
  return a;
}

export function BambooGame({ param, storyKey, onComplete, onSkip }: MinigameProps) {
	const [juan, segIndex, count] = useMemo<[number, number, number]>(() => {
		if (param) {
			const parts = param.split(":").map((x) => parseInt(x, 10));
			if (parts.length >= 1 && !Number.isNaN(parts[0])) {
				return [parts[0], parts[1] ?? 0, parts[2] ?? 5];
			}
		}
		if (storyKey && DEFAULT_MAP[storyKey]) return DEFAULT_MAP[storyKey];
		return [7, 0, 5];
	}, [param, storyKey]);

	const original = useMemo(() => pickSentences(juan, segIndex, count), [juan, segIndex, count]);

	const [strips, setStrips] = useState<BambooStrip[]>([]);
	const [selected, setSelected] = useState<number | null>(null);
	const [moves, setMoves] = useState(0);
	const [won, setWon] = useState(false);
	const [dragId, setDragId] = useState<number | null>(null);
	const onCompleteRef = useRef(onComplete);
	onCompleteRef.current = onComplete;
	// 用户是否已实际交互（swap/拖拽）。初始化或重洗时不检测胜利，防止挂载即通关
	const userInteractedRef = useRef(false);
	// 防止胜利后重复回调
	const wonRef = useRef(false);

	useEffect(() => {
		if (original.length === 0) return;
		const init = shuffle(original.map((text, i) => ({ id: i, text })));
		setStrips(init);
		setMoves(0);
		setWon(false);
		setSelected(null);
		// 初始化/重洗后重置交互标志
		userInteractedRef.current = false;
		wonRef.current = false;
	}, [original]);

	useEffect(() => {
		// 少于 2 简时无法打乱，直接跳过避免误判胜利
		if (strips.length < 2) return;
		// 双重保护：必须用户实际交互后才检测胜利
		if (!userInteractedRef.current) return;
		const ok = strips.every((s, i) => s.id === i);
		if (ok && !won) {
			wonRef.current = true;
			setWon(true);
			sfx.play("win");
			const score = moves <= Math.ceil(count * 1.5) ? 100 : moves <= count * 3 ? 80 : 60;
			setTimeout(() => onCompleteRef.current({ result: "win", score }), 900);
		}
		// 不在 deps 中包含 won，避免 won 更新导致 effect 清理掉 timeout
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [strips, moves, count]);

	function swap(i: number, j: number) {
		if (i === j || i < 0 || j < 0 || i >= strips.length || j >= strips.length) return;
		userInteractedRef.current = true;
		setStrips((prev) => {
			const next = [...prev];
			[next[i], next[j]] = [next[j], next[i]];
			return next;
		});
		setMoves((m) => m + 1);
		sfx.play("pop");
	}

	function onStripClick(i: number) {
		if (won) return;
		if (selected === null) {
			setSelected(i);
			sfx.play("click");
		} else if (selected === i) {
			setSelected(null);
		} else {
			swap(selected, i);
			setSelected(null);
		}
	}

	function moveSelected(dir: -1 | 1) {
		if (selected === null) return;
		swap(selected, selected + dir);
		setSelected((s) => (s === null ? s : s + dir));
	}

	function handleShuffle() {
		if (won) return;
		setStrips(shuffle(original.map((text, i) => ({ id: i, text }))));
		setMoves(0);
		setSelected(null);
		sfx.play("shuffle");
		sfx.resetCombo();
	}

	function handleReset() {
		if (won) return;
		userInteractedRef.current = true; // 查看原文视为交互，允许触发胜利
		setStrips((prev) => [...prev].sort((a, b) => a.id - b.id));
		setMoves((m) => m + 5); // 查看答案惩罚步数
		setSelected(null);
	}

	// 拖拽（HTML5）
	function onDragStart(e: React.DragEvent, i: number) {
		setDragId(i);
		e.dataTransfer.effectAllowed = "move";
	}
	function onDragOver(e: React.DragEvent) {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}
	function onDrop(e: React.DragEvent, i: number) {
		e.preventDefault();
		if (dragId !== null && dragId !== i) {
			swap(dragId, i);
		}
		setDragId(null);
	}

	if (original.length === 0) {
		return (
			<div className="bamboo-root">
				<div className="bamboo-hud">
					<div className="bamboo-title serif">竹简缀合</div>
				</div>
				<p className="bamboo-hint">原文素材暂缺，请点击"跳过"继续剧情。</p>
				<div className="bamboo-controls">
					<button className="btn btn-ghost" onClick={onSkip}>跳过</button>
				</div>
			</div>
		);
	}

	const correctCount = strips.filter((s, i) => s.id === i).length;

	return (
		<div className="bamboo-root">
			<div className="bamboo-hud">
				<div className="bamboo-title serif">竹简缀合</div>
				<div className="bamboo-stats">
					<span>交换 {moves}</span>
					<span>·</span>
					<span>复位 {correctCount}/{strips.length}</span>
				</div>
			</div>

			<p className="bamboo-hint">
				竹简散乱，请按《史记》原文顺序复原。点击两枚简交换位置，或用方向按钮调整。
			</p>

			<div className="bamboo-strips">
				{strips.map((s, i) => {
					const correct = s.id === i;
					return (
						<div
							key={s.id}
							className={[
								"bamboo-strip",
								selected === i ? "selected" : "",
								correct ? "correct" : "",
								dragId === i ? "dragging" : "",
							].filter(Boolean).join(" ")}
							draggable={!won}
							onDragStart={(e) => onDragStart(e, i)}
							onDragOver={onDragOver}
							onDrop={(e) => onDrop(e, i)}
							onClick={() => onStripClick(i)}
						>
							<div className="bamboo-grip"><GripVertical size={14} /></div>
							<div className="bamboo-num">{i + 1}</div>
							<div className="bamboo-text">{s.text}</div>
						</div>
					);
				})}
			</div>

			<div className="bamboo-controls">
				<div className="bamboo-dpad">
					<button
						className="btn btn-ghost"
						disabled={selected === null || selected === 0}
						onClick={() => moveSelected(-1)}
					>
						↑ 上移
					</button>
					<button
						className="btn btn-ghost"
						disabled={selected === null || selected === strips.length - 1}
						onClick={() => moveSelected(1)}
					>
						↓ 下移
					</button>
				</div>
				<div className="bamboo-actions">
					<button className="btn btn-ghost" onClick={handleShuffle}>
						<Shuffle size={14} /> 重打乱
					</button>
					<button className="btn btn-ghost" onClick={handleReset}>
						<RotateCcw size={14} /> 查看原文（+5步）
					</button>
					<button className="btn btn-ghost" onClick={onSkip}>跳过</button>
				</div>
			</div>

			{won && (
				<div className="bamboo-win">
					<CheckCircle2 size={42} />
					<div className="bamboo-win-title">缀合完成！</div>
					<div className="bamboo-win-sub">共 {moves} 步 · {moves <= Math.ceil(count * 1.5) ? "如观其字" : "稍费思量"}</div>
				</div>
			)}
		</div>
	);
}
