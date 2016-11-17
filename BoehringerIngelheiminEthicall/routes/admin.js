/**
 * Created by chinghsu on 16/11/16.
 */
var express = require('express');
var userRouter = express.Router();
var login = require('./admin/login');
var logout = require('./admin/logout');
var register = require('./admin/register');

/* GET users listing. */
// 该路由使用的中间件

// userRouter.get('/login', login);
// userRouter.get('/logout', logout);
userRouter.post('/register', register);

module.exports = userRouter;
