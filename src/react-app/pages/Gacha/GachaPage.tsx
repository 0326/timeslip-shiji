import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Sparkles, Gift, Shield } from "lucide-react";
import "./Gacha.css";
import { CURRENT_POOL, FRAGMENT_COSTS } from "../../data/gachaPools";
import { getCharacter } from "../../data/characters";
import { useUserStore } from "../../store/userStore";
import { useUiStore } from "../../store/uiStore";
import { useGacha } from "../../hooks/useGacha";
import type { PullResult } from "../../types/gacha";
import { Badge, Button, Modal } from "../../components/ui";
import { CharacterAvatar } from "../../components/CharacterAvatar";

export function GachaPage() {
	const progress = useUserStore((s) => s.progress);
	const pushToast = useUiStore((s) => s.pushToast);
	const { pull, redeemCharacter } = useGacha();
	const [results, setResults] = useState<PullResult[] | null>(null);
	const [shopOpen, setShopOpen] = useState(false);

	const owned = new Set(progress.gacha.ownedCharacters);
	const pity = progress.gacha.pityCount;
	const remainToPity = Math.max(0, CURRENT_POOL.rules.pityAt + 1 - pity);

	function doPull(count: 1 | 10) {
		if (progress.gachaTickets < count) {
			pushToast({ kind: "info", title: "抽卡券不足", subtitle: "签到、通关或阅读原文可获得", icon: "🎟️" });
			return;
		}
		try {
			const r = pull(count);
			setResults(r);
		} catch {
			pushToast({ kind: "info", title: "抽卡券不足", icon: "🎟️" });
		}
	}

	return (
		<div className="gacha-page">
			<div className="gacha-banner">
				<Badge tone="gold">{CURRENT_POOL.era === "chu_han" ? "楚汉争霸" : CURRENT_POOL.era} · 首发卡池</Badge>
				<h1 style={{ marginTop: 12 }}>{CURRENT_POOL.name}</h1>
				<div className="tagline">所有角色概率均等 · 无星级 · 永不付费</div>
				<div className="pity-line">
					<Shield size={14} />
					保底：连续 {CURRENT_POOL.rules.pityAt} 抽未出新角色，第 {CURRENT_POOL.rules.pityAt + 1} 抽必出新 · 当前还需 {remainToPity} 抽触发保底
				</div>
				<div className="gacha-actions">
					<Button size="lg" onClick={() => doPull(1)} disabled={progress.gachaTickets < 1}>
						<Sparkles size={18} /> 单抽 <span className="gacha-cost">（1 券）</span>
					</Button>
					<Button size="lg" variant="cyan" onClick={() => doPull(10)} disabled={progress.gachaTickets < 10}>
						<Sparkles size={18} /> 十连 <span className="gacha-cost">（10 券）</span>
					</Button>
					<Button size="lg" variant="ghost" onClick={() => setShopOpen(true)}>
						<Gift size={18} /> 碎片商店
					</Button>
				</div>
				<div style={{ marginTop: 16, fontSize: 13, color: "var(--color-rice-dim)" }}>
					拥有 🎟️ {progress.gachaTickets} 券 · 🔹 {progress.fragments} 碎片 · 已集 {owned.size}/{CURRENT_POOL.characters.length}
				</div>
			</div>

			<section className="pool-section">
				<div className="section-head">
					<h2 className="serif">本期角色</h2>
					<span className="sub">重复角色将转化为记忆碎片</span>
				</div>
				<div className="pool-grid">
					{CURRENT_POOL.characters.map((pc) => {
						const ch = getCharacter(pc.characterId);
						if (!ch) return null;
						const has = owned.has(pc.characterId);
						return (
							<div key={pc.characterId} className={`pool-card${has ? " owned" : ""}`}>
								<CharacterAvatar glyph={ch.glyph} accent={ch.accent} size={72} locked={!has} />
								<div className="nm">{has ? ch.name : "？？？"}</div>
								<div className="tt">{has ? ch.title.split(" · ")[0] : "尚未解锁"}</div>
								{has && <Badge tone="gold">已拥有</Badge>}
							</div>
						);
					})}
				</div>
			</section>

			{results && <SummonOverlay results={results} onClose={() => setResults(null)} onAgain={doPull} tickets={progress.gachaTickets} />}

			<Modal open={shopOpen} onClose={() => setShopOpen(false)}>
				<div className="modal-pad">
					<h2 className="serif" style={{ fontSize: 24 }}>
						碎片商店
					</h2>
					<p className="dim" style={{ fontSize: 13, marginTop: 8 }}>
						即使运气不佳，也能凭积累拿到想要的角色。{FRAGMENT_COSTS.character} 碎片兑换任意指定角色。
					</p>
					<div style={{ marginTop: 12 }}>
						<Badge tone="cyan">当前 🔹 {progress.fragments} 碎片</Badge>
					</div>
					<div className="shop-list">
						{CURRENT_POOL.characters
							.filter((pc) => !owned.has(pc.characterId))
							.map((pc) => {
								const ch = getCharacter(pc.characterId)!;
								return (
									<div className="shop-row" key={pc.characterId}>
										<CharacterAvatar glyph={ch.glyph} accent={ch.accent} size={44} />
										<div className="info">
											<div className="nm">{ch.name}</div>
											<div className="tt">{ch.title}</div>
										</div>
										<Button
											size="sm"
											disabled={progress.fragments < FRAGMENT_COSTS.character}
											onClick={() => {
												if (redeemCharacter(pc.characterId)) {
													pushToast({ kind: "reward", title: `兑换成功 · ${ch.name}`, icon: "🔹" });
												}
											}}
										>
											{FRAGMENT_COSTS.character} 🔹
										</Button>
									</div>
								);
							})}
						{owned.size === CURRENT_POOL.characters.length && (
							<div className="empty-state">
								<div className="glyph">全</div>
								本期角色已全部收集
							</div>
						)}
					</div>
				</div>
			</Modal>
		</div>
	);
}

/** 浮现在时空裂隙中的史册篆字，被吸入门中 */
const RIFT_GLYPHS = ["史", "記", "漢", "楚", "秦", "兵", "謀", "義", "鼎", "戈", "印", "符"];

function prefersReducedMotion() {
	return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

type SummonPhase = "rift" | "burst" | "reveal";

/**
 * 时空召唤覆盖层：三段式演出
 *   rift  时空裂隙开启 · 篆字被吸入（蓄力）
 *   burst 穿越闪光（过场）
 *   reveal 史册人物自门中浮现（揭晓）
 * 含新角色时时空门转为品牌金，否则为穿越蓝。点按可跳过，尊重 reduced-motion。
 */
function SummonOverlay({
	results,
	onClose,
	onAgain,
	tickets,
}: {
	results: PullResult[];
	onClose: () => void;
	onAgain: (count: 1 | 10) => void;
	tickets: number;
}) {
	const reduce = prefersReducedMotion();
	const [phase, setPhase] = useState<SummonPhase>(reduce ? "reveal" : "rift");
	const timers = useRef<number[]>([]);

	const hasNew = results.some((r) => r.isNew);
	const tone = hasNew ? "gold" : "cyan";
	const newCount = results.filter((r) => r.isNew).length;
	const fragTotal = results.reduce((n, r) => n + r.fragmentsGained, 0);

	useEffect(() => {
		if (reduce) return;
		timers.current.push(window.setTimeout(() => setPhase("burst"), 1500));
		timers.current.push(window.setTimeout(() => setPhase("reveal"), 1850));
		return () => timers.current.forEach((t) => clearTimeout(t));
	}, [reduce]);

	function skip() {
		timers.current.forEach((t) => clearTimeout(t));
		setPhase("reveal");
	}

	return (
		<div className={`summon-overlay tone-${tone} phase-${phase}`} onClick={phase === "reveal" ? onClose : skip}>
			<div className="summon-flash" aria-hidden />
			{phase !== "reveal" ? (
				<div className="summon-stage" aria-hidden>
					<div className="summon-portal">
						<div className="portal-rays" />
						<div className="portal-vortex" />
						<div className="portal-ring r1" />
						<div className="portal-ring r2" />
						<div className="portal-core" />
						<div className="portal-glyphs">
							{RIFT_GLYPHS.map((g, i) => {
								const ang = (i / RIFT_GLYPHS.length) * Math.PI * 2;
								const dist = 118 + (i % 3) * 28;
								return (
									<span
										key={i}
										style={
											{
												"--x": `${Math.cos(ang) * dist}px`,
												"--y": `${Math.sin(ang) * dist}px`,
												fontSize: 15 + (i % 3) * 6,
												animationDelay: `${(i * 0.16).toFixed(2)}s`,
												animationDuration: `${(2.2 + (i % 4) * 0.35).toFixed(2)}s`,
											} as CSSProperties
										}
									>
										{g}
									</span>
								);
							})}
						</div>
					</div>
					<div className="summon-caption">
						<span className="t">时空裂隙开启</span>
						<span className="s">点按 · 穿越千年召回史册人物</span>
					</div>
				</div>
			) : (
				<>
					<div className="reveal-title">
						{newCount > 0 ? `穿越召回 ${newCount} 位史册人物` : `记忆碎片 +${fragTotal}`}
					</div>
					<div className="reveal-grid" onClick={(e) => e.stopPropagation()}>
						{results.map((r, i) => {
							const ch = getCharacter(r.characterId)!;
							return (
								<div
									key={i}
									className={`reveal-card${r.isNew ? " is-new" : ""}`}
									style={{ animationDelay: `${i * 90}ms` }}
								>
									<CharacterAvatar glyph={ch.glyph} accent={ch.accent} size={64} ring />
									<div className="nm">{ch.name}</div>
									{r.isNew ? (
										<span className="reveal-tag new">NEW</span>
									) : (
										<span className="reveal-tag dup">+{r.fragmentsGained} 🔹</span>
									)}
								</div>
							);
						})}
					</div>
					<div className="reveal-foot" onClick={(e) => e.stopPropagation()}>
						<Button variant="ghost" onClick={onClose}>
							收下
						</Button>
						<Button disabled={tickets < 1} onClick={() => onAgain(1)}>
							再抽一次
						</Button>
						{tickets >= 10 && (
							<Button variant="cyan" onClick={() => onAgain(10)}>
								再来十连
							</Button>
						)}
					</div>
				</>
			)}
		</div>
	);
}
