// ═══════════════════════════════════════════════
// 帝尧 · 举舜试女 · 择贤而授
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

-> c_open

=== c_open ===
#bg:yao_court
#bgm:solemn
#show:qingyue:tease:float
「嘘——有个名字，正顺着风往平阳飘呢。你听：民间有个鳏夫，唤作……」 #speaker:青月
「欸，不急不急，先卖个关子~ 这一世，你是唐尧，世人尊你一声『帝尧』。天下都在你手心里攥着呢——那个名字，一会儿自己会飘到你耳朵里的。」 #speaker:青月
你睁开眼。玉阶之上，四岳垂手而立。你在位，已经七十年了。 #speaker:青月
#show:qingyue:worry:float
「可你老啦。这满堂江山，该托付给谁？你的儿子丹朱……唔，你自己心里清楚，那孩子不成器。」 #speaker:青月
你缓缓开口，声音里有七十年的疲惫：「嗟！四岳，朕在位七十载，你们谁能顺承天命，接替朕的帝位？」 #speaker:帝尧
四岳齐齐俯首：「我们德行卑陋，会辱没帝位。」 #speaker:四岳
-> c_seek

=== c_seek ===
你摆了摆手，目光扫过整座殿堂。
「无论贵戚，还是疏远隐居之人——都举荐出来吧。」 #speaker:帝尧 #hint:悉举贵戚及疏远隐匿者。
#show:qingyue:solemn:float
「听见了吗？他不把天下留给亲儿子，反而向天下求贤。」 #speaker:青月
「『以天下为公，择贤而授』——禅让这两个字，此刻才真正落地。」 #speaker:青月
众人交头接耳，终于有人出列：「民间有个尚未娶妻的鳏夫，名叫虞舜。」 #speaker:四岳
你眉梢一动：「对，朕也听说过他。他为人如何？」 #speaker:帝尧
-> c_family

=== c_family ===
#show:qingyue:worry:float
四岳的下一句话，让满堂都静了： #speaker:青月
「他是个盲人的儿子。父亲愚顽，后母奸诈，弟弟傲慢——」 #speaker:四岳 #hint:盲者子。父顽，母嚚，弟傲。
「可他，偏偏能用孝道让全家和睦，靠一片淳厚把家治理好，不让他们堕入邪恶。」 #speaker:四岳 #hint:能和以孝，烝烝治，不至奸。
#show:qingyue:solemn:float
你默默听着。一个盲眼父亲、一个刻薄后母、一个骄纵幼弟——换作旁人，这样的家门，早被日日磋磨得反目成仇了。 #speaker:青月
「可他不光不还手，还能反过来，让这一屋子人心齐整。旁人治家靠威、靠利，他治家，只靠一个字——孝。」 #speaker:青月
#show:qingyue:tease:float
「呐——划重点！一个出身微贱的鳏夫，一家子父顽、母嚚、弟傲，恶名在外。」 #speaker:青月
「这样的人，你敢用吗？这可是要交天下的呀。选错一步，史书上就要换个写法咯？」 #speaker:青月

* [「一家父顽母嚚弟傲，家风如此，岂能托付天下？」——弃了这浑水，另择清白贵胄，稳妥万分]
	-> c_reject
* #correct [遣人去历山，查舜的行迹——先看看他是不是真如四岳所说]
	-> c_explore_family_check
* #correct #hint:尧曰吾其试哉——不因出身微贱、家世恶名而弃贤，只看其德。 [「家能治者，方能治国。朕不看他的出身，只看他的德——吾其试哉。」]
	-> c_try

=== c_reject ===
#show:qingyue:sad:float
你皱起眉，把那个名字从心里划去：「盲者之子，一门恶名，如何母仪天下？另择贵戚罢。」 #speaker:帝尧
可四岳再举不出第二个舜。你终究还是把天下，权授给了不成器的丹朱。
天下由此受害，而利只归丹朱一人。你亲手违背了自己『择贤而授』的初心。 #death:qishi #speaker:青月
-> END

=== c_try ===
#show:qingyue:smile:float
「欸——漂亮！」 #speaker:青月
「你没被那一身恶名唬住。『家能治，则国能治』——真正的贤德，从不问出身。」 #speaker:青月
你颔首，一字一句：「吾其试哉。」 #speaker:帝尧 #hint:尧曰：吾其试哉。
-> c_howtotest

=== c_howtotest ===
#show:qingyue:worry:float
「可是呀——口碑归口碑，托天下是另一回事。」 #speaker:青月
「四岳说他孝、说他能治家，你都只是『听说』。这么大的一份江山，光凭听说，够吗？」 #speaker:青月
一个念头在你心里升起：既已闻其贤名，何不即刻委以重任，验之于事？ #speaker:青月

* [「贤名既著，何须再试？即刻授他五典百官，委以国政。」——不加考验，骤然重用]
	-> c_rush
* #correct [与四岳商议：考验一个人，该从何处着手？]
	-> c_explore_test_discuss
* #correct #hint:于是尧妻之二女，观其德于二女——先以二女察其齐家，再徐图大用。 [「治国先看齐家。朕先以二女嫁他，观其德于闺门之内。」]
	-> c_marry
* #correct [「儿女婚嫁是私情，考较用不着搭上朕的女儿。」——只授他官职政务，凭政绩考其能，不以二女观其德]
	-> if_shoutang_1

=== c_rush ===
#bg:yao_court
#bgm:court
你等不及了，当即下诏，把五教、百官、四门尽数交到这个只闻其名的人手里。 #speaker:青月
可你从未亲眼验过他一分。所托非人，则政令败坏；德不配位，则百官离心。 #speaker:青月
你把天下押在了一句『听说』上——一步踏空，满盘皆输。 #death:qingxin #speaker:青月
-> END

=== c_marry ===
#bg:gui_river
#bgm:solemn
#show:qingyue:solemn:float
「好。这一步走对了。」 #speaker:青月
「察一个人齐家，最狠的法子，就是把自家最金贵的东西放进去——你的两个女儿。」 #speaker:青月
你唤来娥皇、女英。她们是帝王之女，金枝玉叶。 #speaker:青月
#show:ehuang:calm:left
#show:nvying:calm:right
「父亲，」娥皇盈盈下拜，「女儿谨遵父命。」 #speaker:娥皇
「愿以此身，替父亲看一看这个人，究竟配不配得上天下。」 #speaker:女英
你把二女嫁与舜，又命九个儿子与他同处——一观其内，一观其外。 #speaker:帝尧 #hint:尧乃以二女妻舜以观其内，使九男与处以观其外。
-> c_observe

=== c_observe ===
#bg:gui_river
#bgm:peaceful
#show:qingyue:calm:float
消息一程程从妫水边传回。舜居于妫汭，居家反而更加谨慎了。 #speaker:青月 #hint:舜居妫汭，内行弥谨。
你最担心的，本是两个娇生惯养的女儿会仗着帝女身份，在夫家颐指气使。 #speaker:青月
#show:ehuang:smile:left
#show:nvying:smile:right
可传回的话，让你心头一暖—— #speaker:青月
「二位公主守妇道甚谨，从不敢因出身高贵，就傲慢对待舜的父母亲族。」 #speaker:四岳 #hint:尧二女不敢以贵骄事舜亲戚，甚有妇道。
「连九位公子与舜相处，也一日比一日淳厚笃实了。」 #speaker:四岳 #hint:尧九男皆益笃。
#show:qingyue:smile:float
「看见没？好的德行是会传染的。」 #speaker:青月
「你的女儿在他身边学会了谦卑，你的儿子在他身边学会了敦厚——这个人，把身边的人都带好了。」 #speaker:青月
-> c_wider

=== c_wider ===
#bg:yao_court
#bgm:solemn
#hide:ehuang
#hide:nvying
#show:qingyue:worry:float
齐家一关，舜过了。可齐家之德，未必就是治国之能。 #speaker:青月
「呐——最后一道坎。闺门之内看的是德，可治天下，还得看能。」 #speaker:青月
「你会怎么试他这最后一程？」 #speaker:青月

* [「德既已明，何必多此一举？」——七十载的眼力还会看错人吗？直接传位，皆大欢喜]
	-> c_shortcut
* #correct [问舜：五典百官四门，你打算从何处着手？]
	-> c_explore_wider_plan
* #correct #hint:乃使舜慎和五典……遍入百官……宾于四门——由内及外，层层察验。 [「由内及外，层层试之：先使他和五典，再入百官，再宾四门。」]
	-> c_final
* #correct [「舜之贤，正好辅朕之子。」——试其能，却不授天下，命舜为相，辅佐丹朱承嗣]
	-> if_fuzuo_1

=== c_shortcut ===
你见他齐家有德，便以为治国无虞，欲即刻传位。 #speaker:青月
可五典未试，百官未历，四门未宾——你只见其德于闺门，未见其能于天下。 #speaker:青月
将万里江山系于一次未竟的考察，纵然此番所托得人，这份轻率，也已不配为择贤的帝尧。 #death:qingxin #speaker:青月
-> END

=== c_final ===
#bg:yao_court
#bgm:court
#show:qingyue:solemn:float
你没有停步。你把考验一层层加了上去。 #speaker:青月
先让舜慎重推行五教——父义、母慈、兄友、弟恭、子孝。百姓竟都欣然遵从。 #speaker:青月 #hint:乃使舜慎和五典，五典能从。
再让他遍管百官——政务经他的手，井井有条，纹丝不乱。 #speaker:青月 #hint:遍入百官，百官时序。
又让他在四门接待四方宾客——四门之内气氛肃穆，诸侯与远方来客，无不肃然起敬。 #speaker:青月 #hint:宾于四门，四门穆穆。
#show:qingyue:worry:float
你还不放心。你把他送进最深的山林川泽，让他独自面对暴风雷雨。 #speaker:青月
「你猜怎么着？狂风暴雨里，他走得笔直，一步也没有迷失。」 #speaker:青月 #hint:尧使舜入山林川泽，暴风雷雨，舜行不迷。
-> c_end_sage

=== c_end_sage ===
#bg:yao_court
#bgm:solemn
#achieve:yao_zeixian
#show:shun:calm:center
你望着阶下这个人：盲者之子，起于微贱，却把你的女儿、你的儿子、你的百官、你的四门，都治理得妥妥帖帖。 #speaker:青月
「……圣人也。」你一字一字，说给满朝，也说给自己听。 #speaker:帝尧 #hint:尧以为圣。
#show:qingyue:solemn:float
「家内、家外、山川风雨——你设了三重考验，一重比一重狠。」 #speaker:青月
「你没有因为他出身微贱、恶名在外就弃了他，也没有因为一句好名声就轻信他。」 #speaker:青月
#show:qingyue:smile:float
「你把最金贵的女儿放进去试他的德，把整套官制放进去试他的能——试到最后一分，才敢把天下交出去。」 #speaker:青月
「呼——你走完了帝尧这一程。看懂了吗？」 #speaker:青月
#show:qingyue:calm:float
「所谓禅让，从来不是一时兴起的慷慨。是一个老人，用尽一生的审慎，替天下人，挑一个配得上天下的人呀。」 #speaker:青月 #impact:impact_juxian_sanshikun #ending:canon #quiz:quiz_juxian_sanshikun
#hide:shun
-> END

// ═══ 探索节点 · 举舜试女 ═══

=== c_explore_family_check ===
#bg:gui_river
#bgm:peaceful
#show:qingyue:calm:float
你没有只听一面之词，先遣人去了历山。 #speaker:青月
消息传回来—— #speaker:青月
「历山的农夫争地界，舜去了之后，主动把好的田让给别人，自己种差的。一年之后，历山的人都在让畔——没人争了。」 #speaker:青月
「雷泽的渔人争渔位，舜去了之后，把好的位置让给老者。半年后，雷泽的年轻人都把好位置让给老人了。」 #speaker:青月
#show:qingyue:tease:float
「你看——他没说一句大道理，就是自己做给人看。别人看了，自己就不好意思争了。」 #speaker:青月
「这就叫『烝烝治』——不是压，不是劝，是自己先做到了，别人自然跟上来。」 #speaker:青月

* #correct [问：他那个恶名在外的家呢？他怎么跟家人相处？]
	#show:qingyue:worry:float
	「暗使说：『他父亲瞽叟脾气暴戾，后母刻薄，弟弟象傲慢——可舜从不顶撞，也不记恨。瞽叟要他修仓顶，他在上面修，父亲撤了梯子放火——他用笠帽当翼跳下来，没死，也没怨。』」 #speaker:青月
	「『事后，他照样孝敬父母、友爱弟弟。家人怎么对他，他不为所动——该孝的孝，该敬的敬。』」 #speaker:青月
	#show:qingyue:solemn:float
	「听见没？这样的人，不是没能力还手——是不肯还手。他治家不靠威，不靠利，靠的是一个『让』字。」 #speaker:青月
	-> c_family
* #correct [查清楚了，回去决断]
	-> c_family

=== c_explore_test_discuss ===
#bg:yao_court
#bgm:court
#show:qingyue:calm:float
你没有急着下决定，先问四岳：「考验一个人——你们觉得该从何处着手？」 #speaker:尧
四岳议论纷纷—— #speaker:青月
「有人说：看他的才干。给他一桩难事，看他办不办得成。」 #speaker:青月
「有人说：看他的人品。派人在暗处看，他独处时是什么样子。」 #speaker:青月
「还有人说：看他的家。家治得好的人，治国差不到哪里去。」 #speaker:青月
#show:qingyue:tease:float
「你看——三种法子，各有道理。可你想过没有：才干可以装，人品可以演，唯独家里的事——天天在一起的人，装不了一辈子。」 #speaker:青月
「所以史上的尧，选了最狠的一招：把自己的女儿放进去。你女儿金枝玉叶，他若德行不够，迟早露馅。」 #speaker:青月

* #correct [问：除了二女，还有别的法子吗？]
	#show:qingyue:calm:float
	「青月说：『有。可以让他管一摊事，看政绩。可以让他接待宾客，看风度。可以让他入山林川泽，看胆识。』」 #speaker:青月
	「可这些都是外面看——家里呢？一个人独处时是什么德性，谁也看不见。只有把自家人放进去，才看得见。」 #speaker:青月
	#show:qingyue:solemn:float
	「这就是尧了不起的地方——他不是不信任舜，是不肯只凭外面看到的就放心。他把最金贵的东西放进去赌，才叫真试。」 #speaker:青月
	-> c_howtotest
* #correct [想清楚了，回去决断]
	-> c_howtotest

=== c_explore_wider_plan ===
#bg:yao_court
#bgm:court
#show:shun:calm:center
#show:qingyue:calm:float
你没有直接传位，先问舜：「五典、百官、四门——你打算从何处着手？」 #speaker:尧
舜想了想，答道：「五典为先。父义、母慈、兄友、弟恭、子孝——这五样是天下人天天过日子的根本。根本正了，百官自然正；百官正了，四方自然服。」 #speaker:舜
#show:qingyue:tease:float
「你看——他没有说先抓权、先立威。他的第一步，是让家家户户先把日子过正。」 #speaker:青月
「这就跟黄帝修德振兵一个道理——先安人心，再谈别的。人心不安，什么政令都落不了地。」 #speaker:青月

* #correct [问：百官呢？怎么管？]
	#show:qingyue:calm:float
	「舜说：『百官各有职守，不必天子事事过问。臣先理清谁该管什么，再各司其职，定期考课。』」 #speaker:青月
	「你看——他不是想揽权，是想分权。让对的人管对的事，天子只管考课。这法子，后来舜自己当了天子就用了。」 #speaker:青月
	-> c_wider
* #correct [问：四门呢？接待宾客有何讲究？]
	#show:qingyue:smile:float
	「舜说：『四门是天下人进天子的路。门开得越大，天下的声音就越能进来。臣会让四方来的人——无论贵贱——都能被听见。』」 #speaker:青月
	「天子最怕的不是听不到好话，是听不到真话。四门一开，真话就来了。」 #speaker:青月
	-> c_wider
* #correct [问明白了，回去决断]
	-> c_wider

=== if_shoutang_1 ===
#bg:yao_court
#bgm:court
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你把二女留在了深宫。「儿女婚嫁是私情，考较用不着搭上朕的女儿。」 #speaker:帝尧
你只授舜官职：先典五教，再入百官，再宾四门，一桩桩摆在明处，凭政绩考他的能。 #speaker:青月
#show:qingyue:solemn:float
舜果然桩桩办得妥帖。五教从、百官序、四门穆——单看治绩，他挑不出一丝错处。 #speaker:青月
你依着功劳，一级一级把他升上来，终于让他摄了政。 #speaker:青月
#show:qingyue:calm:float
「政绩这条尺，量得出他能不能治事。可有一样东西，它量不出来——」 #speaker:青月
「一个人在没人看见的家里，是什么样子。」 #speaker:青月
#show:qingyue:sad:float
你以能取人，得了一个能吏。史上的尧却先把女儿放进他家门，要亲眼看他『刑于寡妻』的德，再看他治天下的能。 #speaker:青月
「你选的这条路，走得通，也走得稳。只是——」 #speaker:青月
「以政绩举贤，后世学得会；以齐家察德，成了尧一个人的绝唱。你省下了两个女儿，天下也少看了一回，什么叫『观其德于二女』。」 #ending:if_shoutang #speaker:青月
-> END

=== if_fuzuo_1 ===
#bg:yao_court
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你试了舜的贤，却没打算把天下交给他。「舜之贤，正好辅朕之子。」 #speaker:帝尧
你命舜为相，佐丹朱承嗣——让贤者扶着不肖的儿子，替你把这江山撑下去。 #speaker:青月
#show:qingyue:solemn:float
起初也真撑住了。舜勤谨如故，五典、百官、四门，一样样替丹朱料理得井井有条。 #speaker:青月
可丹朱到底是丹朱。舜在前头理顺的，他在后头败坏；舜劝一句，他顶十句。 #speaker:青月
#show:qingyue:sad:float
朝上的人心里都明白：真正在治天下的是舜，坐在那位子上的却是丹朱。 #speaker:青月
「一个贤相，扶不起一个不肖的君。你把最好的人，绑在了最扶不动的位子上。」 #speaker:青月
史上的尧说『终不以天下之病而利一人』——他知道传子必累天下，索性把位子也让了。 #speaker:青月
「你留了个心眼，想两全：既传了骨肉，又用了贤才。可天下这东西，容不下这点私心。」 #speaker:青月
你没有身败，也没有名裂。只是那个『天下为公』的尧，在你这里，悄悄退了半步。 #ending:if_fuzuo #speaker:青月
-> END
