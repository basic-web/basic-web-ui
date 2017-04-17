const users = require('./modules/users');

module.exports = app => {
    users(app);
}