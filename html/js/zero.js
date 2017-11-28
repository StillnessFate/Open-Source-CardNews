function make_card(in_author, in_title, in_text, in_image, in_card_id, in_pages) {
    var table = document.getElementById("card-table");
    var share_url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/?card_news_id=' + in_card_id;

    var card = document.createElement('div');
    card.className = "card card-type-1";
    card.dataset.card_id = in_card_id;
    card.dataset.pages = in_pages;
    card.dataset.image = in_image;

    var wrapper = document.createElement('div');
    wrapper.className = "wrapper";
    card.appendChild(wrapper);

    var header = document.createElement('div');
    header.className = "header";
    wrapper.appendChild(header);

    var date = document.createElement('div');
    date.className = "date";
    //header.appendChild(date);

    var day = document.createElement('span');
    day.className = "day";
    day.innerHTML = "3" + " ";
    date.appendChild(day);

    var month = document.createElement('span');
    month.className = "month";
    month.innerHTML = "Nov" + " ";
    date.appendChild(month);

    var year = document.createElement('span');
    year.className = "year";
    year.innerHTML = "2017";
    date.appendChild(year);

    var menu_content = document.createElement('ul');
    menu_content.className = "menu-content";
    header.appendChild(menu_content);

    var menu_content_share = document.createElement('li');
    menu_content.appendChild(menu_content_share);

    var share_social_frame = document.createElement('div');
    share_social_frame.className = "share-social-frame";
    menu_content_share.appendChild(share_social_frame);

    var share_icon_facebook = document.createElement('div');
    share_icon_facebook.className = "share-icon facebook";
    share_social_frame.appendChild(share_icon_facebook);

    var facebook = document.createElement('a');
    facebook.onclick = function () { share('facebook', share_url); return false; };
    facebook.className = "icon fa fa-facebook";
    share_icon_facebook.appendChild(facebook);

    var share_icon_twitter = document.createElement('div');
    share_icon_twitter.className = "share-icon twitter";
    share_social_frame.appendChild(share_icon_twitter);

    var twitter = document.createElement('a');
    twitter.onclick = function () { share('twitter', share_url); return false; };
    twitter.className = "icon fa fa-twitter";
    share_icon_twitter.appendChild(twitter);

    var share_icon_google = document.createElement('div');
    share_icon_google.className = "share-icon google";
    share_social_frame.appendChild(share_icon_google);

    var google = document.createElement('a');
    google.onclick = function () { share('google', share_url); return false; };
    google.className = "icon fa fa-google-plus";
    share_icon_google.appendChild(google);

    var share_social = document.createElement('a');
    share_social.className = "share-social icon fa fa-share-alt";
    share_social_frame.appendChild(share_social);

    var data = document.createElement('div');
    data.className = "data";
    wrapper.appendChild(data);

    var content = document.createElement('div');
    content.className = "content";
    data.appendChild(content);

    var author = document.createElement('span');
    author.className = "author";
    author.innerHTML = in_author
    content.appendChild(author);

    var title = document.createElement('h1');
    title.className = "title";
    content.appendChild(title);

    var title_a = document.createElement('a');
    title_a.innerHTML = in_title
    title.appendChild(title_a);

    var text = document.createElement('p');
    text.className = "text";
    text.innerHTML = in_text
    content.appendChild(text);

    var bottom_menu = document.createElement('div');
    bottom_menu.className = "bottom-menu";
    content.appendChild(bottom_menu);

    var bottom_menu_edit = document.createElement('a');
    bottom_menu_edit.className = "edit";
    bottom_menu_edit.innerHTML = "Edit"
    bottom_menu.appendChild(bottom_menu_edit);

    var bottom_menu_delete = document.createElement('a');
    bottom_menu_delete.className = "delete";
    bottom_menu_delete.innerHTML = "Delete"
    bottom_menu.appendChild(bottom_menu_delete);

    wrapper.style.backgroundImage = 'url(' + in_image + ')' + ', url(image_warning.png)';


    table.appendChild(card);
}

//==========페이지 초기화 로직==========
$(document).ready(function () {

    load_card_news(function () {
        var card_news_id = getQuerystring('card_news_id');
        var edit_mode = getQuerystring('edit_mode');
        if (card_news_id) {
            if (edit_mode) {
                open_card_news_viewer(card_news_id, true)
            }
            else {
                open_card_news_viewer(card_news_id)
            }
        }
        
    //$(".lazy").slick({
    //    lazyLoad: 'ondemand', // ondemand progressive anticipated
    //    infinite: true
    //});
    })

    if (Cookies.get('SESSION_ID')) {
        set_state_login(Cookies.get('USER_NAME'))
        session_check()
    }
});

//==========회원 가입 팝업==========
$(document).ready(function () {
    $('.login-frame .register').click(function () {
        var name = $('#register-name');
        var id = $('#register-id');
        var password = $('#register-password');
        var confirm_password = $('#register-confirm-password');
        var popupBox = $('#register-box');

        name.val('');
        id.val('');
        password.val('');
        confirm_password.val('');

        $(popupBox).fadeIn(300);

        var popMargTop = ($(popupBox).height() + 24) / 2;
        var popMargLeft = ($(popupBox).width() + 24) / 2;

        $(popupBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });

        enable_mask('mask-register')

        return false;
    });

    $('body').on('click', '.popup-register .close, #mask', function () {
        $('#mask.mask-register , .popup-register').fadeOut(300, function () {
            disable_mask('mask-register')
        });
        return false;
    });

    $('#form-register').on('click', '.register', function () {
        var name = $('#register-name');
        var id = $('#register-id');
        var password = $('#register-password');
        var confirm_password = $('#register-confirm-password');

        var name_check = /^[^\s]+.*[^\s]*$/g;
        var id_check = /^[a-z]+[a-z0-9_]*$/g;
        var password_check = /^[a-z0-9]+$/g;
        var confirm_password_check = /^[a-z0-9]+$/g;

        if (!name_check.test(name.val()))
            name.addClass("red-outline");
        else if (!id_check.test(id.val()))
            id.addClass("red-outline");
        else if (!password_check.test(password.val()))
            password.addClass("red-outline");
        else if (!confirm_password_check.test(confirm_password.val()))
            confirm_password.addClass("red-outline");
        else if (password.val() != confirm_password.val()) {
            confirm_password.addClass("red-outline");
        }
        else {
            var obj = new Object();
            obj.name = name.val();
            obj.id = id.val();
            obj.password = password.val();
            var json_data = JSON.stringify(obj);

            var request = $.ajax({
                url: "register.py",
                type: "POST",
                data: json_data,
                dataType: "json",
                timeout: 5000
            });
            enable_loading()
            request.done(function (data) { // 결과 받음 (json)
                if (data != null) {
                    if (data.error == 0) { // 성공
                        alert("가입 완료!");
                        console.log("가입 완료!");

                        $('#mask.mask-register , .popup-register').fadeOut(300, function () {
                            disable_mask('mask-register')
                        });
                    } else if (data.error == 1) {
                        alert("사용중인 이름입니다!");
                        name.val('');
                        name.addClass("red-outline");
                        console.log("가입 실패 - 사용중인 이름!");
                    } else if (data.error == 2) {
                        alert("사용중인 아이디입니다!");
                        id.val('');
                        id.addClass("red-outline");
                        console.log("가입 실패! - 사용중인 아이디");
                    } else {
                        console.log("가입 실패!");
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) { // 에러 발생
                console.log("가입 오류 발생!");
            });
            request.always(function (jqXHR, textStatus) { // 정리
                disable_loading()
            });

            return true;
        }
        return false;
    });
});


//==========로그인 팝업==========
$(document).ready(function () {
    $('.login-frame .login').click(function () {
        var id = $('#login-id');
        var password = $('#login-password');
        var popupBox = $('#login-box');

        id.val('');
        password.val('');

        $(popupBox).fadeIn(300);

        var popMargTop = ($(popupBox).height() + 24) / 2;
        var popMargLeft = ($(popupBox).width() + 24) / 2;

        $(popupBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });

        enable_mask('mask-login')

        return false;
    });

    $('body').on('click', '.popup-login .close, #mask', function () {
        $('#mask.mask-login , .popup-login').fadeOut(300, function () {
            disable_mask('mask-login')
        });
        return false;
    });

    $('#form-login').on('click', '.login', function () {
        var id = $('#login-id');
        var password = $('#login-password');
        
        var id_check = /^[a-z]+[a-z0-9_]*$/g;
        var password_check = /^[a-z0-9]+$/g;

        if (!id_check.test(id.val()))
            id.addClass("red-outline");
        else if (!password_check.test(password.val()))
            password.addClass("red-outline");
        else {
            var obj = new Object();
            obj.id = id.val();
            obj.password = password.val();
            var json_data = JSON.stringify(obj);

            var request = $.ajax({
                url: "login.py",
                type: "POST",
                data: json_data,
                dataType: "json",
                timeout: 5000
            });
            enable_loading()
            request.done(function (data) { // 결과 받음 (json)
                if (data != null) {
                    if (data.error == 0) { // 성공
                        console.log("로그인 완료!");
                        console.log(data.name);

                        Cookies.set('SESSION_ID', data.session_id, {domain: location.hostname});
                        Cookies.set('USER_NAME', data.name, { domain: location.hostname });

                        $('#mask.mask-login , .popup-login').fadeOut(300, function () {
                            disable_mask('mask-login')
                        });
                        set_state_login(data.name);
                    } else {
                        alert("잘못된 아이디/비밀번호 입니다!");
                        console.log("로그인 실패!");
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) { // 에러 발생
                console.log("로그인 오류 발생!");
            });
            request.always(function (jqXHR, textStatus) { // 정리
                disable_loading()
            });
            return true;
        }
        return false;
    });
});

//==========로그아웃==========
$('.login-frame .logout').click(function () {
    set_state_logout();
});

//==========카드 생성 팝업==========
$(document).ready(function () {
    $('button.new-card').click(function () {
        if (!Cookies.get('SESSION_ID')) {
            $('.login-frame .login').trigger("click");
            return false;
        }
        var title = $('#new-card-title');
        var contents = $('#new-card-contents');
        var image = $('#new-card-image');
        var popupBox = $('#new-card-box');

        title.val('');
        contents.val('');
        image.val('');
        
        $(popupBox).fadeIn(300);
        
        var popMargTop = ($(popupBox).height() + 24) / 2;
        var popMargLeft = ($(popupBox).width() + 24) / 2;

        $(popupBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });
        
        enable_mask('mask-new-card')

        return false;
    });
    
    $('body').on('click','.popup-new-card .close, #mask', function () {
        $('#mask.mask-new-card , .popup-new-card').fadeOut(300, function () {
            disable_mask('mask-new-card')
        });
        return false;
    });

    $('#form-new-card').on('click', '.create_new_card', function () {
        var title = $('#new-card-title');
        var contents = $('#new-card-contents');
        var image = $('#new-card-image');

        if (title.val() == '')
            title.addClass("red-outline");
        else if (contents.val() == '')
            contents.addClass("red-outline");
        else if (image.val() == '')
            image.addClass("red-outline");
        else {
            var obj = new Object();
                obj.title = title.val();
                obj.text = contents.val();
                obj.image = image.val();
            var json_data = JSON.stringify(obj);

            var request = $.ajax({
                url: "new-card.py",
                type: "POST",
                data: json_data,
                dataType: "json",
                timeout: 5000
            });
            enable_loading()
            request.done(function (data) { // 결과 받음 (json)
                if (data != null) {
                    if (data.error == 0) { // 성공
                        console.log("등록 완료!");
                    } else if (data.error == 10) {
                        console.log("등록 실패! - 세션 만료");
                        set_state_logout()
                    } else {
                        console.log("등록 실패!");
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) { // 에러 발생
                console.log("등록 오류 발생!");
            });
            request.always(function (jqXHR, textStatus) { // 정리
                disable_loading()
                $('#mask.mask-new-card , .popup-new-card').fadeOut(300, function () {
                    disable_mask('mask-new-card')
                });
                load_card_news()
            });

            return true;
        }
        return false;
    });
});

//==========카드 수정 팝업==========
$(document).ready(function () {
    $('body').on('click', '.popup-edit-card .close, #mask', function () {
        $('#mask.mask-edit-card , .popup-edit-card').fadeOut(300, function () {
            disable_mask('mask-edit-card')
        });
        return false;
    });

    $('#form-edit-card').on('click', '.edit_card_info', function () {
        var title = $('#edit-card-title');
        var contents = $('#edit-card-contents');
        var image = $('#edit-card-image');
        var id = $('#edit-card-box').data('card_id');
        
        if (title.val() == '')
            title.addClass("red-outline");
        else if (contents.val() == '')
            contents.addClass("red-outline");
        else if (image.val() == '')
            image.addClass("red-outline");
        else {
            var obj = new Object();
            obj.id = id;
            obj.title = title.val();
            obj.text = contents.val();
            obj.image = image.val();
            var json_data = JSON.stringify(obj);

            var request = $.ajax({
                url: "edit-card.py",
                type: "POST",
                data: json_data,
                dataType: "json",
                timeout: 5000
            });
            enable_loading()
            request.done(function (data) { // 결과 받음 (json)
                if (data != null) {
                    if (data.error == 0) { // 성공
                        console.log("수정 완료!");
                    } else if (data.error == 1) {
                        console.log("수정 실패! - 카드 없음");
                    } else if (data.error == 2) {
                        console.log("수정 실패! - 권한 없음");
                    } else if (data.error == 10) {
                        console.log("수정 실패! - 세션 만료");
                        set_state_logout()
                    } else {
                        console.log("수정 실패!");
                    }
                }
            });
            request.fail(function (jqXHR, textStatus) { // 에러 발생
                console.log("수정 오류 발생!");
            });
            request.always(function (jqXHR, textStatus) { // 정리
                disable_loading()
                $('#mask.mask-edit-card , .popup-edit-card').fadeOut(300, function () {
                    disable_mask('mask-edit-card')
                });
                load_card_news()
            });

            return true;
        }
        return false;
    });

    $('#form-edit-card').on('click', '.edit_card_pages', function () {
        var id = $('#edit-card-box').data('card_id');
        open_card_news_viewer(id, true);


        disable_loading()
        $('#mask.mask-edit-card , .popup-edit-card').fadeOut(300, function () {
            disable_mask('mask-edit-card')
        });
        return false;
    });
});

//==========카드 페이지 수정==========
$(document).ready(function () {
    $('#form-viewer').on('click', '.edit-page', function () {
        var id = $('#card-news-viewer').data('card_id');
        var page = $(this).parent().data('page')

        window.location = "/grapesjs-dev?id=" + id + "&page=" + page;
        //location.replace("/grapesjs-dev?id="+ id+"&page="+page);
    });

    $('#form-edit-card').on('click', '.edit_card_pages', function () {
        var id = $('#edit-card-box').data('card_id');
        open_card_news_viewer(id, true);


        disable_loading()
        $('#mask.mask-edit-card , .popup-edit-card').fadeOut(300, function () {
            disable_mask('mask-edit-card')
        });
        return false;
    });

    $('#form-viewer').on('click', '.add-page', function () {
        var id = $('#card-news-viewer').data('card_id');
        var page = $(this).parent().data('page')
        
        var obj = new Object();
        obj.id = id;
        obj.page = page;
        var json_data = JSON.stringify(obj);

        var request = $.ajax({
            url: "page_add.py",
            type: "POST",
            data: json_data,
            dataType: "json",
            timeout: 5000
        });
        enable_loading()
        request.done(function (data) { // 결과 받음 (json)
            if (data != null) {
                if (data.error == 0) { // 성공
                    console.log("추가 완료!");
                    location.replace("/?card_news_id="+ id+"&edit_mode=1");
                } else if (data.error == 1) {
                    console.log("추가 실패! - 카드 없음");
                } else if (data.error == 2) {
                    console.log("추가 실패! - 권한 없음");
                } else if (data.error == 10) {
                    console.log("추가 실패! - 세션 만료");
                    set_state_logout()
                } else {
                    console.log("추가 실패!");
                }
            }
        });
        request.fail(function (jqXHR, textStatus) { // 에러 발생
            console.log("추가 오류 발생!");
        });
        request.always(function (jqXHR, textStatus) { // 정리
            disable_loading()
            load_card_news()
        });
        //location.replace("/grapesjs-dev?id=" + id + "&page=" + page);
    });

    $('#form-viewer').on('click', '.delete-page', function () {
        var id = $('#card-news-viewer').data('card_id');
        var page = $(this).parent().data('page')

        var obj = new Object();
        obj.id = id;
        obj.page = page;
        var json_data = JSON.stringify(obj);

        var request = $.ajax({
            url: "page_delete.py",
            type: "POST",
            data: json_data,
            dataType: "json",
            timeout: 5000
        });
        enable_loading()
        request.done(function (data) { // 결과 받음 (json)
            if (data != null) {
                if (data.error == 0) { // 성공
                    console.log("삭제 완료!");
                    location.replace("/?card_news_id=" + id + "&edit_mode=1");
                } else if (data.error == 1) {
                    console.log("삭제 실패! - 카드 없음");
                } else if (data.error == 2) {
                    console.log("삭제 실패! - 권한 없음");
                } else if (data.error == 10) {
                    console.log("삭제 실패! - 세션 만료");
                    set_state_logout()
                } else {
                    console.log("삭제 실패!");
                }
            }
        });
        request.fail(function (jqXHR, textStatus) { // 에러 발생
            console.log("삭제 오류 발생!");
        });
        request.always(function (jqXHR, textStatus) { // 정리
            disable_loading()
            load_card_news()
        });

        //location.replace("/grapesjs-dev?id=" + id + "&page=" + page);
    });
    
});

//==========카드 내부 처리==========
share_active = null;
$(document).ready(function () {
    $(document).on('click', '.share-social', function (e) {
        if (share_active != null && this != share_active)
        {
            $(share_active).parent().find('.share-icon').removeClass('active');
            $(share_active).removeClass('fa-toggle-up');
            $(share_active).addClass('fa-share-alt');
        }

        e.preventDefault() // prevent default action - hash doesn't appear in url
        $(this).parent().find('.share-icon').toggleClass('active');
        $(this).toggleClass('fa-share-alt fa-toggle-up');
        share_active = this;
    });

    $(document).mousedown(function (event) {
        var target = $(event.target)[0];
        if (share_active != null && target != share_active && !$(share_active).parent().has(target).length)
        {
            $(share_active).parent().find('.share-icon').removeClass('active');
            $(share_active).removeClass('fa-toggle-up');
            $(share_active).addClass('fa-share-alt');
            share_active = null;
        }
    });


    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        if (!Cookies.get('SESSION_ID')) {
            $('.login-frame .login').trigger("click");
            return false;
        }

        var card = $(this).closest('.card');
        var obj = new Object();
        obj.id = card.data('card_id');
        var json_data = JSON.stringify(obj);

        var request = $.ajax({
            url: "delete-card.py",
            type: "POST",
            data: json_data,
            dataType: "json",
            timeout: 5000
        });
        enable_loading()
        request.done(function (data) { // 결과 받음 (json)
            if (data != null) {
                if (data.error == 0) { // 성공
                    console.log("삭제 완료!");
                } else if (data.error == 1) {
                    console.log("삭제 실패! - 카드 없음");
                } else if (data.error == 2) {
                    console.log("삭제 실패! - 권한 없음");
                } else if (data.error == 10) {
                    console.log("삭제 실패! - 세션 만료");
                    set_state_logout()
                } else {
                    console.log("삭제 실패!");
                }
            }
        });
        request.fail(function (jqXHR, textStatus) { // 에러 발생
            console.log("삭제 오류 발생!");
        });
        request.always(function (jqXHR, textStatus) { // 정리
            disable_loading()
            load_card_news()
        });
    });

    $(document).on('click', '.edit', function (e) {
        if (!Cookies.get('SESSION_ID')) {
            $('.login-frame .login').trigger("click");
            return false;
        }
        var card = $(this).closest('.card');
        var title = $('#edit-card-title');
        var contents = $('#edit-card-contents');
        var image = $('#edit-card-image');
        var popupBox = $('#edit-card-box');

        popupBox.data('card_id', card.data('card_id'));

        title.val(card.find('.title a').html());
        contents.val(card.find('.text').html());
        image.val(card.data('image'));
        
        $(popupBox).fadeIn(300);
        
        var popMargTop = ($(popupBox).height() + 24) / 2;
        var popMargLeft = ($(popupBox).width() + 24) / 2;

        $(popupBox).css({
            'margin-top': -popMargTop,
            'margin-left': -popMargLeft
        });
        
        enable_mask('mask-edit-card')

        return false;
    });


    $(document).on('click', '.card .title', function (e) {
        e.preventDefault();
        var card = $(this).closest('.card');

        open_card_news_viewer(card.data('card_id'))
        //$('.popup-viewer').fadeIn(300);
    });

    $('body').on('click', '.popup-viewer .close, #mask.mask-viewer', function () {
        $('#mask.mask-viewer').fadeOut(300);
        $('.popup-viewer').animate({ opacity: 0 }, 300, 'linear', function () {
            $('.popup-viewer').css({ "visibility": "hidden" });
            disable_mask('mask-viewer')
        });
        return false;
    });
});

//==========SNS 공유==========
function share(site, url) {
    if (site == 'facebook')
    {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' +
            encodeURIComponent(url) +
            '&t='
            + encodeURIComponent(document.title),
            'facebooksharedialog',
            'menubar=no, toolbar=no, resizable=yes, scrollbars=yes, height=300, width=600');
    }
    else if (site == 'twitter') {
        window.open('https://twitter.com/intent/tweet?text=' +
            encodeURIComponent(url) +
            ' ' + encodeURIComponent(document.title),
            'twittersharedialog',
            'menubar=no, toolbar=no, resizable=yes, scrollbars=yes, height=300, width=600');
    }
    else if (site == 'google') {
        window.open('https://plus.google.com/share?url=' +
            encodeURIComponent(url),
            'googleplussharedialog',
            'menubar=no, toolbar=no, resizable=yes, scrollbars=yes, height=600, width=400');
    }
}


//==========카드 로드==========
function load_card_news(complete_function) {
    var table = document.getElementById("card-table");
    var save_scrollLeft = table.scrollLeft;
    var save_scrollTop = table.scrollTop;
    while (table.hasChildNodes()) {
        table.removeChild(table.firstChild);
    }
    
    //동적으로 원격에 있는 JSON 파일(결과값)을 로드
    $.ajax({
        url: "load-cards.py",
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            //받아온 JSON을 테이블에 출력
            $.each(data, function (index, entry) {
                for (i = 0; i < entry.length; i++) {
                    var card = entry[i]
                    make_card(card["author"], card["title"], card["text"], card["image"], card["id"], card["pages"])
                }
            });
        },
        error: function () { console.log("카드 로드 에러 발생"); },
        complete: function () {
            table.scrollLeft = save_scrollLeft;
            table.scrollTop = save_scrollTop;
            if (complete_function) {
                complete_function();
            }
        }
    });
}

//==========세션 체크==========
function session_check() {
    $.ajax({
        url: "session-check.py",
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            if (data != null) {
                if (data.error == 0) {
                    set_state_login(Cookies.get('USER_NAME'))
                } else {
                    console.log("세션체크 - 세션 만료됨");
                    set_state_logout();
                }
            }
        },
        error: function () { console.log("세션체크 에러"); },
        complete: function () {
        }
    });
}

//==========마스크==========
function enable_loading() {
    $('body').append('<div id="loading"> <img src="loading.gif" alt="loading..."> </div>');
    $('#loading').fadeIn(300);
}

function disable_loading() {
    $('#loading').fadeOut(300, function () {
        $('#loading').remove();
    });
}

function enable_mask(name) {
    $('body').append('<div id="mask" class="' + name + '"></div>');
    $('#mask.' + name).fadeIn(300);
}

function disable_mask(name) {
    $('#mask.' + name).fadeOut(300, function () {
        $('#mask.' + name).remove();
    });
}

//==========함수==========

function getQuerystring(paramName) {
    var tempUrl = window.location.search.substring(1); //url에서 처음부터 '?'까지 삭제
    var tempArray = tempUrl.split('&'); // '&'을 기준으로 분리하기
    for (var i = 0; i < tempArray.length; i++) {
        var keyValuePair = tempArray[i].split('='); // '=' 을 기준으로 분리하기
        if (keyValuePair[0] == paramName) { // _keyValuePair[0] : 파라미터 명
            // _keyValuePair[1] : 파라미터 값
            return keyValuePair[1];
        }
    }
}

function open_card_news_viewer(id, edit_mode) {
    if (edit_mode) {
        $('#card-news-viewer').addClass('edit-mode');
        $('#card-news-viewer').data('card_id', id)
    } else {
        $('#card-news-viewer').removeClass('edit-mode');
    }

    var pages = $('.card[data-card_id="' + id + '"]').data('pages')
    var form_viewer = document.getElementById("form-viewer");
    while (form_viewer.hasChildNodes()) {
        form_viewer.removeChild(form_viewer.firstChild);
    }

    var lazy = document.createElement('section');
    lazy.className = "lazy slider";
    lazy.dataset.sizes = '50vw';
    form_viewer.appendChild(lazy);

    var slider = document.getElementsByClassName("lazy");
    console.log(slider)

    var i = 1;
    for (i = 1; i <= pages; i++) {
        var page = document.createElement('div');
        page.className = "slider-box";
        page.dataset.page = i;

        var iframe = document.createElement('iframe');
        iframe.src = "/cards/" + id + "/" + i + ".html";
        iframe.width = 500;
        iframe.height = 700;
        iframe.scrolling = 'no';
        page.appendChild(iframe);
        
        if (edit_mode) {
            var edit = document.createElement('button');
            edit.type = 'button';
            edit.className = 'button-s2 edit-page';
            edit.innerHTML = 'Edit';
            page.appendChild(edit);

            var del = document.createElement('button');
            del.type = 'button';
            del.className = 'button-s2 delete-page';
            del.innerHTML = 'Delete';
            page.appendChild(del);
        }

        slider[0].appendChild(page);
    }
    if (edit_mode) {
        var page = document.createElement('div');
        page.className = "slider-box";
        page.dataset.page = i;

        var add_box = document.createElement('div');
        add_box.className = "bd-box";
        page.appendChild(add_box);

        var edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'button-s2 add-page';
        edit.innerHTML = 'New';
        page.appendChild(edit);

        slider[0].appendChild(page);
    }

    $(".lazy").slick({
        lazyLoad: 'ondemand', // ondemand progressive anticipated
        infinite: true
    });

    $('.popup-viewer').css({ "visibility": "visible" });
    $('.popup-viewer').animate({ opacity: 1 }, 300)

    enable_mask('mask-viewer')
}

function set_state_login(name) {
    $('.login-frame .user-name').html(name)
    
    $('.not-logged-in').hide();
    $('.logged-in').show();
}

function set_state_logout() {
    $('.logged-in').hide();
    $('.not-logged-in').show();

    Cookies.remove('SESSION_ID');
    Cookies.remove('USER_NAME');
}