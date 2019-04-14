const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  body, query
} = require('express-validator/check');

const auth = require('../middlewares/auth');
const accountController = require('../controllers/account');
const loginController = require('../controllers/login');
const registerController = require('../controllers/register');
const profileController = require('../controllers/profile');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
const upload = multer({
  storage: storage
});

router.get('/login', auth.redirectHome, loginController.get);

router.post('/login', auth.redirectHome, [
  body('inputEmail', 'Invalid login email.').isEmail().normalizeEmail(),
  body('inputPassword', 'Invalid login password.').not().isEmpty().escape().trim()
], loginController.post);

router.post('/authenticate', auth.redirectHome, [
  body('inputEmail', 'Invalid auth email.').isEmail().normalizeEmail(),
  body('inputPassword', 'Invalid auth password.').not().isEmpty().escape().trim()
], loginController.authenticate);

router.get('/register', auth.redirectHome, registerController.get);

router.post('/register', auth.redirectHome, [
  body('inputEmail', 'Invalid registration email.').isEmail().normalizeEmail().custom(value => {
    return registerController.Profile.findProfileByEmail(value).then(profile => {
      if (profile) {
        return Promise.reject('Email already in use.');
      }
    });
  }),
  body('inputPassword', 'Invalid registration password.').not().isEmpty().escape().trim(),
  body('inputConfirm').custom((value, {
    req
  }) => {
    if (value !== req.body.inputPassword) {
      throw new Error('Password confirmation is incorrect.');
    } else {
      return true;
    }
  }).escape().trim()
], registerController.post);

router.post('/findProfileByEmail', body('inputEmail', 'Invalid email.').isEmail().normalizeEmail(), registerController.findProfileByEmail);

router.get('/profile', auth.redirectLogin, profileController.get);

router.post('/profile', auth.redirectLogin, upload.single('inputImage'), [
  body('inputFirstName').isLength({
    max: 50
  }).escape().trim(),
  body('inputLastName').isLength({
    max: 50
  }).escape().trim(),
  body('interests').isLength({
    max: 2000
  }).escape().trim(),
  body('state').isLength({
    max: 52
  }).escape().trim()
], profileController.post);

router.get('/findProfileImageBySession', auth.redirectLogin, profileController.findProfileImageBySession);

router.get('/findProfileImageByUserName', auth.redirectLogin, [
  query('email', 'Invalid email.').isEmail().normalizeEmail()
], profileController.findProfileImageByUserName);

router.post('/logout', auth.redirectLogin, accountController.logout);

module.exports = router;
