/**
 * Created by chinghsu on 16/11/18.
 */
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');
var authentication = require('./routes/authorize');
var admin = require('./routes/admin');
var home = require('./routes/home');


//set express.locals
app.locals.title = "BI";
app.locals.strftime = require("strftime");
app.use(cookieParser());
app.use(session({
    secret: setting.cookieSecret,
    store: new MongoStore({
        url: setting.mongodb + setting.db
    })
}));

//config express
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//config express middleware

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//仅开发环境使用
if (app.get("env") == "development") {
    app.use(function (req, res, next) {
        console.log('Time: ', Date.now());
        next();
    });
    console.log("development");
}

//访问控制

app.use(authentication);
app.use('/admin', admin);
app.use('/home', home);
app.use('/source',express.static('public'));
// app.get("/",function(req,res,next){
//     next();
// },function(req,res,next){
//     res.render('login.ejs', {name: 'BIEthicall'});
// });
app.use("*", function (req, res, next) {
    res.redirect("/home");
});


var server = app.listen(8899, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});