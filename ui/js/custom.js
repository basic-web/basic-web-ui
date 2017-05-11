/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');

// Sidebar
$(document).ready(function () {
    // TODO: This is some kind of easy fix, maybe we can improve this
    var setContentHeight = function () {
        // reset height
        $RIGHT_COL.css('min-height', $(window).height());

        var bodyHeight = $BODY.outerHeight(),
            footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
            leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
            contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

        // normalize content
        contentHeight -= $NAV_MENU.height() + footerHeight;

        $RIGHT_COL.css('min-height', contentHeight);
    };

    $SIDEBAR_MENU.find('a').on('click', function (ev) {
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function () {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }

            $li.addClass('active');

            $('ul:first', $li).slideDown(function () {
                setContentHeight();
            });
        }

        if ($(this).attr('href')) {
            document.cookie = "current-page=" + $(this).attr('href');
        }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function () {
        if ($BODY.hasClass('nav-md')) {
            $SIDEBAR_MENU.find('li.active ul').hide();
            $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
        } else {
            $SIDEBAR_MENU.find('li.active-sm ul').show();
            $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
        }

        $BODY.toggleClass('nav-md nav-sm');

        setContentHeight();
    });

    // check active menu
    var cp = document.cookie.replace(/(?:(?:^|.*;\s*)current-page\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    $SIDEBAR_MENU.find('a[href="' + cp + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
        return $(this).attr('href') == cp;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
        setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function () {
        setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
        $('.menu_fixed').mCustomScrollbar({
            autoHideScrollbar: true,
            theme: 'minimal',
            mouseWheel: { preventDefault: true }
        });
    }
});
// /Sidebar

// Progressbar
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
}
// /Progressbar

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}

$(document).ready(function () {
    $.ajax({
        url: '/base',
        method: 'GET',
        dataType: 'JSON',
        error: function (req) {
            new Noty({
                type: 'error',
                text: req.responseJSON.message,
                layout: 'topCenter',
                timeout: 3000
            }).show();
        },
        success: function (data) {
            $('.appname').text(data.appname);
            $('.nickname').text(data.user.nickname);
            if (data.user.head) {
                $('.userhead').attr('src', data.user.head);
            }
        }
    });
});

var ERROR_HANDLER = function (res) {
    var message = '';
    if (res.responseJSON.message) {
        message += res.responseJSON.message + '<br>';
    }
    if (res.responseJSON.error) {
        for (var i = 0; i < res.responseJSON.error.length; i++) {
            message += res.responseJSON.error[i].msg + '<br>';
        }
    }
    new Noty({
        type: 'error',
        text: message,
        layout: 'topCenter',
        timeout: 3000
    }).show();
};

var socket = io('/');
socket.emit('messages');
socket.on('failure', function (data) {
    new Noty({
        type: 'error',
        text: data,
        layout: 'topCenter',
        timeout: 3000
    }).show();
});
socket.on('messages', function (messages) {
    $('#message-count').html(messages.total);
    for (var i = 0; i < messages.data.length; i++) {
        var content = messages.data[i].content;
        if (content.length > 30) {
            content = content.substring(0, 20) + '...';
        }
        $('#message-all-item').before(
            '<li class="message-item" id="message_' + messages.data[i].id + '" data-id="' + messages.data[i].id + '">'
            + '<a><span><span>' + messages.data[i].title + '</span><span class="time">'
            + moment(messages.data[i].createdTime, 'YYYY-MM-DD h:mm:ss').fromNow() + '</span ></span><span class="message">'
            + content + '</span></a></li>');
    }
    processMessageClick($('.message-item'));
});
socket.on('message', function (message) {
    var count = 0;
    if($('#message-count').html()) {
        count = parseInt($('#message-count').html()) + 1;
    }
    $('#message-count').html(count);
    new Noty({
        type: 'info',
        text: message.data.title,
        layout: 'topRight',
        timeout: 3000
    }).show();
    var content = message.data.content;
    if (content.length > 30) {
        content = content.substring(0, 20) + '...';
    }
    $('#message-list').prepend(
        '<li class="message-item" id="message_' + message.data.id + '" data-id="' + message.data.id + '">'
        + '<a><span><span>' + message.data.title + '</span><span class="time">'
        + moment(message.data.createdTime, 'YYYY-MM-DD h:mm:ss').fromNow() + '</span ></span><span class="message">'
        + content + '</span></a></li>');
    processMessageClick($('#message_' + message.data.id));
});
function processMessageClick(messageSelector) {
    messageSelector.click(function () {
        var id = $(this).attr('data-id');
        $.ajax({
            url: '/message/' + id,
            method: 'GET',
            dataType: 'JSON',
            error: function (req) {
                new Noty({
                    type: 'error',
                    text: req.responseJSON.message,
                    layout: 'topCenter',
                    timeout: 3000
                }).show();
            },
            success: function (message) {
                $('#message_' + id).remove();
                $('#message-count').html(message.total);
                $('#message-modal-title').html(message.data.title);
                $('#message-modal-content').html(message.data.content);
                $('#message-modal').modal('show');
            }
        });
    });
}