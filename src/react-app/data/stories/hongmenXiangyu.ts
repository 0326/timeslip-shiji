import type { Story } from "../../engine/types";

/**
 * 鸿门宴 · 项羽视角
 * 史源：《史记·项羽本纪》
 * 彩蛋：亚父之叹 —— 三次对范增举玦默然不应（fanzeng_ignored === 3）
 */
export const hongmenXiangyu: Story = {
	key: "hongmen_xiangyu",
	title: "鸿门宴 · 项羽视角",
	start: "arrival",
	variables: { fanzeng_ignored: 0 },
	nodes: {
		arrival: {
			content: [
				{ bg: "tent_night" },
				{ bgm: "tension_low" },
				{
					say: "公元前二〇六年，鸿门。你是项羽，麾下四十万大军驻于此。四十里外的霸上，是刘邦的十万人马。",
					speaker: "旁白",
				},
				{ show: { id: "fanzeng", expr: "anxious", pos: "left" } },
				{
					say: "君王，沛公居山东时，贪于财货，好美姬。今入关，财物无所取，妇女无所幸——此其志不在小！",
					speaker: "范增",
				},
				{
					say: "急击勿失！",
					speaker: "范增",
					hint: "范增数目项王，举所佩玉玦以示之者三，项王默然不应。",
				},
			],
			goto: "banquet",
		},
		banquet: {
			content: [
				{ bg: "tent_feast" },
				{ show: { id: "liubang", expr: "humble", pos: "right" } },
				{
					say: "次日，刘邦亲来谢罪：『臣与将军戮力而攻秦，不自意能先入关破秦。今者有小人之言，令将军与臣有郤……』",
					speaker: "旁白",
				},
				{
					say: "（他言辞如此谦卑……杀他，岂非令天下笑我项羽不能容人？）",
					speaker: "项羽",
				},
				{
					say: "席间，范增频频以眼色示意，三次举起腰间玉玦。",
					speaker: "旁白",
					hint: "玉玦，谐音『决』——范增在催你下决心。",
				},
			],
			choices: [
				{
					text: "默然不应，举杯与沛公共饮",
					goto: "jue2",
					correct: true,
					set: { fanzeng_ignored: { inc: 1 } },
					hint: "项王默然不应——史上的项羽，此刻并未动手。",
				},
				{
					text: "会意，按剑起身，当场击杀刘邦",
					goto: "death_kill",
				},
			],
		},
		jue2: {
			content: [
				{
					say: "范增见你不动，神色愈急，再次举玦相示。",
					speaker: "旁白",
					hint: "举所佩玉玦以示之者三。",
				},
			],
			choices: [
				{
					text: "仍旧默然，谈笑风生",
					goto: "jue3",
					correct: true,
					set: { fanzeng_ignored: { inc: 1 } },
				},
				{
					text: "唤左右武士，借故发难",
					goto: "death_kill",
				},
			],
		},
		jue3: {
			content: [
				{
					say: "第三次，范增几乎要从席上站起，玉玦在烛火下泛着冷光。",
					speaker: "旁白",
				},
			],
			choices: [
				{
					text: "第三次，依旧默然不应",
					goto: "after_jue3",
					correct: true,
					set: { fanzeng_ignored: { inc: 1 } },
				},
				{
					text: "终于按捺不住，喝令动手",
					goto: "death_kill",
				},
			],
		},
		after_jue3: {
			content: [
				{
					say: "三举玉玦，你三次默然。范增长叹一声，起身离席。",
					speaker: "旁白",
				},
				{ achieve: "yifu_sigh", when: (v) => v.fanzeng_ignored === 3 },
				{
					say: "片刻后，项庄入帐请舞剑助兴，剑光却屡屡逼向沛公——项伯亦拔剑起舞，常以身翼蔽沛公。",
					speaker: "旁白",
				},
			],
			goto: "fankuai",
		},
		fankuai: {
			content: [
				{ bgm: "tension_high" },
				{ show: { id: "fankuai", expr: "furious", pos: "left" } },
				{
					say: "帐外一声暴喝！樊哙带剑拥盾，撞倒卫士闯入，瞋目视你，头发上指，目眦尽裂。",
					speaker: "旁白",
				},
				{
					say: "（好一条壮士！）",
					speaker: "项羽",
					hint: "项王按剑而跽曰：『客何为者？』……壮士！赐之卮酒。",
				},
			],
			choices: [
				{
					text: "壮其勇，赐卮酒与彘肩",
					goto: "escape",
					correct: true,
					hint: "项王曰：壮士！能复饮乎？——英雄惜英雄。",
				},
				{
					text: "怒其无礼，喝令斩之",
					goto: "death_fankuai",
				},
			],
		},
		escape: {
			content: [
				{
					say: "酒过数巡，刘邦借如厕之名离席，竟一去不返——他抄小路，已奔回霸上。",
					speaker: "旁白",
				},
				{ hide: "liubang" },
				{
					say: "张良入帐，奉上白璧一双、玉斗一双，代沛公谢罪：『沛公不胜杯杓，不能辞。』",
					speaker: "张良",
				},
			],
			choices: [
				{
					text: "受璧，置之坐上",
					goto: "ending",
					correct: true,
					hint: "项王则受璧，置之坐上——大局已定，追之无益。",
				},
				{
					text: "察觉有诈，即刻发兵追杀",
					goto: "death_chase",
				},
			],
		},
		// ── 死亡分支 ──
		death_kill: {
			death: {
				reason: "鸿门席间擅杀已谢罪的刘邦，背弃信义",
				classical:
					"项王、项伯东向坐；亚父南向坐——亚父者，范增也；沛公北向坐；张良西向侍。",
				analysis:
					"史上的项羽并未在鸿门动手。刘邦既已『谢罪』，席间击杀便是背信弃义，诸侯必寒心而背楚投汉。所谓『默然不应』，正是项羽身上贵族式的矜持——也是他的命门。",
				goto: "banquet",
			},
		},
		death_fankuai: {
			death: {
				reason: "斩杀闯帐的壮士樊哙，自绝于天下豪杰",
				classical: "项王未有以应，曰：『坐。』樊哙从良坐。",
				analysis:
					"项羽最重『勇』。樊哙带剑拥盾、生啖彘肩，正是项羽欣赏的豪杰气概。斩之，便是亲手寒了天下壮士之心。史上项羽不但不怒，反赐酒赐肉。",
				goto: "fankuai",
			},
		},
		death_chase: {
			death: {
				reason: "鸿门已散仍发兵追杀，落人口实",
				classical: "沛公已去，间至军中。张良入谢……项王则受璧，置之坐上。",
				analysis:
					"刘邦既已脱身回营，此时发兵便是公然背弃方才的『和解』，反令自己失去道义。史上项羽受璧而罢——这一夜，他放走了唯一能埋葬自己的人。",
				goto: "escape",
			},
		},
		ending: {
			content: [
				{ bg: "tent_feast" },
				{
					say: "范增接过玉斗，掷于地，拔剑撞而破之，叹道——",
					speaker: "旁白",
				},
				{ show: { id: "fanzeng", expr: "angry", pos: "left" } },
				{
					say: "唉！竖子不足与谋。夺项王天下者，必沛公也。吾属今为之虏矣！",
					speaker: "范增",
				},
				{
					say: "一夜鸿门，杯酒未见血光。可天下的走向，已在你的『默然』之间，悄然倾斜。四年后，垓下。",
					speaker: "旁白",
				},
				{ achieve: "hongmen_through" },
			],
			end: true,
		},
	},
};
