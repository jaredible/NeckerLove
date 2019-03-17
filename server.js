const http = require('http');
const qs = require('querystring');
const fs = require('fs');
const path = require('path');
const url = require('url');
const process = require('process');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const config = require('./config.json');

const ROOT_DIR = config.ROOT_DIR || 'views';
const PORT = process.env.port || config.PORT || 8080;
const HOST = process.env.host || 'localhost';
const ENV = process.env.NODE_ENV || 'development';

var MONGO_URL = "mongodb://localhost/mean";
var MONGO_USERNAME = "matchMaker";
var MONGO_PASSWORD = "p@ssw0rd";

try {
  var private = require('./private.json');
  MONGO_URL = private.MONGO_URL;
  MONGO_USERNAME = private.MONGO_USERNAME;
  MONGO_PASSWORD = private.MONGO_PASSWORD;
} catch (e) {
  console.log(e);
}

mongoose.connect(MONGO_URL, {
  auth: {
    user: MONGO_USERNAME,
    password: MONGO_PASSWORD
  },
  useNewUrlParser: true
});
mongoose.set('useCreateIndex', true);
const meanSchema = require('./mean_schema.js').meanSchema;
const User = mongoose.model('User', meanSchema);

mongoose.connection.once('open', function() {
  console.log("Open connection!");
});

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

var server = http.createServer(function (request, response) {
  if (request.method == 'GET') {
    console.log('GET request', request.url);

    var urlObj = url.parse(request.url, true, false);

    // TODO: favicon.ico
    var filePath = '.';
    switch (urlObj.pathname) {
      case '/':
      case '/index':
        filePath += '/index.html';
        break;
      case '/find':
        filePath += '/find.html'
        break;
      case '/profile':
        filePath += '/profile.html';
        break;
      case '/register':
        filePath += '/register.html';
        break;
      case '/login':
        filePath += '/login.html';
        break;
      default:
        filePath += urlObj.pathname;
        break;
    }

    console.log(filePath);

    var extname = String(path.extname(filePath)).toLowerCase();
    switch (extname) {
      case '.html':
        filePath = insert(filePath, 1, path.join('/', ROOT_DIR));
        break;
      case '.js':
      case '.css':
      case '.png':
      case '.jpg':
      case '.gif':
        filePath = insert(filePath, 1, '/public');
        break;
      default:
        break;
    }

    var mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code == 'ENOENT') {
          fs.readFile('./' + ROOT_DIR + '/404.html', (error, content) => {
            response.writeHead(200, {
              'Content-Type': contentType
            });
            response.end(content, 'UTF-8');
          });
        } else {
          response.writeHead(500);
          response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
        }
      } else {
        response.writeHead(200, {
          'Content-Type': contentType
        });
        response.end(content, 'UTF-8');
      }
    });
  } else if (request.method == 'POST') {
    console.log('POST request', request.url);

    var form = new formidable.IncomingForm();

    form.parse(request);

    form.on('file', function (name, file) {
      console.log('File incoming ' + file.name);
    });

    form.on('error', function (err) {
      console.log('An error has occured: \n' + err);
    });

    form.on('end', function () {
      console.log('end');
    });

    response.writeHead(200);
    response.end('test');

    var body = '';

    request.on('data', function(data) {
      body += data;

      if (body.length > 1e6) {
        request.connection.destroy();
        mongoose.disconnect();
      }
    });

    request.on('end', function() {
      var urlObj = url.parse(request.url, true, false);

      switch (urlObj.pathname) {
        case '/':
        case '/index':
          break;
        case '/find':
          break;
        case '/profile':
          var post = qs.parse(body);
          //console.log(post);



          console.log('here');

          response.writeHead(200);
          response.end('test');

          break;
        case '/register':
          var post = qs.parse(body);

          var username = post.registrationUsername;
          var password = post.registrationPassword;

          bcrypt.hash(password, 10, function(err, hash) {
            var newUser = new User({
              userName: username,
              password: hash
            });

            newUser.save({}, function(err, doc) {
              if (err) {
                console.log(err);
                response.writeHead(200);
                response.end(JSON.stringify({
                  status: 2
                }));
              } else {
                console.log('Saved document: ' + doc);
                response.writeHead(200);
                response.end(JSON.stringify({
                  status: 1
                }));
              }
            });
          });

          break;
        case '/login':
          var post = qs.parse(body);

          var username = post.loginUsername;
          var password = post.loginPassword;

          if (username) {
            User.findOne({
              userName: username
            }, function(err, doc) {
              if (err) throw err;

              if (doc) {
                bcrypt.compare(password, doc.password, function(err, res) {
                  if (err) throw err;

                  if (res) {
                    response.writeHead(200);
                    response.end(JSON.stringify({
                      status: 1
                    }));
                  } else {
                    response.writeHead(200);
                    response.end(JSON.stringify({
                      status: 2
                    }));
                  }
                });
              }
            });
          }

          break;
        case '/getUsernameStatus':
          post = JSON.parse(body);

          var username = post.userName;

          if (username) {
            User.findOne({
              userName: username
            }, function(err, doc) {
              if (doc || err) {
                response.writeHead(200);
                response.end(JSON.stringify({
                  status: 2
                }));
              } else {
                response.writeHead(200);
                response.end(JSON.stringify({
                  status: 1
                }));
              }
            });
          }

          break;
        default:
          break;
      }
    });
  }
});

function hasEmailFormat(value) {
  return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{1,5})$/.test(value);
}

server.listen(PORT, HOST);
console.log(`${ENV.charAt(0).toUpperCase() + ENV.substring(1)} app listening at http://${HOST}:${PORT}`);
