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
            res.cookie('current-page', '/dashboard', { encode: function (data) { return data; } });
            res.json({});
        }).catch(err => {
            if (err.name === 'StatusCodeError') {
                res.status(err.statusCode).json({ message: err.error.message });
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
            res.cookie('current-page', '/dashboard', { encode: function (data) { return data; } });
            res.json({});
        }).catch(err => {
            if (err.name === 'StatusCodeError') {
                res.status(err.statusCode).json({ message: err.error.message });
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

exports.settings = (req, res) => {
    service.get(req.session.userID).then(user => {
        res.render('users/settings', {
            phone: user.phone,
            nickname: user.nickname
        });
    }).catch(err => {
        if (err.name === 'StatusCodeError') {
            res.status(err.statusCode).render('common/error', { status: err.statusCode, message: err.error.message });
        } else {
            res.status(500).render('common/error', { status: 500, message: err.message });
        }
    });
};

exports.do_settings = (req, res) => {
    req.checkBody('nickname', '昵称过长').isLength({ min: 1, max: 20 });
    if (req.body['change_password']) {
        req.checkBody('origin_password', '原密码不能为空').notEmpty();
        req.checkBody('password', '密码不能为空').notEmpty();
        if (req.body.password !== req.body.repassword) {
            res.status(500).json({ message: '两次输入密码不一致' });
        }
    }
    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            res.status(400).json({ error: result.array() });
            return;
        }
        service.modify(req.session.userID, req.body).then(user => {
            res.json({});
        }).catch(err => {
            if (err.name === 'StatusCodeError') {
                res.status(err.statusCode).json({ message: err.error.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        });
    });
};

exports.avatar = (req, res) => {
    service.get(req.session.userID).then(user => {
        res.render('users/avatar', {
            head: user.head
        });
    }).catch(err => {
        if (err.name === 'StatusCodeError') {
            res.status(err.statusCode).render('common/error', { status: err.statusCode, message: err.error.message });
        } else {
            res.status(500).render('common/error', { status: 500, message: err.message });
        }
    });
};
