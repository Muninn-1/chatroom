let socket = io();
let output = document.getElementById('messages');

// Scrollbar handler
const scrollToBottom = () => {
    // Selectors
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    // Heigths
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

// Socket connect to socket server
socket.on('connect', () => {
    let params = jQuery.deparam(window.location.search);
    
    socket.emit('join', params, error => {
        console.log("plop", error);
        if(error) {
            alert(error);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

// Socket disconnectg from socket server
socket.on('disconnect', () => {
    console.log('Disconnected from server')
});

// Update users list on chat window
socket.on('updateUserList', users => {
    var ol = jQuery('<ul></ul>');

    users.forEach(user => {
    ol.append(jQuery(`<li>${user}  <img style="width:10%;" src="https://www.countryflags.io/fr/shiny/64.png"></li>`))
    });

    jQuery('#users').html(ol);
});

// Update rooms list on chat window
socket.on('updateRoomList', (rooms) => {
    console.log('OK', rooms)
    var ol = jQuery('<ul></ul>');

    rooms.forEach(room => {
        ol.append(jQuery('<li></li>').text(room))
    });

    jQuery('#rooms').html(ol);
});

// Display message on chat window
socket.on('newMessage', message => {
    let formattedTime = moment(message.createdAt).format('HH:mm');
    let template = jQuery('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

// Display location message on chat window
socket.on('newLocationMessage', message =>  {
    let formattedTime = moment(message.createdAt).format('HH:mm');
    let template = jQuery('#location-message-template').html();
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});


// Buttons handlers
let sendButton = jQuery('#message-form');
let leaveButton = jQuery("#leave-room");
let locationButton = jQuery('#send-location');

// Sending message button handler
sendButton.on('submit', event => {
    event.preventDefault();

    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User', 
        text: messageTextbox.val()
        }, () => {
            messageTextbox.val('')
    });
});

// Leaving button handler
leaveButton.on('click', () => {
    // socket.emit('leaving');
    window.location.href = '/';
});

// Sending location message button handler
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');


    navigator.geolocation.getCurrentPosition(position => {
        locationButton.removeAttr('disabled').text('Send location');

        socket.emit('createLocationMessage', {
            from: 'User',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to feth location.')
    })
});