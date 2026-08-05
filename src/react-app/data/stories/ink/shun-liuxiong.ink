// ═══════════════════════════════════════════════
// 虞舜 · 流放四凶 · 举贤去恶，天下咸服
// 史源：《史记·五帝本纪》（shun-liuxiong / shun-juxian）
// ═══════════════════════════════════════════════

VAR raised = false
VAR banished = false

-> c_open

=== c_open ===
#bg:simen_court
#bgm:solemn
#show:qingyue:tease:float
「吱呀——吱呀——听见没？四扇大门，正一扇接一扇地开呢。」 #speaker:青月
「开门迎四方宾客的人，就是你呀。你还是重华，世人唤作舜。只是这一世，你已历完焚廪穿井之劫，尧把天下政事交到了你手上——你，是摄政。」 #speaker:青月
你睁开眼。四门大开，宾客自四方而来。你身负尧的托付，摄行天子之政。可这天下，并不太平。 #speaker:青月
#show:qingyue:worry:float
「呐，划重点——尧在位时留下的烂摊子，还堆在这儿呢。奸佞未除，贤才未举。你这个摄政，第一步该往哪儿落？」 #speaker:青月
-> c_raise

=== c_raise ===
#bg:simen_court
#bgm:court
#show:siyue:calm:right
四岳向你陈情：「摄政——高阳氏有才子八人，世称『八恺』；高辛氏有才子八人，世称『八元』。这十六族世代积德，声名不坠。可自尧一朝至今，竟无一人被举用啊。」 #speaker:四岳 #hint:高阳氏有才子八人，谓之八恺。高辛氏有才子八人，谓之八元。
「一个都没有用？」你放下手中的简册，眉头拧了起来，「积善之族闲置在野，作乱之徒盘踞在朝——难怪这天下治不顺。」 #speaker:舜
你眼前还压着另一摊事：四方作乱、水土不治、百工待理。千头万绪，你想先从哪里下手？ #speaker:青月
#show:qingyue:tease:float
「唔——治乱国如治乱麻，头一刀落在哪儿，最要紧啦。你说，是先揽贤才，还是先自己一把抓？」 #speaker:青月

* #correct #hint:舜举八恺主后土，举八元布五教——治天下，先得有股肱之臣。 [先举八恺主土地庶务、举八元布五教于四方]
	~ raised = true
	-> c_raise_good
* [贤才难信，索性事事亲裁，把大权都攥在自己手里]
	-> c_solo_death

=== c_solo_death ===
#bg:simen_court
#bgm:danger
你不肯托事于人，凡事亲裁。可天下之大、庶务之繁，岂是一人能尽？你日夜劳形，政令却愈发迟滞，四方之事无人分理，渐渐壅塞崩坏。 #speaker:青月
纵有摄政之名，你终究独木难支，天下不治。 #death:solo #speaker:青月
-> END

=== c_raise_good ===
#bg:simen_court
#bgm:court
#achieve:shun_raise_worthy
#show:qingyue:smile:float
你举八恺，使主后土，统揆百事，无不时序；举八元，使布五教于四方——父义、母慈、兄友、弟恭、子孝，内平外成。 #speaker:青月 #hint:举八元，使布五教于四方，父义，母慈，兄友，弟恭，子孝，内平外成。
「欸——漂亮！这一举，你给自己攒下了十六族的股肱。」 #speaker:青月
#show:qingyue:worry:float
「可贤才归位，只是治世的一半。另一半……是那些尧未能除掉的恶人。」 #speaker:青月
-> c_sixiong

=== c_sixiong ===
#bg:simen_court
#bgm:court
#hide:siyue
#show:gonggong:calm:left
天下有四个不才之族，为祸已久：帝鸿氏之子浑沌，掩义隐贼；少暤氏之子穷奇，毁信恶忠；颛顼氏之子梼杌，不可教训；缙云氏之子饕餮，贪于饮食货贿。 #speaker:青月 #hint:天下谓之浑沌、穷奇、梼杌、饕餮。
而尧朝遗下的祸首也未清算：讙兜曾力荐共工，共工果然淫辟为恶；四岳强荐鲧治水，鲧九年无功、百姓受苦；三苗更在江淮荆州屡屡作乱。 #speaker:青月 #hint:共工果淫辟……鲧试之而无功……三苗数为乱。
#show:qingyue:worry:float
「这些人盘根错节，动一个就要震一片。有人劝你——你不过是个摄政，何苦替尧家背这口刀？安抚安抚，留着别惹事，你看如何？」 #speaker:青月

* #correct #hint:舜请流四凶，四罪而天下咸服——恶不除，善难立。 [不姑息。奏请帝尧，将四凶之族尽数流放——纵然满朝旧党，从此视你为仇]
	-> c_choose_how
* [多一事不如少一事——姑且安抚四凶，保住眼前的太平，也保住你摄政的安稳]
	-> c_appease_death
* [流放太缓——请命于尧，兴兵南征，先以雷霆讨平屡屡举兵作乱的三苗]
	-> if_zhengmiao_1

=== c_appease_death ===
#bg:simen_court
#bgm:danger
你不忍动手，选择姑息。四凶见你软弱，气焰愈炽：共工益发淫辟，三苗愈乱江淮，讙兜结党营私，鲧的余党壅塞朝纲。 #speaker:青月
养奸日久，祸乱丛生。你举的贤才被恶党倾轧，四门之内再无宁日——天下不服，摄政之基就此崩坏。 #speaker:青月
姑息养奸，终酿大乱。 #death:appease #speaker:青月
#hide:gonggong
-> END

=== c_choose_how ===
#bg:simen_court
#bgm:court
#hide:gonggong
#show:qingyue:tease:float
帝尧准了你的奏请。可如何处置这四凶，还在你一念之间。 #speaker:青月
「呐——是把他们就地正法、斩草除根，还是……另有一番用处呀？」 #speaker:青月
#show:qingyue:worry:float
「小心哦，这一步走岔了，你攒下的『德』，可要一朝散尽。」 #speaker:青月
共工在朝中多年，余党遍布；讙兜与三苗互为犄角，牵一发而动全身。四岳也低声劝你：不如各打五十大板，流放了事，别做得太绝。 #speaker:青月
可你清楚：这些人为祸多年，若只流放而不按罪量刑，天下人会觉得摄政软弱可欺。 #speaker:青月

* #correct #hint:流四凶迁于四裔，以御螭魅——罚当其罪，且使恶有所用。 [各按其罪，分流四裔，令其戍守边荒、抵御螭魅]
	~ banished = true
	-> c_banish_good
* [四凶罪大恶极，索性尽数诛杀，以绝后患]
	-> c_slaughter_death
* [余者依罪流放——唯鲧，治水是败非恶，改殛为流，留他一命]
	-> if_yougun_1

=== c_slaughter_death ===
#bg:siyi_liufang
#bgm:danger
你下令尽诛四族。刑场之上，血流成河——其中确有元凶，却也牵连了不当死的族人。 #speaker:青月
天下震恐：都说舜以摄政之权，行滥杀之实。你以除恶始，却以失德终；民心离散，『咸服』二字，从此与你无缘。 #speaker:青月
滥杀无辜，失德失民。 #death:slaughter #speaker:青月
-> END

=== c_banish_good ===
#bg:siyi_liufang
#bgm:solemn
#show:qingyue:solemn:float
「流之四裔，非为泄愤。」你亲自在诏令上落笔，一字一顿，「让他们去边荒抵御螭魅——作恶的人，也得还天下一点用处。」 #speaker:舜
你罚当其罪，各得其所：流共工于幽陵，以变北狄；放讙兜于崇山，以变南蛮；迁三苗于三危，以变西戎；殛鲧于羽山，以变东夷。 #speaker:青月 #hint:流共工于幽陵，以变北狄；放讙兜于崇山，以变南蛮；迁三苗于三危，以变西戎；殛鲧于羽山，以变东夷。
你又将四凶恶族尽迁四裔，使他们戍守边荒、抵御螭魅——恶人远窜，四门肃清，境内再无凶人。 #speaker:青月 #hint:乃流四凶族，迁于四裔，以御螭魅，于是四门辟，言毋凶人也。
#show:qingyue:smile:float
「欸——好一手！你没有一杀了之，而是让恶各有所偿、各有所用。这才是『罚』，不是『泄愤』。」 #speaker:青月
-> c_end_fu

=== c_end_fu ===
#bg:simen_court
#bgm:solemn
{ raised && banished:
	#show:qingyue:solemn:float
	举贤于内，去恶于外。你一手擢十六族之善，一手窜四罪于四裔。 #speaker:青月
	『四罪而天下咸服。』这一句，我亲眼看它落定。 #speaker:青月 #hint:四罪而天下咸服。
	#show:qingyue:calm:float
	「你看——摄政的头一课，不是发号施令，是让对的人各归其位、错的人各偿其罪。」 #speaker:青月
	#show:qingyue:smile:float
	「善举则股肱盈朝，恶去则四门无凶。天下为什么服你？因为你的赏罚，桩桩件件都当得起。」 #speaker:青月
	「呼——你走通了他这一程。看懂了吗？治天下的『德』，从来不是心软，是让善恶各得其分呀。」 #speaker:青月 #impact:impact_liuxiong_sixiongzu #ending:canon #quiz:quiz_liuxiong_sixiongzu
	-> END
- else:
	#show:qingyue:worry:float
	你走到了这一步，却少了几分周全。摄政之路，容不得半步差池。 #speaker:青月
	-> END
} #speaker:青月

// ═══ IF线 · 干戈南征（自由模式歧路：不流放，以兵讨三苗）═══

=== if_zhengmiao_1 ===
#bg:siyi_liufang
#bgm:danger
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有拟流放的奏书，拟的是请兵的军书。三苗数乱江淮，是四凶里唯一真正举兵作乱的——你要先以雷霆，讨掉这一路。 #speaker:青月 #hint:三苗在江淮、荆州数为乱。
帝尧沉吟良久，终究把斧钺交到了你手上。 #speaker:青月
大军南下。八恺替你转输粮秣，八元替你安抚新附。一年，江淮平；两年，荆州定——三苗望旗而溃，你陈兵大江，声威震动南土。 #speaker:青月
-> if_zhengmiao_2

=== if_zhengmiao_2 ===
#bg:simen_court
#bgm:solemn
#show:qingyue:calm:float
班师之日，诸侯毕贺，礼数一分不缺。只是他们望你的眼神里，多了一样从前没有的东西——畏。 #speaker:青月
共工收敛了，讙兜低头了。可你分明看得出：他们不是服了，是伏了。散入山泽的苗民岁岁窜扰，南疆年年都要发兵去镇。 #speaker:青月
#show:qingyue:solemn:float
「史书里的他，一滴血也没流——流共工，放讙兜，迁三苗，殛鲧。把恶人挪去边荒守夜，天下就服了。」 #speaker:青月 #hint:四辠而天下咸服。
「兵服得了人的身子，服不了人的心呀。」 #speaker:青月
你以干戈定了南土，也把自己变成了第一个以兵立威的摄政。往后每一年，你都得握紧那把刀。 #ending:if_zhengmiao #speaker:青月
#hide:gonggong
-> END

// ═══ IF线 · 羽山留命（自由模式歧路：独宥鲧，改殛为流）═══

=== if_yougun_1 ===
#bg:siyi_liufang
#bgm:solemn
#show:qingyue:worry:float
「欸？改殛为流……史书上，可没有这一笔哦。我也是第一次看。」 #speaker:青月
你把三份罚书发了出去：流共工于幽陵，放讙兜于崇山，迁三苗于三危。唯独第四份，你压住了笔——鲧治水九年无功，可那是败，不是恶。你留他一命，改殛为流，徙于羽山之下。 #speaker:青月
消息传开，有人称你仁厚。可去往幽陵与崇山的路上，也有人回头冷笑：同是四罪，凭什么独他留命？ #speaker:青月
#show:qingyue:calm:float
「你少杀了一个人。可『罚』这杆秤上，从此就多了一道刻痕。」 #speaker:青月
鲧到底是不肯低头的性子，在羽山仍不服罪，逢人便讲他的堙水之法没有错。而他的儿子禹，日后接过治水之任——每改父亲一策，人说他不孝；每留父亲一堤，人说他徇私。 #speaker:青月
#show:qingyue:solemn:float
「史书里，殛鲧的是舜，举禹的也是舜——把罪与才分开来称，才敢把天下的水，交给罪人之子呀。」 #speaker:青月 #hint:殛鲧于羽山，以变东夷：四辠而天下咸服。
你全了一条性命，也给天下留下了一个问不完的问题：法外开出的那扇恩门，日后由谁来关？ #ending:if_yougun #speaker:青月
-> END
