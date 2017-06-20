import { toSwaggerDoc, ui, mixedValidate } from 'koa-joi-swagger'
import mixedDoc from './mixed-doc'
import Koa from 'koa'
import DecRouter from 'koa-dec-router'
import bodyparser from 'koa-bodyparser'

const app = new Koa();

const decRouter = DecRouter({
  controllersDir: `${__dirname}/controller`
});

app.use(bodyparser());

const swaggerDoc = toSwaggerDoc(mixedDoc)
// mount swagger ui in `/swagger`
app.use(ui(swaggerDoc, {
  pathRoot: '/swagger'
}))

// handle validation errors
app.use(async(ctx, next) => {
  try {
    await next()
  } catch (e) {
    if (e.name === 'RequestValidationError') {
      ctx.status = 400
      ctx.body = {
        code: 1,
        message: e.message,
        data: e.data
      }
    } else if (e.name === 'ResponseValidationError') {
      ctx.status = 500
      ctx.body = {
        code: 1,
        message: e.message,
        data: e.data
      }
    }
  }
})

// validate request and response by mixedDoc
app.use(mixedValidate(mixedDoc, {
  onError: e => console.log(e.details, e._object)
}))

// koa-dec-router
app.use(decRouter.router.routes())
app.use(decRouter.router.allowedMethods())

app.listen(3456)
