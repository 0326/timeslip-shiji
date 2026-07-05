// ═══════════════════════════════════════════════
// 夏禹 · 大禹治水 · 三过家门而不入
// 史源：《史记·夏本纪》
// ═══════════════════════════════════════════════

VAR method_dao = false     // 是否领悟「疏导」之法
VAR passes = 0             // 三过家门计数

-> c_open

=== c_open ===
#bg:flood_sky
#bgm:solemn
#show:qingyue:tease:float
「欸嘿——又一缕魂飘到我这儿啦！坐稳咯~ 这一回你要变的人，可是压轴的大人物。」 #speaker:青月
「你是文命，世人唤作禹。黄帝的玄孙，颛顼的孙子……也是那个把命都搭进滔天洪水里、十三年不敢回家的人。」 #speaker:青月
你睁开眼。天地间只剩一片浑黄——鸿水滔天，浩浩荡荡围住了山，漫过了丘陵，连人间的哭声都被水声盖住了。 #speaker:青月 #hint:当帝尧之时，鸿水滔天，浩浩怀山襄陵，下民其忧。
#show:gun:default:left
你的父亲鲧，曾奉命治这水。九年。 #speaker:青月
#show:qingyue:sad:float
「可他失败了。舜巡狩天下，见他治水『无状』，把他殛死在了羽山。」 #speaker:青月 #hint:行视鲧之治水无状，乃殛鲧于羽山以死。
#hide:gun
父败子继。这万里洪流，如今压到了你一个人肩上。 #speaker:青月
#show:qingyue:worry:float
「舜杀了你父亲，转头又把治水的担子交给了你。换了旁人，早记恨了。可史书里的你……一句怨言都没有，只把它当成非做不可的事。」 #speaker:青月
-> c_shouming

=== c_shouming ===
#bg:nanhe
#show:siyue:default:right
帝舜临朝，问四岳：谁能成尧未竟之业？四岳齐声：伯禹为司空，可成美尧之功。 #speaker:青月 #hint:伯禹为司空，可成美尧之功。
#show:qingyue:tease:float
「轮到你领命啦。按上古的规矩，受命之前，是要先谦让一番的哦——你也可以真让出去。」 #speaker:青月
你拜倒稽首，想把这担子让给契、后稷、皋陶。可舜看着你，只说了一句：「女其往视尔事矣。」——还是你去吧。 #speaker:青月 #hint:禹拜稽首，让于契、后稷、皋陶。舜曰：女其往视尔事矣。
#show:qingyue:worry:float
「呐——真正的难题，现在才开始。父亲筑了九年的堤，被水冲垮了。轮到你，第一件事，是想清楚：这水，到底该怎么治？」 #speaker:青月
「划重点！这一步要是想错了，你就是第二个鲧。史书上，可就要再多一个葬身洪水的名字咯。」 #speaker:青月

* #correct #hint:禹之胜，胜在『随山浚川』——先理清山川走势，顺水之性，疏导它入海。 [先循行山川、辨明地势，改堵为疏，把洪水导入大海]
	~ method_dao = true
	-> c_method_good
* #hint:鲧一味筑高堤堵水，九年不成，反被水冲垮。 [像父亲那样，多征民夫、加高堤坝，把洪水牢牢堵回去]
	-> c_method_death

=== c_method_death ===
#bg:flood_sky
#bgm:danger
你征来千万民夫，日夜加高堤坝，把洪水一寸寸往回堵。堤越筑越高，水也越积越猛。 #speaker:青月
终于，在一个暴雨之夜，积水冲垮了你所有的堤防——洪水复又滔天，比从前更凶。你重蹈了父亲鲧的覆辙，被殛于羽山。 #death:tang #speaker:青月
-> END

=== c_method_good ===
#bg:nanhe
#bgm:solemn
#achieve:yu_zhishui
#show:qingyue:solemn:float
「……『道九山』『道九川』。」 #speaker:青月 #hint:道九山……道九川……北播为九河，同为逆河，入于海。
「你没有和水较劲。你顺着它——把黄河下游劈成九道，让它自己流进海里。这一个『疏』字，就是你和父亲最大的不同。」 #speaker:青月
#show:qingyue:smile:float
「欸——漂亮！这才是禹！」 #speaker:青月
你带着伯益、后稷，命诸侯百姓征发民夫，随山势树立标木，定下高山大川。左手准绳，右手规矩，四季随身。 #speaker:青月 #hint:行山表木，定高山大川。左准绳，右规矩，载四时。
-> c_body

=== c_body ===
#bg:great_forest
陆行乘车，水行乘船，泥行乘橇，山行乘檋。哪里有水，你就到哪里去。 #speaker:青月 #hint:陆行乘车，水行乘船，泥行乘橇，山行乘檋。
#show:qingyue:worry:float
风餐露宿久了，随行的人劝你：司空劳苦功高，该修一处像样的居所、备些好衣好食，将养身子，才好长久治水。 #speaker:青月
「唔……这话也不算错。你要是先垮了，谁来接着治水呢？该顾顾自己吗？」 #speaker:青月

* #correct #hint:薄衣食，致孝于鬼神；卑宫室，致费于沟淢——省下的每一分，都填进了沟渠。 [婉拒——衣食从简、宫室从陋，把所有人力财力都填进沟渠]
	-> c_body_go
* #hint:禹之所以为禹，正在这份『把自己活成工具』的自苦。 [先修居室、备好衣食，把身子将养好了再接着干]
	-> c_body_indulge

=== c_body_indulge ===
你终究给自己修了屋、添了衣食。日子舒坦了些，可拨去沟渠的人力财力，也就少了些。 #speaker:青月
#show:qingyue:default:float
「你没有死——治水的活也还在做。只是慢了，也……不那么像那个禹了。」 #speaker:青月
「史书里的他，薄衣食、卑宫室，把省下的每一分都填进了沟淢。这份自苦，别人学不来，才叫大禹呀。」 #speaker:青月
-> c_body_go

=== c_body_go ===
#bg:great_forest
这样风里雨里，一年，两年……十三年。 #speaker:青月 #hint:居外十三年。
#show:qingyue:worry:float
「呐，前面就是你的家门了。你已经很久没回去过了。」 #speaker:青月
-> c_home_first

=== c_home_first ===
#bg:gui_river
#show:tushan:default:right
你远远望见自家的柴门。门里，涂山氏正抱着孩子。那是你的妻，你的启——你辛日成婚，甲日就离家治水，连儿子出生都没能守在旁边。 #speaker:青月 #hint:予娶涂山，辛壬癸甲，生启予不子，以故能成水土功。
里面传来婴儿的啼哭。风把那声音一直送到你耳边。 #speaker:青月
#show:qingyue:sad:float
「……第一次路过家门。孩子在哭呢。九州的水还没退，你手上还牵着万民。」 #speaker:青月
「进去吗？就抱一下。谁能拦得住一个父亲想抱抱自己的孩子？」 #speaker:青月

* #correct #hint:过家门不敢入——一个『不敢』，比『不入』更重。他不敢有片刻松懈。 [你握紧了手里的准绳，转身走向下一段河堤，没有进门]
	~ passes = passes + 1
	-> c_home_second
* [推开柴门，抱一抱哭着的孩子，歇一歇脚]
	-> c_home_death

=== c_home_death ===
#bg:gui_river
#bgm:danger
你推开门，抱起孩子。妻子为你添了热饭，屋里是久违的暖。你想，就歇几日吧，水患又不差这几天。 #speaker:青月
几日成了几月。你舍不得再走，堤上的活计一日日荒下去。上游堤溃，洪水复又漫过丘陵——十三年的功，亏于一篑。水患终究没能平，你也再不是那个「三过家门而不入」的禹了。 #death:banben #speaker:青月
-> END

=== c_home_second ===
#bg:great_forest
#bgm:solemn
你没有回头。你把疏九河、通九道、陂九泽、度九山的图，一遍遍在心里描。 #speaker:青月 #hint:以开九州，通九道，陂九泽，度九山。
洪水退处，你命伯益发下稻种，教百姓在低湿的泥地里种稻；命后稷在缺粮的地方发粮，粮少的地方，就调有余去补不足，让各方丰歉均平。 #speaker:青月 #hint:令益予众庶稻，可种卑湿。命后稷予众庶难得之食。食少，调有余相给，以均诸侯。
#show:qingyue:default:float
「你看——你治的不只是水。你在让躲在高丘上避洪的人，重新下到平地，有田种，有饭吃。」 #speaker:青月 #hint:民得下丘居土。
又是许多个日夜。你第二次，第三次路过自己的家门。 #speaker:青月
#show:tushan:default:right
这一次，门口站着个半大的孩子——是启，他已经会跑了。他不认得你，怯生生地望着这个满身泥水的陌生人。 #speaker:青月
#show:qingyue:sad:float
「……他不认得你了呀。你的儿子，长这么大了。」 #speaker:青月
「这一次，就说一句话，喊他一声，也好啊。」 #speaker:青月

* #correct #hint:身负父败之痛、万民之托，禹连儿子长大都无暇看顾——这是大禹精神最动人的一笔。 [你别过脸，把那声呼唤咽了回去，一步步走远，把眼泪留给了洪水]
	~ passes = passes + 1
	-> c_success
* [终究忍不住，回家看顾孩子，把治水的事先放一放]
	-> c_home_death

=== c_success ===
#bg:nanhe
#bgm:solemn
九州攸同，四海会同。九山开通了道路，九川疏浚了源流，九泽筑起了堤防。滔天的鸿水，终于顺着你劈开的河道，一道道流进了大海。 #speaker:青月 #hint:九州攸同，四奥既居，九山刊旅，九川涤原，九泽既陂，四海会同。
#show:qingyue:solemn:float
「东渐于海，西被于流沙，声教讫于四海。天下——太平了。」 #speaker:青月 #hint:东渐于海，西被于流沙，朔、南暨：声教讫于四海。
帝舜赐给你一块玄圭，让你向天下宣告：大功，告成。 #speaker:青月 #hint:于是帝锡禹玄圭，以告成功于天下。天下于是太平治。
#show:qingyue:sad:float
「你走完了他这十三年。」 #speaker:青月
「你知道最疼的是哪一处吗？不是风雨，不是泥水。是三过家门，听见孩子哭、看见孩子长大，却一次都没能进去。」 #speaker:青月
#show:qingyue:default:float
「他不是不想家。是把一个『家』，换成了天下万家的安宁。」 #speaker:青月
#show:qingyue:smile:float
「呼——玄圭在手，你就是禹了。看懂了吗？改堵为疏，是智；三过不入，是仁。少一样，这滔天的水，都到不了尽头呀。」 #speaker:青月
-> END
