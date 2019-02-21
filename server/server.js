// Imports
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

// Initialisation 
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users')
;
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3002;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

// Socket connecting
io.on('connection', socket => {
    console.log('New user connected');

    // Joining private room
    socket.on('join', (params, callback) => {
        let user = users.getUserList(params.room).filter(user => user === params.name);
        let rooms = users.getRoomList(params.room);
    
        if(!isRealString(params.name) || !isRealString(params.room)) {
            
            return callback('Name & room name are required!');
        };
        if(user.length > 0) {
            return callback('Name already taken!');
        };

        socket.join(params.room, () => {
            
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.language, params.room);
            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
            io.emit('updateRoomList', rooms);  
            console.log("UserList ====>", users)
            console.log("RoomList ====>", rooms)          


        });
        
        // Greeting new user & tell to other users
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the room.`));

        callback();
    });

    // Socket sending new message
    socket.on('createMessage', (message, callback) => {
        let user =  users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            // Server relay socket new message to ALL connected sockets
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    // Socket sending geolocation
    socket.on('createLocationMessage', coords => {
        let user =  users.getUser(socket.id);

        if(user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    // Socket leaving room
    // socket.on('leaving', () => {
    //     let user = users.removeUser(socket.id);
    //     console.log(`${user.name} has leaved a room`)
    //     let rooms = users.getRoomList();
    //     console.log("RoomList ====>", rooms)
    //     if(user) {
    //         io.to(user.room).emit('updateUserList', users.getUserList(user.room));
    //         socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    //         socket.leave(user.room);
    //     }
    // });
    
    // Socket disconnecting
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        console.log(`User  was disconnected`)
        let rooms = users.getRoomList();
        console.log("RoomList ====>", rooms)
        console.log("UserList ====>", users)

        if(user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.emit('updateRoomList', rooms);            
            socket.broadcast.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

// Launching socket server
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
