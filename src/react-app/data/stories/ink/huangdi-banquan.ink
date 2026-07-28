// ═══════════════════════════════════════════════
// 黄帝 · 阪泉之战 · 修德振兵
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

-> c_open

=== c_open ===
#bg:xuanyuan_qiu
#bgm:solemn
#show:qingyue:smile:float
「呼——又见面啦，轩辕。上一回青月才把你送进史册的头一页，你还是个刚睁眼的婴孩；这一眨眼，你已长成顶天立地的一方之主咯。」 #speaker:青月
#show:qingyue:calm:float
「天纵之姿你是生来就有，可光有这个，还坐不上『共主』那把椅子哦。」 #speaker:青月
「因为你长成的这个时代——正乱着呢。」 #speaker:青月
-> c_shinong

=== c_shinong ===
#bg:zhuhou_luan
你所处的时代，神农氏的统治早已衰微。诸侯彼此侵伐，残害百姓，而神农氏——无力征讨。 #speaker:青月 #hint:轩辕之时，神农氏世衰。诸侯相侵伐，暴虐百姓，而神农氏弗能征。
远处火光冲天，哭声顺着风飘来。有诸侯掳掠邻邦，把老弱驱作牛马。天下人的目光，正一点点望向你。 #speaker:青月
你望着那片火光，攥紧了拳：「诸侯相侵，苍生涂炭——总得有人，把这乱世担起来。」 #speaker:轩辕
帐下有部将按捺不住，抢声进言：「主君！乱世里，刀快者为王。修德太慢啦——趁各部相斗，正好逐个吞了他们！」 #speaker:部将
#show:qingyue:worry:float
「呐——划重点！这是你的第一步，也是最容易走岔的一步。」 #speaker:青月
「你手上有的是勇力和天纵之才。要怎么让天下归你？」 #speaker:青月

* #correct #hint:轩辕乃修德振兵，蓺五种，抚万民——先让百姓活得下去，再谈刀兵。 [先修明德政、整顿军队，教民种五谷、安抚万民，而后以兵征那些不来朝贡的]
	-> c_binfu
* #hint:恃力强征，是暴虐的老路，与你要取代的神农之乱有何两样？ [依部将之言，趁乱起兵，凭勇力四处强征——谁不服就先打谁，立威最快]
	-> c_death_conquer

=== c_binfu ===
#bg:xuanyuan_qiu
#show:qingyue:smile:float
「欸——漂亮！你没有先去抢，而是先去养。」 #speaker:青月
你调理五行之气，按时令种植五谷，丈量四方，让流离的人重新有了田、有了家。 #speaker:青月 #hint:治五气，蓺五种，抚万民，度四方。
你这才操练干戈，去征讨那些不肯朝贡的诸侯。刀锋所指，人心已定——诸侯纷纷前来归附听命。 #speaker:青月 #hint:于是轩辕乃习用干戈，以征不享，诸侯咸来宾从。
#show:qingyue:calm:float
「你看，德是根本，兵是辅佐。先修德而后用兵，诸侯才肯真心归你——史官量一个上古帝王，量的就是这把尺子。」 #speaker:青月

* [「我想知道，如何『治五气，蓺五种』？」]
	#show:qingyue:calm:float
	「治五气，就是观察金木水火土的运行规律，顺应时节。蓺五种嘛，就是教百姓种黍、稷、稻、麦、菽这五种谷物。」 #speaker:青月
	「你让人观测天象、制定历法，告诉农人什么时候播种、什么时候收割。有了饭吃，人心就定了。」 #speaker:青月
	-> c_binfu_next
* [「诸侯归附之后，该如何处置他们？」]
	#show:qingyue:calm:float
	「你没有把他们的族人掳走、土地吞并——你让他们各安其位，只要求他们承认你是共主，按时朝贡。」 #speaker:青月
	「这就是『抚万民』的意思。你不是要灭了他们，是要让他们心甘情愿地跟着你。」 #speaker:青月
	-> c_binfu_next
* [「操练干戈……我该如何训练我的军队？」]
	#show:qingyue:tease:float
	「上古的兵，不是光靠蛮力哦。你让人研究兵器，发明了指南车，还训练了一支『云师』——军纪严明，进退有度。」 #speaker:青月
	「等你真正用兵的时候，你就会发现，一支有纪律的军队，比十支乱哄哄的乌合之众都强。」 #speaker:青月
	-> c_binfu_next
* [「继续说。」]
	-> c_binfu_next

=== c_binfu_next ===
#show:qingyue:calm:float
「诸侯归附了，天下初安。可你知不知道——你那句『修德振兵』，落到了谁身上？」 #speaker:青月
#show:qingyue:smile:float
「有熊氏有个农夫，叫阿禾。他的地被乱兵踩过三回，三年没种出粮来。你修德振兵之后，派人丈量田亩、归还民田，还调来了良种。」 #speaker:青月
「阿禾拿到地契那天，手抖得握不住。新种子撒下去，苗比往年壮了一倍。夜里再没有兵过境的声音——他头一回把一整季的收成全收进了自家仓里。」 #speaker:青月
#show:qingyue:calm:float
「他妻子把新打的黍米煮了一锅，最小的孩子捧着碗，吃太急呛了一口，又笑又咳。阿禾蹲在田埂上想：原来太平年景，是这么个味道。」 #speaker:青月
#show:qingyue:tease:float
「你看，史书上写『治五气，蓺五种，抚万民』——九个字。可落在阿禾身上，是三年的荒地重新长出苗，是仓里头一回有余粮，是夜里再不用怕兵来抢粮。」 #speaker:青月
#show:qingyue:calm:float
「不过……有个人，还没服你。」 #speaker:青月
-> c_yandi

=== c_yandi ===
#bg:banquan_ye
#show:yandi:proud:center
炎帝。他也是一方共主，与你同源而立。如今他想侵凌诸侯，重整旧日的威权。 #speaker:青月 #hint:炎帝欲侵陵诸侯，诸侯咸归轩辕。
可诸侯的心，早已归了你。天下容不下两个共主——这一战，避不开了。 #speaker:青月
炎帝按剑而立，遥遥喝问，声音滚过旷野：「轩辕！神农氏之统在我。你一个后起小子，也配号令诸侯？」 #speaker:炎帝
你迎着他的目光，不退半步：「配不配，不在你我之口——在万民肯把日子托给谁。」 #speaker:轩辕
「你我同源。今日阵前，我要的是你俯首，不是你的头颅。」 #speaker:轩辕
#show:qingyue:worry:float
「呐——他不是蚩尤那种暴徒。他是你的同族，是这天下另一半的血脉。」 #speaker:青月
「这一仗要怎么打，可关系到你以后是个什么样的天子哦？」 #speaker:青月
-> c_battle

=== c_battle ===
你的兵已练，你的民已附，士气正盛。斥候来报：炎帝营垒森严，粮草充足，不是一鼓可下的。 #speaker:青月 #hint:以与炎帝战于阪泉之野。
#show:qingyue:tease:float
「唔——现在，你面前有几条路。」 #speaker:青月
「一条，趁着锐气，轻兵直捣他的中军，赌他一战就垮；一条，扎稳营盘，与他反复较量，一仗一仗地磨。」 #speaker:青月
「嘻，我才不告诉你答案~ 自己选！」 #speaker:青月

* #correct #hint:三战，然后得其志——阪泉不是一战之功，是三战之持重。 [沉住气，稳扎稳打——纵然旷日持久、将士多熬些血汗，也要一仗一仗压服他]
	-> c_win
* #hint:炎帝营垒森严、粮草充足，同族之兵岂是一鼓可破？轻进者，多为敌所乘。 [趁锐气正盛，轻兵疾进，直捣炎帝中军——速胜之功，唾手可得]
	-> c_death_rash
* [召见风后，询问炎帝军中虚实]
	-> c_explore_banquan_fenghou
* [不战。遣使赴炎帝营，愿以河为界，与同源之君二分天下、各治其民]
	-> if_erfen_1
* [战，且要斩草除根——三战胜后，不纳其降，趁势诛炎帝、并其部，永绝二主之患]
	-> if_zhuyan_1
* [先断其粮道。派兵绕至炎帝后方，截其粮草——粮尽则不战自溃]
	-> c_battle_cut_supply
* [遣使入炎帝营，晓以利害：若肯归附，可仍居其地，共享天下]
	-> c_battle_negotiate

=== c_battle_cut_supply ===
#bg:banquan_ye
#show:qingyue:worry:float
「断粮道……这法子够狠的。不过呀——」 #speaker:青月
你派兵绕至炎帝后方，果然截获了他的粮草。炎帝军中粮尽，士气低落。可你这一断，也断了两地百姓的活路——粮草被截，难民遍野。 #speaker:青月
#show:qingyue:calm:float
「你赢了仗，却伤了心。炎帝的兵是饿了，可那些跟着他的百姓也饿了。」 #speaker:青月
「这天下，不是靠断人活路得来的呀。」 #speaker:青月
炎帝见你如此行事，反而激起了死战之心——他宁死不降，与你殊死一搏。你虽最终取胜，却也伤亡惨重。 #speaker:青月
#show:qingyue:sad:float
「你赢了，可你输了人心。后世说起阪泉，只记得你断人粮道的狠辣——那个『炎黄合流』的美名，再也落不到你头上了。」 #speaker:青月
你虽胜，却成了一个只懂杀伐的霸主，而非能服万民的共主。 #death:supply #speaker:青月
-> END

=== c_battle_negotiate ===
#bg:banquan_ye
#show:qingyue:calm:float
「晓以利害……这倒是个办法。」 #speaker:青月
你遣使入炎帝营，说：「你我同源，何必相残？若肯归附，你仍居其地，共享天下。」 #speaker:青月
炎帝听了，沉吟良久。他知道自己大势已去，可又不甘心就此俯首。他提出一个条件：你必须承认他的地位，与他并列为二帝。 #speaker:青月
#show:qingyue:worry:float
「呐——他要的是名分，不是地盘。你能接受吗？」 #speaker:青月

* [接受。二帝并立，共治天下]
	-> if_erfen_1
* [不接受。天下只能有一个共主]
	-> c_battle
* [折中。许他为『炎帝』，但必须承认你是天下共主]
	-> c_battle_negotiate_good

=== c_battle_negotiate_good ===
#show:qingyue:smile:float
「欸——漂亮！你既给了他面子，又守住了底线。」 #speaker:青月
炎帝见你肯许他『炎帝』之号，终于俯首。他归入你的旗下，两族血脉合流——这就是正史里「炎黄合流」的由来。 #speaker:青月
#show:yandi:submit:center
#show:qingyue:calm:float
「你看，有时候，一句话比一刀更管用。」 #speaker:青月
「你不用三战，也不用流血——一纸盟书，就把两族合在了一起。」 #speaker:青月
「当然啦，史书上写的是『三战，然后得其志』——太史公没记你这一笔，可你走出来的结局，和他写的一样：炎帝归附，炎黄合流。」 #speaker:青月 #hint:后世以「炎黄子孙」并称，正本于黄帝、炎帝两大部族的融合。 #impact:impact_banquan_yanhuang
-> c_win_next

=== c_explore_banquan_fenghou ===
#show:qingyue:calm:float
风后是你帐中最善谋的臣子。他低声道：「炎帝本神农之后，营垒依山而建，粮草可支半年。他部众多善火攻——主公若要速战，须防火阵。」 #speaker:风后
#show:qingyue:tease:float
「记住啦——知己知彼，百战不殆。这个道理，后来被一个叫孙武的人写进了书里。」 #speaker:青月
-> c_battle

=== c_win ===
#bg:banquan_ye
#bgm:solemn
#achieve:huangdi_banquan
#show:qingyue:solemn:float
你没有贪那一战之功。你与炎帝在阪泉的郊野，反复交战——一仗，两仗，三仗。 #speaker:青月 #hint:三战，然后得其志。
到第三仗，炎帝的锐气尽了，你的根基却越打越稳。他终于俯首，认你为天下之主。 #speaker:青月
#show:yandi:submit:center
炎帝没有被杀。他归入你的旗下——从此，你们两族的血脉合流。后世的人，管这叫「炎黄」。 #speaker:青月 #hint:后世以「炎黄子孙」并称，正本于黄帝、炎帝两大部族的融合。 #impact:impact_banquan_yanhuang
#show:qingyue:calm:float
「呼——你听见了吗？两千年后，那片土地上每一个人，都还认你们俩做祖宗呢。」 #speaker:青月

* [「炎帝归附之后，我该如何安置他的部众？」]
	-> c_win_buzhong
* [「『三战然后得其志』……这三仗，具体是怎么打的？」]
	-> c_win_battle
* [「我想知道，炎帝后来怎么样了？」]
	-> c_win_yandi_later
* [「继续说蚩尤的事。」]
	-> c_win_next

=== c_win_buzhong ===
#show:qingyue:calm:float
「你没有把他们打散、迁走——你让他们保留自己的习俗，只要求他们承认你的共主地位。」 #speaker:青月
「神农氏的农桑之术，黄帝氏的历法之学，就这样合在了一起。你不是要同化他们，是要让他们变成一家人。」 #speaker:青月
#show:qingyue:smile:float
「后来呀，炎帝的子孙还出了不少有名的人呢——比如那个尝百草的神农氏后裔，一直被人记着。」 #speaker:青月
「两族通婚、互通有无，慢慢地，谁也分不出谁是炎帝的后人、谁是黄帝的后人了——大家只有一个名字：炎黄子孙。」 #speaker:青月

* [「那炎帝本人呢？他甘心吗？」]
	#show:qingyue:calm:float
	「甘心？一开始当然不甘心。可你给了他尊重、给了他位置，他看着自己的族人日子越过越好——慢慢地，他也就认了。」 #speaker:青月
	「人心这东西，不是打服的，是暖服的。」 #speaker:青月
	-> c_win_next
* [「继续说蚩尤的事。」]
	-> c_win_next

=== c_win_battle ===
#show:qingyue:tease:float
「太史公只写了一句话，没说细节。不过后世的人猜呀——」 #speaker:青月
「第一仗，你试探他的虚实。炎帝营垒森严，你攻不进去，但摸清了他们的布防。」 #speaker:青月
#show:qingyue:calm:float
「第二仗，你消耗他的锐气。你不跟他硬碰硬，而是断他的粮道、扰他的军心，让他的兵一天天疲惫。」 #speaker:青月
「第三仗，你一举压服他。他的兵已经疲了、粮已经尽了，而你这边士气正盛——三仗下来，他服了，你也没伤了和气。」 #speaker:青月
#show:qingyue:smile:float
「你看，打仗不是光靠勇力，是靠脑子。太史公只写了一句『三战，然后得其志』，可这一句里藏了多少门道呀。」 #speaker:青月

* [「炎帝军中有什么厉害的人物吗？」]
	#show:qingyue:calm:float
	「炎帝军中有个大将叫刑天，力大无穷。传说他后来被砍了头还以乳为目、以脐为口，继续战斗——当然，那是神话啦。」 #speaker:青月
	「不过正史里没写他的名字，只写了炎帝『欲侵陵诸侯』。真正的战场，也许没有神话那么浪漫。」 #speaker:青月
	-> c_win_next
* [「继续说蚩尤的事。」]
	-> c_win_next

=== c_win_yandi_later ===
#show:qingyue:calm:float
「他归附你之后，并没有被冷落哦。你让他继续管着南方的部族，教百姓耕种。」 #speaker:青月
「炎帝本来就是神农氏的后人，最懂农桑。你让他去管南方的水田，他种出来的稻子比谁都好。」 #speaker:青月
#show:qingyue:smile:float
「他活了很久，亲眼看着两族的年轻人通婚、看着『炎黄』这个名字被人叫响。他去世的时候，你已经是一方共主了。」 #speaker:青月
#show:qingyue:solemn:float
「你为他举行了盛大的葬礼，诸侯都来吊唁。后世的人，把他和你一起尊为华夏的始祖——不是因为他输了你，是因为他肯放下刀剑、与他和解。」 #speaker:青月
「这份和解，比任何一场胜仗都值钱。」 #speaker:青月

* [「炎帝和蚩尤……有什么区别？」]
	#show:qingyue:calm:float
	「炎帝是神农氏的后人，他身上流着的是华夏最古老的血脉。他跟你争天下，是为了重整神农氏的威权——不是为了抢粮、抢人。」 #speaker:青月
	「蚩尤不一样。他是九黎的首领，凶暴好战，诸侯都怕他。他不认什么共主，只认自己的刀。」 #speaker:青月
	#show:qingyue:worry:float
	「所以你对炎帝可以怀柔，对蚩尤……恐怕就不行了。」 #speaker:青月
	-> c_win_next
* [「继续说蚩尤的事。」]
	-> c_win_next

=== c_win_next ===
天下初定。可就在此时，一个名字如惊雷传来——蚩尤作乱，不听帝命，最为凶暴，莫能制伏。 #speaker:青月 #hint:而蚩尤最为暴，莫能伐。
#show:qingyue:tease:float
「欸嘿——别急着喘气呀。涿鹿那一场，才是真正的硬仗……不过那是下一世的事啦。」 #speaker:青月
「这一劫，你走完了。看懂了吗？先修德、后振兵，三战而不贪功——天下，是这么一寸一寸挣来的。」 #speaker:青月 #ending:canon
#hide:yandi
-> END

=== c_death_conquer ===
#bg:zhuhou_luan
#bgm:danger
你不修德、不抚民，只凭一身勇力四处强征。你的刀是快，可你抢来的粮、掳来的人，转眼就叛。 #speaker:青月
「怎么会……孤明明每战皆胜——」可你赢下了每一场仗，却输光了所有的人心。 #speaker:轩辕
你成了又一个「暴虐百姓」的诸侯——与你本要取代的乱世，再无分别。众叛亲离，你终被群起而攻，身死名裂。 #death:conquer #speaker:青月
-> END

=== c_death_rash ===
#bg:banquan_ye
#bgm:danger
你贪那一战之功，轻兵疾进，直扑炎帝中军。可他营垒森严，早有防备——你的锐师一头撞进了他的伏中。 #speaker:青月
同族之兵，反被同族所乘。你孤军深入，前后受敌，一败涂地。阪泉之野，成了你的葬身之地。 #death:rash #speaker:青月
-> END

// ═══ IF线 · 二分（自由模式歧路：不战，与炎帝划河而治）═══

=== if_erfen_1 ===
#bg:banquan_ye
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有拔剑。你遣使赴炎帝营，只说一句话：你我同源，何必同室操戈？以河为界，你治河南，我治河北，各安其民。 #speaker:青月
#show:yandi:proud:center
炎帝迟疑良久，终是点了头——他的锐气也经不起一场消耗，况且诸侯之心早偏了你，他也不敢真赌一场硬仗。 #speaker:青月
#show:qingyue:calm:float
「你看，血没有流。这一步，仁厚得很呀。」 #speaker:青月
可天下从此有了两个共主。你敬他，他敬你；你老了，他也老了。可你们的子孙，未必记得这份情。 #speaker:青月
#show:qingyue:sad:float
「诸侯朝东也可、朝西也可，久了，人心就散成两半啦。」 #speaker:青月
北疆荤粥来犯，你独木难支；东方蚩尤作乱，河南河北谁也不肯先出兵——两个共主，反而谁也号令不动一个完整的天下。 #speaker:青月
#show:qingyue:solemn:float
「后世称『炎黄』，本是两族合成一脉。可你这一分，它们就永远是两脉了。」 #speaker:青月
你与炎帝各自终老，都是仁厚之君。只是那个『代神农氏而有天下』的唯一共主，史书上，空着。 #speaker:青月
天下没有一统于你手，也就没有一个叫『黄帝』的共祖。你活得干净，天下却少了一个源头。 #ending:if_erfen #speaker:青月
#hide:yandi
-> END

// ═══ IF线 · 诛炎（自由模式歧路：三战胜后不纳降，诛炎帝并其部）═══

=== if_zhuyan_1 ===
#bg:banquan_ye
#bgm:danger
#show:qingyue:worry:float
「诛尽同源之族……这一步，史书也没写哦。」 #speaker:青月
你稳扎稳打，三战果然压服了炎帝。可这一次，他俯首认降时，你没有扶他起来——你要的是斩草除根。 #speaker:青月
#show:qingyue:sad:float
你诛了炎帝，尽并其部。河南河北，从此只有一个声音。你的刀，快得没有对手。 #speaker:青月
#show:qingyue:solemn:float
「史书里的你，是让炎帝归入旗下、两族血脉合流，后世才有『炎黄子孙』四个字。」 #speaker:青月
「可你把那另一半血脉，斩断在了阪泉。」 #speaker:青月
归附你的诸侯看在眼里：同源之君尚且不留，何况我们？他们口称臣，心里却各自防着你那把刀。 #speaker:青月
#show:qingyue:sad:float
「你赢了每一寸土地，却让天下人从此怕你、而不是服你。」 #speaker:青月
你以杀立威，威震四方，天下再无人敢反。可两千年后，那片土地上的人若来数祖宗，只数得出一个你——另一个，被你亲手抹去了。 #speaker:青月
你成了唯一的共主，也成了唯一。以杀合来的天下，握得越紧，凉得越快。 #ending:if_zhuyan #speaker:青月
-> END
