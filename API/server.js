const Koa = require('koa');
const koaSwagger = require('koa2-swagger-ui');

const app = new Koa();

app.use(koaSwagger({
  routePrefix: '/swagger', // host at /swagger instead of default /docs
  swaggerOptions: {
    url: 'http://petstore.swagger.io/v2/swagger.json', // example path to json
  }
}));

app.listen(3000);
