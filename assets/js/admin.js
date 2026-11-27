/* ============================================================
   THOC_FSCHAG — Quản lý (admin)
   Nút "Quản lý" ở chân trang → đăng nhập (tên đăng nhập +
   mật khẩu) → bảng quản lý bật/tắt từng bài học.

   LƯU Ý QUAN TRỌNG: cơ chế này CHỈ chặn người dùng thường ở
   phía trình duyệt (mật khẩu được kiểm tra bằng hash SHA-256
   lưu trong code, không lưu mật khẩu dạng rõ), không phải bảo
   mật tuyệt đối — ai đọc được mã nguồn vẫn thấy hash và có thể
   tự mở khóa. Không dùng cho dữ liệu nhạy cảm.
   Trạng thái bật/tắt bài chỉ lưu trên trình duyệt này
   (localStorage); muốn áp dụng cho mọi học sinh thì đưa vào code.

   File này không sửa nội dung bài học, ngân hàng câu hỏi hay
   thang điểm — chỉ thêm lớp quản lý hiển thị. Mọi điểm móc nối
   với app.js đều qua window.THOC_ADMIN và được app.js kiểm tra
   sự tồn tại trước khi dùng, nên nếu file này chưa nạp thì
   trang vẫn chạy bình thường như trước.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- Cấu hình ---------------- */
  var ADMIN_USER = "admin";
  /* SHA-256 của mật khẩu admin — CHỈ lưu hash, không lưu mật khẩu dạng rõ. */
  var ADMIN_PASS_HASH = "7cc2b5fdf3c051bc9b19bd9f83c28eb65daf9fb92864cb3e66ef20cd86439b1d";
  var LS_AUTH = "thocAdminAuth";
  var SS_AUTH = "thocAdminAuth";
  var LS_HIDDEN = "thocLessonsHidden";
  var GRADES = ["6", "7", "8", "10", "11"];
  /* Bản đồ số bài → mã section, dùng dự phòng khi không đọc được từ khung bài. */
  var NUM_TO_KEY_FALLBACK = {
    "6":  { "4": "sec-bai",    "5": "sec-bai5",    "6": "sec-bai6",    "7": "sec-bai7" },
    "7":  { "4": "sec-g7-bai4",  "5": "sec-g7-bai5",  "6": "sec-g7-bai6" },
    "8":  { "12": "sec-g8-bai12", "13": "sec-g8-bai13", "14": "sec-g8-bai14" },
    "10": { "3.11": "sec-g10-bai311", "4.12": "sec-g10-bai412", "4.13": "sec-g10-bai413", "4.14": "sec-g10-bai414", "4.15": "sec-g10-bai415" },
    "11": { "8": "sec-g11-bai8", "9": "sec-g11-bai9", "10": "sec-g11-bai10", "11": "sec-g11-bai11", "12": "sec-g11-bai12" }
  };

  /* ---------------- Tiện ích DOM ---------------- */
  function $(id){ return document.getElementById(id); }
  function qsa(sel, root){ return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text){
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  /* ---------------- SHA-256 (đồng bộ, chạy mọi trình duyệt) ---------------- */
  /* SHA256-START */
  function sha256Ascii(ascii){
    function rr(v, a){ return (v >>> a) | (v << (32 - a)); }
    var maxWord = Math.pow(2, 32);
    var result = "";
    var words = [];
    var asciiBitLength = ascii.length * 8;
    var hash = [], k = [], primeCounter = 0, isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++){
      if (!isComposite[candidate]){
        for (var i = 0; i < 313; i += candidate) isComposite[i] = candidate;
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += "\x80";
    while (ascii.length % 64 - 56) ascii += "\x00";
    for (var i2 = 0; i2 < ascii.length; i2++){
      var j = ascii.charCodeAt(i2);
      if (j >> 8) return "";
      words[i2 >> 2] |= j << ((3 - i2) % 4) * 8;
    }
    words[words.length] = (asciiBitLength / maxWord) | 0;
    words[words.length] = asciiBitLength;
    for (var j2 = 0; j2 < words.length;){
      var w = words.slice(j2, j2 += 16);
      var oldHash = hash;
      hash = hash.slice(0, 8);
      for (var i3 = 0; i3 < 64; i3++){
        var w15 = w[i3 - 15], w2 = w[i3 - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25))
          + ((e & hash[5]) ^ (~e & hash[6]))
          + k[i3]
          + (w[i3] = (i3 < 16) ? w[i3] : (w[i3 - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i3 - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var temp2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (var i4 = 0; i4 < 8; i4++) hash[i4] = (hash[i4] + oldHash[i4]) | 0;
    }
    for (var i5 = 0; i5 < 8; i5++){
      for (var j3 = 3; j3 + 1; j3--){
        var b = (hash[i5] >> (j3 * 8)) & 255;
        result += ((b < 16) ? 0 : "") + b.toString(16);
      }
    }
    return result;
  }
  /* SHA256-END */
  function sha256Hex(str){
    return sha256Ascii(unescape(encodeURIComponent(str)));
  }

  /* ---------------- Trạng thái bật/tắt ---------------- */
  function loadHidden(){
    try {
      var raw = window.localStorage.getItem(LS_HIDDEN);
      if (!raw) return {};
      var obj = JSON.parse(raw);
      if (!obj || typeof obj !== "object") return {};
      return obj;
    } catch (e) { return {}; }
  }
  var hiddenState = loadHidden();
  function saveHidden(){
    try { window.localStorage.setItem(LS_HIDDEN, JSON.stringify(hiddenState)); } catch (e) {}
  }
  function isLessonHidden(g, key){
    var arr = hiddenState[String(g)];
    return !!(arr && arr.indexOf(key) >= 0);
  }
  function setLessonHidden(g, key, hidden){
    g = String(g);
    var arr = hiddenState[g] || (hiddenState[g] = []);
    var i = arr.indexOf(key);
    if (hidden && i < 0) arr.push(key);
    if (!hidden && i >= 0) arr.splice(i, 1);
    if (!arr.length) delete hiddenState[g];
    saveHidden();
  }

  /* ---------------- Danh sách bài ---------------- */
  /* Đọc từ khung bài đã dựng (nguồn đúng nhất); thiếu thì dùng bản đồ dự phòng. */
  var LESSONS_LIST = [];   /* [{grade, key, title, num}] */
  var NUM_TO_KEY = {};     /* grade -> {soBai: key} */
  function buildLessonList(){
    LESSONS_LIST = [];
    NUM_TO_KEY = {};
    GRADES.forEach(function (g){
      NUM_TO_KEY[g] = {};
      var frames = qsa('.lesson-frame[data-grade="' + g + '"]');
      frames.forEach(function (fr){
        var key = fr.getAttribute("data-key");
        if (!key || key === "tong-ket") return;
        var h2 = fr.querySelector("h2");
        var title = h2 ? h2.textContent.replace(/\s+/g, " ").replace(/▾/g, "").trim() : key;
        var m = title.match(/^Bài\s+([\d.]+)/);
        var num = m ? m[1] : null;
        LESSONS_LIST.push({ grade: g, key: key, title: title, num: num });
        if (num) NUM_TO_KEY[g][num] = key;
      });
      /* Bù từ bản đồ dự phòng cho bài nào không đọc được số bài từ tiêu đề. */
      Object.keys(NUM_TO_KEY_FALLBACK[g]).forEach(function (num){
        if (!NUM_TO_KEY[g][num]){
          var key = NUM_TO_KEY_FALLBACK[g][num];
          NUM_TO_KEY[g][num] = key;
          var exists = LESSONS_LIST.some(function (L){ return L.grade === g && L.key === key; });
          if (!exists) LESSONS_LIST.push({ grade: g, key: key, title: "Bài " + num, num: num });
        }
      });
    });
  }
  function lessonTitle(g, key){
    for (var i = 0; i < LESSONS_LIST.length; i++){
      if (LESSONS_LIST[i].grade === g && LESSONS_LIST[i].key === key) return LESSONS_LIST[i].title;
    }
    return key;
  }
  function visibleCount(g){
    var n = 0;
    LESSONS_LIST.forEach(function (L){ if (L.grade === g && !isLessonHidden(g, L.key)) n++; });
    return n;
  }
  function totalCount(g){
    var n = 0;
    LESSONS_LIST.forEach(function (L){ if (L.grade === g) n++; });
    return n;
  }

  /* ---------------- Câu hỏi ôn tập của bài nào? ---------------- */
  /* reviewBank.acts[<id hoạt động>].src luôn bắt đầu bằng "Bài X · ...",
     nên suy ra bài của câu hỏi từ trường "a" của câu đó. */
  function lessonKeyForQuestion(g, q){
    try {
      var bank = window.THOC_DATA && window.THOC_DATA[g] && window.THOC_DATA[g].reviewBank;
      if (!bank || !bank.acts) return null;
      var act = bank.acts[q.a];
      if (!act || !act.src) return null;
      var m = String(act.src).match(/^Bài\s+([\d.]+)/);
      if (!m) return null;
      var byNum = NUM_TO_KEY[String(g)] || {};
      return byNum[m[1]] || null;
    } catch (e) { return null; }
  }
  function isReviewHidden(g, q){
    var key = lessonKeyForQuestion(g, q);
    return !!(key && isLessonHidden(g, key));
  }

  /* ---------------- Tổng kết: hoạt động thuộc bài nào? ---------------- */
  /* Tên hoạt động trong THOC_DATA[g].names luôn bắt đầu bằng
     "Bài <số bài> · ...", nên suy ra bài của hoạt động từ tên đó
     rồi đối chiếu với bản đồ số bài → mã section (NUM_TO_KEY). */
  function activityLessonNum(g, actId){
    try {
      var names = window.THOC_DATA && window.THOC_DATA[g] && window.THOC_DATA[g].names;
      if (!names) return null;
      var nm = names[actId];
      if (!nm) return null;
      var m = String(nm).match(/^Bài\s+([\d.]+)/);
      return m ? m[1] : null;
    } catch (e) { return null; }
  }
  function isActivityHidden(g, actId){
    var num = activityLessonNum(g, actId);
    if (num === null) return false;
    var byNum = NUM_TO_KEY[String(g)] || {};
    var key = byNum[num];
    if (!key) return false;
    return isLessonHidden(g, key);
  }

  /* ---------------- Phiên đăng nhập ---------------- */
  function isAuthed(){
    try {
      return window.localStorage.getItem(LS_AUTH) === "1" || window.sessionStorage.getItem(SS_AUTH) === "1";
    } catch (e) { return false; }
  }
  function setAuthed(remember){
    try {
      if (remember){
        window.localStorage.setItem(LS_AUTH, "1");
        window.sessionStorage.removeItem(SS_AUTH);
      } else {
        window.sessionStorage.setItem(SS_AUTH, "1");
        window.localStorage.removeItem(LS_AUTH);
      }
    } catch (e) {}
  }
  function clearAuth(){
    try {
      window.localStorage.removeItem(LS_AUTH);
      window.sessionStorage.removeItem(SS_AUTH);
    } catch (e) {}
  }
  function tryLogin(user, pass){
    if (String(user).trim() !== ADMIN_USER) return false;
    return sha256Hex(String(pass)) === ADMIN_PASS_HASH;
  }

  /* ---------------- Áp dụng trạng thái hiển thị ---------------- */
  function cardFor(L){
    var panel = $("panel-" + L.grade);
    if (!panel) return null;
    var link = panel.querySelector('a.lesson-card[href="#' + L.key + '"]');
    if (link) return link;
    /* Bài đầu tiên của mỗi lớp dùng thẻ div (không có href). */
    var firstKey = null;
    LESSONS_LIST.forEach(function (x){ if (x.grade === L.grade && !firstKey) firstKey = x.key; });
    if (L.key === firstKey){
      var div = panel.querySelector(":scope > div.lesson-card");
      if (div) return div;
    }
    return null;
  }
  function ensureVisibleFrame(){
    var active = document.querySelector(".lesson-frame.active");
    if (!active || !active.classList.contains("lesson-hidden")) return;
    var g = active.getAttribute("data-grade");
    var btns = qsa(".side-lesson-btn");
    for (var i = 0; i < btns.length; i++){
      var b = btns[i];
      if (b.style.display === "none") continue;
      var key = b.getAttribute("data-key");
      if (key === "tong-ket" || !isLessonHidden(g, key)){ b.click(); return; }
    }
  }
  function updateGradeCounts(){
    GRADES.forEach(function (g){
      var n = visibleCount(g);
      var hero = document.querySelector('.grade-btn[data-grade="' + g + '"] small');
      if (hero) hero.textContent = n + " bài giảng";
      var side = document.querySelector('.side-grade-btn[data-sgrade="' + g + '"] small');
      if (side) side.textContent = n + " bài";
    });
  }
  function applyVisibility(){
    LESSONS_LIST.forEach(function (L){
      var hidden = isLessonHidden(L.grade, L.key);
      var frame = document.querySelector('.lesson-frame[data-grade="' + L.grade + '"][data-key="' + L.key + '"]');
      if (frame) frame.classList.toggle("lesson-hidden", hidden);
      var card = cardFor(L);
      if (card) card.style.display = hidden ? "none" : "";
      var btn = document.querySelector('.side-lesson-btn[data-key="' + L.key + '"]');
      if (btn) btn.style.display = hidden ? "none" : "";
    });
    updateGradeCounts();
    ensureVisibleFrame();
    /* Làm mới các bảng Tổng kết (tên bài, điểm, tổng điểm, chữ tĩnh)
       theo đúng bài đang bật — hàm này do app.js cung cấp. */
    if (window.THOC_REFRESH_SUMMARIES) window.THOC_REFRESH_SUMMARIES();
  }
  /* Làm mới ghi chú ngân hàng ôn tập (đã tính theo bài đang bật). */
  function refreshReviewNote(){
    var rvGrade = $("rvGrade");
    if (rvGrade) rvGrade.dispatchEvent(new Event("change"));
  }

  /* ---------------- Giao diện: nút Quản lý + huy hiệu ---------------- */
  var adminBtn, adminBadge;
  function buildFooterButton(){
    var footer = document.querySelector("footer");
    if (!footer) return;
    var zone = el("div", "admin-zone");
    adminBtn = el("button", "admin-btn", "Quản lý");
    adminBtn.type = "button";
    adminBtn.setAttribute("aria-label", "Quản lý bài học (dành cho giáo viên)");
    adminBtn.addEventListener("click", function(){
      if (isAuthed()) openPanel(); else openLogin();
    });
    adminBadge = el("span", "admin-badge", "Đang quản lý");
    adminBadge.hidden = true;
    zone.appendChild(adminBtn);
    zone.appendChild(adminBadge);
    footer.appendChild(zone);
    updateBadge();
  }
  function updateBadge(){
    if (adminBadge) adminBadge.hidden = !isAuthed();
  }

  /* ---------------- Hộp đăng nhập ---------------- */
  var loginOverlay, loginErr, loginUser, loginPass, loginRemember;
  function buildLoginModal(){
    loginOverlay = el("div", "adm-overlay");
    loginOverlay.id = "admLoginOverlay";
    var modal = el("div", "adm-modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "admLoginTitle");
    var head = el("div", "adm-modal-head");
    var h3 = el("h3", null, "Quản lý — Đăng nhập");
    h3.id = "admLoginTitle";
    var close = el("button", "adm-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Đóng");
    close.addEventListener("click", closeLogin);
    head.appendChild(h3);
    head.appendChild(close);
    modal.appendChild(head);

    var form = document.createElement("form");
    form.id = "admLoginForm";
    form.setAttribute("autocomplete", "on");
    var fUser = el("label", "adm-field", "Tên đăng nhập");
    loginUser = document.createElement("input");
    loginUser.type = "text";
    loginUser.id = "admUser";
    loginUser.setAttribute("autocomplete", "username");
    loginUser.required = true;
    fUser.appendChild(loginUser);
    var fPass = el("label", "adm-field", "Mật khẩu");
    loginPass = document.createElement("input");
    loginPass.type = "password";
    loginPass.id = "admPass";
    loginPass.setAttribute("autocomplete", "current-password");
    loginPass.required = true;
    fPass.appendChild(loginPass);
    var rem = el("label", "adm-remember");
    loginRemember = document.createElement("input");
    loginRemember.type = "checkbox";
    loginRemember.id = "admRemember";
    loginRemember.checked = true;
    rem.appendChild(loginRemember);
    rem.appendChild(document.createTextNode(" Ghi nhớ đăng nhập trên trình duyệt này"));
    loginErr = el("p", "adm-error", "Tên đăng nhập hoặc mật khẩu chưa đúng. Thầy kiểm tra lại nhé.");
    loginErr.id = "admLoginErr";
    loginErr.hidden = true;
    var actions = el("div", "adm-actions");
    var submit = el("button", "btn orange", "Đăng nhập");
    submit.type = "submit";
    var cancel = el("button", "btn ghost", "Hủy");
    cancel.type = "button";
    cancel.addEventListener("click", closeLogin);
    actions.appendChild(submit);
    actions.appendChild(cancel);
    form.appendChild(fUser);
    form.appendChild(fPass);
    form.appendChild(rem);
    form.appendChild(loginErr);
    form.appendChild(actions);
    form.addEventListener("submit", function (ev){
      ev.preventDefault();
      if (tryLogin(loginUser.value, loginPass.value)){
        setAuthed(loginRemember.checked);
        loginErr.hidden = true;
        loginPass.value = "";
        closeLogin();
        updateBadge();
        openPanel();
      } else {
        loginErr.hidden = false;
        loginPass.value = "";
        loginPass.focus();
      }
    });
    modal.appendChild(form);
    var foot = el("p", "adm-note", "Đăng nhập quản lý chỉ có tác dụng trên trình duyệt này.");
    modal.appendChild(foot);
    loginOverlay.appendChild(modal);
    loginOverlay.addEventListener("click", function (ev){ if (ev.target === loginOverlay) closeLogin(); });
    document.body.appendChild(loginOverlay);
  }
  function openLogin(){
    loginErr.hidden = true;
    loginPass.value = "";
    loginOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(function(){ loginUser.focus(); }, 30);
  }
  function closeLogin(){
    loginOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- Bảng quản lý ---------------- */
  var panelOverlay, panelList, panelSummary;
  function buildPanelModal(){
    panelOverlay = el("div", "adm-overlay");
    panelOverlay.id = "admPanelOverlay";
    var modal = el("div", "adm-modal adm-panel");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "admPanelTitle");
    var head = el("div", "adm-modal-head");
    var h3 = el("h3", null, "Bảng quản lý bài học");
    h3.id = "admPanelTitle";
    var close = el("button", "adm-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "Đóng");
    close.addEventListener("click", closePanel);
    head.appendChild(h3);
    head.appendChild(close);
    modal.appendChild(head);
    modal.appendChild(el("p", "adm-note", "Tắt một bài sẽ ẩn bài đó khỏi giao diện học sinh (cả bài học và câu hỏi ôn tập của bài). Trạng thái bật/tắt chỉ lưu trên trình duyệt này; muốn áp dụng cho mọi học sinh, thầy báo trợ lý để đưa vào code."));
    modal.appendChild(el("p", "adm-note", "Lưu ý: cơ chế này chỉ chặn người dùng thường ở phía trình duyệt, không phải bảo mật tuyệt đối."));
    panelSummary = el("p", "adm-note");
    panelSummary.id = "admPanelSummary";
    modal.appendChild(panelSummary);
    panelList = el("div");
    panelList.id = "admLessonList";
    panelList.addEventListener("change", function (ev){
      var t = ev.target;
      if (!t || t.type !== "checkbox" || !t.getAttribute("data-key")) return;
      setLessonHidden(t.getAttribute("data-grade"), t.getAttribute("data-key"), !t.checked);
      applyVisibility();
      renderPanelList();
      refreshReviewNote();
    });
    modal.appendChild(panelList);
    var actions = el("div", "adm-actions");
    var allOn = el("button", "btn", "Bật tất cả");
    allOn.type = "button";
    allOn.addEventListener("click", function(){
      hiddenState = {};
      saveHidden();
      applyVisibility();
      renderPanelList();
      refreshReviewNote();
    });
    var allOff = el("button", "btn ghost", "Tắt tất cả");
    allOff.type = "button";
    allOff.addEventListener("click", function(){
      if (!window.confirm("Tắt tất cả " + LESSONS_LIST.length + " bài? Học sinh sẽ không thấy bài học nào cho đến khi thầy bật lại.")) return;
      LESSONS_LIST.forEach(function (L){
        var arr = hiddenState[L.grade] || (hiddenState[L.grade] = []);
        if (arr.indexOf(L.key) < 0) arr.push(L.key);
      });
      saveHidden();
      applyVisibility();
      renderPanelList();
      refreshReviewNote();
    });
    var logout = el("button", "btn ghost", "Đăng xuất");
    logout.type = "button";
    logout.id = "admLogout";
    logout.addEventListener("click", function(){
      clearAuth();
      updateBadge();
      closePanel();
    });
    var closeBtn = el("button", "btn orange", "Đóng");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", closePanel);
    actions.appendChild(allOn);
    actions.appendChild(allOff);
    actions.appendChild(logout);
    actions.appendChild(closeBtn);
    modal.appendChild(actions);
    panelOverlay.appendChild(modal);
    panelOverlay.addEventListener("click", function (ev){ if (ev.target === panelOverlay) closePanel(); });
    document.body.appendChild(panelOverlay);
  }
  function renderPanelList(){
    panelList.innerHTML = "";
    var onCount = 0;
    GRADES.forEach(function (g){
      var items = LESSONS_LIST.filter(function (L){ return L.grade === g; });
      if (!items.length) return;
      var box = el("div", "adm-grade");
      var h4 = el("h4", null, "Lớp " + g + " ");
      var cnt = el("span", "adm-count");
      box.appendChild(h4);
      h4.appendChild(cnt);
      var on = 0;
      items.forEach(function (L){
        var hidden = isLessonHidden(g, L.key);
        if (!hidden) on++;
        var row = el("label", "adm-row");
        var name = el("span", "adm-lesson" + (hidden ? " adm-off" : ""), L.title);
        var sw = el("span", "adm-switch");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !hidden;
        cb.setAttribute("data-grade", g);
        cb.setAttribute("data-key", L.key);
        cb.setAttribute("aria-label", (hidden ? "Bật " : "Tắt ") + L.title);
        var slider = el("span", "adm-slider");
        sw.appendChild(cb);
        sw.appendChild(slider);
        row.appendChild(name);
        row.appendChild(sw);
        box.appendChild(row);
      });
      cnt.textContent = on + "/" + items.length + " bài đang bật";
      onCount += on;
      panelList.appendChild(box);
    });
    panelSummary.textContent = "Đang bật " + onCount + "/" + LESSONS_LIST.length + " bài.";
  }
  function openPanel(){
    if (!isAuthed()){ openLogin(); return; }
    renderPanelList();
    panelOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closePanel(){
    panelOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- Khởi động ---------------- */
  document.addEventListener("keydown", function (ev){
    if (ev.key === "Escape"){
      if (panelOverlay && panelOverlay.classList.contains("open")) closePanel();
      else if (loginOverlay && loginOverlay.classList.contains("open")) closeLogin();
    }
  });
  buildLessonList();
  /* Điểm móc nối cho app.js (đã kiểm tra tồn tại trước khi dùng).
     Gán TRƯỚC khi làm mới ghi chú ôn tập để rvPools thấy được bộ lọc. */
  window.THOC_ADMIN = {
    isLessonHidden: isLessonHidden,
    isReviewHidden: isReviewHidden,
    isActivityHidden: isActivityHidden,
    applyVisibility: applyVisibility,
    isAuthed: isAuthed,
    lessons: LESSONS_LIST
  };
  buildFooterButton();
  buildLoginModal();
  buildPanelModal();
  applyVisibility();
  refreshReviewNote();
})();
