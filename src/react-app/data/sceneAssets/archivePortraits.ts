/**
 * 图鉴专用CG立绘注册表（精致厚涂CG风格）。
 *
 * 与剧情/对话立绘（/assets/figures/）强制分离，图鉴页面只能使用此处的CG立绘。
 * 后续修改对话立绘时，不要改动 /assets/archive-figures/ 下的文件。
 * 每生成一批CG立绘后，将角色ID添加到 ARCHIVE_CG_READY 集合中。
 *
 * 文件路径约定：/assets/archive-figures/<id>/full-default.jpg
 */
import { assetUrl } from "../../lib/assetUrl";

/** 已生成精致厚涂CG立绘的角色ID集合（仅保留已确认新CG风格·旧风格动漫立绘一律剔除） */
const ARCHIVE_CG_READY = new Set<string>([
	// 首批：楚汉核心角色（8人·确认）
	"hanxin","xiangyu","zhangliang","liubang","xiaohe","fanzeng","fankuai","yuji",
	// 五帝篇（20人·确认完结）
	"huangdi","yandi","chiyou","shun","yao","diku","gaoyao","leizu","gonggong",
	"gun","ehuang","houji","fenghou","cangjie","danzhu","kui","huandou","gusou",
	"changxian","dahong",
	// 夏朝篇（5人·确认）
	"yu","qi","jie","tushan","yi",
	// 商朝篇（22人·确认完结，meixi/pangeng/fuhao 已在功能一模块重制为新CG风格）
	"tang","yiyin","taijia","wuding","fushuo","zuji","zhongzai","zhou","daji",
	"bigan","jizi","weizi","jiuhou","ehou","xibo","zuyi","chonghou","feizhong",
	"gebo","meixi","pangeng","fuhao",
	// 西周篇（24人·确认完结）
	"jiangshang","hongyao","wenwang","wuwang","zhougong","xuanwang","youwang",
	"mshi","shaogong","guanshu","caishu","chengwang","boqin","baosi","guoshifu",
	"boyang","zhongshanfu","shaogong_hu","qiaofu","kezhan","gugong","taibo",
	"yuzhong","guowengong",
	// 春秋篇（44人·确认完结，yaoli/chuzhuangwang/chuchengwang/chupingwang/caomo/liuxiahui/gongsunchujiu/chengying/zichan/songxianggong 已在功能一模块重制为新CG风格）
	"goujian","fanli","wenzhong","fengtong","chonger","lij","xianggong","huyan",
	"zhaocui","jietui","qinmu","wuzixu","feiwuji","wushe","zhuanzhu","gongziguang",
	"bopi","fuchai","qihuan","guanzhong","baoshu","gongzijiu","shudiao","yiya",
	"kaifang","baili","jianshu","mengming","youyu","sunwu","wushang","gongsunxiong",
	"yaoli","chuzhuangwang","chuchengwang","chupingwang","caomo","liuxiahui","gongsunchujiu","chengying",
	"zichan","songxianggong",
	// 战国篇（40人·确认完结，shenshizu 已在功能一模块重制为新CG风格；sigongzi仍为旧风格封禁）
	"shangyang","yingqvliang","gongziqian","zhaoliang","suqin","suyiqin","susao",
	"zhangyi","huaiwang","fanju","xujia","weiqi","wangji","caize","baiqi",
	"qinzhaowang","linxiangru","lianpo","zhaohuiwen","mouxian","quyuan",
	"shangguan_dafu","yufu","yueyi","yanzhaowang","yanhuiwang","qijie","tiandan",
	"mengchangjun","pingyuanjun","xinlingjun","chunshenjun","fengxuan","maosui",
	"houying","zhuhai","liyuan","zhuying","shenshizu",
	// 秦朝篇（19人·确认完结）
	"qshihuang","lisi","jingke","lvbuwei","mengtian","zhaoji","laoai","fusu",
	"huhai","zhaogao","taizidan","fanwuqi","gaojianli","huayangfuren","zichu",
	"wangjian","xufu","mengyi","jin_hui_gong",
	// 汉初篇（18人·确认完结）
	"lvhou","zhoubo","chenping","hanwen_di","qiji","hui_di","zhoulu","tiying",
	"hanjing_di","chaocuo","zhouyafu","yuanang","liubi","liangwang","wangling",
	"songchang","gonggaohou","zhangwu",
	// 汉武篇（16人·确认完结）
	"hanwudi","liguang","weiqing","huoqibing","zhangqian","zhufuyan","dongzhongshu",
	"weizifu","liju","jiangchong","gongsunhong","hunye","dayuezhi","gongsunqing",
	"tangyifu","sanghongyang",
	// 诸子篇（18人·确认完结）
	"kongzi","laozi","zhuangzi","mengzi","xunzi","hanfei","mozhai","zouyan",
	"huizi","zilu","yanhui","qixuanwang","lihui","chuxuanwang","qinwang",
	"gongshuban","songwang","jihuanzi",
	// 群像篇（6人·确认完结）
	"guojie","zhuke","wuliao","jumeng","niezheng","yurang",
	// 楚汉篇补遗（17人·确认完结）
	"chensheng","wuguang","xiangliang","songyi","jixin","baishe","huangshigong",
	"hancheng","zhanger","chenyu","zhuangjia","pengyue","luanbu","yingbu",
	"suihe","xuegong","huzhe",
	// base.ts补遗（17人·确认完结）
	"zhuanxu","xiang","xihe","nvying","siyue","xie","shangjun","youhu",
	"guanlongpang","xizhong","limu","fangqi","boyi","long","chui","kuaitong",
	"piaomu",
	// NPC补遗（13人·确认完结）
	"balingwei","chushi","guren","jinanguo","nei_shiguan","tingwei","tonggeng",
	"tuzhong","wudi_taizi","xiliu_junshi","xizhong_ri","yuli",
	// 远程API补充（已确认新CG风格：黑神话悟空风格厚涂CG，旧动漫立绘已剔除）
	"shuqi","xishi","tuangujia","yanying","zhaodun-cq","helu","luban","zigong",
	"zengzi","gongsunlong","wuqi","tangju","sunbin","songyu","pangjuan","huishi",
	"likui-zg","chuliji","ganluo","ganmao","tianguang","shenbuhai","qinwuyang",
	"bianque","yuqing","simarangju",
]);

/**
 * 图鉴锁定角色。
 * 仅锁定已确认新CG风格（厚涂/黑神话悟空风格）的角色；
 * 旧风格动漫立绘（pangeng/fuhao/meixi/yaoli/春秋三王/刺客等）不再锁定，避免错误保护。
 */
export const ARCHIVE_PORTRAIT_LOCKED_IDS = new Set<string>([
	"sigongzi",
	"gongsunlong",
	"pangjuan",
	"bianque",
	"likui-zg",
	"chuliji",
	"ganluo",
	"ganmao",
	"simarangju",
	"wuqi",
]);

/**
 * 获取图鉴CG立绘路径。
 * @returns CG立绘URL，或 null（未生成时由调用方 fallback 到剧情立绘）
 */
export function getArchiveCGUrl(id: string): string | null {
	if (ARCHIVE_CG_READY.has(id)) {
		return assetUrl(`/assets/archive-figures/${id}/full-default.jpg?v=pr-head-be0c017-1786152251-all3`);
	}
	return null;
}

/** 判断该角色图鉴是否已锁定，供后续素材脚本或维护逻辑避让。 */
export function isArchivePortraitLocked(id: string): boolean {
	return ARCHIVE_PORTRAIT_LOCKED_IDS.has(id);
}

/** 获取所有已生成CG立绘的角色ID */
export function getArchiveCGIds(): string[] {
	return Array.from(ARCHIVE_CG_READY);
}
