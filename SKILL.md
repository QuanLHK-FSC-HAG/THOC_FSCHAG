# SKILL.md — Không gian Bộ môn Tin học FSC HAG

> **Tài liệu dấu vết cho agent AI.** File này để bất kỳ agent AI nào (không
> chỉ agent chính) đọc là hiểu đủ để bảo trì và phát triển tiếp webapp này
> mà không cần hỏi lại từ đầu. Đọc kỹ toàn bộ file trước khi sửa bất cứ thứ
> gì. Khi có thay đổi lớn (thêm lớp/bài, đổi thang điểm, đổi quy tắc), cập
> nhật file này ngay trong cùng lần sửa đó.

## 1. Dự án là gì

Webapp tĩnh (HTML + CSS + JS, **không có bước build**) chứa bài giảng tương
tác và ôn tập kiến thức Tin học cho học sinh THCS–THPT, Trường TH, THCS &
THPT FPT Hậu Giang (FSC Hậu Giang).

- Repo GitHub: https://github.com/QuanLHK-FSC-HAG/THOC_FSCHAG.git (branch `main`).
- Người phụ trách / giáo viên: thầy Lê Hữu Kỳ Quan (Tổ trưởng chuyên môn Tổ
  Khoa học tự nhiên). Mọi nội dung đều phục vụ học sinh của trường này.
- Không gian trên Muse (artifact nguồn): `bo-mon-tin-hoc-fsc-hag`.
- Deploy: người dùng tự deploy trên Vercel (xem mục 8). Vercel tự deploy
  lại mỗi khi có commit mới lên GitHub.

## 2. Trạng thái hiện tại (cập nhật 27/11/2026)

- **Bài giảng: 20 bài / 88 hoạt động / 272 điểm**, 5 lớp:
  - Lớp 6: Bài 4, 5, 6, 7 — 25 HĐ / 79đ
  - Lớp 7: Bài 4, 5, 6 — 11 HĐ / 36đ
  - Lớp 8: Bài 12, 13, 14 — 12 HĐ / 35đ
  - Lớp 10: Bài 3.11, 4.12, 4.13, 4.14, 4.15 — 19 HĐ / 54đ
  - Lớp 11: Bài 8, 9, 10, 11, 12 — 21 HĐ / 68đ
- **Ngân hàng ôn tập cuối HK1: 2.037 câu / tối đa 526đ**:
  - Lớp 6: 456 câu / 127,75đ (D1 183, D2 62 cụm, D3 20)
  - Lớp 7: 396 câu / 100,75đ (D1 131, D2 63, D3 5)
  - Lớp 8: 511 câu / 127,75đ (D1 195, D2 79, D3 0)
  - Lớp 10: 294 câu / 73,25đ (D1 285, D2 2 cụm cũ, D3 0 — **D2 đang bổ sung**)
  - Lớp 11: 380 câu / 96,5đ (D1 306, D2 17 cụm, D3 3)
- Phạm vi ôn tập HK1 (theo Syllabus, Ôn tập cuối HK1 = Tiết 29):
  Lớp 6 Bài 1–7; Lớp 7 Bài 1–6; Lớp 8 Bài 1–4, 12–15 (Bài 5–11 là HK2,
  không làm); Lớp 10 Bài 1, 2, 7–16; Lớp 11 Bài 1–13.
- Lớp 9 và lớp 12 chưa có dữ liệu nên không xuất hiện trong menu.
- Head GitHub tại thời điểm viết file này: `76fa2c19` (27/11/2026). Head sẽ
  thay đổi sau mỗi lần đẩy — luôn kiểm chứng head hiện tại trước khi đẩy
  (xem mục 7).

## 3. Cấu trúc repo

```
THOC_FSCHAG/
├── SKILL.md              # File này (dấu vết cho agent)
├── README.md
├── index.html            # Shell: hero, menu chọn lớp, sidebar bài học,
│                         # frame bài, mục hướng dẫn, ôn tập cuối HK1,
│                         # footer. Nạp file dữ liệu lớp bằng thẻ <script>
│                         # TRƯỚC assets/js/app.js (thứ tự nạp quan trọng).
├── assets/
│   ├── css/style.css     # Toàn bộ CSS
│   └── js/
│       ├── app.js        # Logic chính: điều hướng, dựng hoạt động, chấm
│       │                 # điểm khóa kết quả, dashboard từng lớp, ôn tập
│       │                 # 3 dạng, mục Tổng kết; đọc window.THOC_DATA.
│       └── admin.js      # Cơ chế quản lý (xem mục 6).
├── data/
│   ├── grade6/data.js
│   ├── grade7/data.js
│   ├── grade8/data.js
│   ├── grade10/data10a.js   # chunk 1/2: reviewBank + nửa đầu bài học
│   ├── grade10/data10b.js   # chunk 2/2: nửa sau bài học
│   ├── grade11/data11a.js   # chunk 1/2: reviewBank + nửa đầu bài học
│   └── grade11/data11b.js   # chunk 2/2: nửa sau bài học
├── tools/
│   └── split.py          # Tách bản export 1 file của artifact thành
│                         # cấu trúc module này (chạy lại sau mỗi export).
└── vercel.json           # Khai báo site tĩnh, không có bước build.
```

**Chú ý quan trọng:**

- `data/grade11/data.js` vẫn nằm trong repo nhưng **index.html KHÔNG nạp
  nó** (file cũ từ trước khi tách chunk). **Tuyệt đối không sửa file này.**
  Lớp 11 chỉ dùng `data11a.js` + `data11b.js`.
- Ảnh bài học giữ dạng base64 trong file text (không file nhị phân trong
  repo — `github push-files` chỉ đẩy được file UTF-8).
- Mỗi lớp là một module độc lập: `lessonsHtml` (HTML các bài học),
  `order` / `names` / `maxes` (bảng điểm), `activities` (hoạt động chấm
  điểm), `reviewBank` (`acts` + `qs` — ngân hàng ôn tập), `summaries`
  (tóm tắt từng bài).

## 4. Định dạng dữ liệu (đọc kỹ trước khi sửa file dữ liệu)

### 4.1. Cấu trúc chung

Mỗi file dữ liệu lớp gán `window.THOC_DATA["<lớp>"] = { lessonsHtml,
order, names, maxes, activities, reviewBank, summaries }`. File dùng
template literal (backtick) cho `lessonsHtml`; phần còn lại là object
kiểu JSON (key có dấu ngoặc kép). Khi sửa bằng script, chỉ thay đúng
phần cần sửa, giữ nguyên phần còn lại của file.

### 4.2. Ngân hàng ôn tập (`reviewBank`)

```js
reviewBank = {
  acts: { "<id hoạt động>": { src, ans, exp } },   // nguồn + đáp án gợi ý
  qs: [ /* mảng câu hỏi, xem dưới */ ]
}
```

- `acts`: mỗi hoạt động một mục `{src, ans, exp}`. `src` là nguồn câu hỏi,
  dùng dạng `"Bài {chủ đề}.{bài}"` (ví dụ `"Bài 1.1"`) để cơ chế admin ẩn
  bài hoạt động đúng (admin.js lọc theo `src`). `ans` là đáp án mẫu,
  `exp` là giải thích.
- **Mọi câu trong `qs` bắt buộc có `a` tồn tại trong `acts`.** Câu nào
  thiếu `a` là lỗi, app sẽ không hiển thị đúng.

Ba dạng câu hỏi trong `qs`:

| Dạng | Định dạng | Điểm |
| --- | --- | --- |
| **D1** — trắc nghiệm 1 lựa chọn | `{"a": "<id>", "t": "single", "q": "...", "o": ["A","B","C","D"], "c": <chỉ số đáp án đúng 0–3>}` — bắt buộc **đủ 4 lựa chọn** | 0,25đ/câu |
| **D2** — Đúng/Sai | 4 ý cùng 1 hoạt động, mỗi ý một mục `{"a": "<id>", "t": "tf", "q": "Phát biểu: ... — Đúng hay Sai?", "v": true/false}` — app tự gom 4 ý cùng hoạt động thành 1 cụm | 1đ/cụm (mỗi ý đúng 0,25đ) |
| **D3** — tự luận | `{"a": "<id>", "t": "text", "q": "..."}` — đáp án gợi ý lấy từ `reviewBank.acts[<id>].ans` | **KHÔNG chấm tự động** — HS tự chấm 1đ/câu theo 3 mức (1 / 0,5 / 0), điểm tự chấm cộng vào tổng |

- Câu chọn nhiều đáp án (`multi`) không thuộc 3 dạng nên không đưa vào bộ
  ôn tập; ý Đúng/Sai lẻ không đủ gom 4 ý cũng không tạo câu Dạng 2.
- Bộ câu hỏi luôn theo thứ tự **Dạng 1 → Dạng 2 → Dạng 3** (xáo trộn ngẫu
  nhiên trong từng dạng khi hiển thị).
- App **xáo trộn vị trí phương án** mỗi lần tải trang (cả bài giảng lẫn ôn
  tập), nên thứ tự đáp án trong file không phải thứ tự học sinh nhìn thấy.
- Chấm điểm khóa kết quả: 1 hoạt động = 1 lần nộp = 1 kết quả khóa, không
  làm lại cộng điểm, không cộng điểm trùng. Điểm bài học chỉ lưu trong
  phiên mở trang (tải lại trang sẽ mất điểm); điểm ôn tập không cộng vào
  dashboard bài học.

### 4.3. Hai quy tắc chất lượng của ngân hàng (đã hoàn thiện 27/11/2026)

1. **Cân độ dài phương án (D1):** trong mỗi câu, phương án dài nhất
   ≤ 1,5 lần phương án ngắn nhất, và đáp án đúng không dài vượt trội (để
   học sinh không đoán mò theo độ dài). Ngoại lệ duy nhất còn lại:
   `md6-b3-d1-05` (câu "1 KB =? Byte", 1,86 lần — toàn phương án là số,
   đáp án đúng không còn dài nhất nên giữ nguyên).
2. **Đảo vị trí đáp án đúng (D1):** đáp án đúng phân bố đều 4 vị trí
   A/B/C/D trong mỗi khối (đã đảo toàn bộ 1.100 câu D1 ngày 27/11/2026;
   phân bố hiện tại: L6 46/46/46/45, L7 32/33/33/33, L8 48/49/49/49,
   L10 72/71/71/71, L11 76/77/76/77). Khi đảo, chỉ hoán vị mảng `o` và
   cập nhật `c` theo vị trí mới — **nội dung đáp án đúng không đổi**,
   tập độ dài phương án không đổi.
   - **Ngoại lệ: 2 câu Lớp 6 giữ nguyên thứ tự, KHÔNG đảo** — câu của
     `act-start` và `act-lt1`. Giải thích (`exp`) của 2 hoạt động này trích
     dẫn chữ cái phương án ("phương án B (Chia sẻ tài nguyên)... đáp án
     chấm ở đây là C") gắn với thứ tự gốc của bài học; đảo sẽ làm giải
     thích sai lệch. Đừng "sửa" 2 câu này.
   - Khi sửa đáp án đúng của một câu (ví dụ rà soát thấy khóa sai), cập
     nhật **đồng bộ** `c` trong `qs` và `ans` trong `acts` (nếu có). Tiền lệ
     27/11/2026: đã sửa 5 khóa sai Lớp 8 (md8-b1-d1-20 D→B, md8-b2-d1-03
     C→B, md8-b3-d1-15 C→A, md8-b3-d1-16 D→C, md8-b3-d1-19 C→B) và K07 Bài 5
     Câu 3 (C→B) — nguyên nhân gốc là khóa đáp án file nguồn chạy theo chu
     kỳ ABCD máy móc, nên khi rà khóa phải đối chiếu nội dung, không tin
     chu kỳ.

### 4.4. Quy tắc tách chunk

- `github push-files` trả lỗi `HTTP 413` khi một lần gọi vượt ~5,44 MiB
  (thực tế: file 3,65 MiB đã đẩy thành công). Vì vậy **mỗi lần đẩy giữ
  dưới ~3,5 MiB, và mỗi file dữ liệu lớp giữ dưới 3,5 MiB
  (3.670.016 byte)**.
- `tools/split.py` tự tách: khi module một lớp vượt ngưỡng, nó chia thành
  `data{X}a.js`, `data{X}b.js`, ... (mỗi chunk ≤ 3,5 MiB). Chunk đầu là
  object đầy đủ (`lessonsHtml` phần đầu + `order`/`names`/`maxes`/
  `activities`/`reviewBank`/`summaries`); các chunk sau chỉ nối phần HTML
  còn lại vào `lessonsHtml` bằng `Object.assign`, nạp nối tiếp trước
  `app.js`.
- Khi sửa tay một lớp đã tách chunk: bài nằm nửa đầu sửa trong `dataXa.js`,
  bài nằm nửa sau sửa trong `dataXb.js`. An toàn nhất là sửa trên artifact
  rồi chạy lại `tools/split.py`.
- **Hiện tại:** `data10a.js` (3.478.463 byte) và `data11a.js`
  (3.465.144 byte) đã sát ngưỡng — thêm câu hỏi vào 2 file này phải tính
  trước dung lượng, nếu vượt ngưỡng thì tách chunk mới.

## 5. Quy tắc nội dung (bắt buộc)

- **Nội dung bài giảng / trắc nghiệm CHỈ lấy từ nguồn của giáo viên, không
  tự tạo kiến thức hay đáp án.** Nguồn được phép, theo thứ tự ưu tiên:
  1. File PPTX gốc của giáo viên (xem kỹ năng
     `pptx-sang-bai-giang-tuong-tac`: giữ nguyên kiến thức gốc + thêm hộp
     `GHI VÀO VỞ` + hoạt động chấm điểm khóa kết quả).
  2. File `.md` câu hỏi–đáp án–giải thích do giáo viên chỉ định (ngân hàng
     ôn tập bổ sung từ đây — xem mục 9).
  3. SGK Tin học (khi giáo viên chỉ định rõ dùng SGK làm nguồn, ví dụ bổ
     sung Dạng 2 Lớp 10 từ SGK Tin 10).
- Đáp án nào suy ra từ nội dung bài (nguồn gốc không ghi sẵn) cần giáo viên
  xác nhận khi xem lại — không tự đổi đáp án đã suy ra.
- **Không bịa số liệu / kết quả.** Chỉ dùng số liệu giáo viên cấp hoặc đã
  kiểm chứng; chưa có thì để trống và nói rõ.
- **Bỏ tên tác giả** trong metadata file dựng (PPTX gốc có tên tác giả thì
  xóa rỗng).
- Không ghi tên trường / đơn vị / học sinh vào nội dung bài học (trừ khi
  giáo viên yêu cầu rõ).
- Tài liệu cho đồng nghiệp: bỏ chuyên môn, chỉ tổng quan, ngôn ngữ phổ
  thông, ngắn gọn.

## 6. Cơ chế quản lý (admin) — `assets/js/admin.js`

- Nút **"Quản lý"** ở chân trang → đăng nhập (tài khoản `admin`).
- **Mật khẩu CHỈ lưu dạng hash SHA-256 trong code** (không bao giờ ghi mật
  khẩu dạng rõ vào chat, file, hay bộ nhớ). Mật khẩu không bao giờ qua
  chat/tool — chỉ qua Secure Vault hoặc do giáo viên nhập trực tiếp.
- "Ghi nhớ đăng nhập" mặc định tick → lưu `localStorage`, không tick →
  `sessionStorage`.
- Sau đăng nhập: bật/tắt từng bài trong 20 bài; nút "Bật tất cả" / "Tắt
  tất cả" (tắt tất cả cần xác nhận); "Đăng xuất".
- Trạng thái bài tắt lưu ở `localStorage` key **`thocLessonsHidden`**
  (dạng `{"<lớp>": ["<key bài>", ...]}`; key bài ví dụ Lớp 6 Bài 5 là
  `"sec-bai5"`).
- Bài tắt: ẩn khỏi trang chủ / menu / nút Trước–Sau, câu ôn tập của bài đó
  biến mất khỏi bộ ôn tập, tổng điểm ngân hàng tính lại.
- **Tổng kết real-time (hoàn thiện 27/11/2026):** mục "Tổng kết" cuối mỗi
  lớp cập nhật theo bài đang bật — tắt bài thì Tổng kết loại bài đó ra (cả
  tên bài, số hoạt động, điểm tối đa) và tính lại ngay; bật lại thì bài đó
  trở lại. Cơ chế: `admin.js` gọi `window.THOC_REFRESH_SUMMARIES()` (do
  `app.js` cung cấp, làm mới cả 5 bảng Tổng kết) sau mỗi lần bật/tắt bài;
  `app.js` lọc hoạt động qua `window.THOC_ADMIN.isActivityHidden()`.
- Đây chỉ là khóa phía trình duyệt (localStorage), không phải phân quyền
  máy chủ.

## 7. Đẩy lên GitHub (quy trình đã chuẩn)

Đọc `/opt/hatch/connectors/github/references/snapshot-push.md` trước khi
đẩy lần đầu. Tóm tắt quy trình đã thực hành:

1. Kiểm chứng head hiện tại của repo trước khi đẩy.
2. Đẩy bằng CLI `/opt/hatch/bin/github push-files` + manifest
   NUL-delimited (file manifest đặt **ngoài** thư mục source):
   ```bash
   printf 'data/grade6/data.js\0' > /tmp/thoc-push-x.txt
   /opt/hatch/bin/github push-files --owner QuanLHK-FSC-HAG --repo THOC_FSCHAG \
     --branch main --message "<mô tả ngắn>" \
     --source-dir /home/hatch/workspace/thoc-fschag --paths-file /tmp/thoc-push-x.txt
   ```
3. **Mỗi lần gọi chỉ đẩy tối đa ~3,5 MiB** — đẩy theo từng lớp/chunk, mỗi
   lần một commit; file nào vượt ngưỡng thì chia nhiều commit.
   Chỉ đẩy được file UTF-8 (không file nhị phân).
4. `push-files` **không xóa được file** trên repo. Muốn xóa file cũ thì
   xóa tay trên GitHub.
5. Sau mỗi commit thành công: append entry vào sync record
   `~/workspace/thoc-fschag.muse-github-snapshot-sync.json` (nằm cạnh thư
   mục source, **không** nằm trong repo), rồi đọc lại GitHub kiểm chứng
   head mới.
6. **Thẻ phê duyệt:** mỗi lần đẩy, hệ thống hiện một thẻ phê duyệt riêng
   cho lần đẩy đó và giáo viên phải bấm "Cho phép" — agent không bấm thay
   được, không tắt được thẻ này. Nói rõ với giáo viên như vậy, đừng hứa là
   sẽ không hiện thẻ nữa. (Quyền "luôn cho phép đẩy GitHub" giáo viên đã
   cấp vẫn có hiệu lực ở tầng làm việc, nhưng thẻ hệ thống từng lần đẩy
   vẫn hiện.)
7. Thư mục local **không có `.git`** — mọi lần đẩy đều qua `push-files`
   như trên, không dùng `git push`.

## 8. Deploy lên Vercel (người dùng tự làm bước này)

1. Import repo trên Vercel (Add New → Project → chọn repo `THOC_FSCHAG`).
2. Framework Preset: **Other** (không chọn framework nào).
3. Build Command: để trống; Output Directory: để trống (thư mục gốc).
4. Deploy. Vercel tự deploy lại mỗi khi có commit mới lên GitHub, nên chỉ
   cần đẩy GitHub là đủ — không cần chia sẻ lại link.
   `vercel.json` trong repo chỉ khai báo đây là site tĩnh, không có bước
   build.

## 9. Nguồn dữ liệu (Google Drive + gương local)

- **PPTX gốc các bài (Drive `TinHoc_FSC`, id
  `1MSwoTvi8p6AauLkwVppRxytBJKW-XaMI`)**, chia theo thư mục lớp:
  Lớp 6 `1w2fB4K1uhNBA2wDwkF7kiAzZKkz8nR66`, Lớp 7
  `1DKaAUNaycUJ1o6hePLR3ty__De3V_WHr`, Lớp 8
  `1U_IGpFUEQs7adQ50OW1J-2Wp5iVWlDW3`, Lớp 10
  `1r4ndQXaW0T2fdBajO6jrVgjGVGPSxw5B`, Lớp 11
  `1UgPU6N1v5-USyYJXaCYFdygLqSo9ztSW`.
- **File `.md` câu hỏi–đáp án–giải thích (nguồn ngân hàng ôn tập):**
  Drive "Trắc nghiệm markdown" (`1QL3hagGwy4429JZAp-0-jpCcKiRxBhQl`),
  gương local `~/workspace/trac-nghiem-markdown/` (236 file; cấu trúc
  `K06–K11 → Dang_1_4_Lua_Chon / Dang_2_Dung_Sai → Chu_de_* → Bai_NN_*.md`).
  Khi sửa khóa đáp án, sửa **cả** file dữ liệu JS **và** file `.md` nguồn
  cho đồng bộ.
- **SGK Tin 10 (nguồn bổ sung Dạng 2 Lớp 10):** folder Drive
  `1tMdmCTETUK7th6Qk_aB6jwQlezltTVSR` — 33 PDF (Bài 1–34, **thiếu Bài 10**).
- **Tài liệu chủ đạo SGK/SBT KNTT:** `~/workspace/goals/b-m-n-tin-h-c-fsc-hag/references/Bo_sach_KNTT_Tin_hoc.md`
  (1.233 dòng; có 21 chỗ ghi "chưa xác minh" — Lớp 11 Bài 25–31 chưa đọc
  trực tiếp toàn văn SGK, Lớp 7 Bài 14–16 lấy từ đề cương thứ cấp — khi
  dựng các bài này phải đối chiếu SGK giấy).
- Đối chiếu bài đã có/chưa có trong không gian: L6 4/17, L7 3/16, L8 3/20
  (2 nhánh a/b song song, HS chỉ học 1 nhánh), L10 5/16 bài ICT, L11 5/31.

## 10. Kiểm chứng (làm trước khi báo xong / trước khi đẩy)

- `node --check` sạch cho mọi file JS đã sửa (kể cả chunk).
- Đếm lại: số bài / hoạt động / điểm từng lớp; số câu D1/D2/D3 + tổng điểm
  ngân hàng từng lớp (đối chiếu mục 2).
- Mọi câu trong `qs` có `a` tồn tại trong `acts`; D1 đủ 4 lựa chọn.
- Phân bố đáp án đúng D1 đều A/B/C/D (mục 4.3); cân độ dài phương án ≤1,5×.
- Kiểm thử bằng trình duyệt headless (chromium trong
  `~/.cache/ms-playwright`): trang tải đầy đủ (trang nặng ~17 MB, tải lần
  đầu chậm — trắng lúc đầu là bình thường), mục Tổng kết và ghi chú ngân
  hàng cập nhật đúng khi tắt/bật bài (ví dụ: tắt L6 Bài 5 → Tổng kết L6 còn
  19 HĐ / tối đa 56đ; ngân hàng L6 còn 101đ).
- Chạy local: `python3 -m http.server 8080` từ thư mục repo rồi mở
  `http://localhost:8080/` (webapp không dùng `fetch()` nên cũng chạy được
  với `file://`).
- Khi làm việc với file dữ liệu lớn (chứa base64): **không** dùng `cmp`,
  `grep` in nội dung hay `grep -o` bắt pattern rộng ra stdout (dễ tràn
  hàng chục MB). Dùng `md5sum`, `grep -c`, `grep -o` với pattern hẹp, hoặc
  script Python in kết quả ngắn gọn.

## 11. Những việc đang dở (27/11/2026)

- **Dạng 2 Lớp 10:** đang bổ sung từ SGK Tin 10 (mục 9) + rà/sửa D1 đã có
  theo SGK. `data10a.js` đã đảo đáp án xong nhưng **chưa đẩy** — đẩy một
  lần cùng Dạng 2 sau khi duyệt.
- **Đăng nhập admin:** giáo viên tự thử bằng mật khẩu của mình (agent
  không có mật khẩu, không tự thử được luồng đăng nhập).
- **Lớp 9, lớp 12:** chưa có dữ liệu; bổ sung sau khi có bài.
- **Bài giảng mới:** chỉ thêm khi giáo viên gửi PPTX gốc (theo kỹ năng
  `pptx-sang-bai-giang-tuong-tac`).

## 12. Lưu ý khác

- Hệ màu chuẩn của mọi không gian: dương `#0066B3` – cam `#F26522` – xanh
  lá `#16A34A`. Ghi nguồn ngắn kiểu "Designed by QuanLHK with AI".
- Kỷ luật phiên bản: bản sửa luôn xuất dưới **tên file mới**; không ghi đè
  file giáo viên đã tự sửa.
- GitHub App không có quyền tạo repository — repo phải do người dùng tự
  tạo trên github.com trước.
- Khi sửa cùng một artifact/không gian: làm **tuần tự từng lần một**,
  không sửa đồng thời.
- Khi trình duyệt tự động không mở được `localhost` (bị chặn
  `ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS` / `invalid_request`), đó là
  giới hạn của môi trường tự động — giáo viên tự mở tab `localhost` và kiểm
  tra tay; agent kiểm chứng bằng headless Chrome thật.
