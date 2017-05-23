// ================== DEPENDENCIES =====================
var express = require('express');
var Loc = require('../models/locations.js');
var User = require('../models/users.js');
var router = express.Router();

// ================== ACTION ROUTES ====================
// creates a saved location and saves it to the specific user's model
router.post('/save', function(req, res){
  Loc.create(req.body, function(err, createdLocation){
    User.findById(createdLocation.user, function(err, foundUser){
      foundUser.savedLoc.push(createdLocation);
      foundUser.save(function(err, savedUser){
        res.json(savedUser);
      });
    });
  });
});

// deletes a saved location
router.delete('/delete/:id/:cityId', function(req, res){
  Loc.findByIdAndRemove(req.params.id, function(err, deletedLocation){
    User.findByIdAndUpdate(deletedLocation.user, { $pull: {"savedLoc":{"cityId": req.params.cityId}}}, { new: true }, function(err, foundUser){
      res.json(foundUser);
    });
  });
});

// ====================== EXPORTS ======================
module.exports = router;
