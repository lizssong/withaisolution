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
})();
