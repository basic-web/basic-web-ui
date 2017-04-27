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

SeaweeDFS.prototype.lookup = function (fid, callback) {
    const volume = fid.split(/,|\//)[0];
    request({
        method: 'GET',
        uri: this.master + '/dir/lookup?volumeId=' + volume,
        json: true
    }).then(result => {
        callback(null, { uri: 'http://' + result.locations[0].url + "/" + fid });
    }).catch(err => {
        callback(err);
    });
}

module.exports = SeaweeDFS;
