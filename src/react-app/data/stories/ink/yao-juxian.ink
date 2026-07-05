// ═══════════════════════════════════════════════
// 帝尧 · 举舜试女 · 择贤而授
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR tried = false

-> c_open

=== c_open ===
#bg:yao_court
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一缕魂飘到我这儿啦！坐稳咯~」 #speaker:青月
「这一回你可了不得，是唐尧，世人尊你一声『帝尧』。天下都在你手心里攥着呢。」 #speaker:青月
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
四岳的下一句话，让满堂都静了：
「他是个盲人的儿子。父亲愚顽，后母奸诈，弟弟傲慢——」 #speaker:四岳 #hint:盲者子。父顽，母嚚，弟傲。
「可他，偏偏能用孝道让全家和睦，靠一片淳厚把家治理好，不让他们堕入邪恶。」 #speaker:四岳 #hint:能和以孝，烝烝治，不至奸。
#show:qingyue:tease:float
「呐——划重点！一个出身微贱的鳏夫，一家子父顽、母嚚、弟傲，恶名在外。」 #speaker:青月
「这样的人，你敢用吗？这可是要交天下的呀。选错一步，史书上就要换个写法咯？」 #speaker:青月

* [「一家父顽母嚚弟傲，家风如此，岂能托付天下？」——因其家世恶名而弃之]
	-> c_reject
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
一个念头在你心里升起：既已闻其贤名，何不即刻委以重任，验之于事？

* [「贤名既著，何须再试？即刻授他五典百官，委以国政。」——不加考验，骤然重用]
	-> c_rush
* #correct #hint:于是尧妻之二女，观其德于二女——先以二女察其齐家，再徐图大用。 [「治国先看齐家。朕先以二女嫁他，观其德于闺门之内。」]
	~ tried = true
	-> c_marry

=== c_rush ===
#bg:yao_court
你等不及了，当即下诏，把五教、百官、四门尽数交到这个只闻其名的人手里。
可你从未亲眼验过他一分。所托非人，则政令败坏；德不配位，则百官离心。
你把天下押在了一句『听说』上——一步踏空，满盘皆输。 #death:qingxin #speaker:青月
-> END

=== c_marry ===
#bg:gui_river
#bgm:solemn
#show:qingyue:solemn:float
「好。这一步走对了。」 #speaker:青月
「察一个人齐家，最狠的法子，就是把自家最金贵的东西放进去——你的两个女儿。」 #speaker:青月
你唤来娥皇、女英。她们是帝王之女，金枝玉叶。 #speaker:青月
#show:ehuang:default:left
#show:nvying:default:right
「父亲，」娥皇盈盈下拜，「女儿谨遵父命。」 #speaker:娥皇
「愿以此身，替父亲看一看这个人，究竟配不配得上天下。」 #speaker:女英
你把二女嫁与舜，又命九个儿子与他同处——一观其内，一观其外。 #speaker:帝尧 #hint:尧乃以二女妻舜以观其内，使九男与处以观其外。
-> c_observe

=== c_observe ===
#bg:gui_river
#show:qingyue:default:float
消息一程程从妫水边传回。舜居于妫汭，居家反而更加谨慎了。 #speaker:青月 #hint:舜居妫汭，内行弥谨。
你最担心的，本是两个娇生惯养的女儿会仗着帝女身份，在夫家颐指气使。
#show:ehuang:smile:left
#show:nvying:smile:right
可传回的话，让你心头一暖——
「二位公主守妇道甚谨，从不敢因出身高贵，就傲慢对待舜的父母亲族。」 #speaker:四岳 #hint:尧二女不敢以贵骄事舜亲戚，甚有妇道。
「连九位公子与舜相处，也一日比一日淳厚笃实了。」 #speaker:四岳 #hint:尧九男皆益笃。
#show:qingyue:smile:float
「看见没?好的德行是会传染的。」 #speaker:青月
「你的女儿在他身边学会了谦卑，你的儿子在他身边学会了敦厚——这个人,把身边的人都带好了。」 #speaker:青月
-> c_wider

=== c_wider ===
#bg:yao_court
#bgm:solemn
#show:qingyue:worry:float
齐家一关，舜过了。可齐家之德，未必就是治国之能。
「呐——最后一道坎。闺门之内看的是德，可治天下,还得看能。」 #speaker:青月
「你会怎么试他这最后一程?」 #speaker:青月

* [「德既已明，何必多此一举?便直接传位于他。」——一试即信，不再深察]
	-> c_shortcut
* #correct #hint:乃使舜慎和五典……遍入百官……宾于四门——由内及外，层层察验。 [「由内及外，层层试之：先使他和五典，再入百官，再宾四门。」]
	-> c_final

=== c_shortcut ===
你见他齐家有德，便以为治国无虞，欲即刻传位。
可五典未试，百官未历，四门未宾——你只见其德于闺门，未见其能于天下。
将万里江山系于一次未竟的考察,纵然此番所托得人,这份轻率,也已不配为择贤的帝尧。 #death:qingxin #speaker:青月
-> END

=== c_final ===
#bg:yao_court
#show:qingyue:solemn:float
你没有停步。你把考验一层层加了上去。
先让舜慎重推行五教——父义、母慈、兄友、弟恭、子孝。百姓竟都欣然遵从。 #speaker:青月 #hint:乃使舜慎和五典，五典能从。
再让他遍管百官——政务经他的手，井井有条，纹丝不乱。 #speaker:青月 #hint:遍入百官，百官时序。
又让他在四门接待四方宾客——四门之内气氛肃穆，诸侯与远方来客,无不肃然起敬。 #speaker:青月 #hint:宾于四门，四门穆穆。
#show:qingyue:worry:float
你还不放心。你把他送进最深的山林川泽，让他独自面对暴风雷雨。 #speaker:青月
「你猜怎么着?狂风暴雨里，他走得笔直，一步也没有迷失。」 #speaker:青月 #hint:尧使舜入山林川泽，暴风雷雨，舜行不迷。
-> c_end_sage

=== c_end_sage ===
#bg:yao_court
#bgm:solemn
#achieve:yao_zeixian
#show:shun:default:center
你望着阶下这个人：盲者之子，起于微贱，却把你的女儿、你的儿子、你的百官、你的四门，都治理得妥妥帖帖。
你终于确信了——这是个圣人。 #speaker:帝尧 #hint:尧以为圣。
#show:qingyue:solemn:float
「家内、家外、山川风雨——你设了三重考验，一重比一重狠。」 #speaker:青月
「你没有因为他出身微贱、恶名在外就弃了他，也没有因为一句好名声就轻信他。」 #speaker:青月
#show:qingyue:smile:float
「你把最金贵的女儿放进去试他的德，把整套官制放进去试他的能——试到最后一分，才敢把天下交出去。」 #speaker:青月
「呼——你走完了帝尧这一程。看懂了吗?」 #speaker:青月
#show:qingyue:default:float
「所谓禅让,从来不是一时兴起的慷慨。是一个老人,用尽一生的审慎,替天下人,挑一个配得上天下的人呀。」 #speaker:青月
-> END
