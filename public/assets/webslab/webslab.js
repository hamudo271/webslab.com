(function(){
  'use strict';
  document.documentElement.style.setProperty('--ws-ready','1');
  document.querySelectorAll('a[href^="https://webslab.co.kr"]').forEach(function(link){
    if(link.classList.contains('main-visual-btn') || link.closest('.main-portfolio-card')) link.setAttribute('rel','noopener');
  });
})();
