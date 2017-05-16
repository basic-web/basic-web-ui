'use strict';

const config = require('../config');
const userService = require('./users/service');

module.exports = app => {
    app.get('/', (req, res) => {
        res.redirect('/dashboard');
    });

    app.get('/base', (req, res) => {
        userService.get(req.session.userID).then(user => {
            res.json({
                appname: config.app.name,
                user: {
                    nickname: user.nickname,
                    head: user.head
                }
            });
        }).catch(err => {
            res.status(err.statusCode || 500).json({ message: err.message });
        });
    });

    app.get('/dashboard', (req, res) => {
        res.render('dashboard');
    });
};
