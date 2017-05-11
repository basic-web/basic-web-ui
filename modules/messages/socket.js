'use strict';

module.exports = socket => {
    socket.on('messages', () => {
        if (!socket.session.userID) return;
        socket.emit('messages', {
            total: 10, data: [{
                id: '1',
                source: null,
                dest: 'fe57067b-c6c6-4da6-b9e7-f8007001b311',
                title: 'test',
                content: 'content',
                createdTime: '2017-04-28 02:46:05'
            }, {
                id: '2',
                source: null,
                dest: 'fe57067b-c6c6-4da6-b9e7-f8007001b311',
                title: 'test',
                content: 'content',
                createdTime: '2017-04-28 02:46:05'
            }]
        });
    });
};