import { controller, get, post } from 'koa-dec-router'

async function apiHandler(ctx, next) {
  console.log('handle all api and subclass\'s')
  await next()
}

// @controller('/api', apiHandler)
export default class Api {
  async getApiCommon(ctx) {
    console.log("common");
    // ...
    return // some common data
  }
}
