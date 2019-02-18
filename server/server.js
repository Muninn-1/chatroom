// Imports
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Initialisation 
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3002;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

// Socket connecting
io.on('connection', socket => {
    console.log('New user connected');

    //Server emit new message
    socket.emit('newMessage', {
        from: 'Not Oscar',
        text: 'Go to hell!'
    });

    // Socket create new email
    socket.on('createMessage', message => {
        console.log('createMessage', message)
    })

    // Socket disconnecting
    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
