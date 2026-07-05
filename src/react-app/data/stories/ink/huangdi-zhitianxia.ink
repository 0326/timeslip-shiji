// ═══════════════════════════════════════════════
// 黄帝 · 垂衣治天下 · 巡行安民
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR wise = true

-> c_open

=== c_open ===
#bg:xuanyuan_court
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又飘来一缕魂啦！这一回可要坐得再稳些。」 #speaker:青月
「阪泉三战胜了炎帝，涿鹿一役诛了蚩尤——两战定天下，诸侯把你捧上了共主之位。你，是轩辕黄帝。」 #speaker:青月
你睁开眼。甲胄未卸，血腥气还未散尽，帐外万国的旌旗猎猎作响，所有人都在等你一句话。 #speaker:青月
#show:qingyue:worry:float
「打天下靠刀兵，治天下……可就是另一桩买卖了。」 #speaker:青月
「呐，划重点——刀能让人怕你，却不能让人服你。往下每一步，都在写你是暴主，还是圣王。」 #speaker:青月
-> c_roam

=== c_roam ===
#show:qingyue:default:float
战事既平，天下初定。诸侯散归，万国观望——他们臣服的，究竟是你的德，还是你的兵？
一位老臣伏地进言：「蚩尤已诛，四海震恐。君上何不安居涿鹿，享这天下贡奉，令诸侯岁岁来朝？」 #speaker:老臣
#show:qingyue:tease:float
「唔——高坐深宫，坐等人来拜。听着，是挺舒坦的呀。」 #speaker:青月
「可你猜，那些远在东海、空桐、江湘的邦国，看得见你的德么？」 #speaker:青月

* #correct #hint:东至于海，登丸山，及岱宗……北逐荤粥，合符釜山——足迹遍四方，德才服万国。 [不受深宫之奉，亲巡四方，合符诸侯]
	~ wise = true
	-> c_roam_good
* [依老臣之言，安居涿鹿，坐受四方朝贡]
	~ wise = false
	-> c_indulge

=== c_indulge ===
#bg:xuanyuan_court
你自居深宫，日日受贡，绝迹于四野。远方诸国久不见天子之德，只闻天子之威，渐生离心。荤粥复扰北疆，江海之邦观望不朝，昔日合符的诸侯，一个个称疾不至。
你以刀兵得的天下，也终将只用刀兵去守——而刀兵，守不住人心。天子之名，就这样从你身上一点点褪去了。 #death:indulge #speaker:青月
-> END

=== c_roam_good ===
#bg:taishan_peak
#bgm:solemn
#show:qingyue:smile:float
「欸——走对啦！德这东西，是要走出去、让人看见的。」 #speaker:青月
你东至大海，登丸山、上泰山；西抵空桐，登鸡头之巅；南临长江，登熊山、湘山；北逐荤粥，于釜山与诸侯合验符契。 #speaker:青月 #hint:东至于海，登丸山，及岱宗。西至于空桐，登鸡头。南至于江，登熊、湘。北逐荤粥，合符釜山。
你迁徙往来，居无常处，以行军之营为守卫。你的足迹到哪里，天子的德威就到哪里。 #speaker:青月 #hint:迁徙往来无常处，以师兵为营卫。
#show:qingyue:default:float
「万国都来了，山川封禅的大典，参加的多得数不过来。可打江山易，理江山难——这么大个天下，光靠你一个人，管得过来吗？」 #speaker:青月
-> c_appoint

=== c_appoint ===
#show:qingyue:worry:float
政务如山，万国待治。你独坐案前，一人之力，终究照不到四海每一个角落。
一名近侍低声道：「大权最好独揽，君上事必躬亲，方无旁落之忧。贤名再高的外人，也信不得。」 #speaker:近侍
#show:qingyue:tease:float
「哼哼——事事亲力亲为，听着勤政，可一个人能有几双眼、几双手呀？」 #speaker:青月
「圣王治天下，靠的从来不是一个人拼命。」 #speaker:青月

* #correct #hint:置左右大监，监于万国。举风后、力牧、常先、大鸿以治民。 [设左右大监监察万国，举风后、力牧、常先、大鸿以治民]
	~ wise = true
	-> c_appoint_good
* [大权独揽，事必躬亲，只信身边亲信]
	~ wise = false
	-> c_appoint_solo

=== c_appoint_solo ===
你摒退贤才，独揽万机，凡事亲决。可四海之大、万国之众，一人之目终难周览，一人之力终难遍及。近臣壅蔽视听，远方之政日渐荒疏。
你还没来得及垂衣而治，就先把自己困死在了案牍之间——这不是治天下的样子。
（你退回上一步，换一种治法。）
-> c_appoint

=== c_appoint_good ===
#bg:xuanyuan_court
#show:qingyue:smile:float
「欸——漂亮！这才是共主的气象。」 #speaker:青月
你设置左右大监，分察万国；举风后、力牧、常先、大鸿四位贤臣，各司其职以治民。百官皆以「云」命名，军队号为「云师」。 #speaker:青月 #hint:官名皆以云命，为云师。置左右大监，监于万国。举风后、力牧、常先、大鸿以治民。
万国和顺，你又获得宝鼎，观象授时，推算节令时日。 #speaker:青月 #hint:获宝鼎，迎日推策。
#show:qingyue:default:float
「贤人在位，万国和睦。可治天下最深的一层，还不在人事——在天时。」 #speaker:青月
-> c_tianshi

=== c_tianshi ===
#show:qingyue:worry:float
新岁将临，播种在即。农人仰头看你——何时下种，何时兴役，皆听天子号令。
可你雄心正盛，欲趁四海慑服之威，大兴土木、广发徭役，以彰天子之功。 #speaker:青月
一位史官叩首谏道：「君上，农时不可夺。逆天时而兴大役，百谷不登，民力必竭啊。」 #speaker:史官
#show:qingyue:solemn:float
「呐——这一步最要命。是顺着天走，还是逆着天走？」 #speaker:青月

* #correct #hint:顺天地之纪，幽明之占……时播百谷草木，淳化鸟兽虫蛾。 [顺天地之纪，按时令播百谷、化鸟兽，不夺农时]
	~ wise = true
	-> c_tianshi_good
* [恃威逆天，罢农兴役，大营土木以显功]
	~ wise = false
	-> c_defy

=== c_defy ===
#bg:xuanyuan_court
#bgm:danger
你恃兵威而逆天时，尽发民力大兴土木，夺了农人的播种之期。这一年，百谷不登，草木不生，鸟兽昆虫皆失其序。饥馑遍野，民力枯竭，怨声四起。
你能诛蚩尤、逐荤粥，却敌不过一个「逆天时」——天地的法则，比任何刀兵都硬。以土德受命的黄帝之号，你终究没能担起。 #death:defy #speaker:青月
-> END

=== c_tianshi_good ===
#bg:taishan_peak
#bgm:solemn
#show:qingyue:smile:float
「呼——顺天者昌。你听懂了天在说什么。」 #speaker:青月
你顺应天地之纪、阴阳之占，奉养生送死之制，究存亡治乱之理。按时令播种百谷草木，驯化鸟兽虫蛾。 #speaker:青月 #hint:顺天地之纪，幽明之占，死生之说，存亡之难。时播百谷草木，淳化鸟兽虫蛾。
你广察日月星辰之行、水波土石金玉之状，劳心力、勤耳目，节用水火材物，不妄取于天地。 #speaker:青月 #hint:旁罗日月星辰，水波土石金玉，劳勤心力耳目，节用水火材物。
-> c_end_sage

=== c_end_sage ===
#bg:xuanyuan_court
#bgm:solemn
#achieve:huangdi_tude
#show:qingyue:solemn:float
「……你看，你没有再动一次刀。」 #speaker:青月
「巡四方以服万国，举贤能以治百姓，顺天时以养万民，节用度以惜物力——这才是垂衣而治呀。」 #speaker:青月
你享有土德的祥瑞——土为中央之色，故天下号你为「黄帝」。 #speaker:青月 #hint:有土德之瑞，故号黄帝。
#show:qingyue:smile:float
「打天下的是刀，治天下的是德。你终于把这两样，都活明白了。」 #speaker:青月
-> c_lineage

=== c_lineage ===
#show:qingyue:default:float
「欸，临走前，我再替你把这一脉往后接一接——你的故事，其实才刚开个头呢。」 #speaker:青月
你居于轩辕之丘，娶西陵氏之女嫘祖为正妃。她相传是教人养蚕缫丝的那一位。 #speaker:青月 #hint:黄帝居轩辕之丘，而娶于西陵之女，是为嫘祖。
嫘祖为你生下两子：一曰玄嚣，降居江水；一曰昌意，降居若水。他们的后代，都将据有天下。 #speaker:青月 #hint:嫘祖为黄帝正妃，生二子，其后皆有天下。
#show:qingyue:solemn:float
「昌意娶蜀山氏之女，生下高阳。日后你崩葬桥山，继你而立的，正是这个有圣德的孙儿——帝颛顼。」 #speaker:青月 #hint:昌意娶蜀山氏女……生高阳，高阳有圣德焉。
#show:qingyue:smile:float
「呼——你走完了黄帝这一程。下一世，我们去看高阳如何『依鬼神以制义』，好不好呀？」 #speaker:青月
-> END
