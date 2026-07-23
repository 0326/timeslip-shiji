import { useEffect, type ReactNode } from "react";
import { sfx } from "../../lib/sfx";

interface DrawerProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
}

export function Drawer({ open, onClose, children }: DrawerProps) {
	useEffect(() => {
		if (!open) return;
		sfx.play("open");
		return () => sfx.play("close");
	}, [open]);

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
		<>
			<div className="drawer-overlay" onClick={onClose} />
			<aside className="drawer" role="dialog" aria-modal="true">
				{children}
			</aside>
		</>
	);
}
