/**
 * Created by chinghsu on 16/9/16.
 */
var http = require('http');
var queryString = require('querystring');

http.createServer(function (request, response) {
   var postData = '';
   request.setEncoding('utf8');
   request.on('data', function (chunk) {
      postData += chunk;
   });

   request.on('end', function () {
      response.end(postData);
   });

   // response.writeHead(200, {"Content-Type": "text/plain"});
   // response.write("Hello World");
   // response.end();
}).listen(8999);

//# sourceMappingURL=serverSimple-compiled.js.map