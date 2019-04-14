exports.logout = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    delete req.session.user
    res.redirect('/');
  } else {
    res.redirect('/account/login');
  }
};
