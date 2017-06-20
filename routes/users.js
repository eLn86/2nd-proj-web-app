const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');

router.get('/', userController.renderLogin);   // /secret
router.get('/logout', homeController.logout);  // /secret/logout
module.exports = router;
