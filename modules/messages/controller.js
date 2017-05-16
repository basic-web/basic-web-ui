'use strict';

const service = require('./service');

exports.get = (req, res) => {
    service.read(req.session.userID, req.params.id).then(message => {
        res.json(message);
    }).catch(err => {
        res.status(err.statusCode || 500).json({ message: err.message });
    });
};

exports.page = (req, res) => {
    const page = req.query.page ? req.query.page : 1;
    const q = req.query.q ? req.query.q : '';
    service.page(req.session.userID, page, q).then(page => {
        res.render('messages/index', { page: page, q: q });
    }).catch(err => {
        res.status(err.statusCode || 500).render('common/error', { status: err.statusCode || 500, message: err.message });
    });
}
