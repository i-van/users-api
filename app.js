
/**
 * Module dependencies.
 */

var express    = require('express')
  , path       = require('path')
  , logger     = require('morgan')
  , bodyParser = require('body-parser')
  , mongoose   = require('mongoose')
  , swagger    = require('swagger-express');

var app = express();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/users');
require('./models/user');

// all environments
app.set('port', process.env.PORT || 3000);

if ('development' == app.get('env')) {
    app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.2',
    basePath: process.env.BASE_PATH || 'http://server:3000',
    swaggerURL: '/explorer',
    swaggerJSON: '/api-docs',
    swaggerUI: './public/explorer/',
    apis: ['./users.yml']
}));

app.get('/', function(req, res) {
    res.redirect('/explorer');
});

// user resource
app.use('/users', require('./routes/user'));

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
