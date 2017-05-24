// 用户模型
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('../config');
const path = require('path');
const url = require('url');
let connect = mongoose.connect(config.mongodb + config.db);

let UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  home: {
    type: String
  }, // 个人主页
  github: {
    type: String
  }, // github
  avatar: {
    type: String
  }, // 头像
  score: {
    type: Number,
    default: 0
  }, // 用户积分
  signature: {
    type: String,
    default: ""
  }, // 个性签名
  topic_count: {
    type: Number,
    default: 0
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  province: [String],
  views: {
    type: mongoose.Schema.Types.Mixed,
    default: {

    }
  },
  perfenrence: {
    type: mongoose.Schema.Types.Mixed,
    default: {

    }
  },
  salt: {
    type: String
  }
});

function User(obj) {
  for (let key in obj) {
    this[key] = obj[key];
  }
}

User.prototype.register = function(fn) {
  let user = this;
  user.hasPassword(function(err) {
    if (err) return fn(err);
    user.save(fn);
  });
};

User.prototype.save = function(fn) {
  let userModel = mongoose.model('user', UserSchema);
  let userEntity = new userModel(this);
  userEntity.save(function(err) {
    if (err) throw err;
    console.log("Task saved");
    fn(err);
  });
};

User.prototype.modify = function(updateData, fn) {
  // let db = mongoose.connect(config.mongodb + config.db);
  let userModel = mongoose.model('user', UserSchema);

  let self = this;
  var query = {};
  // userModel.findOneAndUpdate(query, {
  //   $set: {
  //     name:
  //   }
  // }, {
  //   new: true
  // }, function(err, doc) {
  //   if (err) {
  //
  //   }
  //   console.log(doc);
  // });
  // bcrypt.hash(updateData.newPsw, this.salt, function(err, hash) {
  //   if (err) {
  //     return fn(err);
  //   } else {
  //     userModel.update({
  //       _id: self.id
  //     }, {
  //       $set: {
  //         password: hash
  //       }
  //     }, function(err) {
  //       if (err) {
  //         fn(err);
  //       } else {
  //         fn();
  //       }
  //       // mongoose.disconnect();
  //     });
  //   }
  // });
};


User.prototype.hasPassword = function(fn) {
  let user = this;
  // 初始密码
  bcrypt.genSalt(12, function(err, salt) {
    if (err) {
      return fn(err);
    } else {
      user.salt = salt;
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return fn(err);
        } else {
          user.password = hash;
          fn();
        }
      });
    }
  });
};

// User.getByName = function(name, fn) {
//   // let db = mongoose.connect(config.mongodb + config.db);
//   let userTask = mongoose.model('user', UserSchema); //	与users集合关联
//   userTask.findOne({
//     'username': name
//   }, function(error, obj) {
//     // mongoose.disconnect();
//     User.get(obj, fn);
//   });
// };
User.getByName = function(name, fn) {
  User.getId(name, function(err, obj) {
    if (err) return fn(err);
    User.get(obj, fn);
  });
};

User.getId = function(name, fn) {
  // var db = mongoose.connect(config.mongodb + config.db);
  let userTask = mongoose.model('user', UserSchema);
  userTask.findOne({
    'username': name
  }, function(err, obj) {
    fn(err, obj);
  });
}



User.get = function(obj, fn) {
  if (obj) {
    fn(null, new User({
      "id": obj._id,
      "name": obj.username,
      "password": obj.password,
      "views": obj.views,
      "email": obj.email,
      "salt": obj.salt
    }));
  } else {
    return fn(null, {});
  }
};

// 用户身份验证
User.authenticate = function(name, pass, fn) {
  User.getByName(name, function(err, user) {
    if (err) return fn(err);
    if (!user.id) return fn();
    bcrypt.hash(pass, user.salt, function(err, hash) {
      if (err) return fn(err);
      if (hash == user.password) return fn(null, user);
      fn();
    });
  });
};

// 用户身份验证 todo
User.register = function(name, fn) {
  User.getByName(name, function(err, user) {
    if (err) return fn(err);
    // if (!user.id) return fn();
    let newUser = new User({
      "username": name,
      "views": {
        allowed: [1, 2, 3]
      }
    });
    newUser.register(fn);
  });
};

// 用户身份验证 todo
User.update = function(updateData, fn) {
  let userModel = mongoose.model('user', UserSchema);

  let self = this;
  let updateObject = updateData;
  var query = {
    username: updateObject.username
  };
  userModel.findOneAndUpdate(query, {
    $set: updateObject
  }, {
    new: true
  }, function(err, doc) {
    if (err) {

    }
    console.log(doc);
  });
};



/**
 * password写入时加密
 */
// UserSchema.path('password').set(function(v) {
//     return crypto.createHash('md5').update(v).digest('base64');
// });

function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

module.exports = User;
