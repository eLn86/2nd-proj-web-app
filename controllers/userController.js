let User = require('../model/user');
const fs = require('fs-extra');
const passport = require('passport');
const path = require('path');
// var cloudinary = require('cloudinary');

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
  },
  renderUpdateProfile: (req,res) => {
    if(!req.user) {
      return res.redirect('/');
    }
    // if(req.user.facebook || req.user.twitter || req.user.instagram || req.user.google) {
    //   return res.redirect('/secret', req.flash('error', {msg: 'Please update your profile in your social media account'}));
    // }
    var userIdentity = req.user.checkUserIdentity();
    if(userIdentity == 'local') {
      var userName = req.user.getName();
      var userEmail = req.user.getEmail();
      res.render('user/updateProfile', {
        title: 'Update Profile',
        name: userName,
        email: userEmail
      });
    }
    else {
    req.flash('errors', {msg: 'Please update your profile in your social media account'});
    return res.redirect('/secret');
    }
  },
  updateProfile: (req,res) => {
    User.findById({ _id: req.user.id }, (err, oneUser) => {
      if (err) return res.json({message: 'could not find user by id because: ' + err})
      oneUser.local.name = req.body.name
      oneUser.local.email = req.body.email
      oneUser.local.photo = req.file.filename
      oneUser.save((err, user) => {
        if (err) return res.json({message: 'could not save user because: ' + err})
        req.flash('success', {msg: 'Profile has been updated!'});
        res.redirect('/secret');
      })
    }

)}



    // cloudinary.uploader.upload(req.file.path, function (result) {
    //   User.findById(req.user.id, function(err, user) {
    //     if(err) throw err
    //     user.local.name = req.body.name;
    //     user.local.email = req.body.email;
    //     user.local.photo = result.secure_url;
    //     user.save(function (err, saveUser) {
    //       req.flash('success', {msg: 'Profile has been updated!'});
    //       res.redirect('/secret');
    //     });
    //   });
    // });
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
