var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: { type: String },
	author: { type: String },
	content: { type: String },
	time: { },
	tags: { type: Array },
	pv: { type: Number, default: 0 },
});

mongoose.model('Post', PostSchema);