'use strict';

const request = require('request-promise');
const config = require('../../config');

exports.login = (data) => {
    return request({
        method: 'POST',
        uri: config.service.base + '/users/login',
        form: data,
        json: true
    });
};

exports.register = (data) => {
    return request({
        method: 'POST',
        uri: config.service.base + '/users/register',
        form: data,
        json: true
    });
};

exports.get = (id) => {
    return request({
        method: 'GET',
        uri: config.service.base + '/user/' + id,
        json: true
    });
}
