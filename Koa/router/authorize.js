function authentication(ctx, next) {

  const start = new Date();
  console.log(ctx.path);
  if (ctx.session && ctx.session.username) {
    return next().then();
  } else {
    // ctx.redirect('');
    return next().then();
  }
  // return next().then();
  // if (ctx.path == '/login' || ctx.path == '/register' || ctx.path == '/logout' ||
  //   (/^\/admin\/*/.test(ctx.path))) {
  //   console.log(ctx.path);
  //   return next().then();
  // }
  // if (ctx.session.user) {
  //   // ctx.redirect('/admin/index.html');
  //   return next().then();
  // } else {
  //   ctx.redirect('/login');
  //   // return next().then(() => {
  //   //   const ms = new Date() - start;
  //   //   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  //   // });
  // }


}

module.exports = authentication;
