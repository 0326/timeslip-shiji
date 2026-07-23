// ═══════════════════════════════════════════════
// 西楚霸王 · 项羽 · 楚汉相争（八幕成长弧线）
// 史源：《史记·项羽本纪》（卷七）
// 母题：力与义与刚愎｜致命弱点：不能容人、妇人之仁与暴烈并存、至死不认错
// 跨幕 VAR：gangbi(刚愎) / yi(义) / renxin(人心)
// ═══════════════════════════════════════════════

VAR gangbi = 0
VAR yi = 0
VAR renxin = 0
VAR mg_result = ""
VAR mg_score = 0

-> act1_wanrendi

// ═══════════════════════════════════════════════
// 第一幕 · 学万人敌 —— 骄傲的种子（7①）
// ═══════════════════════════════════════════════

=== act1_wanrendi ===
#bg:camp_chu
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一位穿越客落到我这儿啦！坐稳咯~」 #speaker:青月
「这一回，你是项籍，字羽，下相人。楚将项燕的孙子。将来世人要叫你——西楚霸王。」 #speaker:青月
你睁开眼。身高八尺有余，一抬手，鼎，被你稳稳举了起来。才气过人，吴中的子弟见了你，都要退让三分。 #speaker:青月 #hint:籍长八尺余，力能扛鼎，才气过人。
#show:xiangliang:default:left
可你的叔父项梁正皱着眉——你学写字，没学成；学剑，又没学成。 #speaker:青月
「重华……不对，项羽啊，你到底想学什么？」项梁把书剑往你面前一推。 #speaker:项梁
#show:qingyue:worry:float
「呐，划重点——你此刻的一句话，会定下你一生的底色哦。答什么？」 #speaker:青月

* #correct #hint:书足以记名姓而已。剑一人敌，不足学，学万人敌。 [「书能记名姓就够了，剑只敌一人——我要学，就学万人敌！」]
	~ gangbi = gangbi + 1
	-> act1_bingfa
* [「叔父说得是，我这就静下心来，把书剑一样样学到底。」]
	-> act1_bookish

=== act1_bookish ===
#show:qingyue:tease:float
你低下头，捧起书卷一笔一画地临摹，剑也从头练起。 #speaker:青月
可这不是项羽。史书里的他志在万人敌，连兵法都『略知其意，又不肯竟学』——那份浮躁与豪气，恰是他之为他。 #speaker:青月 #hint:籍大喜，略知其意，又不肯竟学。
#show:qingyue:solemn:float
「你把他磨成了个安分的读书人。可安分的人，扛不起那面『楚』字大旗呀。」 #speaker:青月
一个循规蹈矩的项籍，不会有会稽的拔剑、不会有巨鹿的破釜。这条路，不是他的路。 #death:overtame #speaker:青月
-> END

=== act1_bingfa ===
#show:xiangliang:default:left
项梁一愣，随即眼里亮起来——这小子，不凡。他不再逼你识字，转而教你兵法。 #speaker:青月 #hint:于是项梁乃教籍兵法，籍大喜。
你大喜过望，可略懂其意，便又不肯学到底了。 #speaker:青月
#bg:riverside
#show:xiangyu:default:center
这一年，秦始皇巡游会稽，车驾如龙。你隔江望着那金舆华盖，脱口而出——
「彼可取而代也！」 #speaker:项羽 #hint:籍曰：彼可取而代也。
#show:xiangliang:default:left
项梁慌忙捂住你的嘴：「别乱说，要灭族的！」——可他看你的眼神，是惊，也是喜。 #speaker:项梁
#show:qingyue:smile:float
「欸——好大的口气！同一年，有个叫刘邦的亭长见了始皇，只敢叹一句『大丈夫当如此也』。」 #speaker:青月
「一个要『取而代之』，一个要『当如此』。露锋芒的，藏心机的——你俩的胜负，从这一眼就分了岔。」 #speaker:青月
#actclear:xiangyu_act1
「万人敌的种子，种下了。可这份『不肯竟学』的浮躁……也一并种下了。走，去看你怎么拔出人生第一柄剑。」 #speaker:青月
-> act2_jiangdong

// ═══════════════════════════════════════════════
// 第二幕 · 江东丧师 —— 初尝挫败（7②③）
// ═══════════════════════════════════════════════

=== act2_jiangdong ===
#bg:camp_chu
#bgm:danger
#show:qingyue:default:float
「秦二世元年，陈涉在大泽乡揭竿。天下反了。会稽郡守殷通想拉你叔侄起兵，做他的将。」 #speaker:青月
项梁使个眼色，你会意。片刻之间——你拔剑，一剑斩下殷通的头。府中大惊，你一人击杀近百，满堂慑伏，无人敢起。 #speaker:青月 #hint:籍遂拔剑斩守头……籍所击杀数十百人。
#show:qingyue:worry:float
「你的出场，是一柄出鞘的剑。以杀立威，易；以德服人，难。这柄剑今日为你开疆，日后……也为你招祸。」 #speaker:青月
你们收吴中精兵八千，渡江而西，一路壮大到六七万人。项梁立楚怀王之后为义帝，自号武信君。 #speaker:青月
-> act2_dingtao

=== act2_dingtao ===
#bg:riverside
#show:xiangyu:default:center
东阿、定陶，连战连捷。你又亲手斩了秦将李由。楚军上下，越发轻视秦兵，人人面带骄色。 #speaker:青月 #hint:项羽等又斩李由，益轻秦，有骄色。
#show:songyi:default:left
谋士宋义拦住项梁进谏：「战胜而将骄卒惰者败。如今士卒已惰，秦兵日增，我为您担忧啊。」 #speaker:宋义
#show:qingyue:worry:float
「呐——这句话，是要应验的谶语。项梁不肯听。轮到你：叔父连胜生骄，兵锋直逼定陶。你劝不劝他持重？」 #speaker:青月

* #correct #hint:战胜而将骄卒惰者败。 [「叔父，宋义说得对。连胜易骄，秦若倾国来援，我军危矣——当持重设防。」]
	~ yi = yi + 1
	-> act2_survive
* [「怕什么！秦兵败军之余，一鼓可平。乘胜进击，何须持重！」]
	~ gangbi = gangbi + 1
	-> act2_reckless

=== act2_reckless ===
#bg:camp_chu
#bgm:danger
你随叔父长驱冒进。秦发倾国之兵增援章邯，夜袭定陶。 #speaker:青月
楚军猝不及防，大溃。项梁——你的叔父、你唯一的依靠——死在乱军之中。 #speaker:青月 #hint:秦果悉起兵益章邯，击楚军，大破之定陶，项梁死。
#show:qingyue:sad:float
军心崩了，你也几乎随之陷没。骄兵之败，一如宋义所言，只是这一回，你把命也险些押了进去。 #death:dingtao #speaker:青月
-> END

=== act2_survive ===
#show:qingyue:default:float
你劝住了自己冒进的心，收拢军势、退守待机。 #speaker:青月
可项梁终究没听宋义的话。定陶一战，秦军倾国而至，叔父战死沙场。 #speaker:青月 #hint:项梁死。
#show:xiangyu:default:center
你退军彭城，第一次尝到失去与挫败的滋味——那个教你兵法、护你成长的人，没了。 #speaker:青月
#show:qingyue:solemn:float
「疼吗？记住这份疼。宋义那句『骄则败』，你今天亲眼见证了。」 #speaker:青月
可怀王偏偏赏识那个料事如神的宋义，拜他为上将军，你只做次将——去救巨鹿。 #speaker:青月
#actclear:xiangyu_act2
「屈居人下，叔父新丧。项羽，你的隐忍到头了。下一幕，你要用一场旷世死战，把自己重新证明给天下看。」 #speaker:青月
-> act3_julu

// ═══════════════════════════════════════════════
// 第三幕 · 破釜沉舟 —— 以死地证明自己（7④）
// ═══════════════════════════════════════════════

=== act3_julu ===
#bg:camp_chu
#bgm:danger
#show:songyi:default:left
上将军宋义领军至安阳，一停就是四十六天，按兵不动。他要坐观秦赵相斗，坐收其敝。 #speaker:青月 #hint:行至安阳，留四十六日不进。
天寒大雨，士卒冻饥，芋菽为食，军无见粮——宋义却送儿子赴齐为相，一路饮酒高会。 #speaker:青月
#show:qingyue:worry:float
「巨鹿城里赵王危在旦夕，城外你们的上将军在喝酒。项羽——军心已经在你身上了。你，动不动手？」 #speaker:青月

* #correct #hint:今不恤士卒而徇其私，非社稷之臣。 [晨入宋义帐中，一剑斩其头，出令三军：「宋义与齐谋反，楚王密令我诛之！」]
	~ gangbi = gangbi + 1
	-> act3_posfu
* [「他是上将军，怀王亲拜。我纵不满，也不能擅杀主帅，坏了法度。」]
	-> act3_wait

=== act3_wait ===
你按住剑柄，终究没动手。军令如山，宋义仍高坐帐中饮酒。 #speaker:青月
可他久留不进、不恤士卒，早已昧于时势人心。巨鹿粮尽，赵军先溃，秦军回师，楚军困于安阳，进退失据。 #speaker:青月
#show:qingyue:sad:float
史上的项羽，正是当机立断斩了宋义，才有了破釜沉舟。你守住了法度，却错过了那扇只开一瞬的门。 #speaker:青月
智者昧于时势，反不如勇者的果决。这一次的『不敢』，让你和那场惊天动地的死战，擦肩而过。 #death:hesitate #speaker:青月
-> END

=== act3_posfu ===
#show:qingyue:solemn:float
诸将慑服，无人敢抗。众人共立你为上将军。威震楚国，名闻诸侯。 #speaker:青月 #hint:项羽已杀卿子冠军，威震楚国，名闻诸侯。
#bg:zhuolu_field
#bgm:danger
#show:xiangyu:default:center
你引全军渡漳河。渡罢——沉船、破釜、烧庐舍，只带三日粮。士卒无一还心，唯有死战。 #speaker:青月 #hint:皆沈船，破釜甑，烧庐舍，持三日粮，以示士卒必死，无一还心。
九战九捷，绝其甬道，杀苏角，虏王离！楚战士以一当十，呼声动天。 #speaker:青月
#show:qingyue:smile:float
「欸——这才是项羽！」 #speaker:青月
破秦之后，你召见诸侯将领。他们入辕门，无不膝行而前，莫敢仰视。 #speaker:青月 #hint:入辕门，无不膝行而前，莫敢仰视。
#show:qingyue:default:float
你成了诸侯上将军，天下诸侯尽归你麾下。这是你一生最辉煌的顶点。 #speaker:青月
「记住这四个字——『莫敢仰视』。它有多耀眼，将来垓下那句『莫能仰视』，就有多苍凉。」 #speaker:青月
#actclear:xiangyu_act3
「力的巅峰，到了。可你在战场上算无遗策，在人心上……才刚要开始失算。」 #speaker:青月
-> act4_hongmen

// ═══════════════════════════════════════════════
// 第四幕 · 鸿门之纵 —— 妇人之仁的致命瞬间（7⑤）
// ═══════════════════════════════════════════════

=== act4_hongmen ===
#bg:camp_chu
#bgm:danger
#show:qingyue:worry:float
「入关前，先说件让你脸上无光的事。」 #speaker:青月
新安城南，你嫌降卒二十万心不服，一夜之间——尽数活埋。 #speaker:青月 #hint:于是楚军夜击坑秦卒二十余万人新安城南。
「同样入关，刘邦约法三章、秋毫无犯，秦人箪食壶浆；你屠城坑卒、所过残灭。楚汉的人心，在这一夜就分了大半。」 #speaker:青月
你率四十万大军入关，驻新丰鸿门。刘邦只有十万，在霸上。曹无伤来告密：刘邦想王关中。你大怒，明日就要击破他！ #speaker:青月
-> act4_feast

=== act4_feast ===
#bg:tent_feast
#show:fanzeng:default:left
亚父范增看得最透：「刘邦入关，财物不取，妇女不幸——此人志不在小。我望其气，成五采龙虎，是天子气。急击勿失！」 #speaker:范增 #hint:此天子气也。急击勿失。
#show:qingyue:solemn:float
「四十万对十万。这是天赐良机，一举可灭对手。范增说得对——但项羽，你听不听得进，是另一回事。」 #speaker:青月
#show:liubang:default:right
次日，刘邦只带百余骑亲来谢罪，卑辞屈膝：「臣与将军戮力攻秦……有小人之言，令将军与臣有郤。」 #speaker:刘邦
你脱口便把告密者卖了：「此沛公左司马曹无伤言之，不然籍何以至此。」——你留他饮酒。 #speaker:青月 #hint:项王即日因留沛公与饮。
#show:fanzeng:default:left
席间，范增三次举起玉玦向你示意：动手！动手！ #speaker:青月 #hint:范增数目项王，举所佩玉玦以示之者三。
#show:qingyue:worry:float
「一个已经服软认错、对你行礼谢罪的人……你，杀，还是不杀？这一刀，考的是你到底是谁。」 #speaker:青月

* #hint:此后夺项王天下者，必沛公也。 [「范亚父说得对。此人是心腹大患，趁今日在座——杀！」]
	~ renxin = renxin + 1
	-> act4_kill
* #correct #hint:项王默然不应——为人不忍。 [你默然不应。他已服软认错，此时杀他，天下人会怎么看我项羽？]
	~ gangbi = gangbi + 1
	-> act4_release
* [不杀，也不放——「留客数日。沛公远来辛苦，且在营中歇息，你那十万人马，本王替你整肃整肃。」]
	~ gangbi = gangbi + 1
	-> if_kouliu_1

=== act4_kill ===
#show:qingyue:tease:float
你使个眼色，项庄舞剑，一剑封喉——刘邦死在鸿门席上。 #speaker:青月
从纯粹的权谋看，这是最『正确』的一刀，范增会拍案叫好。可这不是史上的项羽。 #speaker:青月 #hint:君王为人不忍。
#show:qingyue:solemn:float
史书里的他，面对三举玉玦『默然不应』——不是没看见，是抹不下面子杀一个认错的人。那份『妇人之仁』，正是他之为他。 #speaker:青月
「你替他补上了这一刀，痛快是痛快。可这样的项羽，便不再是那个让后人扼腕千年的悲剧英雄了。他的『义』，恰恰活在这份『不忍』里。」 #death:hongmenkill #speaker:青月
-> END

=== act4_release ===
#show:fankuai:default:right
你正犹豫，樊哙带剑拥盾闯帐，瞋目视你，头发上指，目眦尽裂。你却按剑赞一声「壮士」，赐酒赐彘肩。 #speaker:青月
「诛有功之人，此亡秦之续耳！」樊哙一席话，又戳中你心里那点『不忍』。 #speaker:青月 #hint:此亡秦之续耳，窃为大王不取也。
#show:qingyue:solemn:float
不多时，刘邦借如厕之名，抄小路遁回霸上。张良留下献璧。你受了璧，搁在座上，一言未发。 #speaker:青月
#show:fanzeng:worry:left
范增接过玉斗，掷地，拔剑撞碎，痛骂：「唉！竖子不足与谋！夺项王天下者，必沛公也！」 #speaker:范增 #hint:竖子不足与谋。
#show:qingyue:sad:float
「你放走了唯一的对手。你赢了道义上的体面——却输掉了整个天下。」 #speaker:青月
「可青月不忍心怪你。这一放，是你最大的错，也是你最动人的地方：你到底不是个只讲输赢的人。」 #speaker:青月
#actclear:xiangyu_act4
「亚父的心，凉了一半。你身边最亮的那盏灯，开始明灭不定了。」 #speaker:青月
-> act5_fenwang

// ═══════════════════════════════════════════════
// 第五幕 · 分封失义 —— 刚愎与失义埋众叛之根（7⑥）
// ═══════════════════════════════════════════════

=== act5_fenwang ===
#bg:palace
#bgm:solemn
#show:xiangyu:default:center
你入咸阳，屠城、杀降王子婴、烧秦宫，火三月不灭，收货宝妇女而东。 #speaker:青月 #hint:烧秦宫室，火三月不灭。
#show:qingyue:default:float
「有人劝你：关中山河四塞、土地肥饶，可都此以霸。这是王天下的根基啊。你怎么选？」 #speaker:青月

* #correct #hint:关中阻山河四塞，地肥饶，可都以霸。 [「此言有理。定都关中，扼天下之要——纵有万般思乡，霸业为重。」]
	~ yi = yi + 1
	-> act5_dumidst
* [「富贵不归故乡，如衣绣夜行，谁知之者！我要衣锦还乡，都彭城！」]
	~ gangbi = gangbi + 1
	-> act5_yijin

=== act5_dumidst ===
#show:qingyue:smile:float
你压下思乡的意气，定都关中。这一步，比史上的项羽走得更稳——可下面还有更险的一关。 #speaker:青月
-> act5_yidi

=== act5_yijin ===
#show:qingyue:worry:float
你却一心东归，只为在乡人面前夸耀富贵：「富贵不归故乡，如衣绣夜行！」 #speaker:青月 #hint:富贵不归故乡，如衣绣夜行，谁知之者！
有人背后讥你「楚人沐猴而冠」，你一怒，把他烹了。 #speaker:青月 #hint:项王闻之，烹说者。
#show:qingyue:solemn:float
「把『荣归故里』看得高过『定都称霸』——这就是太史公说的『背关怀楚』。一个容不下逆耳之言的人，做不成真正的天下之主啊。」 #speaker:青月
-> act5_yidi

=== act5_yidi ===
#bg:camp_chu
#show:xiangyu:default:center
你自立为西楚霸王，分封十八诸侯——论亲疏、酬私恩，而非论功。把刘邦封去偏远的巴蜀，又以三秦降将堵其东出。 #speaker:青月 #hint:三分关中，王秦降将以距塞汉王。
#show:qingyue:worry:float
「最后一道坎：义帝。他是你亲手立起来的『复楚』旗帜。如今你独霸天下，他碍事了。杀，还是留？」 #speaker:青月

* #correct #hint:项羽以立楚起家。放杀义帝，则授人以讨逆之柄。 [「义帝虽虚，是我复楚的大义所系。徙其居可也，杀之则失天下之信——留他。」]
	~ yi = yi + 1
	-> act5_clear
* [「一个放羊的傀儡，留着碍眼。密令衡山、临江王，江中……了结了他。」]
	~ yi = yi - 1
	~ renxin = renxin + 1
	-> act5_regicide

=== act5_regicide ===
#show:qingyue:sad:float
你阴令诸侯，在江中击杀义帝。 #speaker:青月 #hint:阴令衡山、临江王击杀之江中。
「你以立楚起家，如今以背楚而行。这一刀，把你从『复楚功臣』，亲手推成了『大逆之贼』。」 #speaker:青月
不久，刘邦为义帝发丧，号召天下共击『杀义帝者』——你亲手把讨伐你的大义，递到了对手手里。 #speaker:青月 #hint:放逐义帝而自立。
「唉，青月看着你一步步走进这局，却拦不住你。这是政治上最致命的一着。」 #speaker:青月
-> act5_after

=== act5_clear ===
#show:qingyue:smile:float
你留下义帝，只徙其居——保住了『复楚』的大义。这一次，你没把讨逆的柄递给对手。 #speaker:青月
-> act5_after

=== act5_after ===
#actclear:xiangyu_act5
#show:qingyue:solemn:float
「分封已定，天下重又暗流汹涌。刚愎埋祸、失义树敌——你亲手栽下的因，就要结成众叛的果了。」 #speaker:青月
-> act6_pengcheng

// ═══════════════════════════════════════════════
// 第六幕 · 彭城之威 —— 军事天才的孤高 vs 政治众叛（7⑦）
// ═══════════════════════════════════════════════

=== act6_pengcheng ===
#bg:zhuolu_field
#bgm:danger
#show:xiangyu:default:center
你北困于齐，坑田荣降卒、系虏妇女——齐人相聚而叛。刘邦乘虚东出，五十六万大军直取彭城。 #speaker:青月 #hint:皆坑田荣降卒……齐人相聚而叛之。
你只带三万精兵回师，晨击汉军，半日之内，大破五十六万！睢水为之不流。论临阵指挥，你是当世第一。 #speaker:青月 #hint:大破汉军……睢水为之不流。
#show:qingyue:worry:float
「你赢了一场又一场仗。可战术再辉煌，掩不住战略在溃败。刘邦逃了，很快又用陈平的离间计，来挖你的墙角了。」 #speaker:青月
-> act6_fanjian

=== act6_fanjian ===
#bg:camp_chu
#show:fanzeng:default:left
荥阳城下，你与范增急围刘邦，眼看就要成功。刘邦用陈平之计：故意慢待你的使者，佯称『以为是亚父的使者』。 #speaker:青月 #hint:项王乃疑范增与汉有私，稍夺之权。
一席伪装的饭食，一句挑拨的话——你心里，起了疑。 #speaker:青月
#show:qingyue:worry:float
「亚父范增，追随你多年，看得最远、急得最切。陈平这离间计其实拙劣得很。项羽，你信这一饭之疑，还是信这七十岁的老人？」 #speaker:青月

* #correct #hint:陈平反间，其计甚拙。 [「陈平惯用诡计，此必是离间之谋。亚父忠心，我岂能因一饭而疑之？急攻荥阳！」]
	~ yi = yi + 1
	-> act6_keepfan
* [「使者失礼，亚父竟与汉私通？夺其权，看他还如何专断！」]
	~ gangbi = gangbi + 1
	~ renxin = renxin + 1
	-> act6_losefan

=== act6_keepfan ===
#show:qingyue:smile:float
你没有中计。范增仍在你身侧运筹，荥阳被你围得水泄不通。 #speaker:青月
史上的项羽，恰恰在这里疑走了范增，从此身边再无人能谋。而你——把最后一盏灯留住了。 #speaker:青月
-> act6_geng

=== act6_losefan ===
#show:fanzeng:worry:left
你逐渐剥夺范增的权。老人勃然大怒：「天下事大定矣，君王自为之。请赐骸骨归卒伍！」 #speaker:范增 #hint:愿赐骸骨归卒伍。
#show:qingyue:sad:float
范增走了。行未至彭城，疽发背而死。 #speaker:青月 #hint:范增……疽发背而死。
「你宁可信一席伪装的饭食，也不信追随多年的亚父。你的多疑与刚愎，逼走了身边最后一个能谋的人。」 #speaker:青月
「从此，你在战场上越打越孤。青月看着那盏灯灭了，心里也空落落的。」 #speaker:青月
-> act6_geng

=== act6_geng ===
#show:xiangyu:default:center
你把太公架上高俎，威胁刘邦：「今不急下，吾烹太公！」 #speaker:青月
刘邦却嬉皮笑脸：「吾与你约为兄弟，我翁即若翁。必欲烹而翁，则幸分我一杯羹！」 #speaker:刘邦 #hint:必欲烹而翁，则幸分我一桮羹。
#show:qingyue:solemn:float
「你以人质要挟，已落下乘；又被项伯一劝而罢手——连这份残忍，你都贯彻不到底。」 #speaker:青月
「一个心软的狠人，对上一个绝情的智者。项羽，你可知道，胜负其实早已注定？」 #speaker:青月
#actclear:xiangyu_act6
「龙且被韩信杀了，鸿沟约成你又守信东归——而刘邦转头就背约追来。众叛的果，熟了。垓下，到了。」 #speaker:青月
-> act7_gaixia

// ═══════════════════════════════════════════════
// 第七幕 · 垓下天亡我 —— 至死不肯认错的骄傲遇末路（7⑧）
// ═══════════════════════════════════════════════

=== act7_gaixia ===
#bg:gaixia
#bgm:solemn
#show:xiangyu:default:center
你的军队困守垓下，兵少食尽，汉军重重围了数匝。 #speaker:青月 #hint:项王军壁垓下，兵少食尽，汉军及诸侯兵围之数重。
夜里，四面忽然都唱起楚歌。你大惊：「汉皆已得楚乎？是何楚人之多也！」 #speaker:青月 #hint:夜闻汉军四面皆楚歌。
#show:yuji:default:left
帐中，你起身饮酒。美人虞常随你左右，骏马骓伴你多年。 #speaker:青月
你慷慨悲歌，泪落数行：「力拔山兮气盖世，时不利兮骓不逝。骓不逝兮可柰何，虞兮虞兮柰若何！」 #speaker:项羽 #hint:力拔山兮气盖世，时不利兮骓不逝。
#show:qingyue:sad:float
虞姬和着你的歌。左右皆泣，莫能仰视。 #speaker:青月 #hint:左右皆泣，莫能仰视。
「……当年巨鹿，诸侯膝行『莫敢仰视』；今夜垓下，他们悲你穷途『莫能仰视』。同样四字，一道由极盛到极衰的弧线，走完了。」 #speaker:青月
-> act7_break

=== act7_break ===
#bg:zhuolu_field
#bgm:danger
#show:xiangyu:default:center
你上马突围，八百壮士随你南出。至阴陵迷路，被一农夫诳往左，陷入大泽，汉军追及。到东城，只剩二十八骑。 #speaker:青月 #hint:至东城，乃有二十八骑。
你自料难脱，对残骑说：「吾起兵八岁，身七十余战，未尝败北。今卒困于此——此天之亡我，非战之罪也！」 #speaker:项羽 #hint:此天之亡我，非战之罪也。
#show:qingyue:worry:float
「二十八骑，数千追兵。眼下你要么拼死突围求生，要么再打一场『快战』证明『天亡我非战之罪』。」 #speaker:青月
「一个身经七十余战、未尝败北的人，最终亡国身死——项羽，你真的觉得，是天要亡你吗？」 #speaker:青月

* #correct #hint:令诸君知天亡我，非战之罪也。 [「今日固决死！愿为诸君快战，三胜之，溃围斩将刈旗——让你们知道，是天亡我，非战之罪！」]
	~ gangbi = gangbi + 1
	-> act7_kuaizhan
* [「不必逞强了。趁乱突围，能活一个是一个，留得性命再图后计——是我错，非天亡我。」]
	~ yi = yi + 1
	-> act7_wake

=== act7_wake ===
#show:qingyue:solemn:float
你第一次把『天亡我』咽了回去，低声认了一句：是我之过。 #speaker:青月
你不再纠缠于证明，而是冷静突围。可这一句迟来的『自责』，恰恰是史上的项羽至死都没说出口的。 #speaker:青月 #hint:尚不觉寤而不自责。
「太史公在篇末最痛心的，就是你临死还三呼『天亡我』。你今天说了『是我错』——那个至死不认错的项羽，被你改写了一点点。」 #speaker:青月
可认了错的项羽，锋芒也就淡了。他之所以是他，正因那份到死不肯低头的执拗。你让他活得清醒，却也少了几分他本来的悲壮。 #death:notxiangyu #speaker:青月
-> END

=== act7_kuaizhan ===
#show:xiangyu:default:center
你分二十八骑为四队，大呼驰下。汉军披靡，你亲斩一将、一都尉，杀近百人，只损两骑！ #speaker:青月 #hint:项王乃驰，复斩汉一都尉，杀数十百人，复聚其骑，亡其两骑耳。
你回头问骑兵：「何如？」众人拜服：「如大王言！」 #speaker:青月
#show:qingyue:sad:float
「勇冠三军，你做到了。可你证明的，只是自己能打；证明不了的，是这败亡究竟因谁。」 #speaker:青月
#actclear:xiangyu_act7
#minigame:klotski:hard
{ mg_result == "win":
	#show:qingyue:sad:float
	「{mg_score} 分，你率残骑从汉阵里撕出一道缺口，血染征袍，终于冲到了乌江边。」 #speaker:青月
- else:
	#show:qingyue:sigh:float
	「也罢，你已杀得汉兵辟易数里，乌江在前——再不必打了。」 #speaker:青月
}
「快战三胜，你把『天亡我』刻进了这二十八骑心里。可青月听着，只觉得心疼——前面就是乌江了。」 #speaker:青月
-> act8_wujiang

// ═══════════════════════════════════════════════
// 第八幕 · 乌江不渡 —— 最后的骄傲与担当（7⑧）
// ═══════════════════════════════════════════════

=== act8_wujiang ===
#bg:riverside
#bgm:solemn
#show:xiangyu:default:center
你退到乌江边。江水滔滔，对岸就是江东——你起兵的地方。 #speaker:青月
#show:qingyue:sad:float
乌江亭长早已檥船相待：「江东虽小，地方千里，众数十万，亦足王也。愿大王急渡！今独臣有船，汉军至，无以渡。」 #speaker:青月 #hint:愿大王急渡。
「一条船，一线生机。渡过去，你还是江东之主，还能东山再起。项羽——渡，还是不渡？」 #speaker:青月
「这一步，看的是你走到今天，究竟得了多少人心、又欠了多少人。」 #speaker:青月

* #correct #hint:纵江东父兄怜而王我，我何面目见之？ [「天之亡我，我何渡为！我与江东子弟八千人渡江，今无一人还，我有何面目见江东父老？」]
	-> act8_ending_router
* [「留得青山在。渡江东，重整旗鼓，未必没有再来一次的机会——先活下去！」]
	-> act8_cross
* [「江东子弟还在，父老还在。我项羽这一败，不算完！」——你登船，志在卷土重来]
	-> if_dujiang_1

=== act8_cross ===
#show:qingyue:worry:float
你踏上了亭长的船。江水把你渡向江东。 #speaker:青月
#show:qingyue:solemn:float
可史上的项羽，笑着拒绝了这条船：「纵彼不言，籍独不愧于心乎？」他可以败、可以死，却不肯苟活而负八千子弟。 #speaker:青月 #hint:籍独不愧于心乎？
「后人怜项羽，怜的正是这一刻的『无颜见江东父老』。『生当作人杰，死亦为鬼雄』——若你上了船，那个知耻担当的霸王，就不见了。」 #speaker:青月
一个渡了江的项羽，或许能多活几年，却再不是那个让千古扼腕的西楚霸王。他的尊严，本就该留在这乌江边。 #death:crossjiang #speaker:青月
-> END

// —— 史实终局路由：按累积状态分叉多结局 ——
=== act8_ending_router ===
#show:xiangyu:default:center
你把骓马赠给亭长：「吾知公长者。此马随我五年，所向无敌，不忍杀之，以赐公。」 #speaker:青月 #hint:不忍杀之，以赐公。
你令骑兵尽皆下马，持短兵接战。你一人杀汉军数百，身被十余创。 #speaker:青月 #hint:独籍所杀汉军数百人，项王身亦被十余创。
回头见汉骑司马吕马童——你的故人：「吾闻汉购我头千金，邑万户，吾为若德！」言罢，自刎而死。 #speaker:青月 #hint:乃自刎而死。
{ renxin >= 2 && gangbi >= yi:
	-> end_wangu
- else:
	-> end_yingxiong
}

// 结局 A · 史实悲剧终局（刚愎众叛型）
=== end_wangu ===
#bg:gaixia
#bgm:solemn
#achieve:xiangyu_wujiang
#show:qingyue:sad:float
王翳取你的头，余骑相争你的尸身，自相践踏，死者数十。五人分你一体，各去封侯。 #speaker:青月 #hint:五人共会其体……故分其地为五。
「你死时三十一岁。坑降、弑帝、逐范增、疑功臣——你一路把身边的人推开，最后连自己的尸身，都成了别人争抢的赏格。」 #speaker:青月
太史公说：『自矜功伐，奋其私智而不师古……身死东城，尚不觉寤而不自责，过矣。乃引「天亡我，非用兵之罪」，岂不谬哉！』 #speaker:青月 #hint:奋其私智而不师古……岂不谬哉。
#show:qingyue:solemn:float
「你至死认定是天亡你。可一个未尝败北的人竟亡了国——不是天，是你容不下人、失了义、又不肯认错呀。」 #speaker:青月
「可太史公终究破例把你列进了『本纪』，与帝王同尊。『近古以来未尝有也』——你的败，也败得惊天动地。」 #speaker:青月 #hint:近古以来未尝有也。
「呼……你走完了他的一生。力盖世，而终以刚愎自误。看懂了吗？他不是输给了刘邦，是输给了自己。」 #speaker:青月 #ending:canon
-> END

// 结局 B · 英雄悲情终局（得人心/守义较多的反事实照见）
=== end_yingxiong ===
#bg:riverside
#bgm:solemn
#achieve:xiangyu_wujiang
#show:qingyue:sad:float
王翳取你的头。可这一路，你比史上的他多守了几分义、多留了几分人心——鲁地为你死守礼义，不肯降汉。 #speaker:青月 #hint:独鲁不下……为主死节。
刘邦拿你的头示鲁，鲁人才降。他以鲁公之礼，把你厚葬于谷城，为你发哀，泣之而去。 #speaker:青月 #hint:汉王为发哀，泣之而去。
#show:qingyue:solemn:float
「你到底还是死在了乌江边——这是史实，项羽的结局本就是悲剧，改不了的。」 #speaker:青月
「可你这一程走得比他敞亮些：少坑了些人、少负了些义。连你的对手，都为你落泪、以王礼葬你。」 #speaker:青月
「你看，未必更好——你仍旧败了、死了；可你死得让敌人都动容。史书里的他若也这样走，或许……就不那么孤了。」 #speaker:青月
「呼……力与义与刚愎，纠缠了你一生。青月陪你走到了最后。项羽，一路走好。」 #speaker:青月 #ending:canon
-> END

// ═══════════════════════════════════════════════
// IF线 · 鸿门扣留 —— 不杀不放，扣人收军（自由模式歧路）
// ═══════════════════════════════════════════════

=== if_kouliu_1 ===
#bg:tent_feast
#show:qingyue:worry:float
「欸？！第三条路——你既不落刀，也不放人，你要把他……扣下来？」 #speaker:青月
你按住剑，却对刘邦一笑：「沛公远来辛苦。鸿门风大，且在营中安歇几日；你那十万人马，本王替你整肃整肃。」
刘邦脸色一僵，张良垂目，范增举着的那块玉玦，也僵在了半空。
#show:fanzeng:worry:left
「大王！」范增急了，「杀之，绝后患；纵之，是养虎。你这一扣——是把虎养在自己帐中啊！」 #speaker:范增
#show:qingyue:solemn:float
「亚父这话有理呀。你想两头都占：既不担『杀降』的恶名，又不放这心腹大患。可天底下，哪有这么便宜的事？」 #speaker:青月
-> if_kouliu_2

=== if_kouliu_2 ===
#bg:camp_chu
#show:xiangyu:default:center
你收了刘邦的兵符，遣项伯监其军。汉军群龙无首，萧何、张良在关中急得团团转，士卒一夜逃散大半。
你独大了。四十万楚军，天下再无人敢撄其锋。
#show:qingyue:worry:float
「可是呀——你扣的，是一个已经卑辞谢罪、约为兄弟的人。」 #speaker:青月
消息传开，诸侯人人自危：连来谢罪行礼的都能扣，谁还敢与这西楚霸王共事？你以『义』起家，这一扣，把『义』字扣出了一道裂缝。 #speaker:青月 #hint:项羽以立楚起家，重然诺。
#show:qingyue:solemn:float
「你留着刘邦，杀又舍不得杀，放又不敢放，只能一直关着——关一天，天下就多看你一天，看你到底怎么处置他。」 #speaker:青月
「他成了你甩不掉的影子。你赢了一时的势，却把自己架在了『失信』的火上。这条路能走多远，史书上没有答案——因为项羽，从来没敢走它。」 #speaker:青月
你独霸天下，帐中却锁着一头你既不敢杀、也不敢放的猛虎。这一局棋，连你自己也不知道该怎么收场。 #ending:if_kouliu #speaker:青月
-> END

// ═══════════════════════════════════════════════
// IF线 · 乌江渡江 —— 知耻而后勇，卷土重来（自由模式歧路）
// ═══════════════════════════════════════════════

=== if_dujiang_1 ===
#bg:riverside
#bgm:solemn
#show:qingyue:worry:float
「你……上船了。可你眼里没有苟活的怯——是不甘，是那口『我不算完』的气。」 #speaker:青月
你登上亭长的船。桨声欸乃，江水把你渡向江东——你起兵的地方。
「一千年后，杜牧站在这乌江边，写了一句偏心你的诗：『江东子弟多才俊，卷土重来未可知』。你渡了这一次，就是要证明这一句。」 #speaker:青月
-> if_dujiang_2

=== if_dujiang_2 ===
#bg:camp_chu
#show:xiangyu:default:center
你回到江东，登高一呼。可应者，寥寥。
当年随你出征的八千子弟，一个都没能回来。他们的父母兄长站在田埂上望着你，眼里没有恨，只有一种更让你难受的东西——沉默。
#show:qingyue:sad:float
「王安石也写过一句，接的正是杜牧：『江东子弟今虽在，肯与君王卷土来？』」 #speaker:青月
「子弟还在，可他们……还肯把儿子，再交到你手里吗？」 #speaker:青月
#show:xiangyu:default:center
你征兵。可这一回没有『破釜沉舟』那样动天的呼声，只有老人们红着眼眶的迟疑。刘邦已定天下、诸侯尽归于汉，你以疲敝的江东一隅，去对抗一统之势。 #speaker:青月 #hint:汉并天下，诸侯毕至。
#show:qingyue:solemn:float
「你或许还能再打几场漂亮的仗——你毕竟是项羽。可你养不起一场持久的战，江东的元气，经不起第二次八千子弟。」 #speaker:青月
「卷土重来未可知——『未可知』三个字，是杜牧的偏爱，也是历史最诚实的答案：谁也不知道。也许你能再搏一次，也许，你只是把江东最后的血，也一并流干了。」 #speaker:青月
你握着剑，站在江东的春天里。身后是愿意再信你一次的父老，面前是整个已经归汉的天下。这一次，你想清楚『为什么而战』了吗？ #ending:if_dujiang #speaker:青月
-> END
