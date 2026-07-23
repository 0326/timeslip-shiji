// 系列 shang · 商（殷本纪，卷三）。四条成长弧线主角线：
// 成汤(革命立德) / 伊尹(放太甲·忠权之辨) / 武丁(版筑举贤·中兴) / 纣(才高无德·牧野亡国)。
import { withSeries } from "./_series";

export const shangStorylines = withSeries("shang", [
	{
		id: "shang_tang_ink",
		title: "成汤 · 网开三面",
		subtitle: "殷本纪 · 成汤",
		era: "shang",
		year: "上古 · 商初",
		cover: "#3f7a5c",
		glyph: "汤",
		description:
			"自契至汤八迁，你将穿越成成汤，从亳都立国到举伊尹于媵臣、网开三面德及禽兽，终以「吊民伐罪」放桀而建商——亲历一个「以德服天下」的开国之君如何让革命不是篡夺而是顺天应民。七幕成长弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 3,
		focusCharacter: "tang",
		relatedCharacters: ["tang", "yiyin", "gebo", "jie", "xie"],
		perspectives: [
			{ characterId: "tang", storyKey: "tang:shang", unlockedBy: "tang", nodeCount: 7 },
		],
	},
	{
		id: "shang_yiyin_ink",
		title: "伊尹 · 放太甲",
		subtitle: "殷本纪 · 伊尹",
		era: "shang",
		year: "上古 · 商初",
		cover: "#5a8f6b",
		glyph: "尹",
		description:
			"背鼎俎、为媵臣，一勺滋味说动天下之主。你将穿越成伊尹，从至贱致相到佐汤伐桀、放太甲于桐宫三年、终迎君还政——亲历一个「忠权之辨」的权臣，如何在唾手可得的神器前，终究选了「忠」。七幕成长弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 4,
		focusCharacter: "yiyin",
		relatedCharacters: ["yiyin", "tang", "taijia", "jie"],
		perspectives: [
			{ characterId: "yiyin", storyKey: "yiyin:shang", unlockedBy: "yiyin", nodeCount: 6 },
		],
	},
	{
		id: "shang_wuding_ink",
		title: "武丁 · 版筑举贤",
		subtitle: "殷本纪 · 武丁",
		era: "shang",
		year: "上古 · 商中",
		cover: "#3a6ea5",
		glyph: "丁",
		description:
			"承九世之乱、殷道中衰，你将穿越成武丁，从三年不言观国风，到梦求圣人、举傅说于版筑刑徒之间，以修德应飞雉之异，终成「武丁中兴」——亲历一个「不拘一格得贤则兴」的中兴之主。六幕成长弧线，多结局。",
		estimatedMinutes: 14,
		difficulty: 3,
		focusCharacter: "wuding",
		relatedCharacters: ["wuding", "fushuo", "zuji", "zhongzai"],
		perspectives: [
			{ characterId: "wuding", storyKey: "wuding:shang", unlockedBy: "wuding", nodeCount: 5 },
		],
	},
	{
		id: "shang_zhou_ink",
		title: "帝辛 · 殷鉴不远",
		subtitle: "殷本纪 · 纣",
		era: "shang",
		year: "上古 · 商末",
		cover: "#7a2f2f",
		glyph: "纣",
		description:
			"资辨捷疾、手格猛兽，却把绝世聪明全用在拒谏饰非上。你将穿越成帝辛（纣），从酒池肉林、炮烙醢脯，到「我生不有命在天」拒祖伊之谏、剖比干囚箕子，终于牧野倒戈、赴火而死——亲历一个「才高而无德」的亡国之君。每一步，都可照见另一种没走的历史。七幕反向弧线，多结局。",
		estimatedMinutes: 16,
		difficulty: 4,
		focusCharacter: "zhou",
		relatedCharacters: ["zhou", "daji", "bigan", "jizi", "weizi", "xibo", "jiuhou", "ehou"],
		perspectives: [
			{ characterId: "zhou", storyKey: "zhou:shang", unlockedBy: "zhou", nodeCount: 6 },
		],
	},
]);
