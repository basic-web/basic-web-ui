'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const expressValidator = require('express-validator');
const sessionPatch = require('./utils/session-patch');
const config = require('./config');
const routes = require('./routes');
const sockets = require('./sockets');
const debug = require('debug')('basic-web-ui:app');

const app = express();

const store = new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
    ttl: config.session.ttl
});

// initial socket.io
const server = require('http').Server(app);
const io = require('socket.io')(server);
io.on('connection', socket => {
    const sid = sessionPatch.getSession(socket.handshake.headers.cookie);
    if (sid) {
        store.get(sid, (err, sess) => {
            if (err) {
                debug('get session from session store error', err);
                socket.session = {};
            } else {
                if (!sess) {
                    debug('get session from session store return null');
                    sess = {};
                }
                socket.session = sess;
                sockets(socket);
            }
        });
    } else {
        socket.session = {};
        sockets(socket);
    }
});

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
    name: config.session.name,
    store: store,
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

server.listen(3000, function () {
    debug('Listening on ' + 3000);
});
