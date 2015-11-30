var models = require('../models');
var Comments = models.Comments;
var User = require('./user');
var Post = require('./post');
var markdown = require('markdown').markdown;

exports.newAndSave = function (content, readername, postid, time, callback) {
	var comments = new Comments();
	comments.content = content;
	comments.readername = readername;
	comments.comment_id = postid;
	comments.time = time;
	comments.save(callback);
};

exports.getCommentsById = function (id, callback) {

	Comments.find({comment_id: id}, function (err, comments) {
		if (err) {
			return callback(err);
		}
		callback(null, comments);
	});

};

exports.getPostsByReader = function (readername, callback) {

	Comments.find({readername: readername}, function (err, docs) {
		docs.forEach(function(doc){
			doc.content = markdown.toHTML(doc.content);
		});
		callback(null, docs);
	});
};

exports.getPostCommet = function (postid, callback) {
	Comments.find({post_id: postid}, function(err, docs) {
		
		docs.forEach(function(doc){

			doc.content = markdown.toHTML(doc.content);
		});
		callback(null, docs);
	});
};

exports.removeComent = function (id, callback) {

	Comments.remove({_id: id}, callback);
};

