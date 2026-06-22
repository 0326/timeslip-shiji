#!/usr/bin/env python3
# 抓取 ctext 某卷原文，按段（<td class="ctext">）输出纯文本，供补全参考。
# 用法: python3 scripts/dump_ctext.py <slug>
import sys, re, urllib.request

slug = sys.argv[1]
url = f"https://ctext.org/shiji/{slug}/zhs"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", "ignore")
cells = re.findall(r'<td class="ctext">(.*?)</td>', html, re.S)
def strip_html(s):
    s = re.sub(r"<[^>]+>", "", s)
    return s.replace("&nbsp;", "")
for i, c in enumerate(cells):
    t = strip_html(c).strip()
    if t:
        print(f"[{i}] {t}")
