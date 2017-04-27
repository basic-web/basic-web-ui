'use strict';

const controller = require('./controller');

module.exports = app => {
    app.post('/common/upload', controller.upload);
    app.get('/common/download/:path', controller.download);
    app.get('/file/:fid', controller.file);
};