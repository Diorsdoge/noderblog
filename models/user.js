var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username: { type: String },
	password: { type: String },
	// location: { type: String },
	// email: { type: String },
	// github: { type: String },
	// weibo: { type: String },
	// zhihu: { type: String }
});

mongoose.model('User', UserSchema);
