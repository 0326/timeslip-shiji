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
「欸嘿——又一缕魂飘到我这儿啦！坐稳咯~」 #speaker:青月
「这一回，你是重华，世人唤作舜。天下最有名的孝子……也是差点被亲爹烧死、埋死好几回的倒霉蛋。」 #speaker:青月
你睁开眼。妫水边，细葛衣，一张琴——都是尧赏你的。你以孝闻名，尧把两个女儿都嫁给了你。 #speaker:青月
#show:gusou:cold:left
可你的父亲瞽叟是个盲人，偏爱后妻生的弟弟象。他们，一直想要你的命。 #speaker:青月 #hint:瞽叟爱后妻子，常欲杀舜。
#show:qingyue:worry:float
「呐，划重点——他们的杀心是真的，你的孝也是真的。这一世最难的，就是让这两样同时活下去。」 #speaker:青月
-> c_granary

=== c_granary ===
#show:gusou:smiling:left
父亲忽然和颜悦色，唤你去修补粮仓的顶：「重华啊，仓顶漏了，你上去涂一涂。」 #speaker:瞽叟
他从不对你笑的。此刻却笑了。 #speaker:青月
#show:qingyue:tease:float
「唔——反常即为妖。要上去可以……手上，是不是该多带点什么呀？」 #speaker:青月

* #correct #hint:舜乃以两笠自扞而下——两顶斗笠，是他给自己备下的翅膀。 [顺手抄起两顶宽斗笠，才爬上仓顶]
	~ alerted = true
	-> c_granary_fire
* [空着手，依言爬上仓顶]
	-> c_granary_fire

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
	-> c_well
- else:
	你四顾无门，火舌舔上衣角。没有梯子，没有遮挡，什么都没有。烈火吞没了仓顶。 #death:burn #speaker:青月
	-> END
}

=== c_well ===
#bg:gui_river
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
你回到家。象正坐在你的屋里，弹着你的琴——他和父母早已分了你的家产，以为你死定了。琴归他，连尧的两个女儿也归他。 #speaker:青月 #hint:象乃止舜宫居，鼓其琴。舜往见之。
象见你活着回来，脸都白了，强笑道：「我……我正想念你，心里郁闷得很呢！」 #speaker:象
#show:qingyue:worry:float
「他要谋你的命、分你的产、占你的妻。现在，他就在你面前。」 #speaker:青月
「你手里全是道理。要清算吗？」 #speaker:青月

* #correct #hint:舜复事瞽叟爱弟弥谨——他没有报复，反而更恭谨了。 [「是啊，你大概是这样吧。」——你依旧待他如弟]
	-> c_end_sage
* [揭穿他的谋杀与瓜分，与他割席清算]
	-> c_return_break

=== c_return_break ===
你把一切摊开：焚廪、填井、分产、夺妻。象无地自容，父亲瞽叟却勃然大怒——你到底还是失了为子之道。那个「历劫不改其孝」的舜，从此不再是你。你也再未被尧托付天下。 #death:vengeance #speaker:青月
-> END

=== c_end_sage ===
#bg:gui_river
#bgm:solemn
#achieve:shun_filial
你像什么都没发生过一样，继续侍奉瞽叟、友爱象，一天比一天恭谨。 #speaker:青月 #hint:舜复事瞽叟爱弟弥谨。
#show:qingyue:solemn:float
「……他不是不疼。」 #speaker:青月
「烧他、埋他、抢他东西的人，他抬手就能报复。可他没有——把疼都咽下去了呀。」 #speaker:青月
不久，尧把五教百官都交给你去试，你样样治得井井有条。天下，正朝你走来。 #speaker:青月 #hint:于是尧乃试舜五典百官，皆治。
#show:qingyue:smile:float
「呼——你走完了他这一劫。看懂了吗？孝与智，缺一，都到不了这里。」 #speaker:青月
-> END
