const User = require('./../models/user');

let admin = {};


admin.login = (ctx, next) => {
  let userInfo = ctx.request.body.user;
  return function(resolve, reject) {
    User.authenticate(userInfo.name, userInfo.psw, function(err, user) {
      if (err) {
        ctx.status = 404;
        reject(err);
      } else {
        if (!user) {
          // ctx.redirect('/login');
        } else {
          ctx.session.username = user.name;
          // ctx.redirect('/home');
          // ctx.body = user;
          resolve(user);
        }
      }
    });
  };

}


admin.register = (ctx, next) => {
  let userInfo = ctx.request.body.user;
  // let username = ctx.request.body.user.name;
  // let psw = ctx.request.body.user.psw;

  // user.register(username, function(err, user) {
  //   if (err) {
  //     ctx.status = 404;
  //   } else {
  //     if (user) {
  //       ctx.session.username = user.name;
  //       ctx.redirect('/home');
  //     }
  //   }
  // });
  User.getByName(userInfo.name, function(err, user) {
    if (err) {
      ctx.status = 404;
    }

    if (user.id) {
      console.log("Username already taken!");
    } else {
      let userInstance = new User({
        username: userInfo.name,
        password: userInfo.psw,
        views: {
          allowed: [1, 2, 3]
        }
      });
      userInstance.register(function(err) {
        if (err) {
          // yield next;
        }
        ctx.session.username = userInfo.name;
        ctx.redirect('/home');
      })
    }
  });
}

admin.update = (ctx, next) => {
  // let username = ctx.request.body.user.name;
  let updateData = {
    username: "admin",
    views: {
      allowed: [4, 5, 7, 9]
    }
  };
  User.update(updateData, function(err, user) {
    if (err) {
      ctx.status = 404;
    } else {
      // if (user) {
      //   ctx.session.username = user.name;
      //   ctx.redirect('/home');
      // }
    }
  });
}



// admin.logout() {
//
// }
//
// admin.reset() {
//
// }


//
// if (usrObj) {
//     req.session.uid = user.id;
//     req.session.user = req.body.username;
//     console.log(req.session.user + "-=-=-=-=-=");
//     res.redirect('/');
// } else {
//     res.error("登录失败");
//     res.redirect('back');
// }

module.exports = admin;
