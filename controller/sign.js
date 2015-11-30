var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var Post = require('../proxy').Post;
var crypto = require('crypto');



exports.showRegister = function (req, res) {
	User.count({}, function(err, count) {
		if( count >0 ) {
			res.redirect('/');
		}
			res.render('reg', {
			title:'注册',
			user: req.session.user
		});
	});
	
};

exports.register = function (req, res, next) {

	User.count({}, function(err, count) {
		console.log(count);
		if(count > 0) {
			res.redirect('/reg');
		}
		var username = validator.trim(req.body.username);
		var	password = validator.trim(req.body.password);
		var	password_re = validator.trim(req.body['password-repeat']);

		if([username, password, password_re].some(function (item) { return item ===''; })) {
			res.redirect('/');
		
		}
		if (username.length < 4) {
			res.redirect('/');
		}
		if (password.length < 6) {
			res.redirect('/');
		}

		if (password_re != password) {
			res.redirect('/');
		}

		var md5 = crypto.createHash('md5');
		password = md5.update(req.body.password).digest('hex');
		User.newAndSave(username, password, function (err) {
			if (err) {
				return next(err);
			}
		});
		console.log("注册成功");

		var title = "你好！";
		var content = "### 欢迎使用 noderblog～～";
		var author = username; 
		var tags = [];
		var date = new Date();
		var time = {
			date: date,
			year: date.getFullYear(),
			month: date.getFullYear() + "-" + (date.getMonth() + 1),
			day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "," + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes())
		};
		Post.newAndSave(title, content, author, tags, time, function(err) {
			if (err) {
				res.redirect('/reg');
			}
		});
		res.redirect('/login');
	});
};

exports.showLogin = function(req, res) {
	res.render('login', {
		title:'登陆',
		user: req.session.user
	});
};

exports.login = function (req, res, next) {
	var ep = new eventproxy();
	var md5 = crypto.createHash('md5');
	var	password = validator.trim(req.body.password);
	var username = validator.trim(req.body.username);
	password = md5.update(password).digest('hex');
	ep.fail(next);

	if (!username || !password) {
		res.status(422);
		return res.render('login', {error: '信息不完整'});
	}

	var getUser = User.getUserByUsername;

	ep.on('login_error', function(login_error) {
		res.status(403);
		res.render('login', {error: '用户名或密码错误'});
	})

	getUser(username, function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			
		}
		if (password != user.password) {
			return ep.emit('login_error');
		}
		req.session.user = user;
		console.log("登陆成功");
		res.redirect('/');
	});
};

exports.logout = function(req, res, next) {
	req.session.user = null;
	console.log("登出成功");
	res.redirect('/');
};