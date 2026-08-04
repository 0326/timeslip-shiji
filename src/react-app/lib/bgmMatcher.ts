import type { Mood } from "../data/bgm-keywords";
import { KEYWORD_RULES, SPEAKER_MOOD_HINT, STRONG_EMOTION_TRIGGERS, WEAK_EMOTION_TRIGGERS } from "../data/bgm-keywords";
import { getDefaultMoodForScene, getAltMoodForScene, getSceneTrackId, getSceneBgmHint } from "../data/scenes-bgm";
import { listMoodTracks } from "../data/bgm";

interface MatchResult {
	mood: Mood;
	score: number;
	source: "keyword" | "strong_emotion" | "weak_emotion" | "speaker" | "scene" | "fallback";
	strong: boolean;
}

export class BgmMatcher {
	private buffer: Mood[] = [];
	private readonly bufferSize = 5;
	private readonly coolDownTurns = 10;
	private lastSwitchTurn = -Infinity;
	private currentTurn = 0;
	private currentSceneId = "";
	private currentMood: Mood = "solemn";

	private moodToTrackId: Record<Mood, string> = {
		solemn: "solemn",
		danger: "danger",
		tension: "tension",
		sorrow: "sorrow",
		triumph: "triumph",
		court: "court",
		battle: "battle",
		mystery: "mystery",
		peaceful: "peaceful",
		romantic: "romantic",
		epic: "epic",
		nostalgic: "nostalgic",
		march: "march",
		dark: "dark",
		cheerful: "cheerful",
		melancholy: "melancholy",
		tragic: "tragic",
		mournful: "mournful",
		sad: "sad",
		death: "death",
	};

	constructor() {}

	private hashString(str: string): number {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = ((hash << 5) - hash) + str.charCodeAt(i);
			hash = hash & hash;
		}
		return Math.abs(hash);
	}

	setScene(sceneId: string): string | null {
		const sceneChanged = this.currentSceneId !== sceneId;
		this.currentSceneId = sceneId;
		this.currentMood = getDefaultMoodForScene(sceneId);
		this.buffer = [];

		// 对于未在 SCENE_BGM 中配置的新增场景，根据场景ID自动推断情绪
		if (!getSceneBgmHint(sceneId)) {
			const inferred = this.inferMoodFromSceneId(sceneId);
			if (inferred) {
				this.currentMood = inferred;
			}
		}

		// 场景切换时立即播放该场景的BGM，不受冷却限制
		if (sceneChanged) {
			this.lastSwitchTurn = this.currentTurn;
			const sceneTrackId = getSceneTrackId(sceneId, this.currentMood);
			if (sceneTrackId) {
				return sceneTrackId;
			}
			const tracks = listMoodTracks(this.currentMood);
			if (tracks.length > 0) {
				const sceneMoodKey = `${sceneId}::${this.currentMood}`;
				const hash = this.hashString(sceneMoodKey);
				const index = hash % tracks.length;
				return `${this.currentMood}_${index + 1}`;
			}
		}
		return null;
	}

	/**
	 * 根据场景ID中的拼音关键词自动推断情绪（针对新增场景）
	 * 场景ID通常是拼音命名，通过关键词匹配推断合适的默认情绪
	 */
	private inferMoodFromSceneId(sceneId: string): Mood | null {
		const id = sceneId.toLowerCase();

		// 战争/军事类
		if (/(zhan|battle|war|zheng|fa|gong|wei|jia|bing|jun|chi|lu|shou|sui)/.test(id)) return "battle";
		// 行军类
		if (/(march|xing|tu|yuan|zhengtu)/.test(id)) return "march";
		// 宫廷/朝堂类
		if (/(gong|dian|chao|ting|fu|palace|court|yan|changle|weiyang)/.test(id)) return "court";
		// 悲伤类
		if (/(bei|sad|shang|ku|qi|tong|can|sorrow|ai)/.test(id)) return "sad";
		// 悲剧/死亡类
		if (/(death|si|wang|mie|jue|xun|sha|ci)/.test(id)) return "tragic";
		// 黑暗类
		if (/(dark|hei|an|ye|you|mo|qiu|yu)/.test(id)) return "dark";
		// 紧张/危险类
		if (/(tension|jin|zhang|wei|xian|ji|huan|jiu|po|jie|bi|sha|ci)/.test(id)) return "tension";
		// 忧郁/怀旧类
		if (/(nostalgic|huai|jiu|gu|yi|qiu|xiang|yuan|chou)/.test(id)) return "melancholy";
		// 平和类
		if (/(peace|ning|an|tian|jing|he|lin|cun|xiang|jia|yuan|tian|he|qiao)/.test(id)) return "peaceful";
		// 史诗类
		if (/(epic|shan|feng|guan|cheng|tai|qiu|ling)/.test(id)) return "epic";
		// 神秘类
		if (/(mystery|shen|xian|qi|ling|meng|ye|xing)/.test(id)) return "mystery";
		// 庄重类
		if (/(solemn|miao|ci|zhong|yi|ling|wen|zu)/.test(id)) return "solemn";

		return null;
	}

	match(text: string, speaker?: string): MatchResult | null {
		this.currentTurn++;

		// 1. 场景交替情绪（强触发）
		const sceneAlt = getAltMoodForScene(this.currentSceneId, text);
		if (sceneAlt) {
			return { mood: sceneAlt, score: 100, source: "scene", strong: true };
		}

		// 2. 强情绪触发器（强触发）
		for (const [trigger, mood] of Object.entries(STRONG_EMOTION_TRIGGERS)) {
			if (text.includes(trigger)) {
				return { mood, score: 90, source: "strong_emotion", strong: true };
			}
		}

		// 3. 关键词匹配（高分强触发，低分弱触发）
		const keywordMatch = this.matchByKeyword(text);
		if (keywordMatch) {
			if (keywordMatch.score >= 6) {
				return { ...keywordMatch, source: "keyword", strong: true };
			} else if (keywordMatch.score >= 3) {
				return { ...keywordMatch, source: "keyword", strong: false };
			}
		}

		// 4. 弱情绪累积（弱触发，不直接切换）
		let weakMatch: Mood | null = null;
		for (const [trigger, mood] of Object.entries(WEAK_EMOTION_TRIGGERS)) {
			if (text.includes(trigger)) {
				weakMatch = mood;
				break;
			}
		}

		if (weakMatch) {
			this.buffer.push(weakMatch);
			if (this.buffer.length >= this.bufferSize) {
				const counts: { [key in Mood]?: number } = {};
				for (const m of this.buffer) {
					counts[m] = (counts[m] ?? 0) + 1;
				}
				let maxCount = 0;
				let maxMood: Mood | null = null;
				for (const [mood, count] of Object.entries(counts)) {
					if (count !== undefined && count > maxCount) {
						maxCount = count;
						maxMood = mood as Mood;
					}
				}
				if (maxMood && maxCount >= 3) {
					this.buffer = [];
					return { mood: maxMood, score: 30, source: "weak_emotion", strong: false };
				}
				this.buffer.shift();
			}
		}

		// 5. 说话人情绪提示（弱触发，不直接切换）
		if (speaker && SPEAKER_MOOD_HINT[speaker]) {
			return { mood: SPEAKER_MOOD_HINT[speaker], score: 20, source: "speaker", strong: false };
		}

		// 6. 场景默认情绪
		return { mood: this.currentMood, score: 10, source: "fallback", strong: false };
	}

	shouldSwitch(newMood: Mood, _strong: boolean): boolean {
		if (newMood === this.currentMood) return false;
		if (this.currentTurn - this.lastSwitchTurn < this.coolDownTurns) return false;
		return true;
	}

	switchTo(mood: Mood, strong: boolean): string | null {
		if (!this.shouldSwitch(mood, strong)) return null;
		this.currentMood = mood;
		this.lastSwitchTurn = this.currentTurn;
		this.buffer = [];

		// 1. 优先使用场景手动配置的具体曲目ID（确定性，所有人一致）
		const sceneTrackId = getSceneTrackId(this.currentSceneId, mood);
		if (sceneTrackId) {
			return sceneTrackId;
		}

		// 2. 未配置 trackId 的场景/新增场景：走自动确定性哈希匹配
		const tracks = listMoodTracks(mood);
		if (tracks.length === 0) {
			return this.moodToTrackId[mood];
		}
		const sceneMoodKey = `${this.currentSceneId}::${mood}`;
		const hash = this.hashString(sceneMoodKey);
		const index = hash % tracks.length;
		return `${mood}_${index + 1}`;
	}

	getCurrentTrackId(): string {
		return this.moodToTrackId[this.currentMood];
	}

	reset(): void {
		this.buffer = [];
		this.lastSwitchTurn = -Infinity;
		this.currentTurn = 0;
		this.currentSceneId = "";
		this.currentMood = "solemn";
	}

	private matchByKeyword(text: string): { mood: Mood; score: number } | null {
		let best: { mood: Mood; score: number } | null = null;
		for (const rule of KEYWORD_RULES) {
			let count = 0;
			for (const word of rule.words) {
				let i = 0;
				while ((i = text.indexOf(word, i)) !== -1) {
					count++;
					i += word.length;
				}
			}
			const score = count * rule.weight;
			if (score > 0 && (!best || score > best.score)) {
				best = { mood: rule.mood, score };
			}
		}
		return best;
	}
}

export const bgmMatcher = new BgmMatcher();
