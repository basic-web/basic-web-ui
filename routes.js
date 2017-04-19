'use strict';

const dashboard = require('./modules/dashboard');
const users = require('./modules/users');

module.exports = app => {
    app.use((req, res, next) => {
        if (['/login', '/register'].indexOf(req.path) === -1 && !req.session.userID) {
            return res.redirect('/login');
        }
        next();
    });
    dashboard(app);
    users(app);
};
