/* 위드AI솔루션 무료 AX 진단 */
(function () {
  'use strict';
  var TASKS = [
    { id: 'inquiry', t: '고객 문의·상담 응대', d: '카톡·전화·DM·메일 문의 확인과 답장', a: 0.6, ai: '문의를 한곳에 모아 유형별로 나누고 답장 초안을 만든 뒤, 담당자가 확인하고 보냅니다.' },
    { id: 'booking', t: '예약·일정 관리', d: '예약 접수, 일정 조율, 리마인드 연락', a: 0.6, ai: '예약 신청이 들어오면 일정표에 자동 기록하고 전날 안내 메시지 초안을 준비합니다.' },
    { id: 'docs', t: '자료 옮겨 적기', d: '엑셀·문서·시스템 사이 복사 붙여넣기', a: 0.75, ai: '양식에 입력된 자료가 필요한 시트와 문서로 자동으로 옮겨집니다.' },
    { id: 'sales', t: '매출·정산 집계', d: '판매 내역 합치기, 정산표, 세무 자료 정리', a: 0.7, ai: '판매·결제 자료를 한 시트로 모아 주간 요약과 이상치 알림을 보냅니다.' },
    { id: 'stock', t: '재고·발주 관리', d: '재고 확인, 발주서 작성, 입고 기록', a: 0.5, ai: '재고 기준선 아래로 떨어진 품목을 알려 주고 발주서 초안을 만듭니다.' },
    { id: 'quote', t: '견적서·계약서·발주서 작성', d: '같은 양식에 정보만 바꿔 작성', a: 0.55, ai: '고객 정보와 품목만 넣으면 견적서·계약서 초안이 양식에 맞게 만들어집니다.' },
    { id: 'report', t: '주간·월간 보고서', d: '실적 정리, 보고서 작성', a: 0.6, ai: '모인 자료로 보고서 초안과 핵심 요약을 만들어 담당자가 다듬기만 하면 됩니다.' },
    { id: 'meeting', t: '회의록·업무 공유', d: '회의 정리, 할 일 배분, 공지', a: 0.65, ai: '회의 녹음·메모에서 회의록과 담당자별 할 일 목록을 만들어 공유합니다.' },
    { id: 'content', t: '블로그·SNS 콘텐츠', d: '주제 선정, 글·이미지·숏폼 제작, 발행', a: 0.55, ai: '월간 주제 계획에 맞춰 글·이미지·숏폼 초안을 만들고, 확인 후 발행·성과 정리까지 이어 갑니다.' },
    { id: 'design', t: '홍보물·상세페이지·카드뉴스', d: '전단, 배너, 상세페이지 디자인', a: 0.45, ai: '브랜드 템플릿을 만들어 두고 문구만 바꾸면 홍보물이 대량으로 만들어집니다.' },
    { id: 'edu', t: '강의안·교육자료·공문', d: '계획서, 교안, 공지문, 가정통신문', a: 0.5, ai: '강의 정보를 한 번 입력하면 계획서·공지문·교안 틀이 함께 만들어집니다.' },
    { id: 'hr', t: '채용·근태·인사 서류', d: '채용 공고, 지원자 정리, 근태 집계', a: 0.45, ai: '지원서를 기준표로 1차 정리하고 근태 기록을 월말 집계표로 자동 정리합니다.' },
    { id: 'branch', t: '지점·부서 현황 취합', d: '여러 지점·부서 실적과 이슈 모으기', a: 0.65, ai: '지점이 양식에 입력하면 관리판에 모이고, 누락된 지점에는 자동 알림이 갑니다.' }
  ];
  var HOURS = [0, 1, 2, 4, 8, 12, 20, 30];
  var QS = [
    { id: 'q1', p: '업무 자료는 주로 어디에 있나요?', o: ['종이·수첩', '각자 PC의 엑셀·파일', '공유 드라이브·클라우드', '업무 시스템(ERP·POS·CRM 등)'] },
    { id: 'q2', p: '지금 AI 도구(챗GPT·제미나이 등)를 얼마나 쓰나요?', o: ['거의 안 씀', '일부가 가끔 씀', '여러 명이 자주 씀', '업무 규칙으로 정해 씀'] },
    { id: 'q3', p: '반복 업무의 절차가 정리되어 있나요?', o: ['담당자 머릿속에만 있음', '일부 메모 수준', '문서로 정리됨', '양식·매뉴얼이 표준화됨'] },
    { id: 'q4', p: 'AI 도입을 맡을 사람이 있나요?', o: ['없음', '대표가 직접 해야 함', '담당자는 있지만 시간이 부족', '맡길 담당자가 있음'] },
    { id: 'q5', p: '반복 업무의 형식은 얼마나 일정한가요?', o: ['매번 다름', '어느 정도 비슷함', '대부분 같은 형식', '거의 같은 형식'] },
    { id: 'q6', p: '대표·경영진의 생각은 어떤가요?', o: ['관심만 있음', '필요성에 공감', '올해 안에 도입하고 싶음', '구체적 목표와 일정이 있음'] },
    { id: 'q7', p: '고객 개인정보·보안 기준은 어떤가요?', o: ['개인정보가 많고 기준이 없음', '개인정보가 많고 일부 기준 있음', '개인정보가 적거나 기준이 있음', '기준이 명확하고 지켜지고 있음'] }
  ];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var won = function (n) { return Math.round(n).toLocaleString('ko-KR'); };
  var state = { result: null };

  // render tasks
  $('#tasks').innerHTML = TASKS.map(function (t) {
    return '<div class="task"><div><b>' + esc(t.t) + '</b><span>' + esc(t.d) + '</span></div><select name="h_' + t.id + '" aria-label="' + esc(t.t) + ' 주당 시간">' +
      HOURS.map(function (h) { return '<option value="' + h + '">' + (h === 0 ? '해당 없음' : '주 ' + h + '시간' + (h === 30 ? ' 이상' : '')) + '</option>'; }).join('') + '</select></div>';
  }).join('');
  $('#qs').innerHTML = QS.map(function (q) {
    return '<div class="q"><p>' + esc(q.p) + '</p><div class="opts">' + q.o.map(function (o, i) {
      return '<label class="opt"><input type="radio" name="' + q.id + '" value="' + i + '">' + esc(o) + '</label>';
    }).join('') + '</div></div>';
  }).join('');

  function show(n) {
    $$('[data-step]').forEach(function (el) { el.hidden = String(el.getAttribute('data-step')) !== String(n); });
    $$('.axc-steps li').forEach(function (li) { li.classList.toggle('on', Number(li.getAttribute('data-s')) <= n); });
    var top = $('#axc').getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
  function val(name) { var el = $('[name="' + name + '"]:checked') || $('[name="' + name + '"]'); return el ? el.value : ''; }

  function check(n) {
    var e = $('[data-err="' + n + '"]'); if (e) e.textContent = '';
    if (n === 1 && !$('[name="orgType"]:checked')) { e.textContent = '조직 유형을 골라 주세요.'; return false; }
    if (n === 2) {
      var sum = TASKS.reduce(function (s, t) { return s + Number(val('h_' + t.id)); }, 0);
      if (!sum) { e.textContent = '반복 업무를 하나 이상 골라 주세요.'; return false; }
    }
    if (n === 3) {
      var miss = QS.filter(function (q) { return !$('[name="' + q.id + '"]:checked'); });
      if (miss.length) { e.textContent = '모든 질문에 답해 주세요. (' + miss.length + '개 남음)'; return false; }
    }
    return true;
  }

  function compute() {
    var wage = Math.max(10000, Number(val('wage')) || 25000);
    var items = TASKS.map(function (t) {
      var h = Number(val('h_' + t.id)); var m = h * 4.3 * t.a;
      return { id: t.id, t: t.t, ai: t.ai, h: h, save: m };
    }).filter(function (x) { return x.h > 0; }).sort(function (a, b) { return b.save - a.save; });
    var hours = items.reduce(function (s, x) { return s + x.save; }, 0);
    var answers = {}; var pts = 0;
    QS.forEach(function (q) { var v = Number(val(q.id)); pts += v; answers[q.id] = q.o[v]; });
    var score = Math.round(pts / (QS.length * 3) * 100);
    var level = score < 35 ? '탐색 단계' : score < 60 ? '준비 단계' : score < 80 ? '실행 단계' : '확산 단계';
    var orgType = val('orgType');
    var big = orgType === '중소·중견기업' || orgType === '공공기관·교육기관';
    var pack, packWhy;
    if (score < 35) {
      pack = big ? '임직원 AX 워크숍 → AX 진단 컨설팅' : 'AX 진단 컨설팅';
      packWhy = '자료와 절차가 흩어져 있어 바로 자동화하면 오히려 일이 늘 수 있습니다. 먼저 ' + (big ? '짧은 실습 워크숍으로 공통 언어를 만들고, ' : '') + '업무를 지도로 그려 무엇부터 바꿀지 정하는 것이 가장 빠른 길입니다.';
    } else if (score < 60) {
      pack = 'AX 진단 컨설팅 → AX 파일럿';
      packWhy = '자동화할 재료는 갖춰져 있습니다. 진단으로 1순위 업무를 정하고, 그 업무 하나를 2~4주 파일럿으로 실제 자료에 적용해 효과를 확인하세요.';
    } else if (score < 80) {
      pack = 'AX 파일럿 → AX 구축';
      packWhy = '절차와 자료가 정리되어 있어 바로 파일럿으로 들어갈 수 있습니다. 1순위 업무에서 효과를 확인한 뒤 2·3순위 업무까지 구축으로 넓히세요.';
    } else {
      pack = 'AX 구축 + 운영·개선 파트너';
      packWhy = '조직이 AI를 받아들일 준비가 되어 있습니다. 여러 업무를 한 번에 연결하고, 매달 점검과 개선으로 효과를 키우는 단계입니다.';
    }
    if (hours < 8 && score >= 35) packWhy += ' 다만 지금 고른 업무의 절감 시간이 크지 않으니, 진단에서 놓친 반복 업무가 없는지 함께 찾아보는 것을 권합니다.';
    var r = {
      orgType: orgType, industry: val('industry'), wage: wage, budget: val('budget'),
      score: score, level: level, hours: Math.round(hours), low: Math.round(hours * 0.7), wonMonth: Math.round(hours * wage), wonYear: Math.round(hours * wage * 12),
      top: items.slice(0, 3), pack: pack, packWhy: packWhy, answers: answers,
      tasks: items.map(function (x) { return x.t + ' 주' + x.h + 'h'; })
    };
    state.result = r; return r;
  }

  function render(r) {
    var top = r.top.map(function (x) {
      return '<li><b>' + esc(x.t) + '</b><small>지금 주 ' + x.h + '시간 · 월 약 ' + Math.round(x.save) + '시간 절감 예상</small><p>' + esc(x.ai) + '</p></li>';
    }).join('');
    $('#result').innerHTML =
      '<h2>AX 진단 결과</h2><p class="hint">' + esc(r.orgType) + (r.industry ? ' · ' + esc(r.industry) : '') + ' · ' + new Date().toLocaleDateString('ko-KR') + '</p>' +
      '<div class="res-top"><div class="gauge" style="--v:' + r.score + '"><div><div><b>' + r.score + '</b><span>AX 준비도 / 100</span></div></div></div>' +
      '<div><span class="lvl">' + esc(r.level) + '</span><p style="margin-top:10px;font-size:16.5px">' + esc(r.packWhy) + '</p></div></div>' +
      '<div class="kpis"><div><b>월 ' + r.low + '~' + r.hours + '시간</b><span>줄일 수 있는 시간 (추정)</span></div><div><b>월 ' + won(r.wonMonth) + '원</b><span>인건비 환산 (시간당 ' + won(r.wage) + '원)</span></div><div><b>연 ' + won(r.wonYear) + '원</b><span>1년 환산</span></div></div>' +
      '<h3 style="font-size:19px">먼저 AI 비서에게 넘길 업무 TOP 3</h3><ol class="top3">' + top + '</ol>' +
      '<div class="rec"><h3>추천 시작: ' + esc(r.pack) + '</h3><p>서비스별 기간과 시작 가격은 <a href="../consulting/#pricing" style="color:#fff;text-decoration:underline">AX 컨설팅 안내</a>에서 확인하세요. 30분 무료 상담에서 이 결과를 함께 보며 우리 조직에 맞는 첫 업무를 정해 드립니다.</p></div>' +
      '<p class="sm muted" style="margin-top:14px">절감 시간은 업무별 자동화 예상 비율(45~75%)로 보수적으로 계산한 추정치이며 보장값이 아닙니다.</p>';
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-next]'); if (!b) return;
    var to = Number(b.getAttribute('data-next'));
    var cur = Number(b.closest('[data-step]').getAttribute('data-step'));
    if (to > cur && !check(cur)) return;
    if (to === 4) { render(compute()); try { if (window.gtag) gtag('event', 'ax_check_result'); } catch (e) {} }
    show(to);
  });
  $('#printBtn').addEventListener('click', function () { window.print(); });

  $('#leadf').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = ev.target, err = $('#leadErr'); err.textContent = '';
    var g = function (n) { return (f.elements[n] && f.elements[n].value || '').trim(); };
    if (!g('name') || !g('org')) { err.textContent = '성함과 기관·회사명을 적어 주세요.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(g('email'))) { err.textContent = '회신 받을 이메일을 확인해 주세요.'; return; }
    if (!f.elements.agree.checked) { err.textContent = '개인정보 수집·이용에 동의해 주셔야 상담 회신이 가능합니다.'; return; }
    var r = state.result || compute();
    var payload = {
      hp: g('hp'), name: g('name'), org: g('org'), email: g('email'), phone: g('phone'), role: g('role'), method: g('method'), msg: g('msg'),
      consent: f.elements.mailme.checked, orgType: r.orgType, industry: r.industry, budget: r.budget, score: r.score, level: r.level,
      hours: r.hours, low: r.low, won: r.wonMonth, wage: r.wage, top: r.top.map(function (x) { return x.t; }), pack: r.pack,
      tasks: r.tasks, answers: r.answers, src: location.href + (document.referrer ? ' | ref ' + document.referrer : '')
    };
    var btn = $('#leadBtn'); btn.disabled = true; btn.textContent = '보내는 중...';
    var done = function () {
      f.querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = true; });
      btn.textContent = '신청 완료';
      $('#leadDone').innerHTML = '<div class="done"><b>상담 신청이 접수되었습니다.</b><br>' + esc(payload.name) + '님, 송민경 대표가 결과를 보고 영업일 기준 2일 안에 ' + esc(payload.email) + '로 연락드립니다.' + (payload.consent ? ' 진단 결과 요약 메일도 곧 도착합니다. 보이지 않으면 스팸함을 확인해 주세요.' : '') + '</div>';
      try { if (window.gtag) gtag('event', 'ax_check_lead'); } catch (e) {}
    };
    var fail = function () {
      btn.disabled = false; btn.textContent = '무료 상담 신청하기';
      var body = '[무료 AX 진단 상담 신청]\n성함: ' + payload.name + '\n기관: ' + payload.org + '\n이메일: ' + payload.email + '\n전화: ' + payload.phone + '\n유형: ' + payload.orgType + ' / ' + payload.industry + '\n준비도: ' + payload.score + '점 (' + payload.level + ')\n월 절감: ' + payload.low + '~' + payload.hours + '시간\nTOP3: ' + payload.top.join(', ') + '\n추천: ' + payload.pack + '\n메모: ' + payload.msg;
      err.innerHTML = '전송이 잠시 안 되고 있습니다. <a href="mailto:mkssong22@gmail.com?subject=' + encodeURIComponent('[무료 AX 진단] 상담 신청 - ' + payload.org) + '&body=' + encodeURIComponent(body) + '">메일로 보내기</a>를 눌러 주시면 같은 내용으로 접수됩니다.';
    };
    if (!window.AX_ENDPOINT || window.AX_ENDPOINT.indexOf('http') !== 0) { fail(); return; }
    fetch(window.AX_ENDPOINT, { method: 'POST', body: JSON.stringify(payload) })
      .then(function (res) { return res.json(); })
      .then(function (j) { if (j && j.ok) done(); else fail(); })
      .catch(fail);
  });
})();
