var eventproxy = require('eventproxy');
var Comment = require('./comments');
var models = require('../models');
var Images = models.Images;
var User = require('./user');
var markdown = require('markdown').markdown;


exports.newAndSave = function (title, description, path, author, tags, time, callback) {
	var images = new Images();
	images.title = title;
	images.description = description;
	images.path = path;
	images.author = author;
	images.tags = tags;
	images.time = time;
	images.save(callback);
};

exports.getOneImage = function (id, callback) {

	Images.findOne({_id: id}, function (err, image) {
		if (err) {
			return callback(err);
		}
		if (image) {
			image.update({$inc: {"pv": 1}}, function(err){
				if (err) {
					return callback(err);
				};
			});
		}
		callback(null, image);
	});

};

exports.getImagesByAuthor = function (author, callback) {

	Images.find({author: author}, function (err, docs) {
		callback(null, docs);
	});
};

exports.getFullImages = function (page, callback) {
	Images.find({}, null, {skip: (page - 1) * 10, limit: 10, sort:{time: -1}}, function (err, images) {
		callback(null, images);
	});
};

exports.removeImage = function (id, callback) {

	Images.remove({_id: id}, callback);
};

exports.count = function (condition, callback) {
	Images.count(condition, function(err, count) {
		callback(err, count);
	});
};

exports.getImagesArchive = function (callback) {
	Images.find({}, null, {"author": 1, "time": 1, "title": 1, sort: {time: -1}}, function(err, docs) {
		callback(null, docs);
	})
}

exports.getImagesTags = function(callback) {
	Images.distinct("tags", function (err, docs) {
		callback(null, docs);
	});
};

exports.getTagImages = function(tag, callback) {
	Images.find({"tags": tag}, null, {"name": 1, "title": 1, "title": 1, sort: {time: -1}}, function (err, docs){
		callback(null, docs);
	});
};

exports.search = function(keyword, callback) {
	var pattern = new RegExp(keyword, "i");
	Images.find({"title": pattern}, null, {"name": 1, "title": 1, "title": 1, sort: {time: -1}}, function (err, images){
		callback(null, images);
	});
}

exports.addComment = function(condition, callback) {
	Images.findOne({_id: condition}, function (err, image) {
		if (err) {
			return callback(err);
		}
		if (image) {
			post.update({$inc: {"cmtcount": 1}}, function(err){
				if (err) {
					return callback(err);
				};
			});
		}
		callback(null, image);
	});
};
