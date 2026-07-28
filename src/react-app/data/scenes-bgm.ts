import type { Mood } from "./bgm-keywords";

export interface SceneBgmHint {
	sceneId: string;
	defaultMood: Mood;
	keywords?: string[];
	altMoods?: { mood: Mood; trigger: string }[];
	/** 手动指定该场景默认情绪的具体曲目ID（如 "battle_01"）。未指定则自动确定性选择 */
	trackId?: string;
	/** 手动指定替代情绪的具体曲目ID，与 altMoods 一一对应 */
	altTrackIds?: { mood: Mood; trackId: string }[];
}

export const SCENE_BGM: SceneBgmHint[] = [
	{ sceneId: "default", defaultMood: "solemn" },
	{ sceneId: "xuanyuan_qiu", defaultMood: "peaceful", keywords: ["轩辕", "丘"] },
	{ sceneId: "zhuhou_luan", defaultMood: "danger", keywords: ["诸侯", "侵伐"], altMoods: [{ mood: "sorrow", trigger: "民" }] },
	{ sceneId: "banquan_ye", defaultMood: "tension", keywords: ["阪泉", "对峙"], altMoods: [{ mood: "march", trigger: "战" }, { mood: "triumph", trigger: "俯首" }] },
	{ sceneId: "huangdi_court", defaultMood: "court", keywords: ["朝堂", "明堂"] },
	{ sceneId: "zhuolu_field", defaultMood: "battle", trackId: "battle_01", keywords: ["涿鹿", "蚩尤"], altMoods: [{ mood: "tension", trigger: "雾" }, { mood: "triumph", trigger: "擒杀" }, { mood: "tragic", trigger: "屠" }], altTrackIds: [{ mood: "tension", trackId: "tension_02" }, { mood: "triumph", trackId: "triumph_02" }, { mood: "tragic", trackId: "tragic_03" }] },
	{ sceneId: "zhuolu_fog", defaultMood: "tension", trackId: "tension_02", keywords: ["涿鹿", "大雾"] },
	{ sceneId: "xuanyuan_court", defaultMood: "court", keywords: ["轩辕", "庭"] },
	{ sceneId: "taishan_peak", defaultMood: "epic", keywords: ["泰山", "巅"] },
	{ sceneId: "gaoyang_court", defaultMood: "court", keywords: ["高阳", "受命"] },
	{ sceneId: "gaoyang_field", defaultMood: "peaceful", keywords: ["高阳", "田野"] },
	{ sceneId: "xingye_night", defaultMood: "mystery", keywords: ["星夜", "承天"] },
	{ sceneId: "gaoxin_court", defaultMood: "court", keywords: ["高辛", "执中"] },
	{ sceneId: "yao_court", defaultMood: "court", keywords: ["尧", "明堂"] },
	{ sceneId: "yanggu_sun", defaultMood: "epic", keywords: ["旸谷", "宾日"] },
	{ sceneId: "winter_dark", defaultMood: "dark", keywords: ["幽都", "长夜"] },
	{ sceneId: "flood_sky", defaultMood: "danger", keywords: ["洪水", "滔天"], altMoods: [{ mood: "sorrow", trigger: "九年" }] },
	{ sceneId: "great_forest", defaultMood: "mystery", keywords: ["大麓", "雷雨"] },
	{ sceneId: "nanhe", defaultMood: "peaceful", keywords: ["南河", "让辟"] },
	{ sceneId: "gui_river", defaultMood: "peaceful", keywords: ["妫水", "琴"] },
	{ sceneId: "lishan_farm", defaultMood: "peaceful", keywords: ["历山", "农"], altMoods: [{ mood: "epic", trigger: "治水" }, { mood: "melancholy", trigger: "不敢入" }] },
	{ sceneId: "granary_exterior", defaultMood: "peaceful", keywords: ["粮仓", "外景"] },
	{ sceneId: "granary_fire", defaultMood: "danger", keywords: ["火", "焚"], altMoods: [{ mood: "triumph", trigger: "跳下" }] },
	{ sceneId: "well_yard", defaultMood: "sad", keywords: ["井", "担忧"] },
	{ sceneId: "well_dark", defaultMood: "tragic", keywords: ["井", "埋"] },
	{ sceneId: "shun_house", defaultMood: "court", keywords: ["舜宫", "归来"] },
	{ sceneId: "shun_hall", defaultMood: "court", trackId: "court_03", keywords: ["舜堂", "皋陶"] },
	{ sceneId: "simen_court", defaultMood: "court", keywords: ["四门", "辟贤"] },
	{ sceneId: "siyi_liufang", defaultMood: "danger", keywords: ["四裔", "流放"] },
	{ sceneId: "mingtang_xing", defaultMood: "epic", keywords: ["明堂", "巡"] },
	{ sceneId: "wenzu_temple", defaultMood: "solemn", keywords: ["文祖", "组阁"] },
	{ sceneId: "zuge_court", defaultMood: "court", keywords: ["虞庭", "授职"] },
	{ sceneId: "yuewu_court", defaultMood: "cheerful", keywords: ["典乐", "百兽"] },
	{ sceneId: "disorder_court", defaultMood: "danger", keywords: ["庶事", "隳坏"] },
	{ sceneId: "yushun_court", defaultMood: "court", keywords: ["有虞", "帝庭"] },
	{ sceneId: "cangwu_ye", defaultMood: "melancholy", keywords: ["苍梧", "野"] },
	{ sceneId: "jiuyi_shan", defaultMood: "solemn", keywords: ["九疑", "山陵"] },
	{ sceneId: "xiang_bamboo", defaultMood: "sad", keywords: ["斑竹", "湘", "泣"] },
	{ sceneId: "xia_court", defaultMood: "court", keywords: ["夏后", "受禅"] },
	{ sceneId: "xia_court_cold", defaultMood: "dark", keywords: ["夏庭", "政隳"] },
	{ sceneId: "yangcheng", defaultMood: "peaceful", keywords: ["阳城", "让辟"] },
	{ sceneId: "xia_terrace", defaultMood: "court", keywords: ["夏", "台"], altMoods: [{ mood: "triumph", trigger: "涂山" }, { mood: "sorrow", trigger: "酒池" }] },
	{ sceneId: "tang_realm", defaultMood: "peaceful", keywords: ["商汤", "修德"] },
	{ sceneId: "mingtiao_war", defaultMood: "battle", keywords: ["鸣条", "战"] },
	{ sceneId: "nanchao_exile", defaultMood: "death", trackId: "death_01", keywords: ["南巢", "放"] },
	{ sceneId: "tent_night", defaultMood: "tension", trackId: "tension_01", keywords: ["鸿门", "夜"] },
	{ sceneId: "tent_feast", defaultMood: "court", trackId: "court_02", keywords: ["鸿门", "帐宴"] },
	{ sceneId: "huaiyin_street", defaultMood: "peaceful", keywords: ["淮阴", "市井"] },
	{ sceneId: "riverside", defaultMood: "peaceful", keywords: ["河畔"] },
	{ sceneId: "camp_chu", defaultMood: "march", keywords: ["西楚", "军营"] },
	{ sceneId: "camp_han_night", defaultMood: "tension", keywords: ["汉中", "夜营"] },
	{ sceneId: "plank_road", defaultMood: "tension", keywords: ["栈道", "陈仓"] },
	{ sceneId: "jingxing", defaultMood: "battle", keywords: ["井陉", "背水"] },
	{ sceneId: "gaixia", defaultMood: "battle", keywords: ["垓下", "围城"] },
	{ sceneId: "han_palace", defaultMood: "court", keywords: ["长乐", "钟室"] },
	{ sceneId: "palace", defaultMood: "court", keywords: ["登坛", "拜将"] },
	{ sceneId: "bo_capital", defaultMood: "court", keywords: ["亳都", "立国"] },
	{ sceneId: "youshen_ye", defaultMood: "peaceful", keywords: ["有莘", "负鼎"] },
	{ sceneId: "zhangwang_ye", defaultMood: "peaceful", keywords: ["郊野", "网开"] },
	{ sceneId: "tangshi_ye", defaultMood: "march", keywords: ["誓师", "吊民"] },
	{ sceneId: "tang_court", defaultMood: "court", keywords: ["商汤", "践位"] },
	{ sceneId: "tong_gong", defaultMood: "dark", keywords: ["桐宫", "放逐"] },
	{ sceneId: "shezheng_court", defaultMood: "court", keywords: ["亳", "摄政"] },
	{ sceneId: "taijia_gui", defaultMood: "triumph", keywords: ["桐宫", "迎归"] },
	{ sceneId: "yin_decline", defaultMood: "dark", keywords: ["殷道", "中衰"] },
	{ sceneId: "lu_qin", defaultMood: "solemn", keywords: ["路寝", "不言"] },
	{ sceneId: "wuding_meng", defaultMood: "mystery", keywords: ["武丁", "梦"] },
	{ sceneId: "fuxian_ban", defaultMood: "peaceful", keywords: ["傅险", "版筑"] },
	{ sceneId: "chengtang_miao", defaultMood: "solemn", keywords: ["成汤庙", "飞雉"] },
	{ sceneId: "wuding_xing", defaultMood: "epic", keywords: ["武丁", "中兴"] },
	{ sceneId: "zhaoge_court", defaultMood: "dark", trackId: "dark_01", keywords: ["朝歌", "帝辛"] },
	{ sceneId: "jiuchi_roulin", defaultMood: "dark", trackId: "dark_02", keywords: ["酒池", "肉林"] },
	{ sceneId: "paolao", defaultMood: "danger", trackId: "danger_03", keywords: ["炮烙", "烈火"] },
	{ sceneId: "youli", defaultMood: "dark", keywords: ["羑里", "囚"] },
	{ sceneId: "muye", defaultMood: "battle", keywords: ["牧野", "倒戈"] },
	{ sceneId: "yinjiang_war", defaultMood: "battle", keywords: ["殷疆", "转战"] },
	{ sceneId: "lutai_fire", defaultMood: "tragic", keywords: ["鹿台", "赴火"] },
	{ sceneId: "weishui", defaultMood: "peaceful", keywords: ["渭水", "磻溪"] },
	{ sceneId: "mengjin", defaultMood: "march", keywords: ["盟津", "渡河"] },
	{ sceneId: "luoyi", defaultMood: "court", keywords: ["洛邑", "成周"] },
	{ sceneId: "qi_palace", defaultMood: "court", keywords: ["营丘", "齐都"] },
	{ sceneId: "li_shan", defaultMood: "danger", keywords: ["骊山", "烽火"] },
	{ sceneId: "haojing", defaultMood: "tragic", keywords: ["镐京", "陷落"] },
	{ sceneId: "feng_yi", defaultMood: "peaceful", keywords: ["丰邑", "周都"] },
	{ sceneId: "zuili_ye", defaultMood: "battle", keywords: ["檇李", "战野"] },
	{ sceneId: "fujiao_shan", defaultMood: "tension", keywords: ["夫椒", "山"] },
	{ sceneId: "kuaijishan", defaultMood: "melancholy", keywords: ["会稽", "孤山"] },
	{ sceneId: "yue_guo", defaultMood: "tension", keywords: ["越国", "卧薪"] },
	{ sceneId: "huangchi", defaultMood: "court", keywords: ["黄池", "会盟"] },
	{ sceneId: "gusu_shan", defaultMood: "battle", keywords: ["姑苏", "山围"] },
	{ sceneId: "huai_ba", defaultMood: "triumph", keywords: ["淮泗", "霸业"] },
	{ sceneId: "jin_luan", defaultMood: "danger", keywords: ["骊姬", "乱"] },
	{ sceneId: "liuwang", defaultMood: "melancholy", keywords: ["流亡"] },
	{ sceneId: "qi_anle", defaultMood: "peaceful", keywords: ["齐", "安乐"] },
	{ sceneId: "chu_yan", defaultMood: "court", keywords: ["楚", "宴"] },
	{ sceneId: "qin_na", defaultMood: "peaceful", keywords: ["秦", "纳"] },
	{ sceneId: "chengpu", defaultMood: "battle", trackId: "battle_14", keywords: ["城濮", "战"] },
	{ sceneId: "jiantu", defaultMood: "triumph", keywords: ["践土", "盟"] },
	{ sceneId: "mianshan", defaultMood: "danger", keywords: ["绵山", "焚"] },
	{ sceneId: "chu_ping_ting", defaultMood: "dark", keywords: ["楚平王"] },
	{ sceneId: "zhaoguan_ye", defaultMood: "tension", keywords: ["昭关", "夜奔"] },
	{ sceneId: "wushi_xiao", defaultMood: "melancholy", keywords: ["吴市", "吹箫"] },
	{ sceneId: "yuchang", defaultMood: "danger", keywords: ["鱼肠", "刺"] },
	{ sceneId: "po_ying", defaultMood: "battle", keywords: ["破郢"] },
	{ sceneId: "bianshi", defaultMood: "tragic", keywords: ["鞭尸"] },
	{ sceneId: "shulou_jian", defaultMood: "tragic", keywords: ["属镂", "赐死"] },
	{ sceneId: "linzi_zheng", defaultMood: "danger", keywords: ["临淄", "争"] },
	{ sceneId: "guanbao_jian", defaultMood: "peaceful", keywords: ["管鲍", "荐"] },
	{ sceneId: "zunwang_meng", defaultMood: "court", keywords: ["会盟", "尊王"] },
	{ sceneId: "kuiqiu_hui", defaultMood: "triumph", keywords: ["葵丘", "会"] },
	{ sceneId: "lunxiang_bing", defaultMood: "solemn", keywords: ["病榻", "论相"] },
	{ sceneId: "qi_gong_ning", defaultMood: "dark", keywords: ["齐宫", "佞"] },
	{ sceneId: "qi_e_si", defaultMood: "tragic", keywords: ["饿死"] },
	{ sceneId: "yong_ting", defaultMood: "court", keywords: ["雍城", "秦庭"] },
	{ sceneId: "wugu_xian", defaultMood: "peaceful", keywords: ["五羖", "求贤"] },
	{ sceneId: "fanzhou_yi", defaultMood: "peaceful", keywords: ["泛舟", "输粟"] },
	{ sceneId: "yaoshan_fu", defaultMood: "battle", keywords: ["崤山", "覆师"] },
	{ sceneId: "suofu_zui", defaultMood: "solemn", keywords: ["素服", "罪己"] },
	{ sceneId: "xirong_ba", defaultMood: "triumph", keywords: ["西戎", "拓霸"] },
	{ sceneId: "huangniao_xun", defaultMood: "sorrow", keywords: ["黄鸟", "殉"] },
	{ sceneId: "wu_gong_ting", defaultMood: "court", keywords: ["姑苏", "吴庭"] },
	{ sceneId: "ailing_zhan", defaultMood: "battle", keywords: ["艾陵", "伐齐"] },
	{ sceneId: "wugong_jiao", defaultMood: "danger", keywords: ["吴宫", "斩姬"] },
	{ sceneId: "qin_xianyang", defaultMood: "court", keywords: ["咸阳", "秦都"] },
	{ sceneId: "qin_nanshimen", defaultMood: "solemn", keywords: ["南门", "立木"] },
	{ sceneId: "qin_fating", defaultMood: "court", keywords: ["秦廷", "变法"] },
	{ sceneId: "shang_yi", defaultMood: "peaceful", keywords: ["商於", "封邑"] },
	{ sceneId: "guanxia_keshe", defaultMood: "melancholy", keywords: ["关下", "客舍"] },
	{ sceneId: "luoyang_guixiang", defaultMood: "nostalgic", keywords: ["洛阳", "故里"] },
	{ sceneId: "hezhong_yitan", defaultMood: "court", keywords: ["合纵", "议坛"] },
	{ sceneId: "liu_xiangyin", defaultMood: "triumph", keywords: ["六国", "相印"] },
	{ sceneId: "qi_chelie", defaultMood: "tragic", keywords: ["车裂"] },
	{ sceneId: "qin_zhangxiang", defaultMood: "court", keywords: ["张仪", "相"] },
	{ sceneId: "chu_gongdian", defaultMood: "court", keywords: ["楚", "宫殿"] },
	{ sceneId: "shangyu_liuli", defaultMood: "danger", keywords: ["六里", "封地"] },
	{ sceneId: "wei_dushi", defaultMood: "court", keywords: ["魏", "都事"] },
	{ sceneId: "wei_cezhong", defaultMood: "dark", keywords: ["厕中", "辱"] },
	{ sceneId: "qin_qixiang", defaultMood: "court", keywords: ["应侯", "相"] },
	{ sceneId: "xujia_chidi", defaultMood: "peaceful", keywords: ["绨袍"] },
	{ sceneId: "changping", defaultMood: "battle", keywords: ["长平", "战"] },
	{ sceneId: "duyou_cijian", defaultMood: "tragic", keywords: ["杜邮", "赐剑"] },
	{ sceneId: "zhao_handan", defaultMood: "court", keywords: ["邯郸", "赵宫"] },
	{ sceneId: "qin_zhangtai", defaultMood: "court", keywords: ["章台"] },
	{ sceneId: "mianchi_hui", defaultMood: "tension", keywords: ["渑池", "会"] },
	{ sceneId: "fujing_junfu", defaultMood: "peaceful", keywords: ["负荆"] },
	{ sceneId: "yique", defaultMood: "battle", keywords: ["伊阙", "战场"] },
	{ sceneId: "qin_chaotang", defaultMood: "court", keywords: ["咸阳", "朝堂"] },
	{ sceneId: "duyou", defaultMood: "tragic", keywords: ["杜邮"] },
	{ sceneId: "miluojiang", defaultMood: "melancholy", keywords: ["汨罗", "泽畔"] },
	{ sceneId: "yan_chaotang", defaultMood: "court", keywords: ["蓟城", "燕"] },
	{ sceneId: "zhao_chaotang", defaultMood: "court", keywords: ["邯郸", "赵"] },
	{ sceneId: "linzi", defaultMood: "court", keywords: ["临淄", "齐都"] },
	{ sceneId: "jiamo", defaultMood: "tension", keywords: ["即墨", "孤城"] },
	{ sceneId: "zhanguo_sigongzi", defaultMood: "epic", keywords: ["四公子"] },
	{ sceneId: "hangu_guan", defaultMood: "tension", keywords: ["函谷关"] },
	{ sceneId: "handan", defaultMood: "court", keywords: ["邯郸", "赵都"] },
	{ sceneId: "daliang", defaultMood: "court", keywords: ["大梁", "夷门"] },
	{ sceneId: "chu_gongting", defaultMood: "court", keywords: ["郢都", "楚"] },
	{ sceneId: "handan_proton", defaultMood: "melancholy", keywords: ["邯郸", "质子"] },
	{ sceneId: "jinian_palace", defaultMood: "court", keywords: ["蕲年宫", "冠礼"] },
	{ sceneId: "xianyang_court", defaultMood: "court", keywords: ["咸阳", "朝堂"] },
	{ sceneId: "xianyang_palace_feast", defaultMood: "court", keywords: ["咸阳宫", "酒宴"] },
	{ sceneId: "bohai_coast", defaultMood: "epic", keywords: ["渤海", "之罘"] },
	{ sceneId: "afang_palace", defaultMood: "epic", trackId: "epic_04", keywords: ["阿房宫"] },
	{ sceneId: "shaqiu_platform", defaultMood: "tragic", trackId: "tragic_02", keywords: ["沙丘", "平台"] },
	{ sceneId: "yan_market", defaultMood: "peaceful", keywords: ["燕市", "酒歌"] },
	{ sceneId: "yishui_river", defaultMood: "melancholy", keywords: ["易水", "送别"] },
	{ sceneId: "wuyang_road", defaultMood: "tension", keywords: ["咸阳道", "西行"] },
	{ sceneId: "qin_hall", defaultMood: "danger", trackId: "danger_02", keywords: ["咸阳殿", "献图"] },
	{ sceneId: "handan_market", defaultMood: "peaceful", keywords: ["邯郸", "市井"] },
	{ sceneId: "lv_mansion", defaultMood: "court", keywords: ["文信侯府"] },
	{ sceneId: "qin_court_zhongfu", defaultMood: "court", keywords: ["秦廷", "仲父"] },
	{ sceneId: "shu_road", defaultMood: "melancholy", keywords: ["蜀道", "迁谪"] },
	{ sceneId: "shangcai_dongmen", defaultMood: "peaceful", keywords: ["上蔡", "东门"] },
	{ sceneId: "qin_library", defaultMood: "solemn", keywords: ["藏书阁"] },
	{ sceneId: "chamber_secret", defaultMood: "danger", keywords: ["密室", "沙丘"] },
	{ sceneId: "xianyang_market", defaultMood: "tragic", keywords: ["市曹"] },
	{ sceneId: "greatwall", defaultMood: "epic", keywords: ["长城", "北塞"] },
	{ sceneId: "shangjun_camp", defaultMood: "march", keywords: ["上郡", "军营"] },
	{ sceneId: "prison_cart", defaultMood: "tragic", keywords: ["囚车"] },
	{ sceneId: "longmu_field", defaultMood: "peaceful", keywords: ["田垄", "佣耕"] },
	{ sceneId: "daze_rain", defaultMood: "tension", keywords: ["大泽", "雨"] },
	{ sceneId: "daze_uprising", defaultMood: "battle", keywords: ["大泽", "揭竿"] },
	{ sceneId: "chen_city", defaultMood: "triumph", keywords: ["陈城", "入据"] },
	{ sceneId: "chen_palace", defaultMood: "court", keywords: ["张楚宫"] },
	{ sceneId: "chen_siege", defaultMood: "battle", keywords: ["陈城", "围"] },
	{ sceneId: "qi_land", defaultMood: "peaceful", keywords: ["齐地", "定齐"] },
	{ sceneId: "juye_ze", defaultMood: "peaceful", keywords: ["钜野", "渔"] },
	{ sceneId: "liang_youji", defaultMood: "march", keywords: ["梁地", "游击"] },
	{ sceneId: "suiyang_feng", defaultMood: "triumph", keywords: ["睢阳", "封"] },
	{ sceneId: "luoyang_zu", defaultMood: "tragic", keywords: ["族诛"] },
	{ sceneId: "qingmian_xing", defaultMood: "dark", keywords: ["黥面", "刑"] },
	{ sceneId: "lishan_tu", defaultMood: "melancholy", keywords: ["骊山", "亡"] },
	{ sceneId: "chen_shiyidi", defaultMood: "tragic", keywords: ["弑", "义帝"] },
	{ sceneId: "huainan_feng", defaultMood: "triumph", keywords: ["淮南", "封"] },
	{ sceneId: "poyang_zhu", defaultMood: "tragic", keywords: ["番阳", "诱杀"] },
	{ sceneId: "changle_palace", defaultMood: "court", keywords: ["长乐宫", "朝堂"] },
	{ sceneId: "yongxiang", defaultMood: "dark", keywords: ["永巷", "幽禁"] },
	{ sceneId: "dai_di", defaultMood: "peaceful", keywords: ["代地", "边塞"] },
	{ sceneId: "dai_wangfu", defaultMood: "court", keywords: ["代王府"] },
	{ sceneId: "weiyang_palace", defaultMood: "court", trackId: "court_10", keywords: ["未央宫", "宣室"] },
	{ sceneId: "lutai", defaultMood: "peaceful", keywords: ["露台", "惜费"] },
	{ sceneId: "xiliu_camp", defaultMood: "march", keywords: ["细柳营", "军门"] },
	{ sceneId: "junji_daying", defaultMood: "tension", keywords: ["坚壁"] },
	{ sceneId: "dongshi", defaultMood: "tragic", keywords: ["东市", "刑场"] },
	{ sceneId: "tingyu_prison", defaultMood: "dark", keywords: ["廷尉", "牢狱"] },
	{ sceneId: "qiguo_route", defaultMood: "march", keywords: ["粮道"] },
	{ sceneId: "changan_street", defaultMood: "peaceful", keywords: ["长安", "街巷"] },
	{ sceneId: "zhulv_blood", defaultMood: "battle", keywords: ["诸吕", "族灭"] },
	{ sceneId: "chang_an_street", defaultMood: "peaceful", keywords: ["长安", "街市"] },
	{ sceneId: "taishan_fengchan", defaultMood: "epic", keywords: ["泰山", "封禅"] },
	{ sceneId: "northern_frontier", defaultMood: "march", keywords: ["北疆", "边塞"] },
	{ sceneId: "mobei_desert", defaultMood: "epic", keywords: ["漠北", "荒原"] },
	{ sceneId: "longcheng_raid", defaultMood: "battle", keywords: ["龙城", "捷报"] },
	{ sceneId: "langjuxu", defaultMood: "epic", keywords: ["狼居胥"] },
	{ sceneId: "xiyu_desert", defaultMood: "mystery", keywords: ["西域", "大漠"] },
	{ sceneId: "xiongnu_camp", defaultMood: "tension", keywords: ["匈奴", "穹庐"] },
	{ sceneId: "baling_night", defaultMood: "melancholy", keywords: ["灞陵", "夜"] },
	{ sceneId: "wugu_prison", defaultMood: "dark", keywords: ["巫蛊", "诏狱"] },
	{ sceneId: "luntai_palace", defaultMood: "solemn", keywords: ["轮台诏"] },
	{ sceneId: "qi_court", defaultMood: "court", keywords: ["临淄", "齐廷"] },
	{ sceneId: "daliang_court", defaultMood: "court", keywords: ["大梁", "魏廷"] },
	{ sceneId: "qi_jixia", defaultMood: "peaceful", keywords: ["稷下"] },
	{ sceneId: "haoshui_bridge", defaultMood: "peaceful", keywords: ["濠水", "桥"] },
	{ sceneId: "chuye_garden", defaultMood: "peaceful", keywords: ["楚野", "濮水"] },
	{ sceneId: "qindu_xianyang", defaultMood: "court", keywords: ["咸阳", "秦宫"] },
	{ sceneId: "qin_prison", defaultMood: "dark", keywords: ["云阳", "狱"] },
	{ sceneId: "yan_jieshi", defaultMood: "epic", keywords: ["碣石宫"] },
	{ sceneId: "song_city", defaultMood: "court", keywords: ["郢都", "楚廷"] },
	{ sceneId: "song_wall", defaultMood: "tension", keywords: ["城防"] },
	{ sceneId: "lanling", defaultMood: "peaceful", keywords: ["兰陵", "学舍"] },
	{ sceneId: "zhu_book", defaultMood: "melancholy", keywords: ["著书", "孤愤"] },
	{ sceneId: "wuyi_mud", defaultMood: "peaceful", keywords: ["涂中", "曳尾"] },
	{ sceneId: "qufu_hao", defaultMood: "peaceful", keywords: ["曲阜", "好礼"] },
	{ sceneId: "shizhou_li", defaultMood: "peaceful", keywords: ["适周", "问礼"] },
	{ sceneId: "jiagu_hui", defaultMood: "court", keywords: ["夹谷", "会"] },
	{ sceneId: "zhouyou_lu", defaultMood: "melancholy", keywords: ["周游"] },
	{ sceneId: "chencai_jue", defaultMood: "danger", keywords: ["陈蔡", "绝粮"] },
	{ sceneId: "wenjin_yin", defaultMood: "peaceful", keywords: ["问津", "隐者"] },
	{ sceneId: "huolin_bi", defaultMood: "tragic", keywords: ["获麟", "绝笔"] },
	{ sceneId: "flood_plains", defaultMood: "danger", keywords: ["洪水", "泛滥"] },
	{ sceneId: "forest_deep", defaultMood: "mystery", keywords: ["林", "深"] },
	{ sceneId: "mountain_top", defaultMood: "epic", keywords: ["山", "巅"] },
	{ sceneId: "river_bank", defaultMood: "peaceful", keywords: ["河", "岸"] },
	{ sceneId: "village", defaultMood: "peaceful", keywords: ["村", "乡"] },
	{ sceneId: "battlefield", defaultMood: "battle", keywords: ["战场", "阵"] },
	{ sceneId: "temple", defaultMood: "solemn", keywords: ["庙", "祠"] },
	{ sceneId: "funeral", defaultMood: "sorrow", keywords: ["丧", "葬"] },
	{ sceneId: "celebration", defaultMood: "triumph", keywords: ["庆", "贺"] },
];

export function getSceneBgmHint(sceneId: string): SceneBgmHint | undefined {
	return SCENE_BGM.find((s) => s.sceneId === sceneId);
}

export function getDefaultMoodForScene(sceneId: string): Mood {
	return getSceneBgmHint(sceneId)?.defaultMood ?? "solemn";
}

export function getAltMoodForScene(sceneId: string, text: string): Mood | undefined {
	const hint = getSceneBgmHint(sceneId);
	if (!hint?.altMoods) return undefined;
	for (const alt of hint.altMoods) {
		if (text.includes(alt.trigger)) {
			return alt.mood;
		}
	}
	return undefined;
}

/**
 * 获取场景配置的具体曲目ID（确定性）
 * 1. 先查该场景是否手动配置了该情绪的 trackId
 * 2. 查 altTrackIds 是否有匹配的
 * 3. 都没有则返回 undefined（由 bgmMatcher 走自动确定性哈希匹配）
 *
 * 对于新增场景：未配置 trackId 时自动走确定性哈希，保证所有人听到一样的BGM
 */
export function getSceneTrackId(sceneId: string, mood: Mood): string | undefined {
	const hint = getSceneBgmHint(sceneId);
	if (!hint) return undefined;

	// 如果是默认情绪且有 trackId，直接返回
	if (hint.defaultMood === mood && hint.trackId) {
		return hint.trackId;
	}

	// 查 altTrackIds 是否有匹配情绪的具体曲目
	if (hint.altTrackIds) {
		for (const alt of hint.altTrackIds) {
			if (alt.mood === mood) {
				return alt.trackId;
			}
		}
	}

	return undefined;
}
