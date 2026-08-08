import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CHARACTER_MAP, getCharacterMerged } from "../../data/characters";
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
}

// 游戏化元数据兜底（主项目不可用时仍能画单跳图）
function getGlyphAccent(id: string): { glyph: string; accent: string } {
  const c = CHARACTER_MAP[id];
  return c
    ? { glyph: c.glyph, accent: c.accent }
    : { glyph: id.charAt(0), accent: "#7a6e5c" };
}

/**
 * 人物关系力导向图（D3 7）。
 * 数据源优先用主项目 ego 子图 API（多跳关系网）；
 * 主项目不可用时降级为本地 gameRelations（单跳）。
 * 视觉保留 2D 力导向、glyph 节点。
 */
export function RelationGraph({ focus }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [mergedFocus, setMergedFocus] = useState<Character>(focus);
  const [loading, setLoading] = useState(true);

  // 异步合并主项目关系数据
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCharacterMerged(focus.id, true).then((merged) => {
      if (cancelled) return;
      if (merged) setMergedFocus(merged);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [focus.id]);

  useEffect(() => {
    const svgEl = ref.current;
    if (!svgEl || loading) return;

    const W = svgEl.clientWidth || 640;
    const H = svgEl.clientHeight || 440;

    // 构建节点与边
    const seen = new Set<string>([mergedFocus.id]);
    const nodes: GraphNode[] = [
      {
        id: mergedFocus.id,
        name: mergedFocus.name,
        glyph: mergedFocus.glyph,
        accent: mergedFocus.accent,
        isMain: true,
        owned: true,
      },
    ];
    const links: GraphLink[] = [];

    // 尝试用主项目 ego 子图（异步已在本 hook 外完成合并，relations 已含主项目数据）
    // mergedFocus.relations 在 getCharacterMerged 中已用主项目覆写（若有）
    for (const r of (mergedFocus.relations ?? [])) {
      if (!seen.has(r.targetId)) {
        seen.add(r.targetId);
        const ga = getGlyphAccent(r.targetId);
        nodes.push({
          id: r.targetId,
          name: r.targetId, // 主项目未拉名字时用 id 占位
          glyph: ga.glyph,
          accent: ga.accent,
          isMain: false,
          owned: true,
        });
      }
      links.push({
        source: mergedFocus.id,
        target: r.targetId,
        type: r.type,
        label: r.label,
      });
    }

    // 异步补全邻居节点的 name（从主项目批量拉）
    const neighborIds = nodes
      .filter((n) => !n.isMain)
      .map((n) => n.id)
      .filter(
        (id) =>
          CHARACTER_MAP[id]?.name === undefined ||
          CHARACTER_MAP[id]?.name === id,
      );
    if (neighborIds.length > 0) {
      Promise.all(
        neighborIds.map(async (id) => {
          const fig = await import("../../services/mainProjectApi").then((m) =>
            m.fetchFigure(id),
          );
          return { id, name: fig?.name ?? id };
        }),
      ).then((results) => {
        for (const { id, name } of results) {
          const node = nodes.find((n) => n.id === id);
          if (node) node.name = name;
        }
        // 触发重绘：更新文字
        d3.select(svgEl)
          .selectAll<SVGGElement, GraphNode>("g.node text.name-text")
          .text((d) => (d.owned ? d.name : "未解锁"));
      });
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
      .attr("class", "node")
      .attr("cursor", "grab")
      .call(
        d3
          .drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = event.x;
            d.fy = event.y;
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
      .attr("class", "name-text")
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
        .attr(
          "x",
          (d) => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2,
        )
        .attr(
          "y",
          (d) =>
            ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2 - 6,
        );
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      sim.stop();
    };
  }, [mergedFocus, loading]);

  const usedTypes = Array.from(
    new Set((mergedFocus.relations ?? []).map((r) => r.type)),
  );

  return (
    <div className="relation-graph">
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "40% 0",
            color: "var(--color-rice-dim)",
          }}
        >
          正在从史册中抽取关系网…
        </div>
      )}
      <svg
        ref={ref}
        className="relation-svg"
        style={{ display: loading ? "none" : "block" }}
      />
      {!loading && (
        <div className="relation-legend">
          {usedTypes.map((t) => (
            <span className="legend-item" key={t}>
              <span
                className="swatch"
                style={{ background: RELATION_COLORS[t] }}
              />
              {RELATION_LABELS[t]}
            </span>
          ))}
          <span className="legend-hint">可拖拽节点 · 滚轮缩放</span>
        </div>
      )}
    </div>
  );
}
