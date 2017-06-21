const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const passport = require('passport');

router.get('/', homeController.renderIndex);
router.post('/', homeController.login);

// Facebook Login, get scope from facebook user
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/index' }), (req, res) => {
          res.redirect(req.session.returnTo || '/secret')
        });

// Twitter Login
router.get('/auth/twitter', passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/index' }), (req, res) => {
        res.redirect(req.session.returnTo || '/secret');
        });

// Instagram Login
router.get('/auth/instagram', passport.authenticate('instagram'));
router.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/index' }), (req, res) => {
          res.redirect(req.session.returnTo || '/secret');
        });

// Google Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/index' }), (req, res) => {
          res.redirect(req.session.returnTo || '/secret');
        });

router.get('/signup', homeController.renderSignup);
router.post('/signup', homeController.signup);

module.exports = router;

// /* GET home page. */
// app.get('/', function(req, res){
//   res.render('index', { message: req.flash('loginMessage') });
// });
