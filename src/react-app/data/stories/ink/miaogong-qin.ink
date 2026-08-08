// ═══════════════════════════════════════════════
// 秦缪公任好 · 秦 · 霸西戎
// 史源：《史记·秦本纪》
// ═══════════════════════════════════════════════

VAR de = 0
VAR ren = 0

-> start

=== start ===
#bg:qin_hall
#bgm:palace
#show:qingyue:tease:float
「欸嘿——这次的舞台在西陲。你是秦缪公任好，自非子养马、襄公始国，传到你已是第九代了~」 #speaker:青月
「秦虽为诸侯，却偏处西陲，被东方六国当作戎狄看。想翻身，就得有人、有德、有时运——这三样，眼下可一样都还缺哦。」 #speaker:青月

「春秋之时，诸侯争霸。秦自非子养马于汧渭之间，受封于周，历襄公、文公、宁公、出子、武公、德公、宣公、成公，至于你——秦缪公任好。」 #speaker:青月
#show:qinmu:solemn:center
「（独白）寡人承先君之业，据有西陲。然秦地僻远，中原诸侯视我为戎狄。晋、楚、齐、宋，各据一方，寡人常以为耻。」 #speaker:秦缪公
「殿中烛火摇曳，缪公自念：秦虽有山河之固，若无贤人辅佐，终不过是西陲小国。」 #speaker:青月

#hint:你的抉择将决定秦国的命运。德行与仁德之值，将影响最终的结局。
-> act1_open

=== act1_open ===
#bg:qin_court_zhongfu
#bgm:contemplate
「正值此时，中原大变。晋献公假道于虞，灭虢，还师袭虞，虞公与大夫百里傒皆为所虏。晋欲以百里傒为媵臣，送至秦国。」 #speaker:青月
#show:qinmu:thoughtful:center
「（独白）百里傒？此人乃虞国之臣，闻其贤而未得其详。晋人以他为陪嫁奴仆，此正天赐寡人也。」 #speaker:秦缪公

「然而消息传来：百里傒半路逃亡，不知所踪。」 #speaker:青月
#show:qinmu:worried:center
「（独白）百里傒若逃，必奔楚。楚若知其贤，必重用之。寡人当速谋之。」 #speaker:秦缪公
-> act1_search

=== act1_search ===
#bg:handan_market
#bgm:ancient
「楚国边境，市井之间。缪公遣人打探，果然——百里傒逃至宛地，被楚人所执，正在市中贩牛。」 #speaker:青月
#show:qinmu:thoughtful:center
「（独白）寡人欲以重金赎之，然楚若知其贤，必不肯与。反不如以贱价赎之，楚人不以为意，寡人自得之。」 #speaker:秦缪公

「缪公沉思良久，谓使者曰——」 #speaker:青月
#show:qingyue:worry:float
「要贤人，有两条路：一条是堂堂正正重金聘请，另一条是……低调得手。你走哪条？」 #speaker:青月

* #correct #hint:五羖羊皮——以贱价赎人，楚人不疑。秦穆公因此得贤。 [（谓使者）「汝以五张黑公羊皮，往赎百里傒。」]
    ~ de = de + 1
    -> act1_buy
* [（摆手）「一个亡国老奴而已，放他去吧，不必理会。」]
    -> act1_ignore

=== act1_buy ===

使者携五张黑公羊皮至宛，楚人见之，大笑曰：「此亡国奴，老而无用，五羊皮足矣。」遂以百里傒归秦。 #speaker:青月
#show:baili:solemn:left
「（独白）晋以我为媵，楚以我为奴。秦伯以五羊皮赎我——是轻我乎？是重我乎？」 #speaker:百里傒
#bg:qin_court_zhongfu
#bgm:solemn
#show:qinmu:solemn:center
「子何人也？」 #speaker:秦缪公
#show:baili:solemn:left
「臣，虞之亡臣百里傒也。」 #speaker:百里傒
「虞亡，子何不去？」 #speaker:秦缪公
「臣受命守虞，不敢去。」 #speaker:百里傒
「子有何才能？」 #speaker:秦缪公
「臣于虞，不过守职。然观天下之势，晋、楚、齐、秦，皆有伯王之资。秦处西陲，若修德行仁，安抚百姓，用贤任能，虽僻远，可争霸于中原。」 #speaker:百里傒
#show:qinmu:proud:center
「（大喜）善！五羖得一贤，寡人其有感于天。」 #speaker:秦缪公

缪公与语国事，三日不倦。遂授以国政，号曰「五羖大夫」。 #speaker:青月
~ de = de + 1
#show:baili:solemn:left
「君侯欲臣荐贤，臣有一人，曰蹇叔。此人远过臣十倍，君侯必欲致之。」 #speaker:百里傒
#show:qinmu:thoughtful:center
「蹇叔？寡人未尝闻也。」 #speaker:秦缪公
#show:baili:solemn:left
「臣居虞时，尝出游于齐，困于穷途，蹇叔收臣。臣欲事齐君，蹇叔止臣，臣幸而得免于齐乱。臣欲事周君，蹇叔又止臣，臣果免于周难。臣与蹇叔，非徒友也，实师之。」 #speaker:百里傒
#show:qinmu:solemn:center
「（独白）百里傒之贤，已如至宝。蹇叔能知百里傒，其贤更可知。」 #speaker:秦缪公
#show:jianshu:resolute:right

「乃使百里傒以厚币迎蹇叔于宋，以为上大夫。」 #speaker:青月
「秦人始知：君不以贫贱弃士，不以亡国废贤。岐下老农闻之，辍耕而叹——」 #speaker:青月
#show:qingyue:solemn:float
「（岐下老农）这个亡国奴，竟做了秦的上卿？世道变了。昔者周文王用姜太公于渭水之滨，今秦伯用百里傒于五羖之中。诸侯若知，当如何自处？」 #speaker:青月
「秦由是始重贤士，国政焕然一新。」 #speaker:青月
-> act2_open

=== act1_ignore ===
#bg:qin_hall
#bgm:solemn
#show:qinmu:default:center
「（独白）百里傒，亡国奴也。晋人以他为媵，楚人以他为奴。寡人何必为此一人，费神劳心？」 #speaker:秦缪公

「于是缪公不赎百里傒，任其流落楚国。」 #speaker:青月
「百里傒后为楚人所杀。秦失一贤，终不得其助。」 #speaker:青月
「此后数十年，秦虽有山河之固，终不能与中原诸侯争衡。每战辄败，每盟辄辱。」 #speaker:青月
#show:qingyue:sad:float
「（岐下老农）秦伯弃百里傒，是弃天道也。西陲之地，终其世不过为诸侯之附庸。」 #speaker:青月
「秦缪公任好，终其身未能称霸。秦国国弱民贫，至春秋之末，犹为天下所轻。」 #speaker:青月
#ending:if_bailixi_ignored
-> END

=== act2_open ===
#bg:qin_court_zhongfu
#bgm:contemplate
「百里傒、蹇叔既用，秦日以治。然天灾流行，晋国大旱，民无所得食。晋君遣使告籴于秦。」 #speaker:青月
#show:qinmu:thoughtful:center
「（独白）晋人来求粟。丕豹劝寡人勿与，因其饥而伐之，可一举而取晋。百里傒、公孙支则劝寡人与之。寡人当如何？」 #speaker:秦缪公
-> act2_choice

=== act2_choice ===
#show:qinmu:solemn:center
「丕豹！」 #speaker:秦缪公
#show:qingyue:solemn:float
「（丕豹）晋以饥告籴，此天赞我也。君若不伐，后必有悔。」 #speaker:青月
#show:qinmu:thoughtful:center
「（转向百里傒）大夫以为何如？」 #speaker:秦缪公
#show:baili:solemn:left
「臣闻：『天灾流行，国家代有。救灾恤邻，道也。』行道有福。」 #speaker:百里傒
#show:qinmu:thoughtful:center
「（转向公孙支）公孙支，子云何？」 #speaker:秦缪公
#show:qingyue:solemn:float
「（公孙支）晋君失其鹿，士者争欲得之。君若恤其饥，晋民必德秦。若乘其危，晋民必仇秦。德与仇之间，君其择焉。」 #speaker:青月
#show:qingyue:worry:float
「救邻居，还是趁火打劫？——选了，就不能后悔。」 #speaker:青月

* #correct #hint:救灾恤邻，道也。行道有福。秦穆公以船漕车转输粟于晋，自雍相望至绛。 [「其予之。救灾恤邻——寡人要让天下知道，秦人不乘人之危。」]
    ~ ren = ren + 1
    -> act2_give_grain
* [（拍案）「天赞我也！丕豹为将，渡河围绛，趁机伐晋！」]
    ~ de = de - 1
    -> act2_attack_jin

=== act2_give_grain ===
#bg:riverside
#bgm:ancient
「于是以船漕车转，自雍相望至绛。秦粟入晋，晋民欢呼。」 #speaker:青月
#show:baili:solemn:left
「君侯行此，秦之德必著于天下。」 #speaker:百里傒
「不数年，秦亦饥。缪公请粟于晋。晋君谋之，大夫虢射曰——」 #speaker:青月
#bg:camp_han_night
#bgm:danger
#show:qingyue:worry:float
「（虢射）因其饥伐之，可有大功。」 #speaker:青月
「晋君从之，发兵击秦。」 #speaker:青月
秦兵初战不利，缪公被围于韩地。三百食马者（初，缪公亡善马，岐下野人共得而食之者，吏欲法之。缪公曰：「君子不以畜产害人。吾闻食善马肉不饮酒，伤人。」皆赐酒而赦之）闻之，各驰兵以救缪公。 #speaker:青月
#show:qingyue:solemn:float
「（三百食马者之首）昔者君侯不罪我等，赐酒赦之。今日之事，我等死以报德！」 #speaker:青月
「三百人驰冒晋军，晋军解围，遂脱缪公而反生得晋君。」 #speaker:青月
#bg:qin_court_zhongfu
#bgm:triumph
「韩地之战，秦大胜，获晋君以归。周天子闻之，遣使贺缪公，赐以金鼓。」 #speaker:青月
#show:qingyue:smile:float
「（岐下老农）君子不以畜产害人。我们吃了他的马，他不但不罚，还赐酒赦之。这三百人，是去报德的。秦伯之德，及于禽兽，况于人乎！」 #speaker:青月
-> act3_open

=== act2_attack_jin ===
#bg:disorder_court
#bgm:battle
「缪公遂不与粟，反而发兵攻晋。丕豹为将，渡河围绛。」 #speaker:青月
「然而晋虽饥，民犹众。晋君以饥民为兵，人人死战。秦军久攻不下，反为晋所袭。」 #speaker:青月
「秦兵大败，丕豹仅以身免。缪公悔之无及。」 #speaker:青月
「后秦亦饥，晋人以怨报怨，乘秦之危而伐之。秦几亡。」 #speaker:青月
#show:qingyue:sad:float
「（岐下老农）秦伯弃德而用诈，弃邻而争利。晋饥而伐之，秦饥而晋伐之——此天道之循环也。」 #speaker:青月
「秦缪公任好，虽有山河之险，终以不义失其民。后世读史，至此未尝不叹也。」 #speaker:青月
#ending:if_no_grain
-> END

=== act3_open ===
#bg:qin_court_zhongfu
#bgm:contemplate
「既胜晋，秦之势益强。东方诸侯，莫不侧目。缪公以为可争霸于中原矣。」 #speaker:青月
郑人有卖郑于秦者，曰：「郑国君臣不敬其君，百姓不附。可袭而取之。」 #speaker:青月
#show:qinmu:thoughtful:center
「（独白）郑居天下之中，若得之，秦可东向而争天下。此千载一时也。」 #speaker:秦缪公
-> act3_choice

=== act3_choice ===
#show:qinmu:solemn:center
「蹇叔、百里傒，郑人请袭，二公以为何如？」 #speaker:秦缪公
#show:jianshu:resolute:left
#show:baili:worried:right
「（蹇叔）径数国千里而袭人，希有得利者。」 #speaker:蹇叔
「（百里傒）且夫郑，晋之与国也。晋若救郑，秦必危。」 #speaker:百里傒
#show:qinmu:angry:center
「（不悦）二公老矣，何怯也？寡人兴师，必有成算。」 #speaker:秦缪公
#show:jianshu:worried:left
「（蹇叔）君若不信，臣请言之：师行必过殽。殽有二陵焉，其南陵，夏后皋之墓也；其北陵，文王之所辟风雨也。必死是间，余收尔骨焉。」 #speaker:蹇叔
#show:qingyue:worry:float
「蹇叔在哭师了——他说他只能去殽山给将士们收尸骨。这个兵，你还要发吗？」 #speaker:青月

* #correct #hint:不听蹇叔哭师，乃发兵袭郑。殽之战，秦全军覆没。然缪公素服郊迎，不诿过，乃能雪耻霸西戎。 [（拂袖）「寡人志已决！孟明视、西乞术、白乙丙，三将听令——发兵袭郑！」]
    -> act3_advance
* [（长叹）「蹇叔、百里傒，皆寡人之师也。师言如此，寡人不敢不听。」——乃止兵不发。]
    -> act3_retreat

=== act3_retreat ===
#bg:qin_court_zhongfu
#bgm:solemn
「缪公终从蹇叔、百里傒之谏，不发兵。郑人闻之，乃止其谋。」 #speaker:青月
#show:jianshu:resolute:left
「君侯之从谏，社稷之福也。」 #speaker:蹇叔
#show:baili:solemn:left
「（百里傒）夫兵，凶器也。君不得已而用之，未有不危者。」 #speaker:百里傒
「然而缪公之心，终以不得郑为憾。他虽不发兵，却也未能忘情于中原。」 #speaker:青月
「其后，郑国为晋所侵，秦不能救。东方诸侯以秦为怯，不复畏秦。」 #speaker:青月
#show:qingyue:solemn:float
「（岐下老农）秦伯从谏而退，是善听也。然郑之役，秦失其机。殽之败，固可免矣；而霸西戎之业，亦不可得矣。」 #speaker:青月
「秦缪公任好，终其身未能称霸。秦之德虽著，秦之势终不能逾殽而东。」 #speaker:青月
#ending:if_no_xiao
-> END

=== act3_advance ===
#bg:camp_chu
#bgm:battle
「缪公不听，遂使百里孟明视、西乞术、白乙丙将兵以伐郑。」 #speaker:青月
「蹇叔、百里傒哭师于郊。」 #speaker:青月
#show:jianshu:sad:left
#show:baili:sad:right
「（蹇叔）孟明！吾见师之出，而不见其入也！」 #speaker:蹇叔
「（百里傒）君——老臣等不才，不能从君之命。然此师一出，秦之危必矣！」 #speaker:百里傒
#show:qinmu:angry:center
「（怒）寡人兴师，二公哭之，何也？」 #speaker:秦缪公
#show:jianshu:tearful:left
「（蹇叔）臣非哭师也，哭吾子也。臣之子在师中，师还，必死于殽。臣是以哭。」 #speaker:蹇叔
「蹇叔之子果在师中。百里傒亦有子同行。二老哭声震野，秦军将士莫不流涕。」 #speaker:青月

「秦军行至滑，郑已有备。郑商人弦高将市于周，遇之，以乘韦先，牛十二犒师，曰——」 #speaker:青月
#show:qingyue:solemn:float
「（弦高）寡君闻吾子将步师出于敝邑，敢犒从者。」 #speaker:青月
孟明视曰：「郑有备矣，不可冀也。」遂灭滑而还。 #speaker:青月
#bg:xia_court
#bgm:danger
「晋襄公闻秦袭郑，大怒，发兵遮秦兵于殽。」 #speaker:青月
#show:qingyue:worry:float
「（晋襄公）秦不告寡人以伐郑，是无礼也。」 #speaker:青月
「晋与姜戎要击秦师于殽。秦军大败，无一人得脱。虏秦三将：孟明视、西乞术、白乙丙。」 #speaker:青月
#bg:qin_court_zhongfu
#bgm:tragic
「败报至秦，缪公素服，郊迎败将。」 #speaker:青月
#show:qinmu:sad:center
「（素服，立于郊）孤以不用百里傒、蹇叔言，以辱三子。三子何罪乎？」 #speaker:秦缪公
「三将稽首，伏地流涕。」 #speaker:青月
#show:qinmu:resolute:center
「孟明视，子复将兵，以雪前耻。」 #speaker:秦缪公
「孟明视等归秦，修政练兵。居三年，渡河焚船，大败晋人，取王官及鄗，以报殽之役。」 #speaker:青月
~ de = de + 1
#show:qingyue:solemn:float
「（岐下老农）秦军惨败的消息传到西陲，老人们都说：百里傒、蹇叔哭师，哭的不是兵，是那三百人的命啊。然秦伯不诿过于三将，反素服郊迎——此所以能雪耻也。」 #speaker:青月
-> act4_open

=== act4_open ===
#bg:qin_court_zhongfu
#bgm:triumph
「孟明视既雪殽之耻，秦声威震于中原。然而缪公之心，犹有未足。」 #speaker:青月
「西戎之王，闻秦之强，使由余观秦。由余，其先晋人也，亡入戎，能晋言。」 #speaker:青月
#show:youyu:resolute:left
#show:qinmu:solemn:center
「由余先生，戎王使子观秦，子观秦之政，以为何如？」 #speaker:秦缪公
#show:youyu:thoughtful:left
「臣闻之：『乱者多所失，治者多所得。』秦之政，近乎治矣。然戎王所居，积薪而居，露处而食，无城郭宫室之制，无礼义法度之化。此所以戎所以为戎也。」 #speaker:由余
#show:qinmu:thoughtful:center
「（独白）由余之言，中寡人之心。戎地虽广，民不知礼义。若得其地，可安置中国之民；若得其人，可使其习战射。此霸王之资也。」 #speaker:秦缪公
「缪公乃用由余之谋，伐戎王，益国十二，开地千里，遂霸西戎。」 #speaker:青月
#bg:greatwall
#bgm:martial
「周天子闻秦霸西戎，遣使贺缪公，赐以金鼓，命为西方诸侯之伯。」 #speaker:青月
#show:qinmu:proud:center
「（独白）寡人承先君之业，由西陲一隅，至于霸有西戎。百里傒、蹇叔、由余之功，不可没也。」 #speaker:秦缪公
-> act4_three_good

=== act4_three_good ===
#bg:xianyang_palace_feast
#bgm:palace
「然而岁月不居，时节如流。缪公在位三十九年，霸业既成，而年已老矣。」 #speaker:青月
「秦有三良：奄息、仲行、针虎，皆贤臣也。缪公病重，召群臣，意似欲使三良从葬。」 #speaker:青月
#show:qinmu:sad:center
「（病榻）寡人将逝矣。三良之事——寡人思之，久而未决。」 #speaker:秦缪公
#show:qingyue:worry:float
「古者天子崩，有殉葬之制。你百年之后，那三位贤臣，是让他们继续辅政，还是……陪你同去？」 #speaker:青月

* #correct #hint:不以三良殉葬——君子爱才，不以死殉。缪公不殉三良，《黄鸟》之诗不作。 [（长叹）「寡人闻之：古者明王，莫不有良臣以从葬。然寡人亦闻：君子爱才，不以死殉。三良之才，当为秦用。」——乃止三良之殉。]
    ~ ren = ren + 1
    -> act4_persuade
* [（闭目）「寡人赴九泉之下，岂能无旧臣相随？传寡人遗命：三良从葬。」]
    -> act4_allow

=== act4_persuade ===
#bg:qin_court_zhongfu
#bgm:tragic
「缪公召三良而谓之曰——」 #speaker:青月
#show:qinmu:weak:center
「寡人不能强也。然寡人之志，终不以三良殉。后世若有议寡人者，当以此为先。」 #speaker:秦缪公
三良泣曰：「君侯之恩，臣等不敢忘。然君侯不使臣等从葬，是臣等不得从君于地下也。」 #speaker:青月
「缪公止之，不许。」 #speaker:青月
「三良感激，愿为秦尽力，辅嗣君以守秦业。」 #speaker:青月
#show:qingyue:smile:float
「（岐下老农）秦伯不使三良殉，是德之至也。《黄鸟》之诗，可以不作矣。」 #speaker:青月
-> ending_canon

=== act4_allow ===
#bg:prison_cart
#bgm:tragic
「缪公薨，卒。三良从死。秦人哀之，为作歌《黄鸟》。」 #speaker:青月
#show:qingyue:sad:float
「《黄鸟》：交交黄鸟，止于棘。谁从穆公？子车奄息。维此奄息，百夫之特。临其穴，惴惴其栗。彼苍者天，歼我良人！如可赎兮，人百其身！」 #speaker:青月
「（岐下老农）缪公霸西戎，却以三良殉葬——霸者也有愚暗的时候。秦人哀三良，作《黄鸟》之诗，至今读之，犹令人泣下。」 #speaker:青月
-> ending_canon

=== ending_canon ===
#bg:han_palace
#bgm:triumph
「秦缪公任好，在位三十九年。用百里傒于五羖之中，拔蹇叔于宋，取由余于戎。修德行仁，恤邻救灾，是以德著于天下。」 #speaker:青月
「韩地之战，三百食马者以死报德，秦始强。殽之战，缪公素服郊迎，不诿过于三将，是以三将雪耻。孟明视渡河焚船，大败晋人。由余之谋，益国十二，开地千里，遂霸西戎。」 #speaker:青月
「周天子贺以金鼓，命为西方诸侯之伯。秦于是始与晋、楚、齐争衡，为春秋五霸之一。」 #speaker:青月
「然缪公卒，或以三良殉葬。《黄鸟》之哀，千古犹存。」 #speaker:青月
#show:qingyue:solemn:float
「君子曰：秦缪公广地益国，东服强晋，西霸戎夷，然不为诸侯盟主，亦宜哉。死而弃民，收其良以死，不可矣。」 #speaker:青月
「五羖羊皮换百里傒，是慧眼；救灾恤邻输粟于晋，是仁德；殽之败素服郊迎，是担当；用由余霸西戎，是功业——这四样，就是缪公能称霸的原因。只是……三良之殉，始终是个污点。」 #speaker:青月
「秦缪公任好——霸西戎者，非唯力也，亦以德。」 #speaker:青月
#ending:canon #achieve:qinmu_baxi
-> END