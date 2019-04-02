exports.login = (req, res) => {
  var email = '';

  if (req.method === 'POST') {
    email = req.body.inputEmail;

    req.check('inputEmail', 'Invalid email address.').isLength({
      min: 8
    });
    req.check('inputPassword', 'Password is invalid.').isLength({
      min: 4
    });

    var errors = req.validationErrors();
    if (!errors) {
      req.session.user = {
        email: req.body.email
      };

      res.redirect('/');
      return;
    }
  }

  res.render('login2', {
    title: 'Login2',
    email: email
  });
};

exports.register = (req, res) => {
  res.render('register', {
    title: 'Register'
  });
};

exports.profile = (req, res) => {
  res.render('profile', {
    title: 'Profile'
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
