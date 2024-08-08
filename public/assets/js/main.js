(function($) {

    var $window = $(window),
        $body = $('body'),
        $header = $('#header'),
        $all = $body.add($header);

    // Breakpoints.
    breakpoints({
        xxlarge: [ '1681px',  '1920px' ],
        xlarge:  [ '1281px',  '1680px' ],
        large:   [ '1001px',  '1280px' ],
        medium:  [ '737px',   '1000px' ],
        small:   [ '481px',   '736px'  ],
        xsmall:  [ null,      '480px'  ]
    });

    // Play initial animations on page load.
    $window.on('load', function() {
        setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Touch mode.
    if (browser.mobile)
        $body.addClass('is-touch');
    else {

        breakpoints.on('<=small', function() {
            $body.addClass('is-touch');
        });

        breakpoints.on('>small', function() {
            $body.removeClass('is-touch');
        });

    }

    // Fix: IE flexbox fix.
    if (browser.name == 'ie') {

        var $main = $('.main.fullscreen'),
            IEResizeTimeout;

        $window
            .on('resize.ie-flexbox-fix', function() {

                clearTimeout(IEResizeTimeout);

                IEResizeTimeout = setTimeout(function() {

                    var wh = $window.height();

                    $main.each(function() {

                        var $this = $(this);

                        $this.css('height', '');

                        if ($this.height() <= wh)
                            $this.css('height', (wh - 50) + 'px');

                    });

                });

            })
            .triggerHandler('resize.ie-flexbox-fix');

    }

    // Gallery.
    $window.on('load', function() {

        var $gallery = $('.gallery');

        $gallery.poptrox({
            baseZIndex: 10001,
            useBodyOverflow: false,
            usePopupEasyClose: false,
            overlayColor: '#1f2328',
            overlayOpacity: 0.65,
            usePopupDefaultStyling: false,
            usePopupCaption: true,
            popupLoaderText: '',
            windowMargin: 50,
            usePopupNav: true
        });

        // Hack: Adjust margins when 'small' activates.
        breakpoints.on('>small', function() {
            $gallery.each(function() {
                $(this)[0]._poptrox.windowMargin = 50;
            });
        });

        breakpoints.on('<=small', function() {
            $gallery.each(function() {
                $(this)[0]._poptrox.windowMargin = 5;
            });
        });

    });

    // Section transitions.
    if (browser.canUse('transition')) {

        var on = function() {

            // Galleries.
            $('.gallery')
                .scrollex({
                    top: '20vh',  // 모바일에서 더 적은 영역으로 설정
                    bottom: '20vh',
                    delay: 100, // 지연 시간 조정
                    initialize: function() { $(this).addClass('inactive'); },
                    terminate: function() { $(this).removeClass('inactive'); },
                    enter: function() { $(this).removeClass('inactive'); },
                    leave: function() { $(this).addClass('inactive'); }
                });

            // Generic sections.
            $('.main.style1')
                .scrollex({
                    mode: 'middle',
                    delay: 100,
                    initialize: function() { $(this).addClass('inactive'); },
                    terminate: function() { $(this).removeClass('inactive'); },
                    enter: function() { $(this).removeClass('inactive'); },
                    leave: function() { $(this).addClass('inactive'); }
                });

            $('.main.style2')
                .scrollex({
                    mode: 'middle',
                    delay: 100,
                    initialize: function() { $(this).addClass('inactive'); },
                    terminate: function() { $(this).removeClass('inactive'); },
                    enter: function() { $(this).removeClass('inactive'); },
                    leave: function() { $(this).addClass('inactive'); }
                });

            // Contact.
            $('#contact')
                .scrollex({
                    top: '50%',
                    delay: 50,
                    initialize: function() { $(this).addClass('inactive'); },
                    terminate: function() { $(this).removeClass('inactive'); },
                    enter: function() { $(this).removeClass('inactive'); },
                    leave: function() { $(this).addClass('inactive'); }
                });

        };

        var off = function() {
            // Galleries.
            $('.gallery').unscrollex();

            // Generic sections.
            $('.main.style1').unscrollex();
            $('.main.style2').unscrollex();

            // Contact.
            $('#contact').unscrollex();
        };

        // 모바일에서도 애니메이션 유지
        breakpoints.on('<=small', on);
        breakpoints.on('>small', on);

    }

    // Events.
    var resizeTimeout, resizeScrollTimeout;

    $window
        .on('resize', function() {

            // Disable animations/transitions.
            $body.addClass('is-resizing');

            clearTimeout(resizeTimeout);

            resizeTimeout = setTimeout(function() {

                // Update scrolly links.
                $('a[href^="#"]').scrolly({
                    speed: 1500,
                    offset: $header.outerHeight() - 1
                });

                // Re-enable animations/transitions.
                setTimeout(function() {
                    $body.removeClass('is-resizing');
                    $window.trigger('scroll');
                }, 0);

            }, 100);

        })
        .on('load', function() {
            $window.trigger('resize');
        });

    // Comment sliding and loading functionality
    let comments = [];
    let currentPage = 1;
    const commentsPerPage = 10;

    const loadComments = async () => {
        try {
            const response = await fetch('/.netlify/functions/getComments');
            comments = await response.json();
            console.log('Comments:', comments);
            displayComments(); // 처음 10개 표시
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const displayComments = () => {
        const commentsList = document.getElementById('comments-list');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const start = (currentPage - 1) * commentsPerPage;
        const end = start + commentsPerPage;
        const paginatedComments = comments.slice(start, end);

        paginatedComments.forEach(comment => {
            const commentElement = document.createElement('p');
            commentElement.innerHTML = `<strong>${comment.myname}:</strong> ${comment.comment}`;
            commentsList.appendChild(commentElement);
        });

        currentPage++;

        // 더보기 버튼 상태 업데이트
        if (end >= comments.length) {
            loadMoreBtn.style.display = 'none'; // 모든 댓글이 표시되면 더보기 버튼 숨기기
        } else if (comments.length <= commentsPerPage) {
            loadMoreBtn.style.display = 'none'; // 초기 댓글 수가 10개 이하인 경우도 더보기 버튼 숨기기
        } else {
            loadMoreBtn.style.display = 'block'; // 댓글이 더 많다면 더보기 버튼 표시
        }
    };

    document.getElementById('loadMoreBtn').addEventListener('click', displayComments);

    const submitComment = async (event) => {
        event.preventDefault();
        const myname = document.getElementById('myname').value;
        const comment = document.getElementById('comment').value;

        if (!myname || !comment) {
            alert('Name and comment are required.');
            return;
        }

        const response = await fetch('/.netlify/functions/saveComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ myname, comment })  // myname과 comment를 JSON으로 전송
        });

        if (response.ok) {
            await loadComments();
            if (window.confirm('댓글이 성공적으로 저장되었습니다.')) {
                window.location.reload();
            }
        } else {
            const result = await response.json();
            alert(result.message);
        }
    };

    document.getElementById('commentForm').addEventListener('submit', submitComment);
    window.onload = loadComments;

    // 주소 복사 기능
    document.getElementById('copyTextBtn').addEventListener('click', function() {
        // 미리 입력해둔 텍스트
        const textToCopy = "서울특별시 강남구 언주로 711 건설회관 2층";

        // 클립보드에 복사하기
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('텍스트가 복사되었습니다!');
        }).catch(err => {
            console.error('텍스트 복사에 실패했습니다:', err);
            alert('텍스트 복사에 실패했습니다.');
        });
    });
    // 댓글 토글 기능
    document.getElementById('toggleCommentsBtn').addEventListener('click', function() {
        const allComments = document.getElementById('all-comments');
        const toggleIcon = document.getElementById('toggleIcon');

        if (allComments.style.display === 'none' || allComments.style.display === '') {
            allComments.style.display = 'block';
            toggleIcon.className = 'fas fa-chevron-up'; // 아이콘 변경
        } else {
            allComments.style.display = 'none';
            toggleIcon.className = 'fas fa-chevron-down'; // 아이콘 변경
        }
    });

})(jQuery);
