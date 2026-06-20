import { useNavigate, useParams } from "react-router-dom";
import "./Play.css";
import { getStoryline } from "../../data/storylines";
import { getCharacter } from "../../data/characters";
import { useUserStore } from "../../store/userStore";
import { VNEngine } from "./VNEngine";

export default function PlayPage() {
	const { storyId = "", charId = "" } = useParams();
	const navigate = useNavigate();
	const hasChar = useUserStore((s) => s.hasCharacter);

	const story = getStoryline(storyId);
	const perspective = story?.perspectives.find((p) => p.characterId === charId);
	const character = getCharacter(charId);

	// 无效路由
	if (!story || !perspective || !character) {
		return (
			<div className="vn-screen">
				<div className="empty-state" style={{ paddingTop: 160 }}>
					<div className="glyph">？</div>
					<h2 className="serif">此段历史尚未开放</h2>
					<button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => navigate("/")}>
						返回首页
					</button>
				</div>
			</div>
		);
	}

	// 未解锁角色
	if (!hasChar(charId)) {
		return (
			<div className="vn-screen">
				<div className="empty-state" style={{ paddingTop: 150 }}>
					<div className="glyph">{character.glyph}</div>
					<h2 className="serif">尚未解锁 {character.name}</h2>
					<p className="dim" style={{ marginTop: 10 }}>
						前往史册抽卡，解锁这位角色后即可穿越。
					</p>
					<div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
						<button className="btn btn-primary" onClick={() => navigate("/gacha")}>
							前往抽卡
						</button>
						<button className="btn btn-ghost" onClick={() => navigate("/")}>
							返回首页
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<VNEngine
			storyId={storyId}
			charId={charId}
			storyKey={perspective.storyKey}
			storyTitle={story.title}
			charName={character.name}
		/>
	);
}
