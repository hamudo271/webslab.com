(function () {
  'use strict';

  var dock = document.getElementById('uwQi');
  var tab = document.getElementById('uwQiTab');
  var close = document.getElementById('uwQiClose');
  var modal = document.getElementById('uwQiModal');
  var modalOpen = document.getElementById('uwQiView');
  var modalClose = document.getElementById('uwQiModalClose');
  var userActed = false;

  function openDock() {
    if (!dock) return;
    dock.classList.add('is-open');
    dock.setAttribute('aria-hidden', 'false');
    if (tab) tab.setAttribute('aria-expanded', 'true');
  }
  function closeDock() {
    if (!dock) return;
    dock.classList.remove('is-open');
    dock.setAttribute('aria-hidden', 'true');
    if (tab) tab.setAttribute('aria-expanded', 'false');
  }
  function openModal() {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (tab) tab.addEventListener('click', function () { userActed = true; dock.classList.contains('is-open') ? closeDock() : openDock(); });
  if (close) close.addEventListener('click', function () { userActed = true; closeDock(); });
  if (modalOpen) modalOpen.addEventListener('click', openModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (modal && modal.classList.contains('is-open')) closeModal();
    else closeDock();
  });

  try {
    if (dock && window.matchMedia('(min-width: 769px)').matches && sessionStorage.getItem('ws_qi_autoopened') !== '1') {
      setTimeout(function () {
        sessionStorage.setItem('ws_qi_autoopened', '1');
        if (!userActed) openDock();
      }, 5000);
    }
  } catch (_) {}

  document.querySelectorAll('form[data-preview-only="true"]').forEach(function (form) {
    form.addEventListener('focusin', function () { userActed = true; }, { once: true });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var button = form.querySelector('[type="submit"]');
      if (button) { button.disabled = true; button.textContent = '공식 문의 페이지로 이동합니다'; }
      window.setTimeout(function () { window.location.href = '/contact/?from=home#inquiry'; }, 180);
    }, true);
  });
}());
