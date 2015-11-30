var eventproxy = require('eventproxy');
var Comment = require('./comments');
var models = require('../models');
var Post = models.Post;
var User = require('./user');
var markdown = require('markdown').markdown;


exports.newAndSave = function (title, content, author, tags, time, callback) {
	var post = new Post();
	post.title = title;
	post.content = content;
	post.author = author;
	post.tags = tags;
	post.time = time;
	post.save(callback);
};

exports.getOnePost = function (id, callback) {

	Post.findOne({_id: id}, function (err, post) {
		if (err) {
			return callback(err);
		}
		if (post) {
			post.update({$inc: {"pv": 1}}, function(err){
				if (err) {
					return callback(err);
				};
			});
		}
		callback(null, post);
	});

};

exports.getPostsByAuthor = function (author, callback) {

	Post.find({author: author}, function (err, docs) {
		docs.forEach(function(doc){
			doc.content = markdown.toHTML(doc.content);
		});
		callback(null, docs);
	});
};

exports.getFullPost = function (page, callback) {
	Post.find({}, null, {skip: (page - 1) * 10, limit: 10, sort:{time: -1}}, function (err, docs) {
		docs.forEach(function(doc) {
			doc.content = markdown.toHTML(doc.content);
		});

		callback(null, docs);
	});
};

exports.removePost = function (id, callback) {

	Post.remove({_id: id}, callback);
};

exports.count = function (condition, callback) {
	Post.count(condition, function(err, count) {
		callback(err, count);
	});
};

exports.getArchive = function (callback) {
	Post.find({}, null, {"author": 1, "time": 1, "title": 1, sort: {time: -1}}, function(err, docs) {
		callback(null, docs);
	})
}

exports.getTags = function(callback) {
	Post.distinct("tags", function (err, docs) {
		callback(null, docs);
	});
};

exports.getTagPosts = function(tag, callback) {
	Post.find({"tags": tag}, null, {"name": 1, "title": 1, "title": 1, sort: {time: -1}}, function (err, docs){
		callback(null, docs);
	});
};

exports.search = function(keyword, callback) {
	var pattern = new RegExp(keyword, "i");
	Post.find({"title": pattern}, null, {"name": 1, "title": 1, "title": 1, sort: {time: -1}}, function (err, docs){
		callback(null, docs);
	});
}

exports.addComment = function(condition, callback) {
	Post.findOne({_id: condition}, function (err, post) {
		if (err) {
			return callback(err);
		}
		if (post) {
			post.update({$inc: {"cmtcount": 1}}, function(err){
				if (err) {
					return callback(err);
				};
			});
		}
		callback(null, post);
	});
};






