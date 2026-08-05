// ═══════════════════════════════════════════════
// 黄帝 · 涿鹿擒蚩尤 · 征师诸侯
// 史源：《史记·五帝本纪》
// ═══════════════════════════════════════════════

VAR mg_result = ""
VAR mg_score = 0

-> c_open

=== c_open ===
#bg:xuanyuan_qiu_alt2
#bgm:solemn
#show:qingyue:worry:float
「……听。东边的战鼓，隔着几千年，都敲得我耳朵疼。」 #speaker:青月
「你来得正赶上上古最凶的一场仗。你还是轩辕——阪泉三战刚压服了炎帝、修德振兵的那位。世人还要唤你另一个名字：黄帝。不过嘛，这个名分，还没到手呢。」 #speaker:青月
你睁开眼。神农氏世衰，诸侯相侵，你操干戈、征不享，诸侯已多来宾从。可东方还有一头压不住的猛兽。 #speaker:青月 #hint:轩辕乃习用干戈，以征不享，诸侯咸来宾从。
#show:chiyou:rage:right
那便是蚩尤。诸侯里最凶暴的一个，至今没人能伐得动他。而今，他反了。 #speaker:青月 #hint:而蚩尤最为暴，莫能伐。
#show:qingyue:worry:float
「呐，划重点——史书就给了你一句话：『蚩尤作乱，不用帝命。』接下来这几步怎么走，就是你能不能当上黄帝的分野啦。」 #speaker:青月
#hide:chiyou
-> c_muster

=== c_muster ===
#bg:huangdi_court
#bgm:court
#show:chiyou:rage:right
军情一日三报：蚩尤不奉帝命，兵锋已动，欲侵陵诸侯。帐中将佐分作两派——有人说你阪泉新胜、兵锋正锐，何不即刻挥师东进，一战踏平蚩尤。 #speaker:青月
你按着案上的舆图，指节都发了白：「阪泉的血还没干，将士的甲还没卸……可蚩尤不除，天下永无宁日。」 #speaker:轩辕
#show:qingyue:tease:float
「唔——你手里是有兵。可蚩尤是『莫能伐』的狠角色欸。孤军直插，还是……先做点别的？」 #speaker:青月

* #correct #hint:于是黄帝乃征师诸侯——先合天下之力，再与蚩尤对阵。 [按住性子，遣使征调诸侯之师，合诸侯之力而后战]
	-> c_march
* #hint:阪泉压服的是炎帝，不是蚩尤；轻敌孤进，正中『莫能伐』之险。 [趁锐气正盛，率本部精锐星夜孤军东进]
	-> c_lone_charge
* #correct [不动刀兵。遣使入九黎，愿封蚩尤为东方之伯，以德招之来朝]
	-> if_zhaofu_1
* #correct [先遣使联络炎帝，邀他一同出兵——两族合兵，方能压服蚩尤]
	-> c_muster_yandi
* #correct [派人深入九黎，打探蚩尤的虚实和弱点——知己知彼，方能百战不殆]
	-> c_muster_spy

=== c_muster_yandi ===
#show:qingyue:calm:float
「邀炎帝一同出兵……这主意不错。」 #speaker:青月
你遣使南下，邀请炎帝共伐蚩尤。炎帝虽刚归附不久，却也知道蚩尤的凶暴——他若坐大，对谁都没好处。 #speaker:青月
炎帝点兵相助。阪泉之战后，你与他的兵马第一次并肩作战——两族合流的力量，果然非同小可。 #speaker:青月
#show:qingyue:smile:float
「你看，敌人的敌人，就是朋友。阪泉的旧怨，在涿鹿面前，算不得什么了。」 #speaker:青月
「炎帝之师与你的兵马合在一处，再加上征来的诸侯之师——这一仗，你的人可比史书里写的还多啦。」 #speaker:青月
-> c_march

=== c_muster_spy ===
#show:qingyue:calm:float
「打探虚实……这是兵家的正道。」 #speaker:青月
你派人深入九黎，打探蚩尤的部署。探子回报：蚩尤虽勇，却有一个致命弱点——他的部众多是九黎各族拼凑而成，人心不齐。 #speaker:青月
「九黎之人，本非一心。他们跟着蚩尤，是因为怕他，不是因为服他。」 #speaker:青月
#show:qingyue:tease:float
「这个情报，可是值千金呀。你打算怎么用？」 #speaker:青月

* [设反间计，离间九黎各族]
	-> c_muster_spy_divide
* [将此情报告知诸侯，增强他们的信心，而后征师出战]
	#show:qingyue:smile:float
	「知己知彼，诸侯的底气就足啦。这仗，赢面又大了几分。」 #speaker:青月
	你将蚩尤的虚实告知诸侯，众人信心大增。你随即遣使征调诸侯之师，合兵而进。 #speaker:青月
	-> c_march
* [在战场上以攻心为主，瓦解九黎的斗志]
	#show:qingyue:calm:float
	「攻心为上……好主意。不过蚩尤本人是不吃这套的——你得先在战场上压服他，才能让九黎之人看到谁更强大。」 #speaker:青月
	你先征师诸侯，合兵而进。你打算在交战时，让九黎看到蚩尤并非不可战胜——届时人心自散。 #speaker:青月
	-> c_march

=== c_muster_spy_divide ===
#show:qingyue:smile:float
「反间计……好主意！」 #speaker:青月
你派人潜入九黎，散布谣言：蚩尤要将战败的部族全部屠杀，只留最强的一族。九黎各族本就各怀鬼胎，一听这话，人心大乱。 #speaker:青月
开战之前，已有几个小部族偷偷派人来降。你许他们战后各安其位，他们欣然应允。 #speaker:青月
#show:qingyue:calm:float
「你看，还没开打，蚩尤的人就先跑了一批。不过呀——蚩尤本人可不会因此就降，他只会更疯狂。」 #speaker:青月
「反间计削的是他的羽翼，真正要拿住他，还得靠硬仗。走吧，征师诸侯，去涿鹿会会这头猛兽。」 #speaker:青月
-> c_march

=== c_lone_charge ===
#bg:zhuolu_field
#bgm:danger
#hide:chiyou
你捺下帐中争执，点起本部精锐，星夜东进。未等诸侯之师的烟尘聚齐，你的旌旗已直插涿鹿之野。 #speaker:青月
你不待诸侯，独领本部长驱直入。蚩尤却早已张网——他部众最悍，四面合围，你的孤军被咬在涿鹿之野，进退无路。 #speaker:青月
#show:qingyue:worry:float
「呀……你忘了那句『莫能伐』。凭一部之力就想啃下他，天下最凶的兽，哪是一个人围得住的？」 #speaker:青月
你身陷重围，援兵无一，力尽于野。 #death:lone #speaker:青月
-> END

=== c_march ===
#bg:zhuolu_field
#bgm:march
#hide:chiyou
诸侯之师应召而至，旌旗蔽野，会于涿鹿。你立于阵前，望着对面那片黑压压的蚩尤军——这一战，将定谁做天下共主。 #speaker:青月 #hint:与蚩尤战于涿鹿之野。 #impact:impact_zhuolu_zhengshi
#show:chiyou:rage:right
战鼓未歇，天忽变。 #speaker:青月
-> c_fog

=== c_fog ===
#bg:zhuolu_fog
#bgm:danger
#hide:chiyou
一场大雾平地涌起，浓得伸手不见五指。士卒辨不清东西南北，阵脚开始散乱。传说里，这雾是蚩尤所作，要把你的大军困死在迷途中。 #speaker:青月
#show:qingyue:solemn:float
「——喏，指南车、风后、大雾这些，是后世给这一战添的传奇，『传说如此』罢了。」 #speaker:青月
#show:qingyue:worry:float
「可雾里失向、军心自乱，这份险是真的。合来的诸侯之师，最怕的就是各自散了。此刻，你该抓住什么？」 #speaker:青月

* #correct #hint:征师诸侯，胜在合而不散——稳住诸侯之军，勿使其溃。 [传令诸军原地结阵、以旗鼓相闻，合诸侯之师不使溃散]
	-> c_capture
* #hint:雾中妄动、各自追击，正是『不合诸侯』之败，孤军复现于迷途。 [不顾雾浓，催动全军循声追杀，务求一举破敌]
	-> c_fog_lost
* #correct [询问风后，指南车如何辨向]
	-> c_explore_zhuolu_zhinanche
* [派精锐部队试探前进，探明敌情后再行进退]
	-> c_fog_scout
* #correct [令诸军点火为号，以火光联络各营——火光不灭，军心不散]
	-> c_fog_fire

=== c_fog_scout ===
#show:qingyue:worry:float
「派精锐试探……这法子稳是稳，可要是试探的部队被吃掉了，士气就更难收了。」 #speaker:青月
你派精锐小队分头试探，却不想蚩尤早已在雾中设伏——你的精锐小队一出去，就再也没有回来。 #speaker:青月
雾中传来惨叫声，诸侯之师的士气更加低落。你不敢再派人出去，只能死守原地——可死守，终究不是办法。 #speaker:青月
#show:qingyue:sad:float
「你太谨慎了，反而错失了时机。雾会散，可散了的时候，你的兵已经没了锐气。」 #speaker:青月
雾散之时，蚩尤的大军从四面八方涌来。你虽奋力抵抗，终因士气低落而败。 #death:scout #speaker:青月
-> END

=== c_fog_fire ===
#show:qingyue:calm:float
「点火为号……这法子简单，却管用。」 #speaker:青月
你传令诸军点火为号，火光冲天，照亮了整个涿鹿之野。诸侯之师见火光不灭，军心渐渐安定下来。 #speaker:青月
火光虽能联络各营，却也暴露了你的位置——蚩尤顺着火光扑来，你的阵地承受了巨大的压力。 #speaker:青月
#show:qingyue:calm:float
「你守住了军心，却引来了敌人。不过呀——守住了军心，就守住了最根本的东西。」 #speaker:青月
你率诸侯之师奋力抵挡，在火光与杀声中苦撑。雾渐渐薄了，天光从云隙里透下来—— #speaker:青月
#show:qingyue:smile:float
「天亮了！雾散了！诸侯之师合势反击——」 #speaker:青月
雾散之后，你以旗鼓重新联络诸军，合势而进。蚩尤的凶悍抵不住四方合围之力，阵线崩裂。 #speaker:青月
乱军之中，蚩尤被你的诸侯合兵擒下。 #speaker:青月 #hint:遂禽杀蚩尤。
-> c_capture_choice

=== c_capture_choice ===
#show:chiyou:mock:center
蚩尤被缚于阵前，浑身浴血，仰天大笑：「轩辕！我这样的悍将，杀了岂不可惜？收了我，九黎的铜兵都归你——你的刀，还怕天下谁人？」 #speaker:蚩尤
你直视着他，声音很沉：「收你之勇，容你之乱——那孤与你，又有何分别。」 #speaker:轩辕
#show:qingyue:worry:float
「呐——最后一步了。这头『莫能伐』的猛兽落在你手里。杀，还是留？」 #speaker:青月
「史书只给了两个字的结局，你敢照着走吗？落刀的分量，可要你自己扛哦。」 #speaker:青月

* #correct #hint:遂禽杀蚩尤——史书的结局，只此一途。 [依帝命处决蚩尤，以定天下之乱、绝再叛之患——纵然从此背上杀伐之名]
	-> c_end
* #hint:『不用帝命』者若得赦，帝命不立、诸侯不服，共主之统无从立起。 [念其勇烈，赦而收之——九黎铜兵尽归于你，何愁天下不定]
	-> c_spare
* #correct [杀蚩尤犹不足——尽屠九黎之族，鸡犬不留，以绝东方再叛之根]
	-> if_tuli_1
* [不杀蚩尤，也不收他——将他流放至蛮荒之地，永不得归]
	-> c_capture_exile
* #correct [杀蚩尤，但善待九黎之民——诛首恶而安从者，方为王者之道]
	-> c_capture_benevolent

=== c_explore_zhuolu_zhinanche ===
#show:qingyue:calm:float
风后答道：「臣造一车，车上木人恒指南方。不论车行何向，木人所指不移——以此辨方位，纵大雾漫天，亦不致迷途。」 #speaker:风后
#show:qingyue:tease:float
「指南车哦——后来它变成了你手里那个叫『compass』的小圆盒。不过嘛，那是几千年后的事啦。」 #speaker:青月
#show:qingyue:calm:float
「传说指南车是风后在涿鹿之战时发明的，专为破蚩尤的大雾。不过太史公没写这个——他写的是『遂禽杀蚩尤』，干净利落。」 #speaker:青月
「指南车、大雾、应龙……这些都是后人添的传奇。真正立得住的，还是『征师诸侯』这四个字。」 #speaker:青月

* [「除了指南车，还有什么办法能破雾？」]
	#show:qingyue:calm:float
	「办法嘛——结阵不乱、以旗鼓相闻、点火为号……这些都是可行的。指南车是传说，可稳住军心、合而不散，才是破雾的真法子。」 #speaker:青月
	-> c_fog
* [「风后这个人……是个什么样的人？」]
	#show:qingyue:calm:float
	「风后是你帐中最善谋的臣子。传说他懂兵法、会造车，是你的军师。后世有一部《风后八阵图》，据说就是他传下来的。」 #speaker:青月
	「不过太史公只写了『举风后、力牧、常先、大鸿以治民』——他是你的贤臣之一，仅此而已。」 #speaker:青月
	-> c_fog
* [「继续破雾。」]
	-> c_fog

=== c_fog_lost ===
#hide:chiyou
你不辨方向便催军猛进，各部循着雾里的喊杀声四散追击。合来的诸侯之师就此散乱脱节，反被蚩尤伏兵各个击破。你随溃军没入白茫茫的迷雾，再没能走出来。 #death:fog #speaker:青月
-> END

=== c_capture ===
#bg:zhuolu_field
#bgm:march
#show:qingyue:smile:float
「欸——稳住了！雾会散，散了的军心可就收不回来啦。」 #speaker:青月
你以旗鼓联络诸军，结阵不乱。雾气渐薄，诸侯之师合势而进，蚩尤的凶悍抵不住这四方合围之力，阵线终于崩裂。 #speaker:青月
乱军之中，蚩尤被你的诸侯合兵擒下。 #speaker:青月 #hint:遂禽杀蚩尤。
-> c_capture_choice

=== c_capture_exile ===
#show:qingyue:worry:float
「流放……这倒是个办法。」 #speaker:青月
你没有杀蚩尤，也没有收他——你把他流放到了蛮荒之地，让他永世不得回来。 #speaker:青月
蚩尤走了，可九黎之民还在。他们失去了首领，却没有失去怨恨——你流放了他们的王，却没有解开他们的心结。 #speaker:青月
#show:qingyue:sad:float
「你以为流放就能了结一切，可人心不是这么简单的。九黎之民口称臣服，心里却盼着他们的王回来。」 #speaker:青月
几年后，蚩尤在蛮荒之地纠集了一批亡命之徒，卷土重来。这一次，他更加疯狂，更加残忍——你虽再次击败了他，却付出了更大的代价。 #speaker:青月
#show:qingyue:solemn:float
「史书里写的是『遂禽杀蚩尤』——不是流放，不是囚禁，是彻底终结。有些事，不是放走就能解决的。」 #speaker:青月
你虽胜了两仗，却成了一个犹豫不决的君主。共主之名，终究少了几分分量。 #death:exile #speaker:青月
-> END

=== c_capture_benevolent ===
#show:qingyue:smile:float
「诛首恶而安从者……这才是王者之道！」 #speaker:青月
你处决了蚩尤，却没有迁怒于九黎之民。你派人安抚他们，许他们各安其位，只要不再作乱。 #speaker:青月
九黎之民见你不杀无辜，纷纷放下武器，俯首称臣。东方从此安定——你不仅平定了叛乱，还赢得了人心。 #speaker:青月
#show:qingyue:calm:float
「你看，杀一个人不难，难的是杀了他之后，还能让他的族人信服你。」 #speaker:青月
这就是正史里「遂禽杀蚩尤」的深意——杀的是乱首，安的是天下。 #speaker:青月
-> c_end

=== c_spare ===
#hide:chiyou
你动了恻隐，赦了蚩尤。可他本是『作乱、不用帝命』之人，得赦不惧，其众复叛；随你征师而来的诸侯见帝命不立、乱首得纵，人心遂散。共主之名，你终究没能担起。 #death:spare #speaker:青月
-> END

=== c_end ===
#bg:zhuolu_field
#bgm:solemn
#hide:chiyou
#achieve:huangdi_zhuolu
#show:qingyue:solemn:float
「……『于是黄帝乃征师诸侯，与蚩尤战于涿鹿之野，遂禽杀蚩尤。』」 #speaker:青月
「你看，一整场惊天动地的大战，太史公只肯写这一句。指南车、大雾、应龙，都是后人添的花；真正立得住的骨头，就这一句——征师、涿鹿、禽杀蚩尤。」 #speaker:青月
涿鹿尘定。诸侯望着你，一个接一个俯身——他们共尊轩辕为天子，代神农氏而有天下。是为黄帝。 #speaker:青月 #hint:而诸侯咸尊轩辕为天子，代神农氏，是为黄帝。
#show:qingyue:smile:float
「欸——从此往后，天下有不顺的，你披山通道、从而征之，一辈子未尝宁居。」 #speaker:青月 #hint:天下有不顺者，黄帝从而征之……披山通道，未尝宁居。
「呼——你走完了他这一战。看懂了吗？他不是靠一个人多能打，是靠把天下的力气合到了一处呀。」 #speaker:青月
#actclear:huangdi_zhuolu_act
#show:qingyue:tease:float
「呐——涿鹿之战的原文，你记全了吗？来，把这九黎玉珠布阵破一破——征师诸侯、禽杀蚩尤，都在里头哦。」 #speaker:青月
#minigame:match3:zhuolu_1
{ mg_result == "win":
	#show:qingyue:smile:float
	「{mg_score} 分，迷阵已破，涿鹿之战的原文，你全记下了！」 #speaker:青月
- else:
	#show:qingyue:sigh:float
	「迷阵未破也无妨，征师诸侯、合而不散的道理，你心里已经明白了。」 #speaker:青月
} #speaker:青月
#show:qingyue:calm:float
「蚩尤死了。可他身后还有一整个九黎部族——那些人呢？太史公没写这一笔，我替你看看。」 #speaker:青月
#show:qingyue:worry:float
「九黎有个铜匠，叫阿铜。蚩尤在的时候，他替蚩尤铸铜兵——九黎的刀比石兵利十倍，一半靠他的手艺。蚩尤死了那天，他蹲在废墟边，怀里抱着最后一把没铸完的铜刀，等着发落。」 #speaker:青月
#show:qingyue:smile:float
「可等来的不是刀，是一道命令——九黎之民，各安其位。你没有屠九黎，反而征用了他们的手艺。阿铜被编入你的铸坊，只是不再铸兵，改铸农具。」 #speaker:青月
「他铸出的第一把铜锄，比石锄利十倍。他看着那把锄头，忽然明白：手艺还是那门手艺，只是不再用来杀人了。」 #speaker:青月
#show:qingyue:calm:float
「后来呀，九黎的铜匠和你的铜匠坐在同一个铸坊里，一起炼铜、一起开模。阿铜的大女儿嫁给了有熊氏的铁匠——两家结亲时，谁也不提当年打过仗的事。那已经是上一辈的恩怨了。」 #speaker:青月
#show:qingyue:solemn:float
「遂禽杀蚩尤——太史公只写了五个字。可这五个字底下，是阿铜从铸刀变成铸锄，是九黎从叛族变成匠户。杀一个首领只要一刀，安一族的百姓却要一辈子的功夫。」 #speaker:青月 #ending:canon #quiz:quiz_zhuolu_zhinanche
-> END

// ═══ IF线 · 招抚（自由模式歧路：不战，招蚩尤来朝）═══

=== if_zhaofu_1 ===
#bg:huangdi_court
#bgm:solemn
#hide:chiyou
你放下帐中舆图，未点一兵一卒，先遣使者持节东行。 #speaker:青月
#show:qingyue:worry:float
「以德招那头『莫能伐』的猛兽……这一步，史书上没有哦。」 #speaker:青月
你没有征师。你遣使入九黎，愿封蚩尤为东方之伯，许他自领其部、岁时来朝——刀能诛他，可你想试试，德能不能收他。 #speaker:青月
#show:chiyou:rage:right
蚩尤听了使者的话，仰天大笑：「轩辕怕了。他打不动我，才来许我官爵。」他非但不来，反而挟这份『示弱』，兵锋更盛，诸侯里凡有异心的，都悄悄向他靠拢。 #speaker:青月
#show:qingyue:sad:float
「呀……他本就是『作乱、不用帝命』的人。对不知帝命为何物的凶兽讲德，德就成了软弱。」 #speaker:青月
你招抚的诏书，反倒成了他起兵的旗号。等你再想征师诸侯，已有一半诸侯在观望——他们要看谁的刀更硬。 #speaker:青月
#show:qingyue:solemn:float
「史书里的你，是先『征师诸侯』、再『禽杀蚩尤』——对乱首，先立威，才谈得上服人。」 #speaker:青月
「你把次序颠倒了。有的暴，是招不来的呀。」 #speaker:青月
你终究没能立起共主之统。天下人记住的，是一个『招抚不成、坐失天时』的轩辕。仁厚用错了地方，比暴虐更误天下。 #ending:if_zhaofu #speaker:青月
#hide:chiyou
-> END

// ═══ IF线 · 屠黎（自由模式歧路：杀蚩尤后尽屠九黎）═══

=== if_tuli_1 ===
#bg:zhuolu_field
#bgm:danger
#hide:chiyou
#show:qingyue:worry:float
「斩草除根，连根一起烧尽……这一步，太史公也没敢写哦。」 #speaker:青月
你禽杀了蚩尤，犹嫌不足。你下令尽屠九黎——男女老幼，铜兵瓦釜，一并埋进涿鹿的土里。东方从此再无一个九黎人。 #speaker:青月
#show:qingyue:sad:float
「……乱首已诛，你却要连他的族人一起。这一步落下去，涿鹿之野的血，就没过脚踝了。」 #speaker:青月
随你征师而来的诸侯，本是来讨『作乱之人』的。可他们看见你连不曾持兵的老弱都不放过，一个个握紧了自己的部众——今日你屠九黎，明日会不会屠我？ #speaker:青月
#show:qingyue:solemn:float
「史书只写『遂禽杀蚩尤』五个字——杀的是那个乱首，不是一整个族。」 #speaker:青月
「立威与逞凶，只差这一步。可这一步，就是共主与屠夫的分界呀。」 #speaker:青月
诸侯尊你为天子，是因为你能『定乱』；他们心里防你，是因为你会『杀绝』。你坐上了共主之位，却把人心埋在了涿鹿。九黎绝了后，你的德，也绝了根。 #ending:if_tuli #speaker:青月
-> END
