'use strict';

const message = require('./modules/messages/socket');

module.exports = (socket, container) => {
    if (socket.session.userID) {
        socket.userID = socket.session.userID;
        container.add(socket);
    }
    socket.on('disconnect', () => {
        if (socket.session.userID) {
            container.remove(socket);
        }
    });
    message(socket);
};