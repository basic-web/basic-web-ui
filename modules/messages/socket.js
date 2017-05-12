'use strict';

const service = require('./service');

module.exports = socket => {
    socket.on('messages', () => {
        if (!socket.session.userID) return;
        service.latest(socket.session.userID, 6).then(data => {
            socket.emit('messages', data);
        }).catch(err => {
            if (err.name === 'StatusCodeError') {
                socket.emit('failure', err.error.message);
            } else {
                socket.emit('failure', err.message);
            }
        });
    });
};