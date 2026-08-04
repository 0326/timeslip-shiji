// ═══════════════════════════════════════════════
// 虞舜 · 命九官组阁 · 组阁治世
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

-> c_open

=== c_open ===
#bg:wenzu_temple
#bgm:solemn
#show:qingyue:tease:float
「来来来，接着——小心点，这卷名册可沉啦：禹、皋陶、契、后稷、伯夷、夔、龙、倕、益……」 #speaker:青月
「我替你点过了，整整二十二个名字，个个都是济世之才。上一世你历焚廪、穿井，把疼都咽了下去。这一世……天下真的到你手里啦——这满册的贤才，就等你一一点将。」 #speaker:青月
你睁开眼。你是重华，是舜。三年丧毕，你把帝位让给尧的儿子丹朱，可诸侯朝觐不去丹朱那里，都来朝你；讼狱之人不找丹朱，也都来找你。天下，归了你。 #speaker:青月 #hint:三年丧毕，让丹朱，天下归舜。
你站在文祖庙前。禹、皋陶、契、后稷、伯夷、夔、龙、倕、益……这些贤才，尧在世时便已举用，却都还没有分定职掌。 #speaker:青月 #hint:自尧时而皆举用，未有分职。
#show:qingyue:worry:float
「呐，划重点——继了位，第一件事该做什么？发号施令，还是……先做点别的？」 #speaker:青月
-> c_simen

=== c_simen ===
你手按庙门，天下的耳目都悬在你这一念之间。是急着树立威权，还是先把四方的声音放进来？ #speaker:青月

* #correct #hint:辟四门，明通四方耳目——继位第一事不是发号施令，是广开言路。 [大开四门，命十二州牧评议我之德，广施厚德、疏远佞人]
	-> c_shierm
* [先立威权，独断号令，让天下先怕我、再服我]
	-> c_bad_weiquan

=== c_bad_weiquan ===
#bg:disorder_court
#bgm:danger
你紧闭四门，一意独断。号令虽出，四方的耳目却闭塞了；佞人环伺进谗，贤者噤声远遁。你还没来得及组阁，庙堂已先离了心。 #speaker:青月
上古的明君，是先『明通四方耳目』才谈得上治天下的。你把这一步跳了过去。 #death:biseng #speaker:青月
-> END

=== c_shierm ===
#bg:wenzu_temple
#bgm:solemn
#show:siyue:calm:right
你来到文祖庙，与四岳商议，大开四门，畅通四方耳目。你命十二州牧评议天子之德，广施厚德、远离佞人——蛮夷都望风而服。 #speaker:青月 #hint:辟四门，明通四方耳目，命十二牧论帝德……则蛮夷率服。
#show:qingyue:smile:float
「欸——漂亮！先把天下的眼睛耳朵都打开，再来点将。这才叫组阁的底气。」 #speaker:青月
你转身面向四岳，问出这一世最要紧的话。 #speaker:青月
-> c_sikong

=== c_sikong ===
你对四岳说：『有谁能奋发努力、光大尧的事业，可让他居官辅佐我？』 #speaker:舜 #hint:有能奋庸美尧之事者，使居官相事？
#show:qingyue:worry:float
「唔——水土未平，鸿水还在滔天。这『司空』的头一把交椅，你要交给谁？」 #speaker:青月
「当年治水九年不成、被殛于羽山的鲧……他儿子禹，众人都举荐。可你，敢用一个『罪臣之子』吗？」 #speaker:青月

* #correct #hint:皆曰伯禹为司空，可美帝功——不以父罪弃其子，量才而授。 [『禹，你去治理水土，好好努力』——命禹为司空。他父亲死于你的诏令，你却要赌他不记恨]
	-> c_yu_pingtu
* [『鲧治水多年、经验老到，朝中旧党也都服他』——不计前失，仍用老成持重的鲧]
	-> c_bad_gun
* [鲧氏父子皆避——殛父而用其子，惹天下议论。司空之任，改授断狱最平的皋陶]
	-> if_biyu_1

=== c_bad_gun ===
#bg:disorder_court
#bgm:danger
#show:gun:calm:left
你念着鲧的旧资历，把平水土重新交回他手里。可鲧堙塞之法九年不成，其性如故——洪水依旧滔天，怀山襄陵，下民其咨。 #speaker:青月 #hint:九岁，功用不成。
所任非其人，则庶事隳坏。你用错了治水的第一人，天下便先淹在了水里。 #death:renfei #speaker:青月
#hide:gun
-> END

=== c_yu_pingtu ===
#bg:zuge_court
#bgm:court
#show:yu:calm:center
禹拜了拜、叩头到地：『臣不如稷、契与皋陶，请以此职授之。』 #speaker:禹 #hint:禹拜稽首，让于稷、契与皋陶。
你摆手止住他：『不必让了。禹，你去治理水土——去吧。』 #speaker:舜 #hint:舜曰：然，往矣。
#show:qingyue:smile:float
「看见没？真正的贤者，得了大位先想着让。你一句『往矣』，把担子稳稳压在了他肩上。」 #speaker:青月
-> c_zuge

=== c_zuge ===
你一位一位点将下去，各授其职—— #speaker:青月
#show:houji:calm:left
『弃，百姓正挨饿，你做后稷，按农时播种百谷。』 #speaker:舜 #hint:弃，黎民始饥，汝后稷播时百谷。
#show:xie:calm:center
『契，百姓不相亲、五伦不顺，你做司徒，恭谨推行五教，要以宽厚为本。』 #speaker:舜 #hint:契……汝为司徒，而敬敷五教，在宽。
#show:gaoyao:calm:right
『皋陶，蛮夷扰夏、寇贼奸轨，你做士官，五刑各有执法，务求刑明能信。』 #speaker:舜 #hint:皋陶……汝作士，五刑有服……维明能信。
#show:qingyue:calm:float
「唔——播谷的、教化的、掌刑的，各归各位。可还有百工、山泽、礼典没着落呢。」 #speaker:青月
-> c_geren

=== c_geren ===
你又问四岳：『谁能管好我的百工？谁能管好山陵草木鸟兽？谁能主持我的三种祭典？』 #speaker:舜 #hint:谁能驯予工？……谁能驯予上下草木鸟兽？……有能典朕三礼？
#show:qingyue:worry:float
「垂善百工、益善山泽、伯夷善礼——各有各的长处。可点将有两种点法哦……」 #speaker:青月
「是看谁跟你亲近、听话好使，还是看谁真正才堪其任？」 #speaker:青月

* #correct #hint:以垂为共工、以益为朕虞、以伯夷为秩宗——量才授职，各得其所。 [各按其长：垂为共工掌百工，益为虞掌山泽，伯夷为秩宗典三礼]
	-> c_kui
* [挑我用着顺手、与我亲近的人分掉这些官位，才好使唤]
	-> c_bad_weiqin

=== c_bad_weiqin ===
#bg:disorder_court
#bgm:danger
你不问才具，只论亲疏，把共工、虞、秩宗都塞给了亲近听话的人。垂、益、伯夷之才无处可施，退而不用；所任非人，百工不致功、山泽不辟、上下不让。 #speaker:青月
舜之所以为舜，正在『量才授职、各得其人』。用人唯亲，庶事隳坏——你亲手拆了自己的朝堂。 #death:weiqin #speaker:青月
-> END

=== c_kui ===
#bg:yuewu_court
#bgm:solemn
#show:kui:calm:center
垂为共工、益为虞、伯夷为秩宗，各得其所。伯夷又让给夔、龙。你命夔掌管音乐，教导贵族子弟—— #speaker:青月 #hint:垂为共工……益为朕虞……以汝为秩宗……伯夷让夔、龙。
#show:qingyue:solemn:float
『……直而温，宽而栗，刚而毋虐，简而毋傲；诗言意，歌长言，声依永，律和声，八音能谐，毋相夺伦，神人以和。』 #speaker:舜 #hint:诗言意，歌长言……八音能谐，毋相夺伦，神人以和。
夔叩首而起：『啊！我敲起石磬、拊击石磬，百兽都随节拍起舞。』 #speaker:夔 #hint:於！予击石拊石，百兽率舞。
#show:qingyue:smile:float
「听见了吗——礼乐相济、刑赏并行。这一句『百兽率舞』，是上古德治最动人的一幕呀。」 #speaker:青月
你最后转向龙：『龙，我憎恶谗言欺诈，它惊扰百姓。命你做纳言，从早到晚传达我的政令，务必守信。』 #speaker:舜 #hint:命汝为纳言，夙夜出入朕命，惟信。
-> c_kaogong

=== c_kaogong ===
#bg:zuge_court
#bgm:court
二十二人已各就其位。你对他们说：『你们二十二人，要恭谨啊，时时辅佐上天交给我的事业。』 #speaker:舜 #hint:嗟！女二十有二人，敬哉，惟时相天事。
#show:qingyue:worry:float
「呐——最后一步，也是最难的一步。授了官，就完了吗？」 #speaker:青月
「贤者授了职，是让他们各干各的、永不过问，还是……得有个法子，让功者显、庸者退？」 #speaker:青月

* #correct #hint:三岁一考功，三考绌陟——有考核，才有黜陟幽明，庶绩咸熙。 [立下考课之法：三年一考、三考定升降——连你亲手点的贤臣，也一视同仁地考]
	-> c_end_xi
* [用人不疑，授了官便一劳永逸——不考不核，君臣两相清闲，岂不美哉]
	-> c_bad_wukao
* [三年太缓——立一岁一考之法，功过当年结清，赏罚绝不过夜]
	-> if_kuke_1

=== c_bad_wukao ===
#bg:disorder_court
#bgm:danger
你授了官便撒手不管，不设考课、赏罚不明。勤者与惰者一般待遇，贤者见功不见赏、劳而无别，渐渐心灰；庸者尸位而无惧。远近众功，就在这『无考』里一点点荒废了。 #speaker:青月
有官而无考，赏罚不明，则贤者退而功不成。组阁只是开始，考课才是它活下去的筋骨。 #death:wukao #speaker:青月
#hide:siyue
#hide:yu
#hide:houji
#hide:xie
#hide:gaoyao
-> END

=== c_end_xi ===
#bg:zuge_court
#bgm:solemn
#achieve:shun_jiuguan
你定下：每三年考核一次政绩，考核三次后决定升降贬黜——远近各项事业，都兴盛起来了。 #speaker:青月 #hint:三岁一考功，三考绌陟，远近众功咸兴。
#show:qingyue:calm:float
这二十二人都成就了各自的功业：皋陶断案公平，民各得其实；伯夷主礼，上下咸让；垂主百工，工致其功；益主山泽，山泽得辟；弃主农事，百谷时茂；契为司徒，百姓亲和；龙主宾客，远人纷至。 #speaker:青月 #hint:此二十二人咸成厥功。
#show:qingyue:solemn:float
「而其中……唯禹之功为大。」 #speaker:青月
禹劈开九山、疏通九泽、开决九河、划定九州，各地按职来贡，无不合宜。四海之内，都感戴你的功德。 #speaker:青月 #hint:唯禹之功为大，披九山，通九泽，决九河，定九州……四海之内咸戴帝舜之功。
#show:qingyue:smile:float
「呼——你走完了这一场组阁。看懂了吗？」 #speaker:青月
「量才授职，各得其人；三考黜陟，功者自显。天下彰明的德政，就是从你这里开始的呀。」 #speaker:青月 #hint:天下明德皆自虞帝始。 #impact:impact_jiuguan_liangcaishouzhi #ending:canon #quiz:quiz_jiuguan_liangcaishouzhi
#hide:siyue
#hide:yu
#hide:houji
#hide:xie
#hide:gaoyao
#hide:kui
-> END

// ═══ IF线 · 避嫌失禹（自由模式歧路：司空不授禹，改授皋陶）═══

=== if_biyu_1 ===
#bg:zuge_court
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你到底避开了那对父子。殛其父而用其子，你怕天下人议论，也怕禹心里那道过不去的坎。司空之任，你改授了皋陶——他断狱最平，为人最稳。 #speaker:青月
皋陶不敢辞，尽心竭力。他立法度、征徒役、按图勘水，样样章法齐整。 #speaker:青月
#bg:flood_sky
#bgm:danger
#show:qingyue:calm:float
可水不认章法。三年，孟门之下溃了两回；五年，兖州依旧是一片泽国。 #speaker:青月
「他哪里做错了呢？没有。他只是没交过那九年的学费呀。」 #speaker:青月
「堙与堵是条死路——这门学问，天下只有一个人，是拿父亲的性命学来的。」 #speaker:青月
#show:qingyue:solemn:float
「史书里的舜，敢殛其父、敢用其子，把罪与才分开来称。这一分，才分出了后来的九州。」 #speaker:青月 #hint:皆曰伯禹为司空，可美帝功。
朝堂上再没人议论你了。只是每逢大水的年份，你都会想起羽山之下，那个守着坟、望着水的年轻人。 #ending:if_biyu #speaker:青月
#hide:siyue
#hide:yu
#hide:houji
#hide:xie
#hide:gaoyao
#hide:kui
-> END

// ═══ IF线 · 一岁一考（自由模式歧路：考课改急，赏罚不过夜）═══

=== if_kuke_1 ===
#bg:zuge_court
#bgm:solemn
#show:qingyue:worry:float
「欸？一岁一考……史书上，可没有这一条哦。我也是第一次看。」 #speaker:青月
你嫌三年太缓。乱世初定，等不起——你立下一岁一考：功过当年结清，赏罚绝不过夜。 #speaker:青月
头一年，朝堂果然肃然。人人案牍不离手，处处报功的简册堆成了小山。 #speaker:青月
#show:qingyue:calm:float
第二年，你渐渐看出了不对。报上来的功，越来越巧：垦荒的报亩数，不报收成；修堤的报丈尺，不报牢固。一年看得见的，都做得漂亮；一年看不见的，没人肯做了。 #speaker:青月
第三年考课，司空治水三载——河未通，州未定，簿上无功。按你的法，当黜。 #speaker:青月
#show:qingyue:solemn:float
「你要黜的这个人，叫禹。」 #speaker:青月
「疏九河、定九州，是十几年的功。你的秤一年一称，最先称走的，恰恰是做大事的人呀。」 #speaker:青月 #hint:三岁一考功，三考绌陟，远近众功咸兴。
律令是你亲手立的。这一笔，黜与不黜，都已是对你自己的判词。 #ending:if_kuke #speaker:青月
#hide:siyue
#hide:yu
#hide:houji
#hide:xie
#hide:gaoyao
#hide:kui
-> END
