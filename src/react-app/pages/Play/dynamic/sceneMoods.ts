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

	// ============ 殷商（shang） ============
	// 成汤线
	bo_capital: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	youshen_ye: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.2, 0.14], fogColor: [0.1, 0.14, 0.09], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "calm" },
	zhangwang_ye: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.22, 0.16], fogColor: [0.12, 0.15, 0.1], fogDensity: 0.016, keyLightColor: C.neutralLight, keyLightIntensity: 0.82, cameraBreath: 0.4, mood: "calm" },
	tangshi_ye: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.06], fogColor: [0.16, 0.07, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.6, mood: "tense" },
	tang_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.88, cameraBreath: 0.3, mood: "solemn" },
	// 伊尹 · 太甲线
	tong_gong: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.14, 0.15, 0.16], fogColor: [0.1, 0.11, 0.12], fogDensity: 0.026, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "tragic" },
	shezheng_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.09], fogColor: [0.12, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	taijia_gui: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.17, 0.09], fogColor: [0.14, 0.1, 0.05], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "solemn" },
	// 武丁线
	yin_decline: { ...DEFAULT_MOOD, time: "dusk", weather: "clear", skyColor: [0.14, 0.15, 0.16], fogColor: [0.1, 0.1, 0.11], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "tragic" },
	lu_qin: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.1, 0.09, 0.07], fogColor: [0.07, 0.06, 0.04], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.55, cameraBreath: 0.3, mood: "solemn" },
	wuding_meng: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: C.deepNightSky, fogColor: [0.05, 0.07, 0.12], fogDensity: 0.024, keyLightColor: C.coolLight, keyLightIntensity: 0.4, cameraBreath: 0.5, mood: "mystic" },
	fuxian_ban: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.16, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "calm" },
	chengtang_miao: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.09, 0.06], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.7, cameraBreath: 0.35, mood: "tense" },
	wuding_xing: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "solemn" },
	// 纣线
	zhaoge_court: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.09, 0.06], fogColor: [0.15, 0.06, 0.04], fogDensity: 0.026, keyLightColor: C.vermilionLight, keyLightIntensity: 0.8, cameraBreath: 0.55, mood: "tense" },
	jiuchi_roulin: { ...DEFAULT_MOOD, time: "night", weather: "embers", skyColor: [0.2, 0.1, 0.05], fogColor: [0.16, 0.08, 0.04], fogDensity: 0.022, keyLightColor: C.vermilionLight, keyLightIntensity: 0.75, cameraBreath: 0.5, mood: "warm" },
	paolao: { ...DEFAULT_MOOD, time: "night", weather: "embers", skyColor: [0.22, 0.08, 0.04], fogColor: [0.18, 0.07, 0.03], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.95, cameraBreath: 0.7, mood: "tragic" },
	youli: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.12, 0.13, 0.15], fogColor: [0.08, 0.09, 0.11], fogDensity: 0.026, keyLightColor: C.coolLight, keyLightIntensity: 0.5, cameraBreath: 0.4, mood: "tense" },
	muye: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.08, 0.05], fogColor: [0.14, 0.06, 0.04], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.7, mood: "tragic" },
	yinjiang_war: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.06], fogColor: [0.16, 0.07, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.65, mood: "tragic" },
	lutai_fire: { ...DEFAULT_MOOD, time: "night", weather: "embers", skyColor: [0.24, 0.08, 0.04], fogColor: [0.2, 0.07, 0.03], fogDensity: 0.032, keyLightColor: C.vermilionLight, keyLightIntensity: 1.0, cameraBreath: 0.75, mood: "tragic" },

	// ============ 西周（xizhou） ============
	weishui: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.1, 0.16, 0.2], fogColor: [0.08, 0.12, 0.15], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.7, cameraBreath: 0.4, mood: "calm" },
	mengjin: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.14, 0.12, 0.1], fogColor: [0.1, 0.09, 0.07], fogDensity: 0.024, keyLightColor: C.warmLight, keyLightIntensity: 0.62, cameraBreath: 0.5, mood: "tense" },
	luoyi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.2, 0.22], fogColor: [0.12, 0.14, 0.15], fogDensity: 0.018, keyLightColor: C.coolLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	qi_palace: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.2, 0.14], fogColor: [0.1, 0.14, 0.09], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	li_shan: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.24, 0.1, 0.06], fogColor: [0.17, 0.07, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.9, cameraBreath: 0.6, mood: "tragic" },
	haojing: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.08, 0.05], fogColor: [0.14, 0.06, 0.04], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.7, mood: "tragic" },
	feng_yi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.2, 0.14], fogColor: [0.1, 0.14, 0.09], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },

	// ============ 春秋（chunqiu） ============
	// 勾践线
	zuili_ye: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.06], fogColor: [0.16, 0.07, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.65, mood: "tragic" },
	fujiao_shan: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.12, 0.16, 0.18], fogColor: [0.09, 0.12, 0.14], fogDensity: 0.026, keyLightColor: C.coolLight, keyLightIntensity: 0.58, cameraBreath: 0.5, mood: "tense" },
	kuaijishan: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.14, 0.16, 0.18], fogColor: [0.1, 0.12, 0.13], fogDensity: 0.024, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.45, mood: "tragic" },
	yue_guo: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.08, 0.12, 0.1], fogColor: [0.06, 0.09, 0.08], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.5, cameraBreath: 0.4, mood: "tense" },
	huangchi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.08], fogColor: [0.14, 0.11, 0.05], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "solemn" },
	gusu_shan: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.18, 0.12, 0.16], fogColor: [0.12, 0.08, 0.12], fogDensity: 0.024, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.6, cameraBreath: 0.5, mood: "tragic" },
	huai_ba: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.2, 0.14], fogColor: [0.13, 0.14, 0.09], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.82, cameraBreath: 0.35, mood: "solemn" },
	// 晋文公重耳线
	jin_luan: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.08], fogColor: [0.15, 0.07, 0.05], fogDensity: 0.026, keyLightColor: C.vermilionLight, keyLightIntensity: 0.8, cameraBreath: 0.55, mood: "tense" },
	liuwang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.1, 0.07], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.65, cameraBreath: 0.5, mood: "tragic" },
	qi_anle: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.35, mood: "calm" },
	chu_yan: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.14, 0.06], fogColor: [0.14, 0.09, 0.04], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "calm" },
	qin_na: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.16, 0.08], fogColor: [0.13, 0.1, 0.05], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	chengpu: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.08], fogColor: [0.16, 0.07, 0.05], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.65, mood: "tragic" },
	jiantu: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "solemn" },
	mianshan: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.1, 0.06], fogColor: [0.14, 0.07, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.88, cameraBreath: 0.6, mood: "tragic" },
	// 伍子胥线
	chu_ping_ting: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.09, 0.07], fogColor: [0.14, 0.06, 0.05], fogDensity: 0.026, keyLightColor: C.vermilionLight, keyLightIntensity: 0.78, cameraBreath: 0.55, mood: "tense" },
	zhaoguan_ye: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: C.deepNightSky, fogColor: [0.05, 0.07, 0.11], fogDensity: 0.03, keyLightColor: C.coolLight, keyLightIntensity: 0.4, cameraBreath: 0.6, mood: "tense" },
	wushi_xiao: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.14, 0.1], fogColor: [0.11, 0.1, 0.07], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.62, cameraBreath: 0.45, mood: "tragic" },
	yuchang: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.16, 0.08, 0.1], fogColor: [0.11, 0.05, 0.07], fogDensity: 0.022, keyLightColor: C.vermilionLight, keyLightIntensity: 0.6, cameraBreath: 0.55, mood: "tense" },
	po_ying: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.05], fogColor: [0.16, 0.07, 0.03], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.88, cameraBreath: 0.65, mood: "tragic" },
	bianshi: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.18, 0.08, 0.06], fogColor: [0.13, 0.06, 0.04], fogDensity: 0.026, keyLightColor: C.vermilionLight, keyLightIntensity: 0.78, cameraBreath: 0.6, mood: "tragic" },
	shulou_jian: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.16, 0.18], fogColor: [0.08, 0.12, 0.13], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "tragic" },
	// 齐桓公·管仲线
	linzi_zheng: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.06], fogColor: [0.15, 0.07, 0.04], fogDensity: 0.026, keyLightColor: C.vermilionLight, keyLightIntensity: 0.8, cameraBreath: 0.55, mood: "tense" },
	guanbao_jian: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.2, 0.14], fogColor: [0.12, 0.14, 0.09], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "calm" },
	zunwang_meng: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "solemn" },
	kuiqiu_hui: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.88, cameraBreath: 0.3, mood: "solemn" },
	lunxiang_bing: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.12, 0.13, 0.16], fogColor: [0.08, 0.09, 0.11], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.5, cameraBreath: 0.35, mood: "solemn" },
	qi_gong_ning: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.16, 0.1, 0.08], fogColor: [0.11, 0.07, 0.05], fogDensity: 0.02, keyLightColor: C.warmLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "tense" },
	qi_e_si: { ...DEFAULT_MOOD, time: "night", weather: "mist", skyColor: [0.1, 0.09, 0.08], fogColor: [0.07, 0.06, 0.05], fogDensity: 0.026, keyLightColor: C.neutralLight, keyLightIntensity: 0.4, cameraBreath: 0.5, mood: "tragic" },
	// 秦穆公线
	yong_ting: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.15, 0.08], fogColor: [0.13, 0.1, 0.05], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	wugu_xian: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.18, 0.12], fogColor: [0.12, 0.12, 0.08], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "calm" },
	fanzhou_yi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.16, 0.18], fogColor: [0.08, 0.12, 0.13], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.72, cameraBreath: 0.4, mood: "calm" },
	yaoshan_fu: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.09, 0.07], fogColor: [0.14, 0.06, 0.05], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.82, cameraBreath: 0.65, mood: "tragic" },
	suofu_zui: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.16, 0.18], fogColor: [0.11, 0.11, 0.12], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.6, cameraBreath: 0.35, mood: "solemn" },
	xirong_ba: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.16, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.35, mood: "solemn" },
	huangniao_xun: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.16, 0.14, 0.1], fogColor: [0.11, 0.09, 0.07], fogDensity: 0.024, keyLightColor: C.warmLight, keyLightIntensity: 0.6, cameraBreath: 0.5, mood: "tragic" },
	// 夫差线
	wu_gong_ting: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.1, 0.16], fogColor: [0.12, 0.07, 0.11], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.7, cameraBreath: 0.35, mood: "solemn" },
	ailing_zhan: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.08], fogColor: [0.16, 0.07, 0.05], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.65, mood: "tragic" },
	// 孙武线
	wugong_jiao: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.14, 0.1, 0.16], fogColor: [0.1, 0.07, 0.11], fogDensity: 0.022, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.62, cameraBreath: 0.5, mood: "tense" },

	// ============ 战国（zhanguo） ============
	// 商鞅线
	qin_xianyang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.13, 0.07], fogColor: [0.12, 0.09, 0.05], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	qin_nanshimen: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.13, 0.08], fogColor: [0.11, 0.09, 0.05], fogDensity: 0.019, keyLightColor: C.warmLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "calm" },
	qin_fating: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.13, 0.06], fogColor: [0.12, 0.09, 0.04], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	shang_yi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.12], fogColor: [0.1, 0.13, 0.08], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "calm" },
	guanxia_keshe: { ...DEFAULT_MOOD, time: "night", weather: "mist", skyColor: [0.08, 0.1, 0.12], fogColor: [0.06, 0.07, 0.09], fogDensity: 0.024, keyLightColor: C.coolLight, keyLightIntensity: 0.45, cameraBreath: 0.4, mood: "calm" },
	// 苏秦线
	luoyang_guixiang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.12, 0.16], fogColor: [0.11, 0.08, 0.11], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.62, cameraBreath: 0.4, mood: "tragic" },
	hezhong_yitan: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.16, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	liu_xiangyin: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.88, cameraBreath: 0.3, mood: "solemn" },
	qi_chelie: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.18, 0.07, 0.06], fogColor: [0.13, 0.05, 0.04], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.9, cameraBreath: 0.7, mood: "tragic" },
	// 张仪线
	qin_zhangxiang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.16, 0.18], fogColor: [0.1, 0.11, 0.13], fogDensity: 0.019, keyLightColor: C.coolLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	chu_gongdian: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.1, 0.16], fogColor: [0.12, 0.07, 0.11], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.72, cameraBreath: 0.35, mood: "solemn" },
	shangyu_liuli: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.14], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.019, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.4, mood: "calm" },
	wei_dushi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.18, 0.12], fogColor: [0.12, 0.12, 0.08], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.35, mood: "calm" },
	// 范雎线
	wei_cezhong: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: [0.05, 0.05, 0.06], fogColor: [0.04, 0.04, 0.05], fogDensity: 0.034, keyLightColor: C.coolLight, keyLightIntensity: 0.3, cameraBreath: 0.5, mood: "tragic" },
	qin_qixiang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.12, 0.18], fogColor: [0.11, 0.08, 0.13], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.72, cameraBreath: 0.3, mood: "solemn" },
	xujia_chidi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.14, 0.1], fogColor: [0.12, 0.09, 0.07], fogDensity: 0.02, keyLightColor: C.warmLight, keyLightIntensity: 0.7, cameraBreath: 0.4, mood: "calm" },
	changping: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.07, 0.05], fogColor: [0.14, 0.05, 0.03], fogDensity: 0.032, keyLightColor: C.vermilionLight, keyLightIntensity: 0.92, cameraBreath: 0.75, mood: "tragic" },
	duyou_cijian: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.16, 0.18], fogColor: [0.08, 0.12, 0.13], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "tragic" },
	// 廉颇蔺相如线
	zhao_handan: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.1, 0.07], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	qin_zhangtai: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.15, 0.07], fogColor: [0.13, 0.1, 0.04], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.85, cameraBreath: 0.3, mood: "solemn" },
	mianchi_hui: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.16, 0.1], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "tense" },
	fujing_junfu: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.14], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.4, mood: "calm" },
	// 白起线
	yique: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.16, 0.06, 0.05], fogColor: [0.11, 0.04, 0.03], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.7, mood: "tragic" },
	qin_chaotang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.13, 0.07], fogColor: [0.12, 0.09, 0.05], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	duyou: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.16, 0.18], fogColor: [0.08, 0.12, 0.13], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.58, cameraBreath: 0.4, mood: "tragic" },
	// 屈原线
	miluojiang: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.1, 0.14, 0.18], fogColor: [0.07, 0.11, 0.14], fogDensity: 0.028, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.5, mood: "tragic" },
	// 乐毅线
	yan_chaotang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.14, 0.08], fogColor: [0.12, 0.09, 0.05], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	zhao_chaotang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.12, 0.16], fogColor: [0.11, 0.08, 0.11], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.7, cameraBreath: 0.3, mood: "solemn" },
	// 田单线
	linzi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.08], fogColor: [0.12, 0.1, 0.05], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	jiamo: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.14, 0.11, 0.07], fogColor: [0.1, 0.08, 0.05], fogDensity: 0.026, keyLightColor: C.warmLight, keyLightIntensity: 0.62, cameraBreath: 0.5, mood: "tense" },
	// 四公子线
	zhanguo_sigongzi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.14, 0.09], fogColor: [0.12, 0.09, 0.06], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	hangu_guan: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.14, 0.16], fogColor: [0.08, 0.1, 0.12], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.7, cameraBreath: 0.4, mood: "solemn" },
	handan: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.12, 0.16], fogColor: [0.11, 0.08, 0.11], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.72, cameraBreath: 0.3, mood: "solemn" },
	daliang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.14], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.019, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.35, mood: "calm" },
	chu_gongting: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.14], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.72, cameraBreath: 0.35, mood: "solemn" },

	// ============ 诸子百家（zhuzi） ============
	qi_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.18, 0.1], fogColor: [0.13, 0.11, 0.07], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	daliang_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.16, 0.2], fogColor: [0.12, 0.1, 0.14], fogDensity: 0.019, keyLightColor: C.coolLight, keyLightIntensity: 0.75, cameraBreath: 0.3, mood: "solemn" },
	qi_jixia: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.2], fogColor: [0.1, 0.13, 0.15], fogDensity: 0.018, keyLightColor: C.coolLight, keyLightIntensity: 0.78, cameraBreath: 0.35, mood: "calm" },
	haoshui_bridge: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.2, 0.18], fogColor: [0.09, 0.15, 0.13], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "calm" },
	chuye_garden: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.15], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.72, cameraBreath: 0.45, mood: "mystic" },
	qindu_xianyang: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.13, 0.09], fogColor: [0.13, 0.09, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	qin_prison: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: [0.06, 0.05, 0.05], fogColor: [0.04, 0.04, 0.04], fogDensity: 0.034, keyLightColor: C.coolLight, keyLightIntensity: 0.32, cameraBreath: 0.4, mood: "tragic" },
	yan_jieshi: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.16, 0.2], fogColor: [0.1, 0.11, 0.14], fogDensity: 0.019, keyLightColor: C.coolLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	song_city: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.13, 0.09], fogColor: [0.12, 0.08, 0.06], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.72, cameraBreath: 0.3, mood: "solemn" },
	song_wall: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.2, 0.16], fogColor: [0.12, 0.14, 0.11], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.4, mood: "tense" },
	lanling: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.17, 0.13], fogColor: [0.12, 0.11, 0.08], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.35, mood: "calm" },
	zhu_book: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.1, 0.08, 0.12], fogColor: [0.07, 0.05, 0.09], fogDensity: 0.022, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.5, cameraBreath: 0.4, mood: "tragic" },
	wuyi_mud: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.18, 0.15], fogColor: [0.09, 0.13, 0.1], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.72, cameraBreath: 0.45, mood: "calm" },
	// 孔子线
	qufu_hao: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.18, 0.12], fogColor: [0.12, 0.12, 0.08], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "calm" },
	shizhou_li: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.16, 0.2], fogColor: [0.1, 0.11, 0.14], fogDensity: 0.019, keyLightColor: C.coolLight, keyLightIntensity: 0.72, cameraBreath: 0.35, mood: "solemn" },
	jiagu_hui: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.35, mood: "tense" },
	zhouyou_lu: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.1, 0.07], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.65, cameraBreath: 0.5, mood: "tragic" },
	chencai_jue: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.17, 0.12], fogColor: [0.11, 0.12, 0.08], fogDensity: 0.022, keyLightColor: C.neutralLight, keyLightIntensity: 0.6, cameraBreath: 0.5, mood: "tragic" },
	wenjin_yin: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.15], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.019, keyLightColor: C.neutralLight, keyLightIntensity: 0.72, cameraBreath: 0.4, mood: "calm" },
	huolin_bi: { ...DEFAULT_MOOD, time: "dusk", weather: "clear", skyColor: [0.16, 0.16, 0.18], fogColor: [0.11, 0.11, 0.12], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.4, mood: "tragic" },

	// ============ 大秦（qin） ============
	// 秦始皇线
	handan_proton: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.1, 0.07], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.62, cameraBreath: 0.4, mood: "tragic" },
	jinian_palace: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.1, 0.06], fogColor: [0.15, 0.07, 0.04], fogDensity: 0.022, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.4, mood: "tense" },
	xianyang_court: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.88, cameraBreath: 0.3, mood: "solemn" },
	xianyang_palace_feast: { ...DEFAULT_MOOD, time: "night", weather: "embers", skyColor: [0.2, 0.14, 0.08], fogColor: [0.15, 0.1, 0.05], fogDensity: 0.02, keyLightColor: C.warmLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "warm" },
	bohai_coast: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.18, 0.2], fogColor: [0.08, 0.13, 0.15], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "solemn" },
	afang_palace: { ...DEFAULT_MOOD, time: "day", weather: "embers", skyColor: [0.22, 0.12, 0.06], fogColor: [0.16, 0.08, 0.04], fogDensity: 0.024, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.5, mood: "tense" },
	shaqiu_platform: { ...DEFAULT_MOOD, time: "night", weather: "mist", skyColor: [0.1, 0.09, 0.07], fogColor: [0.07, 0.06, 0.05], fogDensity: 0.026, keyLightColor: C.neutralLight, keyLightIntensity: 0.5, cameraBreath: 0.45, mood: "tense" },
	// 荆轲线
	yan_market: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.18, 0.12], fogColor: [0.11, 0.12, 0.08], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.4, mood: "calm" },
	yishui_river: { ...DEFAULT_MOOD, time: "dusk", weather: "mist", skyColor: [0.12, 0.14, 0.18], fogColor: [0.08, 0.1, 0.13], fogDensity: 0.028, keyLightColor: C.coolLight, keyLightIntensity: 0.55, cameraBreath: 0.55, mood: "tragic" },
	wuyang_road: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.1, 0.07], fogDensity: 0.019, keyLightColor: C.warmLight, keyLightIntensity: 0.7, cameraBreath: 0.4, mood: "tense" },
	qin_hall: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.16, 0.09], fogColor: [0.14, 0.1, 0.05], fogDensity: 0.017, keyLightColor: C.vermilionLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "tense" },
	// 吕不韦线
	handan_market: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.18, 0.14], fogColor: [0.13, 0.12, 0.09], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "calm" },
	lv_mansion: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.15, 0.1], fogColor: [0.12, 0.1, 0.07], fogDensity: 0.018, keyLightColor: C.coolLight, keyLightIntensity: 0.72, cameraBreath: 0.3, mood: "solemn" },
	qin_court_zhongfu: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.16, 0.09], fogColor: [0.13, 0.1, 0.05], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	shu_road: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.12, 0.12, 0.14], fogColor: [0.08, 0.08, 0.1], fogDensity: 0.026, keyLightColor: C.coolLight, keyLightIntensity: 0.5, cameraBreath: 0.5, mood: "tragic" },
	// 李斯线
	shangcai_dongmen: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.2, 0.14], fogColor: [0.12, 0.14, 0.09], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.72, cameraBreath: 0.45, mood: "tragic" },
	qin_library: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.13, 0.09], fogColor: [0.11, 0.09, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.72, cameraBreath: 0.3, mood: "solemn" },
	chamber_secret: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: [0.05, 0.06, 0.07], fogColor: [0.04, 0.05, 0.05], fogDensity: 0.032, keyLightColor: C.coolLight, keyLightIntensity: 0.3, cameraBreath: 0.5, mood: "tense" },
	xianyang_market: { ...DEFAULT_MOOD, time: "day", weather: "embers", skyColor: [0.2, 0.09, 0.06], fogColor: [0.14, 0.06, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.6, mood: "tragic" },
	// 蒙恬线
	greatwall: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.16, 0.18], fogColor: [0.08, 0.12, 0.13], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.75, cameraBreath: 0.4, mood: "solemn" },
	shangjun_camp: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.16, 0.12], fogColor: [0.1, 0.11, 0.08], fogDensity: 0.019, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.35, mood: "solemn" },
	prison_cart: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.12, 0.1, 0.09], fogColor: [0.08, 0.07, 0.06], fogDensity: 0.026, keyLightColor: C.neutralLight, keyLightIntensity: 0.5, cameraBreath: 0.45, mood: "tragic" },

	// ============ 楚汉（chuhan） ============
	// 陈胜线
	longmu_field: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.2, 0.14], fogColor: [0.13, 0.14, 0.09], fogDensity: 0.017, keyLightColor: C.neutralLight, keyLightIntensity: 0.8, cameraBreath: 0.4, mood: "calm" },
	daze_rain: { ...DEFAULT_MOOD, time: "day", weather: "rain", skyColor: [0.1, 0.14, 0.18], fogColor: [0.08, 0.11, 0.14], fogDensity: 0.028, keyLightColor: C.coolLight, keyLightIntensity: 0.5, cameraBreath: 0.5, mood: "tense" },
	daze_uprising: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.06], fogColor: [0.16, 0.07, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.88, cameraBreath: 0.65, mood: "tense" },
	chen_city: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.15, 0.09], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.35, mood: "solemn" },
	chen_palace: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.15, 0.08], fogColor: [0.14, 0.1, 0.05], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	chen_siege: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.08, 0.05], fogColor: [0.14, 0.06, 0.04], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.7, mood: "tragic" },
	// 韩信线
	qi_land: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.2], fogColor: [0.1, 0.13, 0.15], fogDensity: 0.019, keyLightColor: C.coolLight, keyLightIntensity: 0.78, cameraBreath: 0.35, mood: "solemn" },
	// 彭越线
	juye_ze: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.12, 0.16, 0.18], fogColor: [0.08, 0.12, 0.13], fogDensity: 0.024, keyLightColor: C.coolLight, keyLightIntensity: 0.62, cameraBreath: 0.45, mood: "calm" },
	liang_youji: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.18, 0.12], fogColor: [0.12, 0.12, 0.08], fogDensity: 0.019, keyLightColor: C.neutralLight, keyLightIntensity: 0.7, cameraBreath: 0.45, mood: "tense" },
	suiyang_feng: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.17, 0.09], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.3, mood: "solemn" },
	luoyang_zu: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.08, 0.06], fogColor: [0.14, 0.06, 0.04], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.88, cameraBreath: 0.7, mood: "tragic" },
	// 英布线
	qingmian_xing: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.12, 0.1], fogColor: [0.1, 0.08, 0.07], fogDensity: 0.022, keyLightColor: C.neutralLight, keyLightIntensity: 0.6, cameraBreath: 0.4, mood: "tragic" },
	lishan_tu: { ...DEFAULT_MOOD, time: "day", weather: "mist", skyColor: [0.16, 0.13, 0.1], fogColor: [0.11, 0.09, 0.07], fogDensity: 0.024, keyLightColor: C.warmLight, keyLightIntensity: 0.6, cameraBreath: 0.45, mood: "tragic" },
	chen_shiyidi: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.08, 0.07], fogColor: [0.14, 0.06, 0.05], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.82, cameraBreath: 0.6, mood: "tragic" },
	huainan_feng: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.15, 0.09], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	poyang_zhu: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.08, 0.07], fogColor: [0.14, 0.06, 0.05], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.65, mood: "tragic" },

	// ============ 汉初（hanchu） ============
	changle_palace: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.12, 0.15], fogColor: [0.13, 0.08, 0.1], fogDensity: 0.018, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	yongxiang: { ...DEFAULT_MOOD, time: "night", weather: "mist", skyColor: [0.1, 0.07, 0.09], fogColor: [0.07, 0.05, 0.06], fogDensity: 0.028, keyLightColor: C.coolLight, keyLightIntensity: 0.4, cameraBreath: 0.4, mood: "tragic" },
	dai_di: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.15], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.02, keyLightColor: C.neutralLight, keyLightIntensity: 0.75, cameraBreath: 0.4, mood: "solemn" },
	dai_wangfu: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.2, 0.14], fogColor: [0.11, 0.14, 0.09], fogDensity: 0.018, keyLightColor: C.neutralLight, keyLightIntensity: 0.78, cameraBreath: 0.3, mood: "solemn" },
	weiyang_palace: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.16, 0.09], fogColor: [0.13, 0.1, 0.05], fogDensity: 0.016, keyLightColor: C.warmLight, keyLightIntensity: 0.8, cameraBreath: 0.3, mood: "solemn" },
	lutai: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.16, 0.2], fogColor: [0.08, 0.12, 0.15], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.72, cameraBreath: 0.35, mood: "calm" },
	xiliu_camp: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.15, 0.18], fogColor: [0.08, 0.11, 0.13], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.72, cameraBreath: 0.35, mood: "solemn" },
	junji_daying: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.12, 0.14, 0.16], fogColor: [0.08, 0.1, 0.11], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.65, cameraBreath: 0.4, mood: "tense" },
	dongshi: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.09, 0.06], fogColor: [0.15, 0.06, 0.04], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.85, cameraBreath: 0.6, mood: "tragic" },
	tingyu_prison: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: [0.06, 0.06, 0.07], fogColor: [0.04, 0.04, 0.05], fogDensity: 0.032, keyLightColor: C.coolLight, keyLightIntensity: 0.32, cameraBreath: 0.4, mood: "tense" },
	qiguo_route: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.18, 0.14], fogColor: [0.1, 0.13, 0.1], fogDensity: 0.019, keyLightColor: C.neutralLight, keyLightIntensity: 0.72, cameraBreath: 0.4, mood: "calm" },
	changan_street: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.16, 0.14, 0.1], fogColor: [0.11, 0.1, 0.07], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.72, cameraBreath: 0.4, mood: "calm" },
	zhulv_blood: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.2, 0.07, 0.06], fogColor: [0.14, 0.05, 0.04], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.88, cameraBreath: 0.7, mood: "tragic" },

	// ============ 汉武（hanwu） ============
	chang_an_street: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.15, 0.09], fogColor: [0.13, 0.1, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "calm" },
	taishan_fengchan: { ...DEFAULT_MOOD, time: "dawn", weather: "clear", skyColor: [0.14, 0.18, 0.24], fogColor: [0.1, 0.14, 0.18], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.88, cameraBreath: 0.4, mood: "solemn" },
	northern_frontier: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.16, 0.18], fogColor: [0.1, 0.11, 0.13], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.78, cameraBreath: 0.4, mood: "solemn" },
	mobei_desert: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.2, 0.17, 0.1], fogColor: [0.13, 0.11, 0.07], fogDensity: 0.018, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.4, mood: "solemn" },
	longcheng_raid: { ...DEFAULT_MOOD, time: "dusk", weather: "embers", skyColor: [0.22, 0.1, 0.05], fogColor: [0.16, 0.07, 0.03], fogDensity: 0.028, keyLightColor: C.vermilionLight, keyLightIntensity: 0.88, cameraBreath: 0.6, mood: "tense" },
	langjuxu: { ...DEFAULT_MOOD, time: "dawn", weather: "clear", skyColor: [0.14, 0.18, 0.22], fogColor: [0.1, 0.14, 0.17], fogDensity: 0.02, keyLightColor: C.coolLight, keyLightIntensity: 0.85, cameraBreath: 0.35, mood: "solemn" },
	xiyu_desert: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.22, 0.18, 0.1], fogColor: [0.14, 0.11, 0.06], fogDensity: 0.017, keyLightColor: C.warmLight, keyLightIntensity: 0.82, cameraBreath: 0.4, mood: "solemn" },
	xiongnu_camp: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.18, 0.13, 0.08], fogColor: [0.12, 0.09, 0.05], fogDensity: 0.019, keyLightColor: C.warmLight, keyLightIntensity: 0.72, cameraBreath: 0.4, mood: "calm" },
	baling_night: { ...DEFAULT_MOOD, time: "night", weather: "clear", skyColor: [0.08, 0.1, 0.14], fogColor: [0.06, 0.07, 0.1], fogDensity: 0.022, keyLightColor: C.coolLight, keyLightIntensity: 0.45, cameraBreath: 0.4, mood: "calm" },
	wugu_prison: { ...DEFAULT_MOOD, time: "deepNight", weather: "mist", skyColor: [0.14, 0.05, 0.04], fogColor: [0.1, 0.04, 0.03], fogDensity: 0.03, keyLightColor: C.vermilionLight, keyLightIntensity: 0.5, cameraBreath: 0.55, mood: "tragic" },
	luntai_palace: { ...DEFAULT_MOOD, time: "day", weather: "clear", skyColor: [0.14, 0.1, 0.16], fogColor: [0.1, 0.07, 0.11], fogDensity: 0.02, keyLightColor: [0.85, 0.7, 0.92], keyLightIntensity: 0.65, cameraBreath: 0.35, mood: "solemn" },
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
