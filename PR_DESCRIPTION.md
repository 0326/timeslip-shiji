# PR: 青月系统形象 & BGM 制作最终方案

## 概述

本 PR 落地「起源 · 穿越轩辕」开头的青月音效选择系统、橙光式新手指引，以及覆盖全部章节/番外的确定性 BGM 匹配机制。目标：所有玩家在同一场景听到同一曲目，BGM 可随时开关且默认关闭，青月形象在首次进入时引导用户做出音效选择。

---

## 一、青月系统形象

### 1.1 交互流程

```
玩家进入「起源 · 穿越轩辕」(storyId = "huangdi:qiyuan")
        │
        ▼
   青月问语弹窗（此时无 BGM）
   ┌──────────────────────────────┐
   │     — 青月问语 —              │
   │  [ 默认关闭音效 ]              │
   │  [ 开启音效（沉浸感更强哦）]   │
   └──────────────────────────────┘
        │
   ┌────┴────────────────┐
   │选「开启音效」        │选「默认关闭」
   │ sfx=on bgm=on       │ sfx=off bgm=off
   │ 显示新手指引 ──┐     │
   │                ▼     │
   │  金色脉冲光圈 + 虚线   │
   │  连线 + 气泡提示       │
   │  指向右上角音效开关     │
   │  （点击任意处关闭）     │
   │                       │
   └───────────────────────┴──▶ 正式进入剧情
```

### 1.2 关键约束

- 弹窗 **仅在** `storyId === "huangdi:qiyuan"` 且未做过选择时显示
- 其他故事线直接使用已保存的选择，不再弹窗
- 音效 / BGM **默认关闭**，只有显式选择「开启音效」才打开
- 选择状态持久化到 `localStorage`，key 与职责如下：

| localStorage key | 含义 | 写入时机 |
|------------------|------|----------|
| `cysj-sfx-chosen` | 是否已做过首次选择 | 青月弹窗选择后写 `true` |
| `cysj-sfx` | 音效开关 | HUD 切换音效时写 `on`/`off` |
| `cysj-bgm` | BGM 开关 | HUD 切换 BGM 时写 `on`/`off` |

- 起源故事内，**连续点击右上角音效按钮 5 次（1.2 秒内）** 可清除 `cysj-sfx-chosen`，重新体验引导流程（便于测试与回归验证）
- 点击弹窗区域不会推进游戏剧情（`stopPropagation` + `handleWrapClick` 守卫）

### 1.3 新手指引视觉

复用抉择面板 `vn-choices` / `choice-btn` 结构，统一八边形金色边框风格：

- `.sfx-intro-overlay` 全屏遮罩承载青月问语弹窗
- `.sfx-guide-overlay` 半透明遮罩 + `.sfx-guide-pulse` 金色脉冲光圈
- `.sfx-guide-svg` 虚线连线（`stroke-dasharray: 4 4`）从光圈指向右上角按钮
- `.sfx-guide-bubble` 气泡提示「青月的小提示：游戏中可自行打开或关闭音效」

### 1.4 右上角 HUD 按钮

所有控制按钮加 `data-tip` 属性，CSS `::after` 实现中式风格悬停提示框（庄重/自动播放/音效/BGM 等）。

---

## 二、BGM 制作最终方案

### 2.1 三层确定性匹配机制

```
场景切换
   │
   ▼
1. scenes-bgm.ts 手动 trackId/altTrackIds   ── 命中 ──▶ 直接播放指定曲目
   │（未命中）
   ▼
2. hash(sceneId + mood) % tracks.length     ── 命中 ──▶ 确定性选曲
   │（新增场景未配置）
   ▼
3. inferMoodFromSceneId(sceneId)           ── 拼音关键词推断默认情绪
```

> 设计目标：**杜绝 `Math.random()`**，同一场景所有玩家听到同一首曲子，便于复盘与协作。

### 2.2 情绪体系

20 种基础情绪（`bgm.ts` 的 `Mood` 类型），每种情绪 8~16 首曲目。新增 5 个别名映射，兼容 `.ink` 文件中的 `#bgm:<alias>` 标签：

| 别名 | 映射到 | 使用场景 |
|------|--------|----------|
| `gentle` | `peaceful` | 番外 · 嫘祖 |
| `sinister` | `dark` | 桀亡国 |
| `idyllic` | `peaceful` | 李斯 |
| `emotional` | `melancholy` | 廉颇蔺相如 |
| `reminisce` | `nostalgic` | 荆轲 |

### 2.3 场景 BGM 配置示例（scenes-bgm.ts）

```ts
// 关键场景手动指定 trackId（确定性 + 情绪切换配对 altTrackIds）
{ sceneId: "zhuolu_field", defaultMood: "battle", trackId: "battle_01",
  keywords: ["涿鹿", "蚩尤"],
  altMoods: [
    { mood: "tension", trigger: "雾" },
    { mood: "triumph", trigger: "擒杀" },
    { mood: "tragic", trigger: "屠" }
  ],
  altTrackIds: [
    { mood: "tension", trackId: "tension_02" },
    { mood: "triumph", trackId: "triumph_02" },
    { mood: "tragic", trackId: "tragic_03" }
  ]
}

// 番外新增场景（本次补全）
{ sceneId: "shun_hall", defaultMood: "court", trackId: "court_03",
  keywords: ["舜堂", "皋陶"] }
```

### 2.4 BGM 播放器（useBgmPlayer.ts）

- 交叉淡入淡出（crossfade）两路 `<audio>`，避免硬切
- 切换前清理残留 audio 元素，**杜绝多曲重叠**
- 暴露 `pause` / `resume`，响应 HUD 开关即时停播/续播
- 浏览器自动播放策略：监听首次 `click`/`keydown` 后启动待播放列队

### 2.5 关键词与说话人提示（bgm-keywords.ts）

- `KEYWORD_RULES`：按权重打分，≥6 强触发、≥3 弱触发
- `STRONG_EMOTION_TRIGGERS`：单字强触发（杀/火/胜/跪…）
- `WEAK_EMOTION_TRIGGERS`：弱情绪累积 5 回合，≥3 票才切换
- `SPEAKER_MOOD_HINT`：说话人对应默认情绪（青月→mystery、舜→solemn…）
- 冷却：`coolDownTurns = 10`，避免情绪频繁切换

---

## 三、修改文件清单

| 文件 | 改动要点 |
|------|----------|
| `src/react-app/pages/Play/VNEngine.tsx` | 青月问语弹窗、新手指引、5 连击重置、HUD 悬停提示 |
| `src/react-app/pages/Play/Play.css` | `.sfx-intro-*` / `.sfx-guide-*` 样式、`data-tip` 悬停框 |
| `src/react-app/pages/Play/DialogueBox.tsx` | 打字动画 `useEffect` 依赖改为 `seg?.text`，修复卡顿 |
| `src/react-app/store/uiStore.ts` | `bgmEnabled` 持久化、默认关闭；清理未使用的 `hasChosenSfx` 死代码 |
| `src/react-app/lib/sfx.ts` | `readEnabled` 默认返回 `false`，仅 `cysj-sfx==="on"` 才开启 |
| `src/react-app/hooks/useBgmPlayer.ts` | 新增 `pause`/`resume`，响应开关即时停播/续播 |
| `src/react-app/data/bgm.ts` | 新增 5 个情绪别名 `gentle/sinister/idyllic/emotional/reminisce` |
| `src/react-app/data/scenes-bgm.ts` | 新增 `shun_hall` 等场景配置；关键场景补 `trackId`/`altTrackIds` |
| `src/react-app/data/bgm-keywords.ts` | 关键词规则、说话人情绪提示、强/弱触发器 |
| `src/react-app/lib/bgmMatcher.ts` | 三层匹配 + `inferMoodFromSceneId` 场景推断 |
| `public/assets/bgm/` | BGM 音频素材目录（需随 PR 一并同步） |

---

## 四、测试要点

1. **首次进入起源**：清空 `cysj-sfx-chosen` / `cysj-sfx` / `cysj-bgm` 三个 localStorage key，进入「起源 · 穿越轩辕」应看到青月问语弹窗，此时无 BGM
2. **选择开启音效**：弹窗消失 → 新手指引出现 → 关闭指引后 BGM 正常播放
3. **选择默认关闭**：弹窗消失 → 无指引 → BGM 保持关闭，剧情静默推进
4. **退出再返回起源**：不再弹窗，沿用上次选择
5. **5 连击重置**：起源内 1.2 秒内连点右上角音效按钮 5 次，`cysj-sfx-chosen` 被清除，可重新触发引导
6. **BGM 不重叠**：快速切换场景 / 多次 `playTrack` 调用，确认任意时刻只有一首 BGM 在播
7. **确定性**：同一场景多次进入，播放的是同一首曲目
8. **番外场景**：进入「舜堂」「皋陶断狱」等新增场景，BGM 正确匹配
9. **打字动画**：连续点击推进剧情，对话框不出现卡顿/重置闪烁

---

## 五、已知约束 / 后续

- AI 动态视频生成受平台每日配额限制（约 5 条/天），关键场景（如涿鹿战场）已生成动态视频，其余场景使用静态图，无 CSS 动画/粒子特效干扰
- BGM 默认关闭，不会随页面加载自动播放（符合浏览器自动播放策略）
- 本次 PR 已清理 `uiStore.ts` 中未被引用的 `hasChosenSfx` / `markSfxChosen` 死代码（原用 sessionStorage，与 VNEngine 使用的 localStorage 不一致）

---

## 六、验证步骤

```bash
# 1. 拉取分支后，同步音频素材目录（public/assets/bgm/ 需完整复制）
#    音频文件不纳入版本控制，需手动同步

# 2. 安装依赖并启动开发服务器
npm install && npm run dev   # 默认 http://localhost:5173

# 3. 清空 localStorage 三个 key 后进入起源，验证首次引导流程
#    localStorage keys: cysj-sfx-chosen / cysj-sfx / cysj-bgm
```
