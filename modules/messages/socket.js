'use strict';

const service = require('./service');

module.exports = socket => {
    socket.on('messages', () => {
        if (!socket.session.userID) return;
        service.latest(socket.session.userID, 6).then(data => {
            socket.emit('messages', data);
        }).catch(err => {
            socket.emit(err.message);
        });
    });
};