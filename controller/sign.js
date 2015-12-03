var validator = require('validator');
var eventproxy = require('eventproxy');
var config = require('../config');
var User = require('../proxy').User;
var Post = require('../proxy').Post;
var crypto = require('crypto');


//注册
exports.showRegister = function (req, res) {
	User.count({}, function(err, count) {
		if( count >0 ) {
			res.redirect('/');
		}
			res.render('reg', {
			title:'注册',
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

		var ep = new eventproxy();
		ep.fail(next);
		ep.on('prop_err', function(msg) {
			res.status(422);
			res.render('reg', {
				title: '注册',
				error: msg,
				username: username
			});
		});

		//验证信息的正确性
		if([username, password, password_re].some(function (item) { return item ===''; })) {
			ep.emit('prop_err', '信息不完整');
			return;
		}
		if (username.length < 4) {
			ep.emit('prop_err', '用户名至少需要4个字符');
			return;
		}
		if (password.length < 6) {
			ep.emit('prop_err', '密码至少需要6个字符');
			return;
		}

		if (password_re != password) {
			ep.emit('prop_err', '两次密码输入不一致');
			return;
		}

		var md5 = crypto.createHash('md5');
		password = md5.update(req.body.password).digest('hex');
		User.newAndSave(username, password, function (err) {
			if (err) {
				return next(err);
			}
		});
		
		//初始化第一篇博文，顺便打个小广告
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

//登陆
exports.showLogin = function(req, res) {
	res.render('login', {
		title:'登陆'
	});
};

exports.login = function (req, res, next) {

	var ep = new eventproxy();
	var md5 = crypto.createHash('md5');
	var	password = validator.trim(req.body.password);
	var username = validator.trim(req.body.username);
	password = md5.update(password).digest('hex');
	ep.fail(next);

	//验证登陆
	if (!username || !password) {
		res.status(422);
		return res.render('login', {
			title: '注册',
			error: '信息不完整'
		});
	}

	var getUser = User.getUserByUsername;

	ep.on('login_error', function(login_error) {
		res.status(403);
		res.render('login', {
			title: '注册',
			error: '用户名或密码错误'
		});
	})

	getUser(username, function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return ep.emit('login_error');
		}
		if (password != user.password) {
			return ep.emit('login_error');
		}
		req.session.user = user;
		res.redirect('/');
	});
};
//退出
exports.logout = function(req, res, next) {
	req.session.user = null;
	res.redirect('/');
};