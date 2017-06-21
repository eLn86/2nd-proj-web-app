var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var tracks = require('./tracks');

// define the schema for user
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        name         : String,
        photo        : String,
        tracks       : []
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String
    },
    instagram        : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String,
        photo        : String
    }

});


// methods ======================

/**
 * Password hash middleware, encrypt the password by adding salt
 */
userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('local.password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.local.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.local.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.validPassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.local.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Accessor method to check if login is local, facebook, instagram, etc
 */
userSchema.methods.getName = function () {
  const user = this;
  if(user.local.name) {
    return user.local.name;
  }
  else if(user.facebook.name) {
    return user.facebook.name;
  }
  else if(user.twitter.name) {
    return user.twitter.name;
  }
  else if(user.instagram.name) {
    return user.instagram.name;
  }
  else if(user.google.name) {
    return user.google.name;
  }
  else {
    return 'No user found';
  }
}

userSchema.methods.getPhoto = function () {
  const user = this;
  if(user.local.photo) {
    return user.local.photo;
  }
  else if(user.facebook.photo) {
    return user.facebook.photo;
  }
  else if(user.twitter.photo) {
    return user.twitter.photo;
  }
  else if(user.instagram.photo) {
    return user.instagram.photo;
  }
  else if(user.google.photo) {
    return user.google.photo;
  }
  else {
    return 'No photo found';
  }
}

userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email', 'photo']);
}
// create the model for users
const User = mongoose.model('User', userSchema);

// Export User for shared access
module.exports = User;
