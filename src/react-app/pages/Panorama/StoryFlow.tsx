import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FlowNode, FlowChoice } from "../../data/storyFlow";

interface Props {
	nodes: FlowNode[];
	title: string;
}

interface LayoutNode {
	id: string;
	data: FlowNode;
	x: number;
	y: number;
	width: number;
	height: number;
	level: number;
}

interface LayoutLink {
	source: LayoutNode;
	target: LayoutNode;
	choice?: FlowChoice;
}

const NODE_W = 200;
const NODE_H = 72;
const LEVEL_GAP = 200;
const NODE_GAP = 32;
const END_W = 180;
const END_H = 60;
const CHOICE_W = 160;
const CHOICE_H = 80;

function getNodeWidth(d: FlowNode): number {
	if (d.type === "choice") return CHOICE_W;
	if (d.type === "ending") return END_W;
	if (d.type === "death") return END_W;
	const textLen = d.title.length;
	return Math.min(230, Math.max(150, textLen * 10 + 40));
}

function getNodeHeight(d: FlowNode): number {
	if (d.type === "start") return 68;
	if (d.type === "choice") return CHOICE_H;
	if (d.type === "ending") return END_H;
	if (d.type === "death") return END_H;
	if (d.type === "story") return 64;
	return 60;
}

export function StoryFlow({ nodes, title }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const [viewportW, setViewportW] = useState(1200);
	const [viewportH, setViewportH] = useState(640);
	const [selectedNode, setSelectedNode] = useState<string | null>(null);
	const [hoveredNode, setHoveredNode] = useState<string | null>(null);
	const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

	const [scale, setScale] = useState(1);
	const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [isPanning, setIsPanning] = useState(false);
	const panStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				setViewportW(containerRef.current.clientWidth || 1200);
				setViewportH(containerRef.current.clientHeight || 640);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const { layoutNodes, layoutLinks, viewboxW, viewboxH } = useMemo(() => {
		if (!nodes || nodes.length === 0) {
			return { layoutNodes: [] as LayoutNode[], layoutLinks: [] as LayoutLink[], viewboxW: viewportW, viewboxH: viewportH };
		}
		const nodeMap = new Map<string, FlowNode>();
		nodes.forEach((n) => nodeMap.set(n.id, n));

		const levels = new Map<string, number>();
		const childrenMap = new Map<string, string[]>();

		const assignLevel = (id: string, level: number) => {
			const existing = levels.get(id);
			// 图谱允许回环/重复引用；节点一旦访问过就不再递归，
			// 否则循环边会不断增加 level，最终耗尽调用栈。
			if (existing !== undefined) return;
			levels.set(id, level);
			const node = nodeMap.get(id);
			if (!node) return;
			if (node.choices) {
				const kids: string[] = [];
				node.choices.forEach((c) => {
					kids.push(c.target);
					if (nodeMap.has(c.target)) assignLevel(c.target, level + 1);
				});
				childrenMap.set(id, kids);
			} else if (node.next && nodeMap.has(node.next)) {
				childrenMap.set(id, [node.next]);
				assignLevel(node.next, level + 1);
			}
		};
		// 旧图谱数据并不都以 `start` 为根节点。缺少该节点时从首个节点
		// 开始布局，避免空布局进入 Math.max(...[]) 而使整个页面崩溃。
		const rootId = nodeMap.has("start") ? "start" : nodes[0]?.id;
		if (rootId) assignLevel(rootId, 0);
		if (levels.size === 0) {
			return { layoutNodes: [], layoutLinks: [], viewboxW: 1200, viewboxH: 640 };
		}

		const maxLevel = Math.max(...Array.from(levels.values()));
		const byLevel: string[][] = Array.from({ length: maxLevel + 1 }, () => []);
		levels.forEach((lvl, id) => byLevel[lvl].push(id));

		const placed = new Map<string, LayoutNode>();
		const levelMaxY = new Map<number, number>();

		byLevel.forEach((ids, lvl) => {
			let yCursor = levelMaxY.get(lvl - 1) ?? 0;
			ids.forEach((id) => {
				const data = nodeMap.get(id)!;
				const w = getNodeWidth(data);
				const h = getNodeHeight(data);
				const x = lvl * (NODE_W + LEVEL_GAP);
				const y = yCursor;
				placed.set(id, { id, data, x, y, width: w, height: h, level: lvl });
				yCursor += h + NODE_GAP;
			});
			levelMaxY.set(lvl, yCursor);
		});

		byLevel.forEach((ids, lvl) => {
			if (lvl === 0) return;
			const prevIds = byLevel[lvl - 1];
			if (prevIds.length === 1 && ids.length > 1) {
				const parent = placed.get(prevIds[0])!;
				const totalH =
					ids.reduce((sum, id) => sum + placed.get(id)!.height, 0) +
					(ids.length - 1) * NODE_GAP;
				const startY = parent.y + parent.height / 2 - totalH / 2;
				let y = startY;
				ids.forEach((id) => {
					const node = placed.get(id)!;
					node.y = y;
					y += node.height + NODE_GAP;
				});
			}
		});

		byLevel.forEach((ids, lvl) => {
			if (lvl < 2) return;
			ids.forEach((id) => {
				const children = childrenMap.get(id);
				if (!children || children.length === 0) return;
				const childNodes = children
					.map((c) => placed.get(c))
					.filter((n): n is LayoutNode => !!n);
				if (childNodes.length === 0) return;

				const parent = placed.get(id)!;
				const parentCenterY = parent.y + parent.height / 2;

				if (childNodes.length === 1) {
					const child = childNodes[0];
					child.y = parentCenterY - child.height / 2;
				} else {
					const totalH =
						childNodes.reduce((s, n) => s + n.height, 0) +
						(childNodes.length - 1) * NODE_GAP;
					let cy = parentCenterY - totalH / 2;
					childNodes.forEach((cn) => {
						cn.y = cy;
						cy += cn.height + NODE_GAP;
					});
				}
			});
		});

		const layoutNodes = Array.from(placed.values());

		const layoutLinks: LayoutLink[] = [];
		layoutNodes.forEach((src) => {
			const data = src.data;
			if (data.choices) {
				data.choices.forEach((c) => {
					const tgt = placed.get(c.target);
					if (tgt) layoutLinks.push({ source: src, target: tgt, choice: c });
				});
			} else if (data.next) {
				const tgt = placed.get(data.next);
				if (tgt) layoutLinks.push({ source: src, target: tgt });
			}
		});

		const rightmost = Math.max(...layoutNodes.map((n) => n.x + n.width));
		const bottommost = Math.max(...layoutNodes.map((n) => n.y + n.height));
		const topmost = Math.min(...layoutNodes.map((n) => n.y));
		const viewboxW = rightmost + 120;
		const viewboxH = bottommost - topmost + 100;

		const offsetY = 0 - topmost + 50;
		layoutNodes.forEach((n) => {
			n.y += offsetY;
		});

		return { layoutNodes, layoutLinks, viewboxW, viewboxH };
	}, [nodes]);

	const selectedData = nodes.find((n) => n.id === selectedNode);
	const hoveredData = nodes.find((n) => n.id === hoveredNode);

	const handleWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault();
			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			const newScale = Math.min(3, Math.max(0.3, scale * delta));

			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;
			const mx = e.clientX - rect.left;
			const my = e.clientY - rect.top;

			setOffset((prev) => ({
				x: mx - (mx - prev.x) * (newScale / scale),
				y: my - (my - prev.y) * (newScale / scale),
			}));
			setScale(newScale);
		},
		[scale]
	);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (e.button !== 0) return;
			const target = e.target as SVGElement;
			if (target.closest(".flow-node-group")) return;

			setIsPanning(true);
			panStart.current = { x: e.clientX, y: e.clientY, offsetX: offset.x, offsetY: offset.y };
		},
		[offset]
	);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!isPanning) return;
			const dx = e.clientX - panStart.current.x;
			const dy = e.clientY - panStart.current.y;
			setOffset({ x: panStart.current.offsetX + dx, y: panStart.current.offsetY + dy });
		},
		[isPanning]
	);

	const handleMouseUp = useCallback(() => {
		setIsPanning(false);
	}, []);

	const resetView = useCallback(() => {
		setScale(1);
		setOffset({ x: 0, y: 0 });
	}, []);

	const fitView = useCallback(() => {
		const padding = 40;
		const scaleX = (viewportW - padding * 2) / viewboxW;
		const scaleY = (viewportH - padding * 2) / viewboxH;
		const newScale = Math.min(scaleX, scaleY, 1.5);
		setScale(newScale);
		setOffset({
			x: (viewportW - viewboxW * newScale) / 2,
			y: (viewportH - viewboxH * newScale) / 2,
		});
	}, [viewportW, viewportH, viewboxW, viewboxH]);

	const getNodeCenter = (ln: LayoutNode) => ({
		x: ln.x + ln.width / 2,
		y: ln.y + ln.height / 2,
	});

	const getNodeEdgePoint = (ln: LayoutNode, side: "left" | "right") => {
		const cx = ln.x + ln.width / 2;
		const cy = ln.y + ln.height / 2;

		if (ln.data.type === "choice") {
			const hw = ln.width / 2;
			const hh = ln.height / 2;
			if (side === "right") {
				const t = 0.5;
				return { x: cx + hw * t, y: cy + hh * (1 - Math.abs(2 * t - 1)) * 0 + hh * (2 * t - 1) * 0 };
			} else {
				return { x: ln.x, y: cy };
			}
		}

		if (side === "right") return { x: ln.x + ln.width, y: cy };
		return { x: ln.x, y: cy };
	};

	function getNodeStyle(d: FlowNode) {
		let fill = "var(--color-ink-soft)";
		let stroke = "var(--color-ink-mid)";
		let titleColor = "var(--color-rice)";
		let subColor = "var(--color-rice-dim)";
		let subLabel = "";
		let glowColor = "transparent";

		switch (d.type) {
			case "start":
			case "story":
				fill = "color-mix(in srgb, var(--color-gold) 22%, transparent)";
				stroke = "var(--color-gold)";
				titleColor = "var(--color-gold-light)";
				subLabel = d.type === "start" ? "故事起点" : "故事续篇";
				glowColor = "rgba(184,151,58,0.35)";
				break;
			case "choice":
				fill = "color-mix(in srgb, var(--color-cyan) 16%, transparent)";
				stroke = "var(--color-cyan-light)";
				titleColor = "var(--color-cyan-light)";
				subLabel = "选择";
				glowColor = "rgba(45,146,184,0.3)";
				break;
			case "event":
				fill = "color-mix(in srgb, var(--color-rice) 8%, transparent)";
				stroke = "var(--color-rice-dim)";
				subLabel = "事件";
				glowColor = "rgba(242,236,216,0.12)";
				break;
			case "ending":
				if (d.endingKind === "canon") {
					fill = "color-mix(in srgb, var(--color-gold) 28%, transparent)";
					stroke = "var(--color-gold)";
					titleColor = "var(--color-gold-light)";
					subLabel = "史实结局";
					glowColor = "rgba(184,151,58,0.4)";
				} else {
					fill = "color-mix(in srgb, var(--color-cyan) 24%, transparent)";
					stroke = "var(--color-cyan-light)";
					titleColor = "var(--color-cyan-light)";
					subLabel = "历史歧路";
					glowColor = "rgba(45,146,184,0.35)";
				}
				break;
			case "death":
				fill = "color-mix(in srgb, var(--color-vermilion) 20%, transparent)";
				stroke = "var(--color-vermilion)";
				titleColor = "var(--color-vermilion-light)";
				subColor = "var(--color-vermilion-light)";
				subLabel = "死亡";
				glowColor = "rgba(192,57,43,0.35)";
				break;
		}

		return { fill, stroke, titleColor, subColor, subLabel, glowColor };
	}

	const getLinkColor = (link: LayoutLink) => {
		const isCorrect = link.choice?.isCorrect;
		const isDeath = link.target.data.type === "death";
		const isCanon =
			link.target.data.type === "ending" && link.target.data.endingKind === "canon";
		const isIf =
			link.target.data.type === "ending" && link.target.data.endingKind === "if";

		if (isCorrect)
			return { stroke: "var(--color-gold)", marker: "url(#arrow-gold)", w: 2.4, opacity: 0.9 };
		if (isDeath)
			return {
				stroke: "var(--color-vermilion)",
				marker: "url(#arrow-vermilion)",
				w: 2,
				opacity: 0.85,
			};
		if (isCanon)
			return { stroke: "var(--color-gold)", marker: "url(#arrow-gold)", w: 2.2, opacity: 0.85 };
		if (isIf)
			return {
				stroke: "var(--color-cyan-light)",
				marker: "url(#arrow-cyan)",
				w: 2,
				opacity: 0.8,
			};
		return { stroke: "var(--color-ink-mid)", marker: "url(#arrow-mid)", w: 1.6, opacity: 0.7 };
	};

	function buildBezierPath(link: LayoutLink) {
		const sx = link.source.x + link.source.width;
		const sy = link.source.y + link.source.height / 2;
		const tx = link.target.x;
		const ty = link.target.y + link.target.height / 2;
		const midX = (sx + tx) / 2;
		return `M${sx},${sy} C${midX},${sy} ${midX},${ty} ${tx},${ty}`;
	}

	function getChoiceLabelPosition(link: LayoutLink) {
		const sx = link.source.x + link.source.width;
		const sy = link.source.y + link.source.height / 2;
		const tx = link.target.x;
		const ty = link.target.y + link.target.height / 2;
		return {
			x: (sx + tx) / 2,
			y: (sy + ty) / 2,
		};
	}

	return (
		<div className="flow-container" ref={containerRef} style={{ height: viewportH }}>
			<div className="flow-header">
				<h3 className="serif">{title}</h3>
				<div className="flow-legend">
					<span className="legend-item">
						<span className="legend-swatch start" />
						<span>故事</span>
					</span>
					<span className="legend-item">
						<span className="legend-swatch choice" />
						<span>选择点</span>
					</span>
					<span className="legend-item">
						<span className="legend-swatch event" />
						<span>事件</span>
					</span>
					<span className="legend-item">
						<span className="legend-swatch canon" />
						<span>史实结局</span>
					</span>
					<span className="legend-item">
						<span className="legend-swatch if" />
						<span>历史歧路</span>
					</span>
					<span className="legend-item">
						<span className="legend-swatch death" />
						<span>死亡</span>
					</span>
					<span className="legend-hint">滚轮缩放 · 拖拽平移 · 点击节点查看详情</span>
				</div>
			</div>

			<div className="flow-toolbar">
				<button className="flow-tool-btn" onClick={resetView} title="重置视图">
					⟲ 重置
				</button>
				<button className="flow-tool-btn" onClick={fitView} title="适配视图">
					⊡ 适配
				</button>
				<button
					className="flow-tool-btn"
					onClick={() => setScale((s) => Math.min(3, s * 1.2))}
					title="放大"
				>
					+
				</button>
				<button
					className="flow-tool-btn"
					onClick={() => setScale((s) => Math.max(0.3, s / 1.2))}
					title="缩小"
				>
					−
				</button>
				<span className="flow-zoom-label">{Math.round(scale * 100)}%</span>
			</div>

			<div
				className={`flow-graph ${isPanning ? "panning" : ""}`}
				onWheel={handleWheel}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				<svg
					ref={svgRef}
					className="flow-svg"
					style={{
						width: viewboxW,
						height: viewboxH,
						transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
						transformOrigin: "0 0",
						cursor: isPanning ? "grabbing" : "grab",
					}}
				>
					<defs>
						<marker
							id="arrow-gold"
							markerWidth="12"
							markerHeight="12"
							refX="10"
							refY="6"
							orient="auto"
						>
							<path d="M0,0 L12,6 L0,12 z" fill="var(--color-gold)" />
						</marker>
						<marker
							id="arrow-cyan"
							markerWidth="12"
							markerHeight="12"
							refX="10"
							refY="6"
							orient="auto"
						>
							<path d="M0,0 L12,6 L0,12 z" fill="var(--color-cyan-light)" />
						</marker>
						<marker
							id="arrow-vermilion"
							markerWidth="12"
							markerHeight="12"
							refX="10"
							refY="6"
							orient="auto"
						>
							<path d="M0,0 L12,6 L0,12 z" fill="var(--color-vermilion)" />
						</marker>
						<marker
							id="arrow-mid"
							markerWidth="12"
							markerHeight="12"
							refX="10"
							refY="6"
							orient="auto"
						>
							<path d="M0,0 L12,6 L0,12 z" fill="var(--color-ink-mid)" />
						</marker>
						<filter id="glow-gold">
							<feGaussianBlur stdDeviation="4" result="blur" />
							<feMerge>
								<feMergeNode in="blur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
						<filter id="glow-cyan">
							<feGaussianBlur stdDeviation="3" result="blur" />
							<feMerge>
								<feMergeNode in="blur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
						<filter id="glow-vermilion">
							<feGaussianBlur stdDeviation="3" result="blur" />
							<feMerge>
								<feMergeNode in="blur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
						<filter id="shadow-node">
							<feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
						</filter>
					</defs>

					{layoutLinks.map((link, i) => {
						const lc = getLinkColor(link);
						const d = buildBezierPath(link);
						const isHovered = hoveredNode === link.source.id || hoveredNode === link.target.id;
						const isActive = selectedNode === link.source.id || selectedNode === link.target.id;
						const label = link.choice?.text;
						const lp = label ? getChoiceLabelPosition(link) : null;
						const showFull = isHovered || isActive;

						return (
							<g key={`link-${i}`} className="flow-link">
								<path
									d={d}
									stroke={lc.stroke}
									strokeWidth={lc.w + 3}
									fill="none"
									strokeOpacity={0.15}
									strokeLinecap="round"
								/>
								<path
									d={d}
									stroke={lc.stroke}
									strokeWidth={lc.w}
									fill="none"
									strokeOpacity={showFull ? Math.min(1, lc.opacity + 0.25) : lc.opacity}
									strokeLinecap="round"
									markerEnd={lc.marker}
									style={{ transition: "stroke-opacity 0.3s" }}
								/>
								{lp && label && (
									<g transform={`translate(${lp.x}, ${lp.y})`}>
										<rect
											rx="10"
											ry="10"
											width={showFull ? Math.min(220, label.length * 8.5 + 24) : Math.min(140, label.length * 7 + 20)}
											height={showFull ? 30 : 24}
											x={-(showFull ? Math.min(220, label.length * 8.5 + 24) : Math.min(140, label.length * 7 + 20)) / 2}
											y={showFull ? -15 : -12}
											fill="var(--color-ink)"
											stroke={lc.stroke}
											strokeWidth="1"
											strokeOpacity="0.6"
											opacity={0.92}
										/>
										<text
											x="0"
											y={showFull ? 5 : 4}
											textAnchor="middle"
											fontSize={showFull ? 11.5 : 10.5}
											fontFamily="var(--font-serif)"
											fill={lc.stroke.includes("gold") ? "var(--color-gold-light)" : lc.stroke.includes("cyan") ? "var(--color-cyan-light)" : lc.stroke.includes("vermilion") ? "var(--color-vermilion-light)" : "var(--color-rice-dim)"}
											style={{ transition: "font-size 0.3s" }}
										>
											{showFull
												? label
												: label.length > 14
													? label.substring(0, 14) + "…"
													: label}
										</text>
									</g>
								)}
							</g>
						);
					})}

					{layoutNodes.map((ln) => {
						const d = ln.data;
						const st = getNodeStyle(d);
						const isSelected = selectedNode === ln.id;
						const isHovered = hoveredNode === ln.id;
						const interactive = d.type !== "death" || true;

						const filterStr = isSelected
							? d.type === "ending" && d.endingKind === "canon"
								? "url(#glow-gold)"
								: d.type === "ending"
									? "url(#glow-cyan)"
									: d.type === "death"
										? "url(#glow-vermilion)"
										: d.type === "choice"
											? "url(#glow-cyan)"
											: "url(#glow-gold)"
							: "url(#shadow-node)";

						const title =
							d.title.length > (d.type === "choice" ? 10 : 16)
								? d.title.substring(0, d.type === "choice" ? 10 : 16) + "…"
								: d.title;

						return (
							<g
								key={ln.id}
								transform={`translate(${ln.x}, ${ln.y})`}
								className="flow-node-group flow-node"
								style={{ cursor: "pointer" }}
								filter={filterStr}
								onMouseEnter={(e) => {
									setHoveredNode(ln.id);
									const rect = containerRef.current?.getBoundingClientRect();
									if (rect) {
										setTooltipPos({
											x: e.clientX - rect.left,
											y: e.clientY - rect.top,
										});
									}
								}}
								onMouseMove={(e) => {
									const rect = containerRef.current?.getBoundingClientRect();
									if (rect) {
										setTooltipPos({
											x: e.clientX - rect.left,
											y: e.clientY - rect.top,
										});
									}
								}}
								onMouseLeave={() => {
									setHoveredNode(null);
									setTooltipPos(null);
								}}
								onClick={(e) => {
									e.stopPropagation();
									setSelectedNode(ln.id);
								}}
							>
								{d.type === "choice" ? (
									<>
										<polygon
											points={`${ln.width / 2},0 ${ln.width},${ln.height / 2} ${ln.width / 2},${ln.height} 0,${ln.height / 2}`}
											fill={st.fill}
											stroke={isSelected ? "var(--color-rice)" : st.stroke}
											strokeWidth={isSelected ? 2.5 : 1.8}
											style={{ transition: "all 0.3s" }}
										/>
										<polygon
											points={`${ln.width / 2},0 ${ln.width},${ln.height / 2} ${ln.width / 2},${ln.height} 0,${ln.height / 2}`}
											fill="none"
											stroke={st.glowColor}
											strokeWidth="6"
											strokeOpacity={isHovered || isSelected ? 0.3 : 0}
											style={{ transition: "stroke-opacity 0.3s" }}
										/>
										<text
											x={ln.width / 2}
											y={ln.height / 2 - 2}
											textAnchor="middle"
											fontFamily="var(--font-serif)"
											fontSize="12"
											fontWeight="600"
											fill={st.titleColor}
										>
											{title}
										</text>
										<text
											x={ln.width / 2}
											y={ln.height / 2 + 14}
											textAnchor="middle"
											fontFamily="var(--font-serif)"
											fontSize="9"
											fill={st.subColor}
											opacity="0.8"
										>
											◈ {st.subLabel} ◈
										</text>
									</>
								) : d.type === "ending" || d.type === "death" ? (
									<>
										<rect
											rx={ln.height / 2}
											ry={ln.height / 2}
											width={ln.width}
											height={ln.height}
											fill={st.fill}
											stroke={isSelected ? "var(--color-rice)" : st.stroke}
											strokeWidth={isSelected ? 2.5 : 1.8}
											style={{ transition: "all 0.3s" }}
										/>
										<rect
											rx={ln.height / 2}
											ry={ln.height / 2}
											width={ln.width}
											height={ln.height}
											fill="none"
											stroke={st.glowColor}
											strokeWidth="6"
											strokeOpacity={isHovered || isSelected ? 0.35 : 0}
											style={{ transition: "stroke-opacity 0.3s" }}
										/>
										<text
											x={ln.width / 2}
											y={ln.height / 2 - 4}
											textAnchor="middle"
											fontFamily="var(--font-serif)"
											fontSize="13"
											fontWeight="600"
											fill={st.titleColor}
										>
											{title}
										</text>
										<text
											x={ln.width / 2}
											y={ln.height / 2 + 14}
											textAnchor="middle"
											fontFamily="var(--font-serif)"
											fontSize="10"
											fill={st.subColor}
											opacity="0.85"
										>
											{st.subLabel}
										</text>
									</>
								) : (
									<>
										<rect
											rx="10"
											ry="10"
											width={ln.width}
											height={ln.height}
											fill={st.fill}
											stroke={isSelected ? "var(--color-rice)" : st.stroke}
											strokeWidth={isSelected ? 2.5 : 1.5}
											style={{ transition: "all 0.3s" }}
										/>
										<rect
											rx="10"
											ry="10"
											width={ln.width}
											height={ln.height}
											fill="none"
											stroke={st.glowColor}
											strokeWidth="6"
											strokeOpacity={isHovered || isSelected ? 0.25 : 0}
											style={{ transition: "stroke-opacity 0.3s" }}
										/>
										<rect
											width="4"
											height={ln.height - 16}
											x="0"
											y="8"
											rx="2"
											fill={st.stroke}
											opacity="0.85"
										/>
										<text
											x={ln.width / 2 + 2}
											y={ln.height / 2 - 4}
											textAnchor="middle"
											fontFamily="var(--font-serif)"
											fontSize="13"
											fontWeight="500"
											fill={st.titleColor}
										>
											{title}
										</text>
										<text
											x={ln.width / 2 + 2}
											y={ln.height / 2 + 14}
											textAnchor="middle"
											fontFamily="var(--font-serif)"
											fontSize="10"
											fill={st.subColor}
											opacity="0.85"
										>
											{st.subLabel}
										</text>
									</>
								)}
							</g>
						);
					})}
				</svg>

				{hoveredData && tooltipPos && hoveredData.description && (
					<div
						className="flow-tooltip"
						style={{
							left: tooltipPos.x + 16,
							top: tooltipPos.y - 10,
						}}
					>
						<div className={`flow-tooltip-kind ${hoveredData.type} ${hoveredData.type === "ending" ? hoveredData.endingKind : ""}`}>
							{hoveredData.type === "start" && "故事起点"}
							{hoveredData.type === "story" && "故事续篇"}
							{hoveredData.type === "choice" && "选择点"}
							{hoveredData.type === "event" && "事件"}
							{hoveredData.type === "ending" &&
								(hoveredData.endingKind === "canon" ? "史实结局" : "历史歧路")}
							{hoveredData.type === "death" && "死亡结局"}
						</div>
						<div className="flow-tooltip-title serif">{hoveredData.title}</div>
						<div className="flow-tooltip-desc">{hoveredData.description}</div>
					</div>
				)}
			</div>

			{selectedData && (
				<div className="flow-detail" onClick={() => setSelectedNode(null)}>
					<div className="flow-detail-content" onClick={(e) => e.stopPropagation()}>
						<div
							className={`flow-detail-kind ${selectedData.type} ${
								selectedData.type === "ending" ? selectedData.endingKind : ""
							}`}
						>
							{selectedData.type === "start" && "故事起点"}
							{selectedData.type === "story" && "故事续篇"}
							{selectedData.type === "choice" && "选择点"}
							{selectedData.type === "event" && "事件"}
							{selectedData.type === "ending" &&
								(selectedData.endingKind === "canon" ? "史实结局" : "历史歧路")}
							{selectedData.type === "death" && "死亡结局"}
						</div>
						<h4 className="serif">{selectedData.title}</h4>
						{selectedData.description && (
							<p className="flow-detail-desc">{selectedData.description}</p>
						)}
						{selectedData.deathReason && (
							<p className="flow-detail-death">{selectedData.deathReason}</p>
						)}
						{selectedData.choices && (
							<div className="flow-detail-choices">
								{selectedData.choices.map((c, i) => (
									<div
										key={i}
										className={`flow-detail-choice ${c.isCorrect ? "correct" : ""}`}
									>
										{c.isCorrect && <span className="correct-mark">✓</span>}
										<span>{c.text}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
