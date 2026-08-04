---
name: "story-expansion"
description: "Expands visual novel story chapters by adding exploration options, NPC side narratives, and ensuring option completeness. Invoke when user asks to expand/extend story chapters, add options, or fix missing follow-up content in ink files."
---

# Story Expansion Workflow

This skill guides the expansion of story chapters in the timeslip-shiji visual novel project, based on the workflow validated during Chapter 1 (黄帝篇) expansion.

## When to Use

- User asks to expand/extend a chapter's story content
- User asks to add more options to existing scenes
- User reports "选项没有下文" (options have no follow-up content)
- User asks to add NPC side narratives (侧面叙述)
- User asks to fix broken option chains

## Project Structure

```
src/react-app/data/stories/ink/          # Ink story files
├── huangdi-qiyuan.ink                    # 黄帝篇·起源
├── huangdi-banquan.ink                   # 黄帝篇·阪泉之战
├── huangdi-zhuolu.ink                    # 黄帝篇·涿鹿之战
├── huangdi-zhitianxia.ink               # 黄帝篇·治天下
├── extras/                               # NPC番外故事
│   ├── extra-leizu.ink                   # 嫘祖养蚕
│   ├── extra-cangjie.ink                 # 仓颉造字
│   └── ...
src/react-app/data/stories/inkStories/    # Story registration (TS)
├── wudi.ts                               # 五帝本纪注册
├── chuhan.ts                             # 楚汉传奇注册
└── ...
src/react-app/engine/shijiInkAdapter.ts   # Story engine adapter
packages/ink-vn-core/src/inkRunner.ts     # Ink runtime (inkjs)
scripts/verify-all.mjs                    # Verification script (ALL files)
scripts/verify-ink.mjs                    # Verification script (main only)
```

## Ink File Conventions

### Knot Naming

| Pattern | Purpose | Example |
|---------|---------|---------|
| `c_xxx` | Main story choice node | `c_binfu`, `c_win`, `c_end` |
| `c_explore_xxx` | Exploration sub-node | `c_explore_banquan_fenghou` |
| `c_death_xxx` | Death ending node | `c_death_conquer`, `c_death_rash` |
| `c_xxx_yyy` | Sub-choice within a scene | `c_win_buzhong`, `c_win_yandi_later` |
| `if_xxx_1` | If-line alternative ending | `if_erfen_1`, `if_zhaofu_1` |

### Tags

| Tag | Purpose | Example |
|-----|---------|---------|
| `#correct` | Marks a valid option (NOT a wrong choice) | `* #correct [选项文本]` |
| `#death:ID` | Marks death ending | `#death:conquer` |
| `#ending:canon` | Canon (正史) ending | `#ending:canon` |
| `#ending:if_xxx` | If-line alternative ending | `#ending:if_erfen` |
| `#impact:ID` | Historical impact card | `#impact:bianfa` |
| `#show:char:emotion:pos` | Show character sprite | `#show:qingyue:smile:float` |
| `#speaker:Name` | Set speaker name | `#speaker:青月` |
| `#bg:scene_id` | Change background | `#bg:zhuolu_field` |
| `#hint:text` | Hint text for option | `#hint:修德振兵` |
| `#bgm:trackId` | Change BGM | `#bgm:wudi_main` |

### Option Syntax

```ink
* [选项文本]
    #show:qingyue:calm:float
    对话内容... #speaker:青月
    -> next_node

* #correct [探索型选项文本]
    -> c_explore_xxx

* #correct #hint:提示文本 [关键选项]
    -> c_win
```

## CRITICAL: #correct Tag Rule

**This is the #1 cause of "选项没有下文" bugs.**

### The Problem

The engine's strict mode (正史模式) logic in `shijiInkAdapter.ts`:

1. If an option group contains any `#correct` option
2. Player selects an option WITHOUT `#correct`
3. Engine probes (`probeSurvives`) and finds it doesn't lead to death
4. → Triggers `strictFail`, returns **empty content + death state**
5. → Player sees blank screen / immediate death

### The Rule

**In any option group that contains at least one `#correct` option, ALL non-death options MUST also have `#correct`.**

Only options that lead to `#death:xxx` should NOT have `#correct`.

```ink
=== c_battle ===
* #correct [正面交锋——三战定胜负]        ← correct, main path
    -> c_win
* [贸然出击，不等诸侯之师]                 ← death, NO #correct
    -> c_death_rash
* #correct [召见风后，询问虚实]            ← exploration, MUST have #correct
    -> c_explore_banquan_fenghou
* #correct [遣使谈判]                      ← exploration, MUST have #correct
    -> c_battle_negotiate
```

### How to Check

Run this to find all affected options:
```
Grep for "#correct" in the ink file → find option groups with #correct
→ check if any non-death options in the same group lack #correct
```

## NPC Side Narrative Pattern (侧面叙述)

### Design Principles

1. **Embedded in main flow**: NPC narratives are directly inserted into the main story flow, NOT separate selectable options
2. **After key decisions**: Placed after major policy/war decisions, before transitioning to next scene
3. **Common people perspective**: Shows how policies affect ordinary people (farmers, craftsmen, fishermen)
4. **Based on historical facts**: Content grounded in 《史记》and related historical sources

### Implementation Pattern

```ink
=== c_binfu_next ===
#show:qingyue:calm:float
「修德振兵成功了。你安抚百姓，操练士卒...」 #speaker:青月
// ... main story dialogue ...

// ↓ NPC side narrative (embedded, not a choice)
#show:qingyue:calm:float
「这件事，落到了一个叫阿禾的农夫身上——」 #speaker:青月
// ... NPC perspective dialogue showing impact ...
// ... ends with a thematic closing line ...

// ↓ Transition back to main story
#show:qingyue:tease:float
「不过嘛，有个人还没服你。」 #speaker:青月
-> c_next_scene
```

### NPC Characters Created for Chapter 1

| NPC | Identity | Scene | Impact Shown |
|-----|----------|-------|-------------|
| 阿禾 | 有熊氏农夫 | 阪泉之战后 | 修德振兵→荒地长苗、仓有余粮 |
| 阿铜 | 九黎铜匠 | 涿鹿之战后 | 禽杀蚩尤→铸刀变铸锄、九黎融入华夏 |
| 阿海 | 东海渔翁 | 治天下·巡行后 | 巡四方→赋减三成、海边人日子变了 |
| 阿苗 | 中原农妇 | 治天下·顺天时后 | 农时历→十猜八中、孩子吃到整鸡蛋 |

## Exploration Option Expansion Pattern

When expanding thin exploration options (options with only 1-2 lines before returning):

```ink
=== c_explore_xxx ===
// Original: 1 line → return
// Expanded: rich content + 3 sub-options

#show:qingyue:calm:float
风后答道：「...」 #speaker:风后
#show:qingyue:tease:float
「后来它变成了你手里那个叫compass的小圆盒...」 #speaker:青月
// ... more context ...

* #correct [追问细节1]
    #show:qingyue:calm:float
    「详细回答...」 #speaker:青月
    -> return_node
* #correct [追问细节2]
    #show:qingyue:calm:float
    「详细回答...」 #speaker:青月
    -> return_node
* #correct [继续主线]
    -> return_node
```

## Verification Workflow

### Step 1: Check for compilation errors
```bash
node scripts/verify-all.mjs
```
This checks ALL ink files (main + extras) for:
- Compilation errors
- Dead-end options (选择后无文本且无选项)

### Step 2: Check #correct tag coverage
Manually verify: for every option group with `#correct`, all non-death options also have `#correct`.

### Step 3: TypeScript compilation
```bash
npx tsc --noEmit
```

### Step 4: Clear cache and restart
```bash
# Stop dev server
# Clear Vite cache
Remove-Item -Recurse -Force node_modules\.vite
# Restart
npm run dev
```

### Step 5: Browser test
- Use `Ctrl+Shift+R` to force refresh
- Test in BOTH 正史模式 and 自由模式
- For each option group, try every option and verify follow-up content appears

## Story Expansion Checklist

For each chapter to expand:

- [ ] Read all existing ink files for the chapter
- [ ] Identify thin exploration options (1-2 lines before return)
- [ ] Add sub-nodes with 2-3 options each for thin areas
- [ ] Add NPC side narratives after key decisions
- [ ] Ensure ALL non-death options in #correct groups have #correct
- [ ] Verify no dead-end options with `verify-all.mjs`
- [ ] Run `npx tsc --noEmit`
- [ ] Clear Vite cache and restart dev server
- [ ] Test in browser with Ctrl+Shift+R
- [ ] Test both 正史模式 and 自由模式

## Common Pitfalls

1. **Forgetting #correct on exploration options** → causes "没有下文" in 正史模式
2. **Using non-existent background IDs** → check `base.ts` for valid scene IDs
3. **Cross-file knot references** → ink doesn't support cross-file `->` diverts
4. **Extras not registered** → new extras must be registered in `inkStories/<series>.ts`
5. **Vite cache** → always clear `node_modules/.vite` after ink file changes
