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
  console.log("Connected to MongoDB at " + MONGO_URL);
});

var server = http.createServer(function(request, response) {
  var cookies = parseCookies(request.headers.cookie);
  //console.log(cookies);
  var activeUser = cookies.userName;
  console.log('Cookie: ' + activeUser);

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

    var urlObj = url.parse(request.url, true, false);

    switch (urlObj.pathname) {
      case "/profile":
        var form = new formidable.IncomingForm();

        form.parse(request, function(err, fields, files) {
          if (err) {
            response.writeHead(200);
            response.end(JSON.stringify({
              status: 2
            }));
            return;
          }

          //console.log(fields);

          User.findOne({
            userName: activeUser
          }).exec(function(err, doc) {
            if (err) {
              response.writeHead(200);
              response.end(JSON.stringify({
                status: 2
              }));
              return;
            }

            if (doc) {
              doc.firstName = fields.profileFirstName;
              if (doc.firstName) doc.firstName.trim();

              doc.lastName = fields.profileLastName;
              if (doc.lastName) doc.lastName.trim();

              doc.interests = fields.profileInterests;
              if (doc.interests) doc.interests.replace(/\s*,\s*/g, ',').trim();

              doc.state = fields.profileLocality;
              if (doc.state) doc.state.trim();

              doc.save();
            }
          });
        });

        form.onPart = function(part) {
          if (part.name === 'profileImage') {
            if (part.filename && part.filename.length > 0) {
              let fileBuffer;
              let chunks = [];
              let fileStream = part;
              fileStream.on('data', function(chunk) {
                chunks.push(chunk);
              });
              fileStream.once('end', function() {
                fileBuffer = Buffer.concat(chunks);

                User.findOne({
                  userName: activeUser
                }).exec(function(err, doc) {
                  if (err) {
                    response.writeHead(200);
                    response.end(JSON.stringify({
                      status: 2
                    }));
                    return;
                  }

                  if (doc) {
                    doc.profileImage = fileBuffer;
                    doc.save();
                  }
                });
              });
            }
          } else {
            form.handlePart(part);
          }
        }

        fs.readFile(ROOT_DIR + '/find.html', function(error, content) {
          if (error) {
            response.writeHead(404);
            response.end(JSON.stringify(error));
            return;
          }

          response.writeHead(200);
          response.end(content);
        });

        break;
      default:
        var body = '';

        request.on('data', function(data) {
          body += data;

          if (body.length > 1e6) {
            request.connection.destroy();
            mongoose.disconnect();
          }
        });

        request.on('end', function() {
          switch (urlObj.pathname) {
            case '/':
            case '/index':
              break;
            case '/find':
              var post = JSON.parse(body);

              //console.log(post);

              var regex = new RegExp(post.searchText, 'g');

              var query = {
                userName: {
                  $ne: activeUser
                }
              };

              if (post.searchOption === 1) {
                query.interests = regex;
              } else if (post.searchOption === 2) {
                query.state = regex;
              }

              User.find(query, {
                password: 0,
                profileImage: 0,
                __v: 0
              }, function(err, docs) {
                //console.log(docs);

                response.writeHead(200);
                response.end(JSON.stringify(docs));
              });

              break;
            case '/register':
              var post = qs.parse(body);

              var username = post.registrationUsername.trim();
              var password = post.registrationPassword.trim();

              bcrypt.hash(password, 10, function(err, hash) {
                var newUser = new User({
                  userName: username,
                  password: hash
                });

                newUser.save({}, function(err, doc) {
                  if (err) {
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
                        response.writeHead(200, {
                          'Set-Cookie': 'userName=' + username + '; expires=' + new Date(new Date().getTime() + (1 * 24 * 60 * 60 * 1000)).toUTCString()
                        });
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
              var post = JSON.parse(body);

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
            case "/getUserProfile":
              break;
            default:
              break;
          }
        });

        break;
    }
  }
});

function hasEmailFormat(value) {
  return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{1,5})$/.test(value);
}

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

function parseCookies(cookie) {
  if (cookie) {
    return cookie.split(';').reduce(
      function(prev, curr) {
        var m = / *([^=]+)=(.*)/.exec(curr);
        var key = m[1];
        var value = decodeURIComponent(m[2]);
        prev[key] = value;
        return prev;
      }, {}
    );
  } else {
    return {}
  }
}

server.listen(PORT, HOST);
console.log(`${ENV.charAt(0).toUpperCase() + ENV.substring(1)} app listening at http://${HOST}:${PORT}`);
