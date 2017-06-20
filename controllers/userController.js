let User = require('../model/user');
const passport = require('passport');

let userController = {
  renderLogin: (req,res) => {
    User.find({}, (err, photo) => {
      if(err) throw err;
      res.render('secret', {photo: photo, message: req.flash('loginMessage')});
    })

  }
};

module.exports = userController;

// function isLoggedIn(req, res, next) {
//   if(req.isAuthenticated()) {
//     return next();
//   }
//    res.redirect('/');
// }

// logout
// app.get('/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });
// }
