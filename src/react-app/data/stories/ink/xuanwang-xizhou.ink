// ═══════════════════════════════════════════════
// 周宣王（姬静） · 西周 · 中兴之殇
// 史源：《史记·周本纪》
// ═══════════════════════════════════════════════

VAR zhongxing = 0
VAR jiao_ying = 0

-> act1_gong_he

=== act1_gong_he ===
#bg:disorder_court
#bgm:danger
#show:qingyue:tease:float
「欸嘿——这一回你是姬静，周宣王！西周的『中兴之主』哟。」 #speaker:青月
「不过开头嘛……你爹是周厉王。对，就是那个『防民之口甚于防川』的周厉王。」 #speaker:青月
你睁开眼。眼前一片混乱——国人暴动了！
你父亲厉王暴虐，用卫巫监谤，国人「道路以目」，终于忍不住暴动，把厉王赶到了彘地。太子——也就是你——躲在召公家里，暴动的国人包围了召公府，要杀你。
#show:shaogong_hu:despair:left
召公姬虎面色惨白，看着你：「太子，国人恨厉王，要杀你泄愤。你是太子，是周的血脉……」 #speaker:召公虎
#show:qingyue:worry:float
「召公做了一个决定——他把自己的儿子交出去，冒充你，被国人杀了。他用自己儿子的命，换了你的命。」 #speaker:青月
#show:qingyue:sad:float
「你亲眼看着那个和你年纪相仿的孩子被拖出去，听着外面的惨叫声。从今天起，你活着的这条命，是召公的儿子替你给的。」 #speaker:青月
厉王跑了，你还不能继位——因为是暴动驱逐了天子。于是召公、周公二相行政，号曰「共和」。共和十四年，厉王死在彘地，你这才继位为宣王。
#show:qingyue:solemn:float
「你即位了。你爹留下的是一个烂摊子——王室衰微、诸侯不朝、四夷交侵。」 #speaker:青月
「你打算怎么办？」 #speaker:青月

* #correct #hint:宣王即位，修政，法文、武、成、康之遗风——法文武成康 [「法文、武、成、康之遗风，修政以安诸侯。」]
    ~ zhongxing = zhongxing + 1
    -> act2_zhong_xing
* [「先报父仇！把参与暴动的国人都杀了！」]
    -> death_fu_chou

=== act2_zhong_xing ===
#bg:huangdi_court
#bgm:martial
你任用召公虎、方叔、召虎、尹吉甫、仲山甫等贤臣，整顿朝政，法文、武、成、康之遗风。
然后你开始打仗——北伐玁狁，南征淮夷、荆蛮，西伐西戎。
#show:qingyue:default:float
「你打了一连串漂亮的胜仗！」 #speaker:青月
命尹吉甫北伐玁狁，一直打到太原；命方叔南征荆蛮；命召虎伐淮夷；你自己亲征徐戎，把徐方打服了。
诸侯们重新开始宗周——史称「宣王中兴」。
#show:qingyue:smile:float
「你把你爹丢掉的王室威严，又打回来了呀！诸侯复宗周，这是自穆王以来久违的盛世呢。」 #speaker:青月
你站在成周的宫殿里，看着四方诸侯来朝。那些年的浴血奋战，似乎都值得了。
本幕通关。 #actclear:xuanwang_act1 #speaker:青月
-> act3_bu_ji

=== death_fu_chou ===
你即位后第一件事就是清算暴动参与者，要为父报仇。召公苦劝你不听，屠杀参与者数百人。
国人愤怒了——当初驱逐厉王的是他们，现在你又要杀他们，他们就敢再驱逐一次。诸侯见你刚继位就报复，也都寒了心。
宣王中兴还没开始，你就死在了第二次国人暴动里。
#show:qingyue:sad:float
「你爹就是因为暴虐被赶走的，你上来就学他？召公的儿子白替你死了呀。」 #speaker:青月 #death:fuchou
-> END

=== act3_bu_ji ===
#bg:yangcheng
#bgm:tense
可晚年的你，开始变了。
你不再像年轻时那样兢兢业业——或许是中兴的光环让你有些飘飘然，或许是年纪大了，听不进劝谏了。
按照周制，每年春天天子要行「籍田之礼」——亲自耕种一块千亩的籍田，以劝农、以示天下重农。这是文王、武王、成王、康王传下来的古制，是周以农立国的根本仪式。
#show:qingyue:worry:float
「你宣布——不籍千亩了。」 #speaker:青月
#show:zhongshanfu:worry:left
虢文公劝谏你：「不可！夫民之大事在农……不可已经。」 #speaker:虢文公
#show:qingyue:default:float
「籍田礼不过是个仪式，天子何必亲自下地？现在王室有钱有兵，不靠那一亩三分地了吧？」 #speaker:青月
「但虢文公说——这是祖宗之法，是农本之国的根本。你听不听？」 #speaker:青月

* #hint:宣王不听——史实是他不籍千亩，但这里你可以选择 [（沉默片刻）「籍田礼废了，农本就丢了。恢复。」]
    ~ zhongxing = zhongxing + 1
    -> act3_ji_tian
* #correct [「一个仪式而已，废了便是。」——不行籍礼]
    ~ jiao_ying = jiao_ying + 1
    -> act3_bu_ji_qian_mu

=== act3_ji_tian ===
#show:qingyue:smile:float
「你恢复了籍田礼！宣王晚年最大的一个错误，你避开了。」 #speaker:青月
但有些东西已经变了。你晚年最大的挫折还在后面。
-> act4_lu_luan

=== act3_bu_ji_qian_mu ===
#show:qingyue:sad:float
你不听虢文公的劝谏，废了籍千亩之礼。
#show:qingyue:default:float
「《周语》说『不籍千亩』是宣王失德的开始哦。一个仪式或许不重要，但仪式背后对农桑的那份敬畏——丢了，就再难捡回来了。」 #speaker:青月
-> act4_lu_luan

=== act4_lu_luan ===
#bg:xia_court_cold
#bgm:tense
鲁武公带着两个儿子——长子姬括、少子姬戏——来朝见你。你喜欢姬戏，想要立他为鲁国太子。
#show:qingyue:worry:float
「你喜欢小儿子姬戏，要立他为鲁国的继承人。可是——周朝的嫡长子继承制是周公定下的呀！」 #speaker:青月
「废长立幼，这是乱礼。你是天子，你带头乱礼，诸侯会怎么想？」 #speaker:青月
#show:zhongshanfu:worry:left
仲山甫劝谏你：「废长立少，不顺；不顺，必犯王命；犯王命，必诛之。」 #speaker:仲山甫

* #hint:仲山甫谏，宣王不听——但你可以选择 [（沉吟良久）「仲山甫说得是。立长括，此乃礼制。」]
    ~ zhongxing = zhongxing + 1
    -> act4_li_zhang
* #correct [「我喜欢戏，就立戏！天子之命，谁敢不从？」——立姬戏为鲁太子]
    ~ jiao_ying = jiao_ying + 1
    -> act4_fei_zhang

=== act4_li_zhang ===
#show:qingyue:smile:float
你听从了仲山甫的劝谏，立了长子姬括。鲁国的继承安稳了，诸侯们松了一口气——天子还是守礼的。
-> act5_tai_yuan

=== act4_fei_zhang ===
#show:qingyue:sad:float
你不听劝谏，强立少子姬戏为鲁太子。鲁武公死后，姬戏继位为鲁懿公。
但没过几年，姬括的儿子伯御弑杀了鲁懿公，自立为君。鲁国大乱。你后来虽然出兵伐鲁、杀了伯御，但鲁国从此和王室之间有了裂痕。
#show:qingyue:default:float
「你带头废长立幼，诸侯们看在眼里——天子自己都不守周公之礼，我们何必守？」 #speaker:青月
「更严重的是——你伐姜氏之戎，败于千亩。从南国调来的军队全军覆没。」 #speaker:青月
你在千亩打了个大败仗，丧尽了南国之师。
-> act5_tai_yuan

=== act5_tai_yuan ===
#bg:camp_chu
#bgm:sad
千亩战败，南国之师尽丧。你想要补充兵力，于是做了一个决定——料民太原。
「料民」就是清点户口、统计人口，按人头征兵征赋。
#show:zhongshanfu:worry:left
仲山甫又来劝谏你：「民不可料也！」——古时候不刻意清点人口，人口多少自然有数目；你现在大张旗鼓地料民，等于告诉天下「王室没人了、不行了」，而且会扰民。 #speaker:仲山甫
#show:qingyue:worry:float
「你刚败于千亩，丧了南国之师，现在又要大张旗鼓清点人口征兵。仲山甫说这样做既扰民又示弱。」 #speaker:青月
「你听不听？」 #speaker:青月

* #hint:宣王不听，卒料民——但你可以选择 [（沉默）「……仲山甫，你说得对。」——停止料民，休养生息]
    ~ zhongxing = zhongxing + 1
    -> act5_xiu_yang
* #correct [「败了就补兵！料民！」——卒料民太原]
    ~ jiao_ying = jiao_ying + 1
    -> act5_liao_min
* [（拍案而起）「一场败仗算什么！寡人当年北逐玁狁、南平淮夷——传令，起倾国之兵，踏平姜戎，雪千亩之耻！」——倾国再征]
    -> if_dumu_1

=== act5_xiu_yang ===
#show:qingyue:smile:float
你停下了料民的打算，与民休息。虽然千亩之败伤了元气，但你晚年还能听得进劝谏，及时止步。
-> act6_zhong_jie

=== act5_liao_min ===
#show:qingyue:sad:float
你不听。你终究还是料民于太原。
#show:qingyue:default:float
「『王卒料之』——这是史书原话。你晚年听不进话了。虢文公谏不籍千亩你不听，仲山甫谏立鲁君你不听，仲山甫又谏料民你还是不听。」 #speaker:青月
本幕通关。 #actclear:xuanwang_act2 #speaker:青月
-> act6_zhong_jie

=== if_dumu_1 ===
#bg:camp_chu
#bgm:martial
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有料民，也没有休兵。你要用一场更大的胜仗，把千亩的耻辱连本带利讨回来。
你尽发畿内之众，连岁征伐——姜氏之戎、太原之戎、条戎、奔戎。仲山甫、尹吉甫相继老去，谏诤的声音一个接一个沉默了。
#show:zhongshanfu:worry:left
仲山甫临终前最后一次入见：「王之武功，赫赫矣。然连年之战，田不得耕、丁不得息——臣恐王之胜，胜于外而虚于内也。」 #speaker:仲山甫
#show:qingyue:solemn:float
「他说：你赢在了边境，却把国家掏空了。你听吗？」 #speaker:青月
你不听。你要的是威。

* [「威加海内，方是天子！传令，再征！」——穷兵不止]
    -> if_dumu_wei
* [（望着仲山甫花白的鬓发，一时语塞）「……先生且留步。这一仗，寡人再想想。」——罢兵]
    -> if_dumu_shou

=== if_dumu_wei ===
#bg:huangdi_court
#bgm:tragic
#show:qingyue:solemn:float
你把宣王中兴积攒的家底，全压在了刀锋上。
起初捷报连连——诸戎望旗而溃，四境肃然，诸侯震恐，人人称你为「威王」。你站在受降的高台上，觉得自己比文王武王更近乎「天下共主」四个字。
可威是借来的。连岁的征发榨干了畿内的丁壮与仓廪，田野荒芜，国人在你的赫赫武功下，悄悄地怨了、逃了、空了。
#show:qingyue:sad:float
「你赢了每一场仗，却输了那个仗打完之后该回去过日子的天下。」 #speaker:青月
你崩逝那年，府库空虚、民力凋敝，边地的戎狄见周师疲敝，反而年年内侵。你留给幽王的，不是一个中兴的周，而是一副被武功掏空的躯壳——比史书上那个还要脆。
#show:qingyue:solemn:float
「威，是天下人肯给的时候才叫威。你逼着他们给，给到最后，他们就只剩下怕，和恨了。」 #speaker:青月
「你比史书上的宣王更能打，也更早地，把周打空了。」 #speaker:青月
后世的兵家记得你的赫赫武功，可《周语》里，你只留下四个字：其亡也忽焉。 #ending:if_dumu #speaker:青月
-> END

=== if_dumu_shou ===
#bg:yangcheng
#bgm:contemplate
#show:qingyue:default:float
你看着仲山甫花白的两鬓，忽然想起自己也老了。
「先生说得是。」你挥退了传令的旗使，「戎狄疥癣之疾，社稷元气才是根本。罢兵，与民休息。」 #speaker:周宣王
你把最后那点好胜心，压了下去。千亩之耻没有雪，可畿内的田照旧耕、丁照旧息。
#show:qingyue:smile:float
「呼——你在最后关头，收住了手。」 #speaker:青月
「宣王一生的功过，全在一个『度』字上：早年他把握住了度，所以中兴；晚年他差点失了度，所幸你替他，又找回来了。」 #speaker:青月
你崩逝时，留给幽王的周虽不复鼎盛，却元气尚存。至于后来那个儿子守不守得住——那，是另一个故事了。 #ending:if_shoucheng #speaker:青月
-> END

=== act6_zhong_jie ===
#bg:jiuyi_shan
#bgm:tragic
你在位四十六年，崩了。
太子宫湦继位——他就是周幽王。
{ jiao_ying >= 2:
    #show:qingyue:solemn:float
    「你是宣王。你把你爹留下的烂摊子收拾了，北伐南征，打出了一个『宣王中兴』。」 #speaker:青月
    「可你晚年骄了、盈了——不籍千亩、废长立幼、料民太原，三件事你不听劝谏，全都做了。」 #speaker:青月
    「中兴是你，埋下祸根的也是你。你儿子幽王，就在你铺好的下坡路上，一路滑了下去。」 #speaker:青月
    #achieve:xuanwang_zhongxing
    -> ending_zhong_xing
- else:
    #show:qingyue:smile:float
    「你是宣王，你中兴了周，也在晚年守住了那份戒惧。籍田礼你没废，鲁国你没乱立，料民你悬崖勒马。」 #speaker:青月
    「你之后的幽王虽然不争气，但成康之治的余晖，在你手里多亮了几十年。」 #speaker:青月
    -> ending_wan_mei
}

=== ending_zhong_xing ===
#show:qingyue:sad:float
「宣王中兴是西周最后的回光返照。」 #speaker:青月
「你刚继位时，那个躲在召公家里、被召公儿子替死的孩子，心里想的一定是要做个好天子——你做到了一半。」 #speaker:青月
「打完了仗，诸侯都来了，你以为中兴完成了，就开始任性。不籍千亩是第一件错事，废长立幼是第二件，料民太原是第三件。三件错事，把你中兴的功业一点点耗掉了。」 #speaker:青月
「你死后十一年，你的儿子幽王烽火戏诸侯，西周就亡了。」 #speaker:青月
「中兴只一世——多么短暂啊。」 #ending:canon #speaker:青月
-> END

=== ending_wan_mei ===
#show:qingyue:smile:float
「这样的周宣王，才是孔子向往的那个『文武成康』之道的继承者呀。」 #speaker:青月
「可惜史实中的他，还是做了那三件错事——因为人老了，就会骄傲，就会听不进话，这是最难的功课啊。」 #speaker:青月
「但你做到了。你在每一个关键的岔口，都想起了那个被召公儿子替下的孩子——他的命不能白丢，周不能亡在你手里。」 #speaker:青月
「好样的，宣王。」 #ending:if_tingjian #speaker:青月
-> END
