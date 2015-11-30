var formidable = require('formidable');
var fs = require('fs');

exports.showUpload = function (req, res) {
	res.render('upload', {
		title: '文件上传',
		user: req.session.user
	});
};

exports.upload = function (req, res, next) {
	var form = new formidable.IncomingForm();
	// form.encoding = 'utf-8';
	// form.uploadDir = './public/images/';
	// form.keepExtensions = true;

	form.parse(req, function(err, fields, files) {

		if (err) {
			res.locals.error = err;
			res.redirect('/');
		} 
		var old_path = files.upload.path;
		var new_path = "./public/images/" + Date() + files.upload.name;
		fs.renameSync(old_path, new_path);
		console.log(new_path - "./public/images/" - Date());
	})

	res.redirect('/upload');
}