exports.redirectHome = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/');
  } else {
    next();
  }
};

exports.redirectLogin = (req, res, next) => {
  if (!(req.session.user && req.cookies.user_sid)) {
    res.redirect('/account/login');
  } else {
    next();
  }
};
