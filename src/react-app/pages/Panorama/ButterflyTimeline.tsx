import { useState } from "react";
import { ChevronDown, ChevronRight, Sparkles, GitBranch, ArrowRight } from "lucide-react";
import type { ButterflyEffect } from "../../data/butterfly";

interface Props {
	effects: ButterflyEffect[];
}

const CHAPTER_MAP: Record<string, string> = {
	"huangdi:banquan": "黄帝·阪泉",
	"huangdi:zhitianxia": "黄帝·治天下",
	"huangdi:zhuolu": "黄帝·涿鹿",
	"yao:qiuxian": "尧·求贤",
	"shun:xingfa": "舜·作刑",
	"zhuanxu:diku": "颛顼·帝喾",
	"shun:liuxiong": "舜·流四凶",
	"yu:zhishui": "禹·治水",
};

function formatChapter(key: string): string {
	return CHAPTER_MAP[key] ?? key;
}

export function ButterflyTimeline({ effects }: Props) {
	const [open, setOpen] = useState<string | null>(effects[0]?.id ?? null);

	return (
		<div className="butterfly-timeline">
			<div className="butterfly-intro">
				<Sparkles size={16} className="gold" />
				<span>每一个选择，都在历史的湖面激起涟漪。<span className="gold serif">蝴蝶效应</span>让你看见——当年的一念之差，如何改写了后世的篇章。</span>
			</div>

			<div className="bt-spine">
				{effects.map((effect, i) => {
					const expanded = open === effect.id;
					const triggerCh = formatChapter(effect.triggerChapter);

					return (
						<div
							className={`bt-node${expanded ? " expanded" : ""}`}
							key={effect.id}
							style={{ animationDelay: `calc(var(--stagger) * ${Math.min(i, 8)})` }}
						>
							<div className="bt-spine-dot" />

							<div className="bt-node-body">
								<button
									className="bt-trigger"
									onClick={() => setOpen(expanded ? null : effect.id)}
								>
									<div className="bt-trigger-head">
										<span className="bt-chapter-tag">{triggerCh}</span>
										<ChevronDown size={16} className={`bt-chev${expanded ? " r" : ""}`} />
									</div>
									<div className="bt-trigger-choice">
										<GitBranch size={14} className="cyan" />
										<span className="serif">{effect.triggerChoice}</span>
									</div>
								</button>

								{expanded && (
									<div className="bt-detail anim-fade-in">
										<div className="bt-flow">
											<div className="bt-flow-step bt-choice-step">
												<div className="bt-step-label">抉择</div>
												<div className="bt-step-content">
													<span className="gold serif">{effect.triggerChoice}</span>
													<span className="bt-step-chapter">于 {triggerCh}</span>
												</div>
											</div>

											<div className="bt-flow-arrow">
												<ArrowRight size={16} className="gold" />
											</div>

											{effect.effects.map((eff, j) => (
												<div className="bt-flow-chain" key={j}>
													<div className="bt-flow-step bt-consequence-step">
														<div className="bt-step-label">
															<Sparkles size={12} />
															连锁反应
														</div>
														<div className="bt-step-content">
															<span className="cyan serif">{formatChapter(eff.chapter)}</span>
															<span className="bt-step-node">「{eff.insertAfter}」节点后</span>
														</div>
													</div>

													<div className="bt-flow-arrow down">
														<ChevronRight size={14} className="cyan" />
													</div>

													<div className="bt-narration">
														<span className="bt-narration-label">蝴蝶振翅</span>
														<p className="bt-narration-text">{eff.narration}</p>
													</div>
												</div>
											))}
										</div>

										<div className="bt-summary">
											<span className="bt-summary-label">效应概述</span>
											<p>{effect.description}</p>
										</div>
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>

			<div className="bt-footer">
				<span className="dim">共 {effects.length} 条蝴蝶效应 · 每一次选择，都在雕刻历史的轨迹</span>
			</div>
		</div>
	);
}