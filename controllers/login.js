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

    Profile.findProfileByEmail(email).then((profile) => {
      if (profile) {
        Profile.authenticate(password, profile.password).then((result) => {
          if (result) {
            req.session.user = {
              email: email,
              password: password
            };
            res.redirect('/');
          } else {
            req.session.email = req.body.inputEmail;
            res.redirect('/account/login');
          }
        });
      } else {
        req.session.email = req.body.inputEmail;
        res.redirect('/account/login');
      }
    });
  }
};

exports.authenticate = (req, res) => {
  var errors = req.validationErrors();
  if (!errors) {
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;

    Profile.findProfileByEmail(email).then((profile) => {
      if (profile) {
        Profile.authenticate(password, profile.password).then((result) => {
          if (result) {
            res.send(true);
          } else {
            res.send(false);
          }
        });
      } else {
        res.send(false);
      }
    });
  }
};
