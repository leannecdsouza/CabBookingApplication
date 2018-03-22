var mongoose = require('mongoose');
var bookingSchema = mongoose.Schema({
  CustomerName: String,
  CustomerMobile: String,
  CustomerEmail: String,
  Booking: String,
  Cab: String,
  StartPoint: String,
  EndPoint: String,
  TravelDate: String,
  TravelTime: String,
  Distance: String,
  Total: String
});

module.exports = mongoose.model('booking', bookingSchema);
