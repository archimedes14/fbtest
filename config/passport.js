var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var User = require('../models/user'); 

module.exports = function() {
	passport.use(new FacebookStrategy({
    clientID: "826850717412826",
    clientSecret: "a79b883800366484175a6d192cd4768f",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
}
