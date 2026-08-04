// ═══════════════════════════════════════════════
// 起源 · 楔子 —— 青月引路 · 穿越轩辕
// 史源：《史记·五帝本纪》
// 说明：全体玩家的第一站。青月恭候 → 交代世界观与玩法 → 穿越黄帝 + 黄帝诞生
// ═══════════════════════════════════════════════

VAR mg_result = ""
VAR mg_score = 0

-> c_open

=== c_open ===
#bg:xuanyuan_qiu
#bgm:solemn
#show:qingyue:smile:float
一片朦胧的光晕里，一个抱着青色卷轴的少女，正笑盈盈地望着你。 #speaker:青月
「主人，青月已经在此恭候多时了。」 #speaker:青月
你张了张嘴，脑子里一片空白——我是谁？这是哪儿？眼前这个自称青月的姑娘，又是谁？ #speaker:青月
#show:qingyue:tease:float
「呀，一脸懵呢~ 别急别急，听青月慢慢与你说。」 #speaker:青月

* [「我这是……死了吗？」]
	「死？才不是呢~ 你呀，是要去活一段谁都活不到的日子。」 #speaker:青月
	-> c_intro
* [「青月……你到底是谁？」]
	「我呀，是陪你穿越千年的引路人——史册翻到哪一页，我就陪你走到哪一页。」 #speaker:青月
	-> c_intro
* [「这书卷……是什么？」]
	#show:qingyue:calm:float
	「这是《史记》呀。两千年前，有个叫司马迁的人，被关在牢里、受了酷刑，却用一支笔写尽了华夏三千年。」 #speaker:青月
	「他把一个一个人的故事，串成了一条河。你要走的，就是这条河。」 #speaker:青月
	-> c_intro
* [「……我该怎么做？」]
	#show:qingyue:smile:float
	「别急呀——先听我把路说清楚，你再走不迟。」 #speaker:青月
	-> c_intro

=== c_intro ===
#show:qingyue:calm:float
青月抬手一引，你脚下的光化作一条望不到头的长河，河面上浮着密密麻麻的名字与身影。 #speaker:青月
「你脚下这条长河，是《史记》——两千多年前，一位叫司马迁的史官，用一生写下的三千年。」 #speaker:青月 #hint:《史记》为西汉司马迁所著，上起黄帝、下至汉武帝，共一百三十卷，是中国第一部纪传体通史。
「上起黄帝，下到汉武帝；五帝、夏商周、春秋战国、强秦、楚汉、大汉……一百三十卷，华夏最初的那些人、那些事，全在这河里头。」 #speaker:青月
#show:qingyue:smile:float
「而你要做的呀，」青月晃了晃卷轴，「就是一个一个地，穿越成他们——替黄帝打天下，替大禹治水，替项羽……嗯，那位先不剧透。」 #speaker:青月
「替他们，把那一生，再活一遍。」 #speaker:青月
-> c_how

=== c_how ===
#show:qingyue:tease:float
「玩法嘛，简单得很——每到紧要关头，我会请你替他做一个选择。」 #speaker:青月
「选对了，你就顺着史册往下走；选岔了……嘻，那一世，可能就到头咯。」 #speaker:青月 #hint:游戏含"正史/自由"两种模式：正史循史实而行，走岔即止；自由可试史书未载的歧路，通向别样结局。
「可你别怕死呀。在这儿，死了能重来——重来一回，你就更懂这段历史一分。死亡，也是一种阅读。」 #speaker:青月
「往后你会遇上两条路：正史模式，走史书真正走过的那一条；自由模式，去试试那些『倘若当年……』的岔口。」 #speaker:青月
#show:qingyue:worry:float
「唔……青月一口气说了这么多，你……还跟得上吗？」 #speaker:青月

* [「大概懂了——替古人做选择，走通历史，对吧？」]
	#show:qingyue:smile:float
	「聪明！就是这么回事儿~」 #speaker:青月
	-> c_ready
* [「万一我把历史走岔了，怎么办？」]
	#show:qingyue:tease:float
	「那青月就把你拉回岔路口，陪你再来一遍呗~ 反正我有的是耐心。」 #speaker:青月
	-> c_ready
* [「正史模式和自由模式……有什么不一样？」]
	#show:qingyue:calm:float
	「正史模式呀，就是照着史书走——走错一步，故事就结束了。适合想好好读历史的人。」 #speaker:青月
	「自由模式嘛，就有意思多啦——你可以试试『倘若当年……』的各种可能。比如……黄帝要是没打阪泉之战，会怎么样？」 #speaker:青月
	「不过哦，自由模式里的每一个岔路，都会留下印记——有时候，它还会影响到后面的故事呢。」 #speaker:青月
	-> c_ready
* [「这些故事……都是真的吗？」]
	#show:qingyue:solemn:float
	「《史记》里写的，是太史公信以为真的历史。三千年过去了，有些事已经没法考证，可有些事，一直被这片土地上的人记着。」 #speaker:青月
	「你要走的，是史书里的故事——也是我们祖先心里的故事。真与不真，走着走着，你自己会有答案的。」 #speaker:青月
	-> c_ready

=== c_ready ===
#show:qingyue:calm:float
「记牢喽——从头到尾，我都在。你，不是一个人在穿越。」 #speaker:青月
「路上遇见的人、走过的死法、解开的成就，我都替你收进图鉴里；想读读原文了，典籍阁也随时为你开着。」 #speaker:青月
#show:qingyue:smile:float
「好啦，闲话搁下。你的第一站，就落在这条长河的源头——史册的头一页、头一个名字上。」 #speaker:青月
「先考考你——这几条竹简，是太史公为你写的第一笔。能把它拼回原样吗？」 #speaker:青月
#minigame:bamboo:1:0:5
{ mg_result == "win":
	#show:qingyue:smile:float
	「{mg_score} 分，竹简归序，太史公的第一笔，你接住了。」 #speaker:青月
- else:
	#show:qingyue:sigh:float
	「简序暂乱也无妨，往后读着读着，自然就通啦。」 #speaker:青月
}
「坐稳咯，青月要送你穿越啦——」 #speaker:青月
-> c_chuanyue

=== c_chuanyue ===
#bg:xuanyuan_qiu
#bgm:solemn
光一闪。你一头栽进了一具还没睁眼的婴孩身子里。 #speaker:青月
你这一世，姓公孙，名唤轩辕，生在有熊，长于姬水之滨。往后千秋万代的人，会尊你一声——黄帝。 #speaker:青月 #hint:黄帝者，少典之子，姓公孙，名曰轩辕。
你生下来便神奇灵异：还在襁褓之中就能开口说话，幼时聪慧周正，长大敦厚机敏，成年后睿智练达。 #speaker:青月 #hint:生而神灵，弱而能言，幼而徇齐，长而敦敏，成而聪明。
#show:qingyue:calm:float
「天纵之姿，是真的。可你降生的这个世道——正乱着呢。」 #speaker:青月
「神农氏的天下早衰了，诸侯彼此攻伐，谁也压不住谁。这乱世，该由谁来收拾？史册把那支笔，递到了你手里。」 #speaker:青月
#show:qingyue:tease:float
「你的故事，从这一刻正式开始。去吧，轩辕——去看看，你要怎么把这一盘散沙，走成一个『华夏』。」 #speaker:青月

* [「……我想先看看这个时代。」]
	-> c_chuanyue_look
* [「我想知道，神农氏为什么会衰微？」]
	-> c_chuanyue_shinong
* [「……我准备好了。」]
	-> c_chuanyue_end

=== c_chuanyue_look ===
#show:qingyue:calm:float
「好呀。你睁开眼——」 #speaker:青月
你看见的是姬水之滨的有熊国，炊烟袅袅，田垄纵横。远处传来鼓声，那是部落之间在传递消息。 #speaker:青月
「这就是你长大的地方。有熊氏，一个不大不小的部落，靠着姬水过活。」 #speaker:青月
#show:qingyue:smile:float
「姬水从西边流过来，两岸的土很肥，种什么都长得好。有熊氏的祖先就是看中这块地，才在这里定居的。」 #speaker:青月
「部落不大，可人心齐。男人们耕种打猎，女人们纺线织布——这就是你将要长大的世界。」 #speaker:青月

* [「有熊氏……算大部落吗？」]
	-> c_chuanyue_bear
* [「我准备好了。」]
	-> c_chuanyue_end

=== c_chuanyue_bear ===
#show:qingyue:calm:float
「不算大，也不算小。比神农氏小多了，可比那些一盘散沙的小部落强。」 #speaker:青月
「你父亲少典是个有远见的人，他教族人耕种、养畜，有熊氏渐渐兴旺起来。你，就是在这个基础上崛起的。」 #speaker:青月

* [「少典……我父亲是个什么样的人？」]
	#show:qingyue:calm:float
	「少典是有熊氏的首领，也是个有远见的人。那个年代，别的部落还在靠打猎过活，他已经教族人种地、养畜了。」 #speaker:青月
	「他常说：猎物会跑光，庄稼年年有。靠着姬水的肥土，有熊氏的日子比旁的部落安稳得多。」 #speaker:青月
	「你从小看着他治国——怎么丈量田地、怎么分配猎物、怎么跟邻部做生意。这些本事，后来全成了你修德振兵的底子。」 #speaker:青月
	-> c_chuanyue_bear_next
* [「有熊氏有什么特长吗？」]
	#show:qingyue:smile:float
	「有熊氏最擅长的呀——是养驯兽。他们养熊、养虎、养豹，用来打仗和守卫。『有熊』这个名字，就是这么来的。」 #speaker:青月
	「不过呀，太史公没写这些。他只写了你『生而神灵，弱而能言』——至于你爹养不养熊，他没提。」 #speaker:青月
	「可有一件事是真的：有熊氏的人，比别的部落更懂驯化。后来你教百姓『淳化鸟兽虫蛾』，这手艺就是从你父亲那儿传下来的。」 #speaker:青月
	-> c_chuanyue_bear_next
* [「姬水……这条河对有熊氏有多重要？」]
	#show:qingyue:calm:float
	「姬水是有熊氏的命根子。两岸的土又松又肥，种什么都长得好。河水还能捕鱼、能灌溉、能做防御——别的部落来抢地，得过河。」 #speaker:青月
	「你后来姓姬——就是以水为姓。上古的人，姓往往来自他们住的地方。姬水养大了有熊氏，也养大了你。」 #speaker:青月
	-> c_chuanyue_bear_next
* [「我准备好了。」]
	-> c_chuanyue_end

=== c_chuanyue_bear_next ===
#show:qingyue:tease:float
「好啦，有熊氏的故事先说到这儿。你降生在这个部落，可你要走的路，比姬水长得多。」 #speaker:青月
-> c_chuanyue_end

=== c_chuanyue_shinong ===
#show:qingyue:solemn:float
「神农氏呀……他们是最早教人耕种的部落，所以天下归心。可年代久了，子孙一代不如一代，手里的刀兵也钝了。」 #speaker:青月
「诸侯看着共主不行了，就开始自己抢地盘。神农氏想管，却管不动——这就是你降生时的天下。」 #speaker:青月
#show:qingyue:calm:float
「神农氏最鼎盛的时候，天下诸侯都听他们的。他们教人用火、教人耕种，是华夏最早的『圣王』。」 #speaker:青月
「可圣王的后代未必也是圣王。到了你这个时代，神农氏的后人已经没有什么威望了——诸侯们各怀心思，谁也不服谁。」 #speaker:青月

* [「那我呢？我能收拾这个乱局吗？」]
	-> c_chuanyue_shinong_zhi
* [「我准备好了。」]
	-> c_chuanyue_end

=== c_chuanyue_shinong_zhi ===
#show:qingyue:smile:float
「你？你生下来就『生而神灵，弱而能言』——这是太史公说的。你从小聪明，长大后更是智勇双全。」 #speaker:青月
「可光有天纵之姿不够。你要修德、振兵、抚民，一步一步来。史记里你的故事，就是从『修德振兵』四个字开始的。」 #speaker:青月

* [「修德振兵……具体是什么意思？」]
	#show:qingyue:calm:float
	「修德，就是让百姓过上好日子——丈量田亩、教人种地、安抚流民。振兵，就是操练军队——不是为了打仗，是为了让别人不敢来抢你。」 #speaker:青月
	「先修德、后振兵，这个次序很重要。你后面的阪泉之战、涿鹿之战，都是在修德振兵的基础上打赢的。没有德，兵就是一把没有刀鞘的刀——伤人也伤己。」 #speaker:青月
	-> c_chuanyue_shinong_next
* [「神农氏衰了，谁来当新的共主？」]
	#show:qingyue:worry:float
	「这就是问题了。神农氏衰了，可天下不能没有共主。诸侯们各怀心思——有人想自己当，有人想让贤，有人只想自保。」 #speaker:青月
	「太史公写你『修德振兵』，其实就是说：别人在抢的时候，你在养。等你养够了、练好了，天下自然来归你。」 #speaker:青月
	「这一步，就是你的起点——你不去抢天下，天下自己会来。」 #speaker:青月
	-> c_chuanyue_shinong_next
* [「这乱世……还要乱多久？」]
	#show:qingyue:solemn:float
	「说不好。可太史公给了你答案——从你修德振兵开始，到诸侯宾从、阪泉三战、涿鹿禽蚩尤，天下才真正定下来。」 #speaker:青月
	「这不是一天两天的事。你这一辈子，都在把散沙捏成一个『华夏』。」 #speaker:青月
	-> c_chuanyue_shinong_next
* [「我准备好了。」]
	-> c_chuanyue_end

=== c_chuanyue_shinong_next ===
#show:qingyue:tease:float
「好啦，天下的事急不来。你的路，就从『修德振兵』四个字开始走。」 #speaker:青月
-> c_chuanyue_end

=== c_chuanyue_end ===
#show:qingyue:smile:float
「呼——不管怎么选，你的路，都从这一刻开始了。」 #speaker:青月
「记住：史书只给你一个名字，怎么走，全看你自己。」 #speaker:青月 #ending:canon #impact:impact_qiyuan_xuanyuan #quiz:graph_huangdi_xianding
-> END
