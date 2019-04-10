const multer = require('multer');
const fs = require('fs');
const {
  promisify
} = require('util');
const unlinkAsync = promisify(fs.unlink);
const USAStates = require('../config/USAStates.json');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
const upload = multer({
  storage: storage
});

const Profile = require('../models/profile');

exports.imageupload = (req, res) => {
  upload.single('inputImage')(req, res, async (err) => {
    console.log(req.body.inputFirstName);
    console.log(req.body.inputLastName);
    console.log(req.body.inputInterests);
    console.log(req.body.inputState);
    console.log(req.file);
    //console.log(req.file.path);
    //const file = req.file;
    //if (!file) {
    //  const error = new Error('Please upload a file');
    //  error.httpStatusCode = 400;
    //  return next(error);
    //}

    //var rand = Math.floor(Math.random() * 1000);
    //const newProfile = new Profile({
    //  email: 'test' + rand + '@mail.com',
    //  password: 'testing',
    //  firstname: req.body.inputFirstName,
    //  lastname: req.body.inputLastName,
    //  image: fs.readFileSync(req.file.path),
    //  interests: req.body.inputInterests,
    //  state: req.body.inputState
    //});

    if (req.file && req.file.path) {
      Profile.Model.findOneAndUpdate({
        'email': req.session.user.email
      }, {
        firstname: req.body.inputFirstName,
        lastname: req.body.inputLastName,
        image: fs.readFileSync(req.file.path),
        interests: req.body.inputInterests,
        state: req.body.inputState
      }, {
        runValidators: true,
        useFindAndModify: false
      }, (err, profile) => {
        if (err) {
          throw err;
        }

        //console.log(profile);
        res.redirect('/account/profile');
      });
    } else {
      Profile.Model.findOneAndUpdate({
        'email': req.session.user.email
      }, {
        firstname: req.body.inputFirstName,
        lastname: req.body.inputLastName,
        interests: req.body.inputInterests,
        state: req.body.inputState
      }, {
        runValidators: true,
        useFindAndModify: false
      }, (err, profile) => {
        if (err) {
          throw err;
        }

        //console.log(profile);
        res.redirect('/account/profile');
      });
    }

    //var err = newProfile.validateSync();
    //if (err) {
    //  console.log(err);
    //} else {
    //  newProfile.save((err) => {
    //    if (err) {
    //      console.log(err);
    //      return;
    //    }

    //    console.log('SAVED');
    //  });
    //}

    //await unlinkAsync(req.file.path);
  });
};

exports.profile = (req, res) => {
  if (req.method === 'POST') {
    console.log('Saving profile');
    console.log(req.body);
  }

  console.log(req.session.user);

  res.render('profile2', {
    title: 'Profile2',
    states: USAStates,
    firstName: 'TEST',
    lastName: 'TEST',
    interests: 'TEST',
    stateCode: 'TEST'
  });
  return;

  Profile.Model.findOne({
    'email': req.session.user.email
  }, (err, profile) => {
    if (err) {
      throw err;
    }

    res.render('profile2', {
      title: 'Profile2',
      states: USAStates,
      firstName: profile.firstname,
      lastName: profile.lastname,
      interests: profile.interests,
      stateCode: profile.state
    });
  });
};

exports.image = (req, res) => {
  Profile.Model.findOne({
    'email': req.session.user.email
  }, (err, profile) => {
    if (err) {
      throw err;
    }

    res.send(profile.image);
  });
};

exports.logout = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    delete req.session.user
    res.redirect('/');
  } else {
    res.redirect('/account/login');
  }
};
