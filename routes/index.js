var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var cfenv = require('cfenv');

var conf = cfenv.getAppEnv().getServiceCreds('aws-mongo')

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/:collection', function(req, res, next) {
  conf.collection = req.params.collection
  var url = 'mongodb://' + conf.host + ':' + conf.port + '/' + conf.database;
  mongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.collection(conf.collection, function(err, collection) {
      collection.find({}).toArray(function(err, docs) {
        console.log("insert success");
        db.close();
        res.render('collection', {
          conf: conf,
          docs: docs
        });
      });
    });
  });
});

module.exports = router;
