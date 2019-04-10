const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
    maxlength: 50
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    maxlength: 50
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  image: Buffer,
  interests: {
    type: String,
    maxlength: 2000
  },
  state: {
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

exports.comparePasswords = (password, hashedPassword, callback) => {
  bcrypt.compare(password, hashedPassword, function(err, res) {
    if (err) {
      throw err;
    }

    callback(res);
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
