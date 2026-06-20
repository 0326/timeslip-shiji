import { useState } from "react";
import { ChevronDown, ScrollText } from "lucide-react";
import { getCharacter } from "../../data/characters";
import { CharacterAvatar } from "../../components/CharacterAvatar";
import type { PanoramaEvent } from "../../data/panorama";

interface Props {
	events: PanoramaEvent[];
}

/** 竖向事件时间轴：点击展开多视角内心 + 原文 + 史学解读 */
export function EventTimeline({ events }: Props) {
	const [open, setOpen] = useState<string | null>(events[0]?.id ?? null);

	return (
		<div className="timeline">
			{events.map((ev) => {
				const expanded = open === ev.id;
				return (
					<article className={`tl-item${expanded ? " open" : ""}`} key={ev.id}>
						<div className="tl-spine">
							<span className="tl-dot" />
						</div>
						<div className="tl-content">
							<button className="tl-head" onClick={() => setOpen(expanded ? null : ev.id)}>
								<div className="tl-head-main">
									<span className="tl-time">{ev.time}</span>
									<h3 className="serif tl-title">{ev.title}</h3>
									<p className="tl-summary">{ev.summary}</p>
								</div>
								<ChevronDown size={18} className={`tl-chev${expanded ? " r" : ""}`} />
							</button>

							{expanded && (
								<div className="tl-detail anim-fade-in">
									<div className="tl-section-label">众生此刻</div>
									<div className="tl-perspectives">
										{ev.perspectives.map((p) => {
											const ch = getCharacter(p.characterId);
											return (
												<div className="tl-persp" key={p.characterId}>
													<CharacterAvatar
														glyph={ch?.glyph ?? "？"}
														accent={ch?.accent ?? "#7a6e5c"}
														size={40}
													/>
													<div className="tl-persp-body">
														<div className="tl-persp-name">{ch?.name ?? p.characterId}</div>
														<p className="tl-persp-thought">「{p.thought}」</p>
													</div>
												</div>
											);
										})}
									</div>

									<div className="tl-classical">
										<ScrollText size={14} className="gold" />
										<p className="classical">{ev.classical}</p>
									</div>

									<div className="tl-section-label">史官解读</div>
									<p className="tl-analysis">{ev.analysis}</p>
								</div>
							)}
						</div>
					</article>
				);
			})}
		</div>
	);
}
