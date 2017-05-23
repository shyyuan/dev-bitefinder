var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  name: String,
  cityId: {type: String, unique: true},
  user: String
});

module.exports = mongoose.model('Location', locationSchema);
