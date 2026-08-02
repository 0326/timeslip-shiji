// ═══════════════════════════════════════════════
// 黄帝 · 垂衣治天下 · 巡行安民
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR mg_result = ""
VAR mg_score = 0

-> c_open

=== c_open ===
#bg:xuanyuan_court
#bgm:solemn
#show:qingyue:tease:float
「唔？你身上还沾着一股子烟火气——是刚从涿鹿的战场上下来的吧。」 #speaker:青月
「甲胄先别急着卸哦。阪泉三战胜了炎帝，涿鹿一役诛了蚩尤——两战定天下，诸侯把你捧上了共主之位。你，是轩辕黄帝。」 #speaker:青月
你睁开眼。甲胄未卸，血腥气还未散尽，帐外万国的旌旗猎猎作响，所有人都在等你一句话。 #speaker:青月
#show:qingyue:worry:float
「打天下靠刀兵，治天下……可就是另一桩买卖了。」 #speaker:青月
「呐，划重点——刀能让人怕你，却不能让人服你。往下每一步，都在写你是暴主，还是圣王。」 #speaker:青月
-> c_roam

=== c_roam ===
#show:qingyue:calm:float
战事既平，天下初定。诸侯散归，万国观望——他们臣服的，究竟是你的德，还是你的兵？ #speaker:青月
一位老臣伏地进言：「蚩尤已诛，四海震恐。君上何不安居涿鹿，享这天下贡奉，令诸侯岁岁来朝？」 #speaker:老臣
「安居……」你摩挲着案上的符契，若有所思，「老将军，你说远在东海之滨的邦国，可曾亲眼见过孤一面？」 #speaker:黄帝
#show:qingyue:tease:float
「唔——高坐深宫，坐等人来拜。听着，是挺舒坦的呀。」 #speaker:青月
「可你猜，那些远在东海、空桐、江湘的邦国，看得见你的德么？」 #speaker:青月

* #correct #hint:东至于海，登丸山，及岱宗……北逐荤粥，合符釜山——足迹遍四方，德才服万国。 [不受深宫之奉，亲巡四方，合符诸侯]
	-> c_roam_good
* [依老臣之言，安居涿鹿，坐受四方朝贡]
	-> c_indulge
* #correct [不深居，也不奔波——大营涿鹿之阿，筑一座固定的都城，令万国来朝于此]
	-> if_dingdu_1

=== c_indulge ===
#bg:xuanyuan_court
#bgm:court
你自居深宫，日日受贡，绝迹于四野。远方诸国久不见天子之德，只闻天子之威，渐生离心。荤粥复扰北疆，江海之邦观望不朝，昔日合符的诸侯，一个个称疾不至。 #speaker:青月
你以刀兵得的天下，也终将只用刀兵去守——而刀兵，守不住人心。天子之名，就这样从你身上一点点褪去了。 #death:indulge #speaker:青月
-> END

=== c_roam_good ===
#bg:taishan_peak
#bgm:solemn
#show:qingyue:smile:float
「欸——走对啦！德这东西，是要走出去、让人看见的。」 #speaker:青月
「传令——备车。」你按住案角站起身来，「深宫里的天子，万国看不见。孤的德，得自己走出去给他们看。」 #speaker:黄帝
你东至大海，登丸山、上泰山；西抵空桐，登鸡头之巅；南临长江，登熊山、湘山；北逐荤粥，于釜山与诸侯合验符契。 #speaker:青月 #hint:东至于海，登丸山，及岱宗。西至于空桐，登鸡头。南至于江，登熊、湘。北逐荤粥，合符釜山。
你迁徙往来，居无常处，以行军之营为守卫。你的足迹到哪里，天子的德威就到哪里。 #speaker:青月 #hint:迁徙往来无常处，以师兵为营卫。 #impact:impact_zhitianxia_xunfang

* [「合符釜山……符契是什么？」]
	-> c_roam_fuqi
* [「北逐荤粥……荤粥是什么人？」]
	-> c_roam_hunxu
* [「登泰山……这就是后世说的封禅吗？」]
	-> c_roam_fengshan
* [「继续说。」]
	-> c_roam_next

=== c_roam_fuqi ===
#show:qingyue:calm:float
「符契呀，就是一种信物。你与诸侯各自执一半，合在一起就是完整的——这代表你们彼此信任，同心协力。」 #speaker:青月
「合符釜山，就是你与天下诸侯立下盟约：你是他们的共主，他们是你的臣民。」 #speaker:青月
#show:qingyue:smile:float
「后世有个成语叫『符合』，就是从符契来的——两半合在一起，严丝合缝，表示心意相通。」 #speaker:青月
「你在釜山合符，意味着天下诸侯都承认了你的地位。这比任何一场胜仗都重要。」 #speaker:青月

* [「诸侯为什么会愿意来合符？」]
	#show:qingyue:calm:float
	「因为你先修德、后振兵呀。诸侯们看到了你的能力，也感受到了你的仁义。」 #speaker:青月
	「合符不是强迫的，是自愿的。他们愿意来，是因为跟着你有前途、有安全感。」 #speaker:青月
	-> c_roam_next
* [「继续说。」]
	-> c_roam_next

=== c_roam_hunxu ===
#show:qingyue:calm:float
「荤粥就是后世说的匈奴。他们是北方的游牧民族，时常南下侵扰。」 #speaker:青月
「你北逐荤粥，不是要灭了他们，是要让他们知道——中原的天子，不是好欺负的。」 #speaker:青月
#show:qingyue:worry:float
「荤粥擅长骑射，来去如风。你追他们，他们就跑；你一转身，他们又回来抢。」 #speaker:青月
「所以『逐』不是追杀到底，是赶到他们不敢靠近中原为止。这叫『驱』，不叫『灭』。」 #speaker:青月

* [「那后来荤粥怎么样了？」]
	#show:qingyue:calm:float
	「后来呀……他们一直存在于北方，时降时叛。到了周朝叫『猃狁』，秦朝叫『匈奴』——反正换了个名字，还是那帮人。」 #speaker:青月
	「你这一『逐』，保了中原几百年的太平。后世的天子，都在学你的法子。」 #speaker:青月
	-> c_roam_next
* [「继续说。」]
	-> c_roam_next

=== c_roam_fengshan ===
#show:qingyue:tease:float
「封禅呀，是天子祭天祭地的大典。你在泰山上祭天，在梁父山上祭地——告诉天地，你是受命于天的共主。」 #speaker:青月
「不过哦，太史公写你『东至于海，登丸山，及岱宗』——他没写你封禅。封禅的说法，是后来的人添上去的。」 #speaker:青月
#show:qingyue:calm:float
「后世真正搞大规模封禅的，是秦始皇和汉武帝。他们登泰山、刻石记功，仪式感拉满。」 #speaker:青月
「你呢？太史公只说你在泰山附近活动，没说具体做了什么。也许你也祭了天，也许没有——反正后人都把封禅的功劳算在你头上了。」 #speaker:青月

* [「岱宗就是泰山吗？」]
	#show:qingyue:smile:float
	「对呀！岱宗是泰山的别称，五岳之首。古人认为泰山是离天最近的地方，所以天子要在那里祭天。」 #speaker:青月
	「『岱宗夫如何？齐鲁青未了』——这是后世一个诗人写的。泰山，从你这会儿开始就一直是华夏的圣地。」 #speaker:青月
	-> c_roam_next
* [「继续说。」]
	-> c_roam_next

=== c_roam_next ===
#show:qingyue:calm:float
「你巡了四方，合了符契。可你想过没有——你走到东海边上那件事，落在谁眼里了？」 #speaker:青月
#show:qingyue:smile:float
「东海边上有个老渔翁，叫阿海。一辈子没出过方圆三十里。有一天他蹲在礁石上补网，忽然听见鼓声——不是打仗的鼓，是仪仗的鼓。」 #speaker:青月
「他抬头一看，一支队伍沿着海岸走来。一个中年男人站在车上，望向大海——不是在看鱼、看船，是在看天下。」 #speaker:青月
#show:qingyue:calm:float
「天子没进村——怕惊了百姓。可他派人送来了盐、布、新制的鱼钩，还留了一道令：东海之滨的赋税，减三成。」 #speaker:青月
「阿海接过那包盐，手都在抖。海边的人天天在海里泡着，却买不起盐腌鱼。减了三成赋，他头一回在冬天有余粮——多出来的那点粮，够给小孙子添一件冬衣了。」 #speaker:青月
#show:qingyue:solemn:float
「天子走了，再没回来过。可阿海常跟孙子们说：『那天海边来了好大一支队伍，领头那人站在车上望大海。就那么一回，咱的日子就变了。』」 #speaker:青月
#show:qingyue:calm:float
「你看——『东至于海』这四个字，史书上写得轻。可落在阿海身上，是天子上过他这条海岸，减过他三成的赋，留过他一包盐。德不走出去，就只在竹简上。」 #speaker:青月
#show:qingyue:tease:float
「好啦，万国都来了，山川封禅的大典参加的多得数不过来。可打江山易，理江山难——这么大个天下，光靠你一个人，管得过来吗？」 #speaker:青月
-> c_appoint

=== c_appoint ===
#bg:xuanyuan_court
#bgm:court
#show:qingyue:worry:float
政务如山，万国待治。你独坐案前，一人之力，终究照不到四海每一个角落。 #speaker:青月
一名近侍低声道：「大权最好独揽，君上事必躬亲，方无旁落之忧。贤名再高的外人，也信不得。」 #speaker:近侍
#show:qingyue:tease:float
「哼哼——事事亲力亲为，听着勤政，可一个人能有几双眼、几双手呀？」 #speaker:青月
「圣王治天下，靠的从来不是一个人拼命。」 #speaker:青月

* #correct #hint:置左右大监，监于万国。举风后、力牧、常先、大鸿以治民。 [设左右大监监察万国，举风后、力牧、常先、大鸿以治民]
	-> c_appoint_good
* #correct [大权独揽，事必躬亲，只信身边亲信]
	-> c_appoint_solo
* #correct [与风后闲谈，问他辅佐天子之道]
	-> c_explore_zhitianxia_fenghou
* [将天下分为九州，每州设一牧，各牧其民]
	-> c_appoint_jiuzhou
* #correct [不问出身，广招天下贤才——有才者，皆可入仕]
	-> c_appoint_recruit

=== c_appoint_jiuzhou ===
#show:qingyue:calm:float
「分天下为九州……这想法够大的。」 #speaker:青月
你将天下分为九州，每州设一牧，让他们各自管理自己的州。各州牧有很大的自主权，只要按时朝贡、服从命令就行。 #speaker:青月
起初，这法子很有效——九州各安其位，你不用再事事操心。可时间一长，各州牧渐渐坐大，开始拥兵自重。 #speaker:青月
#show:qingyue:worry:float
「你分出去的是权力，收回来的是离心。九州牧各管各的，慢慢就忘了谁是天子了。」 #speaker:青月
你想收权，却发现已经收不回来了——九州牧势力已成，你一动，他们就反。天下又回到了诸侯纷争的局面。 #speaker:青月
#show:qingyue:sad:float
「史书里的你，是『置左右大监，监于万国』——你不是把权力分出去，是把眼睛放出去。」 #speaker:青月
「你要的不是分权，是监督。九州的想法很好，可时机不对——天下初定，还不是分权的时候。」 #speaker:青月
你虽有远见，却操之过急。共主之统，在你手里又散了。 #death:jiuzhou #speaker:青月
-> END

=== c_appoint_recruit ===
#show:qingyue:smile:float
「广招贤才……这才是王道！」 #speaker:青月
你不问出身，广招天下贤才。不管是贵族还是平民，只要有才，都可以入仕为官。 #speaker:青月
风后、力牧、常先、大鸿……这些人，有的出身低微，却都有治国之才。你用人唯才，天下归心。 #speaker:青月
#show:qingyue:calm:float
「你看，圣王之道，在于用人。你自己再能干，也不如一群能干的人帮你。」 #speaker:青月
你设左右大监，监察万国；举这四位贤臣各司其职，以治万民。百官皆以「云」命名，军队号为「云师」。 #speaker:青月
-> c_appoint_good_from_recruit

=== c_explore_zhitianxia_fenghou ===
#show:qingyue:calm:float
风后捋须道：「天子如天，臣如日月星辰。天不自理万物，使之各安其位；日月代明、星辰布列，万物自生自化。天子之要在择人，不在亲劳。」 #speaker:风后
#show:qingyue:smile:float
「风后这话说得多漂亮——治天下的人，不是最忙的那个，是最会用人那个呀。」 #speaker:青月
#show:qingyue:calm:float
「你听进去了。你设左右大监监察万国，举风后、力牧、常先、大鸿四位贤臣各司其职。这四个人，各有各的本事——风后善谋，力牧善战，常先善治，大鸿善教。」 #speaker:青月
「你让他们各尽其才，自己只抓大方向。这就是『垂衣而治』的道理——衣裳垂下来，不用动手，天下自安。」 #speaker:青月

* [「这四个人……都是从哪里来的？」]
	#show:qingyue:calm:float
	「风后是你在涿鹿之战时发现的人才，力牧是你在大泽边遇到的壮士，常先是神农氏的后人，大鸿是东方的贤者。」 #speaker:青月
	「你不问出身，唯才是举——这就是为什么天下人才都愿意来投奔你。」 #speaker:青月
	-> c_appoint
* [「力牧……他是什么样的人？」]
	#show:qingyue:calm:float
	「力牧是个大力士，传说他能举起千斤重物。不过他不只是蛮力——他还懂兵法，能治军。你让他统帅云师，他训练出来的军队，纪律严明、进退有度。」 #speaker:青月
	「后世说『力牧之政』，就是指他治军有方。你用人，用的是他的才，不是他的力气。」 #speaker:青月
	-> c_appoint
* [「继续说。」]
	-> c_appoint

=== c_appoint_solo ===
你摒退贤才，独揽万机，凡事亲决。可四海之大、万国之众，一人之目终难周览，一人之力终难遍及。近臣壅蔽视听，远方之政日渐荒疏。 #speaker:青月
你还没来得及垂衣而治，就先把自己困死在了案牍之间——这不是治天下的样子。 #speaker:青月
#show:qingyue:tease:float
「欸欸，打住打住！再这么熬下去，圣王要先熬成个账房先生啦。回去，换一种治法？」 #speaker:青月
-> c_appoint

=== c_appoint_good ===
#bg:xuanyuan_court
#bgm:court
#show:qingyue:smile:float
「欸——漂亮！这才是共主的气象。」 #speaker:青月
你设置左右大监，分察万国；举风后、力牧、常先、大鸿四位贤臣，各司其职以治民。百官皆以「云」命名，军队号为「云师」。 #speaker:青月 #hint:官名皆以云命，为云师。置左右大监，监于万国。举风后、力牧、常先、大鸿以治民。
万国和顺，你又获得宝鼎，观象授时，推算节令时日。 #speaker:青月 #hint:获宝鼎，迎日推策。
#show:qingyue:calm:float
「贤人在位，万国和睦。可治天下最深的一层，还不在人事——在天时。」 #speaker:青月
-> c_tianshi

=== c_appoint_good_from_recruit ===
#bg:xuanyuan_court
#bgm:court
#show:qingyue:smile:float
「欸——用人唯才，天下归心！这不就是正史里写的『举风后、力牧、常先、大鸿以治民』嘛。」 #speaker:青月 #hint:官名皆以云命，为云师。置左右大监，监于万国。举风后、力牧、常先、大鸿以治民。
万国和顺，你又获得宝鼎，观象授时，推算节令时日。 #speaker:青月 #hint:获宝鼎，迎日推策。
#show:qingyue:calm:float
「贤人在位，万国和睦。可治天下最深的一层，还不在人事——在天时。」 #speaker:青月
-> c_tianshi

=== c_tianshi ===
#show:qingyue:worry:float
新岁将临，播种在即。农人仰头看你——何时下种，何时兴役，皆听天子号令。 #speaker:青月
可你雄心正盛，欲趁四海慑服之威，大兴土木、广发徭役，以彰天子之功。 #speaker:青月
一位史官叩首谏道：「君上，农时不可夺。逆天时而兴大役，百谷不登，民力必竭啊。」 #speaker:史官
「大役一兴，天子之功百世可见；农时一误，误的不过一岁……」你握着诏书，心里两个声音在打架。 #speaker:黄帝
#show:qingyue:solemn:float
「呐——这一步最要命。是顺着天走，还是逆着天走？」 #speaker:青月

* #correct #hint:顺天地之纪，幽明之占……时播百谷草木，淳化鸟兽虫蛾。 [顺天地之纪，按时令播百谷、化鸟兽，不夺农时]
	-> c_tianshi_good
* [恃威逆天，罢农兴役，大营土木以显功]
	-> c_defy
* #correct [不夺农时，也不大兴土木——先让百姓休养生息，待国力充足再图长远]
	-> c_tianshi_rest
* [与史官商议，如何既能兴役又不夺农时——可否错开农时、分段施工？]
	-> c_tianshi_compromise

=== c_tianshi_rest ===
#show:qingyue:smile:float
「休养生息……这才是治国的正道。」 #speaker:青月
你放下诏书，对史官说：「你说得对。农时不可夺，民力不可竭。先让百姓吃饱饭，再谈别的。」 #speaker:黄帝
你下令免除当年的徭役，让百姓专心耕种。这一年，五谷丰登，万民欢腾。 #speaker:青月
#show:qingyue:calm:float
「你看，天子之功，不在宫殿有多高，而在百姓有多安。」 #speaker:青月
几年后，国力充足，你才开始修建必要的设施——这一次，百姓心甘情愿，没有怨言。 #speaker:青月
你顺应天地之纪、阴阳之占，奉养生送死之制，按时令播种百谷草木，驯化鸟兽虫蛾。 #speaker:青月 #hint:顺天地之纪，幽明之占，死生之说，存亡之难。时播百谷草木，淳化鸟兽虫蛾。
你广察日月星辰之行、水波土石金玉之状，劳心力、勤耳目，节用水火材物，不妄取于天地。 #speaker:青月 #hint:旁罗日月星辰，水波土石金玉，劳勤心力耳目，节用水火材物。
#show:qingyue:calm:float
「你免了当年的徭役，让百姓专心种地——这道令，落到了谁身上呢？」 #speaker:青月
「中原有个农妇，叫阿苗。以前她种地靠看柳树发芽——可柳树发芽了，地里可能还冻着；种子下早了，冻死六成，一家人嚼谷糠熬过饥冬。加上年年有徭役，丈夫被征去修路，地里的活全压在她一个人身上。」 #speaker:青月
#show:qingyue:smile:float
「你免了徭役那年，她丈夫头一回整年都在家。两个人一起翻地、一起播种，秋收时仓里的粮比往年多了一倍。后来你的历官又送来了一块刻着农时的骨片——立春后五日可种麦，惊蛰后若地未暖须再候七日。阿苗照着骨片上的日子种，苗出得齐齐整整。」 #speaker:青月
#show:qingyue:calm:float
「你还教他们驯化鸟兽虫蛾。阿苗在院子里养了六只鸡、三只鸭——鸡下蛋、鸭吃虫，田里虫害少了，院里多了蛋和肉。头一回，她的孩子在生日那天吃到了一个整鸡蛋。」 #speaker:青月
「小家伙捧着蛋，舍不得吃，翻来覆去看了半天，最后还是一口咬下去——那个笑呀，阿苗到现在都记得。」 #speaker:青月
#show:qingyue:solemn:float
「你先养后建，不夺农时——阿苗的丈夫回了家，阿苗的种子没冻死，阿苗的孩子吃到了整鸡蛋。治国治到百姓碗里多了一口粮，这才算落了地。」 #speaker:青月
#show:qingyue:smile:float
「呼——先养后建，不夺农时，百姓安乐。你走了一条与正史殊途同归的路——结局一样，过程更暖。」 #speaker:青月
-> c_end_sage

=== c_tianshi_compromise ===
#show:qingyue:calm:float
「错开农时……这倒是个办法。」 #speaker:青月
你与史官商议，决定将大役分为四季，农忙时停工，农闲时动工。这样既不耽误耕种，又能逐步完成工程。 #speaker:青月
可你低估了工程的规模——一旦开工，就很难停下来。农闲时动工，农忙时停工，工程进度缓慢，百姓却已疲惫不堪。 #speaker:青月
#show:qingyue:worry:float
「你以为错开农时就能两全其美，可百姓的力气不是无穷的。他们需要的是休息，不是换个时间干活。」 #speaker:青月
工程拖了好几年，耗费了大量人力物力，却收效甚微。百姓怨声载道，诸侯也开始离心。 #speaker:青月
#show:qingyue:sad:float
「史书里写的是『顺天地之纪』——不是『错开天地之纪』。天时不可违，民心不可欺。」 #speaker:青月
你想两全其美，却两头都没顾好。共主之德，在你手里打了折扣。 #death:compromise #speaker:青月
-> END

=== c_defy ===
#bg:xuanyuan_court
#bgm:danger
你恃兵威而逆天时，尽发民力大兴土木，夺了农人的播种之期。这一年，百谷不登，草木不生，鸟兽昆虫皆失其序。饥馑遍野，民力枯竭，怨声四起。 #speaker:青月
你能诛蚩尤、逐荤粥，却敌不过一个「逆天时」——天地的法则，比任何刀兵都硬。以土德受命的黄帝之号，你终究没能担起。 #death:defy #speaker:青月
-> END

// ═══ IF线 · 定都（自由模式歧路：营固定都城，止巡狩之制）═══

=== if_dingdu_1 ===
#bg:xuanyuan_court
#bgm:solemn
#show:qingyue:worry:float
「筑一座城，让天下来就你……这一步，史书上没有哦。」 #speaker:青月
你不愿深居享贡，也不愿终身奔波。你大营涿鹿之阿，起一座巍巍都城，令万国岁时来朝于此。 #speaker:青月 #hint:合符釜山，而邑于涿鹿之阿。
#show:qingyue:calm:float
「起初，真好。城郭宫室，钟鼓礼乐，四方使者络绎而来，你不必再风餐露宿了。」 #speaker:青月
可年岁一久，来的都是使者，不再是你亲去。远方的邦国只见你的城、你的贡使名册，却再没见过你的人。 #speaker:青月
#show:qingyue:sad:float
「东海之滨的邦国渐渐忘了天子长什么样。你的德，被一座城墙圈住了，走不出去。」 #speaker:青月
荤粥又扰北疆，你却离得远、动身慢；江湘之邦称疾不至，你在城里也听不真切。 #speaker:青月
#show:qingyue:solemn:float
「史书里的你，是『迁徙往来无常处，以师兵为营卫』——足迹到哪里，德威就到哪里。」 #speaker:青月
「安逸不是罪，可天子一旦坐定了，德就只到城墙为止了呀。」 #speaker:青月
你在这座城里垂衣而治，享了太平，也守成了一个『半个天下的天子』。城越修越美，你的四海，却越缩越小。 #speaker:青月
这不是暴主，只是个安分的守成之君。可上古的共主，是要走出去、让人看见的——你少走的那些路，就是史书上少掉的那些疆土。 #ending:if_dingdu #speaker:青月
-> END

// ═══ IF线 · 立储（自由模式歧路：钦定嫡长，父死子继）═══

=== if_lichu_1 ===
#bg:xuanyuan_court
#bgm:solemn
#show:qingyue:worry:float
「父死子继，嫡长承统……这一步，要比夏启还早一千年哦。」 #speaker:青月
你不肯把天下交给『德』这么虚的东西。你钦定嫡长的玄嚣一脉为储，立下铁律：此后天子之位，父传子、嫡承统。 #speaker:青月
#show:qingyue:calm:float
「你想得很好——名分早定，就没有争夺，天下太平。」 #speaker:青月
可你压下的，是那个有圣德的孙儿高阳。诸侯们看着他之德、看着储君之庸，心里都存了一杆秤。 #speaker:青月
#show:qingyue:sad:float
「德在此，位在彼——你把这两样掰开了。上古之所以能出颛顼、帝喾、尧、舜这一串圣君，靠的正是『有德者承之』呀。」 #speaker:青月
你崩后，嫡长依制而立，可他镇不住那些更服高阳的诸侯。名分是定了，人心却裂了。你亲手关上了那扇『择贤而承』的门。 #speaker:青月
#show:qingyue:solemn:float
「史书里，是『其孙昌意之子高阳立』——天下自己选了有德的那一个。」 #speaker:青月
「你为子孙挣了个铁定的位子，却夺走了他们各凭其德的天命。」 #speaker:青月
夏启的『家天下』，你提前替他行了。太平也许买到了一时，可华夏那条『传贤』的血脉，从你这里就断了苗头。你护住了一姓，误了一段本该更长的圣王之世。 #ending:if_lichu #speaker:青月
-> END

=== c_tianshi_good ===
#bg:taishan_peak
#bgm:solemn
#show:qingyue:smile:float
「呼——顺天者昌。你听懂了天在说什么。」 #speaker:青月
「……是孤心急了。」你把兴役的诏书按回案上，向史官微微颔首，「天时不肯等人，人便不可欺天。」 #speaker:黄帝
你顺应天地之纪、阴阳之占，奉养生送死之制，究存亡治乱之理。按时令播种百谷草木，驯化鸟兽虫蛾。 #speaker:青月 #hint:顺天地之纪，幽明之占，死生之说，存亡之难。时播百谷草木，淳化鸟兽虫蛾。
你广察日月星辰之行、水波土石金玉之状，劳心力、勤耳目，节用水火材物，不妄取于天地。 #speaker:青月 #hint:旁罗日月星辰，水波土石金玉，劳勤心力耳目，节用水火材物。
#show:qingyue:calm:float
「你下的这道令，落到了谁身上呢？中原有个农妇，叫阿苗。她以前种地靠看柳树发芽——可柳树发芽了，地里可能还冻着；种子下早了，冻死六成，一家人嚼谷糠熬过饥冬。」 #speaker:青月
#show:qingyue:smile:float
「后来你的历官刻了一块农时历，送到了她村里。骨片上标着：立春后五日可种麦，惊蛰后若地未暖须再候七日。阿苗不识字，可村里长者认得，照着骨片上的日子安排了播种。」 #speaker:青月
「那年春寒也来得晚，可阿苗没在惊蛰急着下种——她等了七天，等地暖了才种。种子没冻死，苗出得齐齐整整。秋收时仓里的粮比去年多了一倍半。」 #speaker:青月
#show:qingyue:calm:float
「你还教他们驯化鸟兽虫蛾。阿苗在院子里养了六只鸡、三只鸭——鸡下蛋、鸭吃虫，田里虫害少了，院里多了蛋和肉。头一回，她的孩子在生日那天吃到了一个整鸡蛋。」 #speaker:青月
「小家伙捧着蛋，舍不得吃，翻来覆去看了半天，最后还是一口咬下去——那个笑呀，阿苗到现在都记得。」 #speaker:青月
#show:qingyue:solemn:float
「你看——『顺天地之纪，时播百谷草木』，史书上念起来顺口得很。可落在阿苗身上，是一块刻着农时的骨片，是七天的等待没让种子冻死，是孩子头一回吃到整鸡蛋。治国治到百姓碗里多了一口粮，这才算落了地。」 #speaker:青月
-> c_end_sage

=== c_end_sage ===
#bg:xuanyuan_court
#bgm:solemn
#achieve:huangdi_tude
#show:qingyue:solemn:float
「……你看，你没有再动一次刀。」 #speaker:青月
「巡四方以服万国，举贤能以治百姓，顺天时以养万民，节用度以惜物力——这才是垂衣而治呀。」 #speaker:青月
你享有土德的祥瑞——土为中央之色，故天下号你为「黄帝」。 #speaker:青月 #hint:有土德之瑞，故号黄帝。
#show:qingyue:smile:float
「打天下的是刀，治天下的是德。你终于把这两样，都活明白了。」 #speaker:青月
-> c_lineage

=== c_lineage ===
#show:qingyue:calm:float
「欸，临走前，我再替你把这一脉往后接一接——你的故事，其实才刚开个头呢。」 #speaker:青月
你居于轩辕之丘，娶西陵氏之女嫘祖为正妃。她相传是教人养蚕缫丝的那一位。 #speaker:青月 #hint:黄帝居轩辕之丘，而娶于西陵之女，是为嫘祖。

* [「嫘祖……她是个什么样的人？」]
	-> c_lineage_leizu
* [「我还有其他妃子吗？」]
	-> c_lineage_feizi
* [「继续说。」]
	-> c_lineage_next

=== c_lineage_leizu ===
#show:qingyue:calm:float
「嫘祖呀，是个很了不起的女人。她不仅是你的妻子，还是第一个教人养蚕缫丝的人。」 #speaker:青月
「有了蚕丝，人们才有了温暖的衣裳——这可是惠及后世的大功劳呢。」 #speaker:青月
#show:qingyue:smile:float
「传说有一天，她在桑树下小憩，看见蚕吐丝结茧。她灵机一动：这丝能不能织成布？」 #speaker:青月
「她试了无数次，手指被热水泡得发白，被蚕丝割出一道道细口。可她终于织出了第一匹丝绸——那光泽温润如玉，轻柔如风。」 #speaker:青月

* [「轩辕……也就是我，对她好吗？」]
	#show:qingyue:calm:float
	「你呀……你对她敬重有加。她不仅是你的妻子，还是你的贤内助。」 #speaker:青月
	「她把养蚕缫丝之法教给族中女子，让有熊氏的妇人都有了一技之长。你巡视天下的时候，她替你守着后方，从无差错。」 #speaker:青月
	-> c_lineage_next
* [「继续说。」]
	-> c_lineage_next

=== c_lineage_feizi ===
#show:qingyue:tease:float
「当然有啦~ 你有四妃：嫘祖、女节、彤鱼氏、嫫母。她们各有各的本事。」 #speaker:青月
「嫫母虽然貌丑，却很有德行——你立她为『方相氏』，让她主持祭祀，驱邪避灾。」 #speaker:青月
#show:qingyue:calm:float
「女节是方雷氏之女，聪慧贤淑；彤鱼氏善于烹饪，据说最早教人用火烤鱼吃的就是她。」 #speaker:青月
「你看，你选妃子不是只看容貌，而是看德行和才能。这才是圣王的度量呀。」 #speaker:青月

* [「嫫母真的长得很丑吗？」]
	#show:qingyue:tease:float
	「传说她『锤额顣頞，形簏色黑』——额头突出，鼻梁塌陷，皮肤黝黑。按当时的审美，确实不算好看。」 #speaker:青月
	「可你不在乎。你说『重美貌轻德行者，非圣王所为』。你娶她，是因为她贤德。」 #speaker:青月
	-> c_lineage_next
* [「继续说。」]
	-> c_lineage_next

=== c_lineage_next ===
嫘祖为你生下两子：一曰玄嚣，降居江水；一曰昌意，降居若水。他们的后代，都将据有天下。 #speaker:青月 #hint:嫘祖为黄帝正妃，生二子，其后皆有天下。
#show:qingyue:worry:float
「昌意娶蜀山氏之女，生下高阳，这孩子有圣德。你的儿孙里，论德，数他最厚。」 #speaker:青月 #hint:昌意娶蜀山氏女……生高阳，高阳有圣德焉。
「呐，临了还有一道题——你要立个储君吗？是钦定嫡长的玄嚣一脉，还是……由着有德者自己立起来？」 #speaker:青月

* #correct #hint:黄帝崩，其孙昌意之子高阳立——不钦定，让有圣德者承之。 [不预立储。你把天下交给『德』，谁有圣德，天下自会归他]
	-> c_lineage_shishi
* #correct [钦定嫡长玄嚣为储，立下父死子继、嫡长承统的定制]
	-> if_lichu_1
* #correct [不立储，也不指定——让诸侯们自己推举有德者]
	-> c_lineage_vote
* [立高阳为储——他有圣德，理应承统]
	-> c_lineage_gaoyang

=== c_lineage_vote ===
#show:qingyue:calm:float
「让诸侯推举……这倒是个新鲜主意。」 #speaker:青月
你不立储，也不指定继承人——你让诸侯们自己推举有德者。诸侯们商议良久，最终推举了高阳。 #speaker:青月
高阳有圣德，诸侯心服。你点头应允——这与正史的结局一样，只是过程不同。 #speaker:青月
#show:qingyue:smile:float
「你看，不管过程怎么走，有德者终会承统。这就是『天命』的意思——不是天选的，是人选的。」 #speaker:青月
-> c_lineage_shishi

=== c_lineage_gaoyang ===
#show:qingyue:worry:float
「立高阳为储……这倒是符合他的德行。」 #speaker:青月
你直接立高阳为储，可这引起了玄嚣一脉的不满——他们认为嫡长才是正统，你凭什么跳过玄嚣，立他的儿子？ #speaker:青月
玄嚣一脉势力不小，他们暗中联络诸侯，试图推翻你的决定。你虽压下了不满，却也埋下了隐患。 #speaker:青月
#show:qingyue:sad:float
「你以为立有德者就能安定天下，可你忘了——名分也是天下的一部分。」 #speaker:青月
「史书里写的是『其孙昌意之子高阳立』——不是你立的，是天下自己选的。你硬立，反而伤了和气。」 #speaker:青月
你崩后，高阳虽立，却与玄嚣一脉势同水火。天下虽安，却多了一分裂痕。 #death:gaoyang #speaker:青月
-> END

=== c_lineage_shishi ===
#show:qingyue:solemn:float
「你没有钦定。日后你崩葬桥山，继你而立的，正是那个有圣德的孙儿——帝颛顼。」 #speaker:青月 #hint:黄帝崩，葬桥山……其孙昌意之子高阳立，是为帝颛顼也。
#actclear:huangdi_zhitianxia_act
#show:qingyue:tease:float
「最后一关——太史公写你『崩葬桥山』，这段竹简，你认得全吗？」 #speaker:青月
#minigame:bamboo:1:4:5
{ mg_result == "win":
	#show:qingyue:smile:float
	「{mg_score} 分，竹简归序，黄帝崩葬桥山的原文，你全认下了。」 #speaker:青月
- else:
	#show:qingyue:sigh:float
	「简序暂乱也无妨，垂衣治天下的道理，你心里已经明白了。」 #speaker:青月
}
#show:qingyue:smile:float
「呼——你走完了黄帝这一程。下一世，我们去看高阳如何『依鬼神以制义』，好不好呀？」 #speaker:青月 #ending:canon #quiz:quiz_zhitianxia_tianshi
-> END
