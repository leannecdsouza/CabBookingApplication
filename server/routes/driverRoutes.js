var express = require('express');
var router = express.Router();
var driver = require('../models/driver');
var user = require('../models/user');

// Update driver details
router.put('/updatedriver/:id', function(req, res) {
  driver.findOneAndUpdate({
    _id: req.params.id
  }, {
    Name: req.body.Name,
    Mobile: req.body.Mobile,
    Email: req.body.Email,
    DriverPermit: req.body.DriverPermit,
    CabType: req.body.CabType,
    CabMake: req.body.CabMake,
    CabModel: req.body.CabModel,
    CabRegistration: req.body.CabRegistration,
  }, function(err, doc) {
    if (err) {} else {
      res.json({
        success: true,
        message: 'Driver Details Updated'
      });
    }
  });
});

// Find a Driver
router.get('/finddriver/:id', function(req, res) {
  driver.find({
    _id: req.params.id
  }, function(err, data) {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// Deleting Driver
router.delete('/deletedriver/:id', function(req, res) {
  driver.findOneAndRemove({
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

// Display all drivers
router.get('/getdrivers', function(req, res) {
  driver.find({}, function(err, data) {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// Add new driver
router.post('/adddriver', function(req, res) {
  var newDriver = new driver();
  newDriver.Name = req.body.Name;
  newDriver.Mobile = req.body.Mobile;
  newDriver.Email = req.body.Email
  newDriver.DriverPermit = req.body.DriverPermit;
  newDriver.CabType = req.body.CabType;
  newDriver.CabMake = req.body.CabMake;
  newDriver.CabModel = req.body.CabModel;
  newDriver.CabRegistration = req.body.CabRegistration;
  newDriver.save(function(err, doc) {
    if (err) {
      throw err;
    } else {
      res.json({
        success: true,
        message: 'New Driver Saved'
      });
    }
  });
});

module.exports = router;
