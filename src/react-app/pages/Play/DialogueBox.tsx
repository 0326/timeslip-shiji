import { useEffect, useRef, useState } from "react";
import { ScrollText } from "lucide-react";
import type { StorySegment } from "../../engine/types";
import { usePlayStore } from "../../store/playStore";

const SPEED: Record<string, number> = { slow: 55, normal: 28, fast: 12 };

interface Props {
	segments: StorySegment[];
	onComplete: () => void;
	onActiveSpeaker: (speaker: string) => void;
	onOpenHint: () => void;
	hideHint?: boolean;
}

export function DialogueBox({ segments, onComplete, onActiveSpeaker, onOpenHint, hideHint }: Props) {
	const { textSpeed, autoPlay } = usePlayStore();
	const [idx, setIdx] = useState(0);
	const [shown, setShown] = useState("");
	const [done, setDone] = useState(false);
	const autoTimer = useRef<number | null>(null);

	const seg = segments[idx];

	// 段落切换时重置并打字
	useEffect(() => {
		if (!seg) return;
		onActiveSpeaker(seg.speaker);
		setShown("");
		setDone(false);
		let i = 0;
		const speed = SPEED[textSpeed] ?? 28;
		const text = seg.text;
		const timer = window.setInterval(() => {
			i++;
			setShown(text.slice(0, i));
			if (i >= text.length) {
				window.clearInterval(timer);
				setDone(true);
			}
		}, speed);
		return () => window.clearInterval(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idx, textSpeed, seg?.text]);

	// 自动播放
	useEffect(() => {
		if (autoTimer.current) window.clearTimeout(autoTimer.current);
		if (autoPlay && done) {
			autoTimer.current = window.setTimeout(next, 1200);
		}
		return () => {
			if (autoTimer.current) window.clearTimeout(autoTimer.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [done, autoPlay, idx]);

	function next() {
		if (!seg) return;
		if (!done) {
			setShown(seg.text);
			setDone(true);
			return;
		}
		if (idx < segments.length - 1) {
			setIdx(idx + 1);
		} else {
			onComplete();
		}
	}

	if (!seg) return null;
	const isNarration = !seg.speaker || seg.speaker === "旁白";

	return (
		<div className="vn-dialogue">
			<div className="dialogue-box" onClick={next}>
				<div className={`dialogue-speaker${isNarration ? " narration" : ""}`}>
					{seg.speaker || "旁白"}
				</div>
				<div className="dialogue-text">
					{shown}
					{!done && <span className="dialogue-cursor">▍</span>}
				</div>
				<div className="dialogue-foot">
					{seg.hint && !hideHint && (
						<span
							className="dialogue-hint-pill"
							onClick={(e) => {
								e.stopPropagation();
								onOpenHint();
							}}
						>
							<ScrollText size={12} /> 原文提示
						</span>
					)}
					{done && (
						<span className="continue-hint">
							{idx < segments.length - 1 ? "▼ 点击继续" : "▼ 抉择"}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
