let User = require('../model/user');
const passport = require('passport');

let userController = {
  renderLogin: (req,res) => {
    if(!req.user) {
      return res.redirect('/');
    }

    var userName = req.user.getName();
    var userPhoto = req.user.getPhoto();
      res.render('secret', {
        title: 'Welcome to Radiologium',
        name: userName,
        photo: userPhoto
      });
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
