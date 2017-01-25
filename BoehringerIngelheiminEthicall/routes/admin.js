/**
 * Created by chinghsu on 16/11/16.
 */
var express = require('express');
var userRouter = express.Router();
var login = require('./admin/login');
var logout = require('./admin/logout');
var register = require('./admin/register');
var modify = require('./admin/modify');


/* GET users listing. */
// 该路由使用的中间件
//
// userRouter.post('/register', register);
// userRouter.route('/modify').get(function (req, res, next) {
//     res.render('modify.ejs', {name: 'BIEthicall'});
// }).post(modify);
userRouter.route('/modify').get(function (req, res, next) {
    next();
}).post(modify);
// userRouter.use('/login',function(req, res, next){
//     if(req.session.username){
//         res.redirect("/home");
//     }else{
//         next();
//     }
// });
userRouter.route('/login').get(function (req, res, next) {
    if (req.session.username) {
        res.redirect("/home");
    } else {
        res.render('login.ejs', {name: "BIEthicall"});
    }
}).post(login);
userRouter.get('/logout', logout);

userRouter.get('/', function (req, res, next) {
    next();
}, function (req, res, next) {
    res.redirect("/admin/login");
    res.end();
});


module.exports = userRouter;
