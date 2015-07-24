var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var cfenv = require('cfenv');

var conf = cfenv.getAppEnv().getServiceCreds('AWS MongoDB - Secure Gateway')

var url = 'mongodb://' + conf.host + ':' + conf.port + '/' + conf.database;

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/:collection', function(req, res, next) {
  conf.collection = req.params.collection
  mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.collection(conf.collection, function(err, collection) {
      collection.find({}).toArray(function(err, docs) {
        console.log("find success");
        db.close();
        res.render('collection', {
          conf: conf,
          docs: docs
        });
      });
    });
  });
});

router.post('/:collection', function(req, res) {
  conf.collection = req.params.collection
  mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.collection(conf.collection, function(err, collection) {
      collection.remove({}, function(err, result) {
        console.log("Removed the document with the field a equal to 3");
        db.close();
        res.redirect('/' + conf.collection);
      });
    });
  });
});

module.exports = router;
