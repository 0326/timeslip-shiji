import { assetUrl } from "../lib/assetUrl";

export type Mood =
	| "solemn" | "danger" | "tension" | "sorrow"
	| "triumph" | "court" | "battle" | "mystery"
	| "peaceful" | "romantic" | "epic" | "nostalgic"
	| "march" | "dark" | "cheerful" | "melancholy"
	| "tragic" | "mournful" | "sad" | "death";

export interface BgmTrack {
	label: string;
	mood: Mood;
	url?: string;
}

const LOCAL = "/assets/bgm/";

const MOOD_TRACKS: Record<Mood, Array<{ file: string; label: string }>> = {
	solemn: [
		{ file: "solemn_01.mp3", label: "清平乐" },
		{ file: "solemn_02.mp3", label: "夜凉" },
		{ file: "solemn_03.mp3", label: "心游太玄" },
		{ file: "solemn_04.mp3", label: "秋水浮萍" },
		{ file: "solemn_05.mp3", label: "冷峰绝剑" },
		{ file: "solemn_06.mp3", label: "序" },
		{ file: "solemn_07.mp3", label: "长空" },
		{ file: "solemn_08.mp3", label: "一念心清净" },
		{ file: "solemn_09.mp3", label: "云水禅心" },
		{ file: "solemn_10.mp3", label: "天地之音" },
	],
	danger: [
		{ file: "danger_01.mp3", label: "破釜沉舟" },
		{ file: "danger_02.mp3", label: "暗夜浮香" },
		{ file: "danger_03.mp3", label: "庭内斗争" },
		{ file: "danger_04.mp3", label: "危机四伏" },
		{ file: "danger_05.mp3", label: "八岐大蛇の陰謀" },
		{ file: "danger_06.mp3", label: "命悬一线" },
		{ file: "danger_07.mp3", label: "杀机暗藏" },
		{ file: "danger_08.mp3", label: "步步惊心" },
	],
	tension: [
		{ file: "tension_01.mp3", label: "对峙" },
		{ file: "tension_02.mp3", label: "十步一剑" },
		{ file: "tension_03.mp3", label: "生死相搏" },
		{ file: "tension_04.mp3", label: "剑拔弩张" },
		{ file: "tension_05.mp3", label: "埋伏" },
		{ file: "tension_06.mp3", label: "狭路相逢" },
		{ file: "tension_07.mp3", label: "悬念" },
		{ file: "tension_08.mp3", label: "山雨欲来" },
	],
	sorrow: [
		{ file: "sorrow_01.mp3", label: "卧龙吊孝" },
		{ file: "sorrow_02.mp3", label: "苍凉" },
		{ file: "sorrow_03.mp3", label: "深谷幽兰" },
		{ file: "sorrow_04.mp3", label: "寒江残雪" },
		{ file: "sorrow_05.mp3", label: "哀郢" },
		{ file: "sorrow_06.mp3", label: "长亭怨慢" },
		{ file: "sorrow_07.mp3", label: "葬心" },
		{ file: "sorrow_08.mp3", label: "思君黯然" },
	],
	triumph: [
		{ file: "triumph_01.mp3", label: "象王行" },
		{ file: "triumph_02.mp3", label: "凯旋" },
		{ file: "triumph_03.mp3", label: "胜利之师" },
		{ file: "triumph_04.mp3", label: "征服四海" },
		{ file: "triumph_05.mp3", label: "威武之师" },
		{ file: "triumph_06.mp3", label: "五虎封将" },
		{ file: "triumph_07.mp3", label: "破竹" },
		{ file: "triumph_08.mp3", label: "辉煌主题" },
	],
	court: [
		{ file: "court_01.mp3", label: "象王行" },
		{ file: "court_02.mp3", label: "序" },
		{ file: "court_03.mp3", label: "长空" },
		{ file: "court_04.mp3", label: "未央宫" },
		{ file: "court_05.mp3", label: "盛世大唐" },
		{ file: "court_06.mp3", label: "汉风" },
		{ file: "court_07.mp3", label: "皇宫觐见" },
		{ file: "court_08.mp3", label: "皇室来临" },
		{ file: "court_09.mp3", label: "大唐魂-长安" },
		{ file: "court_10.mp3", label: "皇城" },
	],
	battle: [
		{ file: "battle_01.mp3", label: "战鼓雷鸣" },
		{ file: "battle_02.mp3", label: "兵临城下" },
		{ file: "battle_03.mp3", label: "鼓诗" },
		{ file: "battle_04.mp3", label: "横戈跃马" },
		{ file: "battle_05.mp3", label: "军威浩壮" },
		{ file: "battle_06.mp3", label: "七剑战歌" },
		{ file: "battle_07.mp3", label: "一夫当关" },
		{ file: "battle_08.mp3", label: "破阵曲" },
		{ file: "battle_09.mp3", label: "七剑下山" },
		{ file: "battle_10.mp3", label: "楚汉英雄志" },
		{ file: "battle_11.mp3", label: "激斗" },
		{ file: "battle_12.mp3", label: "征战" },
		{ file: "battle_13.mp3", label: "力攻" },
		{ file: "battle_14.mp3", label: "赤壁" },
		{ file: "battle_15.mp3", label: "战官渡" },
		{ file: "battle_16.mp3", label: "金戈铁马" },
	],
	mystery: [
		{ file: "mystery_01.mp3", label: "百鬼夜行" },
		{ file: "mystery_02.mp3", label: "妙音鸟" },
		{ file: "mystery_03.mp3", label: "気配" },
		{ file: "mystery_04.mp3", label: "仙纪-神秘" },
		{ file: "mystery_05.mp3", label: "东西昆仑" },
		{ file: "mystery_06.mp3", label: "神话之谜" },
		{ file: "mystery_07.mp3", label: "虚空梦魇" },
		{ file: "mystery_08.mp3", label: "召喚の呪術" },
	],
	peaceful: [
		{ file: "peaceful_01.mp3", label: "夏雨风荷" },
		{ file: "peaceful_02.mp3", label: "魂梦不堪幽怨" },
		{ file: "peaceful_03.mp3", label: "碧波芙蓉调" },
		{ file: "peaceful_04.mp3", label: "风高云淡" },
		{ file: "peaceful_05.mp3", label: "闲情别致" },
		{ file: "peaceful_06.mp3", label: "结屋山涧曲" },
		{ file: "peaceful_07.mp3", label: "天高云淡" },
		{ file: "peaceful_08.mp3", label: "琴韵莲心" },
		{ file: "peaceful_09.mp3", label: "清夜琴兴" },
		{ file: "peaceful_10.mp3", label: "轻舟如叶" },
	],
	romantic: [
		{ file: "romantic_01.mp3", label: "爱殇" },
		{ file: "romantic_02.mp3", label: "待我长发及腰" },
		{ file: "romantic_03.mp3", label: "似水柔情" },
		{ file: "romantic_04.mp3", label: "一舞倾城" },
		{ file: "romantic_05.mp3", label: "两情相惜" },
		{ file: "romantic_06.mp3", label: "国色天香" },
		{ file: "romantic_07.mp3", label: "七秀坊" },
		{ file: "romantic_08.mp3", label: "花の源" },
		{ file: "romantic_09.mp3", label: "红颜" },
		{ file: "romantic_10.mp3", label: "心動" },
	],
	epic: [
		{ file: "epic_01.mp3", label: "象王行" },
		{ file: "epic_02.mp3", label: "序" },
		{ file: "epic_03.mp3", label: "天地孤影任我行" },
		{ file: "epic_04.mp3", label: "万里长城" },
		{ file: "epic_05.mp3", label: "Palace Memories" },
		{ file: "epic_06.mp3", label: "千里江山图" },
		{ file: "epic_07.mp3", label: "汉风" },
		{ file: "epic_08.mp3", label: "帝陵" },
		{ file: "epic_09.mp3", label: "九州同" },
		{ file: "epic_10.mp3", label: "战国" },
	],
	nostalgic: [
		{ file: "nostalgic_01.mp3", label: "故乡的原风景" },
		{ file: "nostalgic_02.mp3", label: "夜凉" },
		{ file: "nostalgic_03.mp3", label: "妆台秋思" },
		{ file: "nostalgic_04.mp3", label: "思君难见" },
		{ file: "nostalgic_05.mp3", label: "三生石刻" },
		{ file: "nostalgic_06.mp3", label: "忆如万里" },
		{ file: "nostalgic_07.mp3", label: "水畔凉箫" },
		{ file: "nostalgic_08.mp3", label: "千年深雪" },
	],
	march: [
		{ file: "march_01.mp3", label: "出征" },
		{ file: "march_02.mp3", label: "点兵" },
		{ file: "march_03.mp3", label: "风起云扬" },
		{ file: "march_04.mp3", label: "备战前夕" },
		{ file: "march_05.mp3", label: "蓄势待发" },
		{ file: "march_06.mp3", label: "青铜铸剑" },
		{ file: "march_07.mp3", label: "征途" },
		{ file: "march_08.mp3", label: "西行" },
	],
	dark: [
		{ file: "dark_01.mp3", label: "歌舞鬼登场" },
		{ file: "dark_02.mp3", label: "祸世" },
		{ file: "dark_03.mp3", label: "気配" },
		{ file: "dark_04.mp3", label: "七剑下山" },
		{ file: "dark_05.mp3", label: "战·序" },
		{ file: "dark_06.mp3", label: "刑徒" },
		{ file: "dark_07.mp3", label: "疾苦" },
		{ file: "dark_08.mp3", label: "黑山老妖" },
		{ file: "dark_09.mp3", label: "阴阳判官" },
		{ file: "dark_10.mp3", label: "鬼域" },
	],
	cheerful: [
		{ file: "cheerful_01.mp3", label: "欢庆" },
		{ file: "cheerful_02.mp3", label: "欢腾" },
		{ file: "cheerful_03.mp3", label: "伽罗" },
		{ file: "cheerful_04.mp3", label: "穏やかな日々" },
		{ file: "cheerful_05.mp3", label: "午後の庭" },
		{ file: "cheerful_06.mp3", label: "欢愉" },
		{ file: "cheerful_07.mp3", label: "欢迎" },
		{ file: "cheerful_08.mp3", label: "胜利" },
	],
	melancholy: [
		{ file: "melancholy_01.mp3", label: "苍凉" },
		{ file: "melancholy_02.mp3", label: "晚歌" },
		{ file: "melancholy_03.mp3", label: "淡雪" },
		{ file: "melancholy_04.mp3", label: "枉·离" },
		{ file: "melancholy_05.mp3", label: "岁月之歌" },
		{ file: "melancholy_06.mp3", label: "素英之死" },
		{ file: "melancholy_07.mp3", label: "夕阳西下" },
		{ file: "melancholy_08.mp3", label: "徘徊" },
	],
	tragic: [
		{ file: "tragic_01.mp3", label: "英雄葬礼" },
		{ file: "tragic_02.mp3", label: "悲剧英雄" },
		{ file: "tragic_03.mp3", label: "悲壮" },
		{ file: "tragic_04.mp3", label: "诀别之曲" },
		{ file: "tragic_05.mp3", label: "挽钟" },
		{ file: "tragic_06.mp3", label: "牺牲" },
		{ file: "tragic_07.mp3", label: "破镜" },
		{ file: "tragic_08.mp3", label: "血色" },
	],
	mournful: [
		{ file: "mournful_01.mp3", label: "诀别之曲" },
		{ file: "mournful_02.mp3", label: "卧龙吊孝" },
		{ file: "mournful_03.mp3", label: "锦衣卫挽歌" },
		{ file: "mournful_04.mp3", label: "终曲" },
		{ file: "mournful_05.mp3", label: "董承之死" },
		{ file: "mournful_06.mp3", label: "英雄之城" },
		{ file: "mournful_07.mp3", label: "葬心" },
		{ file: "mournful_08.mp3", label: "悲" },
	],
	sad: [
		{ file: "sad_01.mp3", label: "晚歌" },
		{ file: "sad_02.mp3", label: "传奇" },
		{ file: "sad_03.mp3", label: "深谷幽兰" },
		{ file: "sad_04.mp3", label: "苍凉悲怆" },
		{ file: "sad_05.mp3", label: "泊澜谣-悲伤" },
		{ file: "sad_06.mp3", label: "枕边泪" },
		{ file: "sad_07.mp3", label: "初见" },
		{ file: "sad_08.mp3", label: "岁月之歌" },
	],
	death: [
		{ file: "death_01.mp3", label: "诀别之曲" },
		{ file: "death_02.mp3", label: "董承之死" },
		{ file: "death_03.mp3", label: "素英之死" },
		{ file: "death_04.mp3", label: "英雄之城" },
		{ file: "death_05.mp3", label: "灭绝" },
		{ file: "death_06.mp3", label: "英雄葬礼" },
		{ file: "death_07.mp3", label: "挽钟" },
		{ file: "death_08.mp3", label: "以正义之名" },
	],
};

const buildTracks = (): Record<string, BgmTrack> => {
	const tracks: Record<string, BgmTrack> = {};
	
	for (const [mood, items] of Object.entries(MOOD_TRACKS)) {
		items.forEach((item, index) => {
			const key = `${mood}_${index + 1}`;
			tracks[key] = {
				label: item.label,
				mood: mood as Mood,
				url: assetUrl(LOCAL + item.file),
			};
		});
		tracks[mood] = {
			label: `[${mood}] 默认`,
			mood: mood as Mood,
		};
	}
	
	const aliases: Record<string, string> = {
		urgent: "danger",
		grand: "court",
		elegant: "court",
		tense: "tension",
		contemplate: "solemn",
		ancient: "solemn",
		martial: "battle",
		palace: "court",
		adventure: "mystery",
		chaos: "danger",
		victory: "triumph",
		heroic: "triumph",
		mystical: "mystery",
		dreamy: "mystery",
		gentle: "peaceful",
		sinister: "dark",
		idyllic: "peaceful",
		emotional: "melancholy",
		reminisce: "nostalgic",
		joyful: "cheerful",
		suspense: "tension",
	};
	
	for (const [alias, target] of Object.entries(aliases)) {
		tracks[alias] = {
			label: `[${alias}] → ${target}`,
			mood: target as Mood,
		};
	}
	
	return tracks;
};

export const BGM_TRACKS = buildTracks();

export function resolveBgm(id: string): BgmTrack {
	const track = BGM_TRACKS[id];
	if (!track) {
		return BGM_TRACKS.solemn_1;
	}
	
	if (track.url) {
		return track;
	}
	
	// 泛化ID（如 "battle"）：返回该情绪的第一首作为默认
	const mood = track.mood;
	const items = MOOD_TRACKS[mood];
	if (!items || items.length === 0) {
		return BGM_TRACKS.solemn_1;
	}
	
	return {
		label: items[0].label,
		mood: mood,
		url: assetUrl(LOCAL + items[0].file),
	};
}

export function listMoodTracks(mood: Mood): Array<{ file: string; label: string }> {
	return MOOD_TRACKS[mood] || [];
}

export const MOOD_LABELS: Record<Mood, string> = {
	solemn: "庄重",
	danger: "危险",
	tension: "紧张",
	sorrow: "悲伤",
	triumph: "胜利",
	court: "宫廷",
	battle: "战斗",
	mystery: "神秘",
	peaceful: "平和",
	romantic: "浪漫",
	epic: "史诗",
	nostalgic: "怀旧",
	march: "行军",
	dark: "黑暗",
	cheerful: "欢快",
	melancholy: "忧郁",
	tragic: "悲剧",
	mournful: "哀悼",
	sad: "伤感",
	death: "死亡",
};
