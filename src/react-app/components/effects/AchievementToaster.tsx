import { useEffect } from "react";
import { useUiStore, type ToastItem } from "../../store/uiStore";
import "./toaster.css";

const AUTO_DISMISS = 4200;

export function AchievementToaster() {
	const toasts = useUiStore((s) => s.toasts);
	return (
		<div className="toaster">
			{toasts.map((t) => (
				<ToastCard key={t.id} toast={t} />
			))}
		</div>
	);
}

function ToastCard({ toast }: { toast: ToastItem }) {
	const dismiss = useUiStore((s) => s.dismissToast);
	useEffect(() => {
		const timer = setTimeout(() => dismiss(toast.id), AUTO_DISMISS);
		return () => clearTimeout(timer);
	}, [toast.id, dismiss]);

	return (
		<div
			className={`toast toast-${toast.kind}`}
			onClick={() => dismiss(toast.id)}
			role="status"
		>
			<div className="toast-icon">{toast.icon ?? "✦"}</div>
			<div className="toast-body">
				{toast.kind === "achievement" && (
					<div className="toast-kind">成就解锁</div>
				)}
				<div className="toast-title">{toast.title}</div>
				{toast.subtitle && <div className="toast-sub">{toast.subtitle}</div>}
			</div>
		</div>
	);
}
