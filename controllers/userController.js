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
    var nodesProgress = req.user.getCurrentNodeNumber();
      res.render('secret', {
        title: 'Welcome to Radiologium',
        name: userName,
        photo: userPhoto,
        user: req.user,
        tracks: enrolledTracks,
        node: nodesProgress
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
  renderChangePassword: (req,res) => {
    var userIdentity = req.user.checkUserIdentity();
    if(userIdentity == 'local') {
      var userName = req.user.getName();
      var userEmail = req.user.getEmail();
      var userPhoto = req.user.getPhoto();
      if(req.user.local.photo) {
        userPhoto = '../' + userPhoto;
      }
      res.render('user/changePassword', {
        title: 'Change Password',
        name: userName,
        email: userEmail,
        photo: userPhoto
      });
    }
    else {
    req.flash('errors', {msg: 'Please change your password in your social media account'});
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
    var enrolledTracks = req.user.getTracks();
      res.render('user/tracks', {
        title: 'Tracks',
        name: userName,
        photo: userPhoto,
        user: req.user,
        tracks: enrolledTracks
      });
  },
  updateProfile: (req,res) => {

    if(req.file === undefined) {
      User.findById({ _id: req.user.id }, (err, oneUser) => {
        if (err) return res.json({message: 'could not find user by id because: ' + err})

        oneUser.local.name = req.body.name
        oneUser.local.email = req.body.email
        oneUser.save((err, user) => {
          if (err) return res.json({message: 'could not save user because: ' + err})
          req.flash('success', {msg: 'Profile has been updated!'});
          res.redirect('/secret');
        })
      })
    }
    else {
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
    }
  },
  updatePassword: (req,res) => {
    req.assert('newPassword', 'New Password field cannot be empty').notEmpty();
    req.assert('confirmPassword', 'Confirm Password field cannot be empty').notEmpty();
    req.assert('newPassword', 'New Password must be at least 8 characters long').len(8);
    req.assert('confirmPassword', 'Confirm Password must be at least 8 characters long').len(8);

    const errors = req.validationErrors();

    if(errors) {
      req.flash('errors', errors);
      res.redirect('/secret/changePassword');
    }
    console.log(req.body.newPassword);
    console.log(req.body.confirmPassword);
    if(req.body.newPassword !== req.body.confirmPassword) {
      req.flash('errors', {msg: 'Passwords do not match'});
      res.redirect('/secret/changePassword');
    }

    else {
      User.findById({_id: req.user.id}, (err, oneUser) => {
        if (err) return res.json({message: 'could not find user by id because: ' + err})
        oneUser.local.password = req.body.newPassword;
        oneUser.save((err, user) => {
          if (err) return res.json({message: 'could not save user because: ' + err})
          req.flash('success', {msg: 'Password changed successfully'});
          res.redirect('/secret');
        })
      })
    }
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
  },
  deleteAccount: (req, res) => {
    User.findByIdAndRemove(req.user.id, (err, userRemoved) => {
      if (err) throw err
      req.flash('errors', {msg: 'Your account has been deleted' });
      res.redirect('/')
    })
  },
  deleteEssentialsTrack: (req, res) => {
    // console.log(req.user.track);
    User.findById({ _id: req.user.id}, (err, oneUser) => {
      if(err) return res.json({message: 'could not find user by id because: ' + err})
      oneUser.tracks.set(0,0);
      oneUser.save((err, user) => {
        if (err) {
          return res.json({message: 'could not save user because: ' + err})
        }
        req.flash('errors', {msg: 'Your have disenrolled from the Chest X-Ray Essentials Track' });
        res.redirect('/secret')
      });
    })
  },
  deleteEmergencyTrack: (req, res) => {
    // console.log(req.user.track);
    User.findById({ _id: req.user.id}, (err, oneUser) => {
      if(err) return res.json({message: 'could not find user by id because: ' + err})
      oneUser.tracks.set(1,0);
      oneUser.save((err, user) => {
        if (err) {
          return res.json({message: 'could not save user because: ' + err})
        }
        req.flash('errors', {msg: 'Your have disenrolled from the Emergency CT Track' });
        res.redirect('/secret')
      });
    })
  },
  deleteNeuroTrack: (req, res) => {
    // console.log(req.user.track);
    User.findById({ _id: req.user.id}, (err, oneUser) => {
      if(err) return res.json({message: 'could not find user by id because: ' + err})
      oneUser.tracks.set(2,0);
      oneUser.save((err, user) => {
        if (err) {
          return res.json({message: 'could not save user because: ' + err})
        }
        req.flash('errors', {msg: 'Your have disenrolled from the Neuro MRI Essentials Track' });
        res.redirect('/secret')
      });
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
