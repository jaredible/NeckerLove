const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressSession = require('express-session');

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');

// https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
mongoose.connect('mongodb+srv://matchMaker:p%40ssw0rd@neckerlove-gen0b.mongodb.net/mean?retryWrites=true', {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.connection.once('open', function() {
  console.log('Connected to MongoDB!');

  var Profile = require('./models/profile');
  var rand = Math.floor(Math.random() * 1000);
  const newProfile = new Profile({
    email: 'test' + rand + '@mail.com',
    password: 'testing',
    firstname: 'John',
    lastname: 'Doe',
    interests: 'cubes,chess',
    state: 'MO'
  });

  //var err = newProfile.validateSync();
  //if (err) {
  //  console.log(err);
  //} else {
  //  newProfile.save((err) => {
  //    if (err) {
  //      console.log(err);
  //      return;
  //    }
  //
  //    console.log('SAVED');
  //  });
  //}
});

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  key: 'user_sid',
  secret: 'rubikscube',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 10 * 60 * 1000 // 10 * 60 * 1 second = 10 minutes
  }
}));

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

app.use('/', indexRouter);
app.use('/account', accountRouter);

// Testing
const multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({
  storage: storage
});

app.post('/imageupload', upload.single('image'), (req, res) => {
  console.log(req.body);
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  }
  res.redirect('/');
});

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
