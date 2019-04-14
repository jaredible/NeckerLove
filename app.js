const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const colors = require('colors');

const indexRouter = require('./routes/index');
const accountRouter = require('./routes/account');

const app = express();

// https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
if (app.get('env') === 'production') {
  mongoose.connect('mongodb+srv://matchMaker:p%40ssw0rd@neckerlove-gen0b.mongodb.net/mean?retryWrites=true', {
    useNewUrlParser: true,
    useCreateIndex: true
  });
} else {
  mongoose.connect('mongodb://localhost:27017/mean?retryWrites=true', {
    auth: {
      user: 'matchMaker',
      password: 'p@ssw0rd'
    },
    useNewUrlParser: true,
    useCreateIndex: true
  });
}
mongoose.connection.once('open', function() {
  console.log('Connected to MongoDB!'.green);
});

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
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 10 * 60 * 1000, // 10 * 60 * 1 second = 10 minutes
    secure: false // TODO
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

app.post('/test', (req, res) => {
  res.send(200);
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
      title: 'Error',
      message: err.message,
      error: err
    });
  });
} else {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      title: 'Error',
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
