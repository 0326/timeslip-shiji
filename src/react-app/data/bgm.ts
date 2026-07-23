// BGM 曲目注册（包J）：#bgm:<id> → 音轨定义。
// 现阶段音频素材未落地：resolve 提供 id 归一化与 fallback，播放层可先按 mood 做视觉/氛围响应。
// 素材接入后只需给 TRACKS 补 url 字段，播放器读 url 即可，剧本零改动。

export interface BgmTrack {
	label: string;
	/** 情绪桶：无音频时的兜底表现（如背景色温/粒子密度）也可按此驱动 */
	mood: "solemn" | "danger" | "tension" | "sorrow" | "triumph" | "court" | "battle" | "mystery";
	/** 音频地址（素材落地后填） */
	url?: string;
}

export const BGM_TRACKS: Record<string, BgmTrack> = {
	// 现役两首（74 线在用）
	solemn: { label: "青史 · 沉钟", mood: "solemn" },
	danger: { label: "杀机 · 急鼓", mood: "danger" },
	// 扩容位（剧本可即刻使用，未注册/无素材自动兜底）
	tension: { label: "悬弦 · 未发", mood: "tension" },
	sorrow: { label: "挽歌 · 埙", mood: "sorrow" },
	triumph: { label: "凯旋 · 钟鼓", mood: "triumph" },
	court: { label: "庙堂 · 雅乐", mood: "court" },
	battle: { label: "战阵 · 金铁", mood: "battle" },
	mystery: { label: "玄思 · 泛音", mood: "mystery" },
	tragic: { label: "悲怆 · 裂帛", mood: "sorrow" },
};

/** 归一化：未注册 id 兜底 solemn（保证任何 #bgm 值都不出错） */
export function resolveBgm(id: string): BgmTrack {
	return BGM_TRACKS[id] ?? BGM_TRACKS.solemn;
}
