var Profile = require('../models/profile');

exports.get = (req, res) => {
  res.render('login', {
    title: 'Login',
    email: req.session.email
  });
  req.session.email = null;
};

exports.post = (req, res) => {
  var errors = req.validationErrors();
  if (!errors) {
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;

    req.session.user = { // TODO: req not defined in this scope
      email: email,
      password: password
    };

    res.redirect('/');
    return;
  }

  req.session.email = req.body.inputEmail;
  res.redirect('/account/login');
};

exports.auth = (req, res) => {
  // log attempts
  var userAuthenticated = true;
  res.send(userAuthenticated);
};
