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
- **尺寸**：竖版，推荐 3:4 比例（如 912×1216）
- **全身完整**：必须从头到脚完整呈现，**绝对不能截断**
  - 头顶留≥5%空白
  - 脚底留≥8%空白
  - 左右两侧留≥5%空白
- **姿势要求**：
  - 角色站立或战斗姿态自然
  - 武器/道具不要刺向角色自身
  - 多人场景要明确主次，不要拼凑感
- **背景要求**：使用纯绿幕背景（#00b140 或纯绿 #00ff00）方便抠图
  - 不要在背景中画地面、石头、水面等环境元素
  - 不要在角色脚下画投影（后期叠加时会自动处理）
- **风格**：二游风格（参考鸣潮/原神立绘），线条清晰，色彩鲜明

### 角色立绘Prompt模板
```
Full body character illustration of [角色描述], [服饰细节], [武器/道具], 
[姿态描述], standing pose, full body visible from head to toe, 
complete figure, no cropping, pure green screen background (#00FF00), 
no ground, no shadows, no environment, clean green background,
anime style, guofeng, game character art, gacha game style,
highly detailed, sharp focus, 3:4 aspect ratio
```

### 关键负向Prompt
```
cropped, cut off, truncated, out of frame, partial body, 
missing feet, missing head, ground, floor, water, stones,
shadows on background, text, watermark, signature,
deformed hands, extra limbs, unnatural pose
```

### 各系列角色配置
| 系列 | 角色 | 描述要点 |
|------|------|---------|
| 五帝本纪 | 黄帝+蚩尤 | 二人对战姿态，黄帝居中持剑，蚩尤在侧，不要AI拼凑感 |
| 殷周本纪 | 姜子牙+周文王 | 姜子牙持竿垂钓坐姿，文王站立施礼，不要石头/水面 |
| 始皇本纪 | 秦始皇+荆轲 | 荆轲刺秦瞬间动态，嬴政持剑，不要阴森氛围 |
| 楚汉争霸 | 项羽 | 单角色，霸王冲阵，持戟披风完整，不要截断披风 |

### 出图检查清单
1. ✅ 角色从头到脚完整可见？
2. ✅ 头顶/脚底/左右都有留白？
3. ✅ 姿势自然不别扭？
4. ✅ 武器没有刺到角色自己？
5. ✅ 背景是纯绿幕没有地面/水面/石头？
6. ✅ 多人场景没有拼凑感？
7. ✅ 披风/长袖/飘带等没有被截断？

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

角色立绘生成后需要去除绿幕背景转为透明PNG。

### 环境准备
```bash
pip install rembg[cpu] pillow numpy scipy --break-system-packages
```

模型缓存在项目目录：`.u2net/`

### 处理流程（推荐方案）

使用 `scripts/` 目录下的处理脚本，**直接使用u2net模型**（不用alpha matting，避免侵蚀深色衣物）：

```python
from rembg import remove, new_session
from PIL import Image, ImageFilter
import numpy as np

# 1. 初始化模型（u2net对人像效果最好）
session = new_session("u2net")

# 2. 读取图片
img = Image.open("char-xxx-v4.jpg").convert("RGB")

# 3. AI抠图（关闭alpha_matting保护深色区域）
result = remove(
    img,
    session=session,
    alpha_matting=False,      # 关键：关闭以保护黑色龙袍等深色衣物
    post_process_mask=True,
)

# 4. 边缘去绿 + alpha平滑
# （详见scripts/batch-matting.py中的clean_edges_final函数）
```

### 抠图质量检查
1. ✅ 绿幕完全去除，无绿色残留边缘？
2. ✅ 深色衣物（如黑龙袍）没有被误抠成透明？
3. ✅ 发丝/飘带等细节保留？
4. ✅ 边缘平滑没有锯齿？
5. ✅ 没有黑色斑块/黑洞？

### 常见问题处理
| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 绿色边缘/光晕 | 绿幕溢出 | 边缘像素将g通道值设为(r+b)/2 |
| 黑色衣服变透明 | alpha matting侵蚀 | 关闭alpha_matting，使用u2net而非isnet |
| 边缘锯齿 | mask太硬 | 对alpha通道做0.6px高斯模糊 |
| 人物有黑洞 | 暗部被误判为背景 | post_process_mask=True，或手动修补 |

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

## 八、相关脚本

- `scripts/batch-matting.py` - 批量抠图脚本（rembg + 色度键混合方案）
- `.trae/skills/kv-image-gen/scripts/matting-v3.py` - 推荐的u2net简化抠图脚本

### 快速批量抠图命令
```bash
python3 .trae/skills/kv-image-gen/scripts/matting-v3.py
```
