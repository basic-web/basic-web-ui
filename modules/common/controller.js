'use strict';

const fs = require('fs');
const multiparty = require('multiparty');
const config = require('../../config');

exports.upload = (req, res) => {
    const form = new multiparty.Form({
        uploadDir: config.upload.dir
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.json({ message: err.message || 'Server Internal Error' });
            return;
        }
        res.json({
            fieldName: files.file[0],
            fileName: files.file[0].originalFilename,
            path: files.file[0].path.replace(config.upload.dir, ''),
            size: files.file[0].size
        });
    });
};

exports.file = (req, res, next) => {
    fs.exists(config.upload.dir + req.params.path, exists => {
        if (exists) {
            res.sendFile(req.params.path, { root: config.upload.dir }, err => {
                if (err) next(err);
            });
        } else {
            res.status(404).render('common/error', { status: 404, message: '文件不存在' });
        }
    });
};
