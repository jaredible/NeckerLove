var http = require('http');
var qs = require('querystring');
var fs = require('fs');
var path = require('path');
var url = require('url');
var process = require('process');

const PORT = process.env.port || 8069;
const HOST = process.env.host || 'localhost';
const ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/mean', {
  useNewUrlParser: true
});
//auth: {
//  user: 'matchMaker',
//  password: 'p@ssw0rd'
//},
var Schema = mongoose.Schema;
var profileSchema = new Schema({
  userName: {
    type: String,
    required: true,
    max: 50
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
});
var Profile = mongoose.model('Profile', profileSchema);

//var me = new Profile({
//  userName: "idc",
//  password: "Testing"
//});

//me.save((err, profile) => {
//  if (err) throw err;
//  console.log(profile);
//});

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

var server = http.createServer((request, response) => {
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
        filePath = insert(filePath, 1, '/views');
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
          fs.readFile('./views/404.html', (error, content) => {
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

    var urlObj = url.parse(request.url, true, false);

    switch (urlObj.pathname) {
      case '/':
      case '/index':
        console.log('home page');
        break;
      case '/find':
        console.log('finding');
        break;
      case '/profile':
        console.log('on profile');
        break;
      case '/register':
        var requestBody = '';
        request.on('data', (data) => {
          requestBody += data;
        });
        request.on('end', () => {
          var formData = qs.parse(requestBody);

          var username = formData.registrationUsername;
          var password = formData.registrationPassword;

          var validUsernameLength = username.length <= 50;
          var validUsernameHasEmailFormat = hasEmailFormat(username);
          var validUsername = username && validUsernameLength && validUsernameHasEmailFormat;

          if (validUsername) {
            Profile.find({
              userName: username
            }, (err, docs) => {
              checkUsernameExists(username, (error, exists) => {
                if (exists) {
                  sendJSON(response, {
                    usernameExists: true
                  });
                } else {
                  new Profile({
                    userName: username,
                    password: password
                  }).save((err, profile) => {
                    if (err) throw err;
                    sendJSON(response, {
                      successful: true
                    });
                  });
                }
              });
            });
          } else {
            sendJSON(response, {
              errors: {
                maxlength: validUsernameLength,
                hasEmailFormat: validUsernameHasEmailFormat
              }
            });
          }
        });

        break;
      case '/login':
        console.log('logging in');
        break;
      case '/getUsernameStatus':
        var requestBody = '';
        request.on('data', (data) => {
          requestBody += data;
        });
        request.on('end', () => {
          var bodyObj = JSON.parse(requestBody);

          var username = bodyObj.registrationUsername;

          if (username) {
            var validUsernameLength = username.length <= 50;
            var validUsernameHasEmailFormat = hasEmailFormat(username);
            var validUsername = username && validUsernameLength && validUsernameHasEmailFormat;

            if (validUsername) {
              if (checkUsernameExists(username, (error, exists) => {
                if (exists) {
                  sendJSON(response, {
                    available: false
                  });
                } else {
                  sendJSON(response, {
                    available: true
                  });
                }
              }));
            } else {
              sendJSON(response, {
                errors: []
              });
            }
          }
        });

        break;
      default:
        break;
    }
  }
});

function sendJSON(response, data) {
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify(data));
}

function checkUsernameExists(username, callback) {
  Profile.find({
    userName: username
  }, (err, docs) => {
    callback(err, docs.length);
  });
}

function hasEmailFormat(value) {
  return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{1,5})$/.test(value);
}

server.listen(PORT, HOST);
console.log(`${ENV.charAt(0).toUpperCase() + ENV.substring(1)} app listening at http://${HOST}:${PORT}`);
