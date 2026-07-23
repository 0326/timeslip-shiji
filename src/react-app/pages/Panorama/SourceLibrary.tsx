import { useState } from "react";
import { BookOpenCheck, Languages, Check } from "lucide-react";
import { Button } from "../../components/ui";
import { useUserStore } from "../../store/userStore";
import type { SourceText } from "../../data/panorama";

interface Props {
	storyId: string;
	source: SourceText;
}

/** 原文典籍库：逐段原文 + 可切换译文；读完触发 markSourceRead 奖励一次。 */
export function SourceLibrary({ storyId, source }: Props) {
	const [showTrans, setShowTrans] = useState(true);
	const hasRead = useUserStore((s) => s.hasReadSource(storyId));
	const markSourceRead = useUserStore((s) => s.markSourceRead);
	const [justRead, setJustRead] = useState(false);

	const onFinish = () => {
		const ok = markSourceRead(storyId);
		if (ok) setJustRead(true);
	};

	const read = hasRead || justRead;

	return (
		<div className="card-surface source-library">
			<div className="source-head">
				<h3 className="serif">{source.title}</h3>
				<button className="btn btn-ghost btn-sm" onClick={() => setShowTrans((v) => !v)}>
					<Languages size={14} /> {showTrans ? "隐藏译文" : "显示译文"}
				</button>
			</div>

			<div className="source-scroll">
				{source.passages.map((p, i) => (
					<div className="source-passage" key={i}>
						<p className="source-original classical">{p.original}</p>
						{showTrans && <p className="source-translation">{p.translation}</p>}
					</div>
				))}
			</div>

			<div className="source-foot">
				{read ? (
					<span className="source-done">
						<Check size={16} className="gold" /> 已研读 · 此篇已收入典籍库
					</span>
				) : (
					<Button cut onClick={onFinish}>
						<BookOpenCheck size={16} /> 我已读完 · 领取 +1 抽卡券
					</Button>
				)}
			</div>
		</div>
	);
}
