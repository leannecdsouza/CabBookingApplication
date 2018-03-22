var mongoose = require('mongoose');
var driverSchema = mongoose.Schema({
  Name: String,
  Mobile: String,
  Email: String,
  DriverPermit: String,
  CabType: String,
  CabMake: String,
  CabModel: String,
  CabRegistration: String
});

module.exports = mongoose.model('driver', driverSchema);
