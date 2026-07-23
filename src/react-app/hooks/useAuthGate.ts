import { useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";

/**
 * 鉴权拦截钩子：包装需要登录才能执行的动作（如开始游戏）。
 * 已登录则直接执行；未登录则弹出注册/登录弹窗并提示。
 *
 * 用法：
 *   const requireAuth = useAuthGate();
 *   requireAuth(() => navigate(`/play/...`));
 */
export function useAuthGate() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const isLoading = useAuthStore((s) => s.isLoading);
	const openAuthModal = useUiStore((s) => s.openAuthModal);
	const pushToast = useUiStore((s) => s.pushToast);

	return useCallback(
		(action: () => void) => {
			// 仍在校验本地 token 时，暂不拦截（避免误弹），等状态明确后再点
			if (isLoading) return;
			if (isAuthenticated) {
				action();
				return;
			}
			pushToast({
				kind: "info",
				title: "请先注册登录",
				subtitle: "注册账号后即可开启穿越之旅，进度还能云端同步",
				icon: "🔒",
			});
			openAuthModal("register");
		},
		[isAuthenticated, isLoading, openAuthModal, pushToast],
	);
}
