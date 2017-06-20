import Koa from 'koa';
import DecRouter from 'koa-dec-router';
const decRouter = DecRouter({
  controllersDir: `${__dirname}/controllers`,
  async before(ctx, next) {
    console.log("before");
    await next()
  },
  async after(ctx, next) {
    console.log("after");
    await next()
  }
})

const app = new Koa();
// decRouter.router: `koa-router` instance
app.use(decRouter.router.routes());
app.use(decRouter.router.allowedMethods());

const PORT = process.env.DEBUG_PORT || 3456
app.listen(PORT)
console.log('Listen at ', PORT)
