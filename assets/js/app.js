/* ============================================================
   THOC_FSCHAG — bootstrap: nạp HTML bài học từng lớp vào khung.
   Các file data/gradeX/data.js (nạp trước file này) định nghĩa
   window.THOC_DATA[g].lessonsHtml; đoạn này chèn vào panel của
   từng lớp trước khi logic bên dưới chạy, nên mọi hành vi giữ
   nguyên như bản một file duy nhất.
   ============================================================ */
(function () {
  "use strict";
  window.THOC_DATA = window.THOC_DATA || {};
  ["6", "7", "8", "10", "11"].forEach(function (g) {
    var panel = document.getElementById("panel-" + g);
    if (panel && window.THOC_DATA[g])
      panel.innerHTML = window.THOC_DATA[g].lessonsHtml;
  });
})();


    (function(){
      "use strict";
      function $(id){ return document.getElementById(id); }
      function qsa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
      function fmt(n){
        var v = Math.round(n * 100) / 100;
        return (v % 1 === 0 ? String(v) : String(v).replace(".", ","));
      }

      /* ================= ĐIỀU HƯỚNG THEO LỚP =================
         Màn hình đầu chỉ hiện chọn lớp. Bấm vào lớp nào thì chỉ hiện
         nội dung và bảng tổng kết của lớp đó; nút quay lại trở về chọn lớp. */
      var wrapEl = document.querySelector(".wrap");
      function classSubText(g){
        if (g === "6") return "Tin học 6 · Sách Kết nối tri thức với cuộc sống — bài giảng, hoạt động tương tác và bảng tổng kết điểm của Lớp 6.";
        if (g === "7") return "Tin học 7 · Sách Kết nối tri thức với cuộc sống — bài giảng, hoạt động tương tác và bảng tổng kết điểm của Lớp 7.";
        if (g === "8") return "Tin học 8 · Sách Kết nối tri thức với cuộc sống — bài giảng, hoạt động tương tác và bảng tổng kết điểm của Lớp 8.";
        if (g === "10") return "Tin học 10 · Sách Kết nối tri thức với cuộc sống — bài giảng, hoạt động tương tác và bảng tổng kết điểm của Lớp 10.";
        if (g === "11") return "Tin học 11 · Sách Kết nối tri thức với cuộc sống — bài giảng, hoạt động tương tác và bảng tổng kết điểm của Lớp 11.";
        return "Bài giảng của Lớp " + g + " sẽ được đưa vào theo thứ tự bài khi giáo viên hoàn thành.";
      }
      qsa(".grade-btn").forEach(function(btn){
        btn.addEventListener("click", function(){
          var g = btn.getAttribute("data-grade");
          qsa(".grade-btn").forEach(function(b){ b.setAttribute("aria-selected", b === btn ? "true" : "false"); });
          qsa(".grade-panel").forEach(function(p){ p.classList.remove("active"); });
          var panel = $("panel-" + g);
          if (panel) panel.classList.add("active");
          $("classTitle").textContent = "Lớp " + g;
          $("classSub").textContent = classSubText(g);
          wrapEl.classList.add("in-class");
          window.scrollTo(0, 0);
        });
      });
      $("backBtn").addEventListener("click", function(){
        wrapEl.classList.remove("in-class");
        qsa(".grade-panel").forEach(function(p){ p.classList.remove("active"); });
        qsa(".grade-btn").forEach(function(b){ b.setAttribute("aria-selected", "false"); });
        window.scrollTo(0, 0);
      });

      /* ================= XEM ĐÁP ÁN — PHIẾU HỌC TẬP & VẬN DỤNG ================= */
      qsa("[data-reveal]").forEach(function(btn){
        btn.addEventListener("click", function(){
          var qa = btn.closest(".qa");
          var a = qa ? qa.querySelector(".a") : null;
          if (!a) return;
          var shown = a.classList.toggle("show");
          btn.textContent = shown ? "Ẩn đáp án" : "Xem đáp án";
        });
      });

      /* ================= TRẠNG THÁI ĐIỂM (CHỈ TRONG PHIÊN HỌC) ================= */
      var ORDER = window.THOC_DATA["6"].order;
      var NAMES = window.THOC_DATA["6"].names;
      var MAXES = window.THOC_DATA["6"].maxes;
      var TOTAL_ACT = ORDER.length; /* 25 hoạt động của Lớp 6 (Bài 4, 5, 6, 7) */
      var TOTAL_MAX = ORDER.reduce(function(s, id){ return s + MAXES[id]; }, 0); /* 79 điểm */
      var state = {};
      ORDER.forEach(function(id){ state[id] = { done: false, score: 0 }; });

      /* ================= LỚP 7 (Bài 4, 5, 6) — BỘ ĐIỂM RIÊNG ================= */
      var ORDER7 = window.THOC_DATA["7"].order;
      var NAMES7 = window.THOC_DATA["7"].names;
      var MAXES7 = window.THOC_DATA["7"].maxes;
      var TOTAL_ACT7 = ORDER7.length; /* 11 hoạt động của Lớp 7 (Bài 4, 5, 6) */
      var TOTAL_MAX7 = ORDER7.reduce(function(s, id){ return s + MAXES7[id]; }, 0); /* 36 điểm */
      var state7 = {};
      ORDER7.forEach(function(id){ state7[id] = { done: false, score: 0 }; });
      function isG7(id){ return Object.prototype.hasOwnProperty.call(MAXES7, id); }

      /* ================= LỚP 8 (Bài 12, 13, 14) — BỘ ĐIỂM RIÊNG ================= */
      var ORDER8 = window.THOC_DATA["8"].order;
      var NAMES8 = window.THOC_DATA["8"].names;
      var MAXES8 = window.THOC_DATA["8"].maxes;
      var TOTAL_ACT8 = ORDER8.length; /* 12 hoạt động của Lớp 8 (Bài 12, 13, 14) */
      var TOTAL_MAX8 = ORDER8.reduce(function(s, id){ return s + MAXES8[id]; }, 0); /* 35 điểm */
      var state8 = {};
      ORDER8.forEach(function(id){ state8[id] = { done: false, score: 0 }; });
      function isG8(id){ return Object.prototype.hasOwnProperty.call(MAXES8, id); }

      /* ================= LỚP 10 (Bài 3.11, 4.12, 4.13, 4.14, 4.15) — BỘ ĐIỂM RIÊNG ================= */
      var ORDER10 = window.THOC_DATA["10"].order;
      var NAMES10 = window.THOC_DATA["10"].names;
      var MAXES10 = window.THOC_DATA["10"].maxes;
      var TOTAL_ACT10 = ORDER10.length; /* 19 hoạt động của Lớp 10 (Bài 3.11, 4.12, 4.13, 4.14, 4.15) */
      var TOTAL_MAX10 = ORDER10.reduce(function(s, id){ return s + MAXES10[id]; }, 0); /* 54 điểm */
      var state10 = {};
      ORDER10.forEach(function(id){ state10[id] = { done: false, score: 0 }; });
      function isG10(id){ return Object.prototype.hasOwnProperty.call(MAXES10, id); }

      /* ================= LỚP 11 (Bài 8, 9, 10, 11, 12) — BỘ ĐIỂM RIÊNG ================= */
      var ORDER11 = window.THOC_DATA["11"].order;
      var NAMES11 = window.THOC_DATA["11"].names;
      var MAXES11 = window.THOC_DATA["11"].maxes;
      var TOTAL_ACT11 = ORDER11.length; /* 21 hoạt động của Lớp 11 (Bài 8, 9, 10, 11, 12) */
      var TOTAL_MAX11 = ORDER11.reduce(function(s, id){ return s + MAXES11[id]; }, 0); /* 68 điểm */
      var state11 = {};
      ORDER11.forEach(function(id){ state11[id] = { done: false, score: 0 }; });
      function isG11(id){ return Object.prototype.hasOwnProperty.call(MAXES11, id); }
      function maxOf(id){ return isG7(id) ? MAXES7[id] : (isG8(id) ? MAXES8[id] : (isG10(id) ? MAXES10[id] : (isG11(id) ? MAXES11[id] : MAXES[id]))); }

      /* ===== TỔNG KẾT THEO BÀI ĐANG BẬT (QUẢN LÝ) =====
         Khi admin tắt một bài, Tổng kết của lớp phải loại các hoạt
         động của bài đó ra (cả tên và điểm) và tính lại tổng điểm
         ngay lập tức; bật lại thì bài đó trở lại Tổng kết. Ánh xạ
         hoạt động → bài: tên hoạt động trong NAMES luôn bắt đầu bằng
         "Bài <số bài> · ...", còn bài nào đang tắt thì hỏi
         window.THOC_ADMIN (assets/js/admin.js). Khi admin.js chưa
         nạp thì coi như mọi bài đều bật, nên lần render đầu vẫn đầy đủ. */
      var TK_SECTION = { "6": "sec-tong-ket", "7": "sec-g7-tong-ket", "8": "sec-g8-tong-ket", "10": "sec-g10-tong-ket", "11": "sec-g11-tong-ket" };
      function actHidden(g, id){
        return !!(window.THOC_ADMIN && window.THOC_ADMIN.isActivityHidden && window.THOC_ADMIN.isActivityHidden(g, id));
      }
      function visibleOrder(g, order){
        return order.filter(function(id){ return !actHidden(g, id); });
      }
      function lessonNums(g, order, names, onlyVisible){
        var seen = {}, nums = [];
        order.forEach(function(id){
          if (onlyVisible && actHidden(g, id)) return;
          var m = String(names[id] || "").match(/^Bài\s+([\d.]+)/);
          if (m && !seen[m[1]]){ seen[m[1]] = true; nums.push(m[1]); }
        });
        return nums;
      }
      /* Nhận xét: khi có bài đang tắt, câu "cả N bài: ..." / "nội dung
         của N bài" sẽ sai nên đổi thành "các bài đang học". */
      function adjustVerdict(text, g, order, names){
        var vis = lessonNums(g, order, names, true).length;
        var all = lessonNums(g, order, names, false).length;
        if (vis === all) return text;
        return text.replace(/cả \d+ bài:[^.]+\./, "các bài đang học.")
                   .replace(/nội dung của \d+ bài/, "nội dung của các bài đang học");
      }
      /* Cập nhật các chữ tĩnh trong mục Tổng kết: tiêu đề "(Bài ...)",
         câu mở đầu "của N bài", số tối đa "/MAX" sau Điểm của em và
         sau Điểm đạt được. Sửa trực tiếp text node sẵn có nên không
         cần sửa file dữ liệu. */
      function setTrailingMax(el, max){
        if (!el || !el.parentNode) return;
        var sib = el.nextSibling;
        while (sib && sib.nodeType !== 3) sib = sib.nextSibling;
        if (!sib) return;
        var m = sib.textContent.match(/^([\s\S]*?)\d+(?:[.,]\d+)?\s*$/);
        if (m) sib.textContent = m[1] + fmt(max);
      }
      function updateSummaryStatics(g, order, names, visMax){
        var sec = $(TK_SECTION[g]);
        if (!sec) return;
        var visNums = lessonNums(g, order, names, true);
        var h2 = sec.querySelector("h2");
        if (h2) h2.textContent = "Tổng kết — Lớp " + g + (visNums.length ? " (Bài " + visNums.join(", ") + ")" : "");
        var intro = h2 ? h2.nextElementSibling : null;
        if (intro && intro.tagName === "P"){
          if (visNums.length){
            intro.textContent = "Kết quả dưới đây được tính tự động từ tất cả các hoạt động của " + visNums.length + " bài em đã nộp trong phiên học này. Kết quả của mỗi hoạt động đã khóa ngay khi nộp nên không thay đổi.";
          } else {
            intro.textContent = "Hiện chưa có bài nào đang mở trong lớp này, nên chưa có kết quả tổng kết. Em hãy quay lại sau nhé.";
          }
        }
        setTrailingMax($("scoreNow" + (g === "6" ? "" : g)), visMax);
        setTrailingMax($("sumScore" + (g === "6" ? "" : g)), visMax);
      }

      function updateSummary(){
        var vis = visibleOrder("6", ORDER);
        var visMax = vis.reduce(function(s, id){ return s + MAXES[id]; }, 0);
        var total = vis.reduce(function(s, id){ return s + state[id].score; }, 0);
        var done = vis.filter(function(id){ return state[id].done; }).length;
        var totalAct = vis.length;
        $("scoreNow").textContent = fmt(total);
        $("scoreTrack").style.width = (visMax ? (total / visMax * 100) : 0) + "%";
        $("scoreDone").textContent = "Đã hoàn thành " + done + "/" + totalAct + " hoạt động";
        $("sumTotal").textContent = String(totalAct);
        $("sumDone").textContent = String(done);
        $("sumScore").textContent = fmt(total);
        $("sumPct").textContent = (totalAct ? Math.round(done / totalAct * 100) : 0) + "%";

        var verdict = $("sumVerdict");
        if (totalAct === 0){
          verdict.textContent = "Hiện chưa có bài nào đang mở trong lớp này, nên chưa có kết quả tổng kết. Em hãy quay lại sau nhé.";
        } else if (done === 0){
          verdict.textContent = "Hãy hoàn thành các hoạt động trong bài để nhận xét kết quả học tập.";
        } else if (done < totalAct){
          verdict.textContent = "Em đã hoàn thành " + done + "/" + totalAct + " hoạt động. Hãy làm tiếp các hoạt động còn lại để có nhận xét đầy đủ về bài học.";
        } else if (total >= visMax * 0.9){
          verdict.textContent = "Xuất sắc! Em đã nắm vững kiến thức của cả 4 bài: mạng máy tính, Internet, mạng thông tin toàn cầu và tìm kiếm thông tin trên Internet.";
        } else if (total >= visMax * 0.75){
          verdict.textContent = "Tốt! Em đã hiểu phần lớn nội dung của 4 bài. Hãy xem lại giải thích ở những câu chưa đúng để nắm chắc hơn.";
        } else if (total >= visMax * 0.5){
          verdict.textContent = "Đạt yêu cầu cơ bản. Em nên đọc lại các hộp GHI VÀO VỞ và phần giải thích của các hoạt động chưa đạt tối đa.";
        } else {
          verdict.textContent = "Cần cố gắng thêm. Hãy học lại từng bài, chú ý các hộp GHI VÀO VỞ, rồi trao đổi với bạn hoặc thầy cô ở những chỗ chưa hiểu.";
        }

        verdict.textContent = adjustVerdict(verdict.textContent, "6", ORDER, NAMES);
        var list = $("sumList");
        list.innerHTML = "";
        vis.forEach(function(id){
          var st = state[id];
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.textContent = NAMES[id];
          var sc = document.createElement("span");
          sc.className = "sc";
          sc.textContent = st.done ? (fmt(st.score) + "/" + MAXES[id]) : ("—/" + MAXES[id]);
          var chip = document.createElement("span");
          if (!st.done){ chip.className = "st none"; chip.textContent = "Chưa hoàn thành"; }
          else if (st.score >= MAXES[id]){ chip.className = "st ok"; chip.textContent = "Đúng — đạt tối đa"; }
          else if (st.score > 0){ chip.className = "st part"; chip.textContent = "Đúng một phần"; }
          else { chip.className = "st part"; chip.textContent = "Chưa đúng"; }
          li.appendChild(name); li.appendChild(sc); li.appendChild(chip);
          list.appendChild(li);
        });
        updateSummaryStatics("6", ORDER, NAMES, visMax);
      }

      /* ================= TIỆN ÍCH HOẠT ĐỘNG ================= */
      function showFeedback(root, ok, html){
        var fb = root.querySelector("[data-feedback]");
        fb.className = "feedback show " + (ok ? "good" : "bad");
        fb.innerHTML = html;
      }
      function wireCommon(root, answerText, explainText){
        root.querySelector("[data-answer-text]").textContent = answerText;
        root.querySelector("[data-explain-text]").textContent = explainText;
        var pa = root.querySelector("[data-answer]");
        var pe = root.querySelector("[data-explain]");
        root.querySelector("[data-show-answer]").addEventListener("click", function(){ pa.classList.toggle("show"); });
        root.querySelector("[data-show-explain]").addEventListener("click", function(){ pe.classList.toggle("show"); });
      }
      function finishActivity(root, id, score){
        var g7 = isG7(id);
        var g8 = isG8(id);
        var g10 = isG10(id);
        var g11 = isG11(id);
        var st = g7 ? state7 : (g8 ? state8 : (g10 ? state10 : (g11 ? state11 : state)));
        st[id].done = true;
        st[id].score = score;
        root.querySelector("[data-submit]").disabled = true;
        root.querySelector("[data-show-answer]").disabled = false;
        root.querySelector("[data-show-explain]").disabled = false;
        root.querySelector("[data-lock]").classList.add("show");
        var status = root.querySelector("[data-status]");
        if (score >= maxOf(id)){ status.className = "act-status done"; status.textContent = "Đã nộp · Đạt tối đa"; }
        else if (score > 0){ status.className = "act-status part"; status.textContent = "Đã nộp · Đúng một phần"; }
        else { status.className = "act-status part"; status.textContent = "Đã nộp · Chưa đúng"; }
        if (g7) updateSummary7(); else if (g8) updateSummary8(); else if (g10) updateSummary10(); else if (g11) updateSummary11(); else updateSummary();
      }

      function updateSummary7(){
        var vis = visibleOrder("7", ORDER7);
        var visMax = vis.reduce(function(s, id){ return s + MAXES7[id]; }, 0);
        var total = vis.reduce(function(s, id){ return s + state7[id].score; }, 0);
        var done = vis.filter(function(id){ return state7[id].done; }).length;
        var totalAct = vis.length;
        $("scoreNow7").textContent = fmt(total);
        $("scoreTrack7").style.width = (visMax ? (total / visMax * 100) : 0) + "%";
        $("scoreDone7").textContent = "Đã hoàn thành " + done + "/" + totalAct + " hoạt động";
        $("sumTotal7").textContent = String(totalAct);
        $("sumDone7").textContent = String(done);
        $("sumScore7").textContent = fmt(total);
        $("sumPct7").textContent = (totalAct ? Math.round(done / totalAct * 100) : 0) + "%";

        var verdict = $("sumVerdict7");
        if (totalAct === 0){
          verdict.textContent = "Hiện chưa có bài nào đang mở trong lớp này, nên chưa có kết quả tổng kết. Em hãy quay lại sau nhé.";
        } else if (done === 0){
          verdict.textContent = "Hãy hoàn thành các hoạt động trong bài để nhận xét kết quả học tập.";
        } else if (done < totalAct){
          verdict.textContent = "Em đã hoàn thành " + done + "/" + totalAct + " hoạt động. Hãy làm tiếp các hoạt động còn lại để có nhận xét đầy đủ về bài học.";
        } else if (total >= visMax * 0.9){
          verdict.textContent = "Xuất sắc! Em đã nắm vững kiến thức của cả 3 bài: mạng xã hội, ứng xử trên mạng và làm quen với phần mềm bảng tính.";
        } else if (total >= visMax * 0.75){
          verdict.textContent = "Tốt! Em đã hiểu phần lớn nội dung của 3 bài. Hãy xem lại giải thích ở những câu chưa đúng để nắm chắc hơn.";
        } else if (total >= visMax * 0.5){
          verdict.textContent = "Đạt yêu cầu cơ bản. Em nên đọc lại các hộp GHI VÀO VỞ và phần giải thích của các hoạt động chưa đạt tối đa.";
        } else {
          verdict.textContent = "Cần cố gắng thêm. Hãy học lại từng bài, chú ý các hộp GHI VÀO VỞ, rồi trao đổi với bạn hoặc thầy cô ở những chỗ chưa hiểu.";
        }

        verdict.textContent = adjustVerdict(verdict.textContent, "7", ORDER7, NAMES7);
        var list = $("sumList7");
        list.innerHTML = "";
        vis.forEach(function(id){
          var st = state7[id];
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.textContent = NAMES7[id];
          var sc = document.createElement("span");
          sc.className = "sc";
          sc.textContent = st.done ? (fmt(st.score) + "/" + MAXES7[id]) : ("—/" + MAXES7[id]);
          var chip = document.createElement("span");
          if (!st.done){ chip.className = "st none"; chip.textContent = "Chưa hoàn thành"; }
          else if (st.score >= MAXES7[id]){ chip.className = "st ok"; chip.textContent = "Đúng — đạt tối đa"; }
          else if (st.score > 0){ chip.className = "st part"; chip.textContent = "Đúng một phần"; }
          else { chip.className = "st part"; chip.textContent = "Chưa đúng"; }
          li.appendChild(name); li.appendChild(sc); li.appendChild(chip);
          list.appendChild(li);
        });
        updateSummaryStatics("7", ORDER7, NAMES7, visMax);
      }

      function updateSummary8(){
        var vis = visibleOrder("8", ORDER8);
        var visMax = vis.reduce(function(s, id){ return s + MAXES8[id]; }, 0);
        var total = vis.reduce(function(s, id){ return s + state8[id].score; }, 0);
        var done = vis.filter(function(id){ return state8[id].done; }).length;
        var totalAct = vis.length;
        $("scoreNow8").textContent = fmt(total);
        $("scoreTrack8").style.width = (visMax ? (total / visMax * 100) : 0) + "%";
        $("scoreDone8").textContent = "Đã hoàn thành " + done + "/" + totalAct + " hoạt động";
        $("sumTotal8").textContent = String(totalAct);
        $("sumDone8").textContent = String(done);
        $("sumScore8").textContent = fmt(total);
        $("sumPct8").textContent = (totalAct ? Math.round(done / totalAct * 100) : 0) + "%";

        var verdict = $("sumVerdict8");
        if (totalAct === 0){
          verdict.textContent = "Hiện chưa có bài nào đang mở trong lớp này, nên chưa có kết quả tổng kết. Em hãy quay lại sau nhé.";
        } else if (done === 0){
          verdict.textContent = "Hãy hoàn thành các hoạt động trong bài để nhận xét kết quả học tập.";
        } else if (done < totalAct){
          verdict.textContent = "Em đã hoàn thành " + done + "/" + totalAct + " hoạt động. Hãy làm tiếp các hoạt động còn lại để có nhận xét đầy đủ về bài học.";
        } else if (total >= visMax * 0.9){
          verdict.textContent = "Xuất sắc! Em đã nắm vững kiến thức của cả 3 bài: từ thuật toán đến chương trình, biểu diễn dữ liệu và cấu trúc điều khiển.";
        } else if (total >= visMax * 0.75){
          verdict.textContent = "Tốt! Em đã hiểu phần lớn nội dung của 3 bài. Hãy xem lại giải thích ở những câu chưa đúng để nắm chắc hơn.";
        } else if (total >= visMax * 0.5){
          verdict.textContent = "Đạt yêu cầu cơ bản. Em nên đọc lại các hộp GHI VÀO VỞ và phần giải thích của các hoạt động chưa đạt tối đa.";
        } else {
          verdict.textContent = "Cần cố gắng thêm. Hãy học lại từng bài, chú ý các hộp GHI VÀO VỞ, rồi trao đổi với bạn hoặc thầy cô ở những chỗ chưa hiểu.";
        }

        verdict.textContent = adjustVerdict(verdict.textContent, "8", ORDER8, NAMES8);
        var list = $("sumList8");
        list.innerHTML = "";
        vis.forEach(function(id){
          var st = state8[id];
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.textContent = NAMES8[id];
          var sc = document.createElement("span");
          sc.className = "sc";
          sc.textContent = st.done ? (fmt(st.score) + "/" + MAXES8[id]) : ("—/" + MAXES8[id]);
          var chip = document.createElement("span");
          if (!st.done){ chip.className = "st none"; chip.textContent = "Chưa hoàn thành"; }
          else if (st.score >= MAXES8[id]){ chip.className = "st ok"; chip.textContent = "Đúng — đạt tối đa"; }
          else if (st.score > 0){ chip.className = "st part"; chip.textContent = "Đúng một phần"; }
          else { chip.className = "st part"; chip.textContent = "Chưa đúng"; }
          li.appendChild(name); li.appendChild(sc); li.appendChild(chip);
          list.appendChild(li);
        });
        updateSummaryStatics("8", ORDER8, NAMES8, visMax);
      }

      function updateSummary10(){
        var vis = visibleOrder("10", ORDER10);
        var visMax = vis.reduce(function(s, id){ return s + MAXES10[id]; }, 0);
        var total = vis.reduce(function(s, id){ return s + state10[id].score; }, 0);
        var done = vis.filter(function(id){ return state10[id].done; }).length;
        var totalAct = vis.length;
        $("scoreNow10").textContent = fmt(total);
        $("scoreTrack10").style.width = (visMax ? (total / visMax * 100) : 0) + "%";
        $("scoreDone10").textContent = "Đã hoàn thành " + done + "/" + totalAct + " hoạt động";
        $("sumTotal10").textContent = String(totalAct);
        $("sumDone10").textContent = String(done);
        $("sumScore10").textContent = fmt(total);
        $("sumPct10").textContent = (totalAct ? Math.round(done / totalAct * 100) : 0) + "%";

        var verdict = $("sumVerdict10");
        if (totalAct === 0){
          verdict.textContent = "Hiện chưa có bài nào đang mở trong lớp này, nên chưa có kết quả tổng kết. Em hãy quay lại sau nhé.";
        } else if (done === 0){
          verdict.textContent = "Hãy hoàn thành các hoạt động trong bài để nhận xét kết quả học tập.";
        } else if (done < totalAct){
          verdict.textContent = "Em đã hoàn thành " + done + "/" + totalAct + " hoạt động. Hãy làm tiếp các hoạt động còn lại để có nhận xét đầy đủ về bài học.";
        } else if (total >= visMax * 0.9){
          verdict.textContent = "Xuất sắc! Em đã nắm vững kiến thức của cả 5 bài: ứng xử trên môi trường số và nghĩa vụ tôn trọng bản quyền, phần mềm thiết kế đồ họa, bổ sung các đối tượng đồ họa, làm việc với đối tượng đường và văn bản, hoàn thiện hình ảnh đồ họa.";
        } else if (total >= visMax * 0.75){
          verdict.textContent = "Tốt! Em đã hiểu phần lớn nội dung của 5 bài. Hãy xem lại giải thích ở những câu chưa đúng để nắm chắc hơn.";
        } else if (total >= visMax * 0.5){
          verdict.textContent = "Đạt yêu cầu cơ bản. Em nên đọc lại các hộp GHI VÀO VỞ và phần giải thích của các hoạt động chưa đạt tối đa.";
        } else {
          verdict.textContent = "Cần cố gắng thêm. Hãy học lại từng bài, chú ý các hộp GHI VÀO VỞ, rồi trao đổi với bạn hoặc thầy cô ở những chỗ chưa hiểu.";
        }

        verdict.textContent = adjustVerdict(verdict.textContent, "10", ORDER10, NAMES10);
        var list = $("sumList10");
        list.innerHTML = "";
        vis.forEach(function(id){
          var st = state10[id];
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.textContent = NAMES10[id];
          var sc = document.createElement("span");
          sc.className = "sc";
          sc.textContent = st.done ? (fmt(st.score) + "/" + MAXES10[id]) : ("—/" + MAXES10[id]);
          var chip = document.createElement("span");
          if (!st.done){ chip.className = "st none"; chip.textContent = "Chưa hoàn thành"; }
          else if (st.score >= MAXES10[id]){ chip.className = "st ok"; chip.textContent = "Đúng — đạt tối đa"; }
          else if (st.score > 0){ chip.className = "st part"; chip.textContent = "Đúng một phần"; }
          else { chip.className = "st part"; chip.textContent = "Chưa đúng"; }
          li.appendChild(name); li.appendChild(sc); li.appendChild(chip);
          list.appendChild(li);
        });
        updateSummaryStatics("10", ORDER10, NAMES10, visMax);
      }

      function updateSummary11(){
        var vis = visibleOrder("11", ORDER11);
        var visMax = vis.reduce(function(s, id){ return s + MAXES11[id]; }, 0);
        var total = vis.reduce(function(s, id){ return s + state11[id].score; }, 0);
        var done = vis.filter(function(id){ return state11[id].done; }).length;
        var totalAct = vis.length;
        $("scoreNow11").textContent = fmt(total);
        $("scoreTrack11").style.width = (visMax ? (total / visMax * 100) : 0) + "%";
        $("scoreDone11").textContent = "Đã hoàn thành " + done + "/" + totalAct + " hoạt động";
        $("sumTotal11").textContent = String(totalAct);
        $("sumDone11").textContent = String(done);
        $("sumScore11").textContent = fmt(total);
        $("sumPct11").textContent = (totalAct ? Math.round(done / totalAct * 100) : 0) + "%";

        var verdict = $("sumVerdict11");
        if (totalAct === 0){
          verdict.textContent = "Hiện chưa có bài nào đang mở trong lớp này, nên chưa có kết quả tổng kết. Em hãy quay lại sau nhé.";
        } else if (done === 0){
          verdict.textContent = "Hãy hoàn thành các hoạt động trong bài để nhận xét kết quả học tập.";
        } else if (done < totalAct){
          verdict.textContent = "Em đã hoàn thành " + done + "/" + totalAct + " hoạt động. Hãy làm tiếp các hoạt động còn lại để có nhận xét đầy đủ về bài học.";
        } else if (total >= visMax * 0.9){
          verdict.textContent = "Xuất sắc! Em đã nắm vững kiến thức của cả 5 bài: thực hành nâng cao sử dụng thư điện tử và mạng xã hội, giao tiếp an toàn trên Internet, lưu trữ dữ liệu và khai thác thông tin phục vụ quản lí, cơ sở dữ liệu, hệ quản trị cơ sở dữ liệu và hệ cơ sở dữ liệu.";
        } else if (total >= visMax * 0.75){
          verdict.textContent = "Tốt! Em đã hiểu phần lớn nội dung của 5 bài. Hãy xem lại giải thích ở những câu chưa đúng để nắm chắc hơn.";
        } else if (total >= visMax * 0.5){
          verdict.textContent = "Đạt yêu cầu cơ bản. Em nên đọc lại các hộp GHI VÀO VỞ và phần giải thích của các hoạt động chưa đạt tối đa.";
        } else {
          verdict.textContent = "Cần cố gắng thêm. Hãy học lại từng bài, chú ý các hộp GHI VÀO VỞ, rồi trao đổi với bạn hoặc thầy cô ở những chỗ chưa hiểu.";
        }

        verdict.textContent = adjustVerdict(verdict.textContent, "11", ORDER11, NAMES11);
        var list = $("sumList11");
        list.innerHTML = "";
        vis.forEach(function(id){
          var st = state11[id];
          var li = document.createElement("li");
          var name = document.createElement("span");
          name.textContent = NAMES11[id];
          var sc = document.createElement("span");
          sc.className = "sc";
          sc.textContent = st.done ? (fmt(st.score) + "/" + MAXES11[id]) : ("—/" + MAXES11[id]);
          var chip = document.createElement("span");
          if (!st.done){ chip.className = "st none"; chip.textContent = "Chưa hoàn thành"; }
          else if (st.score >= MAXES11[id]){ chip.className = "st ok"; chip.textContent = "Đúng — đạt tối đa"; }
          else if (st.score > 0){ chip.className = "st part"; chip.textContent = "Đúng một phần"; }
          else { chip.className = "st part"; chip.textContent = "Chưa đúng"; }
          li.appendChild(name); li.appendChild(sc); li.appendChild(chip);
          list.appendChild(li);
        });
        updateSummaryStatics("11", ORDER11, NAMES11, visMax);
      }

      /* ================= TRẮC NGHIỆM CHỌN 1 ĐÁP ÁN ================= */
      /* Xáo trộn thứ tự phương án trắc nghiệm mỗi lần tải trang để vị trí đáp án
         đúng không cố định (tránh đoán theo vị trí). Nội dung phương án và đáp án
         đúng không thay đổi; chữ cái nhắc tới đáp án trong "Đáp án mẫu" và
         "Giải thích" được ánh xạ lại theo vị trí mới. */
      function shuffledOrder(n){
        var order = [];
        for (var i = 0; i < n; i++) order.push(i);
        for (var k = n - 1; k > 0; k--){
          var j = Math.floor(Math.random() * (k + 1));
          var t = order[k]; order[k] = order[j]; order[j] = t;
        }
        return order;
      }
      function identityOrder(n){ var o = []; for (var i = 0; i < n; i++) o.push(i); return o; }
      function isIdentity(order){ return order.every(function(v, i){ return v === i; }); }
      function remapOptionLetters(text, order){
        if (!text) return text;
        return text.replace(/([Pp]hương án )([A-F])\b/g, function(m, pre, L){
          var np = order.indexOf(L.charCodeAt(0) - 65);
          return np >= 0 ? pre + "ABCDEF".charAt(np) : m;
        });
      }

      function buildSingle(id, options, correctIdx, answerText, explainText){
        var root = $(id);
        var order = shuffledOrder(options.length);
        var ans = answerText, exp = explainText;
        if (/^[A-F]\./.test(ans || "") && ans.charAt(0) !== "ABCDEF".charAt(correctIdx)) order = identityOrder(options.length);
        if (!isIdentity(order)){
          var newCorrect = order.indexOf(correctIdx);
          if (/^[A-F]\./.test(ans || "")) ans = "ABCDEF".charAt(newCorrect) + ans.slice(1);
          exp = remapOptionLetters(exp, order);
          options = order.map(function(oi){ return options[oi]; });
          correctIdx = newCorrect;
        }
        wireCommon(root, ans, exp);
        var box = root.querySelector("[data-options]");
        var selected = -1, done = false;
        var btns = options.map(function(text, i){
          var b = document.createElement("button");
          b.type = "button"; b.className = "opt-btn";
          var letter = document.createElement("span");
          letter.className = "letter"; letter.textContent = "ABCDEF".charAt(i);
          b.appendChild(letter);
          b.appendChild(document.createTextNode(text));
          b.addEventListener("click", function(){
            if (done) return;
            btns.forEach(function(x){ x.classList.remove("sel"); });
            b.classList.add("sel");
            selected = i;
          });
          box.appendChild(b);
          return b;
        });
        root.querySelector("[data-submit]").addEventListener("click", function(){
          if (done) return;
          if (selected < 0){
            showFeedback(root, false, "<b>Chưa chọn đáp án.</b> Em hãy chọn một phương án rồi nhấn Nộp bài.");
            return;
          }
          done = true;
          var ok = selected === correctIdx;
          btns.forEach(function(b, i){
            b.disabled = true;
            b.classList.remove("sel");
            if (i === correctIdx) b.classList.add("correct");
            else if (i === selected) b.classList.add("wrong");
            else b.classList.add("dim");
          });
          if (ok) showFeedback(root, true, "<b>Đúng rồi! +1 điểm.</b> Kết quả đã được khóa. Em có thể xem đáp án và giải thích bên dưới.");
          else showFeedback(root, false, "<b>Chưa đúng. 0/1 điểm.</b> Kết quả đã được khóa — hãy xem đáp án và giải thích để hiểu vì sao.");
          finishActivity(root, id, ok ? 1 : 0);
        });
      }

      /* ================= TRẮC NGHIỆM CHỌN NHIỀU ĐÁP ÁN ================= */
      function buildMulti(id, options, correctSet, answerText, explainText){
        var root = $(id);
        var order = shuffledOrder(options.length);
        var ans = answerText, exp = explainText, okMap = true;
        if (!isIdentity(order)){
          if (/[A-F]\.\s/.test(ans || "")){
            ans = (ans || "").split(" · ").map(function(seg){
              var mm = seg.match(/^([A-F])\.\s/);
              if (!mm) return seg;
              var np = order.indexOf(mm[1].charCodeAt(0) - 65);
              if (np < 0){ okMap = false; return seg; }
              return "ABCDEF".charAt(np) + seg.slice(1);
            }).join(" · ");
          } else if (/^[a-f](, [a-f])+/.test(ans || "")){
            ans = (ans || "").replace(/^[a-f](, [a-f])+/, function(list){
              return list.split(", ").map(function(ch){
                var np = order.indexOf(ch.charCodeAt(0) - 97);
                if (np < 0){ okMap = false; return ch; }
                return "abcdef".charAt(np);
              }).join(", ");
            });
          }
          exp = remapOptionLetters(exp, order);
          if (okMap){
            options = order.map(function(oi){ return options[oi]; });
            correctSet = correctSet.map(function(oi){ return order.indexOf(oi); });
          } else { ans = answerText; exp = explainText; }
        }
        wireCommon(root, ans, exp);
        var box = root.querySelector("[data-options]");
        var chosen = {}, done = false;
        var btns = options.map(function(text, i){
          var b = document.createElement("button");
          b.type = "button"; b.className = "opt-btn";
          var letter = document.createElement("span");
          letter.className = "letter"; letter.textContent = "ABCDEF".charAt(i);
          b.appendChild(letter);
          b.appendChild(document.createTextNode(text));
          b.addEventListener("click", function(){
            if (done) return;
            if (chosen[i]){ delete chosen[i]; b.classList.remove("sel"); }
            else { chosen[i] = true; b.classList.add("sel"); }
          });
          box.appendChild(b);
          return b;
        });
        root.querySelector("[data-submit]").addEventListener("click", function(){
          if (done) return;
          var keys = Object.keys(chosen).map(Number);
          if (keys.length === 0){
            showFeedback(root, false, "<b>Chưa chọn đáp án.</b> Câu này có nhiều đáp án đúng — hãy chọn tất cả các phương án em cho là đúng rồi nhấn Nộp bài.");
            return;
          }
          done = true;
          var ok = keys.length === correctSet.length && correctSet.every(function(c){ return chosen[c]; });
          btns.forEach(function(b, i){
            b.disabled = true;
            b.classList.remove("sel");
            if (correctSet.indexOf(i) >= 0) b.classList.add("correct");
            else if (chosen[i]) b.classList.add("wrong");
            else b.classList.add("dim");
          });
          if (ok) showFeedback(root, true, "<b>Đúng rồi! +1 điểm.</b> Em đã chọn đủ và đúng tất cả các phương án đúng. Kết quả đã được khóa.");
          else showFeedback(root, false, "<b>Chưa đúng. 0/1 điểm.</b> Câu này chỉ đạt điểm khi chọn đúng và đủ tất cả các phương án. Kết quả đã được khóa — hãy xem đáp án và giải thích.");
          finishActivity(root, id, ok ? 1 : 0);
        });
      }

      /* ================= ĐÚNG / SAI ================= */
      function buildTF(id, statements, answerText, explainText){
        var root = $(id);
        wireCommon(root, answerText, explainText);
        var list = root.querySelector("[data-tf]");
        var choices = statements.map(function(){ return null; });
        var done = false;
        var items = statements.map(function(st, i){
          var wrap = document.createElement("div");
          wrap.className = "tf-item";
          var p = document.createElement("p");
          p.className = "stmt";
          p.textContent = (i + 1) + ". " + st.t;
          var btns = document.createElement("div");
          btns.className = "tf-btns";
          var bTrue = document.createElement("button");
          bTrue.type = "button"; bTrue.className = "tf-btn"; bTrue.textContent = "Đúng";
          var bFalse = document.createElement("button");
          bFalse.type = "button"; bFalse.className = "tf-btn"; bFalse.textContent = "Sai";
          function pick(val){
            if (done) return;
            choices[i] = val;
            bTrue.className = "tf-btn" + (val === true ? " sel-true" : "");
            bFalse.className = "tf-btn" + (val === false ? " sel-false" : "");
          }
          bTrue.addEventListener("click", function(){ pick(true); });
          bFalse.addEventListener("click", function(){ pick(false); });
          btns.appendChild(bTrue); btns.appendChild(bFalse);
          var verdict = document.createElement("p");
          verdict.className = "tf-verdict";
          wrap.appendChild(p); wrap.appendChild(btns); wrap.appendChild(verdict);
          list.appendChild(wrap);
          return { wrap: wrap, bTrue: bTrue, bFalse: bFalse, verdict: verdict };
        });
        root.querySelector("[data-submit]").addEventListener("click", function(){
          if (done) return;
          if (choices.some(function(c){ return c === null; })){
            showFeedback(root, false, "<b>Chưa trả lời đủ.</b> Em hãy chọn Đúng hoặc Sai cho cả 4 phát biểu rồi nhấn Nộp bài.");
            return;
          }
          done = true;
          var score = 0;
          items.forEach(function(it, i){
            var ok = choices[i] === statements[i].v;
            if (ok) score += 1;
            it.wrap.classList.add(ok ? "mark-correct" : "mark-wrong");
            it.bTrue.disabled = true; it.bFalse.disabled = true;
            it.verdict.className = "tf-verdict show " + (ok ? "ok" : "no");
            it.verdict.textContent = ok ? "Đúng — +1 điểm" : ("Chưa đúng — đáp án đúng: " + (statements[i].v ? "Đúng" : "Sai"));
          });
          showFeedback(root, score === 4, "<b>Em làm đúng " + score + "/4 câu — đạt " + score + "/4 điểm.</b> Kết quả đã được khóa. Hãy xem giải thích để hiểu rõ từng phát biểu.");
          finishActivity(root, id, score);
        });
      }

      /* ================= KÉO THẢ PHÂN LOẠI ================= */
      function buildDrag(id, categories, itemsData, answerText, explainText){
        var root = $(id);
        wireCommon(root, answerText, explainText);
        var pool = root.querySelector("[data-pool]");
        var zonesBox = root.querySelector("[data-zones]");
        var done = false, selectedChip = null;

        var zoneItems = categories.map(function(cat){
          var z = document.createElement("div");
          z.className = "zone";
          var h = document.createElement("h5");
          h.textContent = cat;
          var holder = document.createElement("div");
          holder.className = "zone-items";
          z.appendChild(h); z.appendChild(holder);
          z.addEventListener("click", function(){
            if (done || !selectedChip) return;
            holder.appendChild(selectedChip);
            clearSelection();
          });
          z.addEventListener("dragover", function(e){ if (done) return; e.preventDefault(); z.classList.add("over"); });
          z.addEventListener("dragleave", function(){ z.classList.remove("over"); });
          z.addEventListener("drop", function(e){
            e.preventDefault(); z.classList.remove("over");
            if (done) return;
            var chip = draggingChip || selectedChip;
            if (chip){ holder.appendChild(chip); clearSelection(); }
          });
          zonesBox.appendChild(z);
          return holder;
        });

        function clearSelection(){
          if (selectedChip) selectedChip.classList.remove("selected");
          selectedChip = null; draggingChip = null;
        }

        var draggingChip = null;
        var chips = itemsData.map(function(it, idx){
          var c = document.createElement("button");
          c.type = "button"; c.className = "chip-item"; c.draggable = true;
          c.textContent = it.name;
          c.setAttribute("data-cat", Array.isArray(it.cat) ? it.cat.join(",") : String(it.cat));
          c.addEventListener("click", function(e){
            e.stopPropagation();
            if (done) return;
            if (selectedChip === c){ clearSelection(); return; }
            clearSelection();
            selectedChip = c; c.classList.add("selected");
          });
          c.addEventListener("dragstart", function(e){
            if (done){ e.preventDefault(); return; }
            draggingChip = c;
            if (e.dataTransfer) e.dataTransfer.setData("text/plain", it.name);
          });
          c.addEventListener("dragend", function(){ draggingChip = null; qsa(".zone", root).forEach(function(z){ z.classList.remove("over"); }); });
          return c;
        });
        /* Xáo trộn thứ tự thẻ trong khay để học sinh tự phân loại */
        var shuffled = chips.slice();
        for (var i = shuffled.length - 1; i > 0; i--){
          var j = Math.floor(Math.random() * (i + 1));
          var t = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = t;
        }
        shuffled.forEach(function(c){ pool.appendChild(c); });

        pool.addEventListener("click", function(){
          if (done || !selectedChip) return;
          pool.appendChild(selectedChip);
          clearSelection();
        });
        pool.addEventListener("dragover", function(e){ if (!done) e.preventDefault(); });
        pool.addEventListener("drop", function(e){
          e.preventDefault();
          if (done) return;
          var chip = draggingChip || selectedChip;
          if (chip){ pool.appendChild(chip); clearSelection(); }
        });

        var resetBtn = root.querySelector("[data-reset]");
        resetBtn.addEventListener("click", function(){
          if (done) return;
          chips.forEach(function(c){ pool.appendChild(c); });
          clearSelection();
        });

        root.querySelector("[data-submit]").addEventListener("click", function(){
          if (done) return;
          var inPool = chips.filter(function(c){ return c.parentElement === pool; }).length;
          if (inPool > 0){
            showFeedback(root, false, "<b>Còn " + inPool + " thẻ chưa phân loại.</b> Em hãy đặt tất cả 11 thẻ vào các ô nhóm rồi nhấn Nộp bài.");
            return;
          }
          done = true;
          var correct = 0;
          chips.forEach(function(c){
            var holder = c.parentElement;
            var zoneIdx = zoneItems.indexOf(holder);
            var cats = c.getAttribute("data-cat").split(",").map(function(s){ return Number(s); });
            var ok = cats.indexOf(zoneIdx) >= 0;
            if (ok) correct += 1;
            c.classList.remove("selected");
            c.classList.add(ok ? "correct" : "wrong");
            c.draggable = false;
          });
          clearSelection();
          resetBtn.disabled = true;
          var score = Math.round(correct / itemsData.length * 3 * 100) / 100;
          showFeedback(root, correct === itemsData.length,
            "<b>Em phân loại đúng " + correct + "/11 thẻ — đạt " + fmt(score) + "/3 điểm.</b> Kết quả đã được khóa. Thẻ viền xanh là đúng nhóm, thẻ viền đỏ là sai nhóm — hãy xem đáp án và giải thích.");
          finishActivity(root, id, score);
        });
      }

      /* ================= PHIẾU HỌC TẬP CÓ CHẤM ĐIỂM (NHIỀU CÂU, MỖI CÂU 1 ĐIỂM) =================
         Mỗi câu một hình thức phù hợp: trắc nghiệm ABCD (single), Đúng/Sai (tf)
         hoặc nhập đáp án ngắn đối chiếu từ khóa (text). Nộp một lần là khóa. */
      function normText(s){
        return String(s || "").toLowerCase().normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
          .replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
      }
      function buildQuiz(id, questions, answerText, explainText){
        var root = $(id);
        /* Xáo trộn phương án của từng câu trắc nghiệm trong phiếu và ánh xạ lại
           chữ cái đáp án trong "Đáp án mẫu" (đoạn "Câu n: X. ...") cùng các nhắc
           "phương án X" trong "Giải thích". Nếu gặp tham chiếu chữ cái không kiểm
           chứng được, giữ nguyên thứ tự gốc của cả phiếu. */
        var ans = answerText, exp = explainText;
        var plans = [], qn = 0, remapOk = true;
        questions.forEach(function(q){
          if (q.type === "heading"){ plans.push(null); return; }
          qn += 1;
          if (q.type !== "single"){ plans.push(null); return; }
          var order = shuffledOrder(q.options.length);
          plans.push({ n: qn, order: order, old: q.correct, nw: order.indexOf(q.correct) });
        });
        /* Mọi nhắc "phương án X" trong giải thích phải nằm trong đoạn của một
           câu trắc nghiệm và nhắc đúng đáp án của câu đó; ngoài ra không xáo trộn. */
        if (exp && /phương án [A-F]/.test(exp)){
          exp.split(/(?=Câu \d)/).forEach(function(seg){
            if (!/phương án [A-F]/.test(seg)) return;
            var hm = seg.match(/^Câu (\d+)/);
            var pl = null;
            if (hm) plans.forEach(function(x){ if (x && x.n === Number(hm[1])) pl = x; });
            if (!pl){ remapOk = false; return; }
            var refs = seg.match(/phương án [A-F]/g) || [];
            refs.forEach(function(r){
              if (r !== "phương án " + "ABCDEF".charAt(pl.old)) remapOk = false;
            });
          });
        }
        plans.forEach(function(pl){
          if (!pl || isIdentity(pl.order)) return;
          var oldL = "ABCDEF".charAt(pl.old), newL = "ABCDEF".charAt(pl.nw);
          if (oldL === newL) return;
          ans = (ans || "").split(" · ").map(function(seg){
            var pre = "Câu " + pl.n + ": ";
            if (seg.indexOf(pre) !== 0) return seg;
            var rest = seg.slice(pre.length);
            if (rest === oldL) return pre + newL;
            if (rest.indexOf(oldL + ".") === 0) return pre + newL + rest.slice(1);
            if (/^[A-F]\./.test(rest) || /^[A-F]$/.test(rest)) remapOk = false;
            return seg;
          }).join(" · ");
          exp = (exp || "").replace(new RegExp("(Câu " + pl.n + "(?: và \\d+)?: [\\s\\S]*?)(?=Câu \\d+|$)", "g"), function(seg){
            return seg.replace(/([Pp]hương án )([A-F])\b/g, function(m, pre, L){
              return L === oldL ? pre + newL : m;
            });
          });
        });
        if (remapOk){
          plans.forEach(function(pl, idx){
            if (!pl || isIdentity(pl.order)) return;
            var q = questions[idx];
            q.options = pl.order.map(function(oi){ return q.options[oi]; });
            q.correct = pl.nw;
          });
          wireCommon(root, ans, exp);
        } else {
          wireCommon(root, answerText, explainText);
        }
        var box = root.querySelector("[data-quiz]");
        var done = false;
        var items = [];
        var qNum = 0;
        questions.forEach(function(q){
          if (q.type === "heading"){
            var h = document.createElement("p");
            h.className = "part-head";
            h.textContent = q.text;
            box.appendChild(h);
            return;
          }
          qNum += 1;
          var wrap = document.createElement("div");
          wrap.className = "subq";
          var p = document.createElement("p");
          p.className = "q-text";
          p.textContent = "Câu " + qNum + ". " + q.text;
          wrap.appendChild(p);
          var verdict = document.createElement("p");
          verdict.className = "q-verdict";
          var item = { q: q, verdict: verdict, get: null, mark: null, answered: null };

          if (q.type === "single"){
            var opts = document.createElement("div");
            opts.className = "options";
            var sel = -1;
            var btns = q.options.map(function(text, i){
              var b = document.createElement("button");
              b.type = "button"; b.className = "opt-btn";
              var letter = document.createElement("span");
              letter.className = "letter"; letter.textContent = "ABCDEF".charAt(i);
              b.appendChild(letter);
              b.appendChild(document.createTextNode(text));
              b.addEventListener("click", function(){
                if (done) return;
                btns.forEach(function(x){ x.classList.remove("sel"); });
                b.classList.add("sel");
                sel = i;
              });
              opts.appendChild(b);
              return b;
            });
            wrap.appendChild(opts);
            item.answered = function(){ return sel >= 0; };
            item.get = function(){ return sel === q.correct; };
            item.mark = function(){
              btns.forEach(function(b, i){
                b.disabled = true;
                b.classList.remove("sel");
                if (i === q.correct) b.classList.add("correct");
                else if (i === sel) b.classList.add("wrong");
                else b.classList.add("dim");
              });
            };
          } else if (q.type === "tf"){
            var btnsBox = document.createElement("div");
            btnsBox.className = "tf-btns";
            var choice = null;
            var bTrue = document.createElement("button");
            bTrue.type = "button"; bTrue.className = "tf-btn"; bTrue.textContent = "Đúng";
            var bFalse = document.createElement("button");
            bFalse.type = "button"; bFalse.className = "tf-btn"; bFalse.textContent = "Sai";
            function pick(val){
              if (done) return;
              choice = val;
              bTrue.className = "tf-btn" + (val === true ? " sel-true" : "");
              bFalse.className = "tf-btn" + (val === false ? " sel-false" : "");
            }
            bTrue.addEventListener("click", function(){ pick(true); });
            bFalse.addEventListener("click", function(){ pick(false); });
            btnsBox.appendChild(bTrue); btnsBox.appendChild(bFalse);
            wrap.appendChild(btnsBox);
            item.answered = function(){ return choice !== null; };
            item.get = function(){ return choice === q.v; };
            item.mark = function(){ bTrue.disabled = true; bFalse.disabled = true; };
          } else if (q.type === "text"){
            var inp = document.createElement("input");
            inp.type = "text";
            inp.placeholder = q.placeholder || "Nhập đáp án ngắn của em…";
            inp.setAttribute("aria-label", "Đáp án câu " + qNum);
            wrap.appendChild(inp);
            item.answered = function(){ return inp.value.trim().length > 0; };
            item.get = function(){
              var v = normText(inp.value);
              return q.keywords.every(function(group){
                return group.some(function(kw){ return v.indexOf(normText(kw)) >= 0; });
              });
            };
            item.mark = function(ok){ inp.disabled = true; inp.classList.add(ok ? "mark-correct" : "mark-wrong"); };
          }
          wrap.appendChild(verdict);
          box.appendChild(wrap);
          items.push(item);
        });

        root.querySelector("[data-submit]").addEventListener("click", function(){
          if (done) return;
          var missing = items.filter(function(it){ return !it.answered(); }).length;
          if (missing > 0){
            showFeedback(root, false, "<b>Còn " + missing + " câu chưa trả lời.</b> Em hãy trả lời đủ tất cả các câu trong phiếu rồi nhấn Nộp bài.");
            return;
          }
          done = true;
          var score = 0;
          items.forEach(function(it){
            var ok = it.get();
            if (ok) score += 1;
            it.mark(ok);
            it.verdict.className = "q-verdict show " + (ok ? "ok" : "no");
            it.verdict.textContent = ok ? "Đúng — +1 điểm" : "Chưa đúng — hãy xem đáp án mẫu và giải thích bên dưới.";
          });
          showFeedback(root, score === items.length,
            "<b>Em làm đúng " + score + "/" + items.length + " câu — đạt " + score + "/" + items.length + " điểm.</b> Kết quả đã được khóa. Hãy xem đáp án mẫu và giải thích để đối chiếu từng câu.");
          finishActivity(root, id, score);
        });
      }

      /* Hoạt động từng lớp — dữ liệu nằm trong data/gradeX/data.js
         (THOC_DATA[g].activities), giữ nguyên thứ tự gọi như bản gốc. */
      ["6", "7", "8", "10", "11"].forEach(function (g) {
        var acts = (window.THOC_DATA[g] && window.THOC_DATA[g].activities) || [];
        acts.forEach(function (a) {
          var fn = { buildQuiz: buildQuiz, buildSingle: buildSingle,
                     buildMulti: buildMulti, buildTF: buildTF,
                     buildDrag: buildDrag }[a.fn];
          if (fn) fn.apply(null, [a.id].concat(a.args));
        });
      });var REVIEW_BANK = {};
      ["6", "7", "8", "10", "11"].forEach(function (g) {
        if (window.THOC_DATA[g] && window.THOC_DATA[g].reviewBank)
          REVIEW_BANK[g] = window.THOC_DATA[g].reviewBank;
      });

      var rvGradeSel = $("rvGrade");
      var rvBankNote = $("rvBankNote");
      var rvQuizBox = $("rvQuiz");
      var rvFeedback = $("rvFeedback");
      var rvComment = $("rvComment");
      var rvActions = $("rvActions");
      var rvSubmitBtn = $("rvSubmit");
      var rvRetryBtn = $("rvRetry");
      var rvStartBtn = $("rvStart");
      var rvLessonsBox = $("rvLessons");
      var rvLessonsAllBtn = $("rvLessonsAll");
      var rvLessonsNoneBtn = $("rvLessonsNone");
      var rvForm1 = $("rvForm1");
      var rvForm2 = $("rvForm2");
      var rvCountInput = $("rvCountInput");
      var rvCountMax = $("rvCountMax");
      var rvCountAllBtn = $("rvCountAll");
      var rvItems = [];
      var rvDone = false;
      var rvAutoScore = 0, rvAutoMax = 0, rvD1Ok = 0, rvD1N = 0, rvD2Ok = 0, rvD2N = 0, rvD3N = 0, rvSubmitted = false;

      /* Tổng điểm thực tế của lần ôn tập: Dạng 1 (0,25 điểm/câu) + Dạng 2
         (1 điểm/câu, mỗi ý đúng 0,25 điểm) được chấm ngay khi nộp; Dạng 3
         tự luận trang KHÔNG CHẤM ĐIỂM — học sinh xem đáp án gợi ý rồi tự
         chấm (tối đa 1 điểm/câu) bằng nút tự chấm dưới mỗi câu, hàm này
         cộng điểm tự chấm vào tổng và cập nhật lại kết quả + nhận xét. */
      function rvRefreshTotal(){
        if (!rvSubmitted) return;
        var selfScore = 0, selfGraded = 0;
        rvItems.forEach(function(it){
          if (it.kind === 3){ selfScore += it.selfScore(); if (it.selfGraded()) selfGraded++; }
        });
        var totalMax = rvAutoMax + rvD3N;
        var total = rvAutoScore + selfScore;
        var detail = "Dạng 1: đúng " + rvD1Ok + "/" + rvD1N + " câu (" + fmt(rvD1Ok * 0.25) + "/" + fmt(rvD1N * 0.25) + " điểm)";
        if (rvD2N) detail += " · Dạng 2: đúng " + rvD2Ok + "/" + (rvD2N * 4) + " ý (" + fmt(rvD2Ok * 0.25) + "/" + fmt(rvD2N) + " điểm)";
        if (rvD3N) detail += " · Dạng 3: " + rvD3N + " câu tự luận — trang không chấm điểm, em tự chấm theo đáp án gợi ý: đã tự chấm " + selfGraded + "/" + rvD3N + " câu (" + fmt(selfScore) + "/" + fmt(rvD3N) + " điểm)";
        var allGraded = selfGraded === rvD3N;
        rvFeedback.className = "feedback show " + (allGraded && total === totalMax ? "good" : "bad");
        rvFeedback.innerHTML = "<b>Kết quả lần ôn tập này: em đạt " + fmt(total) + "/" + fmt(totalMax) + " điểm</b> (" + detail + "). Đáp án đúng, đáp án gợi ý và giải thích của từng câu đã hiện ngay bên dưới mỗi câu." + (rvD3N && !allGraded ? " Em hãy tự chấm nốt các câu tự luận theo đáp án gợi ý để tổng điểm được đầy đủ nhé." : "") + " Điểm ôn tập theo phổ điểm thực tế này chỉ dùng cho lần làm này và không cộng vào điểm các bài học.";
        var pct = totalMax > 0 ? Math.round(total / totalMax * 100) : 100;
        rvComment.className = "rv-comment show";
        rvComment.innerHTML = "<b>Nhận xét dành cho em</b>" + (rvD3N && rvAutoMax === 0
          ? "Em đã hoàn thành bộ câu hỏi tự luận. Tự viết ra ý của mình, đối chiếu với đáp án gợi ý rồi tự chấm điểm là cách ôn tập rất hiệu quả — em cứ giữ cách học này nhé."
          : rvGentleComment(pct));
      }

      function rvShuffle(arr){
        for (var i = arr.length - 1; i > 0; i--){
          var j = Math.floor(Math.random() * (i + 1));
          var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
      }

      /* Phân loại ngân hàng của một lớp thành đúng 3 dạng của đề ôn tập:
         - Dạng 1: câu trắc nghiệm một lựa chọn (t === "single") lấy từ các
           hoạt động trắc nghiệm trong bài, hiện đầy đủ câu hỏi và các phương án.
           Mọi câu Dạng 1 đều có đúng 4 phương án A/B/C/D: câu vốn thiếu phương
           án đã được bổ sung phương án gây nhiễu lấy từ chính khái niệm, thuật
           ngữ trong bài (đáp án đúng giữ nguyên theo bài), câu vốn thừa phương
           án đã bỏ bớt một phương án sai; nhóm câu 2 lựa chọn "Nên làm /
           Không nên làm" (Bài 5 Lớp 7) đã chuyển thành các ý Đúng/Sai
           (t === "tf", phát biểu "… là việc nên làm") để gom vào Dạng 2.
           Điều kiện q.o.length === 4 dưới đây là chốt bảo vệ để Dạng 1 không
           bao giờ nhận câu thiếu hoặc thừa phương án.
         - Dạng 2: các ý Đúng/Sai (t === "tf") của cùng một hoạt động được gom
           4 ý liên quan thành 1 câu có phần nội dung chung (chủ đề của hoạt
           động gốc, hoặc câu dẫn chung vốn có trong ý đầu tiên của hoạt động).
           Ý Đúng/Sai lẻ (hoạt động có ít hơn 4 ý, hoặc phần dư sau khi gom)
           không tạo thành câu Dạng 2 để mỗi câu Dạng 2 luôn đủ 4 ý.
         - Dạng 3: câu hỏi mở / thảo luận (t === "text") chuyển thành câu tự
           luận: học sinh viết bài làm, nộp xong tự đối chiếu đáp án gợi ý.
         Câu chọn nhiều đáp án (t === "multi") không thuộc dạng nào trong ba
         dạng trên nên không đưa vào bộ ôn tập. */
      function rvPools(g){
        var bank = REVIEW_BANK[g];
        var d1 = [], d3 = [], tfByAct = {}, tfOrder = [];
        bank.qs.forEach(function(q){
          /* Quản lý (admin): bỏ câu hỏi của bài đang tắt khỏi bộ ôn tập. */
          if (window.THOC_ADMIN && window.THOC_ADMIN.isReviewHidden && window.THOC_ADMIN.isReviewHidden(g, q)) return;
          if (q.t === "single" && q.o && q.o.length === 4) d1.push(q);
          else if (q.t === "text") d3.push(q);
          else if (q.t === "tf"){
            if (!tfByAct[q.a]){ tfByAct[q.a] = []; tfOrder.push(q.a); }
            tfByAct[q.a].push(q);
          }
        });
        var d2 = [];
        tfOrder.forEach(function(a){
          var items = tfByAct[a].slice();
          for (var i = 0; i + 4 <= items.length; i += 4){
            d2.push({ a: a, items: items.slice(i, i + 4) });
          }
        });
        return { d1: d1, d2: d2, d3: d3 };
      }

      /* Bài của một câu hỏi: đọc "Bài X" từ act.src ("Bài 1 · ..." /
         "Bài 1.1 · ..."). Câu nào không đọc được số bài thì không thuộc
         bài nào — bộ lọc sẽ loại nó ra. */
      function rvLessonNum(g, q){
        var bank = REVIEW_BANK[g];
        if (!bank || !bank.acts) return null;
        var act = bank.acts[q.a];
        if (!act || !act.src) return null;
        var m = String(act.src).match(/^Bài\s+([\d.]+)/);
        return m ? m[1] : null;
      }
      /* Danh sách bài của lớp, xếp theo số bài (1, 2, ... 12; 1.1, 1.2,
         2.8 ...). Tên bài lấy từ hoạt động md của bài đó
         ("Bài X · Tên bài · Dạng ..."). */
      function rvLessonList(g){
        var bank = REVIEW_BANK[g];
        if (!bank || !bank.acts) return [];
        var names = {}, nums = {};
        Object.keys(bank.acts).forEach(function(k){
          var act = bank.acts[k];
          if (!act || !act.src) return;
          var m = String(act.src).match(/^Bài\s+([\d.]+)\s*·\s*([^·]+)/);
          if (!m) return;
          nums[m[1]] = true;
          if (k.indexOf("md") === 0 && !names[m[1]]) names[m[1]] = m[2].trim();
        });
        return Object.keys(nums).sort(function(a, b){
          var pa = a.split(".").map(Number), pb = b.split(".").map(Number);
          for (var i = 0; i < Math.max(pa.length, pb.length); i++){
            var d = (pa[i] || 0) - (pb[i] || 0);
            if (d) return d;
          }
          return 0;
        }).map(function(num){
          return { num: num, name: names[num] || ("Bài " + num) };
        });
      }
      /* Bài "đang bật": còn ít nhất 1 câu hỏi không bị Quản lý tắt. */
      function rvEnabledLessons(g){
        var bank = REVIEW_BANK[g];
        if (!bank) return [];
        var admin = window.THOC_ADMIN;
        return rvLessonList(g).filter(function(L){
          return bank.qs.some(function(q){
            if (rvLessonNum(g, q) !== L.num) return false;
            return !(admin && admin.isReviewHidden && admin.isReviewHidden(g, q));
          });
        });
      }
      function rvSelectedLessons(){
        var out = {};
        qsa("#rvLessons input[type=\"checkbox\"]").forEach(function(cb){
          if (cb.checked) out[cb.value] = true;
        });
        return out;
      }
      function rvSelectedForms(){
        var f = [];
        if (rvForm1.checked) f.push(1);
        if (rvForm2.checked) f.push(2);
        return f;
      }
      /* Ngân hàng sau khi lọc theo bài và dạng học sinh đã chọn — chỉ
         Dạng 1 và Dạng 2 (Dạng 3 tự luận không nằm trong bộ ôn tập).
         Gom Đúng/Sai theo hoạt động, 4 ý thành 1 câu, như rvPools. */
      function rvFilteredPools(g){
        var sel = rvSelectedLessons();
        var forms = rvSelectedForms();
        var want1 = forms.indexOf(1) >= 0, want2 = forms.indexOf(2) >= 0;
        var bank = REVIEW_BANK[g];
        var d1 = [], d2 = [], tfByAct = {}, tfOrder = [];
        if (!bank) return { d1: d1, d2: d2 };
        bank.qs.forEach(function(q){
          if (window.THOC_ADMIN && window.THOC_ADMIN.isReviewHidden && window.THOC_ADMIN.isReviewHidden(g, q)) return;
          if (sel[rvLessonNum(g, q)] !== true) return;
          if (q.t === "single" && q.o && q.o.length === 4){ if (want1) d1.push(q); }
          else if (q.t === "tf"){
            if (!want2) return;
            if (!tfByAct[q.a]){ tfByAct[q.a] = []; tfOrder.push(q.a); }
            tfByAct[q.a].push(q);
          }
        });
        tfOrder.forEach(function(a){
          var items = tfByAct[a].slice();
          for (var i = 0; i + 4 <= items.length; i += 4){
            d2.push({ a: a, items: items.slice(i, i + 4) });
          }
        });
        return { d1: d1, d2: d2 };
      }
      function rvFilteredTotal(g){
        var p = rvFilteredPools(g);
        return p.d1.length + p.d2.length;
      }
      /* Số câu học sinh muốn làm: đọc từ ô nhập, kẹp trong [1, tổng bộ đã chọn]. */
      function rvWantedCount(total){
        var v = parseInt(rvCountInput.value, 10);
        if (isNaN(v) || v < 1) return Math.min(10, total);
        return Math.min(v, total);
      }
      /* Số câu từng dạng của một bài (để hiện ngay trên từng dòng chọn bài):
         Dạng 1 = số câu trắc nghiệm; Dạng 2 = số câu Đúng/Sai (gom 4 ý
         theo hoạt động, như rvPools). Chỉ tính câu hỏi của bài đang bật. */
      function rvLessonCounts(g, num){
        var bank = REVIEW_BANK[g];
        var c = { d1: 0, d2: 0 };
        if (!bank) return c;
        var tfByAct = {}, tfOrder = [];
        bank.qs.forEach(function(q){
          if (rvLessonNum(g, q) !== num) return;
          if (window.THOC_ADMIN && window.THOC_ADMIN.isReviewHidden && window.THOC_ADMIN.isReviewHidden(g, q)) return;
          if (q.t === "single" && q.o && q.o.length === 4) c.d1++;
          else if (q.t === "tf"){
            if (!tfByAct[q.a]){ tfByAct[q.a] = []; tfOrder.push(q.a); }
            tfByAct[q.a].push(q);
          }
        });
        tfOrder.forEach(function(a){
          c.d2 += Math.floor(tfByAct[a].length / 4);
        });
        return c;
      }
      /* Dựng lại danh sách bài đang bật của lớp đang chọn (mặc định
         tick hết), rồi cập nhật ghi chú + số câu tối đa. Quản lý bật/tắt
         bài cũng đi qua đây (admin gọi refreshReviewNote → change). */
      function rvBuildLessonPicker(){
        var g = rvGradeSel.value;
        var lessons = rvEnabledLessons(g);
        rvLessonsBox.innerHTML = "";
        if (!lessons.length){
          rvLessonsBox.innerHTML = "<p class=\"rv-empty\">Lớp này hiện không có bài nào đang bật để ôn tập.</p>";
        }
        lessons.forEach(function(L){
          var lab = document.createElement("label");
          lab.className = "rv-check";
          var cb = document.createElement("input");
          cb.type = "checkbox"; cb.value = L.num; cb.checked = true;
          cb.addEventListener("change", rvUpdateSelection);
          var sp = document.createElement("span");
          sp.textContent = "Bài " + L.num + " · " + L.name;
          var cnt = rvLessonCounts(g, L.num);
          var cs = document.createElement("span");
          cs.className = "rv-lesson-counts";
          cs.textContent = "D1: " + cnt.d1 + " · D2: " + cnt.d2;
          lab.appendChild(cb); lab.appendChild(sp); lab.appendChild(cs);
          rvLessonsBox.appendChild(lab);
        });
        rvUpdateSelection();
      }
      /* Cập nhật ghi chú ngân hàng + bộ đã chọn và số câu tối đa mỗi khi
         học sinh đổi bài, đổi dạng hay đổi lớp. */
      function rvUpdateSelection(){
        var g = rvGradeSel.value;
        var bank = REVIEW_BANK[g];
        var pools = rvPools(g);
        var fp = rvFilteredPools(g);
        var total = fp.d1.length + fp.d2.length;
        var maxPts = fp.d1.length * 0.25 + fp.d2.length;
        var note = "";
        if (bank){
          note = "Ngân hàng Lớp " + g + " gồm " + pools.d1.length + " câu trắc nghiệm (Dạng 1) và " + pools.d2.length + " câu Đúng/Sai (Dạng 2). ";
        }
        var nLessons = Object.keys(rvSelectedLessons()).length;
        var nForms = rvSelectedForms().length;
        if (!nLessons || !nForms){
          note += "Em hãy chọn ít nhất 1 bài và 1 dạng câu hỏi để bắt đầu ôn tập.";
        } else {
          note += "Đã chọn " + nLessons + " bài · Dạng 1: " + fp.d1.length + " câu · Dạng 2: " + fp.d2.length + " câu — làm hết bộ đã chọn em đạt tối đa " + fmt(maxPts) + " điểm.";
        }
        rvBankNote.textContent = note;
        rvCountMax.textContent = total > 0
          ? "Tối đa " + total + " câu trong bộ đã chọn."
          : "Chưa có câu hỏi nào trong bộ đã chọn.";
        rvCountInput.max = total > 0 ? String(total) : "1";
        if (total > 0){
          var v = parseInt(rvCountInput.value, 10);
          if (isNaN(v) || v < 1) v = Math.min(10, total);
          if (v > total) v = total;
          rvCountInput.value = String(v);
        }
        rvStartBtn.disabled = total === 0;
      }

      function rvClearQuiz(){
        rvItems = [];
        rvDone = false;
        rvSubmitted = false;
        rvQuizBox.innerHTML = "";
        rvFeedback.className = "feedback";
        rvFeedback.innerHTML = "";
        rvComment.className = "rv-comment";
        rvComment.innerHTML = "";
        rvActions.style.display = "none";
        rvRetryBtn.style.display = "none";
        rvSubmitBtn.style.display = "";
      }
      rvGradeSel.addEventListener("change", function(){
        rvBuildLessonPicker();
        rvClearQuiz();
      });
      rvLessonsAllBtn.addEventListener("click", function(){
        qsa("#rvLessons input[type=\"checkbox\"]").forEach(function(cb){ cb.checked = true; });
        rvUpdateSelection();
      });
      rvLessonsNoneBtn.addEventListener("click", function(){
        qsa("#rvLessons input[type=\"checkbox\"]").forEach(function(cb){ cb.checked = false; });
        rvUpdateSelection();
      });
      rvForm1.addEventListener("change", rvUpdateSelection);
      rvForm2.addEventListener("change", rvUpdateSelection);
      rvCountInput.addEventListener("change", rvUpdateSelection);
      rvCountAllBtn.addEventListener("click", function(){
        var total = rvFilteredTotal(rvGradeSel.value);
        if (total > 0){ rvCountInput.value = String(total); rvCountInput.focus(); }
      });

      function rvSrcBadge(g, act){
        var src = document.createElement("span");
        src.className = "rv-src";
        src.textContent = "Lớp " + g + " · " + act.src;
        return src;
      }
      function rvQuestionTitle(num, text){
        var p = document.createElement("p");
        p.className = "q-text";
        p.textContent = "Câu " + num + ". " + text;
        return p;
      }
      function rvMakePanels(answerTitle, answerText, expText){
        var ansPanel = document.createElement("div");
        ansPanel.className = "panel answer";
        var at = document.createElement("span");
        at.className = "panel-title"; at.textContent = answerTitle;
        var ax = document.createElement("span"); ax.textContent = answerText;
        ansPanel.appendChild(at); ansPanel.appendChild(ax);
        var expPanel = document.createElement("div");
        expPanel.className = "panel explain";
        var et = document.createElement("span");
        et.className = "panel-title"; et.textContent = "Giải thích (của hoạt động gốc)";
        var ex = document.createElement("span"); ex.textContent = expText;
        expPanel.appendChild(et); expPanel.appendChild(ex);
        var btnRow = document.createElement("div");
        btnRow.className = "btn-row";
        var expBtn = document.createElement("button");
        expBtn.type = "button"; expBtn.className = "btn ghost";
        expBtn.textContent = "Xem giải thích"; expBtn.style.display = "none";
        expBtn.addEventListener("click", function(){
          var shown = expPanel.classList.toggle("show");
          expBtn.textContent = shown ? "Ẩn giải thích" : "Xem giải thích";
        });
        btnRow.appendChild(expBtn);
        return { ansPanel: ansPanel, expPanel: expPanel, btnRow: btnRow, expBtn: expBtn };
      }
      function rvFormHead(kind){
        var head = document.createElement("div");
        head.className = "rv-form-head";
        var h = document.createElement("h4");
        var p = document.createElement("p");
        if (kind === 1){
          h.textContent = "Dạng 1 · Trắc nghiệm một lựa chọn";
          p.textContent = "Mỗi câu hỏi hiện đầy đủ nội dung và các phương án của bài — em chọn một đáp án đúng nhất. Mỗi câu đúng được 0,25 điểm.";
        } else if (kind === 2){
          h.textContent = "Dạng 2 · Đúng / Sai theo một nội dung chung";
          p.textContent = "Mỗi câu gồm một phần nội dung chung và 4 ý. Em xét từng ý là Đúng hay Sai — cả câu tối đa 1 điểm, mỗi ý đúng được 0,25 điểm.";
        } else {
          h.textContent = "Dạng 3 · Tự luận";
          p.textContent = "Em viết bài làm của mình vào ô trống dưới mỗi câu. Mỗi câu tự luận tối đa 1 điểm, nhưng trang này KHÔNG CHẤM ĐIỂM phần tự luận: nộp bài xong, đáp án gợi ý sẽ hiện ra để em tự đối chiếu với bài làm và tự chấm điểm cho mình.";
        }
        head.appendChild(h); head.appendChild(p);
        return head;
      }

      /* ----- Dạng 1: trắc nghiệm một lựa chọn ----- */
      function rvBuildD1(g, q, act, num){
        var wrap = document.createElement("div");
        wrap.className = "subq";
        wrap.appendChild(rvSrcBadge(g, act));
        wrap.appendChild(rvQuestionTitle(num, q.q));
        var ord = rvShuffle([0, 1, 2, 3]);
        var dispOpts = ord.map(function(oi){ return q.o[oi]; });
        var newC = ord.indexOf(q.c);
        var panels = rvMakePanels("Đáp án", "Đáp án đúng: " + "ABCDEF".charAt(newC) + ". " + q.o[q.c], act.exp);
        var verdict = document.createElement("p");
        verdict.className = "q-verdict";
        var opts = document.createElement("div");
        opts.className = "options";
        var sel = -1;
        var btns = dispOpts.map(function(text, i){
          var b = document.createElement("button");
          b.type = "button"; b.className = "opt-btn";
          var letter = document.createElement("span");
          letter.className = "letter"; letter.textContent = "ABCDEF".charAt(i);
          b.appendChild(letter);
          b.appendChild(document.createTextNode(text));
          b.addEventListener("click", function(){
            if (rvDone) return;
            btns.forEach(function(x){ x.classList.remove("sel"); });
            b.classList.add("sel");
            sel = i;
          });
          opts.appendChild(b);
          return b;
        });
        wrap.appendChild(opts);
        wrap.appendChild(verdict);
        wrap.appendChild(panels.ansPanel);
        wrap.appendChild(panels.expPanel);
        wrap.appendChild(panels.btnRow);
        rvQuizBox.appendChild(wrap);
        return {
          kind: 1, max: 0.25, ansPanel: panels.ansPanel, expBtn: panels.expBtn,
          answered: function(){ return sel >= 0; },
          score: function(){ return sel === newC ? 0.25 : 0; },
          mark: function(s){
            btns.forEach(function(b, i){
              b.disabled = true;
              b.classList.remove("sel");
              if (i === newC) b.classList.add("correct");
              else if (i === sel) b.classList.add("wrong");
              else b.classList.add("dim");
            });
            verdict.className = "q-verdict show " + (s === 0.25 ? "ok" : "no");
            verdict.textContent = s === 0.25 ? "Đúng — +0,25 điểm" : "Chưa đúng — hãy xem đáp án và giải thích ngay bên dưới nhé.";
          }
        };
      }

      /* ----- Dạng 2: một nội dung chung + 4 ý Đúng/Sai ----- */
      function rvCleanTf(q){
        var t = String(q.q).trim();
        var stem = null;
        var m = t.match(/^([\s\S]*?)\s+a\)\s+([\s\S]*)$/);
        if (m && m[1].trim()){ stem = m[1].trim(); t = m[2].trim(); }
        else t = t.replace(/^[a-j]\)\s*/, "");
        var w = t.match(/^Phát biểu:\s*“([\s\S]*)”\s*\.?\s*(?:—\s*Đúng hay Sai\?)?\s*$/);
        if (w) t = w[1].trim();
        else {
          t = t.replace(/^Phát biểu:\s*/, "");
          t = t.replace(/\s*—\s*Đúng hay Sai\?\s*$/, "");
          t = t.replace(/\s*Theo em điều đó là Đúng hay Sai\?\s*$/, "");
          t = t.replace(/^“/, "").replace(/”\s*\.?\s*$/, ".");
        }
        if (t && !/[.!?…]$/.test(t)) t += ".";
        return { text: t, stem: stem };
      }
      function rvBuildD2(g, group, act, num){
        var stem = null;
        var ideas = group.items.map(function(q){
          var c = rvCleanTf(q);
          if (c.stem) stem = c.stem;
          return { text: c.text, v: q.v };
        });
        if (!stem){
          stem = "Dựa vào nội dung: " + String(act.src).replace(/\s*\([^)]*\)\s*$/, "") + " — em hãy xét từng phát biểu dưới đây và cho biết mỗi phát biểu là Đúng hay Sai.";
        }
        var wrap = document.createElement("div");
        wrap.className = "subq";
        wrap.appendChild(rvSrcBadge(g, act));
        wrap.appendChild(rvQuestionTitle(num, "Xét tính đúng / sai của các ý dưới đây."));
        var stemBox = document.createElement("div");
        stemBox.className = "rv-stem";
        var stemLbl = document.createElement("span");
        stemLbl.className = "rv-stem-label"; stemLbl.textContent = "Nội dung chung";
        stemBox.appendChild(stemLbl);
        stemBox.appendChild(document.createTextNode(stem));
        wrap.appendChild(stemBox);
        var ansLine = "Đáp án đúng: " + ideas.map(function(it, i){
          return "abcd".charAt(i) + ") " + (it.v ? "Đúng" : "Sai");
        }).join(" · ");
        var panels = rvMakePanels("Đáp án", ansLine, act.exp);
        var list = document.createElement("div");
        list.className = "tf-list";
        var rows = ideas.map(function(it, i){
          var box = document.createElement("div");
          box.className = "tf-item";
          var stmt = document.createElement("p");
          stmt.className = "stmt";
          stmt.textContent = "abcd".charAt(i) + ") " + it.text;
          box.appendChild(stmt);
          var btnsBox = document.createElement("div");
          btnsBox.className = "tf-btns";
          var choice = null;
          var bTrue = document.createElement("button");
          bTrue.type = "button"; bTrue.className = "tf-btn"; bTrue.textContent = "Đúng";
          var bFalse = document.createElement("button");
          bFalse.type = "button"; bFalse.className = "tf-btn"; bFalse.textContent = "Sai";
          function pick(val){
            if (rvDone) return;
            choice = val;
            bTrue.className = "tf-btn" + (val === true ? " sel-true" : "");
            bFalse.className = "tf-btn" + (val === false ? " sel-false" : "");
          }
          bTrue.addEventListener("click", function(){ pick(true); });
          bFalse.addEventListener("click", function(){ pick(false); });
          btnsBox.appendChild(bTrue); btnsBox.appendChild(bFalse);
          box.appendChild(btnsBox);
          var vd = document.createElement("p");
          vd.className = "tf-verdict";
          box.appendChild(vd);
          list.appendChild(box);
          return { box: box, vd: vd, bTrue: bTrue, bFalse: bFalse,
                   getChoice: function(){ return choice; } };
        });
        wrap.appendChild(list);
        var subScore = document.createElement("p");
        subScore.className = "rv-sub-score";
        wrap.appendChild(subScore);
        wrap.appendChild(panels.ansPanel);
        wrap.appendChild(panels.expPanel);
        wrap.appendChild(panels.btnRow);
        rvQuizBox.appendChild(wrap);
        function countCorrect(){
          var s = 0;
          rows.forEach(function(r, i){ if (r.getChoice() === ideas[i].v) s++; });
          return s;
        }
        return {
          kind: 2, max: 1, ansPanel: panels.ansPanel, expBtn: panels.expBtn,
          answered: function(){
            return rows.every(function(r){ return r.getChoice() !== null; });
          },
          score: function(){ return countCorrect() * 0.25; },
          mark: function(s){
            rows.forEach(function(r, i){
              r.bTrue.disabled = true; r.bFalse.disabled = true;
              var ok = r.getChoice() === ideas[i].v;
              r.box.classList.add(ok ? "mark-correct" : "mark-wrong");
              r.vd.className = "tf-verdict show " + (ok ? "ok" : "no");
              r.vd.textContent = ok
                ? "Ý " + "abcd".charAt(i) + ": Đúng — +0,25 điểm"
                : "Ý " + "abcd".charAt(i) + ": Chưa đúng — đáp án đúng là " + (ideas[i].v ? "Đúng" : "Sai");
            });
            subScore.className = "rv-sub-score show";
            subScore.textContent = "Điểm câu này: em đạt " + fmt(s) + "/1 điểm (" + Math.round(s / 0.25) + "/4 ý đúng).";
          }
        };
      }

      /* ----- Dạng 3: tự luận, tự đối chiếu đáp án gợi ý ----- */
      function rvEssayPrompt(q){
        var t = String(q.q).trim();
        t = t.replace(/\s*\([^)]*nhập[^)]*\)\s*$/, "");
        return t;
      }
      function rvBuildD3(g, q, act, num){
        var wrap = document.createElement("div");
        wrap.className = "subq";
        wrap.appendChild(rvSrcBadge(g, act));
        wrap.appendChild(rvQuestionTitle(num, rvEssayPrompt(q)));
        var ta = document.createElement("textarea");
        ta.rows = 5;
        ta.placeholder = q.ph || "Em viết bài làm của mình vào đây…";
        ta.setAttribute("aria-label", "Bài làm tự luận câu " + num);
        wrap.appendChild(ta);
        var verdict = document.createElement("p");
        verdict.className = "q-verdict";
        wrap.appendChild(verdict);
        var panels = rvMakePanels("Đáp án gợi ý (theo nội dung bài học)", act.ans, act.exp);
        wrap.appendChild(panels.ansPanel);
        wrap.appendChild(panels.expPanel);
        wrap.appendChild(panels.btnRow);
        rvQuizBox.appendChild(wrap);
        var selfVal = null;
        var selfBox = document.createElement("div");
        selfBox.className = "rv-self";
        selfBox.style.display = "none";
        var selfLbl = document.createElement("p");
        selfLbl.className = "rv-self-label";
        selfLbl.textContent = "Em tự chấm câu này theo đáp án gợi ý (mỗi câu tối đa 1 điểm):";
        selfBox.appendChild(selfLbl);
        var selfBtnsBox = document.createElement("div");
        selfBtnsBox.className = "rv-self-btns";
        var selfBtns = [[1, "Đúng ý chính — 1 điểm"], [0.5, "Đúng một phần — 0,5 điểm"], [0, "Chưa đúng — 0 điểm"]].map(function(pair){
          var b = document.createElement("button");
          b.type = "button"; b.className = "count-btn"; b.textContent = pair[1];
          b.setAttribute("aria-pressed", "false");
          b.addEventListener("click", function(){
            selfVal = pair[0];
            selfBtns.forEach(function(x){ x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
            rvRefreshTotal();
          });
          selfBtnsBox.appendChild(b);
          return b;
        });
        selfBox.appendChild(selfBtnsBox);
        wrap.appendChild(selfBox);
        return {
          kind: 3, max: 1, ansPanel: panels.ansPanel, expBtn: panels.expBtn,
          answered: function(){ return true; },
          score: function(){ return 0; },
          selfScore: function(){ return selfVal === null ? 0 : selfVal; },
          selfGraded: function(){ return selfVal !== null; },
          mark: function(){
            ta.disabled = true;
            verdict.className = "q-verdict show";
            verdict.style.color = "var(--blue)";
            verdict.textContent = ta.value.trim()
              ? "Câu tự luận — trang này KHÔNG CHẤM ĐIỂM. Em hãy đọc đáp án gợi ý bên dưới, tự đối chiếu với bài làm rồi tự chấm cho mình bằng các nút tự chấm ở dưới nhé."
              : "Câu tự luận — trang này KHÔNG CHẤM ĐIỂM. Lần này em chưa viết bài làm, em cứ đọc đáp án gợi ý bên dưới để nắm ý chính, rồi tự chấm cho mình bằng các nút tự chấm ở dưới nhé.";
            selfBox.style.display = "";
          }
        };
      }

      function rvGentleComment(pct){
        if (pct >= 90) return "Thật đáng khen — em đã nắm rất chắc kiến thức của học kì này! Em cứ giữ nhịp học như vậy, và nếu muốn, hãy thử thêm một bộ câu hỏi mới để kiểm tra lại mình lần nữa nhé.";
        if (pct >= 70) return "Em làm rất tốt, phần lớn kiến thức em đã nắm vững rồi. Em xem lại một chút những câu chưa đúng cùng phần Tóm tắt của bài tương ứng là sẽ chắc chắn hơn nữa.";
        if (pct >= 50) return "Em đã nắm được một phần quan trọng của bài học rồi — đó là một nền tảng tốt. Em dành ít phút xem lại đáp án và giải thích của các câu chưa đúng, đọc lại phần Tóm tắt của bài, rồi thử một bộ câu hỏi mới — em sẽ thấy mình tiến bộ rõ rệt.";
        if (pct >= 30) return "Cảm ơn em đã cố gắng làm hết bộ câu hỏi này. Một số phần kiến thức chưa nhớ kĩ là chuyện rất bình thường khi ôn tập. Em hãy xem lại phần Tóm tắt của từng bài và đáp án của các câu chưa đúng, học từng chút một rồi quay lại làm một bộ mới — mỗi lần làm là một lần nhớ lâu hơn.";
        return "Em đừng buồn nhé — làm chưa tốt ở lần ôn tập này chỉ giúp mình biết cần học lại phần nào thôi, không sao cả. Em hãy mở lại phần Tóm tắt của các bài, đọc kĩ đáp án và giải thích của từng câu chưa đúng, rồi bình tĩnh thử lại với một bộ câu hỏi mới. Học từng bước nhỏ một, em sẽ làm được.";
      }

      function rvStart(){
        var g = rvGradeSel.value;
        var bank = REVIEW_BANK[g];
        if (!bank || !bank.qs.length) return;
        var pools = rvFilteredPools(g);
        /* Bộ ôn tập chỉ gồm Dạng 1 và Dạng 2 theo lựa chọn của học sinh
           (Dạng 3 tự luận không nằm trong bộ ôn tập); thứ tự Dạng 1 →
           Dạng 2, trong từng dạng câu hỏi được xáo trộn ngẫu nhiên. Khi
           chọn số câu nhỏ hơn bộ đã chọn, số câu được chia theo tỉ lệ
           của từng dạng (mỗi dạng đang chọn đều được ít nhất 1 câu khi
           số câu chọn đủ lớn) để bộ ôn tập luôn đủ hai dạng như đề kiểm
           tra, thay vì chỉ toàn Dạng 1. */
        var d1s = rvShuffle(pools.d1.slice()).map(function(q){ return { kind: 1, q: q }; });
        var d2s = rvShuffle(pools.d2.slice()).map(function(gr){ return { kind: 2, group: gr }; });
        var lists = [d1s, d2s];
        var total = d1s.length + d2s.length;
        if (!total) return;
        var n = rvWantedCount(total);
        var seq;
        if (n >= total){
          seq = d1s.concat(d2s);
        } else {
          var alloc = lists.map(function(lst){ return Math.floor(n * lst.length / total); });
          var rem = n - alloc.reduce(function(s, x){ return s + x; }, 0);
          var frac = lists.map(function(lst, i){ return { i: i, f: n * lst.length / total - alloc[i] }; })
                          .sort(function(a, b){ return b.f - a.f; });
          var guard = 0;
          while (rem > 0 && guard < 100){
            guard++;
            for (var fi = 0; fi < frac.length && rem > 0; fi++){
              var ix = frac[fi].i;
              if (alloc[ix] < lists[ix].length){ alloc[ix]++; rem--; }
            }
          }
          var forms = lists.map(function(lst, i){ return i; }).filter(function(i){ return lists[i].length > 0; });
          if (n >= forms.length){
            forms.forEach(function(i){
              if (alloc[i] === 0){
                var donor = alloc.indexOf(Math.max.apply(null, alloc));
                if (donor !== i && alloc[donor] > 1){ alloc[donor]--; alloc[i] = 1; }
              }
            });
          }
          seq = d1s.slice(0, alloc[0]).concat(d2s.slice(0, alloc[1]));
        }
        rvClearQuiz();
        var lastKind = 0;
        seq.forEach(function(entry, idx){
          if (entry.kind !== lastKind){
            rvQuizBox.appendChild(rvFormHead(entry.kind));
            lastKind = entry.kind;
          }
          var item;
          if (entry.kind === 1) item = rvBuildD1(g, entry.q, bank.acts[entry.q.a], idx + 1);
          else if (entry.kind === 2) item = rvBuildD2(g, entry.group, bank.acts[entry.group.a], idx + 1);
          else item = rvBuildD3(g, entry.q, bank.acts[entry.q.a], idx + 1);
          rvItems.push(item);
        });
        rvActions.style.display = "";
        rvSubmitBtn.style.display = "";
        rvRetryBtn.style.display = "none";
        rvQuizBox.scrollIntoView({ block: "start" });
      }

      $("rvStart").addEventListener("click", rvStart);
      rvRetryBtn.addEventListener("click", rvStart);
      rvSubmitBtn.addEventListener("click", function(){
        if (rvDone || rvItems.length === 0) return;
        var missing = rvItems.filter(function(it){ return it.kind !== 3 && !it.answered(); }).length;
        if (missing > 0){
          rvFeedback.className = "feedback show bad";
          rvFeedback.innerHTML = "<b>Còn " + missing + " câu ở Dạng 1 / Dạng 2 chưa trả lời.</b> Em hãy trả lời đủ các câu trắc nghiệm và Đúng/Sai rồi nhấn Nộp bài ôn tập. (Câu tự luận ở Dạng 3, em viết được đến đâu cũng được — nộp xong trang hiện đáp án gợi ý để em tự chấm, mỗi câu tối đa 1 điểm.)";
          rvFeedback.scrollIntoView({ block: "center" });
          return;
        }
        rvDone = true;
        rvAutoScore = 0; rvAutoMax = 0; rvD1Ok = 0; rvD1N = 0; rvD2Ok = 0; rvD2N = 0; rvD3N = 0;
        rvItems.forEach(function(it){
          var s = it.score();
          if (it.kind !== 3){ rvAutoScore += s; rvAutoMax += it.max; }
          if (it.kind === 1){ rvD1N++; if (s === 0.25) rvD1Ok++; }
          if (it.kind === 2){ rvD2N++; rvD2Ok += Math.round(s / 0.25); }
          if (it.kind === 3) rvD3N++;
          it.mark(s);
          it.ansPanel.classList.add("show");
          it.expBtn.style.display = "";
        });
        rvSubmitted = true;
        rvRefreshTotal();
        rvSubmitBtn.style.display = "none";
        rvRetryBtn.style.display = "";
        rvFeedback.scrollIntoView({ block: "center" });
      });
      rvBuildLessonPicker();

      /* Quản lý (admin): làm mới cả 5 bảng Tổng kết sau mỗi lần bật/tắt bài. */
      window.THOC_REFRESH_SUMMARIES = function(){
        updateSummary(); updateSummary7(); updateSummary8(); updateSummary10(); updateSummary11();
      };
      updateSummary();
      updateSummary7();
      updateSummary8();
      updateSummary10();
      updateSummary11();
    })();
    

    /* ============================================================
       TÁI CẤU TRÚC BÀI GIẢNG: menu bên theo lớp, frame theo bài,
       thu gọn / mở rộng từng mục kiến thức, Tóm tắt cuối bài và
       ghi chú hướng dẫn ghi bài cạnh hộp GHI VÀO VỞ.
       Chỉ sắp xếp lại cách hiển thị — không thay đổi hoạt động,
       chấm điểm khóa kết quả, dashboard hay phần Ôn tập cuối HK1.
       ============================================================ */
    (function(){
      "use strict";
      function $(id){ return document.getElementById(id); }
      function qsa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

      var TITLES = {
        "panel-6":  ["sec-bai", "sec-bai5", "sec-bai6", "sec-bai7"],
        "panel-7":  ["sec-g7-bai4", "sec-g7-bai5", "sec-g7-bai6"],
        "panel-8":  ["sec-g8-bai12", "sec-g8-bai13", "sec-g8-bai14"],
        "panel-10": ["sec-g10-bai311", "sec-g10-bai412", "sec-g10-bai413", "sec-g10-bai414", "sec-g10-bai415"],
        "panel-11": ["sec-g11-bai8", "sec-g11-bai9", "sec-g11-bai10", "sec-g11-bai11", "sec-g11-bai12"]
      };
      var GRADES = ["6", "7", "8", "10", "11"];

      /* Tóm tắt từng bài — chỉ tóm tắt lại ý chính đã có trong bài gốc
         (hộp Kết luận và hộp GHI VÀO VỞ của chính bài đó). */
      var SUMMARIES = {};
      ["6", "7", "8", "10", "11"].forEach(function (g) {
        var s = window.THOC_DATA[g] && window.THOC_DATA[g].summaries;
        if (s) Object.keys(s).forEach(function (k) { SUMMARIES[k] = s[k]; });
      });
      /* ---------- Dựng khung layout: menu bên + cột nội dung ---------- */
      var wrapEl = document.querySelector(".wrap");
      var firstPanel = document.querySelector(".grade-panel");
      if (!wrapEl || !firstPanel) return;

      var layout = document.createElement("div");
      layout.className = "layout";

      var sidebar = document.createElement("aside");
      sidebar.className = "sidebar";
      sidebar.setAttribute("aria-label", "Menu lớp và bài học");
      sidebar.innerHTML =
        '<div class="side-block"><h3 class="side-h">Chọn lớp</h3><div class="side-grades" id="sideGrades"></div></div>' +
        '<div class="side-block"><h3 class="side-h" id="sideLessonsH">Bài học</h3><div class="side-lessons" id="sideLessons"></div></div>' +
        '<p class="side-tip">Bấm vào tên bài để mở bài đó trong khung bên cạnh. Học lần lượt từ bài đầu đến bài cuối của lớp; cuối mỗi bài có phần <b>Tóm tắt</b> trước khi làm luyện tập.</p>';

      var mainCol = document.createElement("div");
      mainCol.className = "main-col";

      var frameBar = document.createElement("div");
      frameBar.className = "frame-bar";
      frameBar.innerHTML =
        '<span class="fb-label">Khung bài học — em đang học</span>' +
        '<span class="fb-title" id="frameTitle"></span>' +
        '<div class="frame-nav"><button type="button" id="prevLesson">← Bài trước</button><button type="button" id="nextLesson">Bài sau →</button></div>';

      layout.appendChild(sidebar);
      layout.appendChild(mainCol);
      mainCol.appendChild(frameBar);
      wrapEl.insertBefore(layout, firstPanel);
      qsa(".grade-panel").forEach(function(p){ mainCol.appendChild(p); });

      /* ---------- Gom các section thành frame theo từng bài ---------- */
      var LESSONS = {};   /* grade -> [{key, title, frame, tk}] */
      var current = {};   /* grade -> key đang mở */
      GRADES.forEach(function(g){ LESSONS[g] = []; });

      Object.keys(TITLES).forEach(function(pid){
        var panel = $(pid);
        if (!panel) return;
        var grade = pid.replace("panel-", "");
        panel.classList.add("restructured");
        /* Thanh stepper nào đang nằm ngoài section tiêu đề (Bài 4 Lớp 6)
           thì đưa vào đúng section tiêu đề của bài đó. */
        qsa(":scope > .stepper", panel).forEach(function(nav){
          var nxt = nav.nextElementSibling;
          while (nxt && !nxt.classList.contains("step-sec")) nxt = nxt.nextElementSibling;
          if (nxt) nxt.appendChild(nav);
        });
        var titleSet = {};
        TITLES[pid].forEach(function(id){ titleSet[id] = true; });
        var secs = qsa(":scope > .step-sec", panel);
        var curFrame = null;
        secs.forEach(function(sec){
          var isTitle = !!titleSet[sec.id];
          var isTK = sec.id.indexOf("tong-ket") >= 0;
          if (isTitle || isTK){
            curFrame = document.createElement("div");
            curFrame.className = "lesson-frame";
            curFrame.setAttribute("data-grade", grade);
            curFrame.setAttribute("data-key", isTK ? "tong-ket" : sec.id);
            panel.appendChild(curFrame);
            var h2 = sec.querySelector("h2");
            LESSONS[grade].push({
              key: curFrame.getAttribute("data-key"),
              title: h2 ? h2.textContent.replace(/\s+/g, " ").trim() : sec.id,
              frame: curFrame,
              tk: isTK
            });
          }
          if (curFrame) curFrame.appendChild(sec);
        });
      });

      /* ---------- Chèn Tóm tắt vào từng bài, trước phần luyện tập / thực hành ---------- */
      GRADES.forEach(function(g){
        LESSONS[g].forEach(function(L){
          if (L.tk || !SUMMARIES[L.key]) return;
          var sum = document.createElement("section");
          sum.className = "step-sec summary-sec";
          sum.id = L.key + "-tom-tat";
          var kick = document.createElement("span");
          kick.className = "kicker";
          kick.textContent = "Tóm tắt bài học";
          var h2 = document.createElement("h2");
          h2.textContent = "Tóm tắt — " + L.title;
          var intro = document.createElement("p");
          intro.className = "sum-intro";
          intro.textContent = "Trước khi làm các hoạt động luyện tập, em đọc lại các ý chính của bài dưới đây. Tất cả đều là kiến thức cốt lõi đã học trong bài — nắm chắc các ý này là em đã nắm được bài.";
          var ul = document.createElement("ul");
          ul.className = "sum-points";
          SUMMARIES[L.key].forEach(function(pt){
            var li = document.createElement("li");
            li.textContent = pt;
            ul.appendChild(li);
          });
          var outro = document.createElement("p");
          outro.className = "sum-outro";
          outro.textContent = "Nắm chắc các ý trên rồi, em chuyển xuống phần luyện tập và vận dụng ngay bên dưới để tự kiểm tra nhé.";
          sum.appendChild(kick); sum.appendChild(h2); sum.appendChild(intro); sum.appendChild(ul); sum.appendChild(outro);
          var target = null;
          qsa(":scope > .step-sec", L.frame).forEach(function(sec){
            if (!target && /(luyen-tap|thuc-hanh)/.test(sec.id)) target = sec;
          });
          if (target) L.frame.insertBefore(sum, target); else L.frame.appendChild(sum);
          /* Thêm mắt xích "Tóm tắt" vào thanh điều hướng phần của bài */
          var titleSec = $(L.key);
          var stepper = titleSec ? titleSec.querySelector(".stepper") : null;
          if (stepper){
            var a = document.createElement("a");
            a.className = "step-link";
            a.href = "#" + sum.id;
            a.innerHTML = '<span class="n">T</span>Tóm tắt';
            var links = stepper.querySelectorAll("a");
            var last = links[links.length - 1];
            if (last && last.getAttribute("href").indexOf("tong-ket") >= 0) stepper.insertBefore(a, last);
            else stepper.appendChild(a);
          }
        });
      });

      /* ---------- Ghi chú hướng dẫn ghi bài cạnh mỗi hộp GHI VÀO VỞ ---------- */
      qsa(".notebook").forEach(function(nb){
        var body = nb.querySelector(".notebook-body");
        var n = body ? body.querySelectorAll("li").length : 0;
        var row = document.createElement("div");
        row.className = "note-row";
        nb.parentNode.insertBefore(row, nb);
        row.appendChild(nb);
        var guide = document.createElement("aside");
        guide.className = "note-guide";
        guide.setAttribute("aria-label", "Hướng dẫn ghi bài vào vở");
        guide.innerHTML =
          "<h4>Ghi bài vào vở — 4 bước</h4><ol>" +
          "<li><b>Ghi</b> tên bài + tiêu đề mục.</li>" +
          "<li><b>Chép</b> đủ " + (n > 0 ? "<b>" + n + " ý</b>" : "các ý") + " trong hộp bên cạnh, giữ nguyên phần <b>in đậm</b>.</li>" +
          "<li>Có bảng / hình → <b>vẽ lại</b> vào vở cạnh phần chữ.</li>" +
          "<li>Câu làm sai → <b>ghi đáp án đúng</b> ngay bên dưới để ôn lại.</li>" +
          "</ol>";
        row.appendChild(guide);
      });

      /* ---------- Thu gọn / mở rộng từng mục kiến thức ---------- */
      var titleAll = {};
      Object.keys(TITLES).forEach(function(pid){ TITLES[pid].forEach(function(id){ titleAll[id] = true; }); });
      GRADES.forEach(function(g){
        LESSONS[g].forEach(function(L){
          var hintDone = false;
          qsa(":scope > .step-sec", L.frame).forEach(function(sec){
            if (titleAll[sec.id] || sec.id.indexOf("tong-ket") >= 0) return;
            var h2 = null;
            for (var i = 0; i < sec.children.length; i++){
              if (sec.children[i].tagName === "H2"){ h2 = sec.children[i]; break; }
            }
            if (!h2) return;
            var body = document.createElement("div");
            body.className = "sec-body";
            var nodes = Array.prototype.slice.call(sec.childNodes);
            var after = false;
            nodes.forEach(function(node){
              if (node === h2){ after = true; return; }
              if (after) body.appendChild(node);
            });
            if (!body.childNodes.length) return;
            sec.appendChild(body);
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "sec-toggle";
            btn.setAttribute("aria-expanded", "true");
            btn.setAttribute("aria-label", "Thu gọn hoặc mở rộng mục này");
            btn.title = "Thu gọn / mở rộng mục";
            btn.innerHTML = '<span aria-hidden="true">▾</span>';
            h2.appendChild(btn);
            if (!hintDone){
              var hint = document.createElement("span");
              hint.className = "sec-hint";
              hint.textContent = "(bấm nút ▾ ở cuối tiêu đề để thu gọn / mở rộng từng mục)";
              h2.appendChild(hint);
              hintDone = true;
            }
            btn.addEventListener("click", function(){
              var collapsed = sec.classList.toggle("collapsed");
              btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
            });
          });
        });
      });

      /* ---------- Điều hướng: menu bên + frame bài ---------- */
      var sideGrades = $("sideGrades"), sideLessons = $("sideLessons"), sideLessonsH = $("sideLessonsH");
      var frameTitle = $("frameTitle"), prevBtn = $("prevLesson"), nextBtn = $("nextLesson");
      var activeGrade = null;

      GRADES.forEach(function(g){
        var b = document.createElement("button");
        b.type = "button";
        b.className = "side-grade-btn";
        b.setAttribute("data-sgrade", g);
        b.innerHTML = "Lớp " + g + "<small>" + TITLES["panel-" + g].length + " bài</small>";
        b.addEventListener("click", function(){
          var gb = document.querySelector('.grade-btn[data-grade="' + g + '"]');
          if (gb) gb.click();
        });
        sideGrades.appendChild(b);
      });

      function refreshProgress(){
        if (!activeGrade) return;
        qsa(".side-lesson-btn", sideLessons).forEach(function(btn){
          var key = btn.getAttribute("data-key");
          var L = null;
          LESSONS[activeGrade].forEach(function(x){ if (x.key === key) L = x; });
          if (!L) return;
          var chip = btn.querySelector(".prog");
          if (!chip) return;
          var total = L.frame.querySelectorAll(".activity").length;
          var done = L.frame.querySelectorAll(".act-status.done").length;
          chip.textContent = total ? (done + "/" + total + " hoạt động") : "";
          chip.style.display = total ? "" : "none";
        });
      }

      /* Quản lý (admin): các hàm hỗ trợ ẩn bài — dùng window.THOC_ADMIN
         (định nghĩa trong assets/js/admin.js; nếu file đó chưa nạp thì
         mọi bài đều hiện như bình thường). */
      function adminLessonHidden(g, key){
        return !!(window.THOC_ADMIN && window.THOC_ADMIN.isLessonHidden && window.THOC_ADMIN.isLessonHidden(g, key));
      }
      function visibleLessons(g){
        return (LESSONS[g] || []).filter(function(L){ return L.tk || !adminLessonHidden(g, L.key); });
      }

      function buildSidebar(g){
        sideLessonsH.textContent = "Bài học — Lớp " + g;
        sideLessons.innerHTML = "";
        LESSONS[g].forEach(function(L){
          /* Quản lý (admin): không hiện nút bài đang tắt trong menu bên. */
          if (!L.tk && adminLessonHidden(g, L.key)) return;
          var b = document.createElement("button");
          b.type = "button";
          b.className = "side-lesson-btn" + (L.tk ? " tk" : "");
          b.setAttribute("data-key", L.key);
          var label = document.createElement("span");
          label.textContent = L.tk ? ("Tổng kết Lớp " + g) : L.title;
          b.appendChild(label);
          var chip = document.createElement("span");
          chip.className = "prog";
          b.appendChild(chip);
          b.addEventListener("click", function(){ showLesson(g, L.key, true); });
          sideLessons.appendChild(b);
        });
        qsa(".side-grade-btn", sideGrades).forEach(function(b){
          b.setAttribute("aria-current", b.getAttribute("data-sgrade") === g ? "true" : "false");
        });
      }

      function scrollToFrameTop(){
        var y = frameBar.getBoundingClientRect().top + window.pageYOffset - 8;
        window.scrollTo(0, Math.max(0, y));
      }

      function showLesson(g, key, scroll){
        if (!LESSONS[g] || !LESSONS[g].length) return;
        var found = null;
        LESSONS[g].forEach(function(L){ if (L.key === key) found = L; });
        /* Quản lý (admin): bài đang tắt thì mở bài đang bật đầu tiên. */
        if (!found || (!found.tk && adminLessonHidden(g, found.key))){
          found = visibleLessons(g)[0] || LESSONS[g][0];
        }
        activeGrade = g;
        current[g] = found.key;
        LESSONS[g].forEach(function(L){ L.frame.classList.toggle("active", L === found); });
        frameTitle.textContent = found.tk ? ("Tổng kết — Lớp " + g) : found.title;
        var vis = visibleLessons(g);
        var idx = vis.indexOf(found);
        prevBtn.disabled = idx <= 0;
        nextBtn.disabled = idx < 0 || idx >= vis.length - 1;
        qsa(".side-lesson-btn", sideLessons).forEach(function(b){
          b.setAttribute("aria-current", b.getAttribute("data-key") === found.key ? "true" : "false");
        });
        refreshProgress();
        if (scroll) scrollToFrameTop();
      }

      prevBtn.addEventListener("click", function(){
        if (!activeGrade) return;
        var vis = visibleLessons(activeGrade);
        var idx = vis.map(function(L){ return L.key; }).indexOf(current[activeGrade]);
        if (idx > 0) showLesson(activeGrade, vis[idx - 1].key, true);
      });
      nextBtn.addEventListener("click", function(){
        if (!activeGrade) return;
        var vis = visibleLessons(activeGrade);
        var idx = vis.map(function(L){ return L.key; }).indexOf(current[activeGrade]);
        if (idx >= 0 && idx < vis.length - 1) showLesson(activeGrade, vis[idx + 1].key, true);
      });

      /* Khi chọn lớp ở màn hình đầu: dựng menu bên và mở bài đầu tiên
         (hoặc bài đang học dở của lớp đó). Listener này đăng ký sau
         listener cũ nên chạy sau khi panel của lớp đã hiện. */
      qsa(".grade-btn").forEach(function(btn){
        btn.addEventListener("click", function(){
          var g = btn.getAttribute("data-grade");
          if (!LESSONS[g] || !LESSONS[g].length) return;
          buildSidebar(g);
          showLesson(g, current[g] || LESSONS[g][0].key, true);
        });
      });

      /* Bấm mắt xích tới một section đang nằm trong frame khác:
         mở đúng frame của bài đó rồi mới cuộn tới section. */
      document.addEventListener("click", function(e){
        var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
        if (a){
          var id = a.getAttribute("href").slice(1);
          var target = id ? document.getElementById(id) : null;
          if (target){
            var frame = target.closest ? target.closest(".lesson-frame") : null;
            /* Quản lý (admin): không mở bài đang tắt qua mắt xích. */
            if (frame && adminLessonHidden(frame.getAttribute("data-grade"), frame.getAttribute("data-key"))){ e.preventDefault(); return; }
            if (frame && !frame.classList.contains("active")){
              e.preventDefault();
              showLesson(frame.getAttribute("data-grade"), frame.getAttribute("data-key"), false);
              setTimeout(function(){ target.scrollIntoView({ block: "start" }); }, 40);
            }
          }
        }
        /* Cập nhật tiến độ trên menu bên sau mỗi thao tác nộp bài */
        setTimeout(refreshProgress, 250);
      });
    })();
    