// 系列 qunxiang · 番外篇·群英传（游侠列传·刺客列传·季布栾布列传）。
// 三条主角线：郭解/朱家/专诸，均为四幕成长弧线ink。
import { withSeries } from "./_series";

export const qunxiangStorylines = withSeries("qunxiang", [
	{
		id: "qunxiang_guojie_ink",
		title: "郭解 · 游侠",
		subtitle: "游侠列传 · 郭解",
		era: "western_han",
		year: "？— 公元前 127 年",
		cover: "#8a8a9c",
		glyph: "解",
		description:
			"少年凶侠，折节为俭。你将穿越成郭解——从以暴制暴的少年，到以德报怨的游侠之首，再到徙茂陵、被族灭。亲历一个布衣之侠的崛起与覆灭。四幕成长弧线，多结局。",
		estimatedMinutes: 12,
		difficulty: 3,
		focusCharacter: "guojie",
		relatedCharacters: ["guojie"],
		perspectives: [
			{ characterId: "guojie", storyKey: "guojie:qunxiang", unlockedBy: "guojie", nodeCount: 4 },
		],
	},
	{
		id: "qunxiang_zhuke_ink",
		title: "朱家 · 侠义之首",
		subtitle: "游侠列传 · 朱家",
		era: "western_han",
		year: "秦末汉初",
		cover: "#7a7a8c",
		glyph: "朱",
		description:
			"藏人所不能藏，方为侠。你将穿越成朱家——藏匿季布、散尽家财、不伐其功。亲历侠义之首的无名人生。四幕成长弧线，多结局。",
		estimatedMinutes: 12,
		difficulty: 3,
		focusCharacter: "zhuke",
		relatedCharacters: ["zhuke", "jibu"],
		perspectives: [
			{ characterId: "zhuke", storyKey: "zhuke:qunxiang", unlockedBy: "zhuke", nodeCount: 4 },
		],
	},
	{
		id: "qunxiang_zhuanzhu_ink",
		title: "专诸 · 鱼肠剑",
		subtitle: "刺客列传 · 专诸",
		era: "spring_autumn",
		year: "？— 公元前 515 年",
		cover: "#6b5a6b",
		glyph: "诸",
		description:
			"士为知己者死。你将穿越成专诸——从太湖屠户到鱼腹藏剑的刺客，公子光的一句『光之身，子之身也』，你以命相报。亲览鱼肠千古的决绝一刺。四幕成长弧线，多结局。",
		estimatedMinutes: 12,
		difficulty: 3,
		focusCharacter: "zhuanzhu",
		relatedCharacters: ["zhuanzhu", "gongziguang"],
		perspectives: [
			{ characterId: "zhuanzhu", storyKey: "zhuanzhu:qunxiang", unlockedBy: "zhuanzhu", nodeCount: 4 },
		],
	},
	{
		id: "qunxiang_yurang_ink",
		title: "豫让 · 吞炭漆身",
		subtitle: "刺客列传 · 豫让",
		era: "warring_states",
		year: "？— 公元前 425 年",
		cover: "#5a5a6b",
		glyph: "让",
		description:
			"士为知己者死。你将穿越成豫让——智伯以国士待你，你便漆身吞炭、三跃击衣以报之。明知杀不了赵襄子，仍然去杀。亲历刺客中最悲壮的执念。四幕成长弧线，多结局。",
		estimatedMinutes: 12,
		difficulty: 3,
		focusCharacter: "yurang",
		relatedCharacters: ["yurang", "zhaorangzi", "zhibo"],
		perspectives: [
			{ characterId: "yurang", storyKey: "yurang:qunxiang", unlockedBy: "yurang", nodeCount: 4 },
		],
	},
	{
		id: "qunxiang_niezheng_ink",
		title: "聂政 · 刺侠累",
		subtitle: "刺客列传 · 聂政",
		era: "warring_states",
		year: "？— 公元前 397 年",
		cover: "#6b4a5a",
		glyph: "政",
		description:
			"母在不许，母死即行。你将穿越成聂政——严仲子以百金为母寿，你以母在辞之。母死后你仗剑入韩，刺杀相国侠累，自毁面容不连累姐姐。亲览义与亲的两难抉择。四幕成长弧线，多结局。",
		estimatedMinutes: 12,
		difficulty: 3,
		focusCharacter: "niezheng",
		relatedCharacters: ["niezheng", "yanzhongzi", "nierong"],
		perspectives: [
			{ characterId: "niezheng", storyKey: "niezheng:qunxiang", unlockedBy: "niezheng", nodeCount: 4 },
		],
	},
	{
		id: "qunxiang_jingke_ink",
		title: "荆轲 · 刺秦王",
		subtitle: "刺客列传 · 荆轲",
		era: "warring_states",
		year: "？— 公元前 227 年",
		cover: "#4a3a5a",
		glyph: "轲",
		description:
			"风萧萧兮易水寒，壮士一去兮不复还。你将穿越成荆轲——受燕太子丹之托，携樊於期之首与督亢之图入秦。图穷匕见，你左手把秦王之袖，右手持匕首揕之。亲历最著名的刺杀。四幕成长弧线，多结局。",
		estimatedMinutes: 14,
		difficulty: 4,
		focusCharacter: "jingke",
		relatedCharacters: ["jingke", "yandan", "qinwuyang", "gaolianli"],
		perspectives: [
			{ characterId: "jingke", storyKey: "jingke:qunxiang", unlockedBy: "jingke", nodeCount: 4 },
		],
	},
	{
		id: "qunxiang_jumeng_ink",
		title: "剧孟 · 以任侠显",
		subtitle: "游侠列传 · 剧孟",
		era: "western_han",
		year: "汉景帝时期",
		cover: "#6a6a5a",
		glyph: "孟",
		description:
			"吴楚举大事而不求剧孟，吾知其无能为已矣。你将穿越成剧孟——洛阳人，以任侠显诸侯。七国之乱时周亚夫得你而喜，母丧千乘来送，死后家无余财。亲历游侠的信义人生。四幕成长弧线，多结局。",
		estimatedMinutes: 12,
		difficulty: 3,
		focusCharacter: "jumeng",
		relatedCharacters: ["jumeng", "zhouyafu"],
		perspectives: [
			{ characterId: "jumeng", storyKey: "jumeng:qunxiang", unlockedBy: "jumeng", nodeCount: 4 },
		],
	},
]);
