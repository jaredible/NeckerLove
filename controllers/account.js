exports.login = (req, res) => {
  var email = '';

  if (req.method === 'POST') {
    email = req.body.inputEmail;

    req.check('inputEmail', 'Invalid email address.').isEmail().isLength({
      max: 50
    });
    req.check('inputPassword', 'Password is invalid.').not().isEmpty(); // ?

    var errors = req.validationErrors();
    if (!errors) {
      req.session.user = {
        email: req.body.email
      };

      res.redirect('/');
      return;
    }
  }

  res.render('login', {
    title: 'Login',
    email: email
  });
};

exports.register = (req, res) => {
  var email = '';

  if (req.method === 'POST') {
    email = req.body.inputEmail;

    req.check('inputEmail', 'Invalid email address.').isEmail().isLength({
      max: 50
    });
    req.check('inputPassword', 'Password is invalid.').not().isEmpty(); // ?

    var errors = req.validationErrors();
    if (!errors) {
      res.redirect('/account/login');
      return;
    }
  }

  res.render('register', {
    title: 'Register',
    email: email
  });
};

exports.profile = (req, res) => {
  res.render('profile2', {
    title: 'Profile',
    matches: [
      {
        name: "test",
        image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif'
      },
      {
        name: "test",
        image: 'https://static.spin.com/files/2019/03/GettyImages-1130598318-1554059636-640x401.jpg'
      },
      {
        name: "test",
        image: 'https://i.redd.it/us1zz2mnv9m21.gif'
      },
      {
        name: "test",
        image: 'https://static.spin.com/files/2019/03/GettyImages-1130598318-1554059636-640x401.jpg'
      },
      {
        name: "test",
        image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif'
      },
      {
        name: 'test',
        image: 'https://cdn-images-1.medium.com/max/1600/0*6JlKG-1uQK0kLh1V.gif'
      },
      {
        name: "test",
        image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif'
      },
      {
        name: "test",
        image: 'https://static.spin.com/files/2019/03/GettyImages-1130598318-1554059636-640x401.jpg'
      },
      {
        name: "test",
        image: 'https://i.redd.it/us1zz2mnv9m21.gif'
      },
      {
        name: "test",
        image: 'https://static.spin.com/files/2019/03/GettyImages-1130598318-1554059636-640x401.jpg'
      },
      {
        name: "test",
        image: 'https://media.giphy.com/media/2Y8Iq3xe121Ba3hUAM/giphy.gif'
      },
      {
        name: 'test',
        image: 'https://cdn-images-1.medium.com/max/1600/0*6JlKG-1uQK0kLh1V.gif'
      }
    ]
  });
};

exports.logout = (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie('user_sid');
    res.redirect('/');
  } else {
    res.redirect('/account/login');
  }
};
