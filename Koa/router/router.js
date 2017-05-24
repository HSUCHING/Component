const router = require('koa-router')();
const admin = require('../middlewares/admin');

router
  .get('/', function*(next) {
    this.redirect('/index.html');
  })
  // .get('/register', function*(next) {
  //   this.redirect('/index.html');
  //   // this.redirect("back");
  // })
  .post('/register', function*(next) {
    if (this.session.user) {
      this.redirect('/index.html');
    } else {
      admin.register(this, next);
    }
    // yield next;
  })
  // .get('/login', function*(next) {
  //   if (this.session.user) {
  //     this.redirect('/index.html');
  //   } else {
  //     this.redirect('/index.html');
  //   }
  // })
  .post('/login', function*(next) {
    var self = this;
    yield new Promise(admin.login(self, next))
      .then((data) => {
        if (data) {
          self.body = data;
        }
      })
      .catch(() => {
        console.log('Promise rejected.');
      });
  })
  // .post('/login', function*(next) {
  //   yield new Promise((resolve, reject) => {
  //     // this.mongo.collection('users').findOne({
  //     //   'username': this.request.body.username
  //     // }, (err, doc) => {
  //     //   if (doc) {
  //     //     resolve(doc)
  //     //   } else {
  //     //     reject()
  //     //   };
  //     // });
  //     resolve({aa:"aa"})
  //   }).then((doc) => {
  //     if (doc) {
  //       console.log('Promise: ' + doc);
  //       this.body = {
  //         username: doc
  //       };
  //     };
  //   }).catch(() => {
  //     console.log('Promise rejected.');
  //   });
  //   // admin.login(this, next);
  // })
  .post('/update', function*(next) {
    admin.update(this, next);
  })
  // .get('/home', function*(next) {
  //   if (this.session.user) {
  //     this.redirect('/index.html');
  //   } else {
  //     this.redirect('/index.html');
  //   }
  // })
  .get('/*', function*(next) {
    // this.redirect('/home');
    this.redirect('/index.html');
  });
// .post('/users', function*(next) {
//   // ...
// })
// .put('/users/:id', function*(next) {
//   // ...
// })
// .del('/users/:id', function*(next) {
//   // ...
// });



router
  .get('/logout', function*(next) {
    this.session.user = null;
    return this.redirect('/');
  })
  .post('/logout', function*(next) {
    // const result = yield {
    //   logout: "logout"
    // };
    // this.body = result;
  });


module.exports = router;
