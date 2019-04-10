var Profile = require('../models/profile');

exports.get = (req, res) => {
  res.render('login', {
    title: 'Login',
    email: req.session.email
  });
  req.session.email = null;
};

const bcrypt = require('bcryptjs');

exports.post = (req, res) => {
  var errors = req.validationErrors();
  if (!errors) {
    var email = req.body.inputEmail;
    var password = req.body.inputPassword;

    Profile.Model.findOne({
      'email': email
    }, (err, profile) => {
      if (err) {
        throw err;
      }

      if (profile) {
        bcrypt.compare(password, profile.password, (err, result) => {
          if (err) {
            throw err;
          }

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
  var email = req.body.inputEmail;
  var password = req.body.inputPassword;
  
  // TODO: attempts
  Profile.Model.findOne({
    'email': email
  }, (err, profile) => {
    if (err) {
      throw err;
    }

    if (profile) {
      bcrypt.compare(password, profile.password, (err, result) => {
        if (err) {
          throw err;
        }

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
};
