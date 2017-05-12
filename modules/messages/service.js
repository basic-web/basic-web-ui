'use strict';

const request = require('request-promise');
const config = require('../../config');

exports.latest = (userID, size) => {
    return request({
        method: 'GET',
        uri: config.service.base + '/messages/latest?userID=' + userID + '&size=' + size,
        json: true
    });
};

exports.read = (userID, messageID) => {
    return request({
        method: 'PUT',
        uri: config.service.base + '/message/' + messageID + '/user/' + userID + '/read',
        json: true
    });
};