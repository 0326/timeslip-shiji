// 系列 chunqiu · 春秋。七条主角线（孔子已迁入 zhuzi 诸子百家）：
//   勾践(卷41·隐忍复仇) / 晋文公重耳(卷39·磨难铸明君) / 伍子胥(卷66·复仇之烈) /
//   齐桓公·管仲(卷32,62·器量成霸·善始不善终) / 秦穆公(卷5·求贤知过·霸西戎) /
//   吴王夫差(卷31·骄纵放虎·镜像勾践) / 孙武(卷65·令行禁止·知止身退)。
import { withSeries } from "./_series";

export const chunqiuStorylines = withSeries("chunqiu", [
	{
		id: "chunqiu_goujian_ink",
		title: "越王勾践 · 卧薪尝胆",
		subtitle: "越王勾践世家 · 句践",
		era: "spring_autumn",
		year: "春秋 · 末",
		cover: "#6b8f5a",
		glyph: "践",
		description:
			"禹之苗裔，文身断发，僻处东南。你将穿越成越王勾践，从檇李诡谲一箭伤吴、夫椒不听范蠡之谏而惨败，到会稽屈膝请为臣妾、卧薪尝胆二十二年，再到逢同匿形、谗杀子胥、终灭强吴——亲历一个把『隐忍』二字刻进骨头的人，如何在雪耻之后，照见自己『可与共患难，不可与共乐』的凉薄。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "goujian",
		relatedCharacters: ["goujian", "fanli", "wenzhong", "fengtong"],
		perspectives: [
			{ characterId: "goujian", storyKey: "goujian:chunqiu", unlockedBy: "goujian", nodeCount: 7 },
		],
	},
	{
		id: "chunqiu_chonger_ink",
		title: "晋文公重耳 · 退避三舍",
		subtitle: "晋世家 · 重耳",
		era: "spring_autumn",
		year: "春秋 · 中",
		cover: "#b8973a",
		glyph: "重",
		description:
			"骊姬之乱，公子出奔。你将穿越成重耳，从不辩不弑只身亡命，到流亡列国十九年——五鹿乞食受块土、齐国安乐几消志、楚宴一诺退避三舍、秦纳归晋忍怀嬴之辱，终于城濮一战而霸、践土会盟，却险些负了割股啖君的介子推。亲历一个骄纵公子如何被磨难铸成隐忍守信的一代明君。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "chonger",
		relatedCharacters: ["chonger", "huyan", "zhaocui", "jietui", "qinmu", "chuchengwang", "lij", "xianggong"],
		perspectives: [
			{ characterId: "chonger", storyKey: "chonger:chunqiu", unlockedBy: "chonger", nodeCount: 8 },
		],
	},
	{
		id: "chunqiu_wuzixu_ink",
		title: "伍子胥 · 日暮途远",
		subtitle: "伍子胥列传 · 伍员",
		era: "spring_autumn",
		year: "春秋 · 末",
		cover: "#4a6b8a",
		glyph: "胥",
		description:
			"父兄冤死于楚，血海深仇入骨。你将穿越成伍子胥，从诈召之下不赴死而亡命，到过昭关一夜白头、吴市吹箫、进专诸于公子光，佐吴破楚入郢、掘平王墓鞭尸三百『倒行逆施』以雪血仇，终于刚谏不改、赐属镂剑自刭、悬目东门以观越灭吴——亲历一个把『复仇』二字燃到极烈的人，那股烈，既是雪仇的骨，也是招祸的根。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 5,
		focusCharacter: "wuzixu",
		relatedCharacters: ["wuzixu", "wushe", "chupingwang", "feiwuji", "zhuanzhu", "gongziguang", "bopi", "fuchai"],
		perspectives: [
			{ characterId: "wuzixu", storyKey: "wuzixu:chunqiu", unlockedBy: "wuzixu", nodeCount: 8 },
		],
	},
	{
		id: "chunqiu_qihuan_ink",
		title: "齐桓公 · 九合诸侯",
		subtitle: "齐太公世家 · 桓公",
		era: "spring_autumn",
		year: "春秋 · 初",
		cover: "#d4a847",
		glyph: "桓",
		description:
			"公子争位，一箭射钩。你将穿越成齐桓公，从诈死先入立国，到不计射钩之仇拜管仲为仲父、尊王攘夷九合诸侯一匡天下——却在晚年信竖刁易牙开方、不听管仲遗言，终于饿死宫中、尸虫流出户。亲历一个『器量成霸、却难善其终』的首霸之君。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "qihuan",
		relatedCharacters: ["qihuan", "guanzhong", "baoshu", "gongzijiu", "shudiao", "yiya", "kaifang"],
		perspectives: [
			{ characterId: "qihuan", storyKey: "qihuan:chunqiu", unlockedBy: "qihuan", nodeCount: 6 },
		],
	},
	{
		id: "chunqiu_qinmu_ink",
		title: "秦穆公 · 霸西戎",
		subtitle: "秦本纪 · 穆公",
		era: "spring_autumn",
		year: "春秋 · 中",
		cover: "#c8923c",
		glyph: "穆",
		description:
			"僻处西陲，志在东出。你将穿越成秦穆公，以五张黑羊皮赎百里奚于奴虏、纳流亡之贤，泛舟济晋、韩原擒君；却因不听蹇叔哭师而崤山覆师，遂素服罪己、不替孟明终雪前耻，益国十二开地千里而霸西戎——晚年却以三良殉葬，为《黄鸟》所哀。亲历一个『求贤知过成霸业』的西陲雄主。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "qinmu",
		relatedCharacters: ["qinmu", "baili", "jianshu", "mengming", "youyu", "chonger"],
		perspectives: [
			{ characterId: "qinmu", storyKey: "qinmu:chunqiu", unlockedBy: "qinmu", nodeCount: 6 },
		],
	},
	{
		id: "chunqiu_fuchai_ink",
		title: "吴王夫差 · 无面见子胥",
		subtitle: "吴太伯世家 · 夫差",
		era: "spring_autumn",
		year: "春秋 · 末",
		cover: "#7a5c8a",
		glyph: "差",
		description:
			"父仇在肩，庭问不忘。你将穿越成吴王夫差，练兵三年破越于夫椒、围勾践于会稽，却纵其归国、伐齐争霸、赐死伍子胥自毁长城，黄池争长而国空被袭——终于姑苏亡国、遮面自刭『无面见子胥』。与勾践线互为镜像：他忍，你骄；他隐，你纵。亲历一个『骄纵放虎』的悲剧霸主。七幕成长弧线，多结局。",
		estimatedMinutes: 18,
		difficulty: 4,
		focusCharacter: "fuchai",
		relatedCharacters: ["fuchai", "goujian", "wuzixu", "bopi", "fanli", "gongziguang"],
		perspectives: [
			{ characterId: "fuchai", storyKey: "fuchai:chunqiu", unlockedBy: "fuchai", nodeCount: 7 },
		],
	},
	{
		id: "chunqiu_sunwu_ink",
		title: "孙武 · 三令五申",
		subtitle: "孙子吴起列传 · 孙武",
		era: "spring_autumn",
		year: "春秋 · 末",
		cover: "#4a6b8a",
		glyph: "孙",
		description:
			"兵法十三篇，见于吴王。你将穿越成孙武，从吴宫教战斩宠姬立威『将在军，君命有所不受』，到佐吴五战破楚入郢、北威齐晋——功成之际，却把兵法之外那一课『知止身退』写给了自己。亲历一个『令行禁止而知止全身』的兵家之圣。五幕紧凑弧线，多结局。",
		estimatedMinutes: 12,
		difficulty: 3,
		focusCharacter: "sunwu",
		relatedCharacters: ["sunwu", "gongziguang", "wuzixu", "fuchai"],
		perspectives: [
			{ characterId: "sunwu", storyKey: "sunwu:chunqiu", unlockedBy: "sunwu", nodeCount: 5 },
		],
	},
]);
