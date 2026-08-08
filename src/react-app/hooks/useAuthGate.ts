import { useCallback } from "react";

/**
 * 鉴权拦截钩子（已绕过：所有操作直接执行，无需登录）。
 *
 * 用法：
 *   const requireAuth = useAuthGate();
 *   requireAuth(() => navigate(`/play/...`));
 */
export function useAuthGate() {
	return useCallback(
		(action: () => void) => {
			action();
		},
		[],
	);
}
