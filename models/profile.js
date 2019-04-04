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

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
