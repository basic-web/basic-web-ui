'use strict';

const fs = require('fs');
const multiparty = require('multiparty');
const request = require('request');
const config = require('../../config');
const SeaweeDFS = new require('../../utils/seaweedfs');
const weed = new SeaweeDFS({ master: config.seaweedfs.master });

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

exports.download = (req, res, next) => {
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

exports.file = (req, res, next) => {
    weed.lookup(req.params.fid, (err, result) => {
        if (err) {
            next(err);
            return;
        }
        res.setHeader("Cache-Control", "public, max-age=2592000");
        res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
        request.get(result.uri).pipe(res);
    });
};
