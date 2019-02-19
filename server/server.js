// Imports
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Initialisation 
const { generateMessage, generateLocationMessage } = require('./utils/message')
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3002;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

// Socket connecting
io.on('connection', socket => {
    console.log('New user connected');

    // Greeting new user & tell to other users
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined'));


    // Socket create new email
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message)
        //Server relay socket new message to ALL connected sockets
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', coords => {
        console.log('locationMessage', coords )
        io.emit('newLocationMessage', generateLocationMessage(coords.from, coords.latitude, coords.longitude));
    });

    // Socket disconnecting
    socket.on('disconnect', () => {
        console.log('User was disconnected')
        socket.broadcast.emit('newMessage', generateMessage('Admin', 'User was disconnected'));
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
