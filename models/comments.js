var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var CommentsSchema = new Schema({
	content: { type: String },
	readername: { type: String },
	comment_id: { type: ObjectId },
	time: {},

});

mongoose.model('Comments', CommentsSchema);