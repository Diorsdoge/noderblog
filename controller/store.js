var formidable = require('formidable');
var fs = require('fs');
var Images= require('../proxy/').Images;
var multer  = require('multer');
var gm = require('gm').subClass({imageMagic: true});
var limit = require('../middlewares/limit');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
});

var upload = multer({ storage: storage });

exports.showUpload = function (req, res) {
	res.render('upload', {
		title: '文件上传',
		user: req.session.user
	});
};

exports.upload = [upload.single('upload'), function (req, res, next) {

console.log(req.file);
	gm(req.file.path).resize(240,240).noProfile().write("./public/images/" + 's' + req.file.filename, function(err) {
		if (!err) {
			console.log("done");
		}
	})
	var currentUser = req.session.user;
	var title = req.body.title;
	var	tags = req.body.tags.split(" ");
	tags = limit.unique(tags);
	var description = req.body.description;
	var date = new Date();
	var time = {
			date: date,
			year: date.getFullYear(),
			month: date.getFullYear() + "-" + (date.getMonth() + 1),
			day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "," + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes(): date.getMinutes())
		};
	var path = req.file.filename;
	console.log(path);
	Images.newAndSave(title, description, path, currentUser.username, tags, time, function(err){
		if (err) {
			return (next);
		};
	});
	console.log("上传成功");
	res.redirect('/upload');
}];
