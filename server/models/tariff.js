var mongoose = require('mongoose');
var tariffSchema = mongoose.Schema({
  Cab: String,
  NormalRate: String,
  PeakRate: String,
  StartPeak: String,
  EndPeak: String
});

module.exports = mongoose.model('tariff', tariffSchema);
