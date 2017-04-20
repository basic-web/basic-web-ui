'use strict';

module.exports = app => {
    app.get('/', (req, res) => {
        res.redirect('/dashboard');
    });

    app.get('/nav', (req, res) => {
        res.render('common/menu');
    });

    app.get('/dashboard', (req, res) => {
        res.render('dashboard');
    });
};
