import { useEffect, useMemo, useRef, useState } from "react";
import type { GraphLink, GraphNode, MindMapGraph } from "../../data/sceneAssets/archivePassages";
import "./Archive.css";

interface MindMapProps {
	graph: MindMapGraph;
	onNodeClick: (id: string) => void;
}

interface LayoutNode extends GraphNode {
	x: number;
	y: number;
	radius: number;
	level: number;
}

const COLOR_BY_IDENTITY: Record<string, string> = {
	帝王: "#c0392b",
	将相: "#2c3e50",
	文人: "#8e44ad",
	谋士: "#16a085",
	刺客: "#7f8c8d",
	后妃: "#e84393",
	游侠: "#e67e22",
	异族: "#d35400",
	宦官: "#34495e",
	外戚: "#6c5ce7",
};

function colorFor(identity: string): string {
	return COLOR_BY_IDENTITY[identity] || "#2d3436";
}

/**
 * 简易辐射布局：
 * - 中心人物居中
 * - 邻居按扇形围绕中心，按 event_group 聚类
 * - 邻居的邻居（第二跳）放在外围
 */
function layout(graph: MindMapGraph, W: number, H: number): LayoutNode[] {
	const focusNode = graph.nodes.find((n) => n.isFocus);
	if (!focusNode) return [];

	const focusId = focusNode.id;
	const neighborIds = new Set<string>();
	const linkMap = new Map<string, Set<string>>();
	for (const l of graph.links) {
		if (!linkMap.has(l.source)) linkMap.set(l.source, new Set());
		if (!linkMap.has(l.target)) linkMap.set(l.target, new Set());
		linkMap.get(l.source)!.add(l.target);
		linkMap.get(l.target)!.add(l.source);
		if (l.source === focusId) neighborIds.add(l.target);
		if (l.target === focusId) neighborIds.add(l.source);
	}

	const cx = W / 2;
	const cy = H / 2;
	const minDim = Math.min(W, H);

	// 2) 第一层：直接邻居，按与 focus 的 event_group 归类排序
	const firstHop = Array.from(neighborIds)
		.map((id) => graph.nodes.find((n) => n.id === id)!)
		.filter(Boolean);
	// 优先把同事件的放一起
	firstHop.sort((a, b) => (a.dynasty || "").localeCompare(b.dynasty || ""));
	// 节点多时自动放大半径，避免拥挤
	const R1 = minDim * (firstHop.length > 8 ? 0.32 : 0.28); // 第一层半径
	const R2 = minDim * 0.46; // 第二层半径

	const layoutNodes: LayoutNode[] = [];

	// 1) 中心
	layoutNodes.push({
		...focusNode,
		x: cx,
		y: cy,
		radius: 42,
		level: 0,
	});

	const n1 = firstHop.length;
	firstHop.forEach((node, i) => {
		const angle = -Math.PI / 2 + (i / Math.max(n1, 1)) * Math.PI * 2;
		layoutNodes.push({
			...node,
			x: cx + Math.cos(angle) * R1,
			y: cy + Math.sin(angle) * R1,
			radius: 30,
			level: 1,
		});
	});

	// 3) 第二层：非中心、非邻居的节点
	const secondHop = graph.nodes.filter(
		(n) => n.id !== focusId && !neighborIds.has(n.id),
	);
	const n2 = secondHop.length;
	secondHop.forEach((node, i) => {
		const angle = -Math.PI / 2 + 0.15 + (i / Math.max(n2, 1)) * Math.PI * 2 * 0.85;
		layoutNodes.push({
			...node,
			x: cx + Math.cos(angle) * R2,
			y: cy + Math.sin(angle) * R2,
			radius: 22,
			level: 2,
		});
	});

	return layoutNodes;
}

/** 曲线：二次贝塞尔，连接两节点，控制点向中心偏移 */
function curvedPath(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number) {
	const mx = (x1 + x2) / 2;
	const my = (y1 + y2) / 2;
	const dx = mx - cx;
	const dy = my - cy;
	const d = Math.hypot(dx, dy) || 1;
	// 控制点在两点连线中点向中心的反方向偏移 20%
	const k = 0.22;
	const cpx = mx + (dx / d) * 40 * k * 0;
	const cpy = my + (dy / d) * 40 * k * 0;
	return `M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`;
}

export default function MindMap({ graph, onNodeClick }: MindMapProps) {
	const wrapRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ w: 720, h: 520 });
	const [hoverId, setHoverId] = useState<string | null>(null);
	const [tooltip, setTooltip] = useState<{
		x: number;
		y: number;
		node: LayoutNode;
	} | null>(null);

	useEffect(() => {
		if (!wrapRef.current) return;
		const el = wrapRef.current;
		const obs = new ResizeObserver((entries) => {
			for (const e of entries) {
				setSize({
					w: Math.max(480, e.contentRect.width),
					h: Math.max(420, e.contentRect.height),
				});
			}
		});
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	const layoutNodes = useMemo(
		() => layout(graph, size.w, size.h),
		[graph, size],
	);

	const nodeById = useMemo(() => {
		const m = new Map<string, LayoutNode>();
		for (const n of layoutNodes) m.set(n.id, n);
		return m;
	}, [layoutNodes]);

	const cx = size.w / 2;
	const cy = size.h / 2;

	const linksToRender: { link: GraphLink; a: LayoutNode; b: LayoutNode }[] = [];
	for (const link of graph.links) {
		const a = nodeById.get(link.source);
		const b = nodeById.get(link.target);
		if (a && b) linksToRender.push({ link, a, b });
	}

	return (
		<div
			ref={wrapRef}
			className="mm-wrap"
			style={{ width: "100%", height: 520, position: "relative" }}
		>
			{graph.eventGroups.length > 0 && (
				<div className="mm-legend">
					<span className="mm-legend-title">事件 · {graph.eventGroups.length}</span>
					<div className="mm-legend-tags">
						{graph.eventGroups.slice(0, 6).map((e) => (
							<span key={e} className="mm-event-tag">
								{e}
							</span>
						))}
						{graph.eventGroups.length > 6 && (
							<span className="mm-event-tag is-more">+{graph.eventGroups.length - 6}</span>
						)}
					</div>
				</div>
			)}

			<svg
				width={size.w}
				height={size.h}
				viewBox={`0 0 ${size.w} ${size.h}`}
				style={{ display: "block" }}
			>
				<defs>
					<radialGradient id="mm-focus-glow" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#f9ca24" stopOpacity="0.45" />
						<stop offset="100%" stopColor="#f9ca24" stopOpacity="0" />
					</radialGradient>
					<filter id="mm-shadow" x="-50%" y="-50%" width="200%" height="200%">
						<feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
					</filter>
				</defs>

				{/* 背景装饰：同心圆 + 淡网格 */}
				<g opacity="0.28">
					<circle cx={cx} cy={cy} r={Math.min(size.w, size.h) * 0.28} fill="none" stroke="#bdc3c7" strokeDasharray="4 6" strokeWidth="1" />
					<circle cx={cx} cy={cy} r={Math.min(size.w, size.h) * 0.46} fill="none" stroke="#bdc3c7" strokeDasharray="4 6" strokeWidth="1" />
				</g>

				{/* 连线 */}
				<g>
					{linksToRender.map(({ link, a, b }, idx) => {
						const isFocusLink = a.isFocus || b.isFocus;
						const highlight =
							hoverId && (hoverId === a.id || hoverId === b.id);
						const dim = hoverId && !isFocusLink && !highlight;
						const d = curvedPath(a.x, a.y, b.x, b.y, cx, cy);
						return (
							<path
								key={idx}
								d={d}
								fill="none"
								stroke={link.type === "event" ? "#d35400" : "#636e72"}
								strokeWidth={isFocusLink ? (highlight ? 2.5 : 1.8) : highlight ? 2 : 1.2}
								strokeOpacity={dim ? 0.18 : isFocusLink ? 0.85 : 0.55}
								strokeLinecap="round"
							>
								{link.label && (
									<title>{`${a.name} — ${b.name} · ${link.label}`}</title>
								)}
							</path>
						);
					})}
				</g>

				{/* 节点焦点光晕（仅中心） */}
				{layoutNodes
					.filter((n) => n.isFocus)
					.map((n) => (
						<circle
							key={`glow-${n.id}`}
							cx={n.x}
							cy={n.y}
							r={n.radius + 28}
							fill="url(#mm-focus-glow)"
						/>
					))}

				{/* 节点 */}
				<g>
					{layoutNodes.map((n) => {
						const color = colorFor(n.identity);
						const dim = hoverId && hoverId !== n.id && !n.isFocus;
						return (
							<g
								key={n.id}
								transform={`translate(${n.x}, ${n.y})`}
								style={{ cursor: "pointer", transition: "transform 160ms ease" }}
								onMouseEnter={(e) => {
									setHoverId(n.id);
									const wrapRect = wrapRef.current?.getBoundingClientRect();
									if (wrapRect) {
										setTooltip({
											x: e.clientX - wrapRect.left + 12,
											y: e.clientY - wrapRect.top - 10,
											node: n,
										});
									}
								}}
								onMouseMove={(e) => {
									const wrapRect = wrapRef.current?.getBoundingClientRect();
									if (wrapRect) {
										setTooltip((t) =>
											t ? { ...t, x: e.clientX - wrapRect.left + 12, y: e.clientY - wrapRect.top - 10 } : t,
										);
									}
								}}
								onMouseLeave={() => {
									setHoverId(null);
									setTooltip(null);
								}}
								onClick={() => onNodeClick(n.id)}
							>
								{/* 外圈 */}
								<circle
									r={n.radius + 4}
									fill="none"
									stroke={n.isFocus ? "#f9ca24" : color}
									strokeOpacity={dim ? 0.3 : n.isFocus ? 1 : 0.8}
									strokeWidth={n.isFocus ? 3.5 : 2}
								/>
								{/* 内圈 */}
								<circle
									r={n.radius}
									fill="#ffffff"
									stroke={color}
									strokeOpacity={dim ? 0.35 : 1}
									strokeWidth={1}
									filter="url(#mm-shadow)"
								/>
								{/* 文本：首字或缩写 */}
								<text
									textAnchor="middle"
									dominantBaseline="central"
									fontSize={n.isFocus ? 20 : n.level === 1 ? 15 : 12}
									fontWeight={n.isFocus ? 700 : 600}
									fill={color}
									style={{ userSelect: "none" }}
								>
									{n.name.slice(0, n.isFocus ? 2 : n.level === 1 ? 2 : 1)}
								</text>
							</g>
						);
					})}
				</g>
			</svg>

			{/* 节点悬浮气泡 */}
			{tooltip && (
				<div
					className="mm-tip"
					style={{
						position: "absolute",
						left: tooltip.x,
						top: tooltip.y,
						pointerEvents: "none",
					}}
				>
					<div className="mm-tip-name">{tooltip.node.name}</div>
					<div className="mm-tip-meta">
						<span style={{ color: colorFor(tooltip.node.identity) }}>● {tooltip.node.identity}</span>
						{tooltip.node.dynasty && <span> · {tooltip.node.dynasty}</span>}
						{tooltip.node.isFocus && <span className="mm-tip-focus"> · 中心人物</span>}
					</div>
					<div className="mm-tip-hint">点击跳转至该人物</div>
				</div>
			)}

			<div className="mm-foot">
				<span>共 {layoutNodes.length} 位人物 · {graph.links.length} 条关联</span>
				<span className="mm-foot-hint">点击人物可跳转查看详情</span>
			</div>
		</div>
	);
}
