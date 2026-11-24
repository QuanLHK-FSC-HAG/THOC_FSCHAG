#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Tách file export HTML của Không gian Bộ môn Tin học FSC HAG thành webapp theo module.

Cách dùng:
    python3 tools/split.py [đường-dẫn-file-export.html] [thư-mục-đích]

Mặc định:
    export: ~/workspace/your_files/bo-mon-tin-hoc-fsc-hag/bo-mon-tin-hoc-fsc-hag.html
    đích:   thư mục chứa repo (thư mục cha của tools/)

Kết quả:
    index.html                  — shell: hero + chọn lớp + khung lớp (rỗng) + hướng dẫn/ôn tập + footer
    assets/css/style.css        — toàn bộ CSS của bản export
    assets/js/app.js            — logic chung (điều hướng, chấm điểm khóa kết quả, ôn tập),
                                  giữ nguyên code của bản export, chỉ trỏ dữ liệu sang THOC_DATA
    data/grade6/data.js         — module Lớp 6:  HTML bài học + hoạt động + ngân hàng ôn tập
    data/grade7/data.js         — module Lớp 7:  (như trên)
    data/grade8/data.js         — module Lớp 8:  (như trên)
    data/grade10/data10a.js     — module Lớp 10, chunk 1/2 (xem quy tắc tách chunk bên dưới)
    data/grade10/data10b.js     — module Lớp 10, chunk 2/2 (gộp bằng Object.assign)
    data/grade11/data.js        — module Lớp 11: (như trên)
    (Lớp 9 và 12 chưa có dữ liệu nên không có thư mục, không xuất hiện trong menu.)

Quy tắc tách chunk (thêm ngày 24/11/2026):
  - github push-files trả HTTP 413 khi một lần gọi vượt ~5.44 MiB; file
    3.65 MiB đã đẩy thành công, nên mỗi file dữ liệu giữ dưới 3.5 MiB
    (CHUNK_MAX_BYTES). Lớp nào vượt ngưỡng thì tách lessonsHtml thành
    nhiều chunk ~3 MiB: chunk đầu là object đầy đủ (lessonsHtml phần đầu
    + order/names/maxes/activities/reviewBank/summaries), các chunk sau
    chỉ nối phần HTML còn lại vào lessonsHtml bằng Object.assign.
  - Tách ưu tiên tại ranh giới <section class="step-sec" ...> của lớp
    (mỗi bài/mục là một section); nếu một section đơn vẫn quá lớn thì
    tách tại dấu xuống dòng. Không tách trong chuỗi escape của template
    literal. Các chunk nạp nối tiếp theo đúng thứ tự thẻ <script> trong
    index.html, trước app.js.

Nguyên tắc:
  - Không sửa nội dung kiến thức, đáp án hay hành vi: code logic giữ nguyên từng chữ,
    chỉ thay các khối dữ liệu nội tuyến bằng tham chiếu tới window.THOC_DATA.
  - Ảnh giữ dạng base64 trong file text (không tạo file nhị phân) vì công cụ đẩy
    GitHub chỉ nhận nội dung UTF-8.
  - Script tự kiểm tra và dừng lại (lỗi) nếu cấu trúc bản export khác với giả định.
"""

import json
import os
import re
import sys

GRADES = ["6", "7", "8", "10", "11"]
BUILDERS = ["buildQuiz", "buildSingle", "buildMulti", "buildTF", "buildDrag"]
# Ngưỡng an toàn cho mỗi file dữ liệu khi đẩy GitHub: push-files lỗi 413 ở
# ~5.44 MiB/lần gọi, file 3.65 MiB đã đẩy thành công — giữ mỗi file < 3.5 MiB.
CHUNK_MAX_BYTES = 3_500_000
CHUNK_SUFFIXES = "abcdefghijklmnopqrstuvwxyz"
DEFAULT_EXPORT = os.path.expanduser(
    "~/workspace/your_files/bo-mon-tin-hoc-fsc-hag/bo-mon-tin-hoc-fsc-hag.html"
)


# --------------------------------------------------------------------------
# Trình phân tích JS: so khớp ngoặc có tôn trọng chuỗi và chú thích
# --------------------------------------------------------------------------
def js_match(s, i, open_ch, close_ch):
    """s[i] == open_ch. Trả về chỉ số ngay sau dấu đóng tương ứng."""
    assert s[i] == open_ch, "js_match: vị trí bắt đầu không phải %r" % open_ch
    depth = 0
    j = i
    n = len(s)
    while j < n:
        c = s[j]
        if c in ("'", '"', "`"):
            q = c
            j += 1
            while j < n:
                if s[j] == "\\":
                    j += 2
                    continue
                if s[j] == q:
                    j += 1
                    break
                j += 1
            continue
        if c == "/" and j + 1 < n and s[j + 1] == "/":
            j = s.find("\n", j)
            if j == -1:
                return n
            continue
        if c == "/" and j + 1 < n and s[j + 1] == "*":
            k = s.find("*/", j + 2)
            if k == -1:
                raise ValueError("Chú thích khối không đóng")
            j = k + 2
            continue
        if c == open_ch:
            depth += 1
        elif c == close_ch:
            depth -= 1
            if depth == 0:
                return j + 1
        j += 1
    raise ValueError("Không tìm thấy dấu đóng %r" % close_ch)


def split_top_level(s):
    """Tách chuỗi (nội dung trong [...] hoặc {...}) thành các mục cấp cao nhất,
    tôn trọng ngoặc, chuỗi và chú thích. Trả về danh sách các đoạn text."""
    parts = []
    depth = 0
    start = 0
    j = 0
    n = len(s)
    while j < n:
        c = s[j]
        if c in ("'", '"', "`"):
            q = c
            j += 1
            while j < n:
                if s[j] == "\\":
                    j += 2
                    continue
                if s[j] == q:
                    j += 1
                    break
                j += 1
            continue
        if c == "/" and j + 1 < n and s[j + 1] == "/":
            j = s.find("\n", j)
            if j == -1:
                break
            continue
        if c == "/" and j + 1 < n and s[j + 1] == "*":
            k = s.find("*/", j + 2)
            if k == -1:
                raise ValueError("Chú thích khối không đóng")
            j = k + 2
            continue
        if c in "[{(":
            depth += 1
        elif c in "]})":
            depth -= 1
        elif c == "," and depth == 0:
            parts.append(s[start:j])
            start = j + 1
        j += 1
    tail = s[start:]
    if tail.strip():
        parts.append(tail)
    return parts


def parse_object_entries(obj_text):
    """obj_text là object literal JS dạng {"k": v, ...}. Trả về [(key, value_text)]."""
    obj_text = obj_text.strip()
    assert obj_text.startswith("{") and obj_text.endswith("}"), "Không phải object literal"
    inner = obj_text[1:-1]
    entries = []
    for part in split_top_level(inner):
        part = part.strip()
        if not part:
            continue
        m = re.match(r'"((?:[^"\\]|\\.)*)"\s*:', part)
        if not m:
            raise ValueError("Không đọc được key trong mục object: %r" % part[:80])
        key = json.loads('"' + m.group(1) + '"')
        value = part[m.end():].strip()
        entries.append((key, value))
    return entries


# --------------------------------------------------------------------------
# Trích xuất khung HTML
# --------------------------------------------------------------------------
def extract_panels(body):
    """Tìm các <div class="grade-panel" id="panel-X"> và trả về
    {grade: (open_tag, inner_html, close_tag, span_start, span_end)}."""
    panels = {}
    for m in re.finditer(
        r'<div class="grade-panel" id="panel-(6|7|8|10|11)">', body
    ):
        grade = m.group(1)
        open_end = m.end()
        # Đếm độ sâu của <div> ... </div> kể từ sau thẻ mở
        depth = 1
        pos = open_end
        close_start = None
        while True:
            mo = re.search(r"<div\b|</div>", body[pos:])
            if not mo:
                raise ValueError("Không tìm thấy thẻ đóng của panel-%s" % grade)
            tag = mo.group(0)
            tpos = pos + mo.start()
            if tag == "</div>":
                depth -= 1
                if depth == 0:
                    close_start = tpos
                    close_end = tpos + len(tag)
                    break
            else:
                depth += 1
            pos = tpos + len(tag)
        panels[grade] = (
            m.group(0),
            body[open_end:close_start],
            body[close_start:close_end],
            m.start(),
            close_end,
        )
    if sorted(panels.keys()) != sorted(GRADES):
        raise ValueError("Thiếu panel lớp: tìm thấy %s" % sorted(panels.keys()))
    # Kiểm chứng: số <div> và </div> cân bằng trong body (đã bỏ script)
    body_noscript = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.S)
    n_open = len(re.findall(r"<div\b", body_noscript))
    n_close = len(re.findall(r"</div>", body_noscript))
    if n_open != n_close:
        raise ValueError(
            "Số thẻ <div> (%d) và </div> (%d) không cân bằng" % (n_open, n_close)
        )
    return panels


# --------------------------------------------------------------------------
# Trích xuất dữ liệu từng lớp từ 2 script
# --------------------------------------------------------------------------
def grade_of_section_header(header_text, current):
    """Tiêu đề mục dạng 'LỚP 7 — BÀI 4: ...' đổi lớp hiện tại; 'BÀI 5: ...' giữ nguyên."""
    m = re.search(r"LỚP\s+(6|7|8|10|11)\b", header_text)
    return m.group(1) if m else current


def extract_score_tables(big):
    """Trích ORDER/NAMES/MAXES (và ORDER7/NAMES7/...). Trả về
    ({grade: {'order': text, 'names': text, 'maxes': text}}, [(start, end, replacement)])"""
    tables = {}
    replacements = []
    suffix_to_grade = {"": "6", "7": "7", "8": "8", "10": "10", "11": "11"}
    key_of = {"ORDER": "order", "NAMES": "names", "MAXES": "maxes"}
    for m in re.finditer(r"var (ORDER|NAMES|MAXES)(7|8|10|11)?\s*=\s*", big):
        name, suffix = m.group(1), m.group(2) or ""
        grade = suffix_to_grade[suffix]
        lit_start = m.end()
        open_ch = big[lit_start]
        assert open_ch in "[{", "Literal của %s không phải [ hoặc {" % name
        close_ch = "]" if open_ch == "[" else "}"
        lit_end = js_match(big, lit_start, open_ch, close_ch)
        # Câu lệnh kết thúc bằng ';'
        semi = big.find(";", lit_end)
        if semi == -1 or semi - lit_end > 3:
            raise ValueError("Không tìm thấy ';' sau literal của %s" % name)
        literal = big[lit_start:lit_end]
        tables.setdefault(grade, {})[key_of[name]] = literal
        varname = name + suffix
        replacements.append(
            (m.start(), semi + 1,
             'var %s = window.THOC_DATA["%s"].%s;'
             % (varname, grade, key_of[name]))
        )
    for g in GRADES:
        if sorted(tables.get(g, {}).keys()) != ["maxes", "names", "order"]:
            raise ValueError("Thiếu bảng điểm của lớp %s: %s" % (g, tables.get(g, {}).keys()))
    return tables, replacements


def extract_activity_calls(big):
    """Trích các lệnh gọi buildX(...) trong vùng dữ liệu hoạt động.
    Trả về ({grade: [ {fn, id, args_text} ]}, region_start, region_end)."""
    header = big.find("DỮ LIỆU CÁC HOẠT ĐỘNG")
    if header == -1:
        raise ValueError("Không tìm thấy vùng dữ liệu hoạt động")
    header_start = big.rfind("/*", 0, header)
    rb = big.find("var REVIEW_BANK")
    if rb == -1:
        raise ValueError("Không tìm thấy REVIEW_BANK")
    region = big[header_start:rb]
    # Xác định lớp của từng lệnh gọi theo tiêu đề mục gần nhất
    headers = [(m.start(), m.group(1)) for m in
               re.finditer(r"/\* =+\s*(.*?)\s*=+ \*/", region)]
    calls = []
    call_re = re.compile(r"(?<!function )build(Quiz|Single|Multi|TF|Drag)\s*\(")
    for m in call_re.finditer(region):
        fn = "build" + m.group(1)
        paren = region.find("(", m.start())
        call_end = js_match(region, paren, "(", ")")
        # Câu lệnh kết thúc bằng ';'
        semi = region.find(";", call_end)
        if semi == -1:
            raise ValueError("Không tìm thấy ';' sau lệnh gọi %s" % fn)
        inner = region[paren + 1:call_end - 1]
        args = [a.strip() for a in split_top_level(inner)]
        if not args:
            raise ValueError("Lệnh gọi %s không có đối số" % fn)
        call_id = json.loads(args[0])
        # Lớp hiện tại = tiêu đề mục gần nhất trước lệnh gọi
        grade = "6"
        for hpos, htext in headers:
            if hpos > m.start():
                break
            grade = grade_of_section_header(htext, grade)
        calls.append({
            "fn": fn, "id": call_id, "args": args[1:], "grade": grade,
            "span": (header_start + m.start(), header_start + semi + 1),
        })
    if not calls:
        raise ValueError("Không tìm thấy lệnh gọi hoạt động nào")
    # Kiểm chứng: vùng này chỉ còn lệnh gọi + chú thích + khoảng trắng
    cleaned = region
    for c in sorted(calls, key=lambda x: -x["span"][0]):
        s0, s1 = c["span"][0] - header_start, c["span"][1] - header_start
        cleaned = cleaned[:s0] + cleaned[s1:]
    cleaned = re.sub(r"/\*.*?\*/", "", cleaned, flags=re.S)
    if cleaned.strip(" \t\r\n;"):
        raise ValueError(
            "Vùng dữ liệu hoạt động còn nội dung khác ngoài lệnh gọi: %r"
            % cleaned.strip()[:200]
        )
    by_grade = {g: [] for g in GRADES}
    for c in calls:
        by_grade[c["grade"]].append(
            {"fn": c["fn"], "id": c["id"], "args": c["args"]}
        )
    return by_grade, header_start, rb


def extract_review_bank(big):
    """Tách REVIEW_BANK theo lớp. Trả về ({grade: value_text}, (start, end))."""
    m = re.search(r"var REVIEW_BANK\s*=\s*", big)
    if not m:
        raise ValueError("Không tìm thấy REVIEW_BANK")
    lit_start = m.end()
    lit_end = js_match(big, lit_start, "{", "}")
    semi = big.find(";", lit_end)
    literal = big[lit_start:lit_end]
    entries = parse_object_entries(literal)
    by_grade = {}
    for key, value in entries:
        if key not in GRADES:
            raise ValueError("REVIEW_BANK có khóa lớp lạ: %r" % key)
        by_grade[key] = value
    if sorted(by_grade.keys()) != sorted(GRADES):
        raise ValueError("REVIEW_BANK thiếu lớp: %s" % sorted(by_grade.keys()))
    return by_grade, (m.start(), semi + 1)


def extract_summaries(small):
    """Tách SUMMARIES theo tiền tố id section. Trả về ({grade: [(key, value)]}, (start, end))."""
    m = re.search(r"var SUMMARIES\s*=\s*", small)
    if not m:
        raise ValueError("Không tìm thấy SUMMARIES")
    lit_start = m.end()
    lit_end = js_match(small, lit_start, "{", "}")
    semi = small.find(";", lit_end)
    literal = small[lit_start:lit_end]
    entries = parse_object_entries(literal)

    def grade_of_section(sec_id):
        if sec_id.startswith("sec-g7-"):
            return "7"
        if sec_id.startswith("sec-g8-"):
            return "8"
        if sec_id.startswith("sec-g10-"):
            return "10"
        if sec_id.startswith("sec-g11-"):
            return "11"
        if sec_id.startswith("sec-"):
            return "6"
        raise ValueError("Không xác định được lớp của section %r" % sec_id)

    by_grade = {g: [] for g in GRADES}
    for key, value in entries:
        by_grade[grade_of_section(key)].append((key, value))
    return by_grade, (m.start(), semi + 1)


def js_string_literal(text):
    """Trả về text dưới dạng chuỗi JS dùng dấu ngoặc kép (JSON), giữ nguyên nội dung."""
    return json.dumps(text, ensure_ascii=False)


def template_literal(html):
    """Đóng HTML vào template literal JS, escape \\, ` và ${. Kiểm chứng không còn ${."""
    esc = html.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    assert "${" not in esc.replace("\\${", ""), "Template literal còn ${ chưa escape"
    return "`" + esc + "`"


# --------------------------------------------------------------------------
# Ghép các file đích
# --------------------------------------------------------------------------
def build_app_js(big, small, score_repl, calls_region, review_span, sum_span):
    """Ghép app.js: bootstrap nạp HTML bài học + script lớn + script nhỏ (đã sửa).
    Thứ tự thay thế: từ vị trí muộn nhất về sớm nhất để các vị trí đã tính
    trên bản gốc không bị lệch khi chuỗi thay đổi độ dài."""
    # 1. REVIEW_BANK (vị trí muộn nhất) — thay bằng hợp nhất từ các module lớp
    rb_s, rb_e = review_span
    merge_rb = (
        "var REVIEW_BANK = {};\n"
        "      [\"6\", \"7\", \"8\", \"10\", \"11\"].forEach(function (g) {\n"
        "        if (window.THOC_DATA[g] && window.THOC_DATA[g].reviewBank)\n"
        "          REVIEW_BANK[g] = window.THOC_DATA[g].reviewBank;\n"
        "      });"
    )
    big = big[:rb_s] + merge_rb + big[rb_e:]
    # 2. Vùng lệnh gọi hoạt động — thay bằng vòng lặp dispatch
    rs, re_ = calls_region
    dispatch = (
        "/* Hoạt động từng lớp — dữ liệu nằm trong data/gradeX/data.js\n"
        "         (THOC_DATA[g].activities), giữ nguyên thứ tự gọi như bản gốc. */\n"
        "      [\"6\", \"7\", \"8\", \"10\", \"11\"].forEach(function (g) {\n"
        "        var acts = (window.THOC_DATA[g] && window.THOC_DATA[g].activities) || [];\n"
        "        acts.forEach(function (a) {\n"
        "          var fn = { buildQuiz: buildQuiz, buildSingle: buildSingle,\n"
        "                     buildMulti: buildMulti, buildTF: buildTF,\n"
        "                     buildDrag: buildDrag }[a.fn];\n"
        "          if (fn) fn.apply(null, [a.id].concat(a.args));\n"
        "        });\n"
        "      });"
    )
    big = big[:rs] + dispatch + big[re_:]
    # 3. Các bảng điểm (vị trí sớm nhất) — thay từ cuối lên đầu
    for start, end, repl in sorted(score_repl, key=lambda x: -x[0]):
        big = big[:start] + repl + big[end:]
    # 4. SUMMARIES trong script nhỏ — thay bằng hợp nhất từ các module lớp
    sm_s, sm_e = sum_span
    merge_sm = (
        "var SUMMARIES = {};\n"
        "      [\"6\", \"7\", \"8\", \"10\", \"11\"].forEach(function (g) {\n"
        "        var s = window.THOC_DATA[g] && window.THOC_DATA[g].summaries;\n"
        "        if (s) Object.keys(s).forEach(function (k) { SUMMARIES[k] = s[k]; });\n"
        "      });"
    )
    small = small[:sm_s] + merge_sm + small[sm_e:]

    bootstrap = (
        "/* ============================================================\n"
        "   THOC_FSCHAG — bootstrap: nạp HTML bài học từng lớp vào khung.\n"
        "   Các file data/gradeX/data.js (nạp trước file này) định nghĩa\n"
        "   window.THOC_DATA[g].lessonsHtml; đoạn này chèn vào panel của\n"
        "   từng lớp trước khi logic bên dưới chạy, nên mọi hành vi giữ\n"
        "   nguyên như bản một file duy nhất.\n"
        "   ============================================================ */\n"
        "(function () {\n"
        "  \"use strict\";\n"
        "  window.THOC_DATA = window.THOC_DATA || {};\n"
        "  [\"6\", \"7\", \"8\", \"10\", \"11\"].forEach(function (g) {\n"
        "    var panel = document.getElementById(\"panel-\" + g);\n"
        "    if (panel && window.THOC_DATA[g])\n"
        "      panel.innerHTML = window.THOC_DATA[g].lessonsHtml;\n"
        "  });\n"
        "})();\n\n"
    )
    return bootstrap + big + "\n" + small


def build_index_html(html, panels, grade_chunks):
    """Ghép index.html: head gốc (style -> link css) + shell với panel rỗng + script tags.
    grade_chunks: {lớp: [tên file dữ liệu]} — lớp tách chunk có nhiều thẻ <script>
    nạp nối tiếp theo đúng thứ tự, trước app.js."""
    head_m = re.search(r"<head[^>]*>(.*?)</head>", html, re.S)
    head = head_m.group(1)
    styles = re.findall(r"<style[^>]*>(.*?)</style>", head, re.S)
    head_no_style = re.sub(r"<style[^>]*>.*?</style>", "", head, flags=re.S)
    head_new = head_no_style.rstrip() + (
        '\n    <link rel="stylesheet" href="assets/css/style.css" />\n  '
    )
    body_m = re.search(r"<body[^>]*>(.*)</body>", html, re.S)
    body = body_m.group(1)
    body_noscript = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.S)
    # Bỏ các panel khỏi shell, rồi chèn lại panel rỗng theo thứ tự lớp 6,7,8,10,11
    first_span = min(v[3] for v in panels.values())
    last_span = max(v[4] for v in panels.values())
    before = body_noscript[:first_span]
    after = body_noscript[last_span:]
    before = before.replace(
        "<!-- ================= LỚP 7 / 8 / 10 / 11 ================= -->",
        "<!-- ================= CÁC LỚP (nội dung từng lớp nằm trong data/gradeX/data.js) ================= -->",
    )
    empty_panels = "\n".join(
        '      <div class="grade-panel" id="panel-%s"></div>' % g for g in GRADES
    )
    shell = before + "\n" + empty_panels + "\n" + after
    scripts = "\n".join(
        '    <script src="data/grade%s/%s"></script>' % (g, fn)
        for g in GRADES for fn, _content in grade_chunks[g]
    ) + '\n    <script src="assets/js/app.js"></script>\n'
    index = (
        "<!doctype html>\n<html lang=\"vi\">\n  <head>"
        + head_new
        + "</head>\n  <body>"
        + shell
        + scripts
        + "  </body>\n</html>\n"
    )
    return index, styles


def _utf8_len(text):
    return len(text.encode("utf-8"))


def _byte_cut(text, max_bytes):
    """Vị trí cắt (số ký tự) để text[:cut] <= max_bytes (UTF-8).
    Không cắt ngay sau dấu backslash để khỏi chẻ đôi chuỗi escape."""
    cut = 0
    total = 0
    for ch in text:
        n = len(ch.encode("utf-8"))
        if total + n > max_bytes:
            break
        total += n
        cut += 1
    while cut > 0 and text[cut - 1] == "\\":
        cut -= 1
    return cut


def split_lessons_html(grade, esc_html, budgets):
    """Chia nội dung lessonsHtml (đã escape cho template literal) thành các
    phần, mỗi phần vừa ngân sách byte tương ứng trong budgets (phần đầu trừ
    chi phí object + các khóa khác, các phần sau trừ chi phí wrapper).
    Tách ưu tiên tại ranh giới <section class="step-sec" ...>; nếu một
    section đơn vẫn quá lớn thì tách tại dấu xuống dòng, cuối cùng cắt
    cứng theo byte (không cắt sau backslash). budgets được mở rộng bằng
    ngân sách cuối nếu cần thêm phần."""
    bounds = [m.start() for m in re.finditer(
        r'<section class="step-sec" id="sec-g%s-[^"]+">' % re.escape(grade),
        esc_html)]
    cuts = [0] + bounds + [len(esc_html)]
    segments = [esc_html[cuts[i]:cuts[i + 1]] for i in range(len(cuts) - 1)]
    segments = [s for s in segments if s]
    parts = []
    cur = ""
    bi = 0

    def budget():
        return budgets[bi] if bi < len(budgets) else budgets[-1]

    for seg in segments:
        # Đóng phần hiện tại nếu thêm đoạn này sẽ vượt ngân sách
        while cur and _utf8_len(cur) + _utf8_len(seg) > budget():
            parts.append(cur)
            cur = ""
            bi += 1
        # Một đoạn đơn vượt ngân sách: tách nhỏ đoạn đó
        while _utf8_len(seg) > budget():
            room = budget() - _utf8_len(cur)
            cut = _byte_cut(seg, room)
            nl = seg.rfind("\n", 0, cut)
            if nl > 0:
                cut = nl + 1
            if cut <= 0:
                raise ValueError(
                    "Không tách được đoạn HTML tại ngân sách %d byte" % budget())
            cur += seg[:cut]
            seg = seg[cut:]
            parts.append(cur)
            cur = ""
            bi += 1
        cur += seg
    if cur:
        parts.append(cur)
    return parts


def build_grade_data_js(grade, lessons_html, tables, activities, review_value, summaries):
    """Ghép file data.js của một lớp."""
    sum_entries = ",\n        ".join(
        "%s: %s" % (js_string_literal(k), v) for k, v in summaries
    )
    act_entries = []
    for a in activities:
        args = ", ".join(a["args"])
        act_entries.append(
            '    { fn: %s, id: %s, args: [%s] }'
            % (js_string_literal(a["fn"]), js_string_literal(a["id"]), args)
        )
    out = (
        "/* ============================================================\n"
        "   Module Lớp %s — Không gian Bộ môn Tin học FSC HAG\n"
        "   Sửa bài trong module này: sửa HTML bài học trong lessonsHtml,\n"
        "   sửa hoạt động trong activities, sửa ngân hàng ôn tập trong\n"
        "   reviewBank, sửa tóm tắt trong summaries. Không sửa file khác\n"
        "   nếu chỉ thay đổi nội dung của lớp này.\n"
        "   ============================================================ */\n"
        "window.THOC_DATA = window.THOC_DATA || {};\n"
        "window.THOC_DATA[\"%s\"] = {\n"
        "  lessonsHtml: %s,\n"
        "  order: %s,\n"
        "  names: %s,\n"
        "  maxes: %s,\n"
        "  activities: [\n%s\n  ],\n"
        "  reviewBank: %s,\n"
        "  summaries: {\n        %s\n  }\n"
        "};\n"
        % (
            grade,
            grade,
            template_literal(lessons_html),
            tables["order"],
            tables["names"],
            tables["maxes"],
            ",\n".join(act_entries),
            review_value,
            sum_entries,
        )
    )
    return out


def build_grade_data_chunks(grade, lessons_html, tables, activities,
                            review_value, summaries):
    """Ghép (các) file dữ liệu của một lớp. Trả về [(tên file, nội dung)].
    Một chunk (data.js) nếu vừa ngưỡng CHUNK_MAX_BYTES; nhiều chunk
    (data{grade}a.js, data{grade}b.js, ...) nếu lessonsHtml quá lớn:
    chunk đầu là object đầy đủ, các chunk sau nối phần HTML còn lại vào
    lessonsHtml bằng Object.assign."""
    sum_entries = ",\n        ".join(
        "%s: %s" % (js_string_literal(k), v) for k, v in summaries
    )
    act_entries = []
    for a in activities:
        args = ", ".join(a["args"])
        act_entries.append(
            '    { fn: %s, id: %s, args: [%s] }'
            % (js_string_literal(a["fn"]), js_string_literal(a["id"]), args)
        )
    other_keys = (
        "  order: %s,\n"
        "  names: %s,\n"
        "  maxes: %s,\n"
        "  activities: [\n%s\n  ],\n"
        "  reviewBank: %s,\n"
        "  summaries: {\n        %s\n  }\n"
        % (
            tables["order"],
            tables["names"],
            tables["maxes"],
            ",\n".join(act_entries),
            review_value,
            sum_entries,
        )
    )
    header = (
        "/* ============================================================\n"
        "   Module Lớp %s — Không gian Bộ môn Tin học FSC HAG\n"
        "   Sửa bài trong module này: sửa HTML bài học trong lessonsHtml,\n"
        "   sửa hoạt động trong activities, sửa ngân hàng ôn tập trong\n"
        "   reviewBank, sửa tóm tắt trong summaries. Không sửa file khác\n"
        "   nếu chỉ thay đổi nội dung của lớp này.\n"
        "   ============================================================ */\n"
        % grade
    )
    # Nội dung lessonsHtml đã escape cho template literal
    esc = template_literal(lessons_html)[1:-1]
    single = (
        header
        + 'window.THOC_DATA = window.THOC_DATA || {};\n'
        + 'window.THOC_DATA["%s"] = {\n' % grade
        + "  lessonsHtml: `" + esc + "`,\n"
        + other_keys
        + "};\n"
    )
    if _utf8_len(single) <= CHUNK_MAX_BYTES:
        return [("data.js", single)]
    # Tách nhiều chunk. Ngân sách phần đầu trừ chi phí object + khóa khác
    # (+200 byte dự phòng cho dòng ghi chú chunk), các phần sau trừ chi
    # phí wrapper Object.assign (+100 byte dự phòng).
    head1 = (
        header
        + 'window.THOC_DATA = window.THOC_DATA || {};\n'
        + 'window.THOC_DATA["%s"] = {\n' % grade
        + "  lessonsHtml: `"
    )
    tail1 = "`,\n" + other_keys + "};\n"
    head_n = (
        "/* ============================================================\n"
        "   Module Lớp %s — chunk nối tiếp (gộp bằng Object.assign)\n"
        "   Nạp sau chunk đầu của lớp; nối phần HTML còn lại vào\n"
        "   lessonsHtml của lớp, trước khi app.js chạy.\n"
        "   ============================================================ */\n"
        % grade
    )
    assign_open = (
        'window.THOC_DATA["%s"] = Object.assign(window.THOC_DATA["%s"], {\n'
        % (grade, grade)
        + '  lessonsHtml: window.THOC_DATA["%s"].lessonsHtml + `' % grade
    )
    assign_close = "`\n});\n"
    budgets = [
        CHUNK_MAX_BYTES - _utf8_len(head1) - _utf8_len(tail1) - 200,
        CHUNK_MAX_BYTES - _utf8_len(head_n) - _utf8_len(assign_open)
        - _utf8_len(assign_close) - 100,
    ]
    parts = split_lessons_html(grade, esc, budgets)
    n = len(parts)
    if n > len(CHUNK_SUFFIXES):
        raise ValueError("Lớp %s cần %d chunk, vượt giới hạn" % (grade, n))
    note1 = ("   (chunk 1/%d — lessonsHtml tách làm %d phần, "
             "chunk sau gộp bằng Object.assign)\n" % (n, n))
    head1 = head1.replace(
        "   Module Lớp %s — Không gian Bộ môn Tin học FSC HAG\n" % grade,
        "   Module Lớp %s — Không gian Bộ môn Tin học FSC HAG\n" % grade + note1,
        1,
    )
    chunks = []
    for i, part in enumerate(parts):
        suffix = CHUNK_SUFFIXES[i]
        if i == 0:
            content = head1 + part + tail1
        else:
            head_ni = head_n.replace(
                "   Module Lớp %s — chunk nối tiếp (gộp bằng Object.assign)\n" % grade,
                "   Module Lớp %s — chunk %d/%d (gộp bằng Object.assign)\n"
                % (grade, i + 1, n),
                1,
            )
            content = head_ni + assign_open + part + assign_close
        if _utf8_len(content) > CHUNK_MAX_BYTES:
            raise ValueError(
                "Chunk %d của lớp %s vẫn vượt ngưỡng (%d byte)"
                % (i + 1, grade, _utf8_len(content))
            )
        chunks.append(("data%s%s.js" % (grade, suffix), content))
    return chunks


def main():
    export_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_EXPORT
    out_dir = (
        sys.argv[2]
        if len(sys.argv) > 2
        else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )
    html = open(export_path, encoding="utf-8").read()
    print("Đọc bản export: %s (%d byte)" % (export_path, len(html.encode("utf-8"))))

    head_m = re.search(r"<head[^>]*>(.*?)</head>", html, re.S)
    body_m = re.search(r"<body[^>]*>(.*)</body>", html, re.S)
    scripts = re.findall(r"<script[^>]*>(.*?)</script>", html, re.S)
    if len(scripts) != 2:
        raise ValueError("Bản export phải có đúng 2 script, tìm thấy %d" % len(scripts))
    big, small = scripts[0], scripts[1]
    body = body_m.group(1)

    # 1. Panel từng lớp
    panels = extract_panels(body)
    # 2. Bảng điểm
    tables, score_repl = extract_score_tables(big)
    # 3. Lệnh gọi hoạt động
    acts_by_grade, calls_start, calls_end = extract_activity_calls(big)
    calls_region = (calls_start, calls_end)
    # 4. Ngân hàng ôn tập
    review_by_grade, review_span = extract_review_bank(big)
    # 5. Tóm tắt
    sum_by_grade, sum_span = extract_summaries(small)

    # 6. Ghép các file
    chunks_by_grade = {}
    for g in GRADES:
        open_tag, inner, close_tag, _, _ = panels[g]
        chunks_by_grade[g] = build_grade_data_chunks(
            g, inner, tables[g], acts_by_grade[g],
            review_by_grade[g], sum_by_grade[g],
        )
    index_html, styles = build_index_html(html, panels, chunks_by_grade)
    app_js = build_app_js(big, small, score_repl, calls_region, review_span, sum_span)

    os.makedirs(os.path.join(out_dir, "assets", "css"), exist_ok=True)
    os.makedirs(os.path.join(out_dir, "assets", "js"), exist_ok=True)
    os.makedirs(os.path.join(out_dir, "assets", "img"), exist_ok=True)
    for g in GRADES:
        os.makedirs(os.path.join(out_dir, "data", "grade" + g), exist_ok=True)

    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_html)
    with open(os.path.join(out_dir, "assets", "css", "style.css"), "w", encoding="utf-8") as f:
        f.write("/* style.css — toàn bộ CSS của Không gian Bộ môn Tin học FSC HAG */\n")
        for i, css in enumerate(styles):
            f.write("\n/* ---- khối style %d trong bản export ---- */\n" % (i + 1))
            f.write(css)
            f.write("\n")
    with open(os.path.join(out_dir, "assets", "js", "app.js"), "w", encoding="utf-8") as f:
        f.write(app_js)
    for g in GRADES:
        for fname, content in chunks_by_grade[g]:
            with open(os.path.join(out_dir, "data", "grade" + g, fname),
                      "w", encoding="utf-8") as f:
                f.write(content)

    # 7. Báo cáo nhanh
    total_act = sum(len(acts_by_grade[g]) for g in GRADES)
    total_max = 0
    for g in GRADES:
        maxes = json.loads(tables[g]["maxes"])
        total_max += sum(maxes.values())
    print("Đã tách xong vào %s" % out_dir)
    print("  Lớp: %s" % ", ".join(GRADES))
    print("  Tổng hoạt động: %d / Tổng điểm tối đa: %d" % (total_act, total_max))
    for g in GRADES:
        grade_entries = dict(parse_object_entries(review_by_grade[g]))
        qs_value = grade_entries["qs"].strip()
        n_bank = (
            len(split_top_level(qs_value[1:-1]))
            if qs_value.startswith("[") and qs_value.endswith("]")
            else 0
        )
        chunk_info = ", ".join(
            "%s (%d byte)" % (fn, _utf8_len(c))
            for fn, c in chunks_by_grade[g]
        )
        print("    Lớp %s: %d hoạt động, %d câu hỏi ôn tập, %d tóm tắt — %s"
              % (g, len(acts_by_grade[g]), n_bank, len(sum_by_grade[g]),
                 chunk_info))


if __name__ == "__main__":
    main()
