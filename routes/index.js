const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.renderIndex);
router.get('/signup', homeController.renderSignup);
router.post('/signup', homeController.signup);
module.exports = router;

// /* GET home page. */
// app.get('/', function(req, res){
//   res.render('index', { message: req.flash('loginMessage') });
// });
