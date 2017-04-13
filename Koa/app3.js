var koa = require('koa');
var app = new koa();

// x-response-time

app.use(function*(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
  console.log('start');
});

// logger

app.use(function*(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.use(function*() {
  console.log("aa");
  this.body = 'Hello World';
});

app.listen(3000);
