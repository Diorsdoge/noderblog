// exports.userRequired = function (req, res, next) {
// 	if (!req.session || !req.session.user) {
// 		res.redirect('/');
// 	}
// };

exports.userRequired = function (req, res, next) {
  if (req.session.user) {
    return next();
  }
  else 
  { 
      res.redirect('/login');
   }
};