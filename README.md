# Không gian Bộ môn Tin học FSC HAG

Webapp bài giảng tương tác và ôn tập kiến thức Tin học cho học sinh cấp
THCS–THPT, Trường TH, THCS & THPT FPT Hậu Giang. Nội dung bài giảng và
câu hỏi được chuyển từ file PPTX gốc của giáo viên (không tự tạo kiến thức),
theo kỹ năng `pptx-sang-bai-giang-tuong-tac`.

## Nội dung hiện có

- **20 bài / 88 hoạt động / 272 điểm**, chia theo 5 lớp:
  - Lớp 6: Bài 4, 5, 6, 7 — 25 hoạt động / 79 điểm
  - Lớp 7: Bài 4, 5, 6 — 11 hoạt động / 36 điểm
  - Lớp 8: Bài 12, 13, 14 — 12 hoạt động / 35 điểm
  - Lớp 10: Bài 3.11, 4.12, 4.13, 4.14, 4.15 — 19 hoạt động / 54 điểm
  - Lớp 11: Bài 8, 9, 10, 11, 12 — 21 hoạt động / 68 điểm
- **Ôn tập cuối HK1:** ngân hàng **269 câu** (Lớp 6: 76, Lớp 7: 36, Lớp 8: 35,
  Lớp 10: 54, Lớp 11: 68), chia 3 dạng:
  - Dạng 1 — trắc nghiệm 1 lựa chọn ABCD: **0,25đ/câu**
  - Dạng 2 — 1 câu có 4 ý Đúng/Sai: **1đ/câu (0,25đ/ý)**
  - Dạng 3 — tự luận: không chấm điểm tự động, học sinh **tự chấm 1đ/câu**
    theo 3 mức (đúng hoàn toàn / đúng một phần / chưa đúng)
  - Bộ câu hỏi luôn theo thứ tự Dạng 1 → Dạng 2 → Dạng 3; chọn 5/10/15/20/
    tất cả thì lấy đủ số câu theo thứ tự đó; nộp xong có khung nhận xét
    nhẹ nhàng cho học sinh.
- **Lớp 11 đang khóa mục ôn tập** (ngân hàng câu hỏi của lớp 11 đã có trong
  dữ liệu nhưng chưa mở — chỉ mở khi giáo viên quyết).
- **Lớp 9 và lớp 12 chưa có dữ liệu** nên không xuất hiện trong menu chọn lớp;
  bổ sung sau khi có bài của 2 lớp này.
- Chấm điểm khóa kết quả: 1 hoạt động = 1 lần nộp = 1 kết quả khóa, không
  làm lại cộng điểm, không cộng điểm trùng. Điểm bài học chỉ lưu trong
  phiên mở trang (tải lại trang sẽ mất điểm); điểm ôn tập không cộng vào
  dashboard bài học.

## Cấu trúc thư mục

```
THOC_FSCHAG/
├── index.html            # Shell: hero (logo FPT + nền mờ), menu chọn lớp,
│                         # sidebar bài học, frame bài, mục hướng dẫn học
│                         # sinh dạng sơ đồ các bước nối tiếp + ôn tập
│                         # cuối HK1, footer
├── assets/
│   ├── css/style.css     # Toàn bộ CSS (3 khối style gộp từ bản export)
│   └── js/app.js         # Logic: điều hướng theo lớp, dựng hoạt động,
│                         # chấm điểm khóa kết quả, dashboard từng lớp,
│                         # ôn tập 3 dạng; nạp dữ liệu từ window.THOC_DATA
├── data/
│   ├── grade6/data.js    # Module Lớp 6: lessonsHtml + order/names/maxes
│   ├── grade7/data.js    #   + activities + reviewBank + summaries
│   ├── grade8/data.js    #   (ảnh bài học giữ dạng base64 trong file text)
│   ├── grade10/data.js
│   └── grade11/data.js
├── tools/
│   └── split.py          # Script tách bản export 1 file của artifact
│                         # thành cấu trúc module này (chạy lại sau mỗi
│                         # lần export mới)
├── vercel.json           # Cấu hình deploy tĩnh (không có bước build)
└── README.md
```

Mỗi lớp là một module độc lập trong `data/gradeX/data.js`:
`lessonsHtml` (HTML các bài học của lớp), `order`/`names`/`maxes` (bảng
điểm), `activities` (danh sách hoạt động chấm điểm), `reviewBank` (ngân
hàng ôn tập: `acts` + `qs`), `summaries` (tóm tắt từng bài). Sửa nội dung
một lớp thì chỉ sửa file `data.js` của lớp đó.

## Chạy local

Mở trực tiếp `index.html` bằng trình duyệt (webapp không dùng `fetch()`
nên chạy được cả với `file://`), hoặc chạy server tĩnh:

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## Deploy lên Vercel (miễn phí)

1. Import repo này trên Vercel (Add New → Project → chọn repo
   `THOC_FSCHAG`).
2. Framework Preset: **Other** (không chọn framework nào).
3. Build Command: để trống; Output Directory: để trống (thư mục gốc).
4. Deploy. Vercel cấp link `*.vercel.app`; có thể gắn tên miền riêng sau.

`vercel.json` trong repo chỉ khai báo đây là site tĩnh, không có bước build.

## Thêm / sửa / xóa bài

### Thêm một bài mới (từ PPTX gốc)

1. Lấy nội dung bài từ file PPTX gốc theo kỹ năng
   `pptx-sang-bai-giang-tuong-tac` (giữ nguyên kiến thức, trình tự, thuật
   ngữ; thêm hộp `GHI VÀO VỞ`, hoạt động chấm điểm khóa kết quả, tóm tắt,
   khung hướng dẫn ghi bài; bỏ tên tác giả trong metadata).
2. Thêm HTML bài học vào `lessonsHtml` của `data/gradeX/data.js`, thêm
   hoạt động vào `activities`, cập nhật `order`/`names`/`maxes`, thêm
   tóm tắt vào `summaries`, bổ sung câu hỏi của bài vào `reviewBank.qs`
   của lớp đó (xem mục dưới).
3. Kiểm tra lại bằng `node --check` cho file `data.js` vừa sửa rồi mở
   `index.html` thử: chọn lớp → chọn bài mới → nộp thử 1 hoạt động.

### Sửa nội dung một bài

Sửa trực tiếp trong `data/gradeX/data.js` của lớp đó (HTML trong
`lessonsHtml`, đáp án trong `activities`, tóm tắt trong `summaries`).
Không sửa `index.html` hay `assets/js/app.js` nếu chỉ đổi nội dung.

### Xóa một bài

Xóa section bài đó khỏi `lessonsHtml`, xóa hoạt động của bài khỏi
`activities`, xóa tên bài khỏi `order`/`names`/`maxes`, xóa tóm tắt khỏi
`summaries`, xóa câu hỏi của bài khỏi `reviewBank.qs`.

### Xóa / thêm một lớp

- Thêm lớp mới (ví dụ lớp 9, 12 khi đã có bài): tạo thư mục
  `data/grade9/` với `data.js` theo mẫu các lớp hiện có, thêm nút chọn
  lớp trong `index.html` và thêm `"9"` vào danh sách lớp trong
  `assets/js/app.js` (các chỗ liệt kê `["6","7","8","10","11"]`).
- Xóa một lớp: làm ngược lại (xóa thư mục `data/gradeX/`, xóa nút chọn
  lớp, xóa khỏi danh sách lớp trong `app.js`).

## Cập nhật ngân hàng ôn tập

Ngân hàng của mỗi lớp nằm trong `reviewBank` của `data/gradeX/data.js`:

- `reviewBank.acts`: mỗi hoạt động một mục `{src, ans, exp}` — nguồn và
  đáp án gợi ý để học sinh tự đối chiếu ở Dạng 3.
- `reviewBank.qs`: mảng câu hỏi, mỗi câu có dạng:
  - Dạng 1: `{"a": "<id hoạt động>", "t": "single", "q": "...",
    "o": ["A", "B", "C", "D"], "c": <chỉ số đáp án đúng>}` — bắt buộc
    đủ 4 lựa chọn; đáp án đúng giữ nguyên theo bài học.
  - Dạng 2: 4 ý Đúng/Sai của cùng 1 hoạt động, mỗi ý một mục
    `{"a": "<id hoạt động>", "t": "tf", "q": "Phát biểu: ... — Đúng hay
    Sai?", "v": true/false}` — app tự gom 4 ý cùng hoạt động thành 1 câu.
  - Dạng 3: `{"a": "<id hoạt động>", "t": "text", "q": "..."}` — câu hỏi
    mở/thảo luận; đáp án gợi ý lấy từ `reviewBank.acts[<id>].ans`.
- Câu chọn nhiều đáp án (`multi`) không thuộc 3 dạng nên không đưa vào
  bộ ôn tập.
- Khi thêm bài mới: thêm câu hỏi của bài vào `reviewBank.qs` theo đúng
  3 dạng trên, giữ thứ tự Dạng 1 → Dạng 2 → Dạng 3 trong mảng (app xáo
  trộn ngẫu nhiên trong từng dạng khi sinh đề).

## Quy trình xuất lại từ artifact + đẩy lên GitHub

Khi không gian trên artifact được sửa (thêm bài, sửa đáp án, đổi thang
điểm...), đồng bộ lại repo bằng các bước sau:

1. Export bản mới nhất của artifact `bo-mon-tin-hoc-fsc-hag` ra file
   `bo-mon-tin-hoc-fsc-hag.html`.
2. Chạy script tách module (ghi đè đúng cấu trúc repo này):
   ```bash
   python3 tools/split.py <file-export.html> <thư-mục-repo>
   ```
3. Kiểm chứng: `node --check assets/js/app.js data/grade*/data.js`;
   đếm đủ 20 bài / 88 hoạt động / 272 điểm; ngân hàng đủ 269 câu;
   Dạng 1 đủ 4 lựa chọn; lớp 9/12 không xuất hiện; lớp 11 vẫn khóa ôn tập.
4. Đẩy lên GitHub bằng `github push-files` theo quy trình snapshot-push
   (xem `/opt/hatch/connectors/github/references/snapshot-push.md`):
   tổng dung lượng repo ~16,4 MiB, vượt giới hạn 16 MiB/snapshot nên
   **đẩy thành 2 commit** (mỗi commit ≤ 16 MiB), không cắt bớt nội dung.
   Ghi sync record tại `thoc-fschag.muse-github-snapshot-sync.json`.

## Lưu ý

- Không tự tạo kiến thức hay đáp án mới: mọi nội dung đều lấy từ PPTX
  gốc của giáo viên; đáp án nào suy ra từ nội dung bài (PPTX gốc không
  ghi sẵn) cần giáo viên xác nhận khi xem lại.
- Không ghi tên tác giả PPTX gốc vào file (metadata tác giả đã xóa).
