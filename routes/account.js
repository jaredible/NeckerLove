const express = require('express');
const router = express.Router();
const {
  check
} = require('express-validator/check');

const auth = require('../middlewares/auth');
const accountController = require('../controllers/account');
const loginController = require('../controllers/login');
const registerController = require('../controllers/register');

router.get('/login', auth.redirectHome, loginController.get);

router.post('/login', auth.redirectHome, loginController.post);

router.post('/auth', auth.redirectHome, loginController.authenticate);

router.get('/register', auth.redirectHome, registerController.get);

router.post('/register', auth.redirectHome, [
  check('inputEmail', 'Invalid registration email.').isEmail().normalizeEmail().custom(value => {
    return registerController.Profile.findProfileByEmail(value).then(profile => {
      if (profile) {
        return Promise.reject('Email already in use.');
      }
    });
  }),
  check('inputPassword', 'Invalid registration password.').not().isEmpty().trim().escape(),
  check('inputConfirm').custom((value, {
    req
  }) => {
    if (value !== req.body.inputPassword) {
      throw new Error('Password confirmation is incorrect.');
    } else {
      return true;
    }
  })
], registerController.post);

router.post('/findProfileByEmail', auth.redirectHome, check('inputEmail', 'Invalid email.').isEmail().normalizeEmail(), registerController.findProfileByEmail);

router.all('/profile', auth.redirectLogin, accountController.profile);
router.post('/logout', accountController.logout);

router.post('/imageupload', accountController.imageupload);

router.get('/image', accountController.image);

module.exports = router;
