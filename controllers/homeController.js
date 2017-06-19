let User = require('../model/user');

const passport = require('passport');

let homeController = {
  renderIndex: (req, res) => {
    res.render('/');
  },
  renderSignup: (req,res) => {
    res.render('signup', {message: req.flash('loginMessage')});
  },
  signup: (req, res) => {
    if(!req.body.firstName) {
      req.flash('firstNameError', {
        type: 'warning',
        message: "Please fill in your first name"
      })
      res.render('signup', {flash: req.flash('firstNameError')});
    }
    else if(!req.body.lastName) {
      req.flash('lastNameError', {
        type: 'warning',
        message: "Please fill in your last name"
      })
      res.render('signup', {flash: req.flash('lastNameError')});
    }

    else if(!req.body.email) {
      req.flash('emailError', {
        type: 'warning',
        message: "Please fill in your email"
      })
      res.render('signup', {flash: req.flash('emailError')});
    }

    else if(!req.body.password) {
      req.flash('passwordError', {
        type: 'warning',
        message: "Please fill in your password"
      })
      res.render('signup', {flash: req.flash('passwordError')});
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

  login: (req, res) => {
  if(!req.body.email) {
    req.flash('emailError', {
      type: 'warning',
      message: "Please fill in your email"
    })
    res.render('/', {flash: req.flash('emailError')});
  }

  else if(!req.body.password) {
    req.flash('passwordError', {
      type: 'warning',
      message: "Please fill in your password"
    })
    res.render('/', {flash: req.flash('passwordError')});
  }
  else {
    var userLoginStrategy = passport.authenticate('local-login', {
     successRedirect : '/secret',
     failureRedirect : '/',
     failureFlash: true
   });
   return userLoginStrategy(req, res, done);
  }
}
  
};
module.exports = homeController;
