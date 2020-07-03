//EXECUTE CONNECTION SOCKET.IO
//MANAGE THE CONNECTION IN REAL TIME WITH THE SERVER || SEND AND RECEIVED MESSAGE
$(function() {
    const socket = io(); //SOCKET CLIENT

    //OBTAINING 'DOM' ELEMENTS FROM THE INTERFACE
    const $messageForm = $('#message-form');
    const $message = $('#message');
    const $chat = $('#chat');

    //EVENTS
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send message', $message.val()); //SEND VALUE OF INPUT TO SERVER
        $message.val(''); //CLEAR THE INPUT FORM
    });

    //DATA OF SERVER
    socket.on('new message', function(data) {
        $chat.append(data + '<br/>'); //SHOW MESSAGE IN THE CARD-BODY AND <br/> GIVES THE END OF LINE 
    });
})

//SELECTOR DE JQuery IS '$'