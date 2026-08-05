// ═══════════════════════════════════════════════
// 周幽王（姬宫涅） · 西周 · 烽火之笑
// 史源：《史记·周本纪》
// ═══════════════════════════════════════════════

VAR yu_wang = 0
VAR luan_zong = 0

-> act1_ji_wei

=== act1_ji_wei ===
#bg:xia_court_cold
#bgm:solemn
#show:qingyue:tease:float
「欸嘿……这一回……」青月的语气少见地沉了沉。 #speaker:青月
「你是姬宫涅，周幽王。西周的……末代天子。」 #speaker:青月
你睁开眼。宫殿依旧宏伟，但墙壁上有了裂纹，王座的扶手有些发暗。你父亲宣王四十六年的中兴，留下了一个表面光鲜、内里却已千疮百孔的周。 #speaker:青月
你即位的第二年，三川皆震——泾水、渭水、洛水三条大河都发生了地震，然后枯竭了，岐山也崩塌了。 #speaker:青月
#show:boyang:worried:left
太史伯阳父叹了口气：「周将亡矣……昔伊、洛竭而夏亡，河竭而商亡。今周德若二代之季矣，其川源又塞，塞必竭。夫国必依山川，山崩川竭，亡国之征也。」 #speaker:伯阳父
#show:qingyue:worry:float
「地震、河枯、岐山崩——这可不是什么好兆头呀。大臣们都心惊胆战的，你呢？」 #speaker:青月

* #hint:幽王无道——史实中他不管灾异，宠信佞臣 [（敛容）「天灾示警，寡人当修德以禳之。开仓济民，举贤任能。」]
    -> act1_xiu_de
* #correct [（哈哈大笑）「山崩地震，常事耳，何必惊动寡人？」——不理]
    ~ yu_wang = yu_wang + 1
    -> act1_ni_xiang

=== act1_xiu_de ===
#show:qingyue:smile:float
「唔……你要是真能听得进天诫，也许周还不会亡得这么快。」 #speaker:青月
但你没坚持多久。因为一个叫虢石父的佞臣开始围在你身边——他善于阿谀奉承、贪图财利，你却很信任他，让他主持国政。 #speaker:青月
-> act2_bao_si

=== act1_ni_xiang ===
#show:qingyue:sad:float
你不理天灾，继续你的享乐。大臣们摇头叹气，国人开始不满。 #speaker:青月
#show:guoshifu:sly:right
虢石父凑上来，笑得眼睛眯成一条缝：「大王，天灾乃阴阳常事，何足挂齿？人生苦短，及时行乐啊。」 #speaker:虢石父
你觉得他说得对。你让他主持政事，国人都怨声载道。 #speaker:青月
-> act2_bao_si

=== act2_bao_si ===
#bg:han_palace
#bgm:palace
你后宫有很多女人，但你都不喜欢。直到有一年——褒国献了一个美人，名叫褒姒。 #speaker:青月
#show:baosi:cold:center
她走进大殿的那一刻，整个宫殿都安静了。她美得像月光下的冰雪，可她从不笑。她是被褒国献来赎罪的，她的心里没有你。 #speaker:褒姒
#show:qingyue:solemn:float
「你从来没见过这么美的女人。可你从来没见她笑过。」 #speaker:青月
你爱上了她。褒姒为你生下了儿子伯服。你动了一个念头——废掉申后，改立褒姒为后；废掉太子宜臼，改立伯服。 #speaker:青月
#show:qingyue:worry:float
「等一下——申后是申侯的女儿，申侯是你岳父，手握西申之地、扼守西陲，还联着西方的犬戎。你废他女儿、废他外孙，等于在自己家的西大门上点了一把火呀。」 #speaker:青月
「废嫡立庶、废长立幼，这是周公定下的礼制根本；申侯的兵，是悬在镐京头上的刀。这一步，你当真要迈？」 #speaker:青月

* #correct #hint:欲废申后，去太子宜臼，以褒姒为后，伯服为太子——史实中他废了 [「我意已决。废申后，立褒姒；废宜臼，立伯服！」]
    -> act2_fei_hou
* [（想起申侯背后的犬戎，指尖一凉）「……不。名分乱不得，申侯动不得。褒姒我宠，后位与太子，仍是申后母子的。」——不废嫡]
    -> if_bufei_1

=== act2_fei_hou ===
#show:boyang:despair:left
太史伯阳父叹道：「祸成矣，无可奈何！」 #speaker:伯阳父
你终究废了申后与太子宜臼，立褒姒为后、伯服为太子。宜臼连夜逃奔申国去了。 #speaker:青月
#show:qingyue:worry:float
「祸根，你亲手种下了。不过眼前，你还有个别的烦恼——褒姒不笑。你用尽了各种办法，乐师奏乐、宫女跳舞、珠宝绫罗，她就是不笑。怎么办？」 #speaker:青月

* #hint:褒姒不好笑，幽王欲其笑万方，故不笑——但你可以不做蠢事 [（放弃）「她不笑便不笑吧。强逼她笑，又有什么意思呢？」]
    -> act3_bu_shi
* #correct [（对虢石父说）「谁能让娘娘一笑，赏千金！」]
    ~ luan_zong = luan_zong + 1
    -> act3_fenghuo

=== if_bufei_1 ===
#bg:han_palace
#bgm:contemplate
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有废后。你依旧宠着褒姒，赏她珠玉、许她华服，可申后仍是王后，宜臼仍是太子——名分，你一分未动。 #speaker:青月
申侯那道悬在镐京头上的刀，收回去了。犬戎失了兴兵的由头，西陲无事。 #speaker:青月
可宫墙之内，另一种战争才刚开始。褒姒抱着伯服，夜夜在你耳边落泪；虢石父进言，说伯服如何聪慧、宜臼如何忌惮她们母子。 #speaker:青月
#show:baosi:cold:center
「大王疼我，却不肯给伯服一个名分。」褒姒别过脸，「他日大王千秋万岁，我们母子，是死是活？」 #speaker:褒姒
#show:qingyue:solemn:float
「守住了礼法，却守不住枕边的眼泪。你还扛得住吗？」 #speaker:青月

* [「名分是社稷的根本。你受委屈，我以别的补偿你——太子，不换。」——守礼到底]
    -> if_bufei_shou
* [（终究心软）「……罢了，罢了。伯服……也是我的儿子。」——晚节废之]
    -> if_bufei_wan

=== if_bufei_shou ===
#bg:yushun_court
#bgm:solemn
#show:qingyue:default:float
你顶住了。褒姒的泪、虢石父的舌、伯服一天天长大的脸——你都顶住了，太子始终是宜臼。 #speaker:青月
你不是明君。你依旧信虢石父、依旧不修朝政、依旧宠着一个不爱你的女人。西周的衰颓，不因你守住这一条礼法而扭转。 #speaker:青月
#show:qingyue:solemn:float
「你救不了那个正在朽坏的周。你只是……没有亲手点燃那根引线。」 #speaker:青月
你崩逝后，宜臼顺理成章继位，是为平王。申侯是国丈，不曾反；犬戎无隙，不曾来；镐京城头，那一夜没有烽火，也没有铁蹄。 #speaker:青月
只是天子威权早已扫地，平王在位，诸侯坐大——不必东迁，周也已是那个「政由方伯」的周了。 #speaker:青月
#show:qingyue:smile:float
「西周没有那样惨烈地亡在你手里。可它没有得救，只是换了一种方式，慢慢地凉下去。」 #speaker:青月
「你守住的，是周王室最后一点体面。历史记住的你，不是烽火下的昏君，而是一个……平庸而无甚可说的天子。」 #speaker:青月
有时候，『无事可记』，就是一个末世之君能给天下最大的仁慈了。 #ending:if_bufei #speaker:青月
-> END

=== if_bufei_wan ===
#bg:xia_terrace
#bgm:tragic
#show:qingyue:sad:float
你到底还是心软了。晚了几年，你仍旧废了申后、改立伯服——只是这一次，是被枕边的眼泪，一点点磨着废的。 #speaker:青月
可迟来的祸，不会因为迟来就变轻。申侯照样怒了，照样联了犬戎。你绕了一大圈，还是走回了那条路——只是走得更狼狈，因为连「果决」这点体面都没剩下。 #speaker:青月
#show:qingyue:solemn:float
「你想两全——既要褒姒的欢心，又要申侯的安分。可有些事，从你动念的那一刻，就注定只能选一样。」 #speaker:青月
「拖到最后才废，和一开始就废，结局是一样的。犬戎的马蹄，不会因为你犹豫过，就慢一步。」 #speaker:青月
镐京城破那夜，你才明白：真正废掉周室的，从来不是废后那道诏书，是你既想守礼、又舍不得放手的那颗心。 #ending:if_wanfei #speaker:青月
-> END

=== act3_bu_shi ===
#show:qingyue:smile:float
你没有勉强褒姒笑。她仍然不爱笑，但你尊重她，不再逼她。 #speaker:青月
你还做了一件正确的事——没有去点骊山的烽火。 #speaker:青月
-> act4_shen_hou

=== act3_fenghuo ===
#bg:li_shan
#bgm:danger
虢石父给你出了个主意：「大王，骊山上设了二十多座烽火台和大鼓，是防备敌寇、征召诸侯用的。如果大王举起烽火，诸侯的援兵必定赶来，来了却没有敌寇，娘娘一定会笑的。」 #speaker:青月
#show:qingyue:worry:float
「烽火啊——那是军事信号！只有犬戎打过来的时候才能点的！点了烽火，诸侯就要千里迢迢带兵赶来勤王——这可不是闹着玩的！」 #speaker:青月
你带着褒姒上了骊山。傍晚的山风很凉，她站在你身边，面无表情地看着远处的烽火台。 #speaker:青月
#show:qingyue:solemn:float
「你要想清楚了。点，还是不点？」 #speaker:青月

* #hint:幽王为烽燧大鼓，有寇至则举烽火——史实中他点了 [（望着褒姒的侧脸，放下手）「烽火是军国重器，不可戏。」]
    -> act3_bu_shi
* #correct [「点！举烽火！」——点燃烽火]
    ~ luan_zong = luan_zong + 1
    -> act4_fenghuo_xi

=== act4_fenghuo_xi ===
#bg:mingtiao_war
#bgm:battle
#show:qingyue:sad:float
「你点了……」 #speaker:青月
烽火点燃了！一座接一座，火光冲天，从骊山一直传到诸侯的封地。鼓声震天。 #speaker:青月
没过多久，尘土飞扬——诸侯们带着军队赶来了！他们以为犬戎打过来了，一个个汗流浃背、丢盔弃甲，赶到骊山脚下—— #speaker:青月
没有敌寇。只有你和褒姒在城楼上饮酒作乐。 #speaker:青月
#show:baosi:laugh:center
褒姒看到诸侯们狼狈不堪、惊慌失措的样子，终于——笑了。 #speaker:褒姒
她笑起来，比你想象的还要美。你心花怒放，重赏了虢石父千金。 #speaker:青月
#show:qingyue:sad:float
「她笑了。可是……诸侯们呢？他们看见你在城楼上笑着看他们，知道自己被耍了。」 #speaker:青月
你很高兴，于是后来又数举烽火——点了好几次。诸侯们一次次赶来，一次次被耍。 #speaker:青月
#show:qingyue:solemn:float
「你有没有听过『狼来了』的故事？烽火点得多了，诸侯们——就不再来了。」 #speaker:青月
本幕通关。 #actclear:youwang_act1 #speaker:青月
-> act5_quan_rong

=== act4_shen_hou ===
你没有点烽火，也没有逼褒姒笑。这很好——但那个被废掉的申后和太子宜臼，正在逃去申国的路上。 #speaker:青月
-> act5_quan_rong

=== act5_quan_rong ===
#bg:zhuhou_luan
#bgm:battle
申后的父亲——申侯，得知女儿被废、外孙被逐，怒不可遏。他做了一件惊天动地的事——联合缯国和西方的犬戎，举兵攻打镐京！ #speaker:青月
#show:qingyue:sad:float
「犬戎！那个杀人不眨眼的蛮族！申侯为了给女儿出气，竟然联合犬戎来打自己的天子！」 #speaker:青月
镐京城外，烟尘漫天，犬戎的骑兵已经到了！ #speaker:青月
你现在——要举烽火召诸侯来救吗？ #speaker:青月

* #correct #hint:幽王举烽火征兵，兵莫至——你之前玩太多次了 [（冲到烽火台）举烽火！举烽火！召诸侯勤王！]
    -> act5_jiu_bing
* [「犬戎不足为惧！寡人亲自率军出战！」]
    -> death_chu_zhan

=== act5_jiu_bing ===
#bg:li_shan
#bgm:tragic
你命人点燃了所有的烽火。火光映红了半边天，鼓声震耳欲聋。 #speaker:青月
你等着。 #speaker:青月
一个时辰过去了。两个时辰过去了。 #speaker:青月
#show:qingyue:sad:float
「……没有人来。」 #speaker:青月
一个诸侯都没有来。因为你之前点了太多次，他们以为你又在开玩笑，又在逗褒姒笑。 #speaker:青月
{ luan_zong >= 2:
    #show:qingyue:sad:float
    「烽火戏诸侯，一笑失天下。」 #speaker:青月
    -> ending_wang_guo
- else:
    #show:qingyue:smile:float
    「等等——等等！东方的地平线上，有尘土了！有军队来了！」 #speaker:青月
    你没有拿烽火开玩笑，所以诸侯们相信这次是真的。秦、晋、卫、郑的军队陆续赶到，犬戎在诸侯联军面前仓皇撤退。 #speaker:青月
    你活了下来。镐京保住了。 #speaker:青月
    -> ending_cun_zhou
} #speaker:青月

=== death_chu_zhan ===
你率军亲出战。可你是在深宫长大的，你的父亲宣王虽然打过仗，但你从来没有上过战场。 #speaker:青月
犬戎的骑兵凶如狼虎，周军久疏战阵，一触即溃。你死在乱军之中，犬戎攻破镐京，大肆烧杀抢掠。 #speaker:青月
#show:qingyue:sad:float
「你自己冲出去倒是壮烈。可你死了，谁来保护都城？谁来保护百姓？」 #speaker:青月 #death:chuzhan
-> END

=== ending_wang_guo ===
#bg:xia_terrace
#bgm:tragic
犬戎攻破了镐京。 #speaker:青月
他们在镐京烧杀抢掠，把你聚敛的财宝洗劫一空。你带着褒姒和伯服仓皇出逃，逃到骊山脚下，被犬戎追上了。 #speaker:青月
#show:qingyue:sad:float
你死在骊山脚下。和伯服一起被杀了。褒姒被犬戎掳走了。 #speaker:青月
#show:qingyue:solemn:float
「你死后，诸侯们才发现这次是真的——他们赶来了，但已经晚了。」 #speaker:青月
「申侯和诸侯们立了原来的太子宜臼，是为周平王。平王东迁洛邑——西周，亡了。」 #speaker:青月
#show:qingyue:sad:float
「你宠爱一个女人不是错，想让她笑也不是错。可你不该拿天下当玩笑，不该拿烽火当儿戏——」 #speaker:青月
「那一座座烽火台，是周王室最后的信用。你玩一次，信用少一分；玩多了，就什么都没了。」 #speaker:青月
「烽火戏诸侯的故事，后世讲了三千年。人们都说你是昏君。可青月在想——你若只是一个贵族家的公子，也许不过是个宠老婆的男人罢了。」 #speaker:青月
「可你是天子啊。天子的一笑，太重了——重到一个王朝都背不起。」 #ending:canon #speaker:青月
#achieve:youwang_fenghuo
-> END

=== ending_cun_zhou ===
#bg:yushun_court
#bgm:solemn
诸侯联军击退了犬戎。 #speaker:青月
你虽然之前做了些错事——废长立幼、宠信虢石父，但你没有拿烽火开玩笑，所以最后关头诸侯救了你。 #speaker:青月
#show:qingyue:smile:float
「你活下来了。西周也活下来了。」 #speaker:青月
「但你要好好反思——为什么会走到今天这一步？」 #speaker:青月
你把虢石父罢黜了，把申后和太子宜臼接了回来，重新立宜臼为太子。你不再沉迷酒色，开始修德行政。 #speaker:青月
西周的国祚，又延续了几十年。 #speaker:青月
#show:qingyue:default:float
「其实啊——褒姒不是什么妖妃，烽火也不是什么致命的玩笑。真正致命的，是一个天子觉得自己可以为所欲为。」 #speaker:青月
「你在悬崖边上，停住了。这就够了。」 #ending:if_zishou #speaker:青月
-> END
