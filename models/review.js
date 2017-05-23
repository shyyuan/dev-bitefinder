var mongoose = require('mongoose');
var User = require('./users.js');

var reviewSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  restaurantId: {type:String, required:true},
  comments: String
});

module.exports = mongoose.model('Review', reviewSchema);
