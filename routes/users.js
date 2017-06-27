const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const upload = multer({dest: 'public'});

// Login & Logout
router.get('/', userController.renderLogin);   // /secret
router.get('/logout', homeController.logout);  // /secret/logout

// Update/Delete Profile
router.get('/profile', userController.renderUpdateProfile);  // /secret/profile
router.put('/profile', upload.single('photo'), userController.updateProfile);  // /secret/profile
router.get('/profile/delete', userController.deleteAccount);  // /secret/profile

// Change password
router.get('/changePassword', userController.renderChangePassword);  // /secret/changePassword
router.post('/changePassword', userController.updatePassword);  // /secret/changePassword

// Tracks
router.get('/tracks', userController.renderTracks);  // /secret/tracks
router.put('/tracks', userController.enrolTrack);  // /secret/tracks
router.get('/tracks/deleteEssentialsTrack', userController.deleteEssentialsTrack);  // /secret/tracks/deleteEssentialsTrack
router.get('/tracks/deleteEmergencyTrack', userController.deleteEmergencyTrack);  // /secret/tracks/deleteEmergencyTrack
router.get('/tracks/deleteNeuroTrack', userController.deleteNeuroTrack);  // /secret/tracks/deleteNeuroTrack


module.exports = router;
