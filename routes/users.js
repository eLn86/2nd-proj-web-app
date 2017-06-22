const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const upload = multer({dest: 'public'});

// Login & Logout
router.get('/', userController.renderLogin);   // /secret
router.get('/logout', homeController.logout);  // /secret/logout

// Update Profile
router.get('/profile', userController.renderUpdateProfile);  // /secret/profile
router.put('/profile', upload.single('photo'), userController.updateProfile);  // /secret/profile

// Tracks
router.get('/tracks', userController.renderTracks);  // /secret/tracks
//router.put('/tracks', userController.updateTracks);  // /secret/tracks

module.exports = router;
