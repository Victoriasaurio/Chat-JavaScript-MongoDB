//THIS FILE WILL RECEIVE THE SOCKET CONEXION 

//SOCKET LISTEN NEW CONEXION OF CLIENT
//SOCKET SERVER
const Chat = require('./models/chat');
module.exports = function(io) {
    let users = {};

    io.on('connection', async socket => {
        console.log('new client conected');

        let messages = await Chat.find({}).limit(8); //FIND LAST 8 MESSAGE
        socket.emit('load old msg', messages);

        socket.on('new user', (data, cb) => {
            if (data in users) { //(nicknames.indexOf(data) != -1)  .indexOf RETURN AN INDEX LIKE [0,1,2,...] || -1 MEANS: NEW USER  
                cb(false);
            } else {
                cb(true);
                socket.nickname = data; //SAVE (data)NAME USER IN SOCKET
                users[socket.nickname] = socket; //EVERY USER CONNECTED HAS INFO OF SOCKET || //users.push(socket.nickname); //SAVE IN nicknames ARRAY A NEW USER
                updateNicknames(); //SEND ALL USERS OF 'nicknames' ARRAY
            }
        });

        socket.on('send message', async(data, cb) => { //DATA OF ONE CLIENT
            // /w vic mensaje....
            var msg = data.trim(); //REMOVE EXTRA SPACES FROM TEXTS

            if (msg.substr(0, 3) === '/w ') { //GO THROUGH THE INDEXES
                msg = msg.substr(3); //NEW MESSAGE FROM POSITION 3(SPACE)
                const index = msg.indexOf(' '); //ANALYZING THE SPACE
                if (index !== -1) {
                    var name = msg.substring(0, index); //GET USERNAME 
                    var msg = msg.substring(index + 1); //NEW MESSAGE FROM POSITION 1 AFTER INDEX
                    if (name in users) {
                        users[name].emit('whisper', { //SENDING MESSAGE LIKE OBJECT FROM EVENT 'whisper'
                            msg,
                            nick: socket.nickname //ISSUING USER
                        });
                    } else {
                        cb('Error! Please enter a valid user');
                    }
                } else {
                    cb('Error! Please enter your message');
                }
            } else {
                var newMsg = new Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMsg.save(); //SAVE DATA IN THE DB

                io.sockets.emit('new message', { //TWO PARAMETERS ('NAME_ACTION', 'DATA')
                    msg: data,
                    nick: socket.nickname
                }); //SERVER TRANSMITS THE MESSAGE AND USER FROM AN OBJECT TO ALL CLIENTSS
            }
        });

        socket.on('disconnect', data => {
            if (!socket.nickname) return; //RETURNS EMPTY BECAUSE THERE IS NO USERNAME CONNECTED TO THE SOCKET OBJECT
            delete users[socket.nickname]; //REMOVE USER WITH THE KEY 'socket.nickname' || //nicknames.splice(nicknames.indexOf(socket.nickname), 1); //DELETE ONE USER, IF IT HAS BEEN DISCONNECTED
            updateNicknames(); //UPDATE LIST OF CONNECTED USERS
        });

        //CONTAINS LIST OD CONNECTED USERS 
        function updateNicknames() {
            io.sockets.emit('usernames', Object.keys(users)); //GET KEYS OF OBJECT 'users'
        }
    });
}

//SOCKET STORE ONE CLIENT
//IO STORE ALL THE CLIENTS