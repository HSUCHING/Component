// var http = require("http");

import http from 'http'

http.createServer(function(request, response) {

  response.writeHead(200, {"Content-Type": "text/plain"});

  response.write("Hello World");
  response.end();

}).listen(8888);
