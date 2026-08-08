// 系列 qunxiang · 番外篇·群英传（游侠列传·刺客列传）成就。
// 三位游侠 + 四位刺客，各自以义立名的史实终局。
import type { Achievement } from "../../types/achievement";

export const qunxiangAchievements: Record<string, Achievement> = {
	guojie_youxia: {
		id: "guojie_youxia",
		name: "游侠之死",
		description: "走完郭解的一生——少年凶侠折节为俭，以德报怨、厚施薄望，终因名望过盛被族灭",
		classicalQuote: "自关以东，莫不延颈愿交焉。",
		type: "story",
		points: 200,
		icon: "⚔️",
	},
	zhuke_xiayizhi: {
		id: "zhuke_xiayizhi",
		name: "无名侠骨",
		description: "走完朱家的一生——藏季布而不伐其功，散尽家财专趋人之急，侠名不立而天下景仰",
		classicalQuote: "以不伐其功、不矜其能，人皆称之。",
		type: "story",
		points: 200,
		icon: "🕊️",
	},
	zhuanzhu_yuchang: {
		id: "zhuanzhu_yuchang",
		name: "鱼肠千古",
		description: "走完专诸的一生——太湖屠户得公子光以国士相待，鱼腹藏剑于炙鱼中一击毙王僚",
		classicalQuote: "使专诸置匕首于炙鱼腹中而进之。",
		type: "story",
		points: 220,
		icon: "🗡️",
	},
	yurang_tunter: {
		id: "yurang_tunter",
		name: "吞炭漆身",
		description: "走完豫让的一生——漆身为厉、吞炭为哑以报智伯知遇，三跃击衣而伏剑自杀",
		classicalQuote: "士为知己者死，女为悦己者容。",
		type: "story",
		points: 220,
		icon: "🌫️",
	},
	niezheng_cike: {
		id: "niezheng_cike",
		name: "皮面决眼",
		description: "走完聂政的一生——母死即行，仗剑入韩刺杀侠累，自毁面目以不连累姐姐聂荣",
		classicalQuote: "聂政之所以名传后世者，其姊亦烈女也。",
		type: "story",
		points: 220,
		icon: "🎭",
	},
	jingke_cike: {
		id: "jingke_cike",
		name: "易水悲歌",
		description: "走完荆轲的一生——图穷匕见、倚柱而笑，风萧萧兮易水寒，壮士一去兮不复还",
		classicalQuote: "风萧萧兮易水寒，壮士一去兮不复还！",
		type: "story",
		points: 250,
		icon: "🌊",
	},
	jumeng_renxia: {
		id: "jumeng_renxia",
		name: "任侠显名",
		description: "走完剧孟的一生——以任侠显诸侯，母丧千乘来送，死后家无余财，信义重于财帛",
		classicalQuote: "吴楚举大事而不求剧孟，吾知其无能为已矣。",
		type: "story",
		points: 200,
		icon: "🏇",
	},
};