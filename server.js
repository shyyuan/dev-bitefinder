// ================ DEPENDENCIES ===================
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bitefinder';
var session = require('express-session');


// ===============  MIDDLEWARE ======================
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({
  secret: "ellenjerricasheilabitefinder",
  resave: false,
  saveUninitialized: false
}));

// ===============  MIDDLEWARE ======================
var usersController = require('./controllers/users.js');
app.use('/users', usersController);
var sessionController = require('./controllers/sessions.js');
app.use('/sessions', sessionController);
var zomatoController = require('./controllers/zomato.js');
app.use('/zomato', zomatoController);
var reviewController = require('./controllers/review.js');
app.use('/review', reviewController);
var locationController = require('./controllers/locations.js');
app.use('/locations', locationController);

// ================== DB CONNECTION =====================
mongoose.connect(mongoDBURI);
mongoose.connection.once('open', function(){
  console.log('Database Connection is open');
});
// ================== LISTENER =====================
app.listen(port, function(){
  console.log('listening...');
});
