'use strict';

const controller = require('./controller');

module.exports = app => {
    app.post('/common/upload', controller.upload);
    app.get('/common/files/:path', controller.file);
};