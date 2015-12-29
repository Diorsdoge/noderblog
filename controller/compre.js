var Post = require('../proxy').Post;
var User = require('../proxy/').User;
var Images = require('../proxy/').Images;

exports.search = function (req, res) {
	Post.search(req.query.keyword, function(err, posts) {
		Images.search(req.query.keyword, function(err, images){
			res.render('search', {
				title: "SEARCH:" + req.query.keyword,
				posts: posts,
				images: images,
				user: req.session.user
			});	
		});
	});
};