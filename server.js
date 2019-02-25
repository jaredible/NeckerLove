var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var process = require('process');

const PORT = process.env.port || 8069;
const HOST = process.env.host || 'localhost';
const ENV = process.env.NODE_ENV || 'development';

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

var server = http.createServer((request, response) => {
  console.log('request', request.url);

  var urlObj = url.parse(request.url, true, false);

  var filePath = '.';
  switch (urlObj.pathname) {
    case '/':
    case '/index':
      filePath += '/index.html';
      break;
    case '/register':
      filePath += '/register.html';
      break;
    case '/login':
      filePath += '/login.html';
      break;
    case '/profile':
      filePath += '/profile.html';
      break;
    case '/find':
      filePath += '/find.html'
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
});

server.listen(PORT, HOST);
console.log(`${ENV.charAt(0).toUpperCase() + ENV.substring(1)} app listening at http://${HOST}:${PORT}`);
