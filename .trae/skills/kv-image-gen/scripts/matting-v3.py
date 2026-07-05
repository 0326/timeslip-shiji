#!/usr/bin/env python3
"""
KV角色抠图脚本 v3 - 穿越·史记项目专用
使用方法: python3 matting-v3.py

依赖安装:
  pip install rembg[cpu] pillow numpy scipy --break-system-packages

功能:
  - 读取 public/images/kv/char-*-v*.jpg 源文件
  - 使用 u2net 模型抠图（对人像/深色衣物友好）
  - 自动去绿边 + alpha通道平滑
  - 输出为 char-*.png 透明背景图
"""
import os
import sys

# ============ 配置 ============
# 角色源文件映射（key -> 最新版本文件名）
CHAR_FILES = {
    "wudi": "char-wudi-v4.jpg",
    "yinzhou": "char-yinzhou-v3.jpg",
    "shihuang": "char-shihuang-v4.jpg",
    "chuhan": "char-chuhan-v3.jpg",
}

# KV素材目录（相对于项目根目录）
KV_SUBDIR = "public/images/kv"
# 模型缓存目录
MODEL_CACHE = ".u2net"


def find_project_root():
    """查找项目根目录（包含package.json的目录）"""
    current = os.path.dirname(os.path.abspath(__file__))
    for _ in range(10):
        if os.path.exists(os.path.join(current, "package.json")):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    # fallback: 用cwd
    return os.getcwd()


def main():
    project_root = find_project_root()
    kv_dir = os.path.join(project_root, KV_SUBDIR)
    model_dir = os.path.join(project_root, MODEL_CACHE)
    os.makedirs(model_dir, exist_ok=True)
    os.environ["U2NET_HOME"] = model_dir

    print("=" * 60)
    print("穿越·史记 - KV角色抠图工具 v3")
    print("=" * 60)
    print(f"项目根目录: {project_root}")
    print(f"素材目录: {kv_dir}")
    print()

    # 延迟导入（让错误提示更友好）
    try:
        from rembg import remove, new_session
        from PIL import Image, ImageFilter
        import numpy as np
    except ImportError as e:
        print(f"[错误] 缺少依赖: {e}")
        print("请运行: pip install rembg[cpu] pillow numpy scipy --break-system-packages")
        sys.exit(1)

    print("初始化AI抠图模型 (u2net)...")
    session = new_session("u2net")

    success = 0
    skipped = 0
    failed = 0

    for key, src_file in CHAR_FILES.items():
        src_path = os.path.join(kv_dir, src_file)
        out_path = os.path.join(kv_dir, f"char-{key}.png")

        if not os.path.exists(src_path):
            print(f"  [跳过] {src_file} 不存在")
            skipped += 1
            continue

        try:
            print(f"\n处理 [{key}]: {src_file}")
            img = Image.open(src_path).convert("RGB")
            print(f"  原始尺寸: {img.size}")

            # AI抠图
            print("  AI抠图中...")
            cutout = remove(
                img,
                session=session,
                alpha_matting=False,       # 关闭以保护深色衣物
                post_process_mask=True,    # 后处理mask
            )

            # 边缘清理
            print("  边缘去绿+平滑...")
            arr = np.array(cutout)
            r = arr[:,:,0].astype(float)
            g = arr[:,:,1].astype(float)
            b = arr[:,:,2].astype(float)
            a = arr[:,:,3].astype(float)

            # 去绿色溢出：边缘像素中绿色通道过高时压到红蓝均值
            edge = (a > 10) & (a < 250)
            green_tint = edge & (g > r + 8) & (g > b + 8)
            if green_tint.any():
                avg_rb = (r + b) / 2
                arr[:,:,1][green_tint] = np.clip(avg_rb[green_tint], 0, 255).astype(np.uint8)

            # Alpha通道轻微模糊使边缘自然
            alpha_ch = Image.fromarray(a.astype(np.uint8), mode="L")
            alpha_blur = alpha_ch.filter(ImageFilter.GaussianBlur(radius=0.6))

            # 合并
            rgb = Image.fromarray(arr[:,:,:3].astype(np.uint8), mode="RGB")
            final = Image.merge("RGBA", (*rgb.split(), alpha_blur))

            # 保存
            final.save(out_path, "PNG", optimize=True)
            size_kb = os.path.getsize(out_path) / 1024
            print(f"  ✓ 已保存: char-{key}.png ({size_kb:.0f}KB)")
            success += 1

        except Exception as e:
            print(f"  [错误] {key}: {e}")
            import traceback
            traceback.print_exc()
            failed += 1

    print(f"\n{'=' * 60}")
    print(f"完成! 成功: {success}, 跳过: {skipped}, 失败: {failed}")
    print(f"输出目录: {kv_dir}")


if __name__ == "__main__":
    main()
