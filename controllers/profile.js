const multer = require('multer');
const fs = require('fs');
const {
  promisify
} = require('util');
const unlinkAsync = promisify(fs.unlink);

const Profile = require('../models/profile');
const states = require('../config/states.json');

exports.get = (req, res) => {
  Profile.findProfileByEmail(req.session.user.email).then((profile) => {
    if (profile) {
      res.render('profile', {
        title: 'Profile',
        firstName: profile.firstName,
        lastName: profile.lastName,
        interests: profile.interests,
        state: profile.state,
        states: states
      });
    }
  });
};

exports.post = async (req, res) => {
  var hasFileToUpload = req.file && req.file.path;

  var update = {
    firstName: req.body.inputFirstName,
    lastName: req.body.inputLastName,
    interests: req.body.inputInterests,
    state: req.body.inputState
  };

  if (hasFileToUpload) update.profileImage = fs.readFileSync(req.file.path);

  Profile.findProfileByEmailAndUpdate(req.session.user.email, update).then((profile) => {
    if (profile) res.sendStatus(200);
  });

  if (hasFileToUpload) await unlinkAsync(req.file.path);
};

exports.findProfileImageBySession = (req, res) => {
  Profile.findProfileByEmail(req.session.user.email).then((profile) => {
    res.send(profile.profileImage);
  });
};

exports.findProfileImageByUserName = (req, res) => {
  if (!req.validationErrors()) {
    Profile.findProfileByEmail(req.query.email).then((profile) => {
      res.send(profile.profileImage);
    });
  }
};
