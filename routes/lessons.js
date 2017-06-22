const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const passport = require('passport');


// Essentials Track
router.get('/essentialsLesson', lessonController.renderEssentials);   //  /secret/lesson/essentialsLesson


module.exports = router;
