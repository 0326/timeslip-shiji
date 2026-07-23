// ═══════════════════════════════════════════════
// 虞舜 · 焚廪穿井 · 历劫不死
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR alerted = false

-> c_open

=== c_open ===
#bg:gui_river
#bgm:solemn
#show:qingyue:tease:float
「嘘——先别睁眼。听见了吗？妫水边，有人在弹琴呢。」 #speaker:青月
「弹琴的人，就是你啦。这一世，你是重华，世人唤作舜。天下最有名的孝子……也是差点被亲爹烧死、埋死好几回的倒霉蛋。」 #speaker:青月
你睁开眼。指尖还搭在琴弦上。细葛衣，一张琴——都是尧赏你的。你以孝闻名，尧把两个女儿都嫁给了你。 #speaker:青月
#show:gusou:cold:left
可你的父亲瞽叟是个盲人，偏爱后妻生的弟弟象。他们，一直想要你的命。 #speaker:青月 #hint:瞽叟爱后妻子，常欲杀舜。
#show:qingyue:worry:float
「呐，划重点——他们的杀心是真的，你的孝也是真的。这一世最难的，就是让这两样同时活下去。」 #speaker:青月
-> c_granary

=== c_granary ===
#bg:granary_exterior
#show:gusou:smile:left
父亲忽然和颜悦色，唤你去修补粮仓的顶：「重华啊，仓顶漏了，你上去涂一涂。」 #speaker:瞽叟
你放下琴，应得没有半分迟疑：「诺。爹，孩儿这就去。」 #speaker:舜
「仓里的粮，是一家人过冬的口粮，误不得。」你一面挽起衣袖，一面在心里犯着嘀咕——爹，从不对你笑的。此刻却笑了。 #speaker:舜
#show:ehuang:worry:right
#show:nvying:worry:right
「重华，他从未笑过。」娥皇压低声音。 #speaker:娥皇
女英攥紧衣角，只说了一个字：「……笠。」 #speaker:女英
#hide:ehuang
#hide:nvying
#show:qingyue:tease:float
「唔——反常即为妖。要上去可以……手上，是不是该多带点什么呀？」 #speaker:青月

* #correct #hint:舜乃以两笠自扞而下——两顶斗笠，是他给自己备下的翅膀。 [顺手抄起两顶宽斗笠，才爬上仓顶]
	~ alerted = true
	-> c_granary_fire
* #hint:他难得对你这样笑——你太想信这一次了。 [爹难得对你和颜悦色——你不愿多想，空着手依言爬上仓顶]
	-> c_granary_fire
* [不上仓。当夜渡过妫水，把这桩杀机禀告帝尧]
	-> if_gaoyao_1

=== c_granary_fire ===
#bg:granary_fire
#bgm:danger
你刚上到仓顶，脚下轰地腾起火来——瞽叟在下面点燃了粮仓，还抽走了梯子。烈焰卷着黑烟，四面封死。 #speaker:青月 #hint:瞽叟从下纵火焚廪。
{ alerted:
	#show:qingyue:solemn:float
	「快！斗笠！」 #speaker:青月
	你双手各执一顶斗笠，如鸟张翼，纵身跃下——风兜住笠，你稳稳落地，滚出火场。 #speaker:青月 #hint:舜乃以两笠自扞而下，去，得不死。
	#show:qingyue:smile:float
	「欸——漂亮！跟他一个样，聪明！」 #speaker:青月
	-> c_after_fire
- else:
	你四顾无门，火舌舔上衣角。没有梯子，没有遮挡，什么都没有。烈火吞没了仓顶。 #death:burn #speaker:青月
	-> END
}

=== c_after_fire ===
#bg:gui_river
#show:shun:relieved:center
#show:ehuang:worry:left
#show:nvying:worry:right
你跌撞着跑回妫水边。娥皇扑上来按住你的肩，女英攥着你的衣袖不放。「你没事吧？」她们的眼眶都红了。 #speaker:青月
你拍拍她们的背：「没事。仓顶的土垮了，我跳下来的。」 #speaker:舜
#hide:shun
#hide:ehuang
#hide:nvying
#show:qingyue:worry:float
「你看，他连伤都不肯让人看见。二位帝女嫁的好人呀……就是命苦了点。」 #speaker:青月
-> c_well

=== c_well ===
#bg:well_yard
#show:gusou:cold:left
父亲又唤你去掏井。你低头应下——你知道，他还会再来一次。 #speaker:青月
#show:qingyue:worry:float
「他不会罢手的。下井……可是有去无回的地方哦？」 #speaker:青月

* #correct #hint:舜穿井为匿空旁出——下去之前，先给自己挖好一条活路。 [下井之前，先在井壁旁凿一条通往地面的暗道]
	~ alerted = true
	-> c_well_bury
* [依言直直往下掏井]
	~ alerted = false
	-> c_well_bury

=== c_well_bury ===
#bg:well_dark
#bgm:danger
你掘到深处，头顶忽然暗了——瞽叟与象合力往井里倒土，要把你活埋在井底。 #speaker:青月 #hint:瞽叟与象共下土实井。
{ alerted:
	你侧身钻进先前凿好的暗道，泥土在身后灌满井筒。你从旁侧的出口爬出地面，活了下来。 #speaker:青月 #hint:舜从匿空出，去。
	#show:qingyue:smile:float
	「呼……又逃过一劫。可你猜，回到家你会看见什么？」 #speaker:青月
	-> c_return
- else:
	泥土倾泻而下，压住你的肩、你的头。井口那点光，一点点没了。你被活埋在了井底。 #death:bury #speaker:青月
	-> END
}

=== c_return ===
#bg:shun_house
#show:xiang:startled:center
#show:shun:calm:left
你回到家。象正坐在你的屋里，弹着你的琴——他和父母早已分了你的家产，以为你死定了。琴归他，连尧的两个女儿也归他。 #speaker:青月 #hint:象乃止舜宫居，鼓其琴。舜往见之。
象见你活着回来，脸都白了，强笑道：「我……我正想念你，心里郁闷得很呢！」 #speaker:象
#hide:shun
#show:qingyue:worry:float
「他要谋你的命、分你的产、占你的妻。现在，他就在你面前。」 #speaker:青月
「你手里全是道理——琴是你的，妻是你的，命也差点没了。要清算吗？没有人会说你错。」 #speaker:青月

* #correct #hint:舜复事瞽叟爱弟弥谨——他没有报复，反而更恭谨了。 [「是啊，你大概是这样吧。」——你把满腹的疼咽下去，依旧待他如弟]
	-> c_end_sage
* [焚廪、填井、分产、夺妻——桩桩件件摊开，与他割席清算，讨回全部公道]
	-> c_return_break
* [不清算，也不再回头——收拾行囊，带二妃离开妫汭]
	-> if_yuanzou_1

=== c_return_break ===
你把一切摊开：焚廪、填井、分产、夺妻。象无地自容，父亲瞽叟却勃然大怒——你到底还是失了为子之道。那个「历劫不改其孝」的舜，从此不再是你。你也再未被尧托付天下。 #death:vengeance #speaker:青月
-> END

=== c_end_sage ===
#bg:gui_river
#bgm:solemn
#achieve:shun_filial
#show:shun:calm:center
「然——你能这样惦记着哥哥，便庶几近于弟道了。」你抚着琴弦，声音平平的，听不出一丝波澜。 #speaker:舜 #hint:舜曰：然，尔其庶矣！
#show:ehuang:gentle:left
#show:nvying:gentle:right
你像什么都没发生过一样，继续侍奉瞽叟、友爱象，一天比一天恭谨。 #speaker:青月 #hint:舜复事瞽叟爱弟弥谨。
#hide:shun
#hide:ehuang
#hide:nvying
#show:qingyue:solemn:float
「……他不是不疼。」 #speaker:青月
「烧他、埋他、抢他东西的人，他抬手就能报复。可他没有——把疼都咽下去了呀。」 #speaker:青月
不久，尧把五教百官都交给你去试，你样样治得井井有条。天下，正朝你走来。 #speaker:青月 #hint:于是尧乃试舜五典百官，皆治。
#show:qingyue:smile:float
「呼——你走完了他这一劫。看懂了吗？孝与智，缺一，都到不了这里。」 #speaker:青月 #ending:canon
-> END

// ═══ IF线 · 告尧（自由模式歧路：把家事诉到帝庭）═══

=== if_gaoyao_1 ===
#bg:gui_river
#bgm:solemn
#show:qingyue:worry:float
「欸？这一步……史书上没有哦。我也是第一次看。」 #speaker:青月
你没有上仓顶。当夜，你渡过妫水，一路向北——你的岳父，是天子。 #speaker:青月
帝都平阳。尧听完，久久没有说话。他嫁了两个女儿给你，为的是「观其德于二女」，却观出了一桩父杀子的丑闻。 #speaker:青月
天子之令下：瞽叟纵火谋杀，槌楚有罪；象夺产乱伦，逐于有庳之野。 #speaker:青月
#show:qingyue:sad:float
「公道来了。可你听——外面的风声，也来了。」 #speaker:青月
四方诸侯议论纷纷：舜告其父。孝子告父，纵然有理，天下人只记住了四个字——「其家不宁」。 #speaker:青月
#show:qingyue:solemn:float
「四岳曾举荐你时说：『盲者子。父顽，母嚚，弟傲，能和以孝』。」 #speaker:青月 #hint:盲者子。父顽，母嚚，弟傲，能和以孝，烝烝治，不至奸。
「他们看中的，从来不是你受了多少委屈——是你能把一个要杀你的家，『和』起来呀。」 #speaker:青月
此后你安然做你的驸马，衣食无忧，家宅清净。只是五典百官，尧另试了他人；禅让的玉玺，再没有朝你来过。 #speaker:青月
你得了公道，安稳终老。史书上的那个圣人，换成了别人的名字。 #ending:if_gaoyao #speaker:青月
-> END

// ═══ IF线 · 远走（自由模式歧路：不回那个要你死的家）═══

=== if_yuanzou_1 ===
#bg:gui_river
#bgm:solemn
#show:qingyue:worry:float
「不清算，也不原谅……你要走？史书上，可没有这一页哦。」 #speaker:青月
你没有进门。琴声还在屋里响——让他弹吧。你转身，带着二妃，向妫水更南的河谷走去。 #speaker:青月
历山的农人听说了，三三两两地跟上来；雷泽的渔人也来了。不出两年，你们烧荒垦田，聚成了一个新邑——你在哪里，哪里就成聚落。 #speaker:青月 #hint:舜耕历山，历山之人皆让畔……一年而所居成聚，二年成邑。
#show:qingyue:calm:float
「你看，你还是你——走到哪儿，人心就跟到哪儿。」 #speaker:青月
可你的名声传回平阳时，跟着的还有另一句话。瞽叟坐在门前，逢人便说：「他弃父而走。」 #speaker:青月
尧的使者来过一次，在邑外看了很久，回去了。 #speaker:青月
#show:qingyue:sad:float
「五典百官，要交给能把天下当一家人的人。而你……连自己家，都不要了呀。」 #speaker:青月
你在南河之滨终老，是个好农人、好邻人、好丈夫。邑中人人敬你。只是天下，与你再无关系。 #speaker:青月
#show:qingyue:solemn:float
「舜之所以是舜，不在他逃开了几次死——在他逃得开、却不肯逃的那一点心。」 #speaker:青月
你活得干净安稳。史书上，将不会有你的名字。 #ending:if_yuanzou #speaker:青月
-> END
