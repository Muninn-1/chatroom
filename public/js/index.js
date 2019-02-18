let socket = io();

socket.on('connect', () => {
    console.log('Connected to server')

    // Socket create new email
    socket.emit('createMessage', {
        from: 'Arcos',
        text: 'hello world!'
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server')
});

socket.on('newMessage', message => {
    console.log('New Email', message);
});