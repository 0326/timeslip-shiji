import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "cyan" | "vermilion" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	block?: boolean;
	children: ReactNode;
}

export function Button({
	variant = "primary",
	size = "md",
	block = false,
	className = "",
	children,
	...rest
}: ButtonProps) {
	const cls = [
		"btn",
		`btn-${variant}`,
		size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "",
		block ? "btn-block" : "",
		className,
	]
		.filter(Boolean)
		.join(" ");
	return (
		<button className={cls} {...rest}>
			{children}
		</button>
	);
}
