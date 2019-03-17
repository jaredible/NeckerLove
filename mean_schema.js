const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var meanSchema = new Schema({
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
    max: 50
  },
  lastName: {
    type: String,
    max: 50
  },
  profileImage: Buffer,
  interests: {
    type: String,
    max: 2000
  },
  state: {
    type: String,
    max: 52
  }
}, {
  collection: 'profiles'
});

exports.meanSchema = meanSchema;
