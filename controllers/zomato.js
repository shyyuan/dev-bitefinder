// ================== DEPENDENCIES =====================
var express = require('express');
var request = require('request');
var router = express.Router();
require('dotenv/config');

// ================== API REQUESTS =====================

// searches for a list of restaurants within a city by city ID
router.get('/restaurants/:cityID', function(req, res, next){
  request({
    uri: 'https://developers.zomato.com/api/v2.1/search?entity_id=' + req.params.cityID + '&entity_type=city',
    headers: {'user-key':process.env.ZOMATO_API_KEY}
  }).pipe(res);
});

router.get('/restaurants/:cityID/cuisine/:type', function(req, res, next){
  request({
    uri: 'https://developers.zomato.com/api/v2.1/search?entity_id=' + req.params.cityID + '&entity_type=city&q=' + req.params.type,
    headers: {'user-key':process.env.ZOMATO_API_KEY}
  }).pipe(res);
});

// searches for a list of cities via a string query
router.get('/:cityInput', function(req, res, next){
  request({
    uri:'https://developers.zomato.com/api/v2.1/cities?q=' + req.params.cityInput,
    headers: {'user-key':process.env.ZOMATO_API_KEY}
  }).pipe(res);
});

// searches for restauruants within a location via long/lat
router.get('/:lat/:long', function(req, res, next) {
  request({
    uri: 'https://developers.zomato.com/api/v2.1/geocode?lat=' + req.params.lat + '&lon=' + req.params.long,
    headers: {'user-key':process.env.ZOMATO_API_KEY}
  }).pipe(res);
});

// ===================== EXPORTS ========================
module.exports = router;
