const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account');

const redirectHome = (req, res, next) => {
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('/');
  } else {
    next();
  }
};

const redirectLogin = (req, res, next) => {
  if (!(req.session.user && req.cookies.user_sid)) {
    res.redirect('/account/login');
  } else {
    next();
  }
};

router.all('/login', redirectHome, accountController.login);
router.all('/register', redirectHome, accountController.register);
router.all('/profile', redirectLogin, accountController.profile);
router.post('/logout', accountController.logout);

var Profile = require('../models/profile');

router.post('/test', (req, res) => {
  Profile.findOne({
    'email': req.body.inputEmail
  }, (err, email) => {
    if (email) {
      // email exists
      console.log('email exists');
      //res.json("Email already exists.");
      res.send(false);
    } else {
      // email does not exist
      console.log('email does not exists');
      res.send(true);
    }
  });
});

router.post('/test2', (req, res) => {
  // save user info to new profile
  console.log(req.body);
  res.redirect('/account/login');
});

module.exports = router;
