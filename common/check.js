exports.checkLogin = function(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    }
    next();
  }

exports.checkNotLogin = function(req, res, next) {
    if (req.session.user) {
      res.redirect('back');
    }
    next();
  }