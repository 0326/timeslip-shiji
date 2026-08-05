// ═══════════════════════════════════════════════
// 帝尧 · 尧舜禅让 · 传贤不传子
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════


-> c_open

=== c_open ===
#bg:yao_court_alt2
#bgm:solemn
#show:qingyue:solemn:float
「呐……你见过要落山的太阳吗？」 #speaker:青月
「就是现在这样——满天的光，都开始一寸寸往回收了。这一世，你是放勋，世人唤作尧。在位七十年，德被四海——如今，你老了。」 #speaker:青月
你抬起手，是一双布满老年斑的手。殿外，四岳垂手侍立。你在位七十载，天下大治，可你也已年近百岁。 #speaker:青月
一个问题，压在心口二十年，今日绕不过去了：这天下，往后交给谁？ #speaker:青月
#show:qingyue:worry:float
「呐，划重点——你有个儿子，叫丹朱。可这天下最难的一道题，恰恰就落在这父子之间了。」 #speaker:青月
-> c_danzhu

=== c_danzhu ===
#show:danzhu:proud:right
丹朱来向你请安。他是你的长子，天生贵胄，却傲慢好争、嬉游无度——四岳提起他，都只是摇头。 #speaker:青月 #hint:尧知子丹朱之不肖，不足授天下。
「父亲，」他一开口，眼里全是亮晶晶的算计，「儿臣新赢了一局棋。您说，这天下这么大一盘棋，往后……总该轮到儿臣执子了吧？」 #speaker:丹朱
你看着他，看了很久，缓缓道：「丹朱啊——天下，不是棋盘。输了，是可以不认、再来一局的么？」 #speaker:尧
他怔了怔，似懂非懂，行了礼，退出殿去。他到底没听懂你话里的意思。 #speaker:青月
你也听说了另一个名字：舜。一个起于微贱的孝子，历山让畔、雷泽让居，所到之处人心向善。 #speaker:青月
#show:qingyue:solemn:float
「传子，还是传贤？这四个字，够压弯一个圣人的脊梁。」 #speaker:青月
「可你也不能只凭传闻就把天下给出去呀——那舜，到底当不当得起？」 #speaker:青月
-> c_test

=== c_test ===
#hide:danzhu
#show:qingyue:tease:float
「唔——要托天下这么大的事，光看名声可不够。得试试他，看他到底几斤几两，看看……天意收不收他。」 #speaker:青月

* #correct #hint:令舜摄行天子之政，荐之于天——先让他代行政事、观其成败，再问天命。 [使舜代行天子之政，遍历庶务、深入山林，以观其能、以卜天命]
	-> c_test_pass
* #correct [问舜：摄政三事，你觉最难的是哪一桩？]
	-> c_explore_test_hardest
* [他名声既好，何须再试——直接下诏，立舜为嗣]
	-> c_rush

=== c_rush ===
你未加考较，便要把天下托付给一个只在传闻里的人。四岳愕然，诸侯疑虑：天子之位岂能凭一时之名轻授？ #speaker:青月
名不副实的风险、群臣不服的隐患，一并压了下来。托付天下，从来不是一句诏令的事。你太急了。 #death:rush #speaker:青月
-> END

=== c_test_pass ===
#hide:danzhu
你备好车驾，命舜代行天子之政——先理五典，再总百官，最后，送他独入大麓。 #speaker:青月
#bg:great_forest
#bgm:danger
你让舜代行天子之政：他理五典，五典能从；他总百官，百官时序；他宾于四门，四门穆穆。 #speaker:青月 #hint:舜得举用事，尧使摄行天子政。
末了，你命他独入大麓——那片雷雨迷障的深山。烈风雷雨骤起，天地昏黑。 #speaker:青月
#show:qingyue:solemn:float
你屏息等着。良久，那个身影从林中稳稳走出，衣袂沾雨，神色不迷。 #speaker:青月 #hint:舜入于大麓，烈风雷雨不迷。
「……你看见了吗？」 #speaker:青月
「暴风雷雨都乱不了他的心。这一刻，你才真正知道——他，足以授天下。」 #speaker:青月 #hint:尧乃知舜之足授天下。
-> c_choice

=== c_choice ===
#bg:yao_court
#bgm:solemn
考较已毕。舜样样都成，天命也似有所归。可当你提笔要定这天下之主，丹朱的脸，又浮上心头。 #speaker:青月
他是你的亲生骨肉。为父者，谁不想把最好的留给自己的孩子？ #speaker:青月
#show:qingyue:solemn:float
「呐，这是最狠的一道题。」 #speaker:青月
「授舜，则天下得其利，而丹朱一人受损；授丹朱，则天下受害，而丹朱一人得利。」 #speaker:青月 #hint:授舜则天下得其利而丹朱病；授丹朱则天下病而丹朱得其利。
「天下的公，还是一人的私——帝尧，你选哪个？」 #speaker:青月

* #correct #hint:终不以天下之病而利一人——宁负一子，不负天下。 [「终究不能让天下受害，而只让一个人得利。」——你亲手负了自己的骨肉，把天下授予舜]
	-> c_hand_shun
* #correct [召丹朱与舜同殿，当面比较——最后看一眼，再定]
	-> c_explore_choice_compare
* [「他到底是我的骨血。」——立丹朱为嗣，名正言顺，父子团圆，谁又能真说个不字？]
	-> c_hand_danzhu
* [父子天下两难，你迟迟不定，把册立之事一再拖延]
	-> c_waver
* #correct [授舜天下，却也厚封丹朱一方——让贤子共处，你想两全]
	-> if_bingfeng_1

// ═══ 探索节点 · 尧舜禅让 ═══

=== c_explore_test_hardest ===
#bg:yao_court
#bgm:court
#show:shun:calm:center
#show:qingyue:calm:float
你没有直接让他摄政，先问了他一个问题：「五典、百官、四门——这三样，你觉得最难的是哪一桩？」 #speaker:尧
舜想了想，答道：「四门。」 #speaker:舜
「五典是治家，家是熟的——再难，也不过是自家人的心。百官是治事，事有规矩——只要法子对，总能理顺。」 #speaker:舜
「可四门不一样。四方来的人，各有各的心思，各有各的诉求。你让他们满意了这边，那边又不服。开门容易，让进来的人都觉得被听见了——难。」 #speaker:舜
#show:qingyue:tease:float
「你看——他不是在说官话。他真想过这些事。」 #speaker:青月
「一个从历山走出来的农夫，能把天下的难处看到这个份上——你觉得，他还用再试吗？」 #speaker:青月

* #correct [问：那大麓呢？你怕不怕？]
	#show:qingyue:solemn:float
	「舜说：『怕。山林川泽里的风雨，不是人能抗的。可臣想——天子之位，不就是在风雨里走直路吗？走不直，就别坐那个位子。』」 #speaker:青月
	「你看——他不是不怕，是怕了还肯走。这就叫『暴风雷雨不迷』——迷的不是路，是心。心不迷，路就不会迷。」 #speaker:青月
	-> c_test
* #correct [问明白了，回去决断]
	-> c_test

=== c_explore_choice_compare ===
#bg:yao_court
#bgm:court
#show:qingyue:calm:float
你做了一个出人意料的决定——召丹朱与舜同殿，当着群臣的面，让他们各自说一句治天下的想法。 #speaker:青月
丹朱先开口，语气轻佻：「治天下？让诸侯交粮、交人，谁不听话就打。天下还不简单？」 #speaker:丹朱
舜沉默了一会儿，才缓缓道：「臣不知治天下该怎么做。臣只知道——历山的人争地，臣让了，他们就不争了。雷泽的人争渔，臣让了，他们也不争了。天下也许也是一样：让得够多，争的就少了。」 #speaker:舜
#show:qingyue:tease:float
「你看——一个说打，一个说让。这就是丹朱和舜的差别。」 #speaker:青月
「不是聪明不聪明，是看天下的眼光不一样。一个往下看，看到的是人；一个往上看，看到的是棋子。」 #speaker:青月

* #correct [再问丹朱：你觉得舜说得对吗？]
	#show:qingyue:calm:float
	「丹朱嗤笑：『让？让到什么时候？天下是让出来的，那还要天子做什么？』」 #speaker:青月
	「舜没有反驳，只是看了丹朱一眼，轻声说：『天子不是来拿的，是来给的。』」 #speaker:青月
	#show:qingyue:solemn:float
	「一句话，就把两个人的高下分出来了。你心里，已经有答案了吧？」 #speaker:青月
	-> c_choice
* #correct [看清楚了，回去决断]
	-> c_choice

=== if_bingfeng_1 ===
#bg:yao_court
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你把天下授了舜——这一步，和史书一样。可你到底没舍得丹朱，又厚封他一方之地，兵民自具，几近一国。 #speaker:尧
你想两全：天下归贤，骨肉也不至于孤零。 #speaker:青月
#show:danzhu:proud:right
你崩后，舜践天子之位。可丹朱据着你留给他的封土，自恃先帝长子，不肯真心臣服。 #speaker:青月
#show:qingyue:solemn:float
天下于是有了两个中心：一个是众望所归的舜，一个是名分未净的丹朱。诸侯私下里，也悄悄分了两拨。 #speaker:青月
#show:qingyue:sad:float
「史上的尧把丹朱放到丹渊、只当个寻常诸侯，不给他一点凭恃。为什么？」 #speaker:青月
「因为他懂：传贤这件事，最怕留一条『传子』的尾巴。你留的这一方厚土，就是那条尾巴。」 #speaker:青月
「舜够贤，压得住这一时。可你亲手埋下的这点分立之势，迟早要有人拿它做文章。」 #speaker:青月
你两全了父子，却没能两全天下。禅让这杆秤，被你悄悄压偏了一分。 #ending:if_bingfeng #speaker:青月
#hide:danzhu
-> END

=== c_hand_danzhu ===
#show:danzhu:proud:right
你终究没能越过那点私情，把天下交到了丹朱手里。 #speaker:青月
可丹朱不肖：狱讼者不服，讴歌者不归，诸侯离心。天下因一人之私而受害，四海失望，你毕生经营的太平，从你手上开始崩坏。 #speaker:青月 #hint:授丹朱则天下病而丹朱得其利。
你以天下之病，利了一人。史书上那个「传贤不传子」的圣王，从此不是你了。 #death:private #speaker:青月
#hide:danzhu
-> END

=== c_waver ===
父子难断，你把册立一再拖延。可天子之位一日不定，人心便一日惶惶：群臣观望，诸侯揣度，政令渐渐没了准头。 #speaker:青月
天命人心，最厌犹疑。你的迟疑没有换来两全，只换来了朝纲松动、四方浮议。托付天下需要的，从来不只是德，还有决断。 #death:waver #speaker:青月
-> END

=== c_hand_shun ===
#bg:yao_court
#bgm:court
#show:shun:calm:center
「授舜。」你只说了两个字，像放下了一副挑了七十年的担子。 #speaker:尧
「终不以天下之病，而利一人。」 #speaker:尧 #hint:尧曰：终不以天下之病而利一人。 #impact:impact_shanrang_tianxiaweigong #quiz:quiz_shanrang_tianxiaweigong
你越过了为父的私心。你举舜于上天，令他摄行天子之政，二十八载而后你崩。 #speaker:青月 #hint:尧辟位凡二十八年而崩。
#show:qingyue:sad:float
你去世那日，百姓悲哀，如丧父母。三年之中，四方莫举乐，人人思念着你这位放勋。 #speaker:青月 #hint:百姓悲哀，如丧父母。三年，四方莫举乐，以思尧。
「……看，天下记得你。」 #speaker:青月
-> c_avoid

=== c_avoid ===
#bg:nanhe
#bgm:peaceful
你的魂魄尚在人间，看着接下来发生的事。三年丧毕，舜做了一件出人意料的事—— #speaker:青月
他没有径直登位，反而把帝位让给了你的儿子丹朱，自己避居到南河之南。 #speaker:青月 #hint:舜让辟丹朱于南河之南。
#show:qingyue:worry:float
「唔……舜把位子又推回给了丹朱。这一让，天下会认谁呢？」 #speaker:青月
「若你在天有灵，此刻，你盼着人心归向哪一个？」 #speaker:青月

* #correct #hint:诸侯朝觐者不之丹朱而之舜——天与之，人与之。 [你盼天下自择其主：谁得人心，谁承天命]
	-> c_end_shanrang
* #correct [你到底盼着骨血承嗣：愿人心念着旧恩，重归丹朱]
	-> if_siqing_1

=== if_siqing_1 ===
#bg:nanhe
#bgm:solemn
#show:qingyue:worry:float
「欸？这一念……史书上没有哦。」 #speaker:青月
你在天有灵，到底盼着自己的骨血。你默默祝祷：愿天下人念着尧的旧恩，回到丹朱身边去。 #speaker:青月
#show:qingyue:solemn:float
可你看着看着，就静了下来。 #speaker:青月
朝觐的诸侯，还是不去丹朱那里，去了舜那里；打官司的、讴歌的，一个个,都绕过了丹朱。 #speaker:青月 #hint:诸侯朝觐者不之丹朱而之舜。
#show:shun:calm:center
天下用它自己的脚，替你把那点私心，轻轻推开了。 #speaker:青月
#show:qingyue:sad:float
「你活着的时候，亲手把天下让给了贤者；可到底，心里还留着一个做父亲的念想。」 #speaker:青月
「这一点私，不损你分毫——史上的尧，未必就没有过。他了不起的地方，不是从没动过这个念，是动过，也没让它做数。」 #speaker:青月
你的私心，天下没有应许。而正因它没有应许，你才成全了那句『终不以天下之病而利一人』。 #speaker:青月
最后一程，你输给了自己的私心，也赢在了这份输——天下，终究择了贤。 #ending:if_siqing #speaker:青月
#hide:shun
-> END

=== c_end_shanrang ===
#bg:nanhe
#bgm:solemn
#achieve:yao_shanrang
天下用它自己的脚，做出了选择—— #speaker:青月
朝觐的诸侯不去丹朱那里，去了舜那里；打官司的不去丹朱那里，去了舜那里；讴歌的人不歌丹朱，只歌舜。 #speaker:青月 #hint:诸侯朝觐者不之丹朱而之舜，狱讼者不之丹朱而之舜，讴歌者不讴歌丹朱而讴歌舜。
#show:shun:calm:center
舜仰望苍天，只说了一个字：「天也。」而后回到中原，践天子之位——是为帝舜。 #speaker:舜 #hint:舜曰：天也。夫而后之中国践天子位焉，是为帝舜。
#show:qingyue:solemn:float
「……『终不以天下之病而利一人。』」 #speaker:青月
「这一句，是《史记》开篇最响的一声。天下为公，不以一姓之私，害天下之公。」 #speaker:青月 #hint:终不以天下之病而利一人。
#show:qingyue:smile:float
「呼——你走完了帝尧的这一程。看懂了吗？他不是不爱丹朱，是把这份爱，让给了更大的一份。」 #speaker:青月
「传贤不传子——从你开始，天下第一次，成了天下人的天下。」 #speaker:青月 #ending:canon
#hide:shun
-> END
