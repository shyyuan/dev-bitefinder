// ================ DEPENDENCIES ===================
var express = require('express');
var bcrypt = require('bcrypt');
var User = require('../models/users.js');
var router = express.Router();

// ===============  CREATE ROUTE ====================
router.post('/', function(req,res){
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); // encrypt the password
  User.create(req.body, function(err, newUser){
    res.json(newUser);
  });
});

// =============== PUT ROUTES ========================
// adds a restaurant to a user's favorites
router.put('/favorites/:id', function(req, res){
  //console.log(req.body);
  User.findById(req.params.id, function(err, foundUser){
    foundUser.favorites.push(req.body);
    foundUser.save(function(err, savedUser){
      res.json(savedUser);
    });
  });
});
// user update profile
router.put('/:id', function(req, res){
  if (req.body.password !== undefined) {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); // encrypt the password
  }
  User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(error, updatedUser){
    res.json(updatedUser)
  });
});

// =============== DELETE ROUTE =======================
// delets a restaurant from a user's favorites
router.delete('/favorites/:id/:restaurantId', function(req, res){
  User.findByIdAndUpdate(req.params.id, { $pull: {"favorites":{"id": req.params.restaurantId}}}, {new:true}, function(err, foundUser){
      res.json(foundUser);
  });
});

router.delete('/:id', function(req, res){
  User.findByIdAndRemove(req.params.id, function(error, deletedUser){
    res.json(deletedUser);
  });
});

// =============== RETRIEVE USER =======================
router.get('/:id', function(req, res){
  User.findById(req.params.id, function(error, foundUser){
    res.json(foundUser);
  });
});

module.exports = router;
