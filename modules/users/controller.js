'use strict';

const service = require('./service');

exports.login = (req, res) => {
    req.checkBody('phone', '电话号码错误').isMobilePhone('zh-CN');
    req.checkBody('password', '密码不能为空').notEmpty();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            res.status(400).json({ error: result.array() });
            return;
        }
        service.login(req.body).then(user => {
            req.session.userID = user.id;
            res.json({});
        }).catch(err => {
            if (err.name === 'StatusCodeError') {
                res.status(err.statusCode).json(err.error);
            } else {
                res.status(500).json({ message: err.message });
            }
        });
    });
};

exports.register = (req, res) => {
    req.checkBody('nickname', '昵称过长').isLength({ min: 1, max: 20 });
    req.checkBody('phone', '电话号码错误').isMobilePhone('zh-CN');
    req.checkBody('password', '密码不能为空').notEmpty();
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            res.status(400).json({ error: result.array() });
            return;
        }
        service.register(req.body).then(user => {
            req.session.userID = user.id;
            res.json({});
        }).catch(err => {
            if (err.name === 'StatusCodeError') {
                res.status(err.statusCode).json(err.error);
            } else {
                res.status(500).json({ message: err.message });
            }
        });
    });
};

exports.logout = (req, res) => {
    if (req.session.userID) {
        delete req.session.userID;
    }
    res.redirect('/');
};