#!/usr/bin/env python3
"""
KV角色抠图脚本 v4 - 穿越·史记项目专用

用法:
  python3 matting-v4.py                 # 自动扫描 public/images/kv/ 下的 char-*-v*.jpg，取每个系列最新版本
  python3 matting-v4.py <文件路径>...    # 处理指定文件
  python3 matting-v4.py --check-only    # 只做出图质检（贴边检查），不输出PNG

依赖:
  pip install pillow numpy scipy --break-system-packages   # 必需
  pip install rembg[cpu] --break-system-packages           # 可选（用于封闭绿色区域的仲裁，装了效果更好）

v4 相对 v3 的核心变化:
  - 抠图主力从 u2net 改为「色度键 + 边界连通洪水填充」:
      * 自动从图片边框采样识别幕布颜色（支持绿幕/品红幕）
      * 只有与图片边界连通的幕布色区域才算背景 —— 角色身上的绿色玉饰/
        青色铠甲等元素不会被误抠
      * AI模型（rembg）仅用于仲裁"被角色包围的封闭幕布色区域"（如手臂与
        身体之间的空隙）是背景还是本体，绝不会单独决定删除本体像素
  - 边缘处理: 1px收缩 + 高斯模糊消除绿边光晕, 边缘带despill去溢色
  - 内置出图质检: 角色剪影（含武器/披风）距画面边缘的留白检查，
    贴边/截断直接报 ✗ 提示重新生成
"""
import os
import re
import sys
import glob

KV_SUBDIR = "public/images/kv"
MODEL_CACHE = ".u2net"

# 留白质检阈值（占画面高/宽的比例），低于此值判定为贴边风险
MARGIN_TOP = 0.03
MARGIN_SIDE = 0.03
MARGIN_BOTTOM = 0.04


def find_project_root():
    current = os.path.dirname(os.path.abspath(__file__))
    for _ in range(10):
        if os.path.exists(os.path.join(current, "package.json")):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return os.getcwd()


def scan_sources(kv_dir):
    """扫描 char-{key}-v{n}.jpg/png，每个 key 取最大版本号"""
    pat = re.compile(r"char-([a-z0-9_]+)-v(\d+)\.(jpg|jpeg|png)$")
    best = {}
    for p in glob.glob(os.path.join(kv_dir, "char-*")):
        m = pat.search(os.path.basename(p))
        if not m:
            continue
        key, ver = m.group(1), int(m.group(2))
        if key not in best or ver > best[key][0]:
            best[key] = (ver, p)
    return {k: v[1] for k, v in sorted(best.items())}


def detect_key_color(arr):
    """从图片四边2px边框采样幕布颜色（中位数）"""
    import numpy as np
    border = np.concatenate([
        arr[:2].reshape(-1, 3), arr[-2:].reshape(-1, 3),
        arr[:, :2].reshape(-1, 3), arr[:, -2:].reshape(-1, 3),
    ]).astype(float)
    return np.median(border, axis=0)


def chroma_dist(arr, key_rgb):
    """在 YCbCr 色度平面上计算每个像素到幕布色的距离"""
    import numpy as np
    def cbcr(r, g, b):
        cb = -0.168736 * r - 0.331264 * g + 0.5 * b
        cr = 0.5 * r - 0.418688 * g - 0.081312 * b
        return cb, cr
    r = arr[:, :, 0].astype(float)
    g = arr[:, :, 1].astype(float)
    b = arr[:, :, 2].astype(float)
    cb, cr = cbcr(r, g, b)
    kcb, kcr = cbcr(*key_rgb)
    dist = np.hypot(cb - kcb, cr - kcr)
    key_sat = float(np.hypot(kcb, kcr))
    return dist, key_sat


def get_ai_alpha(img, model_dir):
    """可选的AI mask，仅用于封闭区域仲裁。返回 None 表示 rembg 不可用"""
    try:
        from rembg import remove, new_session
        import numpy as np
    except ImportError:
        return None
    os.environ.setdefault("U2NET_HOME", model_dir)
    for model in ("birefnet-general", "isnet-general-use", "u2net"):
        try:
            session = new_session(model)
            cut = remove(img, session=session, alpha_matting=False,
                         post_process_mask=True)
            print(f"  AI仲裁模型: {model}")
            return np.array(cut)[:, :, 3]
        except Exception:
            continue
    return None


def process(src_path, out_path, model_dir, check_only=False):
    import numpy as np
    from PIL import Image, ImageFilter
    from scipy import ndimage

    img = Image.open(src_path).convert("RGB")
    arr = np.array(img)
    h, w = arr.shape[:2]
    print(f"  原始尺寸: {w}x{h}")

    # ---- 1. 识别幕布颜色 ----
    key_rgb = detect_key_color(arr)
    dist, key_sat = chroma_dist(arr, key_rgb)
    kr, kg, kb = [int(v) for v in key_rgb]
    print(f"  幕布颜色: rgb({kr},{kg},{kb})")
    if key_sat < 40:
        print("  [错误] 边框颜色饱和度过低，看起来不是纯色幕布图，跳过")
        return False

    # ---- 2. 幕布色硬掩码 + 边界连通洪水填充 ----
    keyish = dist < 0.45 * key_sat
    lbl, n = ndimage.label(keyish)
    border_ids = np.unique(np.concatenate([
        lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]]))
    border_ids = border_ids[border_ids != 0]
    bg = np.isin(lbl, border_ids)  # 与边界连通的幕布色 = 确定背景

    # ---- 3. 封闭幕布色区域仲裁（手臂间空隙 vs 角色身上的绿色元素）----
    enclosed_ids = [i for i in range(1, n + 1) if i not in set(border_ids)]
    ai_alpha = None
    kept_elements = np.zeros((h, w), dtype=bool)
    if enclosed_ids and not check_only:
        ai_alpha = get_ai_alpha(img, model_dir)
        for i in enclosed_ids:
            region = lbl == i
            area = int(region.sum())
            # 颜色仲裁: 与幕布色几乎一致 → 肢体间空隙; 明显不同的
            # 同色系(如玉色) → 角色元素
            near_key = float(np.median(dist[region])) < 0.15 * key_sat
            if ai_alpha is not None:
                is_hole = near_key and float(ai_alpha[region].mean()) < 100
            else:
                is_hole = near_key or area > 0.01 * h * w
            if is_hole:
                bg |= region
            else:
                kept_elements |= region
                print(f"  保留角色身上的幕布色元素 ({area}px)")

    fg = ~bg

    # ---- 4. 清理背景中的孤立噪点 ----
    lbl_fg, n_fg = ndimage.label(fg)
    if n_fg > 1:
        sizes = ndimage.sum(fg, lbl_fg, range(1, n_fg + 1))
        for i, s in enumerate(sizes, start=1):
            if s < 0.0002 * h * w:
                fg[lbl_fg == i] = False

    # ---- 5. 出图质检: 剪影留白检查（含武器/披风）----
    ys, xs = np.where(fg)
    ok = True
    if len(ys) == 0:
        print("  [错误] 未检测到前景")
        return False
    top_m, bot_m = ys.min() / h, (h - 1 - ys.max()) / h
    left_m, right_m = xs.min() / w, (w - 1 - xs.max()) / w
    checks = [
        ("头顶", top_m, MARGIN_TOP), ("脚底", bot_m, MARGIN_BOTTOM),
        ("左侧", left_m, MARGIN_SIDE), ("右侧", right_m, MARGIN_SIDE),
    ]
    for name, m, need in checks:
        mark = "✓" if m >= need else "✗"
        if m < need:
            ok = False
        print(f"  {mark} {name}留白 {m*100:.1f}% (要求≥{need*100:.0f}%)")
    if not ok:
        print("  [警告] 角色剪影贴边，可能被截断 —— 建议重新生成该图"
              "（prompt中加大留白/拉远镜头），而不是硬抠")
    if check_only:
        return ok

    # ---- 6. despill去溢色 ----
    # 对前景中"幕布色主导且色度接近幕布"的像素去溢色（边缘绿边 + 铠甲
    # 反光等内部溢色都能覆盖）。已判定保留的角色同色元素及其边缘除外。
    protect = ndimage.binary_dilation(kept_elements, iterations=3)
    out = arr.astype(float)
    r, g, b = out[:, :, 0], out[:, :, 1], out[:, :, 2]
    spill = np.zeros((h, w), dtype=bool)
    # 边缘带(距背景6px内): 混合了幕布色的抗锯齿像素, 用更宽松的色度条件
    band = fg & ~ndimage.binary_erosion(fg, iterations=6)
    if kg >= kr and kg >= kb:  # 绿幕
        near = (dist < 0.8 * key_sat) | band
        spill = fg & ~protect & (g > np.maximum(r, b)) & near
        g[spill] = np.maximum(r, b)[spill]
    elif kr > kg and kb > kg:  # 品红幕（阈值收紧, 避免误伤粉色服饰）
        near = (dist < 0.6 * key_sat) | (band & (dist < 0.9 * key_sat))
        spill = fg & ~protect & (np.minimum(r, b) > g) & near
        excess = (np.minimum(r, b) - g)
        r[spill] -= excess[spill]
        b[spill] -= excess[spill]
    n_spill = int(spill.sum())
    if n_spill:
        print(f"  despill去溢色: {n_spill}px")
    out = np.clip(out, 0, 255).astype(np.uint8)

    # ---- 7. alpha: 1px收缩 + 高斯模糊，消除幕布色光晕 ----
    fg_eroded = ndimage.binary_erosion(fg, iterations=1)
    alpha = Image.fromarray((fg_eroded * 255).astype(np.uint8))
    alpha = alpha.filter(ImageFilter.GaussianBlur(radius=0.8))

    rgb_img = Image.fromarray(out)
    final = Image.merge("RGBA", (*rgb_img.split(), alpha))
    final.save(out_path, "PNG", optimize=True)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"  ✓ 已保存: {os.path.basename(out_path)} ({size_kb:.0f}KB)")

    # ---- 8. 残留自检: 前景内部是否仍有大片幕布色 ----
    interior = ndimage.binary_erosion(fg, iterations=5)
    residual = int((interior & keyish).sum())
    if residual > 0.001 * h * w:
        print(f"  [提醒] 前景内部仍有 {residual}px 幕布色（可能是角色自带的"
              f"同色元素，请人工确认视觉效果）")
    return ok


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    check_only = "--check-only" in sys.argv[1:]

    project_root = find_project_root()
    kv_dir = os.path.join(project_root, KV_SUBDIR)
    model_dir = os.path.join(project_root, MODEL_CACHE)
    os.makedirs(model_dir, exist_ok=True)

    try:
        import numpy, scipy, PIL  # noqa
    except ImportError as e:
        print(f"[错误] 缺少依赖: {e}")
        print("请运行: pip install pillow numpy scipy --break-system-packages")
        sys.exit(1)

    print("=" * 60)
    print("穿越·史记 - KV角色抠图工具 v4" + (" [仅质检]" if check_only else ""))
    print("=" * 60)

    if args:
        targets = {}
        for p in args:
            p = os.path.abspath(p)
            m = re.search(r"char-([a-z0-9_]+)-v\d+\.", os.path.basename(p))
            key = m.group(1) if m else \
                os.path.splitext(os.path.basename(p))[0]
            targets[key] = p
    else:
        targets = scan_sources(kv_dir)
        if not targets:
            print(f"[提示] 在 {kv_dir} 未找到 char-*-v*.jpg 源文件")
            sys.exit(0)

    success = failed = 0
    for key, src in targets.items():
        out = os.path.join(os.path.dirname(src), f"char-{key}.png")
        print(f"\n处理 [{key}]: {os.path.basename(src)}")
        try:
            if process(src, out, model_dir, check_only=check_only):
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  [错误] {e}")
            import traceback
            traceback.print_exc()
            failed += 1

    print(f"\n{'=' * 60}")
    print(f"完成! 通过: {success}, 存在问题: {failed}")


if __name__ == "__main__":
    main()
