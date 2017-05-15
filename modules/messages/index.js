'use strict';

const controller = require('./controller');

module.exports = app => {
    app.get('/message/:id', controller.get);
    app.get('/messages', controller.page);
};