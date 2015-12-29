var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImagesSchema = new Schema({
	title: { type: String },
	author: { type: String },
	description: { type: String },
	path: { type: String },
	time: { },
	tags: { type: Array },
	pv: { type: Number, default: 0 },
});

mongoose.model('Images', ImagesSchema);