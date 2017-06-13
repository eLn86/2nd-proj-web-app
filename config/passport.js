// Load passport local
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var twitterStrategy = require('passport-twitter').Strategy;
var instagramStrategy = require('passport-instagram').Strategy;
var socialStrategy = require('passport-social').Strategy;

// Load validator
var validator = require('validator');

// Load user model
var User = require('../model/user');

module.exports = function( passport ) {

  // Serialize user
  passport.serializeUser( function( user, done){
      done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
        done(err, user);
      });
  });

  // Passport signup
  passport.use('local-signup', new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true
    },
    function(req, email, password, done){    // function is run because of passReqToCallback:true

        // Check that the email is in the right format
        if( !validator.isEmail(email) ){
          return done(null, false, req.flash('loginMessage','That is not a valid email address'));
        }

        // Check that the password is at least 8 chars
        if( password.length < 8 ){
          return done(null, false, req.flash('loginMessage','The password needs to be 8 chars long'));
        }

        // Asynchronous function to check if email already exists in DB, if not, create and log in new user
        process.nextTick(function(){
          User.findOne( {'local.email' : email }, function(err, user){
            if(err){
              return done(err);
            }
            if(user){
              return done(null, false, req.flash('loginMessage','That email is already in use'));
            }else{
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.password = password;
              newUser.save(function(err){
                if(err){
                  console.log(err);
                }
                return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
              });
            }
          });
        });
    }));

  // Passport login
  passport.use('local-login', new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true
    },
    function(req, email, password, done){
        process.nextTick(function(){
          User.findOne( {'local.email' : email }, function(err, user){
            if(err){
              return done(err);
            }

            if(!user){
              return done(null,false, req.flash('loginMessage', 'sorry no one by that email'));
            }

            user.validPassword(password, function(err, isMatch){

              if(isMatch){
                return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
              }

              return done(null,false, req.flash('loginMessage', 'sorry wrong password'));
            })
          });
        });
    }));

//     // Passport Facebook Login
//     passport.use('facebook', new facebookStrategy({
//     clientID: '1461744740550638',
//     clientSecret: 'c95c58698bf6d0b0a944cd4badbe01e8',
//     callbackURL: 'http://localhost:3000/auth/facebook/callback',
//     profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
//     passReqToCallback: true
//   },
//   function(req, accessToken, refreshToken, profile, done){
//
//       User.findOne( {'facebook.id' : profile.id }, function(err, user){
//         if(err){
//           return done(err);
//         }
//
//         if(!user){
//
//           var newUser = new User();
//           newUser.facebook.id = profile.id;
//           newUser.facebook.token = accessToken;
//           newUser.facebook.name = profile.first_name + ' ' +  profile.middle_name + ' ' + profile.last_name;
//           newUser.facebook.email = profile.email;
//           newUser.save(function(err){
//             if(err){
//               console.log(err);
//             }
//             return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
//           });
//         }
//
//         if(user) {
//             return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
//         }
//       });
//   }
// ));
//
//     // Passport Twitter Login
//     passport.use(new TwitterStrategy({
//     consumerKey: 'RQXS1CkbL6eQ04iJYLVnw2EJf',
//     consumerSecret: 'kgwYOYolYd0sF7VqHUotVFcqbJlMFaRhiuaYVVgcPRvycO5IFp',
//     callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
//     passReqToCallback: true
//   },
//     function(req, token, tokenSecret, profile, done){
//       User.findOne( {'twitter.id' : profile.id }, function(err, user){
//         if(err){
//           return done(err);
//         }
//
//         if(!user){
//
//           var newUser = new User();
//           newUser.twitter.id = profile.id;
//           newUser.twitter.token = token;
//           newUser.twitter.name = profile.first_name + ' ' +  profile.middle_name + ' ' + profile.last_name;
//           newUser.twitter.email = profile.email;
//           newUser.save(function(err){
//             if(err){
//               console.log(err);
//             }
//             return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
//           });
//         }
//
//         if(user) {
//             return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
//         }
//       });
//     }
// ));

};
