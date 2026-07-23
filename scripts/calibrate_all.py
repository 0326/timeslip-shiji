#!/usr/bin/env python3
# 批量校准：对一组卷号跑 ctext 原文比对，输出完整度总表 + 缺口清单。
# 用法: python3 scripts/calibrate_all.py            # 默认跑 44 个待补全卷
#       python3 scripts/calibrate_all.py 44 47 92    # 指定卷号
# 依赖 scripts/_ctext_slugs.json（juan -> [slug,title]），由 TOC 抓取生成。
import sys, re, json, time, urllib.request, difflib

SLUGS = json.load(open("scripts/_ctext_slugs.json", encoding="utf-8"))
DEFAULT = [5,6,7,8,25,30,31,39,40,41,43,44,46,47,49,55,58,60,81,83,84,87,91,92,
           95,96,97,98,99,100,105,106,107,108,109,110,112,113,123,126,127,128,129,130]
juans = [int(x) for x in sys.argv[1:]] or DEFAULT

HAN = lambda ch: "一" <= ch <= "鿿" or "㐀" <= ch <= "䶿"
han_only = lambda s: "".join(c for c in s if HAN(c))

def ours_text(j):
    raw = open(f"src/react-app/data/classics/chapters/{j:03d}.ts", encoding="utf-8").read()
    segs = re.findall(r'original:\s*\n?\s*"((?:[^"\\]|\\.)*)"', raw)
    return segs, sum(s.count("⋯") + s.count("……") for s in segs)

def ctext_text(slug):
    url = f"https://ctext.org/shiji/{slug}/zhs"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")
    cells = re.findall(r'<td class="ctext">(.*?)</td>', html, re.S)
    return "".join(re.sub(r"<[^>]+>", "", c).replace("&nbsp;", "") for c in cells)

rows = []
report = []
for j in juans:
    slug, title = SLUGS[str(j)]
    try:
        segs, trunc = ours_text(j)
        a = han_only("".join(segs))
        b = han_only(ctext_text(slug))
    except Exception as e:
        rows.append((j, title, -1, 0, 0, 0, f"ERR {type(e).__name__}"))
        continue
    if not b:
        rows.append((j, title, -1, len(a), 0, trunc, "ctext空")); continue
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    matched = sum(n for _, _, n in sm.get_matching_blocks())
    pct = matched / len(b) * 100
    miss = len(b) - matched
    # 收集大缺口（ctext 有、我们缺，>=20字）
    gaps = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ("insert", "replace") and (j2 - j1) >= 20:
            ctx = a[max(0, i1-8):i1]
            gaps.append((j2 - j1, ctx, b[j1:j2]))
    rows.append((j, title, pct, len(a), len(b), trunc, f"{len(gaps)}个大缺口"))
    report.append((j, title, slug, pct, miss, gaps))
    time.sleep(0.4)  # 礼貌限速

# ---- 总表（按完整度升序＝优先级）----
rows.sort(key=lambda r: (r[2] if r[2] >= 0 else 999))
print("═" * 76)
print(f"{'卷':>4} {'篇名':<12} {'完整度':>7} {'我们字':>6} {'ctext字':>7} {'⋯':>3}  备注")
print("─" * 76)
for j, t, pct, na, nb, tr, note in rows:
    ps = f"{pct:5.1f}%" if pct >= 0 else "  ERR "
    print(f"{j:>4} {t:<12} {ps:>7} {na:>6} {nb:>7} {tr:>3}  {note}")
done = [r for r in rows if r[2] >= 95]
mid  = [r for r in rows if 0 <= r[2] < 95]
print("─" * 76)
print(f"≥95%(基本完整,仅异文): {len(done)} 卷   <95%(需补全): {len(mid)} 卷")
total_miss = sum(r[4] for r in report)
print(f"全部待补缺字合计 ≈ {total_miss} 字")

# ---- 缺口明细写文件 ----
with open("scripts/_calibrate_gaps.txt", "w", encoding="utf-8") as f:
    for j, t, slug, pct, miss, gaps in sorted(report, key=lambda r: r[3]):
        f.write(f"\n卷{j} {t}  (ctext/{slug})  完整度{pct:.1f}%  缺≈{miss}字  大缺口{len(gaps)}个\n")
        for n, ctx, seg in gaps:
            head = seg if len(seg) <= 50 else seg[:25] + f"…[{n}字]…" + seg[-20:]
            f.write(f"   …{ctx}↯ {head}\n")
print("缺口明细已写入 scripts/_calibrate_gaps.txt")
