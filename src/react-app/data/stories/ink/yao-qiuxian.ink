// ═══════════════════════════════════════════════
// 帝尧 · 咨岳求贤 · 择嗣与鸿水
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

-> c_open

=== c_open ===
#bg:yao_court_alt1
#bgm:solemn
#show:qingyue:tease:float
「来得正巧，快替我搭把手——你瞧这满案的竹简，全是举荐的名帖，都快堆到我下巴啦。」 #speaker:青月
「一简一个名字，一个名字后头，是一颗看不透的人心。这一世，你是陶唐氏，世人唤作尧。在位已经七十载，是天下人抬头就能望见的那轮太阳。」 #speaker:青月
你睁开眼。玄衣纁裳，明堂高敞，阶下四岳与群臣屏息肃立，都在等你开口。 #speaker:青月
#show:qingyue:worry:float
「可太阳，也会老啊。你老了，天下这么大一副担子，接下来……谁来挑？」 #speaker:青月
你缓缓抬手，问出了那句压在心头许久的话——「谁可顺此事？」谁，能顺理这天下大事？ #speaker:尧 #hint:尧曰：谁可顺此事？
-> c_danzhu

=== c_danzhu ===
#show:danzhu:proud:right
话音未落，放齐便出班奏道：「嗣子丹朱，通达明理——太子他，开明啊。」 #speaker:放齐 #hint:放齐曰：嗣子丹朱开明。
丹朱立在阶下，是你的亲儿子。传给他，名正言顺，血脉相承，谁也说不出话。 #speaker:青月
#show:qingyue:worry:float
「呐——划重点！这可是你亲生的儿子呀。」 #speaker:青月
「你比谁都清楚他是什么料：好争、狠戾，一身顽气。可……那也是你的骨肉。」 #speaker:青月
「私心与公义，就摆在这一句话上了。传，还是不传？」 #speaker:青月

* #correct #hint:尧曰：吁！顽凶，不用。——一声长叹，尧否了自己的亲儿子。 [「吁！顽凶。」——你当着满朝文武，亲口否了自己的儿子]
	-> c_danzhu_reject
* #correct [召丹朱来见，当面考较——先看看他到底成不成器]
	-> c_explore_danzhu_test
* [「到底是我的血脉。」——你点头属意丹朱：名正言顺，满朝无人敢驳]
	-> death_danzhu
* #correct [不授天下，也不弃他——封丹朱于房，予一方之土历练，看他能否磨去那身顽气]
	-> if_fangdanzhu_1

=== c_danzhu_reject ===
你长叹一声，那叹息里有多少不舍，只有你自己知道。可你还是摇了头：「吁！顽凶，不用。」 #speaker:尧
#show:qingyue:smile:float
「欸——就是这一声『吁』！」 #speaker:青月
「叹得出，才舍得下。天下不是你家的私产，你比谁都懂这个理儿。」 #speaker:青月
#hide:danzhu
你又问：「那么，谁可以呢？」 #speaker:尧 #hint:尧又曰：谁可者？
-> c_gonggong

=== c_gonggong ===
#show:gonggong:smiling:right
讙兜抢步而出，力荐一人：「共工！他广聚民众、办了不少实事，功劳看得见——可用啊！」 #speaker:讙兜 #hint:讙兜曰：共工旁聚布功，可用。
那共工上前一揖，言辞恳切，姿态谦恭，句句都说得漂亮，滴水不漏。 #speaker:青月
#show:qingyue:tease:float
「唔……你瞧他，多会说话，多恭敬呀。」 #speaker:青月
「可越是这样，你心里越发毛，对不对？话太漂亮的人，做起事来……」 #speaker:青月
#show:qingyue:worry:float
「他表面恭顺得能通天，底下的行事，你可看得真？」 #speaker:青月

* #correct #hint:尧曰：共工善言，其用僻，似恭漫天，不可。 [「似恭漫天。」——你识破他的巧言，不用]
	-> c_gonggong_reject
* #correct [遣人暗查共工治绩——先看看他办的实事，再做定夺]
	-> c_explore_gonggong_check
* [「言之有功，姑且委政于他。」——你把政事交给共工]
	-> death_gonggong

=== c_gonggong_reject ===
你盯着共工看了许久，缓缓道：「共工善言，其用僻——貌似恭敬，实则傲慢通天。不可。」 #speaker:尧 #hint:尧曰：共工善言，其用僻，似恭漫天，不可。
#show:qingyue:smile:float
「漂亮！『似恭漫天』四个字，把他钉死了。」 #speaker:青月
「恭敬是装出来的，傲慢是真的。你没被那张巧嘴骗过去——识人，你是行家。」 #speaker:青月
#hide:gonggong
话音方落，殿外忽然传来急报——洪水的消息。 #speaker:青月
「说曹操曹操到，这水来得比朝堂里的暗涌还急。」 #speaker:青月
-> c_gun

=== c_gun ===
#bg:flood_sky
#bgm:danger
#show:qingyue:solemn:float
你转向阶下的四岳，声音沉了下来：「嗟，四岳！汤汤洪水滔天，浩浩荡荡，包山淹陵。下面的百姓，苦得很呐——有谁，能去治这水？」 #speaker:尧 #hint:汤汤洪水滔天，浩浩怀山襄陵，下民其忧，有能使治者？
四岳异口同声：「鲧，可以。」 #speaker:四岳 #hint:皆曰鲧可。
可你心里，对鲧是有数的——这个人违逆天命、败坏同族。你皱眉道：「鲧负命毁族，不可。」 #speaker:尧 #hint:尧曰：鲧负命毁族，不可。
#show:gun:stern:right
四岳却不肯退，齐齐再拜：「异哉，帝！也没有比他更强的人了。试试他，不成，再罢了便是。」 #speaker:四岳 #hint:岳曰：异哉，试不可用而已。
#show:qingyue:worry:float
「呐，两难来了——」 #speaker:青月
「你明知鲧不堪大任，可满朝都举他，水又淹到眉毛了。一口回绝众意？还是拗着心，姑且一试？」 #speaker:青月

* #correct #hint:尧于是听岳用鲧。——虽疑鲧，尧仍纳众谏，权且一试。 [你叹一口气：「试。」——纳四岳之谏，权且用鲧]
	-> c_gun_try
* #correct [问四岳：鲧究竟有何能耐？你们为何举他？]
	-> c_explore_gun_inquire
* #correct [「我说过不可，就是不可！」——你固执己见，一意回绝众意]
	-> c_gun_refuse

=== c_gun_refuse ===
你把众意一口回绝，谁也不用。洪水却不等人——它照旧漫天，包山襄陵，一日高过一日。 #speaker:青月
#show:qingyue:worry:float
「唔……你是没用错人，可你也没用人呀。」 #speaker:青月
「满朝就举出这一个，你连试都不肯试，那水，谁来挡？」 #speaker:青月
纳谏与固执，有时只在一念之间。你终究还是松了口——洪水面前，总得有人下水。 #speaker:青月
-> c_gun_try

=== c_gun_try ===
#show:gun:stern:right
你终究还是纳了众意：「便依你们——用鲧，试。」 #speaker:尧 #hint:尧于是听岳用鲧。
鲧领命去了。他择的法子，是堙——筑高堤、堵水口，一味用土去围那滔天之势。 #speaker:青月
#show:qingyue:worry:float
「他堵得越高，水就积得越凶。呐，你要一直这么倚着他堙下去吗？」 #speaker:青月

* #correct #hint:九岁，功用不成。——尧不讳言鲧之败，转而下问求贤。 [九年过去，你看清了堙水必败，转身另求贤者]
	-> c_gun_fail
* [「已经用了他，便一路信他到底。」——你一味倚重鲧，堙水不改]
	-> death_gun
* #correct [不换人，换法子——严令鲧弃堙改疏，随山浚川、导水入海]
	-> if_gaifa_1

=== c_gun_fail ===
#hide:gun
#bg:yao_court
#bgm:solemn
九个年头过去了。鲧堤修得再高，水也照旧漫过来——功用不成，一寸也没成。 #speaker:青月 #hint:九岁，功用不成。
#show:qingyue:solemn:float
「……你看，你当初的疑心，没有错。」 #speaker:青月
「可你没有因为『我早说过』就得意，也没有因为用错了人就赌气。」 #speaker:青月
#show:qingyue:calm:float
「一个肯听劝、又肯认错的天子，接下来该做什么呀？」 #speaker:青月
你没有推诿，也没有懊悔。你站起身，望向阶下满朝——洪水未平，嗣位未定，你要做的，是把眼光放到更远的地方去。 #speaker:青月
-> c_seek

=== c_seek ===
你朗声下令：「悉举贵戚及疏远隐匿者！」——无论贵胄，还是山野隐没之人，都给我举荐上来！ #speaker:尧 #hint:悉举贵戚及疏远隐匿者。
#show:qingyue:smile:float
「欸——这一句，才是你了不起的地方！」 #speaker:青月
「儿子顽，不传；巧嘴的不用；连众人举的鲧都试过、败了。你没有一条道走到黑，而是把门开得更大——向天下求贤。」 #speaker:青月
#achieve:yao_seek_worthy
果然，阶下有人应声：「民间有个鳏夫，唤作虞舜……父顽母嚚弟傲，他却能以孝使全家和睦。」 #speaker:四岳 #hint:有矜在民间，曰虞舜……能和以孝，烝烝治，不至奸。
#show:qingyue:calm:float
「听见那个名字了吗？舜。」 #speaker:青月
「你择嗣的两难、治水的九年徒劳，绕了这么大一圈，原来都是为了在这一刻——听见他的名字。」 #speaker:青月
#show:qingyue:smile:float
「呼——你走完了尧的这一程。看懂了吗？真正的圣君，不是从不选错，而是选错了，还肯睁开眼，接着往下找。」 #speaker:青月 #impact:impact_qiuxian_sijuxian #ending:canon #quiz:quiz_qiuxian_qiuxian
-> END

// ═══ 探索节点 · 咨岳求贤 ═══

=== c_explore_danzhu_test ===
#bg:yao_court
#bgm:court
#show:danzhu:proud:right
#show:qingyue:calm:float
你命人传丹朱上殿。他来了，步子轻浮，眼神里带着藏不住的傲气。 #speaker:青月
你问他：「近日读了什么书？」 #speaker:尧
丹朱撇撇嘴：「书？儿臣忙着练棋呢。父亲，儿臣昨日赢了大舅三局，他说朝中无人能胜我。」 #speaker:丹朱
你又问：「若天下有一州遭了灾，你怎么办？」 #speaker:尧
丹朱想了想：「征粮。从别州调。别州不肯？那就——征。」 #speaker:青月
#show:qingyue:tease:float
「你看——第一个念头就是征，不是救。这就是丹朱。」 #speaker:青月
「不是不聪明，是聪明用错了地方。他看天下，只看到棋盘——争、抢、赢。看不到棋盘底下，是人命。」 #speaker:青月

* #correct [再问：你弟弟放勋呢？你与他相比如何？]
	#show:qingyue:calm:float
	「丹朱嗤笑：『放勋？他整天跟一帮农夫混在一起，有什么出息。』」 #speaker:青月
	「可你心里清楚——放勋去田里看过百姓的粮仓，丹朱连朝堂外的事都不愿听。一个往下看，一个往上看。高下，你已看出来了。」 #speaker:青月
	-> c_danzhu
* #correct [心中已明，回去决断]
	-> c_danzhu

=== c_explore_gonggong_check ===
#bg:yao_court
#bgm:court
#show:gonggong:smiling:right
#show:qingyue:calm:float
你没有被共工的巧言打动，先遣暗使去查他办过的实事。 #speaker:青月
消息传回来—— #speaker:青月
「他聚拢的民众，确实是办了些工程：修了一条路，开了一片渠。可修路的民夫，是他从各部强征来的，没给一文工钱。」 #speaker:青月
「开渠的地方，是他自己的田——渠开了，他的地值了钱，旁人的田反倒被渠占了。」 #speaker:青月
#show:qingyue:tease:float
「你看——他说『旁聚布功』，功是有的。可这功，聚的是谁的好处，布的是谁的地？」 #speaker:青月
「巧言的人，做事总带着一层壳。你不掰开看，就以为里头是实的。」 #speaker:青月

* #correct [问：他表面恭顺，私下如何？]
	#show:qingyue:worry:float
	「暗使说：『面上对谁都是笑，可底下，他的手下欺压小部，他装作看不见。有人告到他面前，他说——小事，不必烦天子。』」 #speaker:青月
	「『似恭漫天』——太史公这四个字，真是一字不差。恭是面子，漫是里子。你信了他的面子，他就拿里子掏空你。」 #speaker:青月
	-> c_gonggong
* #correct [查清楚了，回去决断]
	-> c_gonggong

=== c_explore_gun_inquire ===
#bg:flood_sky
#bgm:danger
#show:gun:stern:right
#show:qingyue:calm:float
你没有急着答应或拒绝，先问四岳：「鲧——你们说他可以。他究竟有何能耐？」 #speaker:尧
四岳答道：「鲧刚毅果决，有魄力，能服众。堤防之术，天下无出其右——他筑的堤，又高又厚，比谁都结实。」 #speaker:四岳
#show:qingyue:tease:float
「你看——四岳说的都是优点。可你心里有数：刚毅，过了头就是固执；服众，过了头就是跋扈；堤防之术再好，堵得住一时，堵得住一世吗？」 #speaker:青月
「可四岳也不是瞎举——当时天下，确实没有比鲧更能干的人了。这就是两难：不是最好的选择，是唯一的选择。」 #speaker:青月

* #correct [问：鲧的『负命毁族』，究竟是怎么回事？]
	#show:qingyue:worry:float
	「青月说：『鲧违逆过天命——他自认为对的事，旁人劝不动。他的部落也因此吃过亏：他一意孤行，族里有人反对，他压了下去。』」 #speaker:青月
	「『负命』是不听天，『毁族』是不听人。一个天上地下都不听劝的人，你能指望他治水时听得进反对意见吗？」 #speaker:青月
	-> c_gun
* #correct [问：除了鲧，当真没有别人了？]
	#show:qingyue:calm:float
	「四岳摇头：『没有。年轻人还没长成，老一辈的要么老了，要么死了。鲧是眼下唯一有经验、有魄力、有手段的人。』」 #speaker:青月
	「这就是尧的难处——不是在好和坏之间选，是在坏和更坏之间选。用鲧，是赌一把；不用鲧，是连赌的本钱都没有。」 #speaker:青月
	-> c_gun
* #correct [问清楚了，回去决断]
	-> c_gun

// ═══ IF线 · 房丹朱（自由模式歧路：封子一方以历练）═══

=== if_fangdanzhu_1 ===
#hide:danzhu
#bg:yao_court
#bgm:solemn
#show:qingyue:worry:float
「不弃，也不授——把儿子放到一方去磨。这一步，史书上没细写哦。」 #speaker:青月
你没有把天下交给丹朱，也没有一句『顽凶』把他打入尘埃。你封他于房，予一方之土，让他自己去治民、去碰壁、去长大。 #speaker:青月 #hint:尧子丹朱……皆有疆土，以奉先祀。
#show:qingyue:calm:float
「这是父亲能想到的最温柔的办法了——给你一块田，你若种得好，天下自然看得见。」 #speaker:青月
可丹朱的顽气，不是一方封土磨得平的。他在房邑争强好胜、嬉游无度，把好端端一方治得怨声载道。 #speaker:青月
#show:qingyue:sad:float
「你盼着历练能救他。可有的性子，越给权，越显出那个『凶』字。」 #speaker:青月
天下人看在眼里：连一邑都治不好的丹朱，若不是天子之子，谁会容他？你护住了骨肉的体面，却也让满朝看清了——他终究托不起天下。 #speaker:青月
#show:qingyue:solemn:float
「史书里的尧，一声『吁！顽凶』就断了念想，转身向天下求贤。快刀斩乱麻，反而干净。」 #speaker:青月
「你舍不得那一刀，于是绕了远路。房邑的丹朱终究有了疆土、奉着先祀，你也终究没把天下误给他——只是那份求贤的决绝，被你这点父心，磨钝了一些。」 #speaker:青月
你成全了一个父亲，也守住了天下。可史书上那个『不以天下之病而利一人』的锋利，在你这里，多了一道犹疑的软痕。 #ending:if_fangdanzhu #speaker:青月
-> END

// ═══ IF线 · 改法（自由模式歧路：令鲧弃堙改疏）═══

=== if_gaifa_1 ===
#hide:gun
#bg:flood_sky
#bgm:solemn
#show:qingyue:worry:float
「不换人，换法子……这一步，可是替禹提前想到了哦。」 #speaker:青月
你没有一路信鲧堙到底，也没有另换他人。你严令鲧：弃了那筑高堤的老法子，改堵为疏，随山浚川，把水导入大海。 #speaker:青月 #hint:禹之治水，随山浚川，改堵为疏。
#show:qingyue:calm:float
「这法子，是对的——几十年后，正是靠这个『疏』字，禹平了天下的水。」 #speaker:青月
可鲧是鲧。他一辈子信的是『堵』，是拿土去围水。你逼他改法，他心里不服，手上更不会。 #speaker:青月
#show:qingyue:sad:float
「疏导之法，要辨山川走势、要通九州水脉——那是禹用十三年、三过家门换来的功夫。」 #speaker:青月
「鲧既无那份心，也无那份识。你给了他对的法子，他却使不出对的力。」 #speaker:青月
水患拖着不平，也不至大溃——不上不下地耗着。你没有重蹈『一路信堙』的大败，却也没等来九州攸同的大治。 #speaker:青月
#show:qingyue:solemn:float
「史书里的尧，是认了鲧之败、转身求贤，最后把这滔天之水，留给了对的人——禹。」 #speaker:青月
「你想抄近路，把对的法子塞给错的人。方向对了，人不对，水就只能这么半死不活地拖着。」 #speaker:青月
你懂了『疏』的道理，却忘了治水从不只是法子的事，是那个肯把命填进去的人。你省了一场大败，也误了一场大治。 #ending:if_gaifa #speaker:青月
-> END

=== death_danzhu ===
#hide:danzhu
#bg:flood_sky
#bgm:danger
你终究没舍得那点骨肉私情，把天下许给了丹朱。可他顽凶的性子藏不住——他一朝在位，诸侯不服，狱讼不至，讴歌者不歌其名。天下人用脚投了票，纷乱由此而起。 #death:danzhu #speaker:青月
-> END

=== death_gonggong ===
#hide:gonggong
#bg:flood_sky
#bgm:danger
你被那张巧嘴说动了，把政事交到共工手里。他果然放纵邪僻，貌似恭敬，行事却败坏朝纲。似恭而漫天，政事一日坏过一日，你悔之已晚。 #death:gonggong #speaker:青月
-> END

=== death_gun ===
#hide:gun
#bg:flood_sky
#bgm:danger
你一味信着鲧，由他把堤堙得一年高过一年。水却越堵越凶，九年过去，堤溃水泄，洪流滔天，包山襄陵。下民尽没于泽国，你到死也没能把这滔天之水，交到一个对的人手里。 #death:gun #speaker:青月
-> END
