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
  var errors = req.validationErrors();
  if (!errors) {
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;
    
    if (Profile.createProfile(email, password)) {
      res.redirect('/account/login');
    }

    return;
  }

  req.session.email = req.body.inputEmail;
  res.redirect('/account/register');
};

exports.findProfileByEmail = (req, res) => {
  Profile.findProfileByEmail(req.body.inputEmail).then(profile => {
    res.send(profile ? false : true);
  });
};
