const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const upload = multer({dest: 'public'});

router.get('/', userController.renderLogin);   // /secret
router.get('/logout', homeController.logout);  // /secret/logout
router.get('/profile', userController.renderUpdateProfile);  // /secret/profile
router.put('/profile', upload.single('photo'), userController.updateProfile);  // /secret/profile
module.exports = router;
