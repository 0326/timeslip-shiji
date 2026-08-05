// ═══════════════════════════════════════════════
// 虞舜 · 皋陶作刑 · 惟刑之恤
// 史源：《史记·五帝本纪》(shun-shezheng)
// ═══════════════════════════════════════════════

VAR merciful = true

-> c_open

=== c_open ===
#bg:mingtang_xing
#bgm:solemn
#show:qingyue:worry:float
「……嘘。听见明堂外的动静了吗？有人在哭，有人在骂，还有人在喊冤呢。」 #speaker:青月
「人心这东西呀，比洪水还难驯。这一世，你还是重华，世人唤作舜——尧已老了，把天子的政事都交到了你手上。」 #speaker:青月
你睁开眼。明堂之上，四方诸侯的目光都落在你身上。你刚划定十二州，疏导了河川，天下初初有了轮廓。 #speaker:青月
#show:qingyue:calm:float
「唔……治水、划州、正历法，这些你都做得漂亮。可门外那些哭声骂声——」 #speaker:青月
有一样东西，一直压在你心口：人心。有人偷、有人抢、有人杀，蛮夷扰乱中原，寇贼为非作歹。 #speaker:青月
#show:qingyue:worry:float
「刑法。天下第一次，要有一套『刑』了。这套刑该怎么立——是你这一世，最重的一笔。」 #speaker:青月
-> c_lifa

=== c_lifa ===
一位老臣出列，躬身问你：「君上，如今盗贼四起，人心不安。当以何法治之？」 #speaker:四岳
#show:qingyue:tease:float
「呐——所有人都在等你开口。乱世，是不是就该用重典？杀一儆百，最快最狠？」 #speaker:青月
你知道，你此刻说出的每一个字，都会成为后世千年的规矩。 #speaker:青月

* #correct #hint:象以典刑——把刑罚画成图象公示于众，让人知耻而止，不轻易动真刑。 [「先画象示刑——把刑罚绘成图象公示，让人望而知耻、不敢犯」]
	-> c_xiangxing
* [「乱世用重典。凡有犯者，一律施以墨、劓、剕、宫、大辟」——杀一儆百，一夜之间便可还天下太平]
	~ merciful = false
	-> c_death_kill

=== c_xiangxing ===
#show:qingyue:solemn:float
你命人将各种常刑绘成图象，公示于四方——不为杀人，只为让人知耻而止。 #speaker:青月 #hint:象以典刑。
「『象以典刑』。」 #speaker:青月
「你要的不是砍下多少颗头，而是让人在动手之前，先羞愧地缩回手。刑，是拿来『弼教』的，不是拿来立威的。」 #speaker:青月
#show:qingyue:smile:float
「欸——好一个以耻代刑！接着呢，真犯了当受五刑的人，你打算怎么办？」 #speaker:青月
-> c_liuyou

=== c_liuyou ===
明堂下押上一名罪人。他罪当受刑——按古法，或墨面、或劓鼻、或断足。众目睽睽，都等你落下这道命令。 #speaker:青月 #hint:五刑指墨、劓、剕、宫、大辟。
#show:qingyue:worry:float
「肉刑一下去，人就残了一辈子。可不罚，又立不起规矩。你，怎么两全？」 #speaker:青月

* #correct #hint:流宥五刑——以流放宽宥五刑，酌情从宽，是中国最早的『慎刑』。 [酌情从宽——以流放代替肉刑，五刑各有等差，五流各有处所]
	-> c_liuyou_ok
* [严格照古法，当墨则墨、当劓则劓，一寸不宽]
	~ merciful = false
	-> c_death_kill
* [刀也不落，人也不徙——定下赎法：无论何罪，皆可以金赎之]
	-> if_shuxing_1

=== c_liuyou_ok ===
#show:qingyue:solemn:float
你没有让刀落下。你判他流放远方，以流刑宽宥本该加身的肉刑——五刑有等差，五流有处所，各按其罪轻重。 #speaker:青月 #hint:流宥五刑。
「『流宥五刑』。」 #speaker:青月
「墨、劓、剕、宫、大辟……你把这五种刻在血肉上的刑，换成了流放。这一念之仁，是华夏『慎刑』的头一缕光。」 #speaker:青月
接着，你又分设诸刑：以鞭责作官府之刑，以木板轻打作学校之刑，以钱财作赎罪之法——轻重有别，不一概加身。 #speaker:青月 #hint:鞭作官刑，扑作教刑，金作赎刑。
#show:qingyue:smile:float
「鞭作官刑、扑作教刑、金作赎刑……啧，你把『刑』分出了层次，不再是一杀了之。学会了呀。」 #speaker:青月
-> c_yancai

=== c_yancai ===
#show:qingyue:calm:float
这日，两桩案子摆到你面前。 #speaker:青月
其一：一个农人失手打翻了火盆，烧了邻家的谷仓——他是过失，是无心之灾。 #speaker:青月
其二：一个惯盗，屡教不改，三番五次入室行凶，苦主血泪满堂。 #speaker:青月
被烧了谷仓的苦主跪在堂下，泣血叩首：「君上！那是我一家老小过冬的口粮啊！若轻轻放过纵火之人，天理何在？！」 #speaker:苦主
#show:qingyue:worry:float
「一个是失手，一个是惯犯。苦主的眼泪也是真的。你要是一碗水端平……端得平吗？」 #speaker:青月

* #correct #hint:眚灾过赦，怙终贼刑——过失灾害则赦免，怙恶不悛则严惩。 [过失之灾，予以赦免；怙恶屡犯之徒，从重施刑——纵然苦主当堂痛哭，骂你不公]
	-> c_yancai_ok
* [两案一视同仁：都是闯了祸，一律轻轻放过——满堂皆颂你宽仁厚德]
	~ merciful = false
	-> c_death_slack

=== c_yancai_ok ===
#show:qingyue:solemn:float
「失手的，赦。着他为苦主补足过冬之粮，亲手把仓再垒起来。」你顿了顿，看向那惯盗，「怙恶的——从重，办。」 #speaker:舜
你赦免了那失火的农人——过失酿成的灾祸，本非其心，罚之无益。 #speaker:青月 #hint:眚灾过赦。
你却重判了那惯盗——明知故犯、怙恶不悛，害人不止，不严惩不足以止恶。 #speaker:青月 #hint:怙终贼刑。
「『眚灾过赦，怙终贼刑』。」 #speaker:青月
「宽，宽在无心之失；严，严在明知故犯。宽严不是看你心软心硬，是看那人存的什么心。这，才叫『明』。」 #speaker:青月
#show:qingyue:smile:float
「欸——你算是摸到刑法的骨头了。可这么大一套刑，总得有个人来执掌。你心里，有人选了吗？」 #speaker:青月
-> c_gaoyao

=== c_gaoyao ===
#show:gaoyao:solemn:left
群臣之中，一人立于阶下：面如削瓜，玄色深沉，沉静如渊——他便是皋陶。 #speaker:青月 #hint:皋陶为大理，平，民各伏得其实。
「蛮夷扰乱中原，寇贼奸宄横行，」你开口，「谁能执掌这天下之刑，为我做『士』（理官）？」 #speaker:舜
#show:qingyue:tease:float
「用刑的人，比刑本身还要紧。你要选一个杀伐果决、说一不二的酷吏？还是——」 #speaker:青月

* #correct #hint:汝作士，五刑有服，维明能信——舜命皋陶作士，以刑弼教，断案公平。 [命皋陶作士：「五刑各有执法，唯有刑法严明，才能取信于民」]
	-> c_gaoyao_ok
* [选一个最狠辣的酷吏，专以严刑立威，让天下人闻风丧胆]
	~ merciful = false
	-> c_death_kill
* [这杆秤，交给谁都不放心——不设士官，天下之狱，你亲自来断]
	-> if_qinduan_1

=== c_gaoyao_ok ===
#show:qingyue:solemn:float
你把天下的刑狱，交给了皋陶。 #speaker:青月 #hint:皋陶，汝作士，五刑有服，五服三就；五流有度，五度三居：维明能信。
「你对他说：五刑各有执法，五流各有处所——唯有刑法严明，才能取信于民。」 #speaker:青月
皋陶叩首受命，良久，才低声开口：「臣领命。只是臣有一言——臣执这把刀，是盼着有一日，天下再用不上它。」 #speaker:皋陶
「正是此意。」你亲手扶起他，「刑为弼教，不为立威。你我，共勉。」 #speaker:舜
日后皋陶断案，公平如水，百姓无不心服，各自吐露实情。 #speaker:青月 #hint:皋陶为大理，平，民各伏得其实。
#show:qingyue:smile:float
「他成了华夏『理官之祖』呀。你选的不是一把刀，是一杆秤。」 #speaker:青月
-> c_qinzai

=== c_qinzai ===
#hide:gaoyao
#bg:mingtang_xing
#bgm:solemn
诸事已定。你立于明堂之上，望着阶下那一套刚刚立起的刑法——象刑、流宥、赎金、赦宥、贼刑，井然有序。 #speaker:青月
#show:qingyue:worry:float
「都齐了。可我看你还没松口气……你在犹豫什么？」 #speaker:青月
你却没有露出得意。你想起那被流放的罪人、那失火的农人、那受刑之下的血。刑立起来了，可每落一次，都是一条人命、一世残缺。 #speaker:青月

* #correct #hint:钦哉，钦哉，惟刑之静哉——用刑须慎、须存哀矜之心。 [你向群臣郑重叮嘱：「慎重啊，慎重啊，用刑之事，务必公正而审慎」]
	-> c_end_sage
* [你满意地宣告：刑法已备，从此天下有法可依，可以高枕无忧了]
	~ merciful = false
	-> c_end_sage

=== c_death_kill ===
#bgm:danger
你以杀立威，重典加身。一时间，四方震恐，无人敢言。 #speaker:青月
可肉刑之下，血流成河，冤者、误者、无辜者，皆在刀下。人心先是畏惧，继而怨恨——「舜之刑，只见杀，不见德。」 #speaker:青月
民怨如水，日积日深。你以刑立威，却也以刑失了德。那个「以德化人」的舜，从此不再是你。天下之心，一点点离你而去。 #death:tyranny #speaker:青月
#hide:gaoyao
-> END

=== c_death_slack ===
#bgm:danger
你要做个宽仁之君，凡案皆轻轻放过——失火的赦了，行凶的也赦了；初犯的宽了，怙恶不悛的也宽了。 #speaker:青月
一时人人称你仁厚。可惯盗见无刑可畏，愈发猖獗；奸宄之徒奔走相告：「舜之世，作恶无罪！」 #speaker:青月
盗贼横行，苦主无处伸冤，良善反成鱼肉。无法无度，姑息养奸，天下大乱而不可治。这不是仁，是纵。那个「明刑弼教」的舜，终究没能护住他的百姓。 #death:anarchy #speaker:青月
-> END

=== c_end_sage ===
#bg:mingtang_xing
#bgm:solemn
#achieve:shun_xingfa
{ merciful:
	「钦哉，钦哉——惟刑之静哉！」你向满朝群臣，一字一顿。 #speaker:舜 #hint:钦哉，钦哉，惟刑之静哉！
	#show:qingyue:solemn:float
	「你听——刑法立成的这一天，你说的不是『我立了法』，而是四个字：慎重，慎重。」 #speaker:青月
	天下明德，皆自你这一念敬慎而始。你立起刑法，却始终把它当作最后、最不得已的手段——以刑弼教，而非以杀立威。 #speaker:青月 #hint:天下明德皆自虞帝始。
	#show:qingyue:smile:float
	「你把『哀矜』二字，刻进了华夏的律法里。四千年后，人们说起『慎刑』，还会想起今天这个明堂上的你呀。」 #speaker:青月
	「呼——你走完了他这一段。看懂了吗？真正的法度，从来不是让人怕，是让人不必怕。」 #speaker:青月 #impact:impact_xingfa_qinzai #ending:canon #quiz:quiz_xingfa_qinzai
- else:
	#show:qingyue:sad:float
	「……法，你是立起来了。可你少说了四个字。」 #speaker:青月
	「史书里的他，在刑法立成那天，说的是——『钦哉，钦哉，惟刑之静哉』。慎重啊，慎重啊。」 #speaker:青月 #hint:钦哉，钦哉，惟刑之静哉！
	「刑是死的，人是活的。少了那一点哀矜之心，法便只剩森森的牙。你这一世的舜……差的，就是这口气。」 #speaker:青月
	#show:qingyue:calm:float
	「要不……再走一遍？把那颗慎刑之心，找回来。我等你呀。」 #speaker:青月 #ending:if_gaozhen
} #speaker:青月
-> END

// ═══ IF线 · 金赎天下（自由模式歧路：赎法大开，以金代刑）═══

=== if_shuxing_1 ===
#bg:mingtang_xing
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有让刀落下，也没有判他流徙。你定下赎法：五刑皆可以金赎——铜入官府，人归其家。 #speaker:青月
律令一出，四方称便。府库里的铜一天天多起来，官家用它赈灾、修渠；断手断足的人少了，刑下的哭声也少了。 #speaker:青月
#show:qingyue:calm:float
「听起来……很仁厚呀。起初，我也这么觉得。」 #speaker:青月
可几年过去，你渐渐看见另一件事：市上行凶的富家子，纳了铜，翻身上马回家去了；偷一袋粟米的饥民，凑不出赎金，只能伏在刑下。 #speaker:青月
同罪之人，一个走出公堂，一个留在刀下——律成了一杆秤，称的却不是罪，是铜。 #speaker:青月
#show:qingyue:solemn:float
「史书里的他，只把『金作赎刑』用在最轻的罪与存疑的案上，半分不肯多开。」 #speaker:青月 #hint:金作赎刑。
「这扇门呀，开一条缝，是恤；敞开来……就是价了。」 #speaker:青月
你的刑法养肥了府库，也在穷人心里刻下了一行字：王法有价。 #ending:if_shuxing #speaker:青月
-> END

// ═══ IF线 · 天子亲狱（自由模式歧路：不设士官，亲断天下之狱）═══

=== if_qinduan_1 ===
#bg:mingtang_xing
#bgm:solemn
#show:qingyue:worry:float
「欸？不设士官……史书上，可没有这一页哦。我也是第一次看。」 #speaker:青月
你没有把刑狱交给任何人。天下之狱，天子亲断——你想起当年，狱讼之人不去找丹朱，都来找你，那时你断得又快又平。 #speaker:青月 #hint:狱讼者不之丹朱而之舜。
起初，天下人都说好。天子亲坐堂上，谁还敢欺瞒？件件有着落，桩桩服人心。 #speaker:青月
#show:qingyue:calm:float
可讼状像春水一样漫上来。十二州的案卷压满明堂，你从鸡鸣断到星起，案头的灯换了一盏又一盏。 #speaker:青月
你断得越公，来的人越多；来的人越多，你越断不完。悬而未决的案子在各州积成了山——公道排起了队，一等就是三年。 #speaker:青月
#show:qingyue:solemn:float
「史书里的他，选了皋陶。不是他断得不如皋陶——是他知道，天下要的不是一位断案的圣人，是一杆人人够得着的秤呀。」 #speaker:青月 #hint:皋陶为大理，平，民各伏得其实。
你把公道握在了自己手里，也把它锁在了自己手里——那么，你之后呢？ #ending:if_qinduan #speaker:青月
#hide:gaoyao
-> END
