(function($) {
    'use strict';

    function supportTransition() {
        var div = document.createElement('div');
        var transEndEventNames = {
            "WebkitTransition": 'webkitTransitionEnd',
            "MozTransition": 'transitionend',
            "OTransition": 'oTransitionEnd otransitionend',
            "transition": 'transitionend'
        };
        var result = false;

        for (var name in transEndEventNames) {
            if (div.style[name] !== undefined) {
                result = true;
            }
        }
        return result;
    }

    function supportTransform3d() {
        if (!window.getComputedStyle) {
            return false;
        }
        var el = document.createElement('div');
        var has3d;
        var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        };
        document.body.insertBefore(el, null);
        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }
        document.body.removeChild(el);
        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }

    function getCssPrefix() {
        if (!window.getComputedStyle) {
            return false;
        }
        // create our test div element
        var div = document.createElement('div'),
            // css transition properties
            props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective', 'perspective'];
        // test for each property
        for (var i = 0; i < props.length; i++) {
            if (div.style[props[i]] !== undefined) {
                var cssPrefix = props[i].replace('Perspective', '').toLowerCase();
            }
        }
        if(cssPrefix === 'perspective') {
            cssPrefix = '';
        } else {
            cssPrefix = '-' + cssPrefix + '-';
        }
        return cssPrefix;
    }

    $.fn.kSlide = function(options) {
        var defaults = {
            "images": [],
            "width": "100%",
            "height": "100%",
            "fadeDuration": .1,
            "useTransition": false,
            "useAnimation3D": false,
            "useAutoChange": false,
            "useResponsive": false,
            "useSnap": true,
            "useTool": true,
            "type": "slide",
            "changedCallback": null,
            "imgWidth": 0, // 이미지 사이즈만 따로 조정 (img tag 사용) defaults.width는 배경 (색이 들어감)
            "imgHeight": 0 // 이미지 사이즈만 따로 조정 (img tag 사용) defaults.width는 배경 (색이 들어감)
        }

        if(options.useTransition && supportTransition()) {
            options.useTransition = options.useTransition;
            options.useTransform3d = supportTransform3d() && options.useAnimation3D;
        } else {
            if(!supportTransition()) {
                console.log('transition, snapEvent를 지원하지 않습니다. ie10이상 가능');
            }
            options.useTransition = false;
            options.useTransform3d = false;
        }

        var settings = $.extend({}, defaults, options);

        return this.each(function() {
            var self = this;
            $(this).addClass(settings.type);
            var $slideBox = $('<ul class="list_slide"></ul>');
            var $controlBox = $(document.createDocumentFragment());
            var $slideList = $slideBox.find('li');
            var changeTimer = null;
            var pageIndex = 1;
            if(settings.useSnap) {
                var isMouseDown = false; // 마우스 다운
                var isMouseMove = false; // 마우스 무브
            }
            var isBindingTransition = false;
            $(self).css({
                "width": settings.useResponsive ? '' : settings.width,
                "height": settings.height
            });
// render ----
            // 전체 render
            function render() {
                renderImages();
                if(settings.useTool) {
                    renderControls();
                }
                // $slideWrap.append($slideBox);
                $(self).append($slideBox);
                $(self).append($controlBox);

                if(settings.changedCallback && typeof settings.changedCallback === 'function') {
                    settings.changedCallback(self, 1);
                }
            }

            // 이미지 render
            function renderImages() {
                $slideBox.empty();
                for(var i = 0; i < 3; i++) {
                    var $li = $('<li></li>');
                    if(settings.useResponsive || settings.imgWidth || settings.imgHeight) {
                        var $img = i ? $('<img src="'+ settings.images[i - 1] + '">') : $('<img src="' + settings.images[settings.images.length - 1] + '">');
                        if(settings.imgWidth || settings.imgHeight) {
                            $img.css({ "width": settings.imgWidth, "height": settings.imgHeight, "margin": "35px auto 0" });
                        }
                    } else {
                        var $img = i ? $('<div class="thumb_slide" style="background-image: url(' + settings.images[i - 1] + ')"></div>') : $('<div class="thumb_slide" style="background-image: url(' + settings.images[settings.images.length - 1] + ')"></div>');
                    }

                    if(i === 1) {
                        $li.addClass('on');
                    }
                    $li.append($img)
                    $slideBox.append($li);
                }
            }

            // tool render
            function renderControls() {
                var $prevBtn = $('<button class="btn_page btn_prev"><span class="ico_corp ico_prev">이전</span></button>');
                var $nextBtn = $('<button class="btn_page btn_next"><span class="ico_corp ico_next">다음</span></button>');
                var $pageNumber = $('<div class="info_page page_white"><span class="screen_out">현재 페이지</span><strong class="num_page">' + pageIndex + '</strong>/' + settings.images.length + '</div>');
                $controlBox.append($prevBtn);
                $controlBox.append($nextBtn);
                $controlBox.append($pageNumber);
            }

            // 애니메이션 끝나고 다시 그림
            function reRender(direction) {
                if(direction === 'prev') {
                    var temp = settings.images[settings.images.length - 1];
                    settings.images.splice(settings.images.length - 1, 1);
                    settings.images.unshift(temp);
                    pageIndex = pageIndex === 1 ? settings.images.length : pageIndex - 1;
                } else if(direction === 'next') {
                    var temp = settings.images[0];
                    settings.images.splice(0, 1);
                    settings.images.push(temp);
                    pageIndex = pageIndex === settings.images.length ? 1 : pageIndex + 1;
                }

                renderImages();
                $(self).find('.num_page').html(pageIndex);

                if(settings.changedCallback && typeof settings.changedCallback === 'function') {
                    settings.changedCallback(self, pageIndex);
                }

                if(settings.type === 'slide') {
                    changeSlide();
                }

                if(settings.useAutoChange) {
                    autoChange();
                }

                if(settings.useSnap) {
                    isMouseDown = false;
                    isMouseMove = false;
                }
            }
// -----

// event ------

            // settings.useTransition === true 일때 사용가능 (애니메이션 끝나고 실행)
            function bindTransitionEnd($this, direction) {
                isBindingTransition = true;
                if(settings.type === 'slide') {
                    $slideBox.css(cssPrefix + 'transition', cssPrefix + 'transform .2s');
                }
                $this.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
                $this.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
                    if(settings.type === 'slide') {
                        var childrenWidth = 100 / 3;
                        $slideBox.css(cssPrefix + 'transition', '');
                        $slideBox.css(cssPrefix + 'transform', settings.useTransform3d ? 'translate3d(-' + childrenWidth + '%, 0, 0)' : 'translate(-' + childrenWidth + '%, 0)');
                        bindAnimateEnd(direction);
                    } else if(settings.type === 'fade') {
                        if($this.hasClass('on')) {
                            bindAnimateEnd(direction);
                        }
                    }
                    isBindingTransition = false;
                });
            }

            // settings.useTransition === false 일때 사용가능 (애니메이션 끝나고 실행)
            function bindAnimateStart($this, css) {
                var defer = $.Deferred();
                $this.animate(css, 500, function() {
                    defer.resolve();
                });
                return defer.promise();
            }

            // 애니메이션 끝나고 실행 후 마무리 함수
            function bindAnimateEnd(direction) {
                reRender(direction);
                if(settings.type === 'fade') {
                    abledBtns();
                }
            }

            // 이벤트들
            function bindEvents() {
                var $el = $(self);
                $el.find('.btn_prev').on('click', function(e) {
                    e.preventDefault();
                    clickedDirection('prev');
                });

                $el.find('.btn_next').on('click', function(e) {
                    e.preventDefault();
                    clickedDirection('next');
                });

                if(settings.useSnap) {
                    onSnap();
                }
            }

            function onSnap() {
                var $el = $(self);
                var defaultX, defaultY, speedX, positionMovedX, offsetMovedX, offsetMovedY, currentX;
                // 마우스다운시 위치값, 마우스무브시 이동 슬라이드 가로 비례값, 마우스무브시 이동값, 현재 transformX 값
                var slideWidth = settings.useTransition ? 100 / 3 : 100;

                $el.on('mousedown touchstart', function(e) {
                    if(!isBindingTransition) {
                        isMouseDown = true;
                        defaultX = e.clientX || e.originalEvent.touches[0].clientX;
                        defaultY = e.clientY || e.originalEvent.touches[0].clientY;
                    }
                });

                $el.on('mousemove touchmove', function(e) {
                    if(!(Math.abs(defaultY - (e.clientY || e.originalEvent.touches[0].clientY)) >= Math.abs(defaultX - (e.clientX || e.originalEvent.touches[0].clientX)))) {
                        e.preventDefault();
                    }
                    if(isMouseDown) {
                        isMouseMove = true;
                        speedX = slideWidth / $(this).width();
                        offsetMovedX = e.clientX || e.originalEvent.touches[0].clientX;
                        offsetMovedY = e.clientY || e.originalEvent.touches[0].clientY;
                        positionMovedX = (offsetMovedX - defaultX) * speedX;
                        currentX = slideWidth - positionMovedX;
                        if(settings.type === 'slide' && (defaultY < offsetMovedY + 20 && defaultY > offsetMovedY - 20)) {
                            if(settings.useTransition) {
                                $slideBox.css(cssPrefix + 'transform', settings.useTransform3d ? 'translate3d(-' + currentX + '%, 0, 0)' : 'translate(-' + currentX + '%, 0)');
                            } else {
                                $slideBox.css('left', '-' + currentX + '%');
                            }
                        }
                    }
                });

                $el.on('mouseleave mouseup touchend', function(e) {
                    if(isMouseDown && isMouseMove) {
                        if(slideWidth > currentX + 5) {
                            clickedDirection('prev');
                        } else if(slideWidth < currentX - 5) {
                            clickedDirection('next');
                        } else {
                            if(settings.type === 'slide') {
                                clickedDirection();
                            } else {
                                isMouseDown = false;
                            }
                        }
                    } else {
                        isMouseDown = false;
                    }
                });
            }

            function clickedDirection(direction) {
                if(settings.useSnap) {
                    isMouseDown = false;
                    isMouseMove = false;
                }
                if(settings.useAutoChange) {
                    clearTimer();
                }
                if(settings.type === 'slide') {
                    changeSlide(direction);
                } else if(settings.type === 'fade') {
                    disabledBtns();
                    changeFade(direction);
                }
            }

            function disabledBtns() {
                $(self).find('.btn_page').addClass('has_disabled');
            }

            function abledBtns() {
                $(self).find('.btn_page').removeClass('has_disabled');
            }

            function clearTimer() {
                clearTimeout(changeTimer);
                changeTimer = null;
            }
// -------

            function autoChange() {
                changeTimer = setTimeout(function() {
                    if(settings.type === 'slide') {
                        changeSlide('next');
                    } else if(settings.type === 'fade') {
                        changeFade('next');
                        disabledBtns();
                    }
                }, settings.showDuration * 1000);
            }

            // fade in out 실행
            function changeFade(direction) {
                var isChange = false; // each문 현재 on된 것만 실행 하기 위해 만든 boolean 값
                $slideBox.find('li').each(function() {
                    var $this = $(this);
                    $this.attr('aria-hidden', 'false');
                    var $next = $this.next();
                    if(direction === 'prev') {
                        $next = $this.prev();
                    }
                    if($this.hasClass('on') && !isChange) {
                        if(settings.useTransition) {
                            bindTransitionEnd($this, direction);
                            bindTransitionEnd($next, direction);
                            $this.removeClass('on');
                            $next.addClass('on');
                            $this.attr('aria-hidden', 'true');
                            isChange = true;
                        } else {
                            $.when(bindAnimateStart($this, {"opacity": 0}), bindAnimateStart($next, {"opacity": 1}))
                                .done(function() {
                                    $this.removeClass('on');
                                    $next.addClass('on');
                                    isChange = true;
                                    setTimeout(function() {
                                        bindAnimateEnd(direction);
                                    }, 100);
                                });
                        }
                    }
                });
            }

            // slide 넘김 실행
            function changeSlide(direction, isNotBind) {
                var childrenWidth = 100 / 3;
                var currentDirectionValue = childrenWidth;
                var directionValue = 0;
                if(direction === 'prev') {
                    directionValue = -childrenWidth;
                } else if(direction === 'next') {
                    directionValue = childrenWidth;
                }
                currentDirectionValue = currentDirectionValue + directionValue;
                if(settings.useTransition) {
                    $slideBox.css(cssPrefix + 'transform', settings.useTransform3d ? 'translate3d(-' + currentDirectionValue + '%, 0, 0)' : 'translate(-' + currentDirectionValue + '%, 0)');
                } else {
                    if(direction) {
                        $.when(bindAnimateStart($slideBox, {"left": (currentDirectionValue ? "-200%" : 0)}))
                            .done(function() {
                                $slideBox.css("left", "-100%");
                                bindAnimateEnd(direction);
                            });
                    } else {
                        // setting.useTransition === false 일때 최초실행
                        $slideBox.css("left", '-100%');
                    }
                }
                // slide li 값 셋팅
                $slideBox.find('li').each(function(index) {
                    var $this = $(this);
                    $this.attr('aria-hidden', 'false');
                    $this.css('width', childrenWidth + '%');
                    if(index === 1) {
                        $this.attr('aria-hidden', 'true');
                    }
                });
                // setting.useTransition === true 일때 최초실행만 동작하지 않도록...
                if(!isNotBind && settings.useTransition && direction) {
                    bindTransitionEnd($slideBox, direction);
                }
            }

            render();
            bindEvents();

            if(settings.type === 'slide') {
                var cssPrefix = getCssPrefix();
                changeSlide('', true);
            }

            if(settings.useAutoChange) {
                autoChange();
            }

        });
    }
})(jQuery);