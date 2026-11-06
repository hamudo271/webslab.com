/* websLAB 운영 문의 연결 — 리뉴얼 사이트의 폼 4종을 /api/contact(Resend 메일)로 보낸다.
     견적 문의   .uw-inquiry-form   (메인 하단 · /contact)  — 첨부파일 포함
     간편 상담   #uwQiForm          (메인 우측 도크)
     유지보수    #mxForm            (/maintenance 3단계 신청서 — 마지막 단계에서만)
     채용 지원   #crForm            (/careers 지원서)  — 첨부파일 포함, 리드 집계(contact_form_submit)에서 뺀다
   <head>에서 동기 로드한다. window 캡처 단계 submit 리스너를 테마·시안 스크립트보다 먼저 등록해
   시안 동작(공식 문의 페이지로 이동, mailto, WordPress admin-ajax 전송)이 실행되지 않게 막는다.
   (원본 시안 파일은 그대로 두고 src/lib/site-html.ts + 이 파일로만 운영 동작을 얹는다) */
(function () {
  'use strict';

  var ENDPOINT = '/api/contact';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var FALLBACK = '잠시 후 다시 시도하거나 contact@webslab.co.kr 로 보내 주세요.';

  function kindOf(form) {
    if (!(form instanceof HTMLFormElement)) return null;
    if (form.classList.contains('uw-inquiry-form')) return 'project';
    if (form.id === 'uwQiForm') return 'quick';
    if (form.id === 'mxForm') return 'maintenance';
    if (form.id === 'crForm') return 'career';
    return null;
  }

  window.addEventListener(
    'submit',
    function (e) {
      var kind = kindOf(e.target);
      if (!kind) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      var form = e.target;
      if (form.getAttribute('aria-busy') === 'true') return;
      if (kind === 'project') submitProject(form);
      else if (kind === 'quick') submitQuick(form);
      else if (kind === 'career') submitCareer(form);
      else submitMaintenance(form);
    },
    true
  );

  // 동의 체크 시 오류 표시 해제
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (!t || t.name !== 'privacy_agree' || !t.checked) return;
    var box = t.closest('.ws-consent');
    if (!box) return;
    box.classList.remove('has-error');
    var err = box.querySelector('.ws-consent__error');
    if (err) {
      if (err.tagName === 'P') err.hidden = true;
      else err.textContent = '';
    }
  });

  /* ---------- 공통 ---------- */

  function value(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }

  function post(fd) {
    return fetch(ENDPOINT, { method: 'POST', body: fd, credentials: 'same-origin' }).then(function (r) {
      return r
        .json()
        .catch(function () {
          return {};
        })
        .then(function (data) {
          return { ok: r.ok && data && data.ok === true, data: data || {} };
        });
    });
  }

  function track(kind, label) {
    try {
      var params = { category: kind, form_label: label || '' };
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'contact_form_submit', category: kind });
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'contact_form_submit', params);
        window.gtag('event', 'generate_lead', { form_location: kind });
      }
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_category: kind });
    } catch (err) {
      /* 분석 도구 오류는 접수와 무관 */
    }
  }

  function busy(form, btn, on) {
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    if (!btn) return;
    btn.disabled = on;
    btn.classList.toggle('is-loading', on);
    form.classList.toggle('is-loading', on);
  }

  function scrollToField(el) {
    var target = el.closest('.uw-inquiry-field, .ws-consent, .mx-field') || el;
    var header = document.querySelector('.cm-header');
    var top = target.getBoundingClientRect().top + window.scrollY - (header ? header.getBoundingClientRect().height : 72) - 24;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    var focusEl = el.type === 'file' ? target.querySelector('.uw-multifile-btn') : el;
    if (focusEl) focusEl.focus({ preventScroll: true });
  }

  function consentOk(form) {
    // 견적 폼의 동의 칸은 테마(main.js)가 폼 안으로 옮긴다. 옮겨지기 전이어도 찾도록 문서 전체를 본다.
    var agree =
      form.querySelector('input[name="privacy_agree"]') ||
      (form.classList.contains('uw-inquiry-form') && document.querySelector('.main-contact-agree input[name="privacy_agree"]'));
    if (!agree) return { ok: true };
    var box = agree.closest('.ws-consent');
    var err = box && box.querySelector('.ws-consent__error');
    var ok = agree.checked;
    if (box) box.classList.toggle('has-error', !ok);
    if (err) {
      if (err.tagName === 'P') err.hidden = ok;
      else err.textContent = ok ? '' : '개인정보 수집·이용에 동의해 주세요.';
    }
    return { ok: ok, el: agree };
  }

  /* ---------- 견적 문의 ---------- */

  var PROJECT_REQUIRED = [
    ['field_company', '회사명을 입력해 주세요.'],
    ['field_name', '담당자 성함을 입력해 주세요.'],
    ['field_phone', '연락처를 입력해 주세요.'],
    ['field_email', '이메일을 입력해 주세요.'],
    ['field_message', '문의 내용을 입력해 주세요.'],
  ];

  function setFieldError(el, msg) {
    var group = el.closest('.uw-inquiry-field');
    if (!group) return;
    group.classList.toggle('has-error', !!msg);
    var out = group.querySelector('.uw-inquiry-field-error');
    if (out) out.textContent = msg || '';
  }

  function projectMessage(form, type, text) {
    var box = form.querySelector('.uw-inquiry-message');
    if (!box) {
      if (type === 'err') window.alert(text);
      return;
    }
    box.textContent = text;
    box.className = 'uw-inquiry-message' + (type ? ' ws-msg ws-msg--' + type : '');
    if (text) box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function resetProject(form) {
    form.reset();
    var btn;
    // 첨부 위젯(main.js)은 자체 목록을 들고 있어 삭제 버튼으로 비운다
    while ((btn = form.querySelector('.uw-multifile-item-remove'))) btn.click();
    while ((btn = form.querySelector('.uw-urlrepeat-remove'))) btn.click();
  }

  function submitProject(form) {
    var first = null;
    PROJECT_REQUIRED.forEach(function (rule) {
      var el = form.querySelector('[name="' + rule[0] + '"]');
      if (!el) return;
      var v = el.value.trim();
      var msg = '';
      if (!v) msg = rule[1];
      else if (rule[0] === 'field_email' && !EMAIL_RE.test(v)) msg = '이메일 형식이 올바르지 않아요. (예: name@company.com)';
      else if (rule[0] === 'field_phone' && v.replace(/\D/g, '').length < 9) msg = '연락처를 확인해 주세요.';
      setFieldError(el, msg);
      if (msg && !first) first = el;
    });
    var consent = consentOk(form);
    if (!consent.ok && !first) first = consent.el;
    if (first) {
      scrollToField(first);
      return;
    }

    var type = form.querySelector('input[name="field_project_type"]:checked');
    var fd = new FormData();
    fd.append('kind', 'project');
    fd.append('projectType', type ? type.value : '아직 모르겠어요');
    [
      ['company', 'field_company'],
      ['name', 'field_name'],
      ['phone', 'field_phone'],
      ['email', 'field_email'],
      ['currentSite', 'field_current_site'],
      ['budget', 'field_budget'],
      ['deadline', 'field_deadline'],
      ['message', 'field_message'],
    ].forEach(function (p) {
      fd.append(p[0], value(form, p[1]));
    });
    Array.prototype.forEach.call(form.querySelectorAll('input[name="field_ref_urls[]"]'), function (el) {
      if (el.value.trim()) fd.append('refUrls', el.value.trim());
    });
    var file = form.querySelector('input[type="file"]');
    if (file && file.files) {
      Array.prototype.forEach.call(file.files, function (f) {
        fd.append('attachments', f, f.name);
      });
    }
    fd.append('privacyConsent', 'true');
    fd.append('website', value(form, 'uw_hp_website'));
    fd.append('page', location.pathname);

    var btn = form.querySelector('[type="submit"]');
    busy(form, btn, true);
    projectMessage(form, '', '');
    post(fd)
      .then(function (res) {
        if (res.ok) {
          resetProject(form);
          projectMessage(form, 'ok', '접수되었습니다. 담당자가 1영업일 안에 회신드리겠습니다.');
          track('project', type ? type.value : '');
        } else {
          projectMessage(form, 'err', (res.data.error || '접수하지 못했어요.') + ' ' + FALLBACK);
        }
      })
      .catch(function () {
        projectMessage(form, 'err', '네트워크 오류로 접수하지 못했어요. ' + FALLBACK);
      })
      .then(function () {
        busy(form, btn, false);
      });
  }

  /* 참고 사이트 URL — '+ URL 추가' / 삭제. 시안의 uw-inquiry.js(jQuery)가 하던 일인데, 그 파일과 jQuery를
     운영 변환(site-html.ts)에서 빼면서 여기로 옮겼다. 값은 field_ref_urls[]로 함께 전송된다. */
  document.addEventListener('click', function (e) {
    var add = e.target.closest && e.target.closest('.uw-urlrepeat-add');
    var rm = e.target.closest && e.target.closest('.uw-urlrepeat-remove');
    if (add) {
      var wrap = add.closest('[data-urlrepeat]');
      var list = wrap && wrap.querySelector('.uw-urlrepeat-list');
      var first = list && list.querySelector('.uw-urlrepeat-input');
      if (!list) return;
      var row = document.createElement('div');
      row.className = 'uw-urlrepeat-row';
      var input = document.createElement('input');
      input.className = 'uw-inquiry-field-input uw-urlrepeat-input';
      input.type = 'url';
      input.name = (first && first.name) || 'field_ref_urls[]';
      input.placeholder = (first && first.placeholder) || 'https://example.com';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'uw-urlrepeat-remove';
      btn.setAttribute('aria-label', 'URL 삭제');
      btn.innerHTML = '&times;';
      row.appendChild(input);
      row.appendChild(btn);
      list.appendChild(row);
      input.focus();
    } else if (rm) {
      var r = rm.closest('.uw-urlrepeat-row');
      if (r) r.remove();
    }
  });

  /* ---------- 간편 상담 (메인 도크) ---------- */

  function submitQuick(form) {
    var msg = document.getElementById('uwQiMsg');
    var say = function (type, text) {
      if (!msg) return;
      msg.textContent = text;
      msg.className = 'uw-qi__msg' + (type ? ' is-' + type : '');
    };
    var nameEl = form.querySelector('[name="field_name"]');
    var phoneEl = form.querySelector('[name="field_phone"]');
    var name = value(form, 'field_name');
    var phone = value(form, 'field_phone');
    if (!name) {
      say('err', '이름을 입력해 주세요.');
      if (nameEl) nameEl.focus();
      return;
    }
    if (phone.replace(/\D/g, '').length < 9) {
      say('err', '연락처를 확인해 주세요.');
      if (phoneEl) phoneEl.focus();
      return;
    }
    var agree = form.querySelector('input[name="privacy_agree"]');
    if (agree && !agree.checked) {
      say('err', '개인정보 수집·이용에 동의해 주세요.');
      return;
    }

    var inquiryType = value(form, 'field_inquiry_type');
    var fd = new FormData();
    fd.append('kind', 'quick');
    fd.append('name', name);
    fd.append('phone', phone);
    fd.append('inquiryType', inquiryType);
    fd.append('privacyConsent', 'true');
    fd.append('website', value(form, 'uw_hp'));
    fd.append('page', location.pathname);

    var btn = form.querySelector('[type="submit"]');
    var label = btn ? btn.innerHTML : '';
    busy(form, btn, true);
    if (btn) btn.textContent = '접수 중…';
    say('', '');
    post(fd)
      .then(function (res) {
        if (res.ok) {
          form.reset();
          say('ok', '접수되었습니다. 빠르게 연락드리겠습니다.');
          track('quick', inquiryType);
          window.setTimeout(function () {
            var close = document.getElementById('uwQiClose');
            if (close) close.click();
          }, 1900);
        } else {
          say('err', res.data.error || '접수하지 못했어요. 잠시 후 다시 시도해 주세요.');
        }
      })
      .catch(function () {
        say('err', '네트워크 오류예요. 잠시 후 다시 시도해 주세요.');
      })
      .then(function () {
        busy(form, btn, false);
        if (btn) btn.innerHTML = label;
      });
  }

  /* ---------- 채용 지원 ---------- */

  function fieldOk(form, name, ok) {
    var el = form.elements[name];
    if (!el) return true;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    var err = document.getElementById(el.getAttribute('aria-describedby') || '');
    if (err) err.hidden = ok;
    return ok;
  }

  function submitCareer(form) {
    var bad = null;
    var position = form.querySelector('input[name="position"]:checked');
    var choices = form.querySelector('.cr-choices');
    var posErr = document.getElementById('crPosErr');
    if (choices) choices.classList.toggle('is-invalid', !position);
    if (posErr) posErr.hidden = !!position;
    if (!position) bad = form.querySelector('input[name="position"]');

    var name = value(form, 'name');
    var phone = value(form, 'phone');
    var email = value(form, 'email');
    if (!fieldOk(form, 'name', name !== '') && !bad) bad = form.elements.name;
    if (!fieldOk(form, 'phone', phone.replace(/\D/g, '').length >= 9) && !bad) bad = form.elements.phone;
    if (!fieldOk(form, 'email', EMAIL_RE.test(email)) && !bad) bad = form.elements.email;
    var consent = consentOk(form);
    if (!consent.ok && !bad) bad = consent.el;
    if (bad) {
      scrollToField(bad);
      return;
    }

    var fd = new FormData();
    fd.append('kind', 'career');
    fd.append('position', position.value);
    fd.append('name', name);
    fd.append('phone', phone);
    fd.append('email', email);
    fd.append('portfolioUrl', value(form, 'portfolioUrl'));
    fd.append('message', value(form, 'message'));
    var file = form.querySelector('input[type="file"]');
    if (file && file.files) {
      Array.prototype.forEach.call(file.files, function (f) {
        fd.append('attachments', f, f.name);
      });
    }
    fd.append('privacyConsent', 'true');
    fd.append('website', value(form, 'cr_hp'));
    fd.append('page', location.pathname);

    var submit = form.querySelector('[data-submit]');
    var hint = form.querySelector('[data-hint]');
    var hintText = hint ? hint.textContent : '';
    var labelNode = submit && submit.firstChild && submit.firstChild.nodeType === 3 ? submit.firstChild : null;
    var label = labelNode ? labelNode.nodeValue : '';
    busy(form, submit, true);
    if (labelNode) labelNode.nodeValue = '보내는 중…';
    if (hint) {
      hint.textContent = hintText;
      hint.classList.remove('ws-msg--err');
    }
    post(fd)
      .then(function (res) {
        if (res.ok) {
          var done = form.querySelector('[data-done]');
          if (done) {
            done.hidden = false;
            done.setAttribute('tabindex', '-1');
            done.focus({ preventScroll: true });
            done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
          trackCareer(position.value);
        } else if (hint) {
          hint.textContent = (res.data.error || '지원서를 보내지 못했어요.') + ' ' + FALLBACK;
          hint.classList.add('ws-msg--err');
        }
      })
      .catch(function () {
        if (!hint) return;
        hint.textContent = '네트워크 오류로 보내지 못했어요. ' + FALLBACK;
        hint.classList.add('ws-msg--err');
      })
      .then(function () {
        busy(form, submit, false);
        if (labelNode) labelNode.nodeValue = label;
      });
  }

  // 채용 지원은 영업 리드가 아니다 — contact_form_submit·generate_lead·Lead를 보내지 않는다(관리자 문의 통계 기준 유지)
  function trackCareer(position) {
    try {
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'career_apply_submit', position: position });
      if (typeof window.gtag === 'function') window.gtag('event', 'career_apply_submit', { position: position });
    } catch (err) {
      /* 분석 도구 오류는 접수와 무관 */
    }
  }

  document.addEventListener('click', function (e) {
    var again = e.target && e.target.closest && e.target.closest('#crForm [data-again]');
    if (!again) return;
    var form = again.closest('form');
    form.reset();
    var done = form.querySelector('[data-done]');
    if (done) done.hidden = true;
    var first = form.querySelector('input[name="position"]');
    if (first) first.focus();
  });

  /* ---------- 유지보수 신청 ---------- */

  function submitMaintenance(form) {
    var submit = form.querySelector('[data-submit]');
    // 마지막 단계(회신받을 곳)에서만 제출 — 앞 단계 Enter는 시안 스크립트가 '다음'으로 처리
    if (!submit || submit.hidden) return;

    var bad = null;
    ['name', 'reach'].forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      var ok = el.value.trim() !== '';
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      var err = document.getElementById(el.getAttribute('aria-describedby') || '');
      if (err) err.hidden = ok;
      if (!ok && !bad) bad = el;
    });
    var consent = consentOk(form);
    if (!consent.ok && !bad) bad = consent.el;
    if (bad) {
      bad.focus();
      return;
    }

    var mode = form.querySelector('input[name="mode"]:checked');
    var fd = new FormData();
    fd.append('kind', 'maintenance');
    fd.append('url', value(form, 'url'));
    fd.append('mode', mode ? mode.value : '');
    Array.prototype.forEach.call(form.querySelectorAll('input[name="work"]:checked'), function (c) {
      fd.append('work', c.value);
    });
    fd.append('message', value(form, 'message'));
    fd.append('name', value(form, 'name'));
    fd.append('reach', value(form, 'reach'));
    fd.append('privacyConsent', 'true');
    fd.append('page', location.pathname + location.search);

    var hint = form.querySelector('.mx-form__hint');
    var hintText = hint ? hint.textContent : '';
    var labelNode = submit.firstChild && submit.firstChild.nodeType === 3 ? submit.firstChild : null;
    var label = labelNode ? labelNode.nodeValue : '';
    busy(form, submit, true);
    if (labelNode) labelNode.nodeValue = '보내는 중…';
    post(fd)
      .then(function (res) {
        if (res.ok) {
          var done = form.querySelector('.mx-done');
          if (done) {
            done.hidden = false;
            done.setAttribute('tabindex', '-1');
            done.focus({ preventScroll: true });
            done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
          if (hint) {
            hint.textContent = hintText;
            hint.classList.remove('ws-msg--err');
          }
          track('maintenance', mode ? mode.value : '');
        } else if (hint) {
          hint.textContent = (res.data.error || '신청을 보내지 못했어요.') + ' ' + FALLBACK;
          hint.classList.add('ws-msg--err');
        }
      })
      .catch(function () {
        if (!hint) return;
        hint.textContent = '네트워크 오류로 보내지 못했어요. ' + FALLBACK;
        hint.classList.add('ws-msg--err');
      })
      .then(function () {
        busy(form, submit, false);
        if (labelNode) labelNode.nodeValue = label;
      });
  }
})();
