// ================ DEPENDENCIES ===================
var express = require('express');
var Review = require('../models/review.js');
var router = express.Router();

// ===============  CREATE ROUTE ====================
router.post('/', function(req,res){
  Review.create(req.body, function(err, newReview){
    res.json(newReview);
  });
});

// ===============  RETRIEVE ROUTE ====================
// Retrieve a review about a restaurant by a user
router.get('/:userId/:restaurantId', function(req,res){
  //console.log('user id ' + req.params.userId);
  //console.log('rest id ' + req.params.restaurantId);
  Review.findOne({userId: req.params.userId, restaurantId:req.params.restaurantId}, function(error, foundReview){
    //console.log(foundReview);
    res.json(foundReview);
  });
});

// =============== UPDATE (PUT) ROUTES ========================
router.put('/:id', function(req, res){
  Review.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(error, updatedReview){
    res.json(updatedReview)
  });
});

// =============== DELETE ROUTE =======================
router.delete('/id/:id', function(req, res){
  Review.findByIdAndRemove(req.params.id, function(error, deletedReview){
    res.json(deletedReview);
  });
});

router.delete('/:userId/:restaurantId', function(req, res){
  Review.findOneAndRemove({userId: req.params.userId, restaurantId:req.params.restaurantId}, function(error, deletedReview){
    res.json(deletedReview);
  });
});

module.exports = router;
