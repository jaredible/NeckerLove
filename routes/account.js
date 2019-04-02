const express = require('express');
const router = express.Router();

const accountController = require('../controllers/accountController');

router.all('/login', accountController.login);
router.all('/register', accountController.register);
router.all('/profile', accountController.profile);

module.exports = router;
