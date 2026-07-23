import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./Play.css";
import { getStoryline } from "../../data/storylines";
import { getCharacter } from "../../data/characters";
import { getSprite } from "../../data/sceneAssets";
import { useAuthStore } from "../../store/authStore";
import { useUiStore } from "../../store/uiStore";
import { VNEngine } from "./VNEngine";

export default function PlayPage() {
	const { storyId = "", charId = "" } = useParams();
	const [searchParams] = useSearchParams();
	// 游戏模式：canon=正史（默认，严格遵史）；free=自由（多分支多结局）
	const mode = searchParams.get("mode") === "free" ? "free" : "canon";
	const navigate = useNavigate();

	// 硬拦截：PlayPage 在 Layout 之外，无法内联弹窗——直链进入时若未登录，
	// 退回大厅并唤起注册框（等本地 token 校验完成后再判定，避免误踢）。
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const isAuthLoading = useAuthStore((s) => s.isLoading);
	const openAuthModal = useUiStore((s) => s.openAuthModal);
	const pushToast = useUiStore((s) => s.pushToast);
	useEffect(() => {
		if (isAuthLoading || isAuthenticated) return;
		pushToast({
			kind: "info",
			title: "请先注册登录",
			subtitle: "注册账号后即可开启穿越之旅，进度还能云端同步",
			icon: "🔒",
		});
		openAuthModal("register");
		navigate("/", { replace: true });
	}, [isAuthLoading, isAuthenticated, openAuthModal, pushToast, navigate]);

	const story = getStoryline(storyId);
	const perspective = story?.perspectives.find((p) => p.characterId === charId);
	// 卡池角色优先；非卡池主角（如五帝本纪人物）用立绘表兜底名与徽记
	const gachaChar = getCharacter(charId);
	const sprite = getSprite(charId);
	const character = gachaChar ?? { name: sprite.name, glyph: sprite.glyph };

	// 鉴权未通过（或仍在校验）时不渲染游戏内容，等待上面的 effect 处理跳转
	if (isAuthLoading || !isAuthenticated) {
		return <div className="vn-screen" />;
	}

	// 无效路由（视角存在即为合法路由）
	if (!story || !perspective) {
		return (
			<div className="vn-screen">
				<div className="empty-state" style={{ paddingTop: 160 }}>
					<div className="glyph">？</div>
					<h2 className="serif">此段历史尚未开放</h2>
					<button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => navigate("/story")}>
						返回故事选择
					</button>
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
			mode={mode}
		/>
	);
}
