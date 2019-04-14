const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userName: {
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
  firstName: {
    type: String,
    maxlength: 50
  },
  lastName: {
    type: String,
    maxlength: 50
  },
  profileImage: Buffer,
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
    if (err) throw err;
    bcrypt.hash(profile.password, salt, (err, hash) => {
      if (err) throw err;
      profile.password = hash;
      next();
    });
  });
});

const Model = mongoose.model('Profile', profileSchema);

exports.createNewProfile = (email, password) => {
  return new Promise(function(resolve) {
    var newProfile = new Model({
      userName: email,
      password: password,
    });

    if (newProfile.validateSync()) throw err;
    else {
      newProfile.save((err) => {
        if (err) throw err;
      });
    }

    resolve(newProfile);
  });
};

exports.authenticate = (password, hashedPassword) => {
  return new Promise(function(resolve) {
    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};

exports.findProfileByEmail = (email) => {
  return new Promise(function(resolve) {
    Model.findOne({
      'userName': email
    }, (err, profile) => {
      if (err) throw err;
      resolve(profile);
    });
  });
};

exports.findProfileByEmailAndUpdate = (email, update) => {
  return new Promise(function(resolve) {
    Model.findOneAndUpdate({
      'userName': email
    }, update, {
      runValidators: true,
      useFindAndModify: false
    }, (err, profile) => {
      if (err) throw err;
      resolve(profile);
    });
  });
};

exports.getProfileImageByEmail = (email) => {
  return new Promise(function(resolve) {
    Model.findOne({
      'userName': email
    }, (err, profile) => {
      if (err) throw err;
      resolve(profile.image);
    });
  });
};

exports.findProfilesByQuery = (query, projections) => {
  return new Promise(function(resolve) {
    Model.find(query, projections, {
      sort: {
        firstName: 1,
        lastName: 1
      }
    }, (err, profiles) => {
      if (err) throw err;
      resolve(profiles);
    });
  });
};
