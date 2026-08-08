import type { Character } from "../types/character";
import { CHARACTER_GAME_META, CHARACTER_IDS } from "./characterGameMeta";
import {
  adaptRelation,
  fetchFigure,
  fetchFigureRelations,
  resolveAvatarUrl,
} from "../services/mainProjectApi";

/**
 * 同步构建基础 Character（仅游戏化字段，不含主项目数据）。
 * 供抽卡、图鉴、Home 等不需要 bio/avatar 的场景使用，保持原有同步调用兼容。
 */
function buildBaseCharacter(metaId: string): Character {
  const m = CHARACTER_GAME_META[metaId];
  return {
    id: m.id,
    name: m.id, // 占位，运行时由主项目覆写；无主项目时用 id
    title: m.title,
    era: m.era,
    accent: m.accent,
    glyph: m.glyph,
    description: "", // 运行时由主项目 bio_summary 填充
    classicalQuote: m.classicalQuote,
    historicalSource: m.historicalSource,
    relatedStorylines: [...m.relatedStorylines],
    relations: m.gameRelations.map((r) => ({ ...r })),
    avatarUrl: null,
    bioSummary: null,
  };
}

// ── 本地兜底名表（主项目不可用时的 fallback） ──
const LOCAL_NAMES: Record<string, string> = {
  // ── 五帝、夏 ──
  huangdi: "黄帝",
  yandi: "炎帝",
  chiyou: "蚩尤",
  zhuanxu: "颛顼",
  diku: "帝喾",
  yao: "帝尧",
  xihe: "羲和",
  danzhu: "丹朱",
  gonggong: "共工",
  gun: "鲧",
  shun: "帝舜",
  ehuang: "娥皇",
  nvying: "女英",
  gaoyao: "皋陶",
  houji: "后稷",
  xie: "契",
  kui: "夔",
  shangjun: "商均",
  yu: "大禹",
  tushan: "涂山氏",
  qi: "夏启",
  yi: "伯益",
  youhu: "有扈氏",
  jie: "夏桀",
  // ── 商 ──
  tang: "成汤",
  gebo: "葛伯",
  yiyin: "伊尹",
  taijia: "太甲",
  wuding: "武丁",
  fushuo: "傅说",
  zuji: "祖己",
  zhongzai: "中宗祖乙",
  zhou: "商纣王",
  daji: "妲己",
  bigan: "比干",
  jizi: "箕子",
  weizi: "微子",
  xibo: "西伯(周文王)",
  jiuhou: "九侯",
  ehou: "鄂侯",
  wangshang: "商容",
  // ── 西周 ──
  jiangshang: "姜太公(姜子牙)",
  wenwang: "周文王",
  chonghou: "崇侯虎",
  mshi: "马氏(姜尚之妻)",
  wuwang: "周武王",
  zhougong: "周公旦",
  chengwang: "周成王",
  shaogong: "召公奭",
  guanshu: "管叔",
  caishu: "蔡叔",
  boqin: "伯禽",
  xuanwang: "周宣王",
  boyang: "伯阳父",
  zhongshanfu: "仲山甫",
  shaogong_hu: "召公虎",
  youwang: "周幽王",
  baosi: "褒姒",
  guoshifu: "虢石父",
  taibo: "太伯(吴太伯)",
  gugong: "古公亶父",
  yuzhong: "虞仲",
  jili: "季历",
  qingyue: "青月",
  zhengzhuang: "郑庄公",
  // ── 春秋 ──
  goujian: "越王勾践",
  fanli: "范蠡",
  wenzhong: "文种",
  fengtong: "逢同",
  xishi: "西施",
  chonger: "晋文公(重耳)",
  huyan: "狐偃",
  zhaocui: "赵衰",
  jiezitui: "介子推",
  qinmu: "秦穆公",
  chuchengwang: "楚成王",
  lij: "里克",
  xianggong: "晋襄公",
  wuzixu: "伍子胥",
  wushe: "伍奢",
  chupingwang: "楚平王",
  feiwuji: "费无忌",
  gongziguang: "吴王阖闾(公子光)",
  bopi: "伯嚭",
  fuchai: "吴王夫差",
  qihuan: "齐桓公",
  guanzhong: "管仲",
  baoshu: "鲍叔牙",
  baochuya: "鲍叔牙",
  gongzijiu: "公子纠",
  shudiao: "竖刁",
  yiya: "易牙",
  kaifang: "开方",
  baili: "百里奚",
  bailixi: "百里奚",
  jianshu: "蹇叔",
  mengming: "孟明视",
  youyu: "由余",
  chuzy: "楚庄王",
  sunshu: "孙叔敖",
  sunwu: "孙武(孙子)",
  wuqi: "吴起",
  // ── 战国 ──
  shangyang: "商鞅(公孙鞅)",
  yingqvliang: "秦孝公(嬴渠梁)",
  gongziqian: "公子虔",
  zhaoliang: "赵良",
  pangjuan: "庞涓",
  sunbin: "孙膑",
  suqin: "苏秦",
  zhangyi: "张仪",
  huaiwang: "楚怀王",
  fanju: "范雎",
  xujia: "须贾",
  wangji: "王稽",
  caize: "蔡泽",
  linxiangru: "蔺相如",
  lianpo: "廉颇",
  zhaohuiwen: "赵惠文王",
  mouxian: "缪贤",
  baiqi: "白起",
  wangjian: "王翦",
  lijiyi: "李信",
  quyuan: "屈原",
  yueyi: "乐毅",
  yanzhaowang: "燕昭王",
  yanhuiwang: "燕惠王",
  tiandan: "田单",
  qijie: "骑劫",
  mengchangjun: "孟尝君",
  pingyuanjun: "平原君",
  xinlingjun: "信陵君",
  chunshenjun: "春申君",
  tianheng: "田横",
  // ── 诸子百家 ──
  kongzi: "孔子(孔丘)",
  laozi: "老子(李耳)",
  zilu: "子路(仲由)",
  yanhui: "颜回",
  jihuanzi: "季桓子",
  mengzi: "孟子(孟轲)",
  lihui: "梁惠王(魏惠王)",
  xunzi: "荀子",
  zhuangzi: "庄子(庄周)",
  chuxuanwang: "楚宣王",
  hanfei: "韩非子",
  qinwang: "秦王嬴政",
  zouyan: "邹衍",
  mozhai: "墨子(墨翟)",
  gongshuban: "公输班(鲁班)",
  songwang: "宋王",
  // ── 秦 ──
  qshihuang: "秦始皇(嬴政)",
  qinshihuang: "秦始皇(嬴政)",
  laoai: "嫪毐",
  zhaoji: "赵姬",
  fusu: "扶苏",
  zhaogao: "赵高",
  huhai: "胡亥",
  zichu: "子楚(秦庄襄王)",
  huayangfuren: "华阳夫人",
  lvbuwei: "吕不韦",
  lisi: "李斯",
  mengtian: "蒙恬",
  mengyi: "蒙毅",
  taizidan: "燕太子丹",
  yandan: "燕太子丹",
  fanwuqi: "樊於期",
  fanchuo: "樊於期",
  gaojianli: "高渐离",
  gaolianli: "高渐离",
  wuyang: "秦舞阳",
  qinwuyang: "秦舞阳",
  jin_hui_gong: "晋惠公",
  // ── 楚汉相争 ──
  xiangliang: "项梁",
  songyi: "宋义",
  jixin: "纪信",
  baishe: "白蛇(白帝子)",
  kuaitong: "蒯通",
  piaomu: "漂母",
  huangshigong: "黄石公",
  hancheng: "韩王成",
  chensheng: "陈胜",
  wuguang: "吴广",
  zhanger: "张耳",
  chenyu: "陈馀",
  zhuangjia: "庄贾",
  pengyue: "彭越",
  luanbu: "栾布",
  yingbu: "英布",
  suihe: "随何",
  xuegong: "薛公",
  // ── 原有 ──
  hanxin: "韩信",
  xiangyu: "项羽(西楚霸王)",
  zhangliang: "张良",
  liubang: "刘邦(汉高祖)",
  xiaohe: "萧何",
  fanzeng: "范增",
  fankuai: "樊哙",
  yuji: "虞姬",
  // ── 汉初 ──
  lvhou: "吕后(吕雉)",
  qiji: "戚夫人",
  hui_di: "汉惠帝(刘盈)",
  zhoulu: "周吕侯(吕泽)",
  chenping: "陈平",
  hanwen: "汉文帝(刘恒)",
  hanwen_di: "汉文帝(刘恒)",
  tiying: "缇萦",
  zhoubo: "周勃",
  songchang: "宋昌",
  zhouyafu: "周亚夫",
  yuli: "狱吏",
  chaocuo: "晁错",
  hanjing_di: "汉景帝(刘启)",
  yuanang: "袁盎",
  liubi: "刘濞(吴王)",
  simaxiangru: "司马相如",
  // ── 汉武盛世 ──
  hanwudi: "汉武帝(刘彻)",
  dongzhongshu: "董仲舒",
  weizifu: "卫子夫",
  liu_ju: "刘据(卫太子)",
  jiangchong: "江充",
  liguang: "李广",
  balingwei: "霸陵尉",
  weiqing: "卫青",
  huoqibing: "霍去病",
  zhangqian: "张骞",
  dayuezhi: "大月氏王",
  hunye: "浑邪王",
  zhufuyan: "主父偃",
  gongsunhong: "公孙弘",
  simaqian: "司马迁",
  // ── 豪侠刺客（群英传）──
  guojie: "郭解",
  zhuke: "朱家",
  zhuanzhu: "专诸",
  yurang: "豫让",
  niezheng: "聂政",
  jingke: "荆轲",
  jumeng: "剧孟",
  jibu: "季布",
  zhaorangzi: "赵襄子",
  zhibo: "智伯",
  yanzhongzi: "严仲子",
  nierong: "聂荣",
};

// ── 本地兜底简介（主项目不可用时的 fallback） ──
const LOCAL_DESC: Record<string, string> = {
  hanxin:
    "出身寒微，曾受胯下之辱、寄食漂母。择主而事，由萧何月下追回，登坛拜将。背水一战、暗度陈仓、十面埋伏，连百万之军战必胜攻必取，被誉为兵仙。功高震主，终死于钟室。",
  xiangyu:
    "楚国名将之后，力能扛鼎，才气过人。巨鹿破釜沉舟，大破秦军；鸿门宴优柔不杀刘邦。分封诸侯自立西楚霸王，然刚愎自用，终败垓下，自刎乌江。",
  zhangliang:
    "韩国贵族之后，博浪沙刺秦未遂。圯上受书于黄石公，运筹帷幄之中，决胜千里之外。鸿门宴中周旋救主，下邑画策，功成身退，从赤松子游。",
  liubang:
    "起于泗水亭长，豁达大度，知人善任。约法三章入关中，鸿门宴中卑辞脱身。终用三杰之力，垓下灭楚，开汉四百年基业。",
  xiaohe:
    "沛县主吏掾，识刘邦于微时。入关收秦图籍，明天下要害。月下追韩信，荐为大将；镇守关中，转漕给军，汉之所以得天下，萧何之功最盛。",
  fanzeng:
    "年七十，好奇计。事项羽尊为亚父。鸿门宴上数目项王、举玉玦三示之，欲杀刘邦不得。后中陈平反间，愤而去，疽发背而死。",
  fankuai:
    "以屠狗为业，从刘邦起沛。鸿门宴危急，带剑拥盾撞入军门，瞋目视项王，头发上指，立饮斗酒、生啖彘肩，护沛公脱险。勇冠三军。",
  yuji: "常幸从项羽。垓下被围，四面楚歌，项羽悲歌慷慨，虞姬和之。霸王别姬，遂以身殉，留千古绝唱。",
};

/**
 * 同步角色表：用本地兜底数据填充 name/description。
 * 兼容现有 getCharacter/CHARACTERS/CHARACTER_MAP 同步调用。
 * 主项目数据需通过 getCharacterMerged 异步获取。
 */
export const CHARACTERS: Character[] = CHARACTER_IDS.map((id) => {
  const c = buildBaseCharacter(id);
  c.name = LOCAL_NAMES[id] || id;
  c.description = LOCAL_DESC[id] || "";
  return c;
});

export const CHARACTER_MAP: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
);

export function getCharacter(id: string): Character | undefined {
  return CHARACTER_MAP[id];
}

/**
 * 异步获取合并后的角色（游戏化字段 + 主项目权威数据）。
 * 主项目不可用时降级为本地兜底。
 *
 * @param id 角色 ID（与主项目 figures.id 对齐）
 * @param mergeRelations 是否用主项目关系网覆写 gameRelations（默认 true）
 */
export async function getCharacterMerged(
  id: string,
  mergeRelations = true,
): Promise<Character | undefined> {
  const base = getCharacter(id);
  if (!base) return undefined;

  // 并发拉主项目数据
  const [figure, remoteRelations] = await Promise.all([
    fetchFigure(id),
    mergeRelations ? fetchFigureRelations(id) : null,
  ]);

  // 合并主项目字段
  if (figure) {
    base.name = figure.name;
    base.bioSummary = figure.bio_summary || null;
    // description 优先用主项目 bio_summary，否则保留本地
    if (figure.bio_summary) {
      base.description = figure.bio_summary;
    }
    base.avatarUrl = resolveAvatarUrl(figure);
  }

  // 合并关系：主项目有数据则覆写，否则保留 gameRelations
  if (remoteRelations && remoteRelations.length > 0) {
    base.relations = remoteRelations.map(adaptRelation);
  }

  return base;
}

/**
 * 批量异步合并（用于图鉴等需要全量角色 + 主项目数据的场景）
 */
export async function getAllCharactersMerged(
  mergeRelations = false,
): Promise<Character[]> {
  const list = await Promise.all(
    CHARACTER_IDS.map((id) => getCharacterMerged(id, mergeRelations)),
  );
  return list.filter((c): c is Character => c != null);
}
