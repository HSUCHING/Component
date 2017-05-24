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
          resolve({
            error: "401",
            msg: "user error"
          });
        } else {
          ctx.session.username = user.name;
          // ctx.redirect('/home');
          // ctx.body = user;
          let responseData = {
            username: user.name,
            email: user.email,
            views: user.views,
            province: user.province
          }
          resolve(responseData);
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

  // dashboard: true, // DashBoard
  // pageData: true, // 页面数据
  // bisVisit: true, // 信使拜访数据汇总
  // bisTerminal: true, // 区域终端购进汇总
  // bisRepeat: true, // 区域重复购进汇总
  // bisDetail: true, // 信使关注详情
  // financialData: true, // 财务数据
  // setting: true // 设置

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
        province: [],
        views: {
          dashboard: true,
          pageData: true,
          bisVisit: true,
          bisTerminal: true,
          bisRepeat: true,
          bisDetail: true,
          financialData: true,
          setting: true
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
