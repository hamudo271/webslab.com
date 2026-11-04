/**
 * UW Board Frontend JavaScript
 * 
 * @package starter-theme
 */

(function ($) {
  'use strict';

  // ==========================================================================
  // 초기화
  // ==========================================================================
  $(document).ready(function () {
    initSearchFilter();
    initSummernote();
    initWriteForm();
    initPasswordVerify();
    initLightbox();
  });

  // ==========================================================================
  // 검색 필터 드롭다운
  // ==========================================================================
  function initSearchFilter() {
    var $filter = $('.uw-search-filter');
    var $trigger = $('.uw-filter-trigger');
    var $dropdown = $('.uw-filter-dropdown');
    var $hiddenInput = $filter.find('input[name="search_type"]');
    var $filterText = $('.uw-filter-text');

    // 트리거 클릭 시 드롭다운 토글
    $trigger.on('click', function (e) {
      e.stopPropagation();
      $filter.toggleClass('is-open');
    });

    // 옵션 선택 시
    $dropdown.find('button').on('click', function () {
      var $btn = $(this);
      var value = $btn.data('value');
      var text = $btn.text();

      // UI 업데이트
      $filterText.text(text);
      $dropdown.find('button').removeClass('active');
      $btn.addClass('active');
      $hiddenInput.val(value);

      // 드롭다운 닫기
      $filter.removeClass('is-open');
    });

    // 외부 클릭 시 드롭다운 닫기
    $(document).on('click', function () {
      $filter.removeClass('is-open');
    });

    // 드롭다운 내부 클릭 시 이벤트 전파 방지
    $dropdown.on('click', function (e) {
      e.stopPropagation();
    });
  }

  // ==========================================================================
  // Summernote 에디터
  // ==========================================================================
  function initSummernote() {
    if ($('#uw-editor').length && typeof $.fn.summernote !== 'undefined') {
      $('#uw-editor').summernote({
        height: 350,
        lang: 'ko-KR',
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture']],
          ['view', ['fullscreen', 'codeview']]
        ],
        callbacks: {
          onImageUpload: function (files) {
            uploadImage(files[0], this);
          }
        }
      });
    }
  }

  // 이미지 업로드 (AJAX)
  function uploadImage(file, editor) {
    var formData = new FormData();
    formData.append('file', file);
    formData.append('action', 'uw_board_front_upload_image');
    formData.append('nonce', uwBoard.nonce);

    $.ajax({
      url: uwBoard.ajaxUrl,
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.success) {
          $(editor).summernote('insertImage', response.data.url);
        } else {
          alert('이미지 업로드 실패');
        }
      },
      error: function () {
        alert('이미지 업로드 중 오류가 발생했습니다.');
      }
    });
  }

  // ==========================================================================
  // 글쓰기 폼
  // ==========================================================================
  function initWriteForm() {
    $('#uw-write-form').on('submit', function (e) {
      e.preventDefault();

      var $form = $(this);
      var $btn = $form.find('[type="submit"]');

      // 제목 검증
      var title = $form.find('[name="title"]').val().trim();
      if (!title) {
        alert('제목을 입력해주세요.');
        return;
      }

      // 개인정보 동의 검증
      var privacyCheck = $form.find('[name="privacy_agree"]');
      if (privacyCheck.length && !privacyCheck.is(':checked')) {
        alert('개인정보 수집 및 이용에 동의해주세요.');
        return;
      }

      $btn.prop('disabled', true).text('저장 중...');

      // FormData 생성
      var formData = new FormData($form[0]);
      formData.append('action', 'uw_board_front_save');
      formData.append('nonce', uwBoard.nonce);

      // Summernote 내용 추가
      if ($('#uw-editor').length) {
        formData.set('content', $('#uw-editor').summernote('code'));
      }

      $.ajax({
        url: uwBoard.ajaxUrl,
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.success) {
            alert(response.data.message || '저장되었습니다.');
            if (response.data.redirect) {
              window.location.href = response.data.redirect;
            }
          } else {
            alert('오류: ' + (response.data || '저장에 실패했습니다.'));
            $btn.prop('disabled', false).text('작성하기');
          }
        },
        error: function () {
          alert('서버 오류가 발생했습니다.');
          $btn.prop('disabled', false).text('작성하기');
        }
      });
    });
  }

  // ==========================================================================
  // 비밀번호 검증 (비회원 수정/삭제)
  // ==========================================================================
  function initPasswordVerify() {
    // 수정/삭제 버튼 클릭 시 비밀번호 확인
    $(document).on('click', '.uw-verify-password', function (e) {
      e.preventDefault();

      var $btn = $(this);
      var postId = $btn.data('post-id');
      var action = $btn.data('action'); // edit or delete
      var redirectUrl = $btn.attr('href');

      var password = prompt('비밀번호를 입력하세요.');

      if (!password) {
        return;
      }

      $.post(uwBoard.ajaxUrl, {
        action: 'uw_board_verify_password',
        nonce: uwBoard.nonce,
        post_id: postId,
        password: password
      }, function (response) {
        if (response.success) {
          var token = response.data.token;

          if (action === 'delete') {
            // 삭제 처리
            if (confirm('정말 삭제하시겠습니까?')) {
              var slug = $btn.data('board-slug') || $('input[name="board_slug"]').val() || uwBoard.slug;
              slug = $btn.data('board-slug');

              uw_front_delete_post(postId, slug, token);
            }
          } else {
            // 수정 페이지로 이동 (토큰 전달)
            var separator = redirectUrl.indexOf('?') !== -1 ? '&' : '?';
            window.location.href = redirectUrl + separator + 'token=' + token;
          }
        } else {
          alert(response.data || '비밀번호가 일치하지 않습니다.');
        }
      });
    });
  }

  // ==========================================================================
  // 글 삭제 (공통)
  // ==========================================================================
  function uw_front_delete_post(postId, slug, token) {
    $.post(uwBoard.ajaxUrl, {
      action: 'uw_board_front_delete',
      nonce: uwBoard.nonce,
      post_id: postId,
      board_slug: slug,
      uw_token: token // 비회원일 경우
    }, function (delRes) {
      if (delRes.success) {
        alert(delRes.data.message);
        if (delRes.data.redirect) {
          window.location.href = delRes.data.redirect;
        }
      } else {
        alert(delRes.data || '삭제에 실패했습니다.');
      }
    });
  }

  // 회원 삭제 버튼 핸들러
  $(document).on('click', '.uw-btn-delete', function () {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    var $btn = $(this);
    var postId = $btn.data('post-id');
    var slug = $btn.data('board-slug') || uwBoard.slug;

    uw_front_delete_post(postId, slug, '');
  });

  // ==========================================================================
  // 이미지 라이트박스
  // ==========================================================================
  function initLightbox() {
    // 본문 이미지 클릭 시 라이트박스
    $('.uw-post-content img').on('click', function () {
      var src = $(this).attr('src');

      // 간단한 라이트박스
      var $overlay = $('<div class="uw-lightbox-overlay">' +
        '<div class="uw-lightbox-close">&times;</div>' +
        '<img src="' + src + '" alt="">' +
        '</div>');

      $('body').append($overlay).css('overflow', 'hidden');

      $overlay.on('click', function () {
        $(this).remove();
        $('body').css('overflow', '');
      });
    });
  }

})(jQuery);

// ==========================================================================
// 라이트박스 스타일 (인라인)
// ==========================================================================
(function () {
  var style = document.createElement('style');
  style.textContent = `
        .uw-lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            cursor: pointer;
        }
        .uw-lightbox-overlay img {
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        }
        .uw-lightbox-close {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #fff;
            font-size: 40px;
            cursor: pointer;
        }
    `;
  document.head.appendChild(style);
})();
