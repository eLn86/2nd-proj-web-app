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
              return done(null,false, req.flash('warning', {msg:'Sorry, there is no one by that email'}));
            }

            user.validPassword(password, function(err, isMatch){

              if(isMatch){
                return done(null, user, req.flash('success', {msg:'Logged in successfully'}));
              }

              return done(null,false, req.flash('warning', {msg:'Sorry, you have keyed in a wrong password'}));
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
            return done(null, false, req.flash('warning',{msg:'That is not a valid email address'}));
          }

          // Check that the password is at least 8 chars
          if( password.length < 8 ){
            return done(null, false, req.flash('warning',{msg:'Password needs to be at least 8 chars long'}));
          }

          // Asynchronous function to check if email already exists in DB, if not, create and log in new user
          process.nextTick(function(){
            User.findOne( {'local.email' : email }, function(err, user){
              if(err){
                return done(err);
              }
              if(user){
                return done(null, false, req.flash('warning',{msg:'That email is already in use'}));
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
                newUser.local.name = req.body.firstName + ' ' + req.body.lastName;
                newUser.local.email = email;
                newUser.local.password = password;
                newUser.local.photo = '../public/images/default-photo.gif';
                newUser.tracks = [0,0,0];
                // Save user in database
                newUser.save(function(err){
                  if(err){
                    console.log(err);
                  }
                  return done(null, newUser, req.flash('success', {msg:'Logged in successfully'}));
                });
              }
            });
          });
      }));


    // Passport Facebook Login
    passport.use(new facebookStrategy({
    clientID: '1900129696892874',
    clientSecret: '91612faf0b9471d576917d2a6d74579a',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
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
          const newUser = new User();
          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.email = profile._json.email;
          newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
          newUser.facebook.photo = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          newUser.tracks = [0,0,0];
          // save into database
          newUser.save(function(err){
            if(err){
              console.log(err);
            }
            return done(null, newUser, req.flash('success', {msg:'Logged in successfully'}));
          });
        }

        if(user) {
            user.facebook.email = profile._json.email;
            user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
            user.facebook.photo = `https://graph.facebook.com/${profile.id}/picture?type=large`;
            user.save(function(err){
              if(err){
                return res.json('Could not get facebook details because ' + err);
              }
            });
            return done(null, user, req.flash('success', {msg:'Logged in successfully'}));
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
            const newUser = new User();
            newUser.twitter.id = profile.id;
            newUser.twitter.email = `${profile.username}@twitter.com`;
            newUser.twitter.token = token;
            newUser.twitter.name = profile.displayName;
            newUser.twitter.photo = profile._json.profile_image_url_https;
            newUser.tracks = [0,0,0];
            newUser.save(function(err){
              if(err){
                console.log(err);
              }
              return done(null, newUser, req.flash('success', {msg:'Logged in successfully'}));
            });
        }

        if(user) {
            user.twitter.email = `${profile.username}@twitter.com`;
            user.twitter.name = profile.displayName;
            user.twitter.photo = profile._json.profile_image_url_https;
            user.save(function(err){
              if(err){
                return res.json('Could not get twitter details because ' + err);
              }
            });
            return done(null, user, req.flash('success', {msg:'Logged in successfully'}));
        }
      });
    }
));

      // Passport Instagram Login
      passport.use(new instagramStrategy({
      clientID: '58edaefbfeb949ba9135df2b3072d0ef',
      clientSecret: 'c43d734ddf334bcda32a5d592e843993',
      callbackURL: "http://127.0.0.1:3000/auth/instagram/callback",
      passReqToCallback: true
      },
      function(req, accessToken, refreshToken, profile, done) {
        User.findOne( {'instagram.id' : profile.id }, function(err, user){
          if(err){
            return done(err);
          }

          if(!user){
            const newUser = new User();
            newUser.instagram.id = profile.id;
            newUser.instagram.email = `${profile.username}@instagram.com`;
            newUser.instagram.token = accessToken;
            newUser.instagram.name = profile.displayName;
            newUser.instagram.photo = profile._json.data.profile_picture;
            newUser.tracks = [0,0,0];
            newUser.save(function(err){
              if(err){
                console.log(err);
              }
              return done(null, newUser, req.flash('success', {msg: 'Logged in successfully'}));
            });
          }

          if(user) {
              user.instagram.email = `${profile.username}@instagram.com`;
              user.instagram.name = profile.displayName;
              user.instagram.photo = profile._json.data.profile_picture;
              user.save(function(err){
                if(err){
                  return res.json('Could not get instagram details because ' + err);
                }
              });
              return done(null, user, req.flash('success', {msg: 'Logged in successfully'}));
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
              const newUser = new User();
              newUser.google.id = profile.id;
              newUser.google.email = profile.emails;
              newUser.google.token = accessToken;
              newUser.google.name = profile.displayName;
              newUser.google.photo = profile._json.image.url;
              newUser.tracks = [0,0,0];
              newUser.save(function(err){
                if(err){
                  console.log(err);
                }
                return done(null, newUser, req.flash('success', {msg:'Logged in successfully'}));
              });
            }

            if(user) {
                user.google.email = profile.emails;
                user.instagram.name = profile.displayName;
                user.instagram.photo = profile._json.image.url;
                user.save(function(err){
                  if(err){
                    return res.json('Could not get google details because ' + err);
                  }
                });
                return done(null, user, req.flash('success', {msg:'Logged in successfully'}));
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
