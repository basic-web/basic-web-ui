'use strict';

const config = require('../../config');
const controller = require('./controller');

module.exports = app => {
    app.get('/login', (req, res) => {
        res.render('users/login', {title: config.app.name});
    });
    app.post('/login', controller.login);
    app.post('/register', controller.register);
};
