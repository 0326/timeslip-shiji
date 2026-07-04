#!/usr/bin/env python3
# 用法: python3 scripts/clean_juan.py <juan>
# 从 docs/_pdf_index.json 定位卷，输出剥离 注释块/注码/拼音残留 后的「纯原文」。
import json, re, sys

idx = json.load(open("docs/_pdf_index.json", encoding="utf-8"))
juan = sys.argv[1]
e = idx.get(juan)
if not e:
    print(f"[juan {juan} 不在 PDF 索引内（可能需联网源）]")
    sys.exit(1)
lines = open(f"docs/{e['file'].lstrip('_') and e['file']}", encoding="utf-8").read().split("\n")
seg = lines[e["start"] - 1 : e["end"]]

out, skip = [], False
for l in seg:
    s = l.strip()
    if s.startswith("【注释】") or s.startswith("【说明】") or s.startswith("【译文】"):
        skip = True
        continue
    if skip:
        # 注释块在遇到空行后结束
        if s == "":
            skip = False
        continue
    out.append(l)

text = "\n".join(out)
# 去注码 〔..〕 ［..］ （拼音/校字）
text = re.sub(r"〔[^〕]*〕", "", text)
text = re.sub(r"［[^］]*］", "", text)
text = re.sub(r"音\s*[ａ-ｚA-Za-z][^，。、\n]*", "", text)
# 去卷首标题行/注译者行
text = re.sub(r"^史记卷.*\n", "", text)
text = re.sub(r"^.{1,12}(本纪|世家|列传|书|表)第[一二三四五六七八九十百]+.*\n", "", text)
text = re.sub(r"^.{0,8}(注译|译注)\s*\n", "", text, flags=re.M)
# 合并多余空行
text = re.sub(r"\n{3,}", "\n\n", text).strip()
print(text)
