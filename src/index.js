//SERVER
const http = require('http');
const path = require('path');

const express = require('express');
const socketIO = require('socket.io');

const app = express();
//CHANGE PROPERTIES OF APP TO HTTP, BECAUSE WE NEED A SERVER
const server = http.createServer(app);
//CONEXION CREATED FOR CHAT. ALLOW YOU TO SEND DATA FROM CLIENT TO SERVER
const io = socketIO.listen(server);

//SETTINGS
app.set('port', process.env.PORT || 3000);

//CONEXION WITH THE FILE SOCKETS. PASSING THE PARAMETER 'IO'
require('./sockets')(io);

//CONEXION WITH PUBLIC FOLDER 
app.use(express.static(path.join(__dirname, 'public')));

//PORT
server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})