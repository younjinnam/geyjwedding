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

    // Scroll event listener with requestAnimationFrame (애니메이션 트리거)
    let scrollTimeout;
    $window.on('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = requestAnimationFrame(function() {
                $('.animate-on-scroll').each(function() {
                    const elementTop = $(this).offset().top;
                    const viewportBottom = $(window).scrollTop() + $(window).height();
                    if (elementTop < viewportBottom * 0.9) {
                        $(this).addClass('animate');
                    }
                });
                scrollTimeout = null;
            });
        }
    });

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
                    speed: 1000,
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

// 슬라이드 댓글 기능
let currentIndex = 0;
let commentInterval;

const loadComments = async () => {
    try {
        const response = await fetch('/.netlify/functions/getComments');
        const comments = await response.json();
        console.log('Comments:', comments);
        displaySlideComments(comments);
        displayAllComments(comments); // 전체 댓글 표시 기능도 동시에 로드
    } catch (error) {
        console.error('Error loading comments:', error);
    }
};

const displaySlideComments = (comments) => {
    const commentsSection = document.getElementById('comments-section');
    commentsSection.innerHTML = '';

    if (comments.length === 0) {
        commentsSection.innerHTML = '<p>작성된 댓글이 없습니다. 축하메세지를 남겨주세요!</p>';
    } else {
        commentsSection.innerHTML = comments.map(comment =>
            `<div class="comment-slide">
                <strong>${comment.myname}</strong>
                <p>${comment.comment}</p>
            </div>`
        ).join('');

        startSlidingComments(comments.length);
    }
};

const startSlidingComments = () => {
    const slides = document.querySelectorAll('.comment-slide');
    const totalSlides = slides.length;

    let index = 0;

    setInterval(() => {
        // 모든 슬라이드 비활성화
        slides.forEach((slide) => {
            slide.classList.remove('active');
            slide.classList.add('inactive');
            slide.style.transform = `translateX(${100}%)`;
        });

        // 현재 슬라이드를 활성화
        slides[index].classList.add('active');
        slides[index].classList.remove('inactive');
        slides[index].style.transform = `translateX(0)`;

        // 이전 슬라이드를 왼쪽으로 이동
        const previousIndex = index === 0 ? totalSlides - 1 : index - 1;
        slides[previousIndex].style.transform = `translateX(-100%)`;

        // 다음 슬라이드로 이동
        index = (index + 1) % totalSlides;
    }, 2000); // 슬라이드 전환 간격 (2초)
};

    // 전체 댓글 보기 기능
    const displayAllComments = (comments) => {
        const commentsList = document.getElementById('comments-list');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const commentsPerPage = 10;
        let currentPage = 1;

        const renderComments = () => {
            const start = (currentPage - 1) * commentsPerPage;
            const end = start + commentsPerPage;
            const paginatedComments = comments.slice(start, end);

            paginatedComments.forEach(comment => {
                const commentElement = document.createElement('p');
                commentElement.innerHTML = `<strong>${comment.myname}:</strong> ${comment.comment}`;
                commentsList.appendChild(commentElement);
            });

            if (end >= comments.length) {
                loadMoreBtn.style.display = 'none'; // 모든 댓글이 표시되면 더보기 버튼 숨기기
            } else {
                loadMoreBtn.style.display = 'block'; // 댓글이 더 많다면 더보기 버튼 표시
            }
        };

        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderComments();
        });

        renderComments(); // 처음 10개 표시
    };

    // 전체 댓글 보기 토글 기능
    document.getElementById('toggleCommentsBtn').addEventListener('click', function() {
        const allComments = document.getElementById('all-comments');
        const toggleIcon = document.getElementById('toggleIcon');

        if (allComments.style.display === 'none' || allComments.style.display === '') {
            allComments.style.display = 'block';
            toggleIcon.classList.remove('fa-chevron-down');
            toggleIcon.classList.add('fa-chevron-up');
        } else {
            allComments.style.display = 'none';
            toggleIcon.classList.remove('fa-chevron-up');
            toggleIcon.classList.add('fa-chevron-down');
        }
    });

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

})(jQuery);
