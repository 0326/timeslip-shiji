/**
 * 对决模式数据层：对决角色、宿敌配对、段位规则、对战记录。
 * 立绘直接使用角色图鉴 CG，不修改任何图鉴资源。
 * 所有角色严格过滤：仅包含已生成图鉴 CG 的角色。
 */
import { getArchiveCGUrl } from "./sceneAssets/archivePortraits";

/* ═════════════════════ 类型 ═════════════════════ */

export type DuelRank = "shuren" | "moushi" | "jiangjun" | "zhuhou" | "bawang" | "tianzi";

export const DUEL_RANK_LABELS: Record<DuelRank, string> = {
  shuren: "庶人", moushi: "谋士", jiangjun: "将军", zhuhou: "诸侯", bawang: "霸王", tianzi: "天子",
};

export const DUEL_RANK_THRESHOLDS: { rank: DuelRank; wins: number }[] = [
  { rank: "shuren", wins: 0 }, { rank: "moushi", wins: 3 }, { rank: "jiangjun", wins: 8 },
  { rank: "zhuhou", wins: 16 }, { rank: "bawang", wins: 28 }, { rank: "tianzi", wins: 45 },
];

export type DuelGameId = string;

export interface DuelGameDef {
  id: string; name: string; desc: string; type: string; difficulty: 1 | 2 | 3;
}

export const DUEL_GAMES: DuelGameDef[] = [
  { id: "match3",    name: "涿鹿珠阵",   desc: "连缀同色玉珠破阵，效黄帝破蚩尤大雾", type: "三消", difficulty: 2 },
  { id: "arrow",     name: "箭雨齐射",   desc: "同色敌兵相撞自溃，连珠箭落万军辟易", type: "消除", difficulty: 2 },
  { id: "channel",   name: "治水疏渠",   desc: "旋转渠管引洪归流，如大禹改堵为疏",   type: "管道", difficulty: 2 },
  { id: "astro",     name: "星象授时",   desc: "观星宿配节气，效帝尧敬授民时",        type: "记忆", difficulty: 2 },
  { id: "point",     name: "点兵升将",   desc: "同阶兵卒合为上将，兵→什长→千户→上将", type: "合成", difficulty: 2 },
  { id: "ding",      name: "铸鼎定鼎",   desc: "拼合散碎鼎片，重铸禹王九鼎",           type: "拼图", difficulty: 2 },
  { id: "card",      name: "竹简牌局",   desc: "天·地·人·马 牌九博弈，大者胜",         type: "卡牌", difficulty: 2 },
  { id: "forge",     name: "铁匠锻兵",   desc: "铜锡合炼青铜，铁炭合淬精钢，时辰到须成器", type: "合成", difficulty: 2 },
  { id: "beacon",    name: "烽火传信",   desc: "骊山台上狼烟起，精准击键燃烽火",      type: "节奏", difficulty: 2 },
  { id: "formation", name: "排兵布阵",   desc: "孙武练兵斩姬明军令，排布指令布阵成军", type: "策略", difficulty: 2 },
  { id: "unify",     name: "统一文字",   desc: "秦并天下书同文，六国异体尽归小篆",    type: "匹配", difficulty: 1 },
  { id: "quyuan",    name: "屈原问天",   desc: "遂古之初谁传道之？选词填空续天问",    type: "填词", difficulty: 1 },
  { id: "logistics", name: "粮草调度",   desc: "三军未动粮草先行，分粮械兵于三线",    type: "策略", difficulty: 3 },
  { id: "zongheng",  name: "连横破纵",   desc: "齐楚燕赵纵横之局，苏秦张仪以牌会之",  type: "卡牌", difficulty: 3 },
  { id: "zhuhou",    name: "诸侯争霸",   desc: "落子夹击翻敌之城邑，天下终定于一",    type: "棋盘", difficulty: 3 },
  { id: "linxiangru",name: "完璧归赵",   desc: "蔺相如怀璧潜出秦廷，避秦兵间道归赵",  type: "潜行", difficulty: 3 },
  { id: "bamboo",    name: "竹简缀合",   desc: "竹简散乱简牍失次，依原文缀合复原",    type: "排序", difficulty: 2 },
  { id: "klotski_hongmen", name: "鸿门脱险", desc: "鸿门宴上项庄舞剑，趁隙滑出重围",  type: "滑块", difficulty: 2 },
];

export const DUEL_GAME_MAP: Record<string, DuelGameDef> = Object.fromEntries(DUEL_GAMES.map(g => [g.id, g]));
export const DUEL_GAME_IDS = DUEL_GAMES.map(g => g.id);

export interface DuelCharacter {
  id: string; name: string; era: string; portraitUrl: string; availableGames: string[]; rewardKnowledgeId: string;
}

export interface DuelRecord {
  playerId: string; opponentId: string; games: string[]; results: ("win"|"lose"|"draw")[]; finalResult: "win"|"lose"; date: number;
}

/* ═════════════════════ 中文名+时代映射（所有有 CG 的角色） ═════════════════════ */

const NAMES: Record<string,string> = {
  // 楚汉
  xiangyu:"项羽",liubang:"刘邦",hanxin:"韩信",zhangliang:"张良",
  fanzeng:"范增",xiaohe:"萧何",fankuai:"樊哙",chenping:"陈平",pengyue:"彭越",yuji:"虞姬",
  yingbu:"英布",luanbu:"栾布",jixin:"纪信",xiangliang:"项梁",chensheng:"陈胜",wuguang:"吴广",
  songyi:"宋义",huangshigong:"黄石公",baishe:"白蛇",zhanger:"张耳",chenyu:"陈馀",xuegong:"薛公",
  // 战国
  suqin:"苏秦",zhangyi:"张仪",linxiangru:"蔺相如",lianpo:"廉颇",baiqi:"白起",
  sunbin:"孙膑",shangyang:"商鞅",quyuan:"屈原",limu:"李牧",yueyi:"乐毅",
  tiandan:"田单",chunshenjun:"春申君",mengchangjun:"孟尝君",pingyuanjun:"平原君",xinlingjun:"信陵君",
  fengxuan:"冯谖",maosui:"毛遂",houying:"侯嬴",zhuhai:"朱亥",fanju:"范雎",
  qijie:"骑劫",simarangju:"司马穰苴",chuliji:"樗里疾",ganluo:"甘罗",ganmao:"甘茂",
  pangjuan:"庞涓",songyu:"宋玉",gongsunlong:"公孙龙",wuqi:"吴起",yuqing:"虞卿",
  likui_zg:"李悝",zhuying:"诸婴",shenbuhai:"申不害",
  // 秦
  qshihuang:"秦始皇",jingke:"荆轲",lisi:"李斯",zhaogao:"赵高",
  mengtian:"蒙恬",wangjian:"王翦",lvbuwei:"吕不韦",fusu:"扶苏",huhai:"胡亥",
  taizidan:"太子丹",fanwuqi:"樊於期",gaojianli:"高渐离",huayangfuren:"华阳夫人",
  mengyi:"蒙毅",qinwuyang:"秦舞阳",
  // 春秋
  guanzhong:"管仲",chonger:"重耳",wuzixu:"伍子胥",goujian:"勾践",fuchai:"夫差",
  fanli:"范蠡",xishi:"西施",wenzhong:"文种",baoshu:"鲍叔牙",jietui:"介子推",
  qinmu:"秦穆公",sunwu:"孙武",helu:"阖闾",bopi:"伯嚭",feiwuji:"费无忌",
  wushe:"伍奢",zhuanzhu:"专诸",yaoli:"要离",yurang:"豫让",luban:"鲁班",
  yanying:"晏婴",liuxiahui:"柳下惠",songxianggong:"宋襄公",caomo:"曹沫",
  gongsunchujiu:"公孙杵臼",chengying:"程婴",zichan:"子产",chuzhuangwang:"楚庄王",
  chupingwang:"楚平王",chuchengwang:"楚成王",qihuan:"齐桓公",
  // 诸子
  kongzi:"孔子",laozi:"老子",mozhai:"墨子",hanfei:"韩非",
  mengzi:"孟子",zhuangzi:"庄子",xunzi:"荀子",huizi:"惠子",zouyan:"邹衍",
  // 汉武
  hanwudi:"汉武帝",weiqing:"卫青",huoqibing:"霍去病",liguang:"李广",zhangqian:"张骞",
  weizifu:"卫子夫",dongzhongshu:"董仲舒",zhufuyan:"主父偃",gongsunhong:"公孙弘",
  liju:"刘据",jiangchong:"江充",sanghongyang:"桑弘羊",chaocuo:"晁错",
  // 夏商周
  yu:"禹",tang:"汤",jie:"桀",gun:"鲧",zhou:"纣",wuwang:"武王",jiangshang:"姜尚",
  youwang:"周幽王",baosi:"褒姒",wenwang:"周文王",zhougong:"周公",
  yiyin:"伊尹",bigan:"比干",daji:"妲己",taijia:"太甲",wuding:"武丁",
  fushuo:"傅说",weizi:"微子",jizi:"箕子",jiuhou:"九侯",ehou:"鄂侯",
  fengtong:"逢同",shenshizu:"申氏子",songchang:"宋昌",zhoubo:"周勃",lvhou:"吕后",
  hanwen_di:"汉文帝",hanjing_di:"汉景帝",
  // 上古
  huangdi:"黄帝",chiyou:"蚩尤",yandi:"炎帝",shun:"舜",yao:"尧",
  gonggong:"共工",leizu:"嫘祖",danzhu:"丹朱",cangjie:"仓颉",fenghou:"风后",
  dahong:"大鸿",kui:"夔",houji:"后稷",gaoyao:"皋陶",ehuang:"娥皇",
  nvying:"女英",changxian:"常先",boyi:"伯夷",shuqi:"叔齐",diku:"帝喾",
  zhuanxu:"颛顼",
  // 群英/其他
  niezheng:"聂政",jumeng:"剧孟",zhuke:"朱家",guojie:"郭解",
  yuli:"狱吏",bianque:"扁鹊",meixi:"妹喜",fuhao:"妇好",pangeng:"盘庚",
  meixi:"妺喜",tuangujia:"团古甲",sigongzi:"嗣公子",
};

const ERAS: Record<string,string> = {
  xiangyu:"楚汉",liubang:"楚汉",hanxin:"楚汉",zhangliang:"楚汉",
  fanzeng:"楚汉",xiaohe:"楚汉",fankuai:"楚汉",chenping:"楚汉",pengyue:"楚汉",yuji:"楚汉",
  yingbu:"楚汉",luanbu:"楚汉",jixin:"楚汉",xiangliang:"楚汉",chensheng:"楚汉",wuguang:"楚汉",
  songyi:"楚汉",huangshigong:"楚汉",baishe:"楚汉",zhanger:"楚汉",chenyu:"楚汉",xuegong:"楚汉",
  suqin:"战国",zhangyi:"战国",linxiangru:"战国",lianpo:"战国",baiqi:"战国",
  sunbin:"战国",shangyang:"战国",quyuan:"战国",limu:"战国",yueyi:"战国",
  tiandan:"战国",chunshenjun:"战国",mengchangjun:"战国",pingyuanjun:"战国",xinlingjun:"战国",
  fengxuan:"战国",maosui:"战国",houying:"战国",zhuhai:"战国",fanju:"战国",
  qijie:"战国",simarangju:"战国",chuliji:"战国",ganluo:"战国",ganmao:"战国",
  pangjuan:"战国",songyu:"战国",gongsunlong:"战国",wuqi:"战国",yuqing:"战国",
  likui_zg:"战国",zhuying:"战国",shenbuhai:"战国",
  qshihuang:"秦",jingke:"秦",lisi:"秦",zhaogao:"秦",
  mengtian:"秦",wangjian:"秦",lvbuwei:"秦",fusu:"秦",huhai:"秦",
  taizidan:"秦",fanwuqi:"秦",gaojianli:"秦",huayangfuren:"秦",mengyi:"秦",qinwuyang:"秦",
  guanzhong:"春秋",chonger:"春秋",wuzixu:"春秋",goujian:"春秋",fuchai:"春秋",
  fanli:"春秋",xishi:"春秋",wenzhong:"春秋",baoshu:"春秋",jietui:"春秋",
  qinmu:"春秋",sunwu:"春秋",helu:"春秋",bopi:"春秋",feiwuji:"春秋",
  wushe:"春秋",zhuanzhu:"春秋",yaoli:"春秋",yurang:"春秋",luban:"春秋",
  yanying:"春秋",liuxiahui:"春秋",songxianggong:"春秋",caomo:"春秋",
  gongsunchujiu:"春秋",chengying:"春秋",zichan:"春秋",chuzhuangwang:"春秋",
  chupingwang:"春秋",chuchengwang:"春秋",qihuan:"春秋",
  kongzi:"春秋",laozi:"春秋",mozhai:"战国",hanfei:"战国",
  mengzi:"战国",zhuangzi:"战国",xunzi:"战国",huizi:"战国",zouyan:"战国",
  hanwudi:"汉",weiqing:"汉",huoqibing:"汉",liguang:"汉",zhangqian:"汉",
  weizifu:"汉",dongzhongshu:"汉",zhufuyan:"汉",gongsunhong:"汉",
  liju:"汉",jiangchong:"汉",sanghongyang:"汉",chaocuo:"汉",
  yu:"夏",tang:"商",jie:"夏",gun:"上古",zhou:"商",wuwang:"周",jiangshang:"周",
  youwang:"周",baosi:"周",wenwang:"周",zhougong:"周",
  yiyin:"商",bigan:"商",daji:"商",taijia:"商",wuding:"商",
  fushuo:"商",weizi:"商",jizi:"商",jiuhou:"商",ehou:"商",
  fengtong:"春秋",shenshizu:"战国",songchang:"汉",zhoubo:"汉",lvhou:"汉",
  hanwen_di:"汉",hanjing_di:"汉",
  huangdi:"上古",chiyou:"上古",yandi:"上古",shun:"上古",yao:"上古",
  gonggong:"上古",leizu:"上古",danzhu:"上古",cangjie:"上古",fenghou:"上古",
  dahong:"上古",kui:"上古",houji:"上古",gaoyao:"上古",ehuang:"上古",
  nvying:"上古",changxian:"上古",boyi:"上古",shuqi:"上古",diku:"上古",
  zhuanxu:"上古",
  niezheng:"战国",jumeng:"汉",zhuke:"汉",guojie:"汉",
  yuli:"秦",bianque:"春秋",fuhao:"商",pangeng:"商",meixi:"夏",
  tuangujia:"商",sigongzi:"战国",
};

/* ═════════════════════ 宿敌配对（仅包含有 CG 的角色） ═════════════════════ */

const RIVALRIES: Record<string,string[]> = {
  // ── 楚汉 ──
  xiangyu:["liubang","hanxin","zhangliang","pengyue"],
  liubang:["xiangyu","fanzeng"],
  hanxin:["xiangyu"],
  zhangliang:["xiangyu","fanzeng"],
  fanzeng:["zhangliang","chenping","liubang"],
  xiaohe:["fanzeng","hanxin"],
  fankuai:["xiangyu"],
  chenping:["fanzeng","xiangyu"],
  pengyue:["xiangyu"],
  yuji:["liubang"],
  yingbu:["xiangyu","liubang"],
  luanbu:["xiangyu"],
  jixin:["xiangyu"],
  xiangliang:["liubang"],
  chensheng:["qshihuang"],
  zhanger:["chensheng"],
  // ── 战国 ──
  suqin:["zhangyi"],
  zhangyi:["suqin","quyuan"],
  linxiangru:["lianpo"],
  lianpo:["baiqi","wangjian","linxiangru"],
  baiqi:["lianpo"],
  sunbin:["pangjuan"],
  shangyang:["chuliji"],
  quyuan:["zhangyi"],
  limu:["wangjian"],
  yueyi:["tiandan"],
  tiandan:["yueyi"],
  chunshenjun:["qshihuang"],
  mengchangjun:["qshihuang"],
  pingyuanjun:["qshihuang"],
  xinlingjun:["mengchangjun"],
  wuqi:["chuliji"],
  pangjuan:["sunbin"],
  // ── 秦 ──
  qshihuang:["jingke","taizidan","lvbuwei"],
  jingke:["qshihuang"],
  lisi:["zhaogao","hanfei","lvbuwei"],
  zhaogao:["lisi","fusu","mengtian"],
  mengtian:["zhaogao","fusu"],
  wangjian:["lianpo"],
  lvbuwei:["qshihuang","lisi"],
  fusu:["zhaogao","huhai"],
  huhai:["fusu","lisi"],
  taizidan:["qshihuang","jingke"],
  gaojianli:["qshihuang"],
  // ── 春秋 ──
  guanzhong:["baoshu"],
  chonger:["chuchengwang","jietui"],
  wuzixu:["fuchai","bopi","chupingwang","feiwuji"],
  goujian:["fuchai","wuzixu"],
  fuchai:["goujian","wuzixu"],
  fanli:["goujian","wenzhong"],
  xishi:["fuchai"],
  sunwu:["wuzixu","helu"],
  helu:["fuchai"],
  bopi:["wuzixu"],
  feiwuji:["wuzixu"],
  zhuanzhu:["helu"],
  yurang:["chonger"],
  yaoli:["helu"],
  chupingwang:["wuzixu","feiwuji"],
  qihuan:["guanzhong"],
  luban:["mozhai"],
  songxianggong:["chuchengwang"],
  chuzhuangwang:["qihuan"],
  // ── 诸子 ──
  kongzi:["laozi"],
  laozi:["kongzi"],
  mozhai:["luban"],
  hanfei:["lisi","qshihuang"],
  mengzi:["xunzi"],
  zhuangzi:["huizi"],
  xunzi:["mengzi","hanfei"],
  huizi:["zhuangzi"],
  // ── 汉武 ──
  hanwudi:["weizifu"],
  weiqing:["huoqibing"],
  huoqibing:["weiqing"],
  liguang:["weiqing"],
  zhangqian:["hanwudi"],
  dongzhongshu:["hanwudi"],
  zhufuyan:["hanwudi"],
  gongsunhong:["dongzhongshu"],
  chaocuo:["hanjing_di"],
  // ── 商周 ──
  yu:["gun","gonggong"],
  tang:["jie"],
  jie:["tang"],
  gun:["yu","shun"],
  zhou:["wuwang","jiangshang","bigan"],
  wuwang:["zhou"],
  jiangshang:["zhou"],
  youwang:["baosi"],
  baosi:["youwang"],
  wenwang:["zhou"],
  yiyin:["jie"],
  bigan:["zhou"],
  daji:["zhou"],
  taijia:["yiyin"],
  wuding:["fushuo"],
  jizi:["zhou"],
  lvhou:["liubang"],
  zhoubo:["lvhou"],
  hanwen_di:["lvhou"],
  hanjing_di:["chaocuo"],
  // ── 上古 ──
  huangdi:["chiyou","yandi"],
  chiyou:["huangdi"],
  yandi:["huangdi"],
  shun:["gun","yao"],
  yao:["shun","danzhu"],
  gonggong:["huangdi"],
  cangjie:["huangdi"],
  // ── 群英/刺客 ──
  niezheng:["jingke"],
  jumeng:["guojie"],
  zhuke:["guojie"],
  guojie:["jumeng","zhuke"],
  yuli:["hanxin"],
  bianque:["qihuan"],
  pangeng:["tang"],
  fuhao:["wuding"],
  sigongzi:["qshihuang"],
};

/* ═════════════════════ 角色黑名单（远程API补充/风格不一致/用户不认可） ═════════════════════ */

const BLOCKLIST = new Set([
  "yaoli","yurang","niezheng",
  "chuzhuangwang","chuchengwang","chupingwang",
  "caomo","liuxiahui","gongsunchujiu","chengying","zichan",
  "zouyan","sigongzi","tuangujia","meixi","pangeng","fuhao",
  "wushe","qijie","simarangju","chuliji","ganluo","ganmao",
  "gongsunlong","yuqing","zhuying","shenbuhai",
  "bianque","qinwuyang","tianguang","huangshigong","baishe",
  "shenshizu","songchang",
]);

/* ═════════════════════ 构建角色列表 ═════════════════════ */

function buildDuelCharacters(): DuelCharacter[] {
  const allIds = [...new Set([...Object.keys(RIVALRIES), ...Object.values(RIVALRIES).flat()])];

  return allIds
    .filter(id => !BLOCKLIST.has(id))
    .map(id => ({ id, url: getArchiveCGUrl(id) }))
    .filter(({ url }) => url !== null)
    .map(({ id, url }) => ({
      id,
      name: NAMES[id] || id,
      era: ERAS[id] || "未知",
      portraitUrl: url!,
      availableGames: DUEL_GAME_IDS,
      rewardKnowledgeId: `duel_${id}`,
    }));
}

export const DUEL_CHARACTERS = buildDuelCharacters();
export const DUEL_CHARACTER_MAP: Record<string, DuelCharacter> = Object.fromEntries(DUEL_CHARACTERS.map(c => [c.id, c]));
export const DUEL_RIVALRIES = RIVALRIES;

/* ═════════════════════ 存储 ═════════════════════ */

const STORAGE_KEY = "shiji-duel-records";

export function loadDuelRecords(): DuelRecord[] {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
export function saveDuelRecord(record: DuelRecord): void {
  const recs = loadDuelRecords(); recs.push(record);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(recs)); } catch {}
}
export function getDuelWins(): number { return loadDuelRecords().filter(r => r.finalResult === "win").length; }
export function getDuelRank(): DuelRank {
  const w = getDuelWins(); let r: DuelRank = "shuren";
  for (const t of DUEL_RANK_THRESHOLDS) if (w >= t.wins) r = t.rank;
  return r;
}
export function getRivalsFor(playerId: string): DuelCharacter[] {
  const player = DUEL_CHARACTER_MAP[playerId];
  if (!player) return [];

  // 1. 宿敌优先
  const ids = RIVALRIES[playerId] || [];
  const rivals = ids.filter(id => id in DUEL_CHARACTER_MAP).map(id => DUEL_CHARACTER_MAP[id]);
  if (rivals.length > 0) return rivals;

  // 2. 无宿敌 → 同身份对决：同 era 中随机挑 3~5 个（排除自己）
  const sameEra = DUEL_CHARACTERS.filter(
    c => c.id !== playerId && c.era === player.era,
  );
  if (sameEra.length >= 3) return shuffle(sameEra).slice(0, 5);

  // 3. 同身份也不够 → 从全部角色中挑（排除自己）
  return shuffle(DUEL_CHARACTERS.filter(c => c.id !== playerId)).slice(0, 5);
}
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length-1; i>0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
