const User = require('../model/user');
const fs = require('fs-extra');
const passport = require('passport');
const path = require('path');
// var cloudinary = require('cloudinary');

let userController = {
  renderLogin: (req,res) => {
    if(!req.user) {
      return res.redirect('/');
    }
    var enrolledTracks = req.user.getTracks();
    var userName = req.user.getName();
    var userPhoto = req.user.getPhoto();
    
      res.render('secret', {
        title: 'Welcome to Radiologium',
        name: userName,
        photo: userPhoto,
        user: req.user,
        tracks: enrolledTracks
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
      var userPhoto = req.user.getPhoto();
      if(req.user.local.photo) {
        userPhoto = '../' + userPhoto;
      }
      res.render('user/updateProfile', {
        title: 'Update Profile',
        name: userName,
        email: userEmail,
        photo: userPhoto
      });
    }
    else {
    req.flash('errors', {msg: 'Please update your profile in your social media account'});
    return res.redirect('/secret');
    }
  },
  renderTracks: (req,res) => {
    if(!req.user) {
      return res.redirect('/');
    }
    var userName = req.user.getName();
    var userPhoto = req.user.getPhoto();
    if(req.user.local.photo) {
      userPhoto = '../' + userPhoto;
    }
      res.render('user/tracks', {
        title: 'Tracks',
        name: userName,
        photo: userPhoto,
        user: req.user
      });
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
    })
  },
  enrolTrack: (req,res) => {
    // console.log(req.body.essential);
    User.findById({ _id: req.user.id}, (err, oneUser) => {
      if(err) return res.json({message: 'could not find user by id because: ' + err})

      switch(req.body.track) {
        case 'essentials':
        if(oneUser.tracks[0] === 0) {
          oneUser.tracks.set(0,1);

          oneUser.save((err, user) => {
            if (err) {
              return res.json({message: 'could not save user because: ' + err})
            }
            req.flash('success', {msg: 'You have successfully enrolled the Chest X-Ray Essentials track'});
            res.redirect('/secret');
          })
        }
        else {
          req.flash('errors', {msg: 'You are already enrolled in the Chest X-Ray Essentials track' });
          res.redirect('/secret/tracks');
        }
        break;

        case 'emergency':
        if(oneUser.tracks[1] === 0) {
          oneUser.tracks.set(1,1);

          oneUser.save((err, user) => {
            if (err) {
              return res.json({message: 'could not save user because: ' + err})
            }
            req.flash('success', {msg: 'You have successfully enrolled the Emergency CT track'});
            res.redirect('/secret');
          })
        }
        else {
          req.flash('errors', {msg: 'You are already enrolled in the Emergency CT track' });
          res.redirect('/secret/tracks');
        }
        break;

        case 'neuro':
        if(oneUser.tracks[2] === 0) {
          oneUser.tracks.set(2,1);
          oneUser.neuroTrackProgress.nodeNumber = 0;
          oneUser.neuroTrackProgress.wrongCount = 0;
          oneUser.save((err, user) => {
            if (err) {
              return res.json({message: 'could not save user because: ' + err})
            }
            req.flash('success', {msg: 'You have successfully enrolled the Neuro MRI Essentials track'});
            res.redirect('/secret');
          })
        }
        else {
          req.flash('errors', {msg: 'You are already enrolled in the Neuro MRI Essentials track' });
          res.redirect('/secret/tracks');
        }
        break;
        default:
        break;
      }

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
