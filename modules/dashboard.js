'use strict';

module.exports = app => {
    app.get('/', (req, res) => {
        res.redirect('/dashboard');
    });

    app.get('/dashboard', (req, res) => {
        res.send('This is dashboard.');
    });
};
