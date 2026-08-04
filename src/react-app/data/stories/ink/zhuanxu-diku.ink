// ═══════════════════════════════════════════════
// 颛顼帝喾 · 承天执中
// 史源：《史记·五帝本纪》
// 两代过渡轻章：前半颛顼（高阳），后半帝喾（高辛）
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════

VAR mg_result = ""
VAR mg_score = 0

-> c_open

// ───────── 颛顼（高阳）·上半 ─────────

=== c_open ===
#bg:gaoyang_court
#bgm:solemn
#show:qingyue:tease:float
「今天的行程有点特别哦——一票，两程。」 #speaker:青月
「你瞧，我手里捏着帝王谱的两页：前半页写着高阳，后半页写着高辛。这一回穿越，你要一口气把祖孙两代帝王都活一遍呢。」 #speaker:青月
「先翻前半页。你是黄帝的孙子，昌意的儿子，高阳。世人日后唤你——帝颛顼。」 #speaker:青月
你睁开眼。黄帝新崩，桥山的封土还湿着。天下的目光落在你肩上，沉得像一整座山。 #speaker:青月 #hint:黄帝崩，葬桥山……其孙昌意之子高阳立，是为帝颛顼也。
#show:qingyue:calm:float
「唔……你有圣德，这一点史书替你担保了。可圣德不是天生就会用的呀。」 #speaker:青月
-> c_temper

=== c_temper ===
#show:qingyue:worry:float
四方来奏：北方幽陵未附，南方交阯生乱，西边流沙、东边蟠木，皆观望不前。 #speaker:青月
一位须发皆白的老臣颤声催促：「君上！四方观望，皆因新君威权未立。此时不以雷霆震慑，只怕人人都当高阳好欺啊！」 #speaker:老臣
「呐——划重点！这是你当家的第一道坎。天下人在看你是什么样的君王：是沉得住气，还是压不住火？」 #speaker:青月
#show:qingyue:tease:float
「新君急着立威，最容易一拍案子就出兵。可史书上的高阳……偏偏不是那样的人哦？」 #speaker:青月

* #correct #hint:静渊以有谋——他文静渊深，谋定而后动，从不被一时之势推着走。 [按住性子，静观事理，谋定而后动——哪怕一时被四方看轻]
	-> c_govern
* #correct [召见老臣，详询四方虚实——不急着动，先听清楚]
	-> c_explore_temper_minister
* [依老臣所请，即刻发兵四方——新君立威，正在此一举]
	-> c_temper_die

=== c_temper_die ===
#bg:gaoyang_court
#bgm:court
你血一上头，令旗四出，大军仓促分道。可你既未审地利，又未顺天时，号令自相矛盾，四方之师进退失据。 #speaker:青月
本该归服的动静之物、大小之神，反因你的躁乱而离心。天下未定，政先乱了。 #death:zaojin #speaker:青月
-> END

=== c_govern ===
#bg:gaoyang_field
#bgm:peaceful
#show:qingyue:smile:float
「欸——沉住了！跟他一个样，聪明。」 #speaker:青月
「传孤的话：兵，一个也不发。」你把满案的令旗一一按下，「先让孤看清这天下，再谈定这天下。」 #speaker:颛顼
你没有急着动兵。你走到田间、走到山林，看百谷草木、看四时星象。 #speaker:青月 #hint:静渊以有谋，疏通而知事。
#show:qingyue:calm:float
臣工又请：既不即刻用兵，那当以何治天下？是先修甲兵、囤粮备战，还是先理民生、顺天敬神？ #speaker:青月
「唔，第二道坎来啦。天下之大，你要先抓哪一头呀？」 #speaker:青月

* #correct #hint:养材以任地，载时以象天，依鬼神以制义，治气以教化，絜诚以祭祀——五者并举，方是颛顼之治。 [养材任地、载时象天、依鬼神制义、絜诚祭祀]
	-> c_reach
* #correct [亲访田间，看百谷草木如何顺天生长——先看再定]
	-> c_explore_govern_field
* #correct [先修甲兵、囤粮备战，一切让位于武力]
	-> c_govern_soft
* #correct [彻底『绝地天通』——严禁民间私祭鬼神，天地之通尽归天子一人执掌]
	-> if_juetong_1

=== c_govern_soft ===
#show:qingyue:worry:float
你把心力都压在兵甲上，田土荒了，四时乱了，祭祀废了，教化停了。 #speaker:青月
甲兵虽利，人心却散——你渐渐明白，武力从来镇不住一颗颗离你而去的心。 #speaker:青月
#show:qingyue:tease:float
「欸欸，别急着走这条道呀！史书上的高阳，可不是靠刀子服人的。回去，再选一次？」 #speaker:青月
-> c_govern

=== c_reach ===
#bg:gaoyang_field
#bgm:peaceful
#show:qingyue:smile:float
你杂植百谷以尽地利，依顺四时以效天象，纳鬼神之祀于礼义，调五行之气以行教化，洁身诚敬以主祭祀。 #speaker:青月 #hint:养材以任地，载时以象天，依鬼神以制义，治气以教化，絜诚以祭祀。
#show:qingyue:solemn:float
于是你的德威，北至幽陵，南至交阯，西至流沙，东至蟠木。 #speaker:青月 #hint:北至于幽陵，南至于交阯，西至于流沙，东至于蟠木。
「……动静之物，大小之神，日月所照，莫不砥属。」 #speaker:青月 #hint:动静之物，大小之神，日月所照，莫不砥属。
#show:qingyue:calm:float
「你看——不靠一兵一卒，天下自己归了心。这就是『静渊有谋』四个字的分量呀。」 #speaker:青月
那位曾劝你发兵的老臣，此刻伏地长拜：「老臣愚钝。原来镇住天下的，从来不是刀……」你扶起他，只笑了笑：「是沉得住气的心。」 #speaker:颛顼
#show:qingyue:smile:float
「最厉害的武器，是你按住不动的那个手心。」 #speaker:青月
-> c_transition

// ───────── 转场：颛顼崩，高辛立 ─────────

=== c_transition ===
#bg:xingye_night
#bgm:solemn
#show:qingyue:sad:float
岁月流转。你老了，你崩了，葬入青史。 #speaker:青月 #hint:颛顼崩，而玄嚣之孙高辛立，是为帝喾。
「呐……一代人有一代人的路。高阳走完了，接下来该另一个人上场了。」 #speaker:青月
#show:qingyue:tease:float
「别急着走呀——我这就把你穿越到下一个人身上。这一回你是黄帝的曾孙，玄嚣这一支的高辛。世人唤你，帝喾。」 #speaker:青月
你再睁眼时，已是另一副身骨。传说你生下来就有神灵之异，一开口便能说出自己的名字。 #speaker:青月 #hint:高辛生而神灵，自言其名。
#show:qingyue:calm:float
「聪以知远，明以察微——你天生就听得见远方，看得清幽微。可天赋越高，越容易恃才而傲哦？」 #speaker:青月 #hint:聪以知远，明以察微。
-> c_gaoxin

// ───────── 帝喾（高辛）·下半 ─────────

=== c_gaoxin ===
#bg:gaoxin_court
#bgm:court
#show:qingyue:worry:float
你即位不久，四方来贺，也来试探。 #speaker:青月
近臣凑上前来，声音压得极低：「君上生而神灵、自言其名，聪明冠世——天下之思，何须假手他人？独断乾纲，以君上一人之明，代天下之思便是。」 #speaker:近侍
「呐，划重点——最聪明的人，最容易犯一个错：把天下当成自己一个人的棋盘。」 #speaker:青月
#show:qingyue:tease:float
「史书上的高辛偏不这样。他那么聪明，却偏偏……最肯低头看天、看民。你猜他怎么选？」 #speaker:青月

* #correct #hint:顺天之义，知民之急，明鬼神而敬事之——他把明智收进敬顺里，不敢以己意凌天下。 [顺天之义、知民之急，明鬼神而敬事之]
	-> c_zhichong
* #correct [遣人四方采听民声——聪以知远，先听再说]
	-> c_explore_gaoxin_listen
* #correct [恃聪明独断，以一人之智号令天地鬼神]
	-> c_gaoxin_arro

=== c_gaoxin_arro ===
#show:qingyue:worry:float
你恃着过人的聪明，凡事独断，不问天时，不恤民急，连鬼神之祀也轻慢了。 #speaker:青月
初时无人敢言，可天道不因你聪明而偏私，民心不因你神异而久附。你越是自恃，天下越是离你而去。 #speaker:青月
#show:qingyue:tease:float
「欸——聪明反被聪明误呀！史书里的高辛，是把聪明收进『敬顺』里的。回去，换个选法？」 #speaker:青月
-> c_gaoxin

=== c_zhichong ===
#bg:gaoxin_court
#bgm:court
#show:qingyue:smile:float
「孤纵然聪明，也不过是天地间的一双眼睛。」你摆手屏退近臣，「眼睛该替天下看路，不该替天下人走路。」 #speaker:帝喾
你顺应天道，体察民急；广施恩泽，利物却不为己身。 #speaker:青月 #hint:普施利物，不于其身……顺天之义，知民之急。
你明察鬼神而恭敬奉事，仁而有威，惠而有信，修身而天下自服。 #speaker:青月 #hint:仁而威，惠而信，修身而天下服。
#show:qingyue:calm:float
可最后一道坎，才最见一个君王的分寸——大地的材物取用不尽，你要如何花它？ #speaker:青月
「呐，这一步最难：手里有天下的财，你是尽情用，还是……省着用、匀给万民？」 #speaker:青月

* #correct #hint:取地之财而节用之，抚教万民而利诲之，帝喾溉执中而遍天下——一个『执中』，压住了所有的贪欲。 [取地之财而节用之，抚教万民、执中不偏——天子之尊，与常士同衣]
	-> c_end_sage
* #correct [亲视仓廪，看天下材物几何——先算再花]
	-> c_explore_zhichong_store
* [天下之财尽归于我——高台广厦、钟鼓玉帛，广取厚用以奉一身之尊，谁曰不宜？]
	-> c_gaoxin_die

=== c_gaoxin_die ===
#bg:gaoxin_court
#bgm:court
你竭泽而取，厚敛以奉己身，教化废弛，历数不修，鬼神之敬也流于虚文。 #speaker:青月
大地的材物终有尽时，民力也终有竭时。你失了『执中』二字，天下便一寸寸从你手里流走。 #death:shimin #speaker:青月
-> END

=== c_end_sage ===
#bg:gaoxin_court
#bgm:solemn
#achieve:zhuanxu_diku_zhizhong
「地里长出来的每一粒米，都要匀给日月照得到的每一张嘴。」你抚着新收的谷穗，声音很轻，「孤这里少用一分，天下便多活一人。」 #speaker:帝喾
你取地之财而节制使用，抚育教导万民而使之知利，以历法迎送日月节气，明鬼神而敬奉之。 #speaker:青月 #hint:取地之财而节用之，抚教万民而利诲之，历日月而迎送之，明鬼神而敬事之。
#show:qingyue:solemn:float
「其色郁郁，其德嶷嶷。其动也时，其服也士。」 #speaker:青月 #hint:其色郁郁，其德嶷嶷。其动也时，其服也士。
「……帝喾溉执中而遍天下，日月所照，风雨所至，莫不从服。」 #speaker:青月 #hint:帝喾溉执中而遍天下，日月所照，风雨所至，莫不从服。
你面容肃穆，德行高峻，行必以时，衣如常士。你持守中正之道，天下无远弗届，尽皆归心。 #speaker:青月
#actclear:zhuanxu_diku_act
#show:qingyue:tease:float
「呐，这两代帝王的原文，你记全了吗？来，把这些竹简缀回去——高阳的静渊，高辛的执中，都在里头哦。」 #speaker:青月
#minigame:bamboo:1:3:5
{ mg_result == "win":
	#show:qingyue:smile:float
	「{mg_score} 分，竹简归序，两代帝王的德行，你全记下了。」 #speaker:青月
- else:
	#show:qingyue:sigh:float
	「简序暂乱也无妨，静渊与执中的道理，你心里已经明白了。」 #speaker:青月
}
-> c_diku_coda

=== c_diku_coda ===
#show:qingyue:smile:float
「呼——两代人，一条路，你都走通了。」 #speaker:青月
「高阳的『静渊』，高辛的『执中』——一个不躁，一个不偏。你发现没？华夏的君德，从这里就定了调子呀。」 #speaker:青月 #hint:执中，即后世尧舜『允执厥中』之训的源头。
#show:qingyue:worry:float
「欸，临了还有一桩心事——你有好几个儿子。长子挚，嫡出，名正；幼子放勋，德厚，望重。这天下，你身后想传给谁？」 #speaker:青月 #hint:帝喾娶陈锋氏女生放勋，娶娵訾氏女生挚。帝喾崩，而挚代立。

* #correct #hint:帝喾崩，而挚代立；帝挚立不善，而弟放勋立，是为帝尧——史实是让位子自然更替，天子不强定。 [不强定。依长幼之序令挚先立，此后由天下人心与德行自然更替]
	-> c_lineage_shishi
* #correct [钦定嫡长挚，且以父命强保之——立铁律，非嫡长不得继，纵挚不肖，亦不许更易]
	-> if_baozhi_1

=== c_lineage_shishi ===
#show:qingyue:solemn:float
「日后高辛娶陈锋氏女，生下放勋——那便是帝尧了。挚先立而不善，天下便自然归了放勋。天子不强定，德便自己走到了对的人身上。」 #speaker:青月 #hint:帝喾崩，而挚代立。帝挚立，不善，而弟放勋立，是为帝尧。
#show:qingyue:smile:float
「天下，正一步步走向那场最有名的禅让。不过……那是下一回穿越的故事啦。」 #speaker:青月 #ending:canon #impact:impact_diku_jingyuanzhizhong #quiz:quiz_diku_jingyuan
-> END

// ═══ 探索节点 · 颛顼帝喾 ═══

=== c_explore_temper_minister ===
#bg:gaoyang_court
#bgm:court
#show:qingyue:calm:float
你压下性子，召那位白发老臣入殿详问：「四方之事，你一一说来。北边幽陵、南边交阯，究竟乱成什么样了？」 #speaker:颛顼
老臣颤声禀报：「北边幽陵，有部落不服新主，互相攻伐；南边交阯，瘴疠之地，使者三去三回，皆言当地首领观望不肯来朝。西边流沙、东边蟠木，也是差不多的光景——都在等，等新天子是个什么样的人。」 #speaker:老臣
#show:qingyue:tease:float
「你看——急着出兵，你能打几面？北、南、西、东，四面同时打？」 #speaker:青月
「高阳的聪明，正在于他先看清了：这些乱，不是一刀能斩的。得先立个样子，让四方自己服回来。」 #speaker:青月

* #correct [追问：四方之中，哪一处最急？]
	#show:qingyue:calm:float
	「老臣说：北边最急。幽陵之乱若不平，恐成心腹之患。」 #speaker:青月
	「可高阳偏偏没先打北边——他先理清了天时、地利、人和，再一处一处来。急，不是办法。」 #speaker:青月
	-> c_temper
* #correct [追问：先帝黄帝在时，如何处置此类事？]
	#show:qingyue:solemn:float
	「老臣眼里泛了光——『先帝啊……先帝从不急。他修了五气、种了五种，把百姓安顿好了，诸侯自己就来宾从了。』」 #speaker:青月
	「听见没？黄帝定天下的法子，不是先打仗，是先修德。高阳是黄帝的孙子，这笔账，他算得比谁都清楚。」 #speaker:青月
	-> c_temper
* #correct [已问明白，回去决断]
	-> c_temper

=== c_explore_govern_field ===
#bg:gaoyang_field
#bgm:peaceful
#show:qingyue:calm:float
你没有急着议政，先去了田间。 #speaker:青月
正是初春，田里的农夫在翻土。你蹲下来看——土是好土，可播种的时令还没人定下来，农夫们各凭经验，有的早种了，有的还等着。 #speaker:青月
「你看，这就是『载时以象天』的用处——天子不定时令，农夫就各种各的，迟早乱套。」 #speaker:青月
一位老农认出了你，颤巍巍跪下：「君上！去岁冬至，小人按老法子种的黍，全冻死了。今年该何时下种，小人心里没底啊……」 #speaker:老农

* #correct [问他：以前是按什么定的农时？]
	#show:qingyue:calm:float
	「老农说：『看天。老辈子传下来的规矩——鸟星见了就春耕，大火偏了就秋收。可这些年，星象跟时令对不大上了，小人也拿不准了。』」 #speaker:青月
	「呐——这就是颛顼要做的事：把星象和农时重新校准，颁行天下。不是拍脑袋，是去问天。」 #speaker:青月
	-> c_govern
* #correct [问他：除了农时，还缺什么？]
	#show:qingyue:worry:float
	「老农叹气：『缺安生。兵一过，什么都剩不下。缺种子——好种子都被征走了。缺……指望。』」 #speaker:青月
	「『养材以任地』——不只是种地，是让百姓有指望、有安生。颛顼要做的，是把这些一样一样补上。」 #speaker:青月
	-> c_govern
* #correct [心里有数了，回去议政]
	-> c_govern

=== c_explore_gaoxin_listen ===
#bg:gaoxin_court
#bgm:court
#show:qingyue:calm:float
你没有急着定夺，先遣人去四方采听民声。 #speaker:青月
消息一程程传回来—— #speaker:青月
「东边的人说：今年鱼汛早了半月，渔人没备好网，错过了一季。」 #speaker:青月
「西边的人说：流沙那边的商队来少了，市集上的盐涨了三成。」 #speaker:青月
「南边的人说：交阯的稻子今年长得好，可运不出来——路不好走。」 #speaker:青月
#show:qingyue:tease:float
「你看，聪以知远——可再聪明的人，不竖起耳朵听，也听不见这些。」 #speaker:青月
「高辛的天赋是听得见远方，可他真正了不起的，是肯去听。」 #speaker:青月

* #correct [追问：这些问题，天子能解决几个？]
	#show:qingyue:calm:float
	「青月说：『一个个来。鱼汛早了，是历法不准——改历。盐涨了，是商路不通——修路。稻子运不出，也是路——同样的路，修通了，一路解决三样。』」 #speaker:青月
	「你看，天子不必亲力亲为，可他得先知道问题在哪儿。『知民之急』，急的就是这些。」 #speaker:青月
	-> c_gaoxin
* #correct [追问：从前帝喾独断时，这些问题有人管吗？]
	#show:qingyue:worry:float
	「青月摇头：『没人管。因为天子一个人，管不过来。独断的聪明，够不上天下的辽阔。』」 #speaker:青月
	「高辛懂一个道理：天赋再高，也只是一个人。把眼睛和耳朵分给四方的人，天下才看得全、听得清。」 #speaker:青月
	-> c_gaoxin
* #correct [听明白了，回去决断]
	-> c_gaoxin

=== c_explore_zhichong_store ===
#bg:gaoxin_court
#bgm:court
#show:qingyue:calm:float
你没听近臣的，先去了仓廪。 #speaker:青月
管仓的老吏迎上来，翻开竹简：「君上，天下岁入：黍三万石，稷两万石，稻一万石，帛五千匹……」 #speaker:老吏
你看着满仓的粮帛，问了一个近臣没想到的问题：「天下有多少张嘴？这些够吃多久？」 #speaker:帝喾
老吏算了算，脸色变了：「若按现有人口……勉强够到明年秋收。若逢灾年……」 #speaker:老吏
#show:qingyue:solemn:float
「你看——天子手里有钱粮，可天下也有那么多张嘴。取之有度，用之有节，才撑得住。」 #speaker:青月
「高辛的聪明在于：他看到了仓里的粮，也算到了天下的嘴。一个『执中』，就是秤杆子压在中间——不多取，不滥用。」 #speaker:青月

* #correct [追问：如果天子尽情用，会怎样？]
	#show:qingyue:worry:float
	「老吏说：『天子若修一座高台，要耗粮三千石、帛五百匹、民夫万人。万人的地就荒了，三千石的粮就空了。』」 #speaker:青月
	「一座台子，就抽空了三个县的口粮。你觉得还修得起吗？」 #speaker:青月
	-> c_zhichong
* #correct [追问：节用之后，省下来的怎么花？]
	#show:qingyue:smile:float
	「青月说：『高辛的做法是——省下来的，匀给万民。抚教、利诲，把粮种分给缺种子的地方，把帛分给织不起衣的寒家。』」 #speaker:青月
	「天子少穿一件锦衣，民间就多十个人穿得上布衣。这就是『取地之财而节用之，抚教万民而利诲之』。」 #speaker:青月
	-> c_zhichong
* #correct [心里有数了，回去定夺]
	-> c_zhichong

// ═══ IF线 · 绝地天通（自由模式歧路：颛顼严绝民神之通）═══

=== if_juetong_1 ===
#bg:gaoyang_field
#bgm:solemn
#show:qingyue:worry:float
「『绝地天通』——这四个字，后世传得神乎其神。你偏要把它走到底哦？」 #speaker:青月 #hint:传颛顼命南正重司天以属神，火正黎司地以属民，绝地天通。
你下了严令：民间不得私通鬼神，天地之间那条路，只许天子一人走。祭祀之权，尽收于上。 #speaker:青月
#show:qingyue:calm:float
「起先，真清静了。淫祀绝了，妖言息了，民神不再杂糅，天下秩序井然。」 #speaker:青月
可这条路握得太紧。四方之民有疾苦、有祈愿，从前尚能向天地诉一诉；如今，连一炷香都要经天子之许。 #speaker:青月
#show:qingyue:sad:float
「你把『通天』变成了独占。民不敢祭，也就渐渐不敢言了。庙堂之上你听得见的，越来越少。」 #speaker:青月
远方之神、大小之祀，本该『莫不砥属』地归心；如今归的是你的禁令，不是你的德。 #speaker:青月
#show:qingyue:solemn:float
「史书里的高阳，是『依鬼神以制义』——把鬼神收进礼义里，是引导，不是禁绝。」 #speaker:青月
「你用一道禁令换来了肃静，却把那份『静渊之德』，换成了森森之威呀。」 #speaker:青月
天下畏你、敬你、却不再亲你。你治得了秩序，治不了人心里那点想向天说话的念想。绝了地天之通，也绝了君民之间那点温度。 #ending:if_juetong #speaker:青月
-> END

// ═══ IF线 · 保挚（自由模式歧路：帝喾钦定嫡长挚，强保之）═══

=== if_baozhi_1 ===
#bg:gaoxin_court
#bgm:solemn
#show:qingyue:worry:float
「钦定嫡长、非嫡不继……这一步，也是史书没走的哦。」 #speaker:青月
你不愿身后有争。你钦定嫡长挚为储，立下父命：非嫡长不得继，纵有不肖，亦不许更易。 #speaker:青月
#show:qingyue:calm:float
「名分是钉死了。你崩后，挚依制而立，一个字都没争。」 #speaker:青月
可挚立而不善。政事一日荒过一日，那个德厚望重的放勋，只能站在一旁看着。 #speaker:青月 #hint:帝挚立，不善，而弟放勋立，是为帝尧。
#show:qingyue:sad:float
「史书里，挚不善，天下便自然归了放勋——那扇门是开着的，让德自己走过去。」 #speaker:青月
「你却用一道父命把门焊死了。挚再不肖，也得占着那个位子。」 #speaker:青月
天下人望着庸君受你铁律的护持，望着圣德的放勋无门可入，一点点离了心。你为嫡长挣了个铁定的位，却误了一整个本该更早到来的『尧天』。 #speaker:青月
#show:qingyue:solemn:float
「你护住的是一个儿子，耽误的是天下——这道理，你的后人尧，会替你想通的。」 #speaker:青月
你以父爱定了铁律，铁律却锁住了天命。执中之德传了两代，断在了你这一念的私心上。 #ending:if_baozhi #speaker:青月
-> END
