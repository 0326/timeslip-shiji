// 学练测收面板（LearnPanel）
// 玩家可在游戏过程中查看当前章节的知识点、推荐练习、测验入口

import { useState } from "react";
import { BookOpen, Gamepad2, Map, X, Scroll, Trophy } from "lucide-react";
import "./LearnPanel.css";

interface KnowledgeSnippet {
	id: string;
	title: string;
	content: string;
	unlocked: boolean;
}

interface HintRecord {
	text: string;
	source: string;
}

interface PracticeGame {
	id: string;
	title: string;
	desc: string;
	onClick?: () => void;
}

interface LearnPanelProps {
	storyKey: string;
	hints: HintRecord[];
	knowledge: KnowledgeSnippet[];
	unlockedCount: number;
	totalCount: number;
	onPlayBamboo?: () => void;
	onPlayMinigame?: (id: string) => void;
	onOpenKnowledgeGraph?: () => void;
}

// 章节 -> 推荐小游戏映射
const STORY_PRACTICE_MAP: Record<string, PracticeGame[]> = {
	"huangdi:qiyuan": [
		{ id: "bamboo", title: "竹简缀合·黄帝起源", desc: "缀合史记·五帝本纪开篇", onClick: undefined },
	],
	"huangdi:banquan": [
		{ id: "bamboo", title: "竹简缀合·阪泉三战", desc: "缀合阪泉之战原文", onClick: undefined },
	],
	"huangdi:zhuolu": [
		{ id: "match3", title: "涿鹿珠阵", desc: "破九黎玉珠阵,指南辨向", onClick: undefined },
		{ id: "bamboo", title: "竹简缀合·涿鹿擒蚩尤", desc: "缀合涿鹿之战原文", onClick: undefined },
	],
	"huangdi:zhitianxia": [
		{ id: "astro", title: "星象授时", desc: "观星宿配节气,定四时", onClick: undefined },
		{ id: "bamboo", title: "竹简缀合·治天下", desc: "缀合黄帝崩葬桥山原文", onClick: undefined },
	],
	"zhuanxu:diku": [
		{ id: "bamboo", title: "竹简缀合·颛顼帝喾", desc: "缀合两代帝王原文", onClick: undefined },
	],
	"yao:shoushi": [
		{ id: "astro", title: "星象授时", desc: "观星宿配节气,敬授民时", onClick: undefined },
		{ id: "bamboo", title: "竹简缀合·敬授民时", desc: "缀合帝尧历法原文", onClick: undefined },
	],
	"yu:zhishui": [
		{ id: "channel", title: "治水疏渠", desc: "旋转渠管,导水入海", onClick: undefined },
		{ id: "bamboo", title: "竹简缀合·大禹治水", desc: "缀合九州疏导原文", onClick: undefined },
	],
	"liubang:chuhan": [
		{ id: "klotski", title: "鸿门脱险", desc: "滑块脱困,鸿门宴逃生", onClick: undefined },
	],
	"xiangyu:chuhan": [
		{ id: "klotski", title: "垓下突围", desc: "滑块突围,霸王末路", onClick: undefined },
	],
	"zhangliang:chuhan": [
		{ id: "yishang", title: "圯上受书", desc: "缀合太公兵法残简", onClick: undefined },
	],
	"hanxin:chuhan": [
		{ id: "jingxing", title: "井陉背水阵", desc: "背水一战,死地求生", onClick: undefined },
	],
	"kongsi:zhuzi": [
		{ id: "bamboo", title: "竹简缀合·孔子世家", desc: "缀合孔子世家原文", onClick: undefined },
	],
	"wenwang:xizhou": [
		{ id: "bamboo", title: "竹简缀合·周本纪", desc: "缀合周本纪原文", onClick: undefined },
	],
	"sunwu:chunqiu": [
		{ id: "formation", title: "排兵布阵", desc: "排布指令,令行禁止", onClick: undefined },
	],
	"qshihuang:qin": [
		{ id: "unify", title: "统一文字", desc: "汉字匹配,书同文", onClick: undefined },
		{ id: "forge", title: "铁匠锻兵", desc: "合料铸兵,铜锡成剑", onClick: undefined },
		{ id: "zhuhou", title: "诸侯争霸", desc: "棋盘夺城,六合归秦", onClick: undefined },
	],
	"quyuan:zhanguo": [
		{ id: "quyuan", title: "屈原问天", desc: "选词填空,天问名句", onClick: undefined },
	],
	"linxiangru:zhanguo": [
		{ id: "linxiangru", title: "完璧归赵", desc: "潜行避秦兵,持璧归赵", onClick: undefined },
	],
	"zhangyi:zhanguo": [
		{ id: "zongheng", title: "连横破纵", desc: "卡牌博弈,瓦解合纵", onClick: undefined },
	],
	"sunwu:chunqiu": [
		{ id: "formation", title: "排兵布阵", desc: "排布指令,令行禁止", onClick: undefined },
		{ id: "zhuhou", title: "诸侯争霸", desc: "棋盘夺城,争霸天下", onClick: undefined },
	],
	"zhuge:chuhan": [
		{ id: "logistics", title: "粮草调度", desc: "分配粮械兵,供给三军", onClick: undefined },
		{ id: "beacon", title: "烽火传信", desc: "节奏连击,点燃烽燧", onClick: undefined },
	],
	"yu:zhishui": [
		{ id: "channel", title: "治水疏渠", desc: "旋转渠管,导水入海", onClick: undefined },
		{ id: "ding", title: "铸鼎定鼎", desc: "拼合鼎片,铸九鼎定九州", onClick: undefined },
		{ id: "bamboo", title: "竹简缀合·大禹治水", desc: "缀合九州疏导原文", onClick: undefined },
	],
	"shangtang:xizhou": [
		{ id: "ding", title: "铸鼎定鼎", desc: "拼合鼎片,商汤迁鼎", onClick: undefined },
	],
	"huangdi:zhuolu": [
		{ id: "match3", title: "涿鹿珠阵", desc: "破九黎玉珠阵,指南辨向", onClick: undefined },
		{ id: "arrow", title: "箭雨齐射", desc: "同色箭矢,消除敌兵", onClick: undefined },
		{ id: "beacon", title: "烽火传信", desc: "节奏连击,点燃烽燧", onClick: undefined },
		{ id: "bamboo", title: "竹简缀合·涿鹿擒蚩尤", desc: "缀合涿鹿之战原文", onClick: undefined },
	],
	"zhuge:junshi": [
		{ id: "point", title: "点兵升将", desc: "同阶合成,练兵升将", onClick: undefined },
		{ id: "card", title: "竹简牌局", desc: "竹简为牌,谋士博弈", onClick: undefined },
		{ id: "arrow", title: "箭雨齐射", desc: "祖玛消除,万箭齐发", onClick: undefined },
	],
	"wang:zhouyouwang": [
		{ id: "beacon", title: "烽火传信", desc: "节奏连击,骊山烽火", onClick: undefined },
	],
};

export function LearnPanel({
	storyKey,
	hints,
	knowledge,
	unlockedCount,
	totalCount,
	onPlayBamboo,
	onOpenKnowledgeGraph,
	onPlayMinigame,
}: LearnPanelProps) {
	const [activeTab, setActiveTab] = useState<"learn" | "practice" | "collect">("learn");

	const storyLabel = storyKey.split(":")[1] ?? storyKey;

	// 获取当前章节的推荐小游戏
	const practiceGames = STORY_PRACTICE_MAP[storyKey] || [
		{ id: "bamboo", title: "竹简缀合", desc: "将散乱的竹简还原成史记原文", onClick: onPlayBamboo },
	];

	return (
		<div className="learn-panel">
			<div className="learn-header">
				<h3 className="serif">
					<BookOpen size={16} /> 学练测收 · {storyLabel}
				</h3>
			</div>

			<div className="learn-tabs">
				<button
					className={`learn-tab ${activeTab === "learn" ? "active" : ""}`}
					onClick={() => setActiveTab("learn")}
				>
					<BookOpen size={14} /> 学
				</button>
				<button
					className={`learn-tab ${activeTab === "practice" ? "active" : ""}`}
					onClick={() => setActiveTab("practice")}
				>
					<Gamepad2 size={14} /> 练
				</button>
				<button
					className={`learn-tab ${activeTab === "collect" ? "active" : ""}`}
					onClick={() => setActiveTab("collect")}
				>
					<Map size={14} /> 收
				</button>
			</div>

			<div className="learn-content">
				{activeTab === "learn" && (
					<section className="learn-section">
						<h4>原文提示</h4>
						{hints.length === 0 ? (
							<p className="learn-empty">暂无已解锁的原文提示，继续探索故事以收集此处。</p>
						) : (
							<ul className="hint-list">
								{hints.map((h, i) => (
									<li key={i} className="hint-item">
										<Scroll size={12} />
										<span className="hint-source">{h.source}</span>
										<span className="hint-text">「{h.text}」</span>
									</li>
								))}
							</ul>
						)}

						<h4>史识碎片</h4>
						<ul className="knowledge-list">
							{knowledge.map((k) => (
								<li key={k.id} className={`knowledge-item ${k.unlocked ? "unlocked" : "locked"}`}>
									<Trophy size={12} style={{ marginRight: 6 }} />
									<span className="knowledge-title">{k.unlocked ? k.title : "???"}</span>
									{k.unlocked && <p className="knowledge-content">{k.content}</p>}
								</li>
							))}
						</ul>
						<p className="learn-stat">
							已收录 {unlockedCount}/{totalCount} 碎片
						</p>
					</section>
				)}

				{activeTab === "practice" && (
					<section className="learn-section">
						<h4>推荐练习</h4>
						<ul className="practice-list">
							{practiceGames.map((game) => (
								<li key={game.id} className="practice-item">
									<Gamepad2 size={14} />
									<div>
										<span className="practice-title">{game.title}</span>
										<span className="practice-desc">{game.desc}</span>
									</div>
									<button
										className="btn btn-sm"
										onClick={() => {
											if (game.onClick) {
												game.onClick();
											} else if (onPlayMinigame) {
												onPlayMinigame(game.id);
											}
										}}
									>
										开始练习
									</button>
								</li>
							))}
						</ul>
						<p className="learn-note">练习可加深对原文的记忆，不影响正史判定。</p>
					</section>
				)}

				{activeTab === "collect" && (
					<section className="learn-section">
						<h4>收录进度</h4>
						<div className="collect-progress">
							<div className="progress-ring">
								<span className="progress-label">
									{unlockedCount}/{totalCount}
								</span>
							</div>
							<p className="progress-text">
								你已收录 {unlockedCount} 个史识碎片，继续探索以收集全部。
							</p>
						</div>
						<button className="btn btn-primary" onClick={onOpenKnowledgeGraph}>
							<Map size={14} /> 查看史识图谱
						</button>
					</section>
				)}
			</div>
		</div>
	);
}