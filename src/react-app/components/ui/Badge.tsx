import type { ReactNode } from "react";

interface BadgeProps {
	tone?: "default" | "gold" | "cyan" | "vermilion";
	children: ReactNode;
}

export function Badge({ tone = "default", children }: BadgeProps) {
	const cls = tone === "default" ? "badge" : `badge badge-${tone}`;
	return <span className={cls}>{children}</span>;
}
