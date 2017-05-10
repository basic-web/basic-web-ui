'use strict';

const _ = require('lodash');

module.exports = class Container {
    constructor() {
        this.sockets = {};
    }

    add(socket) {
        if (!this.sockets[socket.userID]) {
            this.sockets[socket.userID] = {};
        }
        this.sockets[socket.userID][socket.id] = socket;
    }

    remove(socket) {
        if (this.sockets[socket.userID]) {
            _.unset(this.sockets[socket.userID], socket.id);
        }
    }

    get(userID) {
        return this.sockets[userID];
    }
};
