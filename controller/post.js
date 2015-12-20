var config = require('../config');
var Post = require('../proxy').Post;
var User = require('../proxy/').User;
var Comments = require('../proxy/').Comments;
var crypto = require('crypto');
var markdown = require('markdown').markdown;

exports.index = function (req, res, next) {

	User.count({}, function(err, count) {
		if (count == 0) {
			res.redirect('/reg');
		}
	})

	var page = parseInt(req.query.p) || 1;
	var comments = [];

	Post.getFullPost(page, function(err, posts) {
		if( err) {
			return next(err);
		}
		Post.count({}, function(err, count){
			if (err) {
				return next(err);
			}
			res.render('index', {
				title:'首页',
				posts: posts,
				user: req.session.user,
				page: page,
				isFirstPage: (page - 1) == 0,
      			isLastPage: ((page - 1) * 10 + posts.length) == count
			});
		})		
		
	});
};

exports.showPost = function(req, res) {
	res.render('post', {
		title:'发表',
		user: req.session.user
	})
};

exports.post = function (req, res, next) {
	var currentUser = req.session.user;
	var title = req.body.title,
		content = req.body.post;
	var	tags = req.body.tags.split(" ");
	var date = new Date();
	var time = {
			date: date,
			year: date.getFullYear(),
			month: date.getFullYear() + "-" + (date.getMonth() + 1),
			day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "," + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes())
		};

		Post.newAndSave(title, content, currentUser.username, tags, time, function(err,post){
		if (err) {
			return next(err);
		}
	});
	res.redirect('/');
};

exports.searchUserPost = function (req, res) {
	var comments = [];
	User.getUserByUsername(req.params.author, function(err, user) {
		if (!user) {
			return res.redirect('/');
		}
		Post.getPostsByAuthor(user.username, function(err, posts) {
			if (err) {
				return res.redirect('/');
			}

			res.render('user', {
				title: user.username,
				posts: posts,
				user: req.session.user
			});
		});
	});
};

exports.showOnePost = function (req, res) {
	Post.getOnePost(req.params.pid, function (err, post) {
		if (err) {
			return res.redirect('/');
		}
		post.content = markdown.toHTML(post.content);
		Comments.getCommentsById(req.params.pid, function(err, comments) {
			if(comments){
			
				comments.forEach(function(comment){
					comment.content = markdown.toHTML(comment.content);
				});
			}

			res.render('article', {
				title: post.title,
				comments: comments,
				post: post,
				user: req.session.user
			});
		});
		
	});
};

exports.saveComments = function (req, res, next) {
	var date = new Date();
	var time = {
			date: date,
			year: date.getFullYear(),
			month: date.getFullYear() + "-" + (date.getMonth() + 1),
			day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "," + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes())
	};
	Comments.newAndSave(req.body.content, req.body.name, req.params.pid, time, function(err){
		if(err) {
			return next(err);
		}
	});
	Post.addComment(req.params.pid, function(err){
		if(err) {
			return next(err);
		}
	});
	res.redirect('/post/'+ req.params.pid);
};

exports.showUpdatePost = function (req, res) {
	Post.getOnePost(req.params.pid, function (err, post) {
		if (err) {
			return res.redirect('/');
		}
		res.render('edit', {
			title: '编辑',
			post: post,
			user: req.session.user
		});
	});
};

exports.updatePost = function (req, res, next) {
	var title = req.body.title;
	var content = req.body.content;
	tags = [req.body.tag1, req.body.tag2, req.body.tag3];
	Post.getOnePost(req.params.pid, function (err, post){
		post.title = title;
		post.content = content;
		post.time = new Date();
		post.tags = tags;
		post.save(function (err) {
			res.redirect('/post/' + post._id);
		});
	});
};

exports.removePost = function(req, res) {

	Post.removePost(req.params.pid, function(err) {
		if (err){
			res.redirect('/post/' + req.params.pid);
		}
		res.redirect('/');
	});
};

exports.archive = function (req, res) {
	Post.getArchive(function(err, posts) {
		res.render('archive', {
			title: '存档',
			posts: posts,
			user: req.session.user
		});
	});
};

exports.getTags = function (req, res) {
	Post.getTags(function (err, posts) {
		res.render('tags', {
			title: '标签',
			posts: posts,
			user: req.session.user
		});
	});
};

exports.getTagPosts = function (req, res) {
	Post.getTagPosts(req.params.tag, function(err, posts){
		res.render('tag', {
			posts: posts,
			title: 'TAG:' + req.params.tag,
			user: req.session.user
		});
	});
};


exports.pageNotFound = function(req, res) {
	res.render("404");
};
