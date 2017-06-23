const User = require('../model/user');

const passport = require('passport');

let homeController = {
  renderIndex: (req, res) => {
    res.render('/');
  },
  renderSignup: (req,res) => {
    res.render('signup');
  },
  signup: (req, res, done) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 8 characters long').len(8);
    req.assert('firstName', 'First Name should not be empty').notEmpty();
    req.assert('lastName', 'Last Name should not be empty').notEmpty();
    req.assert('email', 'Email should not be empty').notEmpty();
    req.assert('password', 'Password should not be empty').notEmpty();

    const errors = req.validationErrors();

    if(errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }
    else {
       var userSignUpStrategy = passport.authenticate('local-signup', {
        successRedirect : '/secret',
        failureRedirect : '/signup',
        failureFlash: true
      });
      return userSignUpStrategy(req, res, done);
    }
  },
  login: (req, res, done) => {
    if(!req.body.email) {
      req.flash('errors', {msg: 'Please do not leave the email field empty'})
      res.redirect('/');
    }

    else if(!req.body.password) {
      req.flash('errors', {msg: 'Please do not leave the password field empty'})
      res.redirect('/');
    }
    else {
      var userLoginStrategy = passport.authenticate('local-login', {
        successRedirect : '/secret',
        failureRedirect : '/',
        failureFlash: true
    });
      return userLoginStrategy(req, res, done);
    }
  },
  logout: (req, res) => {
    req.session.destroy(function (err) {
      if (err) throw err
      res.redirect('/')
    })
  }
};
module.exports = homeController;
