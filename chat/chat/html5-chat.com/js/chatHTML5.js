//console.log("%cWelcome to chat", "color: #1BA3F9; font-size: 4em");
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function ago(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 0) {
        return interval + " y. ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
        return interval + " mon. ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
        return interval + " d. ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
        return interval + " h ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
        return interval + " min. ago";
    }
    return 'now';
}

function detectmob() {
    if(screen.width <= 800) {
        return true;
    } else {
        return false;
    }
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time = hours+':'+minutes+':'+seconds;
    return time;
};

String.prototype.linkify = function() {
    var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
    var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    return this
        .replace(urlPattern, '<a target="_blank" href="../$&">$&</a>')
        .replace(pseudoUrlPattern, '$1<a target="_blank" href="http://$2">$2</a>')
        .replace(emailAddressPattern, '<a target="_blank" href="mailto:$&">$&</a>');
};

var playerQuizYoutube;

function onYouTubeIframeAPIReady() {
    playerQuizYoutube = new YT.Player('youtubeQuiz', {
        width: 320,
        height: 240,
        playerQuizYoutubeVars: {
            color: 'white',
        },
        events: {
            //onReady: initialize
        }
    });
}


var ChatHTML5 = function(room, config, traductions) {
    this.room = room;
    var colors = ['#FF0000','#CC0000','#AA0000','#880000','#440000','#000000','#440000','#880000','#AA0000','#CC0000','#FF0000'];
    var colorsIndex = 0;
    this.timeCounter = 0;
    this.timeCounterInterval = {};
    this.config = config;
    this.users = {};
    this.rooms = {};
    this.muted = {};
    this.forbiddenToWatchMe = {};
    this.news = {};
    this.genders = {};
    this.currentTalkerid = 0;
    this.forbiddenWords = Array();
    this.privateInvitations = {};
    this.traductions = traductions;
    var tabs = $('#tabs').bootstrapDynamicTabs();

    $('#webcamsContainer').sortable({cancel:'.webcamClass'});
    $('#webcamsContainer').disableSelection();
    for (var i = 0, len = config.genders.length; i < len; i++) {
        this.genders[config.genders[i].gender] = config.genders[i];
    }

    //factoryjoe.com/projects/emoticons/
    // www.symbols-n-emoticons.com/p/hidden-skype-emoticons.html
    this.smileys = {
        ":o":'<img src="/img/smileys/agape.gif">',
        ":@":'<img src="/img/smileys/angry.gif">',
        "(arf)":'<img src="/img/smileys/arf.png">',
        "(assleep)":'<img src="/img/smileys/assleep.png">',
        ":$":'<img src="/img/smileys/bashful.png">',
        ":d":'<img src="/img/smileys/bigSmile.gif">',
        ":D":'<img src="/img/smileys/smile.gif">',
        ":|":'<img src="/img/smileys/bored.png">',
        ":s":'<img src="/img/smileys/confused.png">',
        ":<(":'<img src="/img/smileys/crying.gif">',
        "(dead)":'<img src="/img/smileys/dead.png">',
        "(delicious)":'<img src="/img/smileys/delicious.png">',
        "(evil)":'<img src="/img/smileys/evil.gif">',
        "(evilCool)":'<img src="/img/smileys/evilCool.png">',
        ":(":'<img src="/img/smileys/frown.png">',
        "(heart)":'<img src="/img/smileys/heart.png">',
        "(k)":'<img src="/img/smileys/kiss.png">',
        "(littleLaugh)":'<img src="/img/smileys/littleLaugh.png">',
        "(mad)":'<img src="/img/smileys/mad.png">',
        "(nerd)":'<img src="/img/smileys/nerd.gif">',
        "(notEven)":'<img src="/img/smileys/notEven.png">',
        "(rly)":'<img src="/img/smileys/rly.png">',
        "(sarcasm)":'<img src="/img/smileys/sarcasm.png">',
        "(skocked)":'<img src="/img/smileys/shocked.png">',
        "(sick)":'<img src="/img/smileys/sick.png">',
        ":p":'<img src="/img/smileys/silly.png">',
        "(sing)":'<img src="/img/smileys/sing.png">',
        ":)":'<img src="/img/smileys/smile.png">',
        "(smitten)":'<img src="/img/smileys/smitten.png">',
        "(stress)":'<img src="/img/smileys/stress.png">',
        "(sunglasses)":'<img src="/img/smileys/sunglasses.png">',
        "(whistle)":'<img src="/img/smileys/whistle.png">',
        ";)":'<img src="/img/smileys/wink.gif">',
        "(beer)":'<img src="/img/smileys/beer.gif">',
        "(blush)":'<img src="/img/smileys/blush.gif">',
        "(cake)":'<img src="/img/smileys/cake.gif">',
        "(bug)":'<img src="/img/smileys/bug.gif">',
        "(call)":'<img src="/img/smileys/call.gif">',
        "(clap)":'<img src="/img/smileys/clap.gif">',
        "(cool)":'<img src="/img/smileys/cool.gif">',
        "(doh)":'<img src="/img/smileys/doh.gif">',
        "(drunk)":'<img src="/img/smileys/drunk.gif">',
        "(finger)":'<img src="/img/smileys/finger.gif">',
        "(fubar)":'<img src="/img/smileys/fubar.gif">',
        "(handshake)":'<img src="/img/smileys/handshake.gif">',
        "(hi)":'<img src="/img/smileys/hi.gif">',
        "(inlove)":'<img src="/img/smileys/inlove.gif">',
        "(mm)":'<img src="/img/smileys/mm.gif">',
        "(no)":'<img src="/img/smileys/no.gif">',
        "(party)":'<img src="/img/smileys/party.gif">',
        "(puke)":'<img src="/img/smileys/puke.gif">',
        "(rain)":'<img src="/img/smileys/rain.gif">',
        "(rock)":'<img src="/img/smileys/rock.gif">',
        "(sad)":'<img src="/img/smileys/sad.gif">',
        "(shake)":'<img src="/img/smileys/shake.gif">',
        "(snooze)":'<img src="/img/smileys/snooze.gif">',
        "(sun)":'<img src="/img/smileys/sun.gif">',
        "(sweat)":'<img src="/img/smileys/sweat.gif">',
        "(time)":'<img src="/img/smileys/time.gif">',
        "(tmi)":'<img src="/img/smileys/tmi.gif">',
        "(wasntme)":'<img src="/img/smileys/wasntme.gif">',
        "(yes)":'<img src="/img/smileys/yes.gif">',
        "(yawn)":'<img src="/img/smileys/yawn.gif">'
    };

    function getParentUrl() {
        var isInIframe = (parent !== window),parentUrl = null;

        if (isInIframe) {
            parentUrl = document.referrer;
        }
        return parentUrl;
    }
    // protection
    if (config.urlProtection) {
        var referer = getParentUrl();
        if (referer && referer.indexOf(config.urlProtection)==-1) {
            window.location = config.quitUrl;
        }

    }



    this.parseSmileys = function(text) {
        for (var symbol in this.smileys) {
            var image = this.smileys[symbol];
            text = text.replaceAll(symbol,image);
        }
        return text;
    };

    this.createSmileys = function() {
        for (var smiley in this.smileys) {
            var temp = sprintf("<div class='smileyItem' data-smiley='%s' title='%s'>%s</div>", smiley, smiley, this.smileys[smiley]);
            $("#smileyContainer").append(temp);
        }
    };

    this.getDefaultUser = function() {
        var defaultUser = {};
        var gender = chatHTML5.genders[Object.keys(chatHTML5.genders)[0]].gender;
        var randomAvatar = chatHTML5.getUserAvatar(gender);
        var username = 'guest' + Math.round(Math.random()*1000);

        defaultUser = {id:new Date().getTime(), username:username, isGuest:true, image: randomAvatar, gender:gender};
        defaultUser.agent = navigator.userAgent.toLowerCase();
        defaultUser.hasFlash = 	(swfobject.hasFlashPlayerVersion('10.0.0'));
        defaultUser.hasWebcam = (swfobject.hasFlashPlayerVersion('10.0.0'));
        var hasWebrtc = (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        if (hasWebrtc) {
            defaultUser.hasWebrtc =  true;
        } else {
            defaultUser.hasWebrtc =  false;
        }


        defaultUser.room = chatHTML5.room;
        defaultUser.webcam = false;
        defaultUser.status = chatHTML5.traductions.online;
        defaultUser.webcamPublic = (chatHTML5.config.webcamPublic==='1');
        defaultUser.privateOnlyOnInvitation = !$(this).prop('checked');
        return defaultUser;
    };

    this.start = function(myuser) {
        console.log('start Chat');


        if (chatHTML5.room.webcam==='0') {
            $('#webcamBtn').parent().hide();
        } else {
            $('#webcamBtn').parent().show();
        }
        $('#colorPicker').colorPicker();
        if (chatHTML5.room.colorPicker==='0') {
            $('#colorPickerContainer').hide();
        } else {
            $('#colorPickerContainer').show();
        }

        this.createSmileys();
        this.initPushToTalk();
        //$('#userList').perfectScrollbar();
        // pre-filled webmaster


        if (myuser && myuser.isAdmin) {
            $.post(chatHTML5.config.ajax, {a:'loginWebmaster', email:myuser.email, password: myuser.password}, function(res) {
                console.log(res);
                if (res==='ko') {
                    window.top.location.href = 'admin/logout.php';
                } else {
                    chatHTML5.enterAsAdmin(myuser);
                }
            });
            return;
        }
        // pre-filled user : autologin

        if (myuser && myuser.username) {
            chatHTML5.myUser = chatHTML5.getDefaultUser();
            jQuery.extend(chatHTML5.myUser , myuser);
            if (chatHTML5.myUser.image=='') {
                var gender = chatHTML5.genders[Object.keys(chatHTML5.genders)[0]].gender;
                chatHTML5.myUser.image = chatHTML5.getUserAvatar(gender);
            }

            $('#myAvatar img').prop('src', chatHTML5.myUser.image).prop('title', chatHTML5.myUser.username);
            $('.menuUserItem[data-action="avatar"]').hide();
            chatHTML5.loggedOn();
            return;
        }

        if (this.config.guestAllowed === '1') {
            $('#loginGuestModal').modal('show');
            $('#usernameGuestLogin').focus();
        } else {
            $('#loginModal').modal('show');
            $('#usernameLogin').focus();
        }
    };

    this.enterAsAdmin = function(myuser) {
        chatHTML5.myUser = chatHTML5.getDefaultUser();
        jQuery.extend(chatHTML5.myUser , myuser);
        chatHTML5.myUser.isAdmin = true;

        if (!chatHTML5.myUser.image) {
            chatHTML5.myUser.image = '/img/avatars/admin.svg';
        }
        chatHTML5.loggedOn();
        $('#myAvatar img').prop('src', chatHTML5.myUser.image).prop('title', chatHTML5.myUser.username);
        $('.menuUserItem[data-action="avatar"]').hide();

    };


    this.stripHTML = function(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return (div.textContent || div.innerText || '');
    };

    this.clearChat = function() {
        $("#chat").empty();
    };

    this.test = function() {
        $("#overlayRegister").slideToggle();
    };

    this.clearLocal = function() {
        localStorage.removeItem("username");
        localStorage.removeItem("privateConfig");
        localStorage.removeItem("soundConfig");
        localStorage.removeItem("notificationConfig");
        localStorage.removeItem("hasWebcam");
    };


    this.getCurrentTab = function() {
        return tabs.getCurrent();
    };


    this.scrollActiveChatToBottom = function(duration) {
        var temp = sprintf('.tab-pane.active');
        $chat = $(temp);
        if ($chat && $chat[0]) {
            $chat.animate({scrollTop: $chat[0].scrollHeight}, duration);
        }
    };


    this.filterBadWord = function(str) {
        if (!chatHTML5.forbiddenWords.length) {
            return str;
        }
        var regex = new RegExp(chatHTML5.forbiddenWords.join('|'), 'gi');
        switch (chatHTML5.config.actionOnForbiddenWord) {
            case 'nothing':
                return str;
            case 'hide':
                return str.replace(regex, '*');
            case 'kick':
                if (str.match(regex)) {
                    chatHTML5.kicked(chatHTML5.traductions.youHaveBeenKicked);
                    return false;
                } else {
                    return str;
                }
        }
    };

    this.getForbiddenWords = function() {
        return;
        $.post(chatHTML5.config.ajax, {a:'getForbiddenWords'}, function(forbiddenWords) {
            forbiddenWords = JSON.parse(forbiddenWords);
            for(index in forbiddenWords) {
                var forbiddenWord = forbiddenWords[index];
                chatHTML5.forbiddenWords.push(forbiddenWord.word);
            }
        });
    };

    this.addPrivateChat = function(id, username) {
        if (!chatHTML5.users[id]) {
            return;
        }
        if (chatHTML5.config.chatType==='window') {
            var temp = sprintf('#chatContainer div.jsPanel[data-id="%s"]', id);
            console.log(temp);
            if ($(temp).length) {
                return;
            } else {
                var content = sprintf('\
				<div class="windowChat"></div>\
				<div class="windowInputContainer">\
					<input type="text" class="windowInputChat" placeHolder="Chat with %s">\
					<i class="fa fa-eraser windowEraser" title="%s"></i>\
				</div>\
				', username, chatHTML5.traductions.cleanChat);

                var user = chatHTML5.users[id];
                var header = sprintf('<span><img src="%s" class="userAvatar"></span>', user.image);
                $.jsPanel({
                    selector: '#tabs',
                    title:    username,
                    position: 'center',
                    content:  content,
                    toolbarHeader: [{item: header}],
                    id:id
                });
            }
        } else {
            //tab
            if  ($('.nav-tabs:not(.nav-tabs-clone)').find('li').find('a[href="#' + id + '"]').length) {
                return;
            }
            var image = sprintf('<img src="%s" class="userTabAvatar">', chatHTML5.users[id].image);
            var title = sprintf('%s %s <div class="unread" title="%s"></div>&nbsp;&nbsp;', image, username,  chatHTML5.traductions.unreadMessages);
            tabs.addTab({id: id, title: title, closable: true, room:false, label:username, selected:false});
            $('#'+id).perfectScrollbar();
        }

    };

    this.addOrSelectPrivateChat = function(id, username, selected) {
        selected = typeof selected !== 'undefined' ? selected : false;
        if (chatHTML5.config.chatType==='window') {
            var temp = sprintf('#chatContainer div.jsPanel[data-id="%s"]', id);
            console.log(temp);
            if ($(temp).length) {
                $(temp).click();
            } else {
                var content = sprintf('\
				<div class="windowChat"></div>\
				<div class="windowInputContainer">\
					<input type="text" class="windowInputChat" placeHolder="chat with %s">\
					<i class="fa fa-eraser windowEraser" title="%s"></i>\
				</div>\
				', username, chatHTML5.traductions.cleanChat);

                var user = chatHTML5.users[id];
                var header = sprintf('<span><img src="%s" class="userAvatar"></span>', user.image);
                $.jsPanel({
                    selector: '#tabs',
                    title:    username,
                    position: 'center',
                    content:  content,
                    toolbarHeader: [{item: header}],
                    id:id
                });
            }
        } else {
            //tab
            var image = sprintf('<img src="%s" class="userTabAvatar">', chatHTML5.users[id].image);
            var title = sprintf('%s %s <div class="unread" title="%s"></div>&nbsp;&nbsp;', image, username, chatHTML5.traductions.unreadMessages );
            tabs.addTab({id: id, title: title, closable: true, room:false, label:username, selected:selected});
            $("#"+id).perfectScrollbar();
        }
    };

    $(document).on('tabChanged', function(e, o) {
        var temp = sprintf("a[data-id='%s'] div.unread", chatHTML5.getCurrentTab().id);
        $(temp).empty();
        temp = (o.room)?sprintf('Chat in %s', o.label):sprintf('Chat with %s', o.label);
        $("#chatInput").attr('placeholder', temp);
    });

    $(document).on('tabClosed', function(e, o) {
        chatHTML5.socket.emit('privateClosed', o.id);
    });

    $(document).on('jspanelclosed', function closeHandler(event, id) {
        chatHTML5.socket.emit('privateClosed',id);
    });

    this.isMobile = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };


    this.sendText = function() {
        if (!chatHTML5.checkAllowToGuest()) {
            return;
        }
        var texte = $('#chatInput').val();
        var plainText = $('#chatInput').val();
        if (plainText==='') {
            return;
        }

        var currentTab = chatHTML5.getCurrentTab();
        $('#chatInput').val('');
        if (currentTab.room) {
            plainText = chatHTML5.filterBadWord(plainText);
            var extras = {color:$('#colorPicker').val()};
            chatHTML5.socket.emit('send', this.myUser,  plainText, extras);
        } else {
            plainText = chatHTML5.filterBadWord(plainText);
            chatHTML5.socket.emit('sendPrivate', this.myUser, plainText, currentTab.id);
            var destinationUser = jQuery.extend(true, {}, chatHTML5.myUser);
            destinationUser.id = currentTab.id;
            chatHTML5.receivePrivate(destinationUser, plainText);
        }
        chatHTML5.saveChat(plainText, chatHTML5.myUser.id, chatHTML5.myUser.username, chatHTML5.myUser.room.id);
        $('#chatInput').prop('disabled', true);
        setTimeout(function() {
            $('#chatInput').prop('disabled', false).focus();
        }, parseInt(chatHTML5.config.timerUserCanSendAgain));

    };

    this.saveChat = function(username, message) {
        if (chatHTML5.config.saveMessages!=='1') {
            return;
        }
        $.post(chatHTML5.config.ajax, {a:'saveMessage', username:username, message:message, roomid:chatHTML5.myUser.room.id}, function(res) {
            console.log(res);
        });
    };

    this.welcome = function() {
        var welcomeMessage = chatHTML5.myUser.room.welcome;
        var image = (chatHTML5.myUser.room.image!=='')?sprintf('<img class="roomImage" src="/upload/rooms/%s">', chatHTML5.myUser.room.image):'';
        welcomeMessage = welcomeMessage.replace(/{{username}}/g, chatHTML5.myUser.username).replace(/{{room}}/g, chatHTML5.myUser.room.name).replace(/{{image}}/g, image);
        localStorage.setItem('username', this.myUser.username);
        this.serverMessage(welcomeMessage, 'welcome');
        if ((chatHTML5.myUser.free || chatHTML5.myUser.expired) && parseInt(chatHTML5.myUser.entries)>100) {
            bootbox.alert(chatHTML5.traductions['Free HTML5-chat.com. Please register to get your own copy']);
        }
    };

    this.serverMessageCurrentTab = function(texte, className) {
        var roomid = sprintf('room_%s', chatHTML5.myUser.room.id);
        var $chat = $('div.tab-pane.active');
        $chat.append(sprintf("<div class='serverText %s'>%s</div>", className, texte));
        $chat.animate({ scrollTop: $chat[0].scrollHeight}, 200);
    };

    this.serverMessage = function(texte, className) {
        var roomid = sprintf('room_%s', chatHTML5.myUser.room.id);
        var $chat = chatHTML5.$getChat(roomid);
        $chat.append(sprintf("<div class='serverText %s'>%s</div>", className, texte));
        $chat.animate({ scrollTop: $chat[0].scrollHeight}, 200);
    };


    this.serverInfoMessage = function(texte, className) {
        if (chatHTML5.config.showMessageServer=='0') {
            return;
        }
        var roomid = sprintf('room_%s', chatHTML5.myUser.room.id);
        var $chat = chatHTML5.$getChat(roomid);
        $chat.append(sprintf("<div class='serverText %s'>%s</div>", className, texte));
        $chat.animate({ scrollTop: $chat[0].scrollHeight}, 200);
    };



    $('#soundCheckBox').change(function() {
        if (!$('#soundCheckBox').prop('checked')) {
            if (document.getElementById('pushToTalkSWF')) {
                document.getElementById('pushToTalkSWF').stopAudio();
            }
        } else {
            if (chatHTML5.currentTalkerid) {
                if (document.getElementById('pushToTalkSWF')) {
                    document.getElementById('pushToTalkSWF').playAudio(chatHTML5.currentTalkerid);
                }
            }
        }
    })
    this.playMP3 = function(mp3file) {
        if (!mp3file || !$('#soundCheckBox').prop('checked')) {
            return;
        }
        var snd = new Audio(mp3file);
        snd.play();
    };

    this.receiveText = function(user, message, extras) {
        if (this.muted[user.id]) {
            return;
        }
        if (user.username!==chatHTML5.myUser.username) {

        }
        // semi private message ?
        var classePrivate = '';
        var date = new Date().toLocaleTimeString();
        message = chatHTML5.parseSmileys(message);

        if (message.indexOf('➡')!=-1) {
            extras.color = '#398439';
            classePrivate = 'addPrivateMessage';
            var templateMessage = sprintf('\
                <div class="message %s">\
                    <img src="%s" alt="%s" >\
                        <span>\
                            <span class="timeStamp">%s</span>\
                            <span class="content" style="color:%s">%s</span>\
                        </span>\
                    </div>',
                classePrivate,
                user.image, user.username,
                date, extras.color, message);
        } else {
            var templateMessage = sprintf('\
                <div class="message %s">\
                    <img src="%s" alt="%s" >\
                        <span>\
                            <span class="userItem" title="Ask private chat with %s" data-id="%s" data-username="%s">%s</span>\
                            <span class="timeStamp">%s</span>\
                        </span>\
                        <span class="content" style="color:%s">: %s</span>\
                    </div>',
                classePrivate,
                user.image, user.username,
                user.username, user.id, user.username, user.username,
                date, extras.color, message);
        }

        var roomid = sprintf('room_%s', chatHTML5.myUser.room.id);
        var $chat = chatHTML5.$getChat(roomid);
        $chat.animate({ scrollTop: $chat[0].scrollHeight}, 200);
        $(templateMessage).hide().appendTo($chat).fadeIn(500);

        var temp = "a[data-room=true] div.unread";
        if (chatHTML5.getCurrentTab().room) {
            $(temp).empty();
        } else {
            var value = $(temp).text();
            if 	(value==='') {
                value = 1;
            } else {
                value = (parseInt(value)+1);
            }
            $(temp).text(value);
        }
    };


    this.addRandomUsers = function() {
        for (var i=0;i<50;i++) {
            var user = {username:'user_'+i, id:i*1000, gender:'visiteur', status:chatHTML5.traductions.online, webcam:false, image:'https://93.115.97.74/img/avatars/m/9.svg'};
            chatHTML5.addUser(user);
        }
    };

    this.incrementPointsQuiz = function(userid) {
        var temp = sprintf('div.userItem[data-id=%s] div.pointsQuiz', userid);
        var points = parseInt($(temp).text());
        points++;
        $(temp).text(points).removeClass('hidden');
    }


    this.addUser = function(user) {
        if (chatHTML5.users[user.id]) {
            return;
        }
        //console.log("addUser", user);
        var webcamClass = (user.webcam)?'visible':'hidden';
        var mutedClass = chatHTML5.muted[user.id]?'muted':'';

        chatHTML5.users[user.id] = user;
        var webcamLock = (user.webcamPublic)?'<i class="fa lock fa-unlock"></i>':'<i class="lock fa fa-lock"></i>';
        var genderStyle = 'color:000';

        if (user.gender && chatHTML5.genders[user.gender]) {
            genderStyle = sprintf("color:%s", chatHTML5.genders[user.gender].color);
        }
        var classStatus = 'online';
        if (user.status===chatHTML5.traductions.offline) {
            classStatus = 'offline';
        }
        if (user.status===chatHTML5.traductions.busy) {
            classStatus = 'busy';
        }
        var classPoints = (user.points>0)?'visible':'hidden';

        //console.log('genderStyle', genderStyle);
        var disableClass = (user.username===chatHTML5.myUser.username)?'disabled':'';
        var handClasse = (chatHTML5.config.chatType==='conference' && chatHTML5.myUser.isAdmin)?'':'hidden';
        var itemTemplate = sprintf('\
        <div data-id=%s data-username="%s" data-gender="%s" class="userItem %s %s" style="%s">\
			<button class="btn btn-info hand %s" title="Play that video in conference"><i class="fa fa-hand-o-right" aria-hidden="true"></i></button>\
			<img src="%s" alt="%s">\
			<div class="status %s"></div>\
			<div class="pointsQuiz %s" title="points jeu Quiz">%s</div>\
			<div class="keyboard" title="%s"><i class="fa fa-keyboard-o"></i></div>\
			<div class="userLabel">%s</div>\
			<div class="pull-right webcamBtn %s"><i class="fa fa-video-camera fa-2x"></i>%s</div>\
			<div class="pull-right "><i class="fa fa-eye fa-2x hidden" title="%s"></i></div>\
		</div>',
            user.id, user.username, user.gender, mutedClass, disableClass, genderStyle,
            handClasse,
            user.image, user.username,
            classStatus,
            classPoints, user.points,
            chatHTML5.traductions.isWriting,
            user.username, webcamClass, webcamLock,
            chatHTML5.traductions.watchesMe);
        if (user.talks) {
            chatHTML5.talks(user);
        }

        $('#userList').append(itemTemplate);
        chatHTML5.updateNumberUsersDisplay();
        if (chatHTML5.config.chatType==='conference' && user.isAdmin) {
            this.playConference(user, user.webcam);
        }
        if (user.broadcast) {
            chatHTML5.addWebcam(user.id, user.username, user.broadcast)
        }
        chatHTML5.searchUsers();
    };

    $(document).on('click','.hand', function(e) {
        e.stopPropagation();
        var value = $(this).hasClass('handActive');
        var id = $(this).parent().data('id');
        $('.hand').removeClass('handActive');
        var user = chatHTML5.users[id];
        if (!user) {
            return;
        }
        if (value) {
            $(this).removeClass('handActive');
            chatHTML5.playConference(user, false);
        } else {
            $(this).addClass('handActive');
            chatHTML5.playConference(user, true);
        }
    });

    this.updateNumberUsersDisplay = function() {
        var number = Object.keys(chatHTML5.users).length;
        $('#onlineCounter').text(number);
    };

    this.initPushToTalk = function() {
        var flashvars = {rtmp:chatHTML5.config.rtmp, xml:'webcam.xml.php'};
        var params = {allowfullscreen : 'false', menu : 'false', quality : 'best', scale : 'exactfit', wmode : 'transparent'};
        var attributes = {id : 'pushToTalkSWF', name : 'pushToTalkSWF'};
        swfobject.embedSWF('/swf/audio.swf', 'pushToTalkSWFContainer', '100%', '120', '10.0.0', 'expressInstall.swf', flashvars, params, attributes);
    }

    this.addPushToTalkSWF = function(user) {
        chatHTML5.currentTalkerid = user.id;
        if (chatHTML5.muted[user.id]) {
            return;
        }
        if ($('#soundCheckBox').prop('checked')) {
            if (document.getElementById('pushToTalkSWF')) {
                try {
                    document.getElementById('pushToTalkSWF').playAudio(user.id);
                } catch (e) {

                }
            }
        }
    }

    this.talks = function(user) {
        console.log('***talks', user);
        $('#pushTalkBtn').css('pointer-events', 'auto').css('display', 'none');
        //$('#pushToTalkWindow').slideDown(500);
        $('#pushToTalkWindow').fadeTo('slow' ,1);

        var temp = sprintf(chatHTML5.traductions.userIsTalking, user.username);
        $('#pushToTalkWindowHeader').html(temp);
        if (user.username!=chatHTML5.myUser.username) {
            this.addPushToTalkSWF(user);
            $('#pushToTalkFreeHand').css('display', 'none');

        }
        // display his webcam !
    }

    this.stopTalks = function(user) {
        chatHTML5.currentTalkerid = 0;
        $('#pushTalkBtn').css('pointer-events', 'auto').css('display', 'block');
        $('#pushToTalkWindow').css('pointer-events', 'none');
        //$('#pushToTalkWindow').slideUp(500);
        $('#pushToTalkWindow').fadeTo('slow' ,0);
        document.getElementById('pushToTalkSWF').stopAudio();
        $('#pushToTalkFreeHand').css('display', 'block');
        if (user && user.username) {
            var temp = sprintf(chatHTML5.traductions.userStoppedTalking, user.username);
            $('#pushToTalkWindowHeader').html(temp);
        }


    }


    this.stopTalk = function() {
        /*if (!chatHTML5.myUser.talks) {
         return;
         }*/
        //$('#pushToTalkWindow').slideUp(500);
        $('#pushToTalkWindow').fadeTo('slow' ,0);
        document.getElementById('pushToTalkSWF').stopAudio();

        chatHTML5.myUser.talks = false;
        console.log('push talk end');
        $('#pushTalkBtn').css('pointer-events', 'auto');
        chatHTML5.socket.emit('stopTalks');
        setTimeout(function() {
            $('#pushTalkBtn').css('pointer-events', 'auto');
        }, parseInt(chatHTML5.config.timeoutBeforeTalkAgain));
    }

    $('#pushTalkBtn').on('mouseup mouseout', function(e){
        if ($('#pushToTalkFreeHand').prop('checked')) {
            return;
        }
        chatHTML5.stopTalk();
    })


    $('#pushToTalkFreeHand').click(function() {
        if ($('#pushToTalkFreeHand').prop('checked')) {
            $('#pushTalkBtn').trigger('mousedown');
        } else {
            chatHTML5.stopTalk();
        }
    })

    $('#pushTalkBtn').on('mousedown', function(e){
        if (!chatHTML5.checkAllowToGuest()) {
            return;
        }

        if (chatHTML5.myUser.pushToTalk=='0') {
            $('#pushToTalkFreeHand').prop('checked', false);
            return;
        }

        if (!chatHTML5.myUser.webcam) {
            bootbox.alert(chatHTML5.traductions.youNeedToEnableYourWebcamToPushToTalk);
            $('#pushToTalkFreeHand').prop('checked', false);
            return;
        }

        $('#pushToTalkWindowHeader').html(chatHTML5.traductions.youAreTalking);
        //$('#pushToTalkWindow').slideDown(500);
        $('#pushToTalkWindow').fadeTo('slow' ,1);

        chatHTML5.myUser.talks = true;
        chatHTML5.socket.emit('talks');
        if (chatHTML5.config.pushToTalkFreeHand=='0') {
            setTimeout(function() {
                chatHTML5.stopTalk();
            }, parseInt(chatHTML5.config.pushToTalkMax));

        }
    })

    this.sortUsers = function() {
        chatHTML5.users.sort(function(user1, user2){
            return user1.avatar < user2.avatar;
        });
    };

    this.closeAllTabs = function() {
        tabs.closeAll();
    };

    $(document).ready(function(e) {
        $('#chatInput').on('keypress', keyPressedFunction);

        $(document).on('keypress', '.windowInputChat', function(e) {
            var input = this;
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                var plainText = $(input).val();
                $(input).val('');
                var userid = $(input).parent().parent().parent().prop('id');
                console.log(userid, plainText);
                plainText = chatHTML5.filterBadWord(plainText);
                chatHTML5.socket.emit('sendPrivate', chatHTML5.myUser, plainText, userid);
                var destinationUser = jQuery.extend(true, {}, chatHTML5.myUser);
                destinationUser.id = userid;
                chatHTML5.receivePrivate(destinationUser, plainText);

            }
        });
    });

    $(document).on('click', '.windowEraser', function(e) {
        $(this).parent().parent().find('.windowChat').empty();
    });

    function keyPressedFunction(e) {
        if (!e) {
            e = window.event;
        }
        var userid;
        var keyCode = e.keyCode || e.which;
        if (!chatHTML5.myUser.isWriting) {
            chatHTML5.myUser.isWriting = true;
            chatHTML5.socket.emit('writes');
            setTimeout(function() {
                chatHTML5.myUser.isWriting = false;
            }, 4000);
        }
        if (keyCode === 13) {
            e.preventDefault();
            if ($(e.target).attr('id')==='chatInput') {
                chatHTML5.sendText();
            }
        }
    }


    setInterval(function() {
        chatHTML5.displayDateAgo();
    }, 30000);


    this.displayDateAgo = function() {
        $("#chat .timeStamp").each(function(index, element) {
            var date = $(element).data("date");
            $(element).text(ago(date));
        });
    };

    $("#searchInput").keydown(function(e) {
        if (e.keyCode>105) {
            e.preventDefault();
        }
    });

    $("#searchInput").keyup(function(e) {
        chatHTML5.searchUsers();
    });


    this.searchUsers = function() {
        $("#userList .userItem").show();
        $("input[data-gender]").each(function(index, element) {
            if (!$(element).prop('checked')) {
                var gender = $(element).data('gender');
                $(sprintf("#userList .userItem[data-gender='%s']", gender)).hide();
            }
        });

        var searchUsername = $("#searchInput").val();
        if (!searchUsername) {
            return;
        }
        var temp = sprintf("[data-username*='%s']",searchUsername);
        $("#userList .userItem").not(temp).hide();
    };

    $('.filtergenderItem').click(function(e) {
        chatHTML5.searchUsers();
    });



    this.login = function(username, password) {
        var nameRegex = /^[a-zA-Z0-9]+[a-z\sA-Z0-9@\.]{2,}[a-zA-Z0-9]$/;
        if (!username.match(nameRegex)) {
            bootboxjs.alert(chatHTML5.traductions.badLoginOrPassword);
            return;
        }
        $.post(chatHTML5.config.ajax, {a:'login', username:username, password:password}, function (user) {
            user = JSON.parse(user);
            if (user.result==='ko') {
                bootbox.alert(user.message);
                return;
            }
            chatHTML5.myUser = chatHTML5.getDefaultUser();
            jQuery.extend(chatHTML5.myUser , user);

            chatHTML5.loggedOn();
            $('#myAvatar img').prop('src', chatHTML5.myUser.image).prop('title', chatHTML5.myUser.username);
        });
    };

    this.loginAsGuest = function(username, gender) {
        var nameRegex = /^[a-zA-Z0-9]+[a-z\sA-Z0-9\.]{2,}[a-zA-Z0-9]$/;
        if (!username.match(nameRegex)) {
            bootbox.alert(chatHTML5.traductions.badLoginOrPassword);
            return;
        }
        chatHTML5.myUser  = chatHTML5.getDefaultUser();
        var randomAvatar = chatHTML5.getUserAvatar(gender);
        chatHTML5.myUser.username = username;
        chatHTML5.myUser.image = randomAvatar;
        chatHTML5.myUser.gender = gender;
        chatHTML5.loggedOn();
        $('#myAvatar img').prop('src', chatHTML5.myUser.image).prop('title', chatHTML5.myUser.username);
        // hide upload avatar
        $('.menuUserItem[data-action="avatar"]').hide();
    };


    this.getUserAvatar = function(gender) {
        if (chatHTML5.config.showRandomAvatarsForGuests==='0') {
            for (var i = chatHTML5.config.genders.length;i--;){
                var agender = chatHTML5.config.genders[i];
                if (agender.gender === gender) {
                    return '/upload/genders/' + agender.image;
                }
            }
        } else {
            return "/img/avatars/m/" + Math.ceil(Math.random()*22) + ".svg";
        }
    };


    $(document).on('click', '.registerNow', function(e) {
        $("#overlayRegister").slideToggle();
    });



    this.$getChat = function(tabid) {
        var temp = sprintf(".tab-content div.tab-pane#%s", tabid);
        return $(temp);
    };


    this.changeRoom = function(roomid) {
        //console.log('changeRoom', roomid);
        chatHTML5.stopTalks();
        var room = chatHTML5.rooms[roomid];
        chatHTML5.myUser.room = room;
        chatHTML5.socket.disconnect();
        chatHTML5.users = {};
        chatHTML5.loggedOn();
        if (chatHTML5.room.webcam==='0') {
            $('#webcamBtn').parent().hide();
        } else {
            $('#webcamBtn').parent().show();
        }
        if (chatHTML5.room.colorPicker==='0') {
            $('#colorPickerContainer').hide();
        } else {
            $('#colorPickerContainer').show();
        }
    };

    this.loggedOn = function() {
        this.getNews();
        $('.myUsername').text(chatHTML5.myUser.username);
        $('#webcamsContainer').empty().hide();
        $('#tabs').css('height', 'calc(100% - 80px)');
        $('.modal').modal('hide');
        $('#chat').empty();
        $('#chatInput').val('');
        localStorage.setItem('username', chatHTML5.myUser.username);
        localStorage.setItem('password', chatHTML5.myUser.password);
        $('#myAvatar').prop('src', this.myUser.avatar).prop('title', this.myUser.username);
        if (typeof kurento != 'undefined') {
            this.myUser.myStreamName = kurento.myStreamName;
        }
        this.connectToServer();
        if (chatHTML5.config.webcamAutoStart=='1') {
            chatHTML5.displayMyWebcam(true);
        }
        if (chatHTML5.genders[chatHTML5.myUser.gender].canBroadcast=='1' && !chatHTML5.isMobile()) {
            $('#broadcastContainer').show();
        }
        if (chatHTML5.myUser.isAdmin || chatHTML5.myUser.role=='moderator') {
            $('#broadcastContainer').show();
        }

    };

    $('#broadcastCheckBox').change(function(event) {
        if(!event) {
            return;
        }
        var username = chatHTML5.myUser.username;
        if (!$('#broadcastCheckBox').prop('checked')) {
            bootbox.confirm(chatHTML5.traductions.ConfirmBroadcast, function(res) {
                if (res) {
                    $('#broadcastCheckBox').bootstrapToggle('disable');
                    chatHTML5.socket.emit('broadcast', true, chatHTML5.myUser);
                    if (chatHTML5.config.jsCallBackStartBroadcast) {
                        var js = sprintf("%s(%s)", chatHTML5.config.jsCallBackStartBroadcast, username);
                        eval(js);
                    }
                    setTimeout(function() {
                        $('#broadcastCheckBox').bootstrapToggle('enable');
                    }, 5000)
                } else {
                    $('#broadcastCheckBox').prop('checked', true).change();
                }
            })
        } else {
            chatHTML5.socket.emit('broadcast', false, chatHTML5.myUser);
            if (chatHTML5.config.jsCallBackStopBroadcast) {
                var js = sprintf("%s(%s)", chatHTML5.config.jsCallBackStopBroadcast, username);
                eval(js);
            }
        }
    });


    $(document).on('click', '.clickToRegisterBtn', function(e) {
        $('#overlayRegister').slideToggle();
    });

    this.inviteWebcamChat = function(id, username) {
    };

    this.startTimer = function() {
        chatHTML5.timeCounter = 0;
        chatHTML5.timeCounterInterval = setInterval(chatHTML5.updateTimer,1000);
    };
    this.updateTimer = function() {
        chatHTML5.timeCounter++;
        $('#timeCounter').text(chatHTML5.timeCounter.toString().toHHMMSS());
    };

    this.stopTimer = function() {
        clearInterval(chatHTML5.timeCounterInterval);
    };

    this.checkAllowToGuest = function() {
        if (chatHTML5.config.guestTrialVersionOnly=='1' && chatHTML5.myUser.isGuest) {
            bootbox.alert(chatHTML5.traductions.guestUserIsNotAllowed, function() {
                if (chatHTML5.config.guestTrialUrlWhenForbidden) {
                    window.location = chatHTML5.config.guestTrialUrlWhenForbidden;
                }
            })
            return false;
        }
        return true;
    }

    this.addPrivateMessage = function (fromUser, toUser, message) {
        var activeUser;
        var fromTo;
        if (chatHTML5.myUser.username==fromUser.username){
            activeUser = toUser;
            fromTo = '-> ' + activeUser.username;
        } else {
            activeUser = fromUser;
            fromTo = activeUser.username + '-> ';
        }

        var temp = sprintf("<b>\
        <img src='%s' alt='%s'>\
        <span data-id='%s' data-username='%s' class='userItem'>%s</span> </b> %s",
            activeUser.image, activeUser.username,
            activeUser.id, activeUser.username, fromTo, message);
        chatHTML5.serverMessage(temp, 'addPrivateMessage');
    }

    this.connectToServer = function() {
        this.socket = io.connect(chatHTML5.config.node, {'force new connection': true, secure: false });
        this.socket.on('quickPrivateMessage', function(user, message) {
            console.log('quickPrivateMessage', user, message);
            chatHTML5.addPrivateMessage(user, chatHTML5.myUser, message);
        });
        this.socket.on('refresh', function(question) {
            window.location = window.location;
        });

        this.socket.on('broadcast', function(value, user) {
            if (value) {
                chatHTML5.addWebcam(user.id, user.username, true);
            } else {
                chatHTML5.removeWebcam(user.id);
            }
        });

        this.socket.on('quiz', function(question) {
            $('div.question').remove();
            if (question.quizCategoryid && question.quizCategoryid==2) {
                var message = sprintf('<i class="fa fa-question-circle"></i> %s <p><i>%s</i>: %s</p>', chatHTML5.traductions.whoSings, chatHTML5.traductions.Clue, question.answer);
                chatHTML5.serverMessage(message, 'question');
                question.question = question.question.replaceAll('<p>','').replaceAll('</p>', '');
                chatHTML5.playYoutubeByURL(question.question);

                return;
            }
            var message = sprintf('<i class="fa fa-question-circle"></i> %s <p><i>%s</i>: %s</p>', question.question, chatHTML5.traductions.Clue, question.answer);
            chatHTML5.serverMessage(message, 'question');
        });

        this.playYoutubeByURL = function(url) {
            var videoid = url.split("v=")[1].substring(0, 11);
            console.log(videoid);
            if (!$('#soundCheckBox').prop('checked')) {
                return;
            }
            playerQuizYoutube.cueVideoById(videoid);
            playerQuizYoutube.playVideo();
        }

        this.socket.on('quizBadAnswer', function() {
            return;
            var message = sprintf(chatHTML5.traductions.quizBadAnswer);
            chatHTML5.serverMessage(message, 'quizBadAnswer');
        });

        this.socket.on('quizGoodAnwser', function(user, answer) {
            var rnd = 1 + Math.floor(Math.random()*5);
            var goodMessage = chatHTML5.traductions['quizGoodAnswer' + rnd];
            var message = sprintf(goodMessage, user.username, answer);
            chatHTML5.serverMessage(message, 'quizGoodAnswer animated slideInUp');
            chatHTML5.incrementPointsQuiz(user.id);
        });

        this.socket.on('banned', function(minutes) {
            bootbox.alert(sprintf(chatHTML5.traductions.youHaveBeenBannedFromChat), function() {
                window.top.location.href = config.quitUrl;
            });
            chatHTML5.socket.disconnect();
        });

        this.socket.on('connect', function() {
            chatHTML5.users = {};
            chatHTML5.socket.emit('enterRoom', chatHTML5.myUser);
        });

        this.socket.on('kicked', function(user) {
            var message = sprintf(chatHTML5.traductions.youHaveBeenKickedByUser, user.username);
            chatHTML5.kicked(message);
        });
        this.socket.on('togglePushToTalk', function(user) {
            console.log('togglePushToTalk'+ user.pushToTalk);
            chatHTML5.myUser.pushToTalk = user.pushToTalk;
            chatHTML5.stopTalk();
        });

        this.socket.on('talks', function(user) {
            chatHTML5.talks(user);
        });

        this.socket.on('stopTalks', function(user) {
            chatHTML5.stopTalks(user);
        });

        this.socket.on('getUsers', function(usersInRoom) {
            //room entered and connected !
            chatHTML5.getForbiddenWords();
            console.log('getUsers', usersInRoom);
            $('#userList').empty();
            for (var id in usersInRoom) {
                chatHTML5.addUser(usersInRoom[id]);
            }
            // create room tab
            //
            var roomid = sprintf('room_%s', chatHTML5.myUser.room.id);
            var roomName = sprintf('<i class="fa fa-home"></i> #%s<div class="unread"  title="%s"></div>', chatHTML5.myUser.room.name, chatHTML5.traductions.unreadMessages);
            tabs.addTab({id: roomid, title: roomName, closable: false, room:true, label: chatHTML5.myUser.room.name});
            var temp = sprintf('.tab-content div[id=%s]', roomid);
            $('#'+roomid).perfectScrollbar();
            chatHTML5.welcome();
        });

        this.socket.on('playYoutube', function(videoid) {
            chatHTML5.playYoutube(videoid);
        });

        this.socket.on('userChanged', function (user) {
            if (!user.webcam) {
                chatHTML5.removeWebcam(user.id);
            }
            // user change: update his view !
            chatHTML5.users[user.id] = user;
            var temp = sprintf('.userItem[data-id=%s] img', user.id);
            $(temp).attr('src', user.image);

            temp = sprintf('.userItem[data-id=%s] div.status', user.id);
            $(temp).removeClass('online').removeClass('offline').removeClass('busy').addClass(user.status);

            temp = sprintf('.userItem[data-id=%s] div.userLabel', user.id);
            $(temp).text(user.username);

            temp = sprintf('.userItem[data-id=%s] div.webcamBtn', user.id);
            var webcamClass = (user.webcam)?'visible':'hidden';
            $(temp).removeClass('online').removeClass('hidden').removeClass('visible').addClass(webcamClass);

            var classLock =(user.webcamPublic)?'fa-unlock':'fa-lock';
            temp = sprintf('.userItem[data-id=%s] div i.lock', user.id);
            $(temp).removeClass('fa-lock').removeClass('fa-unlock').addClass(classLock);

            if (chatHTML5.config.chatType==='conference' && user.isAdmin) {
                chatHTML5.playConference(user, user.webcam);
            }
        });

        $(document).on('click', '.fa-eye-slash.fa-2x', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            var id = $(this).parent().parent().data('id');
            console.log('allowWatch', id);
            chatHTML5.socket.emit('allowWatch', id);
            $(this).addClass('fa-eye').removeClass('fa-eye-slash');
        })

        $(document).on('click', '.fa-eye.fa-2x', function(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            var id = $(this).parent().parent().data('id');
            console.log('forbidWatch', id);
            chatHTML5.socket.emit('forbidWatch', id);
            $(this).removeClass('fa-eye').addClass('fa-eye-slash');
        })

        this.socket.on('watched', function(user, value) {
            var temp = sprintf(".userItem[data-id=%s] i.fa-eye", user.id);

            if (value) {
                $(temp).removeClass('fa-eye-slash').removeClass('fa-eye').addClass('fa-eye')
                $(temp).removeClass('hidden').removeClass('visible').addClass('visible');
            } else {
                $(temp).removeClass('fa-eye-slash').removeClass('fa-eye').addClass('fa-eye')
                $(temp).removeClass('hidden').removeClass('visible').addClass('hidden');
            }
            //console.log('watched');
            chatHTML5.updateWatchingAtMeTotal();
        });

        this.socket.on('webcamAccepted', function(user) {
            chatHTML5.serverMessage(sprintf(chatHTML5.traductions.youAreNowWatchingUser, user.username), 'webcamRequested');
            chatHTML5.addWebcam(user.id, user.username);
        });

        this.socket.on('privateClosed', function(user) {
            tabs.closeById(user.id);
            chatHTML5.getPanelById(user.id).remove();
            chatHTML5.serverMessage(sprintf(chatHTML5.traductions.userHasClosedPrivateChat, user.username), 'privateClosed');
        });


        this.socket.on('privateAccepted', function(user) {
            chatHTML5.addOrSelectPrivateChat(user.id, user.username, false);
        });

        this.socket.on('refresh', function() {
            window.location.reload();
        });

        this.socket.on('privateRequested', function(user) {
            console.log('privateRequested', user);
            if (chatHTML5.muted[user.id]) {
                return;
            }
            if ($('#acceptPrivateCheckBox').prop('checked')) {
                chatHTML5.socket.emit('privateAccepted', user.id);
            } else {
                var message = sprintf('\
			<i class="fa fa-comment"></i> %s %s.\
			<div>\
				<button data-id="%s" data-username="%s" class="acceptPrivateBtn btn btn-success" >\
					<i class="fa fa-comment"></i> Accept\
				</button>\
				<button data-id="%s" data-username="%s" class="denyBtn btn btn-warning" >\
					<i class="fa fa-times"></i> Deny\
				</button>\
				<button data-id="%s" data-username="%s" class=" muteBtn btn btn-danger" >\
					<i class="fa fa-microphone-slash"></i> Mute\
				</button>\
			</div>',
                    user.username, chatHTML5.traductions.requestAPrivateChat, user.id, user.username, user.id, user.username, user.id, user.username, user.id, user.username);
                chatHTML5.serverMessage(message, 'privateRequested');
            }
        });


        this.socket.on('webcamRequested', function(user) {
            if (chatHTML5.muted[user.id]) {
                return;
            }
            var message = sprintf('\
			<i class="fa fa-video-camera"></i> %s %s.\
			<div>\
				<button data-id="%s" data-username="%s" class="acceptBtn btn btn-success" >\
					<i class="fa fa-check"></i> %s\
				</button>\
				<button data-id="%s" data-username="%s" class=" denyBtn btn btn-warning" >\
					<i class="fa fa-times"></i> Deny\
				</button>\
				<button data-id="%s" data-username="%s" class=" muteBtn btn btn-danger" >\
					<i class="fa fa-microphone-slash"></i> Mute\
				</button>\
			</div>',
                user.username, chatHTML5.traductions.requestsAVideoChat,
                user.id, user.username, chatHTML5.traductions.accept,
                user.id, user.username, chatHTML5.traductions.deny,
                user.id, user.username,chatHTML5.traductions.mute);
            chatHTML5.serverMessage(message, 'webcamRequested');
        });

        this.socket.on('receiveText', function (user, message, extras) {
            if (chatHTML5.interval) {
                clearInterval(chatHTML5.interval);
            }
            chatHTML5.receiveText(user, message, extras);
        });

        this.socket.on('privateDenied', function(user) {
            chatHTML5.serverMessage(sprintf(chatHTML5.traductions.userDeniedPrivateChat, user.username), 'webcamRequested');
        });

        this.socket.on('allowWatch', function(user) {
            console.log('allowWatch');
            delete (chatHTML5.forbiddenToWatchMe[user.id]);
        });

        this.socket.on('forbidWatch', function(user) {
            console.log('forbidWatch');
            chatHTML5.removeWebcam(user.id);
            chatHTML5.forbiddenToWatchMe[user.id] = user;
        });




        this.socket.on('writes', function (userid) {
            var temp = sprintf('.userItem[data-id="%s"] .keyboard', userid);
            $(temp).css('opacity', 1)
            setTimeout(function() {
                $(temp).css('opacity', 0);
            },3000);
        });

        this.sendPrivateInvitation = function(id, username) {
            if (!chatHTML5.checkAllowToGuest()) {
                return;
            }
            // check if not send already ?

            if (chatHTML5.users[id]) {
                chatHTML5.serverMessage(sprintf('<i class="fa fa-comment"></i> %s %s ', chatHTML5.traductions.youRequestedAPrivateChatWith, username), 'privateRequest');
                chatHTML5.socket.emit('privateRequest', id);
            } else {
                chatHTML5.addOrSelectPrivateChat(id, username, true);
            }
        }

        $(document).on('click', '.userLink', function() {
            var id = $(this).data('id');
            var username = $(this).data('username');
            chatHTML5.askPrivateInvitation(id, username);

        });


        this.receivePrivate = function(user, message) {
            if (!user || !user.id || this.muted[user.id]) {
                return;
            }
            if (localStorage.getItem('soundConfig')!=='false') {
                chatHTML5.playMP3(chatHTML5.config.receiveMP3);
            }

            console.log('receivePrivate', user.username, user.id);
            chatHTML5.addPrivateChat(user.id, user.username);
            message = chatHTML5.parseSmileys(message);
            message = message.linkify();
            var date = new Date().toLocaleTimeString();
            var $chat;
            var templateMessage;

            if (chatHTML5.config.chatType==='window') {
                var classe = (user.receiver)?'bubbleReceive':'bubbleSend';
                templateMessage = sprintf('\
			<div class="messageWindowPrivate">\
					<span>\
						<span class="timeStamp">%s</span>\
					</span>\
					<div class="%s">%s</div>\
				</div>\
			', date, classe, message);
                var $panel = chatHTML5.getPanelById(user.id)
                $chat = $panel.find('.windowChat');
                if ($panel.data('status')=='minimized') {
                    $('#_window_'+user.id+'-min').addClass('blink');
                }

                $chat.animate({ scrollTop: $chat[0].scrollHeight}, 200);
                $(templateMessage).hide().appendTo($chat).fadeIn(500);

            }
            if (chatHTML5.config.chatType==='tab' || chatHTML5.config.chatType==='tabAndWindow') {
                templateMessage = sprintf('\
			<div class="message">\
				<img src="%s" alt="%s" >\
					<span>\
						<span class="userLink" title="%s %s" data-id="%s" data-username="%s">%s</span>\
						<span class="timeStamp">%s</span>\
					</span>\
					<div class="content">%s</div>\
				</div>\
			', user.image, user.username,
                    chatHTML5.traductions.privateWith, user.username, user.id, user.username, user.username,
                    date, message);

                $chat = chatHTML5.$getChat(user.id);

                var temp = sprintf("a[data-id='%s'] div.unread", user.id);
                if (chatHTML5.getCurrentTab().id===user.id) {
                    $(temp).empty();
                } else {
                    var value = $(temp).text();
                    (value=='')?value = 1:value = (parseInt(value)+1);
                    $(temp).text(value);
                }
                if (!$chat) {
                    return;
                }
                $chat.animate({ scrollTop: $chat[0].scrollHeight}, 200);
                $(templateMessage).hide().appendTo($chat).fadeIn(500);
            }
        };


        this.socket.on('receivePrivate', function (user, message) {
            chatHTML5.receivePrivate(user, message);
        });


        this.socket.on('videoChatClosed', function () {
            chatHTML5.closeVideoChat();
        });



        this.socket.on('disconnected', function () {
            $("html").css('opacity', 0.1);
            window.close();
        });

        this.socket.on('error', function (errorMessage) {
            //console.log(errorMessage);
        });


        this.socket.on('addUser', function(user) {
            chatHTML5.addUser(user);
        });


        this.socket.on('removeUser', function(user) {
            chatHTML5.removeUser(user);
        });

    };

    this.swfReady = function() {

    };

    $('#privateWebcamBtn').change(function(e) {
        chatHTML5.myUser.webcamPublic = false;
        chatHTML5.changeMyStatus();
    });

    $('#publicWebcamBtn').change(function(e) {
        chatHTML5.myUser.webcamPublic = true;
        chatHTML5.changeMyStatus();
    });


    this.getPanelById = function(id) {
        return $('div.jsPanel#' + id);
    };

    this.webrtcAvailable = function(callBackSuccess) {
        var mediaOptions = { audio: true, video: true };
        if (!(navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
            return false;
        }
        navigator.getUserMedia(mediaOptions, success, function(e) {
            return false;
        });
        function success(stream){
            callBackSuccess(stream);
        }
    }

    this.displayMyWebcamWEBRTC = function(value) {
        if (value) {
            chatHTML5.webrtcAvailable(function(stream) {
                $('#myWebcamContainer').show(100);
                var video = $('<video />', {
                    id: kurento.myStreamName,
                    autoplay:'autoplay',
                    width:'100%',
                    height:(chatHTML5.config.myWebcamDraggable=='1')?'100%':240,
                    type: 'video/mp4',
                    controls: true
                });
                var myWebcamDiv = $('<myWebcamDiv />', {
                    id:'myWebcamDiv'
                });
                myWebcamDiv.appendTo($('#myWebcamContainer'));
                video.appendTo(myWebcamDiv);
                kurento.publishStream(video[0], false);
                if (chatHTML5.config.myWebcamDraggable=='1') {
                    chatHTML5.displayMyWebcamDraggable();
                }
                chatHTML5.cameraStatus(!value);
            })
        } else {
            $('#myWebcamContainer').hide(100);
            $('#myWebcamContainer video').remove();
            kurento.stopStream(kurento.myStreamName);
            chatHTML5.myUser.webcam = false;
            chatHTML5.socket.emit('changeUser', chatHTML5.myUser);
            if (chatHTML5.config.myWebcamDraggable=='1') {
                chatHTML5.getPanelById('myWebcamDraggable').remove();
            }
            chatHTML5.cameraStatus(!value);
        }
    }

    this.displayMyWebcam = function(value) {
        if (chatHTML5.config.webrtc=='1') {
            if (!chatHTML5.myUser.hasWebrtc) {
                bootbox.alert('Webcam error: Please use Firefox or Chrome browser');
                return;
            }
            chatHTML5.displayMyWebcamWEBRTC(value);
            return;
        }

        if (value) {
            $('#myWebcamContainer').show(100);
            var flashvars = {username: chatHTML5.myUser.id, w:chatHTML5.config.webcamWidth, h:chatHTML5.config.webcamHeight, xml:'/webcam.xml.php'};
            var params = {allowfullscreen : 'true', menu : 'false', quality : 'best', scale : 'noscale', wmode : 'opaque'};
            var attributes = {id : 'myWebcamDiv', name : 'myWebcamDiv'};
            $('#myWebcamContainer').append('\
            	<div id="myWebcamDiv">\
					<div class="allowFlash blink"><a href="http://www.adobe.com/go/getflashplayer"><i class="fa fa-exclamation-circle"></i> Enable Flash Player.<a/></div>\
				</div>');
            var height = (chatHTML5.config.myWebcamDraggable=='1')?'100%':240;
            swfobject.embedSWF('/swf/streamer.swf', 'myWebcamDiv', '100%', height, '10.0.0', 'expressInstall.swf', flashvars, params, attributes);
            if (chatHTML5.config.myWebcamDraggable=='1') {
                chatHTML5.displayMyWebcamDraggable();
            }
        } else {
            $('#myWebcamContainer').hide(100);
            swfobject.removeSWF('myWebcamDiv');
            chatHTML5.myUser.webcam = false;
            chatHTML5.socket.emit('changeUser', chatHTML5.myUser);
            if (chatHTML5.config.myWebcamDraggable=='1') {
                chatHTML5.getPanelById('myWebcamDraggable').remove();
            }
        }
        if (swfobject.hasFlashPlayerVersion('9') || chatHTML5.isMobile()) {
            $('.allowFlash').hide();
        } else {
            $('.allowFlash').show();
        }
    };

    this.displayMyWebcamDraggable = function() {
        var left = $('div#tabs').width()-650;
        var top = 10;

        $.jsPanel({
            selector: '#tabs',
            headerTitle:chatHTML5.traductions.myWebcam,
            position: {
                left: left,
                top:  top
            },
            container:'div.tab-content',
            content:  myWebcamDiv,
            contentSize: {width: 220, height: 200},
            headerControls: {
                iconfont: "font-awesome",
                close: 'remove',
                maximize:'remove',
                minimize:'remove'
            },
            maximizedMargin: {
                top:    100,
                right:  20,
                bottom: 50,
                left:   20
            },

            resizable: {
                handles:   'ne, se, sw, nw',
                autoHide:  false,
                minWidth:  220,
                minHeight: 80,
                aspectRatio: true
            },
            id:'myWebcamDraggable'
        });
        if (swfobject.hasFlashPlayerVersion('9') || chatHTML5.isMobile()) {
            $('.allowFlash').hide();
        } else {
            $('.allowFlash').show();
        }
    }

    this.updateWatchingAtMeTotal = function() {
        $('span#watchAtMe').text($('div.userItem i.fa-eye.visible').length);

    }

    $('#webcamBtn').change(function(e) {
        if (!chatHTML5.checkAllowToGuest()) {
            return;
        }
        chatHTML5.displayMyWebcam($(this).is(':checked'));
    });

    this.privacyClosed = function(value) {
        //console.log('privacyClosed', value);
        this.cameraStatus(!value);
    }

    this.cameraStatus = function(value) {
        chatHTML5.myUser.webcam=!value;
        chatHTML5.myUser.hasWebcam=!value;
        chatHTML5.socket.emit('changeUser', chatHTML5.myUser);
        if (chatHTML5.myUser.webcam) {
            $('#broadcastCheckBox').bootstrapToggle('enable');
        } else {
            $('#broadcastCheckBox').bootstrapToggle('disable');
        }
        console.error('cameraStatus', value);
    }

    this.cameraActivated = function(value) {
        if (chatHTML5.myUser.cameraActivated) {
            return;
        }
        console.error('cameraActivated');
        chatHTML5.myUser.cameraActivated = true;
        chatHTML5.myUser.webcam = value;
        chatHTML5.myUser.hasWebcam=!value;
        chatHTML5.socket.emit('changeUser', chatHTML5.myUser);
        if (chatHTML5.myUser.webcam) {
            $('#broadcastCheckBox').bootstrapToggle('enable');
        } else {
            $('#broadcastCheckBox').bootstrapToggle('disable');
        };
    }

    this.publishWebcam = function(value) {
        console.log('publishWebcam', value);
    };

    $(document).on('click', '.webcamBtn', function(event) {
        event.stopPropagation();
        if (chatHTML5.config.chatType==='conference') {
            return;
        }
        var btnClicked = this;
        $(this).prop('disabled', true);
        $(this).css('opacity', 0.3);
        setTimeout(function() {
            $(btnClicked).prop('disabled', false);
            $(btnClicked).css('opacity', 1);
        }, 10000);
        var username = $(this).parent().data('username');
        var id = $(this).parent().data('id');
        if (chatHTML5.users[id].webcamPublic && !chatHTML5.forbiddenToWatchMe[id]) {
            chatHTML5.addWebcam(id, username);
        } else {
            if (!chatHTML5.checkAllowToGuest()) {
                return;
            }
            chatHTML5.serverMessage(sprintf('<i class="fa fa-video-camera"></i> %s %s', chatHTML5.traductions.youEequestedWatchWebcamOf, username), 'webcamRequest');
            chatHTML5.socket.emit('webcamRequest', id);
        }
    });

    $('#youTubeCloseBtn').click(function() {
        $('#youtubeContainer').empty();
        $('#youtubeWrap').hide();
    })

    this.removeWebcam = function(id) {
        if (chatHTML5.config.chatType=='tabAndWindow') {
            //chatHTML5.getPanelById(id).remove();

            chatHTML5.getPanelById('_webcam_' + id).remove();
            //chatHTML5.getPanelById('_window_' + user.id).remove();
        } else {
            var temp = sprintf(".webcamContainer[data-id=%s]", id);
            $(temp).remove();
        }

        chatHTML5.socket.emit('watch', chatHTML5.myUser.id, id, false);
        if (!$('#webcamsContainer').children().length) {
            $('#webcamsContainer').hide();
            $('#tabs').css('height', 'calc(100% - 80px)');
            $('#chatContainer').css('height', 'calc(100% - 0px)');
        }
        chatHTML5.scrollActiveChatToBottom(0);
        if (chatHTML5.config.webrtc=='1') {
            var streamName = chatHTML5.users[id].myStreamName;
            kurento.stopStream(streamName);
        }

    };

    this.addWebcamWEBRTC = function(id, username, broadcast) {
        if (!chatHTML5.myUser.hasWebrtc) {
            return;
        }

        if ($('#webcamsContainer').children().length>chatHTML5.config.webcamMax) {
            chatHTML5.serverMessage(chatHTML5.traductions.webcamNumberMaximumReached);
            return;
        }
        var webcamid = 'webcam_'+ id;
        if ($('#'+webcamid).length) {
            return;
        }
        chatHTML5.socket.emit('watch', chatHTML5.myUser.id, id, true);
        $('#webcamsContainer').show();
        var webcamTemplate = sprintf('\
		<div data-id=%s class="webcamContainer">\
			<div class="webcamHeader">\
				<i class="fa fa-times pull-right webcamCloseBtn" title="%s"></i>\
				<span>%s</span>\
			</div>\
			<div id="%s" class="webcamSwfContainer">\
			</div>\
		</div>',
            id, chatHTML5.traductions.close, username,  webcamid);

        if (chatHTML5.config.chatType=='tabAndWindow') {
            var webcamTemplate = sprintf('\
		<div data-id=%s class="webcamContainer" style="width:100%%;height:100%%">\
			<div id="%s" class="webcamSwfContainer"></div>\
		</div>',
                id, webcamid);

            var user = chatHTML5.users[id];
            if (broadcast) {
                var headerTitle = username + ' <span class="blink" style="color:red">broadcasting</span>'
                var offsetX = -150 + Math.ceil(Math.random()*150);
                var offsetY = ($("#container").height()/2)-200;
            } else {
                var headerTitle = username;
                var offsetX = -150 + Math.ceil(Math.random()*150);
                var offsetY = -150 + Math.ceil(Math.random()*150);
            }
            var header = sprintf('<span><img src="%s" class="userAvatar"></span> %s', user.image, headerTitle);
            $.jsPanel({
                selector: '#tabs',
                headerTitle: header,
                position: {
                    my: 'center',
                    at: 'center',
                    offsetX: offsetX,
                    offsetY: offsetY,
                },
                content:  webcamTemplate,
                contentSize: {width: 320, height: 240},
                headerControls: { iconfont: 'font-awesome', controls: 'closeonly' },
                resizable: {
                    handles:   'ne, se, sw, nw',
                    autoHide:  false,
                    minWidth:  160,
                    minHeight: 160,
                    aspectRatio: true
                },
                dragit: {
                    disableui:true,
                    containment: 'parent'
                },

                id:'_webcam_'+id
            });
        } else {
            $('#chat').css('height', 'calc(100% - 370px');
            $('#tabs').css('height', 'calc(100% - 285px)');
            var offset = parseInt($('#footer').css('height'));
            $('#chatContainer').css('height', 'calc(100% - 0px)');
            $('#webcamsContainer').append(webcamTemplate);
        }
        var width = chatHTML5.config.webcamWidth;
        var height = chatHTML5.config.webcamHeight;
        if (chatHTML5.config.chatType=='tabAndWindow') {
            width = '100%';
            height = '100%';
        }
        chatHTML5.scrollActiveChatToBottom(0);
        var streamName = chatHTML5.users[id].myStreamName;

        var videoid = 'video_'+ id;
        var el = sprintf('<video id="%s" controls autoplay style="width: 100%%;"></video>', videoid);
        $('#'+webcamid).append(el);
        var video = document.getElementById(videoid);
        console.log(streamName, videoid);
        kurento.playStream(streamName, video);
    };

    this.addWebcam = function(id, username, broadcast) {
        if (chatHTML5.config.webrtc=='1') {

            chatHTML5.addWebcamWEBRTC(id, username, broadcast);
            return;
        }

        if ($('#webcamsContainer').children().length>chatHTML5.config.webcamMax) {
            chatHTML5.serverMessage(chatHTML5.traductions.webcamNumberMaximumReached);
            return;
        }
        var webcamid = 'webcam_'+ id;
        if ($('#'+webcamid).length) {
            return;
        }
        chatHTML5.socket.emit('watch', chatHTML5.myUser.id, id, true);
        $('#webcamsContainer').show();
        var flashvars = {username: id, rtmp:chatHTML5.config.rtmp};
        var params = {allowfullscreen : 'true', menu : 'false', quality : 'best', scale : 'noscale', wmode : 'transparent', bgcolor:'FFF'};
        var attributes = {id : webcamid, name : webcamid, class:"webcamClass"};
        var webcamTemplate = sprintf('\
		<div data-id=%s class="webcamContainer">\
			<div class="webcamHeader">\
				<i class="fa fa-times pull-right webcamCloseBtn" title="%s"></i>\
				<span>%s</span>\
			</div>\
			<div id="%s" class="webcamSwfContainer">\
				<div class="allowFlash blink"><a href="http://www.adobe.com/go/getflashplayer"><i class="fa fa-exclamation-circle"></i> Enable Flash Player.<a/></div>\
			</div>\
		</div>',
            id, chatHTML5.traductions.close, username,  webcamid);

        if (chatHTML5.config.chatType=='tabAndWindow') {
            var webcamTemplate = sprintf('\
		<div data-id=%s class="webcamContainer" style="width:100%%;height:100%%">\
			<div id="%s" class="webcamSwfContainer"></div>\
		</div>',
                id, webcamid);

            var user = chatHTML5.users[id];
            if (broadcast) {
                var headerTitle = username + ' <span class="blink" style="color:red">broadcasting</span>'
                var offsetX = -150 + Math.ceil(Math.random()*150);
                var offsetY = ($("#container").height()/2)-200;
            } else {
                var headerTitle = username;
                var offsetX = -150 + Math.ceil(Math.random()*150);
                var offsetY = -150 + Math.ceil(Math.random()*150);
            }
            var header = sprintf('<span><img src="%s" class="userAvatar"></span> %s', user.image, headerTitle);
            $.jsPanel({
                selector: '#tabs',
                headerTitle: header,
                position: {
                    my: 'center',
                    at: 'center',
                    offsetX: offsetX,
                    offsetY: offsetY,
                },
                content:  webcamTemplate,
                contentSize: {width: 320, height: 240},
                headerControls: { iconfont: 'font-awesome', controls: 'closeonly' },
                resizable: {
                    handles:   'ne, se, sw, nw',
                    autoHide:  false,
                    minWidth:  160,
                    minHeight: 160,
                    aspectRatio: true
                },
                dragit: {
                    disableui:true,
                    containment: 'parent'
                },

                id:'_webcam_'+id
            });
        } else {
            $('#chat').css('height', 'calc(100% - 370px');
            $('#tabs').css('height', 'calc(100% - 285px)');
            var offset = parseInt($('#footer').css('height'));
            $('#chatContainer').css('height', 'calc(100% - 0px)');
            $('#webcamsContainer').append(webcamTemplate);
        }
        var width = chatHTML5.config.webcamWidth;
        var height = chatHTML5.config.webcamHeight;
        if (chatHTML5.config.chatType=='tabAndWindow') {
            width = '100%';
            height = '100%';
        }
        if (swfobject.hasFlashPlayerVersion('9')) {
            swfobject.embedSWF('/swf/player.swf', webcamid, width, height, '10.0.0', 'expressInstall.swf', flashvars, params, attributes);
        } else {
            if(Hls.isSupported()) {
                var videoid = 'video_'+ id;
                var el = sprintf('<video id="%s" style="width: 100%%;"></video>', videoid);
                $('#'+webcamid).append(el);
                var video = document.getElementById(videoid);
                var hls = new Hls();
                var m3u8 = sprintf('/m3u8/%s.m3u8', id);
                //console.log('m3u8', m3u8);
                hls.loadSource(m3u8);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    video.play();
                });
            }
        }
        chatHTML5.scrollActiveChatToBottom(0);
    };

    $(document).on('click', '.webcamCloseBtn', function(e) {
        var userid = $(this).parent().parent().data('id');
        chatHTML5.removeWebcam(userid);
    })

    this.playConference = function(user, value) {
        if (chatHTML5.myUser.username === user.username) {
            return;
        }
        if (value) {
            $('#conferenceWebcamContainer').show(100);
            var id = user.id;
            var webcamid = 'conference_'+ id;
            var flashvars = {username: id, rtmp:chatHTML5.config.rtmp};
            var params = {allowfullscreen : 'true', menu : 'false', quality : 'best', scale : 'noscale', wmode : 'transparent', bgcolor:'FFF'};
            var attributes = {id : webcamid, name : webcamid, class:'webcamConferenceClass'};
            $('#conferenceWebcamContainer').append('\
		<div id="conferenceWebcamDiv">\
			<div class="allowFlash blink"><a href="http://www.adobe.com/go/getflashplayer"><i class="fa fa-exclamation-circle"></i> Enable Flash Player.<a/></div>\
		</div>');
            if (swfobject.hasFlashPlayerVersion('9')) {
                swfobject.embedSWF('/swf/player.swf', 'conferenceWebcamDiv', '100%', '240', '10.0.0', 'expressInstall.swf', flashvars, params, attributes);
            } else {
                swfobject.embedSWF('/swf/player.swf', 'conferenceWebcamDiv', '100%', '240', '10.0.0', 'expressInstall.swf', flashvars, params, attributes);
            }
        } else {
            $('#conferenceWebcamContainer').hide(100);
            swfobject.removeSWF('conferenceWebcamDiv');
            $('#conferenceWebcamContainer').empty();
        }
        if (swfobject.hasFlashPlayerVersion('9') || chatHTML5.isMobile()) {
            $('.allowFlash').hide();
        } else {
            if(Hls.isSupported()) {
                var videoid = 'video_'+ id;
                var el = sprintf('<video id="%s" style="width: 100%%;"></video>', videoid);
                $('#'+webcamid).append(el);
                var video = document.getElementById(videoid);
                var hls = new Hls();
                var m3u8 = sprintf('/m3u8/%s.m3u8', id);
                console.log('m3u8', m3u8);
                hls.loadSource(m3u8);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED,function() {
                    video.play();
                });
            }
        }
    }


    $(document).on('click','div.jsPanel-btn.jsPanel-btn-close', function() {
        var id = $(this).parent().parent().parent().parent().prop('id').replaceAll('_webcam_','');
        chatHTML5.removeWebcam(id);
    });


    $('#sendBtn').click(function(e) {
        chatHTML5.sendText();
    });

    $(document).on('click', '.muteBtn', function() {
        var id = $(this).data('id');
        chatHTML5.muted[id] = id;
        $(sprintf('.userItem[data-id=%s]', id)).addClass('muted');
        $(this).parent().parent().remove();
    });

    $(document).on('click', '.denyBtn', function() {
        var id = $(this).data('id');

        $(this).parent().parent().remove();
        chatHTML5.socket.emit('privateDenied', id);
    });

    $(document).on('click', '.acceptBtn', function() {
        var id = $(this).data('id');
        $(this).parent().parent().remove();
        chatHTML5.socket.emit('webcamAccepted', id);
    });

    $(document).on('click', '.acceptPrivateBtn', function() {
        var id = $(this).data('id');
        $(this).parent().parent().remove();
        chatHTML5.socket.emit('privateAccepted', id);
    });

    this.removeUser = function(user) {
        if (chatHTML5.config.chatType==='conference' && user.isAdmin) {
            this.playConference(user, false);
        }

        var temp = sprintf("div.userItem[data-id='%s']", user.id);
        $(temp).remove();
        chatHTML5.updateNumberUsersDisplay();
        chatHTML5.removeWebcam(user.id);
        tabs.closeById(user.id);
        chatHTML5.getPanelById(user.id).remove();

        var leaveMessage = sprintf('%s has left HTML5 chat.', user.username);
        this.serverInfoMessage(leaveMessage, 'leave');
        if (user.talks) {
            chatHTML5.currentTalkerid = 0;
        }
        delete(chatHTML5.users[user.id]);
    };

    this.getPanelById = function(id) {
        return $('div.jsPanel#' + id);
    };

    $('#clearButton').click(function(e) {
        $('.tab-pane.active').empty();
    });



    $('#fileElem').change(function(e) {
        var fileReader = new FileReader();
        var file = document.getElementById("fileElem").files[0];
        if (file) {
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                bootbox.alert(chatHTML5.traductions.invalidImageType);
                return;
            }
            if (file.size>2000000) {
                bootbox.alert(chatHTML5.traductions.invalidImageSize);
                return;
            }
            fileReader.onload = function(e) {
                if ($('#fileElem').data('action')==='changeAvatar') {
                    chatHTML5.changeAvatar();
                }
            };
            fileReader.readAsDataURL(file);
        }
    });


    this.changeAvatar = function() {
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        var file = document.getElementById('fileElem').files[0];
        if (file) {
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                bootbox.alert(chatHTML5.traductions.invalidImageType);
                return;
            }
            if (file.size>2000000) {
                bootbox.alert(chatHTML5.traductions.invalidImageSize);
                return;
            }
            formData.append('file', file);
        }
        formData.append('a', 'updateAvatar');
        formData.append('id', chatHTML5.myUser.id);
        formData.append('password', chatHTML5.myUser.password);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText==='ko') {
                    return;
                }
                $('#myAvatar img').prop('src', xhr.responseText);
                chatHTML5.myUser.image = xhr.responseText;
                chatHTML5.changeMyStatus();
            }
        };

        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                var percentage = Math.round((e.loaded * 100) / e.total);
                $('#progressbar').css('width', percentage + '%');
                $('#percentage').text(percentage + '%');
            }
        }, false);

        xhr.upload.addEventListener('loadstart', function(e){
            $('#progressbar').show();
        }, false);


        xhr.upload.addEventListener('load', function(e) {
            var res = e.currentTarget.responseText;
            console.log('res:', res);
            $('#progressbar').hide();
            $('#percentage').text('100% Done');
        }, false);

        xhr.open('POST', chatHTML5.config.ajax);
        xhr.send(formData);
    };




    $('#clearSearch').click(function(e) {
        $("#searchInput").val('');
        $(".searchItem").remove();
        chatHTML5.searchUsers();
    });

    this.kicked = function(message) {
        chatHTML5.socket.disconnect();
        bootbox.alert(message, function() {
            window.top.location.href = window.top.location.href;
        });
    }

    this.changeMyStatus = function() {
        var status = chatHTML5.myUser.status;
        $('#myAvatar .status').removeClass('online').removeClass('offline').removeClass('busy').addClass(status);
        localStorage.setItem('status', status);
        chatHTML5.socket.emit('changeUser', chatHTML5.myUser);
    };


    $('#myAvatar').on('click', function(event) {
        event.stopPropagation();
        $('.menuUserItem').css( 'pointer-events', 'auto').css('opacity', '1');
        $('#myUserMenu').show();
        temp = sprintf(".menuUserItem[data-action='%s']", chatHTML5.myUser.status);
        $(temp).css( 'pointer-events', 'auto').css('opacity', '0.3');
    });

    $(document).on('click', function(e) {
        $('#myUserMenu').hide();
    });

    $('#acceptPrivateCheckBox').change(function() {
        var value = $(this).prop('checked');
        chatHTML5.myUser.privateOnlyOnInvitation = value;
        chatHTML5.changeMyStatus();
    });


    $(document).on('click', '.userItem', function(event) {
        event.stopPropagation();
        var username = $(this).data('username');
        $('#userMenu').data('username', username);
        var id = $(this).data('id');
        $('#userMenu').data('id', id);
        var trigger = (window.innerHeight-event.pageY);
        var offset = (trigger<115)?parseInt($('#userMenu').css('height')):0;
        $('#userMenu').css('left', event.pageX).css('top', event.pageY-offset-40).show();

        if (chatHTML5.muted[id]) {
            $('#userMenu div[data-action="mute"] span').text(sprintf(chatHTML5.traductions.unmuteUser, username));
        } else {
            $('#userMenu div[data-action="mute"] span').text(sprintf(chatHTML5.traductions.muteUser, username));
        }

        $('#userMenu div[data-action="private"] span').text(sprintf(chatHTML5.traductions.privateWithX, username));
        if (chatHTML5.myUser.isAdmin) {
            $('#userMenu div[data-action="kick"] span').text(sprintf(chatHTML5.traductions.kickUserX, username)).show();
            $('#userMenu div[data-action="ban"] span').text(sprintf(chatHTML5.traductions.banUserX, username)).show();
        } else {
            $('#userMenu div[data-action="kick"]').hide();
            $('#userMenu div[data-action="ban"]').hide();
        }
    });

    $(document).on('click', function() {
        $('#userMenu').hide();
    });

    this.askPrivateInvitation = function(id, username) {
        console.log('chatHTML5.askPrivateInvitation', id, username);

        if (chatHTML5.config.chatType==='tab' || chatHTML5.config.chatType==='tabAndWindow') {
            if ($('.nav-tabs:not(.nav-tabs-clone)').find('li').find('a[href="#'+id+'"]').length) {
                $('.nav-tabs:not(.nav-tabs-clone)').find('li').find('a[href="#'+id+'"]').click();
                return;
            } else {
                if (chatHTML5.users[id].privateOnlyOnInvitation) {
                    chatHTML5.sendPrivateInvitation(id, username);
                } else {
                    chatHTML5.addOrSelectPrivateChat(id, username, true);
                }
                return;
            }
        }
        if (chatHTML5.config.chatType==='window') {
            if ($('div.jsPanel#' + id).length) {
                $('div.jsPanel#' + id).click();
                return;
            } else {
                if (chatHTML5.users[id].privateOnlyOnInvitation) {
                    chatHTML5.sendPrivateInvitation(id, username);
                } else {
                    chatHTML5.addOrSelectPrivateChat(id, username, true);
                }
                return;
            }
        }
        chatHTML5.sendPrivateInvitation(id, username);
    }

    this.ban = function(id, minutes, description) {
        chatHTML5.socket.emit('ban', id, minutes, description);
    };

    $('.menuUserItem').click(function(e) {
        var action = $(this).data('action');
        var username;
        var id;
        switch (action) {
            case 'avatar':
                $('#fileElem').data('action', 'changeAvatar');
                $('#fileElem').click();
                break;
            case 'online':
                chatHTML5.myUser.status = action;
                chatHTML5.changeMyStatus();
                break;
            case 'offline':
                chatHTML5.myUser.status = action;
                chatHTML5.changeMyStatus();
                break;
            case 'busy':
                chatHTML5.myUser.status = action;
                chatHTML5.changeMyStatus();
                break;
            case 'quickPrivateMessage':
                username = $(this).parent().data('username');
                var userid = $(this).parent().data('id');
                if (chatHTML5.config.showQuickPrivateMessagesInPublicChat=='1') {
                    $('#chatInput').focus().val(chatHTML5.myUser.username + ' ➡ ' + username+': ').focus();
                    return;
                }

                var temp = sprintf(chatHTML5.traductions.quickPrivateMessageTo, username);
                bootbox.prompt(temp, function(message){
                    if (!message){
                        return;
                    }
                    var user = chatHTML5.users[userid];
                    chatHTML5.socket.emit('quickPrivateMessage', userid, message);
                    chatHTML5.addPrivateMessage(chatHTML5.myUser, user, message);
                })
                break;
            case 'mute':
                username = $(this).parent().data('username');
                id = $(this).parent().data('id');
                $('#userMenu').hide();
                $(sprintf('.userItem[data-id=%s]', id)).toggleClass('muted');
                if ($(sprintf('.userItem[data-id=%s]', id)).hasClass('muted')) {
                    chatHTML5.muted[id] = id;
                } else {
                    delete chatHTML5.muted[id];
                }
                break;
            case 'kick':
                username = $(this).parent().data('username');
                id = $(this).parent().data('id');
                console.log('kick', id);
                $('#userMenu').hide();
                chatHTML5.socket.emit('kick', id);
                chatHTML5.serverMessage(sprintf(chatHTML5.traductions.youJustKickedX, username), '');
                break;
            case 'ban':
                username = $(this).parent().data('username');
                id = $(this).parent().data('id');
                $('#userMenu').hide();
                $('#banModal').modal('show');
                $('#banModal').data('id', id).data('username', username);
                var title = sprintf(chatHTML5.traductions.banUserX, username);
                $('#banModal #banChatTitle').text(title);
                break;
            case 'private':
                /*if (!$('#acceptPrivateCheckBox').prop('checked')) {
                 bootbox.confirm(chatHTML5.traductions.toInviteForPrivateChatYouMustEnablePrivateChatsYourself, function(result) {
                 if (result) {
                 $('#acceptPrivateCheckBox').bootstrapToggle('on');
                 }
                 });
                 return;
                 }*/
                username = $(this).parent().data('username');
                id = $(this).parent().data('id');
                console.log('private', id);
                $('#userMenu').hide();

                // add or select ?

                chatHTML5.askPrivateInvitation(id, username);
                break;
            case 'userInfo':
                var sc = chatHTML5.config.showUserInfoDataUrlOrJavascript;
                username = $(this).parent().data('username');
                sc = sc.replaceAll('{username}', username);
                eval(sc);
                break;


        }
        $('#myUserMenu').hide();
    });


    $("#smileyButton").click(function(e) {
        $("#smileyContainer").slideToggle(100);
    });



    this.startIntro = function() {

        var welcomeMessage = '';
        var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var intro = introJs();

        intro.setOptions({
            steps: [
                {
                    element: '#menuChat',
                    intro: "This is a <b>public chat</b> about one topic or about a website.",
                    position:'top'
                }
            ]
        });

        intro.start();
    };

    $('#quitBtn').click(function(e) {
        bootbox.confirm('Quit chat ?', function(result) {
            if (!result) {
                return;
            }
            window.top.location.href = config.quitUrl;
        });
    });

    $('#djBtn').click(function() {
        bootbox.prompt('Enter url youtube', function(url) {
            if (!url) {
                return;
            }
            var videoid = url.split("v=")[1].substring(0, 11);
            chatHTML5.socket.emit('playYoutube', videoid);
        })
    })

    this.playYoutube = function(videoid) {
        if (!$('#soundCheckBox').prop('checked')) {
            return;
        }
        $('#youtubeWrap').show();
        $('#youtubeContainer').empty().css('height', '150px');
        //youtube = 'PKB4cioGs98';
        var el = sprintf('<iframe width="100%%" height="100%%" src="https://www.youtube.com/embed/%s?autoplay=1" frameborder="0" allowfullscreen></iframe>', videoid);
        $('#youtubeContainer').append(el);
    }

    this.getNews = function() {
        $.post(chatHTML5.config.ajax, {'a': 'getNews'}, function (news) {
            chatHTML5.news = JSON.parse(news);
            var nombreNews = chatHTML5.news.length;
            if ( nombreNews && parseInt(chatHTML5.config.display_news_minutes)) {
                window.newsInterval = setInterval(function() {
                    var d = new Date();
                    var minutes = d.getMinutes();
                    var currentNews = chatHTML5.news[minutes % nombreNews ];
                    chatHTML5.serverMessage(currentNews.news, 'news');
                }, parseInt(chatHTML5.config.display_news_minutes)*60*1000);
            }
        })
    }

    this.fillRooms = function() {
        $.post(chatHTML5.config.ajax, {'a': 'getRooms'}, function(rooms) {
            rooms = JSON.parse(rooms);
            chatHTML5.rooms = {};
            $("#tableRoomBody").empty();
            var passwordProtected;
            var trClass;
            for(index in rooms) {
                var room = rooms[index];
                chatHTML5.rooms[room.id] = room;
                passwordProtected = (room.isPasswordProtected==='1')?passwordProtected = ' <i class="fa fa-unlock-alt"></i> ':passwordProtected = '';
                trClass = (room.id===chatHTML5.myUser.room.id)?'activeRoom':'';

                var button = sprintf('<button type="button" data-id="%s" class="btn btn-info roomJoinBtn pull-right">%s<i class="fa fa-sign-in"></i> %s</button>',
                    room.id, passwordProtected, chatHTML5.traductions.join);
                var image = (room.image) ? sprintf('<img src="/upload/rooms/%s">', room.image): '';
                var row = sprintf('\
			<tr data-id=%s data-name="%s" class="%s">\
				<td>%s</td>\
				<td>%s</td>\
				<td>%s</td>\
			</tr>',
                    room.name, trClass, image, room.name, room.users, button );
                $("#tableRoomBody").append(row);
            }
        });
    }

    $('#roomsBtn').click(function(e) {
        $('#roomsModal').modal('show');
        chatHTML5.fillRooms();
    });


    $('.toggleSize').click(function(e) {
        $('#usersContainer').toggle(200);
        if ($('.toggleSize i').hasClass('fa-caret-square-o-right')){
            $('.toggleSize i').removeClass('fa-caret-square-o-right').addClass('fa-caret-square-o-left');
            $('#chatContainer').css('paddingRight', '0');$('#footer').css('right', '0');
        } else {
            $('.toggleSize i').removeClass('fa-caret-square-o-left').addClass('fa-caret-square-o-right');
            $('#chatContainer').css('paddingRight', '365px');			$('#footer').css('right', '365px');
        }
    });

    $(document).on('click','.smileyItem', function(e) {
        var smiley = $(this).data("smiley");
        $("#smileyContainer").slideToggle(250);
        //console.log(e);

        var texte = $(e.currentTarget).parent().parent().find("textarea").val();
        $(e.currentTarget).parent().parent().find("textarea").val(texte + smiley).focus();

    });

}//endchat

// slide block
$(document).ready(function(){
    $('.slide_block').on('click',function(){
        $('body').toggleClass('open');
    });
    if ($(window).width() > 850 ) {
        $('body').addClass('open');
    } else {
        $('body').removeClass('open');
    }
});

$(window).resize(function(){

    if ($(window).width() > 850 ) {
        $('body').addClass('open');
    } else {
        $('body').removeClass('open');
    }
});

$.fn.ulSelect = function(){
    var ul = $(this);

    if (!ul.hasClass('zg-ul-select')) {
        ul.addClass('zg-ul-select');
    }

    function setFirst() {
        $('.zg-ul-select li:first-of-type').addClass('active');
    }
    setFirst();

    $(document).on('tabClosed', function(){
        setFirst();
    })

    $(this).on('click', 'li', function(event) {
        var href = $(this).find('a').attr('href');
        var link = $('#tabs .nav-tabs:not(.nav-tabs-clone)').find('a[href="'+href+'"]');
        if (link.length > 0) {
            link.click();
        }

        if ($('#selected--zg-ul-select').length) {
            $('#selected--zg-ul-select').remove();
        }

        ul.before('<div id="selected--zg-ul-select">');
        var selected = $('#selected--zg-ul-select');
        $('li #ul-arrow', ul).remove();
        ul.toggleClass('active');

        ul.children().removeClass('active');
        $(this).toggleClass('active');

        var selectedText = $(this).html();
        if (ul.hasClass('active')) {
            selected.html(selectedText).addClass('active');
        } else {
            selected.html('').removeClass('active');
            $('li.active', ul);
        }
    });

    $(document).on('click', function(event){
        if($('ul.zg-ul-select').length) {
            if(!$('ul.zg-ul-select').has(event.target).length == 0) {
                return;
            } else {
                $('ul.zg-ul-select').removeClass('active');
                $('#selected--zg-ul-select').removeClass('active').html('');
                $('#ul-arrow').remove();
            }
        }
    });
}

$('body').on('contextmenu', 'img', function(e) {
    return false;
});

$(document).ready(function() {
    $('body').on('contextmenu', 'img', function(e) {
        return false;
    });

    if ($(window).width() < 500) {
        var text = 'Choose chat:';
        $('#tabs .nav-tabs').before('<div>'+text+'</div>');

        var ul = $('#tabs .nav-tabs').clone();
        ul.addClass('nav-tabs-clone');

        $('#tabs .nav-tabs').after(ul);
        ul.ulSelect();
    }
});