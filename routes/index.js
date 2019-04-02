const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');

router.all('/', homeController.index);
router.all('/search', homeController.search);

module.exports = router;
