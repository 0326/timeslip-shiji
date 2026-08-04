interface Props {
	transitionKey: string;
	duration?: number;
}

/** 转场特效已禁用：直接画面切换，不渲染水墨晕染效果 */
export function SceneTransition(_props: Props) {
	return null;
}
