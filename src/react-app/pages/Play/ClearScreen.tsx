import { useNavigate } from "react-router-dom";
import { Map, Home, RotateCcw } from "lucide-react";

interface Props {
	storyId: string;
	storyTitle: string;
	deaths: number;
	choiceRate: number;
	onRestart: () => void;
}

export function ClearScreen({ storyId, storyTitle, deaths, choiceRate, onRestart }: Props) {
	const navigate = useNavigate();
	const perfect = deaths === 0 && choiceRate >= 1;

	return (
		<div className="vn-overlay clear">
			<div className="clear-card">
				<div className="clear-seal">終</div>
				<h2 className="serif">通关 · {storyTitle}</h2>
				<p className="dim" style={{ marginTop: 12, fontSize: 15 }}>
					{perfect ? "全程零死亡，每一步都与史实暗合——你读懂了这段历史。" : "你已走完这段历史。死亡也是阅读，每一次重来都更靠近真相。"}
				</p>

				<div className="clear-stats">
					<div className="clear-stat">
						<div className="v">{Math.round(choiceRate * 100)}%</div>
						<div className="l">历史正确率</div>
					</div>
					<div className="clear-stat">
						<div className="v">{deaths}</div>
						<div className="l">死亡次数</div>
					</div>
					<div className="clear-stat">
						<div className="v">{perfect ? "★★★" : choiceRate >= 0.6 ? "★★" : "★"}</div>
						<div className="l">评价</div>
					</div>
				</div>

				<div className="actions">
					<button className="btn btn-primary" onClick={() => navigate(`/panorama/${storyId}`)}>
						<Map size={16} /> 进入史记全景
					</button>
					<button className="btn btn-ghost" onClick={onRestart}>
						<RotateCcw size={16} /> 再玩一遍
					</button>
					<button className="btn btn-ghost" onClick={() => navigate("/")}>
						<Home size={16} /> 回到首页
					</button>
				</div>
			</div>
		</div>
	);
}
