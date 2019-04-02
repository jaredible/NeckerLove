const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userName: {
    type: String,
    index: true,
    required: true,
    unique: true,
    max: [50, 'Too long, max is 50 characters']
  },
  password: {
    type: String,
    required: 'Passwod is required'
  },
  firstName: {
    type: String,
    max: [50, 'Too long, max is 50 characters']
  },
  lastName: {
    type: String,
    max: [50, 'Too long, max is 50 characters']
  },
  profileImage: Buffer,
  interests: {
    type: String,
    max: [2000, 'Too long, max is 2000 characters']
  },
  state: {
    type: String,
    max: [52, 'Too long, max is 52 characters']
  }
}, {
  collection: 'profiles'
});

profileSchema.pre('save', (next) => {
  const profile = null;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('Profile', profileSchema);
