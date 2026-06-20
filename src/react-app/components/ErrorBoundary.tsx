import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}
interface State {
	hasError: boolean;
	message: string;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false, message: "" };

	static getDerivedStateFromError(err: Error): State {
		return { hasError: true, message: err.message };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("[ErrorBoundary]", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="empty-state" style={{ paddingTop: 120 }}>
						<div className="glyph">卷</div>
						<h2 className="serif">此卷有损</h2>
						<p className="dim" style={{ marginTop: 12 }}>
							页面加载时出了点问题。{this.state.message}
						</p>
						<button
							className="btn btn-primary"
							style={{ marginTop: 20 }}
							onClick={() => window.location.assign("/")}
						>
							返回首页
						</button>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
