// import { ui, router as swaggerRouter, Router } from 'swagger2-koa';
import { ui, router as swaggerRouter, Router } from 'swagger2-koa';
// let swagger = require('swagger2-koa');
// let swaggerRouter = swagger.ui;
// let Router = swagger.router;
// let swaggerRouter = require('swagger2-koa').router;
console.log(Router);
let router = swaggerRouter(__dirname + '/swagger.yml');
router.get('/ping', async(context) => {
  context.status = 200;
  context.body = {
    serverTime: new Date().toISOString()
  };
});

// router.app().listen(3000);
router.app().listen(3000);
