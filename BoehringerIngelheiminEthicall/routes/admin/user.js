/**
 * Created by chinghsu on 16/11/16.
 */
var bcrypt = require('bcrypt');
var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var userSchema = new Schema({
    username: String,
    password: String,
    salt: String
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
// var db = mongoose.connect('mongodb://localhost:27017/ethicall');
// var userTask = mongoose.model('user', userSchema); //	与users集合关联

function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.register = function (fn) {
    var user = this;
    user.hasPassword(function (err) {
        if (err) return fn(err);
        user.save(fn);
    });
};

User.prototype.save = function (fn) {
    var db = mongoose.connect('mongodb://localhost:27017/ethicall');
    var userModel = db.model('user', userSchema);
    var userEntity = new userModel(this);
    userEntity.save(function (err) {
        if (err) throw err;
        console.log("Task saved");
        fn(err);
    });
    mongoose.disconnect();
};

User.prototype.hasPassword = function (fn) {
    var user = this;
    bcrypt.genSalt(12, function (err, salt) {
        if (err) {
            return fn(err);
        } else {
            user.salt = salt;
            bcrypt.hash(user.password, salt, function (err,hash) {
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


User.getByName = function (name, fn) {
    User.getId(name, function (err, obj) {
        if (err) return fn(err);
        User.get(obj, fn);
    })
};

User.getId = function (name, fn) {
    var db = mongoose.connect('mongodb://localhost:27017/ethicall');
    var userTask = mongoose.model('user', userSchema); //	与users集合关联
    userTask.findOne({'username': name}, fn);
    mongoose.disconnect();
};

User.get = function (obj, fn) {
    if (obj) {
        fn(null, new User({
            "id": obj._id,
            "username": obj.username,
            "password": obj.password
        }));
    } else {
        return fn(null,{});
    }
};
//
// User.authenticate = function (name,pass,fn) {
//     User.getByName(name,function(err,user){
//         if(err) return fn(err);
//         if(!user.id) return fn();
//         bcrypt.hash(pass,user.salt,function(err,hash){
//             if(err) return fn(err);
//             if(hash==user.pass) return fn(null,user);
//             fn();
//         });
//     });
// };
User.submit = function (req, res, next) {

};


module.exports = User;