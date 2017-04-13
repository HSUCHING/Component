// import babel from 'babel-core';
const Koa = require('koa');
const path = require('path');
const app = new Koa();
const content = require('./util/content');
const mimes = require('./util/mimes');

// app.use((ctx, next) => {
//   const start = new Date();
//   return next().then(() => {
//     const ms = new Date() - start;
//     console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
//   });
// });

const staticPath = './static';

function parseMime(url) {
  let extName = path.extname(url)
  extName = extName ? extName.slice(1) : 'unknown'
  return mimes[extName]
}

app.use(async(ctx, next) => {
  try {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  } catch (err) {
    ctx.body = {
      message: err.message
    }
    ctx.status = err.status || 500
  }
});

app.use(async(ctx) => {
  // 静态资源目录在本地的绝对路径
  let fullStaticPath = path.join(__dirname, staticPath)

  // 获取静态资源内容，有可能是文件内容，目录，或404
  let _content = await content(ctx, fullStaticPath)

  // 解析请求内容的类型
  let _mime = parseMime(ctx.url)

  // 如果有对应的文件类型，就配置上下文的类型
  if (_mime) {
    ctx.type = _mime
  }

  // 输出静态资源内容
  if (_mime && _mime.indexOf('image/') >= 0) {
    // 如果是图片，则用node原生res，输出二进制数据
    ctx.res.writeHead(200)
    ctx.res.write(_content, 'binary')
    ctx.res.end()
  } else {
    // 其他则输出文本
    ctx.body = _content
  }
});



// response
// app.use(ctx => {
//   console.log('response');
//   ctx.body = 'Hello Koa';
// });

app.listen(3000, () => console.log('server started， port 3000'))
module.exports = app
