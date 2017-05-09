'use strict';

module.exports = socket => {
    console.log(socket.handshake.headers.cookie);
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', data => {
        console.log(data);
    });
};