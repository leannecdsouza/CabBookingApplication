  var express = require('express');
  var router = express.Router();
  var travel = require('../models/booking');


  // Find a Travel Booking by User
  router.get('/findtravel/booking/:email', function(req, res) {
    travel.find({
      Cab: req.params.cab
    }, function(err, data) {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    });
  });


  // Display all travel plans
  router.get('/gettravels', function(req, res) {
    travel.find({}, function(err, data) {
      if (err) {
        throw err;
      } else {
        res.json(data);
      }
    });
  });

  // Add new travel plan
  router.post('/addtravel', function(req, res) {
    var newTravel = new travel();
    // newTravel.CustomerName = req.body.CustomerName;
    // newTravel.CustomerMobile = req.body.CustomerMobile;
    // newTravel.CustomerEmail = req.body.CustomerEmail;
    console.log("Reached here");
    console.log(req.body.BookingType);
    newTravel.Booking = req.body.BookingType;
    newTravel.Cab = req.body.Cab;
    newTravel.StartPoint = req.body.Pickup;
    newTravel.EndPoint = req.body.Dropoff;
    newTravel.TravelDate = req.body.Date;
    newTravel.TravelTime = req.body.Time;
    newTravel.Distance = req.body.Distance;
    newTravel.Total = req.body.Fare;
    newTravel.save(function(err, doc) {
      if (err) {
        throw err;
        console.log("Error" + err);
      } else {
        console.log("Else block");
        res.json({
          success: true,
          message: 'New Booking Saved'
        });
      }
    });
  });

  module.exports = router;
