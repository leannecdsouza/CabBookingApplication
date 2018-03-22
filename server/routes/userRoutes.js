var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var user = require('../models/user');
var jwt = require('jsonwebtoken');

// Update user details
router.put('/updateuser/:id', function(req, res) {
  user.findOneAndUpdate({
    _id: req.params.id
  }, {
    Name: req.body.Name,
    Mobile: req.body.Mobile,
    Email: req.body.Email,
    Password: req.body.Password,
    Role: req.body.Role,
  }, function(err, doc) {
    if (err) {} else {
      res.json({
        success: true,
        message: 'User Details Updated'
      });
    }
  });
});


// Login
router.post('/login', function(req, res) {
  user.findOne({
    Email: req.body.Email
  }, function(err, user) {
    if (err) {
      throw err;
    } else if (!user) {
      res.json({
        success: false,
        message: 'Sorry! Wrong Email ID'
      });
      console.log('Email Address not found');
    } else if (!bcrypt.compareSync(req.body.Password, user.Password)) {
      res.json({
        success: false,
        message: 'Sorry! Wrong Password'
      });
      console.log('Incorrect Password');
    } else if (user) {
      var token = jwt.sign(user.toObject(), 'secretkeyorsomething', {
        expiresIn: 1000
      });
      res.json({
        success: true,
        jwttoken: token,
        isLoggedIn: true,
        userDetails: user
      });
      console.log(token);
      console.log("Logged In Successfully");
    }
  });
});

// Find a User
router.get('/finduser/:id', function(req, res) {
  user.find({
    _id: req.params.id
  }, function(err, data) {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// Deleting User
router.delete('/deleteuser/:id', function(req, res) {
  user.findOneAndRemove({
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

// Display all users
router.get('/getusers', function(req, res) {
  user.find({}, function(err, data) {
    if (err) {
      throw err;
    } else {
      res.json(data);
    }
  });
});

// Add new user
router.post('/adduser', function(req, res) {
  user.findOne({
    'Email': req.body.Email
  }, function(err, data) {
    if (err) {
      return err;
    }
    if (data) {
      console.log('User already exists');
    } else {
      var newUser = new user();
      newUser.Name = req.body.Name;
      newUser.Mobile = req.body.Mobile;
      newUser.Email = req.body.Email;
      newUser.Password = bcrypt.hashSync(req.body.Password);
      newUser.Role = req.body.Role;
      newUser.save(function(err, doc) {
        if (err) {
          throw err;
        } else {
          res.json({
            success: true,
            message: 'New User Saved'
          });
        }
      });
    }
  });
});

module.exports = router;
