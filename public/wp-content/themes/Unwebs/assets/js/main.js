/**
 * Main Visual Slider
 *
 * Features:
 * - Crossfade slide transitions
 * - Background zoom effect
 * - Text enter/exit animations
 * - Progress bar navigation
 * - Auto-play with manual override
 */

(function () {
  'use strict';

  // ==========================================================================
  // DOM Elements
  // ==========================================================================
  const visual = document.querySelector('.main-visual-con');
  if (!visual) return;

  const slides = visual.querySelectorAll('.main-visual-slide');
  const allNavItems = visual.querySelectorAll('.main-visual-nav-item');

  if (slides.length === 0) return;

  let currentSlide = 0;
  const slideInterval = 7000;
  let slideTimer = null;

  // ==========================================================================
  // Animation Reset
  // ==========================================================================

  /**
   * 슬라이드 내부 요소 애니메이션 초기화
   * @param {Element} slide - Slide element
   */
  function resetSlideAnimations(slide) {
    var animatedEls = slide.querySelectorAll(
      '.main-visual-header, .main-visual-meta, .main-visual-actions, .main-visual-nav, .main-visual-tablet, .main-visual-phone, .main-visual-scroll-img'
    );
    animatedEls.forEach(function (el) {
      el.style.animation = 'none';
      el.offsetHeight; // reflow
      el.style.animation = '';
    });
  }

  // ==========================================================================
  // Slide Control
  // ==========================================================================

  /**
   * Show specific slide
   * @param {number} index - Slide index
   */
  function showSlide(index) {
    if (slides[0]) slides[0].classList.remove('is-first'); // 첫 전환 후엔 기존 페이드 애니메이션 복귀 (LCP 예외 해제)
    var _bg = slides[index] && slides[index].querySelector('.main-visual-bg-img[data-bg]');
    if (_bg) { _bg.style.backgroundImage = "url('" + _bg.getAttribute('data-bg') + "')"; _bg.removeAttribute('data-bg'); } // 슬라이드 2~4 배경 지연 로드(초기 전송 절감)
    // 이전 슬라이드에 퇴장 클래스 추가
    var exitingSlide = slides[currentSlide];
    if (exitingSlide && currentSlide !== index) {
      exitingSlide.classList.add('is-exiting');
      setTimeout(function () {
        exitingSlide.classList.remove('is-exiting');
      }, 600);
    }

    // 모든 슬라이드/네비 비활성화 + fill 초기화
    slides.forEach(function (slide) {
      slide.classList.remove('is-active');
    });
    allNavItems.forEach(function (nav) {
      nav.classList.remove('is-active');
      var f = nav.querySelector('.main-visual-nav-fill');
      if (f) {
        f.style.animation = 'none';
        f.style.width = '0';
      }
    });

    // 활성 슬라이드 애니메이션 초기화 후 활성화
    resetSlideAnimations(slides[index]);
    slides[index].classList.add('is-active');

    // 모든 슬라이드의 해당 인덱스 nav-item 활성화
    allNavItems.forEach(function (nav) {
      if (parseInt(nav.getAttribute('data-slide'), 10) === index) {
        nav.classList.add('is-active');
        var fill = nav.querySelector('.main-visual-nav-fill');
        if (fill) {
          fill.offsetHeight; // reflow
          fill.style.width = '';
          fill.style.animation = 'cmVisualProgress ' + (slideInterval / 1000) + 's ease-out forwards';
        }
      }
    });

    currentSlide = index;
  }

  /**
   * Go to next slide
   */
  function nextSlide() {
    var nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  /**
   * Start auto-play
   */
  function startAutoSlide() {
    // Init first slide progress bar
    allNavItems.forEach(function (nav) {
      if (parseInt(nav.getAttribute('data-slide'), 10) === currentSlide) {
        var fill = nav.querySelector('.main-visual-nav-fill');
        if (fill) {
          fill.style.animation = 'cmVisualProgress ' + (slideInterval / 1000) + 's ease-out forwards';
        }
      }
    });

    slideTimer = setInterval(nextSlide, slideInterval);
  }

  /**
   * Stop auto-play
   */
  function stopAutoSlide() {
    clearInterval(slideTimer);
  }

  /**
   * Navigate to specific slide (manual)
   * @param {number} index - Slide index
   */
  function goToSlide(index) {
    stopAutoSlide();
    showSlide(index);
    slideTimer = setInterval(nextSlide, slideInterval);
  }

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  // Navigation click
  allNavItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var index = parseInt(this.getAttribute('data-slide'), 10);
      goToSlide(index);
    });
  });

  // ==========================================================================
  // Initialize
  // ==========================================================================
  startAutoSlide();

  // Public API
  window.cmVisual = {
    goToSlide: goToSlide,
    startAutoSlide: startAutoSlide,
    stopAutoSlide: stopAutoSlide
  };

})();

/**
 * Dashboard Vertical Ticker
 *
 * Features:
 * - Auto-scrolling card list
 * - Infinite loop (moves first item to end)
 * - Both lists scroll simultaneously
 */
(function () {
  'use strict';

  var GAP = 15;
  var SPEED = 3000;

  var projectList = document.getElementById('cmDashboardProject');
  var consultList = document.getElementById('cmDashboardConsult');

  if (!projectList && !consultList) return;

  function tickOnce(list) {
    if (!list || !list.firstElementChild) return;
    var firstItem = list.firstElementChild;
    var itemHeight = firstItem.offsetHeight;

    list.style.transition = 'transform 0.5s ease-in-out';
    list.style.transform = 'translateY(-' + (itemHeight + GAP) + 'px)';

    setTimeout(function () {
      list.style.transition = 'none';
      list.appendChild(firstItem);
      list.style.transform = 'translateY(0)';
    }, 500);
  }

  setInterval(function () {
    tickOnce(projectList);
    tickOnce(consultList);
  }, SPEED);

})();

/**
 * Maintenance 2-Column Ticker — CSS marquee로 통일됨
 * (이전 setInterval step 슬라이더는 CSS animation과 충돌해 제거)
 *
 * - PC vertical: .main-maintenance-track > .main-maintenance-list × 2 (CSS keyframe)
 * - Mobile horizontal: .main-maintenance-list 가로 marquee (CSS keyframe)
 * - JS 개입 없음
 */

/**
 * Schedule — Gantt 인터랙션
 *  - 뷰포트 진입 → .is-animated (막대 fill 애니메이션 트리거)
 *  - 그 외 hover 인터랙션 모두 제거
 */
(function () {
  'use strict';

  var schedule = document.getElementById('cmSchedule');
  if (!schedule) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        schedule.classList.add('is-animated');
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });
  io.observe(schedule);
})();

/**
 * Service Process — sticky sidebar + scroll-driven 활성화
 *  - /service/#process 본 섹션
 *  - section-schedule.php 모바일 전용 영역 (동일 마크업 재사용)
 *  - 모바일(768 이하)에서는 fade·scale 애니메이션 비활성
 */
(function () {
  'use strict';

  // 모바일에서는 스크롤 반응 애니메이션 자체를 끔
  if (window.matchMedia('(max-width: 768px)').matches) return;

  var blocks = document.querySelectorAll('.service-process-block');
  var steps  = document.querySelectorAll('.service-process-step');
  if (!blocks.length || !steps.length) return;

  var ticking = false;

  function update() {
    var viewH = window.innerHeight;
    var activeIdx = 0;

    blocks.forEach(function (block, i) {
      var rect = block.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var ratio = center / viewH;
      var fade;

      if (ratio < 0.3) {
        // 위쪽으로 빠져나가는 중 — 작아지고 연해짐
        fade = Math.max(0, 1 - (0.3 - ratio) / 0.3);
      } else if (ratio > 0.7) {
        // 아래쪽에서 진입 — 작고 연한 상태에서 점점 커지고 진해짐
        fade = Math.max(0, 1 - (ratio - 0.7) / 0.3);
      } else {
        // 활성 영역
        fade = 1;
      }

      block.style.opacity = fade;
      block.style.transform = 'scale(' + (0.92 + fade * 0.08) + ')';

      if (rect.top < viewH * 0.5 && rect.bottom > 0) {
        activeIdx = i;
      }
    });

    steps.forEach(function (step, i) {
      step.classList.toggle('is-active', i === activeIdx);
      step.classList.toggle('is-done', i < activeIdx);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/**
 * Stats Rolling Number Counter
 *
 * - IntersectionObserver triggers digit rolling animation
 */
(function () {
  'use strict';

  var statsSection = document.getElementById('cmStats');
  if (!statsSection) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        statsSection.classList.add('is-animated');
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
})();


/* ==========================================================================
   [data-animate] — 뷰포트 진입 시 .is-visible 토글
   ========================================================================== */
(function () {
  'use strict';

  var targets = document.querySelectorAll('[data-animate]');
  if (targets.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = entry.target.getAttribute('data-delay');
        if (delay) entry.target.style.animationDelay = (parseInt(delay, 10) / 1000) + 's';
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  targets.forEach(function (el) { observer.observe(el); });
})();


/**
 * Main FAQ Accordion (단일 펼침)
 * - 클릭 시 다른 항목 자동 닫힘
 * - aria-expanded + aria-hidden 동기화
 */
(function () {
  'use strict';

  var faq = document.getElementById('cmMainFaq');
  if (!faq) return;

  var triggers = faq.querySelectorAll('.main-faq-trigger');

  var items = faq.querySelectorAll('.main-faq-item');

  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var thisItem = btn.closest('.main-faq-item');

      // 모두 닫기 (단일 펼침 모드)
      items.forEach(function (it) {
        it.classList.remove('is-open');
        var b = it.querySelector('.main-faq-trigger');
        if (b) b.setAttribute('aria-expanded', 'false');
        var pid = b ? b.getAttribute('aria-controls') : null;
        var panel = pid ? document.getElementById(pid) : null;
        if (panel) panel.setAttribute('aria-hidden', 'true');
      });

      // 클릭한 항목이 닫혀있던 경우만 열기
      if (!isOpen) {
        if (thisItem) thisItem.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        if (panel) panel.setAttribute('aria-hidden', 'false');
      }
    });
  });
})();


/**
 * Main Contact — 통계 디지털 롤링(IntersectionObserver) + 약관 모달
 */
(function () {
  'use strict';

  // ── 통계 디지털 롤링 (.main-contact-con 에 .is-animated 토글) ──
  var contactSection = document.querySelector('.main-contact-con');
  if (contactSection) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        contactSection.classList.add('is-animated');
        statsObserver.disconnect();
      });
    }, { threshold: 0.25 });
    statsObserver.observe(document.getElementById('cmContactStats') || contactSection);
  }

  // ── 약관 동의: 폼 제출 버튼 위로 이동 ──
  var agree = document.querySelector('.main-contact-form-area .main-contact-agree');
  var inquiryForm = document.querySelector('.main-contact-form-area .uw-inquiry-form');
  if (agree && inquiryForm) {
    var actions = inquiryForm.querySelector('.uw-inquiry-actions');
    if (actions) {
      inquiryForm.insertBefore(agree, actions);
    } else {
      inquiryForm.appendChild(agree);
    }
  }

  // ── 약관 모달 ──
  var modal = document.getElementById('cmContactModal');
  var openBtn = document.getElementById('cmContactAgreeBtn');
  if (!modal || !openBtn) return;

  function openModal() {
    var scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarW > 0) {
      document.body.style.paddingRight = scrollbarW + 'px';
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  openBtn.addEventListener('click', openModal);
  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();


/**
 * Main Contact — 첫 프로젝트 유형 라디오 기본 체크
 */
(function () {
  'use strict';
  var formArea = document.querySelector('.main-contact-form-area');
  if (!formArea) return;
  var firstProjectRadio = formArea.querySelector('input[name="field_project_type"]');
  if (firstProjectRadio) firstProjectRadio.checked = true;
})();


/**
 * Multi-file 첨부 (uw_inquiry 다중 파일 옵션)
 *
 * - 박스 클릭 시 파일 선택 → 기존 목록에 누적
 * - max-files 초과 / max-filesize 초과 시 alert
 * - 각 항목 X 버튼으로 개별 삭제
 * - DataTransfer 로 input.files 동기화 → 폼 submit 시 그대로 전송
 */
(function () {
  'use strict';

  var wrappers = document.querySelectorAll('[data-multifile]');
  if (!wrappers.length) return;

  // 서버측 허용 MIME과 정합 — 확장자 기반 사전 거부 (UX 개선)
  var ALLOWED_EXT = [
    // 이미지
    'jpg','jpeg','png','gif','webp','bmp','svg','heic','heif','tiff','tif',
    // 문서
    'pdf','doc','docx','xls','xlsx','ppt','pptx','hwp','hwpx','txt','csv','rtf',
    // 압축
    'zip','rar','7z',
    // 디자인 원본
    'ai','psd'
  ];

  function getExt(name) {
    var idx = name.lastIndexOf('.');
    return idx >= 0 ? name.slice(idx + 1).toLowerCase() : '';
  }

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB'];
    var i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  wrappers.forEach(function (wrap) {
    var input    = wrap.querySelector('.uw-multifile-input');
    var btn      = wrap.querySelector('.uw-multifile-btn');
    var list     = wrap.querySelector('.uw-multifile-list');
    var maxFiles = parseInt(wrap.getAttribute('data-max-files'), 10) || 1;
    var maxSize  = parseInt(wrap.getAttribute('data-max-filesize'), 10) || (10 * 1024 * 1024);
    if (!input || !btn || !list) return;

    var pending = []; // 누적된 File

    function syncInput() {
      try {
        var dt = new DataTransfer();
        pending.forEach(function (f) { dt.items.add(f); });
        input.files = dt.files;
      } catch (e) {
        // DataTransfer 미지원 환경 (구형 IE 등) — 무시
      }
    }

    function render() {
      list.innerHTML = '';
      if (pending.length === 0) {
        list.hidden = true;
        btn.disabled = false;
        return;
      }
      list.hidden = false;
      pending.forEach(function (f, idx) {
        var li = document.createElement('li');
        li.className = 'uw-multifile-item';
        li.innerHTML =
          '<span class="uw-multifile-item-name"></span>' +
          '<span class="uw-multifile-item-size"></span>' +
          '<button type="button" class="uw-multifile-item-remove" aria-label="파일 삭제">&times;</button>';
        li.querySelector('.uw-multifile-item-name').textContent = f.name;
        li.querySelector('.uw-multifile-item-size').textContent = formatBytes(f.size);
        li.querySelector('.uw-multifile-item-remove').addEventListener('click', function (e) {
          e.preventDefault();
          pending.splice(idx, 1);
          syncInput();
          render();
        });
        list.appendChild(li);
      });
      btn.disabled = pending.length >= maxFiles;
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (pending.length >= maxFiles) {
        alert('첨부파일은 최대 ' + maxFiles + '개까지 가능합니다.');
        return;
      }
      input.click();
    });

    input.addEventListener('change', function () {
      var picked = Array.from(input.files || []);
      var slotsLeft = maxFiles - pending.length;
      if (slotsLeft <= 0) {
        alert('첨부파일은 최대 ' + maxFiles + '개까지 가능합니다.');
        return;
      }

      var rejectedSize = [];
      var rejectedExt  = [];
      var rejectedDup  = 0;
      var added = 0;

      for (var i = 0; i < picked.length; i++) {
        if (added >= slotsLeft) break;
        var f = picked[i];
        var ext = getExt(f.name);
        if (ALLOWED_EXT.indexOf(ext) === -1) { rejectedExt.push(f.name); continue; }
        if (f.size > maxSize) { rejectedSize.push(f.name); continue; }
        var dup = pending.some(function (p) { return p.name === f.name && p.size === f.size; });
        if (dup) { rejectedDup++; continue; }
        pending.push(f);
        added++;
      }

      if (rejectedExt.length) {
        alert('지원하지 않는 파일 형식입니다.\n허용: 이미지(jpg/png/gif/webp/bmp/svg/heic/tiff), PDF, Word(doc/docx), Excel(xls/xlsx), PowerPoint(ppt/pptx), 한글(hwp/hwpx), 텍스트(txt/csv/rtf), 압축(zip/rar/7z), 디자인 원본(ai/psd)\n\n거부: ' + rejectedExt.join(', '));
      }
      if (rejectedSize.length) {
        alert('파일당 최대 ' + Math.round(maxSize / 1024 / 1024) + 'MB까지 업로드 가능합니다.\n\n거부: ' + rejectedSize.join(', '));
      }
      if (picked.length > slotsLeft && added > 0) {
        alert('첨부파일은 최대 ' + maxFiles + '개까지 가능합니다.');
      }

      syncInput();
      render();
    });

    // 폼 reset 시 누적 초기화
    var form = wrap.closest('form');
    if (form) {
      form.addEventListener('reset', function () {
        pending = [];
        syncInput();
        render();
      });
    }

    render();
  });
})();


/* ==========================================================================
   sub-faq — 카테고리 탭 필터 + 아코디언 (page-faq.php)
   아코디언: 메인 main-faq 와 동일 패턴 (단일 펼침 + grid 0fr→1fr)
   ========================================================================== */
(function () {
  'use strict';

  function closeAll(items) {
    items.forEach(function (it) {
      it.classList.remove('is-open');
      var b = it.querySelector('.sub-faq-trigger');
      if (b) {
        b.setAttribute('aria-expanded', 'false');
        var pid = b.getAttribute('aria-controls');
        var panel = pid ? document.getElementById(pid) : null;
        if (panel) panel.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function init() {
    var con = document.querySelector('.sub-faq-con');
    if (!con) return;

    // 탭 필터
    var tabs = con.querySelectorAll('.sub-faq-tab');
    var items = con.querySelectorAll('.sub-faq-item');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-target') || 'all';

        tabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        if (target === 'all') {
          con.removeAttribute('data-filter');
        } else {
          con.setAttribute('data-filter', target);
        }

        // 필터 전환 시 열려있던 아코디언 닫기 (잔상 방지)
        closeAll(items);
      });
    });

    // 아코디언 토글 (단일 펼침)
    var triggers = con.querySelectorAll('.sub-faq-trigger');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        var thisItem = btn.closest('.sub-faq-item');

        closeAll(items);

        if (!isOpen && thisItem) {
          thisItem.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          var panel = document.getElementById(btn.getAttribute('aria-controls'));
          if (panel) panel.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();




/* ==========================================================================
   blog single — 읽기 진행 바 + TOC 활성 항목
   ========================================================================== */
(function () {
  'use strict';

  function init() {
    var body = document.querySelector('.blog-single-body');
    var bar  = document.querySelector('.blog-reading-progress-bar');
    var tocLinks = document.querySelectorAll('.blog-single-toc-list a[data-toc-link]');
    if (!body) return;

    // 진행 바
    function updateProgress() {
      if (!bar) return;
      var rect = body.getBoundingClientRect();
      var viewH = window.innerHeight;
      var startY = rect.top + window.scrollY - viewH * 0.2;
      var endY   = rect.top + window.scrollY + rect.height - viewH * 0.5;
      var current = window.scrollY;
      var ratio = 0;
      if (endY > startY) {
        ratio = (current - startY) / (endY - startY);
      }
      ratio = Math.max(0, Math.min(1, ratio));
      bar.style.width = (ratio * 100) + '%';
    }

    // TOC scrollspy
    var headings = [];
    if (tocLinks.length) {
      tocLinks.forEach(function (l) {
        var id = l.getAttribute('data-toc-link');
        var el = id ? document.getElementById(id) : null;
        if (el) headings.push({ link: l, el: el });
      });
    }

    function updateTocActive() {
      if (!headings.length) return;
      var offset = 120;
      var activeIdx = 0;
      for (var i = 0; i < headings.length; i++) {
        var top = headings[i].el.getBoundingClientRect().top;
        if (top - offset <= 0) {
          activeIdx = i;
        } else {
          break;
        }
      }
      headings.forEach(function (h, i) {
        h.link.classList.toggle('is-active', i === activeIdx);
      });
    }

    // fixed 레일(우측 TOC·가이드 좌측 트리) — 푸터 진입 시 숨김 (겹침 방지)
    var footerEl = document.querySelector('footer.cm-footer');
    if (footerEl && 'IntersectionObserver' in window) {
      var railObserver = new IntersectionObserver(function (entries) {
        document.body.classList.toggle('rails-hidden', entries[0].isIntersecting);
      });
      railObserver.observe(footerEl);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateProgress();
        updateTocActive();
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateProgress();
    updateTocActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/**
 * Portfolio Popup — 카드(.js-port-card) 클릭 시 풀 리디자인 팝업 오픈
 * 데이터는 카드의 data-port-* 속성에서 읽어 채운다.
 * 데이터가 없으면 가로채지 않고 single 페이지(/portfolio/{slug}/)로 폴백 — SEO/직접접근 유지.
 * 모달 안 닫고 ‹ › / 방향키로 카드 순환 전환.
 */
(function () {
  'use strict';

  var modal = document.getElementById('cmPortModal');
  if (!modal) return;

  var cards = Array.prototype.slice.call(document.querySelectorAll('.js-port-card'));
  if (!cards.length) return;

  var elVisit   = modal.querySelector('.port-modal-bar-visit');
  var elHero    = modal.querySelector('.port-modal-hero');
  var elHeroTit = modal.querySelector('.port-modal-hero-tit');
  var elHeroSub = modal.querySelector('.port-modal-hero-sub');
  var elPcImg   = modal.querySelector('.port-modal-hero-pc-img');
  var elMobWrap = modal.querySelector('.port-modal-hero-mob');
  var elMobImg  = modal.querySelector('.port-modal-hero-mob-img');
  var elOvText  = modal.querySelector('.port-modal-overview-text');
  var elScope   = modal.querySelector('.port-modal-spec-scope');
  var elCat     = modal.querySelector('.port-modal-spec-cat');
  var elOvVisit = modal.querySelector('.port-modal-overview-visit');
  var elGallery = modal.querySelector('.port-modal-gallery');
  var elGalImgs = modal.querySelector('.port-modal-gallery-imgs');
  var elGalTit  = modal.querySelector('.port-modal-gallery-tit');
  var elBody    = modal.querySelector('.port-modal-body');
  var elHeroFull    = modal.querySelector('.port-modal-hero-full');
  var elHeroFullImg = modal.querySelector('.port-modal-hero-full-img');
  var elOverview    = modal.querySelector('.port-modal-overview');
  var panel     = modal.querySelector('.port-modal-panel');
  // legacy 모달 요소 (메인8 외)
  var elLTit    = modal.querySelector('.port-modal-tit');
  var elLUrl    = modal.querySelector('.port-modal-url');
  var elLUrlLink= modal.querySelector('.port-modal-url-link');
  var elLInd    = modal.querySelector('.port-modal-meta-industry');
  var elLWork   = modal.querySelector('.port-modal-meta-work');
  var elLType   = modal.querySelector('.port-modal-meta-type');
  var elLVisit  = modal.querySelector('.port-modal-visit');
  var elLCap    = modal.querySelector('.port-modal-capture');

  var OV_PLACEHOLDER = '프로젝트 설명이 들어갈 영역입니다. (카피 작성 예정)';
  var current = -1;

  function setMeta(wrap, value) {
    if (!wrap) return;
    var dd = wrap.querySelector('dd');
    if (value) { if (dd) dd.textContent = value; wrap.hidden = false; }
    else { wrap.hidden = true; }
  }

  function setSpecChips(wrap, items) {
    if (!wrap) return;
    var dd = wrap.querySelector('dd');
    items = (items || []).map(function (s) { return (s || '').trim(); }).filter(Boolean);
    if (items.length && dd) {
      dd.innerHTML = '';
      items.forEach(function (t) {
        var span = document.createElement('span');
        span.className = 'cm-tag';
        span.textContent = t;
        dd.appendChild(span);
      });
      wrap.hidden = false;
    } else {
      wrap.hidden = true;
    }
  }

  function fill(card) {
    var d = card.dataset;
    var title = d.portTitle || '';
    var imageMode = !!d.portHero;           // 메인 8개만 modal_hero 보유
    panel.classList.toggle('is-new', imageMode);
    panel.classList.toggle('is-legacy', !imageMode);
    if (imageMode) fillNew(d, title);
    else fillLegacy(d, title);
    if (elBody) elBody.scrollTop = 0;
  }

  // 메인 8개 — 0이미지 히어로 + Overview + 통짜 디자인(1·2)
  function fillNew(d, title) {
    elHeroTit.textContent = title;
    var designs = (d.portDesigns || '').split(',').map(function (u) { return u.trim(); }).filter(Boolean);
    elHeroFullImg.src = d.portHero;
    elHeroFullImg.alt = title + ' 소개';
    elHeroFull.hidden = false;
    elHero.classList.add('is-image-mode');
    if (elOverview) elOverview.hidden = !d.portDesc;

    if (d.portHerobg) {
      elHero.style.backgroundImage = 'url("' + d.portHerobg + '")';
      elHero.classList.add('has-bg');
    } else {
      elHero.style.backgroundImage = '';
      elHero.classList.remove('has-bg');
    }

    if (d.portUrl) {
      elVisit.href = d.portUrl; elVisit.hidden = false;
      elOvVisit.href = d.portUrl; elOvVisit.hidden = false;
    } else {
      elVisit.removeAttribute('href'); elVisit.hidden = true;
      elOvVisit.removeAttribute('href'); elOvVisit.hidden = true;
    }

    if (d.portDesc) {
      elOvText.textContent = d.portDesc;
      elOvText.classList.remove('is-placeholder');
    } else {
      elOvText.textContent = OV_PLACEHOLDER;
      elOvText.classList.add('is-placeholder');
    }

    setSpecChips(elScope, (d.portScope || '').split(/\s*·\s*/));
    setSpecChips(elCat, (d.portTags || '').split(','));

    elGalImgs.innerHTML = '';
    if (designs.length) {
      designs.forEach(function (src, i) {
        var img = document.createElement('img');
        img.src = src;
        img.alt = title + ' 디자인 ' + (i + 1);
        img.loading = 'lazy';
        elGalImgs.appendChild(img);
      });
      elGallery.hidden = false;
      if (elGalTit) elGalTit.hidden = true;
    } else {
      elGallery.hidden = true;
    }
  }

  // 메인 8개 외 — 운영 legacy 모달(제목 / URL / 업종·작업유형·화면 / 버튼 / 풀이미지)
  function fillLegacy(d, title) {
    elLTit.textContent = title;
    if (d.portUrl) {
      elLUrlLink.textContent = d.portUrl;
      elLUrlLink.href = d.portUrl;
      elLUrl.hidden = false;
    } else {
      elLUrl.hidden = true;
    }
    setMeta(elLInd, d.portIndustry);
    setMeta(elLWork, d.portWork);
    setMeta(elLType, d.portType);
    if (d.portUrl) { elLVisit.href = d.portUrl; elLVisit.hidden = false; }
    else { elLVisit.hidden = true; }

    var imgs = (d.portImage || '').split(',').map(function (u) { return u.trim(); }).filter(Boolean);
    elLCap.innerHTML = '';
    if (imgs.length) {
      imgs.forEach(function (src, i) {
        var img = document.createElement('img');
        img.className = 'port-modal-capture-img';
        img.src = src;
        img.alt = title + ' 상세 화면' + (imgs.length > 1 ? ' ' + (i + 1) : '');
        img.loading = 'lazy';
        elLCap.appendChild(img);
      });
      elLCap.hidden = false;
    } else {
      elLCap.hidden = true;
    }
  }

  function hasContent(card) {
    var d = card.dataset;
    return !!(d.portImage || d.portUrl || d.portType || d.portTags || d.portScope);
  }

  function openAt(index) {
    if (index < 0 || index >= cards.length) return;
    current = index;
    fill(cards[index]);
    var scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarW > 0) document.body.style.paddingRight = scrollbarW + 'px';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  function step(dir) {
    if (current < 0) return;
    openAt((current + dir + cards.length) % cards.length);
  }

  cards.forEach(function (card, i) {
    // 카드 클릭 → href(/portfolio/{slug}/) 상세페이지로 이동. 모달 가로채기 제거(상세페이지 대체).

    // 모바일 목업은 호버 시에만 로드 (초기 로드에서 제외 → 요청수·용량 절감)
    var mob = card.querySelector('.main-portfolio-mob-img[data-src]');
    if (mob) {
      var loadMob = function () {
        mob.src = mob.getAttribute('data-src');
        mob.removeAttribute('data-src');
        card.removeEventListener('mouseenter', loadMob);
      };
      card.addEventListener('mouseenter', loadMob);
    }
  });

  modal.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  modal.querySelectorAll('[data-modal-prev]').forEach(function (el) {
    el.addEventListener('click', function () { step(-1); });
  });
  modal.querySelectorAll('[data-modal-next]').forEach(function (el) {
    el.addEventListener('click', function () { step(1); });
  });
  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // URL 해시로 특정 포트폴리오 모달 딥링크 (#port-{slug})
  function openByHash() {
    var m = (location.hash || '').match(/^#port-(.+)$/);
    if (!m) return;
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].getAttribute('data-port-slug') === m[1]) { openAt(i); break; }
    }
  }
  window.addEventListener('hashchange', openByHash);
  openByHash();
})();
