'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const expressValidator = require('express-validator');
const config = require('./config');
const routes = require('./routes');
const debug = require('debug')('basic-web-ui:app');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'static')));

app.use(session({
    store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        ttl: config.session.ttl
    }),
    resave: false,
    saveUninitialized: true,
    secret: config.session.secret
}));

app.use((req, res, next) => {
    req.isAjaxRequest = req.get("X-Requested-With") && "xmlhttprequest" === req.get("X-Requested-With").toLowerCase();
    next();
});

routes(app);

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    debug('occur exception', err);
    res.status(err.status || 500);
    if (req.isAjaxRequest) {
        res.json({ message: err.message || 'Server Internal Error' });
    } else {
        res.render('common/error', { status: err.status || 500, message: err.message });
    }
});

app.listen(3000, function () {
    debug('Listening on ' + 3000);
});
