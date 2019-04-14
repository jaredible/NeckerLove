const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home');

router.get('/', homeController.get);

router.post('/', homeController.post);

module.exports = router;
