---
name: "scene-video-gen"
description: "Generate AI dynamic videos for visual novel scene backgrounds using the seedance plugin. Invoke when user asks to generate scene videos, convert static images to dynamic backgrounds, or continue batch video generation."
---

# Scene Video Generation · 场景视频生成

使用 `trae-remote-official:seedance` 插件（GenerateVideo 工具）为视觉小说场景生成动态视频背景。

## 限制条件

- AI 视频生成有每日平台限额（约 5 个/天），超出后需等待次日重置或切换账号
- 每个用户 query 只能调用一次 GenerateVideo，额度用完后需用户发送新消息
- 视频输出为 720p / 16:9 / 5秒 循环 MP4
- 生成参数固定：`duration: 5`, `ratio: "16:9"`, `resolution: "720p"`

## 文件路径约定

- **视频保存目录**: `public/assets/backgrounds/wudi/video/`
- **视频文件命名**: `<scene_id>.mp4`（与场景 ID 一致）
- **参考图路径**: `public/assets/backgrounds/wudi/<image_name>.jpg`
- **base.ts 路径**: `src/react-app/data/sceneAssets/base.ts`
- **各章节配置**: `src/react-app/data/sceneAssets/<chapter>.ts`（shang/xizhou/chunqiu/zhanguo/qin/chuhan/hanchu/hanwu/zhuzi/qunxiang）

## 配置方法

在对应场景的 BgStyle 中添加 `video` 字段：

```typescript
// 修改前
changping: { label: "长平 · 之战", css: "...", image: "/assets/backgrounds/wudi/changping.jpg" },

// 修改后
changping: { label: "长平 · 之战", css: "...", image: "/assets/backgrounds/wudi/changping.jpg",
  video: "/assets/backgrounds/wudi/video/changping.mp4" },
```

## Prompt 模板

```
[PURPOSE: Ancient Chinese ink-wash painting style animated background for a visual novel game]

Shot 1: <场景动态描述>。Ink-wash painting aesthetic with <色调>。Camera <镜头运动>。5 second seamless loop.

Reference image 1 shows the base scene - maintain the same ancient Chinese ink-wash art style and color scheme.
```

## VNEngine.tsx 渲染逻辑

```
bg.video 存在 → 使用 SceneBackground 组件渲染 <video>
bg.video 不存在 → 使用 DynamicScene 组件（Canvas2D 镜头微动 + 色调 + 粒子）
```

视频优先级最高；无视频时回退到静态图 + Canvas 动效。

---

## 全章节视频生成清单

### 第一章 · 五帝篇（base.ts）— 已全部完成 ✅

| 场景 ID | 场景名 | 动态元素 | 状态 |
|---------|--------|---------|------|
| `zhuolu_field` | 涿鹿·战野 | 战场烽烟、厮杀氛围 | ✅ 已完成 |
| `zhuolu_fog` | 涿鹿·大雾 | 大雾弥漫、能见度变化 | ✅ 已完成 |
| `banquan_ye` | 阪泉·之野 | 战野荒原、风沙 | ✅ 已完成 |
| `granary_fire` | 焚廪·烈火 | 火焰燃烧、烟雾升腾 | ✅ 已完成 |
| `flood_sky` | 鸿水·滔天 | 洪水滔天、水波翻涌 | ✅ 已完成 |
| `mingtiao_war` | 鸣条·溃战 | 战场溃败、烟尘 | ✅ 已完成 |
| `great_forest` | 大麓·雷雨 | 雷电闪烁、暴雨倾盆、树冠摇动 | ✅ 已完成 |
| `xingye_night` | 承天·星夜 | 繁星闪烁、云气流动、银河微光 | ✅ 已完成 |
| `taishan_peak` | 泰山之巅 | 云海翻涌、山峦隐现、晨光破晓 | ✅ 已完成 |

---

### 第二章 · 商朝篇（shang.ts）— 已生成 2 个

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 | 状态 |
|--------|---------|--------|---------|--------|------------|------|
| **P0** | `lutai_fire` | 鹿台·赴火 | 烈焰冲天、建筑崩塌、浓烟滚滚 | `lutai_fire.jpg` | 烈火吞噬鹿台，火焰从宫殿顶部蔓延，浓烟遮蔽天日，建筑结构在火中崩塌 | ✅ 已完成 |
| **P1** | `paolao` | 炮烙·铜柱烈火 | 铜柱烧红、火焰灼烧、热浪扭曲 | `paolao.jpg` | 烧红的铜柱散发炽热光芒，火焰沿柱身舔舐，空气被热浪扭曲 | ✅ 已完成 |
| **P1** | `muye` | 牧野·前徒倒戈 | 战场倒戈、烟尘弥漫、旗帜倾覆 | `muye.jpg` | 战场上士兵倒戈，尘土飞扬，战旗倾覆，血色天幕 | 待生成 |
| **P2** | `tangshi_ye` | 誓师·吊民伐罪 | 军旗猎猎、将士列阵、烟雾 | `tangshi_ye.jpg` | 商汤誓师出征，军旗在风中猎猎作响，将士列阵，远处烽烟升起 | 待生成 |
| **P2** | `yinjiang_war` | 殷疆·百克转战 | 战火连绵、烟尘、征战 | `yinjiang_war.jpg` | 殷商疆域连绵战火，远处城邑冒烟，战旗飘扬 | 待生成 |

---

### 第三章 · 西周篇（xizhou.ts）— 已生成 1 个

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 | 状态 |
|--------|---------|--------|---------|--------|------------|------|
| **P0** | `li_shan` | 骊山·烽火 | 烽火狼烟冲天、山峦燃烧、烟雾弥漫 | `li_shan.jpg` | 骊山烽火台狼烟冲天，火焰从山顶蔓延，浓烟遮蔽天空，远处城池隐现 | ✅ 已完成 |
| **P1** | `haojing` | 镐京·陷落 | 城池燃烧、烟尘、断壁残垣 | `haojing.jpg` | 镐京城池陷落，宫殿燃烧，城墙崩塌，烟尘弥漫 | 待生成 |
| **P1** | `mengjin` | 盟津·渡河口 | 黄河波涛、渡船摇晃、水雾 | `mengjin.jpg` | 孟津渡口黄河波涛汹涌，渡船在急流中摇晃，水雾弥漫 | 待生成 |
| **P2** | `muye` | 牧野·战场 | 战场烟尘、厮杀（与商朝复用图） | `muye.jpg` | 牧野古战场，烟尘弥漫，战旗飘扬 | 待生成 |

---

### 第四章 · 春秋篇（chunqiu.ts）— 已生成 2 个

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 | 状态 |
|--------|---------|--------|---------|--------|------------|------|
| **P0** | `chengpu` | 城濮·之战 | 战车冲锋、烟尘滚滚、战旗 | `chengpu.jpg` | 城濮战场战车冲锋扬起漫天尘土，战旗在风中飘扬，远处晋军战车列阵 | ✅ 已完成 |
| **P0** | `yaoshan_fu` | 崤山·覆师 | 山谷伏击、烟尘、惨烈 | `yaoshan_fu.jpg` | 崤山山谷中伏击战，山石崩落，烟尘弥漫，残兵败将 | ✅ 已完成 |
| **P1** | `mianshan` | 绵山·焚林 | 大火烧山、浓烟、树木燃烧 | `mianshan.jpg` | 绵山被大火焚烧，火焰从山脚蔓延至山顶，浓烟遮天，树木在火中燃烧 | 待生成 |
| **P1** | `ailing_zhan` | 艾陵·伐齐 | 战场厮杀、烟尘、血色 | `ailing_zhan.jpg` | 艾陵战场，战车交锋，烟尘弥漫，血色黄昏 | 待生成 |
| **P2** | `po_ying` | 破郢·入楚 | 攻城、火焰、烟尘 | `po_ying.jpg` | 楚国郢都被攻破，城墙冒烟，火焰燃烧，吴军入城 | 待生成 |
| **P2** | `zhaoguan_ye` | 昭关·夜奔 | 夜色、月光、逃奔 | `zhaoguan_ye.jpg` | 昭关夜色，月光照在关隘上，浓云飘过遮月，远处火把微光 | 待生成 |

---

### 第五章 · 战国篇（zhanguo.ts）— 已生成 2 个

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 | 状态 |
|--------|---------|--------|---------|--------|------------|------|
| **P0** | `changping` | 长平·之战 | 战场硝烟、残旗断兵、血色天幕 | `changping.jpg` | 长平战场硝烟弥漫，残旗断兵遍野，血色天空，远处烽烟升起 | ✅ 已完成 |
| **P0** | `hangu_guan` | 函谷关·关门 | 关隘雄峙、风沙、旗帜 | `hangu_guan.jpg` | 函谷关雄踞山谷之间，关门紧闭，旌旗在风中飘扬，黄沙漫天 | ✅ 已完成 |
| **P1** | `yique` | 伊阙·古战场 | 山峡战场、烟尘、河水 | `yique.jpg` | 伊阙山峡中古战场，两岸峭壁，烟尘弥漫，河水奔流 | 待生成 |
| **P1** | `qi_chelie` | 齐市·车裂 | 刑场、烟尘、人群 | `qi_chelie.jpg` | 齐国市集中车裂之刑，烟尘飞扬，人群骚动 | 待生成 |
| **P2** | `jiamo` | 即墨·孤城 | 孤城坚守、烟火、城墙 | `jiamo.jpg` | 即墨孤城被围，城墙冒烟，远处敌军营帐连绵 | 待生成 |
| **P2** | `miluojiang` | 汨罗江·泽畔 | 江水东流、芦苇摇曳、雾气 | `miluojiang.jpg` | 汨罗江畔江水缓缓流淌，芦苇在风中摇曳，江面雾气弥漫 | 待生成 |

---

### 第六章 · 秦朝篇（qin.ts）— 已生成 2 个

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 | 状态 |
|--------|---------|--------|---------|--------|------------|------|
| **P0** | `greatwall` | 长城·北塞 | 长城蜿蜒、朔风呼啸、风沙漫天 | `greatwall.jpg` | 万里长城蜿蜒于崇山峻岭之间，朔风呼啸，黄沙漫天，旌旗飘扬 | ✅ 已完成 |
| **P0** | `yishui_river` | 易水·送别 | 河水奔流、寒风、萧瑟 | `yishui_river.jpg` | 易水河畔河水奔流，寒风吹过枯枝，远处群山萧瑟，悲壮送别 | ✅ 已完成 |
| **P1** | `afang_palace` | 阿房宫·兴建 | 宫殿建造、尘烟、劳工 | `afang_palace.jpg` | 阿房宫大兴土木，巨型殿宇拔地而起，尘烟弥漫，远处宫殿连绵 | 待生成 |
| **P1** | `bohai_coast` | 渤海·之罘 | 海浪拍岸、海风、 mist | `bohai_coast.jpg` | 渤海之罘海岸，海浪拍打礁石，海风吹拂，远处海面雾气弥漫 | 待生成 |
| **P2** | `jinian_palace` | 蕲年宫·冠礼 | 宫殿、旌旗、庄严肃穆 | `jinian_palace.jpg` | 蕲年宫殿宇巍峨，旌旗飘扬，庄严肃穆的冠礼氛围 | 待生成 |

---

### 第七章 · 楚汉篇（chuhan.ts + base.ts）— 已生成 2 个

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | 配置文件 | Prompt 要点 | 状态 |
|--------|---------|--------|---------|--------|---------|------------|------|
| **P0** | `gaixia` | 垓下·夜围 | 夜色火把、十面埋伏、楚歌 | `gaixia.jpg` | base.ts | 垓下夜色中汉军火把连绵十里，楚歌四面，寒风吹过战场 | ✅ 已完成 |
| **P0** | `daze_rain` | 大泽乡·遇雨 | 暴雨如注、电闪雷鸣、泥泞 | `daze_rain.jpg` | chuhan.ts | 大泽乡暴雨倾盆，电闪雷鸣，泥泞遍地，远处闪电照亮天空 | ✅ 已完成 |
| **P1** | `daze_uprising` | 大泽乡·揭竿 | 火把、旗帜、起义人群 | `daze_uprising.jpg` | chuhan.ts | 大泽乡起义火把如星火燎原，旗帜飘扬，人群激昂 | 待生成 |
| **P1** | `wujiang_river` | 乌江·渡口 | 江水奔流、渡船、秋风 | `riverside.jpg` | base.ts | 乌江渡口江水奔流，秋风萧瑟，渡船在急流中摇晃 | 待生成 |
| **P2** | `chen_siege` | 陈城·章邯围 | 攻城、烟尘、火光 | `chen_siege.jpg` | chuhan.ts | 陈城被秦军围攻，城墙冒烟，攻城器械林立 | 待生成 |

---

### 第八章 · 汉初篇（hanchu.ts）— 待生成

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 |
|--------|---------|--------|---------|--------|------------|
| **P1** | `xiliu_camp` | 细柳营·军门 | 军营严整、旌旗、晨雾 | `xiliu_camp.jpg` | 细柳营军门森严，旌旗在晨雾中飘扬，军士列阵 |
| **P1** | `dongshi` | 东市·刑场 | 刑场、烟尘、人群 | `dongshi.jpg` | 长安东市刑场，烟尘弥漫，人群围观，肃杀气氛 |
| **P2** | `zhulv_blood` | 诸吕·族灭 | 宫廷政变、火光、混乱 | `zhulv_blood.jpg` | 汉宫诸吕被族灭，宫殿走廊火光摇曳，混乱场面 |
| **P2** | `junji_daying` | 昌邑·坚壁 | 军营坚守、旗帜、夜色 | `junji_daying.jpg` | 昌邑大营坚壁不出，旌旗在夜色中飘扬，营火闪烁 |

---

### 第九章 · 汉武篇（hanwu.ts）— 已生成 2 个

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 | 状态 |
|--------|---------|--------|---------|--------|------------|------|
| **P0** | `mobei_desert` | 漠北·荒原 | 大漠风沙、黄沙漫天、苍茫 | `mobei_desert.jpg` | 漠北荒原黄沙漫天，大风卷起沙尘，远处地平线苍茫无际 | ✅ 已完成 |
| **P0** | `langjuxu` | 狼居胥山·封天 | 山巅祭天、风雪、旌旗 | `langjuxu.jpg` | 狼居胥山巅封天祭礼，旌旗在朔风中飘扬，云海翻涌 | ✅ 已完成 |
| **P1** | `longcheng_raid` | 龙城·捷报 | 战场烽火、烟尘、冲锋 | `longcheng_raid.jpg` | 龙城战场烽火连天，骑兵冲锋扬起漫天尘土，捷报传来 | 待生成 |
| **P1** | `northern_frontier` | 北疆·边塞 | 边塞风光、朔风、烽燧 | `northern_frontier.jpg` | 北疆边塞烽燧矗立，朔风吹过荒原，远处长城蜿蜒 | 待生成 |
| **P2** | `xiyu_desert` | 西域·大漠 | 沙丘流动、烈日、驼影 | `xiyu_desert.jpg` | 西域大漠沙丘在风中缓缓流动，烈日当空，远处驼队影影绰绰 | 待生成 |
| **P2** | `taishan_fengchan` | 泰山·封禅 | 山巅祭台、云海、旌旗 | `taishan_fengchan.jpg` | 泰山封禅祭台矗立山巅，云海翻涌，旌旗飘扬 | 待生成 |

---

### 第十章 · 诸子篇（zhuzi.ts）— 待生成

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 |
|--------|---------|--------|---------|--------|------------|
| **P1** | `haoshui_bridge` | 濠水·桥上 | 河水潺潺、鱼游、微风 | `haoshui_bridge.jpg` | 濠水桥上观鱼，河水潺潺流淌，微风拂过水面泛起涟漪 |
| **P2** | `chuye_garden` | 楚野·濮水 | 河畔野景、水雾、草木 | `chuye_garden.jpg` | 楚国野外濮水河畔，水雾弥漫，草木在微风中摇曳 |
| **P2** | `xingye_night` | 星空·夜谈 | 繁星、篝火、夜风 | `xingye_night_zhuzi.jpg` | 夜空繁星闪烁，篝火在夜风中摇曳，哲人夜谈 |

---

### 番外 · 群像篇（qunxiang.ts）— 待生成

| 优先级 | 场景 ID | 场景名 | 动态元素 | 参考图 | Prompt 要点 |
|--------|---------|--------|---------|--------|------------|
| **P2** | `jin_mountain` | 晋地·山野 | 山野雾气、树木摇动 | `great_forest.jpg` | 晋地山野薄雾弥漫，树木在风中摇动，远处山峦叠嶂 |
| **P2** | `jin_bridge` | 晋水·桥畔 | 河水奔流、桥影、水雾 | `riverside.jpg` | 晋水桥畔河水奔流，水雾弥漫，桥影倒映水中 |

---

## 执行流程

1. **确认待生成列表**：查看当前已完成视频（`public/assets/backgrounds/wudi/video/` 目录下的 .mp4 文件）
2. **选择场景**：按优先级 P0 → P1 → P2 顺序选择
3. **生成视频**：调用 GenerateVideo，使用上表中对应的 Prompt 要点和参考图
4. **更新配置**：在对应章节的 .ts 文件中为场景添加 `video` 字段
5. **验证**：确认视频文件存在且配置正确

## 已完成视频清单（截至 2026-08-01）

第一章·五帝篇 9个：`zhuolu_field`, `zhuolu_fog`, `banquan_ye`, `granary_fire`, `flood_sky`, `mingtiao_war`, `great_forest`, `xingye_night`, `taishan_peak`

第五章·战国篇 2个：`changping`, `hangu_guan`

第二章·商朝篇 2个：`lutai_fire`, `paolao`

第三章·西周篇 1个：`li_shan`

第四章·春秋篇 2个：`chengpu`, `yaoshan_fu`

第六章·秦朝篇 2个：`greatwall`, `yishui_river`

第七章·楚汉篇 2个：`gaixia`, `daze_rain`

第九章·汉武篇 2个：`mobei_desert`, `langjuxu`

## 待生成优先级排序（跨章节 P0 汇总）

P0 级场景已全部完成 ✅

> 剩余 0 个 P0 级场景
> P1 级剩余约 16 个，P2 级约 15 个

## 待生成优先级排序（跨章节 P1 汇总）

1. `muye` — 商朝·牧野前徒倒戈
2. `haojing` — 西周·镐京陷落
3. `mengjin` — 西周·盟津渡河口
4. `mianshan` — 春秋·绵山焚林
5. `ailing_zhan` — 春秋·艾陵伐齐
6. `yique` — 战国·伊阙古战场
7. `qi_chelie` — 战国·齐市车裂
8. `afang_palace` — 秦朝·阿房宫兴建
9. `bohai_coast` — 秦朝·渤海之罘
10. `daze_uprising` — 楚汉·大泽乡揭竿
11. `wujiang_river` — 楚汉·乌江渡口
12. `xiliu_camp` — 汉初·细柳营军门
13. `dongshi` — 汉初·东市刑场
14. `longcheng_raid` — 汉武·龙城捷报
15. `northern_frontier` — 汉武·北疆边塞
16. `haoshui_bridge` — 诸子·濠水桥上
