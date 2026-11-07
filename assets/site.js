// 위드AI솔루션 site script (no dependencies)
(function () {
  // scroll reveal (content stays visible if anything fails)
  var els = [].slice.call(document.querySelectorAll('.rv'));
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && els.length) {
    document.documentElement.classList.add('rv-on');
    var check = function () {
      var h = window.innerHeight || 800;
      els = els.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < h * 0.95 && r.bottom > -50) { el.classList.add('in'); return false; }
        return true;
      });
      if (!els.length) { window.removeEventListener('scroll', check); window.removeEventListener('resize', check); }
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
    // safety net: reveal everything after 4s in case scroll events never fire
    setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 4000);
  }
  // close mobile menu after choosing a link
  document.querySelectorAll('.mnav nav a').forEach(function (a) {
    a.addEventListener('click', function () { var d = a.closest('details'); if (d) d.removeAttribute('open'); });
  });

  // lecture history (출강 이력)
  var H = [
    ['2026', '2026.09', '서울시 금나래도서관 AI 기초 활용 교육', 'sen'],
    ['2026', '2026.08', '중랑양원미디어센터 AI 콘텐츠 교육', 'biz'],
    ['2026', '2026.08', '한국시니어디지털교육협회 AI시니어강사 양성과정', 'pro'],
    ['2026', '2026.07', '서울 창일중학교 진로체험 AI 숏폼 콘텐츠 특강', 'yth'],
    ['2026', '2026.07', '외국인 유학생 AI 활용 마케팅 교육', 'yth'],
    ['2026', '2026.07', '서초여성가족플라자 잠원센터 강사양성과정 AI 활용 특강', 'pro'],
    ['2026', '2026.07', 'AI영상콘텐츠강사 자격증 과정', 'pro'],
    ['2026', '2026.06', '서울시 금천문화재단 전 임직원 캔바 AI 교육', 'biz'],
    ['2026', '2026.04–07', '강북여성새일센터 캐릭터·이모티콘 디자인 창작 전임강사', 'pro'],
    ['2026', '2026.03–', 'AI 에이전트 마스터 클래스 (이미지·영상 마케팅 콘텐츠 부문)', 'pro'],
    ['2026', '2026.03–12', '잠원동 어린이집 교사 대상 캔바 AI 실무 활용 교육', 'edu'],
    ['2026', '2026.03–07', '경기 아름채복지관 시니어 스마트ON', 'sen'],
    ['2026', '2026.03', '방배1동숲어린이집 교사단 캔바 실무 활용 교육', 'edu'],
    ['2026', '2026.03', '서울 경원중학교 AI 진로설계 프로젝트', 'yth'],
    ['2026', '2026.02–07', '캔바&AI 강사양성과정 (위드AI솔루션)', 'pro'],
    ['2025', '2025.12', '여수 산학융합원·여수중앙여고 AI 창의 융합 특강', 'yth'],
    ['2025', '2025.12', '건국대·경희대 창업 아이디어 고도화 캠프 (AI 3D 모델링)', 'yth'],
    ['2025', '2025.07', '서울시·기술벤처스타트업협회 외국인 유학생 AI 마케팅 역량 강화', 'yth'],
    ['2025', '2025.05', '이투데이 전 직원 캔바 AI 교육', 'biz'],
    ['2025', '2025.04', '중소기업 임직원 캔바 비즈니스 실무 활용 연수', 'biz'],
    ['2025', '2025', '강남·서초구 어린이집·유치원 교사 캔바와 생성형 AI 교육', 'edu'],
    ['2024', '2024–2025', '강북·구리 여성새일센터 AI와 캐릭터 창작 전문과정', 'pro'],
    ['2024', '2024.07', '성균관대학교 취·창업자를 위한 AI 활용 전문 교육', 'yth'],
    ['2024', '2024.05', '우체국금융개발원 직원 AI 활용 실무 교육', 'biz'],
    ['2024', '2024', '서초구청 강사일자리지원사업 ESG 캐릭터 이모티콘 제작', 'biz'],
    ['2024', '2024', '홈택스 UI·UX 자문 및 컨설팅', 'biz']
  ];
  var TL = { biz: '기업·공공', edu: '교육기관·교사', yth: '청소년·대학', sen: '시니어', pro: '강사 양성·과정' };
  var box = document.getElementById('hist');
  function render(f) {
    if (!box) return;
    var limit = parseInt(box.getAttribute('data-limit') || '0', 10);
    var html = '', shown = 0;
    ['2026', '2025', '2024'].forEach(function (y) {
      var rows = H.filter(function (r) { return r[0] === y && (f === 'all' || r[3] === f); });
      if (limit) rows = rows.slice(0, Math.max(0, limit - shown));
      if (!rows.length) return;
      shown += rows.length;
      html += '<div class="yr">' + y + '<small>' + rows.length + '건</small></div>' + rows.map(function (r) {
        return '<div class="row"><time>' + r[1] + '</time><span>' + r[2] + '</span><span>' + TL[r[3]] + '</span></div>';
      }).join('');
    });
    box.innerHTML = html || '<p class="muted" style="padding:20px 0">해당 분야 이력이 없습니다.</p>';
  }
  var hf = document.getElementById('hfilter');
  if (hf) hf.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    hf.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    render(b.getAttribute('data-f'));
  });
  render('all');

  // inquiry form -> opens the visitor's mail app with the details filled in
  var form = document.getElementById('inq');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    var types = fd.getAll('type').join(', ') || '-';
    var body = '기관·회사명: ' + (fd.get('org') || '-') + '\n담당자: ' + (fd.get('name') || '-') +
      '\n회신 연락처: ' + (fd.get('contact') || '-') + '\n희망 시기: ' + (fd.get('when') || '-') +
      '\n대상·인원: ' + (fd.get('who') || '-') + '\n문의 분야: ' + types + '\n\n' + (fd.get('msg') || '');
    location.href = 'mailto:mkssong22@gmail.com?subject=' + encodeURIComponent('[위드AI솔루션 문의] ' + (fd.get('org') || '') + ' / ' + types) + '&body=' + encodeURIComponent(body);
  });

  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();

  // ---------- portfolio player ----------
  var root = document.body.getAttribute('data-root') || '';
  var dlg = document.createElement('dialog');
  dlg.className = 'player'; dlg.setAttribute('aria-label', '작업 재생');
  dlg.innerHTML = '<div class="player-in"><button class="dlg-x" type="button" aria-label="닫기">×</button><div class="player-box"></div><p class="player-cap"></p></div>';
  document.body.appendChild(dlg);
  var pbox = dlg.querySelector('.player-box'), pcap = dlg.querySelector('.player-cap');
  function closePlayer() { pbox.innerHTML = ''; if (dlg.open) dlg.close(); }
  dlg.querySelector('.dlg-x').addEventListener('click', closePlayer);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closePlayer(); });
  dlg.addEventListener('close', function () { pbox.innerHTML = ''; });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button.wk'); if (!b) return;
    var o = b.getAttribute('data-o') || 'h', yt = b.getAttribute('data-yt'), src = b.getAttribute('data-src'), kind = b.getAttribute('data-kind');
    pbox.className = 'player-box ' + o;
    if (yt) {
      pbox.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + yt + '?autoplay=1&rel=0&playsinline=1" title="' + b.getAttribute('data-title') + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      pcap.innerHTML = b.getAttribute('data-title') + ' · <a href="https://www.youtube.com/watch?v=' + yt + '" target="_blank" rel="noopener">YouTube에서 보기 ↗</a>';
    } else if (kind === 'img') {
      pbox.innerHTML = '<img src="' + src + '" alt="' + b.getAttribute('data-title') + '">';
      pcap.textContent = b.getAttribute('data-title');
    } else {
      pbox.innerHTML = '<video src="' + src + '" controls autoplay playsinline loop preload="auto"></video>';
      pcap.textContent = b.getAttribute('data-title') + ' · 위드AI솔루션 제작';
    }
    dlg.showModal();
  });
  var wf = document.querySelector('.wk-filter');
  if (wf) wf.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    wf.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    var f = b.getAttribute('data-f');
    document.querySelectorAll('#works .wk').forEach(function (c) { c.style.display = (f === 'all' || c.getAttribute('data-cat') === f) ? '' : 'none'; });
  });
  if (wf && location.hash) { var hb = wf.querySelector('[data-f="' + location.hash.slice(1) + '"]'); if (hb) hb.click(); }

  // ---------- copy email ----------
  document.querySelectorAll('[data-copy-mail]').forEach(function (b) {
    b.addEventListener('click', function () {
      var m = 'mkssong22@gmail.com';
      (navigator.clipboard ? navigator.clipboard.writeText(m) : Promise.reject()).then(function () { b.textContent = '복사했어요 ✓'; }, function () { b.textContent = m; });
      setTimeout(function () { b.textContent = '메일 주소 복사'; }, 2200);
    });
  });

  // ---------- 상담 도우미 (rule-based, no data sent anywhere) ----------
  var R = root;
  var MAIL = 'mkssong22@gmail.com', LITTLY = 'https://litt.ly/ssongliz';
  var T = {
    lecture: { q: '강의 섭외 문의', a: '기업·공공기관, 학교·교사, 교육센터, 시니어 대상 AI 강의를 진행해요. Canva AI, 생성형 AI 업무 활용, AI 에이전트, AI 영상·모션그래픽 등을 2~3시간 특강부터 다회차 과정까지 맞춤으로 설계합니다. 서울 서초구 기반이며 학교·센터·기업 출강과 온라인 모두 가능해요.', links: [['강의 목록 보기', 'education/']] },
    consult: { q: 'AI·AX 컨설팅', a: 'AX 컨설팅은 교육 → 업무 진단 → 자동화·콘텐츠 실행 → 사내 정착 4단계로 진행해요. 조직 규모와 목표에 맞춰 필요한 단계만 진행할 수도 있습니다.', links: [['컨설팅 자세히', 'consulting/']] },
    video: { q: '영상·모션그래픽 제작', a: '홍보 쇼츠, 강의 오프닝, 키네틱 타이포그래피, 모션그래픽, 픽셀·캐릭터 애니메이션을 제작해요. 포트폴리오에서 썸네일을 눌러 실제 영상을 보실 수 있어요.', links: [['포트폴리오 보기', 'works/'], ['제작 과정', 'studio/']] },
    page: { q: '상세페이지·홈페이지 제작', a: '상품·강의 상세페이지, 랜딩페이지, 소개 홈페이지, 수업용 웹앱, 3D로 걸어 다니는 K-메타버스 웹까지 만들어요. 검색(네이버·구글)과 AI 답변에 잘 읽히도록 구성합니다.', links: [['상세·랜딩페이지 예시', 'works/#web']] },
    academy: { q: '강사양성·자격증', a: '캔바·AI·AI 영상 강사 양성 과정을 운영하고, 국제디지털콘텐츠협회 캔바지국장으로 캔바 강사 자격증(2급·1급), AI 올인원 자격증, AI 영상콘텐츠 강사 자격증 발급이 가능해요. 자격은 요건을 갖춘 경우 발급되며 수강만으로 자동 발급되지 않아요.', links: [['강사양성 과정 보기', 'academy/']] },
    cost: { q: '비용·일정', a: '비용은 대상, 시간, 인원, 실습·제작 범위에 따라 달라서 맞춤 견적으로 안내드려요. 희망 일정과 대상만 남겨 주시면 확인 후 답변드립니다.', links: [] },
    prompt: { q: '프롬프트 모음집', a: '업무·디자인·이미지·영상·수업·마케팅 프롬프트를 모아 두었어요. 3번까지는 가입 없이, 이후에는 구글 계정으로 무료 가입하면 계속 쓸 수 있어요.', links: [['프롬프트 모음집 열기', 'prompts/']] }
  };
  var KW = [['lecture', /강의|강사 섭외|특강|출강|연수|수업|교육/], ['consult', /컨설팅|AX|자동화|에이전트|도입|진단/], ['video', /영상|모션|타이포|애니|쇼츠|릴스|픽셀/], ['page', /상세|랜딩|홈페이지|웹|사이트|메타버스|앱/], ['academy', /자격|양성|1급|2급|강사과정|캔바 강사/], ['cost', /비용|가격|견적|얼마|일정|날짜/], ['prompt', /프롬프트|로그인|가입/]];
  var chatBtn = document.createElement('button');
  chatBtn.className = 'chat-fab'; chatBtn.type = 'button'; chatBtn.setAttribute('aria-label', '상담 도우미 열기');
  chatBtn.innerHTML = '<span class="cf-dot"></span>상담하기';
  var chat = document.createElement('section');
  chat.className = 'chat'; chat.setAttribute('aria-label', '위드AI솔루션 상담 도우미'); chat.hidden = true;
  chat.innerHTML = '<header><div><b>위드AI솔루션 상담 도우미</b><small>자동 안내 · 답변은 송민경 대표가 직접 드려요</small></div><button type="button" class="chat-x" aria-label="닫기">×</button></header><div class="chat-log" aria-live="polite"></div><form class="chat-in"><input type="text" placeholder="궁금한 점을 입력하세요 (예: 강의 비용)" aria-label="메시지 입력"><button type="submit">보내기</button></form>';
  document.body.appendChild(chat); document.body.appendChild(chatBtn);
  var log = chat.querySelector('.chat-log');
  function msg(html, who) { var d = document.createElement('div'); d.className = 'cm ' + (who || 'bot'); d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function chips(list) { var d = document.createElement('div'); d.className = 'cm-chips'; list.forEach(function (c) { var b = document.createElement(c.href ? 'a' : 'button'); b.className = 'cchip'; b.textContent = c.t; if (c.href) { b.href = c.href; if (/^http|^mailto/.test(c.href)) { b.target = '_blank'; b.rel = 'noopener'; } } else { b.type = 'button'; b.onclick = c.fn; } d.appendChild(b); }); log.appendChild(d); log.scrollTop = log.scrollHeight; }
  function contactChips(topic) { return [{ t: '✉️ 메일로 문의', href: 'mailto:' + MAIL + '?subject=' + encodeURIComponent('[위드AI솔루션 문의] ' + (topic || '')) }, { t: '리틀리로 문의', href: LITTLY }, { t: '📝 간단 문의 남기기', fn: function () { form(topic); } }]; }
  function menu() { chips(Object.keys(T).map(function (k) { return { t: T[k].q, fn: function () { answer(k); } }; })); }
  function answer(k) {
    var t = T[k]; msg(t.q, 'me'); msg(t.a);
    chips(t.links.map(function (l) { return { t: l[0] + ' →', href: R + l[1] }; }).concat(contactChips(t.q)).concat([{ t: '다른 질문', fn: menu }]));
  }
  function form(topic) {
    var d = msg('<form class="cform"><input name="org" placeholder="기관·회사명 / 성함" required><input name="contact" placeholder="회신 받을 이메일 또는 전화" required><textarea name="msg" placeholder="문의 내용 (대상, 인원, 희망 일정)"></textarea><button type="submit">메일 앱으로 보내기</button><small>메일 앱이 열리고 내용이 채워져요. 이 창은 내용을 저장하지 않아요.</small></form>');
    d.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault(); var f = new FormData(e.target);
      var body = '기관·성함: ' + f.get('org') + '\n회신 연락처: ' + f.get('contact') + '\n문의 분야: ' + (topic || '-') + '\n\n' + (f.get('msg') || '');
      location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('[위드AI솔루션 문의] ' + (topic || '') + ' ' + f.get('org')) + '&body=' + encodeURIComponent(body);
      msg('메일 앱을 열었어요. 보내기만 누르시면 송민경 대표에게 전달됩니다. 감사합니다!');
    });
  }
  var started = false;
  function open() {
    chat.hidden = false; chatBtn.classList.add('on');
    if (!started) { started = true; msg('안녕하세요! 위드AI솔루션 상담 도우미예요. 궁금한 내용을 고르거나 직접 입력해 주세요. 🙂'); menu(); }
    setTimeout(function () { chat.querySelector('input').focus(); }, 50);
  }
  chatBtn.addEventListener('click', function () { chat.hidden ? open() : (chat.hidden = true, chatBtn.classList.remove('on')); });
  chat.querySelector('.chat-x').addEventListener('click', function () { chat.hidden = true; chatBtn.classList.remove('on'); });
  document.querySelectorAll('[data-open-chat]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); open(); }); });
  chat.querySelector('.chat-in').addEventListener('submit', function (e) {
    e.preventDefault(); var inp = e.target.querySelector('input'); var v = inp.value.trim(); if (!v) return; inp.value = '';
    var hit = KW.filter(function (k) { return k[1].test(v); })[0];
    if (hit) { msg(v.replace(/</g, '&lt;'), 'me'); var t = T[hit[0]]; msg(t.a); chips(t.links.map(function (l) { return { t: l[0] + ' →', href: R + l[1] }; }).concat(contactChips(t.q)).concat([{ t: '다른 질문', fn: menu }])); }
    else { msg(v.replace(/</g, '&lt;'), 'me'); msg('그 내용은 송민경 대표가 직접 답변드리는 게 정확해요. 아래 방법으로 남겨 주시면 확인 후 연락드릴게요.'); chips(contactChips('기타 문의').concat([{ t: '다른 질문', fn: menu }])); }
  });
})();
