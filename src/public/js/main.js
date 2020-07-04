//EXECUTE CONNECTION SOCKET.IO
//MANAGE THE CONNECTION IN REAL TIME WITH THE SERVER || SEND AND RECEIVED MESSAGE
$(function() {
    const socket = io(); //SOCKET CLIENT

    //OBTAINING 'DOM' ELEMENTS FROM THE INTERFACE
    const $messageForm = $('#message-form');
    const $message = $('#message');
    const $chat = $('#chat');

    //'DOM' ELEMENTS FROM THE NICKNAME FORM
    const $nickForm = $('#nickForm');
    const $nickError = $('#nickError');
    const $nickname = $('#nickname');

    const $usernames = $('#usernames');

    //EVENT FOR THE USER
    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data) {
                $('#nickWrap').hide(); //HIDE THE FORM-USERNAME
                $('#contentWrap').show(); //SHOW THE FORM-CHATS
            } else {
                $nickError.html(`
                <div class="alert alert-danger">
                    That username already exist.
                </div>`);
            }
            $nickname.val('');
        });
    });

    //EVENTS
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $message.val(), data => {
            //DATA ERROR
            $chat.append(`<p class="error">${data}</p>`)
        }); //SEND VALUE OF INPUT TO SERVER
        $message.val(''); //CLEAR THE INPUT FORM
    });

    //DATA OF SERVER
    socket.on('new message', function(data) {
        $chat.append('<b>' + data.nick + '</b>:' + data.msg + '<br/>'); //SHOW MESSAGE IN THE CARD-BODY AND <br/> GIVES THE END OF LINE 
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) { //SCROLLS THE LIST OF CONNECTED USERNAMES
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $usernames.html(html); //ADD ALL USERNAMES AT CARD-USERNAMES WITH LABEL <p>
    });

    //SHOW PRIVATE MESSAGE
    socket.on('whisper', data => {
        displayMsg(data);
    });

    //RETURN OLD MESSAGE OF DB
    socket.on('load old msg', msg => {
        for (let i = 0; i < msg.length; i++) {
            displayMsg(msg[i]);
        }
    })

    //FUNCTION SHOW MESSAGE
    function displayMsg(data) {
        $chat.append(`<p class="whisper"><b>${data.nick}:</b>${data.msg}</p>`);
    }
})

//SELECTOR DE JQuery IS '$'