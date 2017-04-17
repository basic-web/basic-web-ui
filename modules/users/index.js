const config = require('../../config')

module.exports = app => {
    app.get('/login', (req, res) => {
        res.render('users/login', {title: config.app.name});
    });
}