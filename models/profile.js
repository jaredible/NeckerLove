const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO
const profileSchema = new Schema({
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
    maxlength: 50
  },
  password: { // TODO
    type: String,
    required: true
  },
  firstName: { // TODO
    type: String,
    maxlength: 50
  },
  lastName: { // TODO
    type: String,
    maxlength: 50
  },
  profileImage: Buffer, // TODO
  interests: {
    type: String,
    maxlength: 2000
  },
  state: { // TODO
    type: String,
    maxlength: 52
  }
}, {
  collection: 'profiles'
});

profileSchema.pre('save', function(next) {
  const profile = this;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(profile.password, salt, (err, hash) => {
      profile.password = hash;
      next();
    });
  });
});

exports.authenticate = (email, password, hashedPassword) => {
  return new Promise(function(resolve) {
    Model.findOne({
      'email': email
    }, (err, profile) => {
      if (err) {
        throw err;
      }

      bcrypt.compare(password, hashedPassword, function(err, res) {
        if (err) {
          throw err;
        }

        callback(res);
      });

      resolve(profile);
    });
  });
};

const Model = mongoose.model('Profile', profileSchema);

exports.createProfile = (email, password) => {
  const profile = new Model({
    email: email,
    password: password,
  });

  var err = profile.validateSync();
  if (err) {
    console.error(err);
    return false;
  } else {
    profile.save((err) => {
      if (err) {
        console.error(err);
        return false;
      }
    });
  }

  return true;
};

exports.findProfileByEmail = (email) => {
  return new Promise(function(resolve) {
    Model.findOne({
      'email': email
    }, (err, profile) => {
      if (err) {
        throw err;
      }

      resolve(profile);
    });
  });
};

exports.getProfileImageByEmail = (email) => {
  return new Promise(function(resolve) {
    Model.findOne({
      'email': email
    }, (err, profile) => {
      if (err) {
        throw err;
      }

      resolve(profile.image);
    });
  });
};

exports.Model = Model;
