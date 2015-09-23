var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = require('../models/user'); 

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: "826850717412826",
    clientSecret: "a79b883800366484175a6d192cd4768f",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: false,
    profileFields: ['id','name','email','gender']
  },
  function(accessToken, refreshToken, profile, done) {
    
	process.nextTick(function() {
		return done(null, profile);
	})
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express', user: req.user});
});

router.get('/profile', ensureAuthenticated, function(req, res) {
	 User.find(function(err, user) {
		res.send(user);
	});

})


router.get('/auth/facebook',
 passport.authenticate('facebook',
	{scope:['public_profile','email']}),
	 function(req, res) {

});

router.get('/auth/facebook/callback',
 passport.authenticate('facebook', {failureRedirect:'/', scope:['email']}), function(req, res) {
 	var newUser = {
 		facebookId: req.user.id, 
 		first_name: req.user.name.givenName,
 		last_name: req.user.name.familyName,
 		email: req.user.email
 	}
 	User.findOrCreate(newUser, function(err, newUser) {
 		if (err) return console.log(err);
 		res.redirect('/profile');
 	});
});



module.exports = router;
