const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/signup', homeController.renderSignup);

router.post('/signup', homeController.signup);

module.exports = router;
