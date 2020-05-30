const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(80);

io.on('connection', (socket) => {
    
  socket.emit();
})

