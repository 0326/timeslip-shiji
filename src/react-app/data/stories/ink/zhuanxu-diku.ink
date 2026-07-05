// ═══════════════════════════════════════════════
// 颛顼帝喾 · 承天执中
// 史源：《史记·五帝本纪》
// 两代过渡轻章：前半颛顼（高阳），后半帝喾（高辛）
// ═══════════════════════════════════════════════

VAR jing = false      // 前半是否守「静渊」
VAR jieyong = false   // 后半是否「节用抚民」

-> c_open

// ───────── 颛顼（高阳）·上半 ─────────

=== c_open ===
#bg:gaoyang_court
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一缕魂飘到我这儿啦，坐稳咯~」 #speaker:青月
「这一回你要变的人可了不得：黄帝的孙子，昌意的儿子，高阳。世人日后唤你——帝颛顼。」 #speaker:青月
你睁开眼。黄帝新崩，桥山的封土还湿着。天下的目光落在你肩上，沉得像一整座山。 #speaker:青月 #hint:黄帝崩，葬桥山……其孙昌意之子高阳立，是为帝颛顼也。
#show:qingyue:default:float
「唔……你有圣德，这一点史书替你担保了。可圣德不是天生就会用的呀。」 #speaker:青月
-> c_temper

=== c_temper ===
#show:qingyue:worry:float
四方来奏：北方幽陵未附，南方交阯生乱，西边流沙、东边蟠木，皆观望不前。臣工请你即刻发号，速定天下。 #speaker:青月
「呐——划重点！这是你当家的第一道坎。天下人在看你是什么样的君王：是沉得住气，还是压不住火？」 #speaker:青月
#show:qingyue:tease:float
「新君急着立威，最容易一拍案子就出兵。可史书上的高阳……偏偏不是那样的人哦？」 #speaker:青月

* #correct #hint:静渊以有谋——他文静渊深，谋定而后动，从不被一时之势推着走。 [按住性子，静观事理，谋定而后动]
	~ jing = true
	-> c_govern
* [新君当立威，即刻发兵四方，以雷霆震慑不臣]
	~ jing = false
	-> c_temper_die

=== c_temper_die ===
#bg:gaoyang_court
你血一上头，令旗四出，大军仓促分道。可你既未审地利，又未顺天时，号令自相矛盾，四方之师进退失据。 #speaker:青月
本该归服的动静之物、大小之神，反因你的躁乱而离心。天下未定，政先乱了。 #death:zaojin #speaker:青月
-> END

=== c_govern ===
#bg:gaoyang_field
#show:qingyue:smile:float
「欸——沉住了！跟他一个样，聪明。」 #speaker:青月
你没有急着动兵。你走到田间、走到山林，看百谷草木、看四时星象。 #speaker:青月 #hint:静渊以有谋，疏通而知事。
#show:qingyue:default:float
臣工又请：既不即刻用兵，那当以何治天下？是先修甲兵、囤粮备战，还是先理民生、顺天敬神？ #speaker:青月
「唔，第二道坎来啦。天下之大，你要先抓哪一头呀？」 #speaker:青月

* #correct #hint:养材以任地，载时以象天，依鬼神以制义，治气以教化，絜诚以祭祀——五者并举，方是颛顼之治。 [养材任地、载时象天、依鬼神制义、絜诚祭祀]
	-> c_reach
* [先修甲兵、囤粮备战，一切让位于武力]
	-> c_govern_soft

=== c_govern_soft ===
#show:qingyue:worry:float
你把心力都压在兵甲上，田土荒了，四时乱了，祭祀废了，教化停了。 #speaker:青月
甲兵虽利，人心却散——你渐渐明白，武力从来镇不住一颗颗离你而去的心。 #speaker:青月
#show:qingyue:tease:float
「欸欸，别急着走这条道呀！史书上的高阳，可不是靠刀子服人的。回去，再选一次？」 #speaker:青月
-> c_govern

=== c_reach ===
#bg:gaoyang_field
#show:qingyue:smile:float
你杂植百谷以尽地利，依顺四时以效天象，纳鬼神之祀于礼义，调五行之气以行教化，洁身诚敬以主祭祀。 #speaker:青月 #hint:养材以任地，载时以象天，依鬼神以制义，治气以教化，絜诚以祭祀。
#show:qingyue:solemn:float
于是你的德威，北至幽陵，南至交阯，西至流沙，东至蟠木。 #speaker:青月 #hint:北至于幽陵，南至于交阯，西至于流沙，东至于蟠木。
「……动静之物，大小之神，日月所照，莫不砥属。」 #speaker:青月 #hint:动静之物，大小之神，日月所照，莫不砥属。
「你看——不靠一兵一卒，天下自己归了心。这就是『静渊有谋』四个字的分量呀。」 #speaker:青月
-> c_transition

// ───────── 转场：颛顼崩，高辛立 ─────────

=== c_transition ===
#bg:xingye_night
#bgm:solemn
#show:qingyue:sad:float
岁月流转。你老了，你崩了，葬入青史。 #speaker:青月 #hint:颛顼崩，而玄嚣之孙高辛立，是为帝喾。
「呐……一代人有一代人的路。高阳走完了，接下来该另一个人上场了。」 #speaker:青月
#show:qingyue:tease:float
「别急着走呀，魂儿——我把你拽到下一个人身上。这一回你是黄帝的曾孙，玄嚣这一支的高辛。世人唤你，帝喾。」 #speaker:青月
你再睁眼时，已是另一副身骨。传说你生下来就有神灵之异，一开口便能说出自己的名字。 #speaker:青月 #hint:高辛生而神灵，自言其名。
#show:qingyue:default:float
「聪以知远，明以察微——你天生就听得见远方，看得清幽微。可天赋越高，越容易恃才而傲哦？」 #speaker:青月 #hint:聪以知远，明以察微。
-> c_gaoxin

// ───────── 帝喾（高辛）·下半 ─────────

=== c_gaoxin ===
#bg:gaoxin_court
#show:qingyue:worry:float
你即位不久，四方来贺，也来试探。有人劝你：既生而神灵、聪明冠世，便当独断乾纲，以你一人之明，代天下之思。 #speaker:青月
「呐，划重点——最聪明的人，最容易犯一个错：把天下当成自己一个人的棋盘。」 #speaker:青月
#show:qingyue:tease:float
「史书上的高辛偏不这样。他那么聪明，却偏偏……最肯低头看天、看民。你猜他怎么选？」 #speaker:青月

* #correct #hint:顺天之义，知民之急，明鬼神而敬事之——他把明智收进敬顺里，不敢以己意凌天下。 [顺天之义、知民之急，明鬼神而敬事之]
	-> c_zhichong
* [恃聪明独断，以一人之智号令天地鬼神]
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
#show:qingyue:smile:float
你顺应天道，体察民急；广施恩泽，利物却不为己身。 #speaker:青月 #hint:普施利物，不于其身……顺天之义，知民之急。
你明察鬼神而恭敬奉事，仁而有威，惠而有信，修身而天下自服。 #speaker:青月 #hint:仁而威，惠而信，修身而天下服。
#show:qingyue:default:float
可最后一道坎，才最见一个君王的分寸——大地的材物取用不尽，你要如何花它？ #speaker:青月
「呐，这一步最难：手里有天下的财，你是尽情用，还是……省着用、匀给万民？」 #speaker:青月

* #correct #hint:取地之财而节用之，抚教万民而利诲之，帝喾溉执中而遍天下——一个『执中』，压住了所有的贪欲。 [取地之财而节用之，抚教万民、执中不偏]
	~ jieyong = true
	-> c_end_sage
* [天下之财尽归于我，广取厚用，以奉一身之尊]
	~ jieyong = false
	-> c_gaoxin_die

=== c_gaoxin_die ===
#bg:gaoxin_court
你竭泽而取，厚敛以奉己身，教化废弛，历数不修，鬼神之敬也流于虚文。 #speaker:青月
大地的材物终有尽时，民力也终有竭时。你失了『执中』二字，天下便一寸寸从你手里流走。 #death:shimin #speaker:青月
-> END

=== c_end_sage ===
#bg:gaoxin_court
#bgm:solemn
#achieve:zhuanxu_diku_zhizhong
你取地之财而节制使用，抚育教导万民而使之知利，以历法迎送日月节气，明鬼神而敬奉之。 #speaker:青月 #hint:取地之财而节用之，抚教万民而利诲之，历日月而迎送之，明鬼神而敬事之。
#show:qingyue:solemn:float
「其色郁郁，其德嶷嶷。其动也时，其服也士。」 #speaker:青月 #hint:其色郁郁，其德嶷嶷。其动也时，其服也士。
「……帝喾溉执中而遍天下，日月所照，风雨所至，莫不从服。」 #speaker:青月 #hint:帝喾溉执中而遍天下，日月所照，风雨所至，莫不从服。
你面容肃穆，德行高峻，行必以时，衣如常士。你持守中正之道，天下无远弗届，尽皆归心。 #speaker:青月
#show:qingyue:smile:float
「呼——两代人，一条路，你都走通了。」 #speaker:青月
「高阳的『静渊』，高辛的『执中』——一个不躁，一个不偏。你发现没？华夏的君德，从这里就定了调子呀。」 #speaker:青月 #hint:执中，即后世尧舜『允执厥中』之训的源头。
「日后高辛娶陈锋氏女，生下放勋——那便是帝尧了。天下，正一步步走向那场最有名的禅让。不过……那是下一缕魂的故事啦。」 #speaker:青月 #hint:帝喾娶陈锋氏女，生放勋……是为帝尧。
-> END
