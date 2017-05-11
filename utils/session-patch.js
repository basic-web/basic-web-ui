'use strict';

const cookie = require('cookie');
const signature = require('cookie-signature');
const config = require('../config');

exports.getSession = cookies => {
    const parsedCookies = cookie.parse(cookies);
    var val = undefined;
    if (parsedCookies && parsedCookies[config.session.name]) {
        const raw = parsedCookies[config.session.name];
        if (raw && raw.substr(0, 2) === 's:') {
            val = signature.unsign(raw.slice(2), config.session.secret);
            if (val === false) {
                val = undefined;
            }
        }
    }
    return val;
};