// Load passport local
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var twitterStrategy = require('passport-twitter').Strategy;
var instagramStrategy = require('passport-instagram').Strategy;
var googleStrategy = require('passport-google-oauth20').Strategy;

// Load validator
var validator = require('validator');

// Load user model
var User = require('../model/user');
var Track = require('../model/tracks');
var trackNode = require('../model/nodes'); 

module.exports = function(passport) {

  // Serialize user
  passport.serializeUser(function(user, done){
      done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
        done(err, user); // deserialize the user and store into req.user
      });
  });

  // Passport Local Login
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

    // Passport Local Sign Up
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
                
                // var essentialsTrack = new Track();
                // essentialsTrack.track.id = 1;
                // essentialsTrack.track.name = 'Chest X-Ray Essentials';
                // essentialsTrack.track.overView = 'The Chest X-ray Essentials track is a quintessential in-depth review of X-ray radiological anatomy.';
                // essentialsTrack.track.price = 25;
                // 
                // // Save track in database
                // essentialsTrack.save(function(err){
                //   if(err){
                //     console.log(err);
                //   }
                //   return done(null, essentialsTrack);
                // });
                
                var newUser = new User();
                newUser.local.firstName = req.body.firstName;
                newUser.local.lastName = req.body.lastName;
                newUser.local.email = email;
                newUser.local.password = password;
                newUser.local.track = [];
                newUser.local.photo = '../public/images/default-photo.gif';

                // Save user in database
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


    // Passport Facebook Login
    passport.use('facebook', new facebookStrategy({
    clientID: '1900129696892874',
    clientSecret: '91612faf0b9471d576917d2a6d74579a',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done){
      
      // function to find a user in the database using facebook id
      User.findOne( {'facebook.id' : profile.id }, function(err, user){
        if(err){
          return done(err);
        }
        
        // if user is not found, create in database
        if(!user){
          var newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.email = profile.email;
          newUser.facebook.givenName = profile.displayName;
          newUser.facebook.photo = profile.photos ? profile.photos[0].value : '/images/profile-testimg.jpg';

          // save into database
          newUser.save(function(err){
            if(err){
              console.log(err);
            }
            return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
          });
        }

        if(user) {
            return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
        }
      });
  }
));

    // Passport Twitter Login
    passport.use(new twitterStrategy({
    consumerKey: 'RQXS1CkbL6eQ04iJYLVnw2EJf',
    consumerSecret: 'kgwYOYolYd0sF7VqHUotVFcqbJlMFaRhiuaYVVgcPRvycO5IFp',
    callbackURL: "http://localhost:3000/auth/twitter/callback",
    passReqToCallback: true
  },
    function(req, token, tokenSecret, profile, done){
      User.findOne( {'twitter.id' : profile.id }, function(err, user){
        if(err){
          return done(err);
        }

        if(!user){
          var newUser = new User();
          newUser.twitter.id = profile.id;
          newUser.twitter.token = token;
          newUser.twitter.name = profile.first_name + ' ' +  profile.middle_name + ' ' + profile.last_name;
          newUser.twitter.email = profile.email;
          newUser.save(function(err){
            if(err){
              console.log(err);
            }
            return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
          });
        }

        if(user) {
            return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
        }
      });
    }
));

      // Passport Instagram Login
      passport.use(new instagramStrategy({
      clientID: '2c073b80f10b434189a155512d661630',
      clientSecret: 'fc5c82287f3243bcafefe6e67530610a',
      callbackURL: "http://localhost:3000/auth/instagram/callback",
      passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        User.findOne( {'instagram.id' : profile.id }, function(err, user){
          if(err){
            return done(err);
          }

          if(!user){
            var newUser = new User();
            newUser.instagram.id = profile.id;
            newUser.instagram.token = accessToken;
            newUser.instagram.name = profile.first_name + ' ' +  profile.middle_name + ' ' + profile.last_name;
            newUser.instagram.email = profile.email;
            newUser.save(function(err){
              if(err){
                console.log(err);
              }
              return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
            });
          }

          if(user) {
              return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
          }
        });
      }
    ));


        // Passport Google Login
        passport.use(new googleStrategy({
        clientID: '425387065267-sg9kbsssmlihs1lekjscpc21p6gcf866.apps.googleusercontent.com',
        clientSecret: 'o8ByebzHC4LVVrJL1MdYwn4z',
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
          User.findOne( {'google.id' : profile.id }, function(err, user){
            if(err){
              return done(err);
            }

            if(!user){
              var newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.token = accessToken;
              newUser.google.name = profile.first_name + ' ' +  profile.middle_name + ' ' + profile.last_name;
              newUser.google.email = profile.email;
              newUser.save(function(err){
                if(err){
                  console.log(err);
                }
                return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
              });
            }

            if(user) {
                return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
            }
          });
        }
      ));

};

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/').slice(-1)[0];
  const token = req.user.tokens.find(token => token.kind === provider);
  if (token) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
