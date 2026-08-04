// ═══════════════════════════════════════════════
// 虞舜 · 禅位于禹 · 南巡崩于苍梧 · 二妃泣竹
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

-> c_open

=== c_open ===
#bg:gui_river
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又是你呀！这一回穿越来的你，我认得。」 #speaker:青月
「还记得那个被亲爹烧、被弟弟埋、却始终没改一分孝心的年轻人吗？如今，他老了。」 #speaker:青月
你睁开眼。铜镜里，鬓已如霜。你是重华，世人唤作舜——你受尧之禅而有天下，如今已在帝位上三十九年。 #speaker:青月
#show:shun:aged:center
你想起当年历山下的泥土、妫水边的琴。一路走来，你把「德」二字，活成了天下的样子。 #speaker:青月
#show:qingyue:calm:float
「你这一世最难的关，不在少年，在此刻——一个圣人，要如何谢幕？」 #speaker:青月
-> c_heir

=== c_heir ===
#bg:yushun_court
#bgm:court
#show:shangjun:idle:right
你的儿子商均立在阶下。他不坏，只是……平庸。治水，他不通；理民，他无能；你说的话，他半懂不懂。 #speaker:青月 #hint:舜子商均亦不肖。
#show:qingyue:worry:float
「你看着他，是不是想起了当年的丹朱？」 #speaker:青月
「尧有九个男儿，偏不传丹朱，把天下给了你这个种田的鳏夫。如今轮到你了——你也有一个不成器的儿子。」 #speaker:青月
天下之重，该托给谁？是这血脉相连的商均，还是那个九年治平洪水、令天下改观的人——禹？
#show:qingyue:tease:float
「呐，划重点：这一步，尧替你走过一遍了。你，会怎么走？」 #speaker:青月

* #correct #hint:舜乃豫荐禹于天——效尧之禅贤，不以天下私一子。 [不传子。你要在生前，就把禹荐于上天，使他摄行天子之政]
	-> c_recommend_yu
* [商均是你的血脉。天下这样大，交给自家骨肉，才放得下心]
	-> c_pass_son

=== c_pass_son ===
#bg:yushun_court
#bgm:danger
你立商均为嗣，把天子之政交到他手上。你想：他会慢慢学会的。
可洪水初定，百业待兴，商均镇不住四方。诸侯朝觐，渐渐绕过他，去请教禹；狱讼争端，无人再听商均的裁断。 #speaker:青月 #hint:天下归舜而不归商均。
你用一生修来的太平，在你亲手所传的儿子手里，一寸寸散了。 #speaker:青月
你到底没懂尧当年那句话——传子之私，与天下之公，只能择一。 #death:passson #speaker:青月
#hide:shangjun
-> END

=== c_recommend_yu ===
#hide:shangjun
#bg:yushun_court
#bgm:court
#show:yu:respectful:center
你召来禹。这个人，当年他的父亲鲧治水九年无功而被诛，他却不避嫌、不记怨，躬身接过治水之任——三过家门而不入，终于导九川、平洪水，令天下重归可居。 #speaker:青月 #hint:舜举禹治水，九州攸同。
「禹啊，」你说，「天命不常，唯德是辅。我老了。今荐你于天，摄行天子之政——你可愿担这天下？」 #speaker:舜
禹伏地再拜，不敢当，却终究应下。 #speaker:青月
#show:qingyue:smile:float
「欸——漂亮！跟尧一个样！」 #speaker:青月
「传贤不传子，这四个字，你和尧，前后接力，替华夏立下了一条天大的规矩。」 #speaker:青月
-> c_south

=== c_south ===
#bg:yushun_court
#bgm:solemn
禹既摄政，政通人和。你却觉出自己身上的力气，一天天在退。 #speaker:青月
天下初定，南方三苗新服，山川险远，教化未通。你想起黄帝当年也曾南至江、登熊湘——为天子者，当亲抚四方。 #speaker:青月
#show:qingyue:worry:float
「可你年事已高啊。苍梧路远，瘴疠丛生……这一趟南巡，凶多吉少哦？」 #speaker:青月
案上，是娥皇、女英为你缝的行囊。她们从妫水陪你到如今，鬓也白了。

* #correct #hint:舜南巡狩，崩于苍梧之野——功成身退，鞠躬尽瘁，死而后已。 [去。天子当巡狩四方，抚南疆而后无憾。此身已许天下]
	-> c_farewell
* [恋此帝位与安逸，称病不出，留在都城颐养天年]
	-> c_cling
* [天下已付于禹——效尧辟位，不南巡了。归妫汭，返历山，做回一个农人]
	-> if_guitian_1

=== c_cling ===
#bg:yushun_court
#bgm:danger
你留了下来。既已荐禹于天，却又贪恋天子之尊，迟迟不肯放手，亦不肯尽巡狩之责。 #speaker:青月
禹摄政而你在上，名分不明，政令两出。诸侯观望，人心生疑——那个「载天子旗、往朝瞽叟、夔夔唯谨」的舜，那个把天下看得比自己重的舜，渐渐模糊了。 #speaker:青月 #hint:夔夔唯谨，如子道。
恋栈者，天命去之。你以一生成就的圣名，晚节难全。 #death:cling #speaker:青月
#hide:yu
-> END

=== c_farewell ===
#bg:gui_river
#bgm:peaceful
#show:ehuang:gentle:left
#show:nvying:gentle:right
临行，娥皇、女英来送你。这两位尧的女儿，当年下嫁给你这个鳏夫，与你共历焚廪穿井之险，一路走了几十年。 #speaker:青月
#show:qingyue:worry:float
「她们的鬓也白了，还在替你缝行囊。这一程山高水长……你要让她们留下，还是带她们同行？」 #speaker:青月

* #correct #hint:二妃未从南巡——史书里，这一别，便是永诀。 [「你们在家等我。」——独行赴南，不教她们涉此险途]
	-> c_farewell_go
* [她们陪你从妫汭走到了今天——这最后一程，带她们同行]
	-> if_xiesui_1

=== c_farewell_go ===
「此去苍梧，山高水长。你们……在家等我。」你握着她们的手，一如年轻时。 #speaker:舜
#show:qingyue:sad:float
「她们不知道，」青月轻声，「这一别，就是永诀了。」 #speaker:青月
-> c_cangwu

=== c_cangwu ===
#bg:cangwu_ye
#bgm:solemn
南巡的路，比你想的更远。你越过大江，穿过苍莽的南疆，抚三苗、宣德教、问疾苦。车马辚辚，你的身子却愈发沉了。 #speaker:青月
终于，到了苍梧之野。暮色四合，群山无言。你在这片陌生的南土上，停住了脚步。 #speaker:青月 #hint:践帝位三十九年，南巡狩，崩于苍梧之野。
#show:shun:aged:center
你回望北方——历山的田、妫水的琴、平阳的殿、还有两个白发的人。你这一生，从一个差点被烧死埋死的孝子，走成了天下共主。而今，你要在这里，把最后一口气，还给你所爱的天下。 #speaker:青月
#show:qingyue:solemn:float
「……舜，葬于江南九疑，是为零陵。」青月的声音很轻，像怕惊了什么。 #speaker:青月 #hint:葬于江南九疑，是为零陵。
你安睡在九疑山下。禹依你之愿，三年丧毕，又效你让尧子之礼，让位于商均；诸侯却尽归于禹——禹这才践天子之位。传贤之统，由你之手，交到了下一程。 #speaker:青月 #hint:三年丧毕，禹亦乃让舜子，如舜让尧子。诸侯归之，然后禹践天子位。
-> c_bamboo

=== c_bamboo ===
#bg:xiang_bamboo
#bgm:solemn
#show:ehuang:weeping:left
#show:nvying:weeping:right
北方，娥皇、女英听闻舜崩于苍梧。 #speaker:青月
两位夫人一路南奔，寻到湘水之滨，却只见青山、只闻流水，再也等不回那个握过她们手的人。她们抱竹而泣，泪如雨下——泪珠溅上翠竹，竟在竹上洇成点点斑痕。 #speaker:青月
#show:qingyue:sad:float
「后人说，那便是湘妃竹的由来。」青月垂下眼，「——这一段，是传说，不是史笔。可我愿意信它。」 #speaker:青月
「因为它替史书，说出了那句没写的话：一个把天下扛了一辈子的人，也曾被人这样深深地爱着、这样痛彻地想念着。」 #speaker:青月
-> c_end_sage

=== c_end_sage ===
#bg:jiuyi_shan
#bgm:solemn
#achieve:shun_chanrang
#show:qingyue:solemn:float
「你走完了他的一生。」 #speaker:青月
「从历山的孝子，到苍梧的孤坟。烧过他、埋过他的人，他以德报之；血脉相连的儿子平庸，他忍私传贤；帝位在手，他功成而身退，死在了巡行的路上。」 #speaker:青月
尧传舜，舜传禹——两代圣王，都没把天下留给自己的儿子。「传贤不传子」这条规矩，自此立在了华夏文明的开篇。 #speaker:青月 #hint:自黄帝至舜、禹……以章明德。
#show:qingyue:smile:float
「呼——看懂了吗？他这一生，得于德，也终于德。」 #speaker:青月
「而湘水边那两竿泣血的斑竹，是史书之外，天地替他留的一滴眼泪呀。」 #speaker:青月 #impact:impact_chanyu_shanrangzhi #ending:canon #quiz:quiz_chanyu_shanrangzhi
#hide:shun
#hide:yu
#hide:ehuang
#hide:nvying
-> END

// ═══ IF线 · 归耕历山（自由模式歧路：效尧辟位，不南巡而归田）═══

=== if_guitian_1 ===
#bg:gui_river
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你把符玺留给了禹，也把巡狩的车驾留在了都城。当年尧辟位之后，安居二十八年——你想，你也可以。 #speaker:青月 #hint:尧辟位凡二十八年而崩。
你带着娥皇、女英回了妫汭。历山的田还在。你重新握起耒耜，掌上的老茧，竟还记得五十年前的位置。 #speaker:青月
#show:qingyue:calm:float
「乡人只当你是个还乡的老者。你耕的那一畦，邻人照旧让畔——他们说不上来为什么，就是想让。」 #speaker:青月
你在妫水边终老，二妃执手送你，葬在历山脚下。没有苍梧的孤坟，没有湘水边泣血的斑竹。 #speaker:青月
#show:qingyue:sad:float
「团圆了呀。可是——南方呢？」 #speaker:青月
三苗新服而教化未通，天子的车驾，终究没有到过大江以南。后来，禹只得以干戈往——你用一世修起来的德化，最南只走到了大江为止。 #speaker:青月
你把最后一段路留给了自己。南方的风里，从此少了一位走来的圣人。 #ending:if_guitian #speaker:青月
#hide:shun
#hide:yu
-> END

// ═══ IF线 · 偕行苍梧（自由模式歧路：携二妃同赴南巡）═══

=== if_xiesui_1 ===
#bg:cangwu_ye
#bgm:solemn
#show:qingyue:worry:float
「欸？带上她们……史书上，可没有这一页哦。我也是第一次看。」 #speaker:青月
你到底没有松开那两只手。车驾南行，娥皇捧着药囊，女英添着炉火——瘴雨蛮烟的路，因为有人同行，竟也走得动了。 #speaker:青月
你抚三苗、宣德教，一站一站往南。只是身子骗不了人：到了苍梧之野，你还是停下了脚步。 #speaker:青月
#show:ehuang:weeping:left
#show:nvying:weeping:right
这一次，她们就在你的榻前。你握着她们的手闭上眼，像睡着了一样。 #speaker:青月
#show:qingyue:sad:float
「没有永诀，没有寻不到的坟。她们亲手葬你于九疑，守着山，一直守到白头。」 #speaker:青月
「湘水边，从此不会有泣血的斑竹了。后人路过零陵，只看见两位守坟的老妇人——没有传说，只有余生。」 #speaker:青月
#show:qingyue:solemn:float
「我说不好哪一种更好呀。让她们等成一场空，还是让她们亲眼看着你走——这道题，史书也没有答案。」 #speaker:青月
你把最后一程给了她们。代价是，她们要用整个余生，守着这一程的尽头。 #ending:if_xiesui #speaker:青月
#hide:ehuang
#hide:nvying
-> END
