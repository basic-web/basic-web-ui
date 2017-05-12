'use strict';

const service = require('./service');

exports.get = (req, res) => {
    service.read(req.session.userID, req.params.id).then(message => {
        res.json(message);
    }).catch(err => {
        if (err.name === 'StatusCodeError') {
            res.status(err.statusCode).json({ message: err.error.message });
        } else {
            res.status(500).json({ message: err.message });
        }
    });
}