
var router = require('express').Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , async = require('async')
  , CreateValidation = require('../forms/user/create')
  , EditValidation = require('../forms/user/edit');

router.get('/', function(req, res, next) {
    var limit = +req.param('limit') || 10
      , page  = +req.param('page') || 1;

    async.parallel({
        data: function(done) {
            User.find().skip((page - 1) * limit).limit(limit).exec(done)
        },
        totalItems: function(done) {
            User.count(done)
        }
    }, function(err, results) {
        if (err) { return next(err) }

        results.currentPage  = page;
        results.itemsPerPage = limit;
        results.totalPages   = Math.ceil(results.totalItems / limit);
        res.json(results);
    })
});

router.get('/:id', function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (err) { return next(err) }
        res.json(user)
    })
});

router.put('/:id', function(req, res, next) {
    var data = req.body;
    data._id = req.params.id;

    async.waterfall([
        function(next) {
            (new EditValidation(data)).validate(next)
        },
        function(errors, next) {
            if (errors.length) {
                return res.json(400, errors)
            }
            User.findById(req.params.id, next)
        },
        function(user, next) {
            user.set(data).save(next)
        }
    ], function(err, user) {
        if (err) { return next(err) }
        res.json(user)
    })
});

router.post('/', function(req, res, next) {
    async.waterfall([
        function(next) {
            (new CreateValidation(req.body)).validate(next)
        },
        function(errors, next) {
            if (errors.length) {
                return res.json(400, errors)
            }
            User.create(req.body, next)
        }
    ], function(err, user) {
        if (err) { return next(err) }
        res.json(user)
    })
});

router.delete('/:id', function(req, res, next) {
    async.waterfall([
        function(done) {
            User.findById(req.params.id, done)
        },
        function(user, done) {
            if (!user) {
                return done('User not found')
            }
            user.remove(done)
        }
    ], function(err) {
        if (err) { return next(err) }
        res.json(true)
    })
});

module.exports = router;
