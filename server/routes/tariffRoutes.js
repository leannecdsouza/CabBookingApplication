var express = require('express');
var router = express.Router();
var tariff = require('../models/tariff');

// Update tariff plan
router.put('/updatetariff/:id', function(req, res) {
  tariff.findOneAndUpdate({
    _id: req.params.id
  }, {
    Cab: req.body.Cab,
    NormalRate: req.body.NormalRate,
    PeakRate: req.body.PeakRate,
    StartPeak: req.body.StartPeak,
    EndPeak: req.body.EndPeak,
  }, function(err, doc) {
    if (err) {} else {
      res.json({
        success: true,
        message: 'Tariff Plan Updated'
      });
    }
  });
});

// Find a Tariff Plan
router.get('/findtariff/:id', function(req, res) {
  tariff.find({
    _id: req.params.id
  }, function(err, data) {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// Find a Tariff Plan by CabType
router.get('/findtariff/cabrates/:cab', function(req, res) {
  tariff.find({
    Cab: req.params.cab
  }, function(err, data) {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// Deleting Tariff Plan
router.delete('/deletetariff/:id', function(req, res) {
  tariff.findOneAndRemove({
    _id: req.params.id
  }, function(err, doc) {
    if (err) {
      throw err;
    } else {
      res.json({
        success: true,
        message: 'Record Deleted'
      });
    }
  });
});

// Display all tariff plans
router.get('/gettariffs', function(req, res) {
  tariff.find({}, function(err, data) {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// Add new tariff plan
router.post('/addtariff', function(req, res) {
  var newTariff = new tariff();
  newTariff.Cab = req.body.Cab;
  newTariff.NormalRate = req.body.NormalRate;
  newTariff.PeakRate = req.body.PeakRate;
  newTariff.StartPeak = req.body.StartPeak;
  newTariff.EndPeak = req.body.EndPeak;
  newTariff.save(function(err, doc) {
    if (err) {
      throw err;
    } else {
      res.json({
        success: true,
        message: 'New Tariff Plan Saved'
      });
    }
  });
});

module.exports = router;
