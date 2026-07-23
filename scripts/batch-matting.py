#!/usr/bin/env python3
"""
批量抠图脚本 v5 - 处理角色立绘和角装饰
使用rembg isnet模型，保守参数保留细节
"""
import os
import io
os.environ["U2NET_HOME"] = "/Users/liquanfeng/Desktop/trae-workspace/timeslip-shiji/.u2net"

from rembg import remove, new_session
from PIL import Image
import numpy as np
from scipy.ndimage import uniform_filter, binary_fill_holes

KV_DIR = "/Users/liquanfeng/Desktop/trae-workspace/timeslip-shiji/public/images/kv"

# 角色立绘（使用v3/v4版本）
CHAR_FILES = {
    "wudi": "char-wudi-v4.jpg",
    "yinzhou": "char-yinzhou-v3.jpg",
    "shihuang": "char-shihuang-v4.jpg",
    "chuhan": "char-chuhan-v3.jpg",
}

# 四角装饰
SERIES = ["wudi", "yinzhou", "shihuang", "chuhan"]
CORNERS = ["tl", "tr", "bl", "br"]

session = None

def get_session():
    global session
    if session is None:
        print("加载AI抠图模型 isnet-general-use...")
        session = new_session("isnet-general-use")
    return session

def remove_bg(input_path):
    """AI抠图，保守设置"""
    with open(input_path, "rb") as f:
        input_data = f.read()
    sess = get_session()
    output_data = remove(
        input_data,
        session=sess,
        alpha_matting=False,
        post_process_mask=True,
    )
    img = Image.open(io.BytesIO(output_data)).convert("RGBA")
    return img

def refine_mask(img, fill_holes=True):
    """优化alpha通道"""
    data = np.array(img)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3].astype(np.float64)

    # 阈值
    a[a < 20] = 0
    a[a > 235] = 255

    # 清理绿边：绿色像素降低alpha
    green_excess = g.astype(float) - np.maximum(r, b).astype(float)
    is_green_edge = (green_excess > 25) & (a > 0) & (a < 240)
    a[is_green_edge] = a[is_green_edge] * 0.6

    if fill_holes:
        # 填充内部小孔
        mask_opaque = a > 128
        mask_filled = binary_fill_holes(mask_opaque)
        holes = mask_filled & ~mask_opaque
        a[holes] = 255

    # 轻度模糊边缘
    a = uniform_filter(a, size=1)

    data[:,:,3] = a.astype(np.uint8)
    return Image.fromarray(data, "RGBA")

def auto_crop(img, padding=20):
    """裁剪透明边缘"""
    data = np.array(img)
    alpha = data[:,:,3]
    rows = np.any(alpha > 5, axis=1)
    cols = np.any(alpha > 5, axis=0)
    if not rows.any() or not cols.any():
        return img
    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]
    rmin = max(0, rmin - padding)
    rmax = min(img.height, rmax + padding)
    cmin = max(0, cmin - padding)
    cmax = min(img.width, cmax + padding)
    return img.crop((cmin, rmin, cmax, rmax))

def process_one(input_path, output_path, do_crop=True, do_refine=True):
    print(f"  处理: {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
    img = remove_bg(input_path)
    if do_refine:
        img = refine_mask(img)
    if do_crop:
        img = auto_crop(img, padding=15)
    img.save(output_path, "PNG", optimize=True)
    print(f"    完成! 尺寸: {img.size}")
    return img

def main():
    print("=" * 60)
    print("批量抠图开始")
    print("=" * 60)

    # 处理角色立绘
    print("\n[角色立绘]")
    for key, fname in CHAR_FILES.items():
        inp = os.path.join(KV_DIR, fname)
        out = os.path.join(KV_DIR, f"char-{key}.png")
        if not os.path.exists(inp):
            print(f"  [跳过] {fname} 不存在")
            continue
        try:
            process_one(inp, out, do_crop=True)
        except Exception as e:
            print(f"  [错误] {fname}: {e}")
            import traceback; traceback.print_exc()

    # 处理角装饰
    print("\n[四角装饰]")
    for series in SERIES:
        for corner in CORNERS:
            fname = f"corner-{series}-{corner}.jpg"
            inp = os.path.join(KV_DIR, fname)
            out = os.path.join(KV_DIR, f"corner-{series}-{corner}.png")
            if not os.path.exists(inp):
                print(f"  [跳过] {fname} 不存在")
                continue
            try:
                process_one(inp, out, do_crop=False)  # 角装饰不裁剪，保持角落位置
            except Exception as e:
                print(f"  [错误] {fname}: {e}")

    print("\n" + "=" * 60)
    print("全部完成!")
    print("=" * 60)

if __name__ == "__main__":
    main()
