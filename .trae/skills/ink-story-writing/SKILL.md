---
name: "ink-story-writing"
description: "Creates ink-based visual novel chapters for the Timeslip Shiji project. Invoke when writing new story chapters, adding ink narratives, or creating story content using the ink scripting language."
---

# Ink Story Writing Skill — 穿越·史记 ink 章节创作指南

本技能沉淀了 ink 引擎集成的经验教训、标签规范、文件结构和最佳实践，用于指导新章节的创作，避免踩坑。

## 目录
1. [快速开始](#快速开始)
2. [ink 文件结构规范](#ink-文件结构规范)
3. [标签系统完整参考](#标签系统完整参考)
4. [文件注册与集成流程](#文件注册与集成流程)
5. [死亡结局配置规范](#死亡结局配置规范)
6. [成就触发规范](#成就触发规范)
7. [常见坑点与避坑指南](#常见坑点与避坑指南)
8. [完整模板示例](#完整模板示例)
9. [测试检查清单](#测试检查清单)

---

## 快速开始

创建新章节只需要 3 步：

1. 在 `src/react-app/data/stories/ink/` 下创建 `.ink` 文件
2. 在 `src/react-app/data/stories/inkStories.ts` 注册故事配置
3. 在 `src/react-app/data/storylines.ts` 添加故事线入口

---

## ink 文件结构规范

### 基本文件骨架

```ink
// ═══════════════════════════════════════════════
// <人物> · 第<N>章 · <章节名>
// 史源：《史记·<列传名/本纪名>》
// ═══════════════════════════════════════════════

-> <chapter_start>  // 入口节点必须用 diverts 跳转

=== <chapter_start> ===
// 开场：场景、BGM、第一段旁白
#bg:<background_id>
#bgm:<music_id>
<开场旁白文字> #speaker:旁白

// 显示角色立绘
#show:<char_id>:<expression>:<position>
<角色对话> #speaker:<角色名>

// 选择分支（必须在所有对白之后）
* #correct #hint:<历史原文提示> [正确选项文本] -> <good_ending_knot>
* [错误选项文本] -> <death_knot>

=== <good_ending_knot> ===
// 正确选择后的剧情
#hide:<char_id>  // 隐藏不需要的立绘
#achieve:<achievement_id>  // 触发成就
<后续剧情文本>
-> END  // 或 -> next_chapter

=== <death_knot> ===
#death:<death_id>
#reason:<死亡原因简述>
#classical:<史记原文>
#analysis:<历史分析>
<死亡结局对白>
-> END
```

### 节点命名规范

- 使用有意义的节点名，格式：`<章节>_<场景>` 或 `<章节>_<结局类型>`
- 入口节点建议：`c1_intro`、`c2_opening` 等
- 死亡节点：`c1_death_<action>`，如 `c1_death_kill`
- 通关节点：`c1_pass`、`c1_ending`

---

## 标签系统完整参考

所有标签以 `#` 开头，写在**行首**（舞台效果）或**行尾**（对白属性）。

### 🎬 舞台效果标签（行首，立即触发）

| 标签 | 格式 | 说明 | 示例 |
|------|------|------|------|
| `#bg` | `#bg:<id>` | 切换背景图，同时清空所有立绘 | `#bg:huaiyin_street` |
| `#bgm` | `#bgm:<id>` | 播放背景音乐 | `#bgm:lonely` |
| `#show` | `#show:<id>:<expr>:<pos>` | 显示角色立绘 | `#show:hanxin:smile:center` |
| `#hide` | `#hide:<id>` | 隐藏角色立绘 | `#hide:tuzhong` |

**show 标签参数说明：**
- `<id>`：角色ID（必须在 `characters.ts` 中定义）
- `<expr>`：表情，如 `default`、`smile`、`angry`、`mocking`（可选，默认 `default`）
- `<pos>`：位置，`left`/`center`/`right`（可选，默认 `center`）

### 💬 对白属性标签（行尾，作用于本行）

| 标签 | 格式 | 说明 | 示例 |
|------|------|------|------|
| `#speaker` | `#speaker:<name>` | 设置说话人 | `你好。 #speaker:韩信` |
| `#hint` | `#hint:<text>` | 添加原文提示（显示"原文提示"按钮） | `『信能死...』 #speaker:少年 #hint:于是信孰视之...` |

**注意：** 不带 `#speaker` 的对白默认为"旁白"。

### 🔘 选项标签（写在选项文本前）

| 标签 | 格式 | 说明 | 示例 |
|------|------|------|------|
| `#correct` | `#correct` | 标记为历史正确选项 | `* #correct [正确选项] -> target` |
| `#hint` | `#hint:<text>` | 选项的提示文本 | `* #hint:孰视之——这是隐忍 [选项文本] -> target` |

**选项完整格式：**
```ink
* [#correct] [#hint:<提示>] [选项显示文本] -> <目标节点>
```

### 💀 死亡标签（死亡节点行首）

| 标签 | 格式 | 说明 |
|------|------|------|
| `#death` | `#death:<id>` | 标记死亡结局，id 用于在 inkStories.ts 中查找详情 |
| `#reason` | `#reason:<text>` | （可选）内联死亡原因，覆盖配置文件 |
| `#classical` | `#classical:<text>` | （可选）内联史记原文，覆盖配置文件 |
| `#analysis` | `#analysis:<text>` | （可选）内联历史分析，覆盖配置文件 |

**推荐：** 优先使用配置文件（inkStories.ts）管理死亡详情，ink 文件中只写 `#death:<id>`。

### 🏆 成就标签（任意位置行首）

| 标签 | 格式 | 说明 |
|------|------|------|
| `#achieve` | `#achieve:<id>` | 触发成就解锁，id 必须在 `achievements.ts` 中定义 |

```ink
=== c1_pass ===
#achieve:xiakua  // 解锁"胯下之辱"成就
你定定地看了他许久...
```

---

## 文件注册与集成流程

### 步骤 1：创建 .ink 文件

位置：`src/react-app/data/stories/ink/<storykey>-<chapter>.ink`

示例：`src/react-app/data/stories/ink/hanxin-c1.ink`

### 步骤 2：在 inkStories.ts 注册

文件：`src/react-app/data/stories/inkStories.ts`

```typescript
import hanxinC1Source from "./ink/hanxin-c1.ink?raw";
// 导入更多章节...

export const inkStories: Record<string, InkStoryConfig> = {
  "hanxin:c1": {
    key: "hanxin:c1",                                    // storyKey，格式：<人物>:<章节>
    title: "兵仙韩信 · 第一章 · 胯下之辱",               // 章节标题
    source: hanxinC1Source,                              // ?raw 导入的 ink 源
    precompiled: false,                                  // 开发时用 false（运行时编译）
    deaths: {                                            // 死亡结局配置
      kill: {                                            // 对应 #death:kill
        reason: "因一时之忿杀人，亡命天涯，兵仙就此夭折",
        classical: "于是信孰视之，俛出袴下，蒲伏。",
        analysis: "史上的韩信选择了钻胯下。杀掉那个无赖...",
      },
      // 更多死亡...
    },
  },
  // 更多章节...
};
```

**重要：** `?raw` 后缀是 Vite 特性，必须加上，否则会被当作模块解析而非原始文本。

### 步骤 3：在 storylines.ts 添加入口

文件：`src/react-app/data/storylines.ts`

```typescript
{
  id: "hanxin_c1_ink",                          // 故事线 ID，必须以 _ink 结尾（跳过角色解锁检查）
  title: "[Ink引擎] 胯下之辱",                  // 标题
  subtitle: "第一章 · Ink引擎测试版",            // 副标题
  era: "chu_han",                               // 时代
  year: "公元前 230 — 196 年",
  cover: "#2d7a4f",                             // 封面色
  glyph: "ink",                                 //  glyph 字符
  description: "...",
  estimatedMinutes: 3,
  difficulty: 1,
  focusCharacter: "hanxin",                     // 主角
  relatedCharacters: ["hanxin"],                // 相关角色（暂时只放主角，避免API错误）
  perspectives: [
    {
      characterId: "hanxin",
      storyKey: "hanxin:c1",                    // 对应 inkStories 中的 key
      unlockedBy: "hanxin",
      nodeCount: 1,
    },
  ],
},
```

**注意：**
- 测试阶段 `id` 必须以 `_ink` 结尾，这样会跳过角色解锁检查
- `relatedCharacters` 暂时只放主角，避免未实现的角色导致API错误

---

## 死亡结局配置规范

死亡结局有两种配置方式，**推荐使用配置文件方式**（方便统一管理和多语言支持）。

### 方式一：配置文件（推荐）

在 `inkStories.ts` 的 `deaths` 字段中配置：

```typescript
deaths: {
  <death_id>: {
    reason: "一句话概括死亡原因（不超过30字）",
    classical: "史记原文引用，带句号",
    analysis: "历史分析，解释为什么这个选择是错的，历史上正确选择是什么（100字左右）",
  },
}
```

### 方式二：ink 内联标签

在死亡节点直接写标签：

```ink
=== c1_death_kill ===
#death:kill
#reason:因一时之忿杀人，亡命天涯
#classical:于是信孰视之，俛出袴下，蒲伏。
#analysis:杀掉那个无赖便要亡命逃匿...
你一剑刺出，少年当场毙命。
-> END
```

内联标签会覆盖配置文件中的值。

---

## 成就触发规范

1. 成就ID必须在 `src/react-app/data/achievements.ts` 中预先定义
2. 在ink中用 `#achieve:<id>` 触发，通常放在正确选择后的段落开头
3. 可以在一个段落中触发多个成就（每行一个）

```ink
=== c1_ending ===
#bg:palace
#achieve:xiakua
#achieve:bingxian_born
多年之后，你登坛拜将...
```

---

## 常见坑点与避坑指南

### ❌ 坑1：忘记 `-> <knot>` 入口跳转

**症状：** 故事从第一个 `===` 节点开始执行，忽略你写的开场。

**正确写法：** 文件开头必须有显式 diverts：
```ink
-> c1_intro    // ✅ 必须有！
=== c1_intro ===
...
```

### ❌ 坑2：标签位置错误

**舞台效果标签**（`#bg`, `#show`, `#hide`, `#bgm`, `#achieve`, `#death`）必须在**行首**：
```ink
#bg:huaiyin_street    // ✅ 行首
淮阴。你是韩信... #speaker:旁白
```

**对白属性标签**（`#speaker`, `#hint`）必须在**行尾**：
```ink
淮阴。你是韩信... #speaker:旁白    // ✅ 行尾
#speaker:旁白 淮阴。你是韩信...    // ❌ 错误！
```

### ❌ 坑3：选项和正文混排

选项（`* [...] ->`）必须在所有对话文本**之后**，不能穿插在正文中间：
```ink
=== c1_intro ===
对白1...
对白2...
对白3...
                    // ✅ 所有对白结束后再写选项
* [选项1] -> ...
* [选项2] -> ...
```

### ❌ 坑4：#show 和 #bg 的顺序

`#bg` 会**清空所有立绘**！所以顺序很重要：
```ink
#bg:new_scene      // 先切背景（会清空立绘）
#show:char:a:right // 再显示新场景的立绘 ✅
```

如果反过来，立绘会被清空：
```ink
#show:char:a:right // 先显示立绘
#bg:new_scene      // 再切背景 → 立绘被清空！❌
```

### ❌ 坑5：保存/加载时空对白

**这是已修复的引擎bug，你不需要处理，但要知道：**
- InkRunner 内部使用 checkpoint 机制，在段落开始时自动保存快照
- 不要在 adapter 外部手动调用 `runner.snapshot()` 来保存游戏状态
- 使用 `adapter.getSaveState()` / `adapter.loadSaveState()` 即可

### ❌ 坑6：relatedCharacters 包含未实现角色

**症状：** 控制台报错，角色立绘不显示。

**解决：** 测试阶段 `relatedCharacters` 只放主角：
```typescript
relatedCharacters: ["hanxin"],  // ✅ 只放已实现的角色
```

### ❌ 坑7：中文标点和特殊字符

- ink 中可以正常使用中文标点（。，「」『』——）
- 标签中不要包含空格，用下划线或驼峰
- 角色ID和资源ID使用英文小写+下划线

### ❌ 坑8：忘记 -> END

每个结局节点（死亡或通关）必须以 `-> END` 结尾，否则会继续执行下面的节点内容。

---

## 完整模板示例

```ink
// ═══════════════════════════════════════════════
// 兵仙韩信 · 第一章 · 胯下之辱
// 史源：《史记·淮阴侯列传》
// ═══════════════════════════════════════════════

-> c1_intro

=== c1_intro ===
#bg:huaiyin_street
#bgm:lonely
淮阴。你是韩信，家贫无行，不得推择为吏，又不能治生商贾，常从人寄食，人多厌之。 #speaker:旁白
你腰间始终佩着一柄长剑——那是你唯一的体面。 #speaker:旁白
#show:tuzhong:mocking:right
市井屠中，一名少年拦住你，当众羞辱：『你虽长大，好带刀剑，其实胆怯耳！』 #speaker:少年
『信能死，刺我；不能死，出我袴下！』 #speaker:少年 #hint:于是信孰视之，俛出袴下，蒲伏。一市人皆笑信，以为怯。

* [拔剑而起，一剑刺死辱我之人] -> c1_death_kill
* #correct #hint:孰视之——这不是怯懦，是掂量过生死之后的隐忍。 [孰视良久，俯身从他胯下钻过] -> c1_pass

=== c1_death_kill ===
#death:kill
你一剑刺出，少年当场毙命。 #speaker:旁白
你因杀人亡命天涯，兵仙就此夭折。 #speaker:旁白
-> END

=== c1_pass ===
#hide:tuzhong
#achieve:xiakua
你定定地看了他许久，俯身，伏地，从那少年的胯下缓缓爬过。满市的人都笑你怯懦。 #speaker:旁白
可你心里清楚：杀一个无赖，换来的是一条逃亡的命；忍下这口气，留住的是一身将来。 #speaker:韩信
-> c1_ending

=== c1_ending ===
#bg:palace
#achieve:bingxian_born
多年之后，你登坛拜将，成为大汉兵仙。
一柄长剑，半世飘零。从胯下到坛上——这，就是兵仙传奇的开端。 #speaker:旁白
-> END
```

对应的 inkStories.ts 配置：

```typescript
"hanxin:c1": {
  key: "hanxin:c1",
  title: "兵仙韩信 · 第一章 · 胯下之辱",
  source: hanxinC1Source,
  precompiled: false,
  deaths: {
    kill: {
      reason: "因一时之忿杀人，亡命天涯，兵仙就此夭折",
      classical: "于是信孰视之，俛出袴下，蒲伏。",
      analysis: "史上的韩信选择了钻胯下。杀掉那个无赖，他便要亡命逃匿，再无登坛拜将之日。大丈夫能屈能伸——所谓『孰视之』，是看清了忍辱与前程孰轻孰重。",
    },
  },
},
```

---

## 测试检查清单

创建新章节后，按此清单验证：

- [ ] 开发服务器无编译错误（`npm run dev` 控制台无红色报错）
- [ ] 直接访问 `/play/<storyline_id>/<char_id>` 能加载
- [ ] 开场旁白逐字显示，打字效果正常
- [ ] 背景图正确切换
- [ ] 角色立绘正确显示/隐藏
- [ ] 说话人名字正确显示
- [ ] "原文提示"按钮出现并能展开/收起
- [ ] 所有选项可点击
- [ ] 正确选项有视觉标记（绿色/勾）
- [ ] 错误选项触发死亡画面，显示 reason/classical/analysis
- [ ] "重新抉择"按钮能回到选择点
- [ ] 正确选择后剧情继续，成就弹窗出现
- [ ] 通关画面正常显示，有"再玩一遍"按钮
- [ ] 刷新页面后能从存档继续（或重新开始）

### 快速调试命令

访问测试页面验证引擎：
- http://localhost:5177/debug-adapter.html — 测试 ShijiInkAdapter
- http://localhost:5177/ink-test.html — 测试核心 InkRunner

---

## 参考资源

- 已实现章节参考：`src/react-app/data/stories/ink/hanxin-c1.ink`
- 核心引擎：`packages/ink-vn-core/src/inkRunner.ts`
- 适配器：`src/react-app/engine/shijiInkAdapter.ts`
- 标签解析器：`packages/ink-vn-core/src/tagParser.ts`
- ink 官方文档：https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
