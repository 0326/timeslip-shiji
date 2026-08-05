// ═══════════════════════════════════════════════
// 殷高宗 · 武丁中兴 · 不拘一格得贤则兴
// 史源：《史记·殷本纪》(storyKey wuding:shang)
// ═══════════════════════════════════════════════

VAR xian = 0
VAR de = 0

-> act1_siwang

=== act1_siwang ===
#bg:yin_decline
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一位穿越客落到我这儿啦！坐稳咯，这一回你可穿成了殷家的天子呐~」 #speaker:青月
你睁开眼。先王小乙崩了，你继位，是为武丁。可这个殷，历了九世之乱、屡衰之后，早不复成汤的气象。 #speaker:青月 #hint:帝小乙崩，子帝武丁立。
#show:qingyue:worry:float
「你满心想中兴殷、想把这殷道重新扶起来。可环顾满朝……唔，竟没一个能替你分忧的辅弼之才。」 #speaker:青月 #hint:帝武丁即位，思复兴殷，而未得其佐。
-> act1_wei

=== act1_wei ===
#show:qingyue:default:float
「一腔热血，却无佐可用。这是你这一世的起点——欸，急，是没用的呀。」 #speaker:青月
#show:qingyue:tease:float
「你可以自恃聪明、即刻大展拳脚；也可以……先低下头，承认自己现在还差一个人。」 #speaker:青月
你握紧了拳。复兴殷的念头烧得你心口发烫，可满朝文武，竟无一人能与你共此大业。 #speaker:青月

* #correct #hint:思复兴殷，而未得其佐。 [你在心里默认了一件事：如今未得其佐，中兴之事，急不得]
	~ xian = xian + 1
	-> act1_ren
* [你不信偌大朝堂无人可用，当即要亲政、要立刻有所作为]
	-> act1_zi

=== act1_zi ===
#show:qingyue:worry:float
「唔……你不肯认那个『未得其佐』。可你越急着证明自己，越会撞见一堵墙——」 #speaker:青月
「别急呀。这一步先不算数，我再给你一次机会。真想中兴，得先学会等。」 #speaker:青月
-> act1_ren

=== act1_ren ===
#show:qingyue:solemn:float
「记住这四个字：未得其佐。承认它，不是认输，是清醒。」 #speaker:青月
本幕通关。 #actclear:wuding_act1 #speaker:青月
-> act2_bunyan

=== act2_bunyan ===
#bg:lu_qin
#bgm:solemn
#show:qingyue:default:float
你退居路寝，日日临朝，却一言不发。三年了，你没有下过一道号令。 #speaker:青月 #hint:三年不言。
#show:qingyue:tease:float
「群臣都私下嘀咕啦——新王莫不是个哑巴？欸嘿，可我知道你没哑，你是在憋一件大事。」 #speaker:青月
政事你都交给了冢宰去决断，自己只在殿上静静地看、静静地听。 #hint:政事决定于冢宰，以观国风。 #speaker:青月
#show:qingyue:worry:float
「三年不言，你到底图什么？满朝都在等你开口发令、大干一场呐。」 #speaker:青月
-> act2_ze

=== act2_ze ===
一名老臣忍不住出列：「君上继位三年，未尝亲决一政，长此以往，恐失威柄。何不即日亲政、号令四方？」 #speaker:冢宰
#show:qingyue:worry:float
「呐——他说得也在理。你是要顺水推舟、立刻亲政露一手？还是继续沉住这口气？」 #speaker:青月
你知道，你此刻若开口，便是威风八面；可你也知道，你要找的那个人，还没露面。 #speaker:青月

* #correct #hint:政事决定于冢宰，以观国风。 [你依旧不言，把政事交与冢宰，自己暗观国情民风、把人一个个看清楚]
	~ xian = xian + 1
	-> act2_guan
* [你再也按捺不住，即日亲政、事必躬亲，凡事都要自己拍板]
	-> death_jizheng

=== death_jizheng ===
#bgm:danger
你终于开了口，即日亲政，万机独断，事无巨细都要自己过问。 #speaker:青月
可你身边始终没有一个可托大事的贤佐。政令一多，便乱；一乱，便错。你越是勤勉，殷道越是纷扰。 #hint:思复兴殷，而未得其佐。 #speaker:青月
无佐而独理天下，你终究撑不起这盘残局。殷道非但不兴，反更衰了——那个要中兴殷的武丁，倒在了亲政的第一年。 #death:jizheng #speaker:青月
-> END

=== act2_guan ===
#show:qingyue:solemn:float
「……『三年不言』。」 #speaker:青月 #hint:以观国风。
「不是哑了，是把眼睛磨利了。你在等一个人，等之前，先把这天下、这人心，看到最底。」 #speaker:青月
#show:qingyue:smile:float
「欸嘿，沉得住气——这份定力，配得上一个中兴之主。接着看你的运道啦~」 #speaker:青月
本幕通关。 #actclear:wuding_act2 #speaker:青月
-> act3_mengsheng

=== act3_mengsheng ===
#bg:wuding_meng
#bgm:solemn
#show:qingyue:default:float
这一夜，你梦见了一个人。 #speaker:青月
梦里那人相貌清奇、气度非凡，自称名唤「说」。醒来，那张脸清晰得像刻在你心上。 #speaker:青月 #hint:武丁夜梦得圣人，名曰说。
#show:qingyue:tease:float
「呀——你梦见了个圣人！这可是老天爷托的梦？你把满朝文武挨个看了一遍……」 #speaker:青月
你以梦中所见，一一比对群臣百吏的相貌——竟没有一个人对得上。 #hint:以梦所见视群臣百吏，皆非也。 #speaker:青月
#show:qingyue:worry:float
「朝里没有。那这个『说』，是真有其人，还是你一场空梦？」 #speaker:青月
-> act3_ze

=== act3_ze ===
#show:qingyue:worry:float
「你可以随便在群臣里指一个模样相近的充数，就说梦应验了；也可以……信这个梦，真到民间去把他找出来。」 #speaker:青月
一边是省事，一边是茫茫天下、一个只在梦里见过的人。你要往哪边走？ #speaker:青月

* #correct #hint:于是乃使百工营求之野。 [你命百工画出梦中之貌，按图访求于四野，遍寻天下]
	~ xian = xian + 1
	-> act3_qiu
* [你觉得梦不足信，就在群臣中强指一人充作圣人，好安众心]
	-> death_qisheng
* [梦，终究是梦。你不指认充数，也不劳师寻野——只广下求贤之令，开言路、设庠序，坐待贤者自至]
	-> if_daixian_1

=== death_qisheng ===
#bgm:danger
你不愿为一场梦劳师动众，便在群臣里挑了个相貌略近的，宣称梦已应验。 #speaker:青月
众人称贺，你也就此心安。可那被你指认的人，终究只是个寻常臣子，扶不起将倾的殷。 #hint:以梦所见视群臣百吏，皆非也。 #speaker:青月
真正的圣人，还在傅险的荒野里筑墙。你与他，就这样擦肩而过。弃了真圣，殷再无中兴之佐——那个梦，成了你这一世最大的遗憾。 #death:qisheng #speaker:青月
-> END

=== act3_qiu ===
#show:qingyue:solemn:float
你命画工把梦中那张脸描摹下来，遣百工带着图象，走遍四野去寻。 #speaker:青月 #hint:于是乃使百工营求之野。
「你宁可信一个梦，也不肯将就一个假。」 #speaker:青月
#show:qingyue:smile:float
「欸——为了一个只在梦里见过的人，翻遍整个天下。这份『求贤若渴』，我服气啦。图象已经发下去了，就看能不能寻着他呀~」 #speaker:青月
本幕通关。 #actclear:wuding_act3 #speaker:青月
-> act4_banzhu

=== act4_banzhu ===
#bg:fuxian_ban
#bgm:solemn
#show:qingyue:default:float
终于，在傅险这地方，寻着了那张脸。 #speaker:青月 #hint:得说于傅险中。
你远远望去——那人正弯着腰，在版筑之间夯土筑墙。一身尘泥，是个服劳役的胥靡，一个刑徒。 #speaker:青月 #hint:是时说为胥靡，筑于傅险。
#show:fushuo:default:left
夯声一下一下，闷闷地砸在土里。他抬起头，那双眼睛，正是你梦里见过的。 #speaker:青月
#show:qingyue:worry:float
「就是他……可他是个刑徒呀。梦里是圣人，眼前是罪役。你，认不认？」 #speaker:青月
-> act4_yu

=== act4_yu ===
你走上前，与他攀谈起来。三言两语，你便怔住了——此人谈吐经纬天地，果然是个圣人。 #hint:得而与之语，果圣人。 #speaker:武丁
#show:qingyue:tease:float
「你已经看出他是真圣了。可满朝会答应吗？一个刑徒，一步登天做丞相？欸，这可是天大的破格。」 #speaker:青月
你回头，望见阶下群臣惊愕的脸。举一个胥靡为相，是要冒天下之大不韪的。 #speaker:青月

* #correct #hint:见于武丁，武丁曰是也。举以为相，殷国大治。 [你朗声道「是也」——不问出身，当即举傅说为相，付以国政]
	~ xian = xian + 1
	-> act4_ju
* [你终究嫌他是个贱役刑徒，恐惹群臣非议，疑而不敢用]
	-> death_yijian
* [「是也」两个字，你咽了回去——你赎他出刑徒之籍，先授为小臣，欲徐徐擢升，以安群臣之心]
	-> if_xuju_1

=== death_yijian ===
#bgm:danger
你看清了他是圣人，可一想到他那胥靡的身份、群臣的白眼，你到底没敢开这个口。 #speaker:青月
你以厚礼将他遣回，转身另择「出身清白」的臣子为佐。傅说重新拿起了夯板，夯声依旧闷闷地砸在傅险的土里。 #hint:是时说为胥靡，筑于傅险。 #speaker:青月
你亲手把中兴之佐，放回了荒野。殷不能兴，非因无贤，而因你不敢用贤——差的从来不是眼力，是那份不拘一格的胆魄。 #death:yijian #speaker:青月
-> END

=== act4_ju ===
#show:qingyue:solemn:float
你没有犹豫。你当着满朝的面，举这个刑徒为相，把殷的国政，交到了他手上。 #speaker:青月 #hint:举以为相，殷国大治。
你以他所出之地「傅险」赐姓，唤他傅说。自此君臣相得，殷国大治。 #speaker:青月 #hint:故遂以傅险姓之，号曰傅说。
#show:qingyue:smile:float
「梦寐求之，刑徒拜相——这不是头一回啦。你的先祖成汤，当年也是把伊尹从媵臣里举出来的。殷家用人，两次都不问出身呐。」 #speaker:青月
「一杆秤只称才，不称出身。武丁，你比谁都懂这个理。」 #speaker:青月
本幕通关。 #actclear:wuding_act4 #speaker:青月
-> act5_feizhi

=== act5_feizhi ===
#bg:chengtang_miao
#bgm:solemn
#show:qingyue:default:float
这日，你祭祀先祖成汤。次日，怪事来了——一只野雉飞上鼎耳，昂首长鸣。 #speaker:青月 #hint:帝武丁祭成汤，明日，有飞雉登鼎耳而呴。
#show:qingyue:worry:float
「飞雉登鼎、当庙而鸣……这在殷人眼里，是天降的凶兆啊。你脸都白了呢。」 #speaker:青月
你心里发慌。祭祀先王之际，竟有此异象，莫非是上天降罪、先祖不悦？ #hint:武丁惧。 #speaker:青月
#show:zuji:solemn:left
群臣噤声，唯有贤臣祖己上前一步。 #speaker:青月
-> act5_ze

=== act5_ze ===
「王勿忧。」祖己躬身道，「上天俯察下民，看的是人所秉持的义。人寿有长有短，非是天要夭折谁，而是有人自绝其德、中断其命。王只需先修政事、修德以应之。」 #speaker:祖己 #hint:唯天监下，典厥义，降年有永有不永，非天夭民，中绝其命。
#show:qingyue:tease:float
「呐——一边是祖己说『别怕，去修德修政』；一边，你也可以大兴祭祀、杀牲祷神，把老天爷哄回去。你信哪个？」 #speaker:青月
飞雉还在鼎耳上鸣叫。是媚神求安，还是反躬修德？这一念，关乎中兴的成败。 #speaker:青月

* #correct #hint:祖己曰：王勿忧，先修政事。 [你听从祖己，不问鬼神，转而先修政事、勤修德政以答天意]
	~ de = de + 1
	-> act5_de
* [你惧于凶兆，大兴祭祀、广祷鬼神，日日媚神求福，政事反倒荒废了]
	-> death_meishen

=== death_meishen ===
#bgm:danger
你被那飞雉吓破了胆，认定是先祖降怒。你广设祭坛、大杀牺牲，日夜祷告求神息怒。 #speaker:青月
可你越是媚神，政事越是荒疏；越是荒疏，民生越是凋敝。天不佑媚神之君，只佑修德之主。 #hint:唯天监下，典厥义。 #speaker:青月
你把中兴的机会，供在了神坛上烧成了灰。弃德而媚神——那个本可做高宗的武丁，终究把国运赌给了鬼神，输了。 #death:meishen #speaker:青月
-> END

=== act5_de ===
#show:qingyue:solemn:float
你没有去哄那飞雉。你依祖己之言，收摄心神，转身去修政事、行德政。 #speaker:青月 #hint:王勿忧，先修政事。
「『唯天监下，典厥义』。上天看的，从来不是你烧了多少香，而是你行了多少义。」 #speaker:青月
#show:qingyue:smile:float
「祥瑞也好、凶兆也罢，在你手里都成了修德的由头。欸——你没被那只鸟吓住，反倒借它敬了一次天。这份理性，难得呀。」 #speaker:青月
本幕通关。 #actclear:wuding_act5 #speaker:青月
-> act6_zhongxing

=== act6_zhongxing ===
#bg:wuding_xing
#bgm:solemn
{ xian >= 3 && de >= 1: -> ending_shishi | -> ending_reflect }

=== ending_shishi ===
#achieve:wuding_zhongxing
#show:qingyue:solemn:float
你修政行德，天下万民无不欢欣。那个历经九世之乱、几乎倾颓的殷，在你手里，重新立了起来。 #speaker:青月 #hint:武丁修政行德，天下咸欢，殷道复兴。
后来祖己嘉许你，说你能以那祥雉之异反成修德之机——是真正的明君。世人为你立庙，尊你为「高宗」。 #speaker:青月 #hint:祖己嘉武丁之以祥雉为德，立其庙为高宗。
#show:qingyue:smile:float
「三年不言，是沉；梦寐求贤，是渴；刑徒拜相，是胆；不惧飞雉，是明。这四样，凑齐了一个中兴之主呀。」 #speaker:青月
「你瞧——你的殷，先有成汤举伊尹于媵臣，后有你举傅说于版筑。不拘一格得贤，则国必兴。这，就是高宗武丁刻在史册里的八个字。」 #speaker:青月
#show:qingyue:tease:float
「欸嘿，走完啦。这一世，你没辜负那个梦。下次再穿来找我玩呀~」 #speaker:青月 #ending:canon
-> END

=== ending_reflect ===
#show:qingyue:sad:float
你也复兴了殷，可我心里，总替你惜着点什么。 #speaker:青月
「史书里的那个武丁呀——三年不言以观国风，梦得傅说而遍求于野，不嫌其刑徒之贱而举为相，不惧那飞雉之异而反躬修德。」 #speaker:青月 #hint:武丁修政行德，天下咸欢，殷道复兴。
「你这一世，少走了其中一步。或疑贤、或惧妖……差之毫厘。」 #speaker:青月
#show:qingyue:default:float
「若武丁疑贤而惧妖，殷衰便不可复振。得贤则兴，失贤则衰——这道理，你已经摸到边了。」 #speaker:青月
「要不……再走一遍？把那份不拘一格的胆、反躬修德的明，一样一样找回来。我等你呀~」 #speaker:青月
-> END

// ═══ IF线 · 坐待贤至（自由模式歧路：不为一个梦兴师动众）═══

=== if_daixian_1 ===
#bg:lu_qin
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。不劳师、不扰民，听着倒是稳当——我也是第一次看。」 #speaker:青月
求贤令传遍殷邦：开言路、设庠序，凡有一技之长者，皆可自荐于王庭。 #speaker:青月
来的人真不少。世族的子弟、方国的行人，衣冠楚楚，应对得体。你一个个亲自看过——都是可用之才，却没有一张，是梦里那张脸。 #speaker:青月 #hint:以梦所见视群臣百吏，皆非也。
-> if_daixian_2

=== if_daixian_2 ===
#bg:fuxian_ban
#bgm:peaceful
你以中才治中政。殷政修了几分，边患也靖了几分——像一件补好的旧衣，能穿，却谈不上焕然。 #speaker:青月
多年后你巡行西方，路过傅险。夯声一下一下，一队胥靡正在版筑之间修墙。你勒住马，在人堆里搜寻——岁月太久，你已记不清梦里那张脸了。 #speaker:青月 #hint:是时说为胥靡，筑于傅险。
#show:qingyue:sad:float
「求贤令写得再漂亮，胥靡是不会被荐上来的呀。举荐的路，从来只通到世族的门口。」 #speaker:青月
#show:qingyue:solemn:float
「不扰民，是仁；可有些贤，埋在泥里，等不来——只能亲自去捞。」 #speaker:青月
你的殷得了小安，终无大治。那个梦，你记了一辈子。 #ending:if_daixian #speaker:青月
-> END

// ═══ IF线 · 徐擢傅说（自由模式歧路：不敢破的格，改成慢慢升）═══

=== if_xuju_1 ===
#bg:fuxian_ban
#bgm:solemn
#show:qingyue:worry:float
「欸？你把那声『是也』咽回去了……这一步，史书上没有哦。」 #speaker:青月
你以「善版筑、通营造」为名，赎他出刑徒之籍，授为小臣。群臣无话——不过一个小臣而已。 #speaker:青月
三年，他把营造之政理得井井有条；又三年，你迁他为大夫。朝中开始有人引他，也开始有人堵他——「胥靡出身，安可再升？」 #speaker:青月
每升一级，你都要拿君威去换；每一道坎，都磨掉你们几年。 #speaker:青月
-> if_xuju_2

=== if_xuju_2 ===
#bg:wuding_xing
#bgm:epic
等他终于站到你的身侧、称得上「相」的那一天，你们君臣，都已两鬓染霜。 #speaker:青月
他还是那个圣人，把余年全给了殷。政修了，民安了——只是「大治」两个字，终究瘦成了「小康」。 #speaker:青月 #hint:举以为相，殷国大治。
#show:qingyue:sad:float
「稳是稳呀。可中兴最锐的那十几年，都耗在台阶上了。」 #speaker:青月
#show:qingyue:solemn:float
「破格之所以叫破格——因为有些贤，等不起一级一级的台阶。史书里的武丁，是当着满朝，一步把他举到相位上的。」 #speaker:青月
你得了一个安稳的朝堂，和一场迟到了十几年的中兴。 #ending:if_xuju #speaker:青月
-> END
