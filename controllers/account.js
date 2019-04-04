exports.login = (req, res) => {
  var email = '';

  console.log(req.body.inputRememberMe);

  if (req.method === 'POST') {
    email = req.body.inputEmail;

    req.check('inputEmail', 'Invalid email address.').isEmail();
    req.check('inputPassword', 'Password is invalid.').notEmpty();

    var errors = req.validationErrors();
    if (!errors) {
      req.session.user = {
        email: req.body.inputEmail
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

    req.check('inputEmail', 'Invalid email address.').isEmail();
    req.check('inputPassword', 'Password is invalid.').notEmpty();

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
  if (req.method === 'POST') {
    console.log(req.body);
  }

  res.render('profile2', {
    title: 'Profile2'
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
