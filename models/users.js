var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  name: {type: String},
  city: {type: String},
  favorites: Array,
  latitude: {type: String},
  longitude: {type: String},
  savedLoc: Array,
  profilePic: {type: String}
});

module.exports = mongoose.model('User', userSchema);
