'use strict';

exports.get = (req, res) => {
    res.json({
        total: 2, message: {
            id: '1',
            source: null,
            dest: 'fe57067b-c6c6-4da6-b9e7-f8007001b311',
            title: 'test',
            content: 'content',
            createdTime: '2017-04-28 02:46:05'
        }
    });
}