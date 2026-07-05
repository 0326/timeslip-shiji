// ═══════════════════════════════════════════════
// 帝尧 · 尧舜禅让 · 传贤不传子
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR tested = false

-> c_open

=== c_open ===
#bg:yao_court
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一缕魂飘到我这儿啦！这一回可不得了，坐稳咯~」 #speaker:青月
「这一世，你是放勋，世人唤作尧。在位七十年，德被四海——如今，你老了。」 #speaker:青月
#show:yao:solemn:center
你抬起手，是一双布满老年斑的手。殿外，四岳垂手侍立。你在位七十载，天下大治，可你也已年近百岁。 #speaker:青月
一个问题，压在心口二十年，今日绕不过去了：这天下，往后交给谁？ #speaker:青月
#show:qingyue:worry:float
「呐，划重点——你有个儿子，叫丹朱。可这天下最难的一道题，恰恰就落在这父子之间了。」 #speaker:青月
-> c_danzhu

=== c_danzhu ===
#show:danzhu:proud:right
丹朱来向你请安。他是你的长子，天生贵胄，却傲慢好争、嬉游无度——四岳提起他，都只是摇头。 #speaker:青月 #hint:尧知子丹朱之不肖，不足授天下。
你也听说了另一个名字：舜。一个起于微贱的孝子，历山让畔、雷泽让居，所到之处人心向善。 #speaker:青月
#show:qingyue:solemn:float
「传子，还是传贤？这四个字，够压弯一个圣人的脊梁。」 #speaker:青月
「可你也不能只凭传闻就把天下给出去呀——那舜，到底当不当得起？」 #speaker:青月
-> c_test

=== c_test ===
#show:qingyue:tease:float
「唔——要托天下这么大的事，光看名声可不够。得试试他，看他到底几斤几两，看看……天意收不收他。」 #speaker:青月

* #correct #hint:令舜摄行天子之政，荐之于天——先让他代行政事、观其成败，再问天命。 [使舜代行天子之政，遍历庶务、深入山林，以观其能、以卜天命]
	~ tested = true
	-> c_test_pass
* [他名声既好，何须再试——直接下诏，立舜为嗣]
	-> c_rush

=== c_rush ===
你未加考较，便要把天下托付给一个只在传闻里的人。四岳愕然，诸侯疑虑：天子之位岂能凭一时之名轻授？ #speaker:青月
名不副实的风险、群臣不服的隐患，一并压了下来。托付天下，从来不是一句诏令的事。你太急了。 #death:rush #speaker:青月
-> END

=== c_test_pass ===
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
#show:yao:solemn:center
考较已毕。舜样样都成，天命也似有所归。可当你提笔要定这天下之主，丹朱的脸，又浮上心头。 #speaker:青月
他是你的亲生骨肉。为父者，谁不想把最好的留给自己的孩子？ #speaker:青月
#show:qingyue:solemn:float
「呐，这是最狠的一道题。」 #speaker:青月
「授舜，则天下得其利，而丹朱一人受损；授丹朱，则天下受害，而丹朱一人得利。」 #speaker:青月 #hint:授舜则天下得其利而丹朱病；授丹朱则天下病而丹朱得其利。
「天下的公，还是一人的私——帝尧，你选哪个？」 #speaker:青月

* #correct #hint:终不以天下之病而利一人——宁负一子，不负天下。 [「终究不能让天下受害，而只让一个人得利。」——你把天下授予舜]
	-> c_hand_shun
* [「他到底是我的骨血。」——你降诏立丹朱为嗣]
	-> c_hand_danzhu
* [父子天下两难，你迟迟不定，把册立之事一再拖延]
	-> c_waver

=== c_hand_danzhu ===
#show:danzhu:proud:right
你终究没能越过那点私情，把天下交到了丹朱手里。 #speaker:青月
可丹朱不肖：狱讼者不服，讴歌者不归，诸侯离心。天下因一人之私而受害，四海失望，你毕生经营的太平，从你手上开始崩坏。 #speaker:青月 #hint:授丹朱则天下病而丹朱得其利。
你以天下之病，利了一人。史书上那个「传贤不传子」的圣王，从此不是你了。 #death:private #speaker:青月
-> END

=== c_waver ===
父子难断，你把册立一再拖延。可天子之位一日不定，人心便一日惶惶：群臣观望，诸侯揣度，政令渐渐没了准头。 #speaker:青月
天命人心，最厌犹疑。你的迟疑没有换来两全，只换来了朝纲松动、四方浮议。托付天下需要的，从来不只是德，还有决断。 #death:waver #speaker:青月
-> END

=== c_hand_shun ===
#bg:yao_court
#show:shun:humble:center
你越过了为父的私心。你举舜于上天，令他摄行天子之政，二十八载而后你崩。 #speaker:青月 #hint:尧辟位凡二十八年而崩。
#show:qingyue:sad:float
你去世那日，百姓悲哀，如丧父母。三年之中，四方莫举乐，人人思念着你这位放勋。 #speaker:青月 #hint:百姓悲哀，如丧父母。三年，四方莫举乐，以思尧。
「……看，天下记得你。」 #speaker:青月
-> c_avoid

=== c_avoid ===
#bg:nanhe
你的魂魄尚在人间，看着接下来发生的事。三年丧毕，舜做了一件出人意料的事—— #speaker:青月
他没有径直登位，反而把帝位让给了你的儿子丹朱，自己避居到南河之南。 #speaker:青月 #hint:舜让辟丹朱于南河之南。
#show:qingyue:worry:float
「唔……舜把位子又推回给了丹朱。这一让，天下会认谁呢？」 #speaker:青月
「若你在天有灵，此刻，你盼着人心归向哪一个？」 #speaker:青月

* #correct #hint:诸侯朝觐者不之丹朱而之舜——天与之，人与之。 [你盼天下自择其主：谁得人心，谁承天命]
	-> c_end_shanrang
* [你到底盼着骨血承嗣：愿人心念着旧恩，重归丹朱]
	-> c_end_shanrang

=== c_end_shanrang ===
#bg:nanhe
#bgm:solemn
#achieve:yao_shanrang
天下用它自己的脚，做出了选择—— #speaker:青月
朝觐的诸侯不去丹朱那里，去了舜那里；打官司的不去丹朱那里，去了舜那里；讴歌的人不歌丹朱，只歌舜。 #speaker:青月 #hint:诸侯朝觐者不之丹朱而之舜，狱讼者不之丹朱而之舜，讴歌者不讴歌丹朱而讴歌舜。
#show:shun:humble:center
舜仰望苍天，只说了一个字：「天也。」而后回到中原，践天子之位——是为帝舜。 #speaker:舜 #hint:舜曰：天也。夫而后之中国践天子位焉，是为帝舜。
#show:qingyue:solemn:float
「……『终不以天下之病而利一人。』」 #speaker:青月
「这一句，是《史记》开篇最响的一声。天下为公，不以一姓之私，害天下之公。」 #speaker:青月 #hint:终不以天下之病而利一人。
#show:qingyue:smile:float
「呼——你走完了帝尧的这一程。看懂了吗？他不是不爱丹朱，是把这份爱，让给了更大的一份。」 #speaker:青月
「传贤不传子——从你开始，天下第一次，成了天下人的天下。」 #speaker:青月
-> END
