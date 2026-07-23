---
name: "vn-story-image"
description: "为穿越·史记 VN故事线制作全套视觉资产（角色立绘+场景背景），完成生成→抠图→代码接入→ink标签插入的端到端流程。当需要为正史模式故事线出图、替换立绘占位、添加背景切换时调用。"
---

# VN 故事线图文制作规范

## 一、整体流程

```
分析章节(chapters/*.ts) → 选定故事线 → 策划角色阵容+场景清单
→ 逐个角色出图(avatar/bust/full) → 场景出图
→ 抠图(matting-v4.py chroma key) → 资产压缩
→ 代码接入(base.ts注册路径) → ink注入#bg/#show标签
→ 验收调优(CSS/tsc/build)
```

---

## 二、视觉资产方案策划

### 2.1 故事线选择

从章节数据（`src/react-app/data/classics/chapters/`）和故事线注册表（`src/react-app/data/storylines/`）中，选择**戏剧冲突最强、角色集中**的故事线作为落地目标。

### 2.2 角色资产（每人固定产出）

角色是**故事线的复用资产**。不同故事线可以共用同一角色的立绘，通过 `expression` 区分不同表情/状态。

| 类型 | 文件名 | 尺寸 | 比例 | 背景要求 | 用途 |
|------|--------|------|------|---------|------|
| 头像 | `avatar/default.jpg` | 1024×1024 | 1:1 | 纯色/渐变 | 对话栏说话人头像 |
| 胸像 | `portrait/bust-default.jpg` | 912×1216 | 3:4 | 纯色 | 对话特写、图鉴展示 |
| 全身立绘 | `portrait/full-default.png`（抠图后） | 1024×1536 | 2:3 | **绿幕 #00B140**（抠图前） | VN场景中站立角色 |

**关键规则**：
- 角色**不需要独立背景图**。背景由场景统一提供，与角色解耦。
- 不同表情/状态（如微笑、严肃、悲伤）通过 ink 标签 `#show:{charId}:{expression}:{position}` 中的 `expression` 字段区分。
- 若需要为同一角色出不同表情的全身立绘（如 `full-smile.png`、`full-angry.png`），**必须先出默认全身立绘定脸**，后续表情版本以此图为图像参考，保证面容完全一致。

### 2.3 场景背景

场景背景是**故事线独占资产**。每剧情节点需要 1 张场景背景图，复用场景使用同一 `backgroundKey`。

| 类型 | 路径 | 要求 |
|------|------|------|
| 场景背景 | `public/assets/backgrounds/<series_id>/<scene_name>.jpg` | 纯场景 × 无人物 × 四角留白给UI |

**背景图规范**：
- 尺寸：1920×1080，16:9
- 绝对不能出现任何人物（角色是独立图层叠加）
- 四角和右侧留出 UI 空间（返回按钮、标题、对话框）
- 色调与系列主题匹配

### 2.4 存储结构

```
public/assets/figures/
  <char_id>/classical/                  # 角色ID，如 shun / hanxin / xiangyu
    avatar/default.jpg                  # 头像
    portrait/bust-default.jpg           # 胸像
    portrait/full-default.jpg           # 全身立绘原图（绿幕，抠图后删除）
    portrait/full-default.png           # 抠图后透明PNG（代码引用此文件）
    portrait/full-smile.jpg             # 可选：微笑表情全身立绘（如有）
    portrait/full-smile.png             # 可选：抠图后微笑表情PNG

public/assets/backgrounds/<series_id>/
  <scene_01>.jpg                        # 场景背景1
  <scene_02>.jpg                        # 场景背景2
```

---

## 三、AI 出图规范

### 3.1 风格锚点

所有角色立绘使用**同一风格锚点块**（禁止每次改写），并在出图时以 `references/anime-style-1.jpg` 作为图像参考（img2img），这是风格一致性的最大保障。

```
premium Chinese gacha game splash art, in the style of Wuthering Waves
and Genshin Impact character key visuals, crisp clean lineart with
painterly cel-shaded rendering, saturated jewel-tone palette,
ornate costume with layered fabric and engraved metal details,
gold filigree accents, iridescent glow effects, dramatic rim lighting,
dynamic three-quarter camera angle, flowing hair and ribbons with
sense of motion, masterpiece quality, ultra detailed
```

### 3.2 全身立绘构图要求

- **镜头拉远**：角色只占画面高度 **70%~80%**
- **留白计算**：以角色整体剪影（含武器尖端、披风、飘带最远端）为准
  - 头顶留 ≥5%
  - 脚底留 ≥8%
  - 左右两侧各留 ≥5%
- **幕布颜色**：默认 **绿幕 #00B140**。角色含绿/青/玉色元素时改 **品红幕 #FF00FF**
- **禁止元素**：角色脚下不得有地面、阴影、环境元素

### 3.3 同一角色多表情出图

若故事线需要同一角色的不同表情立绘：

1. **先生成默认全身立绘**（`full-default.jpg`）→ 抠图 → 定脸
2. **后续表情版本以此图为图像参考**（img2img），prompt 中修改表情描述，其他全部不变
3. 生成 → 抠图 → 命名为 `full-{expression}.png`

**人脸一致性保证**：只通过图像参考（img2img）而非纯文字 prompt 来控制面部，否则会漂移。

### 3.4 场景背景规范

- 尺寸 1920×1080 16:9
- 无人物、无文字水印、无角装饰（角装饰由 SVG/CSS 独立绘制）
- 视觉重心偏左，右侧简洁留给 UI

### 3.5 Prompt 模板

**全身立绘**：
```
[风格锚点块], full body character illustration of [角色描述],
[服饰细节], [武器/道具], [姿态描述], [表情描述],
wide shot with camera pulled back, character occupies only 75% of
frame height, generous empty margins on all sides,
entire silhouette including weapon tips and cape fully inside frame,
complete figure from head to toe,
solid chroma key background (#00B140 绿幕 或 #FF00FF 品红幕),
no ground, no shadows, no environment, 3:4 aspect ratio
```

**负向 Prompt（固定复用）**：
```
cropped, cut off, truncated, out of frame, partial body,
touching frame edge, missing feet, missing head,
ground, floor, water, stones, shadows on background,
text, watermark, signature, deformed hands, extra limbs,
unnatural pose, flat dull colors, blurry, low detail,
western cartoon, 3d render, photorealistic
```

---

## 四、抠图 + 压缩

### 4.1 Chroma Key 抠图

使用 `.trae/skills/kv-image-gen/scripts/matting-v4.py`，v4 核心原则：**色度键 + 连通性** 而非 AI 分割。

```bash
python3 .trae/skills/kv-image-gen/scripts/matting-v4.py <文件路径>
```

**输出文件名处理**：
- 脚本默认输出 `char-full-default.png`
- **必须重命名为** `full-default.png`，与代码引用路径一致

**抠图流程**：
1. 自动识别幕布色（从四边边框采样）
2. 色度键 + 连通性洪水填充（只有与边界连通的幕布色才算背景）
3. 封闭区域仲裁（rembg 可选，装了则更准确）
4. despill 去溢色
5. 边缘平滑

### 4.2 留白质检

每张全身立绘生成后**立即**跑自动质检：

```bash
python3 .trae/skills/kv-image-gen/scripts/matting-v4.py <文件> --check-only
```

- 脚本计算角色整体剪影到四边的留白比例
- 任一方向不达标（头顶 < 3% 或 脚底 < 3%）→ **直接重新生成**，不要试图修补

### 4.3 资产压缩

```bash
# PNG压缩（8位量化，60-80品质）
pngquant --quality=60-80 --speed 1 --ext .png --force public/assets/figures/*/classical/portrait/full-*.png

# JPG压缩（85品质，去元数据）
jpegoptim --strip-all --max=85 public/assets/**/*.jpg
```

压缩后应达到 **50%+ 体积降幅**，无肉眼可见画质损失。

---

## 五、代码接入

### 5.1 扩展类型定义

在 `src/react-app/data/sceneAssets/base.ts` 中：

```typescript
export interface BgStyle {
  label: string;
  css: string;     // 回退CSS渐变（无图时使用）
  image?: string;  // 背景图路径（优先使用）
}

export interface SpriteInfo {
  name: string;
  glyph: string;   // 无图时显示的单字徽记
  accent: string;  // 主题色（CSS渐变+说话高亮）
  avatar?: string; // 头像路径（1:1）
  bust?: string;   // 胸像路径（3:4）
  full?: string;   // 全身立绘PNG路径（2:3）
}
```

### 5.2 注册角色资产

在 `baseSprites` 中为每个角色添加图片路径：

```typescript
<char_id>: {
  name: "角色中文名",
  glyph: "单字",
  accent: "#hexcolor",
  avatar: "/assets/figures/<char_id>/classical/avatar/default.jpg",
  bust: "/assets/figures/<char_id>/classical/portrait/bust-default.jpg",
  full: "/assets/figures/<char_id>/classical/portrait/full-default.png",
}
```

**向后兼容**：已有角色若未出图，保留 `{ name, glyph, accent }` 三字段即可，组件会自动回退 CSS 渐变 + 单字占位。

### 5.3 注册场景资产

在 `baseBackgrounds` 中为每个场景添加 `image` 字段：

```typescript
<background_key>: {
  label: "场景中文名",
  css: "linear-gradient(180deg, ...)",  // 回退渐变
  image: "/assets/backgrounds/<series_id>/<scene_name>.jpg",  // 优先图片
}
```

**向后兼容**：`image` 为可选字段。无 `image` 的场景自动回退 `css` 渐变。

### 5.4 组件渲染改法

`CharacterSprite.tsx` — 优先显示全身立绘PNG，无图回退CSS渐变+单字：

```tsx
const sp = getSprite(id);
const hasImage = !!sp.full;

{hasImage ? (
  <img className="vn-sprite-image" src={sp.full} alt={sp.name} loading="eager" draggable={false} />
) : (
  <div className="vn-sprite-figure" style={{ background: `linear-gradient(180deg, ${sp.accent}55, ...)` }}>
    {sp.glyph}
  </div>
)}
```

`VNEngine.tsx` — 背景优先图片，无图回退CSS渐变：

```tsx
{bg.image ? (
  <div key={scene.background} className="vn-bg vn-bg-image">
    <img src={bg.image} alt={bg.label || ""} />
  </div>
) : (
  <div key={scene.background} className="vn-bg" style={{ background: bg.css }} />
)}
```

### 5.5 CSS 调优参考值

```css
.vn-sprite {
  bottom: 140px;
  filter: brightness(0.75) saturate(0.9);   /* 非说话角色 */
}
.vn-sprite.speaking {
  filter: brightness(1.05) saturate(1.05);  /* 说话高亮 */
  transform: scale(1.03);
}
.vn-sprite-image {
  height: min(58vh, 420px);
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.45));
}
.vn-bg-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 六、Ink 标签注入

### 6.1 标签语法

| 标签 | 格式 | 作用 |
|------|------|------|
| `#bg:key` | `#bg:{backgroundKey}` | 切换背景 → VNEngine 渲染对应 `BgStyle` |
| `#show:id:expr:pos` | `#show:{charId}:{expression}:{position}` | 角色登场 → CharacterSprite 渲染 |
| `#hide:id` | `#hide:{charId}` | 角色退场 |

`position` 取值：`left` | `center` | `right` | `float`（浮空角色如系统少女）
`expression` 取值：在 ink 中自由定义（如 `default`、`smile`、`sad`、`angry`），代码层只做字符串透传，不校验语义。

### 6.2 注入位置

在 ink 脚本的**每个剧情节点（knot/stitch）入口处**插入 `#bg` 和 `#show`：

```ink
=== scene_01 ===
#bg:scene_key_01
#show:char_a:default:left
#show:char_b:smile:right
这里是第一段对话。 #speaker:char_a
→ next
```

**规则**：
- `#bg` 放在节点第一行，确保场景切换发生在对话开始前
- `#show` 紧跟 `#bg`，按出场顺序排列
- 角色退场时用 `#hide`，不要依赖「切换背景自动清空角色」的副作用（虽然 inkRunner 有此行为，但显式 `#hide` 更清晰）

### 6.3 场景→角色映射表

在出图方案阶段，建立剧情节点与视觉资产的映射表：

| 剧情节点 | #bg | 出场角色(#show) | 备注 |
|----------|-----|----------------|------|
| 开场 | `<bg_key_1>` | char_a(default,left), char_b(smile,right) | 宁静日常 |
| 冲突前 | `<bg_key_2>` | char_a(serious,left) | 暗藏杀机 |
| 高潮 | `<bg_key_3>` | char_a(fear,center) | 核心冲突 |
| 结局 | `<bg_key_1>` | char_a(calm,center) | 回归平静 |

同一场景（同一 `backgroundKey`）可以在多个节点复用，无需重复出图。

---

## 七、验收清单

1. ✅ 角色图全部生成（每人至少头像+胸像+全身立绘，多表情按需补充）
2. ✅ 场景背景全部生成（每剧情节点1张，可复用）
3. ✅ 绿幕抠图无残留、本体不被误抠
4. ✅ 全身立绘留白质检通过（头顶≥3%、脚底≥3%）
5. ✅ 资产压缩优化（PNG降低 75%+、JPG降低 13-17%、总体降低 50%+）
6. ✅ 代码注册路径正确（`SpriteInfo` 扩展 + `BgStyle` 扩展 + 组件渲染）
7. ✅ ink脚本 `#bg` / `#show` / `#hide` 标签完整覆盖所有剧情节点
8. ✅ CSS调优：非说话亮度0.75、说话高亮1.05、立绘高度58vh
9. ✅ `tsc --noEmit` 零错误 + `npm run build` 通过
10. ✅ 端到端验收：进入游戏→选故事线→背景切换+角色立绘同步流畅

---

## 八、参考脚本

| 脚本 | 用途 |
|------|------|
| `.trae/skills/kv-image-gen/scripts/matting-v4.py` | 绿幕/品红幕抠图 + 留白质检（`--check-only`） |
| `pngquant --quality=60-80` | PNG 8位量化压缩 |
| `jpegoptim --strip-all --max=85` | JPG 去元数据+品质压缩 |
