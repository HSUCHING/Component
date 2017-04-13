const Koa = require('koa');
const co = require('co');
const app = new Koa();
const staticServe = require('koa-static');

app.use(staticServe('./static'));

// 基于co模板实现异步流程控制
// app.use(co.wrap(function*(ctx, next) {
//   try {
//     const start = new Date();
//     yield next();
//     const ms = new Date() - start;
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
//   } catch (err) {
//     ctx.body = {
//       message: err.message
//     };
//     ctx.status = err.status || 500;
//   }
// }))
// app.use(co.wrap(function*(ctx) {
//   ctx.body = 'Hello Koa';
// }))
app.listen(3000, () => console.log('server started， port 3000'));
module.exports = app;
