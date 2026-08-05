// ═══════════════════════════════════════════════
// 姜尚（姜太公） · 西周 · 待时之渔
// 史源：《史记·齐太公世家》《史记·周本纪》
// ═══════════════════════════════════════════════

VAR patience = 0
VAR boldness = 0

-> act1_chao_ge

=== act1_chao_ge ===
#bg:huaiyin_street_alt1
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一位穿越客落到我这儿啦！坐稳咯~」 #speaker:青月
「这一回嘛……你叫姜尚，字子牙。听说过没？就是后来那个封神的姜太公啦！」 #speaker:青月
「不过现在——你还什么都不是。」 #speaker:青月
你睁开眼。朝歌的市井，屠户的案前，你手里攥着一把屠刀。你已经很老了。 #speaker:青月
你这一生，卖过酒、屠过牛，穷困潦倒大半生。妻子马氏嫌你没出息，整日骂你没本事。胸中那卷《六韬》，翻得边角起毛，却无人肯看一眼。 #speaker:青月
#show:qingyue:worry:float
「七十多岁的老头儿了，还在市井里讨生活。你空有满腹兵书，没人认得你呀。」 #speaker:青月
「面前就是你老婆马氏，又要骂你了——你要怎么回？」 #speaker:青月
#show:mshi:angry:left
马氏叉着腰啐道：「你这老不死的！嫁你几十年，连口饱饭都挣不到！趁早写休书放我走！」 #speaker:马氏

* #correct #hint:吕尚盖尝穷困，年老矣——忍，再忍，时未到。 [（压下心头火）「是我无能，夫人再给我些时日。」]
    ~ patience = patience + 1
    -> act1_ren
* [（拍案而起）「竖子不足与谋！你走便是！」]
    -> death_qizi
* [（收起屠刀，长揖一拜）「夫人保重。」——东行，游说诸侯]
    -> if_youshui_1

=== act1_ren ===
#show:qingyue:smile:float
「唔……忍下来了？好呀好呀，忍得住，才等得起。」 #speaker:青月
你没有跟她争。你只是把屠刀收起来，把那卷《六韬》揣进怀里，转身离开朝歌。 #speaker:青月
往西去。听说西伯姬昌在岐山，笃仁敬老，礼下贤者。 #speaker:青月
你走到渭水边，停了下来。你知道——欲钓王侯，先钓时机。 #speaker:青月
本幕通关。 #actclear:jiangshang_act1 #speaker:青月
-> act2_weishui

=== death_qizi ===
你一怒之下写了休书。马氏冷笑而去，你也落得个清净。 #speaker:青月
可清静填不饱肚子，你没了家，也没了盘缠。那卷兵书，终究在乱世里换不来半口饭吃。 #speaker:青月
你死在朝歌城外的荒沟里，到死也没人知道你叫姜尚。 #death:qizi #speaker:青月
-> END

=== act2_weishui ===
#bg:riverside
#bgm:ancient
你在渭水的磻溪住了下来。每日坐溪畔，执一根钓竿——鱼钩是直的，悬在水面三尺之上，不挂饵。 #speaker:青月
路过的樵夫笑你：「老头儿，你这钩，一百年也钓不上一条鱼！」 #speaker:青月
#show:qingyue:tease:float
「哈哈哈哈直钩钓鱼！你这疯老头儿——欸等等，你不是真在钓鱼吧？」 #speaker:青月
「哼哼，你钓的是……？」 #speaker:青月

* #correct #hint:太公钓于渭滨，文王遇之——钓的是王与侯 [（微微一笑）「老夫钓的不是鱼，是王与侯。」]
    ~ patience = patience + 1
    -> act2_wait
* [「……钓不上就算了，就是来打发时间。」]
    -> death_xiaoyao

=== act2_wait ===
#show:qingyue:smile:float
「哦——原来是这样！你是在等那个识货的人呀！」 #speaker:青月
你继续直钩垂钓，日复一日。风吹过你的白发，溪水漫过你的草鞋。 #speaker:青月
终于有一天——远处尘头大起，一队车驾出猎而来。最前那辆车上，一个须发皆白的老者下了车，向你走来。 #speaker:青月
他就是西伯姬昌。 #speaker:青月
#show:qingyue:worry:float
「来了来了！他来了！你等了一辈子的人，就在你面前！」 #speaker:青月
「第一句话，怎么说？」 #speaker:青月
#show:wenwang:gentle:right
西伯上前拱手：「敢问老丈，为何以直钩垂钓？」 #speaker:周文王

* #correct #hint:吕尚盖尝穷困，年老矣，以渔钓奸周西伯。宁向直中取，不向曲中求。 [「宁向直中取，不向曲中求。不为锦鳞设，只钓王与侯。」]
    ~ boldness = boldness + 1
    -> act3_yu_xian
* [慌忙扔下钓竿伏地叩头：「山野村夫，冒犯西伯！」]
    -> death_gongshun

=== death_xiaoyao ===
你哈哈一笑，说自己只是打发时间。那樵夫摇摇头走了，你也就再也没想过要钓什么王侯。 #speaker:青月
你在渭水边钓了一辈子鱼，活到九十多岁无疾而终。村人都说你是个怪老头。 #speaker:青月
那卷《六韬》，随你一起埋进了黄土。兵仙姜尚，从此没有在史书上出现过。 #death:xiaoyao #speaker:青月
-> END

=== death_gongshun ===
你扔了钓竿，伏地叩首，连称「山野村夫，死罪死罪」。 #speaker:青月
西伯笑了笑，让你平身，问了几句庄稼收成，便起驾走了。 #speaker:青月
他以为你只是个怕事的老农。那份大礼，就这样在你这一拜里错过了。 #speaker:青月
你仍是磻溪边上一个钓鱼的老头，到死没等到第二次机会。 #death:gongshun #speaker:青月
-> END

=== act3_yu_xian ===
#bg:palace
#bgm:solemn
#show:qingyue:solemn:float
「……好一个『宁向直中取，不向曲中求』！」 #speaker:青月
西伯闻言大喜，握住你的手：「吾太公望子久矣！」——他父亲季历在世时就说过，将来必有圣人来周，周因之以兴。他等你，等了多少年了。 #speaker:青月
#show:qingyue:smile:float
「他称你为『太公望』！姜太公啊姜太公——你七十年的等待，就为了这一句话！」 #speaker:青月
西伯载你同车而归，拜你为师。你终于在满头白发的年纪，等到了识你的主君。 #speaker:青月
本幕通关。 #actclear:jiangshang_act2 #speaker:青月
-> act4_mengjin

=== act4_mengjin ===
#bg:camp_han_night
#bgm:martial
#show:qingyue:default:float
光阴飞度。西伯文王崩了，太子发继位，是为武王。你被尊为「师尚父」。 #speaker:青月
武王九年，你辅佐他东观兵至于盟津。八百诸侯不期而至，纷纷高喊：「纣可伐矣！」 #speaker:青月
武王却摇摇头：「女未知天命，未可也。」竟下令班师。 #speaker:青月
#show:qingyue:worry:float
「八百诸侯都来了呀！这时候打过去，朝歌不就拿下了？武王怎么退了？」 #speaker:青月
「师尚父，你怎么看？」 #speaker:青月

* #correct #hint:武王曰"女未知天命，未可也"——时犹未至，再等。 [（按住腰间剑）「王言未可，便是未可。天命未至，再等。」]
    ~ patience = patience + 1
    -> act4_wait
* [（拔剑）「八百诸侯齐聚，天与不取，反受其咎！请即刻进兵！」]
    -> death_zaojin

=== act4_wait ===
#show:qingyue:smile:float
「……对。观兵是示威，不是决战。八百人心未齐，比干、箕子还在朝歌死谏——纣王还没烂透。」 #speaker:青月
你陪武王班师回丰。又是两年。 #speaker:青月
两年里，纣剖比干、囚箕子，太师疵、少师强抱乐器奔周——纣王的忠臣死了、乐师逃了，天下彻底崩了。 #speaker:青月
本幕通关。 #actclear:jiangshang_act3 #speaker:青月
-> act5_muye

=== death_zaojin ===
你力主即刻进兵，武王犹豫片刻，被你说动，挥师渡河。 #speaker:青月
八百诸侯的联军气势虽壮，却指挥不一、人心不齐。商纣调集七十万大军迎击，在盟津北岸将诸侯军各个击破。 #speaker:青月
你死在乱军之中。武王败退归周，伐纣之业葬送。 #speaker:青月
那一天，史书上的牧野之战，永远不会发生了。 #death:zaojin #speaker:青月
-> END

=== act5_muye ===
#bg:mingtiao_war
#bgm:battle
#show:qingyue:solemn:float
「时候到了！」 #speaker:青月
武王十一年正月甲子，你左手杖黄钺、右手秉白旄，率戎车三百乘、虎贲三千人、甲士四万五千人，与纣战于牧野。 #speaker:青月
#show:qingyue:worry:float
「商军七十万，你只有四万五。这仗怎么打？」 #speaker:青月
战前誓师，你站在阵前，面对黑压压的七十万商军——他们多是被纣王征来的奴隶，阵前倒戈在即，但此刻他们的矛尖都对着你。 #speaker:青月
你是师尚父，是这四万五千人的胆。 #speaker:青月

* #correct #hint:师尚父号曰"总尔众庶，与尔舟楫，后至者斩"——以百夫致师，率先冲阵 [「总尔众庶！与尔舟楫！后至者斩！」——你亲率百夫长冲阵]
    ~ boldness = boldness + 1
    -> act5_charge
* [（稳坐中军）「先探敌阵虚实，再定进退。」]
    -> death_hesitate

=== act5_charge ===
#bg:zhuolu_field
#bgm:battle
#show:qingyue:smile:float
你以耄耋之年，第一个拍马冲向七十万大军！白发在风中猎猎飞扬，白旄指向朝歌——这四万五千人，见老尚父亲冒矢石，军心大振。 #speaker:青月
商军前阵的奴隶们本就不愿为纣送死，见你冲来，纷纷掉转戈矛——「前徒倒戈」！ #speaker:青月
#show:qingyue:solemn:float
「……纣师皆倒兵以战，以开武王。这一天，商朝六百年的天下，在你白发冲阵那一刻，崩塌了。」 #speaker:青月
你率联军杀入朝歌。纣登鹿台，蒙衣其珠玉，自焚于火而死。 #speaker:青月
牧野一战定天下。 #speaker:青月
本幕通关。 #actclear:jiangshang_act4 #speaker:青月
-> act6_feng_qi

=== death_hesitate ===
你稳坐中军，先派探马去看虚实。可七十万商军里那些被胁迫的奴隶，等不来你的冲锋，就只能被身后督战的商兵逼着向前。 #speaker:青月
倒戈的勇气只在那一瞬间——你不敢冲，他们便不敢反。 #speaker:青月
四万五千人被七十万人吞没。你死在中军帐前，白旄折断、黄钺落地。 #speaker:青月
那个亲率百夫冲阵、以耄耋之身冠三军的姜尚，在你犹豫的这一刹那就已经消失了。 #death:hesitate #speaker:青月
-> END

=== act6_feng_qi ===
#bg:xia_court
#bgm:triumph
武王灭商，分封天下。以首功封你于营丘，国号齐。 #speaker:青月
你带着随从东行就国。走到半路，你住在客栈歇脚，慢悠悠的。客栈主人说了一句意味深长的话：「吾闻时难得而易失。客寝甚安，殆非就国者也。」 #speaker:青月
#show:qingyue:worry:float
「欸！你听他这话什么意思？他是不是在说你——走得太慢了？」 #speaker:青月
「营丘那地方，莱夷人虎视眈眈。你慢悠悠走，等你走到，地还是你的吗？」 #speaker:青月

* #correct #hint:太公闻之，夜衣而行，犁明至国——时难得而易失，连夜赶路 [（脸色一变）「不好！」——立刻穿衣起行，连夜赶路]
    ~ boldness = boldness + 1
    -> act6_qixiu
* [（哈哈一笑）「老夫封君之命在身，谁敢抢？且歇一晚，明日再走。」]
    -> death_anyixiu

=== act6_qixiu ===
#bg:shun_house
#bgm:court
#show:qingyue:smile:float
「欸——聪明！这才是那个直钩钓王侯的姜太公嘛！」 #speaker:青月
你连夜东行，黎明时赶到营丘——正赶上莱人来攻！你立刻整军部署，击退莱夷，坐稳了齐国。 #speaker:青月
#show:qingyue:worry:float
「地是坐稳了。可这营丘啊，满城都是东夷之民——言语、祭祀、婚嫁，没一样合乎周礼。」 #speaker:青月
「这个国，你打算怎么治？」 #speaker:青月

* #correct #hint:太公至国，修政，因其俗，简其礼——顺着水土治国。 [「因其俗，简其礼。」——顺着齐地的风土来治]
    -> act6_zhiqi
* [「以周礼化之。」——变其俗，革其礼，教以尊尊亲亲]
    -> if_bianli_1

=== act6_zhiqi ===
你到齐国后，修政简礼，通商工之业，便鱼盐之利——人民多归齐，齐成大国。 #speaker:青月
{ boldness >= 2:
    #bg:taishan_peak
#bgm:epic
    #show:qingyue:solemn:float
    「……你等了七十年，冲了七十万人的阵，连夜赶了百里的路。」 #speaker:青月
    「你这一生最厉害的，不是兵法——是『待时』。时机未到，你能在渭水边钓一辈子鱼；时机一到，你敢以八十高龄第一个冲阵。」 #speaker:青月
    #achieve:jiangshang_taigong
    -> ending_taigong
- else:
    #show:qingyue:default:float
    「你到了齐国，治好了一方百姓，把齐变成东方大国。」 #speaker:青月
    「……只是，若你当年再果决一点，也许能走得更远吧？」 #speaker:青月
    -> ending_peace
} #speaker:青月
本幕通关。 #actclear:jiangshang_act5 #speaker:青月

=== death_anyixiu ===
你哈哈一笑，说封君之命在身，谁敢抢？接着倒头便睡。 #speaker:青月
夜半你被厮杀声惊醒——莱人趁你未至，已经攻陷了营丘。你的随从四散奔逃，你在乱中被杀。 #speaker:青月
营丘那片土地，从此归了莱夷。周天子封的齐侯，死在了就国的半路上。 #speaker:青月
#show:qingyue:sad:float
「……时难得而易失啊。你等了一辈子，最后一步路，却歇下了。」 #speaker:青月 #death:anyixiu
-> END

=== ending_taigong ===
#show:qingyue:smile:float
「后世把你封神了呀——姜太公在此，百无禁忌！」 #speaker:青月
「可你自己知道——你不是神。你只是一个等到满头白发，还没放弃的老头儿。」 #speaker:青月
「后世还有一句话：『太公八十遇文王』。多少人怀才不遇的时候，都会想起渭水边那个直钩钓鱼的老头子。」 #speaker:青月
「等得到，是本事；敢冲，也是本事。这两样你都占了——所以你成了姜太公。」 #speaker:青月 #ending:canon
-> END

=== ending_peace ===
你做了一辈子齐侯，把齐建成了东方大国，死后葬在营丘。 #speaker:青月
只是史书上总少了一笔——那个敢以八十高龄冲七十万军阵的姜尚，在某一个犹豫的岔路口，停了下来。 #speaker:青月
齐国的霸业，要等几百年后的管仲和桓公，才真正到来。 #speaker:青月
#show:qingyue:default:float
「嗯……这样也挺好。只是有些可惜呀。」 #speaker:青月
-> END

// ═══ IF线 · 游说（自由模式歧路：东行应聘，佐于一隅）═══

=== if_youshui_1 ===
#bg:huaiyin_street
#bgm:ancient
#show:qingyue:worry:float
「欸？不往西去，反而向东？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
「不对——有一点影子。关于你，史书里本就留着另一种说法：你曾事纣，纣无道，去之；游说诸侯，却无所遇。」 #speaker:青月 #hint:或曰，太公博闻，尝事纣。纣无道，去之。游说诸侯，无所遇，而卒西归周西伯。
「史书里的你，游遍诸侯没人识货，最后还是西归见了西伯。可这一回——若真有人识货呢？」 #speaker:青月
你东行千里，舌敝唇焦。终于，东海之滨一个小国的国君，在堂下听完你论兵，起身离席，拜你为国师。 #speaker:青月
你替他缮甲兵、修城郭、通渔盐。三年，小国境内路不拾遗，邻邦不敢犯境。 #speaker:青月
#show:qingyue:default:float
「你看你看，《六韬》真的有用呀！百里之地，也被你治得铁桶一样。」 #speaker:青月
又过了许多年，西方传来消息：西伯昌笃仁敬老，三分天下有其二；再后来，武王起兵，八百诸侯会于盟津，你的国君也去了。你留守国中，登上城楼向西望。 #speaker:青月
#show:qingyue:sad:float
「牧野那一战，最后还是打赢了。只是慢了许多年，也惨了许多——周军阵前，没有那个杖黄钺、率百夫先冲的白发老人。」 #speaker:青月
你终老于东海之滨，一国之人敬你如父。只是那卷《六韬》，终其一生，只在百里之内施展过。 #speaker:青月
「百里之国盛得下你的晚年——盛不下你胸中那个天下呀。」 #ending:if_youshui #speaker:青月
-> END

// ═══ IF线 · 变俗（自由模式歧路：以周礼治齐）═══

=== if_bianli_1 ===
#bg:qi_palace
#bgm:solemn
#show:qingyue:worry:float
「欸？你要在东夷之地行周礼？这一步……史书上没有哦——不对，有，只是写在鲁国那一页。」 #speaker:青月
你颁下政令：禁淫祀，正婚姻，序尊卑，行丧尽礼。营丘的东夷之民面面相觑——渔汛不等丧期，海上讨生活的人，守不起那么重的礼。 #speaker:青月
一年，来归的流民少了；足足三年，你才把政绩理顺，报于周室。 #speaker:青月
#show:qingyue:default:float
「隔壁鲁国的伯禽，日后也是这么治鲁的——变其俗，革其礼，三年而后报政。周公听了，叹了一口气。」 #speaker:青月 #hint:太公至国，修政，因其俗，简其礼，通商工之业，便鱼盐之利，而人民多归齐。
「他叹的是：政不简不易，民不肯亲近；平易近民，民才归之呀。」 #speaker:青月
你把齐国治成了一座恭谨的礼器：庙堂整肃，揖让有度。只是渔盐之利不兴，商旅绕道，府库年年清减。莱人看出了虚实，屡屡再犯边邑。 #speaker:青月
#show:qingyue:sad:float
「礼是好礼。只是穿在东海的风浪上，嫌重了呀。」 #speaker:青月
你身后，齐国成了一个守礼的小邦，安安静静列在诸侯的末座。数百年后中原会盟的座次上，将不会有霸主齐侯的位置。 #speaker:青月
「因俗而治，还是以礼齐俗——你替他换了个答案。齐与鲁的命运，也就悄悄换了个座位。」 #ending:if_bianli #speaker:青月
-> END
