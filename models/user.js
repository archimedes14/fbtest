var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Connected to MongoDB");
});

var userSchema = mongoose.Schema({
	first_name: String,
	last_name: String, 
	email: String,
	facebookId: String
})

userSchema.static('findOrCreate', function(profile, callback) {
	this.findOne({"email":profile.email}, function(err, user) {
		if (err)
			return callback(err);
		if (user)
			return callback(null, user);

		user = new User({
			first_name: profile.first_name,
			last_name: profile.last_name,
			email: profile.email,
			facebookId: profile.facebookId
		});
		user.save(function(err, user) {
			if (err) 
				return callback(err);

			return callback(null, user);
		}) 
	});
});

var User = mongoose.model('User', userSchema);



module.exports = User; 