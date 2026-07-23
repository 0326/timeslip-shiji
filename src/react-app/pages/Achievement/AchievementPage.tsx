import { useState } from "react";
import { Share2, Lock, Download } from "lucide-react";
import "./Achievement.css";
import { ACHIEVEMENT_LIST } from "../../data/achievements";
import type { Achievement } from "../../types/achievement";
import { useUserStore } from "../../store/userStore";
import { useUiStore } from "../../store/uiStore";
import { useShareCard } from "../../hooks/useShareCard";
import { Badge, Button, Modal } from "../../components/ui";

const TYPE_LABELS: Record<string, string> = {
	story: "通关",
	historical: "还原",
	easter_egg: "彩蛋",
	cross_character: "跨视角",
	collection: "收藏",
	death: "里程碑",
};

export function AchievementPage() {
	const unlocked = useUserStore((s) => s.progress.achievements.unlocked);
	const points = useUserStore((s) => s.progress.points);
	const pushToast = useUiStore((s) => s.pushToast);
	const { generate } = useShareCard();
	const [shareImg, setShareImg] = useState<string | null>(null);
	const [generating, setGenerating] = useState(false);

	const unlockedSet = new Set(unlocked);
	const totalPoints = ACHIEVEMENT_LIST.reduce((n, a) => n + a.points, 0);

	// 已解锁排前排，各自保持原列表顺序（稳定排序）
	const orderedAchievements = [
		...ACHIEVEMENT_LIST.filter((a) => unlockedSet.has(a.id)),
		...ACHIEVEMENT_LIST.filter((a) => !unlockedSet.has(a.id)),
	];

	async function share(a: Achievement) {
		setGenerating(true);
		try {
			const img = await generate({
				achievementName: a.name,
				achievementDesc: a.description,
				classicalQuote: a.classicalQuote,
				icon: a.icon,
			});
			setShareImg(img);
			// 分享可得抽卡券（每日上限略，此处直接奖励一次提示）
			pushToast({ kind: "info", title: "分享卡已生成", subtitle: "长按或下载保存图片", icon: "🖼️" });
		} finally {
			setGenerating(false);
		}
	}

	return (
		<div className="achieve-page">
			<div className="achieve-stats">
				<span className="panel-stat">
					<b>
						{unlockedSet.size}/{ACHIEVEMENT_LIST.length}
					</b>
					<span>已解锁成就</span>
				</span>
				<span className="panel-stat">
					<b>{points}</b>
					<span>当前积分</span>
				</span>
				<span className="panel-stat">
					<b>{totalPoints}</b>
					<span>积分上限</span>
				</span>
			</div>

			<div className="achieve-grid">
				{orderedAchievements.map((a, i) => {
					const got = unlockedSet.has(a.id);
					const hideContent = !got && a.hidden;
					return (
						<div
							key={a.id}
							className={`game-card achieve-card ${got ? "unlocked" : "is-locked"}`}
							style={{ animationDelay: `calc(var(--stagger) * ${Math.min(i, 12)})` }}
						>
							<div className="achieve-ico">{got ? a.icon : a.hidden ? "❔" : a.icon}</div>
							<div className="achieve-info">
								<div className="nm">
									{hideContent ? "隐藏成就" : a.name}
									{!got && <Lock size={13} style={{ color: "var(--color-muted)" }} />}
								</div>
								<div className="desc">
									{hideContent ? "达成特定条件后揭晓" : a.description}
								</div>
								{got && <div className="quote">「{a.classicalQuote}」</div>}
								<div className="achieve-foot">
									<div style={{ display: "flex", gap: 6 }}>
										<Badge tone={got ? "gold" : "default"}>{TYPE_LABELS[a.type]}</Badge>
										<Badge>+{a.points}</Badge>
									</div>
									{got && (
										<Button size="sm" variant="ghost" disabled={generating} onClick={() => share(a)}>
											<Share2 size={14} /> 分享
										</Button>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<Modal open={!!shareImg} onClose={() => setShareImg(null)}>
				<div className="share-preview">
					<h3 className="serif" style={{ fontSize: 20 }}>
						成就分享卡
					</h3>
					{shareImg && <img src={shareImg} alt="成就分享卡" />}
					{shareImg && (
						<a className="btn btn-primary btn-cut" href={shareImg} download="shiji-achievement.png">
							<Download size={16} /> 下载图片
						</a>
					)}
				</div>
			</Modal>
		</div>
	);
}
