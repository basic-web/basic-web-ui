'use strict';

const config = require('../../config');
const controller = require('./controller');

module.exports = app => {
    app.get('/login', (req, res) => {
        res.render('users/login', {title: config.app.name});
    });
    app.post('/login', controller.login);
    app.post('/register', controller.register);
    app.get('/logout', controller.logout);
    app.get('/settings', controller.settings);
    app.post('/settings', controller.do_settings);
    app.get('/avatar', controller.avatar);
    app.post('/avatar', controller.do_avatar);
};
