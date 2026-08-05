// ═══════════════════════════════════════════════
// 帝尧 · 敬授民时 · 命羲和定历
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR mg_result = ""
VAR mg_score = 0

-> c_open

=== c_open ===
#bg:yao_court_alt3
#bgm:solemn
#show:qingyue:tease:float
「别出声——我正数着呢。角、亢、氐、房、心……唔，又被你数乱啦！」 #speaker:青月
「嘻，满天的星星，我一个月牙儿哪数得过来。正好你来了——这一世，你是放勋，世人唤作尧。你猜怎么着？抬头数星星，就是天子顶顶要紧的正经差事哦。」 #speaker:青月
你睁开眼。平阳的宫庭里，你头戴黄冠，身着玄衣，阶下红车白马。没有刀兵，没有杀机——只有一整个天下，在等你把它安顿好。 #speaker:青月
#show:qingyue:solemn:float
「他们说你——『其仁如天，其知如神。就之如日，望之如云。』人追着你，像追着太阳呐。」 #speaker:青月 #hint:其仁如天，其知如神。就之如日，望之如云。
#show:qingyue:tease:float
「可你现在富有四海、贵为天子……唔，这么一个人，最先会栽在哪儿呢？」 #speaker:青月
-> c_pose

=== c_pose ===
四方诸侯来朝，玉帛盈庭，颂声如潮。你端坐堂上，天下之大，尽在你一人俯仰之间。 #speaker:青月
#show:qingyue:worry:float
「呐，划重点——第一个坎，不是敌人，是你自己。这般富贵，最容易让人骄起来、松下来哦。」 #speaker:青月
「史书上的你，是怎么坐这把位子的呢？」 #speaker:青月

* #correct #hint:富而不骄，贵而不舒——越是至高，越要如临深渊。 [你敛容自持，富有天下却不敢骄纵，尊贵至极却不敢懈怠]
	-> c_jiuzu
* #correct [退回内殿，静思修身齐家之道——先想清楚，再坐这把椅子]
	-> c_explore_pose_self
* [你受享这泼天的富贵，纵情安乐，天下既定，何必再自苦]
	-> c_death_arrogance

=== c_death_arrogance ===
#bg:yao_court
#bgm:court
你日渐骄纵，起居无度，政事推诿。你能明的德，先在自己身上暗了；九族先怨，百姓离心，万国不再来朝。那个「其仁如天」的尧，从此不是你了。 #death:arrogance #speaker:青月
-> END

=== c_jiuzu ===
#bg:yao_court
#bgm:court
#show:qingyue:smile:float
「欸——稳住了！骄不得、松不得，这才是坐天下的样子。」 #speaker:青月
「治天下么……」你敛去堂上的颂声，淡淡道，「先从治朕这一身、朕这一家开始吧。」 #speaker:尧
你先修己身，再由近及远：先使九族亲睦，九族既睦，再辨明百官职守；百官政绩昭著，又调和天下万国。 #speaker:青月 #hint:能明驯德，以亲九族。九族既睦，便章百姓。百姓昭明，合和万国。
#show:qingyue:tease:float
「家和了，官明了，国睦了……可有一样最要紧的东西，天下人还眼巴巴等着你给呢——你猜是什么？」 #speaker:青月
-> c_shoushi

=== c_shoushi ===
#show:xihe:calm:center
你召来掌天时的羲氏、和氏两族。田野间，百姓抬头望天，不知何时该耕、何时该收——农时无准，一年就要乱。 #speaker:青月
#show:qingyue:solemn:float
「这就是你要给天下的东西——『时』。什么时候播种，什么时候收藏，都要你替万民定下来。」 #speaker:青月
「呐，这一步走岔了，田里颗粒无收，饿死的可是天下人。你要怎么给这个『时』？」 #speaker:青月

* #correct #hint:敬顺昊天，数法日月星辰——不是拍脑袋定，是抬头观天、循日月星辰之行而推。 [你命羲和恭顺上天，依日月星辰的行迹推算历法，慎重把农时颁授百姓]
	-> c_sifang
* #correct [召羲和来，先问清楚：观天象，具体怎么观？]
	-> c_explore_shoushi_stars
* [「天心即朕心。」——省去经年累月的观测之劳，凭圣心径定一部历，当年便可颁行天下]
	-> c_death_luanli
* #correct [不观天象，只看物候——桃李华则耕、寒蝉鸣则获，教民按草木鸟兽之信授时]
	-> if_wuhou_1

=== c_death_luanli ===
#hide:xihe
#bg:yao_court
#bgm:court
你废弃观象，凭一己臆断定下死历。天行有常，你的历却与之乖离——寒暑错位，春令行于秋，播种失期，禾稼尽枯。连岁大饥，饿殍遍野，天下人因你这一道乱历而困顿流离。 #death:luanli #speaker:青月
-> END

=== c_sifang ===
#bg:yanggu_sun
#bgm:solemn
#show:qingyue:smile:float
「对喽——观天，不是凭空。你把『时』交还给了天，再由天交给万民。」 #speaker:青月
「羲、和听命——」你亲自向两族长者授命，「敬顺昊天，数法日月星辰。天怎么走，历便怎么写；历怎么写，万民便怎么种。」 #speaker:尧 #hint:乃命羲、和，敬顺昊天，数法日月星辰，敬授民时。
#show:xihe:respect:center
羲仲出列请命：「臣愿往。只是——东西南北，各正一时。敢问陛下，臣当居于何方，以定仲春？」 #speaker:羲仲
#show:qingyue:worry:float
「羲仲该去哪儿迎日出、定春分呢？你要亲口分派。选错方位，历就全错啦。」 #speaker:青月

* #correct #hint:分命羲仲，居郁夷，曰旸谷。日中，星鸟，以殷中春。 [命羲仲居东方旸谷，恭迎日出、劝课春耕，以昼夜平、鸟星见而定仲春]
	-> c_sifang_full
* [命羲仲远赴北方幽都，守着最长的黑夜去定春分]
	-> c_death_fangwei

=== c_death_fangwei ===
#hide:xihe
#bg:winter_dark
#bgm:dark
你把定春分的羲仲遣去了极北的幽都。那里日短夜长，昴星当昏——本是定仲冬之地。方位一错，四时全乱：该春不春，该冬不冬，民不知所耕，鸟兽失其时。授时之政，毁于一念之差。 #death:fangwei #speaker:青月
-> END

=== c_sifang_full ===
#bg:yanggu_sun
#bgm:epic
#show:qingyue:smile:float
「漂亮！东方旸谷迎日出，正是定春分的地方。」 #speaker:青月
「羲仲，居郁夷旸谷，敬道日出——以昼夜之平、鸟星之见，替朕把仲春定下来。」 #speaker:尧 #hint:分命羲仲，居郁夷，曰旸谷。敬道日出。
#show:xihe:respect:center
羲仲长揖及地：「臣，领命。」自此东方海隅，有了一个年年恭迎日出的人。 #speaker:青月
#bg:yao_court
#bgm:court
你依次分派四方：羲叔居南交，日永星火，以正仲夏；和仲居西土昧谷，寅饯纳日，宵中星虚，以殷仲秋；和叔居北方幽都，日短星昴，以正仲冬。 #speaker:青月 #hint:羲叔居南交，日永星火，以正中夏；和仲居昧谷，夜中星虚，以正中秋；和叔居幽都，日短星昴，以正中冬。
#show:xihe:concern:center
羲和两族领命而去。多年观测，他们记下了日影的长短、星辰的移转，可越算越发现——天行与历，总差着那么一点点。 #speaker:青月
#show:qingyue:solemn:float
「东西南北，春夏秋冬，一一各安其位。可你抬头看——天上的日月，走得并不一样齐哦。」 #speaker:青月
「一年，到底该是多少天？多出来、少下去的那点零头，你要怎么办？」 #speaker:青月

* #correct #hint:岁三百六十六日，以闰月正四时——多出的零头，用闰月补齐，四时才不会一年年错开。 [定一岁为三百六十六日，设置闰月来校正四季，使历与天行相合]
	-> c_end_shengzhi
* #correct [问羲和：闰月究竟如何设置？三年一闰还是五年再闰？]
	-> c_explore_sifang_leap
* [取三百六十日整数为一年——颁历简明、万民易记，那点零头，不必理会]
	-> c_death_wurun
* #correct [历成，却秘而不宣——将天时藏为天子通天的独秘，令万民只知听命、不知其所以然]
	-> if_mili_1

=== c_death_wurun ===
#bg:yao_court
#bgm:court
你舍去了那多出的零头。年年积欠，数岁之后，历与天行渐渐脱节——冬至滑入了春，节气尽数错位。农人依历而作，却处处失时，禾稼不登，天下复饥。差之毫厘的那点零头，谬以千里。 #death:wurun #speaker:青月
-> END

=== c_end_shengzhi ===
#bg:yao_court
#bgm:solemn
#achieve:yao_shoushi
你以闰月正四时，岁功乃成；又诚信地整饬百官，各方事业无不兴办。天下自此耕有其时、藏有其序。 #speaker:青月 #hint:岁三百六十六日，以闰月正四时。信饬百官，众功皆兴。
#show:qingyue:solemn:float
「……你看，这就是最古老的『仁如天』。」 #speaker:青月
「不是靠威权，是替天下人把日子的秩序定下来——什么时候种，什么时候收，什么时候归家取暖。」 #speaker:青月
#show:qingyue:smile:float
「历成了，官治了，可你已在位七十载啦。你抬眼环顾四方，缓缓开口——『谁，可顺此事？』」 #speaker:青月 #hint:尧曰：谁可顺此事？
#actclear:yao_shoushi_act
#show:qingyue:tease:float
「呐，帝尧敬授民时的原文，你记全了吗？来，把这些竹简缀回去——羲和四子的名字，春夏秋冬的星象，都在里头哦。」 #speaker:青月
#minigame:bamboo:1:5:5
{ mg_result == "win":
	#show:qingyue:smile:float
	「{mg_score} 分，竹简归序，羲和四子、春夏秋冬，你都记下了。」 #speaker:青月
- else:
	#show:qingyue:sigh:float
	「简序暂乱也无妨，敬授民时的道理，你心里已经明白了。」 #speaker:青月
} #speaker:青月
「呼——你走完了他治世的这一程。下一程，是把这天下托给谁。可那，又是另一个故事咯。」 #speaker:青月 #impact:impact_shoushi_lifa #ending:canon #quiz:quiz_shoushi_runyue
#hide:xihe
-> END

// ═══ 探索节点 · 敬授民时 ═══

=== c_explore_pose_self ===
#bg:yao_court
#bgm:court
#show:qingyue:calm:float
你退入内殿，屏退左右，独坐沉思。 #speaker:青月
「天下这把椅子，富贵到了极处——可史书上的尧，坐了七十年，越坐越小心。」 #speaker:青月
你想起了黄帝——他打了一辈子仗，最后还要巡行四方、死在路上。你想起了颛顼——他静渊有谋，从不因天下已定就松一口气。 #speaker:青月
#show:qingyue:tease:float
「呐，修身齐家治国平天下——头一步，是修身。你自己都坐不稳，谈什么安天下？」 #speaker:青月

* #correct [问：修身，具体修什么？]
	#show:qingyue:calm:float
	「修的是那颗不敢骄、不敢松的心。富，最容易让人忘形；贵，最容易让人懈怠。尧的办法是——越富越省，越贵越谨。」 #speaker:青月
	「你看他：穿着朴素的黄冠玄衣，坐的是普通的堂，吃的是粗粮。不是装样子，是真不敢忘本。」 #speaker:青月
	-> c_pose
* #correct [问：齐家，从哪里着手？]
	#show:qingyue:smile:float
	「从九族开始。尧先让自家人亲睦——九族不睦，百官凭什么服你？百姓凭什么学你？」 #speaker:青月
	「他不是靠威严压住族人，是靠德行。九族看他的样子，自己就正了。这就叫『能明驯德，以亲九族』。」 #speaker:青月
	-> c_pose
* #correct [想清楚了，回去面对群臣]
	-> c_pose

=== c_explore_shoushi_stars ===
#show:xihe:calm:center
#show:qingyue:calm:float
你召来羲氏、和氏两族的长者，问得仔细：「观天象——具体怎么观？看什么？看多久？」 #speaker:尧
羲仲长揖答道：「回陛下：观的是日影长短、星辰位置。日出日落，日中星象，各有定时。可这些，不是一天两天能看出来的——要经年累月，年年对照，才知道天行的规律。」 #speaker:羲仲
#show:qingyue:tease:float
「你看——观天象不是抬头看一眼就完了。是几十年如一日地盯着天，记下来，比对，才敢说一句『今年该何时下种』。」 #speaker:青月
「这一份耐心，正是尧了不起的地方。他宁肯等，也不肯拍脑袋。」 #speaker:青月

* #correct [问：要观多少年，才敢颁历？]
	#show:qingyue:calm:float
	「羲仲说：『至少一轮——日影长短四年一小复，星辰移转一年一复。要看满四年，才敢定春分秋分；要看满十二年，才敢说闰月该搁在哪个月。』」 #speaker:青月
	「十二年，才敢颁一部历。你想想，这份慎重——差一天，天下就多种错一季。」 #speaker:青月
	-> c_shoushi
* #correct [问：没有历法之前，百姓怎么种地？]
	#show:qingyue:worry:float
	「羲仲叹气：『各凭经验。有看桃花开的，有听虫鸣的——可暖冬会骗桃花，晚寒会骗虫子。十家里有三家种错时令，年年都有人饿肚子。』」 #speaker:青月
	「这就是为什么要『数法日月星辰』——草木鸟兽会骗人，日月星辰不会。把农时钉在天上，才是万古通用的尺。」 #speaker:青月
	-> c_shoushi
* #correct [明白了，回去决断]
	-> c_shoushi

=== c_explore_sifang_leap ===
#bg:yanggu_sun
#bgm:epic
#show:qingyue:calm:float
你叫住正要领命而去的羲和，问了最后一个问题：「闰月——究竟怎么设？多久一闰？」 #speaker:尧
羲和两族长者对视一眼，答道：「一岁三百六十六日有零。余下的零头，攒三年约满一月，故三年一闰；再攒两年，又约满一月，故五年再闰。十九年七闰，历与天行方能严丝合缝。」 #speaker:羲仲
#show:qingyue:tease:float
「你看——舍掉那点零头，一年两年看不出差。可十年、百年攒下来，冬至就滑进春天了。闰月，就是替历法还那点欠天道的债。」 #speaker:青月

* #correct [问：百姓能看懂闰月吗？]
	#show:qingyue:calm:float
	「羲仲说：『不必懂为什么闰——只要知道哪个月是闰月，该种的时候种、该收的时候收就行了。天上的事天子替他们算好，地上的事他们只管做。』」 #speaker:青月
	「这就是『敬授民时』的『授』字——天时是天子的责任，种地是百姓的本分。各司其职，天下才转得起来。」 #speaker:青月
	-> c_sifang_full
* #correct [问：不设闰月，会怎样？]
	#show:qingyue:worry:float
	「青月说：『一年差五天，十年差五十天。你颁的历说春天到了，可天上的星还没到——百姓依历下种，地还冻着，种子全烂了。』」 #speaker:青月
	「差之毫厘，谬以千里。那点零头看着小，可是要命的东西。所以尧宁可让历法复杂一点——多一个闰月——也不肯让它错一分。」 #speaker:青月
	-> c_sifang_full
* #correct [明白了，回去决断]
	-> c_sifang_full

// ═══ IF线 · 物候（自由模式歧路：以物候代观象授时）═══

=== if_wuhou_1 ===
#hide:xihe
#bg:yanggu_sun
#bgm:solemn
#show:qingyue:worry:float
「不看天，只看草木鸟兽……这一步，史书上没走过哦。」 #speaker:青月
你不设羲和观星，只教民看物候：桃李开花便耕，寒蝉一鸣便收，燕来燕去，各有其时。 #speaker:青月
#show:qingyue:calm:float
「这法子，亲切得很。农人抬头就懂，用不着看什么星象。头几年，田里也确实没误过农时。」 #speaker:青月
可物候是会骗人的。暖冬里桃花早开了半月，农人依信下种，一场倒春寒，禾苗尽枯。 #speaker:青月
#show:qingyue:sad:float
「草木鸟兽应的是当年的寒暖，年年不同；日月星辰走的是万古的定数，年年如一。」 #speaker:青月
「你把天下的农时，系在了一朵会被暖风骗开的桃花上。」 #speaker:青月
东边桃花早、西边桃花迟，各地物候不齐，你也就再没有一部能颁行天下的『统一之时』。 #speaker:青月
#show:qingyue:solemn:float
「史书里的尧，是『敬顺昊天，数法日月星辰』——把农时钉在了天上，才敢授给万民。」 #speaker:青月
「你这一部物候之历，贴心，却不牢。丰年靠天恩，歉年赖运气——授时最怕的，就是这『不定』二字呀。」 #speaker:青月
你是个体恤农人的好天子，只是没能替天下立下那把万古通用的时之尺。你的仁，够暖一时；你缺的那点『法天』，才是能传世的东西。 #ending:if_wuhou #speaker:青月
-> END

// ═══ IF线 · 秘历（自由模式歧路：历成而秘不示民）═══

=== if_mili_1 ===
#bg:yao_court
#bgm:solemn
#show:qingyue:worry:float
「把历法藏起来，当作通天的独秘……这一步，也是史书没写的哦。」 #speaker:青月
你的历成了，精准无比。可你没有『敬授民时』，反把它锁进明堂——只有天子知道何时该种、何时该收，万民只许听令，不许问缘由。 #speaker:青月
#show:qingyue:calm:float
「你想的是：天时是天子通天的凭证。民不知历，才越发敬你如神。」 #speaker:青月
起先，四方果然对你顶礼膜拜——你说何时下种便下种，说何时收藏便收藏，仿佛你真能号令四季。 #speaker:青月
#show:qingyue:sad:float
「可万民不懂历，就永远离不开你。你一日不发令，他们一日不敢动锄头。」 #speaker:青月
天下之大，你的令传到东海之滨，早误了农时；使者一慢、一错，一方就绝收。你把天时攥成了权柄，也攥成了枷锁。 #speaker:青月
#show:qingyue:solemn:float
「『敬授民时』四个字，重点在『授』——是把时交还给天，再由天交给万民，让他们自己会看、会算。」 #speaker:青月
「你把它藏了起来。神权是立住了，可万民从此不是『知时而作』，是『候命而作』。」 #speaker:青月
你成了一个被顶礼膜拜的天时之神，却不再是那个『其仁如天』的尧。授时是为了让人不必求你，你却让人从此离不开你——这份威，正是仁的反面。 #ending:if_mili #speaker:青月
-> END
