// ═══════════════════════════════════════════════
// 夏桀 · 荒暴亡国
// 史源：《史记·夏本纪》
// ═══════════════════════════════════════════════

-> c_open

=== c_open ===
#bg:xia_terrace
#bgm:sinister
#show:qingyue:tease:float
「欸嘿——你来了呀。这一回，你可站在了一个火山口上哦。」 #speaker:青月
#show:jie:calm:center
「你是桀，夏后氏的末代帝君。你的曾祖父是治水的禹，你父亲是灭有扈氏的启。」 #speaker:青月
「夏传了四百多年，到你这，已是天命日薄……可你偏偏不这么看。」 #speaker:青月
#show:qingyue:worry:float
「你可知道，夏为什么到了你手上就亡了？」 #speaker:青月

* [「夏运方兴，朕承天命，何亡之有？天下人不过不识天命罢了。」]
	-> c_zhengshi
* [「朕是天子，天下莫非王土。亡不亡，朕说了算。」]
	-> c_zhengshi
* [「你说的这些，朕都知道。可朕不在乎。」]
	-> c_zhengshi

=== c_zhengshi ===
#show:jie:calm:center
夏台之上，你是天子。天下万里，皆在你一人握中。 #speaker:青月
宫室华丽，酒池肉林。妺喜笑时，你觉得天下最美好的事情不过如此——有权，有酒，有美人。 #speaker:青月
#show:qingyue:solemn:float
可天下不是你一个人的天下。你的子民在田里累死，你的诸侯在朝堂寒心，你的疆域在一点点被东方一个叫商的部族蚕食。 #speaker:青月
#show:qingyue:worry:float
「而这些，你看不见——或者说，你不肯看见。」 #speaker:青月
-> c_tangxing

=== c_tangxing ===
#bg:tang_realm
#bgm:solemn
#hide:jie
#show:tang:calm:center
东方，有一个小国，叫商。商的国君，叫汤。 #speaker:青月 #hint:汤始居亳，从先王居，作帝诰。
汤不是一个野心家。他只是一个认真做事的人——修德、行仁、来远人。 #speaker:青月 #hint:汤修德，诸侯皆归汤。
#show:qingyue:smile:float
「商是一个很小很小的国，小到在地图上都不起眼。可汤这个人，做了一件很了不起的事——他让所有人都想跟着他走。」 #speaker:青月
「你怎么看这个对手？」 #speaker:青月

* #correct #hint:桀不察，不防——正是『不察』二字，让商从一个蕞尔小国长成了他的掘墓人。 [一个小国，翻不了天。先处理朝中的政务吧]
	#hide:tang
	-> c_huangbao
* [「一个蕞尔小邦，还敢在朕眼皮底下做人情？叫他来朝，当面磕头。」]
	#hide:tang
	-> c_death_ao
* [「修德？呵——在朕的天下修德，那是收买人心。」你觉得他在收买人心，应当加税示警]
	#hide:tang
	-> if_jinggao_1

=== if_jinggao_1 ===
#bg:tang_realm
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有出兵，而是选择了加税示警。你对诸侯说：商在收买人心，凡与商通好者，岁贡加倍。 #speaker:桀
你用的是权力的刀——谁靠近商，谁就付出代价。 #speaker:青月
#show:qingyue:solemn:float
这招，确实吓住了一些墙头草。可被吓住的人，不是服你，是怕你。怕你的人，一旦有了不怕的理由，就会第一个离开你。 #speaker:青月
#show:qingyue:sad:float
「史上的桀不察——不是他不会用权，是他根本没把商放在眼里。他不察，所以商有四百年的时间，从一个蕞尔小国，长成了夏的掘墓人。」 #speaker:青月
「你比史上的桀多了几分警觉，可你用的方式，只是让害怕你的人更怕、让想走的人走得更远。」 #speaker:青月
你用权力的刀守住了几年太平，可商在暗处积蓄，诸侯在怕中等待。夏的末路，只是被你稍稍推迟了一些。 #ending:if_jinggao #speaker:青月
-> END

=== c_huangbao ===
#bg:xia_terrace
#bgm:court
你不以为意，继续在夏台之上享乐。你觉得这天下，是禹打下来的、启坐上去的，到你桀手里，绝不会丢。 #speaker:青月
可日子一天天过去，你的政令越来越没人听。你征的税越来越重，来的粮却越来越少；你派的官越来越多，管的事却越来越烂。 #speaker:青月
#show:qingyue:worry:float
「你不察——你不看，不想，不问。」 #speaker:青月
「天下人在饿肚子，你在看妺喜跳舞。诸侯在商量出路，你在造酒池肉林。」 #speaker:青月
「而你最不怕的一样东西——恰恰就是『人心』。」 #speaker:青月
-> c_chaos

=== c_death_ao ===
#bg:xia_terrace
#bgm:court
你下诏召汤入朝。使者到了商，汤恭恭敬敬地来了——带着贡品，带着笑容，带着你想象不到的底气。 #speaker:青月
汤跪拜，口称臣。你居高临下，满意地笑了：「算他识相。」 #speaker:青月
可你不知道的是：汤回商之后，做的第一件事不是继续装乖，而是召集伊尹、仲虺，把你的国力、你的虚实、你朝堂上的每一个人，都摸了一遍。 #speaker:青月
你的傲慢，让商看清了你全部的底牌。你招他来，是给他递了一份情报。 #death:ao #speaker:青月
-> END

=== c_chaos ===
#bg:zhuhou_luan
#bgm:danger
终于，天下大乱。东方诸侯纷纷归商，西面的方国也蠢蠢欲动。 #speaker:青月 #hint:诸侯叛桀，多归商。
#show:jie:calm:center
你的朝堂上，大臣们已经不敢说话了——说真话的人，都进了你的地牢。 #speaker:青月
关龙逄是最后一个敢直谏的大臣。他跪在夏台之下，仰头看你。 #speaker:青月 #hint:关龙逄谏。
#show:qingyue:solemn:float
「他说了什么呢？他说——天子当修德安民，不可荒淫失道。天下非一人之天下，乃天下人之天下。」 #speaker:青月
「你怎么处置他？」 #speaker:青月

* #correct #hint:桀杀关龙逄——不听直谏，杀之。这是最后一位敢言的大臣，杀了他，再无人敢谏。 [你大怒：「朕的天下，朕说了算。」你杀了关龙逄。]
	-> c_death_shatang
* [「你说得对。可你说得太晚了。」你没有杀他，但也没有听——只是沉默]
	-> c_death_silent
* [你把关龙逄打了一顿，赶了出去。既没杀，也没听]
	-> c_death_exile

=== c_death_shatang ===
#bg:xia_terrace
#bgm:court
你杀了关龙逄。这是最后一个敢对你直言的大臣。从此，夏台之上，再无人敢说一个不字。 #speaker:青月
#hide:jie
可不说，不代表不想。不说，只是把沉默攒成了怨恨，把怨恨酿成了倒戈。 #speaker:青月
#show:qingyue:sad:float
「你杀了最后一个敢说话的人，也就杀掉了夏最后的自救机会。」 #speaker:青月
「而你的对手商汤，正在一步步收拾天下人心。」 #speaker:青月
-> c_death_shatang_2

=== c_death_shatang_2 ===
#bg:mingtiao_war
#bgm:danger
#show:tang:firm:center
鸣条之战。商汤率诸侯之师，在鸣条之野与你决战。 #speaker:青月 #hint:汤遂伐桀。桀走鸣条，遂放而死。
#show:jie:despair:center
你的军队在阵前一触即溃。不是兵不精，不是将不勇——是他们根本不想为你打。 #speaker:青月
#show:qingyue:worry:float
「你没有看见吗？你的士兵扔了兵器，你的将领调转了方向，你的战旗倒在了鸣条的黄土里。」 #speaker:青月
你逃了。逃到南巢，被放逐。 #speaker:青月 #hint:桀走鸣条，遂放而死。
#hide:tang
#hide:jie
#bg:nanchao_exile
#bgm:death
#show:jie:despair:center
南巢的荒野里，你坐在一块石头上。身后是逃不掉的流放，身前是走不完的荒路。 #speaker:青月
#show:qingyue:solemn:float
「你终于看见了吗？——不是商灭了夏，是你自己灭了夏。」 #speaker:青月
「四百年的基业，毁在了你一个人的傲慢里。关龙逄的话，你一个字都没听进去。」 #speaker:青月
#show:qingyue:calm:float
「天下从来不是一个人的天下。你不把人心当回事，人心就把你丢掉。」 #speaker:青月
你死在了南巢。夏后氏，亡。 #speaker:青月 #hint:桀谓人曰：吾悔不遂杀汤于夏台。 #death:shatang #speaker:青月
#hide:jie
-> END

=== c_death_silent ===
#bg:xia_terrace
#bgm:court
你没有杀关龙逄，但也没有听。你沉默着，像一尊石像。 #speaker:青月
#show:qingyue:sad:float
关龙逄看着你的沉默，长叹一声，退了出去。他知道，这个王朝，已经药石无医了。 #speaker:青月
沉默，有时候比杀戮更可怕。杀，至少说明你还愤怒、还在意；沉默，说明你已经彻底不在乎了。 #speaker:青月
#hide:jie
你不杀谏臣，也不改荒政。天下人等着你的转身，你却只是一动不动地站在原地，看着夏在你的脚下一寸寸塌下去。 #death:silent #speaker:青月
-> END

=== c_death_exile ===
#bg:xia_terrace
#bgm:court
你把关龙逄打了出去。你既不杀他，也不听他——你只是不想再听人烦你。 #speaker:青月
关龙逄带着一身伤退了。朝堂上，大臣们看到了：直谏的代价，是一道鞭子。虽不至于死，但谁还想再来？ #speaker:青月
#show:qingyue:worry:float
你用一道鞭子，把所有人的嘴都封了——比杀还轻，比杀还让人生畏。 #speaker:青月
#hide:jie
不杀而辱，让他们活着，却不敢说话。你的夏台安静了，安静得像一座坟墓。鸣条之战时，你的军队已经不知道为什么而战了。 #death:exile #speaker:青月
-> END

=== c_mingtiao ===
#bg:mingtiao_war
#bgm:danger
#show:jie:despair:center
鸣条之战到了。商汤率诸侯之师，与你决战。 #speaker:青月
#show:tang:firm:center
战鼓擂响。你站在战车上，第一次发现——你的军队，不再听从号令。 #speaker:青月
#show:qingyue:solemn:float
「倒戈了。你的前军先倒的。然后是中军，然后是后军——像多米诺骨牌一样，一排排向商汤的方向跪了下去。」 #speaker:青月
#show:jie:despair:center
你看着这一切，终于明白了一件事： #speaker:桀
「吾悔不遂杀汤于夏台……」 #speaker:桀 #hint:桀谓人曰：吾悔不遂杀汤于夏台。
#show:qingyue:worry:float
「他悔的，不是荒淫，不是暴政——是当初没把商汤杀掉。」 #speaker:青月
「到死，他都没明白：杀死一个汤，还会有下一个汤。天下人走了，你杀谁都没用。」 #speaker:青月
#hide:tang
#hide:jie
你败走鸣条，放逐南巢。夏后氏四百余年，亡于你手。 #speaker:青月 #hint:桀走鸣条，遂放而死。

#bg:nanchao_exile
#bgm:death
#show:qingyue:calm:float
「四百年。从禹治水到你荒暴，夏用了整整四百年来走到这一步。」 #speaker:青月
「你站在南巢的荒野里，看着身后的废墟——那废墟里，有你曾祖父治过的水、有你祖父打过的仗、有你父亲立过的规矩。」 #speaker:青月
#show:qingyue:sad:float
「全没了。不是一朝一夕没的——是一寸一寸，被傲慢吃掉的。」 #speaker:青月
#show:qingyue:smile:float
「呼——你走完了桀的这一程。最后想问你一个问题：如果你早知道结局，你还会不会说那句『朕不在乎』？」 #speaker:青月 #ending:canon #impact:impact_wangguo_shangde #quiz:quiz_wangguo_shangde
-> END

=== c_end_wangguo ===
#bg:nanchao_exile
#bgm:solemn
#show:jie:despair:center
南巢。荒野之中，你孤独地坐在一方巨石上。身后是万里流亡路，前方是无尽的荆棘。 #speaker:青月
#show:qingyue:solemn:float
夏后氏亡了。四百年的王朝，到你这最后一任天子——轰然崩塌。 #speaker:青月
「你知道吗？桀被放逐到南巢之后，据说说过一句话——」 #speaker:青月
「『吾悔不遂杀汤于夏台。』」 #speaker:青月 #hint:桀谓人曰：吾悔不遂杀汤于夏台。
#show:qingyue:worry:float
「他后悔的，不是自己荒淫，不是自己暴政——是当初没把汤杀掉。」 #speaker:青月
「到死都没明白：杀一个汤，还会有下一个汤。问题从来不在汤，在他自己。」 #speaker:青月
#show:qingyue:calm:float
「四百年基业，毁于一旦。从禹到你，十四世、十七王，每一世都在添砖加瓦——你却用一世，把墙推倒了。」 #speaker:青月
#show:qingyue:smile:float
「天命从来不是谁天生就有的——它是每一个天子每一天都要去挣的东西。你父亲挣了一辈子，你却连一天都不想挣。」 #speaker:青月 #ending:canon
#hide:jie
-> END
