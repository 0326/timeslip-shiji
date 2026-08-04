// ═══════════════════════════════════════════════
// 秦始皇 · 大秦帝国 · 七幕成长弧线
// 史源：《史记·秦始皇本纪》卷六
// ═══════════════════════════════════════════════

VAR tyranny = 0

-> act1_jiwei

=== act1_jiwei ===
#bg:handan_proton
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——坐稳咯~」 #speaker:青月
「这一回，你是赵政。邯郸出生、跟着不受宠的爹当质子的秦国王孙。」 #speaker:青月
你睁开眼。邯郸的冬天很冷。你从小被赵人白眼欺负，母亲赵姬搂着你，眼里是藏不住的惶恐——秦赵打仗，你们母子随时可能被泄愤杀掉。
#show:qingyue:default:float
「十三岁你爹庄襄王死了，你即位，可国政全在『仲父』吕不韦手里，还有那个和太后私通的嫪毐。」 #speaker:青月
#show:qingyue:worry:float
「二十二岁你要行冠礼亲政了。嫪毐不会坐以待毙。准备好了吗？」 #speaker:青月
#bg:jinian_palace
#bgm:danger
冠礼之日，你在蕲年宫。消息传来——长信侯嫪毐盗用御玺太后玺，发卒向蕲年宫杀来！
#show:qingyue:worry:float
「快决断！他先发制人了！」 #speaker:青月

* #correct #hint:令相国昌平君昌文君发卒攻毐 [先发制人，命昌平君发兵平叛]
    -> act1_pingluan
* [惊惶无措，等嫪毐杀来再说]
    -> death_cuohuan

=== act1_pingluan ===
#bg:jinian_palace
#bgm:court
你当即下令：相国昌平君、昌文君发卒攻嫪毐！咸阳一战斩首数百，叛军溃散。
#show:qingyue:solemn:float
「……『车裂以徇，灭其宗。』」 #speaker:青月
嫪毐被擒，车裂示众，夷三族。
#show:qingyue:smile:float
「漂亮！亲政第一刀，够狠。可还有一个人——吕不韦。」 #speaker:青月
「嫪毐是他推荐给太后的。怎么处置这位『仲父』？」 #speaker:青月

* #correct #hint:十年，相国吕不韦坐嫪毐免 [免吕不韦相位，遣回封地]
    -> act2_chulu
* [感念仲父之恩，留他继续为相]
    -> death_liubuwei_keep

=== act2_chulu ===
#bg:xianyang_court
#bgm:court
吕不韦被免相出就国河南。可一年过去，诸侯宾客使者相望于道请他出山——他的势力仍大得让你不安。
你赐书：「君何功于秦？秦封君河南，食十万户。君何亲于秦？号称仲父。其与家属徙处蜀！」
#bg:shu_road
#bgm:melancholy
吕不韦接信，深知你已不容他。
#show:qingyue:sad:float
「他饮鸩自尽了。那个把你爹扶上王位、又把你送上王位的商人，死在迁蜀路上。」 #speaker:青月
「从现在起，你是真正的孤家寡人了。」 #speaker:青月
#show:qingyue:smile:float
「接下来——六国呢？」 #speaker:青月
#bg:xianyang_court
#bgm:grand
你用尉缭之计重金贿赂诸侯权臣，任李斯、王翦——十年间：
十七年内史腾灭韩，十九年王翦灭赵，二十二年王贲灭魏，二十四年王翦灭楚，二十五年王贲灭燕，二十六年王贲灭齐。
#show:qingyue:solemn:float
「……『六王咸伏其辜，天下大定。』你一统天下了。五百年战乱，第一次有人做到。」 #speaker:青月
本幕通关。 #actclear:qin_shihuang_act2 #speaker:青月
-> act3_chengdi

=== act3_chengdi ===
#bg:xianyang_court
#bgm:court
丞相王绾上奏：燕齐楚地远，请立诸子为王以镇之。群臣皆以为便。廷尉李斯独持异议。
#show:lisi:cold:center
「周文武所封子弟同姓甚众，然后属疏远，相攻击如仇雠。今海内赖陛下一统，皆为郡县，诸子功臣以公赋税重赏赐之，甚足易制。置诸侯不便。」
#show:qingyue:worry:float
「郡县还是分封？选了哪个，就定下了后世两千年的格局。」 #speaker:青月

* #correct #hint:天下共苦战斗不休，以有侯王……廷尉议是 [从李斯之议，废分封行郡县]
    -> act3_tongyi
* [从王绾之议，分封诸子为王]
    -> death_fenfeng

=== act3_tongyi ===
#bg:xianyang_court
#bgm:court
你说：「天下共苦战斗不休，以有侯王。赖宗庙天下初定，又复立国，是树兵也！廷尉议是。」
分天下为三十六郡，收天下兵器聚之咸阳销以为金人十二。
#show:qingyue:smile:float
「一法度衡石丈尺，车同轨，书同文字。」 #speaker:青月
你要的不只是武力统一——让天下写一样的字、走一样的轨、用一样的度量衡。
#achieve:shutongwen
#show:qingyue:solemn:float
「书同文这一笔，让中华文明此后两千年再怎么分裂，文字永远连着。」 #speaker:青月
#bg:bohai_coast
#bgm:mystery
你巡游刻石、封禅泰山。齐人徐巿上书海中有三神山仙人居之，请入海求仙。
#show:qingyue:worry:float
「他要三千童男女入海求仙。你信吗？」 #speaker:青月

* [派徐巿入海求仙，但不耽误治国]
    -> act4_fenshu_kengru
* [深信不疑，大举方士倾力求药，自称真人]
    ~ tyranny = tyranny + 1
    -> act4_fenshu_kengru

=== act4_fenshu_kengru ===
#bg:xianyang_palace_feast
#bgm:court
三十四年咸阳宫酒宴，博士淳于越进言：「事不师古而能长久者，非所闻也。」要你复分法学古。
#show:lisi:cold:center
李斯奏：「今诸生不师今而学古，以非当世，惑乱黔首。私学而相与非法教，入则心非，出则巷议——如此弗禁，则主势降乎上，党与成乎下。」
他请：史官非秦记皆烧之；非博士官所职，天下敢藏诗书百家语者，悉诣守尉杂烧之；偶语诗书者弃市，以古非今者族。
#show:qingyue:worry:float
「焚书……这一笔下去，多少先秦典籍化为灰烬。」 #speaker:青月

* #correct [准李斯所奏——但留医药卜筮种树之书不烧]
    ~ tyranny = tyranny + 1
    -> act5_fusu
* [不准焚书，容百家议论]
    -> death_nofenshu
* [不仅焚书，连医药卜筮之书也一并烧毁]
    ~ tyranny = tyranny + 2
    -> death_overburn

=== act5_fusu ===
#bg:xianyang_court
#bgm:court
制曰：「可。」焚书令下。然后侯生卢生求药不得，背后谤你逃亡。你大怒，派御史案问诸生——
诸生传相告引，你亲自圈定四百六十余人，皆坑之咸阳。
#show:fusu:worried:left
长公子扶苏谏道：「天下初定，远方黔首未集，诸生皆诵法孔子，今上皆重法绳之，臣恐天下不安。唯上察之。」
你怒——这个儿子太仁弱，不像你。
「使扶苏北监蒙恬于上郡！」 #speaker:秦始皇
#show:qingyue:sad:float
「你把扶苏赶走了。让他去北边，和蒙恬一起守长城修直道。你不知道——这一走，他再也回不来了。」 #speaker:青月
本幕通关。 #actclear:qin_shihuang_act5 #speaker:青月
-> act6_shaqiu

=== act6_shaqiu ===
#bg:shaqiu_platform
#bgm:mournful
三十七年七月，第五次巡游到平原津，你病倒了。
#show:qingyue:sad:float
「你恶言死，群臣莫敢言死事。可病越来越重……」 #speaker:青月
你知大限将至，写玺书赐扶苏：「与丧会咸阳而葬。」书已封，在中车府令赵高行符玺事所，未授使者。
#show:qingyue:worry:float
「这封信……没交给使者。」 #speaker:青月

* #correct #hint:书已封，在中车府令赵高行符玺事所，未授使者。 [病势沉重，眼前发黑——玺书且先留着，缓一缓再遣使]
    -> act6_beng
* [强撑最后一口气，召使者入帐，当面授书，即刻发往上郡]
    -> if_yizhao_1

=== act6_beng ===
你身边只有三人知你死了：少子胡亥、中车府令赵高、丞相李斯。七月丙寅，你崩于沙丘平台。
{ tyranny >= 2:
    -> ending_tyrant
- else:
    -> ending_emperor
}

// ═══ IF线 · 玺书北上（自由模式歧路：遗诏及时发出）═══

=== if_yizhao_1 ===
#bg:shaqiu_platform
#bgm:tragic
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你撑起最后一点力气，召使者入帐。当着胡亥与李斯的面，你亲手把玺书交了出去：「即刻发往上郡。让扶苏——与丧会咸阳而葬。」 #speaker:青月 #hint:乃为玺书赐公子扶苏曰：「与丧会咸阳而葬。」
赵高垂手立在帐角，一句话也没有说。使者的马蹄声消失在北边的夜色里——符玺还在他手上，可诏书，已经在路上了。 #speaker:青月
七月丙寅，你崩于沙丘平台。 #speaker:青月
#bg:xianyang_court
#bgm:solemn
九月，车驾还咸阳。扶苏自上郡奔丧而至，蒙恬的三十万边军为他按剑北望——矫诏？再没有人敢提这两个字。 #speaker:青月
长子即位。新君弛刑徒、减戍漕、缓阿房之役——把你拧到最紧的那根弦，一寸一寸往回松。 #speaker:青月
#show:qingyue:default:float
「你看呀，蒙恬还在长城上，李斯还在相位上，你的儿子坐在你坐过的地方——没有沙丘之谋，没有二世，没有指鹿为马。」 #speaker:青月
#show:qingyue:sad:float
「可是呐——六国故地的怨，是你三十七年一鞭一凿刻下去的。你系的结，扶苏解得开吗？史书没有答案，我也没有。」 #speaker:青月
帝国的命，被你临终的一口气续上了。至于能续多久——那是另一卷没人写过的书。 #ending:if_yizhao #speaker:青月
-> END

=== death_cuohuan ===
你犹豫不决，错失平叛时机。嫪毐叛军攻入蕲年宫，你和太后被控制。
#show:qingyue:sad:float
「史上嬴政在冠礼之日先发制人，令昌平君发兵攻毐。你若等他先动手，二十二岁的秦王便死在亲政前一夜。」 #speaker:青月
亲政未成，秦王政死。 #death:cuohuan #speaker:青月
-> END

=== death_liubuwei_keep ===
你感念吕不韦扶持之功不忍加罪，留他为相。可吕不韦在河南，诸侯宾客相望于道；一年后他与太后旧情复燃、私通诸侯的密谋败露——你已无法控制这位「仲父」。
#show:qingyue:sad:float
「史上嬴政在嫪毐案后次年便罢免吕不韦迁蜀逼其饮鸩。对权臣的仁慈就是对自己的残忍——你留着他，最终成了他的傀儡。」 #speaker:青月
仲父专权，秦王暗弱，统一大业遥遥无期。 #death:liubuwei_keep #speaker:青月
-> END

=== death_fenfeng ===
你从王绾之议，分封诸子为燕王齐王楚王——周制复兴。不到三代诸侯王再次疏远相攻如仇雠，春秋战国五百年战乱重演。
#show:qingyue:sad:float
「史上始皇一语定乾坤：『天下共苦战斗不休，以有侯王。』废分封行郡县是他看得最远的地方。你退回分封，『大一统』便要再等几百年。」 #speaker:青月
封建复辟，天下复乱。 #death:fenfeng #speaker:青月
-> END

=== death_nofenshu ===
你拒绝焚书之议，容百家争鸣。可在「别黑白而定一尊」刚确立的时刻，儒生游士以古非今群议法令，六国遗老借诗书百家造谣惑众，统一根基动摇。
#show:qingyue:sad:float
「焚书是暴举——可它的根由是那个时代『一思想』的政治逻辑。你若完全容让，六国离心力量便无法压制，统一的帝国可能早早崩塌。」 #speaker:青月
百家横议，郡县难行，帝国根基动摇。 #death:nofenshu #speaker:青月
-> END

=== death_overburn ===
你连医药卜筮种树之书也一并烧毁，天下书除秦记外几乎尽毁。医术农书焚毁，百姓无书可读无药可医；天下列族恨你入骨。
#show:qingyue:sad:float
「连医药农书都烧是自毁根基。史上始皇留了实用之书不烧，还算没糊涂到家。你什么都烧，天下苦秦之烈便更早更猛。」 #speaker:青月
焚书过烈，天下怨怒，帝国速亡。 #death:overburn #speaker:青月
-> END

=== ending_tyrant ===
#bg:afang_palace
#bgm:epic
#achieve:qshihuang_unify
你走到终点。赵高李斯篡改遗诏，立胡亥赐死扶苏蒙恬。
秦二世元年七月，陈胜吴广于大泽乡揭竿——「王侯将相宁有种乎！」
三年后刘邦入咸阳，项羽烧阿房宫，秦亡。
#show:qingyue:sad:float
「你活了五十年，扫灭六国是你，书同文是你；焚书坑儒是你，求仙造宫也是你。你幻想『二世三世至于万世』，结果秦历二世、十五年而亡。」 #speaker:青月
「可你留下的郡县、文字、度量衡传了两千年。你被骂了两千年暴君，也被赞了两千年千古一帝。」 #speaker:青月
「功过是非，从来就在一线之间。」 #ending:if_wanshi #speaker:青月
-> END

=== ending_emperor ===
#bg:xianyang_court
#achieve:qshihuang_unify
#bgm:grand
你走到终点。沙丘一病不起，玺书未发而崩。可你留下了——
统一的文字让千年后依然能读懂同一段古籍；郡县制让大一统成为此后中国历史的常态；长城、直道、灵渠，至今犹在。
#show:qingyue:smile:float
「你是嬴政，也叫赵政，秦始皇。」 #speaker:青月
「有人骂你暴君，有人尊你千古一帝。你焚书坑儒，也书同文车同轨；你求仙问药，也筑起万里长城。」 #speaker:青月
「历史上没有完人，但做到这一步的——千古之下，也只你一人。」 #ending:canon #speaker:青月
-> END
