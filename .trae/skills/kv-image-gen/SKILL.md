---
name: "kv-image-gen"
description: "Generate and process KV (Key Visual) images for the historical game lobby. Invoke when adding new historical series/eras, generating character illustrations, background scenes, or corner decorations. Covers three-layer image architecture, AI image generation prompts, background removal workflow, and file conventions."
---

# KV Image Generation Skill

穿越·史记游戏大厅KV图生成与处理规范。当需要新增本纪系列、生成角色立绘、背景场景或角装饰时调用此skill。

## 一、三层架构概述

游戏大厅采用三层叠加架构，每层独立生成、独立处理：

```
┌─────────────────────────────────────┐
│  第3层：角色立绘 (char-*.png)        │  透明PNG，偏左定位
├─────────────────────────────────────┤
│  第2层：角装饰 (SVG/CSS)             │  三角形对角线结构，随系列变色
├─────────────────────────────────────┤
│  第1层：全屏背景 (bg-*.jpg)          │  干净场景图，无角花/无角色
└─────────────────────────────────────┘
```

### 存储路径
- 所有KV素材存放于：`public/images/kv/`
- 已配置gitignore，图片文件不入库（通过Cloudflare R2托管）
- 环境变量 `VITE_KV_BASE_URL` 可配置CDN地址，默认 `/images/kv`

### 文件命名规范
```
bg-{series_id}.jpg          # 背景图（JPG，高质量）
char-{series_id}.png        # 角色立绘（PNG，透明背景）
corner-{series_id}-{corner}.png  # 角装饰（PNG，透明背景）[已废弃，改用SVG]
```
其中 `{series_id}` 为系列ID（wudi/yinzhou/shihuang/chuhan），`{corner}` 为角位（tl/tr/bl/br）。

---

## 二、背景图生成规范

### 构图要求
- **尺寸**：16:9 横版，推荐 1920×1080 或更大
- **内容**：纯场景，**不包含任何角色人物**
- **四角留白**：四个角落区域不要有重要元素，角装饰会叠加在这里
- **右侧留白**：画面右侧偏暗/简洁，用于叠加游戏模式按钮
- **中心偏左**：视觉重心可在画面中偏左位置，角色立绘会叠加在此区域
- **风格统一**：中国古风/历史写实风，色调与系列主题匹配

### 各系列背景基调
| 系列 | ID | 色调 | 场景元素 |
|------|-----|------|---------|
| 五帝本纪 | wudi | 金+翠绿，洪荒感 | 涿鹿之野、战云、远古图腾 |
| 殷周本纪 | yinzhou | 青蓝+银白，仙气感 | 渭水、岐山、凤鸣、垂钓 |
| 始皇本纪 | shihuang | 金+赤红，庄严感 | 咸阳宫、长城、兵马俑、秦旗（不要阴森） |
| 楚汉争霸 | chuhan | 赤红+金，悲壮感 | 垓下、乌江、营帐、战旗 |

### 背景图Prompt模板
```
Chinese ancient historical scene, [场景描述], cinematic lighting, 
epic landscape, no people, no characters, no text, no corner decorations, 
clean composition, ancient Chinese architecture style, 
guofeng illustration, digital painting, 16:9 aspect ratio, 
highly detailed, 8k resolution
```

### 重要禁忌
- ❌ 不要在背景中画角色人物（角色是独立图层叠加的）
- ❌ 不要在四个角画祥云/边框装饰（角装饰由SVG/CSS独立绘制）
- ❌ 画面不要太暗或太阴森（尤其是始皇系列）
- ❌ 不要有文字、水印、签名

---

## 三、角色立绘生成规范

### 构图要求（极其重要）
- **尺寸**：竖版，推荐 3:4 比例（如 912×1216），长边≥1216；工具支持更高分辨率时优先用更高的
- **镜头拉远**：贴边截断的根本原因是"full body"类词汇会驱使模型把人物撑满画面。
  **必须在 prompt 里明确要求拉远镜头、角色只占画面高度的 70%~80%**，
  且留白要求以**整体剪影**（含武器尖端、披风、飘带的最远端）计算，不是只看身体：
  - 头顶（含武器上扬端）留 ≥5% 空白
  - 脚底留 ≥8% 空白
  - 左右两侧（含披风/飘带展开端）留 ≥5% 空白
- **姿势要求**：
  - 角色站立或战斗姿态自然
  - 武器/道具不要刺向角色自身；长柄武器倾斜持握（垂直竖持极易顶到上边缘）
  - 多人场景要明确主次，不要拼凑感
- **幕布颜色选择（重要）**：根据角色配色选幕布，避免与角色本体撞色：
  - 默认：绿幕 `#00B140`
  - 角色含**绿色/青色/玉色**元素（玉饰、青铜器、翠色披风、青色铠甲等）→ 改用**品红幕 `#FF00FF`**
  - 抠图脚本会自动从图片边框识别幕布颜色，无需额外配置
  - 不要在背景中画地面、石头、水面等环境元素
  - 不要在角色脚下画投影（后期叠加时会自动处理）

### 风格锚点（所有角色统一使用，保证系列间风格一致）

**生成时必须附带参考图**：参考图已放在 `.trae/skills/kv-image-gen/references/`
（`anime-style-1.jpg` / `anime-style-2.jpg`），每次生成角色立绘时作为图像参考输入
（image reference / style reference / img2img，视生成工具而定）。所有系列使用
**同一组参考图**，这是风格一致性的最大保障；只靠文字 prompt 描述风格必然漂移。
注意只取风格不抄构图（参考图是横版带背景 KV，立绘要纯幕布竖版单人）。

文字风格锚点（固定块，逐字复用，不要每次改写）：
```
premium Chinese gacha game splash art, in the style of Wuthering Waves 
and Genshin Impact character key visuals, crisp clean lineart with 
painterly cel-shaded rendering, saturated jewel-tone palette, 
ornate costume with layered fabric and engraved metal armor details, 
gold filigree accents, iridescent glow effects, dramatic rim lighting, 
dynamic three-quarter camera angle, flowing hair and ribbons with 
sense of motion, masterpiece quality, ultra detailed
```

### 角色立绘Prompt模板
```
[风格锚点块], full body character illustration of [角色描述], 
[服饰细节], [武器/道具], [姿态描述], 
wide shot with camera pulled back, character occupies only 75% of 
frame height, generous empty margins on all sides, entire silhouette 
including weapon tips and cape fully inside the frame, 
complete figure from head to toe, 
solid chroma key background ([#00B140 绿幕 或 #FF00FF 品红幕]), 
no ground, no shadows, no environment, 3:4 aspect ratio
```

### 关键负向Prompt
```
cropped, cut off, truncated, out of frame, partial body, 
touching frame edge, missing feet, missing head, 
ground, floor, water, stones, shadows on background, 
text, watermark, signature, deformed hands, extra limbs, 
unnatural pose, flat dull colors, blurry, low detail, 
western cartoon, 3d render, photorealistic
```

### 各系列角色配置
| 系列 | 角色 | 描述要点 |
|------|------|---------|
| 五帝本纪 | 黄帝+蚩尤 | 二人对战姿态，黄帝居中持剑，蚩尤在侧，不要AI拼凑感 |
| 殷周本纪 | 姜子牙+周文王 | 姜子牙持竿垂钓坐姿，文王站立施礼，不要石头/水面 |
| 始皇本纪 | 秦始皇+荆轲 | 荆轲刺秦瞬间动态，嬴政持剑，不要阴森氛围 |
| 楚汉争霸 | 项羽 | 单角色，霸王冲阵，持戟披风完整，不要截断披风 |

### 出图检查（自动化，必须执行）

**每张图生成后立刻跑自动质检，不要靠肉眼判断贴边：**
```bash
python3 .trae/skills/kv-image-gen/scripts/matting-v4.py <图片路径> --check-only
```
脚本会计算角色整体剪影（含武器/披风最远端）到画面四边的留白比例，
任何一边 ✗ 就**直接重新生成**（在 prompt 里进一步拉远镜头/调整武器角度），
不要试图硬抠或事后修补截断的图。

人工复核项（自动检查覆盖不了的）：
1. ✅ 姿势自然不别扭？武器没有刺到角色自己？
2. ✅ 多人场景没有拼凑感？
3. ✅ 风格与 references/ 参考图一致（线条、上色、饱和度）？
4. ✅ 幕布颜色没有与角色本体大面积撞色？撞色则换幕布色重新生成

---

## 四、角装饰规范

**当前方案已改为SVG/CSS绘制，不再使用图片。** 角装饰采用内联SVG绘制三角形对角线结构：

### CSS定位原则
- 每个角装饰只占角落三角形区域
- 使用 `width: 160px; height: 160px` 的正方形SVG
- 通过CSS transform（scaleX/scaleY(-1)）镜像复用同一个SVG
- SVG内容只画对角线一侧的弧线和祥云纹样
- 使用CSS变量 `--c-accent` 传入当前系列主题色

### SVG结构模板
```svg
<svg width="180" height="180" viewBox="0 0 180 180" fill="none">
  <!-- 对角主线 -->
  <line x1="0" y1="0" x2="180" y2="180" stroke="var(--c-accent)" strokeWidth="1.5" opacity="0.3"/>
  <!-- 外框双线（弧形） -->
  <path d="M0 60 Q0 0 60 0" stroke="var(--c-accent)" strokeWidth="2" fill="none" opacity="0.6"/>
  <path d="M0 80 Q0 10 80 0" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.3"/>
  <!-- 祥云/装饰元素 -->
  <circle cx="20" cy="25" r="8" stroke="var(--c-accent)" strokeWidth="1" fill="none" opacity="0.4"/>
  <!-- 角点 -->
  <circle cx="8" cy="8" r="3" fill="var(--c-accent)" opacity="0.7"/>
</svg>
```

四个角通过CSS镜像实现：
- `tl`：原始
- `tr`：`transform: scaleX(-1)`
- `bl`：`transform: scaleY(-1)`
- `br`：`transform: scale(-1)`（即scaleX(-1) scaleY(-1)）

---

## 五、抠图（背景去除）处理流程

角色立绘生成后需要去除幕布背景转为透明PNG。

### 核心原则（v4，与v3的根本区别）

**幕布图抠图的主力是色度键（chroma key），不是 AI 分割模型。**
v3 用 u2net 直接抠绿幕图是结构性错误：u2net 不知道"幕布色=背景"这个先验，
自己猜前景 —— 猜错就把本体（深色衣物、武器）抠掉，同时它认为是前景的绿色又留下来。
这正是"绿色残留"和"本体被误抠"两个问题的共同根源。

v4（`scripts/matting-v4.py`）的流程：
1. **自动识别幕布色**：从图片四边边框采样（支持绿幕/品红幕，无需配置）
2. **色度键 + 边界连通洪水填充**：只有与画面边界**连通**的幕布色区域才算背景
   —— 角色身上的玉佩、青铜器等绿色元素因为不与边界连通，**不会被误抠**
3. **封闭区域仲裁**：被角色包围的幕布色区域（如手臂与身体间的空隙），
   用颜色相似度 + AI模型（rembg，装了则用）仲裁是空隙还是角色元素；
   AI 只做仲裁，**永远不会单独决定删除本体像素**
4. **despill 去溢色**：清除边缘绿边和铠甲反光上的内部溢色，保护角色自带的绿色元素
5. **边缘平滑**：alpha 1px收缩 + 0.8px高斯模糊，消除幕布色光晕
6. **自动质检报告**：留白检查 + 前景内部幕布色残留提醒

### 环境准备
```bash
pip install pillow numpy scipy --break-system-packages   # 必需
pip install rembg[cpu] --break-system-packages           # 可选但推荐（封闭区域仲裁更准）
```
模型缓存在项目目录：`.u2net/`

### 使用方式
```bash
# 自动扫描 public/images/kv/ 下的 char-*-v*.jpg（每个系列取最新版本号）
python3 .trae/skills/kv-image-gen/scripts/matting-v4.py

# 指定文件
python3 .trae/skills/kv-image-gen/scripts/matting-v4.py public/images/kv/char-chuhan-v3.jpg

# 只做出图质检（留白/贴边检查），不输出PNG
python3 .trae/skills/kv-image-gen/scripts/matting-v4.py <文件> --check-only
```

### 抠图质量检查
1. ✅ 幕布完全去除，无残留边缘/光晕？
2. ✅ 深色衣物（如黑龙袍）没有被误抠成透明？
3. ✅ 角色身上与幕布同色系的元素（玉佩/青铜器）保留了？
4. ✅ 发丝/飘带等细节保留？
5. ✅ 边缘平滑没有锯齿？

### 常见问题处理
| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 绿色边缘/光晕 | 幕布溢色 | v4已内置despill+边缘收缩，仍有残留则检查脚本输出的提醒 |
| 本体被误抠 | v3用u2net猜前景 | 用v4（色度键+连通性），本体只要不是幕布色就不会被抠 |
| 角色绿色元素被抠掉 | 元素颜色太接近幕布色 | 换品红幕重新生成（见第三节幕布颜色选择） |
| 大片幕布色残留在前景内 | 角色大面积撞幕布色 | 换幕布颜色重新生成，脚本会打印"前景内部仍有幕布色"提醒 |

---

## 六、在代码中接入新系列

### 步骤1：在HomePage.tsx中添加系列配置
```typescript
{
  id: "new_series",           // 系列ID
  name: "新本纪",              // 中文名
  tagline: "副标题 · 描述",    // 副标题
  accent: "#hexcolor",        // 主题色（金色/红色等）
  accent2: "#hexcolor",       // 辅助色
  charStyle: {                // 角色定位
    bottom: "50px",
    left: "22%",
    transform: "translateX(-50%)",
    width: "45%"
  } as React.CSSProperties,
  charOffsetX: 80,            // 入场动画X偏移
  charScale: 1,               // 角色缩放
}
```

### 步骤2：在StorySelectPage.tsx中添加系列配置
```typescript
{
  id: "new_series",
  name: "新本纪",
  tagline: "副标题",
  accent: "#hexcolor",
  accent2: "#hexcolor",
  bgFrom: "#hexcolor",        // 卡片渐变起始色（深色）
  bgTo: "#hexcolor",          // 卡片渐变结束色
  era: "xxx",                 // 对应Era类型
  order: 5,                   // 排序序号
  glyph: "字",                // 封面单字
  comingSoon: true/false,     // 是否敬请期待
}
```

### 步骤3：放置图片文件
```
public/images/kv/
  bg-new_series.jpg     # 背景图
  char-new_series.png   # 抠图后的角色透明PNG
```

### 步骤4：角色定位调优
角色CSS定位采用 `width:XX% + left:XX% + transform:translateX(-50%)` 组合：
- `width: 45%` 是推荐起始值，根据角色实际尺寸微调
- `left: 22%` 将角色重心放在画面偏左，给右侧按钮留空间
- `bottom: 50px` 确保不被底部指示器遮挡
- 所有系列统一尺寸和位置可保持视觉一致性

---

## 七、质量验收标准

### 首页视觉效果验收
1. 背景图全屏覆盖，无拉伸变形
2. 角装饰只在四个角落，呈三角形对角线结构
3. 角色立绘完整显示（从头到脚不截断）
4. 角色在画面偏左/居中，不遮挡右侧按钮
5. 三个模式按钮清晰可点击
6. 系列名称+副标题清晰可读（不被角装饰/角色遮挡）
7. 底部轮播指示器居中可见
8. 切换系列时有平滑过渡动画
9. 角色无绿幕残留、无抠图黑洞
10. 页面最小宽度1080px，不做移动端适配

---

## 八、相关脚本与资源

- `.trae/skills/kv-image-gen/scripts/matting-v4.py` - 抠图脚本：色度键+连通性抠图 + 出图质检（--check-only）
- `.trae/skills/kv-image-gen/references/` - 风格参考图目录（生成角色立绘时必须作为图像参考输入）

### 快速批量抠图命令
```bash
python3 .trae/skills/kv-image-gen/scripts/matting-v4.py
```
