var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var cache = require('./routes/cache');
var users = require('./routes/users');
var inventory = require('./routes/inventory');


var app = express();

var c = require('appcache-node');

// generate a cache file
var cf = c.newCache([]);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.set('partials', {layout: 'layout'});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


/*------------------------------------------
 connection peer, register as middleware
 type koneksi : single,pool and request
 -------------------------------------------*/
var mysql = require('mysql'), // node-mysql module
    myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
        host: 'localhost',
        user: 'stock',
        password: 'dvyWVxuzQbKMI1l0',
        port: 3306,
        database: 'stockeepr'
    };
app.use(myConnection(mysql, dbOptions, 'single'));

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies


/* Assign routes */
app.use('/app.cache', cache);
app.use('/', routes);
app.use('/users', users);
app.use('/inventory', inventory);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




module.exports = app;
