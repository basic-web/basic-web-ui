'use strict';

const cookie = require('express-session/node_modules/cookie');
const signature = require('express-session/node_modules/cookie-signature');
const config = require('../config');

exports.getSession = cookies => {
    const parsedCookies = cookie.parse(cookies);
    if (parsedCookies && parsedCookies[config.session.name]) {
        const raw = parsedCookies[config.session.name];
        if (raw) {
            if (raw.substr(0, 2) === 's:') {
                val = unsigncookie(raw.slice(2), secrets);
                if (val === false) {
                    val = undefined;
                }
            } else {
                debug('cookie unsigned')
            }
        }
        return signature.unsign(parsedCookies[config.session.name], config.session.secret);
    }
    return false;
};