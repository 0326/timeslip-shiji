// ═══════════════════════════════════════════════
// 夏禹 · 君臣论政 · 受禅即位
// 史源：《史记·夏本纪》
// ═══════════════════════════════════════════════

-> c_open

=== c_open ===
#bg:xia_court
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一位穿越客落到我这儿啦！这一回呀，可是个了不得的人。」 #speaker:青月
「你是禹。治水十三年，三过家门而不入的那个禹。水患平了，可你的故事……才刚要走到最难的地方。」 #speaker:青月
你睁开眼。玉墀之上，帝舜临朝。你与伯夷、皋陶列于阶前——舜请你们各陈其言。 #speaker:青月
#show:shun:solemn:center
#show:gaoyao:solemn:left
你身旁的皋陶，是执掌刑狱、以理民的士。他先开口了。 #speaker:青月
#show:qingyue:calm:float
「唔——听好了。接下来这几句，是上古政治的骨头。听懂了，你才配坐上那个位子。」 #speaker:青月
-> c_gaoyao

=== c_gaoyao ===
#show:gaoyao:solemn:left
「信其道德，谋明辅和。」皋陶陈其谋，声音不高，却字字如钉。 #speaker:皋陶 #hint:皋陶述其谋曰：信其道德，谋明辅和。
你拱手：「然，如何行之？」 #speaker:禹
「慎其身修，思长，敦序九族，众明高翼——由近及远，政清于此。」 #speaker:皋陶 #hint:慎其身修，思长，敦序九族，众明高翼，近可远在已。
#show:qingyue:smile:float
「呐，他讲的是修身、致远、亲族、举贤。你听着，别急——他还有更要紧的两个字没说呢。」 #speaker:青月
-> c_zhiren

=== c_zhiren ===
#show:gaoyao:solemn:left
「於！」皋陶顿了顿，「为政之要，在知人，在安民。」 #speaker:皋陶 #hint:在知人，在安民。
#show:qingyue:worry:float
「划重点！这八个字，几乎是上古政治的全部。」 #speaker:青月
「舜在看着你呢。皋陶把话递到你手上了——你要怎么接？接得好不好，天下都在听。」 #speaker:青月

* #correct #hint:知人则智能官人，能安民则惠黎民怀之——禹以此拜受昌言。 [「知人则智，能官人；能安民则惠，黎民怀之。能知能惠，何忧驩兜？」]
	-> c_jiude
* [「知人安民，说来轻巧。真要事事做到，怕是陛下也难为。何必自苦？」]
	-> c_qingdai
* [「知人难，安民更难。臣只信一样——治水那样，兴功役、通沟洫，让百姓有田有食，胜过千言德教。」]
	-> if_zhengong_1

=== if_zhengong_1 ===
#bg:xia_court
#bgm:court
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有推开皋陶，也没有接住他那八个字。你把话头引向了自己最擅长的那一路：兴功役。 #speaker:禹
「知人安民都靠虚言，臣只信功。」你说，「疏川、辟田、通沟洫——让人人有饭吃，自然就安了。」 #speaker:禹
#show:qingyue:solemn:float
舜没有拦你。你摄政之后，果然大兴功役：修九川、辟九泽、划田亩，一桩桩，都办成了。 #speaker:青月
#hide:gaoyao
百姓确实有了田、有了食。天下富庶，仓廪充实——单看事功，你比谁都能干。 #speaker:青月
#show:qingyue:sad:float
只是皋陶讲的那个『知人』，你始终没上心。官位凭功劳给，不凭德行选；佞人也会兴功，也就混了进来。 #speaker:青月
「你治得了水土，治得了田亩，就是没顺着他那八个字，去治人心。」 #speaker:青月
「你是个千古无双的能臣、一个把天下养肥了的君。可皋陶说的『安民』，不只是让人吃饱——是让人心里也服、也安。」 #speaker:青月
后世的夏，重功而轻德，你开的这个头，一直传了下去。 #ending:if_zhengong #speaker:青月
#hide:shun
-> END

=== c_qingdai ===
#bg:xia_court_cold
#bgm:dark
你把皋陶的谋略当成了高谈阔论，轻轻推了回去。你觉得治水尚且做成了，治人不过如此。
可你忘了——水无心，人有心。你不肯用心去知人、去安民，庶政便一寸寸从你指缝里漏走。
驩兜复起，三苗不服，佞人环伺。你有伐山导河的力气，却没有识人安民的眼。夏后之业，坏在了根上。 #death:disdain #speaker:青月
#hide:shun
#hide:gaoyao
-> END

=== c_jiude ===
#show:qingyue:smile:float
「欸——漂亮！你没有把担子推回去，反而接住了：知人是智，安民是惠。跟史上的禹，一个样！」 #speaker:青月
#show:gaoyao:solemn:left
皋陶眼中有光：「然，於！行有九德。」他一字一顿列举——
「宽而栗，柔而立，愿而共，治而敬，扰而毅，直而温，简而廉，刚而实，强而义。」 #speaker:皋陶 #hint:宽而栗，柔而立，愿而共，治而敬，扰而毅，直而温，简而廉，刚而实，强而义。
#show:qingyue:solemn:float
「听出来了吗？每一德，都是一对看似打架的品性，捏在一处。」 #speaker:青月
「宽厚又要严明，柔和又要能立，刚劲又要踏实……德，贵在中和，不走极端。这是中国最早的识人之尺。」 #speaker:青月

#hide:gaoyao
「日宣三德，可保有家；日严六德，可保有国。九德咸事，则俊乂在官，百吏肃谨。」皋陶收言，「吾言厎可行乎？」 #speaker:皋陶 #hint:翕受普施，九德咸事，俊乂在官，百吏肃谨。
#show:qingyue:tease:float
「他问你——我这番话，行得通吗？你怎么答？」 #speaker:青月

* #correct #hint:禹曰女言致可绩行——禹拜昌言而受之。 [你郑重拜谢：「女言致可绩行。」——这话，完全可以见效推行]
	-> c_chanwei
* [「九德听着好听。可乱世用重典，何必与人讲这些温良恭俭？刑名足矣。」]
	-> c_xingming

=== c_xingming ===
#bg:xia_court_cold
#bgm:dark
你把皋陶的九德当成了迂阔之谈，只信刑名威压。
可皋陶本就是执刑之官——他比谁都懂刑，却偏要先讲德。为何？因为刑能止恶，不能生善；能服人身，不能服人心。
你舍德而专刑，贤才不愿在你朝上立足，百官只知避祸不敢任事。你能镇住一时，镇不住人心。天下嘴上服你，心里离你。 #death:xingming #speaker:青月
#hide:shun
#hide:gaoyao
-> END

=== c_chanwei ===
#bg:xia_court
#bgm:solemn
#achieve:yu_shouchan_ren
你拜受皋陶的昌言。皋陶谦道：「余未有知，思赞道哉。」——他说自己并无智能，只想赞助治国之道罢了。 #speaker:青月 #hint:禹拜美言，曰：然。
#hide:gaoyao
#show:qingyue:smile:float
「看，这就是上古的君臣：一个言道，一个躬行。皋陶高谈德义，你埋头治水——两下互补，天下才治得起来。」 #speaker:青月
#show:qingyue:calm:float
后来，箫韶九成，凤皇来仪，百兽率舞，百官信谐。舜的德业大明，而你，是这盛世里最被倚重的股肱。 #speaker:青月 #hint：《萧韶》九成，凤皇来仪，百兽率舞，百官信谐。
「天下都崇仰你——昌明度数声乐，尊你为山川百神之主。」 #speaker:青月 #hint:天下皆宗禹之明度数声乐，为山川神主。
#show:qingyue:solemn:float
「于是，帝舜把你荐于天，立为继承人。」 #speaker:青月 #hint:帝舜荐禹于天，为嗣。
-> c_bengluo

=== c_bengluo ===
#bg:yangcheng
#bgm:solemn
#hide:shun
摄政十七年。这一年，帝舜崩了。 #speaker:青月 #hint:十七年而帝舜崩。
你为他服丧三年。三年丧毕，天下的目光，都落到了你身上。 #speaker:青月
#show:shangjun:calm:center
可舜有一个儿子，叫商均。 #speaker:青月
#show:qingyue:worry:float
「呐——最难的一步来了。你辅政十七年，威望、人心、天下事，都在你手里攥着。」 #speaker:青月
「那个位子，几乎就是你的了。可它，本该是天子之子的。你要怎么办？」 #speaker:青月

* #correct #hint:禹辞辟舜之子商均于阳城——正如当年舜避丹朱。这是禅让的固定之礼。 [你辞让避位，退居阳城，把天下让给舜之子商均]
	-> c_bienang
* [十七年心血、满朝人望都在你身上。你顺势即位——天命所归，何须假意推让?]
	-> c_lianwei
* [避位是真心，即位是被逼。诸侯来朝，你也不受——一让到底，把天下真正交给商均]
	-> if_zhenrang_1

=== if_zhenrang_1 ===
#bg:yangcheng
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你退居阳城，是真让。诸侯翻山越水来朝你，你一次次把他们请回商均那里去。 #speaker:禹
「天下是舜的天下，该归舜的儿子。」你闭门谢客，一让到底。 #speaker:禹
#show:shangjun:calm:center
诸侯拗不过你，只得转身去朝商均。可商均，终究是商均。 #speaker:青月
#show:qingyue:sad:float
他既无治水之能，又无知人之明。政令一天天松弛，你在阳城看着，却守着那个『让』字，不肯出手。 #speaker:青月
「你成全了禅让最干净的样子——真让，不是让了再受的那种让。」 #speaker:青月
「可史上的禹懂一件事：天命不在你想不想让，在人心归不归你。人心已经归了你，你再推，就是把天下推给了它扛不住的人。」 #speaker:青月
你守住了自己的高洁，天下却没能等来那个本该做天子的禹。夏，也许就不会有了。 #ending:if_zhenrang #speaker:青月
#hide:shangjun
-> END

=== c_lianwei ===
#bg:yangcheng
#bgm:peaceful
你不肯避位。你想：治水的是我，摄政的是我，人心归的是我，凭什么把天下让给一个乳臭未干的商均？
你以私废公，径直登了位。
可你忘了——当年舜避丹朱、尧择贤而授，禅让之所以为禅让，正在那一「让」字。天下人服的从不是你的权柄，而是你的德。你不让而取，便与篡夺无异。
诸侯心寒，口称臣，目已离。你坐上了那个位子，却坐不进人心里。夏后之基，从德转为力，也从这一步起，埋下了后世倾覆的种子。 #death:lianwei #speaker:青月
#hide:shangjun
#hide:shun
-> END

=== c_bienang ===
#bg:yangcheng
#bgm:solemn
#achieve:yu_shouchan_ren
你退居阳城，把天下让给了商均。你效的，是当年舜避丹朱的旧礼——推让而后受。 #speaker:青月 #hint:禹辞辟舜之子商均于阳城。
#show:shangjun:calm:center
可是……天下诸侯来朝觐的，一个也不往商均那里去。 #speaker:青月
#hide:shangjun
#show:yu:calm:center
他们翻山越水，都奔向了阳城，奔向了你。 #speaker:青月 #hint:天下诸侯皆去商均而朝禹。
#show:qingyue:solemn:float
「看见了吗？你越是让，天下越是归你。」 #speaker:青月
「这就是天命——不在血脉里，不在权势里，在人心的走向里。你避了位，反而证明了那位子非你莫属。」 #speaker:青月
于是，你不再推辞。你即了天子之位，南面而朝天下。 #speaker:青月 #hint:禹于是遂即天子位，南面朝天下。
#bg:xia_court
#bgm:court
#hide:yu
国号，曰夏后。姓，姒氏。 #speaker:青月 #hint:国号曰夏后，姓姒氏。
#show:qingyue:smile:float
「呼——你走完了禹的这一程。」 #speaker:青月
「从阶前拜受昌言的那个臣子，到南面而朝的天子——你靠的不是抢，是知人、是安民、是那一次次的『让』。」 #speaker:青月
#show:qingyue:calm:float
「看懂了吗？上古的天下，是让出来的。可惜呀……你之后，你的儿子启，会把这『让』字，改成『传』。那，又是另一个故事了。」 #speaker:青月 #impact:impact_shouchan_namian #ending:canon #quiz:quiz_shouchan_namian
-> END
