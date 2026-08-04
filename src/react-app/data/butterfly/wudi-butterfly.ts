// 五帝本纪 · 自由模式「蝴蝶效应」跨篇章关联变量系统（第五批）
// 仅自由模式生效。正史模式不受影响。
// triggerChapter / effects[].chapter 关联 stories/inkStories/wudi.ts 中的 storyKey
// triggerChoice 关联该章节 endings 中 if_* 反事实结局的内部标识
// insertAfter 关联该章节 ink 源文件中的 === <node> === 节点名

export interface ButterflyEffect {
	id: string;
	description: string;
	// 触发条件：在哪个章节做了什么选择
	triggerChapter: string;
	triggerChoice: string; // 选项描述
	// 影响后续章节的文本变化
	effects: {
		chapter: string;
		// 当变量为 true 时，在该章节的对话中插入这段额外旁白
		insertAfter: string; // 插入在哪个节点之后
		narration: string; // 旁白内容
	}[];
}

export const wudiButterflyEffects: ButterflyEffect[] = [
	{
		id: "if_zhuyan",
		description:
			"黄帝·阪泉——若选择『以杀合天下』（诛炎帝），同族血脉相残之痕将延及后世，颛顼继位时仍能感到炎帝旧部的余悸。",
		triggerChapter: "huangdi:banquan",
		triggerChoice: "诛炎帝——以杀合天下",
		effects: [
			{
				chapter: "zhuanxu:diku",
				insertAfter: "c_open",
				narration:
					"颛顼践位之日，殿外忽起一阵无名朔风。老臣相顾低语：『炎帝旧部偶有异动，已非一年一年之事。』那阵风里，仿佛还留着阪泉之野的血气——黄帝当年那一剑，斩下了炎帝之首，却也把一根刺，留进了这天下。",
			},
		],
	},
	{
		id: "if_lichu",
		description:
			"黄帝·治天下——若选择『预行家天下』（立储），传贤之统便从源头处被悄悄改写，颛顼继位时的依据从『德』变成了『嫡长』。",
		triggerChapter: "huangdi:zhitianxia",
		triggerChoice: "立储——预行家天下",
		effects: [
			{
				chapter: "zhuanxu:diku",
				insertAfter: "c_open",
				narration:
					"颛顼立位，群臣拜贺。一位须发皆白的老臣拄杖上前，颤声道：『先帝有遗命，嫡长承统，今日得见矣。』殿中一时静默——这话本是尧舜之时才该有的；可如今它从黄帝那一道遗诏里就埋下了。传贤的那条线，比史册早了几百年地，断了苗头。",
			},
		],
	},
	{
		id: "if_fangdanzhu",
		description:
			"尧·求贤——若选择『存丹朱一念』，尧在禅让一事上多了一道犹疑的软痕，这份犹疑会顺着禅让传到舜口之中。",
		triggerChapter: "yao:qiuxian",
		triggerChoice: "存丹朱一念——成全父亲之心",
		effects: [
			{
				chapter: "shun:liuxiong",
				insertAfter: "c_sixiong",
				narration:
					"舜议流四凶之夕，独对群臣忽而沉吟：『先帝晚年曾有犹疑，丹朱之事，未必无悔……』他顿了顿，把后半句咽了回去。可满殿之人皆听得出——那道犹疑，从尧宫传到舜庭，已经悄悄渗进了每一道决断。人心一软，秤就偏了一分。",
			},
		],
	},
	{
		id: "if_qinduan",
		description:
			"舜·作刑——若选择『天子亲狱』，舜亲自断案虽极明察，却把整套律法绑在了他一人身上；禹治水时回望此事，亦生感叹。",
		triggerChapter: "shun:xingfa",
		triggerChoice: "天子亲狱——亲裁每一案",
		effects: [
			{
				chapter: "yu:zhishui",
				insertAfter: "c_open",
				narration:
					"禹治水居外十三年，偶得邸报，见朝中积案如山。他叹道：『昔年舜帝若亲自断狱，积案三年不决——他一人明察，是把秤全揽在自己手里；如今他南巡苍梧，那杆秤也就跟着断了。』治水要靠法度立得住，不能只靠一个人呀。",
			},
		],
	},
	{
		id: "if_tuli",
		description:
			"黄帝·涿鹿——若选择『屠尽九黎』，东方故土从此人烟断绝；舜流四凶时再提东方，便是满目荒芜。",
		triggerChapter: "huangdi:zhuolu",
		triggerChoice: "屠尽九黎——斩草除根",
		effects: [
			{
				chapter: "shun:liuxiong",
				insertAfter: "c_sixiong",
				narration:
					"议及流共工于幽陵、迁四凶于四裔之时，掌图的老臣展开东方與图，长叹一声：『东方九黎故地至今荒无人烟。』殿中寂然。当年黄帝那一道『屠尽』之令，斩的是九黎之族，断的却是东方数百年的烟火。流凶至此，竟是迁入一片无人之野。",
			},
		],
	},
];
