// ================ DEPENDENCIES ===================
var express = require('express');
var router = express.Router();
var User = require('../models/users.js');
var bcrypt = require('bcrypt');

router.get('/', function(req, res){
  console.log('login');
})


// ===============  CREATE SESSION ROUTE (Login) ===================
router.post('/', function(req,res){
  // Not allowed password in blank
  if (req.body.password === undefined || req.body.password === '') {
    res.send('failed');
  } else {
    User.findOne({username:req.body.username}, function(err, foundUser){
      if (foundUser) {
        if (bcrypt.compareSync(req.body.password,foundUser.password)){
          req.session.sessionUser = foundUser;
          res.json(req.session.sessionUser);
        } else {
          res.send('failed');
        }
      } else {
        res.send('failed');
      }
    });
  }
});

// ===============  DELETE SESSION ROUTE (Logout) ===================
router.delete('/', function(req,res){
  req.session.destroy(function(){
    res.send('logout successfully');
  });
});

module.exports = router;
