import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	closeOnOverlay?: boolean;
	showClose?: boolean;
	/** 附加在 .modal 容器上的自定义类名（用于尺寸/布局变体） */
	className?: string;
}

export function Modal({
	open,
	onClose,
	children,
	closeOnOverlay = true,
	showClose = true,
	className,
}: ModalProps) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="modal-overlay"
			onClick={closeOnOverlay ? onClose : undefined}
			role="dialog"
			aria-modal="true"
		>
			<div
			className={`modal ${className ?? ""}`}
			style={{ position: "relative" }}
			onClick={(e) => e.stopPropagation()}
		>
				{showClose && (
					<button className="modal-close" onClick={onClose} aria-label="关闭">
						<X size={18} />
					</button>
				)}
				{children}
			</div>
		</div>
	);
}
