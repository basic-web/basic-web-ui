'use strict';

const request = require('request-promise');

function SeaweeDFS(options) {
    this.prototype.master = options.master || 'http://localhost:9333';
}

SeaweeDFS.prototype = {
    _assgin: (callback) => {
        request({
            method: 'POST',
            uri: this.master + '/dir/assign',
            json: true
        }).then(result => {
            callback(null, result);
        }).catch(err => {
            callback(err);
        });
    },

    write: (file, callback) => {
        this._assgin((err, result) => {
            if (err) {
                return callback(err);
            }
            const formData = { file: fs.createReadStream(file) };
            request({
                method: 'PUT',
                uri: result.url + '/' + result.fid,
                form: formData
            }).then(() => {
                callback(null, { fid: result.fid });
            }).catch(err => {
                callback(err);
            });
        });
    }
};

module.exports = SeaweeDFS;
