let socket = io();
let output = document.getElementById('messages');

socket.on('connect', () => {
    console.log('Connected to server')
});

socket.on('disconnect', () => {
    console.log('Disconnected from server')
});

socket.on('newMessage', message => {
    console.log('New Email', message);
    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', message =>  {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url)
    jQuery('#messages').append(li.append(a));
});


jQuery('#message-form').on('submit', event => {
    event.preventDefault();

    socket.emit('createMessage', {
        from: 'User', 
        text: jQuery('[name=message]').val()
        }, () => {

    });
});


let locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position.coords)
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        alert('Unable to feth location.')
    })
});