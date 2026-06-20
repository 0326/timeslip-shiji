import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { CHARACTER_MAP } from "../../data/characters";
import { RELATION_COLORS, RELATION_LABELS } from "../../data/relationColors";
import type { Character, RelationType } from "../../types/character";

interface GraphNode extends d3.SimulationNodeDatum {
	id: string;
	name: string;
	glyph: string;
	accent: string;
	isMain: boolean;
	owned: boolean;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
	type: RelationType;
	label: string;
}

interface Props {
	focus: Character;
	ownedIds: Set<string>;
}

/**
 * 人物关系力导向图（D3 7）。以故事线主角为中心，
 * 连出其全部人物关系；节点可拖拽，按关系类型着色。
 */
export function RelationGraph({ focus, ownedIds }: Props) {
	const ref = useRef<SVGSVGElement>(null);

	useEffect(() => {
		const svgEl = ref.current;
		if (!svgEl) return;

		const W = svgEl.clientWidth || 640;
		const H = svgEl.clientHeight || 440;

		// 构建节点：主角 + 直接关系对象（去重）
		const seen = new Set<string>([focus.id]);
		const nodes: GraphNode[] = [
			{
				id: focus.id,
				name: focus.name,
				glyph: focus.glyph,
				accent: focus.accent,
				isMain: true,
				owned: true,
			},
		];
		const links: GraphLink[] = [];
		for (const r of focus.relations) {
			const target = CHARACTER_MAP[r.targetId];
			if (!target) continue;
			if (!seen.has(r.targetId)) {
				seen.add(r.targetId);
				nodes.push({
					id: target.id,
					name: target.name,
					glyph: target.glyph,
					accent: target.accent,
					isMain: false,
					owned: ownedIds.has(target.id),
				});
			}
			links.push({ source: focus.id, target: r.targetId, type: r.type, label: r.label });
		}

		const svg = d3.select(svgEl);
		svg.selectAll("*").remove();
		svg.attr("viewBox", `0 0 ${W} ${H}`);

		const root = svg.append("g");

		// 缩放/平移
		svg.call(
			d3
				.zoom<SVGSVGElement, unknown>()
				.scaleExtent([0.5, 2.5])
				.on("zoom", (e) => root.attr("transform", e.transform.toString())),
		);

		const sim = d3
			.forceSimulation<GraphNode>(nodes)
			.force(
				"link",
				d3
					.forceLink<GraphNode, GraphLink>(links)
					.id((d) => d.id)
					.distance(140),
			)
			.force("charge", d3.forceManyBody().strength(-520))
			.force("center", d3.forceCenter(W / 2, H / 2))
			.force("collide", d3.forceCollide(46));

		// ── 边 ──
		const link = root
			.append("g")
			.selectAll("line")
			.data(links)
			.join("line")
			.attr("stroke", (d) => RELATION_COLORS[d.type])
			.attr("stroke-width", 1.6)
			.attr("stroke-opacity", 0.55);

		const linkLabel = root
			.append("g")
			.selectAll("text")
			.data(links)
			.join("text")
			.text((d) => d.label)
			.attr("font-size", 10.5)
			.attr("font-family", "var(--font-serif)")
			.attr("fill", (d) => RELATION_COLORS[d.type])
			.attr("text-anchor", "middle")
			.attr("opacity", 0.85);

		// ── 节点 ──
		const node = root
			.append("g")
			.selectAll<SVGGElement, GraphNode>("g")
			.data(nodes)
			.join("g")
			.attr("cursor", "grab")
			.call(
				d3
					.drag<SVGGElement, GraphNode>()
					.on("start", (event, d) => {
						if (!event.active) sim.alphaTarget(0.3).restart();
						d.fx = d.x;
						d.fy = d.y;
					})
					.on("drag", (event, d) => {
						d.fx = event.x;
						d.fy = event.y;
					})
					.on("end", (event, d) => {
						if (!event.active) sim.alphaTarget(0);
						d.fx = null;
						d.fy = null;
					}),
			);

		node
			.append("circle")
			.attr("r", (d) => (d.isMain ? 30 : 22))
			.attr("fill", (d) => (d.owned ? `${d.accent}26` : "#14110d"))
			.attr("stroke", (d) => (d.owned ? d.accent : "rgba(184,151,58,0.3)"))
			.attr("stroke-width", (d) => (d.isMain ? 2.5 : 1.5));

		node
			.append("text")
			.text((d) => (d.owned ? d.glyph : "？"))
			.attr("font-size", (d) => (d.isMain ? 24 : 18))
			.attr("font-family", "var(--font-serif)")
			.attr("font-weight", 700)
			.attr("fill", (d) => (d.owned ? d.accent : "var(--color-rice-faint)"))
			.attr("text-anchor", "middle")
			.attr("dominant-baseline", "central");

		node
			.append("text")
			.text((d) => (d.owned ? d.name : "未解锁"))
			.attr("y", (d) => (d.isMain ? 46 : 38))
			.attr("font-size", 12)
			.attr("font-family", "var(--font-serif)")
			.attr("fill", "var(--color-rice)")
			.attr("text-anchor", "middle");

		sim.on("tick", () => {
			link
				.attr("x1", (d) => (d.source as GraphNode).x!)
				.attr("y1", (d) => (d.source as GraphNode).y!)
				.attr("x2", (d) => (d.target as GraphNode).x!)
				.attr("y2", (d) => (d.target as GraphNode).y!);
			linkLabel
				.attr("x", (d) => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
				.attr("y", (d) => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2 - 6);
			node.attr("transform", (d) => `translate(${d.x},${d.y})`);
		});

		return () => {
			sim.stop();
		};
	}, [focus, ownedIds]);

	const usedTypes = Array.from(new Set(focus.relations.map((r) => r.type)));

	return (
		<div className="relation-graph">
			<svg ref={ref} className="relation-svg" />
			<div className="relation-legend">
				{usedTypes.map((t) => (
					<span className="legend-item" key={t}>
						<span className="swatch" style={{ background: RELATION_COLORS[t] }} />
						{RELATION_LABELS[t]}
					</span>
				))}
				<span className="legend-hint">可拖拽节点 · 滚轮缩放</span>
			</div>
		</div>
	);
}
