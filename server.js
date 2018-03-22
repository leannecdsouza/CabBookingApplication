var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var path = require('path');

var bodyParser = require('body-parser');

var tariff_route = require('./server/routes/tariffRoutes');
var travel_route = require('./server/routes/travelRoutes');
var driver_route = require('./server/routes/driverRoutes');
var user_route = require('./server/routes/userRoutes');

var app = express();
app.use(express.static(path.join(__dirname, '/client')));

mongoose.connect('mongodb://localhost/CabBookingApp');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use('/', tariff_route);
app.use('/', travel_route);
app.use('/', driver_route);
app.use('/', user_route);

app.listen(3000, function(req, res) {
  console.log('Server is running on port 3000...');
});
