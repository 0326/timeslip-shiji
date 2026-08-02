import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookOpen, Lock, Map, Scroll, Skull, X } from "lucide-react";
import "./DeathsCodex.css";
import "./EndingsCodex.css";
import "./KnowledgeCodex.css";
import { WUDI_KNOWLEDGE, type KnowledgeFragment } from "../../data/knowledge/wudi-knowledge";
import { CHARACTERS } from "../../data/characters";
import { getSprite } from "../../data/sceneAssets";
import { useUserStore } from "../../store/userStore";
import type { Character } from "../../types/character";

const KIND_LABEL: Record<KnowledgeFragment["kind"], string> = {
	impact: "抉择",
	death: "死鉴",
	quiz: "测验",
	graph: "图谱",
};

const KIND_COLOR: Record<KnowledgeFragment["kind"], string> = {
	impact: "var(--color-gold-light)",
	death: "var(--color-vermilion-light)",
	quiz: "var(--color-cyan-light)",
	graph: "var(--identity-emperor)",
};

const NAME_FALLBACK: Record<string, string> = {
	huangdi: "黄帝",
};

function resolveCharName(charId: string, charMap: Record<string, Character>): string {
	const apiName = charMap[charId]?.name;
	if (apiName && apiName !== charId) return apiName;
	const spriteName = getSprite(charId).name;
	if (spriteName && spriteName !== charId) return spriteName;
	return NAME_FALLBACK[charId] ?? charId;
}

function useCharId(storyKey: string | undefined): string | null {
	if (!storyKey) return null;
	const idx = storyKey.indexOf(":");
	return idx > 0 ? storyKey.slice(0, idx) : storyKey;
}

export function KnowledgeCodexPage() {
	const navigate = useNavigate();
	const { storyKey: rawStoryKey } = useParams<{ storyKey: string }>();
	const storyKey = rawStoryKey ? decodeURIComponent(rawStoryKey) : undefined;
	const charId = useCharId(storyKey);
	const storylines = useUserStore((s) => s.progress.storylines);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const charMap = useMemo(() => Object.fromEntries(CHARACTERS.map((c) => [c.id, c])), []);

	const { nodes, unlockedSet, seenSet, total, unlocked, seen } = useMemo(() => {
		const all = WUDI_KNOWLEDGE.filter((k) => (charId ? k.storyKey.startsWith(`${charId}:`) : true));
		const totalNodes = all;
		const perspMap: Record<string, Set<string>> = {};
		for (const k of all) {
			const [, chapter] = k.storyKey.split(":");
			const key = `${k.storyKey}`;
			perspMap[key] = new Set(storylines[k.storyKey]?.[charId ?? ""]?.unlockedKnowledge ?? []);
		}
		const unlockedIds = new Set<string>();
		for (const list of Object.values(perspMap)) {
			for (const id of list) unlockedIds.add(id);
		}
		const seenIds = new Set<string>();
		for (const [sid, chars] of Object.entries(storylines)) {
			for (const persp of Object.values(chars)) {
				for (const id of persp.knowledgeGraphSeen ?? []) seenIds.add(id);
			}
		}
		return {
			nodes: totalNodes,
			unlockedSet: unlockedIds,
			seenSet: seenIds,
			total: totalNodes.length,
			unlocked: totalNodes.filter((n) => unlockedIds.has(n.id)).length,
			seen: totalNodes.filter((n) => seenIds.has(n.id)).length,
		};
	}, [charId, storylines]);

	const selected = useMemo(
		() => nodes.find((n) => n.id === selectedId) ?? null,
		[nodes, selectedId],
	);

	const bounds = useMemo(() => {
		if (nodes.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
		const xs = nodes.map((n) => n.graphPos?.x ?? 0);
		const ys = nodes.map((n) => n.graphPos?.y ?? 0);
		return {
			minX: Math.min(...xs),
			maxX: Math.max(...xs),
			minY: Math.min(...ys),
			maxY: Math.max(...ys),
		};
	}, [nodes]);

	const width = Math.max(bounds.maxX - bounds.minX + 160, 640);
	const height = Math.max(bounds.maxY - bounds.minY + 160, 320);

	function posStyle(n: KnowledgeFragment): React.CSSProperties {
		const x = (n.graphPos?.x ?? 0) - bounds.minX + 80;
		const y = (n.graphPos?.y ?? 0) - bounds.minY + 80;
		return { left: x, top: y };
	}

	function handleSelect(n: KnowledgeFragment) {
		setSelectedId(n.id);
		if (charId && unlockedSet.has(n.id)) {
			useUserStore.getState().markKnowledgeGraphSeen(n.storyKey, charId, n.id);
		}
	}

	const charName = charId ? resolveCharName(charId, charMap) : "";

	return (
		<div className="codex-page knowledge-codex">
			<div className="codex-tabs">
				<button className="codex-tab" onClick={() => navigate("/codex")}>
					<BookOpen size={14} /> 结局图鉴
				</button>
				<button className="codex-tab active">
					<Map size={14} /> 史识图谱
				</button>
			</div>

			<div className="codex-stats">
				<span className="panel-stat">
					<b>
						{unlocked}/{total}
					</b>
					<span>已收录碎片</span>
				</span>
				<span className="panel-stat">
					<b>{seen}</b>
					<span>已查看节点</span>
				</span>
			</div>

			{charId && (
				<header className="knowledge-head">
					<div className="knowledge-head-glyph">{charName[0] ?? "识"}</div>
					<div>
						<h2 className="serif">{charName} · 史识图谱</h2>
						<p className="tagline">每一个抉择、每一次死亡、每一道测验，都是读懂历史的一块碎片</p>
					</div>
				</header>
			)}

			{nodes.length === 0 ? (
				<div className="knowledge-empty">
					<BookOpen size={48} />
					<p>此故事尚无史识图谱数据</p>
					<span>继续探索故事以解锁更多史识碎片</span>
				</div>
			) : (
			<div className="knowledge-graph-wrap">
				<div
					className="knowledge-graph"
					style={{ width, height }}
				>
					<svg className="knowledge-edges" width={width} height={height}>
						{nodes.map((n) =>
							(n.requires ?? []).map((reqId) => {
								const target = nodes.find((t) => t.id === reqId);
								if (!target) return null;
								const x1 = (target.graphPos?.x ?? 0) - bounds.minX + 80;
								const y1 = (target.graphPos?.y ?? 0) - bounds.minY + 80;
								const x2 = (n.graphPos?.x ?? 0) - bounds.minX + 80;
								const y2 = (n.graphPos?.y ?? 0) - bounds.minY + 80;
								const isActive = unlockedSet.has(n.id) && unlockedSet.has(target.id);
								return (
									<line
										key={`${n.id}-${reqId}`}
										x1={x1}
										y1={y1}
										x2={x2}
										y2={y2}
										className={`knowledge-edge ${isActive ? "active" : "dim"}`}
									/>
								);
							}),
						)}
					</svg>

					{nodes.map((n) => {
						const isUnlocked = unlockedSet.has(n.id);
						const isSeen = seenSet.has(n.id);
						return (
							<button
								key={n.id}
								className={`knowledge-node kind-${n.kind} ${isUnlocked ? "unlocked" : "locked"} ${
									isSeen ? "seen" : ""
								}`}
								style={posStyle(n)}
								onClick={() => handleSelect(n)}
								data-tip={isUnlocked ? n.title : "未解锁"}
							>
								<span className="knowledge-node-dot" style={{ background: KIND_COLOR[n.kind] }} />
								<span className="knowledge-node-title">{isUnlocked ? n.title : "???"}</span>
								<span className="knowledge-node-kind">{KIND_LABEL[n.kind]}</span>
								{!isUnlocked && <Lock size={12} className="knowledge-node-lock" />}
							</button>
						);
					})}
				</div>
			</div>
			)}

			<div className="knowledge-legend">
				<span className="knowledge-legend-item">
					<i style={{ background: KIND_COLOR.impact }} /> 抉择
				</span>
				<span className="knowledge-legend-item">
					<i style={{ background: KIND_COLOR.death }} /> 死鉴
				</span>
				<span className="knowledge-legend-item">
					<i style={{ background: KIND_COLOR.quiz }} /> 测验
				</span>
				<span className="knowledge-legend-item">
					<i style={{ background: KIND_COLOR.graph }} /> 图谱
				</span>
			</div>

			{selected && (
				<div className="knowledge-detail-overlay" onClick={() => setSelectedId(null)}>
					<div className="knowledge-detail" onClick={(e) => e.stopPropagation()}>
						<button className="knowledge-detail-close" onClick={() => setSelectedId(null)}>
							<X size={18} />
						</button>
						<div className="knowledge-detail-kind" style={{ color: KIND_COLOR[selected.kind] }}>
							{selected.kind === "impact" && <Scroll size={14} />}
							{selected.kind === "death" && <Skull size={14} />}
							{selected.kind === "quiz" && <BookOpen size={14} />}
							{selected.kind === "graph" && <Map size={14} />}
							{KIND_LABEL[selected.kind]}
						</div>
						<h3 className="serif">{unlockedSet.has(selected.id) ? selected.title : "???"}</h3>
						{unlockedSet.has(selected.id) ? (
							<p className="knowledge-detail-content">{selected.content}</p>
						) : (
							<div className="knowledge-detail-locked">
								<Lock size={24} />
								<p>该碎片尚未解锁，继续探索故事以收录此处。</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
