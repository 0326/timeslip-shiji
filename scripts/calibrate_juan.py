#!/usr/bin/env python3
# 二次校准：把某卷 .ts 里的 original 原文 与 ctext.org 的对应卷原文逐字比对。
# 用法: python3 scripts/calibrate_juan.py <卷号> <ctext-slug>
#   例: python3 scripts/calibrate_juan.py 44 wei-shi-jia
# 思路: ctext /zhs 为简体；我们的原文也是简体。两边都剥成「纯汉字序列」后用 difflib 对齐：
#   - insert（ctext 有、我们缺）= 多半是 ⋯ 节略掉的原文 → 这是补全的重点
#   - replace（两边不同）        = 异文/错字 → 校准重点
#   - delete（我们有、ctext 缺） = 我们多出的字（可能是异文或手误）
import sys, re, json, urllib.request, difflib

if len(sys.argv) < 3:
    sys.exit("用法: python3 scripts/calibrate_juan.py <卷号> <ctext-slug>")
juan = int(sys.argv[1])
slug = sys.argv[2]
ts_path = f"src/react-app/data/classics/chapters/{juan:03d}.ts"

# ---- 1. 取我们的 original ----
raw = open(ts_path, encoding="utf-8").read()
# 匹配 original: 后面的双引号字符串（单行；含中文标点，不含裸双引号）
ours_segs = re.findall(r'original:\s*\n?\s*"((?:[^"\\]|\\.)*)"', raw)
trunc_marks = sum(s.count("⋯") + s.count("……") for s in ours_segs)
ours_text = "".join(ours_segs)

# ---- 2. 取 ctext 原文 ----
url = f"https://ctext.org/shiji/{slug}/zhs"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")
# 每段原文在 <td class="ctext"> ... </td>；去掉 <div id="comm..."> 注锚和所有标签
cells = re.findall(r'<td class="ctext">(.*?)</td>', html, re.S)
def strip_html(s):
    s = re.sub(r"<[^>]+>", "", s)
    return s.replace("&nbsp;", "")
ctext_text = "".join(strip_html(c) for c in cells)

if not ctext_text.strip():
    sys.exit(f"[ctext 取文失败：slug={slug} 可能不对，或页面结构变化]")

# ---- 3. 归一：只保留汉字（剥标点/空白/节略号），同时保留「原位映射」以便回看 ----
HAN = lambda ch: "一" <= ch <= "鿿" or "㐀" <= ch <= "䶿"
def han_only(s):
    return "".join(ch for ch in s if HAN(ch))
a = han_only(ours_text)   # ours
b = han_only(ctext_text)  # ctext

sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
ratio = sm.ratio()

print(f"╔═ 卷{juan}  vs  ctext/{slug}")
print(f"║ 我们 original 段数: {len(ours_segs)}   ⋯节略标记: {trunc_marks} 处")
print(f"║ 纯汉字字数  我们={len(a)}   ctext={len(b)}   差={len(b)-len(a):+d}")
print(f"║ 相似度(difflib ratio): {ratio:.4f}")
print("╚" + "═" * 60)

CTX = 12  # 上下文汉字数
miss = extra = repl = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        continue
    left = a[max(0, i1 - CTX):i1]
    right = a[i2:i2 + CTX]
    if tag == "insert":   # ctext 有，我们没有 → 节略/漏字
        miss += (j2 - j1)
        seg = b[j1:j2]
        head = seg if len(seg) <= 60 else seg[:30] + f"…[共{len(seg)}字]…" + seg[-25:]
        print(f"【缺】…{left}〔↯{head}〕{right}…")
    elif tag == "delete":  # 我们有，ctext 没有 → 衍文/异文
        extra += (i2 - i1)
        print(f"【衍】…{left}《我们多:{a[i1:i2]}》{right}…")
    elif tag == "replace":
        repl += max(i2 - i1, j2 - j1)
        print(f"【异】…{left}［我们:{a[i1:i2]} / ctext:{b[j1:j2]}］{right}…")

print("─" * 62)
print(f"汇总: 缺(节略/漏){miss}字  衍{extra}字  异文{repl}处片段")
print(f"提示: 【缺】中带 [共N字] 的大块即 ⋯ 节略掉的原文，补全时从 ctext 回填；")
print(f"      【异】多为繁简转换异文(如 耼/聃)或手误，需对照识典古籍裁决。")
