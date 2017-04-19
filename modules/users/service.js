'use strict';

const request = require('request-promise');
const config = require('../../config');

exports.login = (data) => {
    return request({
        method: 'POST',
        uri: config.service.base + '/users/login',
        form: {
            phone: data.phone,
            password: data.password
        },
        json: true
    });
};
