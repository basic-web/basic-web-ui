'use strict';

const config = require('../../config');
const controllers = require('./controllers');

module.exports = app => {
    app.get('/login', (req, res) => {
        res.render('users/login', {title: config.app.name});
    });
    app.post('/login', controllers.login);
};
