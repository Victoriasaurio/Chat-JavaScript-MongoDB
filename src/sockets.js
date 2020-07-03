//THIS FILE WILL RECEIVE THE SOCKET CONEXION 

//SOCKET LISTEN NEW CONEXION OF CLIENT
//SOCKET SERVER
module.exports = function(io) {
    io.on('connection', socket => {
        console.log('new client conected');

        socket.on('send message', function(data) { //DATA OF ONE CLIENT
            io.sockets.emit('new message', data); //SERVER TRANSMITS THE MESSAGE TO ALL CLIENTSS
        })
    })
}

//SOCKET STORE ONE CLIENT
//IO STORE ALL THE CLIENTS