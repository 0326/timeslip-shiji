import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Map } from "lucide-react";
import "./Archive.css";
import { CHARACTERS, getCharacter } from "../../data/characters";
import { STORYLINE_MAP } from "../../data/storylines";
import { ERA_LABELS, type Character } from "../../types/character";
import { RELATION_COLORS, RELATION_LABELS } from "../../data/relationColors";
import { useUserStore } from "../../store/userStore";
import { Badge, Button, Modal } from "../../components/ui";
import { CharacterAvatar } from "../../components/CharacterAvatar";

export function ArchivePage() {
	const owned = useUserStore((s) => s.progress.gacha.ownedCharacters);
	const [active, setActive] = useState<Character | null>(null);
	const ownedSet = new Set(owned);

	return (
		<div className="archive-page">
			<div className="section-head">
				<h2 className="serif">角色图鉴</h2>
				<span className="sub">每一位，都是史册里一个有血肉的人</span>
			</div>

			<div className="archive-stats">
				<div className="stat-chip">
					<div className="v">
						{ownedSet.size}/{CHARACTERS.length}
					</div>
					<div className="l">已收录角色</div>
				</div>
				<div className="stat-chip">
					<div className="v">{Math.round((ownedSet.size / CHARACTERS.length) * 100)}%</div>
					<div className="l">图鉴完成度</div>
				</div>
			</div>

			<div className="archive-grid">
				{CHARACTERS.map((ch) => {
					const has = ownedSet.has(ch.id);
					return (
						<article
							key={ch.id}
							className={`archive-card ${has ? "owned" : "locked"}`}
							onClick={() => has && setActive(ch)}
						>
							<CharacterAvatar glyph={ch.glyph} accent={ch.accent} size={84} locked={!has} />
							<div className="nm">{has ? ch.name : "？？？"}</div>
							<div className="tt">{has ? ch.title : "尚未在史册中相遇"}</div>
							<Badge tone={has ? "gold" : "default"}>{ERA_LABELS[ch.era]}</Badge>
						</article>
					);
				})}
			</div>

			<Modal open={!!active} onClose={() => setActive(null)}>
				{active && <CharDetail ch={active} onClose={() => setActive(null)} />}
			</Modal>
		</div>
	);
}

function CharDetail({ ch, onClose }: { ch: Character; onClose: () => void }) {
	const navigate = useNavigate();
	return (
		<div className="char-detail">
			<div className="char-detail-head">
				<CharacterAvatar glyph={ch.glyph} accent={ch.accent} size={88} />
				<div className="meta">
					<h2 className="serif">{ch.name}</h2>
					<div className="tt">{ch.title}</div>
					<div style={{ marginTop: 8 }}>
						<Badge tone="gold">{ERA_LABELS[ch.era]}</Badge>{" "}
						<Badge>{ch.historicalSource}</Badge>
					</div>
				</div>
			</div>

			<div className="char-quote">「{ch.classicalQuote}」</div>

			<div className="char-section-label">生平</div>
			<p style={{ fontSize: 14.5, lineHeight: 1.95, color: "var(--color-rice-dim)" }}>
				{ch.description}
			</p>

			<div className="char-section-label">人物关系</div>
			<div className="relation-chips">
				{ch.relations.map((r) => {
					const target = getCharacter(r.targetId);
					return (
						<span className="relation-chip" key={r.targetId}>
							<span className="dot" style={{ background: RELATION_COLORS[r.type] }} />
							<span style={{ color: "var(--color-rice)" }}>{target?.name ?? r.targetId}</span>
							<span style={{ color: "var(--color-rice-dim)" }}>· {r.label}</span>
							<span style={{ color: RELATION_COLORS[r.type], fontSize: 11 }}>
								{RELATION_LABELS[r.type]}
							</span>
						</span>
					);
				})}
			</div>

			<div className="char-section-label">关联故事线</div>
			<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
				{ch.relatedStorylines.map((sid) => {
					const st = STORYLINE_MAP[sid];
					if (!st) return null;
					const playable = st.perspectives.some((p) => p.characterId === ch.id);
					return (
						<div
							key={sid}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 12,
								padding: 12,
								border: "1px solid var(--color-ink-mid)",
								borderRadius: 8,
							}}
						>
							<div style={{ flex: 1 }}>
								<div className="serif" style={{ fontSize: 16 }}>
									{st.title}
								</div>
								<div style={{ fontSize: 12, color: "var(--color-rice-dim)" }}>{st.subtitle}</div>
							</div>
							{playable ? (
								<Button
									size="sm"
									onClick={() => {
										onClose();
										navigate(`/play/${st.id}/${ch.id}`);
									}}
								>
									<BookOpen size={14} /> 穿越
								</Button>
							) : (
								<Button
									size="sm"
									variant="ghost"
									onClick={() => {
										onClose();
										navigate(`/panorama/${st.id}`);
									}}
								>
									<Map size={14} /> 全景
								</Button>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
