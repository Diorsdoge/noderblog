var models = require('../models');
var User = models.User;

exports.getUserByUsername = function (username, callback) {
	User.findOne({ 'username': username }, function(err, user){
		callback(null, user);
	});
};

exports.getUsersByQuery = function (query, opt, callback) {
	User.find(query, '', opt, callback);
};

exports.newAndSave = function (username, password, callback) {
	var user  = new User();
	user.username = username;
	user.password = password;

	user.save(callback);
};

exports.count = function(condition, callback) {
	User.count(condition, function (err, count) {
		callback(err, count);
	});
};