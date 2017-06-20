import { controller, get, post } from 'koa-dec-router'
import Api from './api'

async function postHandler(ctx, next) {
  console.log('handle post')
  await next()
}

// define multi controller class in one file. You can passing {expose: false} to disable exposing this controller, which can still be inherit.
@controller('/subpost')
export class Subpost {
  @get('s')
  async list(ctx) {
    ctx.body = 'get subpost'
  }

}

@controller('/post')
export default class Post extends Api {

  @get('s') // final path = parent controller path + controller path + method path
  async list(ctx) {
    const commonData = await super.getApiCommon()
    ctx.body = 'get posts'
  }

  @get('/:id', {
      priority: -1
    }) // wildcard using low priority, let `special` method handle first
  async get(ctx) {
    ctx.body = 'get' + ctx.params.id
  }

  @get('/special')
  async special(ctx) {
    ctx.body = 'special post'
  }
}
