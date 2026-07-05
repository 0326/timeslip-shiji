// ═══════════════════════════════════════════════
// 夏桀 · 亡国 · 鸣条之败（上古卷收官 · 亡国悲剧）
// 史源：《史记·夏本纪》
// ═══════════════════════════════════════════════

VAR dexin = false      // 是否务德恤民
VAR fangtang = false   // 囚汤后是否释而反省

-> c_open

=== c_open ===
#bg:xia_terrace
#bgm:solemn
#show:qingyue:default:float
「唔……这一缕魂，飘得比往常都沉。」 #speaker:青月
「这一回，你是履癸，天下唤你——夏桀。大禹的血脉，夏朝第十七代天子。四百年社稷，握在你手里。」 #speaker:青月
你睁开眼。玉阶之上，九鼎森然，禹的江山在你脚下铺开。孔甲以来，诸侯已渐渐离心，可你不在意——你自比天上的太阳，谁敢不从？
#show:qingyue:sad:float
「呐……我先跟你说句实话。这一世，我陪你走的，不是通关的路。」 #speaker:青月
「是一条……四百年夏祚，怎样在一个人手里，一步一步走到尽头的路。」 #speaker:青月
-> c_zhengshi

=== c_zhengshi ===
#bg:xia_terrace
诸侯的使者跪在阶下，说各地大旱，仓廪空竭，百姓易子而食。臣下伏地请你减征赋、开粮仓、修德以安天下。 #speaker:桀 #hint:桀不务德而武伤百姓，百姓弗堪。
你不耐烦地听着。城外正在为你造新的高台，动用了民夫无数——他们说这样太伤民力。
#show:qingyue:worry:float
「呐——划重点。这是你这一世的第一个岔口。」 #speaker:青月
「史书里的桀，选了『不务德』。可你……未必要跟他一样，对不对？」 #speaker:青月

* #correct #hint:史实——桀不务德而武伤百姓。此选忠于史书，却也踏上了亡国之路。 [「大旱与孤何干？台照造，赋照征——孤是太阳，岂能为蝼蚁折腰。」]
    -> c_zhengshi_shi
* #hint:这是史书未走的活路：若桀肯务德恤民，夏未必亡。 [撤了高台，开仓赈民，减征赋——你决意做个恤民的天子]
    ~ dexin = true
    -> c_zhengshi_de

=== c_zhengshi_de ===
#bg:xia_terrace
你下令停工、开仓、免赋。使者叩首而去，城外的哭声，渐渐平了下来。
#show:qingyue:sad:float
「……你看，只要肯松一松手，百姓就能喘一口气。」 #speaker:青月
「可你知道吗？史书里的桀，从没有这样选过。他是把这条路，亲手关上的人。」 #speaker:青月
「所以这一步，是你替他，走了他没走的活路。记住这个『能』字——它会让后面的沉重，更沉重。」 #speaker:青月
-> c_zhaotang

=== c_zhengshi_shi ===
#bg:xia_terrace
高台一日日垒高，赋税一日日加重。你听说远方有个叫汤的诸侯，在自己的封国里施仁政、活民无数，人心都往他那儿去。 #speaker:桀 #hint:自孔甲以来而诸侯多畔夏。
#show:qingyue:worry:float
「唔——你的百姓在流失，他的百姓在归附。此消彼长，你却只当是笑话。」 #speaker:青月
-> c_zhaotang

=== c_zhaotang ===
#bg:xia_terrace
#show:tang:calm:left
你终于按捺不住，把汤召来问罪。他立在阶下，不卑不亢，谈的却句句是养民、是天命、是失德者失天下。 #speaker:汤 #hint:乃召汤而囚之夏台。
你勃然大怒，命人将他囚入夏台。铁栏合上的那一刻，他回头看了你一眼——那眼神里没有惧，只有惋。
#show:qingyue:worry:float
「他现在就在你手里。杀他，一了百了；还是……」 #speaker:青月
「呐，别急着答。这一步，史书上桀也走了岔——他后来，悔断了肠。」 #speaker:青月

* #hint:史实是"囚而复释"。但若此刻起杀心、下毒手，你将背万世恶名——比史书的桀更早、更耻地败亡。 [趁夜遣人潜入夏台，将汤缢杀于狱中，绝了后患]
    -> c_death_shatang
* #correct #hint:史实——乃召汤而囚之夏台，已而释之。 [关他几日出出气，终究还是把他放了——你根本没把这诸侯放在眼里]
    -> c_shitang
* #hint:史书未走的活路：若桀囚汤时肯低头自省，历史或将改写。 [囚他之后，你彻夜难眠——他的话，字字都戳在你的失德上。你决意放他，并召他问策]
    ~ fangtang = true
    -> c_shitang_xing

=== c_shitang_xing ===
#bg:xia_terrace
#show:tang:calm:left
你亲自开了夏台的门，向汤请教治天下之道。他说：德者，民之所归；失德，则天命去之。你听得脊背发凉。 #speaker:汤
#show:qingyue:sad:float
「……你竟肯听。你竟肯，在最该发怒的地方，低下头。」 #speaker:青月
「可史书里的桀，只在这里学会了一件事——『悔不遂杀汤』。他悔的是没杀人，你悔的是没修德。」 #speaker:青月
「同一座夏台，两个桀。一个通向鸣条的败亡，一个……本可以不亡。」 #speaker:青月
-> c_tangxing

=== c_shitang ===
#bg:xia_terrace
#show:tang:calm:left
几日后，你挥挥手把汤放了——一个小小诸侯，何足挂齿。他躬身谢恩，退出夏台，眼里那点惋惜，你没看见。 #speaker:桀 #hint:乃召汤而囚之夏台，已而释之。
#show:qingyue:solemn:float
「……『已而释之。』这四个字，我亲眼看它发生过。」 #speaker:青月
「你放走的不是一个诸侯，是四百年夏祚的掘墓人。可此刻的你，浑然不觉。」 #speaker:青月
-> c_tangxing

=== c_tangxing ===
#bg:tang_realm
#bgm:danger
#show:tang:calm:center
汤回到封国，越发修德。他网开三面、祷雨罪己，天下诸侯望风而归，纷纷背夏投商。 #speaker:青月 #hint:汤修德，诸侯皆归汤。
探马频频来报：归汤的诸侯，一日多过一日。夏的旗帜，正在天下一面面倒下。
#show:qingyue:worry:float
「诸侯都跑了，只剩你这座孤台。汤的兵，快到了。」 #speaker:青月
「最后一个岔口——你要收敛，还是……要战？」 #speaker:青月

* #correct #hint:史实——汤遂率兵以伐夏桀，桀走鸣条。桀既不收敛，唯有一战而败。 [「区区商汤也敢犯上！点齐兵马，孤要在鸣条会一会他！」]
    -> c_mingtiao
* { dexin || fangtang } #hint:唯有前面选过务德或反省，此路才亮：知过能改，或可自保。 [你想起自己这一世的每一次心软——你决意退位让贤、亲赴汤营谢罪，只求存夏之祀]
    -> c_end_rangxian
* #hint:若你既未务德、又负隅顽抗到底，只会死得比史书更惨。 [闭城纵酒，命人斩尽言败的臣子，只当天命永远眷顾着你这轮"太阳"]
    -> c_death_juezhan

=== c_mingtiao ===
#bg:mingtiao_war
#bgm:danger
鸣条之野，你的军队一触即溃——他们早已不肯为一个伤他们的天子卖命。你仓皇北走，一路溃逃到南巢。 #speaker:青月 #hint:汤遂率兵以伐夏桀，桀走鸣条。
#show:tang:calm:center
汤兵追至。他放了你，没有杀你——他要"兴灭继绝"，连夏的后代都封到了杞国，独独放逐了你。 #speaker:青月 #hint:桀走鸣条，遂放而死。汤封夏之后，至周封于杞也。
-> c_end_wangguo

=== c_end_wangguo ===
#bg:nanchao_exile
#bgm:solemn
#show:qingyue:sad:float
南巢的荒草里，你一天天老去。你抓住路人的衣袖，喃喃地说着同一句话—— #speaker:桀
「吾悔不遂杀汤于夏台，使至此。」 #speaker:桀 #hint:桀谓人曰：吾悔不遂杀汤于夏台，使至此。
#show:qingyue:solemn:float
「……听见了吗？他到死，悔的都是『没杀成汤』。」 #speaker:青月
「他没悔过一次高台、一粒被夺走的粮、一个易子而食的百姓。这，才是夏为什么会亡。」 #speaker:青月
{ dexin || fangtang:
    #show:qingyue:sad:float
    「而你——你这一世，明明摸到过另一条路。你务过德、或肯低过头。」 #speaker:青月
    「所以你比谁都清楚：亡国从来不是天命，是一次次本可以不那样的选择，垒成的。」 #speaker:青月
}
禹卑宫室、致孝鬼神而兴夏；你不务德、武伤百姓而亡夏。一兴一亡，四百年，尽在这道玉阶的两端。 #speaker:青月 #hint:禹为姒姓……桀不务德而武伤百姓，百姓弗堪。
#show:qingyue:sad:float
「殷鉴不远，就在夏后之世呀。」 #speaker:青月
「……这一局，没有赢家，只有一声叹息。上古卷，到这里，收了。」 #speaker:青月
#achieve:xia_yinjian
-> END

=== c_end_rangxian ===
#bg:xia_terrace
#bgm:solemn
你解下冠冕，轻车简从，亲赴汤营。你不再自称太阳，只求汤存夏之祀、恤夏之民。汤动容，纳你之请。 #speaker:青月
#show:qingyue:sad:float
「……这一幕，史书里从来没有过。桀到死都在悔『没杀人』，而你，在悔『没修德』。」 #speaker:青月
「你替那个刚愎的桀，走完了他不肯走的最后一步：知过，能改。」 #speaker:青月
「可我得跟你说句实话——纵然如此，天命已移，夏终究要让给商了。有些错，早一步能救，晚了，就只剩体面地告别。」 #speaker:青月
禹以德兴，桀以德亡。你摸到了那把钥匙，只是……握得太晚了呀。 #speaker:青月 #hint:桀不务德而武伤百姓，百姓弗堪。
#show:qingyue:solemn:float
「殷鉴不远——愿后来者，都记得夏后之世这一声叹息。上古卷，收了。」 #speaker:青月
#achieve:xia_yinjian
-> END

=== c_death_shatang ===
狱中烛火摇曳，你亲手掐灭了那个"惋惜"的眼神。可汤一死，天下归商之心更炽——诸侯举兵，只为这桩暴行讨你。你连鸣条都没走到，便身死国灭，落个比史书更早、更耻的下场。 #death:shatang #speaker:青月
-> END

=== c_death_juezhan ===
你斩尽忠言，纵酒高台，把最后肯为你说话的人也杀光了。当汤兵破城，你身边一个人都没有——连溃逃到南巢、留一声悔叹的机会，都没有了。你死在自己造的高台之下，火光冲天。 #death:juezhan #speaker:青月
-> END
