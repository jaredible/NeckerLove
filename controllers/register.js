var Profile = require('../models/profile');

exports.Profile = Profile;

exports.get = (req, res) => {
  res.render('register', {
    title: 'Register',
    email: req.session.email
  });
  req.session.email = null;
};

exports.post = (req, res) => {
  if (!req.validationErrors()) {
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;

    Profile.createNewProfile(email, password).then(profile => {
      if (profile) {
        delete req.session.email;
        res.redirect('/account/login');
      } else {
        req.session.email = req.body.inputEmail;
        res.redirect('/account/register');
      }
    });
  }
};

exports.findProfileByEmail = (req, res) => {
  if (!req.validationErrors()) {
    Profile.findProfileByEmail(req.body.inputEmail).then(profile => {
      res.send(profile ? false : true);
    });
  }
};
