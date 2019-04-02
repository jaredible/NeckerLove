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

router.all('/login', redirectHome, accountController.login);
router.all('/register', redirectHome, accountController.register);
router.all('/profile', accountController.profile);
router.post('/logout', accountController.logout);

module.exports = router;
