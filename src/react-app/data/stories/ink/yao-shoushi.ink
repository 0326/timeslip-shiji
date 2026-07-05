// ═══════════════════════════════════════════════
// 帝尧 · 敬授民时 · 命羲和定历
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR virtue = true

-> c_open

=== c_open ===
#bg:yao_court
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一缕魂飘到我这儿啦！这一回可不得了哦。」 #speaker:青月
「你要变的人，是放勋，世人唤作尧。天下最早的那位明君，德配上天的那一个。」 #speaker:青月
你睁开眼。平阳的宫庭里，你头戴黄冠，身着玄衣，阶下红车白马。没有刀兵，没有杀机——只有一整个天下，在等你把它安顿好。 #speaker:青月
#show:qingyue:solemn:float
「他们说你——『其仁如天，其知如神。就之如日，望之如云。』人追着你，像追着太阳呐。」 #speaker:青月 #hint:其仁如天，其知如神。就之如日，望之如云。
#show:qingyue:tease:float
「可你现在富有四海、贵为天子……唔，这么一个人，最先会栽在哪儿呢？」 #speaker:青月
-> c_pose

=== c_pose ===
#show:yao:default:center
四方诸侯来朝，玉帛盈庭，颂声如潮。你端坐堂上，天下之大，尽在你一人俯仰之间。 #speaker:青月
#show:qingyue:worry:float
「呐，划重点——第一个坎，不是敌人，是你自己。这般富贵，最容易让人骄起来、松下来哦。」 #speaker:青月
「史书上的你，是怎么坐这把位子的呢？」 #speaker:青月

* #correct #hint:富而不骄，贵而不舒——越是至高，越要如临深渊。 [你敛容自持，富有天下却不敢骄纵，尊贵至极却不敢懈怠]
	~ virtue = true
	-> c_jiuzu
* [你受享这泼天的富贵，纵情安乐，天下既定，何必再自苦]
	~ virtue = false
	-> c_death_arrogance

=== c_death_arrogance ===
#bg:yao_court
你日渐骄纵，起居无度，政事推诿。你能明的德，先在自己身上暗了；九族先怨，百姓离心，万国不再来朝。那个「其仁如天」的尧，从此不是你了。 #death:arrogance #speaker:青月
-> END

=== c_jiuzu ===
#bg:yao_court
#show:qingyue:smile:float
「欸——稳住了！骄不得、松不得，这才是坐天下的样子。」 #speaker:青月
你先修己身，再由近及远：先使九族亲睦，九族既睦，再辨明百官职守；百官政绩昭著，又调和天下万国。 #speaker:青月 #hint:能明驯德，以亲九族。九族既睦，便章百姓。百姓昭明，合和万国。
#show:qingyue:tease:float
「家和了，官明了，国睦了……可有一样最要紧的东西，天下人还眼巴巴等着你给呢——你猜是什么？」 #speaker:青月
-> c_shoushi

=== c_shoushi ===
#show:xihe:default:center
你召来掌天时的羲氏、和氏两族。田野间，百姓抬头望天，不知何时该耕、何时该收——农时无准，一年就要乱。 #speaker:青月
#show:qingyue:solemn:float
「这就是你要给天下的东西——『时』。什么时候播种，什么时候收藏，都要你替万民定下来。」 #speaker:青月
「呐，这一步走岔了，田里颗粒无收，饿死的可是天下人。你要怎么给这个『时』？」 #speaker:青月

* #correct #hint:敬顺昊天，数法日月星辰——不是拍脑袋定，是抬头观天、循日月星辰之行而推。 [你命羲和恭顺上天，依日月星辰的行迹推算历法，慎重把农时颁授百姓]
	~ virtue = true
	-> c_sifang
* [你不必费这周折，凭你的圣心直接给天下定个死历，年年照此耕作便是]
	~ virtue = false
	-> c_death_luanli

=== c_death_luanli ===
#bg:yao_court
你废弃观象，凭一己臆断定下死历。天行有常，你的历却与之乖离——寒暑错位，春令行于秋，播种失期，禾稼尽枯。连岁大饥，饿殍遍野，天下人因你这一道乱历而困顿流离。 #death:luanli #speaker:青月
-> END

=== c_sifang ===
#bg:yanggu_sun
#bgm:solemn
#show:qingyue:smile:float
「对喽——观天，不是凭空。你把『时』交还给了天，再由天交给万民。」 #speaker:青月
你分遣羲和四人，各居一方、各司一时。可四方所居，四时所正，最是不能错半分——错了方位，四季便乱。 #speaker:青月
#show:qingyue:worry:float
「羲仲该去哪儿迎日出、定春分呢？你要亲口分派。选错方位，历就全错啦。」 #speaker:青月

* #correct #hint:分命羲仲，居郁夷，曰旸谷。日中，星鸟，以殷中春。 [命羲仲居东方旸谷，恭迎日出、劝课春耕，以昼夜平、鸟星见而定仲春]
	-> c_sifang_full
* [命羲仲远赴北方幽都，守着最长的黑夜去定春分]
	-> c_death_fangwei

=== c_death_fangwei ===
#bg:winter_dark
你把定春分的羲仲遣去了极北的幽都。那里日短夜长，昴星当昏——本是定仲冬之地。方位一错，四时全乱：该春不春，该冬不冬，民不知所耕，鸟兽失其时。授时之政，毁于一念之差。 #death:fangwei #speaker:青月
-> END

=== c_sifang_full ===
#bg:yanggu_sun
#show:qingyue:smile:float
「漂亮！东方旸谷迎日出，正是定春分的地方。」 #speaker:青月
你依次分派四方：羲叔居南交，日永星火，以正仲夏；和仲居西土昧谷，寅饯纳日，宵中星虚，以殷仲秋；和叔居北方幽都，日短星昴，以正仲冬。 #speaker:青月 #hint:羲叔居南交，日永星火，以正中夏；和仲居昧谷，夜中星虚，以正中秋；和叔居幽都，日短星昴，以正中冬。
#show:qingyue:solemn:float
「东西南北，春夏秋冬，一一各安其位。可你抬头看——天上的日月，走得并不一样齐哦。」 #speaker:青月
「一年，到底该是多少天？多出来、少下去的那点零头，你要怎么办？」 #speaker:青月

* #correct #hint:岁三百六十六日，以闰月正四时——多出的零头，用闰月补齐，四时才不会一年年错开。 [定一岁为三百六十六日，设置闰月来校正四季，使历与天行相合]
	~ virtue = true
	-> c_end_shengzhi
* [就依三百六十日整数为一年，那点零头，不必理会]
	~ virtue = false
	-> c_death_wurun

=== c_death_wurun ===
#bg:yao_court
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
「呼——你走完了他治世的这一程。下一程，是把这天下托给谁。可那，又是另一个故事咯。」 #speaker:青月
-> END
