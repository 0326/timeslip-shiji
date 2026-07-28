/**
 * 场景情绪映射：背景 key → 天气 / 时段 / 色调 / 情绪
 *
 * 现有背景 key 命名隐含天气与时段语义（tent_night / yanggu_sun / winter_dark /
 * flood_sky / great_forest / zhuolu_fog / xingye_night 等）。这里做一次集中归一，
 * 供 DynamicScene 驱动粒子层、光照色温、雾色与镜头基调。
 */

export type TimeOfDay = "dawn" | "day" | "dusk" | "night" | "deepNight";
export type Weather =
	| "clear"
	| "rain"
	| "snow"
	| "petals" // 落花
	| "firefly" // 萤火
	| "embers" // 火星
	| "mist" // 雾气
	| "storm"; // 风暴

export interface SceneMood {
	/** 时段：决定天光色温与亮度 */
	time: TimeOfDay;
	/** 天气：决定粒子类型 */
	weather: Weather;
	/** 背景天光主色（RGB 0-1） */
	skyColor: [number, number, number];
	/** 地面/环境补色（RGB 0-1） */
	groundColor: [number, number, number];
	/** 雾色（RGB 0-1） */
	fogColor: [number, number, number];
	/** 雾浓度 0-1 */
	fogDensity: number;
	/** 环境光强度 */
	ambientIntensity: number;
	/** 主光（太阳/月）强度 */
	keyLightIntensity: number;
	/** 主光色温（RGB 0-1） */
	keyLightColor: [number, number, number];
	/** 镜头基调：呼吸幅度（0=静止） */
	cameraBreath: number;
	/** 情绪标签：影响粒子密度与色调饱和度 */
	mood: "calm" | "tense" | "solemn" | "tragic" | "mystic" | "warm";
}

const C = {
	// 时段天光
	dawnSky: [0.62, 0.5, 0.42] as [number, number, number],
	daySky: [0.55, 0.6, 0.58] as [number, number, number],
	duskSky: [0.5, 0.34, 0.28] as [number, number, number],
	nightSky: [0.08, 0.1, 0.16] as [number, number, number],
	deepNightSky: [0.04, 0.05, 0.09] as [number, number, number],
	// 主光色温
	warmLight: [1.0, 0.82, 0.58] as [number, number, number],
	coolLight: [0.62, 0.74, 0.92] as [number, number, number],
	neutralLight: [0.92, 0.9, 0.85] as [number, number, number],
	vermilionLight: [0.95, 0.55, 0.42] as [number, number, number],
	// 雾
	warmFog: [0.16, 0.13, 0.09] as [number, number, number],
	coolFog: [0.08, 0.1, 0.13] as [number, number, number],
	inkFog: [0.05, 0.04, 0.03] as [number, number, number],
	whiteFog: [0.78, 0.8, 0.82] as [number, number, number],
	// 地面
	inkGround: [0.04, 0.03, 0.02] as [number, number, number],
};

const DEFAULT_MOOD: SceneMood = {
	time: "night",
	weather: "clear",
	skyColor: C.nightSky,
	groundColor: C.inkGround,
	fogColor: C.inkFog,
	fogDensity: 0.018,
	ambientIntensity: 0.35,
	keyLightIntensity: 0.6,
	keyLightColor: C.coolLight,
	cameraBreath: 0.4,
	mood: "calm",
};

/** 背景名 → 情绪。未命中走模式匹配兜底。 */
const EXPLICIT: Record<string, SceneMood> = {
	// —— 夜 / 帐
	tent_night: { ...DEFAULT_MOOD, time: "night", weather: "embers", skyColor: C.nightSky, fogColor: [0.14, 0.08, 0.05], fogDensity: 0.02, keyLightColor: C.vermilionLight, keyLightIntensity: 0.7, cameraBreath: 0.3, mood: "tense" },
	tent_feast: { ...DEFAULT_MOOD, time: "night", weather: "embers", skyColor: [0.16, 0.12, 0.07], fogColor: [0.16, 0.12, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.5, mood: "warm" },
	camp_chu: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: C.duskSky, fogColor: [0.15, 0.07, 0.05], fogDensity: 0.022, keyLightColor: C.vermilionLight, keyLightIntensity: 0.75, cameraBreath: 0.35, mood: "tense" },
	camp_han_night: { ...DEFAULT_MOOD, time: "night", weather: "mist", skyColor: C.nightSky, fogColor: C.coolFog, fogDensity: 0.024, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.3, mood: "solemn" },

	// —— 河畔 / 水域
	riverside: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.12, 0.16, 0.2], fogColor: [0.1, 0.14, 0.17], fogDensity: 0.026, keyLightColor: C.coolLight, keyLightIntensity: 0.5, cameraBreath: 0.5, mood: "calm" },
	jingxing: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.1, 0.14, 0.18], fogColor: [0.08, 0.12, 0.15], fogDensity: 0.03, keyLightColor: C.coolLight, keyLightIntensity: 0.45, cameraBreath: 0.6, mood: "tense" },
	gaixia: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: C.deepNightSky, fogColor: [0.06, 0.04, 0.05], fogDensity: 0.034, keyLightColor: C.vermilionLight, keyLightIntensity: 0.4, cameraBreath: 0.7, mood: "tragic" },
	nanhe: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.2, 0.18], fogColor: [0.1, 0.15, 0.12], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.7, cameraBreath: 0.4, mood: "calm" },

	// —— 宫殿 / 帐议
	han_palace: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.1, 0.08, 0.05], fogColor: [0.1, 0.08, 0.04], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.65, cameraBreath: 0.25, mood: "solemn" },
	palace: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.9, cameraBreath: 0.3, mood: "solemn" },
	huangdi_court: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: C.duskSky, fogColor: [0.13, 0.08, 0.05], fogDensity: 0.02, keyLightColor: C.vermilionLight, keyLightIntensity: 0.7, cameraBreath: 0.3, mood: "tense" },
	xuanyuan_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	yao_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "solemn" },
	yushun_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.2, 0.16], fogColor: [0.1, 0.14, 0.1], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "calm" },
	simen_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.13, 0.18, 0.2], fogColor: [0.09, 0.13, 0.15], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.75, cameraBreath: 0.35, mood: "solemn" },
	wenzu_temple: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.18, 0.12], fogColor: [0.13, 0.11, 0.07], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	zuge_court: { ...DEFAULT_MOOD, time: "day", weather: "petals", skyColor: [0.14, 0.2, 0.16], fogColor: [0.1, 0.14, 0.1], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "calm" },
	yuewu_court: { ...DEFAULT_MOOD, time: "dusk", weather: "petals", skyColor: [0.18, 0.12, 0.18], fogColor: [0.12, 0.08, 0.12], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.7, cameraBreath: 0.5, mood: "mystic" },

	// —— 田野 / 农家
	lishan_farm: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.22, 0.16], fogColor: [0.13, 0.15, 0.1], fogDensity: 0.016, keyLightColor: C.neutralLight, keyLightIntensity: 0.85, cameraBreath: 0.4, mood: "calm" },
	gui_river: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.2, 0.18], fogColor: [0.1, 0.15, 0.12], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "calm" },
	tang_realm: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.2, 0.16], fogColor: [0.1, 0.14, 0.1], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.82, cameraBreath: 0.4, mood: "calm" },
	granary_exterior: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.1, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "calm" },

	// —— 火 / 战
	granary_fire: { ...DEFAULT_MOOD, time: "night", weather: "embers", skyColor: [0.2, 0.08, 0.03], fogColor: [0.18, 0.07, 0.03], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 1.0, cameraBreath: 0.7, mood: "tragic" },
	mingtiao_war: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.06], fogColor: [0.16, 0.07, 0.04], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.9, cameraBreath: 0.7, mood: "tragic" },
	zhuhou_luan: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.06], fogColor: [0.15, 0.06, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.6, mood: "tense" },
	zhuolu_field: { ...DEFAULT_MOOD, time: "dusk", weather: "storm", skyColor: [0.18, 0.1, 0.07], fogColor: [0.13, 0.07, 0.05], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.8, cameraBreath: 0.8, mood: "tragic" },
	disorder_court: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.09, 0.05], fogColor: [0.14, 0.06, 0.04], fogDensity: 0.026, keyLightColor: C.vermilionLight, keyLightIntensity: 0.78, cameraBreath: 0.6, mood: "tragic" },

	// —— 雾 / 神秘
	zhuolu_fog: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: C.whiteFog, fogColor: C.whiteFog, fogDensity: 0.045, keyLightColor: C.neutralLight, keyLightIntensity: 0.6, ambientIntensity: 0.5, cameraBreath: 0.5, mood: "mystic" },
	great_forest: { ...DEFAULT_MOOD, time: "day", weather: "rain", skyColor: [0.1, 0.13, 0.1], fogColor: [0.08, 0.1, 0.08], fogDensity: 0.032, keyLightColor: C.coolLight, keyLightIntensity: 0.5, cameraBreath: 0.6, mood: "mystic" },

	// —— 夜 / 星
	xingye_night: { ...DEFAULT_MOOD, time: "deepNight", weather: "firefly", skyColor: C.deepNightSky, fogColor: [0.05, 0.06, 0.1], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.4, ambientIntensity: 0.3, cameraBreath: 0.5, mood: "mystic" },
	winter_dark: { ...DEFAULT_MOOD, time: "deepNight", weather: "snow", skyColor: [0.06, 0.08, 0.12], fogColor: [0.07, 0.09, 0.13], fogDensity: 0.03, keyLightColor: C.coolLight, keyLightIntensity: 0.45, cameraBreath: 0.4, mood: "solemn" },

	// —— 日 / 晨
	yanggu_sun: { ...DEFAULT_MOOD, time: "dawn", weather: "clear", skyColor: [0.3, 0.2, 0.08], fogColor: [0.2, 0.13, 0.06], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 1.1, ambientIntensity: 0.5, cameraBreath: 0.5, mood: "warm" },
	taishan_peak: { ...DEFAULT_MOOD, time: "dawn", weather: "clear", skyColor: [0.18, 0.22, 0.28], fogColor: [0.12, 0.16, 0.2], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.85, cameraBreath: 0.4, mood: "solemn" },

	// —— 水 / 洪荒
	flood_sky: { ...DEFAULT_MOOD, time: "day", weather: "rain", skyColor: [0.1, 0.16, 0.2], fogColor: [0.08, 0.13, 0.17], fogDensity: 0.034, keyLightColor: C.coolLight, keyLightIntensity: 0.5, cameraBreath: 0.7, mood: "tense" },
	xiang_bamboo: { ...DEFAULT_MOOD, time: "day", weather: "petals", skyColor: [0.12, 0.18, 0.15], fogColor: [0.09, 0.14, 0.1], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.72, cameraBreath: 0.45, mood: "mystic" },

	// —— 流放 / 末路
	siyi_liufang: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.18, 0.14, 0.1], fogColor: [0.12, 0.09, 0.06], fogDensity: 0.026, keyLightColor: C.warmLight, keyLightIntensity: 0.6, cameraBreath: 0.5, mood: "tragic" },
	nanchao_exile: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.16, 0.14, 0.1], fogColor: [0.11, 0.09, 0.06], fogDensity: 0.024, keyLightColor: C.warmLight, keyLightIntensity: 0.58, cameraBreath: 0.45, mood: "tragic" },
	cangwu_ye: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: C.deepNightSky, fogColor: [0.06, 0.07, 0.11], fogDensity: 0.028, keyLightColor: C.coolLight, keyLightIntensity: 0.42, cameraBreath: 0.5, mood: "tragic" },
	jiuyi_shan: { ...DEFAULT_MOOD, time: "dawn", weather: "mist", skyColor: [0.14, 0.18, 0.2], fogColor: [0.1, 0.13, 0.15], fogDensity: 0.03, keyLightColor: C.coolLight, keyLightIntensity: 0.6, cameraBreath: 0.4, mood: "solemn" },

	// —— 夏 / 受禅
	xia_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.18, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	xia_court_cold: { ...DEFAULT_MOOD, time: "dusk", weather: "clear", skyColor: [0.14, 0.15, 0.16], fogColor: [0.1, 0.1, 0.11], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "tragic" },
	yangcheng: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.2, 0.18], fogColor: [0.1, 0.15, 0.12], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "calm" },
	xia_terrace: { ...DEFAULT_MOOD, time: "dusk", weather: "clear", skyColor: [0.22, 0.16, 0.08], fogColor: [0.15, 0.1, 0.05], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "solemn" },

	// —— 高阳 / 高辛 / 星象
	gaoyang_court: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.1, 0.14, 0.2], fogColor: [0.07, 0.1, 0.15], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.6, cameraBreath: 0.4, mood: "mystic" },
	gaoyang_field: { ...DEFAULT_MOOD, time: "deepNight", weather: "firefly", skyColor: C.deepNightSky, fogColor: [0.06, 0.08, 0.1], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.42, cameraBreath: 0.5, mood: "mystic" },
	gaoxin_court: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.12, 0.1, 0.18], fogColor: [0.08, 0.07, 0.13], fogDensity: 0.02, keyLightColor: [0.78, 0.68, 0.95], keyLightIntensity: 0.6, cameraBreath: 0.35, mood: "mystic" },
	mingtang_xing: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.1, 0.12, 0.18], fogColor: [0.07, 0.09, 0.14], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.58, cameraBreath: 0.35, mood: "solemn" },

	// —— 井 / 暗
	well_yard: { ...DEFAULT_MOOD, time: "dusk", weather: "clear", skyColor: [0.12, 0.13, 0.1], fogColor: [0.08, 0.09, 0.07], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.6, cameraBreath: 0.35, mood: "tense" },
	well_dark: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: [0.05, 0.06, 0.08], fogColor: [0.04, 0.05, 0.07], fogDensity: 0.04, keyLightColor: C.coolLight, keyLightIntensity: 0.3, ambientIntensity: 0.25, cameraBreath: 0.3, mood: "tense" },
	shun_house: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.1, 0.09, 0.07], fogColor: [0.07, 0.06, 0.04], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.62, cameraBreath: 0.3, mood: "calm" },

	// —— 山野
	xuanyuan_qiu: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.35, mood: "solemn" },
	banquan_ye: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.2, 0.14], fogColor: [0.1, 0.14, 0.09], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.45, mood: "tense" },
	huaiyin_street: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.17, 0.13], fogColor: [0.12, 0.11, 0.08], fogDensity: 0.016, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "calm" },
	plank_road: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.1, 0.07], fogDensity: 0.024, keyLightColor: C.warmLight, keyLightIntensity: 0.65, cameraBreath: 0.5, mood: "tense" },

	// —— 湘水
	gui_river_alt: { ...DEFAULT_MOOD, time: "day", weather: "petals", skyColor: [0.14, 0.2, 0.18], fogColor: [0.1, 0.15, 0.12], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.45, mood: "mystic" },
};

/** 从背景 key 推断情绪：先精确匹配，再按关键词兜底。 */
export function resolveMood(bgKey: string): SceneMood {
	if (EXPLICIT[bgKey]) return EXPLICIT[bgKey];
	const k = bgKey.toLowerCase();
	if (k.includes("fire") || k.includes("war") || k.includes("luan")) {
		return { ...DEFAULT_MOOD, weather: "embers", time: "dusk", skyColor: [0.2, 0.09, 0.05], fogColor: [0.14, 0.06, 0.04], keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.6, mood: "tragic" };
	}
	if (k.includes("night") || k.includes("ye")) {
		return { ...DEFAULT_MOOD, time: "night", skyColor: C.nightSky, fogColor: C.inkFog, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "calm" };
	}
	if (k.includes("fog") || k.includes("mist") || k.includes("wu")) {
		return { ...DEFAULT_MOOD, weather: "mist", skyColor: C.whiteFog, fogColor: C.whiteFog, fogDensity: 0.04, keyLightColor: C.neutralLight, keyLightIntensity: 0.6, cameraBreath: 0.5, mood: "mystic" };
	}
	if (k.includes("sun") || k.includes("dawn") || k.includes("yang")) {
		return { ...DEFAULT_MOOD, time: "dawn", weather: "clear", skyColor: [0.3, 0.2, 0.08], keyLightColor: C.warmLight, keyLightIntensity: 1.0, cameraBreath: 0.5, mood: "warm" };
	}
	if (k.includes("court") || k.includes("palace") || k.includes("temple")) {
		return { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.13, 0.1, 0.06], keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" };
	}
	return DEFAULT_MOOD;
}

/** 死亡 / 通关时的情绪覆盖（用于覆盖层渲染） */
export const DEATH_MOOD: SceneMood = {
	time: "deepNight",
	weather: "embers",
	skyColor: [0.18, 0.04, 0.03],
	groundColor: [0.03, 0.01, 0.01],
	fogColor: [0.12, 0.03, 0.02],
	fogDensity: 0.04,
	ambientIntensity: 0.25,
	keyLightIntensity: 0.5,
	keyLightColor: C.vermilionLight,
	cameraBreath: 0.9,
	mood: "tragic",
};

export const CLEAR_MOOD: SceneMood = {
	time: "dawn",
	weather: "petals",
	skyColor: [0.28, 0.22, 0.12],
	groundColor: [0.08, 0.06, 0.03],
	fogColor: [0.18, 0.14, 0.08],
	fogDensity: 0.016,
	ambientIntensity: 0.5,
	keyLightIntensity: 1.0,
	keyLightColor: C.warmLight,
	cameraBreath: 0.4,
	mood: "warm",
};
