#!/usr/bin/env python3
"""
角色立绘抠图脚本 v4 - rembg AI抠图（保守参数）+ 边缘清理
使用isnet-general-use模型，不使用alpha matting避免侵蚀角色
"""
import os
import io
os.environ["U2NET_HOME"] = "/Users/liquanfeng/Desktop/trae-workspace/timeslip-shiji/.u2net"

from rembg import remove, new_session
from PIL import Image
import numpy as np
from scipy.ndimage import uniform_filter, binary_fill_holes

KV_DIR = "/Users/liquanfeng/Desktop/trae-workspace/timeslip-shiji/public/images/kv"

CHAR_FILES = {
    "wudi": "char-wudi-v2.jpg",
    "yinzhou": "char-yinzhou-v2.jpg",
    "shihuang": "char-shihuang-v2.jpg",
    "chuhan": "char-chuhan-v2.jpg",
}


def remove_bg_ai(input_path):
    """使用AI模型抠图，保守设置避免侵蚀角色"""
    with open(input_path, "rb") as f:
        input_data = f.read()

    # 使用isnet模型（更精确的通用模型），不使用alpha matting
    session = new_session("isnet-general-use")
    output_data = remove(
        input_data,
        session=session,
        alpha_matting=False,  # 关闭alpha matting，避免吃掉角色边缘
        post_process_mask=True,  # 后处理mask
    )

    img = Image.open(io.BytesIO(output_data)).convert("RGBA")
    return img


def refine_mask(img):
    """优化抠图结果的alpha通道"""
    data = np.array(img)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3].astype(np.float64)

    # 对alpha做轻度模糊让边缘自然
    a_smooth = uniform_filter(a, size=1)

    # 阈值处理：很透明的直接变全透，很不透明的保留
    a_smooth[a_smooth < 30] = 0
    a_smooth[a_smooth > 230] = 255

    # 清理边缘绿边：如果像素接近绿色且半透明，降低其不透明度
    # 检测绿色溢色
    green_excess = g.astype(float) - np.maximum(r, b).astype(float)
    is_green_edge = (green_excess > 30) & (a_smooth < 200) & (a_smooth > 0)
    a_smooth[is_green_edge] = a_smooth[is_green_edge] * 0.5

    # 填充角色内部的小孔洞
    mask_opaque = a_smooth > 128
    mask_filled = binary_fill_holes(mask_opaque)
    # 只在内部区域填充（不扩大外边界）
    holes = mask_filled & ~mask_opaque
    a_smooth[holes] = 255

    data[:,:,3] = a_smooth.astype(np.uint8)
    return Image.fromarray(data, "RGBA")


def auto_crop(img, padding=30):
    """自动裁剪透明边缘"""
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


def process(input_path, output_path):
    print(f"处理: {os.path.basename(input_path)}")
    img = remove_bg_ai(input_path)
    img = refine_mask(img)
    img = auto_crop(img, padding=25)
    img.save(output_path, "PNG", optimize=True)
    print(f"  完成! 尺寸: {img.size}")
    return img


def main():
    print("=" * 60)
    print("AI抠图(isnet-general-use, 保守模式)...")
    print("=" * 60)
    for key, fname in CHAR_FILES.items():
        inp = os.path.join(KV_DIR, fname)
        out = os.path.join(KV_DIR, f"char-{key}.png")
        if not os.path.exists(inp):
            continue
        try:
            process(inp, out)
        except Exception as e:
            print(f"  [错误] {fname}: {e}")
            import traceback; traceback.print_exc()
    print("=" * 60)
    print("完成!")
    print("=" * 60)

if __name__ == "__main__":
    main()
