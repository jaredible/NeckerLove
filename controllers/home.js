const configHelper = require('../helpers/config');
const stringHelper = require('../helpers/string');

var Profile = require('../models/profile');

exports.get = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.render('search', {
      title: 'Search',
    });
  } else {
    res.render('index', {
      title: 'Home'
    });
  }
};

exports.post = (req, res) => {
  var query = {
    userName: {
      $ne: req.session.user.email
    }
  };

  var regex = new RegExp(req.body.searchQuery.replace(/\s*,\s*/g, '|'), 'gi');
  if (req.body.option.toLowerCase() === 'interests') {
    query.interests = regex;
  } else if (req.body.option.toLowerCase() === 'state') {
    query.state = regex;
  }

  Profile.findProfilesByQuery(query, {
    _id: 0,
    password: 0,
    profileImage: 0,
    __v: 0
  }).then((profiles) => {
    if (profiles) {
      profiles.forEach((profile) => {
        profile.firstName = stringHelper.toTitleCase(profile.firstName);
        profile.lastName = stringHelper.toTitleCase(profile.lastName);
        profile.interests = stringHelper.toTitleCase(profile.interests.replace(/\s*,\s*/g, ', '));
        profile.state = stringHelper.toTitleCase(configHelper.getStateNameByCode(profile.state))
      });
      res.json(profiles);
    }
  });
};
