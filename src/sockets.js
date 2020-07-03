//THIS FILE WILL RECEIVE THE SOCKET CONEXION 

//SOCKET LISTEN NEW CONEXION OF CLIENT
//SOCKET SERVER
module.exports = function(io) {
    let nicknames = [
        'Victoriasaurio',
        'David',
        'Sara'
    ];

    io.on('connection', socket => {
        console.log('new client conected');

        socket.on('new user', (data, cb) => {
            if (nicknames.indexOf(data) != -1) { //.indexOf RETURN AN INDEX LIKE [0,1,2,...] || -1 MEANS: NEW USER  
                cb(false);
            } else {
                cb(true);
                socket.nickname = data; //SAVE (data)NAME USER IN SOCKET
                nicknames.push(socket.nickname); //SAVE IN nicknames ARRAY A NEW USER
                updateNicknames(); //SEND ALL USERS OF 'nicknames' ARRAY
            }
        });

        socket.on('send message', data => { //DATA OF ONE CLIENT
            io.sockets.emit('new message', {
                msg: data,
                nick: socket.nickname
            }); //SERVER TRANSMITS THE MESSAGE AND USER FROM AN OBJECT TO ALL CLIENTSS
        });

        socket.on('disconnect', data => {
            if (!socket.nickname) return; //RETURNS EMPTY BECAUSE THERE IS NO USERNAME CONNECTED TO THE SOCKET OBJECT
            nicknames.splice(nicknames.indexOf(socket.nickname), 1); //DELETE ONE USER, IF IT HAS BEEN DISCONNECTED
            updateNicknames(); //UPDATE LIST OF CONNECTED USERS
        });

        //CONTAINS LIST OD CONNECTED USERS
        function updateNicknames() {
            io.sockets.emit('usernames', nicknames);
        }
    });
}

//SOCKET STORE ONE CLIENT
//IO STORE ALL THE CLIENTS