# PR: 黄帝篇拓展 + 青月/BGM 系统 + 美术素材重做 + 图鉴/Codex/小游戏

## 概述

本 PR 汇总「起源 · 穿越轩辕」开篇的多项系统性升级：黄帝篇故事拓展与 NPC 侧面叙述、涿鹿之战 AI 动态视频 + 纯静态图方案、青月音效选择系统与确定性 BGM 匹配机制、全量角色图鉴立绘重做（黑神话悟空融合风格）、对话框立绘透明背景修复、场景背景去水印、BGM/音效音频素材补全、群像与番外剧情脚本扩展、角色图鉴生平历程与思维导图、Codex/Panorama 知识库页面、15 个小游戏合集，以及引擎/配置迭代。

---

## 一、黄帝篇故事拓展 + 动态场景方案（已提交）

### 1.1 黄帝篇故事拓展
- 黄帝篇四章剧情拓展（起源/阪泉/涿鹿/治天下）
- NPC 侧面叙述补全，选项完整性修复

### 1.2 动态场景最终方案
- 涿鹿之战战场使用 AI 生成动态视频（`public/assets/backgrounds/wudi/video/zhuolu_field.mp4`）
- 其余场景统一使用纯静态图片，无 CSS 动画/粒子特效干扰
- 场景转场无黑色晕染效果，直接画面显示

---

## 二、青月系统形象 & BGM 制作最终方案（已提交）

### 2.1 青月音效选择系统
- 玩家进入「起源 · 穿越轩辕」(storyId = "huangdi:qiyuan") 时弹窗选择音效
- 弹窗仅在 `huangdi:qiyuan` 且未做过选择时显示，其他故事线沿用已保存选择
- 音效/BGM 默认关闭，只有显式选择「开启音效」才打开
- 选择持久化到 `localStorage`：`cysj-sfx-chosen` / `cysj-sfx` / `cysj-bgm`
- 起源内连续点击右上角音效按钮 5 次（1.2 秒内）可清除选择重新体验引导
- 新手指引：金色脉冲光圈 + 虚线连线 + 气泡提示指向右上角音效开关

### 2.2 确定性 BGM 匹配机制（杜绝 Math.random）
三层匹配：
1. `scenes-bgm.ts` 手动 trackId/altTrackIds → 直接播放指定曲目
2. `hash(sceneId + mood) % tracks.length` → 确定性选曲
3. `inferMoodFromSceneId(sceneId)` → 拼音关键词推断默认情绪

- 20 种基础情绪，每种 8~16 首曲目；5 个别名映射（gentle/sinister/idyllic/emotional/reminisce）
- `useBgmPlayer.ts` 交叉淡入淡出，杜绝多曲重叠，支持 pause/resume
- `bgm-keywords.ts` 关键词权重打分 + 说话人情绪提示 + 冷却机制
- 关键场景（如涿鹿战场）配置 trackId 与情绪切换 altTrackIds

---

## 三、美术素材更新

### 3.1 图鉴立绘（archive-figures/，黑神话悟空融合风格）
- 全量重做 303+ 角色 `full-default.jpg`
- 半身角色卡构图：融合黑神话悟空厚重写实材质、英雄选择页强姿态强光影、国风历史海报层次（卷轴/地图/事件小景/山水/宫阙）
- 衣服主色为朱红/孔雀蓝/青绿/玉白/暗金/青铜绿/赭黄/紫红等鲜明颜色，禁止全黑衣服/全黑背景
- 面部真实皮肤纹理/细微毛孔/雨水湿润/眼周阴影/电影侧光，避免动画感和塑料磨皮脸
- 默认不手持道具，优先负手/拂袖/踏步/回身/披风/手藏袖中表现气势
- 短而修整的胡须，禁止猴脸/猿相/兽化/凸嘴/夸张眉骨
- AI 水印右下角轻裁切处理

### 3.2 对话框立绘修复（figures/）
- 透明背景抠图，消除人物外围白框/黑框
- 21 张异常角色 PNG 重生成（蚩尤/羲和/共工/皋陶/姒岳/娥皇/女英/商均/羿/有扈氏/启/桀/商汤 等）
- 96 张严重问题图重建，135 张 alpha 补洞（头饰/衣甲内部透明碎片）
- 移除 AI 生成水印，分辨率 1680x2240

### 3.3 场景背景去水印（backgrounds/wudi/）
- 去除背景图中文字/水印（如「扶摇」「AI生成」等）

---

## 四、BGM 与音效音频素材

- `public/assets/bgm/`：覆盖 20 种情绪的 BGM 曲目（battle/cheerful/court/danger/dark/death/epic/march/melancholy/mournful/mystery/nostalgic/peaceful/romantic/sad/solemn/sorrow/tension/tragic/triumph），每类多首变体
- `public/assets/sfx/`：10 个音效（click/fail/hint/hover/ink/page/scroll/select/success/unlock）

---

## 五、剧情脚本扩展

### 5.1 新增番外（extras/）
覆盖黄帝/尧舜/夏商周/春秋战国/楚汉/汉初/诸子各篇章：
- 黄帝篇：涿鹿九黎、阪泉农夫、苍颉、嫘祖、皋陶、涂山、许由、祝融、蜀山等
- 尧舜篇：丹朱仆从、娥皇女英、农夫、洪水、四方 border/peasant
- 夏商周：太伯系列、商均、桀、伊尹、太甲、祖己、微子、文种
- 春秋战国：秦穆公系列、伍子胥、专诸、聂政、豫让、荆轲
- 楚汉：陈胜大泽乡、刘邦沛乡、项羽垓下、英布郦山、彭越巨野、韩信漂母、张良黄石公
- 汉初：晁错东宫、汉文怠政、吕后宫人、周勃北军、周亚夫细柳
- 诸子：庄子、邹衍

### 5.2 新增群像剧情（qunxiang）
- 国杰/荆轲/巨孟/聂政/豫让/专诸/诸克 群像 ink 脚本
- miaogong-qin、taibo-xizhou 章节
- inkStories/qunxiang.ts、storylines/qunxiang.ts、storyFlow.ts

### 5.3 章节脚本调整
- 50 个章节 .ink 脚本内容修订（选项完整性、NPC 侧面叙述等）
- inkStories/{chuhan,hanchu,index,qin,wudi,xizhou}.ts、storylines 同步更新

---

## 六、角色图鉴生平历程 + 思维导图

- 新增 `MindMap.tsx` 三层径向布局思维导图，按身份分色节点，关联人物/事件群连线
- `ArchiveDetailPage` 增加 Tab 切换：时间线 / 关联人物
- 120+ 核心角色生成生平历程（related_ids + event_group），其余用 `getPassagesFor()` 拆分
- sessionStorage 保持跳转时抽屉打开
- 抽屉 z-index 修复（导航栏遮挡弹窗问题）

---

## 七、Codex/Panorama 知识库页面

- CodexPage / EndingsCodexPage / KnowledgeCodexPage 三套页面与样式
- 配套 butterfly/knowledge/quiz 数据（wudi-butterfly/wudi-knowledge/wudi-quiz）
- Panorama 新增 ButterflyTimeline / StoryFlow 组件，样式扩展
- Play 侧新增 ImpactCard / LearnPanel 学习面板

---

## 八、小游戏合集（15 个）

新增 15 个小游戏：arrow / astro / beacon / card / channel / ding / forge / formation / linxiangru / logistics / match3 / point / quyuan / unify / zhuhou / zongheng，配套 GameHost/minigames.css/index 接入。

---

## 九、引擎/页面/配置迭代

- Play 页面：VNEngine/CharacterSprite/SceneBackground/ClearScreen/DeathScreen/DialogueBox 迭代
- 动态场景组件：CameraRig/DynamicScene/SceneTransition/WeatherParticles/sceneMoods
- 引擎：engine/{IStoryRunner,shijiInkAdapter,types}、hooks/{useBgmPlayer,useStory}、lib/{bgmMatcher,sfx}
- 数据：data/{bgm,scenes-bgm,characters,series}.ts 更新，sceneAssets/base.ts 重构
- store/{uiStore,userStore}、types/progress、components/{Auth,Layout,ui}
- pages/{Home,Story} 更新
- packages/ink-vn-core、vite.config.ts、App.tsx、index.css

---

## 十、项目 skills（.trae/skills/）

- `bgm-management`：BGM 管理工具
- `scene-video-gen`：场景视频生成
- `story-expansion`：剧情扩展辅助

---

## 十一、.gitignore 维护

- 排除立绘处理中间产物（`*.bak`、`*.pre-*-bak`）
- 排除顶层一次性脚本（`*.py`/`*.cjs`/`*.mjs`/`*.ps1`/`*.js`/`*.json`/`*.txt`/`*.html`）
- 排除临时目录（`_temp_fix/`、`ink_structs/`、`scripts/`）
- 排除原始 BGM 素材包目录（仅本地参考）
- 排除预览/测试临时页面

---

## 测试要点

1. **首次进入起源**：清空 `cysj-sfx-chosen`/`cysj-sfx`/`cysj-bgm` 三个 localStorage key，进入「起源 · 穿越轩辕」应看到青月问语弹窗，此时无 BGM
2. **BGM 确定性**：同一场景多次进入，播放的是同一首曲目；快速切换场景无多曲重叠
3. **涿鹿战场**：进入涿鹿之战场景应播放 AI 动态视频，其余场景为纯静态图
4. **角色图鉴**：刷新页面查看 303+ 角色新立绘，点击角色查看生平历程与思维导图
5. **对话框立绘**：剧情中立绘透明背景，无人像外白框/黑框
6. **抽屉弹窗**：角色图鉴跳转时抽屉不被导航栏遮挡
7. **小游戏**：各小游戏可正常进入

---

## 验证步骤

```bash
npm install && npm run dev   # 默认 http://localhost:5173
# 清空 localStorage keys: cysj-sfx-chosen / cysj-sfx / cysj-bgm 后进入起源验证
```
