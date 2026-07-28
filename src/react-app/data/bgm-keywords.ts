export type Mood =
	| "solemn" | "danger" | "tension" | "sorrow"
	| "triumph" | "court" | "battle" | "mystery"
	| "peaceful" | "romantic" | "epic" | "nostalgic"
	| "march" | "dark" | "cheerful" | "melancholy"
	| "tragic" | "mournful" | "sad" | "death";

export interface KeywordRule {
	mood: Mood;
	words: string[];
	weight: number;
}

export const KEYWORD_RULES: KeywordRule[] = [
	{ mood: "battle", weight: 3, words: ["战", "征", "伐", "兵", "戈", "刀", "剑", "杀", "戎", "攻", "进兵", "追", "围", "破", "败", "擒", "阵", "卒", "敌", "溃", "战于", "击", "逐鹿", "阪泉", "鸣条"] },
	{ mood: "danger", weight: 3, words: ["暴", "凶", "乱", "危", "急", "险", "速", "伏", "败", "莫能伐", "不用帝命", "反", "作乱", "诛", "屠", "焚", "纵火", "滔天", "滔天", "襄陵"] },
	{ mood: "tension", weight: 2, words: ["雾", "疑", "伏", "夜", "暗", "谋", "察", "探", "盯", "窥", "伺", "计", "陷阱", "巧言", "漫天", "顽凶", "争位", "对峙", "失向", "散乱"] },
	{ mood: "court", weight: 3, words: ["朝", "帝", "天子", "诸侯", "群臣", "四岳", "明堂", "百官", "禅让", "受禅", "即位", "立", "摄行", "推", "辟四门", "荐", "刑", "典", "宥", "摄政"] },
	{ mood: "epic", weight: 2, words: ["万国", "天下", "九州", "四海", "共主", "百代", "千秋", "垂衣", "万世", "荡平", "披山通道", "巡", "执圭", "涂山", "十三年", "浚川", "随山"] },
	{ mood: "sorrow", weight: 3, words: ["哭", "泣", "哀", "悲", "殛", "死", "亡", "崩", "薨", "殉", "悼", "孤", "殁", "丧", "魂", "弃", "埋", "焚", "杀", "酒池", "肉林", "亡国", "失德"] },
	{ mood: "nostalgic", weight: 2, words: ["忆", "昔", "旧", "往", "昔者", "当年", "曾经", "追思", "念", "回首", "往昔", "暮年"] },
	{ mood: "mystery", weight: 2, words: ["玄", "天", "道", "占", "卜", "天象", "星", "神", "化", "禅", "敬授", "明通", "日月", "绝地天通", "占卜", "巫"] },
	{ mood: "peaceful", weight: 2, words: ["耕", "田", "渔", "猎", "樵", "炊", "桑", "安居", "和平", "宁", "五谷", "蓺", "播", "丰", "年丰", "相亲", "琴", "葛衣", "妫水", "历山"] },
	{ mood: "romantic", weight: 2, words: ["女英", "娥皇", "二妃", "泣竹", "斑竹", "湘", "湘水", "伉俪", "夫妇", "婚", "情", "爱"] },
	{ mood: "triumph", weight: 3, words: ["胜", "服", "咸服", "朝", "咸来", "遂", "禽杀", "凯", "功成", "臣服", "咸尊", "归", "合流", "俯首", "跳下", "不死", "功成"] },
	{ mood: "march", weight: 2, words: ["旌旗", "聚", "征师", "出师", "行军", "列阵", "战歌", "誓", "甘誓", "用命", "振兵", "修德"] },
	{ mood: "dark", weight: 2, words: ["暗", "阴", "诡", "诈", "奸", "佞", "恶", "凶", "戾", "残忍", "暴虐", "贪婪", "纵欲", "奢靡", "权谋", "算计", "阴谋", "倾轧", "陷害"] },
	{ mood: "cheerful", weight: 2, words: ["喜", "欢", "乐", "笑", "庆", "贺", "欢腾", "婴孩", "长大", "嬉戏", "童", "幼", "青春", "少年"] },
	{ mood: "melancholy", weight: 2, words: ["忧", "愁", "烦", "闷", "叹", "嗟", "悲叹", "感伤", "忧思", "忧虑", "愁思", "哀思", "不得志", "失意", "落寞", "孤寂"] },
	{ mood: "tragic", weight: 3, words: ["惨", "凄", "绝", "灭", "屠", "焚", "毁", "亡", "破", "败", "覆", "灭顶", "覆灭", "绝境", "绝路", "惨死", "横死", "夭折", "枉死"] },
	{ mood: "mournful", weight: 2, words: ["哀", "悼", "悲", "伤", "泣", "哭", "泪", "涕", "恸", "凄", "惨", "悲凉", "哀伤", "悲痛", "悲恸", "哀悼", "追悼", "凭吊", "祭奠"] },
	{ mood: "sad", weight: 2, words: ["哀", "伤", "悲", "愁", "凄", "苦", "痛", "惨", "酸", "涩", "忧", "愁", "难过", "伤心", "哀伤", "悲痛", "悲凉", "凄苦", "酸楚", "伤感"] },
	{ mood: "death", weight: 3, words: ["死", "亡", "逝", "殁", "殛", "杀", "诛", "斩", "刎", "缢", "焚", "埋", "葬", "殉", "卒", "薨", "崩", "夭", "逝", "亡故", "身故", "丧命", "毙命", "丧生"] },
	{ mood: "solemn", weight: 1, words: ["德", "仁", "孝", "圣", "禅", "传", "敬", "法", "礼", "义", "信", "忠", "恕", "诚", "正", "公", "道", "命"] },
];

export const SPEAKER_MOOD_HINT: Record<string, Mood> = {
	青月: "mystery",
	瞽叟: "dark",
	象: "dark",
	丹朱: "tension",
	共工: "dark",
	蚩尤: "battle",
	炎帝: "march",
	尧: "court",
	舜: "solemn",
	禹: "epic",
	大禹: "epic",
	启: "march",
	桀: "sorrow",
	二妃: "romantic",
	娥皇: "romantic",
	女英: "romantic",
};

export const STRONG_EMOTION_TRIGGERS: Record<string, Mood> = {
	死了: "sorrow",
	埋了: "tragic",
	哭了: "sorrow",
	泣: "sad",
	杀: "danger",
	火: "danger",
	伏: "tension",
	胜: "triumph",
	服了: "triumph",
	跪: "triumph",
	禅: "epic",
	即位: "epic",
	登基: "epic",
	泣竹: "sad",
	湘水: "sad",
	焚: "danger",
	跳: "triumph",
};

export const WEAK_EMOTION_TRIGGERS: Record<string, Mood> = {
	忧: "sorrow",
	虑: "tension",
	笑: "cheerful",
	喜: "triumph",
	望: "nostalgic",
	追: "nostalgic",
	愁: "sad",
	叹: "melancholy",
	悲: "sorrow",
	伤: "sad",
	哀: "sorrow",
	乐: "cheerful",
	怒: "danger",
	惊: "tension",
	疑: "tension",
};
