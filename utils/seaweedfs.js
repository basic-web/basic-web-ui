'use strict';

const fs = require('fs');
const request = require('request-promise');

function SeaweeDFS(options) {
    this.master = options.master || 'http://localhost:9333';
}

SeaweeDFS.prototype._assign = function (callback) {
    request({
        method: 'POST',
        uri: this.master + '/dir/assign',
        json: true
    }).then(result => {
        callback(null, result);
    }).catch(err => {
        callback(err);
    });
};

SeaweeDFS.prototype.write = function (path, callback) {
    this._assign((err, result) => {
        if (err) {
            return callback(err);
        }
        const formData = { file: fs.createReadStream(path) };
        request({
            method: 'PUT',
            uri: 'http://' + result.url + '/' + result.fid,
            formData: formData
        }).then(() => {
            callback(null, { fid: result.fid });
        }).catch(err => {
            callback(err);
        });
    });
};

module.exports = SeaweeDFS;
